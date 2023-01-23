var dotWindow = document.querySelector('canvas#dotWindow'); // Reference to main canvas element
const pointsSlider = document.querySelector('#pointsRange'); // Reference to main canvas element
const dotInfoWindow = document.querySelector('canvas#dotInfoWindow'); // Reference to main canvas element
const distanceBox = document.querySelector('p#distanceBox'); // Reference to main canvas element
const pointsBox2 = document.querySelector('p#pointsBox2');
const c = dotWindow.getContext("2d") ; // 2 Dimensional Space
dotWindow.width = window.innerWidth/2;  // Main Container Boundary
dotWindow.height = window.innerHeight/2; // Main Container Boundary
//dotInfoWindow.height = window.innerHeight/2; // Main Container Boundary
const MAXLEVEL = 1000;
const gridSize = 100; // Number of grid units total
var savedCanvas;
class Point {
	constructor(position) {
		this.position = position;
	}
}

// new Point({x: 12, y: 20});

function distanceFormula(point1, point2) {
	return Math.sqrt(Math.pow(Math.abs(point1.position.x-point2.position.x), 2) + Math.pow(Math.abs(point1.position.y-point2.position.y), 2));
}
   
class Connection_ { // Describes a connection between two points
	constructor(startPoint, endPoint) {
		this.startPoint = startPoint;
		this.endPoint = endPoint;
		this.distance = distanceFormula(endPoint, startPoint);
	}
	
}



function getPoints(connection) {
	x1 = connection.startPoint.position.x;
	x2 = connection.endPoint.position.x;
	y1 = connection.startPoint.position.y;
	y2 = connection.endPoint.position.y;
	
	var points = [];

	if (y2 <= y1) {
		y11 = y1;
		y1 = y2;
		y2 = y11;
	}

	if (x2 <= x1) {
		x11 = x1;
		x1 = x2;
		x2 = x11;
	}

	for (let x=x1; x < x2; x ++) {
		for (let y=y1; y < y2; y ++) {
			points.push(new Point({x: x, y: y}));
		}
	}

	return points;

}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function randInt(max) {
  return Math.floor(Math.random() * max);
}

class Connection { // Describes a connection between two points
	constructor(connection) {
		this.startPoint = connection.startPoint;
		this.endPoint = connection.endPoint;
		this.distance = connection.distance;
		this.points = getPoints(connection);
	}
}

points = [];

class GameStateManager {
	constructor() {
		this.totalPathDistance = 0;
		this.userPath = [];
		this.userPathDistance = 0;
		this.mode = "auto"; // Other mode: "game"
		this.level = 0;
		this.connections = [];
		this.points = [];
		this.canvai = null;
		var	connections__ = []
		for (let i=0; i<points.length; i++) {
			for (let j=0; j<points.length; j++) {
				if (i!=j) {
					connection = new Connection_(points[i], points[j]);
					connections__.push(connection);
				}
			}		
		}
		this.connections = connections__;
		this.currentMousePosition = new Point({x: 0, y: 0});
		this.closestConnection = null;
	}
}

gsm = new GameStateManager();

function connectTargets() {
	connections__ = []
	for (let i=0; i<points.length; i++) {
		for (let j=0; j<points.length; j++) {
			if (i!=j) {
				connection = new Connection_(points[i], points[j]);
				connections__.push(connection);
			}
		}		
	}
	gsm.connections = connections__;
	console.log("Connections were established, now turning into elements.");

}
function startNewGame() {
	gsm.mode = "game";

}


function getMidPoint(startPoint, endPoint) {
	// Point.position.x/y
	var startX = startPoint.position.x;
	var startY = startPoint.position.y;
	var endX = endPoint.position.x;
	var endY = endPoint.position.y;
	var avgX = (Math.max(startX, endX) - Math.min(startX, endX)) / 2 + Math.min(startX, endX);
	var avgY = (Math.max(startY, endY) - Math.min(startY, endY)) / 2 + Math.min(startY, endY);
	return new Point({x:avgX, y: avgY});
}

