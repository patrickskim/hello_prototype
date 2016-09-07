import React, { Component } from 'react';
import MainHeader from './MainHeader';
import MainBody from './MainBody';

export default class MainContainer extends Component {

  render() {
    return (
      <div className="MainContainer">
        <MainHeader />
        <MainBody />
      </div>
    );
  }
}
