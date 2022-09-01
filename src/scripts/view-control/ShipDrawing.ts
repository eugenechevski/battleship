/* eslint-disable no-undef */
/**
 * The module provides methods for drawing ships and display it on a webpage.
 */
export default function (renderer: Renderer): ShipDrawing {
  function eraseTopBorder(coords: Coordinate, containerClass: string) {
    if (coords[0] > 0) {
      const cell = document.querySelector(`.${containerClass} .R${coords[0] - 1}C${coords[1]}`);
      cell.classList.remove('border-b-4', 'border-b-black', 'border-b-red-500');
      cell.classList.add('border-b-2', 'border-b-gray-500');
    }
    document
      .querySelector(`.${containerClass} .R${coords[0]}C${coords[1]}`)
      .removeAttribute('name');
  }

  function eraseBottomBorder(coords: Coordinate, containerClass: string) {
    if (coords[0] < 9) {
      const cell = document.querySelector(`.${containerClass} .R${coords[0]}C${coords[1]}`);
      cell.classList.remove('border-b-4', 'border-b-black', 'border-b-red-500');
      cell.classList.add('border-b-2', 'border-b-gray-500');
    }
    document
      .querySelector(`.${containerClass} .R${coords[0]}C${coords[1]}`)
      .removeAttribute('name');
  }

  function eraseLeftBorder(coords: Coordinate, containerClass: string) {
    if (coords[1] > 0) {
      const cell = document.querySelector(`.${containerClass} .R${coords[0]}C${coords[1] - 1}`);
      cell.classList.remove('border-r-4', 'border-r-black', 'border-r-red-500');
      cell.classList.add('border-r-2', 'border-r-gray-500');
    }
    document
      .querySelector(`.${containerClass} .R${coords[0]}C${coords[1]}`)
      .removeAttribute('name');
  }

  function eraseRightBorder(coords: Coordinate, containerClass: string) {
    if (coords[1] < 9) {
      const cell = document.querySelector(`.${containerClass} .R${coords[0]}C${coords[1]}`);
      cell.classList.remove('border-r-4', 'border-r-black', 'border-r-red-500');
      cell.classList.add('border-r-2', 'border-r-gray-500');
    }
    document
      .querySelector(`.${containerClass} .R${coords[0]}C${coords[1]}`)
      .removeAttribute('name');
  }

  function eraseVertical(coords: Coordinate[], containerClass: string) {
    eraseTopBorder(coords[0], containerClass);
    eraseBottomBorder(coords.slice(-1)[0], containerClass);

    for (let i = 0; i < coords.length; i += 1) {
      const coord = coords[i];
      eraseLeftBorder(coord, containerClass);
      eraseRightBorder(coord, containerClass);
    }
  }

  function eraseHorizontal(coords: Coordinate[], containerClass: string) {
    eraseLeftBorder(coords[0], containerClass);
    eraseRightBorder(coords.slice(-1)[0], containerClass);

    for (let i = 0; i < coords.length; i += 1) {
      const coord = coords[i];
      eraseTopBorder(coord, containerClass);
      eraseBottomBorder(coord, containerClass);
    }
  }

  function drawTopBorder(
    coords: Coordinate,
    containerClass: string,
    color: string,
    shipAlias?: string,
  ) {
    if (coords[0] > 0) {
      const cell = document.querySelector(`.${containerClass} .R${coords[0] - 1}C${coords[1]}`);
      cell.classList.remove(
        'border-b-2',
        'border-b-gray-500',
        'border-b-black',
        'border-b-red-500',
      );
      cell.classList.add('border-b-4', `border-b-${color}`);
    }

    if (shipAlias !== undefined) {
      document
        .querySelector(`.${containerClass} .R${coords[0]}C${coords[1]}`)
        .setAttribute('name', shipAlias);
    }
  }

  function drawBottomBorder(
    coords: Coordinate,
    containerClass: string,
    color: string,
    shipAlias?: string,
  ) {
    if (coords[0] < 9) {
      const cell = document.querySelector(`.${containerClass} .R${coords[0]}C${coords[1]}`);
      cell.classList.remove(
        'border-b-2',
        'border-b-gray-500',
        'border-b-black',
        'border-b-red-500',
      );
      cell.classList.add('border-b-4', `border-b-${color}`);
    }

    if (shipAlias !== undefined) {
      document
        .querySelector(`.${containerClass} .R${coords[0]}C${coords[1]}`)
        .setAttribute('name', shipAlias);
    }
  }

  function drawLeftBorder(
    coords: Coordinate,
    containerClass: string,
    color: string,
    shipAlias?: string,
  ) {
    if (coords[1] > 0) {
      const cell = document.querySelector(`.${containerClass} .R${coords[0]}C${coords[1] - 1}`);
      cell.classList.remove(
        'border-r-2',
        'border-r-gray-500',
        'border-r-black',
        'border-r-red-500',
      );
      cell.classList.add('border-r-4', `border-r-${color}`);
    }

    if (shipAlias !== undefined) {
      document
        .querySelector(`.${containerClass} .R${coords[0]}C${coords[1]}`)
        .setAttribute('name', shipAlias);
    }
  }

  function drawRightBorder(
    coords: Coordinate,
    containerClass: string,
    color: string,
    shipAlias?: string,
  ) {
    if (coords[1] < 9) {
      const cell = document.querySelector(`.${containerClass} .R${coords[0]}C${coords[1]}`);
      cell.classList.remove(
        'border-r-2',
        'border-r-gray-500',
        'border-r-black',
        'border-r-red-500',
      );
      cell.classList.add('border-r-4', `border-r-${color}`);
    }

    if (shipAlias !== undefined) {
      document
        .querySelector(`.${containerClass} .R${coords[0]}C${coords[1]}`)
        .setAttribute('name', shipAlias);
    }
  }

  function drawVertical(
    coords: Coordinate[],
    containerClass: string,
    color: string,
    shipAlias?: string,
  ) {
    drawTopBorder(coords[0], containerClass, color, shipAlias);
    drawBottomBorder(coords.slice(-1)[0], containerClass, color, shipAlias);

    for (let i = 0; i < coords.length; i += 1) {
      const coord = coords[i];
      drawLeftBorder(coord, containerClass, color, shipAlias);
      drawRightBorder(coord, containerClass, color, shipAlias);
    }
  }

  function drawHorizontal(
    coords: Coordinate[],
    containerClass: string,
    color: string,
    shipAlias?: string,
  ) {
    drawLeftBorder(coords[0], containerClass, color, shipAlias);
    drawRightBorder(coords.slice(-1)[0], containerClass, color, shipAlias);

    for (let i = 0; i < coords.length; i += 1) {
      const coord = coords[i];
      drawTopBorder(coord, containerClass, color, shipAlias);
      drawBottomBorder(coord, containerClass, color, shipAlias);
    }
  }

  function drawMissedAttack(attack: Coordinate, containerClass: string): void {
    document
      .querySelector(`.${containerClass} .R${attack[0]}C${attack[1]}`)
      ?.classList.add('missed-cell', 'icon-cross');
  }

  function drawHitAttack(attack: Coordinate, containerClass: string): void {
    document
      .querySelector(`.${containerClass} .R${attack[0]}C${attack[1]}`)
      .classList.add('hit-cell', 'icon-cross');
  }

  function eraseShip(
    coords: Coordinate[],
    containerClass: string,
    orientation?: Orientation,
  ): void {
    if (orientation !== undefined && orientation === 'VERTICAL') {
      eraseVertical(coords, containerClass);
    } else if (orientation !== undefined && orientation === 'HORIZONTAL') {
      eraseHorizontal(coords, containerClass);
    } else {
      eraseTopBorder(coords[0], containerClass);
      eraseBottomBorder(coords[0], containerClass);
      eraseLeftBorder(coords[0], containerClass);
      eraseRightBorder(coords[0], containerClass);
    }
  }

  function drawShip(
    coords: Coordinate[],
    containerClass: string,
    color: string,
    orientation?: Orientation,
    shipAlias?: string,
  ): void {
    if (orientation !== undefined && orientation === 'VERTICAL') {
      drawVertical(coords, containerClass, color, shipAlias);
    } else if (orientation !== undefined && orientation === 'HORIZONTAL') {
      drawHorizontal(coords, containerClass, color, shipAlias);
    } else {
      drawTopBorder(coords[0], containerClass, color, shipAlias);
      drawBottomBorder(coords[0], containerClass, color, shipAlias);
      drawLeftBorder(coords[0], containerClass, color, shipAlias);
      drawRightBorder(coords[0], containerClass, color, shipAlias);
    }
  }

  function drawAllShips(ships: ShipMap, containerClass: string): void {
    const shipAliases = Object.keys(ships);
    for (let i = 0; i < shipAliases.length; i += 1) {
      const ship: Ship = ships[shipAliases[i]];
      drawShip(
        ship.getArrayCoordinates(),
        containerClass,
        ship.isSunk() ? 'red-500' : 'black',
        ship.getOrientation(),
        shipAliases[i],
      );
    }
  }

  function redrawBoards(ships: ShipMap, grid: Grid, enemyShips: ShipMap, enemyGrid: Grid): void {
    // Reset boards
    renderer.appendFreshBoards();

    // Draw current player's ships
    drawAllShips(ships, 'left-board');

    // Draw enemy's ships that are sunk
    const shipAliases = Object.keys(enemyShips);
    for (let i = 0; i < shipAliases.length; i += 1) {
      const ship: Ship = enemyShips[shipAliases[i]];

      if (ship.isSunk()) {
        drawShip(ship.getArrayCoordinates(), 'right-board', 'red-500', ship.getOrientation());
      }
    }

    // Draw misses and hits
    for (let row = 0; row < 10; row += 1) {
      for (let col = 0; col < 10; col += 1) {
        // Misses

        if (grid[row][col] === false) {
          drawMissedAttack([row, col], 'left-board');
        }

        if (enemyGrid[row][col] === false) {
          drawMissedAttack([row, col], 'right-board');
        }

        // Hits

        if (typeof grid[row][col] !== 'boolean' && (<Ship>grid[row][col]).wasHit([row, col])) {
          drawHitAttack([row, col], 'left-board');
        }

        if (
          typeof enemyGrid[row][col] !== 'boolean'
          && (<Ship>enemyGrid[row][col]).wasHit([row, col])
        ) {
          drawHitAttack([row, col], 'right-board');
        }
      }
    }
  }

  function eraseSelectionOfShip(coords: Coordinate[]): void {
    for (let i = 0; i < coords.length; i += 1) {
      document
        .querySelector(`.setup-board .R${coords[i][0]}C${coords[i][1]}`)
        .classList.remove('selected-ship');
    }
  }

  function drawSelectionOfShip(coords: Coordinate[]): void {
    for (let i = 0; i < coords.length; i += 1) {
      document
        .querySelector(`.setup-board .R${coords[i][0]}C${coords[i][1]}`)
        .classList.add('selected-ship');
    }
  }

  function drawSelectionOfCoordinate(target: Coordinate): void {
    document
      .querySelector(`.setup-board .R${target[0]}C${target[1]}`)
      .classList.remove('selected-ship');
    document
      .querySelector(`.setup-board .R${target[0]}C${target[1]}`)
      .classList.add('selected-coordinate');
  }

  function eraseSelectionOfCoordinate(target: Coordinate): void {
    document
      .querySelector(`.setup-board .R${target[0]}C${target[1]}`)
      .classList.remove('selected-coordinate');
  }

  return {
    redrawBoards,
    drawAllShips,
    drawShip,
    eraseShip,
    drawHitAttack,
    drawMissedAttack,
    drawSelectionOfShip,
    drawSelectionOfCoordinate,
    eraseSelectionOfShip,
    eraseSelectionOfCoordinate,
  };
}
