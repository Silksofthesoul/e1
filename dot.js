import Base from './base.js';
import lib from './library.js';

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
    const mutateX = lib.RMXI(-2, 2);
    const mutateY = lib.RMXI(-2, 2);
    const mutateSpeed = lib.RMXI(-5, 5) / lib.RMXI(10, 100);
    const cellSize = 10;
    const inset = 3 * cellSize;
    const bounds = (size) => {
      // A very small viewport may not have room for both margins.
      const min = Math.min(inset, (size - 1) * cellSize / 2);
      return { min, max: Math.max(min, (size - 3) * cellSize) };
    };
    const modD = Math.max(Math.abs(this.dx), Math.abs(this.dy));
    const qf = 10 ** String(modD).length;
    const distance = (direction) => {
      if (this.#buffer.isSpeedForward === undefined) this.#buffer.isSpeedForward = true;
      this.speed += (this.#buffer.isSpeedForward ? 1 : -1) / (qf / 100);
      if (this.speed > qf) this.#buffer.isSpeedForward = false;
      if (this.speed < 1) this.#buffer.isSpeedForward = true;
      return direction / qf * Math.floor(this.speed);
    };
    // Calculate the entire displacement before touching the coordinates. The
    // old per-axis setters clamped overshoot and lost the distance to the wall.
    const movement = { x: distance(this.dx), y: distance(this.dy) };
    const reflect = (key, limits, mutate) => {
      const { min, max } = limits;
      const position = Math.max(min, Math.min(max, this[key]));
      const delta = movement[key];
      if (max === min) {
        this[key] = min;
        return;
      }
      const target = position + delta;
      const touched = delta > 0 ? target >= max : delta < 0 && target <= min;
      if (!touched) {
        this[key] = target;
        return;
      }
      // Fold the remaining distance back into the field. This is equivalent
      // to following the trajectory to every wall, even for several hits in
      // one frame, and does not need an unbounded collision loop.
      const span = max - min;
      const period = 2 * span;
      const phase = ((target - min) % period + period) % period;
      this[key] = min + (phase <= span ? phase : period - phase);
      const sign = phase === 0 ? 1 : phase === span ? -1
        : Math.sign(delta) * (phase < span ? 1 : -1);
      // Keep the experiment's random changes of angle, but never point back
      // out through the wall. Mutation affects the next frame, not the hit.
      const reflected = sign * Math.abs(this[`d${key}`]);
      this[`d${key}`] = sign * Math.max(1, Math.min(360, Math.abs(reflected + mutate * 100)));
      this.speed += mutateSpeed;
      const tangent = key === 'x' ? 'dy' : 'dx';
      if (this[tangent] === 0) this[tangent] = lib.RMXI(-1, 1);
    };
    reflect('x', bounds(this.getMatrixWidth()), mutateX);
    reflect('y', bounds(this.getMatrixHeight()), mutateY);
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
