"use strict";

/*
	Em intents ficará armazenada as ação a ser executada no webhook para cada intenção.
	O objeto guardado será no formato
	{
		intent: string
		action: function(params)
	}

	action deve retornar uma string 
*/
var intents = [];
const errorText = "Erro ao processar intenção no webhook. Verifique se foi implementada a operação para a intenção desejada.";

var AddIntentAction = function (intent, action) {
	var obj = { intent: intent, action: action };
	intents.push(obj);
};

var BaseURL = '';

var Init = function(server, source) {
	source = source || "mira-app";
	server.post('/fastfood', function(req, res){
		BaseURL = req.hostname;

		var intentName = req.body.queryResult.intent.displayName;
		var params = req.body.queryResult.parameters;
		var currentText = req.body.queryResult.fulfillmentText;
		
		var intentObj = getIntent(intentName);
		var result = {};

		if(!intentObj)
		{
			result = {
				fulfillmentText: errorText
			};
		}
		else {
			var speech = intentObj.action(params);
			if(!speech || !speech.length)
				speech = currentText;
				
			result = {
				fulfillmentText: speech
			};
		}

		return res.json(result);
	});
};

var getIntent = function(intentName){
	if(!intentName || !intentName.length)
		return null;

	return intents.find(function(element){
		return element.intent == intentName
	});
};

module.exports = {
	AddIntentAction,
	Init,
	BaseURL
};