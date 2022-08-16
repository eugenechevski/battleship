import { DOMNodes } from './DOMNodes';
import { DOMVars } from './DOMVars';

export default function () {
  let controller: Controller;

  function resumeClock(): void {
    DOMVars.isPaused = false;
  }

  function pauseClock(): void {
    DOMVars.isPaused = true;
  }

  function stopClock(): void {
    clearInterval(DOMVars.timer);
  }

  function startClock(): void {
    DOMVars.clock = 0;
    DOMVars.timer = setInterval(() => {
      if (!DOMVars.isPaused) {
        DOMVars.clock += 1;
        document.querySelectorAll('.game-timer span')[1].innerHTML = `${`${Math.floor(
          DOMVars.clock / 60,
        )}`.padStart(2, '0')}:${`${Math.floor(DOMVars.clock % 60)}`.padStart(2, '0')}`;
      }
    }, 1000);
  }

  function startRoundCount(): void {
    DOMVars.roundCount = 1;
  }

  function appendFreshBoards(): void {
    const cloneBoard1 = DOMNodes.boardTemplate.cloneNode(true);
    const cloneBoard2 = DOMNodes.boardTemplate.cloneNode(true);
    document.body.querySelector('.game-play').children[1].children[0].lastChild?.remove();
    document.body.querySelector('.game-play').children[1].children[2].lastChild?.remove();
    document.body.querySelector('.game-play').children[1].children[0].appendChild(cloneBoard1);
    document.body.querySelector('.game-play').children[1].children[2].appendChild(cloneBoard2);
    const boards = document.querySelectorAll('.board-template');
    boards[0].classList.add('game-play-board', 'left-board');
    boards[1].classList.add('game-play-board', 'right-board');
  }

  function eraseTopBorder(coords: Coordinate, containerClass: string) {
    if (coords[0] > 0) {
      const cell = document.querySelector(`.${containerClass} .R${coords[0] - 1}C${coords[1]}`);
      cell.classList.remove('border-b-4', 'border-b-black', 'border-b-red-500');
      cell.classList.add('border-b-2', 'border-b-gray-500');
    }
    document
      .querySelector(`.${containerClass} .R${coords[0]}C${coords[1]}`)
      .removeAttribute('name');
  }

  function eraseBottomBorder(coords: Coordinate, containerClass: string) {
    if (coords[0] < 9) {
      const cell = document.querySelector(`.${containerClass} .R${coords[0]}C${coords[1]}`);
      cell.classList.remove('border-b-4', 'border-b-black', 'border-b-red-500');
      cell.classList.add('border-b-2', 'border-b-gray-500');
    }
    document
      .querySelector(`.${containerClass} .R${coords[0]}C${coords[1]}`)
      .removeAttribute('name');
  }

  function eraseLeftBorder(coords: Coordinate, containerClass: string) {
    if (coords[1] > 0) {
      const cell = document.querySelector(`.${containerClass} .R${coords[0]}C${coords[1] - 1}`);
      cell.classList.remove('border-r-4', 'border-r-black', 'border-r-red-500');
      cell.classList.add('border-r-2', 'border-r-gray-500');
    }
    document
      .querySelector(`.${containerClass} .R${coords[0]}C${coords[1]}`)
      .removeAttribute('name');
  }

  function eraseRightBorder(coords: Coordinate, containerClass: string) {
    if (coords[1] < 9) {
      const cell = document.querySelector(`.${containerClass} .R${coords[0]}C${coords[1]}`);
      cell.classList.remove('border-r-4', 'border-r-black', 'border-r-red-500');
      cell.classList.add('border-r-2', 'border-r-gray-500');
    }
    document
      .querySelector(`.${containerClass} .R${coords[0]}C${coords[1]}`)
      .removeAttribute('name');
  }

  function eraseVertical(coords: Coordinate[], containerClass: string) {
    eraseTopBorder(coords[0], containerClass);
    eraseBottomBorder(coords.slice(-1)[0], containerClass);

    for (let i = 0; i < coords.length; i += 1) {
      const coord = coords[i];
      eraseLeftBorder(coord, containerClass);
      eraseRightBorder(coord, containerClass);
    }
  }

  function eraseHorizontal(coords: Coordinate[], containerClass: string) {
    eraseLeftBorder(coords[0], containerClass);
    eraseRightBorder(coords.slice(-1)[0], containerClass);

    for (let i = 0; i < coords.length; i += 1) {
      const coord = coords[i];
      eraseTopBorder(coord, containerClass);
      eraseBottomBorder(coord, containerClass);
    }
  }

  function eraseShip(
    coords: Coordinate[],
    containerClass: string,
    orientation?: 'VERTICAL' | 'HORIZONTAL',
  ) {
    if (orientation !== undefined && orientation === 'VERTICAL') {
      eraseVertical(coords, containerClass);
    } else if (orientation !== undefined && orientation === 'HORIZONTAL') {
      eraseHorizontal(coords, containerClass);
    } else {
      eraseTopBorder(coords[0], containerClass);
      eraseBottomBorder(coords[0], containerClass);
      eraseLeftBorder(coords[0], containerClass);
      eraseRightBorder(coords[0], containerClass);
    }
  }

  function drawTopBorder(
    coords: Coordinate,
    containerClass: string,
    color: string,
    shipAlias?: string,
  ) {
    if (coords[0] > 0) {
      const cell = document.querySelector(`.${containerClass} .R${coords[0] - 1}C${coords[1]}`);
      cell.classList.remove(
        'border-b-2',
        'border-b-gray-500',
        'border-b-black',
        'border-b-red-500',
      );
      cell.classList.add('border-b-4', `border-b-${color}`);
    }

    if (shipAlias !== undefined) {
      document
        .querySelector(`.${containerClass} .R${coords[0]}C${coords[1]}`)
        .setAttribute('name', shipAlias);
    }
  }

  function drawBottomBorder(
    coords: Coordinate,
    containerClass: string,
    color: string,
    shipAlias?: string,
  ) {
    if (coords[0] < 9) {
      const cell = document.querySelector(`.${containerClass} .R${coords[0]}C${coords[1]}`);
      cell.classList.remove(
        'border-b-2',
        'border-b-gray-500',
        'border-b-black',
        'border-b-red-500',
      );
      cell.classList.add('border-b-4', `border-b-${color}`);
    }

    if (shipAlias !== undefined) {
      document
        .querySelector(`.${containerClass} .R${coords[0]}C${coords[1]}`)
        .setAttribute('name', shipAlias);
    }
  }

  function drawLeftBorder(
    coords: Coordinate,
    containerClass: string,
    color: string,
    shipAlias?: string,
  ) {
    if (coords[1] > 0) {
      const cell = document.querySelector(`.${containerClass} .R${coords[0]}C${coords[1] - 1}`);
      cell.classList.remove(
        'border-r-2',
        'border-r-gray-500',
        'border-r-black',
        'border-r-red-500',
      );
      cell.classList.add('border-r-4', `border-r-${color}`);
    }

    if (shipAlias !== undefined) {
      document
        .querySelector(`.${containerClass} .R${coords[0]}C${coords[1]}`)
        .setAttribute('name', shipAlias);
    }
  }

  function drawRightBorder(
    coords: Coordinate,
    containerClass: string,
    color: string,
    shipAlias?: string,
  ) {
    if (coords[1] < 9) {
      const cell = document.querySelector(`.${containerClass} .R${coords[0]}C${coords[1]}`);
      cell.classList.remove(
        'border-r-2',
        'border-r-gray-500',
        'border-r-black',
        'border-r-red-500',
      );
      cell.classList.add('border-r-4', `border-r-${color}`);
    }

    if (shipAlias !== undefined) {
      document
        .querySelector(`.${containerClass} .R${coords[0]}C${coords[1]}`)
        .setAttribute('name', shipAlias);
    }
  }

  function drawVertical(
    coords: Coordinate[],
    containerClass: string,
    color: string,
    shipAlias?: string,
  ) {
    drawTopBorder(coords[0], containerClass, color, shipAlias);
    drawBottomBorder(coords.slice(-1)[0], containerClass, color, shipAlias);

    for (let i = 0; i < coords.length; i += 1) {
      const coord = coords[i];
      drawLeftBorder(coord, containerClass, color, shipAlias);
      drawRightBorder(coord, containerClass, color, shipAlias);
    }
  }

  function drawHorizontal(
    coords: Coordinate[],
    containerClass: string,
    color: string,
    shipAlias?: string,
  ) {
    drawLeftBorder(coords[0], containerClass, color, shipAlias);
    drawRightBorder(coords.slice(-1)[0], containerClass, color, shipAlias);

    for (let i = 0; i < coords.length; i += 1) {
      const coord = coords[i];
      drawTopBorder(coord, containerClass, color, shipAlias);
      drawBottomBorder(coord, containerClass, color, shipAlias);
    }
  }

  function drawShip(
    coords: Coordinate[],
    containerClass: string,
    color: string,
    orientation?: 'VERTICAL' | 'HORIZONTAL',
    shipAlias?: string,
  ) {
    if (orientation !== undefined && orientation === 'VERTICAL') {
      drawVertical(coords, containerClass, color, shipAlias);
    } else if (orientation !== undefined && orientation === 'HORIZONTAL') {
      drawHorizontal(coords, containerClass, color, shipAlias);
    } else {
      drawTopBorder(coords[0], containerClass, color, shipAlias);
      drawBottomBorder(coords[0], containerClass, color, shipAlias);
      drawLeftBorder(coords[0], containerClass, color, shipAlias);
      drawRightBorder(coords[0], containerClass, color, shipAlias);
    }
  }

  function displayTimebar(): void {
    document.querySelector('.next-player-btn')?.classList.add('hidden');
    document.querySelector('.time-bar').classList.remove('hidden');
  }

  function displayNextPlayerButton(): void {
    document.querySelector('.time-bar')?.classList.add('hidden');
    document.querySelector('.next-player-btn')?.classList.remove('hidden');
  }

  function displayAfterGameControls(): void {
    document.querySelector('.time-bar')?.classList.add('hidden');
    document.querySelector('.after-game-controls')?.classList.remove('hidden');
  }

  function displayAttackPromptMessage(playerName: string): void {
    document.querySelector('.status-message').innerHTML = `${playerName}, it's your turn to shoot the salvo!`;
  }

  function displayMissedAttackMessage(playerName: string): void {
    document.querySelector('.status-message').innerHTML = `${playerName} missed!`;
  }

  function displayDoubleShotMessage(playerName: string): void {
    document.querySelector('.status-message').innerHTML = `${playerName}, you cannot shoot the same cell twice!`;
  }

  function displayHitMessage(playerName: string): void {
    document.querySelector('.status-message').innerHTML = `${playerName} hit a ship!`;
  }

  function displaySunkMessage(playerName: string): void {
    document.querySelector('.status-message').innerHTML = `${playerName} sunk a ship!`;
  }

  function displayGameOverMessage(playerName: string): void {
    document.querySelector('.status-message').innerHTML = `Game is over, ${playerName} won!`;
  }

  function drawAllShips(ships: ShipMap, containerClass: string): void {
    const shipAliases = Object.keys(ships);
    for (let i = 0; i < shipAliases.length; i += 1) {
      const ship: Ship = ships[shipAliases[i]];
      drawShip(
        ship.getArrayCoordinates(),
        containerClass,
        ship.isSunk() ? 'red-500' : 'black',
        ship.getOrientation(),
        shipAliases[i],
      );
    }
  }

  function redrawBoards(ships: ShipMap, grid: Grid, enemyShips: ShipMap, enemyGrid: Grid): void {
    // Reset boards
    appendFreshBoards();

    // Draw current player's ships
    drawAllShips(ships, 'left-board');

    // Draw enemy's ships that are sunk
    const shipAliases = Object.keys(enemyShips);
    for (let i = 0; i < shipAliases.length; i += 1) {
      const ship: Ship = enemyShips[shipAliases[i]];

      if (ship.isSunk()) {
        drawShip(ship.getArrayCoordinates(), 'right-board', 'red-500', ship.getOrientation());
      }
    }

    // Draw misses and hits
    for (let row = 0; row < 10; row += 1) {
      for (let col = 0; col < 10; col += 1) {
        // Misses

        if (grid[row][col] === false) {
          drawMissedAttack([row, col], 'left-board');
        }

        if (enemyGrid[row][col] === false) {
          drawMissedAttack([row, col], 'right-board');
        }

        // Hits

        if (typeof grid[row][col] !== 'boolean' && <Ship>grid[row][col].wasHit([row, col])) {
          drawHitAttack([row, col], 'left-board');
        }

        if (
          typeof enemyGrid[row][col] !== 'boolean'
          && <Ship>enemyGrid[row][col].wasHit([row, col])
        ) {
          drawHitAttack([row, col], 'right-board');
        }
      }
    }
  }

  function updateRound(): void {
    DOMVars.roundCount += 1;
    document.querySelector('.game-timer').children[0].innerHTML = `Round ${DOMVars.roundCount}`;
  }

  function resetTimeBar(): void {}

  function eraseSelectionOfShip(coords: Coordinate[]) {
    for (let i = 0; i < coords.length; i += 1) {
      document
        .querySelector(`.setup-board .R${coords[i][0]}C${coords[i][1]}`)
        .classList.remove('selected-ship');
    }
  }

  function drawSelectionOfShip(coords: Coordinate[]) {
    for (let i = 0; i < coords.length; i += 1) {
      document
        .querySelector(`.setup-board .R${coords[i][0]}C${coords[i][1]}`)
        .classList.add('selected-ship');
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
    document
      .querySelector(`.setup-board .R${target[0]}C${target[1]}`)
      .classList.remove('selected-ship');
    document
      .querySelector(`.setup-board .R${target[0]}C${target[1]}`)
      .classList.add('selected-coordinate');
  }

  function eraseSelectionOfCoordinate(target: Coordinate): void {
    document
      .querySelector(`.setup-board .R${target[0]}C${target[1]}`)
      .classList.remove('selected-coordinate');
  }

  function drawMissedAttack(attack: Coordinate, containerClass: string): void {
    document
      .querySelector(`.${containerClass} .R${attack[0]}C${attack[1]}`)
      ?.classList.add('text-gray-500', 'icon-cross');
  }

  function drawHitAttack(attack: Coordinate, containerClass: string): void {
    document
      .querySelector(`.${containerClass} .R${attack[0]}C${attack[1]}`)
      .classList.add('text-red-500', 'icon-cross');
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
        cells[col * 11 + row].classList.add(`R${row - 1}C${col - 1}`);
      }
    }
  }

  function extractCoordsFromClass(source: Element): Coordinate {
    let token = '';
    const values = [...source.classList.values()];

    for (let i = 0; i < values.length; i += 1) {
      if (values[i].startsWith('R')) {
        token = values[i];
        break;
      }
    }

    return [Number(token.charAt(1)), Number(token.charAt(3))];
  }

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

  function loadGameSetupScene(ships?: ShipMap): void {
    document.body.children[1].remove();

    const clone = DOMNodes.gameSetupScene.cloneNode(true);
    const cloneBoard = DOMNodes.boardTemplate.cloneNode(true);
    clone.childNodes[3].appendChild(cloneBoard);
    document.body.insertBefore(clone, document.body.lastElementChild);
    document.querySelector('.board-template').classList.add('setup-board');

    drawAllShips(ships, 'setup-board');
  }

  function loadGamePlayScene(ships?: ShipMap): void {
    document.body.children[1].remove();

    const clone = DOMNodes.gamePlayScene.cloneNode(true);
    document.body.insertBefore(clone, document.body.lastElementChild);
    appendFreshBoards();

    const shipAliases = Object.keys(ships);
    for (let i = 0; i < shipAliases.length; i += 1) {
      const ship = ships[shipAliases[i]];
      drawShip(
        ship.getArrayCoordinates(),
        'left-board',
        'black',
        ship.getOrientation(),
        shipAliases[i],
      );
    }

    startClock();
    startRoundCount();
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
        // TODO: transition animation
        controller.start(DOMVars.againstComputer);
      }

      if (source.id.startsWith('playerModeSwitch')) {
        handleAgainstComputerSwitch();
      }

      if (source.classList.contains('time-limit-option')) {
        handleTimeLimitSettings(<5 | 10 | 15>Number(source.innerHTML.split(' ')[0]));
      }

      if (
        source.parentElement.classList.contains('setup-board')
        && source.classList.contains('cell')
        && source.classList.contains('clicked')
        && !source.hasAttribute('name')
        && DOMVars.selectedShip !== undefined
      ) {
        controller.transformShipRequested(
          DOMVars.selectedShip,
          DOMVars.selectedCoord,
          extractCoordsFromClass(source),
        );
      } else if (
        source.parentElement.classList.contains('setup-board')
        && source.hasAttribute('name')
      ) {
        if (DOMVars.selectedShip !== undefined) {
          eraseSelectionOfShip(DOMVars.selectedShip.getArrayCoordinates());
          eraseSelectionOfCoordinate(DOMVars.selectedCoord);
        }
        setSelectedShip(controller.getSelectedShip(source.getAttribute('name')));
        setSelectedCoord(extractCoordsFromClass(source));
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
        controller.transformShipRequested(DOMVars.selectedShip, DOMVars.selectedCoord);
      }

      if (source.classList.contains('done-button')) {
        controller.setupComplete();
      }

      if (source.classList.contains('icon-pause')) {
        pauseClock();
        source.classList.remove('icon-pause');
        source.classList.add('icon-resume');
      } else if (source.classList.contains('icon-resume')) {
        resumeClock();
        source.classList.remove('icon-resume');
        source.classList.add('icon-pause');
      }

      if (
        source.parentElement.classList.contains('right-board')
        && source.classList.contains('clicked')
        && !DOMVars.isPaused
      ) {
        controller.attackRequested(extractCoordsFromClass(source), true);
      }

      if (source.classList.contains('next-player-btn')) {
        controller.nextRound();
      }
    });

    document.body.addEventListener('dblclick', (event) => {
      const source = <Element>event.target;

      if (source.hasAttribute('name')) {
        controller.transformShipRequested(
          controller.getSelectedShip(source.getAttribute('name')),
          extractCoordsFromClass(source),
        );
      }
    });
  }

  function initVars() {
    DOMVars.timeLimit = 5;
    DOMVars.againstComputer = (<HTMLInputElement>(
      document.querySelector('#playerModeSwitch')
    ))?.checked;
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
    loadGamePlayScene,
    drawShip,
    drawSelectionOfShip,
    drawSelectionOfCoordinate,
    eraseShip,
    eraseSelectionOfShip,
    eraseSelectionOfCoordinate,
    drawMissedAttack,
    drawHitAttack,
    displayTimebar,
    displayNextPlayerButton,
    displayAfterGameControls,
    displayAttackPromptMessage,
    displayMissedAttackMessage,
    displayDoubleShotMessage,
    displayHitMessage,
    displaySunkMessage,
    displayGameOverMessage,
    updateRound,
    redrawBoards,
    resetSelectedShip,
    setSelectedCoord,
    setSelectedShip,
    startClock,
    resumeClock,
    stopClock,
  };
}
