import {z} from 'zod';
const id=z.string().min(1).max(100),time=z.number().min(0).max(1500);
export const pinKeySchema=z.object({groundY:z.number().min(-200).max(300).optional(),soleOffset:z.number().min(-4096).max(4096).optional(),rotation:z.number().min(-720).max(720).optional(),animationId:z.string().max(100).optional(),time,enabled:z.boolean(),x:z.number().min(-200).max(300),y:z.number().min(-200).max(300),targetClipId:id.optional(),anchorId:id.optional()});
export const pinSchema=z.object({id,jointId:id,keys:z.array(pinKeySchema).max(80)});
export const attachmentKeySchema=z.object({interpolate:z.boolean().optional(),easing:z.enum(['linear','smooth','ease-in','ease-out']).optional(),animationId:z.string().max(100).optional(),time,enabled:z.boolean(),targetClipId:id,jointId:id,anchorId:id.optional(),offsetX:z.number().min(-2000).max(2000),offsetY:z.number().min(-2000).max(2000),rotation:z.number().min(-720).max(720),pivotX:z.number().min(0).max(100),pivotY:z.number().min(0).max(100),scale:z.number().min(.05).max(5).optional()});
export type PinKey=z.infer<typeof pinKeySchema>;
export type Pin=z.infer<typeof pinSchema>;
export type AttachmentKey=z.infer<typeof attachmentKeySchema>;
export function sceneLinkError(clips:{id:string;type:string;rig?:{joints:{id:string;parentId:string|null}[]};pins?:Pin[];attachmentKeys?:AttachmentKey[];anchors?:{id:string}[]}[]){
 const graph=new Map<string,string[]>();
 for(const c of clips){const dependencies:string[]=[];if(new Set((c.pins||[]).map(p=>p.jointId)).size!==(c.pins||[]).length)return 'Uma articulação só pode ter uma curva de fixação.';
  for(const p of c.pins||[]){const joint=c.rig?.joints.find(j=>j.id===p.jointId),parent=c.rig?.joints.find(j=>j.id===joint?.parentId);if(!joint||!parent?.parentId)return 'A fixação IK exige uma cadeia de dois ossos.';if(new Set(p.keys.map(k=>k.time)).size!==p.keys.length)return 'Pontos de fixação repetidos.';for(const k of p.keys){if(!k.enabled||!k.targetClipId)continue;const target=clips.find(t=>t.id===k.targetClipId);if(!target||target.type!=='image'||!target.anchors?.some(a=>a.id===k.anchorId))return 'A fixação referencia um objeto ou ancoragem inexistente.';dependencies.push(target.id)}}
  if(new Set((c.attachmentKeys||[]).map(k=>k.time)).size!==(c.attachmentKeys||[]).length)return 'Pontos de associação repetidos.';
  for(const k of c.attachmentKeys||[]){if(!k.enabled)continue;const target=clips.find(t=>t.id===k.targetClipId);if(!target||c.type!=='image'||c.rig||!(k.anchorId?target?.anchors?.some(a=>a.id===k.anchorId):target?.rig?.joints.some(j=>j.id===k.jointId)))return 'A associação referencia um personagem ou articulação inexistente.';dependencies.push(target.id)}graph.set(c.id,dependencies);
 }
 const visiting=new Set<string>(),done=new Set<string>();function visit(id:string):boolean{if(visiting.has(id))return true;if(done.has(id))return false;visiting.add(id);for(const next of graph.get(id)||[])if(visit(next))return true;visiting.delete(id);done.add(id);return false}for(const id of graph.keys())if(visit(id))return 'Não são permitidas associações circulares entre personagens e objetos.';return null;
}
