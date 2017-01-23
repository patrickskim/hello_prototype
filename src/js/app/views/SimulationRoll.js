import * as PIXI from 'pixi.js';
import 'pixi-particles'; // Include itself to PIXI
import _ from 'lodash';
import { EventEmitter } from 'events';
import SimulationPhysics from './SimulationPhysics';
import SimulationDie from './SimulationDie';
import SimulationChipStack from './SimulationChipStack';
import { moveCamera, shakeCamera } from '../lib/CameraUtil';

import { Howl } from 'howler';

export default class SimulationRoll extends EventEmitter {

  constructor(options = {}) {
    super();

    this.parent  = options.parent;
    this.name  = 'SimulationRoll';
    this.stage = new PIXI.Container();
    this.table = new PIXI.Container();

    // this._table().position = { x: 200, y: 0 };
    this.physics = new SimulationPhysics({
      table: ['top', 'right', 'left']
    });

    this._table().position = { x: 300, y: 500 };
    this._table().pivot = { x: 300, y: 500 };

    this._collisionFx = this._collisionFx.bind(this);
    this.rollDice = this.rollDice.bind(this);
    this.leave = this.leave.bind(this);

    this.physics.on('collision', this._collisionFx);
  }

  leave() {
    this.removeAllListeners();
    this._table().removeChildren();
    this.physics.leave();
  }

  render() {
    this._setupScene();
    this._renderScene();

    this.stage.addChild(this._table());
    return this.stage;
  }

  update() {
    this._updateChipStack();
    this._updateDice();
  }

  rollDice(velocityVector) {
    let rollSeed = {
      velocity: velocityVector,
      angularVelocity: 0.2,
    };

    this._runSimulation();
    this._throwDice(rollSeed);
  }

  _table() {
    return this.stage;
  }

  _collisionFx(event) {
    let collisionPairs = _(event.pairs).map('label').join('');

    console.log(collisionPairs);
    switch (collisionPairs) {
      case 'DieTable':
        console.log('table bump')
        shakeCamera(this._table(), 3, 10);
        break;
    }
  }

  _setupScene() {
    this._createDice({ num: 2, position: { x: 300, y: 600 } });
    this._createChipStack({ stackSize: 1, position: { x: 100, y: 200 } });
  }

  _renderScene() {
    this._renderWorld();
    // this._renderTable();
    this._renderChipStack();
    this._renderDice();
    this._renderFrame();
  }

  _createChipStack() {
    let stack = new SimulationChipStack({
      position: {x: 100, y: 200},
      stackSize: 1
    });

    this.chipStacks = [];
    this.chipStacks.push(stack);
  }

  _renderChipStack() {
    _(this.chipStacks).each((stack) => {
      stack.render({
        world: this.physics,
        stage: this._table()
      });
    });
  }

  _updateChipStack() {
    _(this.chipStacks).each((stack) => {
      stack.update();
    });
  }

  _createDice({num, position}) {
    this.dice = [];
    let diceSize = 40; // Import constants to do this.

    _(num).times((count) => {
      let offsetX = (count * diceSize) + position.x;
      let die = this._createDie({ x: offsetX, y: position.y });

      // die.on('endRoll', () => { shakeCamera(this._table(), 1, 3); });
      this.dice.push(die);
    });

    return this.dice;
  }

  _createDie({x, y}) {
    return new SimulationDie({
      position: {x: x, y: y},
      stage: this._table()
    });
  }

  _updateDice() {
    return _(this.dice).each((die) => { die.update(); });
  }

  _renderDice() {
    return _(this.dice).each((die) => {
      this.physics.addChild(die.physics);
      this._table().addChild(die.body);
    });
  }

  _renderWorld() {
    return this.physics.drawScene();
  }

  _renderFrame() {
    let table_frame = new PIXI.Sprite(PIXI.loader.resources['table_head_frame'].texture);
    this._table().addChild(table_frame);
  }

  _renderTable() {
    let table = new PIXI.Sprite(PIXI.loader.resources['table_head_bg'].texture);

    // table.position.y = -15;
    this._table().addChild(table);
  }

  _throwDice(throwOptions) {
    return _(this.dice).each((die) => {
      die.throw(throwOptions);
    });
  }

  _runSimulation() {
    return this.physics.run();
  }

}
