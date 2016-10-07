// PIXI is exposed in the global namespace
// import PIXI from 'pixi.js';

import _ from 'lodash';
import { Body, Bodies, Events } from 'matter-js';
import { EventEmitter } from 'events';
import SimulationChip from './SimulationChip';

export default class SimulationChipStack extends EventEmitter {

  constructor({ position, stackSize }) {
    super();

    this.position = position;
    this.stackSize = stackSize; // number between 0 - 1
    this.stackMax = 10; // max number of chips

    this._createChipStack();
  }

  render({ world, stage }) {
    _(this.chips).each((chip) => {
      world.addChild(chip.physics);
      stage.addChild(chip.body);
    });
  }

  update() {
    this._updateChipStack();
  }

  stackCount() {
    return this.stackSize * this.stackMax;
  }

  _createChipStack() {
    this.chips = [];

    _(this.stackCount()).times((num) => {
      let chip = new SimulationChip({
        x: this.position.x,
        y: this.position.y - num * 5
      });

      this.chips.push(chip);
    });
  }

  _updateChipStack() {
    _(this.chips).each((chip) => {
      chip.update();
    });
  }

}


