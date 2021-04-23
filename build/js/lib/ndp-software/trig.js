export const radiansPerPeriod=2*Math.PI;export const normalizeRadians=t=>{if(Math.abs(t)<Math.pi)return t;for(;t<0;)t+=radiansPerPeriod;for(;t>Math.PI;)t-=radiansPerPeriod;return t};export const ptToVector=function(t){return[Math.atan2(t.y,t.x),Math.sqrt(t.x*t.x+t.y*t.y)]};export const vectorToPt=(t,r)=>({x:r*Math.cos(t),y:r*Math.sin(t)});export function polarToCartesian(t,r,a,o){const n=(o-90)*Math.PI/180;return{x:t+a*Math.cos(n),y:r+a*Math.sin(n)}}