import Player from './Player';
import Renderer from './Renderer';

export default function Controller() {
  const renderer = Renderer();
  let status: 'PLAYING'| 'NOT_PLAYING';
  let currentPlayer: Player;
  let nextPlayer: Player;
  let doubleSetup: boolean;

  function init(self: Controller) {
    renderer.init(self);
  }

  function start(againstComputer: boolean): void {
    status = 'PLAYING';
    currentPlayer = Player(false);
    nextPlayer = Player(againstComputer);
    doubleSetup = !againstComputer;
    renderer.loadGameSetupScene(currentPlayer.board.ships);
  }

  function setupComplete(): void {
    if (doubleSetup) {
      renderer.loadGameSetupScene(nextPlayer.board.ships);
      renderer.resetSelectedShip();
      doubleSetup = false;
    } else {
      renderer.loadGamePlayScene(currentPlayer.board.ships);
    }
  }

  function surrender(): void {
    status = 'NOT_PLAYING';
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
          currentPlayer.board.tableName[target.getName()],
          'setup-board',
          target.getOrientation(),
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
        renderer.drawShip(
          result,
          currentPlayer.board.tableName[target.getName()],
          'setup-board',
          target.getOrientation(),
        );
      }
    }
  }

  function nextRound(): void {

  }

  function attackRequested(attack: Coordinate): void {
    const result: AttackResult = nextPlayer.board.receiveAttack(attack);

    if (result === 'MISSED') {
      currentPlayer.board.enemyBoardView.markAsMissed(attack);
      if (currentPlayer.isComputer) {
        renderer.drawMissedAttack(attack, 'left-border');
      } else {
        renderer.drawMissedAttack(attack, 'right-border');
      }

      let player = currentPlayer;
      currentPlayer = nextPlayer;
      nextPlayer = player;
      if (nextPlayer.isComputer) {
        attackRequested(currentPlayer.board.generateAttack());
      } else {
        renderer.displayNextPlayerButton();
      }
    } else if (result === 'DOUBLE SHOT') {
      // do nothing
    } else if (result === 'HIT') {
      // update the enemy board view
      // draw a hit
      // reset a shot timer
    } else if (result === 'SUNK') {
      // check if the game is over
      // draw a sunk ship
      // draw a hit
      // reset a shot timer
    }
  }

  return {
    init,
    start,
    attackRequested,
    getSelectedShip,
    transformShipRequested,
    setupComplete,
  };
}
