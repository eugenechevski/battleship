/**
 * The module stores the internal view of the enemy's board.
 * It also provides the backend for generating random attacks for a computer player.
 */
export default function () {
  const enemyGridMap = createMapOfEnemyGrid();
  const possibleAttacks = createPossibleAttacks();
  const coordOfLastAttack: Coordinate[] = [];

  function getEnemyGridMap(): { [index: number]: boolean | Ship } {
    return enemyGridMap;
  }

  function getCoordOfLastAttack(): Coordinate[] {
    return coordOfLastAttack;
  }

  function addLastAttack(lastAttack: Coordinate): void {
    coordOfLastAttack.push(lastAttack);
  }

  function resetLastAttacks(): void {
    while (coordOfLastAttack.length !== 0) {
      coordOfLastAttack.pop();
    }
  }

  function createMapOfEnemyGrid(): { [index: number]: boolean | Ship } {
    const enemyMap: { [index: number]: boolean | Ship } = {};
    for (let row = 0; row < 10; row += 1) {
      for (let col = 0; col < 10; col += 1) {
        enemyMap[row * 10 + col] = true;
      }
    }

    return enemyMap;
  }

  function createPossibleAttacks(): Set<number> {
    const attacks = new Set<number>();
    for (let row = 0; row < 10; row += 1) {
      for (let col = 0; col < 10; col += 1) {
        attacks.add(row * 10 + col);
      }
    }

    return attacks;
  }

  /**
   * Verifies if the top row does not have ships.
   * @param move - move in consideration
   */
  function isValidTop(move: Coordinate): boolean {
    const row = move[0];
    const col = move[1];

    const topMiddle = (row - 1) * 10 + col;

    return row !== 0 && enemyGridMap[topMiddle] === true;
  }

  /**
   * Verifies if the bottom row does not have ships.
   * @param move - move in consideration
   */
  function isValidBottom(move: Coordinate): boolean {
    const row = move[0];
    const col = move[1];

    const bottomMiddle = (row + 1) * 10 + col;

    return row !== 9 && enemyGridMap[bottomMiddle] === true;
  }

  /**
   * Verifies if the left column does not have ships.
   * @param move - move in consideration
   */
  function isValidLeft(move: Coordinate): boolean {
    const row = move[0];
    const col = move[1];

    const leftMiddle = row * 10 + col - 1;

    return col !== 0 && enemyGridMap[leftMiddle] === true;
  }

  /**
   * Verifies if the right column does not have ships.
   * @param move - move in consideration
   */
  function isValidRight(move: Coordinate): boolean {
    const row = move[0];
    const col = move[1];

    const rightMiddle = row * 10 + col + 1;

    return col !== 9 && enemyGridMap[rightMiddle] === true;
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
      const availAttacks = [...possibleAttacks.keys()];
      const randomAttack = availAttacks[Math.floor(Math.random() * availAttacks.length)];
      const row = Math.floor(randomAttack / 10);
      const col = Math.floor(randomAttack % 10);

      move = [row, col];
    }

    return <Coordinate>move;
  }

  function markAsMissed(attack: Coordinate): void {
    const row = attack[0];
    const col = attack[1];

    const keyAttack = row * 10 + col;
    if (keyAttack in enemyGridMap) {
      enemyGridMap[keyAttack] = false;
      possibleAttacks.delete(keyAttack);
    }
  }

  function markAsHit(attack: Coordinate, enemyShip: Ship): void {
    const row = attack[0];
    const col = attack[1];

    const keyAttack = row * 10 + col;
    if (keyAttack in enemyGridMap) {
      enemyGridMap[keyAttack] = enemyShip;
      possibleAttacks.delete(keyAttack);
    }
  }

  function markAroundHorizontally(shipCoords: Coordinate[]): void {
    const firstCoord = shipCoords[0];
    const lastCoord = shipCoords.slice(-1)[0];

    markAsMissed([firstCoord[0] - 1, firstCoord[1] - 1]);
    markAsMissed([firstCoord[0], firstCoord[1] - 1]);
    markAsMissed([firstCoord[0] + 1, firstCoord[1] - 1]);

    const row = firstCoord[0];
    for (let col = firstCoord[1]; col <= lastCoord[1]; col += 1) {
      markAsMissed([row - 1, col]);
      markAsMissed([row + 1, col]);
    }

    markAsMissed([lastCoord[0] - 1, lastCoord[1] + 1]);
    markAsMissed([lastCoord[0], lastCoord[1] + 1]);
    markAsMissed([lastCoord[0] + 1, lastCoord[1] + 1]);
  }

  function markAroundVertically(shipCoords: Coordinate[]): void {
    const firstCoord = shipCoords[0];
    const lastCoord = shipCoords.slice(-1)[0];

    markAsMissed([firstCoord[0] - 1, firstCoord[1] - 1]);
    markAsMissed([firstCoord[0] - 1, firstCoord[1]]);
    markAsMissed([firstCoord[0] - 1, firstCoord[1] + 1]);

    const col = firstCoord[1];
    for (let row = firstCoord[0]; row <= lastCoord[0]; row += 1) {
      markAsMissed([row, col - 1]);
      markAsMissed([row, col + 1]);
    }

    markAsMissed([lastCoord[0] + 1, lastCoord[1] - 1]);
    markAsMissed([lastCoord[0] + 1, lastCoord[1]]);
    markAsMissed([lastCoord[0] + 1, lastCoord[1] + 1]);
  }

  /**
   * Updates the map of potentially valid attacks that can be produced on the enemy's board
   * after the last attack has sunk a ship. It removes all potential attacks around that ship.
   * @param attack - last attack
   */
  function markAroundAsMissed(shipCoords: Coordinate[]): void {
    const firstCoord = shipCoords[0];
    const lastCoord = shipCoords.slice(-1)[0];

    if (firstCoord[0] - lastCoord[0] === 0) {
      markAroundHorizontally(shipCoords);
    } else {
      markAroundVertically(shipCoords);
    }
  }

  function generateForTheFirstCase(): Coordinate {
    return pickRandomMove();
  }

  function generateForTheSecondCase(): Coordinate {
    const lastMove = coordOfLastAttack[0];
    const potentialMoves = [];

    const top: Coordinate = [lastMove[0] - 1, lastMove[1]];
    if (isValidTop(lastMove)) {
      potentialMoves.push(top);
    }

    const bottom: Coordinate = [lastMove[0] + 1, lastMove[1]];
    if (isValidBottom(lastMove)) {
      potentialMoves.push(bottom);
    }

    const left: Coordinate = [lastMove[0], lastMove[1] - 1];
    if (isValidLeft(lastMove)) {
      potentialMoves.push(left);
    }

    const right: Coordinate = [lastMove[0], lastMove[1] + 1];
    if (isValidRight(lastMove)) {
      potentialMoves.push(right);
    }

    return pickRandomMove(potentialMoves);
  }

  function generateForTheThirdCase(): Coordinate {
    const potentialMoves: Coordinate[] = [];
    const firstMove = coordOfLastAttack[0];
    const lastMove = coordOfLastAttack[1];

    // Horizontal possible moves
    if (firstMove[0] === lastMove[0]) {
      // The last move is more left than the first move
      let left: Coordinate = [firstMove[0], firstMove[1]];
      let right: Coordinate = [lastMove[0], lastMove[1]];

      // The first move is on the right of the left move
      if (firstMove[1] - lastMove[1] > 0) {
        left = [lastMove[0], lastMove[1]];
        right = [firstMove[0], firstMove[1]];
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
      let top: Coordinate = [firstMove[0], firstMove[1]];
      let bottom: Coordinate = [lastMove[0], lastMove[1]];

      // The first move is lower than the last move
      if (firstMove[0] - lastMove[0] > 0) {
        top = [lastMove[0], lastMove[1]];
        bottom = [firstMove[0], firstMove[1]];
      }

      if (isValidTop(top)) {
        potentialMoves.push(top);
      }

      if (isValidBottom(bottom)) {
        potentialMoves.push(bottom);
      }
    }

    return pickRandomMove(potentialMoves);
  }

  return {
    getCoordOfLastAttack,
    getEnemyGridMap,
    addLastAttack,
    resetLastAttacks,
    markAroundAsMissed,
    markAsHit,
    markAsMissed,
    generateForTheFirstCase,
    generateForTheSecondCase,
    generateForTheThirdCase,
  };
}
