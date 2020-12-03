let tilesTable = [];
let currentImageName = 'cat.jpg';

const board = document.createElement('div');
board.id = 'board';

//slider
const imageChoice = document.createElement('div');
const img = document.createElement('img');
const arrowLeft = document.createElement('i');
const arrowRight = document.createElement('i');
let whichPhoto = 1;
imageChoice.id = 'image-choice';
img.src = './cat.jpg';
img.style.width = '170px';
img.style.height = '170px';
arrowLeft.onclick = function () {
  if (whichPhoto === 1) {
    whichPhoto = 3;
  } else {
    whichPhoto--;
  }
  switch (whichPhoto) {
    case 1:
      img.src = './cat.jpg';
      currentImageName = 'cat.jpg';
      break;
    case 2:
      img.src = './mobbyn.png';
      currentImageName = 'mobbyn.png';
      break;
    case 3:
      img.src = './graffiti.jpg';
      currentImageName = 'graffiti.jpg';
      break;
  }
};
arrowRight.onclick = function () {
  if (whichPhoto === 3) {
    whichPhoto = 1;
  } else {
    whichPhoto++;
  }
  switch (whichPhoto) {
    case 1:
      img.src = './cat.jpg';
      currentImageName = 'cat.jpg';
      break;
    case 2:
      img.src = './mobbyn.png';
      currentImageName = 'mobbyn.png';
      break;
    case 3:
      img.src = './graffiti.jpg';
      currentImageName = 'graffiti.jpg';
      break;
  }
};
arrowLeft.classList.add('fa');
arrowLeft.classList.add('fa-angle-left');
arrowLeft.classList.add('fa-5x');
arrowRight.classList.add('fa');
arrowRight.classList.add('fa-angle-right');
arrowRight.classList.add('fa-5x');
imageChoice.appendChild(arrowLeft);
imageChoice.appendChild(img);
imageChoice.appendChild(arrowRight);

//przyciski z wymiarami
const buttons = document.createElement('div');
buttons.id = 'buttons';
for (let i = 3; i < 7; i++) {
  const button = document.createElement('button');
  button.classList.add('button');
  button.innerText = `${i}x${i}`;
  button.onclick = function () {
    tilesTable = [];
    board.innerHTML = '';
    divideImage(i, currentImageName);
    shuffle(i);
  };
  buttons.appendChild(button);
}

//dzielenie obrazka
function divideImage(size, imageName) {
  for (let i = 0; i < size + 2; i++) {
    let row = [];
    for (let j = 0; j < size + 2; j++) {
      if (i == size && j == size) row.push(0);
      else row.push(1);
    }
    tilesTable.push(row);
  }
  const tileDimensions = 360 / size;
  let counter = 1;
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (i == size - 1 && j == size - 1) {
      } else {
        const tile = document.createElement('div');
        tile.classList.add('tile');
        tile.style.height = `${tileDimensions}px`;
        tile.style.width = `${tileDimensions}px`;
        tile.style.backgroundImage = `url('${imageName}')`;
        tile.style.backgroundPositionX = `-${j * tileDimensions}px`;
        tile.style.backgroundPositionY = `-${i * tileDimensions}px`;
        tile.style.left = `${j * tileDimensions}px`;
        tile.style.top = `${i * tileDimensions}px`;
        tile.onclick = function () {
          let imgLeft = parseInt(this.style.left);
          let imgTop = parseInt(this.style.top);
          let row = imgTop / (360 / size) + 1;
          let column = imgLeft / (360 / size) + 1;
          if (tilesTable[row - 1][column] === 0) {
            tilesTable[row - 1][column] = 1;
            tilesTable[row][column] = 0;
            this.style.top = `${imgTop - 360 / size}px`;
          } else if (tilesTable[row + 1][column] === 0) {
            tilesTable[row + 1][column] = 1;
            tilesTable[row][column] = 0;
            this.style.top = `${imgTop + 360 / size}px`;
          } else if (tilesTable[row][column - 1] === 0) {
            tilesTable[row][column - 1] = 1;
            tilesTable[row][column] = 0;
            this.style.left = `${imgLeft - 360 / size}px`;
          } else if (tilesTable[row][column + 1] === 0) {
            tilesTable[row][column + 1] = 1;
            tilesTable[row][column] = 0;
            this.style.left = `${imgLeft + 360 / size}px`;
          }
        };
        tile.id = counter;
        counter++;
        board.appendChild(tile);
      }
    }
  }
}

document.body.appendChild(imageChoice);
document.body.appendChild(buttons);
document.body.appendChild(board);

let wasMoved = false;
let prevDirection = undefined;

//mieszanie puzzli
function shuffle(size) {
  function moveTile(size) {
    let tile = Math.ceil(Math.random() * size * size);
    while (size === 3 && tile === 9) {
      tile = Math.ceil(Math.random() * size * size);
    }
    while (size === 4 && tile === 16) {
      tile = Math.ceil(Math.random() * size * size);
    }
    while (size === 5 && tile === 25) {
      tile = Math.ceil(Math.random() * size * size);
    }
    while (size === 6 && tile === 36) {
      tile = Math.ceil(Math.random() * size * size);
    }
    const img = document.getElementById(`${tile}`);
    let imgTop = parseInt(img.style.top);
    let imgLeft = parseInt(img.style.left);
    let row = imgTop / (360 / size) + 1;
    let column = imgLeft / (360 / size) + 1;
    if (tilesTable[row - 1][column] === 0 && prevDirection !== 'down') {
      tilesTable[row - 1][column] = 1;
      tilesTable[row][column] = 0;
      prevDirection = 'up';
      img.style.top = `${imgTop - 360 / size}px`;
      wasMoved = true;
    } else if (tilesTable[row + 1][column] === 0 && prevDirection !== 'up') {
      tilesTable[row + 1][column] = 1;
      tilesTable[row][column] = 0;
      prevDirection = 'down';
      img.style.top = `${imgTop + 360 / size}px`;
      wasMoved = true;
    } else if (tilesTable[row][column - 1] === 0 && prevDirection !== 'right') {
      tilesTable[row][column - 1] = 1;
      tilesTable[row][column] = 0;
      prevDirection = 'left';
      img.style.left = `${imgLeft - 360 / size}px`;
      wasMoved = true;
    } else if (tilesTable[row][column + 1] === 0 && prevDirection !== 'left') {
      tilesTable[row][column + 1] = 1;
      tilesTable[row][column] = 0;
      prevDirection = 'right';
      img.style.left = `${imgLeft + 360 / size}px`;
      wasMoved = true;
    } else wasMoved = false;
  }

  let counter = 0;
  while (counter < 100) {
    moveTile(size);
    if (wasMoved) counter++;
  }
}
