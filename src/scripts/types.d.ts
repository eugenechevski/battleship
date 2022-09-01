/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-vars */

// Top modules
declare type Controller = {
  init: (self: Controller) => void,
  startGame: (againstComputer: boolean, timeLimit: 5 | 10 | 15) => void,
  replay: () => void,
  mainMenu: () => void,
  mute: () => void,
  unmute: () => void,
  pause: () => void,
  resume: () => void,
  surrender: () => void,
  timeout: () => void,
  attackRequested: (attack: Coordinate, isPlayer: boolean) => void,
  getSelectedShip: (shipAlias: string) => Ship,
  transformShipRequested: (target: Ship, src: Coordinate, dest?: Coordinate) => void,
  setupComplete: () => Promise<any>,
  nextRound: () => void,
};
declare type Renderer = {
  init: (ControllerInstance: Controller) => void,
  DOMNodes: any,
  displaysAPI: Displays,
  shipDrawingAPI: ShipDrawing,
  scenesLoadersAPI: ScenesLoaders,
  appendFreshBoards: () => void,
  updateClock: (clock: number) => void,
  resetClock: () => void,
  updateRoundCount: (roundCount: number) => void,
  resetRoundCount: () => void,
  drawUpdatedTick: (newX: number) => void,
  playMissedSound: () => void,
  playHitSound: () => void,
  resetTick: () => void,
  resetDisplayedBoard: () => void,
  resetSelectedShip: () => void,
  setSelectedCoord: (newCoord: Coordinate) => void,
  setSelectedShip: (newShip: Ship) => void,
};

// Sub-modules

declare type EnemyBoardView = {
  getCoordOfLastAttack: () => Coordinate[];
  getEnemyGridMap: () => GridMap;
  addLastAttack: (lastAttack: Coordinate) => void;
  resetLastAttacks: () => void;
  markAroundAsMissed: (shipCoords: Coordinate[]) => void;
  markAsHit: (attack: Coordinate, enemyShip: Ship) => void;
  markAsMissed: (attack: Coordinate) => void;
  generateForTheFirstCase: () => Coordinate;
  generateForTheSecondCase: () => Coordinate;
  generateForTheThirdCase: () => Coordinate;
};
declare type GameBoard = {
  ships: ShipMap;
  tableName: { [shipName: string]: string };
  enemyBoardView: EnemyBoardView;
  transformValidator: TransformationValidator;
  transformShip: (target: Ship, newCoords: Coordinate[], newOrientation?: Orientation) => void;
  receiveAttack: (coord: Coordinate) => AttackResult;
  generateAttack: () => Coordinate;
  areSunk: () => boolean;
  getGrid: () => Grid;
};
declare type PositionGenerator = {
  generateRandomCoords: () => Coordinate[][];
};
declare type Player = {
  isComputer: boolean;
  board: GameBoard;
  getName: () => string;
  setName: (string) => void;
};
declare type Ship = {
  getName: () => string;
  getArrayCoordinates: () => Coordinate[];
  wasHit: (coord: Coordinate) => boolean;
  addCoordinate: (coord: Coordinate) => void;
  clearCoordinates: () => void;
  getOrientation: () => Orientation | undefined;
  setOrientation: (newOrientation: Orientation) => void;
  isSunk: () => boolean;
  hit: (target: Coordinate) => boolean;
  shipSize: number;
};
declare type TransformationValidator = {
  isValidToRotateShip: (target: Ship, src: Coordinate) => false | Coordinate[];
  isValidToTranslateShip: (target: Ship, src: Coordinate, dest: Coordinate) => false | Coordinate[];
};

// Sub-modules

declare type Displays = {
  displayPauseButton: () => void;
  displayResumeButton: () => void;
  displayMutedIcon: () => void;
  displayUnmutedIcon: () => void;
  displayTimeBar: () => void;
  displayNextPlayerButton: () => void;
  displayAfterGameControls: () => void;
  displayAttackPromptMessage: (playerName: string) => void;
  displayMissedAttackMessage: (playerName: string) => void;
  displayDoubleShotMessage: (playerName: string) => void;
  displayHitMessage: (playerName: string) => void;
  displaySunkMessage: (playerName: string) => void;
  displayGameOverMessage: (playerName: string) => void;
  displaySurrenderMessage: (playerName: string) => void;
  displayTimeOutMessage: (playerName: string) => void;
  displayPausedMessage: () => void;
};
declare type ScenesLoaders = {
  loadGameMenuScene: () => Promise<any>;
  loadGameSetupScene: (playerName: string, ships?: ShipMap) => Promise<any>;
  loadCountDownScene: (count: number) => Promise<any>;
  loadGamePlayScene: (ships?: ShipMap) => Promise<any>;
};
declare type ShipDrawing = {
  redrawBoards: (ships: ShipMap, grid: Grid, enemyShips: ShipMap, enemyGrid: Grid) => void;
  drawAllShips: (ships: ShipMap, containerClass: string) => void;
  drawShip: (
    coords: Coordinate[],
    containerClass: string,
    color: string,
    orientation?: 'VERTICAL' | 'HORIZONTAL',
    shipAlias?: string,
  ) => void;
  eraseShip: (
    coords: Coordinate[],
    containerClass: string,
    orientation?: 'VERTICAL' | 'HORIZONTAL',
  ) => void,
  drawHitAttack: (attack: Coordinate, containerClass: string) => void;
  drawMissedAttack: (attack: Coordinate, containerClass: string) => void;
  drawSelectionOfShip: (coords: Coordinate[]) => void;
  drawSelectionOfCoordinate: (target: Coordinate) => void;
  eraseSelectionOfShip: (coords: Coordinate[]) => void;
  eraseSelectionOfCoordinate: (target: Coordinate) => void;
};

declare type Coordinate = [row: number, col: number];
declare type Grid = (boolean | Ship)[][];
declare type GridMap = { [index: number]: boolean | Ship };
declare type ShipMap = { [index: string]: Ship };
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
declare type AttackResult = 'MISSED' | 'SUNK' | 'HIT' | 'DOUBLE SHOT';
declare type Orientation = 'VERTICAL' | 'HORIZONTAL';
