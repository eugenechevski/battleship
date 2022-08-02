/* eslint-disable no-eval */
/* eslint-disable no-param-reassign */
/* eslint-disable no-use-before-define */
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-undef */
import Ship from './Ship';
import Generator from './Generator';
import TransformationValidator from './TransformationValidator';

export default function () {
  const ships: { [index: string]: Ship } = {
    AC: Ship('Aircraft Carrier', 5),
    BS: Ship('Battleship', 4),
    CR: Ship('Cruiser', 3),
    D0: Ship('Destroyer 0', 2),
    D1: Ship('Destroyer 1', 2),
    S0: Ship('Submarine 0', 1),
    S1: Ship('Submarine 1', 1),
  };
  const tableName: { [shipName: string]: string } = {
    'Aircraft Carrier': 'AC',
    Battleship: 'BS',
    Cruiser: 'CR',
    'Destroyer 0': 'D0',
    'Destroyer 1': 'D1',
    'Submarine 0': 'S0',
    'Submarine 1': 'S1',
  };

  const grid: Grid = createGrid(Generator().generateRandomCoords());
  const gridView: string[][] = createGridView();
  const thisGridMap = createMapOfThisGrid();
  const transformValidator = TransformationValidator(thisGridMap);
  const enemyGridMap = createMapOfEnemyGrid();
  const possibleAttacksOnEnemyGrid = createPossibleAttacksSet();
  let numberOfShipsAlive = 7;
  let notFinished: Coordinate[] = [];

  function transformShip(
    target: Ship,
    newCoords: Coordinate[],
    newOrientation?: 'VERTICAL' | 'HORIZONTAL',
  ) {
    // Update the internal state
    if (newOrientation !== undefined) {
      target.setOrientation(newOrientation);
    }

    const oldCoords = target.getArrayCoordinates();
    target.clearCoordinates();
    for (let i = 0; i < oldCoords.length; i += 1) {
      grid[oldCoords[i][0]][oldCoords[i][1]] = true;
      thisGridMap[oldCoords[i][0] * 10 + oldCoords[i][1]] = true;
    }
    for (let i = 0; i < newCoords.length; i += 1) {
      grid[newCoords[i][0]][newCoords[i][1]] = target;
      thisGridMap[newCoords[i][0] * 10 + newCoords[i][1]] = target;
      target.addCoordinate(newCoords[i]);
    }
  }

  function areSunk(): boolean {
    return numberOfShipsAlive === 0;
  }

  function getNumberOfShipsAlive(): number {
    return numberOfShipsAlive;
  }

  function getGrid(): Grid {
    return grid;
  }

  function createGridView(): string[][] {
    const output: string[][] = [];
    for (let row = 0; row < 10; row += 1) {
      output.push([]);
      for (let col = 0; col < 10; col += 1) {
        if (typeof grid[row][col] === 'boolean') {
          output[row].push('.');
        } else {
          const ship = <Ship>grid[row][col];
          output[row].push(tableName[ship.getName()]);
        }
      }
    }

    return output;
  }

  function getGridView(): string[][] {
    return gridView;
  }

  function getEnemyGridMap(): { [index: number]: boolean | Ship } {
    return enemyGridMap;
  }

  function createMapOfThisGrid(): { [index: number]: boolean | Ship } {
    const thisMap: { [index: number]: boolean | Ship } = {};
    for (let row = 0; row < 10; row += 1) {
      for (let col = 0; col < 10; col += 1) {
        thisMap[row * 10 + col] = grid[row][col];
      }
    }

    return thisMap;
  }

  function createFreshGrid(): Grid {
    const outputGrid: Grid = [];

    for (let row = 0; row < 10; row += 1) {
      outputGrid.push([]);
      for (let col = 0; col < 10; col += 1) {
        outputGrid[row].push(true);
      }
    }

    return outputGrid;
  }

  /**
   * The function produces a new copy of the array that serves as the internal grid
   * of the player's board. It populates the array with ships and boolean's 'true' value
   * where 'true' means the cell was not hit before.
   * @returns populated grid
   */
  function createGrid(randomCoords: Coordinate[][]): Grid {
    const freshGrid: Grid = createFreshGrid();

    for (let i = 0; i < randomCoords.length; i += 1) {
      let ship: Ship;

      if (randomCoords[i].length === 5) {
        ship = ships.AC;
      } else if (randomCoords[i].length === 4) {
        ship = ships.BS;
      } else if (randomCoords[i].length === 3) {
        ship = ships.CR;
      } else if (randomCoords[i].length === 2 && i === 3) {
        ship = ships.D0;
      } else if (randomCoords[i].length === 2 && i === 4) {
        ship = ships.D1;
      } else if (randomCoords[i].length === 1 && i === 5) {
        ship = ships.S0;
      } else if (randomCoords[i].length === 1 && i === 6) {
        ship = ships.S1;
      }

      for (let j = 0; j < randomCoords[i].length; j += 1) {
        const coord = randomCoords[i][j];
        ship.addCoordinate(coord);
        freshGrid[coord[0]][coord[1]] = ship;
      }
    }

    return freshGrid;
  }

  function createPossibleAttacksSet(): Set<number> {
    const possibleAttacks = new Set<number>();
    for (let row = 0; row < 10; row += 1) {
      for (let col = 0; col < 10; col += 1) {
        possibleAttacks.add(row * 10 + col);
      }
    }

    return possibleAttacks;
  }

  /**
   * Creates an object that serves as a hash-map for storing valid possible moves
   * that can be produced by the function 'generateAttack'. The map is used only if
   * the 'Player' object has the 'true' value of 'isRobot' property.
   * @returns set of numbers from 0 - 99
   */
  function createMapOfEnemyGrid(): { [index: number]: boolean | Ship } {
    const enemyMap: { [index: number]: boolean | Ship } = {};
    for (let row = 0; row < 10; row += 1) {
      for (let col = 0; col < 10; col += 1) {
        enemyMap[row * 10 + col] = true;
      }
    }

    return enemyMap;
  }

  /**
   * The function receives the coordinates of an attack produced by the enemy
   * and determines the outcome.
   *
   * @param coord - target coordinates
   * @returns - the result of the attack
   */
  function receiveAttack(coord: Coordinate): string {
    updateGridView(coord);

    let result;
    const row = coord[0];
    const col = coord[1];

    // The enemy missed
    if (grid[row][col] === true) {
      result = 'MISSED';
      grid[row][col] = false;
      // The enemy hit a ship's coordinate for the first time
    } else if (typeof grid[row][col] !== 'boolean' && (<Ship>grid[row][col]).hit(coord)) {
      if ((<Ship>grid[row][col]).isSunk()) {
        numberOfShipsAlive -= 1;
        result = 'SUNK';
      } else {
        result = 'HIT';
      }
      // The enemy attacked the same ship's coordinate that he attacked before
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

    const topMiddle = (row - 1) * 10 + col;

    return (row === 0 && enemyGridMap[col] === true) || enemyGridMap[topMiddle] === true;
  }

  /**
   * Verifies if the bottom row does not have ships.
   * @param move - move in consideration
   */
  function isValidBottom(move: Coordinate): boolean {
    const row = move[0];
    const col = move[1];

    const bottomMiddle = (row + 1) * 10 + col;

    return (
      (row === 9 && enemyGridMap[row * 10 + col] === true) || enemyGridMap[bottomMiddle] === true
    );
  }

  /**
   * Verifies if the left column does not have ships.
   * @param move - move in consideration
   */
  function isValidLeft(move: Coordinate): boolean {
    const row = move[0];
    const col = move[1];

    const leftMiddle = row * 10 + col - 1;

    return (col === 0 && enemyGridMap[row * 10] === true) || enemyGridMap[leftMiddle] === true;
  }

  /**
   * Verifies if the right column does not have ships.
   * @param move - move in consideration
   */
  function isValidRight(move: Coordinate): boolean {
    const row = move[0];
    const col = move[1];

    const rightMiddle = row * 10 + col + 1;

    return (
      (col === 9 && enemyGridMap[row * 10 + col] === true) || enemyGridMap[rightMiddle] === true
    );
  }

  /**
   * Chooses a move randomly from given moves or from the known valid cells.
   * @param attacks - moves to choose from
   */
  function pickRandomMove(attacks?: Coordinate[]): Coordinate {
    let move: Coordinate | undefined;

    if (attacks !== undefined) {
      move = attacks[Math.floor(Math.random() * attacks.length)];
    } else {
      const possibleAttacks = [...possibleAttacksOnEnemyGrid.keys()];
      const randomAttack = possibleAttacks[Math.floor(Math.random() * possibleAttacks.length)];
      const row = Math.floor(randomAttack / 10);
      const col = Math.floor(randomAttack % 10);

      move = [row, col];
    }

    return <Coordinate>move;
  }

  function updateNotFinished(newValue: Coordinate[]): void {
    notFinished = newValue;
  }

  function getNotFinished(): Coordinate[] {
    return notFinished;
  }

  function updateGridView(attack: Coordinate): void {
    const row = attack[0];
    const col = attack[1];

    gridView[row][col] = 'X';
  }

  /**
   * Updates the map of potentially valid attacks that can be produced on the enemy's board
   * after the last attack has hit ship or missed.
   * @param attack - last attack
   */
  function markEnemyGridCellAsMissed(attack: Coordinate): void {
    const row = attack[0];
    const col = attack[1];

    const keyAttack = row * 10 + col;
    if (keyAttack in enemyGridMap) {
      enemyGridMap[keyAttack] = false;
      possibleAttacksOnEnemyGrid.delete(keyAttack);
    }
  }

  function markEnemyGridCellAsHit(attack: Coordinate, enemyShip: Ship): void {
    const row = attack[0];
    const col = attack[1];

    const keyAttack = row * 10 + col;
    if (keyAttack in enemyGridMap) {
      enemyGridMap[keyAttack] = enemyShip;
      possibleAttacksOnEnemyGrid.delete(keyAttack);
    }
  }

  /**
   * Updates the map of potentially valid attacks that can be produced on the enemy's board
   * after the last attack has sunk a ship. It removes all potential attacks around that ship.
   * @param attack - last attack
   */
  function markEnemyGridCellsAroundShipAsMissed(shipCoords: Coordinate[]): void {
    const firstCoord = shipCoords[0];
    const lastCoord = shipCoords.slice(-1)[0];

    // Horizontal
    if (firstCoord[0] - lastCoord[0] === 0) {
      markThreeCellsBeforeColumnAsMissed(firstCoord);

      const row = firstCoord[0];
      for (let COL = firstCoord[1]; COL <= lastCoord[1]; COL += 1) {
        markEnemyGridCellAsMissed([row - 1, COL]);
        markEnemyGridCellAsMissed([row + 1, COL]);
      }

      markThreeCellsAfterColumnAsMissed(lastCoord);
    } else {
      // Vertical
      markThreeCellsBeforeRowAsMissed(firstCoord);

      const col = firstCoord[1];
      for (let ROW = firstCoord[0]; ROW <= lastCoord[0]; ROW += 1) {
        markEnemyGridCellAsMissed([ROW, col - 1]);
        markEnemyGridCellAsMissed([ROW, col + 1]);
      }

      markThreeCellsAfterRowAsMissed(lastCoord);
    }
  }

  function markThreeCellsBeforeColumnAsMissed(coord: Coordinate): void {
    // Mark 3 cells before as 'false'
    const row = coord[0];
    const col = coord[1];

    const leftTop = (row - 1) * 10 + col - 1;
    if (leftTop in enemyGridMap) {
      enemyGridMap[leftTop] = false;
      possibleAttacksOnEnemyGrid.delete(leftTop);
    }

    const leftMiddle = row * 10 + col - 1;
    if (leftMiddle in enemyGridMap) {
      enemyGridMap[leftMiddle] = false;
      possibleAttacksOnEnemyGrid.delete(leftMiddle);
    }

    const leftBottom = (row + 1) * 10 + col - 1;
    if (leftBottom in enemyGridMap) {
      enemyGridMap[leftBottom] = false;
      possibleAttacksOnEnemyGrid.delete(leftBottom);
    }
  }

  function markThreeCellsAfterColumnAsMissed(coord: Coordinate): void {
    const row = coord[0];
    const col = coord[1];

    const rightTop = (row + 1) * 10 + col + 1;
    if (rightTop in enemyGridMap) {
      enemyGridMap[rightTop] = false;
      possibleAttacksOnEnemyGrid.delete(rightTop);
    }

    const rightMiddle = row * 10 + col + 1;
    if (rightMiddle in enemyGridMap) {
      enemyGridMap[rightMiddle] = false;
      possibleAttacksOnEnemyGrid.delete(rightMiddle);
    }

    const rightBottom = (row + 1) * 10 + col + 1;
    if (rightBottom in enemyGridMap) {
      enemyGridMap[rightBottom] = false;
      possibleAttacksOnEnemyGrid.delete(rightBottom);
    }
  }

  function markThreeCellsBeforeRowAsMissed(coord: Coordinate): void {
    const row = coord[0];
    const col = coord[1];

    const topLeft = (row - 1) * 10 + col - 1;
    if (topLeft in enemyGridMap) {
      enemyGridMap[topLeft] = false;
      possibleAttacksOnEnemyGrid.delete(topLeft);
    }

    const topMiddle = (row - 1) * 10 + col;
    if (topMiddle in enemyGridMap) {
      enemyGridMap[topMiddle] = false;
      possibleAttacksOnEnemyGrid.delete(topMiddle);
    }

    const topRight = (row - 1) * 10 + col + 1;
    if (topRight in enemyGridMap) {
      enemyGridMap[topRight] = false;
      possibleAttacksOnEnemyGrid.delete(topRight);
    }
  }

  function markThreeCellsAfterRowAsMissed(coord: Coordinate): void {
    const row = coord[0];
    const col = coord[1];

    const bottomLeft = (row + 1) * 10 + col - 1;
    if (bottomLeft in enemyGridMap) {
      enemyGridMap[bottomLeft] = false;
      possibleAttacksOnEnemyGrid.delete(bottomLeft);
    }

    const bottomMiddle = (row + 1) * 10 + col;
    if (bottomMiddle in enemyGridMap) {
      enemyGridMap[bottomMiddle] = false;
      possibleAttacksOnEnemyGrid.delete(bottomMiddle);
    }

    const bottomRight = (row + 1) * 10 + col + 1;
    if (bottomRight in enemyGridMap) {
      enemyGridMap[bottomRight] = false;
      possibleAttacksOnEnemyGrid.delete(bottomRight);
    }
  }

  function generateForTheFirstCase(): Coordinate {
    return pickRandomMove();
  }

  function generateForTheSecondCase(): Coordinate {
    const lastMove = notFinished[0];
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

    return pickRandomMove(potentialMoves);
  }

  function generateForTheThirdCase(): Coordinate {
    const potentialMoves = [];
    const firstMove = notFinished[0];
    const lastMove = notFinished[1];

    // Horizontal possible moves
    if (firstMove[0] === lastMove[0]) {
      // The last move is more left than the first move
      let right: Coordinate = [firstMove[0], firstMove[1] + 1];
      let left: Coordinate = [lastMove[0], lastMove[1] - 1];

      // The last move is more right than the first move
      if (lastMove[1] - firstMove[1] > 0) {
        right = [lastMove[0], lastMove[1] + 1];
        left = [firstMove[0], firstMove[1] - 1];
      }

      if (isValidLeft(left)) {
        potentialMoves.push(left);
      }

      if (isValidRight(right)) {
        potentialMoves.push(right);
      }
      // Vertical possible moves
    } else if (firstMove[1] === lastMove[1]) {
      // The last move is higher than the first move
      let top: Coordinate = [lastMove[0] - 1, lastMove[1]];
      let bottom: Coordinate = [firstMove[0] + 1, firstMove[1]];

      // The last move is lower than the first move
      if (lastMove[0] - firstMove[0] > 0) {
        top = [firstMove[0] - 1, firstMove[1]];
        bottom = [lastMove[0] + 1, lastMove[1]];
      }

      if (isValidTop(top)) {
        potentialMoves.push(top);
      }

      if (isValidBottom(bottom)) {
        potentialMoves.push(bottom);
      }
    }

    return pickRandomMove(<Coordinate[]>potentialMoves);
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
    // eslint-disable-next-line no-nested-ternary
    return notFinished.length === 0
      ? generateForTheFirstCase()
      : notFinished.length === 1
        ? generateForTheSecondCase()
        : generateForTheThirdCase();
  }

  return {
    ships,
    tableName,
    possibleAttacksOnEnemyGrid,
    receiveAttack,
    generateAttack,
    areSunk,
    isValidTop,
    isValidBottom,
    isValidLeft,
    isValidRight,
    markEnemyGridCellsAroundShipAsMissed,
    markEnemyGridCellAsMissed,
    markEnemyGridCellAsHit,
    pickRandomMove,
    getNumberOfShipsAlive,
    getGrid,
    getGridView,
    getNotFinished,
    getEnemyGridMap,
    updateGridView,
    updateNotFinished,
    transformValidator,
    transformShip,
  };
}
