const cells = [];
const width = 35;
const height = 25;
const ALIVE = "alive";
const DEAD = "dead";
let playTimer;
let playing = false;

function setUpBoard() {
  for (let i = 0; i < height; i++) {
    const row = [];
    cells.push(row);
    const rowDiv = document.createElement("div");
    rowDiv.classList.add("row");
    document.body.appendChild(rowDiv);
    for (let j = 0; j < width; j++) {
      const cell = document.createElement("div");
      rowDiv.appendChild(cell);
      row.push(cell);
      cell.classList.add("cell");
      cell.classList.add(DEAD);
      cell.addEventListener("click", () => {
        if (cell.classList.contains(ALIVE)) {
          cell.classList.remove(ALIVE);
          cell.classList.add(DEAD);
        } else {
          cell.classList.remove(DEAD);
          cell.classList.add(ALIVE);
        }
      })
    }
  }
}

function renderTogglePlayButton() {
  const buttonArea = document.createElement("div");
  buttonArea.classList.add("row");
  document.body.appendChild(buttonArea);
  
  const playButton = document.createElement("button");
  buttonArea.appendChild(playButton);
  playButton.addEventListener("click", () => {
    playButton.innerText = playing ? "play" : "pause";
    playing ? pause() : play();
  });
  playButton.innerText = "play";
}

function stepForward() {
  const nextState = [];
  for (let i = 0; i < height; i++) {
    nextState.push([]);
    for (let j = 0; j < width; j++) {
      let livingOrDead;
      if (cells[i][j].classList.contains(DEAD) && neighborhoodCount(i, j) === 3) livingOrDead = ALIVE;
      else if (cells[i][j].classList.contains(ALIVE) && ![2,3].includes(neighborhoodCount(i, j))) livingOrDead = DEAD;
      else livingOrDead = cells[i][j].classList.contains(ALIVE) ? ALIVE : DEAD;
      nextState[i].push(livingOrDead)
    }
  }

  nextState.forEach((_, i) => _.forEach((livingOrDead, j) => {
    cells[i][j].classList.remove(ALIVE);
    cells[i][j].classList.remove(DEAD);
    cells[i][j].classList.add(livingOrDead);
  }));
}

function neighborhoodCount(I, J) {
  let count = 0;
  for (let i = Math.max(0, I - 1); i <= Math.min(I+1, height-1); i++) {
    for (let j = Math.max(0, J - 1); j <= Math.min(J+1, width-1); j++) {
      if ((i !== I || j !== J) && cells[i][j].classList.contains(ALIVE)) count++;
    }
  }
  return count;
}

function play() {
  if (!playing) {
    playing = true;
    stepForward();
    playTimer = setTimeout(() => {
      playing = false;
      play();
    }, 500);
  }
}

function pause() {
  if (playing) {
    clearTimeout(playTimer);
    playing = !playing;
  }
}

setUpBoard();
renderTogglePlayButton();