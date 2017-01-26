import * as PIXI from 'pixi.js';
import 'pixi-particles'; // Include itself to PIXI
import _ from 'lodash';
import { EventEmitter } from 'events';
import SimulationPhysics from './SimulationPhysics';
import SimulationDie from './SimulationDie';
import SimulationChipStack from './SimulationChipStack';
import { moveCamera, shakeCamera } from '../lib/CameraUtil';

import { Howl } from 'howler';

const SFX = {
  'tableImpact0'  : new Howl({ src: ['/audio/tableImpact_00.mp3'], volume: 0.1 }),
  'tableImpact1'  : new Howl({ src: ['/audio/tableImpact_01.mp3'], volume: 0.1 }),
  'chipImpact'    : new Howl({ src: ['/audio/chipImpact_00.mp3'], volume : 0.2 }),
  'chipCollision0': new Howl({ src: ['/audio/chipCollide_00.mp3'] }),
  'chipCollision1': new Howl({ src: ['/audio/chipCollide_01.mp3'] }),
};

export default class SimulationRoll extends EventEmitter {

  constructor(options = {}) {
    super();

    this.parent  = options.parent;
    this.name  = 'SimulationRoll';

    this.stage = new PIXI.Container();
    this.table = new PIXI.Container();
    this.tableForeground = new PIXI.Container();

    this.table.position = { x: 200, y: 150 };

    this.physics = new SimulationPhysics({
      table: ['top', 'right', 'left']
    });

    this._collisionFx = this._collisionFx.bind(this);
    this.rollDice = this.rollDice.bind(this);
    this.leave = this.leave.bind(this);

    this.physics.on('collision', this._collisionFx);
  }

  leave() {
    this.removeAllListeners();
    this._tableFg().removeChildren();
    this.stage.removeChildren();
    this.physics.leave();
  }

  render() {
    this._setupScene();
    this._renderScene();
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

  _tableFg() {
    return this.tableForeground;
  }

  _collisionFx(event) {
    let collisionPairs = _(event.pairs).map('label').join('');

    console.log(collisionPairs);
    switch (collisionPairs) {
      case 'DieTable':
        SFX[`tableImpact${_.random(0,1)}`].play();
        shakeCamera(this.stage, 3, 10);
        break;

      case 'ChipChip':
        let sfx = SFX[`chipCollision${_.random(0,1)}`];
        let sfxInst = sfx.play();

        sfx.volume(_(1,5).random() * 0.1);
        sfx.rate(_(1, 4).random(), sfxInst);
        break;

      case 'DieChip':
        SFX['chipImpact'].play();
        break;

    }
  }

  _setupScene() {
    this._createDice({ num: 2, position: { x: 300, y: 600 } });
    this._createChipStack({ stackSize: 1, position: { x: 100, y: 200 } });
  }

  _renderScene() {
    this._renderWorld();
    this._renderTableBG();
    this._renderChipStack();
    this._renderDice();
    this._renderFrame();

    this.table.addChild(this._tableFg());
    this.stage.addChild(this.table);
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
        stage: this._tableFg()
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
    let diceSize = 60; // Import constants to do this.

    _(num).times((count) => {
      let offsetX = (count * diceSize) + position.x;
      let die = this._createDie({ x: offsetX, y: position.y });

      // die.on('endRoll', () => { shakeCamera(this._tableFg(), 1, 3); });
      this.dice.push(die);
    });

    return this.dice;
  }

  _createDie({x, y}) {
    return new SimulationDie({
      position: {x: x, y: y},
      stage: this._tableFg(),
    });
  }

  _updateDice() {
    return _(this.dice).each((die) => { die.update(); });
  }

  _renderDice() {
    return _(this.dice).each((die) => {
      this.physics.addChild(die.physics);
      this._tableFg().addChild(die.body);
    });
  }

  _renderWorld() {
    return this.physics.drawScene();
  }

  _renderFrame() {
    let table_frame = new PIXI.Sprite(PIXI.loader.resources['table_head_frame'].texture);
    table_frame.position.y = -40;
    this._tableFg().addChild(table_frame);
  }

  _renderTableBG() {
    let tableBg = new PIXI.Sprite(PIXI.loader.resources['table_head_bg'].texture);
    tableBg.position.y = -25;
    this.table.addChild(tableBg);
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
