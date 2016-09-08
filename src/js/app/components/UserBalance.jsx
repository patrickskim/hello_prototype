import React, { Component } from 'react';

export default class UserBalance extends Component {

  render() {
    return (
      <div className="UserBalance">
        <div className="UserBalance__currency">
          <div className="UserBalance__chips"></div>
        </div>
        <div className="UserBalance__title">1,500</div>
        <div className="UserBalance__label">chips</div>
      </div>
    );
  }
}
