import React from 'react';
import {useCurrentFrame,useVideoConfig} from 'remotion';
import {Frame,SpeedLines,StoryCard} from '../components';
import {colors as c,mix,progress,settle} from '../motion';

export function VisualVoices(){
 const f=useCurrentFrame(),{fps}=useVideoConfig();
 const fan=settle(f,fps,.25*fps),drift=progress(f,2.7*fps,4.2*fps);
 return <Frame name="Three visual voices" background={c.ink}>
  <SpeedLines name="Style arc upper" x={900} y={155} rotation={-12} scale={.86} opacity={.7}/>
  <StoryCard name="Lime visual voice" x={mix(960,490,fan)-drift*110} y={560} scale={mix(.3,1.08,fan)} rotation={mix(0,-10,fan)-drift*4} fill={c.lime} motif="split" motifRotation={mix(-90,0,progress(f,.6*fps,1.8*fps))}/>
  <StoryCard name="Lilac visual voice" x={mix(960,1440,fan)-drift*110} y={535} scale={mix(.3,1.12,fan)} rotation={mix(0,10,fan)-drift*4} fill={c.lilac} motif="asterisk" motifRotation={mix(-90,0,progress(f,.7*fps,2*fps))}/>
  <StoryCard name="Ivory visual voice" x={960-drift*110} y={mix(700,525,settle(f,fps,.4*fps))} scale={1.3} rotation={mix(8,-4,fan)-drift*4} fill={c.ivory} motif="bar"/>
  <SpeedLines name="Style arc lower" x={1090} y={925} rotation={-12} scale={.8} opacity={.7}/>
 </Frame>;
}
