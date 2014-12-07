										// SCREEN VARIABLES
var refreshRate = 50; 					// The time in ms between refreshes (Time = 1/(refresh/1000))
var time = 0;							// Informal timing
var cnvW = 900;						// The width of the canvas
var cnvH = 600;							// The height of the canvas
										// THE DRAWN ELEMENTS
var grsCol = "#46bf3b";					// Colour of the grass BG
										// INDIVIDUAL TREE INFO
var trees = [[]];						// The array holding all tree info
var treeH = 20;							// The height of each tree
var barkCol = "#996600";				// The colour of the bark
var leafCol = "#002E00";				// The colour of the leaves
										// FOREST INFO
var forestNum = 20; 					// The number of forests
var forestSize = 5; 					// The number of trees per forest
var treeNum = forestNum * forestSize; 	// The actual number of drawn trees
var forestSpacing = 50; 				// The randomised space between trees in forests
										// INDIVIDUAL ROCK INFO
var rocks = [[]];						// The array holding all rock info
var rockH = 35;							// The height of each rock
var rockCol = "#666666";				// The first rock colour
var rock2Col = "#7D7D7D";				// The second rock colour
var jewelCol = "#FFFF00";				// The colour of the jewel highlight on rocks
										// ROCK GROUPING INFO
var moundNum = 4; 						// The number of mounds
var moundSize = 5; 						// The number of rocks per mound
var rockNum = moundNum * moundSize; 	// The actual number of drawn rocks
var moundSpacing = 80; 					// The randomised space between rocks in mounds
										// BUILDING INFO
var pBuildCol = "#66FFFF";				// The colour of player buildings
var buildings = [[]];					// The array holding all building info
var buildingW = 100;					// The width of all buildings
var buildingH = 100;					// The height of all buildings
var mineshaftCost = 100;				// The cost of a mineshaft
var armybaseCost = 250;					// The cost of an army base
										// UNITS
var units = [[]];						// The array holding all unit info
//var unitNum = treeNum + rockNum;		// quickstart
var unitNum = 5;						// The number of starting units
var unitW = 5;							// The width of each unit
var wLog = 0;							// Number of working loggers
var wMine = 0;							// Number of working miners
var logCost = 10;						// The cost of a logger
var mineCost = 50;						// The cost of a miner
var soldierCost = 100;					// The cost of a soldier
var logHP = 1;	// not used - insta kill
var minHP = 1;	// not used - insta kill
var solHP = 100;
var solAP = 10;
var logAP = 0.1;
var minAP = 0.5;
var loggers = 0;						// The total number of loggers on the map
var miners = 0;							// The total number of miners on the map
var soldiers = 0;
var killCred = 1;						// The amount earned for killing an enemy
var pCreds = 500;						// Player credits 0 = normal, 200 = quickstart
var totalCreds = pCreds;				// The total credits earned in this game
										// ENEMIES
var enemies = [[]];						// The array holding all enemy info
var enemyNum = 5;						// The number of enemies per wave
var enemyW = 7;							// The width of each enemy
var enemyCol = "#FF0000";				// Enemy colour		
var tEnemies = 0;						// The number of enemies
										// BUTTONS
var buttons = [[]];						// The array holding all button info
var buttonW = 175;						// The width of all buttons
var buttonH = 100;						// The height of all buttons
										// OTHER COLOURS
var pLogCol = "#009900";				// Player Logger Colour
var pMinCol = "#EEEEEE";				// Player Miner Colour
var pSolCol = "#6600FF";				// Player Soldier Colour
var pWorkCol = "#00FF00";				// Player Working Colour
var infoCol = "#FFFFFF";				// Info Text Colour
										// LAYOUT AND SCREEN ELEMENTS
var lOff = 5;							// The left offset size for elements
var tOff = 50;							// The top offset for buttons
var sFontSize = Math.floor(tOff/2);		// The status font size
var iFontSize = Math.floor(buildingH/2);// The info font size
var bFontSize = Math.floor(buttonH/4);	// The button font size
var statusFont = sFontSize+"px Calibri";// The status font
var infoFont = iFontSize+"px Calibri";	// The info font
var btnFont = bFontSize+"px Calibri";	// The button font
var cFontSize = 2*unitW;
var cashFont = cFontSize+"px Verdana";
var cashCol = "#FFFF00";				// Cash Symbol Text Colour
										// THE MAP AREA
