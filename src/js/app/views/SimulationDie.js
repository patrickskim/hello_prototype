// PIXI is exposed in the global namespace
// import PIXI from 'pixi.js';

import _ from 'lodash';
import { Body, Bodies, Events } from 'matter-js';
import { EventEmitter } from 'events';
import DiceProps from './DiceProps';

export default class SimulationDie extends EventEmitter {

  constructor({ position }) {
    super();

    this.position = position;

    this._createDie();

    this.detectSleep = this.detectSleep.bind(this);
    Events.on(this.physics, 'sleepStart', this.detectSleep);
  }

  clear() {
    // should it leave from the stage?
    Events.off(this.physics);
  }

  update() {
    this._updateDie();
    this._updateParticles();
  }

  throw({ velocity, angularVelocity }) {
    Body.setVelocity(this.physics, velocity);
    Body.setAngularVelocity(this.physics, angularVelocity);

    this.maxVelocity = this._averageVelocity();
    this.emitter.emit = true;
    this.state = 'rolling';
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
    this.emitter.emit = false;
    this.state = 'final';
  }

  _createDie() {
    this.physics = this._createDiePhysics();

    this.body = new PIXI.Container();
    this.particles = new PIXI.Container();
    this.sprite = this._drawDieSprite();

    this.body.addChild(this.particles);
    this.body.addChild(this.sprite);
    this._renderParticles(this.particles);

    this.body.position = this.position;
    this.state = 'ready';
  }

  _updateDie() {
    if (this._isStationary()) {
      return;
    }

    if (!this._isMoving()) {
      this.finalizeDie();
    }

    // one way data flow for positioning.
    this.position = this.physics.position;
    this.rotation = this.physics.angle;

    this.body.position = this.position;
    this.sprite.rotation = this.rotation;
  }

  _createDiePhysics() {
    return Bodies.rectangle(
      this.position.x,
      this.position.y,
      DiceProps.Physics.size,
      DiceProps.Physics.size,
      DiceProps.Physics.options
    );
  }

  _drawDieSprite() {
    let die = new PIXI.extras.MovieClip(this._drawDieFrames());

    die.anchor.set(0.5, 0.5);
    die.animationSpeed = 1;
    die.play();

    return die;
  }

  _drawDieFrames() {
    let frames = [];
    // let randomOffset = _.random(0,6) * 16;

    _(114).times((index)=> {
      // let num = randomOffset + index + 1;
      let num = index + 1;
      frames.push(PIXI.Texture.fromFrame(`d6_roll_${num}`));
    });

    return frames;
  }

  _renderParticles(container) {
    // Create a new emitter
    this.elapsed = Date.now();
    this.emitter = new PIXI.particles.Emitter(
      container,
      [ PIXI.loader.resources['particle_img'].texture ],
      DiceProps.Emitter);
    this.emitter.emit = false;
  }

  _updateParticles() {
    if (!this.emitter) {
      return;
    }

    let now = Date.now();
    this.emitter.update((now - this.elapsed) * 0.001);
    this.elapsed = now;
  }

  _isMoving() {
    return this._averageVelocity() >= 0.5;
  }

  _averageVelocity() {
    let velocity = (this.physics.velocity.x + this.physics.velocity.y)/2;
    return Math.floor(Math.abs(velocity));
  }

  _isStationary() {
    return (this.state == 'final' || this.state == 'ready');
  }
}


