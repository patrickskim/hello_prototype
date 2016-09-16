import _ from 'lodash';
// PIXI is exposed in the global namespace
// import PIXI from 'pixi.js';

export default class PixiRenderer {

  constructor() {
    this.width = 800;
    this.height = 600;
    this.props = {
      transparent: true,
      antialias: true
    };

    // arguments: width, height, view, transparent, antialias
    this.renderer = PIXI.autoDetectRenderer(this.width, this.height, this.props);
    this.stage = new PIXI.Container({options: 'ok'});

    this.animate = this.animate.bind(this);
  }

  render(options = {}) {
    // optional over-rides on render
    if (options.width) {
      this.width = options.width;
      this.updateDimensions(this.width);
    };

    this._drawScene();
    this.animate()

    return this.renderer.view;
  }

  updateDimensions(width, height) {
    if (width) {
      this.width = width;
    }

    if (height) {
      this.height = height;
    }

    this.renderer.resize(this.width, this.height);
    this.stage.emit('resize', this.width);
  }

  animate() {
    this.renderer.render(this.stage);
    this.frame = requestAnimationFrame(this.animate);
  }

  _drawScene() {
    let graphics = new PIXI.Graphics();
    graphics.beginFill(0xe74c3c); // Red
    graphics.drawCircle(200, 500, 40);
    graphics.endFill();

    // Add the graphics to the stage
    this.stage.addChild(graphics);
  }

}
