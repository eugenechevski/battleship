/* eslint-disable no-undef */
export default function (name: string, shipSize: number): Ship {
  const shipName = name;
  const mapCoordinates: { [coord: string]: boolean } = {};
  const arrCoordinates: Coordinate[] = [];
  let destroyedCells = shipSize;

  function getName(): string {
    return shipName;
  }

  function getArrayCoordinates(): Coordinate[] {
    return arrCoordinates;
  }

  function wasHit(coord: Coordinate): boolean {
    return coord.toString() in mapCoordinates ? mapCoordinates[coord.toString()] : false;
  }

  function addCoordinate(coord: Coordinate): void {
    mapCoordinates[coord.toString()] = true;
    arrCoordinates.push(coord);
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
    shipSize,
    isSunk,
    hit,
  };
}
