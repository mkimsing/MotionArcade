const width = 800;
const height = 600;


class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });
  }

  preload() {
    this.load.image('blueEnemyBullet', './assets/enemy-blue-bullet.png')
    this.load.image("starfieldBG", "./assets/starfield.png");
    this.load.image("ship", "./assets/player.png");
    this.load.image("bullet", "./assets/bullet.png");
    this.load.image('greenEnemy', './assets/enemy-green.png');
    this.load.image('blueEnemy', './assets/enemy-blue.png')
    this.load.spritesheet('explosion', './assets/explode.png', {
      frameWidth: 128,
      frameHeight: 128
    });
  }

  create() {
    this.anims.create({
      key: 'explosionAnim',
      frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 16 }),
      frameRate: 15,
      repeat: 0,
    });

    // this.physics.world.setBoundsCollision(true, true, true, true);
    // this.physics.world.on("worldbounds", function (body) {
    //   alert("Collide with world bounds!")
    // });

    //Init variables
    this.player;
    this.starfieldBG;
    this.cursors;
    this.acceleration = 600;
    this.drag = 400;
    this.maxSpeed = 400;
    this.bankPercent;
    this.shipTrail;
    this.score = 0;
    this.scoreText;
    this.gameOver = false;

    //  The score
    this.scoreText = this.add.text(game.config.width - 220, 24, "Score: 0", {
      fontSize: "24px",
      fill: "#FFF"
    });
    this.scoreText.setDepth(2);

    //Groups for physics entities in game
    this.greenEnemies = this.physics.add.group();
    this.playerLasers = this.physics.add.group();
    this.enemyLasers = this.physics.add.group({
      defaultKey: 'blueEnemyBullet',
      maxSize: 50
    });
    this.blueEnemies = this.physics.add.group({
      defaultKey: 'blueEnemy',
      maxSize: 30
    });
    this.explosions = this.physics.add.group({
      defaultKey: 'explosion',
      maxSize: 30
    })

    //Init enemy spawn recursion
    this.spawnGreenEnemy()
    this.spawnBlueEnemy()

    //Scrolling BG
    this.starfieldBG = this.add.tileSprite(
      400,
      300,
      width,
      height,
      "starfieldBG"
    ).setDepth(-1);

    //Player ship
    this.player = this.physics.add.sprite(400, 500, "ship");
    this.player.setOrigin(0.5, 0.5);
    this.player.body.maxVelocity.setTo(this.maxSpeed, this.maxSpeed);
    this.player.body.drag.setTo(this.drag, this.drag);

    //Player characteristics
    this.player.isFiring = false;
    this.player.fireRate = 180;
    this.fireTimer = this.time.addEvent({
      delay: this.player.fireRate,
      callback: this.firePlayerLaser,
      callbackScope: this,
      loop: true
    });

    //Emitter for the ship's trail
    let particles = this.add.particles("bullet");
    this.shipTrail = particles.createEmitter();
    this.initParticleTrail();

    //Collide groups
    this.physics.add.collider(this.player, this.greenEnemies, this.shipCollide, null, this)
    this.physics.add.collider(this.greenEnemies, this.playerLasers, this.hitEnemy, null, this)
    this.physics.add.collider(this.blueEnemies, this.playerLasers, this.hitEnemy, null, this)
    this.physics.add.collider(this.player, this.blueEnemies, this.shipCollide, null, this)
    this.physics.add.collider(this.player, this.enemyLasers, this.enemyHitPlayer, null, this)
    //Setup arrow key controls
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  shipCollide = (player, enemy) => {
    this.spawnExplosion(player.body)
    this.spawnExplosion(enemy.body)
    this.gameOver = true;
    player.destroy()
  }

  spawnExplosion = (body) => {
    let explosion = this.explosions.get().setActive(true);
    explosion.setOrigin(0.5, 0.5)
    explosion.setPosition(body.x + body.halfWidth,
      body.y + body.halfHeight)
    explosion.body.velocity.y = body.velocity.y;
    explosion.play('explosionAnim');
    explosion.setAlpha(0.7)
    explosion.on('animationcomplete', function () {
      explosion.setAlpha(0)
      explosion.setActive(false);
    }, this);
  }

  hitEnemy = (enemy, laser) => {
    this.spawnExplosion(enemy.body)
    enemy.destroy();
    laser.destroy();

    //Add score
    this.score += 100;
    this.scoreText.setText("Score: " + this.score);
  }

  enemyHitPlayer = (player, laser) => {
    this.spawnExplosion(player.body);
    this.gameOver = true;
    player.destroy();
  }

  spawnGreenEnemy = () => {
    let randomX = Phaser.Math.Between(0, this.scene.manager.game.config.width)
    let enemy = this.add.sprite(randomX, -20, 'greenEnemy');
    this.greenEnemies.add(enemy);
    enemy.body.setSize(enemy.width * 3 / 4, enemy.height * 3 / 4);
    enemy.setScale(0.5, 0.5)
    enemy.angle = 180;
    enemy.body.velocity.x = Phaser.Math.Between(-250, 250);
    enemy.body.velocity.y = 300;
    enemy.body.drag.setTo(100, 0)

    enemy.updateAngle = () => {
      enemy.angle = 180 - Phaser.Math.RadToDeg(Math.atan2(enemy.body.velocity.x, enemy.body.velocity.y))
    }

    let randomSpawnTime = Phaser.Math.Between(300, 2000)
    this.greenSpawnTimer = this.time.delayedCall(randomSpawnTime, this.spawnGreenEnemy);  // delay in ms
  }

  spawnBlueEnemy = () => {
    let spread = 50;
    let frequency = 70;
    let verticalSpacing = 70;
    let numEnemiesInWave = 4;
    let verticalSpeed = 250;
    let randomX = Phaser.Math.Between(0, this.scene.manager.game.config.width)
    // enemy.body.setSize(enemy.width * 3 / 4, enemy.height * 3 / 4);

    let firingDelay = 10000;
    let bulletSpeed = 400;

    //Wave of enemies
    for (let i = 0; i < numEnemiesInWave; i++) {
      let enemy = this.blueEnemies.get().setActive(true);
      enemy.setPosition(randomX, -verticalSpacing * i)
      // this.blueEnemies.add(enemy);
      enemy.startingX = randomX
      enemy.setOrigin(0.5, 0.5)
      enemy.setScale(0.5, 0.5)
      enemy.angle = 180;
      enemy.body.velocity.y = verticalSpeed;
      enemy.lastShotTime = 0;
      enemy.bullets = 1;
      enemy.update = function (scene) {
        //  Wave movement
        this.setX(this.startingX + (Math.sin((this.y) / frequency) * spread));
        let bank = Math.cos((this.y + 60) / frequency)
        this.setAngle(180 - bank * 2)

        //Start firing after at least 1/8 down the page
        if (this.bullets >= 1 &&
          this.active &&
          this.y > game.config.height / 8 &&
          Date.now() > firingDelay + this.lastShotTime
        ) {
          this.bullets--;
          this.lastShotTime = Date.now();
          let laser = scene.enemyLasers.get().setActive(true)
          laser.setOrigin(0.5, 0.5)
          laser.setPosition(this.x, this.y + this.height / 2)
          // let laser = scene.add.sprite(this.x, this.y + this.height / 2, 'blueEnemyBullet')
          // scene.enemyLasers.add(laser)
          laser.setOrigin(0.5, 0.5)
          laser.setAlpha(0.9)
          laser.body.setSize(30, 30)

          let angle = scene.physics.moveToObject(laser, scene.player, bulletSpeed)
          laser.setAngle(Phaser.Math.RadToDeg(angle))
        }
        //  Kill enemies once they go off screen
        if (this.y > game.config.height + 200) {
          this.destroy();
        }
      }
    }

    let randomSpawnTime = Phaser.Math.Between(2000, 5000)
    this.blueSpawnTimer = this.time.delayedCall(randomSpawnTime, this.spawnBlueEnemy);  // delay in ms
  }

  initParticleTrail = () => {
    this.shipTrail.width = 10;
    this.shipTrail.setSpeedX(30, -30);
    this.shipTrail.setSpeedY(200, 180);
    this.shipTrail.setAngle(50, -50);
    this.shipTrail.setAlpha(0.7);
    this.shipTrail.setScaleX(0.3);
    this.shipTrail.setScaleY(0.4);
    this.shipTrail.startFollow(this.player, 0, 20);
    this.shipTrail.start();
  }

  firePlayerLaser = () => {
    let laserSpeed = 400;
    let laser = this.add.sprite(this.player.x, this.player.y - 30, 'bullet')
    this.playerLasers.add(laser)
    laser.body.velocity.y = laserSpeed * -1;
  }

  update() {
    if (this.gameOver) {
      // console.log(this.fireTimer)
      this.greenSpawnTimer.remove();
      this.blueSpawnTimer.remove();
      this.fireTimer.remove();
      this.shipTrail.stop();
      return;
    }
    this.greenEnemies.getChildren().forEach((enemy) => {
      enemy.updateAngle();
    })
    this.blueEnemies.getChildren().forEach((enemy) => {
      enemy.update(this)
    })
    //Scroll BG down 
    this.starfieldBG.tilePositionY -= 2;

    //Reset velocity every frame;
    this.player.body.acceleration.x = 0;

    //Reset Y position
    this.player.y = 500;

    if (this.cursors.left.isDown) {
      this.player.body.velocity.x = this.acceleration * -1;
    } else if (this.cursors.right.isDown) {
      this.player.body.velocity.x = this.acceleration;
    }

    if (this.cursors.space.isDown) {
      this.player.fireTimer.paused = (this.player.fireTimer.paused) ? false : true;
    }

    //Stop ship at screen edges
    if (this.player.x > this.scene.manager.game.config.width - 30) {
      this.player.x = this.scene.manager.game.config.width - 30;
      this.player.body.acceleration.x = 0;
    }
    if (this.player.x < 30) {
      this.player.x = 30;
      this.player.body.acceleration.x = 0;
    }

    //Squish / Angle ship to simulate banking
    this.bankPercent = this.player.body.velocity.x / this.maxSpeed;
    this.player.scaleX = 1 - Math.abs(this.bankPercent) / 6;
    this.player.angle = this.bankPercent * 30;
  }

}

let config = {
  type: Phaser.AUTO,
  width: width,
  height: height,
  pixelArt: true,
  physics: {
    default: "arcade",
    arcade: {
      debug: true
    }
  },
  scene: [
    // PreloadScene,
    // MainMenuScene,
    GameScene
    // Starfield,
    // Highscore,
    // InputPanel
  ]
};

const game = new Phaser.Game(config);
