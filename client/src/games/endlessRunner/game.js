class RunnerScene extends Phaser.Scene {
  constructor() {
    super({ key: "RunnerScene" });

    this.player = null;
    this.platforms = null;
    this.skeletonList;
    this.bg = null;
    this.score = 0;
    this.gameOver = false;
    this.spawnTimer = null;
    this.scoreText = null;
    this.cursors = null;
    this.log = () => {
      console.log("!");
    };
    window.addEventListener("message", event => {
      if (event.data === "swipeUp") {
        console.log(this);
        this.playerJump();
      }
      // IMPORTANT: Check the origin of the data!
      if (~event.origin.indexOf("http://127.0.0.1:3000/")) {
        // The data has been sent from your site

        // The data sent with postMessage is stored in event.data
        console.log(event.data, "!");
      } else {
        // The data hasn't been sent from your site!
        // Be careful! Do not use it.
        return;
      }
    });
  }

  preload() {
    //Background
    this.load.image("bg", "./assets/BackgroundLayers/Layer_0010_1.png");
    this.load.image(
      "backgroundLayer1",
      "./assets/BackgroundLayers/Layer_0003_6.png"
    );
    this.load.image(
      "backgroundLayer2",
      "./assets/BackgroundLayers/Layer_0004_Lights.png"
    );
    this.load.image(
      "backgroundLayer3",
      "./assets/BackgroundLayers/Layer_0005_5.png"
    );
    this.load.image(
      "backgroundLayer4",
      "./assets/BackgroundLayers/Layer_0006_4.png"
    );
    this.load.image(
      "backgroundLayer5",
      "./assets/BackgroundLayers/Layer_0007_Lights.png"
    );
    this.load.image(
      "backgroundLayer6",
      "./assets/BackgroundLayers/Layer_0008_3.png"
    );
    this.load.image(
      "backgroundLayer7",
      "./assets/BackgroundLayers/Layer_0009_2.png"
    );
    this.load.image(
      "backgroundLayer8",
      "./assets/BackgroundLayers/Layer_0010_1.png"
    );
    this.load.image("treeTops", "./assets/BackgroundLayers/Layer_0002_7.png");

    //Foreground
    this.load.image("ground", "./assets/BackgroundLayers/Ground_Cropped.png");
    this.load.image(
      "groundLayer1",
      "./assets/BackgroundLayers/Layer_0000_9.png"
    );

    // //Player
    // this.load.spritesheet(
    //   "playerChar",
    //   "./assets/Adventurer-1.5/adventurer-v1.5-Sheet.png",
    //   { frameWidth: 50, frameHeight: 37 }
    // );

    // //Skeleton
    // this.load.spritesheet(
    //   "SkeletonAttack",
    //   "./assets/Skeleton/SpriteSheets/SkeletonAttack.png",
    //   { frameWidth: 30, frameHeight: 37 }
    // );

    //Skeleton
    // this.load.spritesheet(
    //   "SkeletonWalk",
    //   "./assets/Skeleton/SpriteSheets/SkeletonWalk.png",
    //   { frameWidth: 30, frameHeight: 37 }
    // );
  }

  create() {
    //BG Image
    this.bg = this.add
      .image(game.config.width / 2, game.config.height / 2, "bg")
      .setDisplaySize(game.config.width, game.config.height);
    this.bg.setDepth(-1);

    // Create physics group for standable platforms
    this.platforms = this.physics.add.staticGroup();

    // Create ground
    this.ground = this.add.tileSprite(600, 550, 1200, 70, "ground"); // 660
    this.ground.scaleY = 2;
    this.ground.setDepth(0);
    this.platforms.add(this.ground);
    this.ground.body.setOffset(0, 15);

    //Create layer darkened ground
    this.groundLayer1 = this.add.tileSprite(600, 80, 1200, 800, "groundLayer1");
    this.groundLayer1.setDepth(1);
    this.groundLayer1.scaleY = 1.3;

    //Create layered background
    this.backgroundLayer8 = this.add.tileSprite(
      500,
      90,
      1200,
      800,
      "backgroundLayer8"
    );
    this.backgroundLayer7 = this.add.tileSprite(
      500,
      90,
      1200,
      800,
      "backgroundLayer7"
    );
    this.backgroundLayer6 = this.add.tileSprite(
      500,
      163,
      1200,
      800,
      "backgroundLayer6"
    );
    this.backgroundLayer5 = this.add.tileSprite(
      500,
      163,
      1200,
      800,
      "backgroundLayer5"
    );
    this.backgroundLayer4 = this.add.tileSprite(
      500,
      163,
      1200,
      800,
      "backgroundLayer4"
    );
    this.backgroundLayer3 = this.add.tileSprite(
      500,
      163,
      1200,
      800,
      "backgroundLayer3"
    );
    this.backgroundLayer2 = this.add.tileSprite(
      500,
      163,
      1200,
      800,
      "backgroundLayer2"
    );
    this.backgroundLayer1 = this.add.tileSprite(
      500,
      163,
      1200,
      800,
      "backgroundLayer1"
    );

    //Create treetops
    this.treeTops = this.add.tileSprite(200, 175, 1200, 800, "treeTops");

    //Player sprite
    this.player = this.physics.add.sprite(150, 450, "playerChar");
    this.player.setSize(12, 30).setOffset(22, 5);
    this.player.setScale(2.5, 2.5);

    //Player properties
    this.player.setBounce(0.1);
    this.player.setCollideWorldBounds(true);
    this.player.body.setAllowDrag(true);

    this.cursors = this.input.keyboard.createCursorKeys();

    // Physics group for enemies
    this.skeletonList = this.physics.add.group();

    //Collide platform and player
    this.physics.add.collider(this.platforms, this.player);
    this.physics.add.collider(this.platforms, this.skeletonList);
    this.physics.add.collider(
      this.player,
      this.skeletonList,
      this.onEnemyCollision,
      null,
      this
    );

    let callback = () => {
      this.makeSkeleton();
      //Update score
      this.score += 100;
      this.scoreText.setText("Score: " + this.score);
    };

    //  The score
    this.scoreText = this.add.text(50, 32, "Score: 0", {
      fontSize: "24px",
      fill: "#FFF"
    });

    // Restart Label/Button
    let restartBtn = this.add.text(650, 32, "Restart", {
      fontSize: "24px",
      fill: "#FFF"
    });
    restartBtn.setInteractive();
    restartBtn.on("pointerdown", () => {
      this.resetVariables();
      this.scene.restart();
    });

    //Timer to control skeleton spawning
    this.spawnTimer = this.time.addEvent({
      delay: Phaser.Math.Between(1300, 2000), // ms
      callback: callback,
      //args: [],
      callbackScope: this,
      loop: true
    });
  }

  update() {
    if (this.gameOver) {
      this.spawnTimer.paused = true;
      this.scene.pause()
      let scoreCopy = this.score;
      this.resetVariables()
      this.scene.launch('GameOverScene', { score: scoreCopy })
      return;
    }
    let scrollSpeed = 6;
    this.ground.tilePositionX += scrollSpeed;
    this.groundLayer1.tilePositionX += scrollSpeed;
    this.treeTops.tilePositionX += scrollSpeed;
    this.backgroundLayer1.tilePositionX += scrollSpeed;
    this.backgroundLayer2.tilePositionX += scrollSpeed;
    this.backgroundLayer3.tilePositionX += scrollSpeed;
    this.backgroundLayer4.tilePositionX += scrollSpeed;
    this.backgroundLayer5.tilePositionX += scrollSpeed;
    this.backgroundLayer6.tilePositionX += scrollSpeed;
    this.backgroundLayer7.tilePositionX += scrollSpeed;
    this.backgroundLayer8.tilePositionX += scrollSpeed;

    this.player.body.setVelocityX(0); // Always reset velocity per frame (do not slide)
    if (this.cursors.left.isDown) {
      this.player.body.setVelocityX(-500); // move left
      this.player.flipX = true; // flip the sprite to the left
      if (this.player.body.touching.down) {
        this.player.anims.play("left", true); // play walk animation
      }
    } else if (this.cursors.right.isDown) {
      this.player.body.setVelocityX(500); // move right
      this.player.flipX = false; // use the original sprite looking to the right
      if (this.player.body.touching.down) {
        this.player.anims.play("left", true); // play walk animation
      }
    } else if (this.player.body.touching.down) {
      this.player.flipX = false; // use the original sprite looking to the right
      this.player.anims.play("idle-run", true);
    }

    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(950 * -1);
      this.player.anims.play("jump", true);
    }
    if (this.cursors.down.isDown && this.player.body.touching.down) {
      this.player.anims.play("slide", true); // play slide animation
    }
  }

  playerJump() {
    if (this.player.body.touching.down) {
      this.player.setVelocityY(1000 * -1);
      this.player.anims.play("jump", true);
    }
  }

  makeSkeleton() {
    let skeleton = this.skeletonList.create(900, 450, "SkeletonAttack");
    skeleton.flipX = true;
    skeleton
      .setScale(3, 3)
      .setVelocityX(Phaser.Math.Between(400, 600) * -1)
      .setSize(20, 30)
      .setOffset(5, 5);
  }

  onEnemyCollision() {
    this.gameOver = true;
  }

  resetVariables() {
    // this.bg = null;
    this.score = 0;
    this.gameOver = false;
    // this.spawnTimer = null;
    // this.scoreText = "";
    // this.pause_label = "";
  }
}

