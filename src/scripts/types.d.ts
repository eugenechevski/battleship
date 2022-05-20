/* eslint-disable no-unused-vars */
declare type Coordinate = [row: number, col: number];

declare type Player = {
  isComputer: boolean,
  board,
};

declare type Ship = {
  getName: () => string,
  getArrayCoordinates: () => Coordinate[],
  wasHit: (coord: Coordinate) => boolean,
  addCoordinate: (coord: Coordinate) => void,
  shipSize: number,
  isSunk: () => boolean,
  hit: (target: Coordinate) => boolean,
};

declare type Grid = (boolean | Ship)[][];
