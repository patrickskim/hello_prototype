import _ from 'lodash';
import RollPhysics from './RollPhysics';
// PIXI is exposed in the global namespace
// import PIXI from 'pixi.js';

const diceStyles = {
  backgroundImage: '/images/d5.png',
};

export default class RollSimulation {

  constructor() {
    this.stage = new PIXI.Container({options: 'ok'});
    this.rollPhysics = new RollPhysics();
    this.dice = this._createDice();
  }

  render() {
    this._runSimulation();
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

  _runSimulation() {
    this.rollPhysics.drawScene();
    this._drawDice();
    this.rollPhysics.run();
  }

  _updateDice() {
    return _(this.dice).each( (die) => {
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
    let spriteDie = this._drawDie();
    spriteDie.position = physicsDie.position;

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
}
