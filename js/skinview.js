export default function skinView (skin) {

let skinViewer = new skinview3d.SkinViewer({
  canvas: document.getElementById("skin_container"),
  width: 280,
  height: 550,
  skin: skin,
});

initializePosition()
initializeControls()

skinViewer.animations.add(skinview3d.WalkingAnimation);

let control = skinview3d.createOrbitControls(skinViewer);
  control.enableRotate = true;
  control.enableZoom = false;
  control.enablePan = false;
  skinViewer.autoRotate = true;

  function initializeControls() {
    document.getElementById("animation_pause_resume").addEventListener("click", () => skinViewer.animations.paused = !skinViewer.animations.paused);
  }

  function initializePosition() {
    skinViewer.fov = 30;
    skinViewer.zoom = .9;
    skinViewer.camera.position.x = -20.5;
    skinViewer.camera.position.y = 0;

    setTimeout(() => {
      skinViewer.animations.paused = true;
    }, 100)
  }

}
