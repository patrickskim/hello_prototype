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

const diceProps = {
  size: 40,
  options: {
    label: 'Die',
    frictionAir: 0.025,
    restitution: 0.3,
    density: 0.01
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
    this.engine.world.gravity = {x: 0, y: 0};

    this.table = this.createTable();
    this.dice  = this.createDice({ num: 2, x: 300, y: 600 });
  }

  render(element) {
    this.renderer = Render.create({
      element: element,
      engine: this.engine,
      options: rendererProps
    });
  }

  run() {
    Engine.run(this.engine);

    if (this.renderer) {
      Render.run(this.renderer);
    };
  }

  diceRoll({ velocity, angularVelocity }) {
    _(this.dice).each((die) => {
      Body.setVelocity(die, velocity);
      Body.setAngularVelocity(die, angularVelocity);
    });
  }

  drawScene() {
    let sceneItems = _.concat(this.table, this.dice);
    World.add(this.engine.world, sceneItems);
  }

  createDice({ num, x, y }) {
    let dice = [];

    _(num).times( (count) => {
      let offsetX = (count * diceProps.size) + x;
      dice.push(this.createDie({ x: offsetX, y: y }));
    });

    return dice;
  }

  createDie({ x, y }) {
    let die = Bodies.rectangle(x, y, diceProps.size, diceProps.size, diceProps.options);

    Events.on(this.engine, 'collisionEnd', (event) => {
      _(event.pairs).each((pair) => {
        this.emit('collisionEnd', pair.bodyA.label, pair.bodyB.label);
      });
    });

    Events.on(die, 'sleepStart', (die) => {
      console.log('p SleepStart');
      this.emit('sleepStart', die);
    });

    console.log('create Pdie');
    return die;
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

  // this._drawChipStack(200, 200, 10);
  //
  // _drawChipStack(x=0, y=0, limit=10) {
  //   _.times(limit, (i) => {
  //     World.add(this.engine.world, this._createChip(x, y+i*5));
  //   });
  // }
  //
  // _createChip(x=0, y=0) {
  //   let props = {
  //     frictionAir: 0.08,
  //     density: 0.03
  //   };
  //
  //   let width = 20;
  //   let height = 5;
  //
  //   return Bodies.rectangle(x, y, width, height, props);
  // }

}
