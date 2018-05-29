import React from 'react';
import axios from 'axios';
import Stock from './Stock';
import Chart from './Chart';
import FusionCharts from 'fusioncharts';
import Charts from 'fusioncharts/fusioncharts.charts';
import ReactFC from 'react-fusioncharts';


class Main extends React.Component{
  constructor(props){
    super(props);

    this.state = {
      stocks: [],
      data: [],
      input: '',
      original: true,
      message: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    //this.deleteEntry = this.deleteEntry.bind(this);
  }

//============================
// Helper Functions ==========
  handleChange(e) {
    this.setState({input: e.target.value}, () => console.log("input", this.state.input));
  }


  handleSubmit(e) {
    /*  When data is sent back: error, fake, object, yes; make sure error in db has its message*/
    e.preventDefault();
    //document.activeElement.blur();
    this.setState({input: ''});
    var newStock = (this.state.input).toUpperCase().replace(/ /g,'');
    console.log('input submitted new Stock', newStock);
    console.log('typeof newStock after search', typeof newStock);
    axios.post('/api/search', {data: newStock})
    .then((res) => {
      console.log("search result for newStock", res.data);

      if(res.data === 'yes'){
        //Add message it already exists
        
        this.setState({message: 'This stock has already been added'});
        console.log('does exist');
      }else if(res.data === "fake"){
        console.log("is not real");
        this.setState({message: 'This stock symbol does not exist'})
      }else if(res === "error"){
        console.log("error retrieving or saving");
        this.setState({message: 'Error. Please refresh and try again.'});
      }else{
        console.log("doesn't exist");
        var currentStocks = [...this.state.stocks[0]];
        var currentData = this.state.data;
        let dataValue = res.data; 
        console.log("checkin data", dataValue);
        currentStocks.push(newStock);
        currentData.push(dataValue);
        this.setState({stocks: currentStocks, data: currentData, message: ''}, () => console.log("on return from /api/search the array of state", this.state));

      }
     

    })
    .catch((err) => {
      console.log("err in single request search", err);
      this.setState({message: 'Error. Please refresh and try again.'});
    });
  }

  deleteEntry(item){
    console.log('delete item', item)
    let stock = item;
    //document.activeElement.blur();
    //let index = key;
    let list = this.state.stocks[0];
    console.log('delete list', list);
    //let removeItem = list[index];
    //console.log('remove item', removeItem);
    axios.post('/api/delete' , {name: stock})
    .then((res) => {

      if(res.data === 'NotDeleted'){
        //add message
        this.setState({message: 'Error. Please refresh and try again.'});
      } else {
        console.log('post to remove item response', res);
      

        let remove = (array, stock) => {
          return array.filter((e) => e !==  stock);
        }
        let updatedStocks = remove(list, stock);
        let updatedData = this.state.data;
        for(var i = 0; i < updatedData.length; i++){
          console.log(updatedData[i]);
          if(updatedData[i].hasOwnProperty(stock)){
            console.log('yes');
            updatedData.splice(i, 1);
          }
        }
        console.log('updatedData', updatedData);
        this.setState({stocks: updatedStocks, data: updatedData}, console.log("update in delete", this.state));
      }
      
      

    })
    .catch((err) => {
      if(err) console.log('error requesting a delete', err);
      this.setState({message: 'Error. Please refresh and try again.'});
    });

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
        axios.post('/api/data', names)
        .then((info) => {
          //console.log(info.data);
          this.setState({data: info.data}, () => {/*console.log(this.state)*/})
        })
        .catch((err) => console.log('err in post to /api/data', err));

      });
     }
    /* Make sure to add the updated chart here */
    }
  

  render(){
    var list = this.state.data;
    //var listData = Object.keys(list).map(i => list[i]);
    //console.log("listData", listData);
    var message = this.state.message;
  

    console.log("listData in render function", list);
    return(
      <div className="main-body">
      <div className='jumbotron'>
        <div className='chart'>
          {<Chart stocks={this.state.data} width={'100%'}  height={'100%'} margins={'20px'}/>}
        </div>
        </div>
        <div className='message'>
        <p>{message}</p>
        </div>
        <div className="row">

          <div className='col-lg-4 col-md-6 col-sm-12 section' >
            <div className="card bg-light mb-3" >
              <div className="modal-header">
                  <h5 className="modal-title">Add a Stock</h5>
                </div>
              <div className="card-body">
                <form /*action='/api/addstock' method='post'*/  id='input'>
                  <div className='input-group mb-3'>
                    <input type='text' className="form-control" value={this.state.input} maxLength="10" pattern='[A-Za-z]+' aria-label='Add a stock' aria-describedby='basic-addon2' onChange={this.handleChange} />
                      <div className='input-group-append'>
                        <button className='btn btn-outline-secondary' onClick={this.handleSubmit}>&nbsp;+&nbsp;</button>
                      </div>
                    </div>
                </form>
              </div>
              </div>
          </div>

          {list.map((item, index) => {
            let name = Object.keys(item);
            let companyName = item[name].quote.companyName;
            

            return (
              <Stock key={name} name={name} data={companyName}  onClick={this.deleteEntry.bind(this)}/>
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