class Main extends Phaser.Scene {
  constructor() {
    super('Main');
    this.hasLoaded = false;
    this.score = 0;
    this.winScore = 7;
  }

  preload() {
    this.load.image('garden', 'src/assets/Garden_Scene.jpg?v=2');
    this.load.image('market', 'src/assets/Night_Market_Scene.jpg?v=2');
    this.load.image('pillar', 'src/assets/market_pillar.png?v=2');
    this.load.image('house', 'src/assets/House_Scene.jpg?v=2');
    this.load.image('festival', 'src/assets/Festival_Scene.jpg?v=2');
    this.load.image('frame2', 'src/assets/frame2.png');
    this.load.image('question', 'src/assets/question.png');
    this.load.image('toppot', 'src/assets/hotpot-top.png');
    this.load.image('sidepot', 'src/assets/hotpot-side.png');
    this.load.image('instructions', 'src/assets/instructions.png');
    this.load.image('winframe', 'src/assets/winframe.png');
    this.load.image('credits', 'src/assets/credits.png');

    this.load.image('Enoki', 'src/assets/enoki.png');
    this.load.image('Bok Choy', 'src/assets/bok-choy.png');
    this.load.image('Baby Corn', 'src/assets/baby-corn.png');
    this.load.image('Udon', 'src/assets/udon.png');
    this.load.image('Beef', 'src/assets/beef.png');
    this.load.image('Fish Ball', 'src/assets/fish-balls.png');
    this.load.image('Eggs', 'src/assets/eggs.png');

    this.load.spritesheet('bunny', 'src/assets/bunnies.png?v=2', {
      frameWidth: 520,
      frameHeight: 400,
    });
    this.load.spritesheet('gardenthumb', 'src/assets/garden_thumbnail.png?v=2', {
      frameWidth: 332,
      frameHeight: 310,
    });
    this.load.spritesheet('marketthumb', 'src/assets/market_thumbnail.png?v=2', {
      frameWidth: 332,
      frameHeight: 310,
    });
    this.load.spritesheet('housethumb', 'src/assets/house_thumbnail.png?v=2', {
      frameWidth: 332,
      frameHeight: 310,
    });
    this.load.spritesheet('festivalthumb', 'src/assets/festival_thumbnail.png?v=2', {
      frameWidth: 332,
      frameHeight: 310,
    });
    this.load.spritesheet('buttons', 'src/assets/buttons.png', {
      frameWidth: 127,
      frameHeight: 134,
    });
    this.load.spritesheet('xbutton', 'src/assets/xbutton.png', {
      frameWidth: 189,
      frameHeight: 200,
    });
    this.load.spritesheet('answers', 'src/assets/answers.png', {
      frameWidth: 390,
      frameHeight: 180,
    });

    this.load.on('complete', () => {
      this.hasLoaded = true;
    });
  }

  create() {
    this.currentScene = '';

    this.trivia = {
      Enoki: {
        question: 'Which animal is this year the year of?',
        answers: ['Rabbit', 'Pig', 'Rooster', 'Cat'],
        correct: 0,
        explanation: 'Each year in the repeating zodiac cycle of 12 years is represented by a zodiac animal, each with its own reputed attributes. The rabbit represents prosperity, abundance, and elegance.',
      },
      'Bok Choy': {
        question: 'What is the popular dance on this holiday?',
        answers: ['Rabbit dance', 'K-pop dances', 'Lion or dragon dances', 'Monkey dance'],
        correct: 2,
        explanation: 'Lion and dragon dances are commonly performed during the new year to bring good luck and drive away evil spirits. Dancers dress in red and gold lion and dragon costumes.',
      },
      'Baby Corn': {
        question: 'How long does the celebration last?',
        answers: ['1 day', '15 days', '1 week', 'A month'],
        correct: 1,
        explanation: '14 days of firecrackers and feasting culminate in the Spring Festival on the 15th day of the new year celebration. The Spring Festival is the biggest festival in China, Taiwan, and Vietnam, and an important holiday in Korea and other Asian countries.',
      },
      Udon: {
        question: 'What do people exchange during the Lunar New Year?',
        answers: ['High fives', 'Home-made cookies', 'Candles', 'Red Envelopes'],
        correct: 3,
        explanation: 'Red envelopes, called hongbao in Chinese and lai see in Cantonese, contain money and are symbols of good luck.',
      },
      Beef: {
        question: 'How many animals are in the Chinese Zodiac?',
        answers: ['1 animal', '100 animals', '10,000 animals', '12 animals'],
        correct: 3,
        explanation: 'In order, the animals of the zodiac are as follows: rat, ox, tiger, rabbit, dragon, snake, horse, goat, monkey, rooster, dog, pig.',
      },
      'Fish Ball': {
        question: 'What are the main colors of the Lunar New Year?',
        answers: ['Black and gold ', 'Blue and green', 'Red and gold', 'Red and green'],
        correct: 2,
        explanation: 'In Chinese culture, the color red is associated with energy, happiness and good luck. Gold is associated with good fortune and wealth.',
      },
      Eggs: {
        question: 'What calendar is the Lunar New Year based on?',
        answers: ['Lunar calendar', 'Gregorian calendar', 'Aztec calendar', 'Hebrew calendar'],
        correct: 0,
        explanation: "A lunar calendar is a calendar based on the monthly cycles of the Moon's phases. Each month is called a synodic month. Lunar New Year takes place on the first day of the year on the lunar calendar.",
      },
    };

    const ingredients = Object.keys(this.trivia);
    for (let i = ingredients.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [ingredients[i], ingredients[j]] = [ingredients[j], ingredients[i]];
    }
    // Garden: 0; House: 1, 2; Market: 3, 4; Festival: 5, 6

    this.ingredients = ingredients;
    this.keysCollected = [];
  }

  setScene(key) {
    const scenes = ['Garden', 'Market', 'House', 'Festival'];
    if (scenes.includes(key)) {
      this.currentScene = key;
      this.scene.start(key);
      scenes.splice(scenes.indexOf(key), 1);
    }
    for (const scene of scenes) this.scene.stop(scene);
  }

  isCollected(key) {
    return this.keysCollected.includes(key);
  }

  collectKey(key) {
    this.keysCollected.push(key);
    this.ingredients[this.ingredients.indexOf(key)] = null;
  }

  getQuestionData(key) {
    return this.trivia[key];
  }

  getIngredient(id) {
    return this.ingredients[id];
  }
}
