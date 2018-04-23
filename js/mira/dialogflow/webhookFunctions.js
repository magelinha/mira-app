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

var Init = function(server, source) {
	source = source && source.length ? source : "mira-app";
	server.post('/fastfood', function(req, res){

		var intentName = req.body.queryResult.intent.displayName;
		var params = req.body.queryResult.parameters;
		
		var intentObj = getIntent(intentName);
		if(!intentObj)
		{
			res.json({
				speech: errorText,
				displayText: errorText,
				source: source
			});

			return;
		}

		var speech = intentObj.action(params);
		var jsonResult = Object.assign({}, {source: source}, {speech: speech, displayText: speech });
		res.json(jsonResult);
	});
};

var getIntent = function(intentName){
	if(!intentName || !intentName.length)
		return null;

	intents.find(function(element){
		return element.intent == intentName
	});
};

module.exports = {
	AddIntentAction,
    Init
};