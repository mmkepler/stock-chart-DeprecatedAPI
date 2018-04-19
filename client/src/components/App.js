import React, { Component } from 'react';
import axios from 'axios';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import '../App.css';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      active: [],
      data: []
    };
 this.getData = this.getData.bind(this);
  }

  componentWillMount(){
      if(this.state.active.length === 0){
      this.setState({
        active: ['FB', 'GOOGL', 'AAPL', 'ADBE', 'TWTR']
      });
      
    }
  }
  

  getData = (url) => {
    const options = {
    method: 'GET',
    headers: {"Access-Control-Allow-Origin": "*",
      "origin": "https://polar-tundra-85199.herokuapp.com/"
    },
    url: url
  };
    axios(options)
    .then((response) => {
      this.setState({
        data: response
      });
    })
    .catch((err) => {
      if(err){
        return(
          <div>Error retrieving data. Please refresh and try again</div>
        );
      }
    });
  }

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
