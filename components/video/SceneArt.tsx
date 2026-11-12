import {sceneDrawOrder} from '../../lib/video/navigation';
'use client';
import type {Asset,VideoDocument} from '../../lib/video/model';
import {poseAt} from '../../lib/video/model';
import {evaluateScene,visualSize,sceneMatrix} from '../../lib/video/scene';
import type {SceneState} from '../../lib/video/scene';
import {isLayerHidden} from '../../lib/video/composition';
import CutoutImage from './CutoutImage';
import RigFigure from './RigFigure';
import BowString from './BowString';
import ImpactEffects from './ImpactEffects';
export default function SceneArt({doc,assets,time,exclude,states:provided,include,onObjectPointerDown,selectedId}:{states?:Map<string,SceneState>;include?:string[];selectedId?:string|null;onObjectPointerDown?:(e:React.PointerEvent,c:import('../../lib/video/model').Clip)=>void;doc:VideoDocument;assets:Asset[];time:number;exclude?:string}){const states=provided||evaluateScene(doc,assets,time);return <g aria-label="Contexto da cena">{sceneDrawOrder(doc,assets,time).filter(c=>c.id!==exclude&&(!include||include.includes(c.id))&&c.type==='image'&&!isLayerHidden(doc,c)).map(c=>{const s=states.get(c.id);if(!s?.active)return null;const size=visualSize(c,assets,time-c.start),a=assets.find(a=>a.id===poseAt(c,time-c.start)),tr=s.transform;return <g key={c.id} data-scene-layer={c.id} style={{pointerEvents:onObjectPointerDown?'visiblePainted':undefined,cursor:onObjectPointerDown?'grab':undefined}} onPointerDown={e=>onObjectPointerDown?.(e,c)} opacity={tr.opacity} transform={`matrix(${sceneMatrix(c,tr,size,doc).join(' ')})`}>{selectedId===c.id&&<rect x="0" y="0" width={size.width} height={size.height} fill="none" stroke="#d9af58" strokeWidth="2" vectorEffect="non-scaling-stroke" pointerEvents="none"/>}{c.rig?.enabled?<RigFigure rig={c.rig} sourceClip={c} time={time-c.start} assets={assets} posedAngles={s.angles} embedded/>:a&&<><CutoutImage asset={a} clip={c} svg/><BowString clip={c} doc={doc} assets={assets} states={states} time={time}/></>}</g>})}<ImpactEffects doc={doc} assets={assets} time={time}/></g>}
