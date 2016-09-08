  import React, { Component } from 'react';
  import UserImage from './UserImage';
  import UserLevel from './UserLevel';
  import UserCoins from './UserCoins';

  export default class UserInfo extends Component {

    render() {

      return (
        <div className="UserInfo">
          <div className="UserInfo__details">
            <UserImage />
            <div className="UserInfo__name">Name</div>
          </div>

          <div className="UserInfo__stats">
            <UserCoins />
            <UserLevel />
          </div>
        </div>
      );
    }
  }
