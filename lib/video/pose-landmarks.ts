import {humanoidRig,rigSchema} from './rig';
import type {Rig} from './rig';
export type PosePoint={x:number;y:number;visibility?:number;presence?:number};
// Only actual detector output is mapped. No geometric fallback is returned as detection.
export function rigFromLandmarks(asset:{id:string;name:string;width:number;height:number},landmarks:PosePoint[]):Rig{
 const required=[0,11,12,13,14,15,16,23,24,25,26,27,28];
 if(required.some(i=>{const p=landmarks[i];return !p||!Number.isFinite(p.x)||!Number.isFinite(p.y)||p.x<-.2||p.x>1.2||p.y<-.2||p.y>1.2||(p.visibility??0)<.45||(p.presence!==undefined&&p.presence<.45)}))throw Error('O modelo não identificou um corpo completo com confiança suficiente.');
 const point=(i:number)=>({x:landmarks[i].x*asset.width,y:landmarks[i].y*asset.height});const a=point(11),b=point(12),c=point(23),d=point(24),neck={x:(a.x+b.x)/2,y:(a.y+b.y)/2},hips={x:(c.x+d.x)/2,y:(c.y+d.y)/2};
 const positions={hips,torso:{x:(neck.x+hips.x)/2,y:(neck.y+hips.y)/2},neck,head:point(0),'left-shoulder':a,'left-elbow':point(13),'left-wrist':point(15),'right-shoulder':b,'right-elbow':point(14),'right-wrist':point(16),'left-hip':c,'left-knee':point(25),'left-ankle':point(27),'right-hip':d,'right-knee':point(26),'right-ankle':point(28)};
 const rig=humanoidRig(asset);rig.name=asset.name+' · proposta de articulações';rig.joints.forEach(j=>Object.assign(j,positions[j.id as keyof typeof positions]));return rigSchema.parse(rig);
}
