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
    restitution: 0.5,
    density: 0.05
  }
};

export default class SimulationDie extends EventEmitter {

  constructor({ position }) {
    super();

    this.position = position;
    this.physics = this._createDiePhysics();
    this.sprite = this._drawDieSprite();

    this.detectSleep = this.detectSleep.bind(this);
    Events.on(this.physics, 'sleepStart', this.detectSleep);
  }

  clear() {
    // should it leave from the stage?
    Events.off(this.physics);
  }

  update() {
    if (this.physics.isSleeping) {
      return;
    }

    if (this._isNotMoving) {
      this.finalizeDie();
    }

    // one way data flow for positioning.
    this.position = this.physics.position;
    this.rotation = this.physics.angle;

    this.sprite.position = this.position;
    this.sprite.rotation = this.rotation;
  }

  throw({velocity, angularVelocity}) {
    Body.setVelocity(this.physics, velocity);
    Body.setAngularVelocity(this.physics, angularVelocity);
  }

  detectSleep() {
    return this.emit('sleepStart', this);
  }

  finalizeDie() {
    if (this.finalized) {
      return;
    }

    // assumes all frames are available
    let diceFace = [48, 52, 112, 113, 60,56];

    this.sprite.gotoAndStop(_(diceFace).sample());
    this.finalized = true;
  }

  _isNotMoving() {
    return this._averageVelocity() <= 0;
  }

  _averageVelocity() {
    let velocity = (this.physics.velocity.x + this.physics.velocity.y)/2;
    return Math.floor(Math.abs(velocity));
  }

  _createDiePhysics() {
    return Bodies.rectangle(
      this.position.x,
      this.position.y,
      diceProps.size,
      diceProps.size,
      diceProps.options
    );
  }

  _drawDieSprite() {
    let die = new PIXI.extras.MovieClip(this._drawDieFrames());

    die.anchor.set(0.5, 0.5);
    die.position = this.position;
    die.animationSpeed = 1.5;
    die.play();

    return die;
  }

  _drawDieFrames() {
    let frames = [];
    let randomOffset = _.random(0,6) * 16;

    _(114).times((index)=> {
      // let num = randomOffset + index + 1;
      let num = index + 1;
      frames.push(PIXI.Texture.fromFrame(`d6_roll_${num}`));
    });

    return frames;
  }
}
