import React from 'react';
import {useCurrentFrame,useVideoConfig} from 'remotion';
import {Arrow,Frame,SpeedLines,StoryCard,Wordmark} from '../components';
import {colors as c,mix,progress,settle} from '../motion';

export function Opening(){
 const f=useCurrentFrame(),{fps}=useVideoConfig();
 return <Frame name="Brand entrance" background={c.ivory}>
  <SpeedLines name="Upper motion trail" x={mix(500,1200,progress(f,0,2*fps))} y={300} rotation={-7} scale={.8} opacity={progress(f,.2*fps,.5*fps)*.7}/>
  <SpeedLines name="Lower motion trail" x={mix(450,1250,progress(f,0,2*fps))} y={825} rotation={-7} scale={.75} opacity={progress(f,.3*fps,.7*fps)*.7}/>
  <StoryCard name="Lilac asterisk card" x={mix(2040,1710,settle(f,fps,.42*fps))} y={535} scale={.7} rotation={mix(24,10,settle(f,fps,.42*fps))} fill={c.lilac} motif="asterisk" motifRotation={mix(-45,0,progress(f,.5*fps,1.8*fps))} opacity={progress(f,.42*fps,.48*fps)}/>
  <StoryCard name="Lime concentric card" x={mix(1900,1510,settle(f,fps,.3*fps))} y={505} scale={.73} rotation={mix(15,8,settle(f,fps,.3*fps))} fill={c.lime} motif="rings" opacity={progress(f,.3*fps,.36*fps)}/>
  <StoryCard name="Vermilion circle card" x={mix(1700,1310,settle(f,fps,.18*fps))} y={550} scale={.71} rotation={mix(-18,8,settle(f,fps,.18*fps))} fill={c.orange} opacity={progress(f,.18*fps,.24*fps)}/>
  <Wordmark x={mix(65,105,settle(f,fps))}/>
  <Arrow name="Wordmark release arrow" x={mix(1050,1150,progress(f,.2*fps,1.2*fps))} y={555} scale={.54} rotation={-32}/>
 </Frame>;
}
