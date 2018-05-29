const express = require('express');
const app = express();
var server = require('http').Server(app);
const io = require('socket.io')(server);
const path = require('path');
const bodyParser = require('body-parser');
const mongodb = require('mongodb').MongoClient;
const mongoose = require('mongoose');
const Stocks = require('./client/src/models/stocks');
const axios = require('axios');
require('dotenv').config();
const cors = require('cors');
//var temp = [];

app.use(cors());

//will serve main page
app.use(express.static(path.join(__dirname, 'client','build')));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//================================
// Mongoose Connection ===========
const uri = 'mongodb://'+process.env.USER_NAME+':'+process.env.PASS+'@'+process.env.HOST+':'+process.env.DB_PORT+'/'+process.env.DB;

mongoose.connect(uri).catch((err) => {console.log(err)});
mongoose.connection.on('connected', function () {  
  console.log('Mongoose is connected');
});

//============================
// Helper Functions ==========

makeUrl = (data) => {
  let temp = '';
  if(typeof data === "string"){
    temp = data;
    let urlOne = `https://ws-api.iextrading.com/1.0/stock/${ temp }/batch?types=quote,chart&range=3m&last=10`;
    return urlOne
    console.log(temp);
  } else {
    for(var i = 0; i < data.length; i++){
      if(i === data.length - 1){
        temp += data[i];
      } else {
        temp += data[i] + ',';
      }
    }
    let url = `https://ws-api.iextrading.com/1.0/stock/market/batch?symbols=${ temp }&types=quote,chart&range=3m&last=10`;
    //console.log("temp", temp);
    //console.log("inside func", url);
    return url;
  }
  }



//===================
// Routes ===========

app.all('*', function(req, res, next) {
   res.header("Access-Control-Allow-Origin", "*");
   next();
});


app.get('/api/stocks', (req, res) => {
  Stocks.find({}, (err, data) => {
    if(err) console.log(err);
    let temp = [];

    //console.log("data", data);
    for(var i = 0; i < data.length; i++){
      temp.push(data[i].name)
    }
    //console.log("response", temp);

    res.send(temp);
  });  
});



app.post('/api/data', (req, res) => {
  let temp = makeUrl(req.body[0]);
  //console.log(temp);
  axios.get(temp)
  .then((data) => {
    let arr = [];
    //console.log("data try", data.data);
    let info = data.data;
    //console.log('info', info);
    for(var i in info){
      let item = {};
      //item[info[i]]
      //item[i] = info[i]
      //console.log('item in loop', item);
      //console.log(info[i]);
      //arr.push(item[i])
      //console.log("inside info", info[i]);
      item[info[i].quote.symbol] = info[i];
      arr.push(item);
    }
    console.log("New Array to hold objects", arr);
    //let items = data.data;
    //console.log(items);
    res.send(arr);
  })
  .catch((err) => console.log(err));

});



app.post('/api/search', (req,res) => {
  //search for name
  let data;
  let temp = req.body.data;
  //console.log("temp", temp);

  Stocks.findOne({name: temp}, (err, info) => {
    if(err){
      data = "error";
      console.log('error inside search for single stock', err);
      res.send(data);
    }else if(info === null){
      //console.log("inside search for single stock if null", info);
      data = info;
      return data;
    } else {
      test = "yes"
      console.log("Yes", info);
      data = 'yes';
      res.send(data);
    }

  }).then((data) => {
    console.log("try", data);
    if(data === null){
      let url = makeUrl(temp);
      //console.log("url", url);
      axios.get(url)
      .then((item) => {
        console.log('item', item.data.quote.symbol);
        
        var newStock = new Stocks();
        newStock.name = temp;
        newStock.save((err) => {
          if(err) {
            console.log("single save error", err);
            res.send("error");
          }
          console.log("saved single");
          
        });

        let newName = item.data.quote.symbol;
       
        let newObj = {};
        newObj[newName] = item.data;
        console.log('new', newObj);
          
        res.send(newObj);
      })
      .catch((err) => {
        console.log(err);
        res.send("fake");
      });
    }
  });

});



app.post('/api/delete', (req, res) => {
  console.log("delete", req.body.name);
  let removeItem = {};
  let name = 'name';
  removeItem[name] = req.body.name;
  console.log(removeItem);
  Stocks.deleteOne(removeItem, (err) => {
    console.log("if err in delete", err);
    if(err){
      console.log("deleting error", err);
      res.send("NotDeleted")
    }
    res.send("deleted");
  });
  
});


// Sockets ===========

/*io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('add', (data) => {
    var item = new stocks();
    stocks.name = data.toLowerCase();
    stocks.save((err, res) => {
      if(err) console.log(err);

    });
  });
  socket.on('delete', (data) => {
    stocks.remove({ name: data }, (err,res) => {
      if(err) console.log(err);
    })
  });
  socket.on('disconnect', () => {
    console.log("Client has left the building");
  })
});*/




const port = process.env.PORT || 5000;
app.listen(port);

console.log(`Server listening on ${port}`);

/* Remeber to change all server addresses to build
  

    
    console.log(urlBase);

app.get('/api/data', (req, res) => {
  var data = [];
  
  //console.log(urlBase);
  axios.get(urlBase)
  .then((data) => {if(err) console.log(err);
    res.send(data);
  })
  .catch((err) => console.log(err));
  
});




//search
  let test;
  Stocks.findOne({name: temp}, (err, res) => {
    if(err) {
      test = "error";
  } else {
       if(res == null){
         test = "no";
       } else {
         test = "yes"
       }
  }
  });
  
  if(test === "no"){
    console.log("no", test);
    res.send("no");
 /*let entry = new Stocks();
 entry.name = temp;
 entry.save(entry, (err) => {
   if(err) console.log("Err saving entry", err);
   console.log("Saved");
 })

} else if(test === "yes"){
  console.log("exists", test);
  res.send('exists');
} else{
  console.log("error", test);
  res.send('error');
}


  /*let temp = makeUrl(req.body.data);
  axios.get(temp)
  .then((data) => {
    console.log('single stock retrieve data', data);
    let item = data.data;
    res.send(item);
  })
  .catch((err) => {
  res.send("error");




  app.post('/api/addstock', (req,res) => {
  //search for name
  var test;
  let temp = req.body.data;
  console.log("temp", temp);

  Stocks.findOne({name: temp}, (err, info) => {
    if(err){
      var test = "error";
      //res.send(test);
    }else if(info == null){
      //test = "no";
      //console.log("no", info);
      //res.send(test);
      
      let url = makeUrl(req.body.data);
      console.log(url);
      return axios.get(url)
      .then((items) => {
        test = items;
        //res.send(items);
      })
      .catch((err) => {
        test = "error2";
        //res.send(err);
      });

    } else {
      test = "yes"
      //console.log("yes", info);
      //res.send(test)
    }
    res.send(test);

  });

});
});*/

