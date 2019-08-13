import Base from './base';
import lib from './library';

"use strict"
class Dot extends Base{
  #matrix = [[0]];
  #coords = {x: 0, y: 0};
  #direction = {x: 0, y: 0};
  #speed = 1;
  #type = 0;
  #buffer = {};
  _name = 'unnamed';
  constructor(arg = {}) {
    super();
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
    let [mutateX, mutateY, mutateSpeed] = [lib.RMXI(-2, 2), lib.RMXI(-2, 2), lib.RMXI(-5, 5) / lib.RMXI(10, 100)];
    let maxMatrixX = (this.getMatrixWidth() - 3) * 10;
    let maxMatrixY = (this.getMatrixHeight() -  3) * 10;
    let isTouched = false;
    const step = (key, mutate) => {
      if(this.#buffer.isSpeedForward === undefined) this.#buffer.isSpeedForward = true;
      if(this.#buffer.isSpeedForward)this.speed += 0.01;
      else this.speed -= 0.01;
      if(this.speed > 20) this.#buffer.isSpeedForward = false;
      if(this.speed < 1) this.#buffer.isSpeedForward = true;
      this[key] += ((this[`d${key}`] + mutate) * parseInt(Math.floor(this.speed)));
    }
    const changeDX = () => {
      isTouched = true;
      this.speed += mutateSpeed;
      this.dx = -this.dx;
      step('x', mutateX);
    };
    const changeDY = () => {
      isTouched = true;
      this.speed += mutateSpeed;
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
}
export default Dot;
