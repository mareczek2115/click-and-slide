const board = document.createElement('div');
board.id = 'board';

//przyciski z wymiarami
const buttons = document.createElement('div');
buttons.id = 'buttons';
for (let i = 3; i < 7; i++) {
  const button = document.createElement('button');
  button.classList.add('button');
  button.innerText = `${i}x${i}`;
  button.onclick = function () {
    board.innerHTML = '';
    divideImage(i);
  };
  buttons.appendChild(button);
}

//dzielenie obrazka
function divideImage(size) {
  const tileDimensions = 360 / size;
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (i == size - 1 && j == size - 1) {
      } else {
        const tile = document.createElement('div');
        tile.style.height = `${tileDimensions}px`;
        tile.style.width = `${tileDimensions}px`;
        tile.style.backgroundImage = "url('cat.jpg')";
        tile.style.backgroundPositionX = `-${j * tileDimensions}px`;
        tile.style.backgroundPositionY = `-${i * tileDimensions}px`;
        board.appendChild(tile);
      }
    }
  }
}

divideImage(3);
document.body.appendChild(buttons);
document.body.appendChild(board);
