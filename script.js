let score = 0;
let arrowsRemaining = 5;
let timeLeft = 60;

document.addEventListener('DOMContentLoaded', () => {
  const scoreElement = document.getElementById('score');
  const arrowsRemainingElement = document.getElementById('arrows-remaining');
  const timeLeftElement = document.getElementById('time-left');
  const arrowsVisual = document.getElementById('arrows-visual');
  const sfxVolumeControl = document.getElementById('sfx-volume');
  const musicVolumeControl = document.getElementById('music-volume');
  const backgroundMusic = document.querySelector('a-sound');

  sfxVolumeControl.addEventListener('input', (e) => {
    const volume = e.target.value;
    document.querySelectorAll('a-sound').forEach(sound => {
      if (sound !== backgroundMusic) {
        sound.setAttribute('volume', volume);
      }
    });
  });

  musicVolumeControl.addEventListener('input', (e) => {
    backgroundMusic.setAttribute('volume', e.target.value);
  });

  function updateScore(points) {
    score += points;
    scoreElement.textContent = score;
  }

  function updateArrowsRemaining(count) {
    arrowsRemaining += count;
    arrowsRemainingElement.textContent = arrowsRemaining;
    while (arrowsVisual.children.length > arrowsRemaining) {
      arrowsVisual.removeChild(arrowsVisual.lastChild);
    }
    while (arrowsVisual.children.length < arrowsRemaining) {
      const arrowIcon = document.createElement('div');
      arrowIcon.classList.add('arrow-icon');
      arrowsVisual.appendChild(arrowIcon);
    }
  }

  function startTimer() {
    const interval = setInterval(() => {
      timeLeft -= 1;
      timeLeftElement.textContent = timeLeft;
      if (timeLeft <= 0) {
        clearInterval(interval);
        alert('Game Over! Your score is ' + score);
        resetGame();
      }
    }, 1000);
  }

  function resetGame() {
    score = 0;
    arrowsRemaining = 5;
    timeLeft = 60;
    scoreElement.textContent = score;
    arrowsRemainingElement.textContent = arrowsRemaining;
    timeLeftElement.textContent = timeLeft;
    updateArrowsRemaining(0);
    updateArrowsRemaining(5);
  }

  startTimer();

  AFRAME.registerComponent('arrow-shooter', {
    init: function () {
      const sceneEl = document.querySelector('a-scene');
      sceneEl.addEventListener('click', (e) => {
        if (arrowsRemaining > 0) {
          const arrow = document.createElement('a-entity');
          arrow.setAttribute('geometry', {
            primitive: 'cylinder',
            radius: 0.02,
            height: 1,
          });
          arrow.setAttribute('material', 'color', 'brown');
          arrow.setAttribute('position', '0 1.6 -1');
          arrow.setAttribute('rotation', '-90 0 0');
          arrow.setAttribute('dynamic-body', 'shape: cylinder');
          arrow.setAttribute('velocity', '0 0 -10');
          sceneEl.appendChild(arrow);
          updateArrowsRemaining(-1);

          const shootSound = document.querySelector('#shoot-sound');
          shootSound.components.sound.playSound();
        }
      });
    },
  });

  AFRAME.registerComponent('target-hit', {
    init: function () {
      this.el.addEventListener('collide', (e) => {
        const hitSound = document.querySelector('#hit-sound');
        hitSound.components.sound.playSound();

        if (e.detail.body.el.id === 'target-yellow') {
          updateScore(10);
        } else if (e.detail.body.el.id === 'target-blue') {
          updateScore(5);
        } else if (e.detail.body.el.id === 'target-red') {
          updateScore(2);
        } else if (e.detail.body.el.id === 'target-white') {
          updateScore(1);
        }

        e.detail.target.el.parentNode.removeChild(e.detail.target.el);
      });
    },
  });

  AFRAME.registerComponent('collect-power-up', {
    init: function () {
      this.el.addEventListener('collide', (e) => {
        if (e.detail.body.el.id === 'camera') {
          const powerUpSound = document.querySelector('#power-up-sound');
          powerUpSound.components.sound.playSound();

          this.el.parentNode.removeChild(this.el);
          updateScore(50);
        }
      });
    },
  });

  AFRAME.registerComponent('arrow-refill', {
    init: function () {
      this.el.addEventListener('collide', (e) => {
        if (e.detail.body.el.id === 'camera') {
          const reloadSound = document.querySelector('#reload-sound');
          reloadSound.components.sound.playSound();

          this.el.parentNode.removeChild(this.el);
          updateArrowsRemaining(5);
        }
      });
    },
  });

  document.querySelector('#shooting-controller').setAttribute('arrow-shooter', '');
  document.querySelectorAll('#target-white, #target-red, #target-blue, #target-yellow').forEach(target => {
    target.setAttribute('target-hit', '');
  });
  document.querySelector('#power-up').setAttribute('collect-power-up', '');
  document.querySelector('#arrow-refill').setAttribute('arrow-refill', '');
});
