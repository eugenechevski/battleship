/* eslint-disable no-undef */
export default function (name: string, shipSize: number): Ship {
  const shipName = name;
  const mapOfCoords: { [coord: number]: boolean } = {};
  let arrCoordinates: Coordinate[] = [];
  let destroyedCells = shipSize;
  let orientation: 'VERTICAL' | 'HORIZONTAL' | undefined;

  function getName(): string {
    return shipName;
  }

  function getOrientation(): 'VERTICAL' | 'HORIZONTAL' | undefined {
    return orientation;
  }

  function getArrayCoordinates(): Coordinate[] {
    return arrCoordinates;
  }

  function setOrientation(newOrientation: 'VERTICAL' | 'HORIZONTAL') {
    orientation = newOrientation;
  }

  function wasHit(coord: Coordinate): boolean {
    return mapOfCoords[coord[0] * 10 + coord[1]];
  }

  function addCoordinate(coord: Coordinate): void {
    mapOfCoords[coord[0] * 10 + coord[1]] = false;
    arrCoordinates.push(coord);

    if (arrCoordinates.length > 1) {
      orientation = arrCoordinates[0][0] - arrCoordinates[1][0] !== 0 ? 'VERTICAL' : 'HORIZONTAL';
    }
  }

  function clearCoordinates(): void {
    for (let i = 0; i < arrCoordinates.length; i += 1) {
      delete mapOfCoords[arrCoordinates[i][0] * 10 + arrCoordinates[i][1]];
    }
    arrCoordinates = [];
  }

  function isSunk(): boolean {
    return destroyedCells === 0;
  }

  function hit(target: Coordinate): boolean {
    const coord = target[0] * 10 + target[1];
    if (!mapOfCoords[coord]) {
      destroyedCells -= 1;
      mapOfCoords[coord] = true;
      return true;
    }

    return false;
  }

  return {
    getName,
    getArrayCoordinates,
    wasHit,
    addCoordinate,
    clearCoordinates,
    shipSize,
    getOrientation,
    setOrientation,
    isSunk,
    hit,
  };
}
