import {compensationSchema} from './residual-schema';
import {characterPreparationSchema} from './character-contract';
import {z} from 'zod';
const id=z.string().min(1).max(100);
export const jointKeySchema=z.object({time:z.number().min(0).max(1500),angle:z.number().min(-360).max(360),easing:z.enum(['linear','smooth','ease-in','ease-out']),animationId:z.string().max(100).optional()});
export const jointSchema=z.object({id,name:z.string().trim().min(1).max(80),parentId:id.nullable(),x:z.number().min(-8192).max(8192),y:z.number().min(-8192).max(8192),rotation:z.number().min(-360).max(360),min:z.number().min(-360).max(360),max:z.number().min(-360).max(360),keys:z.array(jointKeySchema).max(80)});
const point=z.object({x:z.number().min(0).max(8192),y:z.number().min(0).max(8192)});
const variantCrop=z.object({x:z.number().min(0).max(8192),y:z.number().min(0).max(8192),width:z.number().min(1).max(8192),height:z.number().min(1).max(8192),polygon:z.array(point).max(40)});
export const partSchema=z.object({compensation:compensationSchema.optional(),variants:z.array(z.object({id:z.string().min(1).max(100),name:z.string().max(100),assetId:id,crop:variantCrop})).max(20).optional(),visualKeys:z.array(z.object({time:z.number().min(0).max(1500),variantId:z.string().max(100),animationId:z.string().max(100).optional()})).max(80).optional(),flipX:z.boolean().optional(),sourceCut:z.array(point).min(3).max(40).optional(),selectionPolygon:z.array(point).min(3).max(40).optional(),overlap:z.number().min(0).max(20).optional(),assisted:z.boolean().optional(),id,name:z.string().trim().min(1).max(80),jointId:id,assetId:id,crop:z.object({x:z.number().min(0).max(8192),y:z.number().min(0).max(8192),width:z.number().min(1).max(8192),height:z.number().min(1).max(8192),polygon:z.array(point).max(40)}),x:z.number().min(-8192).max(8192),y:z.number().min(-8192).max(8192),width:z.number().min(1).max(8192),height:z.number().min(1).max(8192),rotation:z.number().min(-360).max(360),opacity:z.number().min(0).max(1),hidden:z.boolean(),support:z.boolean().optional(),maskOut:z.array(z.array(point).min(3).max(40)).max(40).optional()});
export const rigSchema=z.object({residualReport:z.object({version:z.literal(1),samples:z.number().int().min(0).max(1000),corrected:z.number().int().min(0).max(1000),maxGapBefore:z.number().min(0),maxGapAfter:z.number().min(0),issues:z.array(z.string().max(400)).max(100)}).optional(),calibration:z.object({version:z.literal(1),frames:z.number().int().min(0).max(1000),silhouetteIoU:z.number().min(0).max(1),gaps:z.number().int().min(0),issues:z.array(z.string().max(400)).max(100),referenceAssetId:z.string().max(100)}).optional(),preparation:characterPreparationSchema.optional(),version:z.literal(1),roles:z.record(z.string().max(100)).optional(),templateKind:z.enum(['character','skeleton']).optional(),name:z.string().trim().min(1).max(160),sourceAssetId:id,width:z.number().int().min(1).max(4096),height:z.number().int().min(1).max(4096),enabled:z.boolean(),speed:z.number().min(.1).max(4),timeOffset:z.number().min(0).max(1500),joints:z.array(jointSchema).max(32),parts:z.array(partSchema).max(40)}).superRefine((r,ctx)=>{
 const ids=new Set<string>();for(const j of r.joints){if(ids.has(j.id))ctx.addIssue({code:'custom',message:'Articulação repetida.'});ids.add(j.id);if(j.min>j.max||j.rotation<j.min||j.rotation>j.max||j.keys.some(k=>k.angle<j.min||k.angle>j.max))ctx.addIssue({code:'custom',message:'Rotação fora dos limites da articulação.'});if(new Set(j.keys.map(k=>k.time)).size!==j.keys.length)ctx.addIssue({code:'custom',message:'Pontos-chave repetidos na articulação.'})}
 for(const j of r.joints){let current:typeof j|undefined=j;const seen=new Set<string>();while(current){if(seen.has(current.id)){ctx.addIssue({code:'custom',message:'A hierarquia de articulações não pode ter ciclos.'});break}seen.add(current.id);if(!current.parentId)break;const parent=r.joints.find(p=>p.id===current!.parentId);if(!parent){ctx.addIssue({code:'custom',message:'Articulação ascendente em falta.'});break}current=parent}}
 const partIds=new Set<string>();for(const p of r.parts){if(partIds.has(p.id)||!ids.has(p.jointId))ctx.addIssue({code:'custom',message:'Parte repetida ou articulação em falta.'});partIds.add(p.id);if(new Set(p.variants?.map(v=>v.id)).size!==(p.variants?.length||0)||new Set(p.visualKeys?.map(v=>v.time)).size!==(p.visualKeys?.length||0)||p.visualKeys?.some(k=>k.variantId!=='base'&&!p.variants?.some(v=>v.id===k.variantId)))ctx.addIssue({code:'custom',message:'Variantes ou eventos visuais inválidos.'});if(p.crop.polygon.length>0&&p.crop.polygon.length<3)ctx.addIssue({code:'custom',message:'Um recorte poligonal precisa de pelo menos três pontos.'});if(p.crop.polygon.some(pt=>pt.x<p.crop.x-.01||pt.y<p.crop.y-.01||pt.x>p.crop.x+p.crop.width+.01||pt.y>p.crop.y+p.crop.height+.01))ctx.addIssue({code:'custom',message:'O polígono deve estar dentro do recorte.'})}
});
export type Rig=z.infer<typeof rigSchema>;
export type Joint=z.infer<typeof jointSchema>;
export type JointKey=z.infer<typeof jointKeySchema>;
export type Part=z.infer<typeof partSchema>;
export type Point={x:number;y:number};
export type WorldJoint=Point&{angle:number};
export type PreparedCharacter={id:string;title:string;revision:number;rig:Rig;updatedAt:string};
export const clamp=(v:number,min:number,max:number)=>Math.max(min,Math.min(max,v));
const rad=(d:number)=>d*Math.PI/180;
export const normalizeAngle=(d:number)=>((d+180)%360+360)%360-180;
export function ease(t:number,type:JointKey['easing']){return type==='smooth'?t*t*(3-2*t):type==='ease-in'?t*t:type==='ease-out'?1-(1-t)*(1-t):t}
export function angleAt(j:Joint,time:number){const keys=[...j.keys].sort((a,b)=>a.time-b.time);if(!keys.length)return j.rotation;if(time<=keys[0].time)return keys[0].angle;if(time>=keys[keys.length-1].time)return keys[keys.length-1].angle;const i=keys.findIndex(k=>k.time>time),a=keys[i-1],b=keys[i],f=ease((time-a.time)/(b.time-a.time),a.easing);return clamp(a.angle+(b.angle-a.angle)*f,j.min,j.max)}
export function rigTime(rig:Rig,clipTime:number){return rig.timeOffset+Math.max(0,clipTime)*rig.speed}
export function anglesAt(rig:Rig,clipTime:number){const time=rigTime(rig,clipTime);return Object.fromEntries(rig.joints.map(j=>[j.id,angleAt(j,time)])) as Record<string,number>}
export function forward(rig:Rig,angles:Record<string,number>):Record<string,WorldJoint>{
 const result:Record<string,WorldJoint>={},visiting=new Set<string>();
 function visit(j:Joint):WorldJoint{if(result[j.id])return result[j.id];if(visiting.has(j.id))throw Error('Hierarquia cíclica.');visiting.add(j.id);const local=clamp(angles[j.id]??j.rotation,j.min,j.max),parent=rig.joints.find(p=>p.id===j.parentId);let world:WorldJoint;
 if(parent){const p=visit(parent),dx=j.x-parent.x,dy=j.y-parent.y,a=rad(p.angle);world={x:p.x+dx*Math.cos(a)-dy*Math.sin(a),y:p.y+dx*Math.sin(a)+dy*Math.cos(a),angle:p.angle+local}}else world={x:j.x,y:j.y,angle:local};visiting.delete(j.id);result[j.id]=world;return world}
 for(const j of rig.joints)visit(j);return result;
}
export function setJointAngle(rig:Rig,id:string,angle:number,clipTime:number,animate=true,easing:JointKey['easing']='smooth'){
 const joint=rig.joints.find(j=>j.id===id);if(!joint)return;const value=clamp(angle,joint.min,joint.max);if(!animate){joint.rotation=value;return}
 const time=Math.round(rigTime(rig,clipTime)*1000)/1000;if(!joint.keys.length&&time>0)joint.keys=[{time:0,angle:joint.rotation,easing}];joint.keys=[...joint.keys.filter(k=>Math.abs(k.time-time)>.0005),{time,angle:value,easing}].sort((a,b)=>a.time-b.time);
}
// Two-bone analytic seed avoids CCD's straight-chain singularity; bounded CCD refines it.
export function solveIK(rig:Rig,endpoint:string,target:Point,clipTime:number,initialAngles?:Record<string,number>){
 const initial=initialAngles||anglesAt(rig,clipTime),chain:Joint[]=[];let j=rig.joints.find(j=>j.id===endpoint);for(let i=0;i<2&&j?.parentId;i++){j=rig.joints.find(p=>p.id===j!.parentId);if(j)chain.push(j)}
 if(!chain.length)return{};
 const candidates:Record<string,number>[]=[{...initial}],world=forward(rig,initial),end=rig.joints.find(j=>j.id===endpoint)!;
 function closeAngle(angle:number,joint:Joint){const raw=[angle-720,angle-360,angle,angle+360,angle+720],valid=raw.filter(a=>a>=joint.min&&a<=joint.max),versions=valid.length?valid:raw.map(a=>clamp(a,joint.min,joint.max));return versions.sort((a,b)=>Math.abs(a-initial[joint.id])-Math.abs(b-initial[joint.id]))[0]}
 if(chain.length===2){const elbow=chain[0],shoulder=chain[1],s=world[shoulder.id],l1=Math.hypot(elbow.x-shoulder.x,elbow.y-shoulder.y),l2=Math.hypot(end.x-elbow.x,end.y-elbow.y),distance=Math.hypot(target.x-s.x,target.y-s.y);
 if(l1>.001&&l2>.001){const d=clamp(distance,Math.abs(l1-l2)+.0001,l1+l2-.0001),direction=distance>.0001?Math.atan2(target.y-s.y,target.x-s.x):Math.atan2(world[elbow.id].y-s.y,world[elbow.id].x-s.x),upper=Math.atan2(elbow.y-shoulder.y,elbow.x-shoulder.x),lower=Math.atan2(end.y-elbow.y,end.x-elbow.x),beta=Math.acos(clamp((d*d+l1*l1-l2*l2)/(2*d*l1),-1,1)),bend=Math.acos(clamp((d*d-l1*l1-l2*l2)/(2*l1*l2),-1,1)),grand=shoulder.parentId?world[shoulder.parentId].angle:0;
 for(const sign of [-1,1]){const v={...initial};v[shoulder.id]=closeAngle(normalizeAngle((direction-sign*beta-upper)*180/Math.PI-grand),shoulder);v[elbow.id]=closeAngle(normalizeAngle((sign*bend+upper-lower)*180/Math.PI),elbow);candidates.push(v)}}}
 let best=candidates[0],score=Infinity;
 for(const values of candidates){for(let pass=0;pass<32;pass++){for(const pivot of chain){const w=forward(rig,values),e=w[endpoint],p=w[pivot.id];if(!e||!p)continue;const delta=normalizeAngle((Math.atan2(target.y-p.y,target.x-p.x)-Math.atan2(e.y-p.y,e.x-p.x))*180/Math.PI);values[pivot.id]=clamp(values[pivot.id]+delta,pivot.min,pivot.max)}const w=forward(rig,values);if(Math.hypot(w[endpoint].x-target.x,w[endpoint].y-target.y)<.1)break}
 const w=forward(rig,values),error=Math.hypot(w[endpoint].x-target.x,w[endpoint].y-target.y),continuity=chain.reduce((n,j)=>n+Math.abs(values[j.id]-initial[j.id]),0)*.0001;if(error+continuity<score){score=error+continuity;best=values}}
 return Object.fromEntries(chain.map(j=>[j.id,best[j.id]]));
}
export function canParent(rig:Rig,jointId:string,parentId:string|null){if(parentId===null)return true;let id:string|null=parentId;const seen=new Set<string>();while(id){if(id===jointId||seen.has(id))return false;seen.add(id);const j=rig.joints.find(j=>j.id===id);if(!j)return false;id=j.parentId}return true}
export function rigAssetIds(rig?:Rig){return rig?[...new Set([rig.sourceAssetId,...rig.parts.flatMap(p=>[p.assetId,...p.variants?.map(v=>v.assetId)||[]]),...rig.preparation?.assets.map(a=>a.assetId)||[],...rig.preparation?.accessories.map(a=>a.assetId)||[]])]:[]}
export function rigResourceError(rig:Rig,assets:{id:string;type:string;width:number;height:number}[]){
 for(const id of rigAssetIds(rig))if(!assets.some(a=>a.id===id&&a.type==='image'))return 'Um recurso da personagem não pertence à sua biblioteca.';
 const base=assets.find(a=>a.id===rig.sourceAssetId);if(!base||base.type!=='image'||base.width!==rig.width||base.height!==rig.height)return 'Imagem de referência do personagem inválida ou sem acesso.';
 for(const part of rig.parts.flatMap(p=>[p,...p.variants?.map(v=>({assetId:v.assetId,crop:v.crop}))||[]])){const a=assets.find(a=>a.id===part.assetId);if(!a||a.type!=='image')return 'Uma parte do personagem não pertence à sua biblioteca.';if(part.crop.x+part.crop.width>a.width+.01||part.crop.y+part.crop.height>a.height+.01)return 'Um recorte ultrapassa os limites da imagem.'}return null;
}
export function emptyRig(asset:{id:string;name:string;width:number;height:number}):Rig{return{version:1,name:asset.name,sourceAssetId:asset.id,width:asset.width,height:asset.height,enabled:true,speed:1,timeOffset:0,joints:[],parts:[]}}
export function humanoidRig(asset:{id:string;name:string;width:number;height:number}):Rig{
 const r=emptyRig(asset),w=r.width,h=r.height;
 const definitions:[string,string,string|null,number,number][]=[['hips','Quadril',null,.5,.58],['torso','Tronco','hips',.5,.38],['neck','Pescoço','torso',.5,.25],['head','Cabeça','neck',.5,.20],['left-shoulder','Ombro esquerdo','torso',.32,.30],['left-elbow','Cotovelo esquerdo','left-shoulder',.30,.46],['left-wrist','Pulso esquerdo','left-elbow',.29,.62],['right-shoulder','Ombro direito','torso',.68,.30],['right-elbow','Cotovelo direito','right-shoulder',.70,.46],['right-wrist','Pulso direito','right-elbow',.71,.62],['left-hip','Quadril esquerdo','hips',.44,.60],['left-knee','Joelho esquerdo','left-hip',.44,.76],['left-ankle','Tornozelo esquerdo','left-knee',.44,.93],['right-hip','Quadril direito','hips',.56,.60],['right-knee','Joelho direito','right-hip',.56,.76],['right-ankle','Tornozelo direito','right-knee',.56,.93]];
 r.joints=definitions.map(([id,name,parentId,x,y])=>({id,name,parentId,x:x*w,y:y*h,rotation:0,min:-180,max:180,keys:[]}));return r;
}
export function cropPart(rig:Rig,asset:{id:string;width:number;height:number},jointId:string,crop:Part['crop']):Part{
 const joint=rig.joints.find(j=>j.id===jointId);if(!joint)throw Error('Selecione uma articulação.');const same=asset.id===rig.sourceAssetId,scale=same?1:Math.min(rig.width*.3/crop.width,rig.height*.35/crop.height);
 return{id:crypto.randomUUID(),name:joint.name+' · parte',jointId,assetId:asset.id,crop,x:same?crop.x:joint.x-crop.width*scale/2,y:same?crop.y:joint.y,width:crop.width*scale,height:crop.height*scale,rotation:0,opacity:1,hidden:false};
}
export function demoRig():Rig{
 const r=humanoidRig({id:'builtin-puppet',name:'Lia · preparação manual de teste',width:400,height:620});
 const positions:Record<string,[number,number]>={'hips':[200,365],'torso':[200,260],'neck':[200,155],'head':[200,125],'left-shoulder':[135,185],'left-elbow':[130,285],'left-wrist':[125,390],'right-shoulder':[265,185],'right-elbow':[270,285],'right-wrist':[275,390],'left-hip':[178,370],'left-knee':[178,470],'left-ankle':[178,570],'right-hip':[222,370],'right-knee':[222,470],'right-ankle':[222,570]};
 r.joints.forEach(j=>{[j.x,j.y]=positions[j.id];j.min=-160;j.max=160});
 const rects:[string,number,number,number,number][]=[['left-hip',157,370,41,103],['right-hip',202,370,41,103],['left-knee',157,469,41,107],['right-knee',202,469,41,107],['left-ankle',148,567,51,30],['right-ankle',201,567,51,30],['hips',155,335,90,52],['torso',148,155,104,202],['neck',184,127,32,36],['head',153,32,94,104],['left-shoulder',113,170,39,118],['left-elbow',104,282,43,113],['left-wrist',109,381,34,28],['right-shoulder',248,170,39,118],['right-elbow',253,282,43,113],['right-wrist',258,381,34,28]];
 r.parts=rects.map(([jointId,x,y,width,height])=>cropPart(r,{id:r.sourceAssetId,width:400,height:620},jointId,{x,y,width,height,polygon:[]}));
 r.parts.find(p=>p.jointId==='torso')!.crop.polygon=[{x:156,y:155},{x:244,y:155},{x:248,y:357},{x:152,y:357}];
 for(const [id,angles] of [['left-shoulder',[0,110,25]],['left-elbow',[0,65,20]],['head',[0,-15,15]]] as [string,number[]][])r.joints.find(j=>j.id===id)!.keys=angles.map((angle,i)=>({time:i*2,angle,easing:'smooth'}));return r;
}
// Cuts retain the complete rig curve and shift its clock, preserving eased interpolation.
export function offsetRig(rig:Rig|undefined,seconds:number){return rig?{...structuredClone(rig),timeOffset:rig.timeOffset+seconds*rig.speed}:undefined}
