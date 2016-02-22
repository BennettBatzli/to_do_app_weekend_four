var express = require('express');
var router = express.Router();
var path = require('path');
var bodyParser = require('body-parser');
var pg = require('pg');

var connectionString = '';



if(process.env.DATABASE_URL != undefined) {
  connectionString = process.env.DATABASE_URL + 'ssl';
} else {
  connectionString = 'postgres://localhost:5432/to_do_app';
}

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));


router.post('/', function(req, res){

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
