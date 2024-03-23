/* global AFRAME */
var scene = document.querySelector('a-scene');
var model = document.getElementById('glbmodel');
var t = 0;
function render() {
  t += 0.0001;
  requestAnimationFrame(render);
  let pos = document.getElementById('glbmodel').getAttribute("position");
  let angle = document.getElementById('glbmodel').getAttribute("rotation");
  console.log(Math.sin(angle.y));
   

  targetPos = '.514';
  //console.log(pos);
  if (pos.x <= targetPos) {
    document.getElementById('glbmodel').setAttribute('position', { x: pos.x + (Math.sin(angle.y) *  t ), y: pos.y , z: pos.z + ( Math.cos(angle.y) * t) });
    //console.log("SSSSSSSSSS");
  }

}
