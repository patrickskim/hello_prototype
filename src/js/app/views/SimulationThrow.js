import * as PIXI from 'pixi.js';
import 'pixi-particles'; // Include itself to PIXI
import _ from 'lodash';
import { Howl } from 'howler';
import { EventEmitter } from 'events';
import { TweenLite } from 'gsap';
import SimulationPhysics from './SimulationPhysics';
import DiceChain from './DiceChain';
import DiceControl from './DiceControl';

export default class SimulationThrow extends EventEmitter {

  constructor(options = {}) {
    super();

    this.sound = new Howl({ src: [] });

    this.parent  = options.parent;
    this.name    = 'SimulationThrow';
    this.stage   = new PIXI.Container();
    this.physics = new SimulationPhysics({
      table: ['bottom', 'right', 'left'],
    });

    // Make this into a array of strings?
    this.leave       = this.leave.bind(this);
    this.endThrow = this.endThrow.bind(this);

    this.physics.addSensor();
    this.physics.on('collision', this.endThrow);
  }

  leave() {
    this.removeAllListeners();
    this.physics.leave();
    this.diceControl.leave();
    this.stage.removeChildren();
  }

  endThrow(event) {
    if (this.thrown) { return; }

    let _collisionPairs = _(event.pairs).map('label');
    if (!_collisionPairs.includes('Sensor')) { return; }

    this.diceChain.zoom(5, 0.2);
    this.thrown = true;
    this.parent.throw(this.diceChain.getVelocity());
  }

  render() {
    this._setupScene();
    this._renderScene();
    this._runSimulation();

    return this.stage;
  }

  update() {
    return this._updateDice();
  }

  onDragStart() {
    this.diceChain.animate();
  }

  onDragMove({diceControl}) {
    this.diceChain.move(this.diceControl.position);
  }

  onDragEnd() {
    if (this.thrown) { return; }

    this.diceChain.stop();
  }

  _setupScene() {
    let position = { x: 360, y: 400 };

    this._createDice({
      num: 2,
      position: position,
      stage: this.stage
    });

    this._createControl({
      position: position,
      radius: 30
    });
  }

  _renderScene() {
    this._renderWorld();
    this._renderControl();
    this._renderDice();
  }

  _createDice({ num, position, stage }) {
    this.diceChain = new DiceChain({ num, position, stage});
    this.diceComposite = this.diceChain.getDiceComposite();
    this.dice = this.diceChain.getDice();
  }

  _createControl({ position, radius}) {
    this.diceControl = new DiceControl({
      position: position,
      radius: radius
    });

    this.onDragStart = this.onDragStart.bind(this);
    this.onDragMove  = this.onDragMove.bind(this);
    this.onDragEnd   = this.onDragEnd.bind(this);

    this.diceControl.on('dragStart', this.onDragStart);
    this.diceControl.on('dragMove', this.onDragMove);
    this.diceControl.on('dragEnd', this.onDragEnd);
  }

  _renderControl() {
    this.stage.addChild(this.diceControl.body);
  }

  _renderDice() {
    this.physics.addChild(this.diceComposite);

    _(this.dice).each((die) => {
      this.stage.addChild(die.body);
    });
  }

  _updateDice() {
    if (!this.diceChain) {
      return;
    }

    this.diceChain.update();
  }

  _renderWorld() {
    return this.physics.drawScene();
  }

  _runSimulation() {
    return this.physics.run();
  }

}
