import _ from 'lodash';
import App from './app/index';

const globals = {
  _: _,
  Lixir: new App()
};

_.extend(window, globals);

window.onload = function(){
  window.Lixir.init({
    target: document.getElementById('Root'),
  });
};
