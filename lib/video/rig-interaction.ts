import {compensationAt} from './residual';
import {variantPart} from './visual-variants';
import {anglesAt,clamp,forward,normalizeAngle,setJointAngle,solveIK} from './rig';
import type {JointKey,Point,Rig} from './rig';
export function visualBinding(rig:Rig|undefined){
 const parts=rig?.parts.filter(p=>!p.support&&!p.hidden&&p.opacity>0&&rig.joints.some(j=>j.id===p.jointId))||[];
 const bound=new Set(parts.map(p=>p.jointId));
 const affected=(id:string)=>{const descendants=new Set([id]);let added=true;while(added){added=false;for(const j of rig?.joints||[])if(j.parentId&&descendants.has(j.parentId)&&!descendants.has(j.id)){descendants.add(j.id);added=true}}return parts.some(p=>descendants.has(p.jointId))};
 return{ready:parts.length>0,parts:parts.length,bound,affected};
}
export function isEffector(rig:Rig,id:string){const j=rig.joints.find(j=>j.id===id);if(!j?.parentId)return false;const parent=rig.joints.find(p=>p.id===j.parentId);if(!parent?.parentId)return false;const name=(j.id+' '+j.name).toLowerCase();if(/head|cabeça|cabeca|neck|pescoço|pescoco/.test(name))return false;return /wrist|hand|pulso|mão|mao|ankle|foot|tornozelo|pé\b|pe\b/.test(name)||!rig.joints.some(p=>p.parentId===id)}
export function dragVisualPart(rig:Rig,partId:string,from:Point,to:Point,local:number,ik:boolean,easing:JointKey['easing']){
 const part=rig.parts.find(p=>p.id===partId);if(!part)return;const w=forward(rig,anglesAt(rig,local)),pivot=w[part.jointId];if(!pivot)return;
 if(ik&&isEffector(rig,part.jointId)){const target={x:pivot.x+to.x-from.x,y:pivot.y+to.y-from.y};for(const [id,angle] of Object.entries(solveIK(rig,part.jointId,target,local)))setJointAngle(rig,id,angle,local,true,easing);return}
 const initial=Math.atan2(from.y-pivot.y,from.x-pivot.x),next=Math.atan2(to.y-pivot.y,to.x-pivot.x);const angle=anglesAt(rig,local)[part.jointId]+normalizeAngle((next-initial)*180/Math.PI);setJointAngle(rig,part.jointId,angle,local,true,easing);
}
// Matrix from the source image pixel space to the posed character space.
// Both the renderer and tests use this binding, independently of SVG <use> behavior.
export function skinMatrix(rig:Rig,partId:string,local:number,binding=false,posedAngles?:Record<string,number>):[number,number,number,number,number,number]{
 const base=rig.parts.find(p=>p.id===partId),p=base?variantPart(rig,base,local,binding):undefined,j=rig.joints.find(j=>j.id===p?.jointId);if(!p||!j)return[1,0,0,1,0,0];
 const correction=compensationAt(rig,p,local,binding,posedAngles);
 const w=forward(rig,binding?Object.fromEntries(rig.joints.map(j=>[j.id,0])):(posedAngles||anglesAt(rig,local)))[j.id],a=w.angle*Math.PI/180,b=(p.rotation+correction.rotation)*Math.PI/180,sx=p.width/p.crop.width*correction.scale,sy=p.height/p.crop.height*correction.scale;
 const ca=Math.cos(a),sa=Math.sin(a),cb=Math.cos(b),sb=Math.sin(b),m0=(ca*cb-sa*sb)*sx,m1=(sa*cb+ca*sb)*sx,m2=(-ca*sb-sa*cb)*sy,m3=(-sa*sb+ca*cb)*sy;
 const cr=correction.rotation*Math.PI/180,ox=p.x-j.x,oy=p.y-j.y,dx=correction.x+correction.scale*(ox*Math.cos(cr)-oy*Math.sin(cr)),dy=correction.y+correction.scale*(ox*Math.sin(cr)+oy*Math.cos(cr)),tx=w.x+ca*dx-sa*dy-m0*p.crop.x-m2*p.crop.y,ty=w.y+sa*dx+ca*dy-m1*p.crop.x-m3*p.crop.y;return p.flipX?[-m0,-m1,m2,m3,tx+m0*(2*p.crop.x+p.crop.width),ty+m1*(2*p.crop.x+p.crop.width)]:[m0,m1,m2,m3,tx,ty];
}
export function transformPixel(matrix:number[],point:Point){return{x:matrix[0]*point.x+matrix[2]*point.y+matrix[4],y:matrix[1]*point.x+matrix[3]*point.y+matrix[5]}}
export function visualPartPivot(rig:Rig,partId:string){const p=rig.parts.find(p=>p.id===partId),j=rig.joints.find(j=>j.id===p?.jointId);if(!p||!j)return{x:50,y:50};const a=p.rotation*Math.PI/180,dx=j.x-p.x,dy=j.y-p.y;return{x:(dx*Math.cos(a)+dy*Math.sin(a))/p.width*100,y:(-dx*Math.sin(a)+dy*Math.cos(a))/p.height*100}}
export function alignVisualPartPivot(rig:Rig,partId:string,pivot:{x:number;y:number}){const p=rig.parts.find(p=>p.id===partId),j=rig.joints.find(j=>j.id===p?.jointId);if(!p||!j)return;const a=p.rotation*Math.PI/180,x=pivot.x/100*p.width,y=pivot.y/100*p.height;p.x=j.x-x*Math.cos(a)+y*Math.sin(a);p.y=j.y-x*Math.sin(a)-y*Math.cos(a)}
