/* eslint-disable no-loop-func */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-use-before-define */
import Player from './Player';
import Renderer from './Renderer';

export default function Controller() {
  const renderer = Renderer();
  let attackTimeLimit: 5 | 10 | 15;
  let gameMode: boolean;
  let isMuted: boolean;
  let isPlaying: boolean;
  let isPaused: boolean;
  let currentPlayer: Player;
  let nextPlayer: Player;
  let doubleSetup: boolean;
  let cycles: number;
  let clock: number;
  let clockInterval: NodeJS.Timer;
  let roundCount: number;
  let savedOffset: number;
  let startTime: number;
  let timerInterval: NodeJS.Timer;

  function init(self: Controller) {
    renderer.init(self);
  }

  function setPlayers(againstComputer: boolean): void {
    currentPlayer = Player('Player 1', false);
    nextPlayer = Player(!againstComputer ? 'Player 2' : 'Computer', againstComputer);
  }

  function startClock(savedClock: number): void {
    if (clockInterval !== undefined) {
      clearInterval(clockInterval);
    }

    clock = savedClock;
    clockInterval = setInterval(() => {
      if (isPaused || !isPlaying) {
        return;
      }

      clock += 1;
      renderer.updateClock(clock);
    }, 1000);
  }

  function startRoundCount(): void {
    cycles = 0;
    roundCount = 1;
  }

  function startTimer(offset: number): void {
    if (timerInterval !== undefined) {
      clearInterval(timerInterval);
    }

    startTime = Date.now() - offset;
    timerInterval = setInterval(() => {
      if (isPaused || !isPlaying) {
        return;
      }

      const timeElapsed = Date.now() - startTime;

      if (timeElapsed / 1000 >= attackTimeLimit) {
        timeout();
      }
      renderer.drawUpdatedTick(timeElapsed * (100 / attackTimeLimit / 1000));
    }, 1);
  }

  function changePlayers(): void {
    const player = currentPlayer;
    currentPlayer = nextPlayer;
    nextPlayer = player;
  }

  function startGame(againstComputer: boolean, timeLimit: 5 | 10 | 15): void {
    isPlaying = true;
    isMuted = false;
    isPaused = false;
    gameMode = againstComputer;
    attackTimeLimit = timeLimit;
    setPlayers(againstComputer);
    doubleSetup = !againstComputer;
    renderer.loadGameSetupScene(currentPlayer.getName(), currentPlayer.board.ships);
  }

  async function setupComplete(): Promise<any> {
    if (doubleSetup) {
      changePlayers();
      renderer.loadGameSetupScene(currentPlayer.getName(), currentPlayer.board.ships);
      renderer.resetSelectedShip();
      doubleSetup = false;
    } else {
      if (!nextPlayer.isComputer) {
        changePlayers();
      }

      await renderer.loadCountDownScene(1);
      await renderer.loadCountDownScene(2);
      await renderer.loadCountDownScene(3);
      await renderer.loadGamePlayScene(currentPlayer.board.ships);

      renderer.displayAttackPromptMessage(currentPlayer.getName());
      isPlaying = true;
      startClock(0);
      startRoundCount();
      startTimer(0);
    }
  }

  function mute(): void {
    isMuted = true;
    renderer.displayMutedIcon();
  }

  function unmute(): void {
    isMuted = false;
    renderer.displayUnmutedIcon();
  }

  function replay(): void {
    isPlaying = true;
    isPaused = false;
    setPlayers(gameMode);
    startTimer(0);
    startClock(0);
    startRoundCount();
    renderer.redrawBoards(
      currentPlayer.board.ships,
      currentPlayer.board.getGrid(),
      nextPlayer.board.ships,
      nextPlayer.board.getGrid(),
    );
    renderer.displayAttackPromptMessage(currentPlayer.getName());
    renderer.displayTimeBar();
    renderer.updateClock(clock);
    renderer.updateRoundCount(roundCount);
    renderer.displayPauseButton();
  }

  async function mainMenu(): Promise<any> {
    await renderer.loadGameMenuScene();
  }

  function pause(): void {
    if (isPlaying && !isPaused && !currentPlayer.isComputer) {
      isPaused = true;
      savedOffset = Date.now() - startTime;
      clearInterval(timerInterval);
      clearInterval(clockInterval);
      renderer.displayResumeButton();
      renderer.displayPausedMessage();
    }
  }

  function resume(): void {
    if (isPlaying && isPaused) {
      isPaused = false;
      startTimer(savedOffset);
      startClock(clock);
      renderer.displayPauseButton();
    }
  }

  function surrender(): void {
    if (isPlaying) {
      isPlaying = false;
      clearInterval(timerInterval);
      clearInterval(clockInterval);
      renderer.displayAfterGameControls();
      renderer.displaySurrenderMessage(currentPlayer.getName());
    }
  }

  async function timeout(): Promise<any> {
    if (isPaused || !isPlaying) {
      return;
    }

    clearInterval(timerInterval);
    renderer.resetTick();
    renderer.displayTimeOutMessage(currentPlayer.getName());
    changePlayers();
    if (!currentPlayer.isComputer) {
      isPlaying = false;
      renderer.displayNextPlayerButton();
    } else {
      // Delay the message
      await new Promise((resolve) => {
        setTimeout(() => {
          renderer.displayAttackPromptMessage(currentPlayer.getName());
          resolve('');
        }, 1000);
      });

      // Delay the input from computer
      await new Promise((resolve) => {
        setTimeout(() => {
          startTimer(0);
          attackRequested(currentPlayer.board.generateAttack(), false);
          resolve('');
        }, 2000);
      });
    }
  }

  function getSelectedShip(shipAlias: string): Ship {
    return currentPlayer.board.ships[shipAlias];
  }

  function transformShipRequested(target: Ship, src: Coordinate, dest?: Coordinate): void {
    if (dest !== undefined) {
      const result = currentPlayer.board.transformValidator.isValidToTranslateShip(
        target,
        src,
        dest,
      );

      if (result) {
        const oldCoords = target.getArrayCoordinates();
        currentPlayer.board.transformShip(target, result);
        renderer.eraseShip(oldCoords, 'setup-board', target.getOrientation());
        renderer.eraseSelectionOfShip(oldCoords);
        renderer.eraseSelectionOfCoordinate(src);
        renderer.setSelectedCoord(dest);
        renderer.drawShip(
          result,
          'setup-board',
          'black',
          target.getOrientation(),
          currentPlayer.board.tableName[target.getName()],
        );
        renderer.drawSelectionOfShip(target.getArrayCoordinates());
        renderer.drawSelectionOfCoordinate(dest);
      }
    } else {
      const result = currentPlayer.board.transformValidator.isValidToRotateShip(target, src);

      if (result) {
        const oldCoords = target.getArrayCoordinates();
        renderer.eraseShip(oldCoords, 'setup-board', target.getOrientation());
        currentPlayer.board.transformShip(
          target,
          result,
          target.getOrientation() === 'VERTICAL' ? 'HORIZONTAL' : 'VERTICAL',
        );
        renderer.eraseSelectionOfShip(oldCoords);
        renderer.drawSelectionOfShip(result);
        renderer.drawShip(
          result,
          'setup-board',
          'black',
          target.getOrientation(),
          currentPlayer.board.tableName[target.getName()],
        );
      }
    }
  }

  function updateCycle(): void {
    cycles += 1;
    if (cycles % 2 === 0) {
      roundCount += 1;
      renderer.updateRoundCount(roundCount);
    }
  }

  function nextRound(): void {
    isPlaying = true;
    renderer.redrawBoards(
      currentPlayer.board.ships,
      currentPlayer.board.getGrid(),
      nextPlayer.board.ships,
      nextPlayer.board.getGrid(),
    );
    renderer.displayTimeBar();
    renderer.displayAttackPromptMessage(currentPlayer.getName());
    startTimer(0);
    startClock(clock);
  }

  async function playerMissed(attack: Coordinate): Promise<any> {
    if (isPaused || !isPlaying) {
      return;
    }

    renderer.displayMissedAttackMessage(currentPlayer.getName());
    if (!isMuted) {
      renderer.playMissedSound();
    }

    // Draw the missed attack
    if (currentPlayer.isComputer) {
      renderer.drawMissedAttack(attack, 'left-board');
      currentPlayer.board.enemyBoardView.markAsMissed(attack);
    } else {
      renderer.drawMissedAttack(attack, 'right-board');
    }

    changePlayers();
    updateCycle();
    renderer.resetTick();
    clearInterval(timerInterval);
    clearInterval(clockInterval);

    // Reset the state for the next input
    if (currentPlayer.isComputer) {
      // Delay the message
      await new Promise((resolve) => {
        setTimeout(() => {
          renderer.displayAttackPromptMessage(currentPlayer.getName());
          resolve('');
        }, 1000);
      });

      // Delay the input from the computer
      await new Promise((resolve) => {
        setTimeout(() => {
          startClock(clock);
          startTimer(0);
          attackRequested(currentPlayer.board.generateAttack(), false);
          resolve('');
        }, 1000);
      });
    } else if (!nextPlayer.isComputer) {
      // both players are humans
      renderer.displayNextPlayerButton();
      isPlaying = false;
    } else {
      // Delay the prompt message after the computer player missed
      await new Promise((resolve) => {
        setTimeout(() => {
          startClock(clock);
          startTimer(0);
          renderer.displayAttackPromptMessage(currentPlayer.getName());
          resolve('');
        }, 2000);
      });
    }
  }

  async function playerHit(attack: Coordinate): Promise<any> {
    if (isPaused || !isPlaying) {
      return;
    }

    if (!isMuted) {
      renderer.playHitSound();
    }
    renderer.displayHitMessage(currentPlayer.getName());
    renderer.resetTick();
    clearInterval(timerInterval);
    clearInterval(clockInterval);

    // Update the view and the state
    if (currentPlayer.isComputer) {
      renderer.drawHitAttack(attack, 'left-board');
      currentPlayer.board.enemyBoardView.markAsHit(
        attack,
        nextPlayer.board.getGrid()[attack[0]][attack[1]],
      );
      currentPlayer.board.enemyBoardView.addLastAttack(attack);

      // Delay the input from the computer
      await new Promise((resolve) => {
        setTimeout(() => {
          startTimer(0);
          startClock(clock);
          attackRequested(currentPlayer.board.generateAttack(), false);
          resolve('');
        }, 2000);
      });
    } else {
      startTimer(0);
      startClock(clock);
      renderer.drawHitAttack(attack, 'right-board');
    }
  }

  async function playerSunk(attack: Coordinate): Promise<any> {
    if (isPaused || !isPlaying) {
      return;
    }

    if (!isMuted) {
      renderer.playHitSound();
    }
    renderer.displaySunkMessage(currentPlayer.getName());
    renderer.resetTick();
    clearInterval(timerInterval);
    clearInterval(clockInterval);

    // Obtain the ship
    const ship: Ship = nextPlayer.board.getGrid()[attack[0]][attack[1]];

    // Update the view and the internal state
    if (currentPlayer.isComputer) {
      renderer.drawHitAttack(attack, 'left-board');
      renderer.drawShip(ship.getArrayCoordinates(), 'left-board', 'red-500', ship.getOrientation());
      currentPlayer.board.enemyBoardView.markAroundAsMissed(ship.getArrayCoordinates());
      currentPlayer.board.enemyBoardView.markAsHit(attack, ship);
      currentPlayer.board.enemyBoardView.resetLastAttacks();
    } else {
      renderer.drawHitAttack(attack, 'right-board');
      renderer.drawShip(
        ship.getArrayCoordinates(),
        'right-board',
        'red-500',
        ship.getOrientation(),
      );
    }

    // Decide further actions

    // Scenario #1: Game over
    if (nextPlayer.board.areSunk()) {
      // Delay the further actions to let the user see the message that a ship was sunk
      await new Promise((resolve) => {
        setTimeout(() => {
          isPlaying = false;
          renderer.displayAfterGameControls();
          renderer.displayGameOverMessage(currentPlayer.getName());
          resolve('');
        }, 2000);
      });
      return;
    }

    // Scenario #2: Continue shooting
    if (currentPlayer.isComputer) {
      // Delay the input
      await new Promise((resolve) => {
        setTimeout(() => {
          startTimer(0);
          startClock(clock);
          attackRequested(currentPlayer.board.generateAttack(), false);
          resolve('');
        }, 2000);
      });
    } else {
      startTimer(0);
      startClock(clock);
    }
  }

  /**
   * The function serves as a bridge between the view and the internal state of the game.
   * It accepts the incoming attacks and update the state of the game.
   *
   * @param attack - coordinate of the target
   * @param isPlayer - the flag tells where the input is coming from
   */
  function attackRequested(attack: Coordinate, isPlayer: boolean): void {
    if (isPaused || !isPlaying || currentPlayer.isComputer !== !isPlayer) {
      return;
    }

    const result: AttackResult = nextPlayer.board.receiveAttack(attack);

    if (result === 'MISSED') {
      playerMissed(attack);
    } else if (result === 'DOUBLE SHOT') {
      renderer.displayDoubleShotMessage(currentPlayer.getName());
    } else if (result === 'HIT') {
      playerHit(attack);
    } else if (result === 'SUNK') {
      playerSunk(attack);
    }
  }

  return {
    init,
    startGame,
    replay,
    mainMenu,
    mute,
    unmute,
    pause,
    resume,
    surrender,
    timeout,
    attackRequested,
    getSelectedShip,
    transformShipRequested,
    setupComplete,
    nextRound,
  };
}
