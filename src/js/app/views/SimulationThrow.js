// PIXI is exposed in the global namespace
// import PIXI from 'pixi.js';
import 'pixi-particles'; // Include itself to PIXI
import _ from 'lodash';
import SimulationPhysics from './SimulationPhysics';
import DiceChain from './DiceChain';

export default class {

  constructor() {
    this.stage = new PIXI.Container();
    this.physics = new SimulationPhysics({
      table: ['bottom', 'right', 'left']
    });

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

    this._createDiceControl({
      position: position,
      radius: 30
    });
  }

  renderScene() {
    this._renderWorld();
    this._renderControl();
    this._renderDice();
  }

  update() {
    this._updateDice();
  }

  onDragStart(event) {
    this.data = event.data;
    this.alpha = 0.5;
    this.dragging = true;

    this.diceChain.animate();
  }

  onDragEnd() {
    let org = { x: 360, y: 400 };
    let pos = this.data.getLocalPosition(this.parent);
    let newVector = { x: pos.x - org.x, y: pos.y - org.y};

    this.alpha = 1;
    this.dragging = false;
    this.data = null;

    console.log("new vector", newVector);

    // this.diceChain.stop();
    this.diceChain.throw(newVector);
  }

  onDragMove() {
    if (!this.dragging) {
      return;
    }

    let newPosition = this.data.getLocalPosition(this.parent);

    // let delta = {
    //   x: this.position.x - newPosition.x ,
    //   y: this.position.y - newPosition.y
    // }
    // console.log("new", newPosition, "old", this.position, "delta", delta);

    this.position = newPosition;
    this.diceChain.move(newPosition);
  }

  _createDice({num, position, stage}) {
    this.diceChain = new DiceChain({ num, position, stage});
    this.diceComposite = this.diceChain.getDiceComposite();
    this.dice = this.diceChain.getDice();
  }

  _createDiceControl({position, radius}) {
    this.diceControl = this._createControl({position, radius});

    this.diceControl.diceChain = this.diceChain; //UNHOLY SHIT.
    this.diceControl.interactive = true;
    this.diceControl.buttonMode = true;

    // events for drag start
    this.diceControl
      .on('mousedown', this.onDragStart)
      .on('touchstart', this.onDragStart)
      // events for drag end
      .on('mouseup', this.onDragEnd)
      .on('mouseupoutside', this.onDragEnd)
      .on('touchend', this.onDragEnd)
      .on('touchendoutside', this.onDragEnd)
      // events for drag move
      .on('mousemove', this.onDragMove)
      .on('touchmove', this.onDragMove);
  }

  _createControl({ position, radius }) {
    let controlPoint = new PIXI.Graphics();

    controlPoint.lineStyle (3 , 0x000000,  1);
    controlPoint.beginFill(0x9b59b6, 0); // Purple
    controlPoint.drawCircle(0,0, radius);
    controlPoint.endFill();

    controlPoint.position = { x: position.x + radius/2, y: position.y };

    return controlPoint;
  }

  _renderControl() {
    this.stage.addChild(this.diceControl);
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
