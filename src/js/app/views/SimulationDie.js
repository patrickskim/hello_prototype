import * as PIXI from 'pixi.js';
import _ from 'lodash';
import { Body, Bodies, Events, Sleeping } from 'matter-js';
import { EventEmitter } from 'events';
import { TweenLite } from 'gsap';

import DiceProps from './DiceProps';
import ParticleSmoke from '../lib/ParticleSmoke';

const DiceFrames = [0,21,24,1,45,48];

const STATE = {
  INITIALIZED: 'init',
  READY      : 'ready',
  ROLLING    : 'rolling',
  FINALIZED  : 'final'
};

export default class SimulationDie extends EventEmitter {

  constructor({ position, stage }) {
    super();

    this.parentStage = stage;
    this.position = position;
    this.state = STATE.INITIALIZED;

    this._createDie();
  }

  leave() {
    // should it leave from the stage?
    Events.off(this.physics);
  }

  update() {
    this._updateDie();
    this._updateTrail();
    this._updateSmoke();
  }

  throw({ velocity, angularVelocity }) {
    if (!this.isState(STATE.READY)) {
      return;
    }

    Body.setVelocity(this.physics, velocity);
    Body.setAngularVelocity(this.physics, angularVelocity);

    this.animate();
    this.state = STATE.ROLLING;
  }

  finalizeDie() {
    if (!this.isState(STATE.ROLLING)) {
      return;
    }

    let num = _.random(1,6);

    Sleeping.set(this.physics, true);
    this.stop(num);

    this.state = STATE.FINALIZED;
    this._bounce();
    this._renderSmoke(this.body);
  }

  collide() {
    this._renderSmoke(this.parentStage);
  }

  animate() {
    this.sprite.play();
    this._trail.emit = true;
  }

  stop(num) {
    if (!num) {
      num = _.random(1,6);
    }

    this.sprite.gotoAndStop(DiceFrames[num-1]);
    this.sprite.stop();
    this._trail.emit = false;
  }

  isState(state) {
    return this.state == state;
  }


  _bounce() {
    let animation = new TimelineLite();

    animation
      .to(this.body.scale, 0, { x: 2, y: 2,})
      .to(this.body.scale, 0.2, { x: 1, y: 1, ease: Bounce.easeOut });
  }

  _createDie() {
    this.physics = this._createDiePhysics();
    this.body = new PIXI.Container();

    this.sprite = this._drawDieSprite();
    this.body.addChild(this.sprite);

    this._renderTrail(this.parentStage);

    this.body.position = this.position;
    this.state = STATE.READY;
  }

  _updateDie() {
    if (!this.isState(STATE.ROLLING) && !this.isState(STATE.READY)) {
      return;
    }

    if (this._isDoneRolling()) {
      this.finalizeDie();
    }

    this.position = this.physics.position;
    this.rotation = this.physics.angle;

    this.body.position = this.position;
    this.sprite.rotation = this.rotation;

    this._trail.updateOwnerPos(this.position.x,this.position.y);
  }

  _createDiePhysics() {
    // Note sized down physics box
    return Bodies.rectangle(
      this.position.x,
      this.position.y,
      DiceProps.Physics.size - 5,
      DiceProps.Physics.size - 5,
      DiceProps.Physics.options
    );
  }

  _drawDieSprite() {
    let die = new PIXI.extras.AnimatedSprite(this._drawDieFrames());

    die.anchor.set(0.5, 0.5);
    die.animationSpeed = 0.5;
    die.scale.x = die.scale.y = 0.66;
    // die.play();
    die.gotoAndStop(DiceFrames[_.random(0,5)]);


    return die;
  }

  _drawDieFrames() {
    let frames = [];

    _(48).times((index)=> {
      if (index < 10) {
        index = `0${index}`;
      }

      frames.push(PIXI.Texture.fromFrame(`00${index}.png`));
    });

    return frames;
  }

  _updateSmoke() {
    if (!this._smoke) {
      return;
    }

    let now = Date.now();
    this._smoke.update((now - this._smokeTime) * 0.001);
    this._smokeTime = now;
  }

  _renderSmoke(container) {
    this._smokeTime = Date.now();
    this._smoke = new PIXI.particles.Emitter(
      container,
      [ PIXI.loader.resources['particle_sol'].texture ],
      ParticleSmoke);

    // this._smoke.updateOwnerPos(this.position.x,this.position.y);
  }

  _renderTrail(container) {
    if (!DiceProps.Emitter) {
      return;
    }

    this._elapsed = Date.now();
    this._trail = new PIXI.particles.Emitter(
      container,
      [ PIXI.loader.resources['particle_img'].texture ],
      DiceProps.Emitter);

    this._trail.updateOwnerPos(this.position.x,this.position.y);
    this._trail.emit = false;
  }

  _updateTrail() {
    if (!this._trail) {
      return;
    }

    let now = Date.now();
    this._trail.update((now - this._elapsed) * 0.001);
    this._elapsed = now;
  }

  _isMoving() {
    return this._averageVelocity() >= 0.5;
  }

  _isDoneRolling() {
    return this.isState(STATE.ROLLING) && !this._isMoving();
  }

  _averageVelocity() {
    let velocity = (this.physics.velocity.x + this.physics.velocity.y)/2;
    return Math.floor(Math.abs(velocity));
  }
}
