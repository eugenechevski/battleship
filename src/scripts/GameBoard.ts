/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-undef */
import Ship from './Ship';

export default function (): GameBoard {
  let grid: Grid | undefined;
  // Internal view of the enemy's board
  let enemyGrid: Grid | undefined;
  // Storage for valid possible moves
  // { 0: 0, 1: 1, 2: 2, ..., 99 }
  let validEnemyCells: { [index: number]: number };
  let destroyedShips: number;
  // Storage for coordinates of the last successful attack
  let notFinished:
    | {
        coords: Coordinate[]; // store the first and/or the last coordinate of the last hit ship
      }
    | undefined;

  function areSunk(): boolean {
    return destroyedShips === 0;
  }

  /*
    Populates the grid with either ship objects or boolean values where 'false' means
    the cell was not hit before.
  */
  function initGrid(): void {
    const aircraftCarrier: Ship = Ship(5);
    const battleship: Ship = Ship(4);
    const cruiser: Ship = Ship(3);
    const destroyers: Ship[] = [Ship(2), Ship(2)];
    const subMarines: Ship[] = [Ship(1), Ship(1)];

    grid = [
      [false, false, false, false, false, false, false, false, false, false],
      [
        false,
        [aircraftCarrier, false],
        false,
        [battleship, false],
        [battleship, false],
        [battleship, false],
        [battleship, false],
        false,
        false,
        false,
      ],
      [false, [aircraftCarrier, false], false, false, false, false, false, false, false, false],
      [
        false,
        [aircraftCarrier, false],
        false,
        false,
        false,
        false,
        false,
        false,
        [cruiser, false],
        false,
      ],
      [
        false,
        [aircraftCarrier, false],
        false,
        [destroyers[0], false],
        [destroyers[0], false],
        false,
        [destroyers[1], false],
        false,
        [cruiser, false],
        false,
      ],
      [
        false,
        [aircraftCarrier, false],
        false,
        false,
        false,
        false,
        [destroyers[1], false],
        false,
        [cruiser, false],
        false,
      ],
      [false, false, false, false, false, false, false, false, false, false],
      [false, false, false, [subMarines[0], false], false, false, false, false, false, false],
      [false, false, false, false, false, [subMarines[1], false], false, false, false, false],
      [false, false, false, false, false, false, false, false, false, false],
    ];
  }

  /*
    Populates the internal view of the enemy's board with boolean values
    'false' means the cell was not hit before.
  */
  function initEnemyGrid() {
    enemyGrid = [];
    validEnemyCells = {};
    for (let i = 0; i < 10; i += 1) {
      enemyGrid.push([]);
      for (let j = 0; j < 10; j += 1) {
        enemyGrid[i].push(false);
        validEnemyCells[i * 10 + j] = j;
      }
    }
    notFinished = undefined;
  }

  function receiveAttack(coord: Coordinate): ShotResult {
    let result: ShotResult;

    if (grid[coord[0]][coord[1]] === true) {
      result = 'MISSED';
      grid[coord[0]][coord[1]] = false;
    } else if (
      typeof grid[coord[0]][coord[1]] !== 'boolean'
      && grid[coord[0]][coord[1]][1] === true
    ) {
      result = 'HIT';
      grid[coord[0]][coord[1]][0].hit();
      grid[coord[0]][coord[1]][1] = false;
      destroyedShips -= grid[coord[0]][coord[1]][0].isSunk() ? 1 : 0;
    } else {
      result = 'DOUBLE-SHOT';
    }

    return result;
  }

  /**
   * Verifies if the top row does not have ships.
   * @param move - move in consideration
   */
  function isValidTop(move: Coordinate): boolean {
    const row = move[0];
    const col = move[1];

    const topLeft = (row - 1) * 10 + col - 1;
    const topMiddle = (row - 1) * 10 + col;
    const topRight = (row - 1) * 10 + col + 1;

    return (
      row === 0
      || (topLeft in validEnemyCells && topMiddle in validEnemyCells && topRight in validEnemyCells)
    );
  }

  /**
   * Verifies if the bottom row does not have ships.
   * @param move - move in consideration
   */
  function isValidBottom(move: Coordinate): boolean {
    const row = move[0];
    const col = move[1];

    const bottomLeft = (row + 1) * 10 + col - 1;
    const bottomMiddle = (row + 1) * 10 + col;
    const bottomRight = (row + 1) * 10 + col + 1;

    return (
      row === 9
      || (bottomLeft in validEnemyCells
        && bottomMiddle in validEnemyCells
        && bottomRight in validEnemyCells)
    );
  }

  /**
   * Verifies if the left column does not have ships.
   * @param move - move in consideration
   */
  function isValidLeft(move: Coordinate): boolean {
    const row = move[0];
    const col = move[1];

    const leftTop = (row - 1) * 10 + col - 1;
    const leftMiddle = row * 10 + col - 1;
    const leftBottom = (row + 1) * 10 + col + 1;

    return (
      col === 0
      || (leftTop in validEnemyCells
      && leftMiddle in validEnemyCells
      && leftBottom in validEnemyCells)
    );
  }

  /**
   * Verifies if the right column does not have ships.
   * @param move - move in consideration
   */
  function isValidRight(move: Coordinate): boolean {
    const row = move[0];
    const col = move[1];

    const rightTop = (row - 1) * 10 + col + 1;
    const rightMiddle = row * 10 + col + 1;
    const rightBottom = (row + 1) * 10 + col + 1;

    return (
      col === 9
      || (rightTop in validEnemyCells
        && rightMiddle in validEnemyCells
        && rightBottom in validEnemyCells)
    );
  }

  /**
   * Chooses a move randomly from given moves or from the known valid cells.
   * @param moves - moves to choose from
   */
  function pickRandomMove(moves?: Coordinate[]): Coordinate {
    let move: Coordinate;

    if (moves !== undefined) {
      move = moves[Math.floor(Math.random() * moves.length)];
    } else {
      // Obtain all valid cells to shoot
      const validCells = Object.keys(validEnemyCells);
      // Pick a random number from those cells in one-dimensional format
      const oneD = Number(validCells[Math.floor(Math.random() * validCells.length)]);
      // Derive the row and the column
      const row = Math.floor(oneD / 10);
      const col = Math.floor(oneD % 10);
      // Pack it up
      move = [row, col];
    }

    return move;
  }

  /**
   * Updates the map of potential valid moves of the enemy grid after a ship was hit.
   * @param move - last move
   */
  function updateValidMoves(move: Coordinate): void {
    const row = move[0];
    const col = move[1];

    // | ? |   |   |
    // |   | x |   |
    const topLeft = (row - 1) * 10 + col - 1;
    if (topLeft in validEnemyCells) {
      delete validEnemyCells[topLeft];
    }
    // |   | ? |   |
    // |   | x |   |
    const topMiddle = (row - 1) * 10 + col;
    if (topMiddle in validEnemyCells) {
      delete validEnemyCells[topMiddle];
    }
    // |   |   | ? |
    // |   | x |   |
    const topRight = (row - 1) * 10 + col + 1;
    if (topRight in validEnemyCells) {
      delete validEnemyCells[topRight];
    }
    // ? | x |   |
    const left = row * 10 + col - 1;
    if (left in validEnemyCells) {
      delete validEnemyCells[left];
    }
    //  | x | ? |
    const right = row * 10 + col + 1;
    if (right in validEnemyCells) {
      delete validEnemyCells[right];
    }
    //   | x |   |
    // ? |   |   |
    const bottomLeft = (row + 1) * 10 + col - 1;
    if (bottomLeft in validEnemyCells) {
      delete validEnemyCells[bottomLeft];
    }

    //   | x |   |
    //   | ? |   |
    const bottomMiddle = (row + 1) * 10 + col;
    if (bottomMiddle in validEnemyCells) {
      delete validEnemyCells[bottomMiddle];
    }

    //   | x |   |
    //   |   | ? |
    const bottomRight = (row + 1) * 10 + col + 1;
    if (bottomRight in validEnemyCells) {
      delete validEnemyCells[bottomRight];
    }
  }

  /**
   * Generates a valid attack based on the current state of the enemy's board.
   * It uses the internal view of the enemy's board to determine a valid move, and
   * it accounts the last actions.
   * The 'notFinished' variable will tell us whether we hit a ship before or not;
   * its value is set by the 'Controller' module because the module has an access to the
   * other board.
   * There are 3 cases for generating a move.
   * The first case is when we randomly choosing a valid cell.
   * The second case is when we hit a ship the last time and we need to choose randomly a valid
   * move out 4 possible moves(left, right, top, bottom).
   * The third case is when we hit a ship more than once, but did not finish it;
   * in this case, we need to determine the orientation of non-finished ship and pick a valid move.
   */
  function generateAttack(): Coordinate {
    let move: Coordinate | undefined;

    // The first case
    if (notFinished.coords === undefined) {
      move = pickRandomMove();
    }

    // The second case
    if (notFinished.coords !== undefined && notFinished.coords.length === 1) {
      const lastMove = notFinished.coords[0];
      const potentialMoves = [];

      const top: Coordinate = [lastMove[0] - 1, lastMove[1]];
      if (isValidTop(top)) {
        potentialMoves.push(top);
      }

      const bottom: Coordinate = [lastMove[0] + 1, lastMove[1]];
      if (isValidBottom(bottom)) {
        potentialMoves.push(bottom);
      }

      const left: Coordinate = [lastMove[0], lastMove[1] - 1];
      if (isValidLeft(left)) {
        potentialMoves.push(left);
      }

      const right: Coordinate = [lastMove[0], lastMove[1] + 1];
      if (isValidRight(right)) {
        potentialMoves.push(right);
      }

      move = pickRandomMove(potentialMoves);
    }

    // The third case
    if (notFinished.coords.length === 2) {
      const potentialMoves = [];
      const firstMove = notFinished.coords[0];
      const lastMove = notFinished.coords[1];

      // Vertical possible moves
      let top: Coordinate | undefined;
      let bottom: Coordinate | undefined;

      // The last move is lower than the first move
      if (lastMove[0] - firstMove[0] > 0) {
        top = [firstMove[0] - 1, firstMove[1]];
        bottom = [lastMove[0] + 1, lastMove[1]];
      }

      // The last move is higher than the first move
      if (lastMove[0] - firstMove[0] < 0) {
        top = [lastMove[0] - 1, lastMove[1]];
        bottom = [firstMove[0] + 1, firstMove[1]];
      }

      if (isValidTop(<Coordinate>top)) {
        potentialMoves.push(top);
      }

      if (isValidBottom(<Coordinate>bottom)) {
        potentialMoves.push(top);
      }

      // Horizontal possible moves
      let left: Coordinate | undefined;
      let right: Coordinate | undefined;

      // The last move is more right than the first move
      if (lastMove[1] - firstMove[1] > 0) {
        right = [lastMove[0], lastMove[1] + 1];
        left = [firstMove[0], firstMove[1] - 1];
      }

      // The last move is more left than the first move
      if (lastMove[1] - firstMove[1] < 0) {
        right = [firstMove[0], firstMove[1] + 1];
        left = [lastMove[0], lastMove[1] - 1];
      }

      if (isValidLeft(<Coordinate>left)) {
        potentialMoves.push(left);
      }

      if (isValidRight(<Coordinate>right)) {
        potentialMoves.push(right);
      }

      move = pickRandomMove(<Coordinate[]>potentialMoves);
    }

    return <Coordinate>move;
  }

  return {
    receiveAttack,
    generateAttack,
    areSunk,
    initGrid,
    initEnemyGrid,
    grid,
    enemyGrid,
    notFinished,
  };
}
