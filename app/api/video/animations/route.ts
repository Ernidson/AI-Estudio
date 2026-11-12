import {getChatGPTUser} from '../../../chatgpt-auth';
import {getDb} from '../../../../db';
import {records} from '../../../../db/schema';
import {and,eq} from 'drizzle-orm';
import {customMotionSchema} from '../../../../lib/video/motion-schema';
export const dynamic='force-dynamic';
export async function GET(){const u=await getChatGPTUser();if(!u)return Response.json({error:'Sessão necessária.'},{status:401});try{const rows=await getDb().select().from(records).where(and(eq(records.owner,u.userId),eq(records.kind,'animation-preset')));return Response.json({presets:rows.map(r=>JSON.parse(r.data))})}catch{return Response.json({error:'Não foi possível carregar os presets.'},{status:503})}}
export async function POST(req:Request){const u=await getChatGPTUser();if(!u)return Response.json({error:'Sessão necessária.'},{status:401});try{const raw=await req.text();if(raw.length>150000)return Response.json({error:'Preset demasiado grande.'},{status:413});const p=customMotionSchema.parse(JSON.parse(raw)),db=getDb(),exists=(await db.select().from(records).where(eq(records.id,p.id)))[0];if(exists)return Response.json({error:'Guarde uma nova versão com outro identificador.'},{status:409});await db.insert(records).values({id:p.id,owner:u.userId,kind:'animation-preset',revision:1,data:JSON.stringify(p),updatedAt:new Date().toISOString()});return Response.json({preset:p},{status:201})}catch{return Response.json({error:'Preset inválido.'},{status:400})}}
