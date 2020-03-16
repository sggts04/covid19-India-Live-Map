let myMap;
let canvas;
let stats;
let coords;
const mappa = new Mappa('Leaflet');

// Lets put all our map options in a single object
const options = {
    lat: 22,
    lng: 82,
    zoom: 5,
    style: "http://{s}.tile.osm.org/{z}/{x}/{y}.png"
}

function preload() {
    fetch('https://exec.clay.run/kunksed/mohfw-covid')
        .then(
            function (response) {
                if (response.status !== 200) {
                    console.log('Looks like there was a problem. Status Code: ' +
                        response.status);
                    return;
                }

                // Examine the text in the response
                response.json().then(function (data) {
                    stats = data;
                    console.log(data);
                });
            }
        )
        .catch(function (err) {
            console.log('Fetch Error :-S', err);
        });
    coords = loadJSON("coords.json");
}

function setup() {
    canvas = createCanvas(windowWidth, windowHeight);

    myMap = mappa.tileMap(options);
    myMap.overlay(canvas);
    console.log(coords);
}

function draw() {
    clear();
    if(stats) {
        for(let st in coords) {
            let cState = coords[st];
            let stateName = cState.stateN;
            let sState = stats.stateData[stateName];
            if(sState) {
                let cases = sState.cases;
                let diameter = map(cases, 0, 50, 0, 8) * pow(2, myMap.zoom());
                const pix = myMap.latLngToPixel(cState.latitude, cState.longitude);

                var d = dist(mouseX, mouseY, pix.x, pix.y);
                if (d < (diameter/2)) {
                    fill(237, 138, 24, 200);
                } else {
                    fill(200, 100, 100, 100);
                }
                ellipse(pix.x, pix.y, diameter, diameter);
            }
        }
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}