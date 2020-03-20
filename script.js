let myMap;
let canvas;
let stats;
let coords;
let maxCases = 50;
let font;
let fontBold;
let msg = "Loading...";
let linkColor = "white";
const mappa = new Mappa('Leaflet');

const options = {
    lat: 22,
    lng: 82,
    zoom: 5,
    style: "http://{s}.tile.osm.org/{z}/{x}/{y}.png"
}

// Preload API Response
function preload() {
    font = loadFont('fonts/OpenSans.ttf');
    fontBold = loadFont('fonts/OpenSans-Bold.ttf');
    fetch('https://covid19sggts04.herokuapp.com/')
        .then(
            function (response) {
                if (response.status !== 200) {
                    console.log('Looks like there was a problem. Status Code: ' +
                        response.status);
                    alert("Something went wrong, please try after some time.");
                    return;
                }

                // Save API Response
                response.json().then(function (data) {
                    stats = data;
                    if(!data.stateData) {
                        alert("The API Response seems to be broken. Please alert me on twitter @sggts04 or try again after some time.");
                    }
                    console.log(data);
                    let maxC = 0;
                    for(let key in stats.stateData) {
                        if(stats.stateData[key].cases > maxC) {
                            maxC = stats.stateData[key].cases;
                        }
                    }
                    maxCases = maxC;
                    console.log(maxCases);
                });
            }
        )
        .catch(function (err) {
            console.log('Fetch Error :-S', err);
            alert("Something went wrong, please try after some time.");
        });
    // Load coordinates of each State/UT
    coords = loadJSON("data/coords.json");
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
                let diameter = map(cases, 0, maxCases, 0, 6) * pow(2, myMap.zoom());
                const pix = myMap.latLngToPixel(cState.latitude, cState.longitude);
                // Check for mouse hover
                var d = dist(mouseX, mouseY, pix.x, pix.y);
                if (d < (diameter/2)) {
                    // State is hovered
                    textFont(font);
                    fill(237, 138, 24, 200);
                    ellipse(pix.x, pix.y, diameter, diameter);
                    fill(0, 0, 0, 255);
                    textAlign(CENTER);
                    textSize(diameter*0.13);
                    text(stateName, pix.x , pix.y - diameter*0.24);
                    textSize(diameter*0.1);
                    text("Cases: "+cases, pix.x , pix.y - diameter*0.1);
                    text("Discharged: "+cured, pix.x , pix.y);
                    text("Deaths: "+deaths, pix.x , pix.y + diameter*0.1);
                } else {
                    //State isn't hovered
                    fill(200, 100, 100, 100);
                    ellipse(pix.x, pix.y, diameter, diameter);
                }
            }
        }

        // Country Stats in Top Right
        textFont(font);
        textAlign(RIGHT, TOP);
        textSize(windowWidth/100 + windowHeight/100);

        //Draw the white rectangle
        fill(255, 255, 255, 255);
        rect(windowWidth-windowWidth/150-textWidth("Total Discharged Cases: " + stats.countryData.cured_dischargedTotal), 0, windowWidth, 4*textSize() + windowWidth/150);

        // Write the stats
        fill(0, 0, 0, 255);
        textFont(fontBold);
        textSize(windowWidth/80 + windowHeight/80);
        text("India", windowWidth-windowWidth/300, 0 - windowWidth/300);
        textFont(font);
        textSize(windowWidth/100 + windowHeight/100);
        text("Total Cases: " + stats.countryData.total, windowWidth-windowWidth/300, textSize());
        text("Total Discharged Cases: " + stats.countryData.cured_dischargedTotal, windowWidth-windowWidth/300, 2*textSize());
        text("Total Deaths: " + stats.countryData.deathsTotal, windowWidth-windowWidth/300, 3*textSize());

        // Links in bottom right
        textSize(windowWidth/120 + windowHeight/120);
        // Colour change on hover
        if(linkColor === "white")
            fill(255, 255, 255, 255);
        else
            fill(123, 119, 237, 255);
        rect(windowWidth-windowWidth/90-textWidth("Github: sggts04/covid19-India-Live-Map"), windowHeight - 2*textSize() - windowWidth/60, windowWidth, windowHeight);
        fill(0, 0, 0, 255);
        text("Source: mohfw.gov.in", windowWidth-windowWidth/190, windowHeight - 2*textSize() - windowWidth/90);
        text("Github: sggts04/covid19-India-Live-Map", windowWidth-windowWidth/200, windowHeight - textSize() - windowWidth/100);
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

function mousePressed() {
    if(mouseX>=(windowWidth-windowWidth/90-textWidth("Github: sggts04/covid19-India-Live-Map")) && mouseX<=(windowWidth) && mouseY>=(windowHeight - 2*textSize() - windowWidth/60) && mouseY<=windowHeight) {
        window.open('https://github.com/sggts04/covid19-India-Live-Map', '_blank');
    }
}

function mouseMoved() {
    if(mouseX>=(windowWidth-windowWidth/90-textWidth("Github: sggts04/covid19-India-Live-Map")) && mouseX<=(windowWidth) && mouseY>=(windowHeight - 2*textSize() - windowWidth/60) && mouseY<=windowHeight) {
        linkColor = "blue";
    }
    else {
        linkColor = "white";
    }
}