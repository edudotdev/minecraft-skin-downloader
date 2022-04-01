
const nameUser = document.querySelector('#nameUser');
const search = document.querySelector('#search');
const uuidText = document.querySelector('.uuid');
const caja = document.querySelector('.skin')
const skin = document.createElement('img')

const error = document.querySelector('.error');

const btnSkin = document.querySelector('.btnSkin');
const btnCape = document.querySelector('.btnCape');

search.addEventListener('click', (e) => {
  e.preventDefault()
  
  fetch(`https://playerdb.co/api/player/minecraft/${nameUser.value}`)
    .then(response => response.json())
    .then(data => {
      const uuid = data.data.player.raw_id;
      skin.src = `https://crafatar.com/renders/body/${uuid}`
      uuidText.innerHTML = `<p>UUID: ${uuid}</p>`
      const cape = `https://crafatar.com/capes/${uuid}`
      showSkin(`https://crafatar.com/skins/${uuid}`, cape)
      btnSkin.href = `https://crafatar.com/skins/${uuid}`
      btnCape.href = `https://crafatar.com/capes/${uuid}`
    })
    .catch(() => {
      error.innerHTML = `<p>${nameUser.value} dont exist</p>`
      setTimeout (() => {
        error.innerHTML = ''
      }
      , 2000)
    })
  caja.appendChild(skin);
})

async function showSkin(skin, cape) {
  const skinViewer = new skinview3d.FXAASkinViewer({
      width: 200,
      height: 600,
      renderPaused: false
  });
  skinViewer.camera.rotation.x = -0.620;
  skinViewer.camera.rotation.y = 0.534;
  skinViewer.camera.rotation.z = 0.348;
  skinViewer.camera.position.x = 32.5;
  skinViewer.camera.position.y = 30.0;
  skinViewer.camera.position.z = 45.0;

  await Promise.all([
      skinViewer.loadSkin(skin),
      skinViewer.loadCape(cape)
      .then(() => {
        console.log('cape loaded');
        btnCape.classList.remove('hidden')
      })
      .catch(() => {
        console.log('cape not loaded');
        btnCape.classList.add('hidden')
      })
  ]);
  skinViewer.render();
  const image = skinViewer.canvas.toDataURL();

  const imgElement = document.createElement("img");
  imgElement.src = image;
  imgElement.width = skinViewer.width;
  imgElement.height = skinViewer.height;
  while (document.getElementById("rendered_imgs").firstChild) {
    document.getElementById("rendered_imgs").removeChild(document.getElementById("rendered_imgs").firstChild);
  }
  imgElement.style = 'filter: brightness(120%);'
  document.getElementById("rendered_imgs").appendChild(imgElement)
 
  skinViewer.dispose();
};

