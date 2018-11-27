"use strict";

var _ = require('underscore');
var backbone = require('backbone');
var express = require('express');
var path = require('path');
var morgan = require('morgan');
var request = require('request');
var optimist = require('optimist');
var fs = require('fs');
var cache = require('memory-cache');
var rdfstore = require('rdfstore');
var bodyParser = require('body-parser');

var Rule = require('./models/rule.js');
var Selection = require('./models/selection.js');


// start do servidor
var server = express();

// para exibir o log
server.use(morgan());

server.use(bodyParser.json({limit: '50mb', strict: false}));
server.use(
    bodyParser.urlencoded({
        limit: '50mb',
        extended: false
    })
);

// Imports the Google Cloud client library.
const { Storage } = require('@google-cloud/storage');

// Instantiates a client. Explicitly use service account credentials by
// specifying the private key file. All clients in google-cloud-node have this
// helper, see https://github.com/GoogleCloudPlatform/google-cloud-node/blob/master/docs/authentication.md
const storage = new Storage({
    projectId: 'booking-cf175',
    keyFilename: './js/mira/dialogflow/keys/fastfood.json'
});

// Makes an authenticated API request.

storage
  .getBuckets()
  .then((results) => {
    const buckets = results[0];

    console.log('Buckets:');
    buckets.forEach((bucket) => {
      console.log(bucket.name);
    });
  })
  .catch((err) => {
    console.error('ERROR:', err);
  });


// criando servidor para arquivos estaticos
server.use(express.static(path.normalize(__dirname + '/../..'),  { maxAge: 60 * 60 * 1000 }));

var dialogFlowFunctions = require('./dialogflow/dialogFlowFunctions.js');
dialogFlowFunctions.Init(server);

var preparer_mira_app = function(app){

    var MiraApp = require(app);
    MiraApp.ajaxSetup = MiraApp.ajaxSetup || {};
    MiraApp.ajaxSetup.headers = MiraApp.ajaxSetup.headers || {};
    MiraApp.ajaxSetup.headers['User-Agent'] = MiraApp.ajaxSetup.headers['User-Agent'] ||
        "Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2062.3 Safari/537.36";

    MiraApp.ajaxSetup.headers['Access-Control-Allow-Origin'] = "*";
    MiraApp.ajaxSetup.headers['Access-Control-Allow-Methods'] =  'GET,PUT,POST,DELETE,OPTIONS';
    MiraApp.ajaxSetup.headers['Access-Control-Allow-Headers'] =  'Content-Type, Authorization, Content-Length, X-Requested-With';

    return MiraApp;
};

var cache_key = function(app, req){
    return app + '#' + req.originalUrl;
};

var make_request = function(MiraApp, req, callback){

    /*

     var abstract_select = null;
     selection.each(function(select){
     if(select.get('when')){
     var rule = rules.get(select.get('when'));
     if(rule.evaluate(body, req, {}, {})){
     abstract_select = select.get('abstract');
     }
     }
     });

     if (!error && response.statusCode == 200) {
     res.send({}abstract_select);
     }
     */
};

server.route('/server.js').all(function(req, res, next){

    var app = '../index.js';
    if(req.query.app){
      app = '../' + req.query.app + '.js';
    }

    var MiraApp = preparer_mira_app(app);
    var rules = new Rule.Collection(MiraApp.rules, {parse:true});
    var selection = new Selection.Collection(MiraApp.selection, {parse:true});

    var extra = _.omit(req.query, 'url', 'data', 'type', 'app');

    var options = _.extend({
            json: true
        }, _.pick(req.query, 'data', 'type'),
        extra,
        MiraApp.ajaxSetup);
    var cache_k = cache_key(app, req);
    var body = cache.get(cache_k);
    if(!body) {

        var rst = request(req.query.url, options, function (error, response, body) {


            if (req.query.select) {

                new rdfstore.Store(function (err, store) {
                    store.load("application/ld+json", body, function (err, results) {
                        store.execute(req.query.select, function (err, graph) {
                            cache.put(cache_k, graph, 60000); // 60 segundos
                            res.send(graph)
                        });
                    });
                });
            }
            else {
                cache.put(cache_k, body, 60000); // 60 segundos
                res.send(body);
            }
        })
    } else {
        res.send(body);
    }
});

server.get('/api/:folder', function (req, res, next) {
    var folder = req.params.folder;
    var file_path = path.normalize(__dirname + '/../..') + '/data/' + folder + '/list.json';
    var file;
    fs.readFile(file_path, 'utf8', function (err, data) {
        if (err) throw err;
        file = JSON.parse(data);
        res.json(file);
    });
});


server.get('/api/:folder/:id', function (req, res, next) {
    var folder = req.params.folder;
    var id = req.params.id;

    var file_path = isInt(id) ? 
                    path.normalize(__dirname + '/../..') + '/data/' + folder + '/' + id + '.json' :
                    path.normalize(__dirname + '/../..') + '/data/' + folder + '/' + id + '/' + 'list.json';

    var file;
    fs.readFile(file_path, 'utf8', function (err, data) {
        if (err) throw err;
        file = JSON.parse(data);
        res.json(file);
    });
});

//implementador por joão victor
server.get('/api/:folder/:subfolder/:id', function (req, res, next) {
    var folder = req.params.folder;
    var subfolder = req.params.subfolder;
    var id = req.params.id;
    var file_path = path.normalize(__dirname + '/../..') + '/data/' + folder + '/' + subfolder + '/' + id + '.json';

    var file;
    fs.readFile(file_path, 'utf8', function (err, data) {
        if (err) throw err;
        file = JSON.parse(data);
        res.json(file);
    });
});


var isInt = function(value) {
  var x = parseFloat(value);
  return !isNaN(value) && (x | 0) === x;
};

server.get('/docs', function(req, res, next){
   res.redirect('http://mestrado.amazingworks.com.br/documentacao/'); 
});


var http = require('http');
var httpServer = http.createServer(server);

/*Editado por Magela*/
httpServer.listen(process.env.PORT || 3000, function(){
    console.log("Server ativo na porta: " + (process.env.PORT));
}); //porta usada pelo Heroku

/*
httpServer.listen(3000);

try {
    var https = require('https');
    var privateKey  = fs.readFileSync(path.normalize(__dirname + '/../..') + '/server.key', 'utf8');
    var certificate = fs.readFileSync(path.normalize(__dirname + '/../..') + '/server.crt', 'utf8');
    var credentials = {key: privateKey, cert: certificate};
    var httpsServer = https.createServer(credentials, server);
    httpsServer.listen(443);
} catch (e){
    console.log('erro ao abrir arquivos para https');
}*/
