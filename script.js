let myMap;
let canvas;
const mappa = new Mappa('Leaflet');

// Lets put all our map options in a single object
const options = {
    lat: 20.5937,
    lng: 78.9629,
    zoom: 5,
    style: "http://{s}.tile.osm.org/{z}/{x}/{y}.png"
}

function setup() {
    canvas = createCanvas(windowWidth, windowHeight);

    myMap = mappa.tileMap(options);
    myMap.overlay(canvas);
}

function draw() {

}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}