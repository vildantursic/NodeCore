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

var poProjects = "select * from im_projects";

// ROUTES FOR OUR API
// =============================================================================

/*RESTful API Router*/
var api = router.route('/api/v1/projects');
//middleware api
api.all(function(req,res,next){

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Origin, Origin, X-Requested-With, Content-Type, Accept");

    /*Do stuffs here when a call to api route invoked*/
    console.log(req.method,req.url);
    next();
});

/* CASHING TASKS */
(function cashProjects(){

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
            //res.json(result);
            projopCache.set( "projopProjects", result, function( err, success ) {
                if (!err && success) {
                    console.log(success);
                }
            });
        });

    });

})();

//GET verb
api.get(function(req,res){

    projopCache.get( "projopProjects", function( err, value ){
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

    //Do stuffs here...
    res.send("Post a project ...");
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

