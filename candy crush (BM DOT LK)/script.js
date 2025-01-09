const width = 8;
const grid = [];
const candyColors = [
  'candy-1',
  'candy-2',
  'candy-3',
  'candy-4'
];

let score = 0;
const gameContainer = document.getElementById('game-container');
const scoreDisplay = document.getElementById('score');

function createBoard() {
  for (let i = 0; i < width * width; i++) {
    const square = document.createElement('div');
    square.setAttribute('draggable', true);
    square.setAttribute('id', i);
    let randomColor = candyColors[Math.floor(Math.random() * candyColors.length)];
    square.className = `candy ${randomColor}`;
    grid.push(square);
    gameContainer.appendChild(square);
  }
  checkForMatches(); // Check for matches on initial board setup
}

createBoard();

// Dragging functionality
let colorBeingDragged, colorBeingReplaced, squareIdBeingDragged, squareIdBeingReplaced;

grid.forEach(square => square.addEventListener('dragstart', dragStart));
grid.forEach(square => square.addEventListener('dragend', dragEnd));
grid.forEach(square => square.addEventListener('dragover', dragOver));
grid.forEach(square => square.addEventListener('dragenter', dragEnter));
grid.forEach(square => square.addEventListener('dragleave', dragLeave));
grid.forEach(square => square.addEventListener('drop', dragDrop));

function dragStart() {
  colorBeingDragged = this.className;
  squareIdBeingDragged = parseInt(this.id);
}

function dragOver(e) {
  e.preventDefault();
}

function dragEnter(e) {
  e.preventDefault();
}

function dragLeave() {}

function dragDrop() {
  colorBeingReplaced = this.className;
  squareIdBeingReplaced = parseInt(this.id);
  this.className = colorBeingDragged;
  grid[squareIdBeingDragged].className = colorBeingReplaced;
}

function dragEnd() {
  const validMoves = [
    squareIdBeingDragged - 1,
    squareIdBeingDragged - width,
    squareIdBeingDragged + 1,
    squareIdBeingDragged + width
  ];

  const validMove = validMoves.includes(squareIdBeingReplaced);

  if (squareIdBeingReplaced && validMove) {
    squareIdBeingReplaced = null;
    checkForMatches();
  } else {
    grid[squareIdBeingReplaced].className = colorBeingReplaced;
    grid[squareIdBeingDragged].className = colorBeingDragged;
  }
}

// Match checking
function checkForMatches() {
  checkRowForThree();
  checkColumnForThree();
  refillGrid();
}

function checkRowForThree() {
  for (let i = 0; i < 64; i++) {
    const rowOfThree = [i, i + 1, i + 2];
    const decidedColor = grid[i].className;
    const notValid = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 62, 63];
    if (notValid.includes(i)) continue;

    if (rowOfThree.every(index => grid[index].className === decidedColor && !grid[index].className.includes('blank'))) {
      score += 10;
      scoreDisplay.textContent = score;
      rowOfThree.forEach(index => grid[index].className = 'blank');
    }
  }
}

function checkColumnForThree() {
  for (let i = 0; i < 47; i++) {
    const columnOfThree = [i, i + width, i + width * 2];
    const decidedColor = grid[i].className;

    if (columnOfThree.every(index => grid[index].className === decidedColor && !grid[index].className.includes('blank'))) {
      score += 10;
      scoreDisplay.textContent = score;
      columnOfThree.forEach(index => grid[index].className = 'blank');
    }
  }
}

function refillGrid() {
  for (let i = 0; i < 64; i++) {
    if (grid[i].className.includes('blank')) {
      if (i >= width) {
        grid[i].className = grid[i - width].className;
        grid[i - width].className = 'blank';
      } else {
        grid[i].className = `candy ${candyColors[Math.floor(Math.random() * candyColors.length)]}`;
      }
    }
  }

  // Re-check for new matches after refilling
  setTimeout(() => {
    checkForMatches();
  }, 200);
}

// Automatically check matches periodically
setInterval(() => {
  checkForMatches();
}, 100);
