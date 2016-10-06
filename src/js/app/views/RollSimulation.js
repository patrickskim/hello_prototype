// PIXI is exposed in the global namespace
// import PIXI from 'pixi.js';
import 'pixi-particles'; // Include itself to PIXI
import _ from 'lodash';
import RollPhysics from './RollPhysics';
import SimulationDie from './SimulationDie';

export default class {

  constructor() {
    this.stage = new PIXI.Container();
    this.rollPhysics = new RollPhysics();
    this._settings = {
      shakesCount: 0,
      shakeX: true,
      shakeY: true,
      sensCoef: 0.5
    };

    this.rollDice = this.rollDice.bind(this);

    this.ready = this.ready.bind(this);
    this.collisionFx = this.collisionFx.bind(this);
    this.rollPhysics.addListener('collision', this.collisionFx);
    window.addEventListener('roll', this.rollDice);
  }

  render() {
    PIXI.loader
      .add('d6_spritesheet', '/images/d6Sprite.json')
      .add('particle_img', '/images/obj_pollen_hd.png')
      .load(this.ready);

    return this.stage;
  }

  ready() {
    this._createDice({ num: 2, position: { x: 300, y: 600 } });
    this._renderScene();
    this._renderDice();
  }

  update() {
    this._moveCamera();
    this._updateDice();
  }

  collisionFx(itemA, itemB) {
    if (itemB == "Table") {
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
      this.rollPhysics.addChild(die.physics);
      this.stage.addChild(die.body);
    });
  }

  _renderScene() {
    return this.rollPhysics.drawScene();
  }

  _throwDice(throwOptions) {
    return _(this.dice).each((die) => {
      die.throw(throwOptions);
    });
  }

  _runSimulation() {
    return this.rollPhysics.run();
  }

  _moveCamera() {
    if(this._settings.shakesCount > 0){
      let sens = this._settings.shakesCount * this._settings.sensCoef;

      if(this._settings.shakesCount % 2){
        this.stage.x += this._settings.shakeX ? sens : 0;
        this.stage.y += this._settings.shakeY ? sens : 0;
      }
      else {
        this.stage.x -= this._settings.shakeX ? sens : 0;
        this.stage.y -= this._settings.shakeY ? sens : 0;
      }

      this._settings.shakesCount--;

      if(this._settings.shakesCount === 0){
        this.stage.x = 0;
        this.stage.y = 0;
      }
    }
  }

}
