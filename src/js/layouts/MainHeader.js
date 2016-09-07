import React, { Component } from 'react';
import UserInfo from '../components/UserInfo';

export default class MainHeader extends Component {

  render() {
    return (
      <section className="MainHeader">
        <UserInfo />
        <div className="VolumeControls">Vol</div>
      </section>
    );
  }
}
