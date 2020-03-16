let myMap;
let canvas;
let stats;
let coords;
let msg = "Loading...";
const mappa = new Mappa('Leaflet');

// Lets put all our map options in a single object
const options = {
    lat: 22,
    lng: 82,
    zoom: 5,
    style: "http://{s}.tile.osm.org/{z}/{x}/{y}.png"
}

// Preload API Response
function preload() {
    fetch('https://exec.clay.run/kunksed/mohfw-covid')
        .then(
            function (response) {
                if (response.status !== 200) {
                    console.log('Looks like there was a problem. Status Code: ' +
                        response.status);
                    alert("Something went wrong, please try after some time.");
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
            alert("Something went wrong, please try after some time.");
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
        // Iterate over states
        for(let st in coords) {
            let cState = coords[st];
            let stateName = cState.stateN;
            let sState = stats.stateData[stateName];
            if(sState) {
                // Display only if it is present in API Response
                let cases = sState.cases;
                let cured = sState.cured_discharged;
                let deaths = sState.deaths;
                let diameter = map(cases, 0, 50, 0, 8) * pow(2, myMap.zoom());
                const pix = myMap.latLngToPixel(cState.latitude, cState.longitude);
                // Check for mouse hover
                var d = dist(mouseX, mouseY, pix.x, pix.y);
                if (d < (diameter/2)) {
                    // State is hovered
                    fill(237, 138, 24, 200);
                    ellipse(pix.x, pix.y, diameter, diameter);
                    fill(0, 0, 0, 255);
                    textAlign(CENTER);
                    textSize(diameter*0.13);
                    text(stateName, pix.x , pix.y - diameter*0.16);
                    textSize(diameter*0.1);
                    text("Cases: "+cases, pix.x , pix.y - diameter*0.02);
                    text("Cured: "+cured, pix.x , pix.y + diameter*0.08);
                    text("Deaths: "+deaths, pix.x , pix.y + diameter*0.18);
                } else {
                    //State isn't hovered
                    fill(200, 100, 100, 100);
                    ellipse(pix.x, pix.y, diameter, diameter);
                }
            }
        }

        textAlign(RIGHT, TOP);
        textSize(windowWidth/100 + windowHeight/100);

        fill(255, 255, 255, 255);
        rect(windowWidth-windowWidth/200-textWidth("Total Cured Cases: " + stats.countryData.cured_dischargedTotal), 0, windowWidth, 5*textSize() + windowWidth/400);

        fill(0, 0, 0, 255);
        textStyle(BOLD);
        text("India", windowWidth-windowWidth/400, windowWidth/400);
        textStyle(NORMAL);
        text("Total Cases: " + stats.countryData.total, windowWidth-windowWidth/400, textSize() + windowWidth/400);
        text("Total Cured Cases: " + stats.countryData.cured_dischargedTotal, windowWidth-windowWidth/400, 2*textSize() + windowWidth/400);
        text("Total Deaths: " + stats.countryData.deathsTotal, windowWidth-windowWidth/400, 3*textSize() + windowWidth/400);
        text("Source: mohfw.gov.in", windowWidth-windowWidth/400, 4*textSize() + windowWidth/400);
    } else {
        // If data isn't loaded yet
        fill(0, 0, 0);
        textAlign(CENTER);
        textSize(windowWidth/10);
        text("Loading...", windowWidth/2, windowHeight/2);
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}