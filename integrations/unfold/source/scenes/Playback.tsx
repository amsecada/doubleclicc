import React from 'react';
import {Interactive,useCurrentFrame,useVideoConfig} from 'remotion';
import {Arrow,Frame,StoryCard} from '../components';
import {colors as c,mix,progress,settle} from '../motion';

export function Playback(){
 const f=useCurrentFrame(),{fps}=useVideoConfig();
 const arrive=settle(f,fps,.25*fps),turn=mix(-14,-6,progress(f,1.1*fps,4.8*fps));
 return <Frame name="The story plays" background={c.lime}>
  <Interactive.G name="Orbit behind the cards" transform={`translate(960 540) rotate(${turn})`}><Interactive.Ellipse name="Full playback orbit" rx={790} ry={220} fill="none" stroke={c.ink} strokeWidth={8}/></Interactive.G>
  <StoryCard name="Orbiting vermilion card" x={mix(700,545,arrive)} y={mix(450,365,arrive)} scale={.96} rotation={mix(6,-14,arrive)} fill={c.orange} ink={c.lime} motif="dot"/>
  <StoryCard name="Orbiting lilac card" x={mix(1180,1370,arrive)} y={mix(550,685,arrive)} scale={.96} rotation={mix(0,13,arrive)} fill={c.lilac} ink={c.lime} motif="rings"/>
  <Interactive.Circle name="Playback disc" cx={960} cy={535} r={mix(40,282,arrive)} fill={c.ivory}/>
  <Arrow name="Swipe arrow resolves" x={960} y={535} scale={.9} opacity={1-progress(f,.2*fps,.65*fps)}/>
  <Interactive.G name="Play icon" opacity={progress(f,.35*fps,.8*fps)} transform={`translate(988 535) rotate(${mix(-35,0,arrive)}) scale(${mix(.25,1.5,arrive)})`}><Interactive.Path name="Play triangle" d="M-86-122Q-86-145-65-132L122-15Q147 0 122 15L-65 132Q-86 145-86 122Z" fill={c.ink}/></Interactive.G>
  <Interactive.G name="Orbit across the foreground" transform={`translate(960 540) rotate(${turn})`}><Interactive.Path name="Foreground orbit arc" d="M-790 0A790 220 0 0 0 790 0" fill="none" stroke={c.ink} strokeWidth={8}/></Interactive.G>
  <Interactive.G name="Playback progress marker" transform={`translate(960 540) rotate(${turn})`}><Interactive.Circle name="Moving timeline bead" cx={790*Math.cos((f/fps)*.85+Math.PI)} cy={220*Math.sin((f/fps)*.85+Math.PI)} r={13} fill={c.ink}/></Interactive.G>
 </Frame>;
}
