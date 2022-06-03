import { DOMNodes } from './DOMNodes';
import { DOMVars } from './DOMVars';

export default function (controller: Controller) {
  function getBoardTemplate(): Node {
    return DOMNodes.boardTemplate.cloneNode(true);
  }

  function handleTimeLimitSettings(newTimeLimit: 5 | 10 | 15): void {
    DOMVars.timeLimit = newTimeLimit;
    DOMNodes.timeLimitSettingsButton.innerHTML = String(DOMVars.timeLimit) + ' seconds';
  }

  function initNodes() {
    DOMNodes.boardTemplate = <Element>document.querySelector('.board-template');
    document.querySelector('.board-template')?.remove();

    DOMNodes.gameMenu = <Element>document.querySelector('.game-menu');
    DOMNodes.timeLimitSettingsButton = <Element>DOMNodes.gameMenu.querySelector('#timeLimitSettingsButton');
  }

  function initListeners() {
    // Time-limit options
    const timeLimitOptionElements = DOMNodes.gameMenu.getElementsByClassName('time-limit-option');
    for (let i = 0; i < timeLimitOptionElements.length; i += 1) {
      const timeLimitValue = timeLimitOptionElements[i].innerHTML;
      if (timeLimitValue === '5 seconds') {
        timeLimitOptionElements[i].addEventListener('click', handleTimeLimitSettings.bind(this, 5));
      } else if (timeLimitValue === '10 seconds') {
        timeLimitOptionElements[i].addEventListener('click', handleTimeLimitSettings.bind(this, 10));
      } else if (timeLimitValue === '15 seconds') {
        timeLimitOptionElements[i].addEventListener('click', handleTimeLimitSettings.bind(this, 15));
      }
    }
  }

  function initVars() {
    DOMVars.timeLimit = 5;
  }

  function init() {
    initNodes();
    initListeners();
    initVars();
  }

  return {
    init,
    getBoardTemplate,
  };
}
