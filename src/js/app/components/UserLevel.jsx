import React, { Component } from 'react';

export default class UserLevel extends Component {

  render() {
    let divStyle = {
      width: '77%'
    };

    return (
      <div className="UserLevel">
        <div className="UserLevel__bar" style={divStyle}></div>
        <div className="UserLevel__points">14,321</div>
      </div>
    );
  }
}
