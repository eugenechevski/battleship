import { DOMNodes } from './DOMNodes';
import { DOMVars } from './DOMVars';

export default function () {
  let controller: Controller;

  function loadGameMenuScene(): void {
    document.body.children[1].remove();
    document.body.insertBefore(
      DOMNodes.gameMenuScene.cloneNode(true),
      document.body.lastElementChild,
    );
  }

  function loadCountDownScene(): void {
    document.body.children[1].remove();
    document.body.insertBefore(
      DOMNodes.countDownScene.cloneNode(true),
      document.body.lastElementChild,
    );
  }

  function loadGameSetupScene(initialGrid?: { [index: string]: Ship }): void {
    document.body.children[1].remove();

    const clone = DOMNodes.gameSetupScene.cloneNode(true);
    const cloneBoard = DOMNodes.boardTemplate.cloneNode(true);
    clone.childNodes[3].appendChild(cloneBoard);
    document.body.insertBefore(clone, document.body.lastElementChild);
    document.querySelector('.board-template').classList.add('setup-board');

    const shipAliases = Object.keys(initialGrid);
    for (let i = 0; i < shipAliases.length; i += 1) {
      const ship = initialGrid[shipAliases[i]];
      drawShip(ship.getArrayCoordinates(), shipAliases[i], ship.getOrientation());
    }
  }

  function loadGamePlayScene(): void {
    document.body.children[1].remove();

    const clone = DOMNodes.gamePlayScene.cloneNode(true);
    const cloneBoard1 = DOMNodes.boardTemplate.cloneNode(true);
    const cloneBoard2 = DOMNodes.boardTemplate.cloneNode(true);
    document.body.insertBefore(clone, document.body.lastElementChild);
    document.body.querySelector('.game-play').children[1].children[0].appendChild(cloneBoard1);
    document.body.querySelector('.game-play').children[1].children[2].appendChild(cloneBoard2);
    document
      .querySelectorAll('.board-template')
      .forEach((el) => el.classList.add('game-play-board'));
  }

  function eraseTopBorder(coords: Coordinate) {
    if (coords[0] > 0) {
      document
        .getElementById(`${coords[0] - 1}${coords[1]}`)
        .classList.remove('border-b-4', 'border-b-black');
      document.getElementById(`${coords[0] - 1}${coords[1]}`).classList.add('border-b-2');
    }
    document.getElementById(`${coords[0]}${coords[1]}`).removeAttribute('name');
  }

  function eraseBottomBorder(coords: Coordinate) {
    if (coords[0] < 9) {
      document
        .getElementById(`${coords[0]}${coords[1]}`)
        .classList.remove('border-b-4', 'border-b-black');
      document.getElementById(`${coords[0]}${coords[1]}`).classList.add('border-b-2');
    }
    document.getElementById(`${coords[0]}${coords[1]}`).removeAttribute('name');
  }

  function eraseLeftBorder(coords: Coordinate) {
    if (coords[1] > 0) {
      document
        .getElementById(`${coords[0]}${coords[1] - 1}`)
        .classList.remove('border-r-4', 'border-r-black');
    }
    document.getElementById(`${coords[0]}${coords[1]}`).removeAttribute('name');
  }

  function eraseRightBorder(coords: Coordinate) {
    if (coords[1] < 9) {
      document
        .getElementById(`${coords[0]}${coords[1]}`)
        .classList.remove('border-r-4', 'border-r-black');
    }
    document.getElementById(`${coords[0]}${coords[1]}`).removeAttribute('name');
  }

  function eraseVertical(coords: Coordinate[]) {
    eraseTopBorder(coords[0]);
    eraseBottomBorder(coords.slice(-1)[0]);

    for (let i = 0; i < coords.length; i += 1) {
      const coord = coords[i];
      eraseLeftBorder(coord);
      eraseRightBorder(coord);
    }
  }

  function eraseHorizontal(coords: Coordinate[]) {
    eraseLeftBorder(coords[0]);
    eraseRightBorder(coords.slice(-1)[0]);

    for (let i = 0; i < coords.length; i += 1) {
      const coord = coords[i];
      eraseTopBorder(coord);
      eraseBottomBorder(coord);
    }
  }

  function eraseShip(coords: Coordinate[], orientation?: 'VERTICAL' | 'HORIZONTAL') {
    if (orientation !== undefined && orientation === 'VERTICAL') {
      eraseVertical(coords);
    } else if (orientation !== undefined && orientation === 'HORIZONTAL') {
      eraseHorizontal(coords);
    } else {
      eraseTopBorder(coords[0]);
      eraseBottomBorder(coords[0]);
      eraseLeftBorder(coords[0]);
      eraseRightBorder(coords[0]);
    }
  }

  function drawTopBorder(coords: Coordinate, shipAlias: string) {
    if (coords[0] > 0) {
      document.getElementById(`${coords[0] - 1}${coords[1]}`).classList.remove('border-b-2');
      document
        .getElementById(`${coords[0] - 1}${coords[1]}`)
        .classList.add('border-b-4', 'border-b-black');
    }
    document.getElementById(`${coords[0]}${coords[1]}`).setAttribute('name', shipAlias);
  }

  function drawBottomBorder(coords: Coordinate, shipAlias: string) {
    if (coords[0] < 9) {
      document.getElementById(`${coords[0]}${coords[1]}`).classList.remove('border-b-2');
      document
        .getElementById(`${coords[0]}${coords[1]}`)
        .classList.add('border-b-4', 'border-b-black');
    }
    document.getElementById(`${coords[0]}${coords[1]}`).setAttribute('name', shipAlias);
  }

  function drawLeftBorder(coords: Coordinate, shipAlias: string) {
    if (coords[1] > 0) {
      document
        .getElementById(`${coords[0]}${coords[1] - 1}`)
        .classList.add('border-r-4', 'border-r-black');
    }
    document.getElementById(`${coords[0]}${coords[1]}`).setAttribute('name', shipAlias);
  }

  function drawRightBorder(coords: Coordinate, shipAlias: string) {
    if (coords[1] < 9) {
      document
        .getElementById(`${coords[0]}${coords[1]}`)
        .classList.add('border-r-4', 'border-r-black');
    }
    document.getElementById(`${coords[0]}${coords[1]}`).setAttribute('name', shipAlias);
  }

  function drawVertical(coords: Coordinate[], shipAlias: string) {
    drawTopBorder(coords[0], shipAlias);
    drawBottomBorder(coords.slice(-1)[0], shipAlias);

    for (let i = 0; i < coords.length; i += 1) {
      const coord = coords[i];
      drawLeftBorder(coord, shipAlias);
      drawRightBorder(coord, shipAlias);
    }
  }

  function drawHorizontal(coords: Coordinate[], shipAlias: string) {
    drawLeftBorder(coords[0], shipAlias);
    drawRightBorder(coords.slice(-1)[0], shipAlias);

    for (let i = 0; i < coords.length; i += 1) {
      const coord = coords[i];
      drawTopBorder(coord, shipAlias);
      drawBottomBorder(coord, shipAlias);
    }
  }

  function drawShip(
    coords: Coordinate[],
    shipAlias: string,
    orientation?: 'VERTICAL' | 'HORIZONTAL',
  ) {
    if (orientation !== undefined && orientation === 'VERTICAL') {
      drawVertical(coords, shipAlias);
    } else if (orientation !== undefined && orientation === 'HORIZONTAL') {
      drawHorizontal(coords, shipAlias);
    } else {
      drawTopBorder(coords[0], shipAlias);
      drawBottomBorder(coords[0], shipAlias);
      drawLeftBorder(coords[0], shipAlias);
      drawRightBorder(coords[0], shipAlias);
    }
  }

  function eraseSelectionOfShip(coords: Coordinate[]) {
    for (let i = 0; i < coords.length; i += 1) {
      document.getElementById(`${coords[i][0]}${coords[i][1]}`).classList.remove('selected-ship');
    }
  }

  function drawSelectionOfShip(coords: Coordinate[]) {
    for (let i = 0; i < coords.length; i += 1) {
      document.getElementById(`${coords[i][0]}${coords[i][1]}`).classList.add('selected-ship');
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

  function drawSelectionOfCoordinate(target: Coordinate): void {
    document.getElementById(`${target[0]}${target[1]}`).classList.remove('selected-ship');
    document.getElementById(`${target[0]}${target[1]}`).classList.add('selected-coordinate');
  }

  function eraseSelectionOfCoordinate(target: Coordinate): void {
    document.getElementById(`${target[0]}${target[1]}`).classList.remove('selected-coordinate');
  }

  function resetSelectedShip(): void {
    DOMVars.selectedCoord = undefined;
    DOMVars.selectedShip = undefined;
  }

  function setSelectedCoord(newCoord: Coordinate): void {
    DOMVars.selectedCoord = newCoord;
  }

  function setSelectedShip(newShip: Ship): void {
    DOMVars.selectedShip = newShip;
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
        controller.start(DOMVars.againstComputer);
      }

      if (source.id.startsWith('playerModeSwitch')) {
        handleAgainstComputerSwitch();
      }

      if (source.classList.contains('time-limit-option')) {
        handleTimeLimitSettings(<5 | 10 | 15>Number(source.innerHTML.split(' ')[0]));
      }

      if (
        source.classList.contains('cell')
        && source.classList.contains('clicked')
        && !source.hasAttribute('name')
        && DOMVars.selectedShip !== undefined
      ) {
        controller.transformShipRequested(DOMVars.selectedShip, DOMVars.selectedCoord, [
          Number(source.id.charAt(0)),
          Number(source.id.charAt(1)),
        ]);
      } else if (source.hasAttribute('name')) {
        if (DOMVars.selectedShip !== undefined) {
          eraseSelectionOfShip(DOMVars.selectedShip.getArrayCoordinates());
          eraseSelectionOfCoordinate(DOMVars.selectedCoord);
        }
        setSelectedShip(controller.getSelectedShip(source.getAttribute('name')));
        setSelectedCoord([Number(source.id.charAt(0)), Number(source.id.charAt(1))]);
        drawSelectionOfShip(DOMVars.selectedShip.getArrayCoordinates());
        drawSelectionOfCoordinate(DOMVars.selectedCoord);

        if (window.innerWidth < 768) {
          document.querySelector('.icon-rotation').classList.remove('hidden');
        }
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

      if (source.classList.contains('icon-rotation')) {
        controller.transformShipRequested(
          DOMVars.selectedShip,
          DOMVars.selectedCoord,
        );
      }
    });

    document.body.addEventListener('dblclick', (event) => {
      const source = <Element>event.target;

      if (source.hasAttribute('name')) {
        controller.transformShipRequested(controller.getSelectedShip(source.getAttribute('name')), [
          Number(source.id.charAt(0)),
          Number(source.id.charAt(1)),
        ]);
      }
    });
  }

  function initVars() {
    DOMVars.timeLimit = 5;
    DOMVars.againstComputer = true;
    DOMVars.selectedCoord = [0, 0];
    DOMVars.drag = false;
  }

  function init(Controller: Controller) {
    initListeners();
    initNodes();
    initVars();
    controller = Controller;
  }

  return {
    init,
    loadGameSetupScene,
    drawShip,
    drawSelectionOfShip,
    drawSelectionOfCoordinate,
    eraseShip,
    eraseSelectionOfShip,
    eraseSelectionOfCoordinate,
    resetSelectedShip,
    setSelectedCoord,
    setSelectedShip,
  };
}
