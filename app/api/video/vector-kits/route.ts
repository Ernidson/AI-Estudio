import {getChatGPTUser} from '../../../chatgpt-auth';
import {getDb} from '../../../../db';
import {records} from '../../../../db/schema';
import {and,eq} from 'drizzle-orm';
import {vectorKitSchema} from '../../../../lib/video/vector-kit';
export const dynamic='force-dynamic';
export async function GET(){const u=await getChatGPTUser();if(!u)return Response.json({error:'Sessão necessária.'},{status:401});try{const rows=await getDb().select().from(records).where(and(eq(records.owner,u.userId),eq(records.kind,'vector-kit')));return Response.json({kits:rows.map(r=>JSON.parse(r.data))})}catch{return Response.json({error:'Não foi possível carregar os conjuntos vetoriais.'},{status:503})}}
export async function POST(req:Request){const u=await getChatGPTUser();if(!u)return Response.json({error:'Sessão necessária.'},{status:401});try{const raw=await req.text();if(raw.length>150000)return Response.json({error:'Conjunto demasiado grande.'},{status:413});const p=vectorKitSchema.parse(JSON.parse(raw)),db=getDb(),exists=(await db.select().from(records).where(eq(records.id,p.id)))[0];if(exists)return Response.json({error:'Guarde uma nova versão com outro identificador.'},{status:409});await db.insert(records).values({id:p.id,owner:u.userId,kind:'vector-kit',revision:1,data:JSON.stringify(p),updatedAt:new Date().toISOString()});return Response.json({kit:p},{status:201})}catch{return Response.json({error:'Conjunto vetorial inválido.'},{status:400})}}
