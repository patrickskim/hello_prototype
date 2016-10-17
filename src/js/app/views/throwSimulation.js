// PIXI is exposed in the global namespace
// import PIXI from 'pixi.js';
import 'pixi-particles'; // Include itself to PIXI
import _ from 'lodash';
import RollPhysics from './RollPhysics';
import DiceChain from './DiceChain';

export default class {

  constructor() {
    this.stage = new PIXI.Container();
    this.physics = new RollPhysics();

    // this.diceChain = {};
    this.diceControl = {};
    this.dice = [];

    this.ready = this.ready.bind(this);
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

  ready() {
    this.setupScene();
    this.renderScene();

    this._runSimulation();
  }

  setupScene() {
    this._createDice({
      num: 2,
      position: { x: 450, y: 400 },
      stage: this.stage
    });
  }

  renderScene() {
    this._renderWorld();
    this._renderDice();
  }

  update() {
    this._updateDice();
  }

  _createDice({num, position, stage}) {
    this.diceChain = new DiceChain({ num, position, stage});
    this.diceComposite = this.diceChain.getDiceComposite();
    this.diceControl = this.diceChain.getDiceControl();

    window.DC = this.diceChain;
    this.dice = this.diceChain.getDice();
  }

  _renderDice() {
    this.physics.addChild(this.diceComposite);
    this.stage.addChild(this.diceControl.body);

    _(this.dice).each((die) => {
      this.stage.addChild(die.body);
    });
  }

  _updateDice() {
    if (!this.diceChain) {
      return;
    }

    this.diceChain.update();
    // return _(this.dice).each((die) => { die.update(); });
  }

  _renderWorld() {
    return this.physics.drawScene();
  }

  _runSimulation() {
    return this.physics.run();
  }

}
