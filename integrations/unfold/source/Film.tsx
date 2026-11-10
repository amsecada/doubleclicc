import React from 'react';
import {AbsoluteFill,Sequence,useCurrentFrame,useVideoConfig} from 'remotion';
import {Opening} from './scenes/Opening';
import {Transformation} from './scenes/Transformation';
import {VisualVoices} from './scenes/VisualVoices';
import {Swipe} from './scenes/Swipe';
import {Playback} from './scenes/Playback';
import {Release} from './scenes/Release';
import {progress} from './motion';

function Reveal({kind='iris',children}:{kind?:'iris'|'diagonal';children:React.ReactNode}){
 const f=useCurrentFrame(),{fps}=useVideoConfig(),p=progress(f,0,.6*fps);
 const clipPath=kind==='iris'?`circle(${p*1600}px at 50% 50%)`:`polygon(${-30+130*(1-p)}% 0,100% 0,100% 100%,${130*(1-p)}% 100%)`;
 return <AbsoluteFill style={{clipPath}}>{children}</AbsoluteFill>;
}
export function Film(){
 const {fps}=useVideoConfig();
 return <AbsoluteFill style={{background:'#fff0d8'}}>
  <Sequence name="01 — Brand entrance" from={0} durationInFrames={3.6*fps} premountFor={fps}><Opening/></Sequence>
  <Sequence name="02 — Text becomes a story" from={3*fps} durationInFrames={5.4*fps} premountFor={fps}><Reveal><Transformation/></Reveal></Sequence>
  <Sequence name="03 — Visual voices" from={7.8*fps} durationInFrames={4.2*fps} premountFor={fps}><Reveal><VisualVoices/></Reveal></Sequence>
  <Sequence name="04 — Swipe" from={11.4*fps} durationInFrames={4.2*fps} premountFor={fps}><Reveal kind="diagonal"><Swipe/></Reveal></Sequence>
  <Sequence name="05 — Play" from={15*fps} durationInFrames={5.2*fps} premountFor={fps}><Reveal><Playback/></Reveal></Sequence>
  <Sequence name="06 — Release" from={19.6*fps} durationInFrames={4.4*fps} premountFor={fps}><Reveal><Release/></Reveal></Sequence>
 </AbsoluteFill>;
}
