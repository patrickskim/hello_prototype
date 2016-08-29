import _ from 'underscore';
import $ from 'jquery';

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

$(document).ready(function() {
    console.log("ready!");
});
