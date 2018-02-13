'use strict'
 
const Hapi = require('hapi');
const Request = require('request');
const Vision = require('vision');
const Handlebars = require('handlebars');
const LodashFilter = require('lodash.filter');
const LodashTake = require('lodash.take');
 
const server = new Hapi.Server();
 
server.connection({
    host: '127.0.0.1',
    port: 3000
});
 
// Register vision for our views
server.register(Vision, (err) => {
    server.views({
        engines: {
            html: Handlebars
        },
        relativeTo: __dirname,
        path: './views',
    });
});
 
server.start((err) => {
    if (err) {
        throw err;
    }
 
    console.log(`Server running at: ${server.info.uri}`);
});

Handlebars.registerHelper('json', function(context) {
    return JSON.stringify(context);
});

server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
        Request.get('https://api.randomuser.me/', function (error, response, body) {
            if (error) {
                throw error;
            }
 
            const data = JSON.parse(body);
            console.log("user" + JSON.stringify(data.results[0]));
            reply.view('index', { result: data.results[0] });
        });
    }
});