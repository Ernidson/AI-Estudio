import {env} from 'cloudflare:workers';
import {getChatGPTUser} from '../../../../chatgpt-auth';
import {getDb} from '../../../../../db';
import {videoAssets,videoProjects,preparedCharacters,preparedObjects} from '../../../../../db/schema';
import {and,eq} from 'drizzle-orm';
import {assetIds} from '../../../../../lib/video/model';
import {rigAssetIds} from '../../../../../lib/video/rig';
import {parseRange} from '../../../../../lib/video/range';
import {z} from 'zod';
export const dynamic='force-dynamic';
async function find(id:string,owner:string){return(await getDb().select().from(videoAssets).where(and(eq(videoAssets.id,id),eq(videoAssets.owner,owner))))[0]}
export async function GET(request:Request,{params}:{params:Promise<{id:string}>}){
 const u=await getChatGPTUser();if(!u)return new Response('Sessão necessária.',{status:401});
 try{const {id}=await params,a=await find(id,u.userId);if(!a||!env.BUCKET)return new Response('Recurso não encontrado.',{status:404});
 const range=parseRange(request.headers.get('Range'),a.size);if(range==='invalid')return new Response(null,{status:416,headers:{'Content-Range':`bytes */${a.size}`}});
 const object=await env.BUCKET.get(a.key,range?{range}:undefined);if(!object)return new Response('Ficheiro indisponível.',{status:404});
 return new Response(object.body,{status:range?206:200,headers:{'Content-Type':a.mime,'Content-Length':String(range?range.length:a.size),'Accept-Ranges':'bytes','Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff',...(range?{'Content-Range':`bytes ${range.offset}-${range.offset+range.length-1}/${a.size}`}:{})}});
 }catch{return new Response('Não foi possível ler o recurso.',{status:503})}
}
export async function PATCH(request:Request,{params}:{params:Promise<{id:string}>}){const u=await getChatGPTUser();if(!u)return Response.json({error:'Sessão necessária.'},{status:401});try{const {id}=await params,patch=z.object({name:z.string().trim().min(1).max(160),group:z.string().max(80)}).parse(await request.json());const row=await getDb().update(videoAssets).set(patch).where(and(eq(videoAssets.id,id),eq(videoAssets.owner,u.userId))).returning();return row.length?Response.json({ok:true}):Response.json({error:'Recurso não encontrado.'},{status:404})}catch{return Response.json({error:'Dados inválidos.'},{status:400})}}
export async function DELETE(_request:Request,{params}:{params:Promise<{id:string}>}){
 const u=await getChatGPTUser();if(!u)return Response.json({error:'Sessão necessária.'},{status:401});
 try{const {id}=await params,a=await find(id,u.userId);if(!a)return Response.json({error:'Recurso não encontrado.'},{status:404});const projects=await getDb().select().from(videoProjects).where(eq(videoProjects.owner,u.userId));const objects=await getDb().select().from(preparedObjects).where(eq(preparedObjects.owner,u.userId));if(objects.some(p=>JSON.parse(p.data).assetId===id))return Response.json({error:'O recurso é usado por um objeto reutilizável. Elimine primeiro essa preparação.'},{status:409});const preparations=await getDb().select().from(preparedCharacters).where(eq(preparedCharacters.owner,u.userId));if(preparations.some(p=>rigAssetIds(JSON.parse(p.data)).includes(id)))return Response.json({error:'O recurso é usado por um personagem preparado. Elimine primeiro essa preparação da biblioteca.'},{status:409});if(projects.some(p=>assetIds(JSON.parse(p.data)).includes(id)))return Response.json({error:'O recurso está a ser usado num projeto guardado. Remova-o desse projeto antes de eliminar.'},{status:409});if(!env.BUCKET)return Response.json({error:'Armazenamento indisponível.'},{status:503});await env.BUCKET.delete(a.key);await getDb().delete(videoAssets).where(and(eq(videoAssets.id,id),eq(videoAssets.owner,u.userId)));return Response.json({ok:true})}catch{return Response.json({error:'Não foi possível eliminar o recurso.'},{status:500})}
}
