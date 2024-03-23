AFRAME.registerComponent('foo', {
    events: {
        click: function (evt) {
            // grab the current position
            let pos = this.el.getAttribute("position");
            // move upwards
            this.el.setAttribute('position', { x: pos.x, y: pos.y + 0.50, z: pos.z });
        }
    }
});
var model = null;
var animate;
function init() {
    model = document.getElementById('glbmodel');
    model.style.position =document.getElementById('glbmodel').getAttribute("position");
    model.style.left = '0px';
    console.log("SSSSSSs");
}
function leftbtnclick() {


    let pos = document.getElementById('glbmodel').getAttribute("position");
    document.getElementById('glbmodel').setAttribute('position', { x: pos.x + -0.25, y: pos.y, z: pos.z });
    // move upwards


}
function rightbtnclick() {
    let pos = document.getElementById('glbmodel').getAttribute("position");
    document.getElementById('glbmodel').setAttribute('position', { x: pos.x + 0.25, y: pos.y, z: pos.z });
}
function moveright() {


    model.style.left = parseInt(model.style.left) + 10 + 'px'
    animate = setTimeout(moveright, 30);
    console.log("RRRRRRRR");



}
window.onload = init;

