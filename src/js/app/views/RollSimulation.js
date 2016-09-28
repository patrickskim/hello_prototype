// PIXI is exposed in the global namespace
// import PIXI from 'pixi.js';
import 'pixi-particles'; // Include itself to PIXI
import _ from 'lodash';
import RollPhysics from './RollPhysics';
import SimulationDie from './SimulationDie';

export default class RollSimulation {

  constructor() {
    this.stage = new PIXI.Container();
    this.rollPhysics = new RollPhysics();

    this.ready = this.ready.bind(this);
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
    this._runSimulation();
    this.rollDice();

    this._renderParticles();
  }

  update() {
    this._updateDice();
    this._updateParticles();
  }

  rollDice() {
    let rollSeed = {
      velocity: { x: -30, y: _.random(10,30) * -1 },
      angularVelocity: 0.2,
    };

    return this._throwDice(rollSeed);
  }

  _renderParticles() {
    // Create a new emitter
    this.elapsed = Date.now();
    this.emitter = new PIXI.particles.Emitter(
      this.stage,
      [PIXI.Texture.fromImage('images/obj_pollen_hd.png')],
      {
        alpha: {
          start: 0.8,
          end: 0.1
        },
        scale: {
          start: 1,
          end: 0.3
        },
        color: {
          start: 'fb1010',
          end: 'f5b830'
        },
        speed: {
          start: 200,
          end: 100
        },
        startRotation: {
          min: 0,
          max: 360
        },
        rotationSpeed: {
          min: 0,
          max: 0
        },
        lifetime: {
          min: 0.5,
          max: 0.5
        },
        frequency: 0.008,
        emitterLifetime: -1,
        maxParticles: 1000,
        pos: {
          x: 200,
          y: 200
        },
        addAtBack: false,
        spawnType: 'circle',
        spawnCircle: {
          x: 0,
          y: 0,
          r: 10
        }
      });

    this.emitter.emit = true;
  }

  _updateParticles() {
    if (!this.emitter) {
      return;
    }

    let now = Date.now();
    this.emitter.update((now - this.elapsed) * 0.001);
    this.elapsed = now;
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
      this.stage.addChild(die.sprite);
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

}
