const width = 800;
const height = 600;

class RunnerScene extends Phaser.Scene {
  constructor() {
    super({ key: "RunnerScene" });
    this.player = null;
    this.platforms = null;
    this.skeletonList = null;
    this.bg = null;
    this.useCameraControls = false;
    this.actions = [false, false, false] // 0 => jump, 1 => mvLeft, 2=> mvRight
    window.addEventListener("message", event => {
      // IMPORTANT: Check the origin of the data!
      if (event.origin === "http://localhost:3000") {
        // The data sent with postMessage is stored in event.data
        if (this.scene.isActive("RunnerScene")) {
          switch (event.data.type) {
            case 'enableCameraControls':
              this.useCameraControls = true;
              break;
            case 'disableCameraControls':
              this.useCameraControls = false;
              break;
            case 'swipeUp':
              this.playerAction(0);
              break;
            case 'swipeRight':
              this.playerAction(1);
              break;
            case 'XPosition':
              this.calculateRelativePosition(event.data.percentX);
            default:
              break;
          }
        }
        return;
      }
    });
  }

  init(data) {
    this.useCameraControls = data.useCameraControls;
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

    //Target
    this.load.image('target', "./assets/menu/target.png")

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
    //INIT VARIABLES
    this.score = 0;
    this.gameOver = false;
    this.spawnTimer = null;
    this.scoreText = null;
    this.cursors = null;
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
    this.player.body.setDragX(0)

    //Clear, then make keys
    this.input.keyboard.keys = [];
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

    //VARIABLES
    this.isAttacking = false;
    this.spawnRangeStart = 1500;
    this.spawnRangeEnd = 2250;

    //  The score
    this.scoreText = this.add.text(game.config.width - 220, 24, "Score: 0", {
      fontSize: "24px",
      fill: "#FFF"
    });
    this.scoreText.setDepth(2);

    //Timer to control skeleton spawning
    this.spawnTimer = this.time.addEvent({
      delay: Phaser.Math.Between(this.spawnRangeStart, this.spawnRangeEnd), // ms
      callback: this.spawnerCallback,
      //args: [],
      callbackScope: this,
      loop: true
    });

    this.difficultyTimer = this.time.addEvent({
      delay: Phaser.Math.Between(10000, 12000), // ms (12sec)
      callback: this.increaseDifficulty,
      //args: [],
      callbackScope: this,
      loop: true
    });

  }
  spawnerCallback = () => {
    this.makeSkeleton();
    //Update score
    this.score += 100;
    this.scoreText.setText("Score: " + this.score);
  };

  increaseDifficulty = () => {
    if (this.spawnRangeStart > 500) {
      this.spawnRangeStart -= 200;
    }
    if (this.spawnRangeEnd > 1900 && this.spawnRangeStart === 500) {
      this.spawnRangeEnd -= 200
    }
    console.log("Up Difficulty!", this.spawnRangeStart, this.spawnRangeEnd)
    this.spawnTimer.reset({
      delay: Phaser.Math.Between(this.spawnRangeStart, this.spawnRangeEnd), // ms
      callback: this.spawnerCallback,
      //args: [],
      callbackScope: this,
      loop: true
    })
  }

