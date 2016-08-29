import _ from 'underscore';

window.Lixir = {
  'App': {
    run() {
      console.log('Hello!');
      console.log("init works!", _ );
    }
  }
};

window.onload = function() {
  Lixir.App.run();
};
