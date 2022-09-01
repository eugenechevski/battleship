/* eslint-disable no-undef */
/**
 * The module provides methods used by the 'Renderer' module to display various UI components.
 */
export default function (): Displays {
  function displayPauseButton(): void {
    document.querySelector('.icon-resume')?.classList.add('icon-pause');
    document.querySelector('.icon-resume')?.classList.remove('icon-resume');
  }

  function displayResumeButton(): void {
    document.querySelector('.icon-pause')?.classList.add('icon-resume');
    document.querySelector('.icon-pause')?.classList.remove('icon-pause');
  }

  function displayTimeBar(): void {
    document.querySelector('.next-player-btn').classList.add('hidden');
    document.querySelector('.after-game-controls').classList.add('hidden');
    document.querySelector('.time-bar').classList.remove('hidden');
  }

  function displayNextPlayerButton(): void {
    document.querySelector('.after-game-controls').classList.add('hidden');
    document.querySelector('.time-bar').classList.add('hidden');
    document.querySelector('.next-player-btn').classList.remove('hidden');
  }

  function displayAfterGameControls(): void {
    document.querySelector('.time-bar').classList.add('hidden');
    document.querySelector('.next-player-btn').classList.add('hidden');
    document.querySelector('.after-game-controls').classList.remove('hidden');
  }

  function displayAttackPromptMessage(playerName: string): void {
    document.querySelector(
      '.status-message',
    ).innerHTML = `${playerName}, it's your turn to shoot the salvo!`;
  }

  function displayMissedAttackMessage(playerName: string): void {
    document.querySelector('.status-message').innerHTML = `${playerName} missed!`;
  }

  function displayDoubleShotMessage(playerName: string): void {
    document.querySelector(
      '.status-message',
    ).innerHTML = `${playerName}, you hit the position before!`;
  }

  function displayHitMessage(playerName: string): void {
    document.querySelector('.status-message').innerHTML = `${playerName} hit a ship!`;
  }

  function displaySunkMessage(playerName: string): void {
    document.querySelector('.status-message').innerHTML = `${playerName} sunk a ship!`;
  }

  function displayGameOverMessage(playerName: string): void {
    document.querySelector('.status-message').innerHTML = `Game is over, ${playerName} won!`;
  }

  function displaySurrenderMessage(playerName: string): void {
    document.querySelector('.status-message').innerHTML = `${playerName} surrendered!`;
  }

  function displayTimeOutMessage(playName: string): void {
    document.querySelector('.status-message').innerHTML = `${playName} ran out of time!`;
  }

  function displayPausedMessage(): void {
    document.querySelector('.status-message').innerHTML = 'Game is paused.';
  }

  function displayMutedIcon(): void {
    document.querySelector('.icon-unmuted').classList.add('icon-muted');
    document.querySelector('.icon-unmuted').classList.remove('icon-unmuted');
  }

  function displayUnmutedIcon(): void {
    document.querySelector('.icon-muted').classList.add('icon-unmuted');
    document.querySelector('.icon-muted').classList.remove('icon-muted');
  }

  return {
    displayPauseButton,
    displayResumeButton,
    displayMutedIcon,
    displayUnmutedIcon,
    displayTimeBar,
    displayNextPlayerButton,
    displayAfterGameControls,
    displayAttackPromptMessage,
    displayMissedAttackMessage,
    displayDoubleShotMessage,
    displayHitMessage,
    displaySunkMessage,
    displayGameOverMessage,
    displaySurrenderMessage,
    displayTimeOutMessage,
    displayPausedMessage,
  };
}
