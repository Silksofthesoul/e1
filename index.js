import Dot from './dot';
import Scene from './scene';
import Data from './data';
import UI from './ui';
import Styles from './styles';
import getColors from './colors';
import lib from './library';

'use strict';
!(() => {
  const obj = {
    styles: null,
    isRun: true,
    isPause: false,
    loopTimeout: 100,
    loopTimer: null,
    data: null,
    scene: null,
    cellSize: 10,
    colors: ['rgb(255, 255, 255)'],
  };
  const colorsSet = getColors();
  obj.switchPause = () => {
    obj.isPause = !obj.isPause;
  };
  obj.init = () => {
    const colors = colorsSet[lib.RMXI(0, colorsSet.length - 1)];
    obj.colors = colors;
    obj.colors.sort((a, b)=>(Math.round(Math.random())-0.5));
    obj.styles = new Styles();
    obj.styles.append();

    obj.data = new Data({
      cellSize: obj.cellSize,
    });
    obj.scene = new Scene({
      data: obj.data.data,
      colors: obj.colors,
    });
    obj.ui = new UI({
      main: obj,
      scene: obj.scene,
      data: obj.data,
      colors: colorsSet,
      styles: obj.styles
    });
    obj.data.data.forEach((itemY) => itemY.forEach((itemX) => obj.scene.element.appendChild(obj.scene.createCell())));
    document.body.appendChild(obj.scene.element);

    obj.styles.setStyles({
      backgroundColor: obj.colors[0],
      width: obj.data.width,
      height: obj.data.height,
      cellSize: obj.cellSize,
    });

    const initDirectionX = lib.RMXI(-360, 360);
    const initDirectionY = lib.RMXI(-360, 360);

    const initX = lib
    .RMXI(Math
      .floor(obj.data.width / 3),
      Math
      .floor(obj.data.width - obj.data.width / 3)) * 10;
    const initY = lib
    .RMXI(Math
      .floor(obj.data.height / 3),
      Math
      .floor(obj.data.height - obj.data.height / 3)) * 10;
    colors.forEach((item, i) => {
      obj.colors.push(item);
      obj.data.addMutate(
        new Dot({
          name: `Dot${i}-Type${i + 1}`,
          type: i + 1,
          speed: 1,
          x: initX,
          y: initY,
          dx: initDirectionX,
          dy: initDirectionY,
          matrix: obj.data.data,
        }),
      );
    });
  };

  obj.loop = () => {
    if (!obj.isPause) {
      obj.data.mutatate();
      obj.scene.render();
    }
    if (obj.isRun) {
      obj.loopTimer = requestAnimationFrame(obj.loop);
    } else {
      cancelAnimationFrame(obj.loopTimer);
    }
  };

  obj.run = () => {
    obj.init();
    obj.loop();
  };

  obj.run();
})();
