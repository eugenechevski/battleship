/* eslint-disable no-undef */
/* eslint-disable import/no-unresolved */
// eslint-disable-next-line import/extensions
import GameBoard from '../src/scripts/GameBoard';

test('Generating an attack without background information.', () => {
  const board = GameBoard();
  const attack = board.generateAttack();
  expect(attack[0]).toBeGreaterThanOrEqual(0);
  expect(attack[0]).toBeLessThanOrEqual(9);
  expect(attack[1]).toBeGreaterThanOrEqual(0);
  expect(attack[1]).toBeLessThanOrEqual(9);
});

test('Removing one possible missed attack', () => {
  const board = GameBoard();
  board.markEnemyGridCellAsMissed([2, 3]);
  expect(board.getEnemyGridMap()[23]).toBeFalsy();
  expect(board.getEnemyGridMap()[85]).toBeTruthy();
});

test("Removing one possible attack after enemy's ship had been hit", () => {
  const board = GameBoard();
  const enemyBoard = GameBoard();
  const enemyShip = <Ship>enemyBoard.getGrid()[4][6];

  board.markEnemyGridCellAsHit([4, 6], enemyShip);
  expect(board.getEnemyGridMap()[46]).toBe(enemyShip);
});

test("Removing possible attacks around a enemy's ship after it had been sunk", () => {
  const board = GameBoard();
  const enemyBoard = GameBoard();
  const enemyShip = <Ship>enemyBoard.getGrid()[1][1];

  board.markEnemyGridCellsAroundShipAsMissed(enemyShip.getArrayCoordinates());
  board.markEnemyGridCellAsHit([1, 1], enemyShip);
  board.markEnemyGridCellAsHit([2, 1], enemyShip);
  board.markEnemyGridCellAsHit([3, 1], enemyShip);
  board.markEnemyGridCellAsHit([4, 1], enemyShip);
  board.markEnemyGridCellAsHit([5, 1], enemyShip);

  const enemyGridMap = board.getEnemyGridMap();
  expect(enemyGridMap[0]).toBeFalsy();
  expect(enemyGridMap[1]).toBeFalsy();
  expect(enemyGridMap[2]).toBeFalsy();
  expect(enemyGridMap[10]).toBeFalsy();
  expect(enemyGridMap[11]).toBe(enemyShip);
  expect(enemyGridMap[12]).toBeFalsy();
  expect(enemyGridMap[20]).toBeFalsy();
  expect(enemyGridMap[21]).toBe(enemyShip);
  expect(enemyGridMap[22]).toBeFalsy();
  expect(enemyGridMap[30]).toBeFalsy();
  expect(enemyGridMap[31]).toBe(enemyShip);
  expect(enemyGridMap[32]).toBeFalsy();
  expect(enemyGridMap[40]).toBeFalsy();
  expect(enemyGridMap[41]).toBe(enemyShip);
  expect(enemyGridMap[42]).toBeFalsy();
  expect(enemyGridMap[50]).toBeFalsy();
  expect(enemyGridMap[51]).toBe(enemyShip);
  expect(enemyGridMap[52]).toBeFalsy();
  expect(enemyGridMap[60]).toBeFalsy();
  expect(enemyGridMap[61]).toBeFalsy();
  expect(enemyGridMap[62]).toBeFalsy();
});

test('Validating possible attacks at the top', () => {
  const board = GameBoard();
  const enemyBoard = GameBoard();

  expect(board.isValidTop([0, 0])).toBeTruthy();
  expect(board.isValidTop([0, 9])).toBeTruthy();

  const ship = <Ship>enemyBoard.getGrid()[1][3];
  board.markEnemyGridCellsAroundShipAsMissed(ship.getArrayCoordinates());
  board.markEnemyGridCellAsHit([1, 3], ship);
  board.markEnemyGridCellAsHit([1, 4], ship);
  board.markEnemyGridCellAsHit([1, 5], ship);
  board.markEnemyGridCellAsHit([1, 6], ship);

  expect(board.isValidTop([2, 2])).toBeFalsy();
  expect(board.isValidTop([2, 3])).toBeFalsy();
  expect(board.isValidTop([2, 4])).toBeFalsy();
  expect(board.isValidTop([2, 5])).toBeFalsy();
  expect(board.isValidTop([2, 6])).toBeFalsy();
  expect(board.isValidTop([2, 7])).toBeFalsy();
  expect(board.isValidTop([2, 8])).toBeTruthy();
});

