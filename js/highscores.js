let results = [];
if (document.cookie !== '') {
  let text = document.cookie.split(' ');
  text = text.sort();
  text.forEach((el, index) => {
    if (el.endsWith(';')) {
      text[index] = el.substr(0, el.length - 1);
    }
  });
  text.forEach(el => {
    let temp = el.split('=');
    temp = temp.splice(1);
    if (temp.length > 1) {
      temp.forEach((a, b) => {
        if (temp[b + 1]) {
          temp[b] = a.concat('=', temp[b + 1]);
          temp.splice(b + 1, 1);
        }
      });
    }
    results.push(temp);
  });
  results.forEach((el, index) => {
    results[index] = el[0].split(',');
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
  results.forEach(el => {
    el[0].forEach((a, b) => {
      el[0][b] = decodeURI(a);
      el[0][b] = el[0][b].replace(/%2c/g, ',');
      el[0][b] = el[0][b].replace(/%3a/g, ':');
    });
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

results.forEach((el, index) => {
  const table = document.getElementById(`${index + 3}`);
  const tr = document.createElement('tr');
  const td = document.createElement('td');
  td.innerText = `${index + 3}x${index + 3}`;
  td.setAttribute('colspan', '2');
  tr.appendChild(td);
  table.appendChild(tr);
  for (let i = 0; i < el[0].length; i++) {
    const tr = document.createElement('tr');
    const player = document.createElement('td');
    const time = document.createElement('td');
    player.innerText = el[0][i];
    time.innerText = el[1][i];
    tr.appendChild(player);
    tr.appendChild(time);
    table.appendChild(tr);
  }
});
