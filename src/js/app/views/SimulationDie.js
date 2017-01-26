import * as PIXI from 'pixi.js';
import _ from 'lodash';
import { Body, Bodies, Events, Sleeping } from 'matter-js';
import { EventEmitter } from 'events';
import { TweenLite } from 'gsap';

import DiceProps from './DiceProps';
import ParticleSmoke from '../lib/ParticleSmoke';
import spriteSmoke from '../lib/SpriteSmoke';

import { Howl } from 'howler';

const SFX = {
  'diceDown0' : new Howl({ src: ['/audio/bounce_00.mp3'] }),
  'diceDown1' : new Howl({ src: ['/audio/bounce_01.mp3'] }),
  'diceRoll'  : new Howl({ src: ['/audio/drag_loop_00.mp3'], loop: true, volume: 0.05 }),
  'diceFinal0': new Howl({ src: ['/audio/thud_00.mp3'] }),
  'diceFinal1': new Howl({ src: ['/audio/thud_01.mp3'] }),
  'dicePuff0' : new Howl({ src: ['/audio/puff_00.mp3'], volume: 0.2 }),
  'dicePuff1' : new Howl({ src: ['/audio/puff_01.mp3'], volume: 0.2 }),
};

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
    SFX['diceRoll'].stop();
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
    this.emit('endRoll');
    this.bounce();

    // SFX[`dicePuff${_.random(0,1)}`].play();
    this.smoke.play();
  }

  collide() {
    this.smoke.play();
  }

  animate() {
    this.sprite.tint = 0xc64242;
    this.sprite.play();
    this._trail.emit = true;
    SFX['diceRoll'].play();
  }

  stop(num) {
    if (!num) {
      num = _.random(1,6);
    }

    this.sprite.tint = 0xffffff;

    this.sprite.gotoAndStop(DiceFrames[num-1]);
    this.sprite.stop();
    this._trail.emit = false;
    SFX['diceRoll'].stop();
  }

  isState(state) {
    return this.state == state;
  }

  zoom(scale=2, duration=0.25) {
    let animation = new TimelineLite();

    animation.to(this.body.scale, duration, { x: scale, y: scale, ease: Back.easeOut });
  }

  bounce() {
    let animation = new TimelineLite();

    if (this.isState(STATE.FINALIZED)) {
      SFX[`diceFinal${_.random(0,1)}`].play();
    } else {
      SFX[`diceDown${_.random(0,1)}`].play();
    }

    animation
      .to(this.sprite.scale, 0.1, { x: 2, y: 2,})
      .to(this.sprite.scale, 0.4, { x: 1, y: 1, ease: Back.easeOut });
  }

  _createDie() {
    this.physics = this._createDiePhysics();
    this.body = new PIXI.Container();

    this.shadow = this._drawShadow();
    this.sprite = this._drawDieSprite();
    this.smoke = spriteSmoke();

    this.body.addChild(this.shadow);
    this.body.addChild(this.smoke);
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
      DiceProps.Physics.size,
      DiceProps.Physics.size,
      DiceProps.Physics.options
    );
  }

  _drawDieSprite() {
    let die = new PIXI.extras.AnimatedSprite(this._drawDieFrames());

    die.anchor.set(0.5, 0.5);
    die.animationSpeed = 0.5;
    // die.scale.x = die.scale.y = DiceProps.Physics.size / DiceProps.Sprite.size;
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

  _drawShadow() {
    let shadow = new PIXI.Sprite(PIXI.loader.resources['d6_shadow'].texture);

    shadow.anchor.set(0.5, 0.5);
    shadow.alpha = 0.3;
    shadow.scale.x = shadow.scale.y = .8;
    shadow.position.y = 7;

    return shadow;
  }

  _renderTrail(container) {
    if (!DiceProps.Emitter) {
      return;
    }

    this._elapsed = Date.now();
    this._trail = new PIXI.particles.Emitter(
      container,
      [ PIXI.loader.resources['particle_sol'].texture ],
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
