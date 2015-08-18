/**
 * Created by Vildan on 8/16/2015.
 */

var express = require('express');
var router = express.Router();
var pg         = require('pg');

//postgres connection string
var conString = "postgres://projop:@77.78.198.112:45432/projop";

var poTest = "select im_project__name(37261)";
var poTestPost = "select im_project__new(87654321, 'project', current_date, 41187, 123, 1, TestingME, '2015_1238', '2015_1238', 39917, 8720, 99, 76)";


// ROUTES FOR OUR API
// =============================================================================

/*RESTful API Router*/
var api = router.route('/api/v1/test');
//middleware api
api.all(function(req,res,next){

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Origin, Origin, X-Requested-With, Content-Type, Accept");

    /*Do stuffs here when a call to api route invoked*/
    console.log(req.method,req.url);
    next();
});

//GET verb
api.get(function(req,res){

    pg.connect(conString, function(err, client, done) {

        if (err) {
            res.send('error fetching client from pool' + err);
            //return console.error('error fetching client from pool', err);
        }
        client.query(poTest, function(err, result) {
            done();
            if (err) {
                res.send('error running query' + err);
                //return console.error('error running query', err);
            }
            res.json(result);
        });

    });

});
//POST verb
api.post(function(req,res){

    pg.connect(conString, function(err, client, done) {

        if (err) {
            res.send('error fetching client from pool' + err);
            //return console.error('error fetching client from pool', err);
        }
        client.query(poTestPost, function(err, result) {
            done();
            if (err) {
                res.send('error running query' + err);
                //return console.error('error running query', err);
            }
            res.json("Project Created");
        });

    });

});
//PUT verb
api.put(function(req,res){
    //Do stuffs here...
    res.send("Edit / modify a project ...");
});
//DELETE verb
api.delete(function(req,res){

    //Do stuffs here...
    res.send("Delete a project ...");
});
//this line is the Master
module.exports.router = router;

