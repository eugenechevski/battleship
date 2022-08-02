/* eslint-disable no-unused-vars */
declare type Coordinate = [row: number, col: number];

declare type Player = {
  isComputer: boolean;
  board;
};

declare type Ship = any;

declare type Grid = (boolean | Ship)[][];
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
declare type GameBoard = any;
declare type Controller = any;
declare type Renderer = any;
