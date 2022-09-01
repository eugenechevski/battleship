/* eslint-disable no-undef */
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-loop-func */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-use-before-define */
import Renderer from './Renderer';
import Player from './state-control/Player';
import { StateVars } from './state-control/StateVars';

/**
 * The module orchestrates the flow of the game by receiving inputs and producing outputs.
 */
export default function Controller(): Controller {
  const renderer = Renderer();

  function init(self: Controller): void {
    renderer.init(self);
  }

  /**
   * Initializes players' objects.
   */
  function setPlayers(againstComputer: boolean): void {
    StateVars.currentPlayer = Player('Player 1', false);
    StateVars.nextPlayer = Player(!againstComputer ? 'Player 2' : 'Computer', againstComputer);
  }

  function startClock(savedClock: number): void {
    if (StateVars.clockInterval !== undefined) {
      clearInterval(StateVars.clockInterval);
    }

    StateVars.clock = savedClock;
    StateVars.clockInterval = setInterval(() => {
      if (StateVars.isPaused || !StateVars.isPlaying) {
        return;
      }

      StateVars.clock += 1;
      renderer.updateClock(StateVars.clock);
    }, 1000);
  }

  function startRoundCount(): void {
    StateVars.cycles = 0;
    StateVars.roundCount = 1;
  }

  /**
   * Starts the timer of player's attack.
   */
  function startTimer(offset: number): void {
    if (StateVars.timerInterval !== undefined) {
      clearInterval(StateVars.timerInterval);
    }

    StateVars.startTime = Date.now() - offset;
    StateVars.timerInterval = setInterval(() => {
      if (StateVars.isPaused || !StateVars.isPlaying) {
        return;
      }

      const timeElapsed = Date.now() - StateVars.startTime;

      if (timeElapsed / 1000 >= StateVars.attackTimeLimit) {
        timeout();
      }
      renderer.drawUpdatedTick(timeElapsed * (100 / StateVars.attackTimeLimit / 1000));
    }, 1);
  }

  /**
   * Swaps values of players' objects.
   */
  function changePlayers(): void {
    const player = StateVars.currentPlayer;
    StateVars.currentPlayer = StateVars.nextPlayer;
    StateVars.nextPlayer = player;
  }

  /**
   * Starts a new instance of the game with the given parameters.
   */
  function startGame(againstComputer: boolean, timeLimit: 5 | 10 | 15): void {
    StateVars.isPlaying = true;
    StateVars.isMuted = false;
    StateVars.isPaused = false;
    StateVars.gameMode = againstComputer;
    StateVars.attackTimeLimit = timeLimit;
    setPlayers(againstComputer);
    StateVars.doubleSetup = !againstComputer;
    renderer.scenesLoadersAPI.loadGameSetupScene(
      StateVars.currentPlayer.getName(),
      StateVars.currentPlayer.board.ships,
    );
    renderer.resetDisplayedBoard();
  }

  /**
   * Finishes up the setup of the game's instance and loads the countdown and the game-play scenes.
   */
  async function setupComplete(): Promise<any> {
    if (StateVars.doubleSetup) {
      changePlayers();
      renderer.scenesLoadersAPI.loadGameSetupScene(
        StateVars.currentPlayer.getName(),
        StateVars.currentPlayer.board.ships,
      );
      renderer.resetSelectedShip();
      StateVars.doubleSetup = false;
    } else {
      if (!StateVars.nextPlayer.isComputer) {
        changePlayers();
      }

      await renderer.scenesLoadersAPI.loadCountDownScene(1);
      await renderer.scenesLoadersAPI.loadCountDownScene(2);
      await renderer.scenesLoadersAPI.loadCountDownScene(3);
      await renderer.scenesLoadersAPI.loadGamePlayScene(StateVars.currentPlayer.board.ships);

      renderer.displaysAPI.displayAttackPromptMessage(StateVars.currentPlayer.getName());
      StateVars.isPlaying = true;
      startClock(0);
      startRoundCount();
      startTimer(0);
    }
  }

  function mute(): void {
    StateVars.isMuted = true;
    renderer.displaysAPI.displayMutedIcon();
  }

  function unmute(): void {
    StateVars.isMuted = false;
    renderer.displaysAPI.displayUnmutedIcon();
  }

  /**
   * Resets the game's instance with the same parameters.
   */
  function replay(): void {
    StateVars.isPlaying = true;
    StateVars.isPaused = false;
    setPlayers(StateVars.gameMode);
    startTimer(0);
    startClock(0);
    startRoundCount();
    renderer.shipDrawingAPI.redrawBoards(
      StateVars.currentPlayer.board.ships,
      StateVars.currentPlayer.board.getGrid(),
      StateVars.nextPlayer.board.ships,
      StateVars.nextPlayer.board.getGrid(),
    );
    renderer.displaysAPI.displayAttackPromptMessage(StateVars.currentPlayer.getName());
    renderer.displaysAPI.displayTimeBar();
    renderer.updateClock(StateVars.clock);
    renderer.updateRoundCount(StateVars.roundCount);
    renderer.displaysAPI.displayPauseButton();
    renderer.resetDisplayedBoard();
  }

  async function mainMenu(): Promise<any> {
    await renderer.scenesLoadersAPI.loadGameMenuScene();
  }

  function pause(): void {
    if (StateVars.isPlaying && !StateVars.isPaused && !StateVars.currentPlayer.isComputer) {
      StateVars.isPaused = true;
      StateVars.savedOffset = Date.now() - StateVars.startTime;
      clearInterval(StateVars.timerInterval);
      clearInterval(StateVars.clockInterval);
      renderer.displaysAPI.displayResumeButton();
      renderer.displaysAPI.displayPausedMessage();
    }
  }

  function resume(): void {
    if (StateVars.isPlaying && StateVars.isPaused) {
      StateVars.isPaused = false;
      startTimer(StateVars.savedOffset);
      startClock(StateVars.clock);
      renderer.displaysAPI.displayPauseButton();
    }
  }

  function surrender(): void {
    if (StateVars.isPlaying && !StateVars.currentPlayer.isComputer) {
      StateVars.isPlaying = false;
      clearInterval(StateVars.timerInterval);
      clearInterval(StateVars.clockInterval);
      renderer.displaysAPI.displayAfterGameControls();
      renderer.displaysAPI.displaySurrenderMessage(StateVars.currentPlayer.getName());
      renderer.resetDisplayedBoard();
    }
  }

  async function timeout(): Promise<any> {
    if (StateVars.isPaused || !StateVars.isPlaying) {
      return;
    }

    clearInterval(StateVars.timerInterval);
    renderer.resetTick();
    renderer.displaysAPI.displayTimeOutMessage(StateVars.currentPlayer.getName());
    changePlayers();
    if (!StateVars.currentPlayer.isComputer) {
      StateVars.isPlaying = false;
      renderer.displaysAPI.displayNextPlayerButton();
    } else {
      // Delay the message
      await new Promise((resolve) => {
        setTimeout(() => {
          renderer.displaysAPI.displayAttackPromptMessage(StateVars.currentPlayer.getName());
          resolve('');
        }, 1000);
      }).then(() => {
        setTimeout(() => {
          startTimer(0);
          attackRequested(StateVars.currentPlayer.board.generateAttack(), false);
        }, 2000);
      });
    }
  }

  /**
   * @param shipAlias - an alias of a ship
   * @returns a ship's object
   */
  function getSelectedShip(shipAlias: string): Ship {
    return StateVars.currentPlayer.board.ships[shipAlias];
  }

  /**
   * Accepts the request from the user to change a ship's position and process it.
   * @param target - a ship to be transformed
   * @param src - a source's coordinate
   * @param dest - a destination's coordinate
   */
  function transformShipRequested(target: Ship, src: Coordinate, dest?: Coordinate): void {
    // Translation
    if (dest !== undefined) {
      const result = StateVars.currentPlayer.board.transformValidator.isValidToTranslateShip(
        target,
        src,
        dest,
      );

      if (result) {
        const oldCoords = target.getArrayCoordinates();
        StateVars.currentPlayer.board.transformShip(target, result);
        renderer.shipDrawingAPI.eraseShip(oldCoords, 'setup-board', target.getOrientation());
        renderer.shipDrawingAPI.eraseSelectionOfShip(oldCoords);
        renderer.shipDrawingAPI.eraseSelectionOfCoordinate(src);
        renderer.setSelectedCoord(dest);
        renderer.shipDrawingAPI.drawShip(
          result,
          'setup-board',
          'black',
          target.getOrientation(),
          StateVars.currentPlayer.board.tableName[target.getName()],
        );
        renderer.shipDrawingAPI.drawSelectionOfShip(target.getArrayCoordinates());
        renderer.shipDrawingAPI.drawSelectionOfCoordinate(dest);
      }
    } else {
      // Rotation
      const result = StateVars.currentPlayer.board.transformValidator.isValidToRotateShip(
        target,
        src,
      );

      if (result) {
        const oldCoords = target.getArrayCoordinates();
        renderer.shipDrawingAPI.eraseShip(oldCoords, 'setup-board', target.getOrientation());
        StateVars.currentPlayer.board.transformShip(
          target,
          result,
          target.getOrientation() === 'VERTICAL' ? 'HORIZONTAL' : 'VERTICAL',
        );
        renderer.shipDrawingAPI.eraseSelectionOfShip(oldCoords);
        renderer.shipDrawingAPI.drawSelectionOfShip(result);
        renderer.shipDrawingAPI.drawShip(
          result,
          'setup-board',
          'black',
          target.getOrientation(),
          StateVars.currentPlayer.board.tableName[target.getName()],
        );
      }
    }
  }

  /**
   * Updates the gaming cycle when a player produces an attack.
   * The number of rounds gets updated every two cycles.
   */
  function updateCycle(): void {
    StateVars.cycles += 1;
    if (StateVars.cycles % 2 === 0) {
      StateVars.roundCount += 1;
      renderer.updateRoundCount(StateVars.roundCount);
    }
  }

  /**
   * Starts a new round when two players are humans and after the 'next player' button was clicked.
   */
  function nextRound(): void {
    StateVars.isPlaying = true;
    renderer.shipDrawingAPI.redrawBoards(
      StateVars.currentPlayer.board.ships,
      StateVars.currentPlayer.board.getGrid(),
      StateVars.nextPlayer.board.ships,
      StateVars.nextPlayer.board.getGrid(),
    );
    renderer.displaysAPI.displayTimeBar();
    renderer.displaysAPI.displayAttackPromptMessage(StateVars.currentPlayer.getName());
    startTimer(0);
    startClock(StateVars.clock);
  }

  /**
   * Executes a protocol when a player missed.
   */
  async function playerMissed(attack: Coordinate): Promise<any> {
    if (StateVars.isPaused || !StateVars.isPlaying) {
      return;
    }

    renderer.displaysAPI.displayMissedAttackMessage(StateVars.currentPlayer.getName());
    if (!StateVars.isMuted) {
      renderer.playMissedSound();
    }

    // Draw the missed attack
    if (StateVars.currentPlayer.isComputer) {
      renderer.shipDrawingAPI.drawMissedAttack(attack, 'left-board');
      StateVars.currentPlayer.board.enemyBoardView.markAsMissed(attack);
    } else {
      renderer.shipDrawingAPI.drawMissedAttack(attack, 'right-board');
    }

    changePlayers();
    updateCycle();
    renderer.resetTick();
    clearInterval(StateVars.timerInterval);
    clearInterval(StateVars.clockInterval);

    // Reset the state for the next input
    if (StateVars.currentPlayer.isComputer) {
      // Delay the message
      await new Promise((resolve) => {
        setTimeout(() => {
          renderer.displaysAPI.displayAttackPromptMessage(StateVars.currentPlayer.getName());
          resolve('');
        }, 1000);
      });

      // Delay the input from the computer
      await new Promise((resolve) => {
        setTimeout(() => {
          startClock(StateVars.clock);
          startTimer(0);
          attackRequested(StateVars.currentPlayer.board.generateAttack(), false);
          resolve('');
        }, 1000);
      });
    } else if (!StateVars.nextPlayer.isComputer) {
      // both players are humans
      renderer.displaysAPI.displayNextPlayerButton();
      StateVars.isPlaying = false;
    } else {
      // Delay the prompt message after the computer player missed
      await new Promise((resolve) => {
        setTimeout(() => {
          startClock(StateVars.clock);
          startTimer(0);
          renderer.displaysAPI.displayAttackPromptMessage(StateVars.currentPlayer.getName());
          resolve('');
        }, 2000);
      });
    }
  }

  /**
   * Executes a protocol when a player hit an enemy's ship.
   */
  async function playerHit(attack: Coordinate): Promise<any> {
    if (StateVars.isPaused || !StateVars.isPlaying) {
      return;
    }

    if (!StateVars.isMuted) {
      renderer.playHitSound();
    }
    renderer.displaysAPI.displayHitMessage(StateVars.currentPlayer.getName());
    renderer.resetTick();
    clearInterval(StateVars.timerInterval);
    clearInterval(StateVars.clockInterval);

    // Update the view and the state
    if (StateVars.currentPlayer.isComputer) {
      renderer.shipDrawingAPI.drawHitAttack(attack, 'left-board');
      StateVars.currentPlayer.board.enemyBoardView.markAsHit(
        attack,
        <Ship>StateVars.nextPlayer.board.getGrid()[attack[0]][attack[1]],
      );
      StateVars.currentPlayer.board.enemyBoardView.addLastAttack(attack);

      // Delay the input from the computer
      await new Promise((resolve) => {
        setTimeout(() => {
          startTimer(0);
          startClock(StateVars.clock);
          attackRequested(StateVars.currentPlayer.board.generateAttack(), false);
          resolve('');
        }, 2000);
      });
    } else {
      startTimer(0);
      startClock(StateVars.clock);
      renderer.shipDrawingAPI.drawHitAttack(attack, 'right-board');
    }
  }

  /**
   * Executes a protocol when a player sunk an enemy ship.
   */
  async function playerSunk(attack: Coordinate): Promise<any> {
    if (StateVars.isPaused || !StateVars.isPlaying) {
      return;
    }

    if (!StateVars.isMuted) {
      renderer.playHitSound();
    }
    renderer.displaysAPI.displaySunkMessage(StateVars.currentPlayer.getName());
    renderer.resetTick();
    clearInterval(StateVars.timerInterval);
    clearInterval(StateVars.clockInterval);

    // Obtain the ship
    const ship = <Ship>StateVars.nextPlayer.board.getGrid()[attack[0]][attack[1]];

    // Update the view and the internal state
    if (StateVars.currentPlayer.isComputer) {
      renderer.shipDrawingAPI.drawHitAttack(attack, 'left-board');
      renderer.shipDrawingAPI.drawShip(
        ship.getArrayCoordinates(),
        'left-board',
        'red-500',
        ship.getOrientation(),
      );
      StateVars.currentPlayer.board.enemyBoardView.markAroundAsMissed(ship.getArrayCoordinates());
      StateVars.currentPlayer.board.enemyBoardView.markAsHit(attack, ship);
      StateVars.currentPlayer.board.enemyBoardView.resetLastAttacks();
    } else {
      renderer.shipDrawingAPI.drawHitAttack(attack, 'right-board');
      renderer.shipDrawingAPI.drawShip(
        ship.getArrayCoordinates(),
        'right-board',
        'red-500',
        ship.getOrientation(),
      );
    }

    // Decide further actions

    // Scenario #1: Game over
    if (StateVars.nextPlayer.board.areSunk()) {
      // Delay the further actions to let the user see the message that a ship was sunk
      await new Promise((resolve) => {
        setTimeout(() => {
          StateVars.isPlaying = false;
          renderer.displaysAPI.displayAfterGameControls();
          renderer.displaysAPI.displayGameOverMessage(StateVars.currentPlayer.getName());
          resolve('');
        }, 2000);
      });
      return;
    }

    // Scenario #2: Continue shooting
    if (StateVars.currentPlayer.isComputer) {
      // Delay the input
      await new Promise((resolve) => {
        setTimeout(() => {
          startTimer(0);
          startClock(StateVars.clock);
          attackRequested(StateVars.currentPlayer.board.generateAttack(), false);
          resolve('');
        }, 2000);
      });
    } else {
      startTimer(0);
      startClock(StateVars.clock);
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
    if (
      StateVars.isPaused
      || !StateVars.isPlaying
      || StateVars.currentPlayer.isComputer !== !isPlayer
    ) {
      return;
    }

    const result: AttackResult = StateVars.nextPlayer.board.receiveAttack(attack);

    if (result === 'MISSED') {
      playerMissed(attack);
    } else if (result === 'DOUBLE SHOT') {
      renderer.displaysAPI.displayDoubleShotMessage(StateVars.currentPlayer.getName());
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
