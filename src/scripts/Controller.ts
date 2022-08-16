/* eslint-disable no-use-before-define */
import Player from './Player';
import Renderer from './Renderer';

export default function Controller() {
  const renderer = Renderer();
  let isPlaying: boolean;
  let currentPlayer: Player;
  let nextPlayer: Player;
  let doubleSetup: boolean;
  let cycles: number;

  function init(self: Controller) {
    renderer.init(self);
  }

  function changePlayers(): void {
    const player = currentPlayer;
    currentPlayer = nextPlayer;
    nextPlayer = player;
  }

  function start(againstComputer: boolean): void {
    cycles = 0;
    isPlaying = true;
    currentPlayer = Player('Player 1', false);
    nextPlayer = Player(!againstComputer ? 'Player 2' : 'Computer', againstComputer);
    doubleSetup = !againstComputer;
    renderer.loadGameSetupScene(currentPlayer.board.ships);
  }

  function setupComplete(): void {
    if (doubleSetup) {
      changePlayers();
      renderer.loadGameSetupScene(currentPlayer.board.ships);
      renderer.resetSelectedShip();
      doubleSetup = false;
    } else {
      renderer.loadGamePlayScene(currentPlayer.board.ships);
    }
  }

  function surrender(): void {
    isPlaying = false;
  }

  function timeout(): void {
    // TODO
  }

  function getSelectedShip(shipAlias: string): Ship {
    return currentPlayer.board.ships[shipAlias];
  }

  function transformShipRequested(target: Ship, src: Coordinate, dest?: Coordinate): void {
    if (dest !== undefined) {
      const result = currentPlayer.board.transformValidator.isValidToTranslateShip(
        target,
        src,
        dest,
      );

      if (result) {
        const oldCoords = target.getArrayCoordinates();
        currentPlayer.board.transformShip(target, result);
        renderer.eraseShip(oldCoords, 'setup-board', target.getOrientation());
        renderer.eraseSelectionOfShip(oldCoords);
        renderer.eraseSelectionOfCoordinate(src);
        renderer.setSelectedCoord(dest);
        renderer.drawShip(
          result,
          'setup-board',
          'black',
          target.getOrientation(),
          currentPlayer.board.tableName[target.getName()],
        );
        renderer.drawSelectionOfShip(target.getArrayCoordinates());
        renderer.drawSelectionOfCoordinate(dest);
      }
    } else {
      const result = currentPlayer.board.transformValidator.isValidToRotateShip(target, src);

      if (result) {
        const oldCoords = target.getArrayCoordinates();
        renderer.eraseShip(oldCoords, 'setup-board', target.getOrientation());
        currentPlayer.board.transformShip(
          target,
          result,
          target.getOrientation() === 'VERTICAL' ? 'HORIZONTAL' : 'VERTICAL',
        );
        renderer.eraseSelectionOfShip(oldCoords);
        renderer.drawSelectionOfShip(result);
        renderer.drawShip(
          result,
          'setup-board',
          'black',
          target.getOrientation(),
          currentPlayer.board.tableName[target.getName()],
        );
      }
    }
  }

  function updateCycle(): void {
    cycles += 1;
    if (cycles % 2 === 0) {
      renderer.updateRound();
    }
  }

  function nextRound(): void {
    isPlaying = true;
    renderer.redrawBoards(
      currentPlayer.board.ships,
      currentPlayer.board.getGrid(),
      nextPlayer.board.ships,
      nextPlayer.board.getGrid(),
    );
    renderer.displayTimebar();
    renderer.displayAttackPromptMessage(currentPlayer.getName());

  }

  async function playerMissed(attack: Coordinate): Promise<any> {
    renderer.displayMissedAttackMessage(currentPlayer.getName());

    // Draw the missed attack
    if (currentPlayer.isComputer) {
      renderer.drawMissedAttack(attack, 'left-board');
      currentPlayer.board.enemyBoardView.markAsMissed(attack);
    } else {
      renderer.drawMissedAttack(attack, 'right-board');
    }

    changePlayers();
    updateCycle();

    // Reset the state for the next input
    if (currentPlayer.isComputer) {
      // Delay the message
      await new Promise((resolve) => {
        setTimeout(() => {
          renderer.displayAttackPromptMessage(currentPlayer.getName());
          resolve('');
        }, 1000);
      });

      // Delay the input from the computer
      await new Promise((resolve) => {
        setTimeout(() => {
          attackRequested(currentPlayer.board.generateAttack(), false);
          resolve('');
        }, 1000);
      });
    } else if (!nextPlayer.isComputer) {// both players are humans
      renderer.displayNextPlayerButton();
      isPlaying = false;
    } else {
      // Delay the prompt message after the computer player missed
      await new Promise((resolve) => {
        setTimeout(() => {
          renderer.displayAttackPromptMessage(currentPlayer.getName());
          resolve('');
        }, 2000);
      });
    }
  }

  async function playerHit(attack: Coordinate): Promise<any> {
    renderer.displayHitMessage(currentPlayer.getName());

    // Update the view and the state
    if (currentPlayer.isComputer) {
      renderer.drawHitAttack(attack, 'left-board');
      currentPlayer.board.enemyBoardView.markAsHit(
        attack,
        nextPlayer.board.getGrid()[attack[0]][attack[1]],
      );
      currentPlayer.board.enemyBoardView.addLastAttack(attack);

      // Delay the input from the computer
      await new Promise((resolve) => {
        setTimeout(() => {
          attackRequested(currentPlayer.board.generateAttack(), false);
          resolve('');
        }, 2000);
      });
    } else {
      renderer.drawHitAttack(attack, 'right-board');
    }
  }

  async function playerSunk(attack: Coordinate): Promise<any> {
    renderer.displaySunkMessage(currentPlayer.getName());

    // Obtain the ship
    const ship: Ship = nextPlayer.board.getGrid()[attack[0]][attack[1]];

    // Update the view and the internal state
    if (currentPlayer.isComputer) {
      renderer.drawHitAttack(attack, 'left-board');
      renderer.drawShip(ship.getArrayCoordinates(), 'left-board', 'red-500', ship.getOrientation());
      currentPlayer.board.enemyBoardView.markAroundAsMissed(ship.getArrayCoordinates());
      currentPlayer.board.enemyBoardView.markAsHit(attack, ship);
      currentPlayer.board.enemyBoardView.resetLastAttacks();
    } else {
      renderer.drawHitAttack(attack, 'right-board');
      renderer.drawShip(
        ship.getArrayCoordinates(),
        'right-board',
        'red-500',
        ship.getOrientation(),
      );
    }

    // Decide further actions

    // Scenario #1: Game over
    if (nextPlayer.board.areSunk()) {
      // Delay the further actions to let the user see the message that a ship was sunk
      await new Promise((resolve) => {
        setTimeout(() => {
          isPlaying = false;
          renderer.stopClock();
          renderer.displayAfterGameControls();
          renderer.displayGameOverMessage(currentPlayer.getName());
          resolve('');
        }, 2000);
      });
      return;
    }

    // Scenario #2: Continue shooting
    if (currentPlayer.isComputer) {
      // Delay the input
      await new Promise((resolve) => {
        setTimeout(() => {
          attackRequested(currentPlayer.board.generateAttack(), false);
          resolve('');
        }, 2000);
      });
    }
  }

  /**
   * The function serves as a bridge between the view and the internal state of the game.
   * It accepts the incoming attacks and update the state of the game.
   *
   * @param attack - coordinate of the target
   * @param isPlayer - the flag tells where the input is coming from
   */
  function attackRequested(attack: Coordinate, isPlayer: boolean): void {
    if (!isPlaying || currentPlayer.isComputer !== !isPlayer) {
      return;
    }

    const result: AttackResult = nextPlayer.board.receiveAttack(attack);

    if (result === 'MISSED') {
      playerMissed(attack);
    } else if (result === 'DOUBLE SHOT') {
      renderer.displayDoubleShotMessage(currentPlayer.getName());
    } else if (result === 'HIT') {
      playerHit(attack);
    } else if (result === 'SUNK') {
      playerSunk(attack);
    }
  }

  return {
    init,
    start,
    attackRequested,
    getSelectedShip,
    transformShipRequested,
    setupComplete,
    nextRound,
  };
}
