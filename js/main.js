import skinView from "./skinview.js";

const btnSearch = document.querySelector('#search');
const nameUser = document.querySelector('#nameUser');
const inputUUID = document.querySelector('#uuid');
const inputCommandHead = document.querySelector('#CommandHead');
const head = document.querySelector('#head');
const playerName = document.querySelector('#playerName');
const nameHistory = document.querySelector('#nameHistory');
const copy = document.querySelectorAll('#copy');
const btnSkin = document.querySelector('#btnSkin');

// initial skinView
skinView('../src/images/steve.png')

btnSearch.addEventListener('click', (e) => {
  e.preventDefault()

  if(nameUser.value.length <= 2)  return  

  fetch(`https://playerdb.co/api/player/minecraft/${nameUser.value}`)
  .then(response => response.json())
  .then(data => {
    data_DOM(data.data.player);
  })
  .catch(() => {
    errorFetch()
  })
})

copy.forEach(btn => { btn.addEventListener('click', e => copyToClipboard(e))})

// DOM data
const data_DOM = (data) => {
  const {raw_id, username, meta} = data;

  inputUUID.value = raw_id; 
  inputCommandHead.value = `/give @p minecraft:player_head{SkullOwner:"${username}"}`;
  head.src = `https://crafatar.com/renders/head/${raw_id}`;
  playerName.innerText = username;
  rendersNames(meta.name_history);
  const skin = `https://crafatar.com/skins/${raw_id}`
  btnSkin.href = skin;

  skinView(skin)
}

const rendersNames = (names) => {
  while (nameHistory.firstChild) {
    nameHistory.removeChild(nameHistory.firstChild);
  }
  names.map(name => {
    const li = document.createElement('li');
    li.innerText = name.name;
    document.querySelector('#nameHistory').appendChild(li);
  })
}

const copyToClipboard = (e) => {
  const text = e.target.previousElementSibling.value;
  const input = document.createElement('input');
  input.value = text;
  document.body.appendChild(input);
  input.select();
  document.execCommand('copy');
  document.body.removeChild(input);
}

const errorFetch = () => {
  const wrapperMain = document.querySelector('body main');
  const error = document.createElement('p');

  error.innerText = 'Player not found, search other player';
  error.classList.add('order-2', 'text-center', 'py-3', 'text-xl', 'font-bold', 'mc-error', 'bg-red-400');

  wrapperMain.appendChild(error);
  setTimeout(() => {
    wrapperMain.removeChild(error);
  }
  , 2500);
}
