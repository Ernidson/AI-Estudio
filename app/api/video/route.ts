import {vectorAssets} from '../../../lib/video/vector-kit';
import {getChatGPTUser} from '../../chatgpt-auth';
import {getDb} from '../../../db';
import {records,videoProjects,videoAssets} from '../../../db/schema';
import {and,eq} from 'drizzle-orm';
import {z} from 'zod';
import {rigResourceError} from '../../../lib/video/rig';
import {assetIds,builtinAssets,documentSchema} from '../../../lib/video/model';
export const dynamic='force-dynamic';
const response=(body:unknown,status=200)=>Response.json(body,{status,headers:{'Cache-Control':'no-store'}});
export async function GET(request:Request){
 const u=await getChatGPTUser();if(!u)return response({error:'Inicie sessão para abrir o estúdio.'},401);
 try{const db=getDb(),id=new URL(request.url).searchParams.get('id');if(id){const row=(await db.select().from(videoProjects).where(and(eq(videoProjects.id,id),eq(videoProjects.owner,u.userId))))[0];return row?response({project:{id:row.id,title:row.title,revision:row.revision,updatedAt:row.updatedAt,data:JSON.parse(row.data)}}):response({error:'Projeto não encontrado.'},404)}
 const [projects,assets]=await Promise.all([db.select({id:videoProjects.id,title:videoProjects.title,revision:videoProjects.revision,updatedAt:videoProjects.updatedAt}).from(videoProjects).where(eq(videoProjects.owner,u.userId)),db.select().from(videoAssets).where(eq(videoAssets.owner,u.userId))]);
 const metadata=await db.select().from(records).where(and(eq(records.owner,u.userId),eq(records.kind,'video-asset-meta')));const meta=new Map(metadata.map(m=>[m.id,JSON.parse(m.data)]));
 return response({projects,assets:assets.map(({key,owner,createdAt,...a})=>({...a,episode:meta.get(a.id)?.package==='EP01'?meta.get(a.id):undefined,characterSource:meta.get(a.id)?.package==='character-v1'?meta.get(a.id):undefined,url:`/api/video/assets/${a.id}`}))});
 }catch{return response({error:'Não foi possível carregar o estúdio de vídeos.'},503)}
}
const saveSchema=z.object({id:z.string().uuid(),title:z.string().trim().min(1).max(160),revision:z.number().int().positive().optional(),data:documentSchema});
export async function POST(request:Request){
 const u=await getChatGPTUser();if(!u)return response({error:'Sessão necessária.'},401);
 if(!(request.headers.get('Content-Type')||'').startsWith('application/json'))return response({error:'Use JSON para guardar o projeto.'},415);
 try{const raw=await request.text();if(raw.length>800000)return response({error:'Projeto demasiado grande (máximo 800 KB).'},413);const parsed=saveSchema.safeParse(JSON.parse(raw));if(!parsed.success)return response({error:parsed.error.issues[0]?.message||'Projeto inválido.'},400);
 const {id,title,data,revision}=parsed.data,db=getDb();const existing=(await db.select().from(videoProjects).where(eq(videoProjects.id,id)))[0];if(existing&&existing.owner!==u.userId)return response({error:'Sem acesso.'},403);
 if(data.linkedProjectId){const parent=(await db.select().from(records).where(and(eq(records.id,data.linkedProjectId),eq(records.owner,u.userId),eq(records.kind,'project'))))[0];if(!parent)return response({error:'O projeto associado já não está disponível.'},400)}
 const assets=await db.select().from(videoAssets).where(eq(videoAssets.owner,u.userId));const available=[...assets,...builtinAssets,...vectorAssets(data.vectorKits||[])];
 for(const ref of assetIds(data))if(!available.some(a=>a.id===ref))return response({error:'Um recurso não pertence à sua biblioteca ou já não existe.'},400);
 for(const track of data.tracks)for(const c of track.clips){if(c.rig){const invalid=rigResourceError(c.rig,available);if(invalid)return response({error:invalid},400);}const a=available.find(a=>a.id===c.assetId);if(a&&a.type!==c.type)return response({error:'Recurso incompatível com a faixa.'},400);if(c.poses.some(p=>available.find(a=>a.id===p.assetId)?.type!=='image'))return response({error:'As poses devem ser imagens.'},400);if(a&&a.type!=='image'&&c.offset+c.duration>a.duration+.15)return response({error:`O corte de «${c.name}» excede a duração do ficheiro.`},400)}
 const updatedAt=new Date().toISOString();if(existing){if(existing.revision!==revision)return response({error:'O projeto foi alterado noutra janela. Guarde uma cópia ou reabra a versão do servidor.',conflict:true},409);const updated=await db.update(videoProjects).set({title,data:JSON.stringify(data),revision:revision!+1,updatedAt}).where(and(eq(videoProjects.id,id),eq(videoProjects.owner,u.userId),eq(videoProjects.revision,revision!))).returning();if(!updated.length)return response({error:'Conflito de gravação. Guarde uma cópia.',conflict:true},409);return response({project:{id,title,data,revision:revision!+1,updatedAt}})}
 await db.insert(videoProjects).values({id,owner:u.userId,title,data:JSON.stringify(data),revision:1,updatedAt});return response({project:{id,title,data,revision:1,updatedAt}},201);
 }catch{return response({error:'Não foi possível guardar. As alterações continuam no editor.'},500)}
}
export async function DELETE(request:Request){const u=await getChatGPTUser();if(!u)return response({error:'Sessão necessária.'},401);try{const body=z.object({id:z.string().uuid()}).parse(await request.json());await getDb().delete(videoProjects).where(and(eq(videoProjects.id,body.id),eq(videoProjects.owner,u.userId)));return response({ok:true})}catch{return response({error:'Não foi possível eliminar o projeto de vídeo.'},400)}}
