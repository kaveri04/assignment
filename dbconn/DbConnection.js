
'use strict';

var mongoose                    = require('mongoose');
var Mongo_options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  autoIndex: false,
  reconnectTries: Number.MAX_VALUE, 
  reconnectInterval: 500, 
  poolSize: 5,
  bufferMaxEntries: 0,
  connectTimeoutMS: 12000,
  socketTimeoutMS: 12000,
  family: 4
};
var uri = 'mongodb://localhost/address';
exports.StartConnection = () => {
    mongoose.connect(uri, Mongo_options)
    .then(() =>  console.log('connection succesful'))
    .catch((err) => console.error(err));
}
exports.DB = mongoose.connection;





