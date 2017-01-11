import * as PIXI from 'pixi.js';
import 'pixi-particles'; // Include itself to PIXI
import _ from 'lodash';
import { EventEmitter } from 'events';
import SimulationPhysics from './SimulationPhysics';
import SimulationDie from './SimulationDie';
import SimulationChipStack from './SimulationChipStack';
import { randomNegNum } from '../lib/NumbersUtil';

export default class SimulationRoll extends EventEmitter {

  constructor(options = {}) {
    super();

    this.parent  = options.parent;

    this.name  = 'SimulationRoll';
    this.stage = new PIXI.Container();
    // this.stage.position = { x: 200, y: 0 };
    this.physics = new SimulationPhysics({
      table: ['top', 'right', 'left']
    });

    this._shakeCamera = this._shakeCamera.bind(this);
    this.collisionFx = this.collisionFx.bind(this);
    this.rollDice = this.rollDice.bind(this);
    this.leave = this.leave.bind(this);

    this.physics.on('collision', this.collisionFx);
  }

  leave() {
    this.removeAllListeners();
    this.stage.removeChildren();
    this.physics.leave();
  }

  render() {
    this._setupScene();
    this._renderScene();
    this._moveCamera();

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

  collisionFx(event) {
    let _collisionPairs = _(event.pairs).map('label');
    if (!_collisionPairs.includes('Die')) { return; }
    if (_collisionPairs.uniq().size() == 1 ) { return; }

    this._shakeCamera();
  }

  // move some of these camera things into a util.
  _moveCamera() {
    let animation = new TimelineLite(),
      element = this.stage;

    animation
      .from(element, 1, { y: -90 })
      .to(element, 0.2, { y: 0, ease: Back.easeOut });
  }

  _shakeCamera() {
    let animation = new TimelineLite(),
      element = this.stage,
      random = (Math.random() < 0.5 ? -1 : 1);

    animation
      .to(element, 0.1, { x: `+=${randomNegNum(5,10)}`, y: `+=${randomNegNum(5,10)}` })
      .to(element, 0.1, { x: 0, y: 0, ease: Back.easeOut });
  }

  _setupScene() {
    this._createDice({ num: 2, position: { x: 300, y: 600 } });
    this._createChipStack({ stackSize: 1, position: { x: 100, y: 200 } });
  }

  _renderScene() {
    this._renderWorld();
    this._renderChipStack();
    this._renderDice();
  }

  _createChipStack() {
    this.chipStacks = [];

    let stack = new SimulationChipStack({
      position: {x: 100, y: 200},
      stackSize: 1
    });

    this.chipStacks.push(stack);
  }

  _renderChipStack() {
    _(this.chipStacks).each((stack) => {
      stack.render({
        world: this.physics,
        stage: this.stage
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

    _(num).times( (count) => {
      let offsetX = (count * diceSize) + position.x;
      let die = this._createDie({ x: offsetX, y: position.y });

      die.on('endRoll', this._shakeCamera);

      this.dice.push(die);
    });

    return this.dice;
  }

  _createDie({x, y}) {
    return new SimulationDie({
      position: {x: x, y: y},
      stage: this.stage
    });
  }

  _updateDice() {
    return _(this.dice).each((die) => { die.update(); });
  }

  _renderDice() {
    return _(this.dice).each((die) => {
      this.physics.addChild(die.physics);
      this.stage.addChild(die.body);
    });
  }

  _renderWorld() {
    return this.physics.drawScene();
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