test('Validating possible attacks at the bottom', () => {
  const board = GameBoard();
  const enemyBoard = GameBoard();

  expect(board.isValidBottom([9, 0])).toBeTruthy();
  expect(board.isValidBottom([9, 9])).toBeTruthy();

  const ship = <Ship>enemyBoard.getGrid()[4][6];
  board.markEnemyGridCellAsHit([4, 6], ship);
  board.markEnemyGridCellAsHit([5, 6], ship);
  board.markEnemyGridCellsAroundShipAsMissed(ship.getArrayCoordinates());

  expect(board.isValidBottom([2, 5])).toBeFalsy();
  expect(board.isValidBottom([3, 5])).toBeFalsy();
  expect(board.isValidBottom([4, 5])).toBeFalsy();
  expect(board.isValidBottom([5, 5])).toBeFalsy();
  expect(board.isValidBottom([2, 6])).toBeFalsy();
  expect(board.isValidBottom([3, 6])).toBeFalsy();
  expect(board.isValidBottom([4, 6])).toBeFalsy();
  expect(board.isValidBottom([5, 6])).toBeFalsy();
  expect(board.isValidBottom([2, 7])).toBeFalsy();
  expect(board.isValidBottom([3, 7])).toBeFalsy();
  expect(board.isValidBottom([4, 7])).toBeFalsy();
  expect(board.isValidBottom([5, 7])).toBeFalsy();
});

test('Validating possible attacks at the left', () => {
  // TODO
});

test('Validating possible attacks at the right', () => {
  // TODO
});

test('Viewing the grid', () => {
  const board = GameBoard();
  expect(board.getGridView()).toStrictEqual([
    ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
    ['.', 'AC', '.', 'BS', 'BS', 'BS', 'BS', '.', '.', '.'],
    ['.', 'AC', '.', '.', '.', '.', '.', '.', '.', '.'],
    ['.', 'AC', '.', '.', '.', '.', '.', '.', 'CR', '.'],
    ['.', 'AC', '.', 'D0', 'D0', '.', 'D1', '.', 'CR', '.'],
    ['.', 'AC', '.', '.', '.', '.', 'D1', '.', 'CR', '.'],
    ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
    ['.', '.', '.', 'S0', '.', '.', '.', '.', '.', '.'],
    ['.', '.', '.', '.', '.', 'S1', '.', '.', '.', '.'],
    ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
  ]);
});

test('Picking a random move without an argument', () => {
  const board = GameBoard();
  const randomMove = board.pickRandomMove();
  expect(randomMove[0]).toBeLessThanOrEqual(9);
  expect(randomMove[0]).toBeGreaterThanOrEqual(0);
  expect(randomMove[1]).toBeLessThanOrEqual(9);
  expect(randomMove[1]).toBeGreaterThanOrEqual(0);

  for (let row = 0; row < 10; row += 1) {
    for (let col = 0; col < 10; col += 1) {
      if (row === 0 && col === 0) {
        // eslint-disable-next-line no-continue
        continue;
      }
      board.markEnemyGridCellAsMissed([row, col]);
    }
  }

  expect(board.pickRandomMove()).toStrictEqual([0, 0]);
  expect(board.pickRandomMove()).toStrictEqual([0, 0]);
  expect(board.pickRandomMove()).toStrictEqual([0, 0]);
});

test('Picking a random move with an argument', () => {
  const board = GameBoard();
  expect(
    board.pickRandomMove([
      [0, 1],
      [0, 2],
      [0, 3],
    ])[0],
  ).toBe(0);
});