var mapX = lOff;						// The left offset of the map 
var mapY = tOff+buttonH;				// The top offset of the map
var mapW = cnvW-(2*mapX);				// The width of the map
var mapH = cnvH-(2*mapY);				// The height of the map


function init(){
	console.log("Welcome to Peep Command v2!");
	//Initialise canvas properties
	c = document.getElementById("canvas");
	c.height = cnvH;
	c.width = cnvW;
	
	c.addEventListener("touchstart", doTouch, false);
	c.addEventListener("mousedown", doClick, false);
	//c.addEventListener("mouseover", hoverIn);
	//c.addEventListener("mouseout", hoverOut);
	//	c.addEventListener("contextmenu", function(){alert("right-click")}, false);
	//	document.getElementById('canvas').oncontextmenu = function() {
	//		alert('right click!')
	//	}

 
	// When canvas found, set context to 2d and begin
	if (c.getContext){
        ctx = c.getContext("2d");   
		canv = $( "#canvas" );
		offset = canv.offset();
        resetVars(); 					// Do a reset of all map variables and setup screen
        drawCycle(); 					// The main cycle of drawing
		    
    }
}

function doTouch(event){
    
    event.preventDefault();  
    //var canv = $("#canvas");
    //var offset = canv.offset();
    touchx = Math.floor(event.targetTouches[0].pageX - offset.left);
    touchy = Math.floor(event.targetTouches[0].pageY - offset.top);
   	checkTap();
 
}

function doClick(event){
    
    event.preventDefault();  
    //var canv = $( "#canvas" );
    //var offset = canv.offset();
    touchx = Math.floor(event.pageX - offset.left);
    touchy = Math.floor(event.pageY - offset.top);
	checkTap();

}

function checkTap(){
	
    // CHECK: Logger hut clicked?
    if ( ((buildings[0][0] <= touchx)&&(touchx <= buildings[0][0]+buildings[0][2]))
		&&
	   ( (buildings[0][1]-buildings[0][3] <= touchy)&&(touchy <= buildings[0][1])) )
	{
			if (pCreds >= logCost){
				if (loggers < trees.length){
					addUnit(0);
				}else{
					alert("No more room for loggers!");
				}
			}else{
			alert("Loggers cost $"+logCost+"!");
			}
		
	}
	// CHECK: Mineshaft build button clicked? 	ctx.fillRect(5,25,75,50);
	if ( ((lOff <= touchx)&&(touchx <= lOff+buttonW))
		&&
	   ( (tOff <= touchy)&&(touchy <= tOff+buttonH)) )
	{
			if (buildings.length>1){
				alert("Mineshaft already built!");
			}else if(pCreds >= mineshaftCost){
					addBuilding(1);
			}else{
				alert("Mineshafts cost: $"+mineshaftCost+"!");
			}
		
	}
	
	if (buildings.length > 1){
		// CHECK: Mineshaft clicked?
		if ( ((buildings[1][0] <= touchx)&&(touchx <= buildings[1][0]+buildings[1][2]))
			&&
		   ( (buildings[1][1]-(buildings[1][3]/2) <= touchy)&&(touchy <= buildings[1][1])) )
		{
				if (pCreds >= mineCost){
					if (miners < rocks.length){
						addUnit(1);
					}else{
						alert("No more room for miners!");
					}
				}else{
				alert("Miners cost $"+mineCost+"!");
				}
			
		}
	}
	// CHECK: ArmyBase build button clicked? 	ctx.fillRect(5,25,75,50);
	if ( (((2*lOff)+buttonW <= touchx)&&(touchx <= (2*lOff)+(2*buttonW)))
		&&
	   ( (tOff <= touchy)&&(touchy <= tOff+buttonH)) )
	{
			if(buildings.length == 1){
				alert("You must build a mineshaft first to support your army!");
			}else if (buildings.length > 2){
				alert("Army Base already built!");
			}else if (pCreds >= armybaseCost){
					addBuilding(2);
			}else{
				alert("Army Bases cost: $"+armybaseCost+"!");
			}
		
	}
	
	if (buildings.length > 2){
		// CHECK: Army Base clicked?
		if ( ((buildings[2][0] <= touchx)&&(touchx <= buildings[2][0]+buildings[2][2]))
			&&
		   ( (buildings[2][1]-(buildings[2][3]/2) <= touchy)&&(touchy <= buildings[2][1])) )
		{
				if (pCreds >= soldierCost){
						addUnit(2);
				}else{
					alert("Soldiers cost $"+soldierCost+"!");
				}
			
		}
	}
	
}

