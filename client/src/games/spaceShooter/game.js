const width = 800;
const height = 600;

class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });

    window.addEventListener("message", event => {
      // IMPORTANT: Check the origin of the data!
      if (event.origin === "http://localhost:3000") {
        // The data sent with postMessage is stored in event.data
        if (this.scene.isActive("GameScene")) {
          switch (event.data.type) {
            case "XPosition":
              this.calculateRelativePosition(event.data.percentX);
            default:
              break;
          }
        }
        return;
      }
    });
  }

  calculateRelativePosition = (percentX) => {
    let relativeX = this.scene.manager.game.config.width * percentX;
    let difference = relativeX - this.player.x;
    if (Math.abs(difference) >= 50) {
      let direction = (difference >= 0) ? 1 : -1
      // this.actions[direction] = true;
      this.player.body.drag.setTo(this.drag, this.drag)
      this.player.body.velocity.x = this.acceleration * direction;
    } else {
      this.player.body.drag.setTo(1000, 1000)
    }
  }

  preload() {
    this.load.image("blueEnemyBullet", "./assets/enemy-blue-bullet.png");
    this.load.image("starfieldBG", "./assets/starfield.png");
    this.load.image("ship", "./assets/player.png");
    this.load.image("bullet", "./assets/bullet.png");
    this.load.image("greenEnemy", "./assets/enemy-green.png");
    this.load.image("blueEnemy", "./assets/enemy-blue.png");
    this.load.spritesheet("explosion", "./assets/explode.png", {
      frameWidth: 128,
      frameHeight: 128
    });
  }

  create() {
    this.anims.create({
      key: "explosionAnim",
      frames: this.anims.generateFrameNumbers("explosion", {
        start: 0,
        end: 16
      }),
      frameRate: 15,
      repeat: 0
    });

    // this.physics.world.setBoundsCollision(true, true, true, true);
    // this.physics.world.on("worldbounds", function (body) {
    //   alert("Collide with world bounds!")
    // });

    //Init variables
    this.player;
    this.starfieldBG;
    this.cursors;
    this.acceleration = 350;
    this.drag = 400;
    this.maxSpeed = 600;
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
      defaultKey: "blueEnemyBullet",
      maxSize: 50
    });
    this.blueEnemies = this.physics.add.group({
      defaultKey: "blueEnemy",
      maxSize: 30
    });
    this.explosions = this.physics.add.group({
      defaultKey: "explosion",
      maxSize: 30
    });

    //Init enemy spawn recursion
    this.spawnGreenEnemy();
    this.spawnBlueEnemy();

    //Scrolling BG
    this.starfieldBG = this.add
      .tileSprite(400, 300, width, height, "starfieldBG")
      .setDepth(-1);

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
    this.physics.add.collider(
      this.player,
      this.greenEnemies,
      this.shipCollide,
      null,
      this
    );
    this.physics.add.collider(
      this.greenEnemies,
      this.playerLasers,
      this.hitEnemy,
      null,
      this
    );
    this.physics.add.collider(
      this.blueEnemies,
      this.playerLasers,
      this.hitEnemy,
      null,
      this
    );
    this.physics.add.collider(
      this.player,
      this.blueEnemies,
      this.shipCollide,
      null,
      this
    );
    this.physics.add.collider(
      this.player,
      this.enemyLasers,
      this.enemyHitPlayer,
      null,
      this
    );
    //Setup arrow key controls
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  shipCollide = (player, enemy) => {
    this.spawnExplosion(player.body);
    this.gameOver = true;
    player.destroy();
  };

  spawnExplosion = body => {
    let explosion = this.explosions.get().setActive(true);
    explosion.setOrigin(0.5, 0.5);
    explosion.setPosition(body.x + body.halfWidth, body.y + body.halfHeight);
    explosion.body.velocity.y = body.velocity.y;
    explosion.play("explosionAnim");
    explosion.setAlpha(0.7);
    explosion.on(
      "animationcomplete",
      function () {
        explosion.setAlpha(0);
        explosion.setActive(false);
      },
      this
    );
  };

  hitEnemy = (enemy, laser) => {
    this.spawnExplosion(enemy.body);
    enemy.destroy();
    laser.destroy();

    //Add score
    this.score += 100;
    this.scoreText.setText("Score: " + this.score);
  };

  enemyHitPlayer = (player, laser) => {
    this.spawnExplosion(player.body);
    this.gameOver = true;
    player.destroy();
  };

  spawnGreenEnemy = () => {
    let randomX = Phaser.Math.Between(0, this.scene.manager.game.config.width);
    let enemy = this.add.sprite(randomX, -20, "greenEnemy");
    this.greenEnemies.add(enemy);
    enemy.body.setSize((enemy.width * 3) / 4, (enemy.height * 3) / 4);
    enemy.setScale(0.5, 0.5);
    enemy.angle = 180;
    enemy.body.velocity.x = Phaser.Math.Between(-250, 250);
    enemy.body.velocity.y = 350;
    enemy.body.drag.setTo(100, 0);

    enemy.updateAngle = () => {
      enemy.angle =
        180 -
        Phaser.Math.RadToDeg(
          Math.atan2(enemy.body.velocity.x, enemy.body.velocity.y)
        );
    };

    let randomSpawnTime = Phaser.Math.Between(600, 1200);
    this.greenSpawnTimer = this.time.delayedCall(
      randomSpawnTime,
      this.spawnGreenEnemy
    ); // delay in ms
  };

  spawnBlueEnemy = () => {
    let spread = 60;
    let frequency = 70;
    let verticalSpacing = 90;
    let numEnemiesInWave = 5;
    let verticalSpeed = 300;
    let randomX = Phaser.Math.Between(0, this.scene.manager.game.config.width);
    // enemy.body.setSize(enemy.width * 3 / 4, enemy.height * 3 / 4);

    let firingDelay = 3000;
    let bulletSpeed = 220;

    //Wave of enemies
    for (let i = 0; i < numEnemiesInWave; i++) {
      let enemy = this.blueEnemies.get().setActive(true);
      enemy.setPosition(randomX, -verticalSpacing * i);
      // this.blueEnemies.add(enemy);
      enemy.startingX = randomX;
      enemy.setOrigin(0.5, 0.5);
      enemy.setScale(0.5, 0.5);
      enemy.angle = 180;
      enemy.body.velocity.y = verticalSpeed;
      enemy.lastShotTime = 0;
      enemy.bullets = 1;
      enemy.update = function (scene) {
        //  Wave movement
        this.setX(this.startingX + Math.sin(this.y / frequency) * spread);
        let bank = Math.cos((this.y + 60) / frequency);
        this.setAngle(180 - bank * 2);

        //Start firing after at least 1/8 down the page
        if (
          this.bullets >= 1 &&
          this.active &&
          this.y > game.config.height / 8 &&
          Date.now() > firingDelay + this.lastShotTime
        ) {
          this.bullets--;
          this.lastShotTime = Date.now();
          let laser = scene.enemyLasers.get().setActive(true);
          laser.setCrop(90, 0, 90, 70);
          laser.setOrigin(0.5, 0.5);
          laser.setPosition(this.x, this.y + this.height / 2);
          // let laser = scene.add.sprite(this.x, this.y + this.height / 2, 'blueEnemyBullet')
          // scene.enemyLasers.add(laser)
          laser.setOrigin(0.5, 0.5);
          laser.setAlpha(0.9);
          laser.body.setSize(30, 30);

          let angle = scene.physics.moveToObject(
            laser,
            scene.player,
            bulletSpeed
          );
          laser.setAngle(Phaser.Math.RadToDeg(angle));
        }
        //  Kill enemies once they go off screen
        if (this.y > game.config.height + 200) {
          this.destroy();
        }
      };
    }

    let randomSpawnTime = Phaser.Math.Between(3000, 6000);
    this.blueSpawnTimer = this.time.delayedCall(
      randomSpawnTime,
      this.spawnBlueEnemy
    ); // delay in ms
  };

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
  };

  firePlayerLaser = () => {
    let laserSpeed = 400;
    let laser = this.add.sprite(this.player.x, this.player.y - 30, "bullet");
    this.playerLasers.add(laser);
    laser.body.velocity.y = laserSpeed * -1;
  };

  update() {
    if (this.gameOver) {
      //Stop active timers/emitters
      this.greenSpawnTimer.remove();
      this.blueSpawnTimer.remove();
      this.fireTimer.remove();
      this.shipTrail.stop();

      this.scene.pause();
      let scoreCopy = this.score;
      this.scoreText.destroy();
      this.scene.launch("Highscore", { score: scoreCopy });
      return;
    }
    this.greenEnemies.getChildren().forEach(enemy => {
      enemy.updateAngle();
    });
    this.blueEnemies.getChildren().forEach(enemy => {
      enemy.update(this);
    });
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
      this.player.fireTimer.paused = this.player.fireTimer.paused
        ? false
        : true;
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

class MainMenuScene extends Phaser.Scene {
  constructor() {
    super({ key: "MainMenuScene" });
    this.useCameraControls = false;
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
      .bitmapText(165, 200, "arcade", "Space Shooter")
      .setTint(0x66fcf1)
      .setFontSize(36);
    let playBtn = this.add
      .bitmapText(340, 300, "arcade", "Play")
      .setTint(0x66bcfc);
    playBtn.setInteractive(
      new Phaser.Geom.Rectangle(0, 0, playBtn.width, playBtn.height),
      Phaser.Geom.Rectangle.Contains
    );
    this.playBtnTween = this.tweens.add({
      targets: playBtn,
      alpha: 0.2,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
      duration: 450
    });
    playBtn.on("pointerdown", () => {
      this.changeScenes();
    });
  }

  changeScenes = () => {
    this.playBtnTween.stop();
    this.scene.start("GameScene", {
      useCameraControls: this.useCameraControls
    });
  };
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
    } else if (code === Phaser.Input.Keyboard.KeyCodes.ENTER) {
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

    this.baseHeight = 250;
    this.textStartWidth = 80;
    this.playText = "Play Again";
    this.menuText = "Main Menu";
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
      .bitmapText(
        this.textStartWidth,
        this.baseHeight,
        "arcade",
        "RANK  SCORE   NAME"
      )
      .setTint(0x66bcfc);
    this.playerRow = this.add
      .bitmapText(
        this.textStartWidth,
        this.baseHeight + 50,
        "arcade",
        `???   ${this.playerScore}`
      )
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
      .setTint(0xa666fc);
    this.playBtn.setInteractive(
      new Phaser.Geom.Rectangle(0, 0, this.playBtn.width, this.playBtn.height),
      Phaser.Geom.Rectangle.Contains
    );
    this.selectedScene = "GameScene";
    this.playBtn.on("pointerdown", () => {
      this.selectedScene = "GameScene";
      this.changeScenes();
    });

    this.menuBtn = this.add
      .bitmapText(245, 80, "arcade", this.menuText)
      .setTint(0xa666fc);
    this.menuBtn.setInteractive(
      new Phaser.Geom.Rectangle(0, 0, this.menuBtn.width, this.menuBtn.height),
      Phaser.Geom.Rectangle.Contains
    );
    this.menuBtn.on("pointerdown", () => {
      this.selectedScene = "MainMenuScene";
      this.changeScenes();
    });

    this.cursor1 = this.add.bitmapText(0, 0, "arcade", "-");
    this.cursor1.setPosition(230 - this.cursor1.width - 10, 32);
    this.tweens.add({
      targets: this.cursor1,
      alpha: 0.2,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
      duration: 450
    });
    this.cursor2 = this.add.bitmapText(0, 0, "arcade", "-");
    this.cursor2.setPosition(230 + this.playBtn.width + 10, 32);
    this.tweens.add({
      targets: this.cursor2,
      alpha: 0.2,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
      duration: 450
    });

    axios
      .post(`http://localhost:8080/spaceShooter`, {
        name: this.playerText.text,
        score: this.playerScore
      })
      .then(response => {
        let isHighscore = response.data.highScore;
        let wasCreated = response.data.created;
        axios
          .get(
            `http://localhost:8080/spaceShooter/ranks/${this.playerText.text}`
          )
          .then(response => {
            this.add
              .bitmapText(
                this.textStartWidth + 200,
                this.baseHeight - 80,
                "arcade",
                `Game Over \n\nScore: ${this.playerScore}`
              )
              .setTint(0xff0000)
              .setFontSize(20);
            response.data.forEach((entry, i) => {
              let ranking = `${entry.ranking}`;
              let score = `${entry.score}`;
              let name = `${entry.name}`;
              let textHeight = this.baseHeight + 50 + i * 60;
              while (ranking.length < 4) {
                ranking = ranking.concat(" ");
              }
              while (score.length < 4) {
                score = score.concat(" ");
              }
              let str = ranking + "  " + score + "   " + name;
              let row = this.add.bitmapText(
                this.textStartWidth,
                textHeight,
                "arcade",
                str
              );
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
                  this.add
                    .bitmapText(
                      this.textStartWidth + 110,
                      textHeight,
                      "arcade",
                      "New High-Score!"
                    )
                    .setFontSize(14)
                    .setRotation(-0.15)
                    .setTint(0xfcd466);
                } else if (!isHighscore && !wasCreated) {
                  this.add
                    .bitmapText(
                      this.textStartWidth + 80,
                      textHeight + 5,
                      "arcade",
                      "Previous High-Score"
                    )
                    .setFontSize(14)
                    .setRotation(-0.15);
                }
                row.setTint(0x66fcf1);
              } else {
                row.setTint(0xa19d9b);
              }
            });
          });
      });
  }

  moveUp() {
    this.selectedScene = "GameScene";
    this.cursor1.setPosition(230 - this.cursor1.width - 10, 32);
    this.cursor2.setPosition(230 + this.playBtn.width + 10, 32);
  }

  moveDown() {
    this.cursor1.setPosition(245 - this.cursor1.width - 10, 80);
    this.cursor2.setPosition(245 + this.menuBtn.width + 10, 80);
    this.selectedScene = "MainMenuScene";
  }

  changeScenes() {
    this.scene.stop("Highscore");
    this.scene.stop("Starfield");
    this.scene.stop("MainMenuScene");
    this.scene.stop("GameScene");
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
      debug: false
    }
  },
  scene: [
    // PreloadScene,
    MainMenuScene,
    GameScene,
    Starfield,
    Highscore,
    InputPanel
  ]
};

const game = new Phaser.Game(config);
