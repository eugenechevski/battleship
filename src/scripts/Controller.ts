import Renderer from './Renderer';

export default function Controller() {
  let renderer;
  let status: 'PLAYING' | 'PAUSED' | 'NOT_PLAYING';
  let currentPlayer: Player;
  let nextPlayer: Player;

  function init(this: Controller) {
    renderer = Renderer(this);
    renderer.init();
  }

  function start(): void {
    status = 'PLAYING';
  }

  function pause(): void {
    status = 'PAUSED';
  }

  function surrender(): void {
    status = 'NOT_PLAYING';
  }

  function terminate(): void {
    status = 'NOT_PLAYING';
  }

  function newAttack(attack: Coordinate): void {}

  function nextRound(): void {}

  return {
    init,
  };
}
