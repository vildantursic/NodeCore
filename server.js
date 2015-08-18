// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');

var usrSchema  = require('./app/models/user');

/* Routes */
var users = require('./app/routes/users').router;
var tasks = require('./app/routes/tasks').router;
var projects = require('./app/routes/projects').router;

var test = require('./app/routes/test').router;

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/', users);
app.use('/', tasks);
app.use('/', projects);

app.use('/', test);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('listening on port: ' + port);
