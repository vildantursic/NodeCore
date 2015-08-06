// po.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');

var Po     = require('./app/models/po');

mongoose.connect('mongodb://vildantursic:sunce100@ds034198.mongolab.com:34198/po'); // connect to our database

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

// more routes for our API will happen here
// on routes that end in /po
// ----------------------------------------------------
router.route('/pos')

    // create a po (accessed at POST http://localhost:8080/api/po)
    .post(function(req, res) {
        
        var po = new Po();      // create a new instance of the Po model
        po.name = req.body.name;  // set the po name (comes from the request)

        // save the po and check for errors
        po.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Po created!' });
        });
        
    })
    // get all the po (accessed at GET http://localhost:8080/api/po)
    .get(function(req, res) {
        Po.find(function(err, po) {
            if (err)
                res.send(err);

            res.json(po);
        });
    });

// on routes that end in /pos/:po_id
// ----------------------------------------------------

router.route('/pos/:po_id')

    // get the po with that id (accessed at GET http://localhost:8080/api/pos/:po_id)
    .get(function(req, res) {
        Po.findById(req.params.po_id, function(err, po) {
            if (err)
                res.send(err);
            res.json(po);
        });
    })
    // update the po with this id (accessed at PUT http://localhost:8080/api/pos/:po_id)
    .put(function(req, res) {

        // use our po model to find the po we want
        Po.findById(req.params.po_id, function(err, po) {

            if (err)
                res.send(err);

            po.name = req.body.name;  // update the pos info

            // save the po
            po.save(function(err) {
                if (err)
                    res.send(err);

                res.json({ message: 'Po updated!' });
            });

        });
    })
     // delete the po with this id (accessed at DELETE http://localhost:8080/api/pos/:bear_id)
    .delete(function(req, res) {
        Po.remove({
            _id: req.params.po_id
        }, function(err, po) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
    });


// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);