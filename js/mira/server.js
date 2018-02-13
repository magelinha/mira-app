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

var Rule = require('./models/rule.js');
var Selection = require('./models/selection.js');

// start do servidor
var server = express();

// para exibir o log
server.use(morgan());
// criando servidor para arquivos estaticos
server.use(express.static(path.normalize(__dirname + '/../..'),  { maxAge: 60 * 60 * 1000 }));

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
    console.log(req.query);
    var folder = req.params.folder;
    var subfolder = req.params.subfolder;
    var id = req.params.id;
    var file_path = path.normalize(__dirname + '/../..') + '/data/' + folder + '/' + subfolder + '/' + id + '.json';

    console.log(file_path);
    var file;
    fs.readFile(file_path, 'utf8', function (err, data) {
        if (err) throw err;
        file = JSON.parse(data);
        res.json(file);
    });
});

server.get('/fastfood/gerarPedido', function(req, res, next){
    var numeroPedido = {
        numero: Math.floor(Math.random() * (100 - 11 + 1)) + 11 
    };

    res.json(numeroPedido);
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

/************************* Funções para o dialogflow ****************************/

const dialogflow = require('dialogflow');

/*
    Detecta uma intenção através de um streaming de áudio.
    Params:
    @projectId: Id do projeto no dialogFlow [Requered]
    @sessionId: Sessão gerada pelo criação das queries [Optional] [Default: new uuid()]
    @filename: Path do arquivo onde será salvo o speech recognition [Optional] [Default: '/audios/recognition.wav']
    @encoding: Tipo de codificação do áudio [Optional] [Default: 'AUDIO_ENCODING_LINEAR16']
    @sampleRateHertz: Frequência do áudio [Optional][Default: 160000]

*/
function streamingDetectIntent(projectId, sessionId, filename, encoding, sampleRateHertz, languageCode) {
  
  // [START dialogflow_detect_intent_streaming]
  // Imports the Dialogflow library
  const dialogflow = require('dialogflow');

  // Instantiates a sessison client
  const sessionClient = new dialogflow.SessionsClient();

  // The path to the local file on which to perform speech recognition, e.g.
  // /path/to/audio.raw const filename = '/path/to/audio.raw';

  // The encoding of the audio file, e.g. 'AUDIO_ENCODING_LINEAR16'
  // const encoding = 'AUDIO_ENCODING_LINEAR16';

  // The sample rate of the audio file in hertz, e.g. 16000
  // const sampleRateHertz = 16000;

  // The BCP-47 language code to use, e.g. 'en-US'
  // const languageCode = 'en-US';
  let sessionPath = sessionClient.sessionPath(projectId, sessionId);

  const initialStreamRequest = {
    session: sessionPath,
    queryParams: {
      session: sessionClient.sessionPath(projectId, sessionId),
    },
    queryInput: {
      audioConfig: {
        audioEncoding: encoding,
        sampleRateHertz: sampleRateHertz,
        languageCode: languageCode,
      },
      singleUtterance: true,
    },
  };

  // Create a stream for the streaming request.
  const detectStream = sessionClient
    .streamingDetectIntent()
    .on('error', console.error)
    .on('data', data => {
      if (data.recognitionResult) {
        console.log(
          `Intermediate transcript: ${data.recognitionResult.transcript}`
        );
      } else {
        console.log(`Detected intent:`);
        logQueryResult(sessionClient, data.queryResult);
      }
    });

  // Write the initial stream request to config for audio input.
  detectStream.write(initialStreamRequest);

  // Stream an audio file from disk to the Conversation API, e.g.
  // "./resources/audio.raw"
  pump(
    fs.createReadStream(filename),
    // Format the audio stream into the request format.
    through2.obj((obj, _, next) => {
      next(null, {inputAudio: obj});
    }),
    detectStream
  );
  // [END dialogflow_detect_intent_streaming]
}

