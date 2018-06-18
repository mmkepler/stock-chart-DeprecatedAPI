import React from 'react';
import axios from 'axios';
import Stock from './Stock';
import ReactHighstock from 'react-highcharts/ReactHighstock.src';
import chartConfig from '../chartConfig';
var Loader = require('react-loader');


class Main extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      stocks: [],
      stockData: [],
      count: 0,
      input: '',
      original: true,
      message: '',
      loaded: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.deleteEntry = this.deleteEntry.bind(this);
  }

//============================
// Helper Functions ==========
  handleChange(e) {
    this.setState({input: e.target.value}, () => console.log('input', this.state.input));
  }

  handleSubmit(e) {
    /*When data is sent back: error, fake, object, yes; make sure error in db has its message*/
    /*Test if I need this*/e.preventDefault();
    let count = this.state.count;
      if(count < 5) {
      var newStock = (this.state.input).toUpperCase().replace(/ /g,'');
      this.setState({input: ''});
      let num = this.state.count;
      axios.post('/api/search', {name: newStock, count: num})
      .then((res) => {
        if(res.data === 'yes'){
          this.setState({message: 'This stock has already been added'});
        }else if(res.data === 'fake'){
          this.setState({message: 'This stock symbol does not exist'})
        }else if(res.data === 'error'){
          this.setState({message: 'Error. Please refresh and try again.'});
        }else{
          let newCount = this.state.count;
          newCount++;
          let available = this.findIndex(this.state.stockData);
          let stockState = this.state.stocks;
          let dataState = this.state.stockData;
          let newStock = {};
          let newData = {};
          let chartArr = [];
          newStock.name = res.data.quote.symbol;
          newStock.companyName = res.data.quote.companyName;
         
          for(let i = 0; i < res.data.chart.length; i++) {
            let tempArr = [];
            let close = res.data.chart[i].close
            let date = res.data.chart[i].date;
            let mili = Date.parse(date);
            tempArr.push(mili);
            tempArr.push(close);
            chartArr.push(tempArr);
          }
          newData.name = res.data.quote.symbol;
          newData.data = chartArr;
          newData._colorIndex = available;
          newData._symbolIndex = available;
          stockState.push(newStock);
          dataState.push(newData);
          this.setState({stocks: stockState, stockData: dataState, message: '', count: newCount});
        }
      })
      .catch((err) => {
        console.log('err in single request search', err);
        this.setState({message: 'Error. Please refresh and try again.'});
      });
    } else {
      this.setState({input: '', message: 'You can only display 5 stocks'});
    }
  }

  deleteEntry(item){
    let stock = item;
    axios.post('/api/delete' , {name: stock})
    .then((res) => {
      if(res.data === 'NotDeleted'){
        this.setState({message: 'Error. Please refresh and try again.'});
      } else {
        let stockList = this.state.stocks;
        let dataList = this.state.stockData;
        let newCount = this.state.count;
        newCount = newCount - 1;
        let removeObj = (array, stock) => {
          return array.filter((e) => e.name !== stock);
        }
        let updatedStocks = removeObj(stockList, stock);
        let updatedData = removeObj(dataList, stock)
        this.setState({stockData: updatedData, stocks: updatedStocks, count: newCount, message: ''});
      }
    })
    .catch((err) => {
      if(err) console.log('error requesting a delete', err);
      this.setState({message: 'Error. Please refresh and try again.'});
    });
  }

  findIndex(arr) {
    let all = [0, 1, 2, 3, 4];
    let taken = [];
    for(let i = 0; i < arr.length; i++) {
      taken.push(arr[i]._colorIndex);
    }
    let free = all.filter((item) => {
      return taken.indexOf(item) === -1;
    });
    return free[0];
  }
  //============================
// Helper Functions End ==========

  componentDidMount() {
    //Load data from db for setState after Mount
    if(this.state.original === true){
      axios.get('/api/stocks')
      .then((res) => {
        //create objects for stocks state
        let stockArr = [];
        let stockCount = 0;
        let dataState = res.data;
        let dataArr = []; 
        //create stock state objects from response data
        for(let i in dataState) {
          let tempStock = {};
          tempStock.name = dataState[i].quote.symbol;
          tempStock.companyName = dataState[i].quote.companyName;
          stockArr.push(tempStock);
        }
        //create stockData state objects from response data
        for(let j in dataState) {
          let tempData = {};
          let chartArr = [];
          let dataChart = dataState[j].chart;
          tempData.name = dataState[j].quote.symbol;
          tempData._colorIndex = stockCount;
          tempData._symbolIndex = stockCount;
          //change date into miliseconds 
          for(let k = 0; k < dataChart.length; k++) {
            let tempArr = [];
            let close = dataChart[k].close;
            let date = dataChart[k].date;
            let mili = Date.parse(date);
            tempArr.push(mili);
            tempArr.push(close);
            chartArr.push(tempArr);
          }
          tempData.data = chartArr;
          dataArr.push(tempData);
          stockCount++;
        }
        this.setState({ stocks: stockArr, stockData: dataArr, count: stockCount, original: false, loaded: true});
      })
      .catch((err) => console.log('error requesting data from /api/stocks', err));
    }
  }

  render(){
    let stockList = this.state.stocks;
    chartConfig.series = this.state.stockData;
    var message = this.state.message;
    return(
      <div className='main-body'>
      <Loader loaded={this.state.loaded}/>
      <div className='jumbotron'>
        <div className='chart'>
          <ReactHighstock config={chartConfig}></ReactHighstock>
          <p className='iex'>Data provided by <a href='https://iextrading.com/developer/'>IEX</a></p>
          <div className='message'>
            <p>{message}</p>
        </div>
        </div>
        
      </div>
        <div className='row'>
          <div className='col-lg-4 col-md-6 col-sm-12 section' >
            <div className='card bg-light mb-3'>
              <div className='modal-header'>
                  <p className='modal-title input-title'>Add a Stock</p>
              </div>
              <div className='card-body'>
                <form  id='input'>
                  <div className='input-group mb-3'>
                    <input aria-label='Add a stock' type='text' className='form-control' value={this.state.input} maxLength='10' pattern='[A-Za-z]+'  onChange={this.handleChange} />
                      <div className='input-group-append'>
                        <button aria-label='submit new stock' className='btn btn-outline-secondary' onClick={this.handleSubmit}>&nbsp;+&nbsp;</button>
                      </div>
                    </div>
                </form>
              </div>
              </div>
          </div>
          {stockList.map((item, index) => {
            let symbol = item.name;
            let companyName = item.companyName;
            return (
              <Stock key={symbol} name={symbol} data={companyName}  onClick={this.deleteEntry}/>
            );
          })}
        </div>
      </div>
    );
  }
}

export default Main;