class House extends Phaser.Scene {
  constructor() {
    super('House');
  }

  create() {
    const groundHeightPixels = 110;

    this.bg = this.add.image(0, 0, 'house');
    this.bg.depth = 0;
    const imgScale = (929 / (928 - groundHeightPixels)) * (this.scale.height / this.bg.height);
    this.bg.scale = imgScale;
    const bgNewHeight = this.bg.displayHeight;
    const bgNewWidth = this.bg.displayWidth;
    this.bg.setX(bgNewWidth / 2);
    this.bg.setY(bgNewHeight / 2);

    const lowSectionWidth = (83 / 1919) * bgNewWidth;

    this.groundHeight = bgNewHeight * (groundHeightPixels / 929);
    this.ghostGround = this.add.zone(
      this.scale.width / 2 + lowSectionWidth,
      bgNewHeight,
      this.scale.width - lowSectionWidth,
      this.groundHeight * 2,
    );
    this.groundHeight2 = bgNewHeight * (80 / 929);
    this.ghostGround2 = this.add.zone(
      lowSectionWidth / 2,
      bgNewHeight,
      lowSectionWidth,
      this.groundHeight2 * 2,
    );

    this.lowSectionWidth = lowSectionWidth;

    this.physics.add.existing(this.ghostGround, true);
    this.physics.add.existing(this.ghostGround2, true);
    this.physics.world.setBounds(0, 0, bgNewWidth, this.scale.height + this.groundHeight);
    this.cameras.main.setBounds(0, 0, bgNewWidth, this.scale.height + this.groundHeight);
    this.startX = this.scale.width / 2;
    this.cameras.main.scrollX = this.startX - this.scale.width / 2;
  }

  play() {
    this.player = new Player(this, this.startX);
    this.physics.add.collider(this.player.sprite, this.ghostGround);
    this.physics.add.collider(this.player.sprite, this.ghostGround2);
    this.player.createAnims();

    this.cameras.main.pan(
      this.startX,
      (this.scale.height + this.groundHeight) / 2,
      220,
      Phaser.Math.Easing.Quadratic.Out,
    );

    this.cameras.main.startFollow(
      this.player.sprite,
      false,
      0.1,
      0.3,
      0,
      this.scale.height / 2 - this.groundHeight - this.player.sprite.displayHeight / 2,
    );

    this.cursors = this.input.keyboard.createCursorKeys();

    const ingredientIndices = [1, 2];
    const ingredientPositionRatios = [804 / 1920, 1332 / 1920];
    this.ingredientKeys = ingredientIndices.map((i) => this.scene.get('Main').getIngredient(i));
    this.ingredients = {};

    let iprIndex = 0;
    for (const key of this.ingredientKeys) {
      if (!key) {
        iprIndex += 1;
        continue;
      }
      const ingredient = this.physics.add.sprite(
        (ingredientPositionRatios[iprIndex]) * this.bg.displayWidth,
        this.bg.displayHeight - this.ghostGround.displayHeight,
        key,
      )
        .setDepth(30);
      ingredient.body.allowGravity = false;
      ingredient.setScale(
        ((111 / 929) * this.scale.height) / ingredient.height,
      );
      const deltaY = ingredient.displayHeight / 4;
      const yInit = ingredient.y;
      iprIndex += 1;

      this.ingredients[key] = {
        sprite: ingredient,
        tween: this.tweens.add({
          targets: ingredient,
          y: { from: yInit - deltaY, to: yInit + deltaY },
          ease: 'Cubic.InOut',
          duration: 2000,
          repeat: -1,
          yoyo: true,
        }),
      };
    }
  }

  update() {
    const { scrollX } = this.cameras.main;
    this.ghostGround.body.position.x = scrollX + (this.lowSectionWidth);
    this.ghostGround2.body.position.x = scrollX;

    if (this.player) {
      this.player.updateLook(this.cursors);
      for (const key of this.ingredientKeys) {
        if (!key) continue;
        const ingObj = this.ingredients[key];
        if (this.physics.overlap(this.player.sprite, ingObj.sprite)) {
          if (ingObj.tween.isPlaying()) {
            ingObj.tween.pause();
            this.scene.get('UserInterface').openTrivia(key);
          }
        } else if (ingObj.tween.isPaused()) {
          ingObj.tween.play();
          this.scene.get('UserInterface').closeTrivia();
        }
      }
    }
  }

  removeIngredient(key) {
    if (this.ingredients[key]) {
      this.ingredients[key].tween.stop();
      this.tweens.add({
        targets: this.ingredients[key].sprite,
        alpha: { from: 1, to: 0 },
        duration: 750,
      });
      this.ingredientKeys[this.ingredientKeys.indexOf(key)] = null;
    }
  }
}
