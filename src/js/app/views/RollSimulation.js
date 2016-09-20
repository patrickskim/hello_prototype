// PIXI is exposed in the global namespace
// import PIXI from 'pixi.js';
import _ from 'lodash';
import RollPhysics from './RollPhysics';

const diceStyles = {
  backgroundImage: '/images/d5.png',
};

export default class RollSimulation {

  constructor() {
    this.stage = new PIXI.Container({options: 'ok'});
    this.rollPhysics = new RollPhysics();

    this.onAssetsLoad = this.onAssetsLoad.bind(this);
  }

  render() {
    PIXI.loader
      .add('spritesheet', '/images/d6Sprite.json')
      .load(this.onAssetsLoad);

    return this.stage;
  }

  update() {
    this._updateDice();
  }

  throwDice() {
    let rollSeed = {
      velocity: { x: -30, y: _.random(10,30) * -1 },
      angularVelocity: 0.2,
    };

    this.rollPhysics.diceRoll(rollSeed);
  }

  onAssetsLoad() {
    this.dice = this._createDice();
    this._runSimulation();
  }

  _runSimulation() {
    this.rollPhysics.drawScene();
    this._drawDice();
    this.rollPhysics.run();
  }

  _updateDice() {
    return _(this.dice).each( (die) => {
      if (die.physics.isSleeping) {
        return;
      }
      die.sprite.position = die.physics.position;
      die.sprite.rotation = die.physics.angle;
    });
  }

  _createDice() {
    return _(this.rollPhysics.dice).map((die) => {
      return this._createDie(die);
    }).value();
  }

  _drawDice() {
    return _(this.dice).each( (die) => {
      this.stage.addChild(die.sprite);
    });
  }

  _createDie(physicsDie) {
    let spriteDie = this._drawDieSprite();
    spriteDie.position = physicsDie.position;


    this.rollPhysics.on('collisionEnd', (bodyA, bodyB) => {
      console.log('hit', bodyA, bodyB);
    });

    this.rollPhysics.on('sleepStart', (die) => {
      console.log('sleeping', die);
      spriteDie.stop();
    });

    return {
      physics: physicsDie,
      sprite: spriteDie,
    };
  }

  _drawDie() {
    let texture = PIXI.Texture.fromImage(diceStyles.backgroundImage);
    let die = new PIXI.Sprite(texture);

    // center the sprite's anchor point
    die.anchor.x = 0.5;
    die.anchor.y = 0.5;

    return die;
  }

  _drawDieSprite() {
    let frames = [];
    let randomOffset = _.random(1,6) * 16;

    _(16).times((index)=> {
      let num = randomOffset + index;
      frames.push(PIXI.Texture.fromFrame(`d6_roll_${num}`));
    });

    let die = new PIXI.extras.MovieClip(frames);
    die.anchor.set(0.5, 0.5);
    die.play();

    return die;
  }
}
