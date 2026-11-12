import {clashAssets} from './clash-assets';
import type {Asset} from './model';
export const characterAssets:Asset[]=[
...clashAssets,
{id:'archer-torso-base',name:'Arqueira · base manual completa do tronco',type:'image',category:'image',mime:'image/svg+xml',size:0,duration:0,width:320,height:430,group:'Peça de substituição manual',url:'/characters/archer-torso-base.svg',builtin:true},
...(['armor','skin'] as const).map(kind=>({id:'joint-patch-'+kind,name:'Sobreposição manual · '+kind,type:'image' as const,category:'image' as const,mime:'image/svg+xml',size:0,duration:0,width:100,height:100,group:'Preparação manual · juntas',url:'/characters/joint-'+kind+'.svg',builtin:true})),
{id:'prepared-pekka-sheet',name:'P.E.K.K.A. · peças visuais preparadas',type:'image',category:'character',mime:'image/png',size:0,duration:0,width:1448,height:1086,group:'Personagens fornecidos · preparação manual',url:'/characters/pekka-sheet.png',builtin:true},
{id:'prepared-archer-sheet',name:'Arqueira · peças visuais preparadas',type:'image',category:'character',mime:'image/png',size:0,duration:0,width:1448,height:1086,group:'Personagens fornecidos · preparação manual',url:'/characters/archer-sheet.png',builtin:true},
{id:'prepared-arrow',name:'Flecha · exemplo vetorial independente',type:'image',category:'object',mime:'image/svg+xml',size:0,duration:0,width:400,height:40,group:'Objetos',url:'/characters/arrow.svg',builtin:true}
];
