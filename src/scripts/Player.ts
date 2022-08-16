/* eslint-disable no-undef */
/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
import GameBoard from './GameBoard';

export default function (name: string, isComputer: boolean): Player {
  const board = GameBoard();

  function getName(): string {
    return name;
  }

  function setName(newName: string): void {
    name = newName;
  }

  return {
    isComputer,
    board,
    getName,
    setName,
  };
}
