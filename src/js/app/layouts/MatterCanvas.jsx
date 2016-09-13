import _ from 'lodash';
import React, { Component } from 'react';
import Matter from 'matter-js';

// Actually a matter canvas
export default class MainCanvas extends Component {


  constructor(props) {
    super(props);
  }

  componentWillMount() {
    // create an engine
    this.engine = Matter.Engine.create({ enableSleeping: true });
  }

  componentDidMount() {
    console.log('did canvas');

    let element = document.getElementById('MatterCanvas');

    let canvas = {
      width: 650,
      height: 600
    };

    // offset to get 0,0 = top,left
    let offset = {
      x: canvas.width/2,
      y: canvas.height/2
    };

    let tableStyle = {
      borderTop: 80,
      borderRight: 20,
      borderBottom: 10,
      borderLeft: 20,
    };

    let tableBox = {
      top: {
        x: offset.x,
        y: 0,
        width: canvas.width - tableStyle.borderLeft - tableStyle.borderRight,
        height: tableStyle.borderTop
      },
      right: {
        x: canvas.width- tableStyle.borderRight/2,
        y: offset.y,
        width: tableStyle.borderRight,
        height: canvas.height
      },
      bottom: {
        x: offset.x,
        y: canvas.height,
        width: canvas.width - tableStyle.borderLeft - tableStyle.borderRight,
        height: tableStyle.borderBottom
      },
      left: {
        x: tableStyle.borderLeft/2,
        y: offset.y,
        width: tableStyle.borderLeft,
        height: canvas.height
      }
    };

    let table = {
      top: Matter.Bodies.rectangle(tableBox.top.x, tableBox.top.y, tableBox.top.width, tableBox.top.height, { isStatic: true }),
      right: Matter.Bodies.rectangle(tableBox.right.x, tableBox.right.y, tableBox.right.width, tableBox.right.height, { isStatic: true }),
      bottom: Matter.Bodies.rectangle(tableBox.bottom.x, tableBox.bottom.y, tableBox.bottom.width, tableBox.bottom.height, { isStatic: true }),
      left: Matter.Bodies.rectangle(tableBox.left.x, tableBox.left.y, tableBox.left.width, tableBox.left.height, { isStatic: true }),
    };

    // // create two boxes and a ground
    let dice_props = {
      frictionAir: 0.025,
      restitution: 0.3,
      density: 0.01
    };

    // _(_.random(6,10)).times( (num) => {
    //   this.newStack(this.engine.world, num * 30 + 200);
    // });


    let boxA = Matter.Bodies.rectangle(300, 560, 40, 40, dice_props);
    let boxB = Matter.Bodies.rectangle(340, 560, 40, 40, dice_props);
    let circ = Matter.Bodies.circle(450, 300, 15, {density: 1});

    //no gravity
    this.engine.world.gravity = {x: 0, y: 0};

    // add all of the bodies to the world
    Matter.World.add(this.engine.world, [
      boxA, boxB,
      // circ,
      table.top,
      table.right,
      table.bottom,
      table.left,
    ]);

    // its moving time.
    let seedProps = {
      velocity: { x: _.random(10,30) * -1, y: _.random(10,30) * -1 },
      angularVelocity: 0.8
    };


    Matter.Body.setVelocity(boxA, seedProps.velocity);
    Matter.Body.setVelocity(boxB, seedProps.velocity);

    Matter.Body.setAngularVelocity(boxA, seedProps.angularVelocity);
    Matter.Body.setAngularVelocity(boxB, seedProps.angularVelocity);


    // create a renderer
    this.renderer = Matter.Render.create({
      element: element,
      engine: this.engine,
      options: {
        width: canvas.width,
        height: canvas.height,
        showVelocity: true,
        showAxes: true,
      }
    });

    // add a mouse controlled constraint
    let mouseConstraint = Matter.MouseConstraint.create(this.engine, {
      element: this.renderer.canvas
    });

    Matter.World.add(this.engine.world, mouseConstraint);
    // pass mouse to renderer to enable showMousePosition
    this.renderer.mouse = mouseConstraint.mouse;

    // run the engine
    Matter.Engine.run(this.engine);

    // run the renderer
    Matter.Render.run(this.renderer);
  }

  newStack(world, randX) {
    let chip_props = {
      frictionAir: 0.08,
      density: 0.03
    };

    // 10 per stack
    _(_.range(10)).each((num, i) => {

      let chipStyle = {
        x: randX+30,
        y: 200+i * 5, //matches with height
        width: 20,
        height: 5
      };

      let chip = Matter.Bodies.rectangle(chipStyle.x, chipStyle.y, chipStyle.width, chipStyle.height, chip_props);

      Matter.World.add(world, chip);
    });
  }

  render() {
    return (
      <div id="MatterCanvas" ref="gameCanvas"></div>
    );
  }
}
