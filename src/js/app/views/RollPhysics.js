import _ from 'lodash';
import { Body, Bodies, Engine, Events, Render, World } from 'matter-js';
import { EventEmitter } from 'events';

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
    height: tableProps.borderTop,
  },
  right: {
    x: tableProps.width- tableProps.borderRight/2,
    y: tableProps.height/2,
    width: tableProps.borderRight,
    height: tableProps.height,
  },
  left: {
    x: tableProps.borderLeft/2,
    y: tableProps.height/2,
    width: tableProps.borderLeft,
    height: tableProps.height,
  }
};

const rendererProps = {
  width: tableProps.width,
  height: tableProps.height,
  showVelocity: true,
  showAxes: true
};

export default class RollPhysics extends EventEmitter {

  constructor() {
    super();
    this.engine = Engine.create({ enableSleeping: true });
    this.engine.world.gravity = { x: 0, y: 0 };

    this.detectCollisions = this.detectCollisions.bind(this);
    Events.on(this.engine, 'collisionEnd', this.detectCollisions);
  }

  clear() {
    Events.off(this.engine, 'collisionEnd', this.detectCollisions);
  }

  render(element) {
    this.renderer = Render.create({
      element: element,
      engine: this.engine,
      options: rendererProps
    });
  }

  run() {
    if (this.renderer) {
      Render.run(this.renderer);
    };

    Engine.run(this.engine);
  }

  detectCollisions(event) {
    // NOTE maybe turn this into a sound engine with seperate props?
    _(event.pairs).each((pair) => {
      this.emit('collisionEnd', pair.bodyA.label, pair.bodyB.label);
    });
  }

  addChild(physicsObj) {
    if (!physicsObj) {
      return;      
    }

    World.add(this.engine.world, [ physicsObj ]);
  }

  drawScene() {
    this.table = this.createTable();
    World.add(this.engine.world, this.table);
  }

  createTable() {
    return [
      this.createBorder(tableStyles.top),
      this.createBorder(tableStyles.right),
      this.createBorder(tableStyles.left),
    ];
  }

  createBorder({ x, y, width, height }) {
    return Bodies.rectangle(x, y, width, height, { label: 'Table', isStatic: true });
  }

}
