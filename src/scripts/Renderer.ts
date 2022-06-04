import { DOMNodes } from './DOMNodes';
import { DOMVars } from './DOMVars';

export default function (controller: Controller) {
  function loadGameMenuScene(): void {
    document.body.lastChild.remove();
    document.body.appendChild(DOMNodes.gameMenu.cloneNode(true));
  }

  function loadCountDownScene(): void {
    document.body.lastChild.remove();
    document.body.appendChild(DOMNodes.countDown.cloneNode(true));
  }

  function loadGameSetupScene(): void {
    document.body.lastChild.remove();

    const clone = DOMNodes.gameSetup.cloneNode(true);
    clone.childNodes[3].appendChild(DOMNodes.boardTemplate.cloneNode(true));
    document.body.appendChild(clone);
  }

  function handleAgainstComputerSwitch(): void {
    DOMVars.againstComputer = !DOMVars.againstComputer;
  }

  function handleTimeLimitSettings(newTimeLimit: 5 | 10 | 15): void {
    DOMVars.timeLimit = newTimeLimit;
    DOMNodes.timeLimitSettingsButton.innerHTML = `${String(DOMVars.timeLimit)} seconds`;
  }

  function initNodes() {
    DOMNodes.boardTemplate = <Element>document.querySelector('.board-template');
    document.querySelector('.board-template')?.remove();

    DOMNodes.gameMenu = <Element>document.querySelector('.game-menu');
    DOMNodes.timeLimitSettingsButton = <Element>(
      DOMNodes.gameMenu.querySelector('#timeLimitSettingsButton')
    );

    DOMNodes.gameMenu = <Element>document.querySelector('.game-menu');
    DOMNodes.gameMenu.remove();

    DOMNodes.countDown = <Element>document.querySelector('.count-down');
    DOMNodes.countDown.remove();

    DOMNodes.gameSetup = <Element>document.querySelector('.game-setup');
    DOMNodes.gameSetup.remove();
  }

  function initListeners() {
    // # Game-menu elements

    // Play button
    DOMNodes.gameMenu.querySelector('.play-button').addEventListener('click', () => {
      controller.start(DOMVars.againstComputer, DOMVars.timeLimit);
    });

    // Player mode switch
    DOMNodes.gameMenu
      .querySelector('#playerModeSwitch')
      .addEventListener('click', handleAgainstComputerSwitch);

    // Time-limit options
    const timeLimitOptionElements = DOMNodes.gameMenu.getElementsByClassName('time-limit-option');
    for (let i = 0; i < timeLimitOptionElements.length; i += 1) {
      const timeLimitValue = timeLimitOptionElements[i].innerHTML;
      if (timeLimitValue === '5 seconds') {
        timeLimitOptionElements[i].addEventListener('click', handleTimeLimitSettings.bind(this, 5));
      } else if (timeLimitValue === '10 seconds') {
        timeLimitOptionElements[i].addEventListener(
          'click',
          handleTimeLimitSettings.bind(this, 10),
        );
      } else if (timeLimitValue === '15 seconds') {
        timeLimitOptionElements[i].addEventListener(
          'click',
          handleTimeLimitSettings.bind(this, 15),
        );
      }
    }

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
    initNodes();
    initListeners();
    initVars();
  }

  return {
    init,
  };
}
