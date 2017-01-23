import _ from 'lodash';

export default function SpriteSmoke() {
  let sprite = new PIXI.extras.AnimatedSprite(_drawFrames());

  sprite.anchor.set(0.5, 0.5);
  sprite.scale.x = sprite.scale.y = _.random(10, 20) * .01;
  sprite.rotation = _.random(10,30) * 0.117;
  sprite.animationSpeed = .75;
  sprite.loop = false;

  return sprite;
}

function _drawFrames() {
  let frames = [];

  _(25).times((index) => {
    if (index < 10) {
      index = `0${index}`;
    }

    frames.push(PIXI.Texture.fromFrame(`smoke_fx_${index}.png`));
  });

  return frames;
}
