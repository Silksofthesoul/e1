import Base from './base';

'use strict';
class Data extends Base{
  #data = [];
  #width = 64;
  #height = 64;
  #cellSize = 10;
  #mutations = [];
  #isErase = false;
  constructor(arg = {}) {
    super();
    const props = {
      ...arg
    };

    this.#cellSize = props.cellSize;
    this.initWidth();
    this.initHeight();
    this.init();
  }

  initWidth() {
    this.#width = parseInt(Math.floor((window.innerWidth / this.#cellSize) -4));
  }
  initHeight() {
    this.#height = parseInt(Math.floor((window.innerHeight / this.#cellSize) -4));
  }

  init () {
    for(let y =0; y < this.#height; y++){
      this.#data.push([]);
      for(let x = 0; x < this.#width; x++){
        this.#data[y].push(0);
      }
    }
  }
  addMutate (mutant) {
      this.#mutations.push(mutant);
  }
  mutatate () {
    for(let mutation of this.#mutations) {
        let [oldCoords, x, y] = [{...mutation.coordsVirtual}, null, null];
        let oldVal = this.#data[oldCoords.y][oldCoords.x];
        mutation.step();
        y = mutation.yVirtual;
        x = mutation.xVirtual;

        this.#data[y][x] = mutation.type;
        if(this.#data[y][x] === oldVal){
          if(this.#isErase){
            this.#data[oldCoords.y][oldCoords.x] = 0;
          }
        }
    }
  }

  erase() {
    this.#data.forEach((item, y) => this.#data[y].forEach((item, x)=>this.#data[y][x] = 0));
  }

  switchErase () {
    this.#isErase = !this.#isErase;
  }
  get isErase() { return this.#isErase; }
  get data () { return this.#data; }
  get width () { return this.#width; }
  get height () { return this.#height; }
}

export default Data;
