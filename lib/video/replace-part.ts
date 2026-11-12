import type {Asset} from './model';
import type {Rig} from './rig';
import {alignVisualPartPivot,visualPartPivot} from './rig-interaction';
export function replaceVisualPart(rig:Rig,id:string,asset:Asset){const p=rig.parts.find(p=>p.id===id);if(!p||asset.type!=='image')throw Error('Escolha uma peça e uma imagem.');const pivot=visualPartPivot(rig,id);p.assetId=asset.id;p.crop={x:0,y:0,width:asset.width,height:asset.height,polygon:[]};p.maskOut=[];delete p.selectionPolygon;delete p.overlap;alignVisualPartPivot(rig,id,pivot);return p}
