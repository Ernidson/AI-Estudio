export type Viewport={zoom:number;x:number;y:number};
export const fitViewport=():Viewport=>({zoom:1,x:0,y:0});
export function zoomViewport(v:Viewport,factor:number,p:{x:number;y:number}={x:0,y:0}):Viewport{const zoom=Math.max(.25,Math.min(5,v.zoom*factor)),ratio=zoom/v.zoom;return{zoom,x:p.x-(p.x-v.x)*ratio,y:p.y-(p.y-v.y)*ratio}}
export function screenToWorld(v:Viewport,p:{x:number;y:number}){return{x:(p.x-v.x)/v.zoom,y:(p.y-v.y)/v.zoom}}
