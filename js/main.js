let tilesTable = [];

let currentImageName = 'cat.jpg';
let isShuffling = false;
let userWon = false;

const board = document.getElementById('board');

//zmienne do timera
let start = new Date();
let milliseconds = 0;
let seconds = 0;
let minutes = 0;
let hours = 0;
let t;

//cookies
let results = [];
let temp = [];
if (document.cookie !== '') {
  let text = document.cookie.split(' ').sort();
  text.forEach(el => {
    if (el.endsWith(';')) {
      el = el.substr(0, el.length - 1);
    }
    temp.push(el.split('=').pop());
  });
  temp.forEach(el => {
    results.push(el.split(','));
  });
  results.forEach(el => {
    el.push([], []);
    while (el.length !== 2) {
      if (el[0].includes(':')) {
        el[el.length - 1].push(el.shift());
      } else {
        el[el.length - 2].push(el.shift());
      }
    }
  });
  results.forEach(el => {
    if (el[0] == '') el[0].splice(0, 1);
  });
  let cookies = document.cookie.split(' ');
  cookies.forEach(el => {
    if (!el.endsWith(';')) el = el.concat(';');
    document.cookie = `${el} expires=${new Date(
      Date.now() + 1000 * 60 * 60 * 24 * 365
    )}; SameSite=None; Secure;`;
  });
} else {
  results = [
    [[], []],
    [[], []],
    [[], []],
    [[], []],
  ];
}

//DOM onclick events
const arrowLeft = document.getElementById('arrow-left');
let whichImage = 1;
arrowLeft.onclick = function () {
  if (whichImage === 1) {
    whichImage = 3;
  } else {
    whichImage--;
  }
  switch (whichImage) {
    case 1:
      currentImageName = 'cat.jpg';
      break;
    case 2:
      currentImageName = 'mobbyn.png';
      break;
    case 3:
      currentImageName = 'graffiti.jpg';
      break;
  }
  moveImage('backward', currentImageName);
};
const arrowRight = document.getElementById('arrow-right');
arrowRight.onclick = function () {
  if (whichImage === 3) {
    whichImage = 1;
  } else {
    whichImage++;
  }
  switch (whichImage) {
    case 1:
      currentImageName = 'cat.jpg';
      break;
    case 2:
      currentImageName = 'mobbyn.png';
      break;
    case 3:
      currentImageName = 'graffiti.jpg';
      break;
  }
  moveImage('forward', currentImageName);
};
const buttons = document.querySelectorAll('.button');
buttons.forEach(button => {
  button.onclick = function () {
    if (!isShuffling) {
      clearInterval(t);
      milliseconds = 0;
      seconds = 0;
      minutes = 0;
      hours = 0;
      userWon = false;
      shuffle(parseInt(button.dataset.size));
    }
  };
});

//dzielenie obrazka
function divideImage(size, imageName) {
  tilesTable = [];
  board.innerHTML = '';
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
        tile.style.backgroundImage = `url('img/${imageName}')`;
        tile.style.backgroundPositionX = `-${j * tileDimensions}px`;
        tile.style.backgroundPositionY = `-${i * tileDimensions}px`;
        tile.style.left = `${j * tileDimensions}px`;
        tile.style.top = `${i * tileDimensions}px`;
        tile.onclick = function () {
          if (!userWon) {
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
            if (tilesTable[size][size] === 0 && win(size)) {
              clearInterval(t);
              userWon = true;
              alert(
                `Ułożyłeś puzzle! Twój czas to ${hours}:${minutes}:${seconds}:${milliseconds}`
              );
              checkHighscore(size);
            }
          }
        };
        tile.id = counter;
        counter++;
        board.appendChild(tile);
      }
    }
  }
}

//mieszanie puzzli
function shuffle(size) {
  isShuffling = true;
  let wasMoved = false;
  let prevDirection = undefined;
  divideImage(size, currentImageName);
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
  let shuffling = setInterval(() => {
    moveTile(size);
    if (wasMoved) counter++;
    if (counter === 80) {
      isShuffling = false;
      clearInterval(shuffling);
      t = setInterval(() => {
        const timer = document.getElementById('timer');
        let now = new Date();
        milliseconds = now.getTime() - start.getTime();
        if (milliseconds >= 1000) {
          seconds++;
          start = new Date();
          now = new Date();
          milliseconds = now.getTime() - start.getTime();
        } else if (seconds >= 60) {
          minutes++;
          seconds = 0;
          start = new Date();
          now = new Date();
          milliseconds = now.getTime() - start.getTime();
        } else if (minutes >= 60) {
          hours++;
          minutes = 0;
          seconds = 0;
          start = new Date();
          now = new Date();
          milliseconds = now.getTime() - start.getTime();
        }
        let time = `${hours}:${minutes}:${seconds}:${milliseconds}`;
        timer.innerText = '';
        for (let i = 0; i < time.length; i++) {
          const img = document.createElement('img');
          if (time[i] === ':') img.src = 'https://mareczek2115.github.io/click-and-slide/img/colon.png';
          else img.src = `https://mareczek2115.github.io/click-and-slide/img/${time[i]}.png`
          timer.appendChild(img);
        }
        if (milliseconds < 10) {
          const lastChild = timer.lastChild;
          timer.removeChild(lastChild);
          const blank = document.createElement('img');
          blank.src = 'https://mareczek2115.github.io/click-and-slide/img/0.png';
          timer.appendChild(blank);
          timer.appendChild(blank);
          timer.appendChild(lastChild);
        } else if (milliseconds >= 10 && milliseconds < 100) {
          const lastChild = timer.lastChild;
          timer.removeChild(lastChild);
          const blank = document.createElement('img');
          blank.src = 'https://mareczek2115.github.io/click-and-slide/img/0.png';
          timer.appendChild(blank);
          timer.appendChild(lastChild);
        }
      }, 1);
    }
  }, 1);
}

