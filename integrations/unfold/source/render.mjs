import {bundle} from '@remotion/bundler';
import {openBrowser,selectComposition,renderMedia,renderStill} from '@remotion/renderer';
import {existsSync} from 'node:fs';
import {mkdir,mkdtemp,rm,writeFile} from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import {fileURLToPath} from 'node:url';

const here=path.dirname(fileURLToPath(import.meta.url));
const target=path.resolve(here,'..');
const checks=path.resolve(target,'../checks');
const temp=await mkdtemp(path.join(os.tmpdir(),'unfold-film-render-'));
await mkdir(checks,{recursive:true});
const candidate=[1248,1243,1234].map(v=>path.join(os.homedir(),`.cache/ms-playwright/chromium_headless_shell-${v}/chrome-headless-shell-linux64/chrome-headless-shell`)).find(existsSync);
const browserExecutable=process.env.REMOTION_BROWSER_EXECUTABLE||candidate;
let browser;
try{
 const serveUrl=await bundle({entryPoint:path.join(here,'index.tsx'),rootDir:here,publicDir:path.join(here,'public'),outDir:path.join(temp,'bundle'),enableCaching:false});
 browser=await openBrowser('chrome',{browserExecutable,logLevel:'error'});
 const common={serveUrl,puppeteerInstance:browser,logLevel:'error'};
 const composition=await selectComposition({...common,id:'UnfoldShowcase'});
 if(composition.width!==1920||composition.height!==1080||composition.fps!==30||composition.durationInFrames!==720)throw new Error('Unexpected film dimensions or timing.');
 const frameArgument=process.argv.find(a=>a.startsWith('--frames='));
 const frames=frameArgument?frameArgument.slice(9).split(',').map(Number):process.argv.includes('--stills')?[75,155,310,425,540,700]:[75];
 if(frames.some(f=>!Number.isInteger(f)||f<0||f>=720))throw new Error('Inspection frames must be integers from0through719.');
 for(const frame of frames){
  const output=frame===75?path.join(target,'poster.png'):path.join(checks,`frame-${frame}.png`);
  await renderStill({...common,composition,frame,output,imageFormat:'png'});
  console.log(`Still ready: frame ${frame}`);
 }
 if(!process.argv.includes('--stills')){
  let last=-1;
  await renderMedia({...common,composition,codec:'h264',pixelFormat:'yuv420p',colorSpace:'bt709',imageFormat:'png',crf:18,concurrency:2,muted:true,outputLocation:path.join(target,'unfold-showcase.mp4'),onProgress:({progress})=>{const step=Math.floor(progress*10);if(step!==last){last=step;console.log(`Render ${Math.min(100,step*10)}%`);}}});
  console.log('MP4 rendered: 1920×1080, 30fps, 720frames, 24seconds. Decode and visual checks still required.');
 }
 await writeFile(path.join(checks,'render-settings.json'),JSON.stringify({width:1920,height:1080,fps:30,frames:720,durationSeconds:24,codec:'h264',pixelFormat:'yuv420p',colorSpace:'bt709',intermediateFrames:'png',crf:18,audio:false,posterFrame:75,composition:'UnfoldShowcase',browserExecutable:browserExecutable?'Local Chromium runtime':'Remotion-managed runtime'},null,2)+'\n');
}finally{
 if(browser)await browser.close({silent:true});
 await rm(temp,{recursive:true,force:true});
}
