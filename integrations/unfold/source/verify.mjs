import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {readFileSync,existsSync,statSync} from 'node:fs';
import {createHash} from 'node:crypto';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const manifest=JSON.parse(readFileSync(path.join(root,'manifest.json'),'utf8'));
const copy=JSON.parse(readFileSync(path.join(root,manifest.copy),'utf8'));
assert.equal(manifest.owner,'Doubleclicc website');
assert.equal(manifest.video.src,'unfold-showcase.mp4','Do not publish a pending or broken video path.');
const file=path.join(root,manifest.video.src);
const probe=JSON.parse(execFileSync('ffprobe',['-v','error','-show_streams','-show_format','-of','json',file],{encoding:'utf8'}));
const video=probe.streams.find(s=>s.codec_type==='video');
assert.equal(video.codec_name,'h264');assert.equal(video.pix_fmt,'yuv420p');
assert.equal(video.color_space,'bt709');assert.equal(video.color_range,'tv');
assert.equal(video.width,1920);assert.equal(video.height,1080);assert.equal(video.r_frame_rate,'30/1');
assert.equal(Number(video.nb_frames),720);assert.equal(Number(probe.format.duration),24);
assert.equal(probe.streams.some(s=>s.codec_type==='audio'),false);
assert.equal(statSync(file).size,manifest.video.bytes);
assert.equal(createHash('sha256').update(readFileSync(file)).digest('hex'),manifest.video.sha256);
assert.equal(copy.media.video,manifest.video.src);
for(const relative of [manifest.poster.src,manifest.reducedMotionFallback,'poster.png','index.html','preview.html','source/index.tsx','source/public/NotoSans-Black.ttf','source/public/FONT-LICENSE.txt',...manifest.stills.map(s=>s.src)]){
 const resolved=path.resolve(root,relative);assert.ok(resolved.startsWith(root+path.sep));assert.ok(existsSync(resolved),`Missing website asset: ${relative}`);
}
execFileSync('ffmpeg',['-v','error','-i',file,'-f','null','-'],{stdio:'pipe'});
console.log('PASS: H.264/yuv420p BT.709, native1920×1080,24seconds/720frames/30fps,silent; SHA-256 and file paths match; full decode succeeds.');
