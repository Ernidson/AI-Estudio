import {z} from 'zod';
import type {Clip,Transform} from './model';
export const easingSchema=z.enum(['linear','smooth','ease-in','ease-out']);
export const keyMeta={time:z.number().min(0).max(1500),easing:easingSchema.optional(),animationId:z.string().min(1).max(100).optional()};
export const positionKeySchema=z.object({...keyMeta,x:z.number().min(-200).max(300),y:z.number().min(-200).max(300)});
export const valueKeySchema=z.object({...keyMeta,value:z.number().min(-720).max(720)});
export const channelsSchema=z.object({position:z.array(positionKeySchema).max(160),rotation:z.array(valueKeySchema).max(160),scale:z.array(valueKeySchema.extend({value:z.number().min(.05).max(5)})).max(160),opacity:z.array(valueKeySchema.extend({value:z.number().min(0).max(1)})).max(160)});
export const animationGroupSchema=z.object({id:z.string().min(1).max(100),name:z.string().min(1).max(120),preset:z.string().max(40).optional(),start:z.number().min(0).max(300),end:z.number().min(0).max(300)});
export type Channels=z.infer<typeof channelsSchema>;
export type Easing=z.infer<typeof easingSchema>;
export const easeAt=(t:number,e:Easing='linear')=>e==='smooth'?t*t*(3-2*t):e==='ease-in'?t*t:e==='ease-out'?1-(1-t)*(1-t):t;
function sample<T extends {time:number;easing?:Easing}>(keys:T[],t:number,read:(key:T)=>number,fallback:number){if(!keys.length)return fallback;const sorted=[...keys].sort((a,b)=>a.time-b.time);if(t<=sorted[0].time)return read(sorted[0]);if(t>=sorted[sorted.length-1].time)return read(sorted[sorted.length-1]);const i=sorted.findIndex(k=>k.time>t),a=sorted[i-1],b=sorted[i],f=easeAt((t-a.time)/(b.time-a.time),a.easing);return read(a)+(read(b)-read(a))*f}
export function applyChannels(channels:Channels|undefined,t:number,base:Transform):Transform{if(!channels)return base;return{x:sample(channels.position,t,k=>k.x,base.x),y:sample(channels.position,t,k=>k.y,base.y),rotation:sample(channels.rotation,t,k=>k.value,base.rotation),scale:sample(channels.scale,t,k=>k.value,base.scale),opacity:sample(channels.opacity,t,k=>k.value,base.opacity)}}
export function ensureChannels(c:Clip):Channels{if(c.channels)return c.channels;const meta=(k:Clip['keyframes'][number])=>({time:k.time,easing:k.easing,animationId:k.animationId});c.channels={position:c.keyframes.map(k=>({...meta(k),x:k.x,y:k.y})),rotation:c.keyframes.map(k=>({...meta(k),value:k.rotation})),scale:c.keyframes.map(k=>({...meta(k),value:k.scale})),opacity:c.keyframes.map(k=>({...meta(k),value:k.opacity}))};c.keyframes=[];return c.channels}
export function writeTransform(c:Clip,t:number,values:Partial<Transform>,animate=true,easing:Easing='smooth',animationId?:string){
 if(!animate){c.transform={...c.transform,...values};return}const channels=ensureChannels(c),time=Math.round((t+(c.motionOffset||0))*1000)/1000;
 const insert=(name:'position'|'rotation'|'scale'|'opacity',key:any)=>{const list:any[]=channels[name];if(!list.length&&t>0){const neutral=name==='position'?{x:c.transform.x,y:c.transform.y}:{value:c.transform[name]};list.push({time:c.motionOffset||0,...neutral,easing})}const remaining=list.filter(k=>Math.abs(k.time-time)>.0005);remaining.push({time,...key,easing,...animationId?{animationId}:{}});(channels as any)[name]=remaining.sort((a,b)=>a.time-b.time)};
 if(values.x!==undefined||values.y!==undefined){const current=applyChannels(channels,time,c.transform);insert('position',{x:values.x??current.x,y:values.y??current.y})}for(const name of ['rotation','scale','opacity'] as const)if(values[name]!==undefined)insert(name,{value:values[name]});
}