function addUnit(type){

		unitX = buildings[type][0]+(buildings[type][2]/2);
		unitY = buildings[type][1]-(buildings[type][3]/2);
		k = units.length;
		
		// unit = [ x , y , w, act, speed, target, type]
		units[k] = [" ", " ", " ", " "];
		units[k][0] = unitX;
		units[k][1] = unitY;
		units[k][3] = 0; 						// Action stage

	if (type == 0){
		console.log("1 Logger bought!");

		//alert("One logger bought!");
		pCreds = pCreds - logCost;
		units[k][2] = unitW;

												// LOGGER
		units[k][4] = 1; 						// Movement speed
		units[k][5] = loggers; 					// Current target - the number of loggers = unharvested tree
		units[k][6] = 0; 						// Unit type 0=log,1=mine,2=farm
		units[k][7] = logAP;
		units[k][8] = logHP;
		loggers++;
	}
	
	if (type == 1){
		console.log("1 Miner bought!");
		//alert("One miner bought!");
		pCreds = pCreds - mineCost;
		//									// MINER
		units[k][2] = unitW+1;
		units[k][4] = 0.5; 					// Movement speed
		units[k][5] = miners; 				// Current target - the number of miners = unharvested rock
		units[k][6] = 1; 					// Unit type 0=log,1=mine,2=farm
		units[k][7] = minAP; 					// Value (Atk/Resource)
		units[k][8] = minHP;
		miners++;
		
	}
	
	if (type == 2){
		console.log("1 Soldier bought!");
		//alert("One soldier bought!");
		pCreds = pCreds - soldierCost;
		//									// SOLDIER
		units[k][2] = 2*unitW;
		units[k][4] = 1; 					// Movement speed
		units[k][5] = 0; 			// Current target - the number of miners = unharvested rock
		units[k][6] = 2; 					// Unit type 0=log,1=mine,2=SOLDIER
		units[k][7] = solAP; 					// Value (Atk/Resource)
		units[k][8] = solHP;
		soldiers++;
		
	}
	
}

function addEnemy(number){

	for (l = 0;l < number;l++){

		var edge = Math.floor(4*Math.random());
			// select a random distance (%) along that edge
			var edgeVal = Math.random();
			switch (edge){
				case 0:
					// Left edge
					enemyX = mapX;
					enemyY = mapY + (edgeVal*mapH);
					break;
				case 1:
					// Top edge
					enemyX = mapX + (edgeVal*mapW);
					enemyY = mapY;
					break;
				case 2:
					// Right edge
					enemyX = mapX + mapW;
					enemyY = mapY + (edgeVal*mapH);
					break;
				case 3:
					// Bottom edge
					enemyX = mapX + (edgeVal*mapW);
					enemyY = mapY + mapH;
					break;
			}
		
		console.log("1 level "+wave+" barbarian arrived!");

		k = enemies.length;
			
		// enemy = [ x , y , w, act, speed, target]
		enemies[k] = [" ", " ", " ", " "];
		enemies[k][0] = enemyX;
		enemies[k][1] = enemyY;
		enemies[k][2] = enemyW;
		enemies[k][3] = 0; 							// Action stage
													// BASIC ENEMY
		enemies[k][4] = 0.8; 						// Movement speed
		enemies[k][5] = units.length-1;	 			// Current target
		tEnemies++;
		
	}
	
}

