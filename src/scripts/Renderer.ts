import { DOMNodes } from './view-control/DOMNodes';
import { DOMVars } from './view-control/DOMVars';
import ShipDrawing from './view-control/ShipDrawing';
import ScenesLoaders from './view-control/ScenesLoaders';
import Displays from './view-control/Displays';

const missedSound = require('src/assets/audio/plop.wav');
const hitSound = require('src/assets/audio/cannon_shot.mov');

export default function () {
  let controller: Controller;
  let shipDrawingAPI: ShipDrawing;
  let scenesLoadersAPI: ScenesLoaders;
  let displaysAPI: Displays;

  function drawUpdatedTick(newX: number): void {
    const tickElement = document.querySelector('.tick');
    (<HTMLElement>tickElement).style.transform = `translateX(${newX}%)`;
  }

  function resetTick(): void {
    const tickElement = document.querySelector('.tick');
    (<HTMLElement>tickElement).style.transform = 'translateX(-100%)';
  }

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

  function handleTimeLimitSettings(newTimeLimit: 5 | 10 | 15): void {
    document.querySelector('#timeLimitSettingsButton').innerHTML = `${String(
      newTimeLimit,
    )} seconds`;
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

  function resetDisplayedBoard(): void {
    DOMVars.displayedBoard = undefined;
  }

  function playMissedSound(): void {
    const missedAudio = new Audio(missedSound);
    missedAudio.addEventListener('canplaythrough', (event) => {
      missedAudio.play();
    });
  }

  function playHitSound(): void {
    const hitAudio = new Audio(hitSound);
    hitAudio.addEventListener('canplaythrough', (event) => {
      hitAudio.play();
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
          shipDrawingAPI.eraseSelectionOfShip(DOMVars.selectedShip.getArrayCoordinates());
          shipDrawingAPI.eraseSelectionOfCoordinate(DOMVars.selectedCoord);
        }
        setSelectedShip(controller.getSelectedShip(source.getAttribute('name')));
        setSelectedCoord(extractCoordsFromClass(source));
        shipDrawingAPI.drawSelectionOfShip(DOMVars.selectedShip.getArrayCoordinates());
        shipDrawingAPI.drawSelectionOfCoordinate(DOMVars.selectedCoord);

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
    controller = Controller;
    this.displaysAPI = Displays();
    this.shipDrawingAPI = ShipDrawing(this);
    this.scenesLoadersAPI = ScenesLoaders(this);
    displaysAPI = this.displaysAPI;
    shipDrawingAPI = this.shipDrawingAPI;
    scenesLoadersAPI = this.scenesLoadersAPI;

    initListeners();
    initNodes();
    initVars();

    this.scenesLoadersAPI.loadGameMenuScene();
  }

  return {
    init,
    DOMNodes,
    displaysAPI,
    shipDrawingAPI,
    scenesLoadersAPI,
    appendFreshBoards,
    updateClock,
    resetClock,
    updateRoundCount,
    resetRoundCount,
    drawUpdatedTick,
    playMissedSound,
    playHitSound,
    resetTick,
    resetDisplayedBoard,
    resetSelectedShip,
    setSelectedCoord,
    setSelectedShip,
  };
}
