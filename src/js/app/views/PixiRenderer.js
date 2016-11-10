// PIXI is exposed in the global namespace
import * as PIXI from 'pixi.js';
import _ from 'lodash';

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

  view(options = {}) {
    // optional over-rides on render
    if (options.width) {
      this.width = options.width;
      this.updateDimensions(this.width);
    };

    return this.renderer.view;
  }

  render(Scene) {
    if (!Scene) {
      return;
    }

    this.scene = new Scene();
    this.stage.addChild(this.scene.render());
    this.animate();
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
    if (this.scene) {
      this.scene.update();
    }

    this.renderer.render(this.stage);
    requestAnimationFrame(this.animate);
  }
}
