/**
 * Created by Vildan on 8/15/2015.
 */

var express = require('express');
var router = express.Router();
var pg         = require('pg');
var ncache     = require( "node-cache" );

//postgres connection string
var conString = "postgres://projop:@77.78.198.112:45432/projop";

var projopCache = new ncache();

var poUsers = "select * from acs_users_all order by first_names asc";
var poUsersPost = "INSERT INTO users (user_id, username) VALUES ($1, $2)";
var poUsersPut = "UPDATE users SET username='Testing Update' WHERE user_id='12345678'";
var poUsersDelete = "DELETE FROM users WHERE user_id='12345678' AND username='Testing Update'";

router.get('/',function(req,res){

    res.send("Welcome to Project Open API");
});

// ROUTES FOR OUR API
// =============================================================================

/*RESTful API Router*/
var api = router.route('/api/v1/users');
//middleware api
api.all(function(req,res,next){

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Origin, Origin, X-Requested-With, Content-Type, Accept");

    /*Do stuffs here when a call to api route invoked*/
    console.log(req.method,req.url);
    next();
});

/* CASHING TASKS */
(function cashUsers(){

    pg.connect(conString, function(err, client, done) {

        if (err) {
            res.send('error fetching client from pool' + err);
            //return console.error('error fetching client from pool', err);
        }
        client.query(poUsers, function(err, result) {
            done();
            if (err) {
                res.send('error running query' + err);
                //return console.error('error running query', err);
            }
            //res.json(result);
            projopCache.set( "projopUsers", result, function( err, success ) {
                if (!err && success) {
                    console.log(success);
                }
            });
        });

    });

})();


//GET verb
api.get(function(req,res){

    projopCache.get( "projopUsers", function( err, value ){
        if( !err ){
            if(value == undefined){
                // key not found
            }else{
                res.json( value );
            }
        }
    });

});
//POST verb
api.post(function(req,res){

    //console.log(req);

    pg.connect(conString, function(err, client, done) {

        if (err) {
            res.send('error fetching client from pool' + err);
            //return console.error('error fetching client from pool', err);
        }
        client.query(poUsersPost, [req.body.user_id, req.body.username],function(err, result) {
            done();
            if (err) {
                res.send('error running query' + err);
                //return console.error('error running query', err);
            }
            res.json("User created");

        });

    });
});
//PUT verb
api.put(function(req,res){
    pg.connect(conString, function(err, client, done) {

        if (err) {
            res.send('error fetching client from pool' + err);
            //return console.error('error fetching client from pool', err);
        }
        client.query(poUsersPut, function(err, result) {
            done();
            if (err) {
                res.send('error running query' + err);
                //return console.error('error running query', err);
            }
            res.json("User updated");

        });

    });
});
//DELETE verb
api.delete(function(req,res){

    pg.connect(conString, function(err, client, done) {

        if (err) {
            res.send('error fetching client from pool' + err);
            //return console.error('error fetching client from pool', err);
        }
        client.query(poUsersDelete, function(err, result) {
            done();
            if (err) {
                res.send('error running query' + err);
                //return console.error('error running query', err);
            }
            res.json("User deleted");

        });

    });
});
//this line is the Master
module.exports.router = router;

/*
 var router = express.Router();              // get an instance of the express Router

 // middleware to use for all requests
 router.use(function(req, res, next) {

 res.header("Access-Control-Allow-Origin", "*");
 res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Origin, Origin, X-Requested-With, Content-Type, Accept");

 console.log('You requested data from Project Open.');
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
 var poTasks = "select "+
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

 var poUsers = "select * from users order by username asc";

 var poProjects = "select * from im_projects";


 router.route('/pg/projects')
 .get(function(req, res) {
 pg.connect(conString, function(err, client, done) {

 if (err) {
 res.send('error fetching client from pool' + err);
 //return console.error('error fetching client from pool', err);
 }
 client.query(poProjects, function(err, result) {
 done();
 if (err) {
 res.send('error running query' + err);
 //return console.error('error running query', err);
 }
 res.json(result);
 //console.log("connection successfully established! " + result);
 });

 });
 });


 router.route('/pg/tasks')
 .get(function(req, res) {
 pg.connect(conString, function(err, client, done) {

 if (err) {
 res.send('error fetching client from pool' + err);
 //return console.error('error fetching client from pool', err);
 }
 client.query(poTasks, function(err, result) {
 done();
 if (err) {
 res.send('error running query' + err);
 //return console.error('error running query', err);
 }
 res.json(result);
 //console.log("connection successfully established! " + result);
 //cashing test
 projopCache.set( "projopKey", result, function( err, success ){
 if( !err && success ){
 //console.log( success );
 // true
 // ... do something ...
 //res.json(success);
 }
 });


 });

 });
 });


  TESTING CASHING

router.route('/pg/cashed')
    .get(function(req, res) {
        projopCache.get( "projopKey", function( err, value ){
            if( !err ){
                if(value == undefined){
                    // key not found
                }else{
                    res.json( value );
                    //{ my: "Special", variable: 42 }
                    // ... do something ...
                }
            }
        });
    });

///////////////////////////////

router.route('/pg/users')
    .get(function(req, res) {
        pg.connect(conString, function(err, client, done) {

            if (err) {
                res.send('error fetching client from pool' + err);
                //return console.error('error fetching client from pool', err);
            }
            client.query(poUsers, function(err, result) {
                done();
                if (err) {
                    res.send('error running query' + err);
                    //return console.error('error running query', err);
                }
                res.json(result);
                //console.log("connection successfully established! " + result);
            });

        });
    });
 */