//sprawdzenie czy puzzle są ułożone
function win(size) {
  let id = 1;
  let isOkay = [];
  for (let row = 0; row < size; row++) {
    for (let column = 0; column < size; column++) {
      if (id !== size * size) {
        const left = parseInt(document.getElementById(`${id}`).style.left);
        const top = parseInt(document.getElementById(`${id}`).style.top);
        if (left === (360 / size) * column && top === (360 / size) * row)
          isOkay.push(true);
        else isOkay.push(false);
      }
      id++;
    }
  }
  if (
    isOkay.every(element => {
      return element === true;
    })
  )
    return true;
  else return false;
}

//sprawdzenie czy user pobił jakiś rekord
function checkHighscore(size) {
  let wasPushed = false;
  let time = `${hours}:${minutes}:${seconds}:${milliseconds}`;
  let x =
    hours * 1000 * 60 * 60 +
    minutes * 1000 * 60 +
    seconds * 1000 +
    milliseconds;
  if (results[size - 3][1].length === 0) {
    results[size - 3][1].push(time);
    wasPushed = true;
  } else {
    results[size - 3][1].forEach((el, index) => {
      let a = el.split(':');
      let b =
        parseInt(a[0]) * 1000 * 60 * 60 +
        parseInt(a[1]) * 1000 * 60 +
        parseInt(a[2]) * 1000 +
        parseInt(a[3]);
      if (x < b && !wasPushed) {
        wasPushed = true;
        results[size - 3][1].splice(index, 0, time);
      }
    });
    if (!wasPushed) {
      results[size - 3][1].push(time);
      wasPushed = true;
    }
    if (results[size - 3][1].length > 10) {
      results[size - 3][1].splice(10, 1);
      wasPushed = false;
    }
  }
  if (wasPushed) {
    let username = prompt('Nowy rekord! Podaj swoje imię');
    let z = results[size - 3][1].indexOf(time);
    results[size - 3][0].splice(z, 0, username);
  }
  setNewCookies();
}

//cookie z nowym wynikiem
function setNewCookies() {
  results.forEach((el, index) => {
    let cookie = `TopResults${index + 3}x${index + 3}=`;
    for (let i = 0; i < el[0].length; i++) {
      if (el[0][i]) cookie = cookie + `${el[0][i]},`;
      cookie = cookie + `${el[1][i]},`;
    }
    if (cookie.endsWith(',')) cookie = cookie.substr(0, cookie.length - 1);
    cookie = cookie.concat(';');
    document.cookie = `${cookie} expires=${new Date(
      Date.now() + 1000 * 60 * 60 * 24 * 365
    )}; SameSite=None; Secure;`;
  });
}

//animacja obrazków
function moveImage(direction, imageName) {
  const imgBox = document.getElementById('img-box');
  const oldImg = document.getElementById('img');
  const newImg = document.createElement('div');
  newImg.style.position = 'absolute';
  newImg.style.width = '0px';
  newImg.style.height = '100%';
  newImg.style.backgroundImage = `url("img/${imageName}")`;
  newImg.style.backgroundSize = '170px';
  let bgPosX = 0;
  if (direction === 'forward') {
    newImg.style.right = '0px';
    imgBox.appendChild(newImg);
    let t = setInterval(() => {
      if (parseInt(newImg.style.width) == 170) {
        clearInterval(t);
        imgBox.removeChild(oldImg);
        newImg.id = 'img';
      } else {
        newImg.style.width = `${parseInt(newImg.style.width) + 10}px`;
        bgPosX = bgPosX - 10;
        oldImg.style.backgroundPositionX = `${bgPosX}px`;
      }
    }, 15);
  } else {
    newImg.style.left = '0px';
    newImg.style.backgroundPositionX = '-170px';
    imgBox.appendChild(newImg);
    let t = setInterval(() => {
      if (parseInt(newImg.style.width) == 170) {
        clearInterval(t);
        imgBox.removeChild(oldImg);
        newImg.id = 'img';
      } else {
        newImg.style.width = `${parseInt(newImg.style.width) + 10}px`;
        newImg.style.backgroundPositionX = `${
          parseInt(newImg.style.backgroundPositionX) + 10
        }px`;
        bgPosX = bgPosX + 10;
        oldImg.style.backgroundPositionX = `${bgPosX}px`;
      }
    }, 15);
  }
}
