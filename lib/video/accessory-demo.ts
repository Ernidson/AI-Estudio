import {emptyDocument,makeClip,builtinAssets} from './model';
import {demoRig,setJointAngle} from './rig';
import {clearAnimation} from './keyframes';
import {applyPreset} from './presets';
import {attachObject,releaseObject,changeSceneTransform} from './scene';
import {accessoryArm} from './accessories';
import {addBaseSkeleton} from './skeleton-templates';
export function accessoryDemo(){const d=emptyDocument();d.duration=10;const c=makeClip('image','Lia · referência preparada para testar acessórios',0,10,'builtin-puppet');c.rig=demoRig();clearAnimation(c);c.width=23;c.transform.y=55;d.tracks[2].clips=[c];const sword=makeClip('image','Espada · pega ajustada',0,10,'builtin-sword');sword.width=4;d.tracks[3].clips=[sword];attachObject(d,builtinAssets,sword.id,0,c.id,'right-wrist',{offsetX:12,offsetY:-3,rotation:180,pivotX:50,pivotY:85,scale:.8});applyPreset(c,'attack',{start:0,duration:3,speed:1,arm:accessoryArm(d,c,0).arm});for(const [t,shoulder,elbow] of [[4,0,0],[5,-70,-40],[6,0,0]]){setJointAngle(c.rig,'right-shoulder',shoulder,t,true,'smooth');setJointAngle(c.rig,'right-elbow',elbow,t,true,'smooth')}releaseObject(d,builtinAssets,sword.id,7);const free=sword.channels!.position.find(k=>k.time===7)!;changeSceneTransform(d,builtinAssets,sword.id,8,{x:free.x+10,y:free.y+8,rotation:35});return d}
export function skeletonDemo(){const d=emptyDocument();d.width=720;d.height=1280;const c=makeClip('image','P.E.K.K.A. · esqueleto base por ajustar',0,30,'opening-pekka');c.width=85;c.backgroundRemoval={enabled:true,color:'#ffffff',tolerance:24,softness:12,seeds:[]};c.rig=addBaseSkeleton(builtinAssets.find(a=>a.id===c.assetId)!);d.tracks[2].clips=[c];return d}
