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

    window.addEventListener("message", event => {
      if (event.data === "swipeUp") {
        this.playerJump();
      }
      // IMPORTANT: Check the origin of the data!
      if (~event.origin.indexOf("http://127.0.0.1:3000/")) {
        // The data has been sent from your site
        // The data sent with postMessage is stored in event.data
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

    //MakeCursor
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
      this.scene.pause();
      let scoreCopy = this.score;
      this.input.keyboard.keys = [];
      this.resetVariables();
      // this.scene.launch("GameOverScene", { score: scoreCopy });
      this.scene.launch("Highscore", { score: scoreCopy });
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
    this.score = 0;
    this.gameOver = false;
    this.spawnTimer = null;
    // this.bg = null;
    // this.scoreText = "";
    // this.pause_label = "";
  }
}

class MainMenuScene extends Phaser.Scene {
  constructor() {
    super({ key: "MainMenuScene" });
  }

  preload() {
    this.load.image("playButton", "./assets/menu/playButton.png");
  }

  create() {
    let playBtn = this.add
      .image(400, 200, "playButton")
      .setInteractive()
      .setDisplaySize(300, 100);
    playBtn.on("pointerdown", () => {
      this.scene.start("RunnerScene");
    });
  }
}

class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameOverScene" });
  }

  init(data) {
    this.score = data.score;
  }

  preload() {
    this.load.image("playButton", "./assets/menu/playButton.png");
  }

  create() {
    let playBtn = this.add
      .image(400, 500, "playButton")
      .setInteractive()
      .setDisplaySize(300, 100);
    playBtn.on("pointerdown", () => {
      this.scene.stop("RunnerScene");
      this.scene.start("RunnerScene");
    });

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

    this.scene.start("MainMenuScene");
  }
}

/* ==========================================
    Leaderboard
=============================================*/

class InputPanel extends Phaser.Scene {
  constructor() {
    super({ key: "InputPanel", active: false });

    this.chars = [
      ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"],
      ["K", "L", "M", "N", "O", "P", "Q", "R", "S", "T"],
      ["U", "V", "W", "X", "Y", "Z", ".", "-", "<", ">"]
    ];

    this.cursor = new Phaser.Math.Vector2();

    this.text;
    this.block;

    this.name = "";
    this.charLimit = 8;
  }

  create() {
    let text = this.add.bitmapText(
      130,
      50,
      "arcade",
      "ABCDEFGHIJ\n\nKLMNOPQRST\n\nUVWXYZ.-"
    );

    text.setLetterSpacing(20);
    text.setInteractive();

    this.add.image(text.x + 430, text.y + 148, "rub");
    this.add.image(text.x + 482, text.y + 148, "end");

    this.block = this.add.image(text.x - 10, text.y - 2, "block").setOrigin(0);

    this.text = text;

    this.input.keyboard.on("keyup_LEFT", this.moveLeft, this);
    this.input.keyboard.on("keyup_RIGHT", this.moveRight, this);
    this.input.keyboard.on("keyup_UP", this.moveUp, this);
    this.input.keyboard.on("keyup_DOWN", this.moveDown, this);
    this.input.keyboard.on("keyup_ENTER", this.pressKey, this);
    this.input.keyboard.on("keyup_SPACE", this.pressKey, this);
    this.input.keyboard.on("keyup", this.anyKey, this);

    // text.on("pointermove", this.moveBlock, this);
    // text.on("pointerup", this.pressKey, this);

    this.tweens.add({
      targets: this.block,
      alpha: 0.2,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
      duration: 350
    });
  }

  moveBlock(pointer, x, y) {
    let cx = Phaser.Math.Snap.Floor(x, 52, 0, true);
    let cy = Phaser.Math.Snap.Floor(y, 64, 0, true);
    let char = this.chars[cy][cx];

    this.cursor.set(cx, cy);

    this.block.x = this.text.x - 10 + cx * 52;
    this.block.y = this.text.y - 2 + cy * 64;
  }

  moveLeft() {
    if (this.cursor.x > 0) {
      this.cursor.x--;
      this.block.x -= 52;
    } else {
      this.cursor.x = 9;
      this.block.x += 52 * 9;
    }
  }

  moveRight() {
    if (this.cursor.x < 9) {
      this.cursor.x++;
      this.block.x += 52;
    } else {
      this.cursor.x = 0;
      this.block.x -= 52 * 9;
    }
  }

  moveUp() {
    if (this.cursor.y > 0) {
      this.cursor.y--;
      this.block.y -= 64;
    } else {
      this.cursor.y = 2;
      this.block.y += 64 * 2;
    }
  }

  moveDown() {
    if (this.cursor.y < 2) {
      this.cursor.y++;
      this.block.y += 64;
    } else {
      this.cursor.y = 0;
      this.block.y -= 64 * 2;
    }
  }

