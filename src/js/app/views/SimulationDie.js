import * as PIXI from 'pixi.js';
import _ from 'lodash';
import { Body, Bodies, Events, Sleeping } from 'matter-js';
import { EventEmitter } from 'events';
import DiceProps from './DiceProps';

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
  }

  animate() {
    this.sprite.play();
    this.trail.emit = true;
  }

  stop(num) {
    if (!num) {
      num = _.random(1,6);
    }

    this.sprite.gotoAndStop(DiceFrames[num-1]);
    this.sprite.stop();
    this.trail.emit = false;
  }

  isState(state) {
    return this.state == state;
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

    this.trail.updateOwnerPos(this.position.x,this.position.y);
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
    let die = new PIXI.extras.MovieClip(this._drawDieFrames());

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

  _renderTrail(container) {
    if (!DiceProps.Emitter) {
      return;
    }

    this.elapsed = Date.now();
    this.trail = new PIXI.particles.Emitter(
      container,
      [ PIXI.loader.resources['particle_img'].texture ],
      DiceProps.Emitter);

    this.trail.updateOwnerPos(this.position.x,this.position.y);
    this.trail.emit = false;
  }

  _updateTrail() {
    if (!this.trail) {
      return;
    }

    let now = Date.now();
    this.trail.update((now - this.elapsed) * 0.001);
    this.elapsed = now;
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
