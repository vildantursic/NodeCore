// po.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');
var pg         = require('pg');

var Po         = require('./app/models/po');

//postgres connection string
//examp: postgres://username:password@localhost/database
var conString = "postgres://projop:@77.78.198.112:5432/projop";
//postgres://projop:@77.78.198.112:5432/projop

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
    //res.header("Access-Control-Allow-Origin", "*");
    //res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    console.log('You requested something.');
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'Welcome to Project Open API!' });
});

// more routes for our API will happen here
// on routes that end in /po
// ----------------------------------------------------
router.route('/pos')

    // create a po (accessed at POST http://localhost:8080/api/po)
    .post(function(req, res) {

        var po = new Po();      // create a new instance of the Po model
        po.name = req.body.name;  // set the po name (comes from the request)
        po.email = req.body.email; // set the po email (comes from the request)
        po.status = req.body.status; // set the po status (comes from the request)

        // save the po and check for errors
        po.save(function(err) {
            if (err)
                res.send(err);

            //res.json({ message: 'Po created!' });
            console.log('Po created!');
            res.json(po);
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

            // update the pos info
            po.name = req.body.name;
            po.email = req.body.email;
            po.status = req.body.status;

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


//POSTGRES SQL QUERY
//examp: 'SELECT $1::int AS number'
var myQuery = "select "+
	"r.rel_id as id, "+
	"(select username from users where user_id = r.object_id_two) as username, "+
	"acs_object__name(o.object_id) as task, "+
	"acs_object__get_attribute(o.object_id, 'note') as note, "+
	"acs_object__get_attribute(cast(acs_object__get_attribute(o.object_id, 'parent_id') as integer), 'project_name') as project, "+
	"acs_object__get_attribute(cast(acs_object__get_attribute(o.object_id, 'company_id') as integer), 'company_name') as company, "+
	"cast(o.creation_date as timestamp) as assignment_date, "+
	"cast(acs_object__get_attribute(o.object_id, 'creation_date') as timestamp) as creation_date, "+
	"cast(acs_object__get_attribute(o.object_id, 'start_date') as timestamp) as start_date, "+
	"cast((select end_date from im_projects where project_id = cast(acs_object__get_attribute(o.object_id, 'parent_id') as integer)) as timestamp) as end_date, "+
	"cast((select deadline_date from im_timesheet_tasks where task_id = o.object_id) as timestamp) as deadline_date, "+
	"(select percent_completed from im_projects where project_id = cast(acs_object__get_attribute(o.object_id, 'parent_id') as integer)) as percent_completed, "+
	"(select category from im_categories where category_id = cast(acs_object__get_attribute(o.object_id, 'project_status_id') as integer)) as status "+
"from "+
	"acs_rels r, "+
	"acs_object_types rt, "+
	"acs_objects o, "+
	"acs_object_types ot "+
	"left outer join (select * from im_biz_object_urls where url_type = 'view') otu on otu.object_type = ot.object_type "+
"where "+
	"r.rel_type = rt.object_type and "+
	"o.object_type = ot.object_type and "+
	"r.object_id_one = o.object_id and "+
	"o.object_type = 'im_timesheet_task' and "+
	"r.rel_id > 0 "+
"order by "+
	"r.rel_id asc";

router.route('/pg')
    .get(function(req, res) {
      pg.connect(conString, function(err, client, done) {

        if (err) {
          res.send('error fetching client from pool' + err);
          //return console.error('error fetching client from pool', err);
        }
        client.query(myQuery, function(err, result) {
          done();
          if (err) {
            res.send('error running query' + err);
            //return console.error('error running query', err);
          }
          res.json(result);
          //console.log("connection successfully established! " + result);
        });

      });
    })

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('listening on port: ' + port);
