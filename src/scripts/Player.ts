/* eslint-disable no-undef */
/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
import GameBoard from './GameBoard';

export default function (isComputer: boolean): Player {
  const board = GameBoard();

  return {
    isComputer,
    board,
  };
}
