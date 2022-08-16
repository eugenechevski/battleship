/* eslint-disable no-unused-vars */
declare type Coordinate = [row: number, col: number];

declare type Player = {
  isComputer: boolean,
  board: GameBoard,
  getName: () => string,
  setName: (string) => void,
};

declare type Ship = any;

declare type Grid = (boolean | Ship)[][];
declare type GridMap = { [index: number]: boolean | Ship };
declare type PossibilitiesSets = [Set<number>?, Set<number>?];
declare type ShipPossibilitiesMap = {
  [row: number]: { [col: number]: PossibilitiesSets | number };
};
declare type PossibilitiesMap = {
  [index: string]: ShipPossibilitiesMap;
};
declare type GeneratedPosition = {
  generatedCoords: number[];
  randomOrientation: number;
  randomRow: number;
  randomCol: number;
};
declare type ShipMap = { [index: string]: Ship };
declare type AttackResult = 'MISSED' | 'SUNK' | 'HIT' | 'DOUBLE SHOT';
declare type GameBoard = any;
declare type Controller = any;
declare type Renderer = any;
