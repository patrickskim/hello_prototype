// PIXI is exposed in the global namespace
// import PIXI from 'pixi.js';
import 'pixi-particles'; // Include itself to PIXI
import _ from 'lodash';
import RollPhysics from './RollPhysics';
import SimulationDie from './SimulationDie';
import SimulationChipStack from './SimulationChipStack';

export default class {

  constructor() {
    this.stage = new PIXI.Container();
    this.physics = new RollPhysics();

    this._settings = {
      shakesCount: 0,
      shakeX: true,
      shakeY: true,
      sensCoef: 0.5
    };

    this.rollDice = this.rollDice.bind(this);

    this.ready = this.ready.bind(this);
    // this.collisionFx = this.collisionFx.bind(this);
    // this.physics.addListener('collision', this.collisionFx);
    window.addEventListener('roll', this.rollDice);
  }

  render() {
    PIXI.loader
      .add('d6_spritesheet', '/images/d6Red.json')
      .add('particle_img', '/images/particle_solid.png')
      .add('chip', '/images/chip.png')
      .load(this.ready);

    return this.stage;
  }

  ready() {
    this.setupScene();
    this.renderScene();
  }

  setupScene() {
    this._createDice({ num: 2, position: { x: 300, y: 600 } });
    this._createChipStack({ stackSize: 1, position: { x: 100, y: 200 } });
  }

  renderScene() {
    this._renderWorld();
    this._renderChipStack();
    this._renderDice();
  }

  update() {
    // this._moveCamera();
    this._updateChipStack();
    this._updateDice();
  }

  collisionFx(itemA, itemB) {
    if (itemB == 'Table') {
      this._settings.shakesCount = 10;
    }
    console.log('collide', itemA, itemB);
  }

  rollDice() {
    let rollSeed = {
      velocity: { x: -30, y: _.random(10,30) * -1 },
      angularVelocity: 0.2,
    };

    this._runSimulation();
    this._throwDice(rollSeed);
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
      this.dice.push(this._createDie({ x: offsetX, y: position.y }));
    });

    return this.dice;
  }

  _createDie({x, y}) {
    return new SimulationDie({
      position: {x: x, y: y},
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

  // _moveCamera() {
  //   if(this._settings.shakesCount > 0){
  //     let sens = this._settings.shakesCount * this._settings.sensCoef;

  //     if(this._settings.shakesCount % 2){
  //       this.stage.x += this._settings.shakeX ? sens : 0;
  //       this.stage.y += this._settings.shakeY ? sens : 0;
  //     }
  //     else {
  //       this.stage.x -= this._settings.shakeX ? sens : 0;
  //       this.stage.y -= this._settings.shakeY ? sens : 0;
  //     }

  //     this._settings.shakesCount--;

  //     if(this._settings.shakesCount === 0){
  //       this.stage.x = 0;
  //       this.stage.y = 0;
  //     }
  //   }
  // }

}
