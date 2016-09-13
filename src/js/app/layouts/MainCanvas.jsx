import _ from 'lodash';
import React, { Component } from 'react';
// PIXI is exposed in the global namespace
// import PIXI from 'pixi.js';

export default class MainCanvas extends Component {


  constructor(props) {
    super(props);

    this.domId = 'MainCanvas';
    this.state = { width: 900, height: 600 };

    // Throttle this sucker
    this.updateDimensions = _.debounce(this.updateDimensions, 600);

    this.updateDimensions = this.updateDimensions.bind(this);
    this.animate = this.animate.bind(this);
  }

  componentDidMount() {
    // Broke the rules a little here.
    this.state.width = this.elementDimensions().width;

    console.log(this.state.width);
    //Setup PIXI Canvas in componentDidMount
    // arguments: width, height, view, transparent, antialias
    this.renderer = PIXI.autoDetectRenderer(
      this.state.width,
      this.state.height,
      { transparent: true,
        antialias: true
      });

    this.refs.gameCanvas.appendChild(this.renderer.view);

    this.drawIt();
    this.animate();

    window.addEventListener('resize', this.updateDimensions);
  }

  drawIt() {
    // create the root of the scene graph
    this.stage = new PIXI.Container({options: 'ok'});
    console.log(this.stage);
    // this.stage.x = 100;

    // stash some references.
    this.stage._dimensions = {
      width: this.state.width,
      height: this.state.height
    };


    this.stage.on('resize', (w) => console.log('resize', this,w));

    let graphics = new PIXI.Graphics();
    graphics.beginFill(0xe74c3c); // Red
    graphics.drawCircle(200, 500, 40);
    graphics.endFill();

    // Add the graphics to the stage
    this.stage.addChild(graphics);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }

  componentWillUpdate(nextProps, nextState) {
    this.resizeStage(nextState.width, nextState.height);
  }

  shouldComponentUpdate(_nextProps, nextState) {
    return nextState.width !== this.state.width;
  }

  updateDimensions() {
    // only update width.
    this.setState({width: this.elementDimensions().width});
  }

  elementDimensions() {
    let el = document.getElementById(this.domId);

    if (el == null) {
      return { width: 0, height: 0 };
    }

    return {
      width: el.offsetWidth,
      height: el.offsetHeight
    };
  }

  resizeStage(width, height) {
    //this part adjusts the ratio:
    this.renderer.resize(width,height);
    this.stage.emit('resize', width);
    // this might be heavy handed approach.
    // this.stage.removeChildren();
    // this.drawIt();
  }

  animate() {
    this.renderer.render(this.stage);
    this.frame = requestAnimationFrame(this.animate);
  }

  render() {
    return (
      <div id={this.domId} ref="gameCanvas"></div>
    );
  }
}
