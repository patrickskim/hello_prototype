// PIXI is exposed in the global namespace
// import PIXI from 'pixi.js';

import _ from 'lodash';
import { Body, Bodies, Events } from 'matter-js';
import { EventEmitter } from 'events';

const diceProps = {
  size: 40,
  options: {
    label: 'Die',
    frictionAir: 0.025,
    restitution: 0.3,
    density: 0.01
  }
};

export default class SimulationDie extends EventEmitter {

  constructor({ x, y, engine, stage }) {
    this.engine = engine;
    this.stage = stage;

    this.physics = this.createDiePhysics(x,y);
    this.sprite = this._drawDieSprite();

    this.ready = this.ready.bind(this);
    this.detectCollisions = this.detectCollisions.bind(this);
    this.detectSleep = this.detectSleep.bind(this);

    Events.on(this.engine, 'collisionEnd', this.detectCollisions);
    Events.on(this.die, 'sleepStart', this.detectSleep);
  }

  clear() {
    // should it leave from the stage?
    Events.off(this.engine, 'collisionEnd', this.detectCollisions);
    Events.off(die);
  }

  render() {
    PIXI.loader
      .add('spritesheet', '/images/d6Sprite.json')
      .load(this.ready);

    return this.stage;
  }

  ready() {
    this.stage.addChild(this.sprite);
  }

  update() {
    if (this.physics.isSleeping) {
      return;
    }

    this.sprite.position = this.physics.position;
    this.sprite.rotation = this.physics.angle;
  }

  throw({velocity, angularVelocity}) {
    Body.setVelocity(this.physics, velocity);
    Body.setAngularVelocity(this.physics, angularVelocity);
  }

  detectCollisions(event) {
    _(event.pairs).each((pair) => {
      this.emit('collisionEnd', pair.bodyA.label, pair.bodyB.label);
    });
  }

  detectSleep() {
    return this.emit('sleepStart', this);
  }

  _createDiePhysics(x,y) {
    return Bodies.rectangle(x, y, diceProps.size, diceProps.size, diceProps.options);
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
    die.position = this.physics.position;

    die.play();

    return die;
  }
}
