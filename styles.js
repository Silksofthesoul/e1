import Base from './base';

class Styles extends Base {
  constructor() {
    super();
    this.element = document.createElement('style');
  }

  append() {
    document.head.appendChild(this.element);
  }

  setStyles(arg) {
    const styles = this.getStyles(arg);
    this.element.innerText = styles
      .replace(/[\r\n]/igm, '')
      .replace(/[\t]/igm, ' ')
      .replace(/\s{2,}/igm, ' ');
  }

  getStyles(arg) {
    return `
        body {
          --overflow: hidden;
          background-color: ${arg.backgroundColor};
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
        #mainElement{
          width:100px;
          height:100px;
          --background-color: rgba(255,0,0,0.3);
          position: fixed;
          top: ${arg.cellSize}px;
          left: ${arg.cellSize}px;
        }
        #isPaint{
        }
        #Clear{
        }
        .button.active{
          background-color: rgba(255,255,127,1);
        }
        .button{
          user-select: none;
          transition: background-color 0.25s 0s ease-out,
                      color 0.15s 0s ease-out;
                      box-shadow 0.25s 0s ease-out;
          background-color: rgba(255,255,255,1);
          text-align: center;
          cursor: pointer;
          margin-bottom:0.5em;
          border-radius: 2em;
          padding: 0.5em 0.15em;
          box-shadow: 0px 0px 3px 0px rgba(0,0,0,0.8),
                      0px 0px 10px 0px rgba(0,0,0,0.5);
        }
        .button:hover,
        .button:active,
        .button:focus{
          background-color: rgba(64,64,64,1);
          color: white;
          box-shadow: 0px 0px 1px 0px rgba(0,0,0,0.6),
                      0px 0px 5px 0px rgba(0,0,0,0.3);
        }
        .button.active:hover,
        .button.active:active,
        .button.active:focus{
          background-color: rgba(127,127,64,1);
          color: white;
          box-shadow: 0px 0px 1px 0px rgba(0, 0, 64, 0.6),
                      0px 0px 5px 0px rgba(0, 0, 64, 0.3);
        }
        .scene{
          background-color: rgba(255,255,255,1);
          width: ${arg.width * arg.cellSize}px;
          height: ${arg.height * arg.cellSize}px;
          display: flex;
          justify-content: flex-start;
          flex-direction: row;
          flex-wrap: wrap;
          --transform: rotate(45deg) scale(2);
        }
        .cell{
            width: ${arg.cellSize}px;
            height: ${arg.cellSize}px;
            outline: 1px solid rgba(127, 127, 127, 0.2);
            transition: background-color 0.1s 0.2s ease-out;
        }
    `;
  }
}

export default Styles;
