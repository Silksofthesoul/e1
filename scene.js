import Base from './base.js';

'use strict';
class Scene extends Base{
  #id = 'scene';
  #class = 'scene';
  #data = null;
  #colors = null;
  #element = null;
  #cells = [];
  #rendered = [];
  constructor(arg = {}) {
    super();
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

  set colors(newColors) {
    this.#colors = newColors;
    this.#rendered = [];
  }
  // Element
  get element() { return this.#element; }
  createCell () {
      let el = document.createElement('div');
      el.classList.add('cell');
      this.#cells.push(el);
      return el;
  }
  erase () {
    this.#cells.forEach((cell) => { cell.style.backgroundColor = this.#colors[0]; });
    this.#rendered = this.#cells.map(() => 0);
  }
  // Keep cell references instead of indexing a live HTMLCollection. A frame
  // normally changes only a few pixels; leave every other DOM style alone.
  render () {
    let index = 0;
    for (const row of this.#data) {
      for (const value of row) {
        if (this.#rendered[index] !== value) {
          this.#cells[index].style.backgroundColor = this.#colors[value];
          this.#rendered[index] = value;
        }
        index++;
      }
    }
  }
}
export default Scene;
