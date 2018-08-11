// create a new scene
let gameScene = new Phaser.Scene("Game");

let gui = {};
  // ROW 1
  gui.bankEl = document.getElementById('bankDisplay');
  gui.cashEl = document.getElementById('cashDisplay');
  gui.timeEl = document.getElementById('timeDisplay');
  gui.waveEl = document.getElementById('waveDisplay');
  gui.ctdEl = document.getElementById('countdownDisplay');
  // ROW 2
  gui.loggerEl = document.getElementById('loggerDisplay');
  gui.minerEl = document.getElementById('minerDisplay');
  gui.soldierEl = document.getElementById('soldierDisplay');
  gui.enemyEl = document.getElementById('enemyDisplay');
  gui.msgEl = document.getElementById('msgDisplay');

  // SET INITIAL VALS
  gui.bankEl.innerHTML = 'Bank: £0';
  gui.cashEl.innerHTML = 'Total: £0';
  gui.timeEl.innerHTML = 'Time: 0s';
  gui.waveEl.innerHTML = 'Wave: 0';
  gui.ctdEl.innerHTML = 'Next wave: 30s';

  gui.loggerEl.innerHTML = 'Jacks: 0/50';
  gui.minerEl.innerHTML = 'Miners: 0/50';
  gui.soldierEl.innerHTML = 'Soldiers: 0';
  gui.enemyEl.innerHTML = 'Enemies: 0';
  gui.msgEl.innerHTML = 'Game just started...';


// set inital parameters
gameScene.init = function(){

  // Set the terminating flag to false
  this.isTerminating = false;
  this.maxTreeCount = 50; // 5000 too many!
  this.maxRockCount = 50; // 5000 too many!
  this.bank = 100;
  this.total = 100;
  this.costs = {
    lumberjack: 10,
    miner: 50,
    soldier: 100
  }
  this.earnings = {
    lumberjack: 1,  //0.1,
    miner: 5        //0.5
  }
  this.soldierHealth = 50;
  this.wave = 0;
  this.time = 0;
  this.waveTime = 10;
  this.nextWave = this.waveTime;

};

// preload the assets
gameScene.preload = function(){

    
  // load background - 4 tiles
  this.load.image('bgSheet', '/assets/peepCommand/bg.png');

  // load lumberjack spritesheet
  this.load.spritesheet('lumberjack',
    '/assets/peepCommand/lumberjack.png',
    { frameWidth: 16, frameHeight: 16 }
  );

  // load miner spritesheet
  this.load.spritesheet('miner',
    '/assets/peepCommand/miner.png',
    { frameWidth: 16, frameHeight: 16 }
  );

  // load soldier spritesheet
  this.load.spritesheet('soldier',
    '/assets/peepCommand/soldier.png',
    { frameWidth: 16, frameHeight: 16 }
  );

  // load enemy spritesheet
  this.load.spritesheet('enemy',
    '/assets/peepCommand/enemy.png',
    { frameWidth: 16, frameHeight: 16 }
  );

  // load the logging hut
  this.load.image('logHut', '/assets/peepCommand/logHut.png');

  // load the logging hut
  this.load.image('mineHut', '/assets/peepCommand/mineHut.png');

  // load the army hut
  this.load.image('armyHut', '/assets/peepCommand/armyHut.png');

  // load the trees spritesheet
  this.load.spritesheet('trees',
    '/assets/peepCommand/trees.png',
    { frameWidth: 16, frameHeight: 16 }
  );

  this.load.spritesheet('tree1', '/assets/peepCommand/trees.png', {frameWidth: 16, frameHeight: 16, startFrame: 0, endFrame: 0});
  this.load.spritesheet('tree2', '/assets/peepCommand/trees.png', {frameWidth: 16, frameHeight: 16, startFrame: 1, endFrame: 1});
  this.load.spritesheet('tree3', '/assets/peepCommand/trees.png', {frameWidth: 16, frameHeight: 16, startFrame: 2, endFrame: 2});
  this.load.spritesheet('tree4', '/assets/peepCommand/trees.png', {frameWidth: 16, frameHeight: 16, startFrame: 3, endFrame: 3});

  // load the trees spritesheet
  this.load.spritesheet('rocks',
    '/assets/peepCommand/rocks.png',
    { frameWidth: 16, frameHeight: 16 }
  );


};

