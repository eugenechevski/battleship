export namespace StateVars {
  export let attackTimeLimit: 5 | 10 | 15;
  export let gameMode: boolean;
  export let isMuted: boolean;
  export let isPlaying: boolean;
  export let isPaused: boolean;
  export let currentPlayer: Player;
  export let nextPlayer: Player;
  export let doubleSetup: boolean;
  export let cycles: number;
  export let clock: number;
  export let clockInterval: NodeJS.Timer;
  export let roundCount: number;
  export let savedOffset: number;
  export let startTime: number;
  export let timerInterval: NodeJS.Timer;
}