  anyKey(event) {
    //  Only allow A-Z . and -

    let code = event.keyCode;

    if (code === Phaser.Input.Keyboard.KeyCodes.PERIOD) {
      this.cursor.set(6, 2);
      this.pressKey();
    } else if (code === Phaser.Input.Keyboard.KeyCodes.MINUS) {
      this.cursor.set(7, 2);
      this.pressKey();
    } else if (
      code === Phaser.Input.Keyboard.KeyCodes.BACKSPACE ||
      code === Phaser.Input.Keyboard.KeyCodes.DELETE
    ) {
      this.cursor.set(8, 2);
      this.pressKey();
    } else if (
      code >= Phaser.Input.Keyboard.KeyCodes.A &&
      code <= Phaser.Input.Keyboard.KeyCodes.Z
    ) {
      code -= 65;

      let y = Math.floor(code / 10);
      let x = code - y * 10;

      this.cursor.set(x, y);
      this.pressKey();
    }
  }

  pressKey() {
    let x = this.cursor.x;
    let y = this.cursor.y;
    let nameLength = this.name.length;

    this.block.x = this.text.x - 10 + x * 52;
    this.block.y = this.text.y - 2 + y * 64;

    if (x === 9 && y === 2 && nameLength > 0) {
      //  Submit
      this.events.emit("submitName", this.name);
    } else if (x === 8 && y === 2 && nameLength > 0) {
      //  Rub
      this.name = this.name.substr(0, nameLength - 1);

      this.events.emit("updateName", this.name);
    } else if (this.name.length < this.charLimit) {
      //  Add
      this.name = this.name.concat(this.chars[y][x]);

      this.events.emit("updateName", this.name);
    }
  }
}

class Starfield extends Phaser.Scene {
  constructor() {
    super({ key: "Starfield" });

    this.stars;

    this.distance = 300;
    this.speed = 250;

    this.max = 500;
    this.xx = [];
    this.yy = [];
    this.zz = [];
  }

  preload() {
    this.load.image("star", "./assets/star4.png");
  }

  create() {
    //  Do this, otherwise this Scene will steal all keyboard input
    this.input.keyboard.enabled = false;

    this.stars = this.add.blitter(0, 0, "star");

    for (let i = 0; i < this.max; i++) {
      this.xx[i] = Math.floor(Math.random() * 800) - 400;
      this.yy[i] = Math.floor(Math.random() * 600) - 300;
      this.zz[i] = Math.floor(Math.random() * 1700) - 100;

      let perspective = this.distance / (this.distance - this.zz[i]);
      let x = 400 + this.xx[i] * perspective;
      let y = 300 + this.yy[i] * perspective;

      this.stars.create(x, y);
    }
  }

  update(time, delta) {
    for (let i = 0; i < this.max; i++) {
      let perspective = this.distance / (this.distance - this.zz[i]);
      let x = 400 + this.xx[i] * perspective;
      let y = 300 + this.yy[i] * perspective;

      this.zz[i] += this.speed * (delta / 1000);

      if (this.zz[i] > 300) {
        this.zz[i] -= 600;
      }

      let bob = this.stars.children.list[i];

      bob.x = x;
      bob.y = y;
    }
  }
}

class Highscore extends Phaser.Scene {
  constructor() {
    super({ key: "Highscore" });

    this.playerText;
  }

  preload() {
    this.load.image("block", "./assets/inputs/block.png");
    this.load.image("rub", "./assets/inputs/rub.png");
    this.load.image("end", "./assets/inputs/end.png");

    this.load.bitmapFont(
      "arcade",
      "./assets/fonts/arcade.png",
      "./assets/fonts/arcade.xml"
    );
  }

  init(data) {
    this.playerScore = data.score;
  }

  create() {
    this.add
      .bitmapText(100, 260, "arcade", "RANK  SCORE   NAME")
      .setTint(0xff00ff);
    this.add
      .bitmapText(100, 310, "arcade", `???   ${this.playerScore}`)
      .setTint(0xff0000);

    this.playerText = this.add
      .bitmapText(500, 310, "arcade", "")
      .setTint(0xff0000);

    //  Do this, otherwise this Scene will steal all keyboard input
    this.input.keyboard.enabled = false;

    this.scene.launch("Starfield");
    this.scene.launch("InputPanel");

    let panel = this.scene.get("InputPanel");

    //  Listen to events from the Input Panel scene
    panel.events.on("updateName", this.updateName, this);
    panel.events.on("submitName", this.submitName, this);
  }

  submitName() {
    this.scene.stop("InputPanel");
    console.log(this.playerText.text);
    axios
      .post(`http://localhost:8080/endlessrunner/`, {
        name: this.playerText.text,
        score: this.playerScore
      })
      .then(response => {
        axios
          .get(
            `http://localhost:8080/endlessrunner/ranks/${this.playerText.text}`
          )
          .then(response => {
            // Print out data entries here
          });
      });

    this.add
      .bitmapText(100, 360, "arcade", "2ND   40000    ANT")
      .setTint(0xff8200);
    this.add
      .bitmapText(100, 410, "arcade", "3RD   30000    .-.")
      .setTint(0xffff00);
    this.add
      .bitmapText(100, 460, "arcade", "4TH   20000    BOB")
      .setTint(0x00ff00);
    this.add
      .bitmapText(100, 510, "arcade", "5TH   10000    ZIK")
      .setTint(0x00bfff);
  }

  updateName(name) {
    this.playerText.setText(name);
  }
}

let config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  pixelArt: true,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 2200 },
      debug: false
    }
  },
  scene: [
    PreloadScene,
    MainMenuScene,
    RunnerScene,
    GameOverScene,
    Starfield,
    Highscore,
    InputPanel
  ]
};

const game = new Phaser.Game(config);
