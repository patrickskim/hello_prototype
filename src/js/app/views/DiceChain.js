// PIXI is exposed in the global namespace
// import PIXI from 'pixi.js';
import _ from 'lodash';
import { Body, Bodies, Composite, Composites, Events } from 'matter-js';
import { EventEmitter } from 'events';
import SimulationDie from './SimulationDie';

const chainProps = {
  stiffness: 0.2,
  length: 37
};

export default class DiceChain extends EventEmitter {

  constructor({ num, position }) {
    super();

    this.position = position;
    this.diceComposite = {};
    this.diceControl = {};
    this.dice = [];

    this._createDiceChain({
      numOfDice: num,
      diceSize: 40
    });

    // this.detectSleep = this.detectSleep.bind(this);
    // Events.on(this.physics, 'sleepStart', this.detectSleep);
  }

  leave() {
    // should it leave from the stage?
    // Events.off(this.physics);
    _(this.dice).each( (die) => { die.leave(); });
  }

  move(velocity) {
    Body.setVelocity(this.diceControl.physics, velocity);
  }

  update() {
    this._updateControl();
    this._updateDice();
  }

  getDiceComposite() {
    return this.diceComposite;
  }

  getDiceControl() {
    return this.diceControl;
  }

  getDice() {
    return this.dice;
  }

  _updateControl() {
    // this.diceControl.body.position = this.diceControl.physics.position;
  }

  _updateDice() {
    _(this.dice).each((die) => { die.update(); });
  }

  _createDiceChain({ numOfDice, diceSize }) {
    this.dice = this._createDice({
      position: this.position,
      numOfDice: numOfDice,
      diceSize: diceSize
    });

    this.diceControl = this._createControlPoint({
      position: this.position,
      radius: diceSize
    });

    this.diceComposite = this._createComposite({
      diceArr: this.dice,
      pivotPoint: this.diceControl
    });

    Composites.chain(this.diceComposite, 0, 0, 0, 0, chainProps);
  }

  _createComposite({ diceArr, pivotPoint }) {
    let chainBodies = diceArr.map(die => die.physics);

    chainBodies.splice(
      Math.floor(chainBodies.length/2), 0,
      this.diceControl.physics
    );

    let composite =  Composite.create({
      name: 'DiceChain',
      bodies: chainBodies
    });

    return composite;
  }

  _createDice({ position, numOfDice, diceSize }) {
    let dice = [];

    _(numOfDice).times( (idx) => {
      let offsetX = (idx * diceSize) + position.x;
      dice.push(this._createDie({ x: offsetX, y: position.y }));
    });

    return dice;
  }

  _createDie({x, y}) {
    return new SimulationDie({
      position: {x: x, y: y},
    });
  }

  _createControlPoint({ position, radius }) {
    let props = {
      name: 'Control',
      collisionFilter: { mask: 0x0001 }
    };

    let posX = position.x + radius/2;

    let graphics = new PIXI.Graphics();
    graphics.lineStyle (3 , 0x000000,  1);
    // graphics.beginFill(0x9b59b6); // Purple
    graphics.drawCircle(posX, position.y, radius);
    // graphics.endFill();

    return {
      body: graphics,
      physics: Bodies.circle(posX, position.y, radius, props)
    };
  }
}
