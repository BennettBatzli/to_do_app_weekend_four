var express = require('express');
var complete = express.Router();
var path = require('path');
var bodyParser = require('body-parser');
var pg = require('pg');

var connectionString = '';
if(process.env.DATABASE_URL != undefined) {
  connectionString = process.env.DATABASE_URL + 'ssl';
} else {
  connectionString = 'postgres://localhost:5432/to_do_app';
}

complete.use(bodyParser.json());
complete.use(bodyParser.urlencoded({extended: true}));



complete.put('/', function(req, res){

  var completeID = {
    id: req.body.id,
    complete: true
  };

  pg.connect(connectionString, function(err, client) {
    client.query('UPDATE to_do SET complete = $1 WHERE id = $2',
      [completeID.complete, completeID.id],
      function (err, result) {
        if(err) {
          console.log("Error inserting data: ", err);
          res.send(false);
        } else {
          res.send(result);
        }
      });
  });

});




module.exports = complete;
