import Dot from './dot';
import Scene from './scene';
import Data from './data';
import UI from './ui';

"use strict"
!(() => {
    const obj = {
        isRun: true,
        isPause: false,
        loopTimeout: 100,
        loopTimer: null,
        data: null,
        scene: null,
        cellSize: 10,
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
            #mainElement{
              width:100px;
              height:100px;
              --background-color: rgba(255,0,0,0.3);
              position: fixed;
              top: ${obj.cellSize}px;
              left: ${obj.cellSize}px;
            }
            #isPaint{
            }
            #Clear{
            }
            .button.active{
              background-color: rgba(255,255,127,1);
            }
            .button{
              transition: background-color 0.25s 0s ease-out,
                          color 0.15s 0s ease-out;
                          box-shadow 0.25s 0s ease-out;
              background-color: rgba(255,255,255,1);
              text-align: center;
              cursor: pointer;
              margin-bottom:0.5em;
              border-radius: 2em;
              padding: 0.5em 0.15em;
              box-shadow: 0px 0px 3px 0px rgba(0,0,0,0.8),
                          0px 0px 10px 0px rgba(0,0,0,0.5);
            }
            .button:hover,
            .button:active,
            .button:focus{
              background-color: rgba(64,64,64,1);
              color: white;
              box-shadow: 0px 0px 1px 0px rgba(0,0,0,0.6),
                          0px 0px 5px 0px rgba(0,0,0,0.3);
            }
            .button.active:hover,
            .button.active:active,
            .button.active:focus{
              background-color: rgba(127,127,64,1);
              color: white;
              box-shadow: 0px 0px 1px 0px rgba(0, 0, 64, 0.6),
                          0px 0px 5px 0px rgba(0, 0, 64, 0.3);
            }
            .scene{
              background-color: rgba(255,255,255,1);
              width: ${obj.data.width * obj.cellSize}px;
              height: ${obj.data.height * obj.cellSize}px;
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
    obj.switchPause = () => {
      obj.isPause = !obj.isPause;
    };
    obj.init = () => {
      // obj.ui.log();
      obj.data = new Data({
        cellSize: obj.cellSize
      });
      obj.scene = new Scene({
        data: obj.data.data,
        colors: obj.colors
      });
      obj.ui = new UI({
        main: obj,
        scene: obj.scene,
        data: obj.data,
      });
      obj.data.data.forEach(itemY=>itemY.forEach(itemX => obj.scene.element.appendChild(obj.scene.createCell())));
      document.body.appendChild(obj.scene.element);
      obj.addStyles();
      const colors = [
        'rgba(10, 75, 115, 1)',
        'rgba(7, 42, 64, 1)',
        'rgba(17, 160, 217, 1)',
        'rgba(82, 197, 242, 1)',
        'rgba(160, 219, 242, 1)',
      ];
      colors.forEach((item, i) => {
        obj.colors.push(item);
        obj.data.addMutate(
          new Dot({
            name: `Dot${i}-Type${i + 1}`,
            type: i + 1,
            speed: 1,
            x: 200,
            y: 200,
            dx: 1,
            dy: -1,
            matrix: obj.data.data
          })
        );
      });
    };

    obj.loop = () => {
      if(!obj.isPause){
        obj.data.mutatate();
        obj.scene.render();
      }
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
