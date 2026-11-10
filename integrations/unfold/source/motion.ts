import {Easing, interpolate, spring} from 'remotion';

export const colors={ivory:'#fff0d8',orange:'#ff633b',ink:'#242424',lime:'#e5fc44',lilac:'#b9a2ee'};
export const progress=(frame:number,start:number,end:number)=>interpolate(frame,[start,end],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp',easing:Easing.bezier(.22,1,.36,1)});
export const mix=(start:number,end:number,p:number)=>start+(end-start)*p;
export const settle=(frame:number,fps:number,delay=0)=>spring({frame:Math.max(0,frame-delay),fps,config:{damping:19,stiffness:140,mass:.85}});