// called once after the preload method
gameScene.create = function(){

  // get the width and height dynamically
  this.gameW = this.sys.game.config.width;
  this.gameH = this.sys.game.config.height;
  this.centerX = this.gameW/2;
  this.centerY = this.gameH/2;

  const bg = this.add.tileSprite(this.centerX, this.centerY, this.gameW, this.gameH, 'bgSheet');

  // Harvestable elements
  this.addTrees();
  this.addRocks();

  // Units
  this.units = this.add.group();
  gameScene.addLumberjacks();    // ALSO LOG HUT
  this.units.addMultiple(this.jacks.getChildren());
  gameScene.addMiners();   // ALSO MINE HUT
  this.units.addMultiple(this.miners.getChildren());
  gameScene.addSoldiers();   // ALSO ARMY HUT
  this.units.addMultiple(this.soldiers.getChildren());

  gameScene.addEnemies();

};

// this is called up to 60 times per second
gameScene.update = function(){

  if (!this.isTerminating){

    Phaser.Actions.Call(this.jacks.getChildren(), function(jack){

      if (!jack.chopFlag){

        let xDiff = jack.x - jack.target.x;
        ( xDiff > 0 ) ? jack.flipX = true : jack.flipX = false;
        let yDiff = jack.y - jack.target.y;
        // Get the distance from the lumberjack to the tree
        dist = Math.sqrt( Math.pow(xDiff,2) + Math.pow(yDiff,2) );
        if (dist < 16){
          // reached target
          jack.chopFlag = true;
          jack.anims.play('lj_chop', true);
          //scoreText = this.add.text(jack.x, jack.y - 10, '£' + this.earnings.lumberjack + '/s', { fontSize: '9px', fill: '#ff0' });
        }else{
          // Get the x- and y-directions
        	var xDir = ( (jack.target.x - jack.x) / dist);
        	var yDir = ( (jack.target.y - jack.y) / dist);
        	let jack_speed = 0.5;
        	jack.x += xDir * jack_speed;
        	jack.y += yDir * jack_speed;
        }
      }else{
        // Add to cash
        this.bank += (this.earnings.lumberjack) / 60;  // 60 fps
        this.total += (this.earnings.lumberjack) / 60;

      }
    }, this);

    Phaser.Actions.Call(this.miners.getChildren(), function(miner){

      if (!miner.mineFlag){

        let xDiff = miner.x - miner.target.x;
        ( xDiff > 0 ) ? miner.flipX = true : miner.flipX = false;
        let yDiff = miner.y - miner.target.y;
        // Get the distance from the miner to the rock
        dist = Math.sqrt( Math.pow(xDiff,2) + Math.pow(yDiff,2) );
        if (dist < 16){
          // reached the target
          miner.mineFlag = true;
          miner.anims.play('mn_mine', true);
        }else{
          // Get the x- and y-directions
        	var xDir = ( (miner.target.x - miner.x) / dist);
        	var yDir = ( (miner.target.y - miner.y) / dist);
        	let miner_speed = 0.2;
        	miner.x += xDir * miner_speed;
        	miner.y += yDir * miner_speed;
        }
      }else{
        // Add to cash
        this.bank += (this.earnings.miner) / 60;  // 60 fps
        this.total += (this.earnings.miner) / 60;
      }
    }, this);

    Phaser.Actions.Call(this.soldiers.getChildren(), function(soldier){

      if (!soldier.atkFlag){

        if (this.enemies.getChildren().length !== 0){

          targetIndex = this.enemies.getChildren().length - 1;
          targetEnemy = this.enemies.getChildren()[targetIndex];

          let xDiff = soldier.x - targetEnemy.x;
          ( xDiff > 0 ) ? soldier.flipX = true : soldier.flipX = false;
          let yDiff = soldier.y - targetEnemy.y;
          // Get the distance from the miner to the rock
          dist = Math.sqrt( Math.pow(xDiff,2) + Math.pow(yDiff,2) );
          if (dist < 16){
            // reached the target
            soldier.atkFlag = true;
            soldier.anims.play('sl_atk', true);
          }else{
            // Get the x- and y-directions
          	var xDir = ( (targetEnemy.x - soldier.x) / dist);
          	var yDir = ( (targetEnemy.y - soldier.y) / dist);
          	let soldier_speed = 0.6;
          	soldier.x += xDir * soldier_speed;
          	soldier.y += yDir * soldier_speed;
          }
        }
      }else{
        // attacking
        if (this.enemies.getChildren().length !== 0){
          deadEnemy = this.enemies.getChildren()[this.enemies.getChildren().length - 1];
          this.enemies.remove(deadEnemy, true);
          soldier.atkFlag = false;
          soldier.anims.play('sl_walk', true);
        }
      }
    }, this);

    Phaser.Actions.Call(this.enemies.getChildren(), function(enemy){

      //if (!enemy.atkFlag && !this.isTerminating){
      if (!this.isTerminating){

        // Ensure target updated
        lastUnit = this.units.getChildren().length - 1;
        xTarget = this.units.getChildren()[lastUnit].x;
        yTarget = this.units.getChildren()[lastUnit].y;
        enemy.target = {};
        enemy.target.x = xTarget;
        enemy.target.y = yTarget;
        // Distance from enemy to target unit
        let xDiff = enemy.x - enemy.target.x;
        ( xDiff > 0 ) ? enemy.flipX = true : enemy.flipX = false;
        let yDiff = enemy.y - enemy.target.y;
        // Get the distance from the enemy to the unit
        dist = Math.sqrt( Math.pow(xDiff,2) + Math.pow(yDiff,2) );
        if (dist < 16){
          // reached the target
          //  enemy.atkFlag = true;
          enemyAttack(enemy);
          enemy.anims.play('en_atk', true);
        }else{
          // Get the x- and y-directions
        	var xDir = ( (enemy.target.x - enemy.x) / dist);
        	var yDir = ( (enemy.target.y - enemy.y) / dist);
        	let enemy_speed = 0.5;
        	enemy.x += xDir * enemy_speed;
        	enemy.y += yDir * enemy_speed;
        }
      }/*
      }else{
          // attacking unit

          let lastUnitIndex = this.units.getChildren().length - 1;
          let lastUnit = this.units.getChildren()[lastUnitIndex];

          if (this.jacks.contains(lastUnit)){
            //console.log('Jack destroyed');
            this.jacks.remove(lastUnit);
            this.units.remove(this.units.getChildren()[lastUnitIndex], true);
            enemy.atkFlag = false;
            this.cameras.main.shake(500);
          }else if (this.miners.contains(lastUnit)){
            //console.log('Miner destroyed');
            this.miners.remove(lastUnit);
            this.units.remove(this.units.getChildren()[lastUnitIndex], true);
            enemy.atkFlag = false;
            this.cameras.main.shake(500);
          }else if (this.soldiers.contains(lastUnit)){
            // REDUCE SOLDIER HEALTH
            //this.soldiers.remove(lastUnit);
            lastUnit.health -= enemy.damage;
            if (lastUnit.health <= 0){
              //console.log('Soldier destroyed');
              this.soldiers.remove(lastUnit);
              this.units.remove(this.units.getChildren()[lastUnitIndex], true);
              this.cameras.main.shake(500);
            }
          }

          if (this.units.getChildren().length == 0){
            return this.gameOver();
          }
      }*/
    }, this);

    gameScene.updateGUI();
  }

};

