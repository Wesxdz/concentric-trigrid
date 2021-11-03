import "./styles.css";

var c = document.getElementById("spookyCanvas");
c.width = window.innerWidth;
c.height = window.innerHeight;
var ctx = c.getContext("2d");

const pieSlices = 6; // fixed

// EDIT THESE VALUES! :)
var concentricSections = 3;
var gridRadius = 24;
var transparency = "2f";
var spawnProbability = 0.001;
function increaseSpawnRate(row) {
  return row * 0.00005 * Math.pow(row, 1.2);
}
//

// the section distance depends on the number of concentric sections to prevent overlap
// find the height of a given arc range
function calcHeight(startAngle, endAngle, radius) {
  let startY = Math.cos(startAngle) * radius;
  let endY = Math.cos(endAngle) * radius;
  return endY - startY;
}

var reduce = calcHeight(0, (2 * Math.PI) / (pieSlices * 2), gridRadius);

// section radius must be reduced to prevent circles from arcing outside of triangle
// what is the maximum height of arc outside bounds of triangle?
var sectionRadius = (gridRadius + reduce) / concentricSections;

var rads = 0;
var radsPerSlice = (2 * Math.PI) / pieSlices;

var width = gridRadius;
var height = gridRadius + reduce;
ctx.strokeStyle = "#FFFFFF" + transparency;

var snap = calcHeight(0, Math.PI / 6.0, gridRadius) * 2;

function renderHex(x, y) {
  for (let s = 0; s < pieSlices; s++) {
    var inverted = Math.random() > 0.5;
    var ccw = Math.random() > 0.5; // Whether to invert counterclockwise
    for (let i = 0; i <= concentricSections; i++) {
      ctx.beginPath();
      let orbit =
        sectionRadius * i -
        ((reduce - snap) * (i - concentricSections)) / concentricSections;
      if (inverted) {
        if (ccw) {
          ctx.strokeStyle = "#00ffff" + transparency;
        } else {
          ctx.strokeStyle = "#ffffff" + transparency;
        }
        ctx.arc(
          x + gridRadius * Math.cos(rads + ccw * radsPerSlice),
          y + gridRadius * Math.sin(rads + ccw * radsPerSlice),
          orbit,
          Math.PI + rads - radsPerSlice + ccw * radsPerSlice * 2,
          Math.PI + rads + ccw * radsPerSlice * 2
        );
      } else {
        ctx.strokeStyle = "#fc6900" + transparency;
        ctx.arc(x, y, orbit, rads, rads + radsPerSlice);
      }
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.moveTo(
      x + gridRadius * Math.cos(rads),
      y + gridRadius * Math.sin(rads)
    );
    ctx.lineTo(x, y);
    ctx.moveTo(
      x + gridRadius * Math.cos(rads),
      y + gridRadius * Math.sin(rads)
    );
    ctx.lineTo(
      x + gridRadius * Math.cos(rads + radsPerSlice),
      y + gridRadius * Math.sin(rads + radsPerSlice)
    );
    ctx.stroke();
    rads += radsPerSlice;
  }
}

for (let x = -1; x < 20; x++) {
  for (let y = -1; y < 100; y++) {
    if (Math.random() + increaseSpawnRate(y) > 1.0 - spawnProbability) {
      renderHex(x * width * 3 + (y % 2 === 0) * width * 1.5, y * height);
    }
  }
}
