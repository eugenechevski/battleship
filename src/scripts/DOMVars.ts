export namespace DOMVars{
  export let timeLimit: 5 | 10 | 15;
  export let againstComputer: boolean;
  export let selectedShip: Ship
  export let selectedCoord: Coordinate;
  export let drag: boolean;
  export let timer: NodeJS.Timer;
  export let clock: number;
  export let isPaused: boolean;
}