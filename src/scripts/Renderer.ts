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
    document.querySelectorAll('.board-template').forEach((el) => el.classList.add('game-play-board'));
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
  }

  function initVars() {
    DOMVars.timeLimit = 5;
    DOMVars.againstComputer = true;
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
