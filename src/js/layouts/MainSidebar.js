import React from 'react';
import Channels   from '../components/Channels';
import ChatPanels from '../components/ChatPanels';

export default class MainSidebar extends React.Component {

  render() {
    return (
      <div className="MainSidebar">
        <Channels />
        <ChatPanels />
      </div>
    );
  }
}
