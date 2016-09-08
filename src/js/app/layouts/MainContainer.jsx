import React, { Component } from 'react';
import MainHeader from './MainHeader';
import MainBody from './MainBody';

export default class MainContainer extends Component {

  render() {
    return (
      <div id="MainContainer">
        <MainHeader />
        <MainBody />
      </div>
    );
  }
}
