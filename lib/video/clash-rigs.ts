import data from './clash-layouts.json';
import {humanoidRig} from './rig';
import {clashAssets} from './clash-assets';
import type {Rig} from './rig';
export function clashRig(assetId:string):Rig|undefined{const who=assetId==='clash-pekka-assembled'?'pekka':assetId==='clash-archer-assembled'?'archer':null;if(!who)return;const source=clashAssets.find(a=>a.id===assetId)!,r=humanoidRig(source);r.name=who==='pekka'?'P.E.K.K.A. · biblioteca por peças':'Arqueira · biblioteca por peças';const joints=data.joints[who] as Record<string,number[]>;for(const j of r.joints){[j.x,j.y]=joints[j.id];j.min=-150;j.max=150;}r.parts=data.layouts[who].map(([name,key,joint,x,y,width,height],i)=>{const a=clashAssets.find(a=>a.id==='clash-'+key)!;return{id:'clash-'+who+'-'+i,name:String(name),assetId:a.id,jointId:String(joint),crop:{x:0,y:0,width:a.width,height:a.height,polygon:[]},x:Number(x),y:Number(y),width:Number(width),height:Number(height),rotation:0,opacity:1,hidden:false}});return r}