test('Destroying all ships', () => {
  const board = GameBoard();

  // Destroying the Aircraft Carrier
  expect(board.receiveAttack([1, 1])).toBe('HIT');
  expect((<Ship>board.getGrid()[1][1]).isSunk()).toBe(false);
  expect(board.receiveAttack([2, 1])).toBe('HIT');
  expect((<Ship>board.getGrid()[2][1]).isSunk()).toBe(false);
  expect(board.receiveAttack([3, 1])).toBe('HIT');
  expect((<Ship>board.getGrid()[3][1]).isSunk()).toBe(false);
  expect(board.receiveAttack([4, 1])).toBe('HIT');
  expect((<Ship>board.getGrid()[4][1]).isSunk()).toBe(false);
  expect(board.receiveAttack([5, 1])).toBe('SUNK');
  expect((<Ship>board.getGrid()[5][1]).isSunk()).toBe(true);
  expect(board.getNumberOfShipsAlive()).toBe(6);
  expect(board.getGridView()).toStrictEqual([
    ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
    ['.', 'X', '.', 'BS', 'BS', 'BS', 'BS', '.', '.', '.'],
    ['.', 'X', '.', '.', '.', '.', '.', '.', '.', '.'],
    ['.', 'X', '.', '.', '.', '.', '.', '.', 'CR', '.'],
    ['.', 'X', '.', 'D0', 'D0', '.', 'D1', '.', 'CR', '.'],
    ['.', 'X', '.', '.', '.', '.', 'D1', '.', 'CR', '.'],
    ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
    ['.', '.', '.', 'S0', '.', '.', '.', '.', '.', '.'],
    ['.', '.', '.', '.', '.', 'S1', '.', '.', '.', '.'],
    ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
  ]);

  // Destroying the Battleship
  expect(board.receiveAttack([1, 3])).toBe('HIT');
  expect(board.receiveAttack([1, 4])).toBe('HIT');
  expect(board.receiveAttack([1, 5])).toBe('HIT');
  expect(board.receiveAttack([1, 6])).toBe('SUNK');
  expect(board.getNumberOfShipsAlive()).toBe(5);
  expect(board.getGridView()).toStrictEqual([
    ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
    ['.', 'X', '.', 'X', 'X', 'X', 'X', '.', '.', '.'],
    ['.', 'X', '.', '.', '.', '.', '.', '.', '.', '.'],
    ['.', 'X', '.', '.', '.', '.', '.', '.', 'CR', '.'],
    ['.', 'X', '.', 'D0', 'D0', '.', 'D1', '.', 'CR', '.'],
    ['.', 'X', '.', '.', '.', '.', 'D1', '.', 'CR', '.'],
    ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
    ['.', '.', '.', 'S0', '.', '.', '.', '.', '.', '.'],
    ['.', '.', '.', '.', '.', 'S1', '.', '.', '.', '.'],
    ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
  ]);

  // Destroying the first Destroyer
  expect(board.receiveAttack([4, 3])).toBe('HIT');
  expect(board.receiveAttack([4, 4])).toBe('SUNK');
  expect(board.getNumberOfShipsAlive()).toBe(4);
  expect(board.getGridView()).toStrictEqual([
    ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
    ['.', 'X', '.', 'X', 'X', 'X', 'X', '.', '.', '.'],
    ['.', 'X', '.', '.', '.', '.', '.', '.', '.', '.'],
    ['.', 'X', '.', '.', '.', '.', '.', '.', 'CR', '.'],
    ['.', 'X', '.', 'X', 'X', '.', 'D1', '.', 'CR', '.'],
    ['.', 'X', '.', '.', '.', '.', 'D1', '.', 'CR', '.'],
    ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
    ['.', '.', '.', 'S0', '.', '.', '.', '.', '.', '.'],
    ['.', '.', '.', '.', '.', 'S1', '.', '.', '.', '.'],
    ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
  ]);

  // Destroying the second Destroyer
  expect(board.receiveAttack([4, 6])).toBe('HIT');
  expect(board.receiveAttack([5, 6])).toBe('SUNK');
  expect(board.getNumberOfShipsAlive()).toBe(3);
  expect(board.getGridView()).toStrictEqual([
    ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
    ['.', 'X', '.', 'X', 'X', 'X', 'X', '.', '.', '.'],
    ['.', 'X', '.', '.', '.', '.', '.', '.', '.', '.'],
    ['.', 'X', '.', '.', '.', '.', '.', '.', 'CR', '.'],
    ['.', 'X', '.', 'X', 'X', '.', 'X', '.', 'CR', '.'],
    ['.', 'X', '.', '.', '.', '.', 'X', '.', 'CR', '.'],
    ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
    ['.', '.', '.', 'S0', '.', '.', '.', '.', '.', '.'],
    ['.', '.', '.', '.', '.', 'S1', '.', '.', '.', '.'],
    ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
  ]);

  // Destroying the Cruiser
  expect(board.receiveAttack([3, 8])).toBe('HIT');
  expect(board.receiveAttack([4, 8])).toBe('HIT');
  expect(board.receiveAttack([5, 8])).toBe('SUNK');
  expect(board.getNumberOfShipsAlive()).toBe(2);
  expect(board.getGridView()).toStrictEqual([
    ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
    ['.', 'X', '.', 'X', 'X', 'X', 'X', '.', '.', '.'],
    ['.', 'X', '.', '.', '.', '.', '.', '.', '.', '.'],
    ['.', 'X', '.', '.', '.', '.', '.', '.', 'X', '.'],
    ['.', 'X', '.', 'X', 'X', '.', 'X', '.', 'X', '.'],
    ['.', 'X', '.', '.', '.', '.', 'X', '.', 'X', '.'],
    ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
    ['.', '.', '.', 'S0', '.', '.', '.', '.', '.', '.'],
    ['.', '.', '.', '.', '.', 'S1', '.', '.', '.', '.'],
    ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
  ]);

  // Destroying the first Submarine
  expect(board.receiveAttack([7, 3])).toBe('SUNK');
  expect(board.getNumberOfShipsAlive()).toBe(1);
  expect(board.getGridView()).toStrictEqual([
    ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
    ['.', 'X', '.', 'X', 'X', 'X', 'X', '.', '.', '.'],
    ['.', 'X', '.', '.', '.', '.', '.', '.', '.', '.'],
    ['.', 'X', '.', '.', '.', '.', '.', '.', 'X', '.'],
    ['.', 'X', '.', 'X', 'X', '.', 'X', '.', 'X', '.'],
    ['.', 'X', '.', '.', '.', '.', 'X', '.', 'X', '.'],
    ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
    ['.', '.', '.', 'X', '.', '.', '.', '.', '.', '.'],
    ['.', '.', '.', '.', '.', 'S1', '.', '.', '.', '.'],
    ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
  ]);

  // Destroying the second Submarine
  expect(board.receiveAttack([8, 5])).toBe('SUNK');
  expect(board.getNumberOfShipsAlive()).toBe(0);
  expect(board.areSunk()).toBe(true);
  expect(board.getGridView()).toStrictEqual([
    ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
    ['.', 'X', '.', 'X', 'X', 'X', 'X', '.', '.', '.'],
    ['.', 'X', '.', '.', '.', '.', '.', '.', '.', '.'],
    ['.', 'X', '.', '.', '.', '.', '.', '.', 'X', '.'],
    ['.', 'X', '.', 'X', 'X', '.', 'X', '.', 'X', '.'],
    ['.', 'X', '.', '.', '.', '.', 'X', '.', 'X', '.'],
    ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
    ['.', '.', '.', 'X', '.', '.', '.', '.', '.', '.'],
    ['.', '.', '.', '.', '.', 'X', '.', '.', '.', '.'],
    ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
  ]);
});

