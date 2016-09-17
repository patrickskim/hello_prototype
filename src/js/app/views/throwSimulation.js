import _ from 'lodash';
import { Body, Bodies, Composite, Composites, Constraint, Engine, MouseConstraint, Render, World } from 'matter-js';

const tableProps = {
  width: 650,
  height: 600,
  borderTop: 80,
  borderRight: 20,
  borderBottom: 20,
  borderLeft: 20,
};

const tableStyles = {
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

export default class ThrowSimulation {

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
    this._enableMouse();

    Engine.run(this.engine);

    if (this.renderer) {
      Render.run(this.renderer);
    };
  }

  _drawScene() {
    let table = this._createTable();
    let dice = this._createDice(300, 560, 40);

    World.add(this.engine.world, [
      table.right,
      table.bottom,
      table.left,
      dice
    ]);
  }

  _enableMouse() {
    // add a mouse controlled constraint
    let mouseConstraint = MouseConstraint.create(this.engine, {
      element: this.renderer.canvas
    });

    World.add(this.engine.world, mouseConstraint);
    // pass mouse to renderer to enable showMousePosition
    this.renderer.mouse = mouseConstraint.mouse;
  }

  _createTable() {
    return {
      right : this._createBorder(tableStyles.right),
      bottom: this._createBorder(tableStyles.bottom),
      left  : this._createBorder(tableStyles.left),
    };
  }

  _createBorder(props) {
    return Bodies.rectangle(
      props.x, props.y, props.width, props.height, { isStatic: true }
    );
  }

  _createDice(x=0, y=0, size=40) {
    let d1 = this._createDie(x, y, size);
    let d2 = this._createDie(size *2, y, size);
    let pivotPoint = this._createPivotPoint(x, y, size);
    let dice = Composite.create({bodies: [d1, pivotPoint, d2]});

    Composites.chain(dice, 0, 0, 0, 0, { stiffness: 0.2, length: 37 });

    return dice;
  }

  _createPivotPoint(x, y, radius=40) {
    let props = {
      collisionFilter: {
        mask: 0x0001
      }
    };

    return Bodies.circle(x, y, radius, props);
  }

  _createDie(x=0, y=0, size=40) {
    let props = {
      frictionAir: 0.01,
      // restitution: 0.3,
      density: 0.01,
      collisionFilter: {
        category: 0x0002
      }
    };

    return Bodies.rectangle(x, y, size, size, props);
  }

}
