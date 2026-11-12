import {orderedParts} from '../../lib/video/residual';
'use client';
import {useId} from 'react';
import {visualRig} from '../../lib/video/visual-variants';
import CutoutImage from './CutoutImage';
import type {Asset,Clip} from '../../lib/video/model';
import {skinMatrix} from '../../lib/video/rig-interaction';
import type {Rig,Part} from '../../lib/video/rig';
export default function RigFigure({rig,time,assets,sourceClip,posedAngles,binding=false,embedded=false,onPartPointerDown,onAssetError}:{rig:Rig;time:number;assets:Asset[];sourceClip?:Clip;posedAngles?:Record<string,number>;binding?:boolean;embedded?:boolean;onPartPointerDown?:(e:React.PointerEvent,p:Part)=>void;onAssetError?:(id:string)=>void}){
 rig=visualRig(rig,time,binding);
 const prefix=useId().replace(/[^a-zA-Z0-9]/g,'');
 const contents=<>
 <defs>{rig.parts.filter(p=>p.maskOut?.length).map(p=><mask key={p.id} id={`${prefix}-mask-${p.id}`} maskUnits="userSpaceOnUse" x={0} y={0} width={assets.find(a=>a.id===p.assetId)?.width||rig.width} height={assets.find(a=>a.id===p.assetId)?.height||rig.height}><rect width={assets.find(a=>a.id===p.assetId)?.width||rig.width} height={assets.find(a=>a.id===p.assetId)?.height||rig.height} fill="white"/>{p.maskOut!.map((poly,i)=><polygon key={i} points={poly.map(v=>`${v.x},${v.y}`).join(' ')} fill="black"/>)}</mask>)}{rig.parts.map(p=><clipPath key={p.id} id={`${prefix}-clip-${p.id}`} clipPathUnits="userSpaceOnUse">{p.crop.polygon.length>=3?<polygon points={p.crop.polygon.map(pt=>`${pt.x},${pt.y}`).join(' ')}/>:<rect x={p.crop.x} y={p.crop.y} width={p.crop.width} height={p.crop.height}/>}</clipPath>)}</defs>
 {orderedParts(rig,time,binding,posedAngles).filter(p=>!p.hidden).map(p=>{const j=rig.joints.find(j=>j.id===p.jointId),asset=assets.find(a=>a.id===p.assetId);if(!j||!asset)return null;const matrix=skinMatrix(rig,p.id,time,binding,posedAngles),partClip=sourceClip&&p.assisted?{...sourceClip,rasterEdits:undefined}:sourceClip;return <g key={p.id} data-part-id={p.id} data-joint-id={p.jointId} data-skin-matrix={matrix.join(' ')} transform={`matrix(${matrix.join(' ')})`} opacity={p.opacity} onPointerDown={e=>onPartPointerDown?.(e,p)} className={onPartPointerDown?'vs-rig-clickable-part':undefined}><g clipPath={`url(#${prefix}-clip-${p.id})`} mask={p.maskOut?.length?`url(#${prefix}-mask-${p.id})`:undefined}>{sourceClip&&asset.id===rig.sourceAssetId&&(sourceClip.rasterEdits||sourceClip.backgroundRemoval?.enabled)?<CutoutImage asset={asset} clip={partClip!} svg onError={()=>onAssetError?.(asset.id)}/>:<image href={asset.url} x={0} y={0} width={asset.width} height={asset.height} preserveAspectRatio="none" onError={()=>onAssetError?.(asset.id)} aria-label={p.name}/>}</g></g>})}
 </>;return embedded?<g data-rig-parts="true">{contents}</g>:<svg className="vs-rig-figure" width={rig.width} height={rig.height} viewBox={`0 0 ${rig.width} ${rig.height}`} xmlns="http://www.w3.org/2000/svg" role="img" aria-label={rig.name}>{contents}</svg>;
}
