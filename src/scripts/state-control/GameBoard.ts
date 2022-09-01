/* eslint-disable no-eval */
/* eslint-disable no-param-reassign */
/* eslint-disable no-use-before-define */
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-undef */
import Ship from './Ship';
import PositionGenerator from './PositionGenerator';
import TransformationValidator from './TransformationValidator';
import EnemyBoardView from './EnemyBoardView';

/**
 * The module represents the internal architecture of a player's board.
 * It stores all sub-components related to the logic of interacting with a board.
 */
export default function (): GameBoard {
  /**
   * The board's ships.
   */
  const ships: ShipMap = {
    AC: Ship('Aircraft Carrier', 5),
    BS: Ship('Battleship', 4),
    CR: Ship('Cruiser', 3),
    D0: Ship('Destroyer 0', 2),
    D1: Ship('Destroyer 1', 2),
    S0: Ship('Submarine 0', 1),
    S1: Ship('Submarine 1', 1),
  };

  /**
   * The object stores a mapping of ships' full names to its shorter versions (aliases).
   */
  const tableName: { [shipName: string]: string } = {
    'Aircraft Carrier': 'AC',
    Battleship: 'BS',
    Cruiser: 'CR',
    'Destroyer 0': 'D0',
    'Destroyer 1': 'D1',
    'Submarine 0': 'S0',
    'Submarine 1': 'S1',
  };

  const grid: Grid = createGrid(PositionGenerator().generateRandomCoords());
  const thisGridMap = createMapOfGrid();
  const transformValidator = TransformationValidator(thisGridMap);
  const enemyBoardView = EnemyBoardView();

  let numberOfShipsAlive = 7;

  /**
   * Updates a ship's position internally.
   *
   * @param target - ship to transform
   * @param newCoords
   * @param newOrientation
   */
  function transformShip(
    target: Ship,
    newCoords: Coordinate[],
    newOrientation?: Orientation,
  ): void {
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

  function getGrid(): Grid {
    return grid;
  }

  function createMapOfGrid(): GridMap {
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
   *
   * @returns - populated grid
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

  /**
   * The function receives the coordinates of an attack produced by the enemy
   * and determines the outcome.
   *
   * @param coord - target coordinates
   * @returns - the result of the attack
   */
  function receiveAttack(coord: Coordinate): AttackResult {
    let result: AttackResult;
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
      // The enemy attacked the same coordinate that he attacked before
    } else {
      result = 'DOUBLE SHOT';
    }

    return result;
  }

  /**
   * Generates a valid attack based on the current state of the enemy's board.
   * There are 3 cases for generating a move.
   * The first case is when we randomly choosing a valid cell.
   * The second case is when we hit a ship the last time and we need to choose randomly a valid
   * move out 4 possible moves(left, right, top, bottom).
   * The third case is when we hit a ship more than once, but did not finish it;
   * in this case, we need to determine the orientation of non-finished ship and pick a valid move.
   */
  function generateAttack(): Coordinate {
    const lastAttack = enemyBoardView.getCoordOfLastAttack();

    // eslint-disable-next-line no-nested-ternary
    return lastAttack.length === 0
      ? enemyBoardView.generateForTheFirstCase()
      : lastAttack.length === 1
        ? enemyBoardView.generateForTheSecondCase()
        : enemyBoardView.generateForTheThirdCase();
  }

  return {
    ships,
    tableName,
    enemyBoardView,
    transformValidator,
    transformShip,
    receiveAttack,
    generateAttack,
    areSunk,
    getGrid,
  };
}
