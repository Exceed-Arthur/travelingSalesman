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
const ctx = dotWindow.getContext("2d");
hideGameButtons();
class Point {
	constructor(position) {
		this.position = position;
		this.visited = false;
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

async function drawTarget(pointA) {

	console.log("Drawing target by itself...");


	X = pointA.position.x*dotWindow.width/gridSize;
	Y = pointA.position.y*dotWindow.height/gridSize;

	var stroke = gsm.currentColors[points.indexOf(pointA)];

	var R = 10;

	c.strokeStyle = stroke;
	c.beginPath();
	c.arc(X, Y, R, 0, 2 * Math.PI, false);
	c.lineWidth = 3;
	c.stroke();
	c.fillStyle = stroke;
	c.fill();
		
}

class GameStateManager {
	constructor() {
		this.totalPathDistance = 0;
		this.userPath = [];
		this.userPathDistance = 0;
		this.mode = "auto"; // Other mode: "game"
		this.level = 0;
		this.arrayCombinations = [];
		this.connections = [];
		this.points = [];
		this.closestPoint = null;
		this.canvai = null;
		this.closestPoints = [];
		this.currentColors = [];
		this.connections = [];
		this.nestedPaths = [];
		this.shortestPath = [];
		this.possiblePathDistances = [];
		this.currentMousePosition = new Point({x: 0, y: 0});
		this.closestConnection = null;
	}
}

gsm = new GameStateManager();

async function pointInConnection(point, connection) { 
	rectangle_ = document.querySelector("#dotWindow").getBoundingClientRect();
	var minX = rectangle_.x;
	var maxX = rectangle_.x + rectangle_.width;
	var minY = rectangle_.y;
	var maxY = rectangle_.y + rectangle_.height;
	var px = point.position.x;
	var py = point.position.y;
	var minConX = Math.min(connection.startPoint.position.x, connection.endPoint.position.x);
	var maxConX = Math.max(connection.startPoint.position.x, connection.endPoint.position.x);
	var minConY = Math.min(connection.startPoint.position.y, connection.endPoint.position.y);
	var maxConY = Math.max(connection.startPoint.position.y, connection.endPoint.position.y);
	if (minConX <= px && maxConX >= px) {
		if (minConY <= py && maxConY >= py) {
			return true;	
		}
	}
	return false;
}
async function connectTargets() {
	connections__ = [];
	colors2_ = [];
	for (let i=0; i<points.length; i++) {
		for (let j=0; j<points.length; j++) {
			if (i!=j) {
				connection = new Connection_(points[i], points[j]);
				connections__.push(connection);
				colors2_.push("#" + randInt(9) + randInt(9) + randInt(9) + randInt(9) + randInt(9) + '0');
			}
		}		
	}
	gsm.currentColors = colors2_;
	gsm.connections = connections__;

	console.log("Connections were established, now turning into elements.");

}
function startNewGame() {
	gsm.mode = "game";

}

async function buildColorSet(){
	var colors2 = [];
	if (gsm.mode=="game") {
		for (let i=0; i < gsm.connections.length; i++) {
			var stroked = "#" + randInt(9) + randInt(9) + randInt(9) + randInt(9) + randInt(9) + '0';
			colors2.push(stroked);
		}
		gsm.currentColors = colors2;
	}
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
async function drawTempLineBetweenPoints(connection, stroke=false) {
	X = connection.startPoint.position.x*dotWindow.width/gridSize;
	Y = connection.startPoint.position.y*dotWindow.height/gridSize;
	X2 = connection.endPoint.position.x*dotWindow.width/gridSize;
	Y2 = connection.endPoint.position.y*dotWindow.height/gridSize;
	c.beginPath();
	c.moveTo(X, Y);
	c.lineTo(X2, Y2);
	if (!(stroke)) {
		var stroked = "#" + randInt(9) + randInt(9) + randInt(9) + randInt(9) + randInt(9) + '0';
		c.strokeStyle = stroked;
	}
	else {
		c.strokeStyle = stroke;
	}
	c.stroke();
}


async function drawLineBetweenPoints(startPoint, endPoint, stroke=false) {
	X = startPoint.position.x*dotWindow.width/gridSize;
	Y = startPoint.position.y*dotWindow.height/gridSize;
	X2 = endPoint.position.x*dotWindow.width/gridSize;
	Y2 = endPoint.position.y*dotWindow.height/gridSize;
	c.beginPath();
	c.moveTo(X, Y);
	c.lineTo(X2, Y2);
	if (!(stroke)) {
		var stroked = "#" + randInt(9) + randInt(9) + randInt(9) + randInt(9) + randInt(9) + '0';
		c.strokeStyle = stroked;
	}
	else {
		c.strokeStyle = stroke;
	}
	c.stroke();
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

ctx.lineWidth = 165;

async function drawBoard(){
		c.beginPath();
		c.beginPath();
		c.lineWidth = 1;
		c.lineWidth = 1;
    c.strokeStyle = "#D3D3D3";
    c.strokeStyle = "#D3D3D3";

		var p = 10;
    for (var x = 0; x <= dotWindow.width; x += dotWindow.width/10) {
        c.moveTo(x + p, p);
        c.lineTo(x + p, dotWindow.height + p);
        c.stroke();
    }

    for (var x = 0; x <= dotWindow.height; x += dotWindow.width/10) {
        c.moveTo(p, x + p);
        c.lineTo(dotWindow.width  + p, x + p);
        c.stroke();
    }

}

function pointToStr(point_) {
	return "(" + closestPoint.position.x + ", " + closestPoint.position.x + ")"; 
}

function pointsToStr() {
	return points.map(pointToStr);
}


function mouseToGridPos(mousePos) {
	rectangle_ = document.querySelector("#dotWindow").getBoundingClientRect();
	var minX = rectangle_.x;
	var maxX = rectangle_.x + rectangle_.width;
	var minY = rectangle_.y;
	var maxY = rectangle_.y + rectangle_.height;
	var px = ((mousePos.position.x-minX)/dotWindow.width)*gridSize;
	var py = ((mousePos.position.y-minY)/dotWindow.height)*gridSize;

	return new Point({x: px, y: py});
}

async function getNearestPoint(PointA) {
	var ax = PointA.position.x;
	var ay = PointA.position.y;
	var closestDeltaDistance = gridSize;
	var closestPoint = points[0];
	for (p=0; p<points.length; p++) {
		var distanceTo = distanceFormula(PointA, points[p]);
		if (closestDeltaDistance >= distanceTo) {
			closestDeltaDistance = distanceTo;
			closestPoint = points[p];
		}
	}
	gsm.closestPoint = closestPoint;
	document.querySelector("#nearestPointBox").innerText = "Nearest Point: (" + closestPoint.position.x + ", " + closestPoint.position.y + ")"; 

	return closestPoint;
}






async function drawNearestConnections(mp) {
	var pointo = await getNearestPoint(mp);
	var remainingConns = await getRemainingConnectionsWithPoint(pointo);
	var points3 = getPointsFromConnections(remainingConns);
	points3.sort(sortPointsByDistanceLambda);
	var nearestPointBridge = [points3[0], points3[1]];
	gsm.closestConnection = await getClosestConnection(pointo);
	console.log(remainingConns);
  // Use event.pageX / event.pageY here

 


  rectangle_ = document.querySelector('#dotWindow').getBoundingClientRect();
	var minX = rectangle_.x;
	var maxX = rectangle_.x + rectangle_.width;
	var minY = rectangle_.y;
	var maxY = rectangle_.y + rectangle_.height;
		var px = ((mp.position.x-minX)/dotWindow.width)*gridSize;
	var py = ((mp.position.y-minY)/dotWindow.height)*gridSize;

	for (let i=0; i<remainingConns.length; i++) {
		var strokey = gsm.currentColors[gsm.connections.indexOf(remainingConns[i])];

    await drawTempLineBetweenPoints(remainingConns[i], strokey);


	}
}
				


document.onmousemove = handleMouseMove;
async function handleMouseMove(event) {

	if (gsm.mode == "game" && !lvlMgr.levelSolved) {

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

	    var np = new Point({x: event.pageX, y: event.pageY})
	    gsm.currentMousePosition = np;
	    if (isInsideBounds(dotWindow, np)) {
	    	
	    	var mp = mouseToGridPos(np); // Mouse Position

	  		var currentMousePosition = np;
	  		var newConn = await getClosestConnectionPoint(mp)
	  		var oldConn = gsm.closestConnection;
	  		gsm.closestConnection = newConn;
				//await drawNearestConnections(mp);
				if (gsm.closestConnection != null) {

					
					if (pointInConnection(mp, gsm.closestConnection)) {
				    if (oldConn != newConn) {
					    clearLines();
					    drawBoard();
					    lvlMgr.reloadTargets();
					    if (!gsm.userPath.includes(gsm.closestConnection)) {
							  await drawTempClosestConnection();
							}
						}
					}
				}
		   }
			var pointo = await getNearestPoint(mouseToGridPos(gsm.currentMousePosition));
			await drawUserPath();
	    return gsm.currentMousePosition;

	}

}



function buildTableData(rowTuples) {
	var tablearea = document.getElementById('trackSecTable'),
    table = document.getElementById('trackSection');

	for (var i = 1; i < rowTuples.length; i++) {
	    var tr = document.createElement('tr');

	    tr.appendChild( document.createElement('td') );
	    tr.appendChild( document.createElement('td') );

	    tr.cells[0].appendChild( document.createTextNode(rowTuples[i][0]))
	    tr.cells[1].appendChild( document.createTextNode(rowTuples[i][1]));

	    table.appendChild(tr);
	}

	tablearea.appendChild(table);
}



function hideGameButtons() {
	disableElementVisibility("startButton");
	disableElementVisibility("exposeConnections");
	disableElementVisibility("PointsContainer");
	disableElementVisibility("trackSection");
	disableElementVisibility("trackSecTable");

}

function sortPointsByDistanceLambda(a, b) {
  if (distanceFormula(a, gsm.closestPoint) > distanceFormula(b, gsm.closestPoint)) {
    return -1;
  }
  if (distanceFormula(a, gsm.closestPoint) < distanceFormula(b, gsm.closestPoint))  {
    return 1;
  }
  // a must be equal to b
  return 0;
}

function sortPointsByDistanceLambdaGroup(a, b) {
  if (distanceFormula(a, gsm.closestPoint) > distanceFormula(b, gsm.closestPoint)) {
    return -1;
  }
  if (distanceFormula(a, gsm.closestPoint) < distanceFormula(b, gsm.closestPoint))  {
    return 1;
  }
  // a must be equal to b
  return 0;
}



function sortNearestPoints() {
	gsm.closestPoints =
	gsm.closestPoints.sort(sortPointsByDistanceLambda);
}



async function drawTempClosestConnection() {
	await sleep(50);
	var mp = mouseToGridPos(gsm.currentMousePosition);
	gsm.closestConnection = await getClosestConnectionPoint(mp);
	if (gsm.closestConnection != null) {
		drawTempLineBetweenPoints(gsm.closestConnection, gsm.currentColors[points.indexOf(gsm.closestConnection.startPoint)]);
		drawTarget(gsm.closestConnection.endPoint);

	}
}

function handleMouseClover(){ // Click Hover
	gsm.canvai = dotWindow; // Save current state of canvas
	//drawTempLineBetweenPoints(gsm.closestConnection.startPoint, gsm.closestConnection.endPoint);	
	for (let i=0; i<gsm.connections.length; i++) {
		drawTempLineBetweenPoints(gsm.connections[i], stroke=gsm.currentColors[i]);	
		drawTarget(gsm.connections[i].endPoint);

	}
}

function getPointsFromConnections(connections) {
	var points3 = [];
	for (let c=0; c<connections.length; c++) {
		if (!(points3.includes(connections[c].startPoint))) {
			points3.push(connections[c].startPoint);			
		}
		if (!(points3.includes(connections[c].endPoint))) {
			points3.push(connections[c].endPoint);
		}
	}

	points3.sort(sortPointsByDistanceLambda);
	return points3;
	
}

async function getRemainingConnectionsWithPoint(pointA, pointType="start") {
	var pointsFilt = [];
	if (pointType == "start") {
		for (let p=0; p<gsm.connections.length; p++) {
			if (gsm.connections[p].startPoint.position == pointA.position) {
				pointsFilt.push(gsm.connections[p]);
			}
		}
	}
	else if (pointType == "all") {
		for (let p=0; p<points.length; p++) {
			if (gsm.connections[p].startPoint.position == pointA.position || gsm.connections[p].endPoint.position == pointA.position) {
				pointsFilt.push(gsm.connections[p]);
			}
		}
	}

	else if (pointType=="end") {
		for (let p=0; p<points.length; p++) {
			if (gsm.connections[p].endPoint.position == pointA.position) {
				pointsFilt.push(gsm.connections[p]);
			}
		}
	}
	return pointsFilt;
}



async function getClosestConnections(pointA) {
	var conns = await getConnectionsWithPoint(pointA, "start");
	var conns2 = [];
	for (let c=0; c<conns.length; c++) {
		if (!(gsm.userPath.includes(conns[c]))) {
			conns2.push(conns[c]);
		}
	}
	return conns2;
}


async function getClosestConnection(x, y) {

	let compPos = new Point({x: x, y: y});
	var closestConnection = null;
	var distanceTo_ = 99999999;
	var closestDeltaDistance = distanceTo_;
	for (let c=0; c<gsm.connections.length; c++) {
		if (c != 0 && (c*2 == gsm.userPath.length+1)) {console.log("SEA BRAIN"); return null}
			var midPoint = getMidPoint(gsm.connections[c].startPoint, gsm.connections[c].endPoint);
			var distanceTo = distanceFormula(midPoint, compPos);
			if (distanceTo < closestDeltaDistance) {
				closestDeltaDistance = distanceTo;
				closestConnection = gsm.connections[c];

			}
	}
	rectangle_ = document.getElementById("dotWindow").getBoundingClientRect();
	var minX = rectangle_.x;
	var maxX = rectangle_.x + rectangle_.width;
	var minY = rectangle_.y;
	var maxY = rectangle_.y + rectangle_.height;
	var px = ((gsm.currentMousePosition.position.x-minX)/dotWindow.width)*gridSize;
	var py = ((gsm.currentMousePosition.position.y-minY)/dotWindow.height)*gridSize;
	var mp1 = gsm.currentMousePosition.position.x;
	document.querySelector("#mousePosBox").innerText = "Mouse Position: (" + (px.toFixed(2)).toString() + ", " + (py.toFixed(2)).toString() + ")";
	return closestConnection;
	
}

function filterByVisited(item) {
	if (!gsm.userPath.includes(item)) {
		return true;
	}
	return false;
}

async function getClosestConnectionPoint(compPos) {
	var closestConnection = null;
	var distanceTo_ = 99999999;
	var closestDeltaDistance = distanceTo_;
	let cacheConns = gsm.connections;
	gsm.connections = cacheConns.filter(filterByVisited);
	for (let c=0; c<gsm.connections.length; c++) {
		var midPoint = getMidPoint(gsm.connections[c].startPoint, gsm.connections[c].endPoint);
		var distanceTo = distanceFormula(midPoint, compPos);
		if (distanceTo < closestDeltaDistance) {
			closestDeltaDistance = distanceTo;
			closestConnection = gsm.connections[c];
		}
	}
	rectangle_ = document.getElementById("dotWindow").getBoundingClientRect();
	var minX = rectangle_.x;
	var maxX = rectangle_.x + rectangle_.width;
	var minY = rectangle_.y;
	var maxY = rectangle_.y + rectangle_.height;
	var px = ((gsm.currentMousePosition.position.x-minX)/dotWindow.width)*gridSize;
	var py = ((gsm.currentMousePosition.position.y-minY)/dotWindow.height)*gridSize;
	var mp1 = gsm.currentMousePosition.position.x;
	document.querySelector("#mousePosBox").innerText = "Mouse Position: (" + (px.toFixed(2)).toString() + ", " + (py.toFixed(2)).toString() + ")";
	gsm.connections = cacheConns;
	return closestConnection;
	
}

function generatePoints(count) {
	points = [];
	let spatialModifier = 4;
	for (let c=0; c< count; c++) {
		points.push(new Point({x: randInt(gridSize-spatialModifier*2) + spatialModifier, y: randInt(gridSize-spatialModifier*3)+spatialModifier}));
	}

	return points;
}




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


async function drawTargets(pointsToDraw, pts=false, colors=false) {
	updatePointCount2();
	colors2 = [];
	if (pts) {
		points = pts;
	}
	else {
		points = generatePoints(pointsToDraw);
	}
	for (let i=0; i < points.length; i++) {
		X = points[i].position.x*dotWindow.width/gridSize;
		Y = points[i].position.y*dotWindow.height/gridSize;

		var stroke = '#FF' + randInt(9) + randInt(9) + randInt(9) + '0';
		if (colors) {
			stroke = colors[i];
		}
		else {
			colors2.push(stroke);
		}
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
	if (!(colors)) {
		gsm.currentColors = colors2;
	}

}

var slideElem = document.getElementById("pointsRange");

slideElem.addEventListener("change", event => {
	updatePointCount2();
});

function showGameButtons() {
	enableElementVisibility("trackSection");
	enableElementVisibility("exposeConnections");
	enableElementVisibility("trackSecTable");
	enableElementVisibility("nearestPointContainer");
	enableElementVisibility("PointsContainer");
}

function updatePointCount2() {
	pointsBox2.innerText = pointsSlider.value.toString();
}


async function pathFromConnectionArray(connectionArray) {
	var pointCollection = [];
	for (let i=0; i<connectionArray.length; i++) {
		if (!(pointCollection.includes(connectionArray[i].startPoint))) {
			pointCollection.push(connectionArray[i].startPoint);
		}
		if (!(pointCollection.includes(connectionArray[i].endPoint))) {
			pointCollection.push(connectionArray[i].endPoint);
		}
	}
	return pointCollection;

}


class pointNode {
	constructor(head) {
		this.head = head;
		this.next = null;
	}
}

async function buildPointNodes(path_) {
	var nodeList = [];
	for (var n=0; n<path_.length; n++) {
		nodeList.push(new pointNode(path_[n]));
	}
	for (let c=0; c<nodeList.length; c++) {
		if (c < nodeList.length - 1) {
			nodeList[c].next = nodeList[c+1];
		}
	}
	return nodeList;
}


function sortNumbers(a, b) {
	//console.log(a, b, a>b);
	if (a > b) {
		return 1;
	}
	if (a < b) {
		return -1;
	}
	return 0;
}




async function calculatePathDistance(pathNodes) {
	var totalDistance = 0;
	//console.log(pathNodes, "path Nodes 766");
	for (let p=0; p<pathNodes.length; p++) {
		if (pathNodes[p].head != null) {
			if (pathNodes[p].next != null) {
				distanceTo = distanceFormula(pathNodes[p].head, pathNodes[p].next.head);
				totalDistance += distanceTo;

			}
		}
	}
	if (totalDistance) {
		if (!gsm.possiblePathDistances.includes(totalDistance)) {
			gsm.possiblePathDistances.push(totalDistance);

		}
	}
	return totalDistance;
}

async function sortConnectionArrayDistanceMapLambda(a, b) {
	// Takes two connection objects
	console.log(a, b, "704");
	var path1 = await pathFromConnectionArray(a);
	var path2 = await pathFromConnectionArray(b);
	var distanceP1 = await calculatePathDistance(await buildPointNodes(path1));
	var distanceP2 = await calculatePathDistance(await buildPointNodes(path2));
	console.log(distanceP1, distanceP2, distanceP1>distanceP2, "791");
	if (distanceP1 > distanceP2) {
		return 1;
	}
	if (distanceP1 < distanceP2) {
		return -1;
	}
	return 0;
}



async function sortPathArrayDistanceMapLambda(a, b) {
	// Takes two point (path) array objects
		console.log(a, b, "804 initial arg sortpath array");

	var distanceP1 = await calculatePathDistance(a);
	var distanceP2 = await calculatePathDistance(b);
	console.log(distanceP1, distanceP2, distanceP1>distanceP2, "808");
	if (distanceP1 > distanceP2) {
		return 1;
	}
	if (distanceP1 < distanceP2) {
		return -1;
	}
	return 0;
}

async function buildPointNodes2(uipathnodes) {
	var nodes_ = [];
	for (let u=0; u<uipathnodes.length; u++) {
		nodes_.push(new pointNode(uipathnodes[u]));
	}
	for (let c=0; c<nodes_.length; c++) {
		if (c < nodes_.length - 1) {
			nodes_[c].next = nodes_[c+1];
		}
	}
	return nodes_;
}



async function convertPathsToNodes(uipaths) {
	var nest = [];
	for (let u = 0; u<uipaths.length; u++) {
		nest.push(await buildPointNodes2(uipaths[u]));
	}
	return nest;

}

async function lambdaPathDistanceSort(a, b) {
	if (await calculatePathDistance(a) < await(calculatePathDistance(b))) {
		return 1;
	}
	if (await calculatePathDistance(a) > await(calculatePathDistance(b))) {
		return -1;
	}
	return 0;
}

class Path {
	constructor(path, dist) {
		this.path = path; // Array of nodes terminated by null
		this.distance = dist;
	}
}


async function convertConnectionsToNodes(connPath) {
	var nodes = [];
	let pfca = await pathFromConnectionArray(connPath);
	let dist = await calculatePathDistance(pfca);
	let na = await buildPointNodes2(pfca);
	return na;
}


async function drawPath(path_, color=false) {
	c.beginPath();
	//console.log(path_, drawPath);
	var counterDistance2 = 0;
	for (let i=0; i < path_.length-1; i++) {
		startPoint = path_[i];
		X = startPoint.head.position.x*dotWindow.width/gridSize;
		Y = startPoint.head.position.y*dotWindow.height/gridSize;
		endPoint = path_[i+1];
		X2 = endPoint.head.position.x*dotWindow.width/gridSize;
		Y2 = endPoint.head.position.y*dotWindow.height/gridSize;
		gsm.possiblePathDistances.sort(sortNumbers);
		counterDistance2 += distanceFormula(new Point({x: startPoint.head.position.x, y: startPoint.head.position.y}), new Point({x: endPoint.head.position.x, y: endPoint.head.position.y}));
		document.querySelector("#distanceBox").innerText = counterDistance2.toFixed(4);
		//
		c.beginPath();
		c.moveTo(X, Y);
		c.lineTo(X2, Y2);
		if (!color) {
			var stroked = gsm.currentColors[points.indexOf(startPoint)];
		}
		
		c.strokeStyle = stroked;
		c.stroke();
		document.querySelector("#distanceBoxPoor").innerText = gsm.possiblePathDistances[gsm.possiblePathDistances.length-1].toFixed(3);
		document.querySelector("#distanceBoxRich").innerText = gsm.shortestDistance.toFixed(3);

	}

}


async function findShortestPath(nestedPath) {
	nestedPath.sort(await lambdaPathDistanceSort);
	gsm.shortestPath = nestedPath[0];

	gsm.shortestDistance = await calculatePathDistance(gsm.shortestPath);
	gsm.nestedPaths = nestedPath;
	console.log(nestedPath, "SHORTEST PATH FOUND");

}

var repeats = 0;
async function solveTargets() {

		console.log(gsm);
		console.log(points, "basic points");
		connectTargets();
		var nestedPaths = await convertPathsToNodes(await getArrayCombos((await pathFromConnectionArray(gsm.connections.map((conn) => new Connection(conn))))));

		var cachePaths = nestedPaths;
		console.log(nestedPaths, "nested Paths solvetargets");
		findShortestPath(nestedPaths); // Assign to GSM...Shortest Point
		await sleep(1090 + 100*points.length);
		drawPath(gsm.shortestPath);
		await drawTargets(pointsSlider.value, points);

	//nestedPaths.map((uninitializedNodes) => uninitializedNodes.sort(sortPathArrayDistanceMapLambda));
	//console.log(nestedPaths, "nested Paths 2 solvetargets");
	//console.log("nestedPaths==cachePaths", nestedPaths==cachePaths);
		
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
		this.levelSolved = false;
	}

	async saveLevelTargets(points___) {
		this.pts = points___;
	}

	async reloadTargets() {
		points = this.pts;
		var colors_ = gsm.currentColors;
		drawBoard();
		await drawTargets(((Math.pow((this.level / MAXLEVEL),2) + 3) * 2), points, colors_);

	}

	async newLevel(pts=false) {

		if (pts) {
			points = pts;
		}
		else {
			points = generatePoints(this.level + 1);
		}
		c.clearRect(0, 0, dotWindow.width, dotWindow.height);
		await drawBoard();
		var counterDistance = 0;
		distanceBox.innerText = counterDistance.toFixed(3);
		drawTargets((Math.pow((this.level / MAXLEVEL),2) + 3) * 2);
		document.querySelector("#dotLevelTitle").innerText = "Level " + (gsm.level + 1).toString();
		document.querySelector("#pointsBox").innerText = "Solving " + ((Math.pow((this.level / MAXLEVEL),2) + 3) * 2).toString() + " points.";
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

	toggleElementVisibility("pointsCountEmbed");
	disableElementVisibility("pointsCountEmbed");
	disableElementVisibility("unIdealDistanceBoxWrapper");
	disableElementVisibility("IdealDistanceBoxWrapper");
	showGameButtons();
	gsm.level = 0;
	enableElementVisibility("dotLevelTitle");
	gsm.userPath = [];
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


async function shiftArray(array1) {
	var newArray = [];
	var lastItem = array1[array1.length-1];
	newArray.push(lastItem);
	for (let a=0; a<array1.length-1; a++) {
		newArray.push(array1[a]);
	}
	return newArray;
}

async function getArrayCombos(array1) {
	var arrayVersions = [];
	var currentArray = array1;
	for (let i=0; i<array1.length; i++) {
		newArray1 = await shiftArray(currentArray);
		currentArray = newArray1;
		arrayVersions.push(newArray1);
	}
	return arrayVersions;
}



async function drawLoop() {

	while (gsm.mode !="game") {
		dotWindow.width = window.innerWidth/2;  // Main Container Boundary
		dotWindow.height = window.innerHeight/2; // Main Container Boundary
		points = generatePoints(pointsSlider.value);
		points = sortByDistance(points);
		quadrants = [];
		c.fillStyle = "white";
		await drawBoard();

		c.clearRect(0, 0, dotWindow.width, dotWindow.height);
		await drawTargets(pointsSlider.value, points);
		await sleep(500);
		gsm.possiblePathDistances = [];
		await solveTargets();
		await sleep(500);
		
		await drawTargets(pointsSlider.value, points);

		enableElementVisibility("startButton");
		await sleep(5000+points.length*100);
	}	
}




async function drawUserPath() {
	//console.log(gsm.userPath);




	await drawPath(await convertConnectionsToNodes(gsm.userPath));

	await drawTargets(pointsSlider.value, points, gsm.currentColors);


}

async function allVisited(points_) {
	console.log("points...visited?", points_);
	for (let p=0; p < points_.length; p++) {
		if (points_.visited == false) {
			console.log("FAILED CHECK LEVEL AT ", points_);
			return false;
		}	
	return true;
	}
}
 



async function extractDistances(pathConn) {
	var distances = [0];
	for (let d=0; d<pathConn.length; d++) {
		console.log("FROGFISH");
		console.log(pathConn[d].distance);
		distances.push(pathConn[d].distance);
	}
	return distances;
}


async function getTableData() {
	console.log(gsm.userPath);
	var points_ = getPointsFromConnections(gsm.userPath);
	var distances = await extractDistances(gsm.userPath);
	console.log(distances);
	console.log(points_);
	var tupes = [];
	for (let p=0; p<points_.length; p++) {
		array1 = [];
		array1.push("(" + points_[p].position.x + ", " + points_[p].position.y + ")");
		array1.push(distances[p].toFixed(4)); 
		console.log(array1);
		tupes.push(array1);
	}
	console.log(tupes);
}

async function handleGameClick() {
	await(drawBoard());
	if (!(gsm.closestConnection.startPoint.visited && gsm.closestConnection.endPoint.visited)) {
		gsm.userPath.push(gsm.closestConnection);
		gsm.closestConnection.startPoint.visited = true;
		gsm.closestConnection.endPoint.visited = true;		
		await getTableData();
	}

	



	await drawUserPath();
	
	if ((gsm.userPath.length + 1) == points.length) {
		if (allVisited(await getPointsFromConnections(gsm.userPath) == true)) {
			lvlMgr.levelSolved = true;
			console.log("LEVEL IS SOLVED! :)");
		}
	}

	gsm.totalPathDistance = await calculatePathDistance(gsm.userPath);
	document.querySelector("#distanceBox").innerText = gsm.totalPathDistance.toFixed(4)	
}

async function handleLevelSolve() {


}


drawLoop();


