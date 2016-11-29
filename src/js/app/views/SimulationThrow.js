import * as PIXI from 'pixi.js';
import 'pixi-particles'; // Include itself to PIXI
import _ from 'lodash';
import { TweenLite } from 'gsap';
import SimulationPhysics from './SimulationPhysics';
import DiceChain from './DiceChain';
import DiceControl from './DiceControl';

export default class {

  constructor() {
    this.name    = 'SimulationThrow';
    this.stage   = new PIXI.Container();
    this.physics = new SimulationPhysics({
      table: ['bottom', 'right', 'left']
    });

    this.ready       = this.ready.bind(this);
    this.onDragStart = this.onDragStart.bind(this);
    this.onDragMove  = this.onDragMove.bind(this);
    this.onDragEnd   = this.onDragEnd.bind(this);
  }

  render() {
    // move the ready render up to the renderer?
    // Make a manifest thar loops the resources also shareable?
    PIXI.loader
      .add('d6_spritesheet', '/images/d6Red.json')
      .add('particle_img', '/images/obj_pollen_hd.png')
      .load(this.ready);

    return this.stage;
  }

  leave() {
    this.diceControl.off();
  }

  ready() {
    this.setupScene();
    this.renderScene();
    this._runSimulation();
  }

  setupScene() {
    let position = { x: 360, y: 400 };

    this._createDice({
      num: 2,
      position: position,
      stage: this.stage
    });

    this.diceControl = new DiceControl({
      position: position,
      radius: 30
    });

    this.diceControl.on('dragStart', this.onDragStart);
    this.diceControl.on('dragMove', this.onDragMove);
    this.diceControl.on('dragEnd', this.onDragEnd);
  }

  renderScene() {
    this._renderWorld();
    this._renderControl();
    this._renderDice();
  }

  update() {
    this._updateDice();
  }

  onDragStart() {
    console.log('starting', arguments);
    this.diceChain.animate();
  }

  onDragMove({diceControl}) {
    console.log('move', diceControl);

    this.diceChain.move(this.diceControl.position);
  }

  onDragEnd() {
    console.log('ending', arguments);
  }

  _createDice({ num, position, stage }) {
    this.diceChain = new DiceChain({ num, position, stage});
    this.diceComposite = this.diceChain.getDiceComposite();
    this.dice = this.diceChain.getDice();
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