class MainMenuScene extends Phaser.Scene {
  constructor() {
    super({ key: "MainMenuScene" });

  }

  preload() {
    this.load.image('playButton', './assets/menu/playButton.png')
  }

  create() {
    let playBtn = this.add.image(400, 200, 'playButton')
      .setInteractive()
      .setDisplaySize(300, 100)
    playBtn.on("pointerdown", () => {
      this.scene.start('RunnerScene')
    })
  }

}

class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameOverScene" });
  }

  init(data) {
    console.log('INIT', data)
    this.score = data.score;
  }

  preload() {
    this.load.image('playButton', './assets/menu/playButton.png')
  }

  create() {
    let playBtn = this.add.image(400, 300, 'playButton')
      .setInteractive()
      .setDisplaySize(300, 100)
    playBtn.on("pointerdown", () => {
      this.scene.stop('RunnerScene')
      this.scene.start('RunnerScene')
    })

    let msgX = 320;
    this.add.text(msgX, 100, "Game Over...", {
      fontSize: "24px",
      fill: "#FFF"
    });
    this.add.text(msgX - 30, 150, `You Scored: ${this.score}`, {
      fontSize: "24px",
      fill: "#FFF"
    });
    this.add.text(msgX, 200, "Play Again?", {
      fontSize: "24px",
      fill: "#FFF"
    });
  }
}