// Moving out to separate function
function enemyAttack(enemy){
  // attacking unit

  let lastUnitIndex = gameScene.units.getChildren().length - 1;
  let lastUnit = gameScene.units.getChildren()[lastUnitIndex];

  if (gameScene.jacks.contains(lastUnit)){
    //console.log('Jack destroyed');
    gameScene.jacks.remove(lastUnit);
    gameScene.units.remove(gameScene.units.getChildren()[lastUnitIndex], true);
    //enemy.atkFlag = false;
    gameScene.cameras.main.shake(500);
  }else if (gameScene.miners.contains(lastUnit)){
    //console.log('Miner destroyed');
    gameScene.miners.remove(lastUnit);
    gameScene.units.remove(gameScene.units.getChildren()[lastUnitIndex], true);
    //enemy.atkFlag = false;
    gameScene.cameras.main.shake(500);
  }else if (gameScene.soldiers.contains(lastUnit)){
    // REDUCE SOLDIER HEALTH
    //this.soldiers.remove(lastUnit);
    lastUnit.health -= enemy.damage;
    if (lastUnit.health <= 0){
      //console.log('Soldier destroyed');
      gameScene.soldiers.remove(lastUnit);
      gameScene.units.remove(gameScene.units.getChildren()[lastUnitIndex], true);
      gameScene.cameras.main.shake(500);
    }
  }

  if (gameScene.units.getChildren().length == 0){
    return gameScene.gameOver();
  }
}

