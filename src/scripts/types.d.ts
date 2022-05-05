/* eslint-disable no-unused-vars */
declare type ShotResult = 'HIT' | 'MISSED' | 'DOUBLE-SHOT';

declare type Coordinate = [row: number, col: number];

declare type GameBoard = {
  [property: any]: any
};

declare type Player = {
  isComputer: boolean,
  board: GameBoard,
};

declare type Ship = {
  shipSize: number,
  isSunk: () => boolean,
  hit: () => void,
};

declare type Grid = [...cell: boolean | [Ship, boolean]][];