function addBuilding(type){

	k = buildings.length;
	bX = buildings[k-1][0]+buildings[k-1][2];
	bY = buildings[k-1][1];
	
	
	// unit = [ x , y , w, act, speed, target, type]
	buildings[k] = [" ", " ", " ", " "];
	buildings[k][0] = bX;
	buildings[k][1] = bY;
	buildings[k][2] = bW;
	buildings[k][3] = bH; 					
	buildings[k][4] = type; 						
	if (type == 1){
		console.log("1 mineshaft bought!");
		pCreds = pCreds - mineshaftCost;
	}else{
		console.log("1 army base bought!");
		pCreds = pCreds - armybaseCost;
	}
}

function resetVars(){

	setupTrees(); 						// Setup the array of trees
	setupRocks(); 						// Setup the array of rocks
	setupBuildings(); 					// Setup the array of buildings
	setupUnits(); 						// Setup units in game
	//setupEnemies();						// Setup enemies in game
	
}

function setupTrees(){

	console.log((forestNum*forestSize)+" trees added");
	var k = 0;
	for (i=0;i<forestNum;i++){
	
		forestX = mapX + Math.max(Math.random()*mapW-forestSpacing,0);
		forestY = mapY + Math.max(Math.random()*mapH+forestSpacing,0);
	
		for (j=0;j<forestSize;j++){
		
			trees[k] = [" ", " ", " "];
			trees[k][0] = forestX + forestSpacing*Math.random();
			trees[k][1] = forestY + forestSpacing*Math.random();
			trees[k][2] = 0;	// Targeted
			k = k + 1;
			
		}
	
	}

}

function setupRocks(){

	console.log((moundNum*moundSize)+" rocks added");
	var k = 0;
	for (i=0;i<moundNum;i++){
	
		moundX = mapX + Math.max(Math.random()*mapW-moundSpacing,0);
		moundY = mapY + Math.max(Math.random()*mapH-moundSpacing,0);
	
		for (j=0;j<moundSize;j++){
			rocks[k] = [" ", " ", " "];
			rocks[k][0] = moundX + moundSpacing*Math.random();
			rocks[k][1] = moundY + moundSpacing*Math.random();
			rocks[k][2] = 0;	// Targeted
			k = k + 1;
			
		}
	
	}

}

function setupBuildings(){

	var k = 0;
	
	buildingX = mapX + Math.max(0.5*Math.random()*mapW - buildingW,0);
	buildingY = mapY + Math.max(0.5*Math.random()*mapH + buildingH,0);
	
	buildings[k] = [" ", " ", " ", " ", " "];
	buildings[k][0] = buildingX;
	buildings[k][1] = buildingY;
	buildings[k][2] = buildingW;
	buildings[k][3] = buildingH;
	buildings[k][4] = 0; 						// Logger Hut
	
	k = k + 1;

}

function setupUnits(){
	
	for (k=0;k<unitNum;k++){

		// RANDOM unitX = mapX + Math.random()*mapW;
		// RANDOM unitY = mapY + Math.random()*mapH;
		
		unitX = buildings[0][0]+(buildings[0][2]/2);
		unitY = buildings[0][1]-(buildings[0][3]/2);
		
		// unit = [ x , y , w, act, speed, target, type]
		units[k] = [" ", " ", " ", " "];
		units[k][0] = unitX;
		units[k][1] = unitY;
		units[k][2] = unitW;
		units[k][3] = 0; 						// Action stage
												// LOGGER
		units[k][4] = 1; 						// Movement speed
		units[k][5] = loggers; 					// Current target
		units[k][6] = 0; 						// Unit type 0=log,1=mine,2=farm
		units[k][7] = logAP; 						// Value (Atk/Resource)
		units[k][8] = logHP;
		loggers++;
		console.log("1 Logger added!");
				
	}

}

function setupEnemies(){
	
	for (k=0;k<enemyNum;k++){

		// choose random map edge
		var edge = Math.floor(4*Math.random());
		// select a random distance (%) along that edge
		var edgeVal = Math.random();
		switch (edge){
			case 0:
				// Left edge
				enemyX = mapX;
				enemyY = mapY + (edgeVal*mapH);
				break;
			case 1:
				// Top edge
				enemyX = mapX + (edgeVal*mapW);
				enemyY = mapY;
				break;
			case 2:
				// Right edge
				enemyX = mapX + mapW;
				enemyY = mapY + (edgeVal*mapH);
				break;
			case 3:
				// Bottom edge
				enemyX = mapX + (edgeVal*mapW);
				enemyY = mapY + mapH;
				break;
		}

		// enemy = [ x , y , w, act, speed, target]
		enemies[k] = [" ", " ", " ", " "];
		enemies[k][0] = enemyX;
		enemies[k][1] = enemyY;
		enemies[k][2] = enemyW;
		enemies[k][3] = 0; 						// Action stage
												// BASIC ENEMY
		enemies[k][4] = 0.8; 						// Movement speed
		enemies[k][5] = 0;	 					// Current target
		tEnemies++;
		console.log("A level "+wave+" barbarian arrived!");
		
	}

}

