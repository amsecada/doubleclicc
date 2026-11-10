import React from 'react';
import {useCurrentFrame,useVideoConfig} from 'remotion';
import {Arrow,Frame,SpeedLines,StoryCard,Wordmark} from '../components';
import {colors as c,mix,progress,settle} from '../motion';

export function Release(){
 const f=useCurrentFrame(),{fps}=useVideoConfig();
 const arrive=settle(f,fps,.2*fps),brand=progress(f,.45*fps,1.35*fps);
 return <Frame name="Return to the Unfold identity" background={c.ivory}>
  <SpeedLines name="Upper brand trail" x={mix(800,1200,progress(f,.15*fps,1.8*fps))} y={300} rotation={-7} scale={.8} opacity={brand*.7}/>
  <SpeedLines name="Lower brand trail" x={mix(750,1250,progress(f,.25*fps,1.9*fps))} y={825} rotation={-7} scale={.75} opacity={brand*.7}/>
  <StoryCard name="Lilac card returns to the brand" x={mix(1370,1710,arrive)} y={mix(685,535,arrive)+Math.sin(Math.min(1,arrive)*Math.PI)*90} scale={mix(.96,.7,arrive)} rotation={mix(13,10,arrive)} fill={c.lilac} motif="asterisk" motifRotation={mix(45,0,progress(f,.2*fps,1.6*fps))}/>
  <StoryCard name="Lime card joins the brand" x={mix(960,1510,arrive)} y={mix(535,505,arrive)} scale={mix(0,.73,arrive)} rotation={mix(-10,8,arrive)} fill={c.lime} motif="rings" opacity={progress(f,.25*fps,.55*fps)}/>
  <StoryCard name="Vermilion card returns to the brand" x={mix(545,1310,arrive)} y={mix(365,550,arrive)-Math.sin(Math.min(1,arrive)*Math.PI)*120} scale={mix(.96,.71,arrive)} rotation={mix(-14,8,arrive)} fill={c.orange} motif="dot"/>
  <Wordmark x={mix(-300,105,brand)} opacity={brand}/>
  <Arrow name="Unfold identity arrow" x={mix(950,1150,brand)} y={555} scale={.54} rotation={mix(0,-32,brand)} opacity={brand}/>
 </Frame>;
}
