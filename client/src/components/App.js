import React, { Component } from 'react';
import axios from 'axios';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import '../App.css';

class App extends Component {

  render() {
    return (
      <div>
      <Header />
      <div className="App container">
        <Main {...this.state} data={this.getData}/>
      </div>
      <Footer />
      </div>
    );
  }
}

export default App;
