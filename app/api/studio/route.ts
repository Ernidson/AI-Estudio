import { getChatGPTUser } from '../../chatgpt-auth';
import { getDb } from '../../../db';
import { records } from '../../../db/schema';
import { and, eq } from 'drizzle-orm';
import { z } from 'zod';
export const dynamic = 'force-dynamic';
const kinds = z.enum(['project','ebook','chapter','task','idea','image','post','product','profile']);
const schema = z.object({id:z.string().min(1).max(80),kind:kinds,revision:z.number().int().nonnegative().optional(),data:z.object({title:z.string().trim().min(1).max(160),status:z.enum(['Rascunho','Planeado','Em curso','Em revisão','Concluído']).optional(),progress:z.number().min(0).max(100).optional(),date:z.string().refine(v=>v===''||(/^\d{4}-\d{2}-\d{2}$/.test(v)&&!isNaN(Date.parse(v)))).optional(),priority:z.enum(['Baixa','Média','Alta']).optional(),done:z.boolean().optional(),category:z.string().max(120).optional(),audience:z.string().max(160).optional(),description:z.string().max(50000).optional(),projectId:z.string().max(80).optional(),color:z.enum(['purple','teal','peach']).optional(),author:z.string().max(160).optional()})});
export async function GET(){
 const user=await getChatGPTUser(); if(!user)return Response.json({error:'Inicie sessão para aceder aos seus dados.'},{status:401});
 try {const rows=await getDb().select().from(records).where(eq(records.owner,user.userId));return Response.json({records:rows.filter(r=>kinds.safeParse(r.kind).success).map(r=>({...r,data:JSON.parse(r.data)})),name:user.fullName||'O seu estúdio'});}catch{return Response.json({error:'Não foi possível carregar os dados. Tente novamente.'},{status:503});}
}
export async function POST(request:Request){
 const user=await getChatGPTUser();if(!user)return Response.json({error:'Sessão necessária.'},{status:401});
 try {
 const raw=await request.text();if(raw.length>200000)return Response.json({error:'O conteúdo excede o limite.'},{status:413});
 const parsed=schema.safeParse(JSON.parse(raw));if(!parsed.success)return Response.json({error:'Verifique os campos obrigatórios (título: até 160 caracteres).'}, {status:400});
 const {id,kind,data,revision}=parsed.data;const db=getDb();const existing=(await db.select().from(records).where(eq(records.id,id)))[0];
 if(existing&&existing.owner!==user.userId)return Response.json({error:'Sem acesso.'},{status:403});
 if(data.projectId){const parent=(await db.select().from(records).where(and(eq(records.id,data.projectId),eq(records.owner,user.userId),eq(records.kind,'project'))))[0];if(!parent)return Response.json({error:'Selecione um projeto válido.'},{status:400});}
 if(existing&&existing.kind!==kind)return Response.json({error:'Tipo de registo inválido.'},{status:400});
 const updatedAt=new Date().toISOString();
 if(existing){if(revision!==existing.revision)return Response.json({error:'Este registo foi alterado noutra janela. Atualize a página antes de editar.'},{status:409});const result=await db.update(records).set({data:JSON.stringify(data),revision:existing.revision+1,updatedAt}).where(and(eq(records.id,id),eq(records.owner,user.userId),eq(records.revision,revision))).returning();if(!result.length)return Response.json({error:'Conflito de edição. Atualize a página.'},{status:409});return Response.json({...result[0],data});}
 const row={id,owner:user.userId,kind,data:JSON.stringify(data),revision:1,updatedAt};await db.insert(records).values(row);return Response.json({...row,data},{status:201});
 }catch{return Response.json({error:'Não foi possível guardar. Os dados introduzidos continuam no formulário.'},{status:500});}
}
export async function DELETE(request:Request){
 const user=await getChatGPTUser();if(!user)return Response.json({error:'Sessão necessária.'},{status:401});
 try {const {id}=await request.json() as {id?:unknown};if(typeof id!=='string')return Response.json({error:'Registo inválido.'},{status:400});const db=getDb();const all=await db.select().from(records).where(eq(records.owner,user.userId));if(all.some(r=>JSON.parse(r.data).projectId===id))return Response.json({error:'Remova a associação dos ebooks e tarefas antes de eliminar este projeto.'},{status:409});await db.delete(records).where(and(eq(records.id,id),eq(records.owner,user.userId)));return Response.json({ok:true});}catch{return Response.json({error:'Não foi possível eliminar.'},{status:500});}
}