// Simulating game-loop
/*
test('Game simulation', () => {
  let currentPlayer = GameBoard();
  let nextPlayer = GameBoard();
  let isFinished = false;

  while (!isFinished) {
    const generatedAttack = currentPlayer.generateAttack();
    const resultOfAttack = nextPlayer.receiveAttack(generatedAttack);

    if (resultOfAttack === 'SUNK') {
      const ship = <Ship>nextPlayer.getGrid()[generatedAttack[0]][generatedAttack[1]];
      const shipCoords = ship.getArrayCoordinates();

      currentPlayer.updateValidAttacksAfterSunk(shipCoords);
      currentPlayer.updateNotFinished([]);
    }

    if (resultOfAttack === 'HIT') {
      const notFinished = currentPlayer.getNotFinished();

      if (notFinished.length === 2) {
        notFinished.pop();
      }

      notFinished.push(generatedAttack);
      currentPlayer.updateNotFinished(notFinished);
    }

    currentPlayer.removeOnePossibleAttack(generatedAttack);

    if (nextPlayer.areSunk()) {
      isFinished = true;
    } else if (resultOfAttack === 'MISSED') {
      const copy = currentPlayer;
      currentPlayer = nextPlayer;
      nextPlayer = copy;
    }

    console.log(currentPlayer.getGridView());
    console.log(nextPlayer.getGridView());
  }
});
*/
