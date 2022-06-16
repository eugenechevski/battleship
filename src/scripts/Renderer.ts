import { DOMNodes } from './DOMNodes';
import { DOMVars } from './DOMVars';

export default function (controller: Controller) {
  function loadGameMenuScene(): void {
    if (!document.body.lastElementChild.className.startsWith('testing-controls')) {
      document.body.lastElementChild.remove();
    }
    document.body.appendChild(DOMNodes.gameMenuScene.cloneNode(true));
  }

  function loadCountDownScene(): void {
    if (!document.body.lastElementChild.className.startsWith('testing-controls')) {
      document.body.lastElementChild.remove();
    }
    document.body.appendChild(DOMNodes.countDownScene.cloneNode(true));
  }

  function loadGameSetupScene(): void {
    if (!document.body.lastElementChild.className.startsWith('testing-controls')) {
      document.body.lastElementChild.remove();
    }

    const clone = DOMNodes.gameSetupScene.cloneNode(true);
    const cloneBoard = DOMNodes.boardTemplate.cloneNode(true);
    clone.childNodes[3].appendChild(cloneBoard);
    document.body.appendChild(clone);
    document.querySelector('.board-template').classList.add('setup-board');
    drawShip(DOMVars.cellCoords);
  }

  function loadGamePlayScene(): void {
    if (!document.body.lastElementChild.className.startsWith('testing-controls')) {
      document.body.lastElementChild.remove();
    }

    const clone = DOMNodes.gamePlayScene.cloneNode(true);
    const cloneBoard1 = DOMNodes.boardTemplate.cloneNode(true);
    const cloneBoard2 = DOMNodes.boardTemplate.cloneNode(true);
    document.body.appendChild(clone);
    document.body.querySelector('.game-play').children[1].children[0].appendChild(cloneBoard1);
    document.body.querySelector('.game-play').children[1].children[2].appendChild(cloneBoard2);
    document
      .querySelectorAll('.board-template')
      .forEach((el) => el.classList.add('game-play-board'));
  }

  function eraseShip(coords: Coordinate) {
    const id = `${coords[0]}${coords[1]}`;
    if (coords[0] > 0) {
      document
        .getElementById(`${coords[0] - 1}${coords[1]}`)
        .classList.remove('border-b-black', 'border-b-4');
      document.getElementById(`${coords[0] - 1}${coords[1]}`).classList.add('border-b-2');
    }

    if (coords[0] < 9) {
      document.getElementById(`${id}`).classList.remove('border-b-black', 'border-b-4');
      document.getElementById(`${id}`).classList.add('border-b-2');
    }

    if (coords[1] > 0) {
      document
        .getElementById(`${coords[0]}${coords[1] - 1}`)
        .classList.remove('border-r-black', 'border-r-4');
      document.getElementById(`${coords[0]}${coords[1] - 1}`).classList.add('border-r-2');
    }

    if (coords[1] < 9) {
      document.getElementById(`${id}`).classList.remove('border-r-black', 'border-r-4');
      document.getElementById(`${id}`).classList.add('border-r-2');
    }
  }

  function drawShip(coords: Coordinate) {
    if (coords[0] < 9) {
      document.getElementById(`${coords[0]}${coords[1]}`).classList.remove('border-b-2');
      document
        .getElementById(`${coords[0]}${coords[1]}`)
        .classList.add('border-b-black', 'border-b-4');
    }

    if (coords[0] > 0) {
      document.getElementById(`${coords[0] - 1}${coords[1]}`).classList.remove('border-b-2');
      document
        .getElementById(`${coords[0] - 1}${coords[1]}`)
        .classList.add('border-b-black', 'border-b-4');
    }

    if (coords[1] < 9) {
      document.getElementById(`${coords[0]}${coords[1]}`).classList.remove('border-r-2');
      document
        .getElementById(`${coords[0]}${coords[1]}`)
        .classList.add('border-r-black', 'border-r-4');
    }

    if (coords[1] > 0) {
      document.getElementById(`${coords[0]}${coords[1] - 1}`).classList.remove('border-r-2');
      document
        .getElementById(`${coords[0]}${coords[1] - 1}`)
        .classList.add('border-r-black', 'border-r-4');
    }
  }

  function handleAgainstComputerSwitch(): void {
    DOMVars.againstComputer = !DOMVars.againstComputer;
  }

  function handleTimeLimitSettings(newTimeLimit: 5 | 10 | 15): void {
    DOMVars.timeLimit = newTimeLimit;
    document.querySelector('#timeLimitSettingsButton').innerHTML = `${String(
      DOMVars.timeLimit,
    )} seconds`;
  }

  function handleClickedCell(target: Element): void {
    // TODO
  }

  function labelCells(): void {
    const cells = DOMNodes.boardTemplate.children;

    for (let col = 1; col < 11; col += 1) {
      for (let row = 1; row < 11; row += 1) {
        cells[col * 11 + row].id = `${row - 1}${col - 1}`;
      }
    }
  }

  function initNodes() {
    DOMNodes.gameMenuScene = <Element>document.querySelector('.game-menu');
    DOMNodes.gameMenuScene.remove();

    DOMNodes.countDownScene = <Element>document.querySelector('.count-down');
    DOMNodes.countDownScene.remove();

    DOMNodes.boardTemplate = <Element>document.querySelector('.board-template');
    labelCells();
    DOMNodes.boardTemplate.remove();
    DOMNodes.gameSetupScene = <Element>document.querySelector('.game-setup');
    DOMNodes.gameSetupScene.remove();

    DOMNodes.gamePlayScene = <Element>document.querySelector('.game-play');
    DOMNodes.gamePlayScene.remove();
  }

  function initListeners() {
    document.body.addEventListener('click', (event) => {
      const source = <Element>event.target;
      // # Game-menu elements

      if (source.className.startsWith('play-button')) {
        controller.start(DOMVars.againstComputer, DOMVars.timeLimit);
      }

      if (source.id.startsWith('playerModeSwitch')) {
        handleAgainstComputerSwitch();
      }

      if (source.classList.contains('time-limit-option')) {
        handleTimeLimitSettings(<5 | 10 | 15>Number(source.innerHTML.split(' ')[0]));
      }

      if (source.className.startsWith('cell clicked')) {
        handleClickedCell(source);
      }

      if (source.tagName === 'LI') {
        event.stopPropagation();
      }

      if (source.id === 'game-menu-button') {
        loadGameMenuScene();
      }

      if (source.id === 'count-down-button') {
        loadCountDownScene();
      }

      if (source.id === 'setup-button') {
        loadGameSetupScene();
      }

      if (source.id === 'game-play-button') {
        loadGamePlayScene();
      }
    });

    document.body.addEventListener('mousedown', (event) => {
      const source = <Element>event.target;
      if (source.classList.contains('cell') && source.classList.contains('clicked')) {
        const coords = [Number(source.id.charAt(0)), Number(source.id.charAt(1))];
        if (coords[0] === DOMVars.cellCoords[0] && coords[1] === DOMVars.cellCoords[1]) {
          DOMVars.drag = true;
        }
      }
    });
    document.body.addEventListener('mouseup', (event) => {
      if (DOMVars.drag) {
        const { id } = <Element>event.target;
        eraseShip(DOMVars.cellCoords);
        DOMVars.cellCoords = [Number(id[0]), Number(id[1])];
        drawShip(DOMVars.cellCoords);
        DOMVars.drag = false;
      }
    });
  }

  function initVars() {
    DOMVars.timeLimit = 5;
    DOMVars.againstComputer = true;
    DOMVars.cellCoords = [0, 0];
    DOMVars.drag = false;
  }

  function init() {
    initListeners();
    initNodes();
    initVars();
  }

  return {
    init,
  };
}
