/* eslint-disable no-undef */
export default function (name: string, shipSize: number): Ship {
  const shipName = name;
  const mapCoordinates: { [coord: string]: boolean } = {};
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
    return coord.toString() in mapCoordinates ? mapCoordinates[coord.toString()] : false;
  }

  function addCoordinate(coord: Coordinate): void {
    mapCoordinates[coord.toString()] = true;
    arrCoordinates.push(coord);

    if (arrCoordinates.length > 1) {
      orientation = arrCoordinates[0][0] - arrCoordinates[1][0] !== 0 ? 'VERTICAL' : 'HORIZONTAL';
    }
  }

  function clearCoordinates(): void {
    for (let i = 0; i < arrCoordinates.length; i += 1) {
      delete mapCoordinates[arrCoordinates[i].toString()];
    }
    arrCoordinates = [];
  }

  function isSunk(): boolean {
    return destroyedCells === 0;
  }

  function hit(target: Coordinate): boolean {
    const key = target.toString();
    if (mapCoordinates[key]) {
      destroyedCells -= 1;
      mapCoordinates[key] = false;
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