  update() {
    if (this.gameOver) {
      this.spawnTimer.paused = true;
      this.scene.pause();
      let scoreCopy = this.score;
      this.resetVariables();
      this.scoreText.destroy()
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

    let isGrounded = this.player.body.touching.down
    //Check for sword active
    if (this.player.anims.currentFrame) {
      if (this.player.anims.currentFrame.textureFrame === 95
        || this.player.anims.currentFrame.textureFrame === 96
        || this.player.anims.currentFrame.textureFrame === 97
        || this.player.anims.currentFrame.textureFrame === 98) {
        this.swordAttack = true;
      }
      else {
        this.swordAttack = false;
      }
    }

    if (!this.useCameraControls) {
      if (isGrounded) {
        this.player.body.setVelocityX(0); // Always reset velocity per frame (do not slide)
      }
      if (!this.isAttacking) {
        if (this.cursors.space.isDown) {
          this.playerAttack()
        }
        else {
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
        }

        if (this.cursors.up.isDown && this.player.body.touching.down) {
          this.player.setVelocityY(950 * -1);
          this.player.anims.play("jump", true);
        }
        if (this.cursors.down.isDown && this.player.body.touching.down) {
          this.player.anims.play("slide", true); // play slide animation
        }
      }
    }
    else {
      this.player.x = 150;
      //Handle animations when using camera controls
      if (!this.isAttacking) {
        if (this.actions[1]) {
          this.playerAttack()
          this.actions[1] = false;
        } else if (isGrounded) {
          this.player.flipX = false; // use the original sprite looking to the right
          this.player.anims.play("idle-run", true);
        }

        if (this.actions[0] && isGrounded) {
          this.player.setVelocityY(950 * -1);
          this.player.anims.play("jump", true);
          this.actions[0] = false;
        }
      }
    }
  }

  playerAttack = () => {
    this.player.anims.play('attack', true)
    this.isAttacking = true;

    this.time.addEvent({
      delay: 620,                // ms
      callback: this.playerAttackCallback,
      //args: [],
      callbackScope: this,
      loop: false
    });
  }

  playerAttackCallback = () => {
    this.player.anims.play('idle-run', true)
    this.isAttacking = false;
  }

  playerAction = (num) => {
    this.actions[num] = true;
  }



  // calculateRelativePosition = (percentX) => {
  //   let relativeX = this.scene.manager.game.config.width * percentX;
  //   let difference = relativeX - this.player.x;
  //   if (Math.abs(difference) >= 100) {
  //     let direction = (difference >= 0) ? 2 : 1
  //     this.actions[direction] = true;
  //   } else {
  //     this.actions[1] = false;
  //     this.actions[2] = false;
  //     this.player.body.setVelocityX(0)
  //   }
  // }

  makeSkeleton() {
    let skeleton = this.skeletonList.create(900, 450, "SkeletonAttack");
    skeleton.flipX = true;
    skeleton
      .setScale(3, 3)
      .setVelocityX(Phaser.Math.Between(400, 650) * -1)
      .setSize(20, 30)
      .setOffset(5, 5);
  }

  onEnemyCollision = (object1, object2) => {
    if (this.swordAttack) {
      object2.destroy()
    }
    else {
      this.gameOver = true;
    }
  }

  resetVariables() {
    this.score = 0;
    this.gameOver = false;
    this.spawnTimer = null;
  }
}

class MainMenuScene extends Phaser.Scene {
  constructor() {
    super({ key: "MainMenuScene" });
    this.useCameraControls = false;
    window.addEventListener("message", event => {
      // IMPORTANT: Check the origin of the data!
      if (event.origin === "http://localhost:3000") {
        // The data has been sent from your site
        // The data sent with postMessage is stored in event.data
        if (this.scene.isActive("MainMenuScene")) {
          switch (event.data.type) {
            case 'enableCameraControls':
              this.useCameraControls = true;
              break;
            case 'disableCameraControls':
              this.useCameraControls = false;
              break;
            default:
              break;
          }
        }
        // The data hasn't been sent from your site!
        // Be careful! Do not use it.
        return;
      }
    });
  }

  preload() {
    this.load.bitmapFont(
      "arcade",
      "./assets/fonts/arcade.png",
      "./assets/fonts/arcade.xml"
    );
  }

  create() {
    this.input.keyboard.on("keyup_ENTER", this.changeScenes, this);
    this.add
      .bitmapText(150, 200, "arcade", "Endless Runner")
      .setTint(0x66fcf1)
      .setFontSize(36)
    let playBtn = this.add
      .bitmapText(325, 300, "arcade", "Play")
      .setTint(0x66bcfc)
    playBtn.setInteractive(new Phaser.Geom.Rectangle(0, 0, playBtn.width, playBtn.height),
      Phaser.Geom.Rectangle.Contains)
    this.playBtnTween = this.tweens.add({
      targets: playBtn,
      alpha: 0.2,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
      duration: 450
    });
    playBtn.on("pointerdown", () => {
      this.changeScenes()
    });
  }

  changeScenes = () => {
    this.playBtnTween.stop()
    this.scene.start("RunnerScene", { useCameraControls: this.useCameraControls });
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
    this.anims.create({
      key: "attack",
      frames: this.anims.generateFrameNumbers("playerChar", {
        start: 93,
        end: 99
      }),
      frameRate: 10,
      repeat: 0
    });

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
      ["U", "V", "W", "X", "Y", "Z", ".", "-", "", ""]
    ];
    this.charLimit = 8;
  }

