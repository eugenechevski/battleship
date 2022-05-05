/* eslint-disable no-undef */
export default function (shipSize: number): Ship {
  let destroyedCells: number = shipSize;

  function isSunk(): boolean {
    return destroyedCells === 0;
  }

  function hit(): void {
    destroyedCells -= 1;
  }

  return {
    shipSize,
    isSunk,
    hit,
  };
}
