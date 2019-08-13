'use strict';
class Base {
  constructor(arg = {}) { }
  // Self
  log() {
    console.table(this);
  }
}

export default Base;
