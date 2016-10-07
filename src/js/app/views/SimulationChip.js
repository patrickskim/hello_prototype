// PIXI is exposed in the global namespace
// import PIXI from 'pixi.js';

import _ from 'lodash';
import { Body, Bodies, Events } from 'matter-js';
import { EventEmitter } from 'events';

const chipProps = {
  width: 30,
  height: 5,
  physics: {
    frictionAir: 0.08,
    density: 0.03
  }
};

const TextureCache = PIXI.utils.TextureCache;

export default class SimulationChip extends EventEmitter {

  constructor(position) {
    super();

    this.position = position;
    this.physics = this._createPhysics();
    this.body = this._drawSprite();
    this.body.position = this.position;
  }

  update() {
    // one way data flow for positioning.
    this.position = this.physics.position;
    this.rotation = this.physics.angle;

    this.body.position = this.position;
    this.body.rotation = this.rotation;
  }

  _createPhysics() {
    return Bodies.rectangle(
      this.position.x,
      this.position.y,
      chipProps.width,
      chipProps.height,
      chipProps.physics
    );
  }

  _drawSprite() {
    let chip = new PIXI.Sprite(PIXI.loader.resources['chip'].texture);

    chip.anchor.set(0.5, 0.5);
    chip.scale.x = chip.scale.y = 0.75;


    return chip;
  }

}


