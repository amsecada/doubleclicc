import React from 'react';
import {Easing,Interactive,interpolate,useCurrentFrame,useVideoConfig} from 'remotion';
import {Frame,SpeedLines,StoryCard,Strip} from '../components';
import {colors as c,mix,progress,settle} from '../motion';

export function Transformation(){
 const f=useCurrentFrame(),{fps}=useVideoConfig();
 const consume=interpolate(f,[1.2*fps,3.6*fps],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp',easing:Easing.inOut(Easing.cubic)}),arrive=settle(f,fps,2*fps);
 return <Frame name="Content becomes a story" background={c.orange}>
  <SpeedLines name="Upper source-to-story path" x={mix(720,1190,progress(f,0,4.2*fps))} y={200} rotation={-6} opacity={.8}/>
  <Interactive.Circle name="Transformation aperture" cx={960} cy={540} r={mix(190,263,settle(f,fps,.16*fps))} fill={c.ink}/>
  <Strip name="Source strip one" x={mix(360,960,consume)} y={mix(300,540,consume)} width={490} rotation={mix(20,0,consume)} scale={mix(1,.025,consume)} opacity={1-consume}/>
  <Strip name="Source strip two" x={mix(290,960,consume)} y={mix(420,540,consume)} width={520} rotation={mix(8,0,consume)} fill={c.ink} ink={c.ivory} scale={mix(1,.025,consume)} opacity={1-consume}/>
  <Strip name="Source strip three" x={mix(290,960,consume)} y={540} width={550} rotation={mix(-3,0,consume)} scale={mix(1,.025,consume)} opacity={1-consume}/>
  <Strip name="Source strip four" x={mix(320,960,consume)} y={mix(670,540,consume)} width={500} rotation={mix(-12,0,consume)} fill={c.ink} ink={c.ivory} scale={mix(1,.025,consume)} opacity={1-consume}/>
  <Strip name="Source strip five" x={mix(390,960,consume)} y={mix(790,540,consume)} width={430} rotation={mix(-23,0,consume)} scale={mix(1,.025,consume)} opacity={1-consume}/>
  <StoryCard name="Emerging lilac layer" x={mix(960,1630,arrive)} y={565} scale={mix(0,.88,arrive)} rotation={13} fill={c.lilac} motif="asterisk"/>
  <StoryCard name="Emerging lime layer" x={mix(960,1550,arrive)} y={535} scale={mix(0,.91,arrive)} rotation={10} fill={c.lime} motif="rings"/>
  <StoryCard name="Resolved visual story" x={mix(960,1465,arrive)} y={510} scale={mix(0,.95,arrive)} rotation={mix(-15,5,arrive)} fill={c.ivory} motif="rings"/>
  <SpeedLines name="Lower source-to-story path" x={mix(650,1080,progress(f,0,4.2*fps))} y={920} rotation={-6} opacity={.65}/>
 </Frame>;
}
