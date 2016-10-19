import _ from 'lodash';
import React, { Component } from 'react';
import PixiRenderer from '../views/PixiRenderer';
import SimulationRoll from '../views/SimulationRoll';
import SimulationThrow from '../views/SimulationThrow';

export default class MainCanvas extends Component {

  constructor(props) {
    super(props);

    this.renderer = new PixiRenderer();

    this.updateDimensions = _.throttle(this.updateDimensions, 500);
    this.updateDimensions = this.updateDimensions.bind(this);
  }

  componentDidMount() {
    let dimensions = this.elDimensions();
    this.state = dimensions;

    // Get View and add to dom
    let view = this.renderer.view(dimensions);
    this.gameCanvas.appendChild(view);

    // NOTE Wrap this in a function
    let sim = SimulationThrow;
    // let sim = SimulationRoll;

    this.renderer.render(sim);

    window.addEventListener('resize', this.updateDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }

  componentWillUpdate(nextProps, nextState) {
    this.renderer.updateDimensions(nextState.width);
  }

  shouldComponentUpdate(_nextProps, nextState) {
    return nextState.width !== this.state.width;
  }

  updateDimensions() {
    this.setState(this.elDimensions());
  }

  elDimensions() {
    return {
      width: this.gameCanvas.offsetWidth,
      height: this.gameCanvas.offsetHeight
    };
  }

  render() {
    return (
      <div id="MainCanvas" ref={(ref) => this.gameCanvas = ref}></div>
    );
  }
}
