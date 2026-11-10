import React from 'react';
import {Interactive} from 'remotion';
import {colors as c} from './motion';

// All graphic objects remain native, named layers. No flattened campaign frames.
export function Frame({name,background,children}:{name:string;background:string;children:React.ReactNode}){
 return <Interactive.Svg name={name} width={1920} height={1080} viewBox="0 0 1920 1080" style={{position:'absolute',inset:0,overflow:'hidden'}}><Interactive.Rect name="Background" width={1920} height={1080} fill={background}/>{children}</Interactive.Svg>;
}
export function Asterisk({color=c.ink,rotation=0}:{color?:string;rotation?:number}){
 return <Interactive.G name="Asterisk" transform={`rotate(${rotation})`}><Interactive.Rect name="Vertical ray" x={-22} y={-126} width={44} height={252} fill={color}/><Interactive.Rect name="Horizontal ray" x={-126} y={-22} width={252} height={44} fill={color}/><Interactive.Rect name="Diagonal ray one" x={-22} y={-126} width={44} height={252} fill={color} transform="rotate(45)"/><Interactive.Rect name="Diagonal ray two" x={-22} y={-126} width={44} height={252} fill={color} transform="rotate(-45)"/></Interactive.G>;
}
export function Rings({color=c.ink,rotation=0}:{color?:string;rotation?:number}){
 return <Interactive.G name="Concentric rings" transform={`rotate(${rotation})`} fill="none" stroke={color} strokeWidth={8}><Interactive.Circle name="Outer ring" r={118}/><Interactive.Circle name="Middle ring" r={80}/><Interactive.Circle name="Inner ring" r={42}/></Interactive.G>;
}
export type Motif='dot'|'rings'|'asterisk'|'split'|'bar'|'open';
export function StoryCard({name,x,y,scale=1,rotation=0,fill=c.orange,ink=c.ink,motif='dot',motifRotation=0,opacity=1,blur=0}:{name:string;x:number;y:number;scale?:number;rotation?:number;fill?:string;ink?:string;motif?:Motif;motifRotation?:number;opacity?:number;blur?:number}){
 return <Interactive.G name={name} opacity={opacity} style={{filter:blur>0?`blur(${blur}px)`:undefined}} transform={`translate(${x} ${y}) rotate(${rotation}) scale(${scale})`}>
  <Interactive.Rect name="Card surface" x={-160} y={-260} width={320} height={520} rx={23} fill={fill}/>
  <Interactive.G name="Card symbol" transform={`rotate(${motifRotation})`}>
   {motif==='dot'&&<Interactive.Circle name="Solid circle" r={118} fill={ink}/>}
   {motif==='rings'&&<Rings color={ink}/>}
   {motif==='asterisk'&&<Asterisk color={ink}/>}
   {motif==='split'&&<><Interactive.Circle name="Circle" r={122} fill={ink}/><Interactive.Rect name="Vertical bar" x={-24} y={-95} width={48} height={190} fill={c.ivory}/></>}
   {motif==='bar'&&<><Interactive.Circle name="Orange circle" r={135} fill={c.orange}/><Interactive.Rect name="Horizontal bar" x={-115} y={-25} width={230} height={50} fill={ink}/></>}
   {motif==='open'&&<Interactive.Circle name="Open ring" r={105} fill="none" stroke={ink} strokeWidth={43} strokeDasharray="238 92" transform="rotate(-35)"/>}
  </Interactive.G>
 </Interactive.G>;
}
export function Ring({name,x,y,radius,strokeWidth=70,color=c.ink,rotation=0,open=.78,scaleX=1,scaleY=1}:{name:string;x:number;y:number;radius:number;strokeWidth?:number;color?:string;rotation?:number;open?:number;scaleX?:number;scaleY?:number}){
 const length=2*Math.PI*radius;
 return <Interactive.G name={name} transform={`translate(${x} ${y}) rotate(${rotation}) scale(${scaleX} ${scaleY})`}><Interactive.Circle name="Ring stroke" r={radius} fill="none" stroke={color} strokeWidth={strokeWidth} strokeDasharray={`${length*open} ${length*(1-open)}`} transform="rotate(30)"/></Interactive.G>;
}
export function Arrow({name,x,y,scale=1,rotation=0,color=c.ink,opacity=1}:{name:string;x:number;y:number;scale?:number;rotation?:number;color?:string;opacity?:number}){
 return <Interactive.G name={name} transform={`translate(${x} ${y}) rotate(${rotation}) scale(${scale})`} opacity={opacity}><Interactive.Path name="Arrow shape" d="M-170-28H60V-110L190 0 60 110V28H-170Z" fill={color}/></Interactive.G>;
}
export function Strip({name,x,y,width=480,rotation=0,scale=1,fill=c.ivory,ink=c.ink,opacity=1}:{name:string;x:number;y:number;width?:number;rotation?:number;scale?:number;fill?:string;ink?:string;opacity?:number}){
 return <Interactive.G name={name} transform={`translate(${x} ${y}) rotate(${rotation}) scale(${scale})`} opacity={opacity}><Interactive.Rect name="Article strip" x={-width/2} y={-38} width={width} height={76} fill={fill}/><Interactive.Rect name="First abstract text line" x={-width/2+24} y={-18} width={width-48} height={10} fill={ink}/><Interactive.Rect name="Second abstract text line" x={-width/2+24} y={7} width={width*.6} height={10} fill={ink}/></Interactive.G>;
}
export function SpeedLines({name,x,y,rotation=0,scale=1,opacity=.85}:{name:string;x:number;y:number;rotation?:number;scale?:number;opacity?:number}){
 return <Interactive.G name={name} transform={`translate(${x} ${y}) rotate(${rotation}) scale(${scale})`} opacity={opacity}><Interactive.Path name="Vermilion streak" d="M-410-22H290" fill="none" stroke={c.orange} strokeWidth={9}/><Interactive.Path name="Lime streak" d="M-310 7H410" fill="none" stroke={c.lime} strokeWidth={5}/><Interactive.Path name="Lilac streak" d="M-100 35H360" fill="none" stroke={c.lilac} strokeWidth={5}/></Interactive.G>;
}
export function Wordmark({x=105,y=655,width=1000,size=326,opacity=1}:{x?:number;y?:number;width?:number;size?:number;opacity?:number}){
 return <Interactive.Text name="Unfold wordmark" x={x} y={y} textLength={width} lengthAdjust="spacingAndGlyphs" fontFamily="UnfoldBlack, Noto Sans, Arial, sans-serif" fontSize={size} fontWeight={900} letterSpacing={-18} fill={c.ink} opacity={opacity}>unfold</Interactive.Text>;
}
