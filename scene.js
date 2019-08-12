import lib from './library';

'use strict';
class Scene {
  #id = 'scene';
  #class = 'scene';
  #data = null;
  #colors = null;
  #element = null;
  constructor(arg = {}) {
    const props = {
      id: arg.id || this.#id,
      class: arg.class || this.#class,
      data: arg.data,
      colors: arg.colors,
      ...arg,
    };
    const el = document.createElement('div');
    el.id = props.id;
    el.classList.add(props.class);
    this.#element = el;
    this.#data = props.data;
    this.#colors = props.colors;
  }

  // Element
  get element() { return this.#element; }
  createCell () {
      let el = document.createElement('div');
      el.classList.add('cell');
      return el;
  };

  // render
  render () {
      let counter = 0;
      this.#data.forEach((itemY, y) => {
          this.#data[y].forEach((itemX, x) => {
              let coord = this.#data[y][x];
              this.#element.children[counter]
              .style.backgroundColor = this.#colors[coord];
              if(coord !== 0){
                // this.#element.children[counter]
                // .style.outline = '2px solid rgba(0, 0, 0, 0.4)';
              }

              counter++;
          });
      });
  }

  // Self
  log() {
    console.table(this);
  }
}
export default Scene;
