import React from 'react';
import ReactDOM from 'react-dom';
import MainContainer from './layouts/MainContainer';

export default class App {
  // Set App properties here.
  // constructor(options = {}) {}

  init(options = {}) {
    this.render(options.target);
  }

  render(target) {
    ReactDOM.render(<MainContainer />, target);
  }
};
