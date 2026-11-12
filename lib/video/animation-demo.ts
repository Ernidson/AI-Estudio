import {emptyDocument,makeClip} from './model';
import {demoRig} from './rig';
import {clearAnimation} from './keyframes';
import {applyPreset} from './presets';
export function animationDemoDocument(){const d=emptyDocument();d.duration=20;const bg=makeClip('image','Cenário · DEMO',0,20,'builtin-scenery');bg.width=100;d.tracks[0].clips.push(bg);const chair=makeClip('image','Cadeira · objeto DEMO',0,20,'builtin-chair');chair.width=15;chair.transform.x=80;chair.transform.y=72;chair.anchors=[{id:'seat',name:'Assento',x:50,y:61}];d.tracks[0].clips.push(chair);const c=makeClip('image','Lia · caminhada, salto e aceno · DEMO',0,20,'builtin-puppet');c.rig=demoRig();c.width=20;c.transform={x:25,y:58,scale:1,rotation:0,opacity:1};clearAnimation(c);applyPreset(c,'walk',{start:0,duration:5,speed:1,distance:28});applyPreset(c,'jump',{start:6,duration:3,speed:1,height:14});applyPreset(c,'wave',{start:10,duration:4,speed:1});d.tracks[2].clips.push(c);return d;}
