import Dot from './dot';
import Scene from './scene';
import lib from './library';
"use strict"
!(() => {
    const obj = {
        isRun: true,
        loopTimeout: 100,
        loopTimer: null,
        data: [],
        dataWidth: 64,
        dataHeight: 64,
        scene: null,
        cellSize: 10,
        mutations: [],
        colors: ['rgb(255, 255, 255)']
    };

    obj.addStyles = () => {
        const styles = `
            body {
              --overflow: hidden;
              background-color: rgba(0,0,0,0.6);
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-content: center;
              align-items: center;
              width: 100vw;
              height: 100vh;
              padding: 0;
              margin: 0;
            }
            .scene{
              background-color: rgba(255,255,255,1);
              width: ${obj.dataWidth * obj.cellSize}px;
              height: ${obj.dataHeight * obj.cellSize}px;
              display: flex;
              justify-content: flex-start;
              flex-direction: row;
              flex-wrap: wrap;
              --transform: rotate(45deg) scale(2);
            }
            .cell{
                width: ${obj.cellSize}px;
                height: ${obj.cellSize}px;
                outline: 1px solid rgba(127, 127, 127, 0.2);
            }
        `;
        let el = document.createElement('style');
        el.innerText = styles
            .replace(/[\r\n]/igm,'')
            .replace(/[\t]/igm,' ')
            .replace(/\s{2,}/igm,' ');
        document.head.appendChild(el);
    };

    obj.createScene = () => {
        obj.scene = new Scene({
          data: obj.data,
          colors: obj.colors
        });
        document.body.appendChild(obj.scene.element);
    };

    obj.initData = () => {
        for(let y =0; y<obj.dataHeight; y++){
            obj.data.push([]);
            for(let x =0; x<obj.dataWidth; x++){
                obj.data[y].push(0);
                obj.scene.element.appendChild(obj.scene.createCell());
            }
        }
    };

    obj.addMutate = (mutant) => {
        obj.mutations.push(mutant);
    };

    obj.init = () => {
        obj.dataWidth = parseInt(Math.floor((window.innerWidth / obj.cellSize) - 3));
        obj.dataHeight = parseInt(Math.floor((window.innerHeight / obj.cellSize) - 3));
        document.body.innerHTML = '';
        document.head.innerHTML = '';

        obj.addStyles();
        obj.createScene();
        obj.initData();
        const colors = [
          'rgba(10, 75, 115, 1)',
          'rgba(7, 42, 64, 1)',
          'rgba(17, 160, 217, 1)',
          'rgba(82, 197, 242, 1)',
          'rgba(160, 219, 242, 1)',
        ];
        colors.forEach((item, i) => {
          obj.colors.push(item);
          obj.addMutate(
            new Dot({
              name: `Dot${i}-Type${i + 1}`,
              type: i + 1,
              speed: 1,
              x: 200,
              y: 200,
              dx: 1,
              dy: -1,
              matrix: obj.data
            })
          );
        });
    };

    obj.mutatate = () => {
      for(let mutation of obj.mutations) {
          let [oldCoords, x, y] = [{...mutation.coordsVirtual}, null, null];
          let oldVal = obj.data[oldCoords.y][oldCoords.x];
          mutation.step();
          y = mutation.yVirtual;
          x = mutation.xVirtual;

          obj.data[y][x] = mutation.type;
          if(obj.data[y][x] === oldVal){
            // obj.data[oldCoords.y][oldCoords.x] = 0;
          }
      }
    };

    obj.loop = () => {
        obj.mutatate();
        obj.scene.render();
        if(obj.isRun){
            obj.loopTimer = requestAnimationFrame(obj.loop);
        }else{
            cancelAnimationFrame(obj.loopTimer);
        }
    };

    obj.run = () => {
        obj.init();
        obj.loop();
    };

    obj.run();
})();
