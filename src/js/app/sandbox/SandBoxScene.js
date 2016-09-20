// PIXI is exposed in the global namespace
// import PIXI from 'pixi.js';
import _ from 'lodash';

export default class SandBoxScene {

  constructor() {
    this.stage = new PIXI.Container();
    this.stage.position.x = 200;


    this.onAssetsLoaded = this.onAssetsLoaded.bind(this);

    PIXI.loader
      .add('spritesheet', '/images/d6Sprite.json')
      .load(this.onAssetsLoaded);
  }

  render() {
    return this.stage;
  }

  update() {
    // console.log("update ran")
  }

  onAssetsLoaded() {
    this.stage.addChild(this.drawSprite());
  }

  drawSprite() {
    let frames = [];

    _(112).times((index) => {
      frames.push(PIXI.Texture.fromFrame(`d6_roll_${index+1}`));
    });

    let movie = new PIXI.extras.MovieClip(frames);
    movie.anchor.set(0.5);
    movie.animationSpeed = 0.5;
    movie.play();

    movie.position = { x: 300, y: 300 };
    return movie;
  }
}