function drawCycle(){
	/*if (units.length<=0){
		lose();
		clearTimeout(tOut);
		return false;
	}*/
	time = time + (refreshRate/1000);
												// Each cycle
    bg(); 										// Draw BG first (grass)
	
	drawTrees(); 								// Draw trees
    drawRocks(); 								// Draw rocks
	drawBuildings(); 							// Draw buildings
	unitsAct();									// Handle unit actions
	drawUnits();								// Draw units
	enemiesAct();
	drawEnemies();
	screenElements();							// Draw HUD
	if (units.length >= 1){
		tOut=setTimeout(function(){drawCycle()},refreshRate); // Refresh
	}else{
		clearTimeout(tOut);
		lose();
	}
}

function bg(){

    ctx.fillStyle = grsCol;
    ctx.fillRect(0,0,c.width,c.height);
		 
}

function drawTrees(){
	
	ctx.lineWidth=2;
	
	for (k = 0;k<treeNum;k++){
		
		// Draw trunk - a vertical line of height = treeH
		ctx.beginPath();
		ctx.strokeStyle = barkCol;
		ctx.moveTo(trees[k][0], trees[k][1]);
		ctx.lineTo(trees[k][0], trees[k][1]+treeH);
		ctx.stroke();
		// Draw leaves - a block wider but shorter than the trunk
		ctx.fillStyle = leafCol;
		ctx.fillRect(trees[k][0]-(treeH/5), trees[k][1], (2*treeH/5), (3*treeH/5));
	
	}
	
}

function drawRocks(){
		
	for (k = 0;k<rockNum;k++){
		
		// Draw a large block in colour 1
		ctx.fillStyle = rockCol;
		ctx.fillRect(rocks[k][0], rocks[k][1], rockH, rockH);
		ctx.beginPath();
		ctx.arc(rocks[k][0]+rockH/2,rocks[k][1]+(rockH/2),rockH/2,0,2*Math.PI,false);
		ctx.fill();
		ctx.closePath();
		// Overlay a smaller block in colour 2
		ctx.fillStyle = rock2Col;
		ctx.fillRect(rocks[k][0]-2, rocks[k][1]+2, rockH-4, rockH-4);
		// Draw a twinkle line through (seam of gold)
		ctx.beginPath();
		ctx.moveTo(rocks[k][0]+0.5*rockH, rocks[k][1]+0.5*rockH);
		ctx.lineTo(rocks[k][0]+0.25*rockH, rocks[k][1]+0.25*rockH);
		ctx.stroke();
	
	}
	
}

function drawBuildings(){
	
	ctx.strokeStyle = pBuildCol;
	ctx.lineWidth = 3;
	
	for (k = 0;k<buildings.length;k++){
			
		bX = buildings[k][0];
		bY = buildings[k][1];
		bW = buildings[k][2];
		bH = buildings[k][3];
		
		if (buildings[k][4] == 0){
			if (pCreds >= logCost){
				ctx.fillStyle = "#0000FF";
			}else{
				ctx.fillStyle = "#993300";
			}
			// Draw a pointed roof (inverted Y-axis)
			ctx.beginPath();
			ctx.moveTo(bX, bY - (bH/2));
			ctx.lineTo(bX+(bW/2),bY-bH);
			ctx.lineTo(bX+bW,bY-(bH/2));
			ctx.lineTo(bX,bY-(bH/2));
			ctx.stroke();
			ctx.fill();
			
		}else if (buildings[k][4] == 1){
			if (pCreds >= mineCost){
				ctx.fillStyle = "#0000FF";
			}else{
				ctx.fillStyle = "#669999";
			}
		
		}else{
			if (pCreds >= soldierCost){
				ctx.fillStyle = "#0000FF";
			}else{
				ctx.fillStyle = "#66FF00";
			}
		
		
		}
		
		// Draw a block in the main player colour
		ctx.fillRect(bX, bY-(bH/2), bW, bH/2);
		ctx.strokeRect(bX, bY-(bH/2), bW, bH/2);
		
	}
	
}

