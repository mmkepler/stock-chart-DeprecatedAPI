import React from 'react';
import axios from 'axios';
//import stockExample from '../models/stock-example';
//import dataExample from '../models/data-example';




class Main extends React.Component{
  constructor(props){
    super(props);

    this.state = {
      stocks: [],
      data: {},
      input: '',
      original: true
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.delete = this.delete.bind(this);
  }

  handleChange(e) {
    this.setState({input: e.target.value}, () => console.log("input", this.state.input));
  }


  handleSubmit(e) {
   
    e.preventDefault();
    var newStock = (this.state.input).toLowerCase().replace(/ /g,'');
    //console.log(newStock);
    //console.log(typeof newStock);
    axios.post('/api/search', {data: newStock})
    .then((res) => {
      console.log("search result", res.data);

      if(res.data === "yes"){
        //Add message it already exists
        
        console.log("does exist");
      }else if(res.data === "fake"){
        console.log("is not real");
        
      }else{
        console.log("doesn't exist");
        var currentStocks = this.state.stocks[0];
        var currentData = this.state.data;
        let dataValue = res.data; 
        
        currentStocks.push(newStock);
        Object.assign(currentData, dataValue);
        this.setState({stocks: currentStocks, data: currentData, input: ''}, () => console.log(this.state));
        
        //currentStocks.push(newStock);
        //console.log("current stocks after", currentStocks);
        //console.log("stocks after push", currentStocks);
        //currentData.push(res.data);
        //this.setState({stocks: currentStocks, data: currentData}, () => {
          //console.log("state updated", this.state);
        //});
        //let newData = {newStock: res.data}
        //Object.assign(currentData, newData);
        //console.log("fixed data", currentData);
      }
     

    })
    .catch((err) => {
      console.log("err in single request search", err);
      //needs a message
    });
  }

  delete(key){
    //e.preventDefault();
    //console.log(key);
    //let index = key;
    //console.log('index', index);
    let item = this.state.stocks[0];
    //console.log(item);
    let removeItem = item[key];
    console.log(removeItem);
    axios.post('/api/delete' , {name: removeItem})
    .then((res) => {
      console.log(res);
      let data = this.state.data;

      let stocks = this.state.stocks[0].slice(key, 1);
      
      delete data[removeItem];
      console.log(data, stocks)
      //this.setState({stocks});

    })
    .catch();

  }


   componentDidMount() {
     if(this.state.original === true){
     axios.get('/api/stocks')
      .then((res) => {
        var names = [res.data];
        //console.log("names", names);
        this.setState({stocks: names, original: false}, () => {/*console.log(this.state)*/});
        return names
      })
      .then((names) => {
        //console.log("something", names);
        //var temp = new URL(this.makeUrl(names));
        //console.log('url', temp);
        //let data = this.getData(temp);

        axios.post('/api/data', names)
        .then((info) => {
          //console.log(info.data);
          this.setState({data: info.data}, () => {/*console.log(this.state)*/})
          
        })
        .catch((err) => console.log(err));

      });
     }
    /* Make sure to add the updated chart here */
    }
  

  render(){
    var list = this.state.data;
    var listData = Object.keys(list).map(i => list[i]);
    console.log(listData);

    console.log("listData", listData);
    return(
      <div className="main-body">
      <div className='jumbotron'>
        <div className='chart'>
          Chart Stuff goes here
        </div>
        </div>
        <div className="row">

          <div className='col-lg-4 col-md-6 col-sm-12 section' >
            <div className="card bg-light mb-3" >
              <div className="modal-header">
                  <h5 className="modal-title">Add a Stock</h5>
                </div>
              <div className="card-body">
                <form /*action='/api/addstock' method='post'*/ onSubmit={this.handleSubmit} id='input'>
                  <div className='input-group mb-3'>
                    <input type='text' className="form-control" value={this.state.input} maxLength="10" pattern='[A-Za-z]+' aria-label='Add a stock' aria-describedby='basic-addon2' onChange={this.handleChange} />
                      <div className='input-group-append'>
                        <button className='btn btn-outline-secondary' >&nbsp;+&nbsp;</button>
                      </div>
                    </div>
                </form>
              </div>
              </div>
          </div>

          {listData.map((item, index) => {
            return (
              <div className='col-lg-4 col-md-6 col-sm-12 section' key={index} >
                <div className="card bg-light mb-3" >
                  <div className="modal-header">
                  <h5 className="modal-title">{item.quote.symbol}</h5>
                  <button type="button"  className="close" aria-label="Close"  onClick={() => this.delete(index)} data-toggle="close">
                    <span aria-hidden="true" >&times;</span>
                  </button>
                </div>
                  <div className="card-body">
                    <p className="card-title">{item.quote.companyName}</p>
                  </div>
                </div>
              </div>
            );
          })}
          
          

        </div>


      </div>
    );
  }
}

export default Main;

//https://ws-api.iextrading.com/1.0/stock/market/batch?symbols=aapl,fb,tsla,adbe&types=quote,chart&range=3m&last=10

//https://ws-api.iextrading.com/1.0/stock/market/batch?symbols=adbe&types=quote,chart&range=3m&last=10
/*//var urlBase = 'https://ws-api.iextrading.com/1.0/stock/market/batch?symbols=';
    //var urlEnd = '&types=quote,chart&range=3m&last=10'; */