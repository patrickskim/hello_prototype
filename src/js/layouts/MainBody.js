import React, { Component } from 'react';
import MainContent from './MainContent';
import MainSidebar from './MainSidebar';

export default class MainBody extends Component {

  render() {
    return (
      <section className="MainBody">
        <MainContent />
        <MainSidebar />
      </section>
    );
  }
}
