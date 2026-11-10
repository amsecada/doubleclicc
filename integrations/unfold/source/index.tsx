import React from 'react';
import {Composition,Folder,registerRoot} from 'remotion';
import {Film} from './Film';
import {Opening} from './scenes/Opening';
import {Transformation} from './scenes/Transformation';
import {VisualVoices} from './scenes/VisualVoices';
import {Swipe} from './scenes/Swipe';
import {Playback} from './scenes/Playback';
import {Release} from './scenes/Release';
import './font';

const Root=()=> <>
 <Composition id="UnfoldShowcase" component={Film} width={1920} height={1080} fps={30} durationInFrames={720}/>
 <Folder name="Scenes">
  <Composition id="Opening" component={Opening} width={1920} height={1080} fps={30} durationInFrames={108}/>
  <Composition id="Transformation" component={Transformation} width={1920} height={1080} fps={30} durationInFrames={162}/>
  <Composition id="VisualVoices" component={VisualVoices} width={1920} height={1080} fps={30} durationInFrames={126}/>
  <Composition id="Swipe" component={Swipe} width={1920} height={1080} fps={30} durationInFrames={126}/>
  <Composition id="Playback" component={Playback} width={1920} height={1080} fps={30} durationInFrames={156}/>
  <Composition id="Release" component={Release} width={1920} height={1080} fps={30} durationInFrames={132}/>
 </Folder>
</>;
registerRoot(Root);