function unitsAct(){

	ctx.font = cashFont;
	ctx.fillStyle = cashCol;
	working = 0;
	
	for (k = 0;k<units.length;k++){

		switch (units[k][3]){
		
			case 0:
				// find resource
				target = units[k][5];
				// Define target by type [k][6]
				if (units[k][6] == 0){
					/* TEST!
						var closestDis = 2000;
						var closestInd = 0;
						for (n = 0; n < trees.length; n++){
							
							if (trees[n][2] == 0){
								
								xDif = units[k][0] - trees[n][0];
								yDif = units[k][0] - trees[n][0];
								testDis = Math.sqrt( (xDif*xDif) + (yDif*yDif) );
								if (testDis < closestDis){
									closestDis = testDis;
									closestInd = n;
									
								}
								
							}
						
						}
					trees[closestInd][2] = 1;
					xDif = units[k][0] - trees[closestInd][0];
					yDif = units[k][0] - trees[closestInd][0];
					// TEST! */
					xDif = units[k][0] - trees[target][0];
					yDif = units[k][1] - trees[target][1];
				}else if (units[k][6] == 1){
					xDif = units[k][0] - rocks[target][0];
				    yDif = units[k][1] - rocks[target][1];        
				}else{
					if (enemies.length > 0){
						xDif = units[k][0] - enemies[enemies.length-1][0];
						yDif = units[k][1] - enemies[enemies.length-1][1];
					}else{
						break;
					}
				}
				distance = Math.sqrt( (xDif*xDif) + (yDif*yDif) );
				if (distance < 2) {
					units[k][3] = 1;
				}else{
					if (xDif > 1){
						units[k][0] += -1*units[k][4];
					}
					if (xDif < -1){
						units[k][0] += units[k][4];
					}					
					if (yDif > 1){
						units[k][1] += -1*units[k][4];
					}
					if (yDif < -1){
						units[k][1] += units[k][4];
					}
				}
				break;
			
			case 1:
				if (units[k][6] == 2){
					// KILL!
					if (enemies.length > 0){
						console.log("Barbarian "+wave+"-"+(enemies.length-1)+" died! Earned $"+killCred+"!");
						ctx.fillText("$"+killCred+" found!", units[k][0], units[k][1]);
						pCreds = pCreds + killCred;
						enemies.length = enemies.length - 1;
						
					}
					units[k][3] = 0;
					
				}else{
					// pCreds/frame = Val * (refreshRate/1000);
					earned = units[k][7]*(refreshRate/1000);
					pCreds = pCreds + earned;
					totalCreds = totalCreds + earned;
					earned = Math.floor(1000 * earned)/50;			
					ctx.fillText("$"+earned+"/s", units[k][0], units[k][1]);
					// If the number earned is divisible by 50 - spawn another wave!
					wave = Math.floor(time / 60);
					if ((Math.floor(time) % 60 == 0) && (enemies.length < wave*enemyNum)){
						addEnemy(1);
					}	
				}
				break;
			
			case 2:
				// harvest
				break;
		}
		
	}

}