gameScene.updateGUI = function(){

  // Timings form part of the GUI
  this.time += 1/60;
  this.nextWave -= 1/60;
  if (this.nextWave <= 0){
    this.wave += 1;
    this.nextWave = this.waveTime;
    gameScene.spawnNextWave();
  }
  // Update GUI
  gui.bankEl.innerHTML = 'Bank: £' + Math.floor(this.bank);
  gui.cashEl.innerHTML = 'Total: £' + Math.floor(this.total);
  gui.timeEl.innerHTML = 'Time: ' + Math.floor(this.time) + 's';
  gui.waveEl.innerHTML = 'Wave: ' + this.wave;
  gui.ctdEl.innerHTML = 'Next wave: ' + Math.floor(this.nextWave) + 's';
  //
  gui.loggerEl.innerHTML = 'Jacks: ' + this.jacks.getChildren().length + '/' + this.maxTreeCount;
  gui.minerEl.innerHTML = 'Miners: ' + this.miners.getChildren().length + '/' + this.maxRockCount;
  gui.soldierEl.innerHTML = 'Soldiers: ' + this.soldiers.getChildren().length;
  gui.enemyEl.innerHTML = 'Enemies: ' + this.enemies.getChildren().length;

};

gameScene.spawnNextWave = function(){

  enemyCount = this.wave;
  gui.msgEl.innerHTML = 'Wave ' + this.wave + ' - ' + (enemyCount + 1) + ' enemies!';

  newEnemies = this.add.group({
    key: 'enemy',           // Which sprite to use
    repeat: enemyCount,     // How many to add
    setXY: {
      x: 0,
      y: 0
    }
  });

  lastUnit = this.units.getChildren().length - 1;
  xTarget = this.units.getChildren()[lastUnit].x;
  yTarget = this.units.getChildren()[lastUnit].y;

  Phaser.Actions.Call(newEnemies.getChildren(), function(enemy){
    // 0=T, 1=B, 2=L, 3=R
    let edge = Math.floor(Math.random() * 4);
    let percent = Math.floor(Math.random() * 100);
    switch (edge){
      case 0:
        // Top edge
        enemy.y = 0;
        enemy.x = Math.floor( (percent * this.gameW) / 100);
        break;
      case 1:
        // Bottom edge
        enemy.y = this.gameH;
        enemy.x = Math.floor( (percent * this.gameW) / 100);
        break;
      case 2:
        // Left edge
        enemy.x = 0;
        enemy.y = Math.floor( (percent * this.gameH) / 100);
        break;
      case 3:
        // Right edge
        enemy.x = this.gameW;
        enemy.y = Math.floor( (percent * this.gameH) / 100);
        break;
    }

    enemy.target = {};
    enemy.target.x = xTarget;
    enemy.target.y = yTarget;
    enemy.atkFlag = false;  // Whether attacking
    enemy.damage = (0.1 * this.wave) + 1;
    enemy.anims.play('en_walk', true);

  }, this);

  this.enemies.addMultiple(newEnemies.getChildren());

}

// what happens on game end
gameScene.gameOver = function(){

  // set this game to be terminating
  this.isTerminating = true;

  // shake the camera
  this.cameras.main.shake(500);

  // listen for camera shake completion
  this.cameras.main.on('camerashakecomplete', function(camera, effect){
    // THEN fade the camera
    this.cameras.main.fade(500);
  }, this);

  // listen for camera fade completion
  this.cameras.main.on('camerafadeoutcomplete', function(camera, effect){
    this.cameras.main.resetFX();
    // shaken and faded, now restart
    var gameOverGraphics = this.add.graphics({ fillStyle: { color: 0xff0000 } });
    gameOverGraphics.fillRect(0,0,this.gameW,this.gameH);
    this.add.text(this.centerX/2, this.centerY/2, 'GAME OVER\nYou reached wave ' + this.wave + '\nGAME RESTARTING!', { fontSize: '30px', fill: '#fff' });

    window.setTimeout(function(){ gameScene.scene.restart(); }, 3000);

  }, this);

};

function outsideCenter(checkVal, centerVal, borderVal){
  let returnVal = (checkVal < centerVal - borderVal) || (checkVal > centerVal + borderVal);
  return returnVal;
}

