/* eslint-disable no-undef */
/* eslint-disable no-param-reassign */

/**
 * The module generates valid random coordinates for all ships.
 * The idea is to create maps of all possible positions of all ships and to randomly choose
 * coordinates for each ship. To choose all valid positions, the code eliminates all positions
 * that cannot be chosen after it generated a position for a ship.
 */
export default function (): PositionGenerator {
  /**
   * Removes a position in a ship's map.
   */
  function eliminatePossibility(
    row: number,
    col: number,
    shipPossibilities: ShipPossibilitiesMap,
  ): void {
    if (row in shipPossibilities && col in shipPossibilities[row]) {
      delete shipPossibilities[row][col];
    }
  }

  /**
   * Removes some of the horizontal possible positions in a ship's map.
   */
  function eliminateAroundHorizontally(
    generatedCoords: number[],
    shipPossibilities: ShipPossibilitiesMap,
  ): void {
    const row = Math.floor(generatedCoords[0] / 10);
    const firstCol = generatedCoords[0] % 10;
    const lastCol = generatedCoords.slice(-1)[0] % 10;

    eliminatePossibility(row - 1, firstCol - 1, shipPossibilities);
    eliminatePossibility(row, firstCol - 1, shipPossibilities);
    eliminatePossibility(row + 1, firstCol - 1, shipPossibilities);

    eliminatePossibility(row - 1, lastCol + 1, shipPossibilities);
    eliminatePossibility(row, lastCol + 1, shipPossibilities);
    eliminatePossibility(row + 1, lastCol + 1, shipPossibilities);
  }

  /**
   * Removes some of the vertical possible positions in a ship's map.
   */
  function eliminateAroundVertically(
    generatedCoords: number[],
    shipPossibilities: ShipPossibilitiesMap,
  ): void {
    const col = generatedCoords[0] % 10;
    const firstRow = Math.floor(generatedCoords[0] / 10);
    const lastRow = Math.floor(generatedCoords.slice(-1)[0] / 10);

    eliminatePossibility(firstRow - 1, col - 1, shipPossibilities);
    eliminatePossibility(firstRow - 1, col, shipPossibilities);
    eliminatePossibility(firstRow - 1, col + 1, shipPossibilities);

    eliminatePossibility(lastRow + 1, col - 1, shipPossibilities);
    eliminatePossibility(lastRow + 1, col, shipPossibilities);
    eliminatePossibility(lastRow + 1, col + 1, shipPossibilities);
  }

  /**
   * Removes all possible positions around a ship's generated position in another ship's map.
   *
   * @param generatedCoords - a ship's generated coordinates
   * @param shipPossibilities - another ship's map of possibilities
   */
  function eliminatePossibilitiesAround(
    generatedCoords: any[],
    shipPossibilities: ShipPossibilitiesMap,
    randomOrientation?: number,
  ): void {
    if (randomOrientation === undefined || randomOrientation === 0) {
      eliminateAroundHorizontally(generatedCoords, shipPossibilities);
    } else {
      eliminateAroundVertically(generatedCoords, shipPossibilities);
    }

    // Eliminate on sides
    for (let i = 0; i < generatedCoords.length; i += 1) {
      const row = Math.floor(generatedCoords[i] / 10);
      const col = generatedCoords[i] % 10;

      // The position itself
      eliminatePossibility(row, col, shipPossibilities);

      if (randomOrientation === undefined || randomOrientation === 0) {
        eliminatePossibility(row - 1, col, shipPossibilities);
        eliminatePossibility(row + 1, col, shipPossibilities);
      } else {
        eliminatePossibility(row, col - 1, shipPossibilities);
        eliminatePossibility(row, col + 1, shipPossibilities);
      }
    }
  }

  /**
   * Removes all possible positions for all ships around a ship's generated position.
   */
  function eliminatePossibilities(
    generatedCoords: any[],
    possibilities: PossibilitiesMap,
    randomOrientation?: number,
  ) {
    eliminatePossibilitiesAround(generatedCoords, possibilities.sizeOfOne, randomOrientation);
    eliminatePossibilitiesAround(generatedCoords, possibilities.sizeOfTwo, randomOrientation);
    eliminatePossibilitiesAround(generatedCoords, possibilities.sizeOfThree, randomOrientation);
    eliminatePossibilitiesAround(generatedCoords, possibilities.sizeOfFour, randomOrientation);
  }

  /**
   * Removes possible horizontal overlapping positions in a given ship's map.
   */
  function eliminateHorizontalOverlaps(
    row: number,
    col: number,
    shipPossibilities: ShipPossibilitiesMap,
  ): void {
    if (row in shipPossibilities && col in shipPossibilities[row]) {
      (shipPossibilities[row][col] as PossibilitiesSets).shift();

      if ((shipPossibilities[row][col] as PossibilitiesSets).length === 0) {
        delete shipPossibilities[row][col];
      }
    }
  }

  /**
   * Removes possible vertical overlapping positions in a given ship's map.
   */
  function eliminateVerticalOverlaps(
    row: number,
    col: number,
    shipPossibilities: ShipPossibilitiesMap,
  ): void {
    if (row in shipPossibilities && col in shipPossibilities[row]) {
      (shipPossibilities[row][col] as PossibilitiesSets).pop();

      if ((shipPossibilities[row][col] as PossibilitiesSets).length === 0) {
        delete shipPossibilities[row][col];
      }
    }
  }

  /**
   * Removes horizontal possible coordinates that overlap with the generated coordinates.
   */
  function eliminateHorizontally(
    row: number,
    col: number,
    possibilities: PossibilitiesMap,
    generatedCoords: number[],
  ): void {
    // Left top
    eliminateHorizontalOverlaps(row - 1, col - 2, possibilities.sizeOfTwo);
    eliminateHorizontalOverlaps(row - 1, col - 2, possibilities.sizeOfThree);
    eliminateHorizontalOverlaps(row - 1, col - 2, possibilities.sizeOfFour);

    eliminateHorizontalOverlaps(row - 1, col - 3, possibilities.sizeOfThree);
    eliminateHorizontalOverlaps(row - 1, col - 3, possibilities.sizeOfFour);

    eliminateHorizontalOverlaps(row - 1, col - 4, possibilities.sizeOfFour);

    // Left middle
    eliminateHorizontalOverlaps(row, col - 2, possibilities.sizeOfTwo);
    eliminateHorizontalOverlaps(row, col - 2, possibilities.sizeOfThree);
    eliminateHorizontalOverlaps(row, col - 2, possibilities.sizeOfFour);

    eliminateHorizontalOverlaps(row, col - 3, possibilities.sizeOfThree);
    eliminateHorizontalOverlaps(row, col - 3, possibilities.sizeOfFour);

    eliminateHorizontalOverlaps(row, col - 4, possibilities.sizeOfFour);

    // Left bottom
    eliminateHorizontalOverlaps(row + 1, col - 2, possibilities.sizeOfTwo);
    eliminateHorizontalOverlaps(row + 1, col - 2, possibilities.sizeOfThree);
    eliminateHorizontalOverlaps(row + 1, col - 2, possibilities.sizeOfFour);

    eliminateHorizontalOverlaps(row + 1, col - 3, possibilities.sizeOfThree);
    eliminateHorizontalOverlaps(row + 1, col - 3, possibilities.sizeOfFour);

    eliminateHorizontalOverlaps(row + 1, col - 4, possibilities.sizeOfFour);

    // Eliminate all ships that overlap from the top
    for (let i = -1; i < generatedCoords.length + 1; i += 1) {
      eliminateVerticalOverlaps(row - 2, col + i, possibilities.sizeOfTwo);
      eliminateVerticalOverlaps(row - 2, col + i, possibilities.sizeOfThree);
      eliminateVerticalOverlaps(row - 2, col + i, possibilities.sizeOfFour);

      eliminateVerticalOverlaps(row - 3, col + i, possibilities.sizeOfThree);
      eliminateVerticalOverlaps(row - 3, col + i, possibilities.sizeOfFour);

      eliminateVerticalOverlaps(row - 4, col + i, possibilities.sizeOfFour);
    }
  }

  /**
   * Removes vertical possible coordinates that overlap with the generated coordinates.
   */
  function eliminateVertically(
    row: number,
    col: number,
    possibilities: PossibilitiesMap,
    generatedCoords: number[],
  ): void {
    // Top left
    eliminateVerticalOverlaps(row - 2, col - 1, possibilities.sizeOfTwo);
    eliminateVerticalOverlaps(row - 2, col - 1, possibilities.sizeOfThree);
    eliminateVerticalOverlaps(row - 2, col - 1, possibilities.sizeOfFour);

    eliminateVerticalOverlaps(row - 3, col - 1, possibilities.sizeOfThree);
    eliminateVerticalOverlaps(row - 3, col - 1, possibilities.sizeOfFour);

    eliminateVerticalOverlaps(row - 4, col - 1, possibilities.sizeOfFour);

    // Top center
    eliminateVerticalOverlaps(row - 2, col, possibilities.sizeOfTwo);
    eliminateVerticalOverlaps(row - 2, col, possibilities.sizeOfThree);
    eliminateVerticalOverlaps(row - 2, col, possibilities.sizeOfFour);

    eliminateVerticalOverlaps(row - 3, col, possibilities.sizeOfThree);
    eliminateVerticalOverlaps(row - 3, col, possibilities.sizeOfFour);

    eliminateVerticalOverlaps(row - 4, col, possibilities.sizeOfFour);

    // Top right
    eliminateVerticalOverlaps(row - 2, col + 1, possibilities.sizeOfTwo);
    eliminateVerticalOverlaps(row - 2, col + 1, possibilities.sizeOfThree);
    eliminateVerticalOverlaps(row - 2, col + 1, possibilities.sizeOfFour);

    eliminateVerticalOverlaps(row - 3, col + 1, possibilities.sizeOfThree);
    eliminateVerticalOverlaps(row - 3, col + 1, possibilities.sizeOfFour);

    eliminateVerticalOverlaps(row - 4, col + 1, possibilities.sizeOfFour);

    // Eliminate all ships that overlap from the left
    for (let i = -1; i < generatedCoords.length + 1; i += 1) {
      eliminateHorizontalOverlaps(row + i, col - 2, possibilities.sizeOfTwo);
      eliminateHorizontalOverlaps(row + i, col - 2, possibilities.sizeOfThree);
      eliminateHorizontalOverlaps(row + i, col - 2, possibilities.sizeOfFour);

      eliminateHorizontalOverlaps(row + i, col - 3, possibilities.sizeOfThree);
      eliminateHorizontalOverlaps(row + i, col - 3, possibilities.sizeOfFour);

      eliminateHorizontalOverlaps(row + i, col - 4, possibilities.sizeOfFour);
    }
  }

  /**
   * Removes all possible coordinates that overlap with the generated coordinates.
   */
  function eliminateOverlaps(
    generatedCoords: number[],
    possibilities: PossibilitiesMap,
    randomOrientation?: number,
  ) {
    const row = Math.floor(generatedCoords[0] / 10);
    const col = generatedCoords[0] % 10;

    if (randomOrientation === 0) {
      eliminateHorizontally(row, col, possibilities, generatedCoords);
    } else if (randomOrientation === 1) {
      eliminateVertically(row, col, possibilities, generatedCoords);
    }
  }

  /**
   * Initializes the object that stores all possible positions.
   */
  function createFreshMap(): PossibilitiesMap {
    const sizeOfOne = {};
    const sizeOfTwo = {};
    const sizeOfThree = {};
    const sizeOfFour = {};
    const sizeOfFive = {};

    for (let row = 0; row < 10; row += 1) {
      sizeOfOne[row] = {};
      sizeOfTwo[row] = {};
      sizeOfThree[row] = {};
      sizeOfFour[row] = {};
      sizeOfFive[row] = {};
      for (let col = 0; col < 10; col += 1) {
        sizeOfOne[row][col] = row * 10 + col;
        sizeOfTwo[row][col] = [new Set(), new Set()];
        sizeOfThree[row][col] = [new Set(), new Set()];
        sizeOfFour[row][col] = [new Set(), new Set()];
        sizeOfFive[row][col] = [new Set(), new Set()];
      }
    }

    return {
      sizeOfOne,
      sizeOfTwo,
      sizeOfThree,
      sizeOfFour,
      sizeOfFive,
    };
  }

  /**
   * Adds all possible horizontal positions for all ships.
   */
  function addHorizontalPossibilities(map: PossibilitiesMap): void {
    for (let row = 0; row < 10; row += 1) {
      for (let col = 0; col < 10; col += 1) {
        if (10 - col > 1) {
          map.sizeOfTwo[row][col][0].add(row * 10 + col);
          map.sizeOfTwo[row][col][0].add(row * 10 + col + 1);
        }

        if (10 - col > 2) {
          map.sizeOfThree[row][col][0].add(row * 10 + col);
          map.sizeOfThree[row][col][0].add(row * 10 + col + 1);
          map.sizeOfThree[row][col][0].add(row * 10 + col + 2);
        }

        if (10 - col > 3) {
          map.sizeOfFour[row][col][0].add(row * 10 + col);
          map.sizeOfFour[row][col][0].add(row * 10 + col + 1);
          map.sizeOfFour[row][col][0].add(row * 10 + col + 2);
          map.sizeOfFour[row][col][0].add(row * 10 + col + 3);
        }

        if (10 - col > 4) {
          map.sizeOfFive[row][col][0].add(row * 10 + col);
          map.sizeOfFive[row][col][0].add(row * 10 + col + 1);
          map.sizeOfFive[row][col][0].add(row * 10 + col + 2);
          map.sizeOfFive[row][col][0].add(row * 10 + col + 3);
          map.sizeOfFive[row][col][0].add(row * 10 + col + 4);
        }
      }
    }
  }

  /**
   * Adds all possible vertical positions for all ships.
   */
  function addVerticalPossibilities(map: PossibilitiesMap): void {
    for (let col = 0; col < 10; col += 1) {
      for (let row = 0; row < 10; row += 1) {
        if (10 - row > 1) {
          map.sizeOfTwo[row][col][1].add(row * 10 + col);
          map.sizeOfTwo[row][col][1].add((row + 1) * 10 + col);
        }

        if (10 - row > 2) {
          map.sizeOfThree[row][col][1].add(row * 10 + col);
          map.sizeOfThree[row][col][1].add((row + 1) * 10 + col);
          map.sizeOfThree[row][col][1].add((row + 2) * 10 + col);
        }

        if (10 - row > 3) {
          map.sizeOfFour[row][col][1].add(row * 10 + col);
          map.sizeOfFour[row][col][1].add((row + 1) * 10 + col);
          map.sizeOfFour[row][col][1].add((row + 2) * 10 + col);
          map.sizeOfFour[row][col][1].add((row + 3) * 10 + col);
        }

        if (10 - row > 4) {
          map.sizeOfFive[row][col][1].add(row * 10 + col);
          map.sizeOfFive[row][col][1].add((row + 1) * 10 + col);
          map.sizeOfFive[row][col][1].add((row + 2) * 10 + col);
          map.sizeOfFive[row][col][1].add((row + 3) * 10 + col);
          map.sizeOfFive[row][col][1].add((row + 4) * 10 + col);
        }
      }
    }
  }

  /**
   * Removes a single position that cannot be chosen.
   */
  function clearPosition(row: number, col: number, shipMap: ShipPossibilitiesMap): void {
    if ((shipMap[row][col] as PossibilitiesSets)[0].size === 0) {
      (shipMap[row][col] as PossibilitiesSets).shift();
    }

    if ((shipMap[row][col] as PossibilitiesSets).slice(-1)[0].size === 0) {
      (shipMap[row][col] as PossibilitiesSets).pop();
    }

    if ((shipMap[row][col] as PossibilitiesSets).length === 0) {
      delete shipMap[row][col];
    }
  }

  /**
   * Removes all positions that cannot be chosen.
   */
  function clearEmptyPositions(map: PossibilitiesMap): void {
    for (let row = 0; row < 10; row += 1) {
      for (let col = 0; col < 10; col += 1) {
        clearPosition(row, col, map.sizeOfTwo);
        clearPosition(row, col, map.sizeOfThree);
        clearPosition(row, col, map.sizeOfFour);
        clearPosition(row, col, map.sizeOfFive);
      }
    }
  }

  /**
   * Creates a map of all initial possible positions for all ships.
   */
  function createPossibilitiesMap(): PossibilitiesMap {
    const possibilities = createFreshMap();

    addHorizontalPossibilities(possibilities);
    addVerticalPossibilities(possibilities);
    clearEmptyPositions(possibilities);

    return possibilities;
  }

  /**
   * Fixes the random orientation identifier.
   *
   * @param shipMap - a ship's possibilities map
   * @param position - a generated position
   */
  function adjustOrientation(shipMap: ShipPossibilitiesMap, position: GeneratedPosition): void {
    if ((<PossibilitiesSets>shipMap[position.randomRow][position.randomCol]).length === 1) {
      // Vertical
      if (position.generatedCoords[0] % 10 === position.generatedCoords[1] % 10) {
        position.randomOrientation = 1;
      } else {
        position.randomOrientation = 0;
      }
    }
  }

  /**
   * Removes all rows that are no longer valid to be considered for a random position.
   *
   * @param possibilities - map of all possible positions
   */
  function eliminateRows(possibilities: PossibilitiesMap): void {
    for (let row = 0; row < 10; row += 1) {
      if (
        possibilities.sizeOfOne[row] !== undefined
        && Object.keys(possibilities.sizeOfOne[row]).length === 0
      ) {
        delete possibilities.sizeOfOne[row];
      }

      if (
        possibilities.sizeOfTwo[row] !== undefined
        && Object.keys(possibilities.sizeOfTwo[row]).length === 0
      ) {
        delete possibilities.sizeOfTwo[row];
      }

      if (
        possibilities.sizeOfThree[row] !== undefined
        && Object.keys(possibilities.sizeOfThree[row]).length === 0
      ) {
        delete possibilities.sizeOfThree[row];
      }
      if (
        possibilities.sizeOfFour[row] !== undefined
        && Object.keys(possibilities.sizeOfFour[row]).length === 0
      ) {
        delete possibilities.sizeOfFour[row];
      }
    }
  }

  /**
   * Generates a position for a given ship.
   *
   * @param shipMap - all possible position for a ship
   * @returns an object with all the necessary information about a generated position
   */
  function generatePosition(shipMap: ShipPossibilitiesMap): GeneratedPosition {
    const availRows = Object.keys(shipMap);
    const randomRow = Number(availRows[Math.floor(Math.random() * availRows.length)]);
    const availCols = Object.keys(shipMap[randomRow]);
    const randomCol = Number(availCols[Math.floor(Math.random() * availCols.length)]);

    let availOrientations: number | undefined;
    let randomOrientation: number | undefined;
    let generatedCoords: number[];

    if (typeof shipMap[randomRow][randomCol] === 'number') {
      generatedCoords = [<number>shipMap[randomRow][randomCol]];
    } else {
      availOrientations = (<PossibilitiesSets>shipMap[randomRow][randomCol]).length;
      randomOrientation = Math.floor(Math.random() * availOrientations);
      generatedCoords = [...shipMap[randomRow][randomCol][randomOrientation].keys()];
    }

    return {
      generatedCoords,
      randomOrientation,
      randomRow,
      randomCol,
    };
  }

  /**
   * Randomly generates a position for a given ship and updates the map of all possibilities.
   *
   * @param possibilities - a map of all ships' maps
   * @param shipMap - a map of a ship
   * @param allGeneratedCoords - a container for generated coordinates of ships
   */
  function randomize(
    possibilities: PossibilitiesMap,
    shipMap: ShipPossibilitiesMap,
    allGeneratedCoords: number[][],
  ): void {
    const position = generatePosition(shipMap);

    if (position.randomOrientation !== undefined) {
      adjustOrientation(shipMap, position);
    }

    eliminatePossibilities(position.generatedCoords, possibilities, position.randomOrientation);

    if (position.randomOrientation !== undefined) {
      eliminateOverlaps(position.generatedCoords, possibilities, position.randomOrientation);
    }

    eliminateRows(possibilities);
    allGeneratedCoords.push(position.generatedCoords);
  }

  /**
   * Converts one-dimensional coordinates, ie. 0 - 99, to the two-dimensional format.
   *
   * @param allGeneratedCoords - container with all one-dimensional coordinates.
   * @returns 2D array of coordinates
   */
  function convertTo2D(allGeneratedCoords: number[][]): Coordinate[][] {
    const coords: Coordinate[][] = [];

    for (let i = 0; i < allGeneratedCoords.length; i += 1) {
      coords.push([]);
      for (let j = 0; j < allGeneratedCoords[i].length; j += 1) {
        const row = Math.floor(allGeneratedCoords[i][j] / 10);
        const col = allGeneratedCoords[i][j] % 10;

        coords[i].push([row, col]);
      }
    }

    return coords;
  }

  /**
   * The module's main function that combines all code above to generate a random board.
   *
   * @returns - coords of all ships
   */
  function generateRandomCoords(): Coordinate[][] {
    const allGeneratedCoords: number[][] = [];
    const possibilities = createPossibilitiesMap();

    // Aircraft Carrier
    randomize(possibilities, possibilities.sizeOfFive, allGeneratedCoords);

    // Battleship
    randomize(possibilities, possibilities.sizeOfFour, allGeneratedCoords);

    // Cruiser
    randomize(possibilities, possibilities.sizeOfThree, allGeneratedCoords);

    // Destroyer 0
    randomize(possibilities, possibilities.sizeOfTwo, allGeneratedCoords);

    // Destroyer 1
    randomize(possibilities, possibilities.sizeOfTwo, allGeneratedCoords);

    // Submarine 0
    randomize(possibilities, possibilities.sizeOfOne, allGeneratedCoords);

    // Submarine 1
    randomize(possibilities, possibilities.sizeOfOne, allGeneratedCoords);

    return convertTo2D(allGeneratedCoords);
  }

  return {
    generateRandomCoords,
  };
}
