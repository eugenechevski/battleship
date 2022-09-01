/* eslint-disable no-undef */
/**
 * The module provides methods for the 'Renderer' module
 * to load different scenes and display it asynchronously.
 */
export default function (renderer: Renderer): ScenesLoaders {
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
      renderer.DOMNodes.gameMenuScene.cloneNode(true),
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
      renderer.DOMNodes.countDownScene.cloneNode(true),
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

    const clone = renderer.DOMNodes.gameSetupScene.cloneNode(true);
    const cloneBoard = renderer.DOMNodes.boardTemplate.cloneNode(true);
    clone.childNodes[3].appendChild(cloneBoard);
    document.body.insertBefore(clone, document.body.lastElementChild);
    document.querySelector('.board-template').classList.add('setup-board');
    document.querySelector('.setup-message').innerHTML = `${playerName} arrange your ships.`;
    renderer.shipDrawingAPI.drawAllShips(ships, 'setup-board');

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

    const clone = renderer.DOMNodes.gamePlayScene.cloneNode(true);
    document.body.insertBefore(clone, document.body.lastElementChild);
    renderer.appendFreshBoards();

    const shipAliases = Object.keys(ships);
    for (let i = 0; i < shipAliases.length; i += 1) {
      const ship = ships[shipAliases[i]];
      renderer.shipDrawingAPI.drawShip(
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

  return {
    loadGameMenuScene,
    loadGameSetupScene,
    loadCountDownScene,
    loadGamePlayScene,
  };
}
