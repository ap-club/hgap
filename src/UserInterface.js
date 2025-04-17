class UserInterface extends Phaser.Scene {
  constructor() {
    super({
      key: 'UserInterface',
      active: true,
    });

    this.instructionsSeen = false;
    this.delayedTweens = {
      nextId: 0,
      timeouts: {},
    };
    this.FADE_OUT = {
      alpha: { from: 1, to: 0 },
      ease: 'Cubic.In',
    };
    this.FADE_IN = {
      alpha: { from: 0, to: 1 },
      ease: 'Cubic.Out',
    };
  }

  create() {
    this.mainScene = this.scene.get('Main');

    this.loadSequence();

    this.scale.on('resize', () => {
      if (!this.mainScene.hasLoaded) return;
      const currentScene = this.scene.get(this.mainScene.currentScene);
      if (currentScene) {
        currentScene.scene.restart();
        currentScene.play();
      }
      this.scene.restart();
    });
  }

  loadSequence() {
    if (this.mainScene.hasLoaded) {
      this.createUIElements();
      return;
    }

    this.loadUI = {};

    this.loadUI.overlay = this.add.rectangle(
      this.scale.width / 2,
      this.scale.height / 2,
      this.scale.width,
      this.scale.height,
      0x000000,
    )
      .setDepth(100);

    const loadPercent = this.add.text(this.scale.width / 2, this.scale.height / 2, '0%', {
      font: '24px Open Sans',
      fill: '#FFFFFF',
    })
      .setOrigin(0.5)
      .setDepth(102);
    this.loadUI.loadPercent = loadPercent;

    const tweenTargets = [this.loadUI.overlay, loadPercent];

    const makeLoadBox = (multiplier) => {
      const newRect = this.add.rectangle(
        this.scale.width / 2,
        this.scale.height / 2,
        150 + multiplier * 10,
        70 + multiplier * 10,
      );
      newRect.setStrokeStyle(1, 0xFF3423);
      newRect.setOrigin(0.5);
      newRect.depth = 101;
      tweenTargets.push(newRect);
    };

    let multiplier = 0;
    let count = 0;
    this.mainScene.load.on('progress', (value) => {
      const percent = Math.round(value * 1000) / 10;
      loadPercent.setText(`${percent > 95 ? '95.0' : percent}%`);
      if (count % 2 === 0) {
        makeLoadBox(multiplier);
        multiplier += 1;
      }
      count += 1;
    });

    this.mainScene.load.on('complete', () => {
      this.createUIElements();
      loadPercent.setText('100%');
      makeLoadBox(multiplier);
      this.tween(tweenTargets, this.FADE_OUT, 'fadeOut', 1500);
    });
  }

  createUIElements() {
    this.isPortrait = this.scale.width < this.scale.height;
    this.otherUIPool = {
      instructions: null,
      instructionsClose: null,
      credits: null,
      creditClose: null,
    };
    this.gameplayUI = {
      openSceneSelectButton: null,
      potScore: null,
      score: null,
      toggleCreditsButton: null,
      toggleInstructionsButton: null,
    };
    this.sceneSelect = {
      open: true,
      buttons: [],
      frame: null,
    };
    this.questionBox = {
      acquired: null,
      explanation: null,
      question: null,
      frame: null,
      close: null,
      correct: 0,
      buttons: [],
      buttonText: [],
      elements: [],
      isOpen: false,
      recentKey: '',
    };

    /* Scene selection */
    this.createSceneSelect();

    /* Score count and progress (gameplayUI, progressOverlay) */
    this.createScoreCount();

    /* Trivia questions (questionBox) */
    this.createQuestionBox();

    /* Top-right buttons (gameplayUI) */
    this.createNavButtons();

    /* Instructions, credits, win (otherUIPool) */
    this.createInstructions();
    this.createCredits();
    this.createWin();
  }

  createSceneSelect() {
    const frame = this.add.image(this.scale.width / 2, this.scale.height / 2, 'frame2');
    frame.depth = 90;
    frame.setOrigin(0.5);
    frame.scale = ((this.isPortrait ? 1 : 0.7) * this.scale.width) / frame.displayWidth;
    this.sceneSelect.frame = frame;

    const widthRatio = 439 / 2063;

    const gardenThumb = this.add.image(frame.x - frame.displayWidth / 2, frame.y, 'gardenthumb');
    gardenThumb.scale = (widthRatio * frame.displayWidth) / gardenThumb.width;
    gardenThumb.depth = 91;
    gardenThumb.x += (133 / 1920) * frame.displayWidth + gardenThumb.displayWidth / 2;
    gardenThumb.name = 'Garden';
    this.sceneSelect.buttons.push(gardenThumb);

    let currentX = gardenThumb.x;
    const space = (4 / 1346) * frame.displayWidth;
    for (const thumbName of ['Market', 'House', 'Festival']) {
      const thumb = this.add.image(currentX, frame.y, `${thumbName.toLowerCase()}thumb`);
      thumb.scale = (widthRatio * frame.displayWidth) / thumb.width;
      thumb.depth = 91;
      thumb.x += thumb.displayWidth + space;
      thumb.name = thumbName;
      this.sceneSelect.buttons.push(thumb);
      currentX = thumb.x;
    }

    for (const button of this.sceneSelect.buttons) {
      button.setInteractive();
      button.on('pointerover', () => {
        if (this.sceneSelect.open && !button.current) button.setFrame(2);
        if (this.sceneSelect.open) this.mainScene.setScene(button.name);
      });
      button.on('pointerout', () => {
        if (this.sceneSelect.open && !button.current) {
          button.setFrame(0);
        }
      });
      button.on('pointerdown', () => {
        if (this.sceneSelect.open) {
          button.setFrame(1);
        }
      });
      button.on('pointerup', () => {
        if (this.sceneSelect.open) {
          button.current = true;

          this.sceneSelect.open = false;
          this.tween([frame, ...this.sceneSelect.buttons], this.FADE_OUT, 'fadeOut', 500);
          this.tween(Object.values(this.gameplayUI), this.FADE_IN, 'fadeIn', 500);
          this.tween(this.progressOverlay, {
            alpha: { from: 0, to: 0.5 },
            ease: 'Cubic.Out',
          }, 'fadeIn', 500, 'sceneSelect fade progress in');

          for (const other of this.sceneSelect.buttons) {
            if (other.name !== button.name && other.frame.name === 1) {
              other.setFrame(0);
              other.current = false;
            }
          }

          if (!this.instructionsSeen) {
            this.instructionsSeen = true;
            this.toggleInstructions();
          }

          setTimeout(() => this.scene.get(button.name).play(), 250);
        }
      });
    }
  }

  createScoreCount() {
    const potScore = this.add.image(this.scale.width / 2, 0, 'toppot');
    potScore.setOrigin(0.5, 0);
    potScore.scale = ((115 / 929) * this.scale.height) / potScore.height;
    potScore.setY(10);
    potScore.depth = 92;
    const mask = potScore.createBitmapMask();
    potScore.alpha = 0;
    this.gameplayUI.potScore = potScore;

    this.progressOverlay = this.add.rectangle(
      this.scale.width / 2,
      10,
      potScore.displayWidth,
      potScore.displayHeight * (1 - this.mainScene.score / this.mainScene.winScore),
      0x000000,
    )
      .setOrigin(0.5, 0)
      .setAlpha(0.5)
      .setDepth(93)
      .setMask(mask);

    const score = this.add.text(this.scale.width / 2, 10 + potScore.displayHeight / 2, `${this.mainScene.score}/${this.mainScene.winScore}`, {
      font: `${((36 / 929) * this.scale.height)}px Open Sans`,
      fill: '#FFFFFF',
    });
    score.setOrigin(0.5);
    score.depth = 93;
    score.alpha = 0;
    this.gameplayUI.score = score;
  }

  createInstructions() {
    const instructions = this.add.image(this.scale.width / 2, 0.15 * this.scale.height, 'instructions')
      .setOrigin(0.5, 0)
      .setAlpha(0);
    instructions.setScale(((this.isPortrait ? 0.95 : 0.6) * this.scale.width) / instructions.width);
    this.otherUIPool.instructions = instructions;

    const closeButton = this.createCloseButton(instructions);
    closeButton.on('pointerup', () => {
      closeButton.setFrame(0);
      this.toggleInstructions(true);
    });
    closeButton.on('pointerout', () => closeButton.setFrame(0));
    closeButton.on('pointerdown', () => closeButton.setFrame(1));
    this.otherUIPool.instructionsClose = closeButton;
  }

  createCredits() {
    const credits = this.add.image(this.scale.width / 2, this.scale.height / 2, 'credits')
      .setOrigin(0.5, 0.5)
      .setAlpha(0)
      .setDepth(37);
    credits.setScale(((this.isPortrait ? 0.95 : 0.6) * this.scale.width) / credits.width);
    this.otherUIPool.credits = credits;

    const closeButton = this.createCloseButton(credits);
    closeButton.on('pointerup', () => {
      closeButton.setFrame(0);
      this.toggleCredits(true);
    });
    closeButton.on('pointerout', () => closeButton.setFrame(0));
    closeButton.on('pointerdown', () => closeButton.setFrame(1));
    this.otherUIPool.creditClose = closeButton;
  }

  createCloseButton(frame) {
    const closeButton = this.add.image(
      (frame.displayWidth + this.scale.width) / 2,
      frame.originY === 0 ? frame.y : frame.y - frame.displayHeight / 2,
      'xbutton',
    )
      .setOrigin(0.5)
      .setAlpha(0)
      .setInteractive()
      .setDepth(40);
    closeButton.setScale((0.1 * frame.displayHeight) / closeButton.height);
    return closeButton;
  }

  createWin() {
    const winFrame = this.add.image(this.scale.width / 2, 0.15 * this.scale.height, 'winframe')
      .setOrigin(0.5, 0)
      .setAlpha(0)
      .setDepth(70);
    winFrame.setScale(((this.isPortrait ? 0.5 : 0.3) * this.scale.width) / winFrame.width);
    this.otherUIPool.winFrame = winFrame;

    const winPot = this.add.image(this.scale.width / 2, winFrame.y + winFrame.displayHeight / 2, 'sidepot')
      .setOrigin(0.5, 0.5)
      .setAlpha(0)
      .setDepth(71);
    winPot.setScale((0.75 * winFrame.displayHeight) / winPot.height);

    if (this.mainScene.score === this.mainScene.winScore) {
      const button = this.gameplayUI.openSceneSelectButton;
      const scale = button.displayHeight / winPot.displayHeight;
      winPot.setX(button.x - 1.5 * scale * button.displayWidth - (this.isPortrait ? 10 : 20));
      winPot.setY(button.y + button.displayHeight / 2);
      winPot.setDisplaySize(winPot.displayWidth * scale, button.displayHeight);
      this.gameplayUI.winPot = winPot;
    } else {
      this.otherUIPool.winPot = winPot;
    }
  }

  createNavButtons() {
    const buttonNames = ['openSceneSelect', 'toggleInstructions', 'toggleCredits'];
    let frameNumber = 0;
    const buttonWidth = ((this.isPortrait ? 60 : 80) / 1920) * this.scale.width;
    const margin2 = ((this.isPortrait ? 10 : 20) / 1920) * this.scale.width;
    let currentXPos = this.scale.width - buttonNames.length * (buttonWidth + margin2);
    for (const name of buttonNames) {
      const button = this.add.image(currentXPos, margin2, 'buttons')
        .setFrame(frameNumber)
        .setAlpha(0)
        .setOrigin(0)
        .setInteractive();
      button.setScale(buttonWidth / button.width);
      this.gameplayUI[`${name}Button`] = button;
      const num = frameNumber;

      button.on('pointerdown', () => button.setFrame(num + 1));
      button.on('pointerup', () => {
        button.setFrame(num);
        this[name]();
      });
      button.on('pointerout', () => button.setFrame(num));
      currentXPos += buttonWidth + margin2;
      frameNumber += 2;
    }
  }

  createQuestionBox() {
    const questionFrame = this.add.image(this.scale.width / 2, this.scale.height / 2, 'question')
      .setOrigin(0.5)
      .setAlpha(0)
      .setDepth(31);
    questionFrame.setScale(
      ((this.isPortrait ? 0.95 : 0.7) * this.scale.width) / questionFrame.width,
    );
    this.questionBox.frame = questionFrame;
    this.questionBox.elements.push(questionFrame);

    const closeButton = this.createCloseButton(this.questionBox.frame);
    closeButton.on('pointerup', () => {
      closeButton.setFrame(0);
      this.closeTrivia();
    });
    closeButton.on('pointerout', () => closeButton.setFrame(0));
    closeButton.on('pointerdown', () => closeButton.setFrame(1));

    this.questionBox.elements.push(closeButton);
    this.questionBox.close = closeButton;

    const inHalfX = questionFrame.displayWidth / 2 - (164 / 2036) * questionFrame.displayWidth;
    const inHalfY = questionFrame.displayHeight / 2 - (260 / 690) * questionFrame.displayHeight;
    const question = this.add.text(
      questionFrame.x - inHalfX,
      questionFrame.y - inHalfY,
      '',
      {
        font: `${((63.84 / 690) * questionFrame.displayHeight)}px Open Sans`, // 1px font = 0.767543859649px real
        fill: '#A50000',
        wordWrap: { width: inHalfX },
      },
    )
      .setAlpha(0)
      .setDepth(32);
    this.questionBox.question = question;
    this.questionBox.elements.push(question);

    const xRatios = [1088 / 2036, 1484 / 2036];
    const yRatios = [163 / 690, 348 / 690];
    const frameLeft = questionFrame.x - questionFrame.displayWidth / 2;
    const frameTop = questionFrame.y - questionFrame.displayHeight / 2;

    const explanation = this.add.text(
      frameLeft + xRatios[0] * questionFrame.displayWidth,
      frameTop + (200 / 690) * questionFrame.displayHeight,
      '',
      {
        font: `${((32 / 690) * questionFrame.displayHeight)}px Open Sans`,
        fill: '#A50000',
        wordWrap: { width: (786 / 2036) * questionFrame.displayWidth },
      },
    )
      .setAlpha(0)
      .setDepth(32)
      .setName('explanation');
    this.questionBox.explanation = explanation;
    this.questionBox.elements.push(explanation);

    const acquired = this.add.text(
      explanation.x,
      frameTop + (294 / 456) * questionFrame.displayHeight,
      '',
      {
        font: `${((32 / 690) * questionFrame.displayHeight)}px Open Sans`,
        fill: '#A50000',
      },
    )
      .setAlpha(0)
      .setDepth(32)
      .setName('acquired');
    this.questionBox.acquired = acquired;
    this.questionBox.elements.push(acquired);

    const indices = [[0, 0], [1, 0], [0, 1], [1, 1]];
    for (let i = 0; i < 4; i += 1) {
      const button = this.add.image(
        frameLeft + xRatios[indices[i][0]] * questionFrame.displayWidth,
        frameTop + yRatios[indices[i][1]] * questionFrame.displayHeight,
        'answers',
      )
        .setFrame(i * 4)
        .setAlpha(0)
        .setDepth(33)
        .setOrigin(0)
        .setInteractive();
      button.setScale(questionFrame.displayWidth / 2036);
      this.questionBox.buttons.push(button);
      this.questionBox.elements.push(button);

      const buttonText = this.add.text(
        button.x + (176 / 914) * button.displayWidth,
        button.y + button.displayHeight / 2,
        '',
        {
          font: `${((30 / 690) * questionFrame.displayHeight)}px Open Sans`,
          fill: '#A50000',
          wordWrap: { width: (700 / 914) * button.displayWidth },
        },
      )
        .setAlpha(0)
        .setDepth(34)
        .setOrigin(0, 0.5);
      this.questionBox.buttonText.push(buttonText);
      this.questionBox.elements.push(buttonText);

      const baseFrame = i * 4;
      button.on('pointerover', () => {
        const frameType = button.frame.name % 4;
        if (frameType !== 2 && frameType !== 3) {
          button.setFrame(baseFrame + 1);
        }
      });
      button.on('pointerout', () => {
        const frameType = button.frame.name % 4;
        if (frameType !== 2 && frameType !== 3) {
          button.setFrame(baseFrame);
        }
      });
      button.on('pointerup', () => {
        if (this.questionBox.recentKey && this.questionBox.isOpen) {
          const key = this.questionBox.recentKey;
          const isCorrect = i === this.questionBox.correct;

          if (isCorrect) {
            button.setFrame(baseFrame + 3);
            this.delayedTween(
              500,
              true,
              [...this.questionBox.buttons, ...this.questionBox.buttonText],
              this.FADE_OUT,
              'fadeOut',
              1000,
              {},
              true,
            );

            this.delayedTween(1500, true, [explanation, acquired], this.FADE_IN, 'fadeIn', 1000, {}, true);

            if (this.questionBox.collected) {
              this.questionBox.acquired.setText(`You already have ${key}.`);
            } else {
              this.mainScene.collectKey(key);
              this.increaseScore();
              this.questionBox.acquired.setText(`You acquired: ${key}`);
              this.questionBox.collected = true;
              this.scene.get(this.mainScene.currentScene).removeIngredient(key);
              if (this.mainScene.score === this.mainScene.winScore) this.winSequence();
            }
          } else {
            button.setFrame(baseFrame + 2);
          }
        }
      });
    }
  }

  winSequence() {
    const button = this.gameplayUI.openSceneSelectButton;
    const { winPot, winFrame } = this.otherUIPool;
    const finalScale = button.displayHeight / winPot.displayHeight;
    delete this.otherUIPool.winPot;
    this.gameplayUI.winPot = winPot;

    this.tween([winPot, winFrame], this.FADE_IN, 'fadeIn', 1000, {}, true);
    this.delayedTween(3000, false, winPot, {
      x: {
        from: winPot.x,
        to: button.x - 1.5 * finalScale * button.displayWidth - (this.isPortrait ? 10 : 20),
      },
      y: {
        from: winPot.y,
        to: button.y + button.displayHeight / 2,
      },
      displayHeight: {
        from: winPot.displayHeight,
        to: button.displayHeight,
      },
      displayWidth: {
        from: winPot.displayWidth,
        to: finalScale * winPot.displayWidth,
      },
      ease: 'Linear',
    }, 'move', 800, {}, true, true, true);
    this.delayedTween(2000, false, winFrame, this.FADE_OUT, 'fadeIn', 1000, {}, true);
    const { credits, creditClose } = this.otherUIPool;
    this.delayedTween(3800, false, [credits, creditClose], this.FADE_IN, 'fadeIn', 500);
  }

  openSceneSelect() {
    this.sceneSelect.open = true;
    this.mainScene.setScene();
    this.mainScene.setScene(this.mainScene.currentScene);
    this.tween(
      [
        ...Object.values(this.gameplayUI),
        ...Object.values(this.otherUIPool),
        ...this.questionBox.elements,
      ],
      this.FADE_OUT,
      'fadeOut',
      200,
    );
    this.tween(
      [this.sceneSelect.frame, ...this.sceneSelect.buttons],
      this.FADE_IN,
      'fadeIn',
      500,
    );
  }

  toggleInstructions(forceClose) {
    const { instructions, instructionsClose } = this.otherUIPool;
    if (instructions.alpha > 0 || forceClose) {
      this.tween([instructions, instructionsClose], this.FADE_OUT, 'fadeOut', 500);
    } else {
      this.tween([instructions, instructionsClose], this.FADE_IN, 'fadeIn', 500, {}, true);
      this.delayedTween(7000, true, [instructions, instructionsClose], { alpha: this.FADE_OUT.alpha }, 'fadeOut', 2000, {
        ease: 'Linear',
      });
    }
  }

  toggleCredits(forceClose) {
    const { credits, creditClose } = this.otherUIPool;
    if (credits.alpha > 0 || forceClose) {
      this.tween([credits, creditClose], this.FADE_OUT, 'fadeOut', 500);
    } else {
      this.tween([credits, creditClose], this.FADE_IN, 'fadeIn', 500);
    }
  }

  openTrivia(key) {
    const data = this.mainScene.getQuestionData(key);
    const qB = this.questionBox;

    this.tween(qB.elements, this.FADE_OUT, 'fadeOut', 0);

    qB.isOpen = true;
    qB.question.setText(data.question);
    qB.explanation.setText(data.explanation);
    qB.acquired.setY(
      qB.explanation.y + qB.explanation.displayHeight + qB.frame.displayHeight * (10 / 454),
    );
    qB.correct = data.correct;
    qB.collected = this.mainScene.isCollected(key);
    qB.recentKey = key;

    for (let i = 0; i < 4; i += 1) {
      qB.buttonText[i].setText(data.answers[i]);
      qB.buttons[i].setFrame(i * 4);
    }

    this.tween(
      [...qB.buttons, ...qB.buttonText, qB.question, qB.frame, qB.close],
      this.FADE_IN,
      'fadeIn',
      500,
      {},
      false,
      true,
    );
    this.toggleInstructions(true);
  }

  closeTrivia() {
    this.tween(this.questionBox.elements, this.FADE_OUT, 'fadeOut', 500, {}, false, false, true);
    this.questionBox.isOpen = false;
  }

  increaseScore() {
    if (this.mainScene.score === this.mainScene.winScore) return;
    this.mainScene.score += 1;
    this.gameplayUI.score.setText(`${this.mainScene.score}/${this.mainScene.winScore}`);
    const currentHeight = this.progressOverlay.displayHeight;
    const newHeight = (1 - this.mainScene.score / this.mainScene.winScore)
      * this.gameplayUI.potScore.displayHeight;
    this.tween(this.progressOverlay, {
      displayHeight: { from: currentHeight, to: newHeight },
      ease: 'Expo.Out',
    }, this.mainScene.score, 800);
  }

  tween(
    target,
    anim,
    name,
    duration,
    moreTweenOptions,
    keepDelayed,
    overrideChecks,
    priority,
  ) {
    const targets = Array.isArray(target) ? [...target] : [target];
    let propTo = null;
    for (const [key, value] of Object.entries(anim)) {
      if (value.to !== undefined) {
        propTo = [key, value.to];
        break;
      }
    }

    for (let i = 0; i < targets.length; i += 1) {
      let allow = targets[i][propTo[0]] !== propTo[1] || overrideChecks;
      if ((targets[i].name === 'acquired' || targets[i].name === 'explanation')
        && name === 'fadeIn'
        && !this.questionBox.isOpen) {
        allow = false;
      }

      if (allow && !overrideChecks) {
        for (const tween of this.tweens.getTweensOf(targets[i])) {
          if (tween.name === name && tween.progress !== 1 && tween.hasStarted) {
            allow = false;
            break;
          }
        }
      }

      if (allow) {
        for (const tween of this.tweens.getTweensOf(targets[i])) {
          if (!tween.priority) tween.stop();
        }
        if (keepDelayed !== true) {
          this.cancelDelayedTweens(targets[i]);
        }
      } else targets[i] = null;
    }

    const tween = this.tweens.add({
      targets,
      duration,
      ...anim,
      ...moreTweenOptions !== undefined && moreTweenOptions,
    });
    tween.name = name;
    if (priority) tween.priority = true;
  }

  delayedTween(delayMs, replaceDelayed, target, ...tweenArgs) {
    const targets = Array.isArray(target) ? [...target] : [target];
    const id = this.delayedTweens.nextId;
    this.delayedTweens.nextId += 1;
    const delayedObj = {};

    if (replaceDelayed) {
      for (const el of targets) {
        this.cancelDelayedTweens(el);
      }
    }

    this.delayedTweens.timeouts[id] = delayedObj;
    const timeout = setTimeout(() => {
      delete this.delayedTweens.timeouts[id];
      this.tween(delayedObj.target, ...tweenArgs);
    }, delayMs);
    delayedObj.timeoutId = timeout;
    delayedObj.target = targets;
  }

  cancelDelayedTweens(element) {
    for (const obj of Object.values(this.delayedTweens.timeouts)) {
      if (obj.target.includes(element)) {
        obj.target.splice(obj.target.indexOf(element), 1);
      }
    }
  }
}
