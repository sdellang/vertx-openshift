/*
This verticle contains the configuration for our application and co-ordinates
start-up of the verticles that make up the application.
 */

var vertx = require('vertx/container');

var console = require('vertx/console');
// Our application config - you can maintain it here or alternatively you could
// stick it in a conf.json text file and specify that on the command line when
// starting this verticle

// Configuration for the web server
var webServerConf = {

  // Normal web server stuff

  port: parseInt(vertx.env['OPENSHIFT_DIY_PORT']),
  host: vertx.env['OPENSHIFT_DIY_IP'],
  ssl: false, // OpenShift handles SSL for us

  // Configuration for the event bus client side bridge
  // This bridges messages from the client side to the server side event bus
  bridge: true,

  // This defines which messages from the client we will let through
  // to the server side
  inbound_permitted: [
    // Allow calls to login and authorise
    {
      address: 'vertx.basicauthmanager.login'
    },
    // Allow calls to get static album data from the persistor
    {
      address : 'vertx.mongopersistor',
      match : {
        action : 'find',
        collection : 'albums'
      }
    },
    // And to place orders
    {
      address : 'vertx.mongopersistor',
      requires_auth : true,  // User must be logged in to send let these through
      match : {
        action : 'save',
        collection : 'orders'
      }
    }
  ],

  // This defines which messages from the server we will let through to the client
  outbound_permitted: [
    {}
  ]
};

// Now we deploy the modules that we need

// Deploy a MongoDB persistor module

var mongoConf = {
  host: vertx.env['OPENSHIFT_MONGODB_DB_HOST'],
  port: parseInt(vertx.env['OPENSHIFT_MONGODB_DB_PORT']),
  username: vertx.env['OPENSHIFT_MONGODB_DB_USERNAME'],
  password: vertx.env['OPENSHIFT_MONGODB_DB_PASSWORD'],
  db_name: vertx.env['OPENSHIFT_APP_NAME']
}

vertx.deployModule('io.vertx~mod-mongo-persistor~2.0.0-final', function(err, deployID) {

  // And when it's deployed run a script to load it with some reference
  // data for the demo
  if (!err) {
    load('static_data.js');
  } else {
    err.printStackTrace();
  }
});

vertx.deployModule('io.vertx~mod-auth-mgr~2.0.0-final');

// Start the web server, with the config we defined above

vertx.deployModule('io.vertx~mod-web-server~2.0.0-final', webServerConf);
