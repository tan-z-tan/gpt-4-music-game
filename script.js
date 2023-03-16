document.addEventListener("DOMContentLoaded", function () {
  const scoreElement = document.getElementById("score");
  const equalTemperamentButton = document.getElementById("equal-temperament");
  const justIntonationButton = document.getElementById("just-intonation");
  const fallingArea = document.querySelector(".falling-area");
  const keyboardArea = document.querySelector(".keyboard-area");

  let audioContext = new AudioContext();
  let oscillators = {};

  const keys = ["A", "S", "D", "F", "G", "H", "J", "K", "L"];
  const noteFrequencies = [
    261.63, 293.66, 329.63, 349.23, 392.0, 440.0, 493.88, 523.25, 587.33,
  ];
  const noteColors = [
    "red",
    "orange",
    "yellow",
    "green",
    "blue",
    "indigo",
    "violet",
    "pink",
    "cyan",
  ];
  const notes = [];
  let score = 0;

  equalTemperamentButton.addEventListener("click", function () {
    // TODO: Switch to equal temperament tuning
  });

  justIntonationButton.addEventListener("click", function () {
    // TODO: Switch to just intonation tuning
  });

  createKeyboard();

  document.addEventListener("keydown", function (event) {
    const keyIndex = keys.indexOf(event.key.toUpperCase());
    if (keyIndex > -1) {
      playSound(keyIndex);
      checkHit(keyIndex);
      highlightKey(keyIndex, true);
    }
  });

  document.addEventListener("keyup", function (event) {
    const keyIndex = keys.indexOf(event.key.toUpperCase());
    if (keyIndex > -1) {
      stopSound(keyIndex);
      highlightKey(keyIndex, false);
    }
  });

  function createKeyboard() {
    keys.forEach((key, index) => {
      const keyElement = document.createElement("div");
      keyElement.classList.add("key");
      keyElement.textContent = key;
      keyElement.style.width = "100px";
      keyElement.style.height = "100px";
      keyElement.style.backgroundColor = "white";
      keyElement.style.display = "inline-block";
      keyElement.style.margin = "0 5px";
      keyElement.style.textAlign = "center";
      keyElement.style.verticalAlign = "bottom";
      keyboardArea.appendChild(keyElement);
    });
  }

  function highlightKey(keyIndex, isHighlighted) {
    const keyElement = keyboardArea.children[keyIndex];
    keyElement.style.backgroundColor = isHighlighted
      ? noteColors[keyIndex]
      : "white";
  }

  function playSound(keyIndex) {
    const oscillator = audioContext.createOscillator();
    oscillator.frequency.setValueAtTime(
      noteFrequencies[keyIndex],
      audioContext.currentTime
    );
    oscillator.connect(audioContext.destination);
    oscillator.start();
    oscillators[keyIndex] = oscillator;
  }

  function stopSound(keyIndex) {
    if (oscillators[keyIndex]) {
      oscillators[keyIndex].stop();
      oscillators[keyIndex].disconnect();
      delete oscillators[keyIndex];
    }
  }

  function createRandomNote() {
    const noteIndex = Math.floor(Math.random() * noteFrequencies.length);
    const note = document.createElement("div");
    note.classList.add("note");
    note.style.backgroundColor = noteColors[noteIndex];
    note.style.width = "100px";
    note.style.height = "20px";
    note.style.position = "absolute";
    note.style.left =
      Math.floor(Math.random() * 9) * 100 + 5 * (noteIndex + 1) + "px";
    note.style.top = "0px";
    note.dataset.frequency = noteFrequencies[noteIndex];
    fallingArea.appendChild(note);
    notes.push(note);
  }

  function moveNotesDown() {
    notes.forEach((note) => {
      const currentTop = parseInt(note.style.top);
      note.style.top = currentTop + 10 + "px";
    });
  }

  function removeOutOfBoundNotes() {
    notes.forEach((note, index) => {
      if (parseInt(note.style.top) > fallingArea.clientHeight) {
        fallingArea.removeChild(note);
        notes.splice(index, 1);
      }
    });
  }

  function checkHit(keyIndex) {
    const hitZone = fallingArea.clientHeight - 30;
    notes.forEach((note, index) => {
      const notePosition = parseInt(note.style.top);
      if (
        notePosition >= hitZone &&
        notePosition <= hitZone + 30 &&
        parseInt(note.style.left) === keyIndex * 100 + 5 * (keyIndex + 1)
      ) {
        score++;
        scoreElement.textContent = score;
        fallingArea.removeChild(note);
        notes.splice(index, 1);
      }
    });
  }

  function gameLoop() {
    if (Math.random() < 0.2) {
      createRandomNote();
    }
    moveNotesDown();
    removeOutOfBoundNotes();

    setTimeout(() => {
      requestAnimationFrame(gameLoop);
    }, 200);
  }

  gameLoop();
});
