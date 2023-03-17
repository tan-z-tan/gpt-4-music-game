document.getElementById('start-game').addEventListener('click', startGame);

let noteCount = 0;
const maxNotes = 10; // Adjust this value to control the number of notes

function startGame() {
    const noteContainer = document.getElementById('note-container');
    const noteCreationInterval = setInterval(() => {
        if (noteCount < maxNotes) {
            const note = createNote();
            noteContainer.appendChild(note);
            animateNoteFall(note);
            noteCount++;
        } else {
            clearInterval(noteCreationInterval);
        }
    }, 1000);
}


function createNote() {
    const note = document.createElement('div');
    note.className = 'note';
    note.style.left = Math.random() * 100 + '%';
    return note;
}

function animateNoteFall(note) {
    let topPosition = 0;
    const interval = setInterval(() => {
        if (topPosition >= 100) {
            clearInterval(interval);
            note.remove();
        } else {
            topPosition += 1;
            note.style.top = topPosition + '%';
        }
    }, 10);
}

document.addEventListener('keydown', handleKeyPress);

function handleKeyPress(event) {
    if (event.key === ' ') { // Space bar is pressed
        checkHit();
    }
}

function checkHit() {
    const notes = document.getElementsByClassName('note');
    let hit = false;

    for (let i = 0; i < notes.length; i++) {
        const note = notes[i];
        const notePosition = note.offsetTop + note.offsetHeight;

        if (notePosition >= document.getElementById('hit-area').offsetTop) {
            note.remove();
            hit = true;
            // TODO: Add score increment logic.
            break;
        }
    }

    if (hit) {
        playSound(440, 'sine', 0.1); // Hit sound
    } else {
        playSound(220, 'sine', 0.1); // Miss sound
    }
}

function playSound(frequency, type, duration) {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = type; // 'sine', 'square', 'sawtooth', 'triangle'
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(1, audioContext.currentTime + 0.01);
    gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + duration);

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
}
