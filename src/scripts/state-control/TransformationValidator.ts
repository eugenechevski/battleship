/**
 * The module is responsible for validating requests
 * to transform a ship during the game-setup scene.
 *
 * @param thisGridMap - one dimensional representation of the grid.
 * @returns two functions that validate translations and rotations.
 */
export default function (thisGridMap: { [index: number]: boolean | Ship }) {
  function areThereAnyShipsOnLeft(coord: Coordinate, target: Ship): boolean {
    const row = coord[0];
    const col = coord[1];

    const leftTop = (row - 1) * 10 + col - 1;
    const leftMiddle = row * 10 + col - 1;
    const leftBottom = (row + 1) * 10 + col - 1;

    return (
      col !== 0
      && ((row > 0 && typeof thisGridMap[leftTop] !== 'boolean' && thisGridMap[leftTop] !== target)
        || (typeof thisGridMap[leftMiddle] !== 'boolean' && thisGridMap[leftMiddle] !== target)
        || (row < 9
          && typeof thisGridMap[leftBottom] !== 'boolean'
          && thisGridMap[leftBottom] !== target))
    );
  }

  function areThereAnyShipsOnRight(coord: Coordinate, target: Ship): boolean {
    const row = coord[0];
    const col = coord[1];

    const rightTop = (row - 1) * 10 + col + 1;
    const rightMiddle = row * 10 + col + 1;
    const rightBottom = (row + 1) * 10 + col + 1;

    return (
      col !== 9
      && ((row > 0
        && typeof thisGridMap[rightTop] !== 'boolean'
        && thisGridMap[rightTop] !== target)
        || (typeof thisGridMap[rightMiddle] !== 'boolean' && thisGridMap[rightMiddle] !== target)
        || (row < 9
          && typeof thisGridMap[rightBottom] !== 'boolean'
          && thisGridMap[rightBottom] !== target))
    );
  }

  function areThereAnyShipsOnTop(coord: Coordinate, target: Ship): boolean {
    const row = coord[0];
    const col = coord[1];

    const topLeft = (row - 1) * 10 + col - 1;
    const topCenter = (row - 1) * 10 + col;
    const topRight = (row - 1) * 10 + col + 1;

    return (
      row !== 0
      && ((col > 0 && typeof thisGridMap[topLeft] !== 'boolean' && thisGridMap[topLeft] !== target)
        || (typeof thisGridMap[topCenter] !== 'boolean' && thisGridMap[topCenter] !== target)
        || (col < 9 && typeof thisGridMap[topRight] !== 'boolean' && thisGridMap[topRight] !== target))
    );
  }

  function areThereAnyShipsOnBottom(coord: Coordinate, target: Ship): boolean {
    const row = coord[0];
    const col = coord[1];

    const bottomLeft = (row + 1) * 10 + col - 1;
    const bottomCenter = (row + 1) * 10 + col;
    const bottomRight = (row + 1) * 10 + col + 1;

    return (
      row !== 9
      && ((col > 0
        && typeof thisGridMap[bottomLeft] !== 'boolean'
        && thisGridMap[bottomLeft] !== target)
        || (typeof thisGridMap[bottomCenter] !== 'boolean' && thisGridMap[bottomCenter] !== target)
        || (col < 9
          && typeof thisGridMap[bottomRight] !== 'boolean'
          && thisGridMap[bottomRight] !== target))
    );
  }

  function getShipCellIndex(shipCoords: Coordinate[], coord: Coordinate): number {
    let srcIndex = -1;
    for (let i = 0; i < shipCoords.length; i += 1) {
      if (shipCoords[i][0] === coord[0] && shipCoords[i][1] === coord[1]) {
        srcIndex = i;
        break;
      }
    }

    return srcIndex;
  }

  function isInBoundaries(
    dest: Coordinate,
    orientation: 'HORIZONTAL' | 'VERTICAL',
    shipSize: number,
    srcIndex: number,
  ): boolean {
    if (
      (orientation === 'HORIZONTAL'
        && (dest[1] - srcIndex < 0 || dest[1] + (shipSize - srcIndex - 1) > 9))
      || (orientation === 'VERTICAL'
        && (dest[0] - srcIndex < 0 || dest[0] + (shipSize - srcIndex - 1) > 9))
    ) {
      return false;
    }

    return true;
  }

  function isValidHorizontalTranslation(
    target: Ship,
    dest: Coordinate,
    srcIndex: number,
    shipSize: number,
  ): false | Coordinate[] {
    if (
      areThereAnyShipsOnLeft([dest[0], dest[1] - srcIndex], target)
      || areThereAnyShipsOnRight([dest[0], dest[1] + (shipSize - srcIndex - 1)], target)
    ) {
      return false;
    }

    const projectedCoords: Coordinate[] = [];
    for (let i = 0; i < shipSize; i += 1) {
      const row = dest[0];
      const col = dest[1] - srcIndex + i;
      if (
        (typeof thisGridMap[row * 10 + col] !== 'boolean'
          && thisGridMap[row * 10 + col] !== target)
        || areThereAnyShipsOnTop([row, col], target)
        || areThereAnyShipsOnBottom([row, col], target)
      ) {
        return false;
      }
      projectedCoords.push([row, col]);
    }

    return projectedCoords;
  }

  function isValidVerticalTranslation(
    target: ShipPossibilitiesMap,
    dest: Coordinate,
    srcIndex: number,
    shipSize: number,
  ): false | Coordinate[] {
    const projectedCoords: Coordinate[] = [];
    if (
      areThereAnyShipsOnTop([dest[0] - srcIndex, dest[1]], target)
      || areThereAnyShipsOnBottom([dest[0] + (shipSize - srcIndex - 1), dest[1]], target)
    ) {
      return false;
    }

    for (let i = 0; i < shipSize; i += 1) {
      const row = dest[0] - srcIndex + i;
      const col = dest[1];
      if (
        (typeof thisGridMap[row * 10 + col] !== 'boolean'
          && thisGridMap[row * 10 + col] !== target)
        || areThereAnyShipsOnLeft([row, col], target)
        || areThereAnyShipsOnRight([row, col], target)
      ) {
        return false;
      }
      projectedCoords.push([row, col]);
    }

    return projectedCoords;
  }

  function isValidSubmarineTranslation(target: Ship, dest: Coordinate): false | Coordinate[] {
    if (
      areThereAnyShipsOnTop([dest[0], dest[1]], target)
      || areThereAnyShipsOnLeft([dest[0], dest[1]], target)
      || areThereAnyShipsOnBottom([dest[0], dest[1]], target)
      || areThereAnyShipsOnRight([dest[0], dest[1]], target)
    ) {
      return false;
    }

    return [dest];
  }

  function isValidTranslation(
    target: Ship,
    orientation: 'HORIZONTAL' | 'VERTICAL',
    dest: Coordinate,
    srcIndex: number,
    shipSize: number,
  ): false | Coordinate[] {
    if (orientation === 'HORIZONTAL') {
      return isValidHorizontalTranslation(target, dest, srcIndex, shipSize);
    }
    if (orientation === 'VERTICAL') {
      return isValidVerticalTranslation(target, dest, srcIndex, shipSize);
    }

    return isValidSubmarineTranslation(target, dest);
  }

  function isValidVerticalRotation(coords: Coordinate[], target: Ship): boolean {
    if (
      areThereAnyShipsOnLeft(coords[0], target)
      || areThereAnyShipsOnRight(coords.slice(-1)[0], target)
    ) {
      return false;
    }

    for (let i = 0; i < coords.length; i += 1) {
      if (
        (typeof thisGridMap[coords[i][0] * 10 + coords[i][1]] !== 'boolean'
          && thisGridMap[coords[i][0] * 10 + coords[i][1]] !== target)
        || areThereAnyShipsOnTop(coords[i], target)
        || areThereAnyShipsOnBottom(coords[i], target)
      ) {
        return false;
      }
    }

    return true;
  }

  function isValidHorizontalRotation(coords: Coordinate[], target: Ship): boolean {
    if (
      areThereAnyShipsOnTop(coords[0], target)
      || areThereAnyShipsOnBottom(coords.slice(-1)[0], target)
    ) {
      return false;
    }

    for (let i = 0; i < coords.length; i += 1) {
      if (
        (typeof thisGridMap[coords[i][0] * 10 + coords[i][1]] !== 'boolean'
          && thisGridMap[coords[i][0] * 10 + coords[i][1]] !== target)
        || areThereAnyShipsOnLeft(coords[i], target)
        || areThereAnyShipsOnRight(coords[i], target)
      ) {
        return false;
      }
    }

    return true;
  }

  function isValidRotation(
    coords: Coordinate[],
    target: Ship,
    projectedOrientation: 'VERTICAL' | 'HORIZONTAL',
  ): boolean {
    if (coords[0][0] < 0 || coords[0][0] > 9 || coords[0][1] < 0 || coords[0][1] > 9) {
      return false;
    }

    if (projectedOrientation === 'VERTICAL' && !isValidVerticalRotation(coords, target)) {
      return false;
    }

    if (projectedOrientation === 'HORIZONTAL' && !isValidHorizontalRotation(coords, target)) {
      return false;
    }

    return true;
  }

  function isValidToRotateVertically(target: Ship, src: Coordinate): false | Coordinate[] {
    const projectionUpward = [];
    const projectionDownward = [];
    for (let i = 0; i < target.shipSize; i += 1) {
      const rowUp = src[0] - target.shipSize + i + 1;
      const rowDown = src[0] + target.shipSize - i - 1;
      const col = src[1];
      projectionUpward.push([rowUp, col]);
      projectionDownward.push([rowDown, col]);
    }

    if (isValidRotation(projectionUpward, target, 'VERTICAL')) {
      return projectionUpward;
    }

    if (isValidRotation(projectionDownward, target, 'VERTICAL')) {
      return projectionDownward.reverse();
    }

    return false;
  }

  function isValidToRotateHorizontally(target: Ship, src: Coordinate): false | Coordinate[] {
    const projectionLeftward = [];
    const projectionRightward = [];
    for (let i = 0; i < target.shipSize; i += 1) {
      const colLeft = src[1] - target.shipSize + i + 1;
      const colRight = src[1] + target.shipSize - i - 1;
      const row = src[0];
      projectionLeftward.push([row, colLeft]);
      projectionRightward.push([row, colRight]);
    }

    if (isValidRotation(projectionLeftward, target, 'HORIZONTAL')) {
      return projectionLeftward;
    }

    if (isValidRotation(projectionRightward, target, 'HORIZONTAL')) {
      return projectionRightward.reverse();
    }

    return false;
  }

  function isValidToRotateShip(target: Ship, src: Coordinate): false | Coordinate[] {
    const shipCoords = target.getArrayCoordinates();
    const srcIndex = getShipCellIndex(shipCoords, src);

    if (shipCoords.length === 1 || (srcIndex > 0 && srcIndex < shipCoords.length - 1)) {
      return false;
    }

    return target.getOrientation() === 'HORIZONTAL'
      ? isValidToRotateVertically(target, src)
      : isValidToRotateHorizontally(target, src);
  }

  function isValidToTranslateShip(
    target: Ship,
    src: Coordinate,
    dest: Coordinate,
  ): false | Coordinate[] {
    // Check whether the destination coordinate has a ship already
    if (typeof thisGridMap[dest[0] * 10 + dest[1]] !== 'boolean') {
      return false;
    }

    // Take the index of the source coordinate in the ship's array of coordinates
    const srcIndex = getShipCellIndex(target.getArrayCoordinates(), src);

    // See whether the projected ship will be in boundaries
    if (!isInBoundaries(dest, target.getOrientation(), target.shipSize, srcIndex)) {
      return false;
    }

    // See whether the projected position is valid
    return isValidTranslation(target, target.getOrientation(), dest, srcIndex, target.shipSize);
  }

  return {
    isValidToRotateShip,
    isValidToTranslateShip,
  };
}
