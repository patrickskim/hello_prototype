import _ from 'lodash';
import { TweenLite } from 'gsap';
import { randomNegNum } from './NumbersUtil';

function moveCamera(element, startPoint, endPoint) {
  let animation = new TimelineLite();

  animation
    .from(element, 0.5, { y: startPoint })
    .to(element, 0.2, { y: endPoint, ease: Elastic.easeOut });
}

function shakeCamera(element, min, max) {
  let animation = new TimelineLite();
  let amount = _.random(min,max);
  let easeConfig = {
    strength: 8,
    points: 7,
    template: Linear.easeNone,
    randomize: false
  };

  animation
    .fromTo(element, 0.3,
      { y: `-=${amount}` },
      { y: `+=${amount}`, ease: RoughEase.ease.config(easeConfig), clearProps: 'y'});
}

export { moveCamera, shakeCamera };
