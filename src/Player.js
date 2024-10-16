class Player {
  constructor(scene, startX) {
    const sprite = scene.physics.add.sprite(
      startX,
      scene.scale.height - scene.groundHeight,
      'bunny',
    );

    this.sprite = sprite;
    this.scene = scene;
    this.direction = 'R';
    this.lastMovement = Date.now();
    this.motionScale = this.scene.scale.height / 929;
    this.controls = scene.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    });

    sprite.bounce = 0;
    sprite.setCollideWorldBounds(true);
    sprite.scale = (scene.scale.height * 0.2) / sprite.height;
    sprite.body.setGravityY(400 * this.motionScale);
    sprite.depth = 10;
    sprite.debugShowBody = true;
  }

  updateLook(cursors) {
    if (!this.sprite.body) return;
    const isAirborne = !this.sprite.body.touching.down;
    const isAtBoundary = this.sprite.body.x === 0
      || Math.floor(this.scene.bg.displayWidth - this.sprite.body.x) < this.sprite.displayWidth;
    const speedBoost = isAirborne ? 1.6 : 1;
    const isLeftDown = cursors.left.isDown || this.controls.left.isDown;
    const isRightDown = cursors.right.isDown || this.controls.right.isDown;
    const isUpDown = cursors.up.isDown
      || cursors.space.isDown
      || cursors.shift.isDown
      || this.controls.up.isDown;

    if (isLeftDown) {
      this.sprite.setVelocityX(-250 * this.motionScale * speedBoost);
      this.direction = 'L';
    } else if (isRightDown) {
      this.sprite.setVelocityX(250 * this.motionScale * speedBoost);
      this.direction = 'R';
    } else {
      this.sprite.setAccelerationX(-this.sprite.body.velocity.x * 3.7);
    }

    if (isLeftDown || isRightDown || isUpDown) {
      this.sprite.flipX = this.direction === 'L';
      this.lastMovement = Date.now();
    }

    if (isAirborne || isUpDown) {
      this.sprite.anims.play('jump');
      this.sprite.rotation = ((this.direction === 'L' ? -1 : 1)
        * (this.sprite.body.velocity.y / 1000 - 0.36)) / (this.motionScale * 2);
    } else if ((isLeftDown || isRightDown) && !isAtBoundary) {
      this.sprite.anims.play('walk', true);
    } else if (Date.now() - this.lastMovement > 10000) {
      this.sprite.anims.play('sit');
    } else {
      this.sprite.anims.play('rest');
    }

    if (!isAirborne) {
      this.sprite.rotation = 0;
      if (isUpDown) this.sprite.setVelocityY(-360 * (this.motionScale ** 0.8));
    }
  }

  createAnims() {
    this.scene.anims.create({
      key: 'walk',
      frames: this.scene.anims.generateFrameNumbers('bunny', {
        start: 3,
        end: 4,
      }),
      frameRate: 3,
      repeat: -1,
    });

    this.scene.anims.create({
      key: 'rest',
      frames: [{
        key: 'bunny',
        frame: 2,
      }],
      frameRate: 5,
    });

    this.scene.anims.create({
      key: 'sit',
      frames: [{
        key: 'bunny',
        frame: 0,
      }],
      frameRate: 5,
    });

    this.scene.anims.create({
      key: 'jump',
      frames: [{
        key: 'bunny',
        frame: 1,
      }],
      frameRate: 5,
    });
  }
}
