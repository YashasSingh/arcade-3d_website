let score = 0;
let arrowsRemaining = 5;
let gameTime = 60;
let bonusTargetInterval;
let bonusTargetDuration = 5; // Duration in seconds for which the bonus target appears
let doubleScoreActive = false;
let doubleScoreDuration = 10; // Duration in seconds for double score
let doubleScoreTimeout;

document.addEventListener('DOMContentLoaded', () => {
  const scoreElement = document.getElementById('score');
  const arrowsRemainingElement = document.getElementById('arrows-remaining');
  const timeLeftElement = document.getElementById('time-left');
  const bonusTarget = document.getElementById('bonus-target');
  const bonusAppearSound = document.getElementById('bonus-appear-sound');
  const bonusHitSound = document.getElementById('bonus-hit-sound');
  const doubleScorePowerUp = document.getElementById('double-score');
  const specialEffectSound = document.getElementById('special-effect-sound');

  function updateScore(points) {
    if (doubleScoreActive) {
      points *= 2;
    }
    score += points;
    scoreElement.textContent = score;
  }

  function updateArrowsRemaining(change) {
    arrowsRemaining += change;
    arrowsRemainingElement.textContent = arrowsRemaining;
  }

  function startGameTimer() {
    const gameTimer = setInterval(() => {
      if (gameTime <= 0) {
        clearInterval(gameTimer);
        clearInterval(bonusTargetInterval);
        alert('Game Over! Your score: ' + score);
        return;
      }
      gameTime -= 1;
      timeLeftElement.textContent = gameTime;
    }, 1000);
  }

  function showBonusTarget() {
    bonusTarget.setAttribute('visible', 'true');
    bonusTarget.setAttribute('position', `0 1 -${Math.floor(Math.random() * 10) + 5}`);
    bonusAppearSound.play();

    setTimeout(() => {
      bonusTarget.setAttribute('visible', 'false');
    }, bonusTargetDuration * 1000);
  }

  bonusTarget.addEventListener('collide', (e) => {
    if (e.detail.body.el.id === 'arrows') {
      updateScore(10);
      bonusHitSound.play();
      bonusTarget.setAttribute('visible', 'false');
    }
  });

  function initBonusTarget() {
    bonusTargetInterval = setInterval(showBonusTarget, Math.random() * 10000 + 5000);
  }

  doubleScorePowerUp.addEventListener('collide', (e) => {
    if (e.detail.body.el.id === 'arrows') {
      activateDoubleScore();
      specialEffectSound.play();
      doubleScorePowerUp.setAttribute('visible', 'false');
      setTimeout(() => {
        doubleScorePowerUp.setAttribute('visible', 'true');
      }, 20000); // Reappear after 20 seconds
    }
  });

  function activateDoubleScore() {
    doubleScoreActive = true;
    clearTimeout(doubleScoreTimeout);
    doubleScoreTimeout = setTimeout(() => {
      doubleScoreActive = false;
    }, doubleScoreDuration * 1000);
  }

  // Initialize game elements
  startGameTimer();
  initBonusTarget();

  // Event listeners for other game elements...
});
