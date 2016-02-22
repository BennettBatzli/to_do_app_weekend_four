var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');


var remove = require('./routes/remove');
var complete = require('./routes/complete')
//********** figure this out


var pg = require('pg');
var connectionString = '';


//the env thing is required for heroku
if(process.env.DATABASE_URL != undefined) {
  connectionString = process.env.DATABASE_URL + 'ssl';
} else {
  connectionString = 'postgres://localhost:5432/to_do_app';
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));



app.use('/remove', remove);
app.use('/complete', complete);
//********** figure this out

var results = [];
 //get data route
app.get('/to_do', function(req, res) {
  //var results = [];

  pg.connect(connectionString, function (err, client, done) {
    var query = client.query('SELECT * FROM to_do ORDER BY id DESC;');
    console.log('queries are fun' + query);

    // Stream results back one row at a time
    query.on('row', function (row) {
      results.push(row);
    });

    // close connection
    query.on('end', function () {
      client.end();
      return res.json(results);
    });

    if (err) {
      console.log(err);
    }
  });
  console.log("these are" +results);
});

app.post('/to_do', function(req, res) {
  var addTask = {
    task_name: req.body.task_name
  };
console.log(req.body.task_name);
  pg.connect(connectionString, function(err, client) {
    var query = client.query('INSERT INTO to_do (task_name) VALUES ($1) RETURNING *;',
      [addTask.task_name]);

    query.on('end', function () {
      client.end();
      return res.json(results);
    });

    if (err) {
      console.log(err);
    }
  });
});

// Catch all for static files:
//app.get('/*', function(req, res) {
//  var file = req.params[0] || '/views/index.html';
//  res.sendFile(path.join(__dirname, './public', file));
//});
// another way:
app.use(express.static('public'));
app.use(express.static('public/views'));
app.use(express.static('public/scripts'));
app.use(express.static('public/styles'));
app.use(express.static('public/vendors'));



app.set('port', process.env.PORT || 5000);
app.listen(app.get('port'), function() {
  console.log('Listening on port: ', app.get('port'));
});