  create() {
    this.cursor = new Phaser.Math.Vector2();

    this.text;
    this.block;

    this.name = "";

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
    } else if (
      code === Phaser.Input.Keyboard.KeyCodes.ENTER
    ) {
      this.cursor.set(9, 2);
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
    }
    else if (this.name.length < this.charLimit) {
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

    this.baseHeight = 250;
    this.textStartWidth = 80;
    this.playText = 'Play Again';
    this.menuText = 'Main Menu';
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
    this.cursor1 = null;
    this.cursor2 = null;
    this.playerText = null;
    this.add
      .bitmapText(this.textStartWidth, this.baseHeight, "arcade", "RANK  SCORE   NAME")
      .setTint(0x66bcfc)
    this.playerRow = this.add
      .bitmapText(this.textStartWidth, this.baseHeight + 50, "arcade", `???   ${this.playerScore}`)
      .setTint(0xff0000);

    this.playerText = this.add
      .bitmapText(500, this.baseHeight + 50, "arcade", "")
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
    this.playerRow.destroy();
    this.playerText.destroy();
    if (this.cursor1) {
      this.cursor1.destroy();
    }
    if (this.cursor2) {
      this.cursor2.destroy();

    }
    this.input.keyboard.enabled = true;
    this.input.keyboard.on("keyup_ENTER", this.changeScenes, this);
    this.input.keyboard.on("keyup_UP", this.moveUp, this);
    this.input.keyboard.on("keyup_DOWN", this.moveDown, this);

    this.playBtn = this.add
      .bitmapText(230, 32, "arcade", this.playText)
      .setTint(0xa666fc)
    this.playBtn.setInteractive(new Phaser.Geom.Rectangle(0, 0, this.playBtn.width, this.playBtn.height),
      Phaser.Geom.Rectangle.Contains)
    this.selectedScene = 'RunnerScene'
    this.playBtn.on("pointerdown", () => {
      this.selectedScene = 'RunnerScene'
      this.changeScenes()
    });

    this.menuBtn = this.add
      .bitmapText(245, 80, "arcade", this.menuText)
      .setTint(0xa666fc)
    this.menuBtn.setInteractive(new Phaser.Geom.Rectangle(0, 0, this.menuBtn.width, this.menuBtn.height),
      Phaser.Geom.Rectangle.Contains)
    this.menuBtn.on("pointerdown", () => {
      this.selectedScene = 'MainMenuScene'
      this.changeScenes()
    });

    this.cursor1 = this.add
      .bitmapText(0, 0, "arcade", '-')
    this.cursor1.setPosition(230 - this.cursor1.width - 10, 32)
    this.tweens.add({
      targets: this.cursor1,
      alpha: 0.2,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
      duration: 450
    });
    this.cursor2 = this.add
      .bitmapText(0, 0, "arcade", '-')
    this.cursor2.setPosition(230 + this.playBtn.width + 10, 32)
    this.tweens.add({
      targets: this.cursor2,
      alpha: 0.2,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
      duration: 450
    });


    axios
      .post(`http://localhost:8080/endlessrunner/`, {
        name: this.playerText.text,
        score: this.playerScore
      })
      .then(response => {
        let isHighscore = response.data.highScore
        let wasCreated = response.data.created
        axios
          .get(
            `http://localhost:8080/endlessrunner/ranks/${this.playerText.text}`
          )
          .then(response => {
            this.add.bitmapText(this.textStartWidth + 200, this.baseHeight - 80, "arcade",
              `Game Over \n\nScore: ${this.playerScore}`)
              .setTint(0xff0000).setFontSize(20);
            response.data.forEach((entry, i) => {
              let ranking = `${entry.ranking}`
              let score = `${entry.score}`
              let name = `${entry.name}`
              let textHeight = this.baseHeight + 50 + i * 60;
              while (ranking.length < 4) {
                ranking = ranking.concat(' ')
              }
              while (score.length < 4) {
                score = score.concat(' ')
              }
              let str = ranking + "  " + score + "   " + name
              let row = this.add
                .bitmapText(this.textStartWidth, textHeight, "arcade", str)
              if (entry.name === this.playerText.text.toLowerCase()) {
                if (isHighscore || wasCreated) {
                  this.tweens.add({
                    targets: row,
                    alpha: 0.2,
                    yoyo: true,
                    repeat: -1,
                    ease: "Sine.easeInOut",
                    duration: 450
                  });
                  this.add.bitmapText(this.textStartWidth + 110, textHeight, "arcade",
                    "New High-Score!"
                  ).setFontSize(14).setRotation(-0.15).setTint(0xfcd466)
                }
                else if (!isHighscore && !wasCreated) {
                  this.add.bitmapText(this.textStartWidth + 80, textHeight + 5, "arcade",
                    "Previous High-Score"
                  ).setFontSize(14).setRotation(-0.15)
                }
                row.setTint(0x66fcf1)
              } else {
                row.setTint(0xa19d9b);
              }
            })
          });
      });
  }

  moveUp() {
    this.selectedScene = "RunnerScene"
    this.cursor1.setPosition(230 - this.cursor1.width - 10, 32)
    this.cursor2.setPosition(230 + this.playBtn.width + 10, 32)
  }

  moveDown() {
    this.cursor1.setPosition(245 - this.cursor1.width - 10, 80)
    this.cursor2.setPosition(245 + this.menuBtn.width + 10, 80)
    this.selectedScene = "MainMenuScene"
  }

  changeScenes() {
    this.scene.stop('Highscore')
    this.scene.stop('Starfield')
    this.scene.stop('MainMenuScene')
    this.scene.stop('RunnerScene')
    this.scene.start(this.selectedScene);
  }

  updateName(name) {
    this.playerText.setText(name);
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
      gravity: { y: 2200 },
      debug: false
    }
  },
  scene: [
    PreloadScene,
    MainMenuScene,
    RunnerScene,
    Starfield,
    Highscore,
    InputPanel
  ]
};

const game = new Phaser.Game(config);
