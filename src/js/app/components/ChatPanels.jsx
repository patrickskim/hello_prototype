import React, { Component } from 'react';

export default class ChatPanels extends Component {

  constructor() {
    super();

    this.state = { move: false };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState({ move: !this.state.move });
  }

  render() {
    var classNames = 'ChatPanels';

    if (this.state.move) {
      classNames += ' js_move';
    }

    return (
      <div className={classNames} onClick={this.handleClick}>
        panel
      </div>
    );
  }
}
