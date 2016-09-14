import _ from 'lodash';
import { Body, Bodies, Engine, Render, World } from 'matter-js';

const tableProps = {
  width: 650,
  height: 600,
  borderTop: 80,
  borderRight: 20,
  borderBottom: 10,
  borderLeft: 20,
};

const tableStyles = {
  top: {
    x: tableProps.width/2,
    y: 0,
    width: tableProps.width - tableProps.borderLeft - tableProps.borderRight,
    height: tableProps.borderTop
  },
  right: {
    x: tableProps.width- tableProps.borderRight/2,
    y: tableProps.height/2,
    width: tableProps.borderRight,
    height: tableProps.height
  },
  bottom: {
    x: tableProps.width/2,
    y: tableProps.height,
    width: tableProps.width - tableProps.borderLeft - tableProps.borderRight,
    height: tableProps.borderBottom
  },
  left: {
    x: tableProps.borderLeft/2,
    y: tableProps.height/2,
    width: tableProps.borderLeft,
    height: tableProps.height
  }
};

export default class RollSimulation {

  constructor() {

    this.engine = Engine.create({ enableSleeping: true });
    this.engine.world.gravity = {x: 0, y: 0};

    this._drawScene();
  }

  render(element) {
    this.renderer = Render.create({
      element: element,
      engine: this.engine,
      options: {
        width: tableProps.width,
        height: tableProps.height,
        showVelocity: true,
        showAxes: true
      }
    });
  }

  run() {
    Engine.run(this.engine);

    if (this.renderer) {
      Render.run(this.renderer);
    };
  }

  diceThrow(props) {
    if (props) {
      _(this.dice).each((die) => {
        Body.setVelocity(die, props.velocity);
        Body.setAngularVelocity(die, props.angularVelocity);
      });
    };
  }

  _drawScene() {
    let table = this._createTable();
    let dice = this._createDice(300, 600, 40);

    this._drawChipStack(200, 200, 10);

    World.add(this.engine.world, [
      table.top,
      table.right,
      // table.bottom,
      table.left,
      dice[0],
      dice[1]
    ]);
  }

  _createTable() {
    return {
      top   : this._createBorder(tableStyles.top),
      right : this._createBorder(tableStyles.right),
      // bottom: this._createBorder(tableStyles.bottom),
      left  : this._createBorder(tableStyles.left),
    };
  }

  _createBorder(props) {
    return Bodies.rectangle(
      props.x, props.y, props.width, props.height, { isStatic: true }
    );
  }

  _drawChipStack(x=0, y=0, limit=10) {
    _.times(limit, (i) => {
      World.add(this.engine.world, this._createChip(x, y+i*5));
    });
  }

  _createChip(x=0, y=0) {
    let props = {
      frictionAir: 0.08,
      density: 0.03
    };

    let width = 20;
    let height = 5;

    return Bodies.rectangle(x, y, width, height, props);
  }

  _createDice(x=0, y=0, size=40) {
    let props = {
      frictionAir: 0.025,
      restitution: 0.3,
      density: 0.01
    };

    // Not sure if this needs to be set a prop
    let d1 = this._createDie(x, y, size, props);
    let d2 = this._createDie(x+size, y, size, props);

    return this.dice = [d1, d2];
  }

  _createDie(x=0, y=0, size=40, props={}) {
    return Bodies.rectangle(x, y, size, size, props);
  }

}