function tryAddMiner(){

  if (gameScene.bank >= gameScene.costs.miner){

    if (gameScene.miners.getChildren().length < gameScene.maxRockCount){
      gameScene.bank -= gameScene.costs.miner;
      var newMiner = gameScene.add.sprite(mineHut.x, mineHut.y, 'miner');
      newMiner.target = {};
      targetIndex = gameScene.miners.getChildren().length;
      newMiner.target.x = gameScene.rocks.getChildren()[targetIndex].x;
      newMiner.target.y = gameScene.rocks.getChildren()[targetIndex].y;
      newMiner.mineFlag = false;  // Whether mining
      newMiner.anims.play('mn_walk', true);
      gameScene.miners.add(newMiner);
      gameScene.units.add(newMiner);

    }else{
      gui.msgEl.innerHTML = 'Too many miners!';
    }
  }else{
    gui.msgEl.innerHTML = 'Not enough cash for miners!';
  }
}


function tryAddJack(){

  if (gameScene.bank >= gameScene.costs.lumberjack){

    if (gameScene.jacks.getChildren().length < gameScene.maxTreeCount){
      gameScene.bank -= gameScene.costs.lumberjack;
      var newJack = gameScene.add.sprite(logHut.x, logHut.y, 'lumberjack');
      newJack.target = {};
      targetIndex = gameScene.jacks.getChildren().length;
      newJack.target.x = gameScene.trees.getChildren()[targetIndex].x;
      newJack.target.y = gameScene.trees.getChildren()[targetIndex].y;
      newJack.chopFlag = false;  // Whether chopping
      newJack.anims.play('lj_walk', true);

      gameScene.jacks.add(newJack);

      gameScene.units.add(newJack);
      //console.log(gameScene.units);

    }else{
      gui.msgEl.innerHTML = 'Too many lumberjacks!';
    }
  }else{
    gui.msgEl.innerHTML = 'Not enough cash for lumberjacks!';
  }
}

function tryAddSoldier(){

  if (gameScene.bank >= gameScene.costs.soldier){

      gameScene.bank -= gameScene.costs.soldier;
      var newSoldier = gameScene.add.sprite(soldierHut.x, soldierHut.y, 'soldier');
      newSoldier.target = {};
      /* SOLDIER TARGETING IN UPDATE LOOP
      targetIndex = gameScene.jacks.getChildren().length;
      newJack.target.x = gameScene.trees.getChildren()[targetIndex].x;
      newJack.target.y = gameScene.trees.getChildren()[targetIndex].y;*/
      newSoldier.atkFlag = false;  // Whether chopping
      newSoldier.anims.play('sl_walk', true);
      newSoldier.health = this.soldierHealth;

      gameScene.soldiers.add(newSoldier);

      gameScene.units.add(newSoldier);

  }else{
    gui.msgEl.innerHTML = 'Not enough cash for soldiers!';
  }
}

gameScene.addTrees = function(){

  // -----------------------
  // TREES
  // -----------------------
  this.trees = this.add.group({
    key: 'trees', // Which sprite to use
    repeat: this.maxTreeCount - 1,    // How many times to repeat
    setXY: {
      x: 1,
      y: 1
    }
  });
  // Call a function for each tree in the group
  Phaser.Actions.Call(this.trees.getChildren(), function(tree){
    // randomly flip some flipX
    (Math.random() > 0.5) ? tree.flipX = true : null;
    tree.key = 'tree' + Phaser.Math.Between(1, 4);  // Not working - fix
    let xVal = this.centerX;
    let yVal = this.centerY;
    let spacing = 50;
    while (
      !(outsideCenter(xVal, this.centerX, spacing))
      &&
      !(outsideCenter(yVal, this.centerY, spacing))
    ){
        xVal = Phaser.Math.Between(10, this.gameW - spacing);
        yVal = Phaser.Math.Between(10, this.gameH - spacing);
    }
      tree.x = xVal;
      tree.y = yVal;
      tree.scale = Phaser.Math.Between(0.5, 3);
  }, this);

}

gameScene.addRocks = function(){

  // -----------------------
  // ROCKS
  // -----------------------
  this.rocks = this.add.group({
    key: 'rocks', // Which sprite to use
    repeat: this.maxRockCount - 1,    // How many times to repeat
    setXY: {
      x: 1,
      y: 1
    }
  });
  // Call a function for each rock in the group
  Phaser.Actions.Call(this.rocks.getChildren(), function(rock){
    // randomly flip some flipX
    (Math.random() > 0.5) ? rock.flipX = true : null;
    //rock.key = 'tree' + Phaser.Math.Between(1, 4);
    let xVal = this.centerX;
    let yVal = this.centerY;
    let spacing = 50;
    while (
      !(outsideCenter(xVal, this.centerX, spacing))
      &&
      !(outsideCenter(yVal, this.centerY, spacing))
    ){
        xVal = Phaser.Math.Between(10, this.gameW - spacing);
        yVal = Phaser.Math.Between(10, this.gameH - spacing);
    }
    rock.x = xVal;
    rock.y = yVal;
  }, this);

}

