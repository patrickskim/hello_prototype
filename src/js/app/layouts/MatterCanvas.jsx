import _ from 'lodash';
import React, { Component } from 'react';
import RollSimulation from '../views/ThrowSimulation';

export default class MainCanvas extends Component {

  constructor(props) {
    super(props);

    this.rollSimulation = new RollSimulation();
  }

  componentDidMount() {
    let element = document.getElementById('MatterCanvas');

    this.rollSimulation.render(element);
    // this.rollSimulation.diceRoll(rollProps);
    this.rollSimulation.run();
  }

  render() {
    return (
      <div id="MatterCanvas" ref="gameCanvas"></div>
    );
  }
}
