const cells = [];
const width = 100;
const height = 100;
const ALIVE = "alive";
const DEAD = "dead";
const BURNING = "burning";
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
          cell.classList.add(BURNING);
        } else if (cell.classList.contains(BURNING)){
          cell.classList.remove(BURNING);
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
      let next;
      if (cells[i][j].classList.contains(ALIVE) && neighborhoodCount(i,j,BURNING) > 0) next = BURNING;
      else if (cells[i][j].classList.contains(ALIVE) && Math.random() < .0002) next = BURNING;
      else if (cells[i][j].classList.contains(ALIVE)) next = ALIVE;
      else if (cells[i][j].classList.contains(DEAD) && Math.random() < .007) next = ALIVE;
      else if (cells[i][j].classList.contains(BURNING)) next = DEAD;
      else next = DEAD;
      nextState[i].push(next);
    }
  }

  nextState.forEach((_, i) => _.forEach((next, j) => {
    cells[i][j].classList.remove(ALIVE);
    cells[i][j].classList.remove(DEAD);
    cells[i][j].classList.remove(BURNING);
    cells[i][j].classList.add(next);
  }));
}

function neighborhoodCount(I, J, type) {
  let count = 0;
  for (let i = Math.max(0, I - 1); i <= Math.min(I+1, height-1); i++) {
    for (let j = Math.max(0, J - 1); j <= Math.min(J+1, width-1); j++) {
      if ((i !== I || j !== J) && cells[i][j].classList.contains(type)) count++;
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
    }, 75);
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