function drawUnits(){
	wLog = 0;
	wMine = 0;
	ctx.fillStyle = pLogCol;
			
	for (k = 0;k<units.length;k++){

		ctx.beginPath();
		ctx.moveTo(units[k][0]+units[k][2],units[k][1]-(units[k][2]/2));
		ctx.arc(units[k][0],units[k][1],units[k][2],0,2*Math.PI,false);
		// If working
		if (units[k][3] == 1){
			ctx.fillStyle = pWorkCol;
			if (units[k][6] == 0){
				wLog++;
			}else if(units[k][6] == 1){
				wMine++;
			}else{
				ctx.fillText("Kill!", units[k][0], units[k][1]+unitW);
			}
		}else{
			// Colour by job
			if (units[k][6] == 0){
				  ctx.fillStyle = pLogCol;
			}else if (units[k][6] == 1){
				ctx.fillStyle = pMinCol;
			}else{
				ctx.fillStyle = "#FF0000";
				ctx.fillRect(units[k][0]-25,units[k][1]-20,50,5);
				ctx.fillStyle = "#00FF00";
				ctx.fillRect(units[k][0]-25,units[k][1]-20,Math.floor(units[k][8]/2),5);
				ctx.fillStyle = pSolCol;
			}
		}
		ctx.fill();
		ctx.closePath();
				
		
	}
	
}

function enemiesAct(){
	
	for (k = 0;k<enemies.length;k++){
		
			if (units.length >= 1){

				switch (enemies[k][3]){
				
					case 0:
						// find enemy
						//target = enemies[k][5];
						//target = units.length - 1;
						i = 1;
						do {
							target = units.length - i;
							i++;
						}
						while (units[target] == null);
						/* TEST
						var closestDis = 2000;
						var closestInd = 0;
						for (n = 0; n < units.length; n++){
								
								xDif = enemies[k][0] - units[n][0];
								yDif = enemies[k][0] - units[n][0];
								testDis = Math.sqrt( (xDif*xDif) + (yDif*yDif) );
								if (testDis < closestDis){
								
									closestDis = testDis;
									closestInd = n;
									
								}
								
						}
						units[closestInd][2] = 1;
						xDif = enemies[k][0] - units[closestInd][0];
						yDif = enemies[k][0] - units[closestInd][0];
						// END TEST */
						xDif = enemies[k][0] - units[target][0];
						yDif = enemies[k][1] - units[target][1];
						distance = Math.sqrt( (xDif*xDif) + (yDif*yDif) );
						if (distance < 1.5) {
							enemies[k][3] = 1;
							enemies[k][5] = target;
						}else{
							if (xDif > 1){
								enemies[k][0] += -1*enemies[k][4];
							}
							if (xDif < -1){
								enemies[k][0] += enemies[k][4];
							}					
							if (yDif > 1){
								enemies[k][1] += -1*enemies[k][4];
							}
							if (yDif < -1){
								enemies[k][1] += enemies[k][4];
							}
						}
						break;
					
					case 1:
						var tunit = enemies[k][5];
						if ((tunit == (units.length-1))&&(units[tunit][6] !== 2)){
							if (units[units.length-1][6] == 0){
								console.log("Logger - unit "+tunit+" died!");
								loggers--;
							}else if (units[units.length-1][6] == 1){
								console.log("Miner - unit "+tunit+" died!");
								miners--;
							}
							units.length = units.length - 1;
						}else {
							if (units[tunit] == null){
								enemies[k][3] = 0;
								break;
							}
							//if (units[tunit][6] == 2){
							units[tunit][8] = units[tunit][8] - ((0.1*wave)+1);
							console.log("Soldier - unit "+tunit+" - was hit! Loses "+((0.05*wave)+1)+"HP - now "+units[tunit][8]+"HP");
							if (units[tunit][8] <= 0){
								ctx.fillStyle = "#FF0000";
								ctx.fillText("!!! SOLDIER DIED !!!", units[tunit][0], units[tunit][1]+unitW);
								units.splice(tunit,1);
								soldiers--;
								console.log("Soldier - unit "+tunit+" died!");
								enemies[k][3] = 0;
							}
						}//else{
						//	enemies[k][3] = 0;
						//}
						enemies[k][3]=0;
						break;
					
					case 2:
						// harvest
						break;
				}
				
			}else{
				//lose();
				//clearTimeout(tOut);
				//return false;
			}

		}
	
	
}

function lose(){
    
    //var c = document.getElementById('canvas');
    //var ctx = c.getContext('2d');
    console.log("GAME OVER - YOU REACHED WAVE "+wave);
    ctx.clearRect(0, 0, c.width, c.height);  
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(0,0,c.width,c.height);
    ctx.font = '30pt Verdana';
    ctx.fillStyle = '#ffffff';
    ctx.fillText("YOU LOSE!" , (c.width/2)-100 , c.height/2);
	ctx.fillText("YOU REACHED WAVE "+wave,(c.width/2)-200 , (c.height/2)+40);
    //ctx.fillText("TAP TO RESTART.",midx-175,midy+50);
    //clearTimeout(tOut);
    //c.addEventListener("touchstart", doTouchStart, false);
   //c.addEventListener("mousedown", doClickStart, false);

}