function clearLines() {
	c.clearRect(0, 0, dotWindow.width, dotWindow.height);
}
async function drawTempLineBetweenPoints(startPoint, endPoint) {
	X = startPoint.position.x*dotWindow.width/gridSize;
	Y = startPoint.position.y*dotWindow.height/gridSize;
	X2 = endPoint.position.x*dotWindow.width/gridSize;
	Y2 = endPoint.position.y*dotWindow.height/gridSize;
	c.beginPath();
	c.moveTo(X, Y);
	c.lineTo(X2, Y2);
	var stroked = "#" + randInt(9) + randInt(9) + randInt(9) + randInt(9) + randInt(9) + '0';
	c.strokeStyle = stroked;
	c.stroke();
}
function pointInConnection(point, connection) { 
	console.log(point);
	var px = point.position.x/dotWindow.width;
	var py = point.position.y/dotWindow.width;
	var minConX = Math.min(connection.startPoint.position.x, connection.endPoint.position.x);
	var maxConX = Math.max(connection.startPoint.position.x, connection.endPoint.position.x);
	var minConY = Math.min(connection.startPoint.position.y, connection.endPoint.position.y);
	var maxConY = Math.max(connection.startPoint.position.y, connection.endPoint.position.y);
	console.log(minConX, minConY, maxConY, maxConX, px, py);
	if (minConX-10 <= px && maxConX+10 >= px) {
		console.log("ASS");
		if (minConY-10 <= py && maxConY+10 >= py) {
			console.log("MATCHING HERE!", connection);
			return true;	
		}
	}
	return false;
}

function isInsideBounds(element_, point) {
	rectangle_ = element_.getBoundingClientRect();
	var minX = rectangle_.x;
	var maxX = rectangle_.x + rectangle_.width;
	var minY = rectangle_.y;
	var maxY = rectangle_.y + rectangle_.height;
	if (point.position.x <= maxX && point.position.x >=minX) {
		if (point.position.y <= maxY && point.position.y >=minY) {
			return true;
		}	
	}
	return false; 
}

