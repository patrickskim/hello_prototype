import _ from 'lodash';
import React, { Component } from 'react';
import PixiRenderer from '../views/PixiRenderer.js';

export default class MainCanvas extends Component {

  constructor(props) {
    super(props);

    this.renderer = new PixiRenderer();
    this.updateDimensions = this.updateDimensions.bind(this);
  }

  componentDidMount() {
    let dimensions = this.elDimensions();
    let view = this.renderer.render(dimensions);

    this.gameCanvas.appendChild(view);
    this.state = dimensions;

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

  updateDimensions: Function = _.throttle(() => {
    this.setState(this.elDimensions());
  }, 500);

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
