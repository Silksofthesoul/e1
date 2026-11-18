import test from 'node:test';
import assert from 'node:assert/strict';
const {default: Scene}=await import(`${process.env.SOURCE||new URL('..',import.meta.url).pathname}/scene.js`);
let writes=0;
global.document={createElement:()=>({id:'',classList:{add(){}},style:{set backgroundColor(v){this.color=v;writes++},get backgroundColor(){return this.color}}})};
test('steady frames do zero DOM writes; only changed cells are repainted',()=>{
 const data=Array.from({length:100},()=>Array(100).fill(0));
 const scene=new Scene({data,colors:['white','black','blue']});
 const cells=Array.from({length:10000},()=>scene.createCell());writes=0;
 scene.render();assert.equal(writes,10000);writes=0;
 for(let i=0;i<100;i++)scene.render();assert.equal(writes,0);
 data[20][30]=1;data[40][50]=2;scene.render();assert.equal(writes,2);
 assert.equal(cells[2030].style.backgroundColor,'black');assert.equal(cells[4050].style.backgroundColor,'blue');
 data[20][30]=0;scene.render();assert.equal(writes,3);
});
test('clear scene, clear data, palette replacement and paused redraw remain correct',()=>{
 const data=[[0,1],[2,1]],scene=new Scene({data,colors:['white','black','blue']});
 const cells=Array.from({length:4},()=>scene.createCell());scene.render();scene.erase();
 assert.ok(cells.every(c=>c.style.backgroundColor==='white'));
 scene.render();assert.deepEqual(cells.map(c=>c.style.backgroundColor),['white','black','blue','black']);
 scene.colors=['yellow','red','green'];scene.render();assert.deepEqual(cells.map(c=>c.style.backgroundColor),['yellow','red','green','red']);
 data.forEach(row=>row.fill(0));scene.render();assert.ok(cells.every(c=>c.style.backgroundColor==='yellow'));
});
