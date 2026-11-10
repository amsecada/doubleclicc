import {cancelRender,continueRender,delayRender,staticFile} from 'remotion';

// Native FontFace API keeps this source portable without another dependency.
if(typeof document!=='undefined'){
 const handle=delayRender('Load bundled Noto Sans Black');
 const face=new FontFace('UnfoldBlack',`url(${staticFile('NotoSans-Black.ttf')})`,{weight:'900',style:'normal'});
 face.load().then(font=>{document.fonts.add(font);continueRender(handle);}).catch(error=>cancelRender(error));
}