gameScene.addLumberjacks = function(){

  // -----------------------
  // LUMBERJACK ANIMATIONS
  // -----------------------

    // Walk
    this.anims.create({
      key: 'lj_walk',
      frames: this.anims.generateFrameNumbers('lumberjack', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    });
    // Chop
    this.anims.create({
      key: 'lj_chop',
      frames: this.anims.generateFrameNumbers('lumberjack', { start: 4, end: 8 }),
      frameRate: 10,
      repeat: -1
    });

  // lumberjack start position - logHut
  logHut = {
    x: this.centerX - 30,
    y: this.centerY
  };
  var loggingHut = this.add.sprite(logHut.x, logHut.y, 'logHut').setScale(2);
  loggingHut.setInteractive();
  loggingHut.on('pointerdown', tryAddJack); // THIS WORKS

  // starting off with 5 lumberjacks
  // this.jacks = this.add.group();
  this.jacks = this.add.group({
    key: 'lumberjack',  // Which sprite to use
    repeat: 4,          // add 5 jacks
    setXY: {
      x: logHut.x,
      y: logHut.y
    }
  });
  // Call a function for each lumberjack in the group
  let index = 0;
  Phaser.Actions.Call(this.jacks.getChildren(), function(jack){
    jack.target = {};
    jack.target.x = this.trees.getChildren()[index].x;
    jack.target.y = this.trees.getChildren()[index].y;
    jack.chopFlag = false;  // Whether chopping
    jack.anims.play('lj_walk', true);
    index++;
  }, this);

}

gameScene.addMiners = function(){

  // -----------------------
  // MINER ANIMATIONS
  // -----------------------

    // Walk
    this.anims.create({
      key: 'mn_walk',
      frames: this.anims.generateFrameNumbers('miner', { start: 0, end: 3 }),
      frameRate: 5,
      repeat: -1
    });

    // Mine
    this.anims.create({
      key: 'mn_mine',
      frames: this.anims.generateFrameNumbers('miner', { start: 4, end: 8 }),
      frameRate: 5,
      repeat: -1
    });

    // miners start position - mineHut
    mineHut = {
      x: this.centerX + 30,
      y: this.centerY
    };
    var miningHut = this.add.sprite(mineHut.x, mineHut.y, 'mineHut').setScale(2);
    miningHut.setInteractive();
    miningHut.on('pointerdown', tryAddMiner);

    this.miners = this.add.group();

}

gameScene.addSoldiers = function(){

  // -----------------------
  // SOLDIER ANIMATIONS
  // -----------------------

    // Walk
    this.anims.create({
      key: 'sl_walk',
      frames: this.anims.generateFrameNumbers('soldier', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    });

    // Attack
    this.anims.create({
      key: 'sl_atk',
      frames: this.anims.generateFrameNumbers('soldier', { start: 4, end: 8 }),
      frameRate: 10,
      repeat: -1
    });

    soldierHut = {
      x: this.centerX,
      y: this.centerY
    };
    var armyHut = this.add.sprite(soldierHut.x, soldierHut.y, 'armyHut').setScale(2.5,2);
    armyHut.setInteractive();
    armyHut.on('pointerdown', tryAddSoldier); // THIS WORKS

    this.soldiers = this.add.group();

}

gameScene.addEnemies = function(){

  // -----------------------
  // ENEMY ANIMATIONS
  // -----------------------

    // Walk
    this.anims.create({
      key: 'en_walk',
      frames: this.anims.generateFrameNumbers('enemy', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    });

    // Attack
    this.anims.create({
      key: 'en_atk',
      frames: this.anims.generateFrameNumbers('enemy', { start: 4, end: 8 }),
      frameRate: 10,
      repeat: -1
    });

    this.enemies = this.add.group();

}

// set the config of the Game
let config = {
  type: Phaser.AUTO,  // Phaser will use WebGL if available, Canvas otherwise
  width: 640,
  height: 360,
  scene: gameScene
};

// create a new game, passing the config
let game = new Phaser.Game(config);
