import skinView from "./skinview.js";
import { capeNames } from "./capes.js";

const btnSearch = document.querySelector('#search');
const nameUser = document.querySelector('#nameUser');
const btnUUID = document.querySelector('#uuid');
const skinRender = document.querySelector('#skin');
const headRender = document.querySelector('#head');
const avatarRender = document.querySelector('#avatar');
const playerName = document.querySelector('#playerName');
const btnSkin = document.querySelector('#btnSkin');
const btnApply = document.querySelector('#btnApply');
const url = document.querySelector('#url')
const tooltipCopy = document.querySelectorAll('#tooltipCopy')
const wrapper_cape = document.querySelector('#wrapper_cape')

// initial skin
skinView('http://textures.minecraft.net/texture/4ceb7ffc87d2859c7eea8c7aec7bf0265fd866876c1c820ed22cb38dafedee55')

// set current url
url.innerHTML = window.location.href

// data to html
const data_DOM = (playerInfo) => {

  if(playerInfo === undefined) return

  const {profileId, profileName, textures} = playerInfo;

  const skin = textures.SKIN.url
  const hash = skin.split('/')[skin.split('/').length - 1]

  if(textures.CAPE?.url !== undefined) {
    const cape = textures.CAPE.url
    const hashCape = cape.split('/')[cape.split('/').length - 1]
    const nameCapePlayer = capeNames[hashCape]

    wrapper_cape.innerHTML = `
      <div class="min-w-[78px] max-w-[78px] h-[125px] rounded-md overflow-hidden">
        <img class="min-w-[500px] relative -top-2 -left-2 cape-image" src="${textures.CAPE.url}" alt="" >
      </div>
      <h2 class="text-gray-200 text-xl font-semibold mb-2 text-center md:text-left">${nameCapePlayer} Cape</h2>
    `
  } else {
    wrapper_cape.innerHTML = `
      <h2 class="text-gray-400 text-2xl font-semibold text-center md:text-left">No Cape</h2>
    `
  }

  btnUUID.innerText = addDashesToUUID(profileId)
  playerName.innerText = profileName;

  // set image  renders
  avatarRender.src = `https://mc-heads.net/avatar/${hash}/120`;
  headRender.src = `https://mc-heads.net/head/${hash}/200`;
  skinRender.src = `https://mc-heads.net/body/${hash}/200`;
  
  btnApply.href = `https://www.minecraft.net/profile/skin/remote?url=${skin}`
  changeFavicon(`https://mc-heads.net/avatar/${hash}/16`)
  btnSkin.dataset.url = skin;
  skinView(skin)
}

const copyToClipboard = (e) => {
  const text = e.target.innerText;
  const input = document.createElement('input');
  input.value = text;
  document.body.appendChild(input);
  input.select();
  document.execCommand('copy');
  document.body.removeChild(input);
}

const changeFavicon = (src) => {
  var link = document.getElementById("favicon");
  link.href = src;
}

// download image
const downloadImage = async (e) => {
  const url = e.target.dataset.url
  const hash = url.split('/')[url.split('/').length - 1]
  const imageSrc = `https://mc-api.poke.dev/texture/${hash}`
  const image = await fetch(imageSrc)
  const imageBlog = await image.blob()
  const imageURL = URL.createObjectURL(imageBlog)

  const link = document.createElement('a')
  link.href = imageURL
  link.download = `${playerName.innerText}-minecraft-skin`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const getID = async (username) => {
  let id = await fetch(`https://playerdb.co/api/player/minecraft/${username}`)
    .then(response => response.json())
    .then(data => {
      return data.data.player.raw_id
    })
    .catch(() => {
      errorFetch()
    })
  return id
}

// player not found
const errorFetch = () => {
  const wrapperInput = document.querySelector('#wrapper-input');
  const error = document.createElement('p');

  error.innerText = 'Player not found';
  error.classList.add('order-first', 'absolute', 'w-full','text-center', 'py-3', 'text-xl', 'font-bold', 'text-amber-800','bg-amber-400', '-bottom-16', 'rounded-md');

  wrapperInput.appendChild(error);
  
  setTimeout(() => {
    wrapperInput.removeChild(error);
  }
  , 2500);
}

const addDashesToUUID = (uuid) => {
  return uuid.slice(0, 8) + '-' + uuid.slice(8, 12) + '-' + uuid.slice(12, 16) + '-' + uuid.slice(16, 20) + '-' + uuid.slice(20);
}

// events
btnUUID.addEventListener('click', e => {
  copyToClipboard(e)
  tooltipCopy[0].innerText = 'Copied'
  setTimeout(()=> {
    tooltipCopy[0].innerText = 'Copy'
  }, 1000)
})
url.addEventListener('click', e => {
  copyToClipboard(e)
  tooltipCopy[1].innerText = 'Copied'
  setTimeout(() => {
    tooltipCopy[1].innerText = 'Copy'
  }, 1000)
})
btnSkin.addEventListener('click', e => downloadImage(e))
btnSearch.addEventListener('click', async (e) => {
  e.preventDefault()
  if(nameUser.value.length < 2 && nameUser.value.length > 16) return
  const id = await getID(nameUser.value)
  fetch(`https://api.minetools.eu/profile/${id}`)
    .then(response => response.json())
    .then(data => {
      data_DOM(data.decoded)
    })
})

const initApp = async (username) => {
  const id = await getID(username)
  fetch(`https://api.minetools.eu/profile/${id}`)
    .then(response => response.json())
    .then(data => {
      data_DOM(data.decoded)
    })
    .catch((error) => {
    })
}

// set default player
initApp('eduardorl')