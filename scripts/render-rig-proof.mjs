// Render the actual SVG component, not a separate illustration of the skeleton.
import {load} from './test-video.mjs';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import sharp from 'sharp';
const {demoRig}=load('lib/video/rig.ts');
const Figure=load('components/video/RigFigure.tsx').default;
const rig=demoRig();
const url='data:image/png;base64,'+readFileSync('public/video-demo/puppet.png').toString('base64');
const assets=[{id:'builtin-puppet',width:400,height:620,url}];
const poses=[0,2,4].map((time,i)=>`<g transform="translate(${30+i*420} 91)">${renderToStaticMarkup(React.createElement(Figure,{rig,time,assets}),{identifierPrefix:'pose'+i})}</g><text x="${230+i*420}" y="722" text-anchor="middle" fill="#8261ac" font-family="sans-serif" font-size="17">Pose ${i+1} · ${time} s</text>`).join('');
const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1300" height="770" viewBox="0 0 1300 770"><rect width="1300" height="770" fill="#f4f1f8"/><text x="34" y="35" font-family="sans-serif" font-weight="600" font-size="23" fill="#41324e">Lia · três poses por articulações</text><text x="34" y="61" font-family="sans-serif" font-size="13" fill="#9984ad">Renderização SVG do motor · preparação manual de imagem única · não é um teste da interface</text>${poses}</svg>`;
mkdirSync('docs',{recursive:true});writeFileSync('docs/rig-three-poses.svg',svg);await sharp(Buffer.from(svg)).png().toFile('docs/rig-three-poses.png');
for(const x of [30,450,870]){const stats=await sharp('docs/rig-three-poses.png').extract({left:x,top:91,width:400,height:620}).stats();if(stats.channels[0].stdev<5)throw Error('Pose renderizada vazia.')}
console.log('PASS actual RigFigure SVG component rendered three non-empty poses to docs/rig-three-poses.png.');
