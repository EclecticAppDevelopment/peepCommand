// create a new scene
let gameScene = new Phaser.Scene("Game");

//let modalBg = null;
//let modalText = null;

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

  gui.loggerEl.innerHTML = 'Loggers: 0/50';
  gui.minerEl.innerHTML = 'Miners: 0/50';
  gui.soldierEl.innerHTML = 'Soldiers: 0';
  gui.enemyEl.innerHTML = 'Enemies: 0';
  gui.msgEl.innerHTML = '&nbsp;';


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
    solider: 100
  }
  this.earnings = {
    lumberjack: 1,  //0.1,
    miner: 5        //0.5
  }
  this.wave = 0;
  this.time = 0;
  this.nextWave = 60;

};

// preload the assets
gameScene.preload = function(){

  // load background - 4 tiles
  this.load.image('bgSheet', 'assets/bg.png');

  // load lumberjack spritesheet
  this.load.spritesheet('lumberjack',
    'assets/lumberjack.png',
    { frameWidth: 16, frameHeight: 16 }
  );

  // load miner spritesheet
  this.load.spritesheet('miner',
    'assets/miner.png',
    { frameWidth: 16, frameHeight: 16 }
  );

  // load soldier spritesheet
  this.load.spritesheet('soldier',
    'assets/soldier.png',
    { frameWidth: 16, frameHeight: 16 }
  );

  // load enemy spritesheet
  this.load.spritesheet('enemy',
    'assets/enemy.png',
    { frameWidth: 16, frameHeight: 16 }
  );

  // load the logging hut
  this.load.image('logHut', 'assets/logHut.png');

  // load the logging hut
  this.load.image('mineHut', 'assets/mineHut.png');

  // load the trees spritesheet
  this.load.spritesheet('trees',
    'assets/trees.png',
    { frameWidth: 16, frameHeight: 16 }
  );

  this.load.spritesheet('tree1', 'assets/trees.png', {frameWidth: 16, frameHeight: 16, startFrame: 0, endFrame: 0});
  this.load.spritesheet('tree2', 'assets/trees.png', {frameWidth: 16, frameHeight: 16, startFrame: 1, endFrame: 1});
  this.load.spritesheet('tree3', 'assets/trees.png', {frameWidth: 16, frameHeight: 16, startFrame: 2, endFrame: 2});
  this.load.spritesheet('tree4', 'assets/trees.png', {frameWidth: 16, frameHeight: 16, startFrame: 3, endFrame: 3});

  // load the trees spritesheet
  this.load.spritesheet('rocks',
    'assets/rocks.png',
    { frameWidth: 16, frameHeight: 16 }
  );


};

