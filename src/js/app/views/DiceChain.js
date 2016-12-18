import * as PIXI from 'pixi.js';
import _ from 'lodash';
import { Body, Bodies, Composite, Composites, Events, Vector } from 'matter-js';
import { EventEmitter } from 'events';
import SimulationDie from './SimulationDie';

const chainProps = {
  stiffness: 0.2,
  length: 37
};

const diceSize = 30;
const throwThreshold = 60;

export default class DiceChain extends EventEmitter {

  constructor({ num, position, stage }) {
    super();

    this.position = position;
    this.parentStage = stage;
    this.force = { x: 0, y: 0};

    this.dice = this._createDice({
      position: this.position,
      numOfDice: num,
      diceSize: diceSize
    });

    this.diceComposite = this._createDiceComposite({
      diceArr: this.dice,
      diceSize: diceSize
    });

    Composites.chain(this.diceComposite, 0, 0, 0, 0, chainProps);
  }

  leave() {
    this.removeAllListeners();
    _(this.dice).each( (die) => { die.leave(); });
  }

  update() {
    this._updateDice();
  }

  move(vector) {
    if (this.position.y - throwThreshold < vector.y) {
      Body.setPosition(this.pivotPoint, vector);
      return;
    }

    let v = Vector.sub(this.position, vector);
    v = Vector.normalise(v);
    v = Vector.mult(v, 0.05);
    v = Vector.neg(v);

    Body.applyForce(this.pivotPoint, {x:0,y:0}, v);
  }

  animate() {
    _(this.dice).each( (die) => { die.animate(); });
  }

  stop() {
    _(this.dice).each( (die) => { die.stop(); });
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

  getVelocity() {
    return this.pivotPoint.velocity;
  }

  _updateDice() {
    _(this.dice).each((die) => { die.update(); });
  }

  _createDiceComposite({ diceArr, diceSize }) {
    this.pivotPoint = this._createPivotPoint({
      position: this.position,
      radius: diceSize
    });

    return this._createComposite({
      diceArr: diceArr,
      pivotPoint: this.pivotPoint
    });
  }

  _createComposite({ diceArr, pivotPoint }) {
    let chainBodies = diceArr.map(die => die.physics);

    chainBodies.splice(
      Math.floor(chainBodies.length/2), 0,
      pivotPoint
    );

    return Composite.create({
      label: 'DiceChain',
      bodies: chainBodies
    });
  }

  _createDie({x, y}) {
    return new SimulationDie({
      position: { x: x, y: y } ,
      stage: this.parentStage
    });
  }

  _createDice({ position, numOfDice, diceSize }) {
    let dice = [];

    _(numOfDice).times( (idx) => {
      let offsetX = (idx * diceSize) + position.x;
      dice.push(this._createDie({ x: offsetX, y: position.y }));
    });

    return dice;
  }

  _createPivotPoint({ position, radius }) {
    let props = {
      label: 'PivotPoint',
      collisionFilter: { mask: 0x0001 }
    };

    return Bodies.circle(
      position.x + radius/2,
      position.y,
      radius,
      props
    );
  }
}
