import _ from 'lodash';
import React, { Component } from 'react';
import RollSimulation from '../views/RollSimulation';

export default class MainCanvas extends Component {

  constructor(props) {
    super(props);

    this.rollSimulation = new RollSimulation();
  }

  componentDidMount() {
    let element = document.getElementById('MatterCanvas');
    let rollProps = {
      velocity: { x: _.random(10,30) * -1, y: _.random(10,30) * -1 },
      angularVelocity: 1
    };

    this.rollSimulation.render(element);
    this.rollSimulation.diceRoll(rollProps);
    this.rollSimulation.run();
  }

  render() {
    return (
      <div id="MatterCanvas" ref="gameCanvas"></div>
    );
  }
}
