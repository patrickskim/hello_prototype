import * as PIXI from 'pixi.js';
import _ from 'lodash';
import { EventEmitter } from 'events';
import SimulationThrow from './SimulationThrow';
import SimulationRoll from './SimulationRoll';
import betTypes from '../lib/betTypes';

export default class SceneThrow extends EventEmitter {


  constructor(options = {}) {
    super();

    console.log('things', betTypes['point_4']);

    this.stage = options.stage;
    this.scene = this.simulation({
      stage: this.stage,
      parent: this
    });
    // when throw says its thrown -> render simulation roll with vectors seet.
    // otherwise waits for a thrown event then renders simulation with vectors?

    this.ready = this.ready.bind(this);
  }

  leave() {
    this.scene.leave();
  }

  render() {
    PIXI.loader
      .add('d6_spritesheet', '/images/d6Red.json')
      .add('particle_img', '/images/obj_pollen_hd.png')
      .add('particle_sol', '/images/particle_solid.png')
      .add('chip', '/images/chip.png')
      .load(this.ready);
  }

  ready() {
    return this.stage.addChild(this.scene.render());
  }

  update() {
    return this.scene.update();
  }

  throw(vector) {
    this.scene.leave();
    this.scene = new SimulationRoll({
      stage: this.stage,
      parent: this
    });

    this.stage.addChild(this.scene.render());
    this.scene.rollDice(vector);

  }

  simulation(options) {
    if (this._isShooter()) {
      return new SimulationThrow(options);
    }

    return new SimulationRoll(options);
  }

  _isShooter() {
    return true;
  }

  _player() {

  }

}
