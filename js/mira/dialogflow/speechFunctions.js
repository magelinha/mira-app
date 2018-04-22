'use strict';

// Imports the Google Cloud client library
const speech = require('@google-cloud/speech');
var dialogFlowFunctions = require('./dialogFlowFunctions.js');

function requestData(params){
	
	const client = new speech.SpeechClient({
	  projectId: params.projectId,
	});
	const audio = { content: params.audio };

	const config =  { 
		//sampleRateHertz: params.rate,
		encoding: params.encoding ? params.encoding : 'LINEAR16',
		languageCode: params.language,
	};

	const request = {
	  audio: audio,
	  config: config,
	};

	// Detects speech in the audio file
	return client
	  .recognize(request)
	  .then(data => {
	  	const response = data[0];
	    const transcription = response
	    	.results
	    	.map(result => result.alternatives[0].transcript);

	    var result = {
	    	text: transcription[0],
	    	projectId: params.projectId,
	    	lang: params.language
	    };

	    return result;
	  })
	  .catch(err => {
	  	console.error('ERROR:', err);
	  	return err;
	  });
}

function Init(server){
	server.post("/stt", function(req, res) {
        
        let promise;
        promise = requestData(req.body);

    	promise
    		//Executa a requisição através de texto
    		.then(dialogFlowFunctions.RequestTextIntent)
    		
    		//Retorna o resultado da requisição com o dialogFlow
    		.then(data => {
    			var result = Object.assign({},{success: true}, data);
    			res.json(result);
    		})
    		.catch(error => {
    			var result = Object.assign({},{success: false}, error);
    			console.log('deu erro');
    			res.json(result);
    		});
    });

    dialogFlowFunctions.Init(server);
}

module.exports = { Init };