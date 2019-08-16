import Base from './base';
import lib from './library';

'use strict';

class UI extends Base {
  #elements = [];
  #scene = null;
  #data = null;
  #colors = null;
  #styles = null;
  #main = null;
  constructor(arg) {
    super();
    this.#scene = arg.scene;
    this.#data = arg.data;
    this.#colors = arg.colors;
    this.#styles = arg.styles;
    this.#main = arg.main;
    this.createElements();
    this.addListeners();
    this.appendAll();
  }
  addListeners () {
    let paint = this.getElementById('isPaint').element;
    let pause = this.getElementById('Pause').element;

    if(this.#data.isErase === false){
      paint.classList.toggle('active');
    }
    if(this.#main.isPause === true){
      pause.classList.toggle('active');
    }
    paint.addEventListener('click', () => {
      this.#data.switchErase();
      paint.classList.toggle('active');
    });

    this.getElementById('clearScene')
    .element.addEventListener('click', () => {
      this.#scene.erase();
    });

    this.getElementById('clearData')
    .element.addEventListener('click', () => {
      this.#data.erase();
    });

    pause.addEventListener('click', () => {
      this.#main.switchPause();
      pause.classList.toggle('active');
    });

    this.getElementById('RndColors')
    .element.addEventListener('click', () => {
      const colors = this.#colors[lib.RMXI(0, this.#colors.length - 1)];
      this.#main.colors = colors;
      this.#main.colors.sort((a, b)=>(Math.round(Math.random())-0.5));
      this.#styles.setStyles({
        backgroundColor: this.#main.colors[0],
        width: this.#main.data.width,
        height: this.#main.data.height,
        cellSize: this.#main.cellSize,
      });
      this.#scene.erase();
      this.#scene.colors = this.#main.colors;
      this.#scene.erase();
    });
  }
  createElements() {

    this.createElement({
      key: 'mainElement',
      tag: 'div',
      parent: document.body
    }, {id: 'mainElement'});

    this.createElement({
      key: 'isPaint',
      tag: 'div',
      text: 'Is Paint?',
      parent: this.getElementById('mainElement').element
    }, {id: 'isPaint', class: 'button'});

    this.createElement({
      key: 'clearScene',
      tag: 'div',
      text: 'Clear Scene',
      parent: this.getElementById('mainElement').element
    }, {id: 'clearScene', class: 'button'});

    this.createElement({
      key: 'clearData',
      tag: 'div',
      text: 'Clear Data',
      parent: this.getElementById('mainElement').element
    }, {id: 'clearData', class: 'button'});

    this.createElement({
      key: 'Pause',
      tag: 'div',
      text: 'Pause',
      parent: this.getElementById('mainElement').element
    }, {id: 'Pause', class: 'button'});

    this.createElement({
      key: 'RndColors',
      tag: 'div',
      text: 'Rnd Colors',
      parent: this.getElementById('mainElement').element
    }, {id: 'RndColors', class: 'button'});

  }

  getElementById (id) {
    return this.#elements.find(item => item.id === id);
  }

  createElement(params, props = {}) {
    let el = document.createElement(params.tag);
    for (var prop in props) {
      if (props[prop]) {
        if(prop === 'class'){
          props[prop]
          .split(' ')
          .forEach(item => el.classList.add(item));
        } else {
          el[prop] = props[prop];
        }
      }
    }
    if(params.text) el.innerText = params.text;
    const newElement = {
      id: params.key,
      element: el,
      parent: params.parent || document.body
    };
    let index = null
    let fElement = this.#elements.find((item, i) => {
      index = i;
      return item.id === params.key;
    });
    if(!fElement) {
      this.#elements.push(newElement);
    }else{
      this.#elements[index] = newElement;
    }
  }

  appendAll () {
    this.#elements.forEach((item) => {
      item.parent.appendChild(item.element);
    });
  }

}

export default UI;
