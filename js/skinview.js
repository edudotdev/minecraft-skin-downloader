export default function skinView (skin) {

let skinViewer = new skinview3d.SkinViewer({
  canvas: document.getElementById("skin_container"),
  width: 320,
  height: 600,
  skin: skin,
});

skinViewer.fov = 70;
skinViewer.zoom = .9;

skinViewer.animations.add(skinview3d.WalkingAnimation);

let control = skinview3d.createOrbitControls(skinViewer);
control.enableRotate = true;
control.enableZoom = false;
control.enablePan = false;
}