// called once after the preload method
gameScene.create = function(){

  // get the width and height dynamically
  let gameW = this.sys.game.config.width;
  let gameH = this.sys.game.config.height;

  const bg = this.add.tileSprite(gameW/2, gameH/2, gameW, gameH, 'bgSheet');


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
    tree.key = 'tree' + Phaser.Math.Between(1, 4);
    let xVal = gameW/2;
    let yVal = gameH/2;
    let spacing = 50;
    while (
      !(outsideCenter(xVal, gameW/2, spacing))
      &&
      !(outsideCenter(yVal, gameH/2, spacing))
    ){
        xVal = Phaser.Math.Between(10, gameW - spacing);
        yVal = Phaser.Math.Between(10, gameH - spacing);
    }
      tree.x = xVal;
      tree.y = yVal;
      tree.scale = Phaser.Math.Between(0.5, 3);

    /*while (
        !(
          (xVal < gameW/2 - spacing) ||
          (xVal > gameW/2 + spacing)
        ) && !(
          (yVal < gameH/2 - spacing) ||
          (yVal > gameH/2 + spacing)
        )
      ){
          xVal = Phaser.Math.Between(10, gameW - 10);
          yVal = Phaser.Math.Between(10, gameH - 10);
      }
      tree.x = xVal;
      tree.y = yVal;
    //tree.x = Phaser.Math.Between(10, gameW - 10);
    //tree.y = Phaser.Math.Between(10, gameH - 10);
    tree.scale = Phaser.Math.Between(0.5, 3);*/
  }, this);


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
  // Call a function for each tree in the group
  Phaser.Actions.Call(this.rocks.getChildren(), function(rock){
    // randomly flip some flipX
    (Math.random() > 0.5) ? rock.flipX = true : null;
    //rock.key = 'tree' + Phaser.Math.Between(1, 4);
    let xVal = gameW/2;
    let yVal = gameH/2;
    let spacing = 50;
    /*while (
        !(
          (xVal < gameW/2 - spacing) ||
          (xVal > gameW/2 + spacing)
        ) && !(
          (yVal < gameH/2 - spacing) ||
          (yVal > gameH/2 + spacing)
        )
      ){*/
      while (
        !(outsideCenter(xVal, gameW/2, spacing))
        &&
        !(outsideCenter(yVal, gameH/2, spacing))
      ){
          xVal = Phaser.Math.Between(10, gameW - spacing);
          yVal = Phaser.Math.Between(10, gameH - spacing);
      }
      rock.x = xVal;
      rock.y = yVal;
    //rock.x = Phaser.Math.Between(10, gameW - 10);
    //rock.y = Phaser.Math.Between(10, gameH - 10);
    //rock.setScale(Phaser.Math.Between(1, 3) / 2);
  }, this);


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
    x: gameW/2 - 16,
    y: gameH/2
  };
  var loggingHut = this.add.sprite(logHut.x, logHut.y, 'logHut').setScale(2);
  loggingHut.setInteractive();
  loggingHut.on('pointerdown', tryAddJack); // THIS WORKS

  this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
      gameObject.x = dragX;
      gameObject.y = dragY;
  });

  //loggingHut.on('pointerdown', showLoggerModal); // WORKS - ABANDONING
  //loggingHut.on('pointerover', showLoggerModal);  // WORKS - ABANDONING
  //loggingHut.on('pointerout', hideLoggerModal);   // WORKS - ABANDONING

  /*
  loggingHut.inputEnabled = true;
    //Uncaught TypeError: loggingHut.input.pointerOver is not a function
  if (loggingHut.input.pointerOver()){
    console.log('Hovering over logging hut');
  }
  */
  /*
  loggingHut.inputEnabled = true;
    // Uncaught TypeError: Cannot read property 'onInputOver' of undefined
  this.input.on('mouseover', showLoggerModal);
  loggingHut.events.onInputOut.add(hideLoggerModal, this);
  */
  //loggingHut.on('mouseover', showLoggerModal);// Does nothing
  //loggingHut.on('mouseenter', showLoggerModal);// Does nothing
  //loggingHut.on('mousedown', showLoggerModal);// Does nothing
  //console.log(loggingHut.eventNames());
  /*
  if (loggingHut.on('mouseenter')){
    console.log('Hovering over logging hut');
    showLoggerModal();
  }
  */

  /*this.input.setDraggable(loggingHut);
  this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
      gameObject.x = dragX;
      gameObject.y = dragY;
  });*/

  /*this.jacks = this.add.group({
    key: 'lumberjack', // Which sprite to use
    repeat: 4,  //this.maxTreeCount - 2,    // TESTING
    //repeat: 25,    // How many times to repeat
    setXY: {
      x: logHut.x,
      y: logHut.y
    }
  });*/
  this.jacks = this.add.group();

  /*
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
  */

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
    //var miner_walk = this.add.sprite(100, 200, 'miner').setScale(4);
    //miner_walk.anims.play('mn_walk');

    // Mine
    this.anims.create({
      key: 'mn_mine',
      frames: this.anims.generateFrameNumbers('miner', { start: 4, end: 8 }),
      frameRate: 5,
      repeat: -1
    });
    //var miner_mine = this.add.sprite(200, 200, 'miner').setScale(4);
    //miner_mine.anims.play('mn_mine');

    // miners start position - logHut
    mineHut = {
      x: gameW/2 + 16,
      y: gameH/2
    };
    var miningHut = this.add.sprite(mineHut.x, mineHut.y, 'mineHut').setScale(2);
    //miningHut.events.onInputDown.add(tryAddMiner, this);
    miningHut.setInteractive();
    miningHut.on('pointerdown', tryAddMiner);

    /*this.miners = this.add.group({
      key: 'miner', // Which sprite to use
      repeat: this.maxRockCount - 2,    // How many times to repeat
      //repeat: 25,    // How many times to repeat
      setXY: {
        x: mineHut.x,
        y: mineHut.y
      }
    });*/
    this.miners = this.add.group();

    /*
    // Call a function for each lumberjack in the group
    index = 0;
    Phaser.Actions.Call(this.miners.getChildren(), function(miner){
      miner.target = {};
      miner.target.x = this.rocks.getChildren()[index].x;
      miner.target.y = this.rocks.getChildren()[index].y;
      miner.mineFlag = false;  // Whether chopping
      miner.anims.play('mn_walk', true);
      index++;
    }, this);
    */

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
      //var soldier_walk = this.add.sprite(300, 100, 'soldier').setScale(4);
      //soldier_walk.anims.play('sl_walk');

      // Attack
      this.anims.create({
        key: 'sl_atk',
        frames: this.anims.generateFrameNumbers('soldier', { start: 4, end: 8 }),
        frameRate: 10,
        repeat: -1
      });
      //var soldier_atk = this.add.sprite(400, 100, 'soldier').setScale(4);
      //soldier_atk.anims.play('sl_atk');

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
      //var enemy_walk = this.add.sprite(300, 200, 'enemy').setScale(4);
      //enemy_walk.anims.play('en_walk');

      // Attack
      this.anims.create({
        key: 'en_atk',
        frames: this.anims.generateFrameNumbers('enemy', { start: 4, end: 8 }),
        frameRate: 10,
        repeat: -1
      });
      //var enemy_atk = this.add.sprite(400, 200, 'enemy').setScale(4);
      //enemy_atk.anims.play('en_atk');

      this.enemies = this.add.group();

};

