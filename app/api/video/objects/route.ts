import {getChatGPTUser} from '../../../chatgpt-auth';
import {getDb} from '../../../../db';
import {preparedObjects,videoAssets} from '../../../../db/schema';
import {and,eq} from 'drizzle-orm';
import {z} from 'zod';
import {objectSchema} from '../../../../lib/video/objects';
import {builtinAssets} from '../../../../lib/video/model';
export const dynamic='force-dynamic';
const response=(body:unknown,status=200)=>Response.json(body,{status,headers:{'Cache-Control':'no-store'}});
export async function GET(){const u=await getChatGPTUser();if(!u)return response({error:'Sessão necessária.'},401);try{const rows=await getDb().select().from(preparedObjects).where(eq(preparedObjects.owner,u.userId));return response({objects:rows.map(r=>({id:r.id,title:r.title,object:JSON.parse(r.data),updatedAt:r.updatedAt}))})}catch{return response({error:'Não foi possível carregar os objetos.'},503)}}
export async function POST(request:Request){const u=await getChatGPTUser();if(!u)return response({error:'Sessão necessária.'},401);try{if(!(request.headers.get('Content-Type')||'').startsWith('application/json'))return response({error:'Use JSON.'},415);const raw=await request.text();if(raw.length>12000)return response({error:'Objeto demasiado grande.'},413);const {title,object}=z.object({title:z.string().trim().min(1).max(160),object:objectSchema}).parse(JSON.parse(raw));const assets=await getDb().select().from(videoAssets).where(eq(videoAssets.owner,u.userId));if(![...assets,...builtinAssets].some(a=>a.id===object.assetId&&a.type==='image'))return response({error:'Imagem indisponível nesta conta.'},400);const id=crypto.randomUUID(),updatedAt=new Date().toISOString();await getDb().insert(preparedObjects).values({id,owner:u.userId,title,data:JSON.stringify(object),updatedAt});return response({object:{id,title,object,updatedAt}},201)}catch{return response({error:'Não foi possível guardar o objeto. Verifique os campos.'},400)}}
export async function DELETE(request:Request){const u=await getChatGPTUser();if(!u)return response({error:'Sessão necessária.'},401);try{const {id}=z.object({id:z.string().uuid()}).parse(await request.json());await getDb().delete(preparedObjects).where(and(eq(preparedObjects.id,id),eq(preparedObjects.owner,u.userId)));return response({ok:true})}catch{return response({error:'Não foi possível eliminar o objeto.'},400)}}
