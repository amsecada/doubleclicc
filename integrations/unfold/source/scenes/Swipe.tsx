import React from 'react';
import {Interactive,useCurrentFrame,useVideoConfig} from 'remotion';
import {Arrow,Frame,SpeedLines,StoryCard} from '../components';
import {colors as c,mix,progress,settle} from '../motion';

export function Swipe(){
 const f=useCurrentFrame(),{fps}=useVideoConfig();
 const entrance=settle(f,fps,.12*fps);
 const second=progress(f,1.15*fps,2.05*fps),third=progress(f,2.45*fps,3.35*fps);
 const orangeScale=mix(mix(.72,1.43,entrance),.68,second)-third*.16;
 const ivoryScale=mix(.68,1.43,second)-third*.75;
 const blackScale=mix(.52,.68,second)+third*.75;
 return <Frame name="A story worth swiping" background={c.lilac}>
  <SpeedLines name="Swipe upper trail" x={760+second*240+third*240} y={150} rotation={-7} scale={.8} opacity={.55}/>
  <Interactive.Ellipse name="Active card depth shadow" cx={960} cy={900} rx={210+12*Math.sin(f/fps*3)} ry={22} fill={c.ink} opacity={.11}/>
  {/* The incoming card is painted last at each handoff, so it actually comes forward. */}
  {second>=.5&&<StoryCard name="Vermilion card receding" x={960-second*480-third*250} y={mix(500,580,second)+third*35} scale={orangeScale} rotation={mix(-10,0,entrance)-second*12-third*5} fill={c.orange} motif="dot" opacity={1-second*.73-third*.12} blur={second*2.8+third*1.2}/>}
  {third<.5&&<StoryCard name="Black card in the distance" x={1670-second*230-third*480} y={620-second*40-third*80} scale={blackScale} rotation={17-second*5-third*12} fill={c.ink} ink={c.ivory} motif="asterisk" motifRotation={mix(-45,0,third)} opacity={.14+second*.13+third*.73} blur={4-second*1.2-third*2.8}/>}
  <StoryCard name="Ivory card taking focus" x={1440-second*480-third*480} y={580-second*80+third*80} scale={ivoryScale} rotation={12-second*12-third*12} fill={c.ivory} motif="rings" opacity={.27+second*.73-third*.73} blur={2.8-second*2.8+third*2.8}/>
  {third>=.5&&<StoryCard name="Black card taking focus" x={1670-second*230-third*480} y={620-second*40-third*80} scale={blackScale} rotation={17-second*5-third*12} fill={c.ink} ink={c.ivory} motif="asterisk" motifRotation={mix(-45,0,third)} opacity={.14+second*.13+third*.73} blur={Math.max(0,4-second*1.2-third*2.8)}/>}
  {second<.5&&<StoryCard name="Vermilion card popping forward" x={960-second*480-third*250} y={mix(500,580,second)+third*35} scale={orangeScale} rotation={mix(-10,0,entrance)-second*12-third*5} fill={c.orange} motif="dot" opacity={1-second*.73-third*.12} blur={second*2.8+third*1.2}/>}
  <Arrow name="Swipe impulse arrow" x={mix(220,570,progress(f,.35*fps,1.65*fps))} y={760} scale={mix(.85,.55,second)} opacity={1-progress(f,1.15*fps,1.65*fps)}/>
  <Interactive.Circle name="First position dot" cx={900} cy={975} r={mix(18,10,second)} fill={second<.5?c.ivory:c.ink}/>
  <Interactive.Circle name="Second position dot" cx={960} cy={975} r={10+8*second-8*third} fill={second>=.5&&third<.5?c.ivory:c.ink}/>
  <Interactive.Circle name="Third position dot" cx={1020} cy={975} r={mix(10,18,third)} fill={third>=.5?c.ivory:c.ink}/>
 </Frame>;
}
