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
  let minRadian = 0.01;
  let animation = new TimelineLite();
  let origin = element.position;
  let amount = _.random(min,max);
  let rotation = amount * minRadian;

  console.log('shake', amount);

  animation
    .to(element, 0.3, { y: `+=${amount}`, ease: Elastic.easeIn })
    .to(element, 0.2, { y: origin.y });
}

export { moveCamera, shakeCamera };
