import React, { Component } from 'react';

export default class UserImage extends Component {

  render() {
    return (
      <div className="UserImage">
        <div className="UserImage__avatar">
          <img src="/images/profile.jpg" />
        </div>
      </div>
    );
  }
}
