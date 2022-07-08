import Player from './Player';
import Renderer from './Renderer';

export default function Controller() {
  const renderer = Renderer();
  let status: 'PLAYING' | 'PAUSED' | 'NOT_PLAYING';
  let currentPlayer: Player;
  let nextPlayer: Player;

  function init(self: Controller) {
    renderer.init(self);
  }

  function start(againstComputer: boolean): void {
    status = 'PLAYING';
    currentPlayer = Player(false);
    nextPlayer = Player(againstComputer);
    renderer.loadGameSetupScene(currentPlayer.board.ships);
  }

  function pause(): void {
    status = 'PAUSED';
  }

  function surrender(): void {
    status = 'NOT_PLAYING';
  }

  function terminate(): void {
    status = 'NOT_PLAYING';
  }

  function getSelectedShip(shipAlias: string): Ship {
    return currentPlayer.board.ships[shipAlias];
  }

  function transformShipRequested(target: Ship, src: Coordinate, dest?: Coordinate): void {
    if (dest !== undefined) {
      const result = currentPlayer.board.isValidToMoveShip(target, src, dest);

      if (result) {
        const oldCoords = target.getArrayCoordinates();
        currentPlayer.board.transformShip(target, result);
        renderer.eraseShip(oldCoords, target.getOrientation());
        renderer.eraseSelectionOfShip(oldCoords);
        renderer.eraseSelectionOfCoordinate(src);
        renderer.setSelectedCoord(dest);
        renderer.drawShip(
          result,
          currentPlayer.board.tableName[target.getName()],
          target.getOrientation(),
        );
        renderer.drawSelectionOfShip(target.getArrayCoordinates());
        renderer.drawSelectionOfCoordinate(dest);
      }
    } else {
      const result = currentPlayer.board.isValidToRotateShip(target, src);

      if (result) {
        const oldCoords = target.getArrayCoordinates();
        renderer.eraseShip(oldCoords, target.getOrientation());
        currentPlayer.board.transformShip(
          target,
          result,
          target.getOrientation() === 'VERTICAL' ? 'HORIZONTAL' : 'VERTICAL',
        );
        renderer.drawShip(
          result,
          currentPlayer.board.tableName[target.getName()],
          target.getOrientation(),
        );
      }
    }
  }

  function newAttack(attack: Coordinate): void {}

  function nextRound(): void {}

  return {
    init,
    start,
    getSelectedShip,
    transformShipRequested,
  };
}
