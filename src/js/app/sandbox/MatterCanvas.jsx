import _ from 'lodash';
import React, { Component } from 'react';
import RollPhysics from '../views/RollPhysics';

export default class MainCanvas extends Component {

  constructor(props) {
    super(props);

    this.rollPhysics = new RollPhysics();
    this.rollPhysics.drawScene();
  }

  componentDidMount() {
    let element = document.getElementById('MatterCanvas');

    // direction set by -1 | 1
    let rollSeed = {
      velocity: { x: _.random(10,30) * -1, y: _.random(10,30) * -1 },
      angularVelocity: 0.2,
    };

    this.rollPhysics.render(element);
    this.rollPhysics.run();
    this.rollPhysics.diceRoll(rollSeed);
  }

  render() {
    return (
      <div id="MatterCanvas" ref="gameCanvas"></div>
    );
  }
}
