import _ from 'lodash';
import React, { Component } from 'react';
import PixiRenderer from '../views/PixiRenderer';
import SandBoxScene from './SandBoxScene';

export default class MainCanvas extends Component {

  constructor(props) {
    super(props);

    this.renderer = new PixiRenderer();
  }

  componentDidMount() {
    let view = this.renderer.view({width: 720, height: 600});
    this.gameCanvas.appendChild(view);

    this.renderer.render(SandBoxScene);
  }

  render() {
    return (
      <div id="MainCanvas" ref={(ref) => this.gameCanvas = ref}></div>
    );
  }
}
