import {polishEpisodeRig} from './residual';
import {humanoidRig} from './rig';
import type {Rig} from './rig';
import type {Asset} from './model';
import {episodeAssets,episodeEntry} from './episode-assets';
export type EpisodeWho='archer'|'pekka';
const masters={archer:'ARQ_00_variacao_A3_referencia_jogo_v1',pekka:'PEK_00_modelo_base_armadura_v1'};
export function episodeResource(sourceId:string,assets:Asset[]){return assets.find(a=>!a.builtin&&a.episode?.sourceId===sourceId)||assets.find(a=>a.id==='ep01-'+sourceId)||episodeAssets.find(a=>a.id==='ep01-'+sourceId)!}
// Landmarks measured against the actual master, NOT generic humanoid proportions.
// The asymmetrical PEKKA master includes a sword on the left: body centre is 60%, not 50%.
const points:Record<EpisodeWho,Record<string,[number,number]>>={
 pekka:{hips:[60,59],torso:[60,38],neck:[60,25],head:[60,17],'left-shoulder':[46,32],'left-elbow':[33,43],'left-wrist':[26,57],'right-shoulder':[74,32],'right-elbow':[85,43],'right-wrist':[91,57],'left-hip':[51,61],'left-knee':[46,75],'left-ankle':[44,89],'right-hip':[69,61],'right-knee':[74,75],'right-ankle':[77,89]},
 archer:{hips:[50,65],torso:[50,43],neck:[49,30],head:[49,20],'left-shoulder':[37,37],'left-elbow':[27,48],'left-wrist':[20,56],'right-shoulder':[63,37],'right-elbow':[73,48],'right-wrist':[80,56],'left-hip':[43,66],'left-knee':[38,76],'left-ankle':[35,85],'right-hip':[58,66],'right-knee':[62,76],'right-ankle':[65,85]}
};
type Placement={key:string;joint:string;box?:[number,number,number,number];from?:[number,number];to?:[number,number];child?:string;flip?:boolean;cropTop?:number};
const layouts:Record<EpisodeWho,Placement[]>={pekka:[
 {key:'PEK_13_coxa_E_espelhar_D',joint:'left-hip',child:'left-knee',from:[.5,.22],to:[.45,.76],flip:true},
 {key:'PEK_07_coxa_D_v1',joint:'right-hip',child:'right-knee',from:[.5,.22],to:[.45,.76]},
 {key:'PEK_14_canela_E_espelhar_D',joint:'left-knee',child:'left-ankle',from:[.5,.29],to:[.5,.77],flip:true},
 {key:'PEK_08_canela_D_v1',joint:'right-knee',child:'right-ankle',from:[.5,.29],to:[.5,.77]},
 {key:'PEK_15_bota_E_espelhar_D',joint:'left-ankle',box:[33,85,23,14],flip:true,cropTop:.43},
 {key:'PEK_09_bota_D_v1',joint:'right-ankle',box:[66,85,23,14],cropTop:.43},
 {key:'PEK_02_tronco_couraca_v1',joint:'torso',box:[34,24,52,48]},
 {key:'PEK_11_braco_superior_E_espelhar_D',joint:'left-shoulder',child:'left-elbow',from:[.62,.36],to:[.32,.78]},
 {key:'PEK_04_braco_superior_D_v1',joint:'right-shoulder',child:'right-elbow',from:[.62,.36],to:[.32,.78],flip:true},
 {key:'PEK_12_antebraco_E_espelhar_D',joint:'left-elbow',child:'left-wrist',from:[.31,.12],to:[.81,.88],flip:true},
 {key:'PEK_05_antebraco_D_v1',joint:'right-elbow',child:'right-wrist',from:[.31,.12],to:[.81,.88]},
 {key:'PEK_10_mao_E_aberta_v1',joint:'left-wrist',box:[19,53,17,17],flip:true},
 {key:'PEK_06_mao_D_agarrar_espada_v1',joint:'right-wrist',box:[84,53,15,16]},
 {key:'PEK_01_capacete_chifres_v1',joint:'head',box:[34,0,51,28]}
 ],archer:[
 {key:'ARQ_A3_capa_traseira_v1',joint:'torso',box:[20,30,44,49]},
 {key:'ARQ_A3_coxa_E_v1',joint:'left-hip',child:'left-knee',from:[.5,.22],to:[.50,.75]},
 {key:'ARQ_A3_coxa_D_v1',joint:'right-hip',child:'right-knee',from:[.5,.22],to:[.50,.75]},
 {key:'ARQ_A3_canela_E_v1',joint:'left-knee',child:'left-ankle',from:[.5,.30],to:[.5,.76]},
 {key:'ARQ_A3_canela_D_espelhar_E',joint:'right-knee',child:'right-ankle',from:[.5,.30],to:[.5,.76],flip:true},
 {key:'ARQ_A3_bota_E_v1',joint:'left-ankle',box:[25,81,20,18]},
 {key:'ARQ_A3_bota_D_v1',joint:'right-ankle',box:[55,81,20,18]},
 {key:'ARQ_A3_prototipo_braco_superior_E',joint:'left-shoulder',child:'left-elbow',from:[.27,.22],to:[.75,.82],flip:true},
 {key:'ARQ_A3_braco_superior_D_v1',joint:'right-shoulder',child:'right-elbow',from:[.73,.22],to:[.25,.82],flip:true},
 {key:'ARQ_A3_prototipo_tronco',joint:'torso',box:[32,30,37,40]},
 {key:'ARQ_A3_aljava_v1',joint:'torso',box:[58,42,14,24]},
 {key:'ARQ_A3_prototipo_antebraco_E',joint:'left-elbow',child:'left-wrist',from:[.16,.16],to:[.84,.85],flip:true},
 {key:'ARQ_A3_antebraco_D_espelhar_E',joint:'right-elbow',child:'right-wrist',from:[.16,.16],to:[.84,.85]},
 {key:'ARQ_A3_prototipo_mao_E',joint:'left-wrist',box:[12,53,13,13]},
 {key:'ARQ_A3_mao_D_v1',joint:'right-wrist',box:[75,53,13,13]},
 {key:'ARQ_A3_cabeca_cabelo_v1',joint:'head',box:[21,1,55,30]}
 ]};