// this is called up to 60 times per second
gameScene.update = function(){

  Phaser.Actions.Call(this.jacks.getChildren(), function(jack){
    //this.input.setDraggable(jack);
    if (!jack.chopFlag){
      // Distance from lumberjack to target tree
      let xDiff = jack.x - jack.target.x;
      ( xDiff > 0 ) ? jack.flipX = true : jack.flipX = false;
      let yDiff = jack.y - jack.target.y;
      // Get the distance from the lumberjack to the tree
      dist = Math.sqrt( Math.pow(xDiff,2) + Math.pow(yDiff,2) );
      if (dist < 16){
        // reached jack_target
        jack.chopFlag = true;
        jack.anims.play('lj_chop', true);
        scoreText = this.add.text(jack.x, jack.y - 10, '£' + this.earnings.lumberjack + '/s', { fontSize: '9px', fill: '#ff0' });
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
      // Distance from lumberjack to target tree
      let xDiff = miner.x - miner.target.x;
      ( xDiff > 0 ) ? miner.flipX = true : miner.flipX = false;
      let yDiff = miner.y - miner.target.y;
      // Get the distance from the lumberjack to the tree
      dist = Math.sqrt( Math.pow(xDiff,2) + Math.pow(yDiff,2) );
      if (dist < 16){
        // reached the target
        miner.mineFlag = true;
        miner.anims.play('mn_mine', true);
        scoreText = this.add.text(miner.x, miner.y - 10, '£' + this.earnings.miner + '/s', { fontSize: '9px', fill: '#fff' });
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

  gameScene.updateGUI();

};

gameScene.updateGUI = function(){

  // Timings form part of the GUI
  this.time += 1/60;
  this.nextWave -= 1/60;
  if (this.nextWave <= 0){
    this.wave += 1;
    gameScene.spawnNextWave();
  }
  // Update GUI
  gui.bankEl.innerHTML = 'Bank: £' + Math.floor(this.bank);
  gui.cashEl.innerHTML = 'Total: £' + Math.floor(this.total);
  gui.timeEl.innerHTML = 'Time: ' + Math.floor(this.time) + 's';
  gui.waveEl.innerHTML = 'Wave: ' + this.wave;
  gui.ctdEl.innerHTML = 'Next wave: ' + Math.floor(this.nextWave) + 's';

};

gameScene.spawnNextWave = function(){

}

// what happens on game end
gameScene.gameOver = function(){

};

function outsideCenter(checkVal, centerVal, borderVal){
  let returnVal = (checkVal < centerVal - borderVal) || (checkVal > centerVal + borderVal);
  return returnVal;
}

function tryAddMiner(){
    //console.log('Trying to add miner');
  if (gameScene.bank >= gameScene.costs.miner){

    if (gameScene.miners.getChildren().length < gameScene.maxRockCount){
      gameScene.bank -= gameScene.costs.miner;
      var newMiner = gameScene.add.sprite(mineHut.x, mineHut.y, 'miner');
      newMiner.target = {};
      // miners = 0, target = 0
      // miners = 1, target = 1
      targetIndex = gameScene.miners.getChildren().length; // Math.max(0, gameScene.miners.getChildren().length - 1);
      newMiner.target.x = gameScene.rocks.getChildren()[targetIndex].x;
      newMiner.target.y = gameScene.rocks.getChildren()[targetIndex].y;
      newMiner.mineFlag = false;  // Whether chopping
      newMiner.anims.play('mn_walk', true);
      gameScene.miners.add(newMiner);
    }else{
      gui.msgEl.innerHTML = 'Too many miners!';
    }
  }else{
    gui.msgEl.innerHTML = 'Not enough cash!';
  }
}

/*
// WORKS - ABANDONING
function showLoggerModal(){
  var circle = new Phaser.Geom.Circle(logHut.x, logHut.y, 16);
  if (modalBg !== null){
    modalBg.alpha = 1;
    modalText.alpha = 1;
  }else{
    modalBg = null
    modalText = null;
    modalBg = gameScene.add.graphics({ fillStyle: { color: 0xfa0000 } });
    modalBg.fillCircleShape(circle);
    modalText = gameScene.add.text(logHut.x - 10, logHut.y - 15, 'Buy \n£' + gameScene.costs.lumberjack, { fontSize: '9px', fill: '#fff' });
    modalBg.setInteractive();
    modalBg.on('pointerdown', tryAddJack);
    //console.log('Hiding modal');
  }
}

function hideLoggerModal(){
  modalBg.alpha = 0;
  modalText.alpha = 0;
  modalBg = null;
  modalText = null;
  //console.log('Hiding modal');
}
*/

function tryAddJack(){
    //console.log('Trying to add lumberjack');
  if (gameScene.bank >= gameScene.costs.lumberjack){

    if (gameScene.jacks.getChildren().length < gameScene.maxTreeCount){
      gameScene.bank -= gameScene.costs.lumberjack;
      var newJack = gameScene.add.sprite(logHut.x, logHut.y, 'lumberjack');
      newJack.target = {};
      targetIndex = gameScene.jacks.getChildren().length; //Math.max(0, gameScene.jacks.getChildren().length - 1);
      newJack.target.x = gameScene.trees.getChildren()[targetIndex].x;
      newJack.target.y = gameScene.trees.getChildren()[targetIndex].y;
      newJack.chopFlag = false;  // Whether chopping
      newJack.anims.play('lj_walk', true);

      gameScene.jacks.add(newJack);

    }else{
      gui.msgEl.innerHTML = 'Too many lumberjacks!';
    }
  }else{
    gui.msgEl.innerHTML = 'Not enough cash!';
  }
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