class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: "PreloadScene" });

  }
  preload() {
    //Player
    this.load.spritesheet(
      "playerChar",
      "./assets/Adventurer-1.5/adventurer-v1.5-Sheet.png",
      { frameWidth: 50, frameHeight: 37 }
    );

    //Skeleton
    this.load.spritesheet(
      "SkeletonAttack",
      "./assets/Skeleton/SpriteSheets/SkeletonAttack.png",
      { frameWidth: 30, frameHeight: 37 }
    );
  }

  create() {
    //Player Char Animations
    let animFrameRate = 8;
    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("playerChar", {
        start: 8,
        end: 13
      }),
      frameRate: animFrameRate,
      repeat: -1
    });

    this.anims.create({
      key: "idle-run",
      frames: this.anims.generateFrameNumbers("playerChar", {
        start: 8,
        end: 13
      }),
      frameRate: 5,
      repeat: -1
    });

    this.anims.create({
      key: "jump",
      frames: this.anims.generateFrameNumbers("playerChar", {
        start: 14,
        end: 23
      }),
      frameRate: 15,
      repeat: 0
    });

    this.anims.create({
      key: "slide",
      frames: this.anims.generateFrameNumbers("playerChar", {
        start: 24,
        end: 25
      }),
      frameRate: 4,
      repeat: 0
    });

    //TODO use this if we have time
    // this.anims.create({
    //   key: "attack",
    //   frames: this.anims.generateFrameNumbers("playerChar", {
    //     start: 93,
    //     end: 99
    //   }),
    //   frameRate: animFrameRate,
    //   repeat: 0
    // });

    this.anims.create({
      key: "skeleton-walk",
      frames: this.anims.generateFrameNumbers("SkeletonWalk", {
        start: 0,
        end: 12
      }),
      frameRate: 15,
      repeat: 0
    });

    this.scene.start('MainMenuScene')
  }

}

let config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 2200 },
      debug: false
    }
  },
  scene: [PreloadScene, MainMenuScene, RunnerScene, GameOverScene]
};

const game = new Phaser.Game(config);