export function episodeRig(who:EpisodeWho,assets:Asset[]):Rig{const source=episodeResource(masters[who],assets);if(!source)throw Error('Imagem-mestra EP01 em falta.');const r=humanoidRig(source);r.name=(who==='archer'?'Arqueira A3':'P.E.K.K.A.')+' · EP01 · calibrada';
 for(const j of r.joints){const p=points[who][j.id];j.x=p[0]*r.width/100;j.y=p[1]*r.height/100;j.min=-160;j.max=160;}
 r.parts=layouts[who].map((p,i)=>{const a=episodeResource(p.key,assets),e=episodeEntry(p.key);if(!a||!e)throw Error('Peça em falta: '+p.key);const b=[...e.contentBounds];if(p.cropTop)b[1]+=Math.round((b[3]-b[1])*p.cropTop);const cw=b[2]-b[0],ch=b[3]-b[1],j=r.joints.find(j=>j.id===p.joint)!,part={id:'ep01-'+who+'-'+i,name:p.key.slice(0,80),assetId:a.id,jointId:p.joint,crop:{x:b[0],y:b[1],width:cw,height:ch,polygon:[]},x:0,y:0,width:1,height:1,rotation:0,opacity:1,hidden:false,flipX:!!p.flip};
 if(p.child&&p.from&&p.to){const child=r.joints.find(j=>j.id===p.child)!,f={x:p.flip?1-p.from[0]:p.from[0],y:p.from[1]},t={x:p.flip?1-p.to[0]:p.to[0],y:p.to[1]},vx=(t.x-f.x)*cw,vy=(t.y-f.y)*ch,dx=child.x-j.x,dy=child.y-j.y,k=Math.hypot(dx,dy)/Math.hypot(vx,vy),angle=Math.atan2(dy,dx)-Math.atan2(vy,vx);part.width=cw*k;part.height=ch*k;part.rotation=angle*180/Math.PI;part.x=j.x-f.x*part.width*Math.cos(angle)+f.y*part.height*Math.sin(angle);part.y=j.y-f.x*part.width*Math.sin(angle)-f.y*part.height*Math.cos(angle);
 }else{const [x,y,w,h]=p.box!,bw=w*r.width/100,bh=h*r.height/100,k=Math.min(bw/cw,bh/ch);part.width=cw*k;part.height=ch*k;part.x=x*r.width/100+(bw-part.width)/2;part.y=y*r.height/100+(bh-part.height)/2;}return part});return polishEpisodeRig(r)}
