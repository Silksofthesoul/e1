import test from 'node:test';
import assert from 'node:assert/strict';
const root = process.env.SOURCE || new URL('..', import.meta.url).pathname;
const { default: Dot } = await import(`${root}/dot.js`);
const { default: lib } = await import(`${root}/library.js`);
lib.RMXI = (min, max) => min === 10 ? 10 : 0;
const matrix = (w=64, h=64) => Array.from({length:h},()=>Array(w).fill(0));
const near = (a,b) => assert.ok(Math.abs(a-b)<1e-7, `${a} != ${b}`);
const dot = (props) => new Dot({matrix:matrix(),x:300,y:300,dx:100,dy:50,speed:50,...props});
for (const [name,props,expected] of [
  ['right overshoot preserves remaining distance and tangent',{x:609},{x:606,y:302.5,dx:-100,dy:50}],
  ['left overshoot',{x:31,dx:-100},{x:34,y:302.5,dx:100,dy:50}],
  ['bottom overshoot',{y:609,dx:50,dy:100},{x:302.5,y:606,dx:50,dy:-100}],
  ['top overshoot',{y:31,dx:50,dy:-100},{x:302.5,y:34,dx:50,dy:100}],
  ['exact corner hit',{x:605,y:605,dy:100},{x:610,y:610,dx:-100,dy:-100}],
  ['diagonal corner overshoot',{x:609,y:609,dy:100},{x:606,y:606,dx:-100,dy:-100}],
  ['starts at wall moving out',{x:610},{x:605,y:302.5,dx:-100,dy:50}],
  ['starts at wall moving in',{x:610,dx:-100},{x:605,y:302.5,dx:-100,dy:50}],
  ['ordinary free movement unchanged',{}, {x:305,y:302.5,dx:100,dy:50}],
  ['zero velocity remains finite',{dx:0,dy:0},{x:300,y:300,dx:0,dy:0}],
]) test(name,()=>{const d=dot(props);d.step();for(const[k,v]of Object.entries(expected))near(d[k],v);});
// Independent time-of-impact oracle: follow each impact in chronological order.
function oracle(x,y,vx,vy,minX,maxX,minY,maxY) {
  let remaining=1;
  for(let i=0;i<100&&remaining>1e-12;i++){
    const tx=vx>0?(maxX-x)/vx:vx<0?(minX-x)/vx:Infinity;
    const ty=vy>0?(maxY-y)/vy:vy<0?(minY-y)/vy:Infinity;
    const dt=Math.min(remaining,tx,ty);x+=vx*dt;y+=vy*dt;remaining-=dt;
    if(tx===dt)vx=-vx;if(ty===dt)vy=-vy;
  }
  assert.ok(remaining<1e-12);
  // Round-off can leave the last impact a few ulps beyond remaining time.
  if(Math.abs(x-minX)<1e-7)vx=Math.abs(vx);if(Math.abs(x-maxX)<1e-7)vx=-Math.abs(vx);
  if(Math.abs(y-minY)<1e-7)vy=Math.abs(vy);if(Math.abs(y-maxY)<1e-7)vy=-Math.abs(vy);
  return{x,y,dx:Math.sign(vx)*100,dy:Math.sign(vy)*100};
}
test('640 swept trajectories agree with independent time-of-impact oracle',()=>{
  for(const speed of [50,5000,15000,30000,55000])for(const dx of[-100,100])for(const dy of[-100,100])for(let i=0;i<32;i++){
    const x=30+((i*43)%581),y=30+((i*97)%581);
    const d=dot({x,y,dx,dy,speed});
    // Legacy speed oscillator adds0.1 per axis on its first step.
    const expected=oracle(x,y,dx/1000*Math.floor(speed+.1),dy/1000*Math.floor(speed+.2),30,610,30,610);
    d.step();for(const[k,v]of Object.entries(expected)) { try { near(d[k],v); } catch(e) { throw new Error(JSON.stringify({speed,dx,dy,x,y,key:k,actual:d[k],expected:v,position:d.coords})); } }
  }
});
test('random mutations cannot turn an impact back out through a wall',()=>{
  for(const mutation of[-2,-1,0,1,2])for(const axis of['x','y'])for(const sign of[-1,1]){
    lib.RMXI=(min,max)=>min===10?10:min===-2?mutation:0;
    const d=dot({x:axis==='x'?(sign===1?610:30):300,y:axis==='y'?(sign===1?610:30):300,dx:axis==='x'?sign*100:50,dy:axis==='y'?sign*100:50});d.step();assert.equal(Math.sign(d[`d${axis}`]),-sign);
  }
  lib.RMXI=(min,max)=>min===10?10:0;
});
test('100,000 random frames stay finite and within the field',()=>{
  lib.RMXI=(min,max)=>Math.floor(Math.random()*(max-min+1))+min;
  const d=dot({x:609,y:31,dx:359,dy:-357});
  for(let i=0;i<100000;i++){
    d.step();assert.ok(Number.isFinite(d.x)&&Number.isFinite(d.y));assert.ok(d.x>=30&&d.x<=610);assert.ok(d.y>=30&&d.y<=610);
  }
  lib.RMXI=(min,max)=>min===10?10:0;
});
test('small fields and multiple impacts do not loop or produce invalid cells',()=>{
  for(const size of[1,2,4,6,7,8]){
    const d=dot({matrix:matrix(size,size),x:30,y:30,dx:100,dy:100,speed:50000});
    for(let i=0;i<100;i++) {d.step();assert.ok(d.xVirtual>=0&&d.xVirtual<size);assert.ok(d.yVirtual>=0&&d.yVirtual<size);}
  }
});