function drawEnemies(){
	
	ctx.fillStyle = enemyCol;
			
	for (k = 0;k<enemies.length;k++){

		ctx.beginPath();
		ctx.moveTo(enemies[k][0]+enemies[k][2],enemies[k][1]-(enemies[k][2]/2));
		ctx.arc(enemies[k][0],enemies[k][1],enemies[k][2],0,2*Math.PI,false);
		ctx.fill();
		ctx.closePath();
		// If working
		if (enemies[k][3] == 1){
			ctx.fillText("Kill!", enemies[k][0], enemies[k][1]+enemyW);
		}

				
		
	}
	
}

function screenElements(){
	
	// The total number of resourcers
	var resourcers = units.length;
	// The number of loggers the player can buy
	var logBuy = Math.floor(pCreds/logCost);
	var mineBuy = Math.floor(pCreds/mineCost);
	var soldierBuy = Math.floor(pCreds/soldierCost);
	var mineshaftBuy = Math.floor(pCreds/mineshaftCost);
	var armybaseBuy = Math.floor(pCreds/armybaseCost);
	// Max number of loggers available
	var maxLog = trees.length;
	var text1 = "CASH $"+Math.floor(pCreds)+"   TOTAL $"+Math.floor(totalCreds)+"   TIME "+Math.floor(time)+"s   WAVE "+Math.floor(time / 60)+"   Next wave in "+(60-(Math.floor(time) % 60))+"s";
	var text2 = "LOG "+wLog+"/"+loggers+" ["+trees.length+"max]   MIN "+wMine+"/"+miners+" ["+rocks.length+"max]   SOL "+soldiers+"   NME "+Math.max(enemies.length-1,0)+"/"+tEnemies;

	if (mineshaftBuy > 0 && buildings.length < 2){
		ctx.fillStyle = "#0000FF";
	}else{
		ctx.fillStyle = "#222222";
	}
	ctx.fillRect(lOff,tOff,buttonW,buttonH);
	ctx.fillStyle = infoCol;
	ctx.font = btnFont;
	ctx.fillText("Buy Mine?",2*lOff,tOff+bFontSize);
	ctx.fillText("Cost: $"+mineshaftCost,2*lOff,tOff+2*bFontSize);
	ctx.fillText(mineshaftBuy+" avail", 2*lOff,tOff+3*bFontSize);
	
	if (armybaseBuy > 0 && buildings.length < 3){
		ctx.fillStyle = "#0000FF";
	}else{
		ctx.fillStyle = "#222222";
	}
	ctx.fillRect((2*lOff)+buttonW,tOff,buttonW,buttonH);
	ctx.fillStyle = infoCol;
	ctx.font = btnFont;
	ctx.fillText("Buy Army Base?",(3*lOff)+buttonW,tOff+bFontSize);
	ctx.fillText("Cost: $"+armybaseCost,(3*lOff)+buttonW,tOff+2*bFontSize);
	ctx.fillText(armybaseBuy+" avail",(3*lOff)+buttonW,tOff+3*bFontSize);
	
	ctx.font = statusFont;
	// Draw the city status bar
	ctx.fillText(text1, lOff, sFontSize);
	ctx.fillText(text2, lOff, 2*sFontSize-5);
	ctx.font = infoFont;
	// Display the number of loggers available to buy
	ctx.fillText(logBuy, buildings[0][0] + (buildings[0][2]/5), buildings[0][1]-10);
	if (buildings.length > 1){
		// Display the number of miners available to buy
		ctx.fillText(mineBuy, buildings[1][0] + (buildings[1][2]/5), buildings[1][1]-10);
	}
	if (buildings.length > 2){
		// Display the number of miners available to buy
		ctx.fillText(soldierBuy, buildings[2][0] + (buildings[2][2]/5), buildings[2][1]-10);
	}
}
