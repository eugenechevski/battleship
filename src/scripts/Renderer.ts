import { DOMNodes } from './DOMNodes';
import { DOMVars } from './DOMVars';

export default function () {
  let controller: Controller;

  function updateClock(clock: number): void {
    document.querySelectorAll('.game-timer span')[1].innerHTML = `${`${Math.floor(
      clock / 60,
    )}`.padStart(2, '0')}:${`${Math.floor(clock % 60)}`.padStart(2, '0')}`;
  }

  function resetClock(): void {
    document.querySelectorAll('.game-timer span')[1].innerHTML = '';
  }

  function updateRoundCount(roundCount: number): void {
    document.querySelector('.game-timer').children[0].innerHTML = `Round ${roundCount}`;
  }

  function resetRoundCount(): void {
    document.querySelector('.game-timer').children[0].innerHTML = '';
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

  function displayPauseButton(): void {
    document.querySelector('.icon-resume')?.classList.add('icon-pause');
    document.querySelector('.icon-resume')?.classList.remove('icon-resume');
  }

  function displayResumeButton(): void {
    document.querySelector('.icon-pause')?.classList.add('icon-resume');
    document.querySelector('.icon-pause')?.classList.remove('icon-pause');
  }

  function displayTimeBar(): void {
    document.querySelector('.next-player-btn').classList.add('hidden');
    document.querySelector('.after-game-controls').classList.add('hidden');
    document.querySelector('.time-bar').classList.remove('hidden');
  }

  function displayNextPlayerButton(): void {
    document.querySelector('.after-game-controls').classList.add('hidden');
    document.querySelector('.time-bar').classList.add('hidden');
    document.querySelector('.next-player-btn').classList.remove('hidden');
  }

  function displayAfterGameControls(): void {
    document.querySelector('.time-bar').classList.add('hidden');
    document.querySelector('.next-player-btn').classList.add('hidden');
    document.querySelector('.after-game-controls').classList.remove('hidden');
  }

  function displayAttackPromptMessage(playerName: string): void {
    document.querySelector(
      '.status-message',
    ).innerHTML = `${playerName}, it's your turn to shoot the salvo!`;
  }

  function displayMissedAttackMessage(playerName: string): void {
    document.querySelector('.status-message').innerHTML = `${playerName} missed!`;
  }

  function displayDoubleShotMessage(playerName: string): void {
    document.querySelector(
      '.status-message',
    ).innerHTML = `${playerName}, you cannot shoot the same cell twice!`;
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

  function displaySurrenderMessage(playerName: string): void {
    document.querySelector('.status-message').innerHTML = `${playerName} surrendered!`;
  }

  function displayTimeOutMessage(playName: string): void {
    document.querySelector('.status-message').innerHTML = `${playName} ran out of time!`;
  }

  function displayPausedMessage(): void {
    document.querySelector('.status-message').innerHTML = 'Game is paused.';
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

  function displayMutedIcon(): void {
    document.querySelector('.icon-unmuted').classList.add('icon-muted');
    document.querySelector('.icon-unmuted').classList.remove('icon-unmuted');
  }

  function displayUnmutedIcon(): void {
    document.querySelector('.icon-muted').classList.add('icon-unmuted');
    document.querySelector('.icon-muted').classList.remove('icon-muted');
  }

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

  function handleTimeLimitSettings(newTimeLimit: 5 | 10 | 15): void {
    document.querySelector('#timeLimitSettingsButton').innerHTML = `${String(
      newTimeLimit,
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
      ?.classList.add('missed-cell', 'icon-cross');
  }

  function drawHitAttack(attack: Coordinate, containerClass: string): void {
    document
      .querySelector(`.${containerClass} .R${attack[0]}C${attack[1]}`)
      .classList.add('hit-cell', 'icon-cross');
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

  function changeBoardView(): void {
    if (DOMVars.displayedBoard === undefined) {
      DOMVars.displayedBoard = document.querySelector('.left-board');
    }

    // Put one node in the 'displayed' container and the other in the 'hidden'
    if (DOMVars.displayedBoard.classList.contains('left-board')) {
      DOMVars.displayedBoard.remove();
      const rightBoardCopy = document.querySelector('.right-board');
      rightBoardCopy.remove();

      document.querySelector('.game-play').children[1].children[0].append(rightBoardCopy);
      document.querySelector('.game-play').children[1].children[2].append(DOMVars.displayedBoard);

      DOMVars.displayedBoard = rightBoardCopy;
    } else if (DOMVars.displayedBoard.classList.contains('right-board')) {
      DOMVars.displayedBoard.remove();
      const leftBoardCopy = document.querySelector('.left-board');
      leftBoardCopy.remove();

      document.querySelector('.game-play').children[1].children[0].append(leftBoardCopy);
      document.querySelector('.game-play').children[1].children[2].append(DOMVars.displayedBoard);

      DOMVars.displayedBoard = leftBoardCopy;
    }

    // Rotate the arrow
    document.querySelector('.icon-right-arrow').classList.toggle('rotate-180');
  }

  function playMissedSound(): void {
    const missedAudio = new Audio('../src/assets/audio/plop.wav');
    missedAudio.addEventListener('canplaythrough', (event) => {
      missedAudio.play();
    });
  }

  function playHitSound(): void {
    const hitAudio = new Audio('../src/assets/audio/cannon_shot.mov');
    hitAudio.addEventListener('canplaythrough', (event) => {
      hitAudio.play();
    });
  }

  function drawUpdatedTick(newX: number): void {
    const tickElement = document.querySelector('.tick');
    (<HTMLElement>tickElement).style.transform = `translateX(${newX}%)`;
  }

  function resetTick(): void {
    const tickElement = document.querySelector('.tick');
    (<HTMLElement>tickElement).style.transform = 'translateX(-100%)';
  }

  async function loadGameMenuScene(): Promise<any> {
    // Animation
    if (document.body.children[0] !== undefined) {
      document.body.children[0].classList.add('opacity-0');
      await new Promise((resolve) => {
        setTimeout(() => {
          document.body.children[0].classList.remove('opacity-0');
          document.body.children[0].remove();
          resolve('');
        }, 1000);
      });
    }

    document.body.insertBefore(
      DOMNodes.gameMenuScene.cloneNode(true),
      document.body.lastElementChild,
    );

    // Animation
    document.body.querySelector('.game-menu').classList.add('opacity-0');
    await new Promise((resolve) => {
      setTimeout(() => {
        document.body.querySelector('.game-menu').classList.remove('opacity-0');
        resolve('');
      }, 1000);
    });
  }

  async function loadCountDownScene(count: number): Promise<any> {
    // Animation
    if (document.body.children[0] !== undefined) {
      document.body.children[0].classList.add('opacity-0');
      await new Promise((resolve) => {
        setTimeout(() => {
          document.body.children[0].classList.remove('opacity-0');
          document.body.children[0].remove();
          resolve('');
        }, 1000);
      });
    }

    document.body.insertBefore(
      DOMNodes.countDownScene.cloneNode(true),
      document.body.lastElementChild,
    );
    document.querySelector('.count-down').children[0].innerHTML = `${count}`;

    // Animation
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve('');
      }, 1000);
    });
  }

  async function loadGameSetupScene(playerName: string, ships?: ShipMap): Promise<any> {
    // Animation
    if (document.body.children[0] !== undefined) {
      document.body.children[0].classList.add('opacity-0');
      await new Promise((resolve) => {
        setTimeout(() => {
          document.body.children[0].classList.remove('opacity-0');
          document.body.children[0].remove();
          resolve('');
        }, 1000);
      });
    }

    const clone = DOMNodes.gameSetupScene.cloneNode(true);
    const cloneBoard = DOMNodes.boardTemplate.cloneNode(true);
    clone.childNodes[3].appendChild(cloneBoard);
    document.body.insertBefore(clone, document.body.lastElementChild);
    document.querySelector('.board-template').classList.add('setup-board');
    document.querySelector('.setup-message').innerHTML = `${playerName} arrange your ships.`;
    drawAllShips(ships, 'setup-board');

    // Animation
    document.querySelector('.game-setup').classList.add('opacity-0');
    await new Promise((resolve) => {
      setTimeout(() => {
        document.querySelector('.game-setup').classList.remove('opacity-0');
        resolve('');
      }, 1000);
    });
  }

  async function loadGamePlayScene(ships?: ShipMap): Promise<any> {
    // Animation
    if (document.body.children[0] !== undefined) {
      document.body.children[0].classList.add('opacity-0');
      await new Promise((resolve) => {
        setTimeout(() => {
          document.body.children[0].classList.remove('opacity-0');
          document.body.children[0].remove();
          resolve('');
        }, 1000);
      });
    }

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

    // Animation
    document.querySelector('.game-play').classList.add('opacity-0');
    await new Promise((resolve) => {
      setTimeout(() => {
        document.querySelector('.game-play').classList.remove('opacity-0');
        resolve('');
      }, 1000);
    });
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
        const playerMode = (<HTMLInputElement>document.querySelector('#playerModeSwitch'))?.checked;
        const timeLimitSettingsBtn = document.querySelector('#timeLimitSettingsButton');
        let timeLimit: 5 | 10 | 15;
        if (timeLimitSettingsBtn.innerHTML.search('15') !== -1) {
          timeLimit = 15;
        } else if (timeLimitSettingsBtn.innerHTML.search('10') !== -1) {
          timeLimit = 10;
        } else {
          timeLimit = 5;
        }
        controller.startGame(playerMode, timeLimit);
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

      if (source.classList.contains('icon-rotation')) {
        controller.transformShipRequested(DOMVars.selectedShip, DOMVars.selectedCoord);
      }

      if (source.classList.contains('done-button')) {
        controller.setupComplete();
      }

      if (source.classList.contains('icon-pause')) {
        controller.pause();
      } else if (source.classList.contains('icon-resume')) {
        controller.resume();
      }

      if (source.classList.contains('icon-surrender-flag')) {
        controller.surrender();
      }

      if (
        source.parentElement.classList.contains('right-board')
        && source.classList.contains('clicked')
      ) {
        controller.attackRequested(extractCoordsFromClass(source), true);
      }

      if (source.classList.contains('next-player-btn')) {
        controller.nextRound();
      }

      if (source.classList.contains('replay-btn')) {
        controller.replay();
      }

      if (source.classList.contains('main-menu-btn')) {
        controller.mainMenu();
      }

      if (source.classList.contains('icon-muted')) {
        controller.unmute();
      } else if (source.classList.contains('icon-unmuted')) {
        controller.mute();
      }

      if (source.classList.contains('icon-right-arrow')) {
        changeBoardView();
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
    DOMVars.selectedCoord = [0, 0];
    DOMVars.drag = false;
  }

  function init(Controller: Controller) {
    initListeners();
    initNodes();
    loadGameMenuScene();
    initVars();
    controller = Controller;
  }

  return {
    init,
    loadGameMenuScene,
    loadGameSetupScene,
    loadCountDownScene,
    loadGamePlayScene,
    drawShip,
    drawSelectionOfShip,
    drawSelectionOfCoordinate,
    eraseShip,
    eraseSelectionOfShip,
    eraseSelectionOfCoordinate,
    drawMissedAttack,
    drawHitAttack,
    updateClock,
    resetClock,
    updateRoundCount,
    resetRoundCount,
    displayPauseButton,
    displayResumeButton,
    displayMutedIcon,
    displayUnmutedIcon,
    displayTimeBar,
    displayNextPlayerButton,
    displayAfterGameControls,
    displayAttackPromptMessage,
    displayMissedAttackMessage,
    displayDoubleShotMessage,
    displayHitMessage,
    displaySunkMessage,
    displayGameOverMessage,
    displaySurrenderMessage,
    displayTimeOutMessage,
    displayPausedMessage,
    drawUpdatedTick,
    playMissedSound,
    playHitSound,
    resetTick,
    redrawBoards,
    resetSelectedShip,
    setSelectedCoord,
    setSelectedShip,
  };
}
