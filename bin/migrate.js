'use strict'

const path = require('path');

// import our app for one time usage
const server = require(path.resolve(__dirname, '../server/server.js'));

// reference to our datasource that we named 'postgres'
const postgres = server.dataSources.postgres;

// Run through and create all of them
postgres.automigrate(function (err) {  
  if (err) {
    throw err;
  }
  postgres.disconnect();
  process.exit(0);
});