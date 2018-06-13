import React, { Component } from 'react';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import '../App.css';

class App extends Component {

  render() {
    return (
      <div className='App'>
      <Header />
        <div className='main-content container'>
          <Main/>
        </div>
      <Footer />
      </div>
    );
  }
}

export default App;
