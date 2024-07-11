// script.js

document.addEventListener("DOMContentLoaded", () => {
  const scene = document.querySelector("a-scene");
  const targetWhite = document.querySelector("#target-white");
  const targetRed = document.querySelector("#target-red");
  const targetBlue = document.querySelector("#target-blue");
  const targetYellow = document.querySelector("#target-yellow");
  const bonusTarget = document.querySelector("#bonus-target");
  const movingObstacle = document.querySelector("#moving-obstacle");
  const arrowPickup = document.querySelector("#arrow-pickup");
  const arrowPickup2 = document.querySelector("#arrow-pickup-2");
  const obstacle = document.querySelector("#obstacle");
  const arrowRefill = document.querySelector("#arrow-refill");
  const slowPowerUp = document.querySelector("#slow-power-up");
  const shieldPowerUp = document.querySelector("#shield-power-up");
  const powerUp = document.querySelector("#power-up");
  const doubleScorePowerUp = document.querySelector("#double-score-power-up");
  const camera = document.querySelector("#camera");
  const scoreDisplay = document.getElementById("score");
  const arrowsRemainingDisplay = document.getElementById("arrows-remaining");
  const healthDisplay = document.getElementById("health");
  const coinsDisplay = document.getElementById("coins");
  const timeLeftDisplay = document.getElementById("time-left");
  const arrowsVisual = document.getElementById("arrows-visual");
  const arrowHitSound = document.querySelector("#arrow-hit-sound");
  const backgroundMusic = document.querySelector("#background-music");
  const achievementSound = document.querySelector("#achievement-sound");
  const sfxVolumeControl = document.getElementById("sfx-volume");
  const musicVolumeControl = document.getElementById("music-volume");
  const leaderboardList = document.getElementById("leaderboard-list");
  const achievementsList = document.getElementById("achievements-list");

  let score = 0;
  let arrowsRemaining = 5;
  let health = 100;
  let coins = 0;
  let gameDuration = 60; // seconds
  let bonusActive = false;
  let doubleScoreActive = false;
  let slowMotionActive = false;
  let shieldActive = false;
  let timerInterval;
  let levels = 1;
  let achievements = {};

  // Initialize game elements
  const initGameElements = () => {
    bonusTarget.setAttribute("visible", false);
    resetTimer();
    startGameTimer();
    moveObstacle();
    activateBonusTarget();
    activateDoubleScorePowerUp();
    activateSlowPowerUp();
    activateShieldPowerUp();
    activateArrowPickup();
    activateArrowPickup2();
    updateScore();
    updateArrowsRemaining();
    updateHealth();
    updateCoins();
    checkAchievements();
  };

  // Reset Timer
  const resetTimer = () => {
    clearInterval(timerInterval);
    gameDuration = 60;
    timeLeftDisplay.innerText = gameDuration;
  };

  // Start Game Timer
  const startGameTimer = () => {
    timerInterval = setInterval(() => {
      gameDuration--;
      timeLeftDisplay.innerText = gameDuration;
      if (gameDuration <= 0) {
        clearInterval(timerInterval);
        gameOver();
      }
    }, 1000);
  };

  // Game Over
  const gameOver = () => {
    alert("Game Over! Your final score is " + score);
    updateLeaderboard(score);
    resetGame();
  };

  // Update Leaderboard
  const updateLeaderboard = (finalScore) => {
    const li = document.createElement("li");
    li.textContent = `Score: ${finalScore}`;
    leaderboardList.appendChild(li);
  };

  // Reset Game
  const resetGame = () => {
    score = 0;
    arrowsRemaining = 5;
    health = 100;
    coins = 0;
    updateScore();
    updateArrowsRemaining();
    updateHealth();
    updateCoins();
    resetTimer();
    initGameElements();
  };

  // Update Score
  const updateScore = () => {
    scoreDisplay.innerText = score;
  };

  // Update Arrows Remaining
  const updateArrowsRemaining = () => {
    arrowsRemainingDisplay.innerText = arrowsRemaining;
  };

  // Update Health
  const updateHealth = () => {
    healthDisplay.innerText = health;
  };

  // Update Coins
  const updateCoins = () => {
    coinsDisplay.innerText = coins;
  };

  // Move Obstacle
  const moveObstacle = () => {
    const pathLength = 10;
    const speed = 0.05;
    let direction = 1;
    setInterval(() => {
      const position = movingObstacle.object3D.position;
      position.x += speed * direction;
      if (position.x > pathLength || position.x < -pathLength) {
        direction *= -1;
      }
    }, 20);
  };

  // Activate Bonus Target
  const activateBonusTarget = () => {
    setTimeout(() => {
      bonusTarget.setAttribute("visible", true);
    }, 10000);
  };

  // Activate Double Score Power-Up
  const activateDoubleScorePowerUp = () => {
    setInterval(() => {
      doubleScoreActive = true;
      setTimeout(() => {
        doubleScoreActive = false;
      }, 5000);
    }, 20000);
  };

  // Activate Slow Power-Up
  const activateSlowPowerUp = () => {
    slowPowerUp.addEventListener("collide", () => {
      slowMotionActive = true;
      setTimeout(() => {
        slowMotionActive = false;
      }, 5000);
    });
  };

  // Activate Shield Power-Up
  const activateShieldPowerUp = () => {
    shieldPowerUp.addEventListener("collide", () => {
      shieldActive = true;
      setTimeout(() => {
        shieldActive = false;
      }, 5000);
    });
  };

  // Activate Arrow Pickup
  const activateArrowPickup = () => {
    arrowPickup.addEventListener("collide", () => {
      arrowsRemaining += 3;
      updateArrowsRemaining();
      arrowPickup.setAttribute("visible", false);
    });
  };

  // Activate Arrow Pickup 2
  const activateArrowPickup2 = () => {
    arrowPickup2.addEventListener("collide", () => {
      arrowsRemaining += 3;
      updateArrowsRemaining();
      arrowPickup2.setAttribute("visible", false);
    });
  };

  // Check Achievements
  const checkAchievements = () => {
    if (score >= 100 && !achievements['score_100']) {
      achievements['score_100'] = true;
      showAchievement('Score 100 Points');
    }
    if (arrowsRemaining >= 10 && !achievements['arrows_10']) {
      achievements['arrows_10'] = true;
      showAchievement('Collect 10 Arrows');
    }
    // Add more achievements as needed
  };

  // Show Achievement
  const showAchievement = (achievement) => {
    const li = document.createElement("li");
    li.textContent = achievement;
    achievementsList.appendChild(li);
    achievementSound.components.sound.playSound();
  };

  // Initialize Game
  initGameElements();
});
