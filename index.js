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
        color: ['rgb(255, 255, 255)']
    };
    class Dot {
      #matrix = [[0]];
      #coords = {x: 0, y: 0};
      #direction = {x: 0, y: 0};
      #speed = 1;
      #type = 0;
      _name = 'unnamed';
      constructor(arg = {}) {
        const props = {
          x: this.x,
          y: this.y,
          speed: this.#speed,
          dx: this.dx,
          dy: this.dy,
          matrix: this.#matrix,
          type: arg.type || this.#type,
          name: this._matrix,
          ...arg
        }
        this.#matrix = props.matrix;
        this.#type = props.type;
        this.#speed = props.speed;
        this.x = props.x;
        this.y = props.y;
        this.dx = props.dx;
        this.dy = props.dy;

        this._name = props.name;
        this.checkCoords();
      }

      // Name
      get name() { return this._name;}

      // Type
      get type() { return this.#type;}

      // Speed
      get speed() { return this.#speed;}
      set speed(newVal) { this.#speed = newVal;}

      // Coords
      get x() { return this.#coords.x;}
      get y() { return this.#coords.y;}
      get xVirtual() { return parseInt(Math.floor(this.#coords.x / 10));}
      get yVirtual() { return parseInt(Math.floor(this.#coords.y / 10));}
      get coords() { return this.#coords;}
      get coordsVirtual() { return { x: this.xVirtual, y: this.yVirtual };}

      set x(x) { this.#coords.x = this.checkCoordX(x);}
      set y(y) { this.#coords.y = this.checkCoordY(y);}


      set coords(arg) {
        this.#coords.x = this.checkCoordX(arg.x);
        this.#coords.y = this.checkCoordY(arg.y);
      }

      checkCoords() {
        this.x  = this.checkCoordX(this.x);
        this.y  = this.checkCoordY(this.y);
      }
      checkCoordX(coordX) {
        const min = 0;
        const max = (this.getMatrixWidth() - 1) * 10;
        if(coordX < min) return min*3;
        if(coordX > max) return max;
        return coordX;
      }
      checkCoordY(coordY) {
        const min = 0
        const max = (this.getMatrixHeight() - 1) * 10;
        if(coordY < min) return min;
        if(coordY > max) return max;
        return coordY;
      }

      step() {
        let [mutateX, mutateY] = [obj.RMXI(-2, 2), obj.RMXI(-2, 2)];
        // let [oldDX, oldDY] = [this.dx, this.dy];
        let maxMatrixX = (this.getMatrixWidth() - 3) * 10;
        let maxMatrixY = (this.getMatrixHeight() -  3) * 10;
        let isTouched = false;
        const step = (key, mutate) => {
          this.speed += 0.01;
          if(this.speed > 20) this.speed = 1;
          // console.log('!!', this.speed);
          this[key] += ((this[`d${key}`] + mutate) * parseInt(Math.floor(this.speed)));
        }
        const changeDX = () => {
          isTouched = true;
          this.dx = -this.dx;
          step('x', mutateX);
        };
        const changeDY = () => {
          isTouched = true;
          this.dy = -this.dy;
          step('y', mutateY);
        };

        if(this.x < 3 || this.x > maxMatrixX) {
          if(this.x < 3) {this.x = 3}
          if(this.x > maxMatrixX) {this.x = maxMatrixX}
          changeDX();
        }
        if(this.y < 3 || this.y > maxMatrixY) {
          if(this.y < 3) {this.y = 3}
          if(this.y > maxMatrixY) {this.y = maxMatrixY}
          changeDY();
        }

        if(!isTouched){
          step('x', 0);
          step('y', 0);
        }
        this.checkCoords();
      }

      // direction
      get dx() { return this.#direction.x}
      get dy() { return this.#direction.y}
      get direction() {return this.#direction;}

      set dx(dx) { this.#direction.x = dx;}
      set dy(dy) { this.#direction.y = dy;}

      // Matrix
      get matrix() { return this.#matrix;}
      getMatrixWidth() { return this.#matrix[0].length;}
      getMatrixHeight() { return this.#matrix.length;}
      getMatrixCell(arg) { return this.#matrix[arg.y][arg.x];}

      // Self
      log(){
        console.table(this);
      }
    }

    obj.addStyles = () => {
        const styles = `
            body {
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
        let el = document.createElement('div');
        el.id = 'scene';
        el.classList.add('scene');
        obj.scene = el;
        document.body.appendChild(obj.scene);
    };

    obj.initData = () => {
        for(let y =0; y<obj.dataHeight; y++){
            obj.data.push([]);
            for(let x =0; x<obj.dataWidth; x++){
                obj.data[y].push(0);
                obj.scene.appendChild(obj.createCell());
            }
        }
    };

    obj.addMutate = (mutant) => {
        obj.mutations.push(mutant);
    };
    obj.RMXI =  (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,

    obj.init = () => {
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
          obj.color.push(item);
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

    obj.createCell = () => {
        let el = document.createElement('div');
        el.classList.add('cell');
        return el;
    };

    obj.render = () => {
        let counter = 0;
        obj.data.forEach((itemY, y) => {
            obj.data[y].forEach((itemX, x) => {
                let coord = obj.data[y][x];
                obj.scene.children[counter]
                .style.backgroundColor = obj.color[coord];
                if(coord !== 0){
                  // obj.scene.children[counter]
                  // .style.outline = '2px solid rgba(0, 0, 0, 0.4)';
                }

                counter++;
            });
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
        obj.render();
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
