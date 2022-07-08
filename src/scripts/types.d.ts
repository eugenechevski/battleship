/* eslint-disable no-unused-vars */
declare type Coordinate = [row: number, col: number];

declare type Player = {
  isComputer: boolean,
  board,
};

declare type Ship = any;

declare type Grid = (boolean | Ship)[][];

declare type GameBoard = any;
declare type Controller = any;
declare type Renderer = any;
