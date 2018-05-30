import React from 'react';
import axios from 'axios';
import Stock from './Stock';
//import ReactHighstock from 'react-highcharts/ReactHighstock.src';
//import Highlight from 'react-highlight';



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
    
  }


//============================
// Helper Functions ==========
  handleChange(e) {
    this.setState({input: e.target.value}, () => console.log("input", this.state.input));
  }


  handleSubmit(e) {
    /*  When data is sent back: error, fake, object, yes; make sure error in db has its message*/
    e.preventDefault();
    var newStock = (this.state.input).toUpperCase().replace(/ /g,'');
    this.setState({input: ''});
    console.log('input submitted new Stock', newStock);
    console.log('typeof newStock after search', typeof newStock);
    axios.post('/api/search', {data: newStock})
    .then((res) => {
      console.log("search result for newStock", res.data);

      if(res.data === 'yes'){
        this.setState({message: 'This stock has already been added'});
        console.log('does exist');
      }else if(res.data === "fake"){
        console.log("is not real");
        this.setState({message: 'This stock symbol does not exist'})
      }else if(res.data === "error"){
        console.log("error retrieving or saving");
        this.setState({message: 'Error. Please refresh and try again.'});
      }else{
        console.log("doesn't exist");
        var currentStocks = this.state.stocks;
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
    axios.post('/api/delete' , {name: stock})
    .then((res) => {
      if(res.data === 'NotDeleted'){
        this.setState({message: 'Error. Please refresh and try again.'});
      } else {
        console.log('post to remove item response', res);
        let stockList = this.state.stocks;
        let dataList = this.state.data;
        let remove = (array, stock) => {
          return array.filter((e) => e !==  stock);
        }
        let removeObj = (array, stock) => {
          return array.filter((e) => e.symbol !== stock);
        }
        let updatedStocks = remove(stockList, stock);
        let updatedData = removeObj(dataList, stock)
        this.setState({stocks: updatedStocks, data: updatedData}, console.log("update in delete", this.state));
      }
    })
    .catch((err) => {
      if(err) console.log('error requesting a delete', err);
      this.setState({message: 'Error. Please refresh and try again.'});
    });
  }


   componentDidMount() {
     //Load data from db for setState after Mount
     if(this.state.original === true){
     axios.get('/api/stocks')
      .then((res) => {
        var names = res.data;
        console.log("names array", names);
        this.setState({stocks: names, original: false}, () => console.log("state set stocks in CDM", this.state.stocks));
        return names
      })
      .then((names) => {
        axios.post('/api/data', names)
        .then((info) => {
          //console.log(info.data);
          this.setState({data: info.data}, () => {console.log("state set data in CDM", this.state.data)});
        })
        .catch((err) => console.log('err in post to /api/data', err));
      });
     }
    /* Make sure to add the updated chart here */
    
	}

  render(){
    var list = this.state.data;
    var message = this.state.message;
    console.log("listData in render function", list);
    return(
      <div className="main-body">
      <div className='jumbotron'>
        <div className='chart'>
          {/*<ReactHighstock config={config}></ReactHighstock>*/}
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
                <form  id='input'>
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
            let symbol = item.symbol;
            let companyName = item.companyName;
            return (
              <Stock key={symbol} name={symbol} data={companyName}  onClick={this.deleteEntry.bind(this)}/>
            );
          })}

        </div>
      </div>
    );
  }
}

export default Main;
/* 

Fixed the issue with the array,
issue with the delete func, data is in variables that have to run a function, and I have the setState as the next thing. It console logs
right after the setting that it is the same as it was, then it updates in the render function console. 



Issues to check:
1. does the delay in the delete setState make a difference?
2. Are the correct messages showing, does the function end after?
3. Can I work on speed
4. Clean up CSS - Make look nicer
5. Create Chart - Look at the pasta guys code
6. 

*/