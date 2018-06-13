const stockList = require('../client/src/models/stocks');
const mongoose = require('mongoose');
const axios = require('axios');

module.exports = (app) => {
 //Routes

  //Function takes a string or array and returns a url to retrieve the data from single or multiple stocks
  makeUrl = (data) => {
    let temp = '';
    if(typeof data === "string"){
      temp = data;
      let urlOne = `https://ws-api.iextrading.com/1.0/stock/${ temp }/batch?types=quote,chart&range=1y`;
      return urlOne
      //console.log(temp);
    } else {
      for(let i = 0; i < data.length; i++){
        if(i === data.length - 1){
          temp += data[i];
        } else {
          temp += data[i] + ',';
        }
      }
      let url = `https://ws-api.iextrading.com/1.0/stock/market/batch?symbols=${ temp }&types=quote,chart&range=1y`;
      return url;
    }
  }

  //This retrieves the stocks being held in the database and sends them to the client
  app.get('/api/stocks', (req, res) => {
    //turns mongoose query into a promise
    let query = stockList.find({});
    let promise = query.exec();
    promise.then((response) => {
      let urlArr = [];
      let tempUrl;
      for(let i = 0; i < response.length; i++) {
        urlArr.push(response[i].name);
      }
      tempUrl = makeUrl(urlArr);
      return tempUrl;
    })
    .then((url) => {
      axios.get(url)
      .then((data) => {
        res.send(data.data);
      })
      .catch((err) => console.log('Error retrieving data', err))
    })
    .catch((err) => console.log("Error searching for data", err));
  });

  //This searches for the stock in the database, if it is unique it retrieves the value data and sends it to the client
  app.post('/api/search', (req, res) => {
    let newStock = req.body.name;
    let count = req.body.count;
    //turns mongoose query into a promise
    let query = stockList.findOne({name: newStock});
    let promise = query.exec();
    promise.then((info) => {
     let data;
     if(info === null) {
        data = info;
        return data
      } else {
        data = 'yes';
        res.send(data);
      }
    })
    .then((data) => {
      if(data === null) {
        let url = makeUrl(newStock);
        axios.get(url)
        .then((response) => {
          let name = response.data.quote.symbol;
          let companyName = response.data.quote.companyName;
          let newStock = new stockList();
          newStock.name = name;
          newStock.companyName = companyName;
          newStock.save((err) => {
            if(err) {
              console.log('Error saving new stock', err);
              res.send("error")
            } else {
              res.send(response.data);
            }
          });
        })
        .catch((err) => {
          console.log("Error retrieving search stock", err);
          res.send("fake");
        });
      }
    })
    .catch((err) => {
      console.log("Error", err);
      res.send('error');
    })
  });

  //This removes a stock from the database
  app.post('/api/delete', (req, res) => {
    let toDelete = req.body.name;
    stockList.deleteOne({name: toDelete}, (err) => {
      if(err) {
        console.log("Error Deleting Stock");
        res.send('NotDeleted');
      }
      console.log("deleted");
      res.send('deleted');
    });
  });
}
