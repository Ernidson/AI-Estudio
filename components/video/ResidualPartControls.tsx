'use client';
import type {Rig} from '../../lib/video/rig';
const limits={x:[-120,120],y:[-120,120],rotation:[-15,15],scale:[.85,1.2],order:[-100,100]};
const labels={x:'Offset local X (px do rig)',y:'Offset local Y (px do rig)',rotation:'Rotação corretiva (°)',scale:'Escala corretiva',order:'Prioridade de desenho'};
export default function ResidualPartControls({rig,partId,onChange}:{rig:Rig;partId:string;onChange:(fn:(r:Rig)=>void)=>void}){
 const p=rig.parts.find(p=>p.id===partId);if(!p)return null;const c=p.compensation;
 return <details><summary>Compensação de montagem · esta peça</summary>
 <p>Ajustes visuais locais sobre a preparação; não alteram ossos ou PNGs. Para a mão, mantenha o pivô para conservar a pega dos acessórios.</p>
 <label><input type="checkbox" checked={!!c?.enabled} onChange={e=>onChange(r=>{const p=r.parts.find(p=>p.id===partId)!;p.compensation=p.compensation||{version:1,enabled:true,x:0,y:0,rotation:0,scale:1,poses:[],source:'manual'};p.compensation.enabled=e.target.checked;p.compensation.source='manual'})}/> Ativar compensação</label>
 {c&&<>
 {(['x','y','rotation','scale','order'] as const).map(key=><label className="vs-field" key={key}><span>{labels[key]}</span><input type="number" step={key==='scale'?0.01:0.1} value={c[key]??rig.parts.indexOf(p)} min={limits[key][0]} max={limits[key][1]} onChange={e=>{const n=+e.target.value;if(Number.isFinite(n))onChange(r=>{const cp=r.parts.find(p=>p.id===partId)!.compensation!;cp[key]=Math.max(limits[key][0],Math.min(limits[key][1],n));cp.source='manual'})}}/></label>)}
 <p>{c.poses.length} perfis por ângulo. Edição avançada dos offsets:</p>
 {c.poses.map((pose,i)=><div className="vs-field-grid" key={i}><span>{pose.angle}°</span>{(['x','y'] as const).map(axis=><label key={axis}>{axis}<input type="number" step="0.1" value={pose[axis]} onChange={e=>onChange(r=>{const cp=r.parts.find(p=>p.id===partId)!.compensation!;cp.poses[i][axis]=Math.max(-120,Math.min(120,+e.target.value));cp.source='manual'})}/></label>)}</div>)}
 <button className="vs-small-button" onClick={()=>onChange(r=>{delete r.parts.find(p=>p.id===partId)!.compensation})}>Remover só esta compensação</button>
 </>}
 </details>
}
