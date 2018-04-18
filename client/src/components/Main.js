import React from 'react';

class Main extends React.Component{
  
  render(){
    let urlBase = 'https://ws-api.iextrading.com/1.0/stock/market/batch?symbols=';
    let endUrl = '&types=quote,chart&range=3m&last=10';
    let temp = '';


    let stocks = this.props.active;
    
    
    stocks = stocks.toString().trim();
    temp += urlBase += stocks += endUrl;
    this.props.data(temp);
    
   

    return(
      <div className='jumbotron'>
        <div className='chart'>
          Chart Stuff goes here
        </div>

          <div className='group center-block'>
            <div className='input-group'>
              <input type='text' className='form-control' placeholder='Enter Stock Name' />
              <span className='input-group-btn'>
                <button className='btn btn-secondary' type='button'>Add</button>
              </span>
            </div>
          </div>

          <div className='active-stocks'>
            <div className='container'>
            {}
          </div>
        </div>
      </div>
    );
  }
}

export default Main;