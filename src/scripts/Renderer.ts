import { DOMNodes } from './DOMNodes';
import { DOMVars } from './DOMVars';

export default function (controller: Controller) {
  function loadGameMenuScene(): void {
    if (!document.body.lastElementChild.className.startsWith('testing-controls')) {
      document.body.lastElementChild.remove();
    }
    document.body.appendChild(DOMNodes.gameMenu.cloneNode(true));
  }

  function loadCountDownScene(): void {
    if (!document.body.lastElementChild.className.startsWith('testing-controls')) {
      document.body.lastElementChild.remove();
    }
    document.body.appendChild(DOMNodes.countDown.cloneNode(true));
  }

  function loadGameSetupScene(): void {
    if (!document.body.lastElementChild.className.startsWith('testing-controls')) {
      document.body.lastElementChild.remove();
    }

    const clone = DOMNodes.gameSetup.cloneNode(true);
    clone.childNodes[3].appendChild(DOMNodes.boardTemplate.cloneNode(true));
    document.body.appendChild(clone);
  }

  function handleAgainstComputerSwitch(): void {
    DOMVars.againstComputer = !DOMVars.againstComputer;
  }

  function handleTimeLimitSettings(newTimeLimit: 5 | 10 | 15): void {
    DOMVars.timeLimit = newTimeLimit;
    document.querySelector('#timeLimitSettingsButton').innerHTML = `${String(DOMVars.timeLimit)} seconds`;
  }

  function initNodes() {
    DOMNodes.gameMenu = <Element>document.querySelector('.game-menu');
    DOMNodes.gameMenu.remove();

    DOMNodes.countDown = <Element>document.querySelector('.count-down');
    DOMNodes.countDown.remove();

    DOMNodes.boardTemplate = <Element>document.querySelector('.board-template');
    DOMNodes.boardTemplate.remove();
    DOMNodes.gameSetup = <Element>document.querySelector('.game-setup');
    DOMNodes.gameSetup.remove();
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
    });

    // Testing
    document.querySelector('#game-menu-button').addEventListener('click', loadGameMenuScene);
    document.querySelector('#count-down-button').addEventListener('click', loadCountDownScene);
    document.querySelector('#setup-button').addEventListener('click', loadGameSetupScene);
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
