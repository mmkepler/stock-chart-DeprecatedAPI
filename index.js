const express = require('express');
const path = require('path');
const mongodb = require('mongodb').MongoClient;
const mongoose = require('mongoose');
const axios = require('axios');
var cors = require('cors')
const app = express();
app.use(cors());

app.use();

app.use(express.static(path.join(__dirname, 'client/build')));

//Mongoose Connection
const uri = 'mongodb://'+process.env.USER_NAME+':'+process.env.PASS+'@'+process.env.HOST+':'+process.env.DB_PORT+'/'+process.env.DB;

mongoose.connect(uri).catch((err) => {console.log(err)});
mongoose.connection.on('connected', function () {  
  console.log('Mongoose is connected');
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
  console.log('AHHHH');
});


const port = process.env.PORT || 5000;
app.listen(port);

console.log(`Server listening on ${port}`);