"use strict"
export default (() => {
    const obj = {};
    obj.RMXI =  (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
    return obj
})();
