const width = 800;
const height = 600;
class PlayerShip {}
class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });
  }

  preload() {
    this.load.image("starfieldBG", "./assets/starfield.png");
    this.load.image("ship", "./assets/player.png");
    this.load.image("bullet", "./assets/bullet.png");
  }

  create() {
    //Init variables
    this.player;
    this.starfieldBG;
    this.cursors;
    this.acceleration = 600;
    this.drag = 400;
    this.maxSpeed = 400;
    this.bankPercent;
    this.shipTrail;
    this.playerLasers;

    //Scrolling BG
    this.starfieldBG = this.add.tileSprite(
      400,
      300,
      width,
      height,
      "starfieldBG"
    );

    //Groups for items in game
    this.playerLasers = this.add.group();
    this.enemies = this.add.group();
    this.enemyLasers = this.add.group();

    //Player ship
    this.player = this.physics.add.sprite(400, 500, "ship");
    this.player.setOrigin(0.5, 0.5);
    this.player.body.maxVelocity.setTo(this.maxSpeed, this.maxSpeed);
    this.player.body.drag.setTo(this.drag, this.drag);

    //Player characteristics
    this.player.isFiring = false;
    this.player.fireRate = 200;
    this.player.fire = () => {};
    this.player.fireTimer = this.time.addEvent({
      delay: this.player.fireRate,
      callback: this.player.fire(),
      callbackScope: this,
      loop: true
    });

    //Player Lasers
    this.playerLasers = this.add.group();

    //Emitter for the ship's trail
    let particles = this.add.particles("bullet");
    this.shipTrail = particles.createEmitter();
    this.shipTrail.width = 10;
    this.shipTrail.setSpeedX(30, -30);
    this.shipTrail.setSpeedY(200, 180);
    this.shipTrail.setAngle(50, -50);
    this.shipTrail.setAlpha(0.7);
    this.shipTrail.setScaleX(0.3);
    this.shipTrail.setScaleY(0.4);
    this.shipTrail.startFollow(this.player, 0, 20);
    this.shipTrail.start();

    //Setup arrow key controls
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  update() {
    //Scroll BG down
    this.starfieldBG.tilePositionY -= 2;

    //Reset velocity every frame;
    this.player.body.acceleration.x = 0;

    if (this.cursors.left.isDown) {
      this.player.body.velocity.x = this.acceleration * -1;
    } else if (this.cursors.right.isDown) {
      this.player.body.velocity.x = this.acceleration;
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

  render() {}
}

let config = {
  type: Phaser.AUTO,
  width: width,
  height: height,
  pixelArt: true,
  physics: {
    default: "arcade",
    arcade: {
      debug: false
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
