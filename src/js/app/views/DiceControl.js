import * as PIXI from 'pixi.js';
import { TweenLite } from 'gsap';
import { EventEmitter } from 'events';

export default class DiceControl extends EventEmitter {

  constructor({ position, radius }) {
    super();


    this.body = this._drawControlSprite(radius);
    this.body.interactive = true;
    this.body.buttonMode = true;

    this._setPosition({
      x: position.x + radius/2,
      y: position.y
    });

    this.onDragStart = this.onDragStart.bind(this);
    this.onDragMove  = this.onDragMove.bind(this);
    this.onDragEnd   = this.onDragEnd.bind(this);
    this.leave   = this.leave.bind(this);

    // events for drag start
    this.body
      .on('mousedown', this.onDragStart)
      .on('touchstart', this.onDragStart)
      .on('mouseup', this.onDragEnd)
      .on('mouseupoutside', this.onDragEnd)
      .on('touchend', this.onDragEnd)
      .on('touchendoutside', this.onDragEnd)
      .on('mousemove', this.onDragMove)
      .on('touchmove', this.onDragMove);
  }

  leave() {
    this.removeAllListeners();
    this.body.off();
    // this.body.destroy();
  }

  onDragStart(event) {
    this.data = event.data;
    this.dragging = true;

    TweenLite.to(this.body.scale, 0.3, { x: 2, y: 2, ease: Bounce.easeOut });
    return this.emit('dragStart', this);
  }

  onDragEnd() {
    this.dragging = false;
    this.data = null;
    this.emit('dragEnd', this);

    TweenLite.to(this.body.scale, 0.3, { x: 1, y: 1, ease: Bounce.easeOut });
  }

  onDragMove() {
    if (!this.dragging) {
      return;
    }

    this._setPosition(this.data.getLocalPosition(this.body.parent));

    return this.emit('dragMove', this);
  }

  _setPosition(position) {
    this.position = position;
    this.body.position = this.position;

    return this.position;
  }

  _drawControlSprite(radius) {
    let sprite = new PIXI.Graphics();

    sprite.lineStyle (3 , 0x000000,  1);
    sprite.beginFill(0x9b59b6, 0); // Purple
    sprite.drawCircle(0,0, radius);
    sprite.endFill();
    sprite.alpha = 0.2;

    return sprite;
  }
}