document.onmousemove = handleMouseMove;
async function handleMouseMove(event) {
	if (gsm.mode == "game") {
	    var eventDoc, doc, body;

	    event = event || window.event; // IE-ism

	    // If pageX/Y aren't available and clientX/Y are,
	    // calculate pageX/Y - logic taken from jQuery.
	    // (This is to support old IE)
	    if (event.pageX == null && event.clientX != null) {
	        eventDoc = (event.target && event.target.ownerDocument) || document;
	        doc = eventDoc.documentElement;
	        body = eventDoc.body;

	        event.pageX = event.clientX +
	          (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
	          (doc && doc.clientLeft || body && body.clientLeft || 0);
	        event.pageY = event.clientY +
	          (doc && doc.scrollTop  || body && body.scrollTop  || 0) -
	          (doc && doc.clientTop  || body && body.clientTop  || 0 );
	    }
	    if (isInsideBounds(dotWindow, new Point({x: event.pageX, y: event.pageY}))) {
	    	console.log(dotWindow.getBoundingClientRect());
		    // Use event.pageX / event.pageY here
		    var currentMousePosition = new Point({x: event.pageX, y: event.pageY});
		    gsm.currentMousePosition = currentMousePosition;
		    gsm.closestConnection = await getClosestConnection(event.pageX, event.pageY);
		    if (pointInConnection(currentMousePosition, gsm.closestConnection)) {
			    await drawTempLineBetweenPoints(gsm.closestConnection.startPoint, gsm.closestConnection.endPoint);
			    await sleep(500);
			    clearLines();
			    lvlMgr.reloadTargets();
			    return currentMousePosition;
		    }
	    }

	}

}




function handleMouseClover(){ // Click Hover
	console.log("MOUSE CLICK DETECTED!");
	gsm.canvai = dotWindow; // Save current state of canvas
	console.log("CLOSEST CONNECTION: ", gsm.closestConnection);
	console.log(gsm.connections);
	//drawTempLineBetweenPoints(gsm.closestConnection.startPoint, gsm.closestConnection.endPoint);	
	for (let i=0; i<gsm.connections.length; i++) {
		drawTempLineBetweenPoints(gsm.connections[i].startPoint, gsm.connections[i].endPoint);	
	
	}
}



async function getClosestConnection(x, y) {
	let compPos = new Point({x: x, y: y});
	var closestConnection = gsm.connections[0];
	var distanceTo_ = 99999999;
	var closestDeltaDistance = distanceTo_;
	for (let c=0; c<gsm.connections.length; c++) {
		var midPoint = getMidPoint(gsm.connections[c].startPoint, gsm.connections[c].endPoint);
		var distanceTo = distanceFormula(midPoint, compPos);
		if (distanceTo < closestDeltaDistance) {
			closestDeltaDistance = distanceTo;
			closestConnection = gsm.connections[c];
		}
	}

	return closestConnection;
	
}

function generatePoints(count) {
	points = [];
	let spatialModifier = 4;
	for (let c=0; c< count; c++) {
		points.push(new Point({x: randInt(gridSize-spatialModifier*2) + spatialModifier, y: randInt(gridSize-spatialModifier*3)+spatialModifier}));
	}
	console.log("Generating Points, # = ", count);
	return points;
}


console.log(points);

c.fillStyle = "#FF0000";


var quadrants = [];
var lines = [];

function isInQuadrant(point, quadrantOrigin, radius) {

	var maxY = quadrantOrigin.position.y + radius;
	var minY = quadrantOrigin.position.y - radius;
	var maxX = quadrantOrigin.position.x + radius;
	var minX = quadrantOrigin.position.x - radius;

	if (point.position.x <= maxX && point.position.x >= minX) {
		if (point.position.y <= maxY && point.position.y >= minY) {
			return true;
		} 		
	} 

	return false;

}


function hasNeighbors(point, points) {
	var n = 0;
	var radius = 6; // Defining distance of neigbor
	points = points.filter(item => item !== point)
	for (let i=0; i < points.length; i++) {
		if (isInQuadrant(point, points[i], radius)) {
			n++;
		}
	}
	return n;
}


async function drawTargets(pointsToDraw, pts=false) {
	updatePointCount2();
	console.log("Drawing targets...");
	if (pts) {
		points = pts;
		console.log("USING PREDT Points");
	}
	else {
		points = generatePoints(pointsToDraw);
	}
	for (let i=0; i < points.length; i++) {
		X = points[i].position.x*dotWindow.width/gridSize;


		Y = points[i].position.y*dotWindow.height/gridSize;

		var stroke = '#FF' + randInt(9) + randInt(9) + randInt(9) + '0';
		var R = 10;

		c.strokeStyle = stroke;
		quadrants.push(new Point({x:X, y: Y}));
		c.beginPath();
		c.arc(X, Y, R, 0, 2 * Math.PI, false);
		c.lineWidth = 3;
		c.stroke();
		c.fillStyle = stroke;
		c.fill();
		
	}


}

var slideElem = document.getElementById("pointsRange");

slideElem.addEventListener("change", event => {
	updatePointCount2();
});

function updatePointCount2() {
	pointsBox2.innerText = pointsSlider.value.toString();
}

async function solveTargets() {
	var points_ = points;
	gsm.totalPathDistance = 0;
	console.log("solving",points_);
	counterDistance = 0;
	document.querySelector('p#pointsBox').innerText = "Solving " + points_.length.toString() + " points.";
	disableElementVisibility("startButton");
	disableElementVisibility("exposeConnections");
	for (let i=0; i < points_.length-1; i++) {
		startPoint = points_[i];
		X = startPoint.position.x*dotWindow.width/gridSize;
		Y = startPoint.position.y*dotWindow.height/gridSize;
		endPoint = points_[i+1];
		X2 = endPoint.position.x*dotWindow.width/gridSize;
		Y2 = endPoint.position.y*dotWindow.height/gridSize;
		counterDistance += distanceFormula(startPoint, endPoint);
		distanceBox.innerText = counterDistance.toFixed(4);
		c.beginPath();
		c.moveTo(X, Y);
		await sleep(100);
		c.lineTo(X2, Y2);
		var stroked = "#" + randInt(9) + randInt(9) + randInt(9) + randInt(9) + randInt(9) + '0';
		c.strokeStyle = stroked;
		c.stroke();
		}
	enableElementVisibility("startButton");
	enableElementVisibility("exposeConnections");
	gsm.totalPathDistance = counterDistance;
	console.log("Counted total distance optimum, ", counterDistance);
	
}
function toggleElementVisibility(id_) {
  var x = document.getElementById(id_);
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}

function disableElementVisibility(id_) {
  var x = document.getElementById(id_);
  x.style.display = "none";
}
function enableElementVisibility(id_) {
  var x = document.getElementById(id_);
  x.style.display = "block";
}

class levelManager {
	constructor() {
		this.level = gsm.level;
		this.pts = [];
	}

	async saveLevelTargets(points___) {
		this.pts = points___;
	}

	async reloadTargets() {
		points = this.pts;
		await drawTargets(((Math.pow((this.level / MAXLEVEL),2) + 3) * 2), points);

	}

	async newLevel(pts=false) {

		if (pts) {
			points = pts;
		}
		else {
			points = generatePoints(this.level + 1);
		}
		c.clearRect(0, 0, dotWindow.width, dotWindow.height);
		counterDistance = 0;
		distanceBox.innerText = counterDistance.toFixed(4);
		drawTargets((Math.pow((this.level / MAXLEVEL),2) + 3) * 2);
		document.querySelector("#dotLevelTitle").innerText = "Level " + (gsm.level + 1).toString();
		connectTargets();
		this.saveLevelTargets(points);
	}
}

function handleMouseUp() {
	if (gsm.mode == "game") {
		c.clearRect(0, 0, dotWindow.width, dotWindow.height);
		dotWindow = gsm.canvai;
		lvlMgr.reloadTargets();
	}
}


function startNewGame() {
	gsm.mode = "game";

	console.log("Starting new game...");
	toggleElementVisibility("dotLevelTitle");
	toggleElementVisibility("pointsCountEmbed");
	gsm.level = 0;
	lvlMgr = new levelManager();
	lvlMgr.newLevel();
	document.querySelector("#modeBox").innerText = "Mode: Active Game"
	console.log("Starting level 1.");

}

function sortByDistance() {
	var sorted = points.sort(function sortClosest(a, b) { // non-anonymous as you ordered...
    return b.position.x + b.position.x < a.position.x + a.position.y ?  1 // if b should come earlier, push a to end
         : b.position.x + b.position.y > a.position.x + a.position.y ? -1 // if b should come later, push a to begin
         : 0;                   // a and b are equal

	})
	return sorted;
}


async function drawLoop() {

	while (gsm.mode !="game") {
		dotWindow.width = window.innerWidth/2;  // Main Container Boundary
		dotWindow.height = window.innerHeight/2; // Main Container Boundary
		points = generatePoints(pointsSlider.value);
		points = sortByDistance(points);
		quadrants = [];
		c.fillStyle = "white";
		c.clearRect(0, 0, dotWindow.width, dotWindow.height);
		await sleep(44);
		drawTargets(pointsSlider.value);
		await sleep(400);
		solveTargets();
		await sleep(8000);
	}	
}




drawLoop();



