const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const mongodb = require('mongodb').MongoClient;
const mongoose = require('mongoose');
const axios = require('axios');
require('dotenv').config();
const cors = require('cors');

app.use(cors());

//will serve main page, change after build
app.use(express.static(path.join(__dirname, 'client','build')));

//app.get('/', (req, res) => {
  //res.sendFile(path.join(__dirname + 'client' + 'build'));
//});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

require('./config/routes')(app);


//================================
// Mongoose Connection ===========
const uri = 'mongodb://'+process.env.USER_NAME+':'+process.env.PASS+'@'+process.env.HOST+':'+process.env.DB_PORT+'/'+process.env.DB;

mongoose.connect(uri).catch((err) => {console.log(err)});
mongoose.connection.on('connected', function () {  
  console.log('Mongoose is connected');
});

const port = process.env.PORT || 5002;

app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});




/* Remeber to change all server addresses to build*/
  

   