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
    let [
      mutateX,
      mutateY,
      mutateSpeed] = [
        lib.RMXI(-2, 2),
        lib.RMXI(-2, 2),
        lib.RMXI(-5, 5) / lib.RMXI(10, 100)
      ];
    let q = 3;
    let cellSize = 10;
    let minMatrixX = q * cellSize;
    let minMatrixY = q * cellSize;
    let maxMatrixX = (this.getMatrixWidth() - q) * cellSize;
    let maxMatrixY = (this.getMatrixHeight() -  q) * cellSize;
    let isTouched = false;
    let currentStep = { x: 0, y: 0 };


    const step = (key, mutate) => {
      let modD = Math.max(Math.abs(this.dx), Math.abs(this.dy));
      let qf = parseInt('1' + '0'.repeat(String(modD).length));
      if(this.#buffer.isSpeedForward === undefined) this.#buffer.isSpeedForward = true;
      if(this.#buffer.isSpeedForward)this.speed += 1 / (qf /100);
      else this.speed -= 1 / (qf / 100);
      if(this.speed > qf) this.#buffer.isSpeedForward = false;
      if(this.speed < 1) this.#buffer.isSpeedForward = true;
      currentStep[key] = (((this[`d${key}`] / qf) + mutate) * parseInt(Math.floor(this.speed)));
      this[key] += currentStep[key];
    }
    const changeDX = () => {
      isTouched = true;
      this.speed += mutateSpeed;
      this.dx = -this.dx + (mutateX * 100);
      if(this.dx < -360) this.dx = -360;
      if(this.dx > 360) this.dx = 360;
      if(this.dy === 0){
        this.dy = lib.RMXI(-1, 1);
      }
      step('x', mutateX);
    };
    const changeDY = () => {
      isTouched = true;
      this.speed += mutateSpeed;
      this.dy = -this.dy + (mutateY * 100);
      if(this.dy < -360) this.dy = -360;
      if(this.dy > 360) this.dy = 360;
      if(this.dx === 0) {
        this.dx = lib.RMXI(-1, 1);
      }
      step('y', mutateY);
    };
    const checkAndChangeX = () => {
      if(this.x < minMatrixX || this.x > maxMatrixX) {
        if(this.x < minMatrixX) {this.x = minMatrixX}
        if(this.x > maxMatrixX) {this.x = maxMatrixX + currentStep.x}
        return true;
      }
      return false;
    };
    const checkAndChangeY = () => {
      if(this.y < minMatrixY || this.y > maxMatrixY) {
        if(this.y < minMatrixY) {this.y = minMatrixY}
        if(this.y > maxMatrixY) {this.y = maxMatrixY + currentStep.y}
        return true;
      }
      return false;
    };
    if(checkAndChangeX()) changeDX();
    if(checkAndChangeY()) changeDY();

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
