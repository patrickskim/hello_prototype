import _ from 'underscore';
import $ from 'jquery';

window.Lixir = {
  'App': {
    run() {
      console.log('Hello!');
    }
  }
};

window.onload = function() {
  Lixir.App.run();
};

$(document).ready(function() {
  console.log("ready!");
});

// Mock behaviors here
$(".ChatPanels").on("click", function() {
  $(this).toggleClass("js_move")
});
