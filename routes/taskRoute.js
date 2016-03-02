var express = require('express');
var router = express.Router();
var pg = require('pg');

if(process.env.DATABASE_URL != undefined) {
  connectionString = process.env.DATABASE_URL + 'ssl';
} else {
  connectionString = 'postgres://localhost:5432/to_do_app';
}


//get data route
router.get('/', function(req, res) {

  var results = [];

  pg.connect(connectionString, function (err, client, done) {
    var query = client.query('SELECT * FROM to_do ORDER BY id DESC;');

    // Stream results back one row at a time
    query.on('row', function (row) {
      results.push(row);
    });

    // close connection
    query.on('end', function () {
      done();
      res.json(results);
    });

    if (err) {
      console.log(err);
    }
  });
});

router.post('/', function(req, res) {
  var results = [];
  console.log('request body::', req.body);
  var addTask = {
    task_name: req.body.task_name
  };
  console.log(req.body.task_name);
  pg.connect(connectionString, function(err, client) {
    var query = client.query('INSERT INTO to_do (task_name) VALUES ($1);',
      [addTask.task_name]);

    query.on('end', function () {
      client.end();
      res.json(results);
    });

    if (err) {
      console.log(err);
    }
  });
  console.log("results of post:: ", results);
});

router.put('/', function(req, res){

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

router.delete('/', function(req, res){

  var deleteID = {id: req.body.id };

  pg.connect(connectionString, function(err, client) {
    client.query('DELETE FROM to_do WHERE id = $1',
      [deleteID.id],
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

module.exports = router;