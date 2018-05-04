"use strict";

var webhookFunctions = require('./webhookFunctions');

const bebidas = 
[
	{
		"id": 4,
		"nome": "Refrigerante",
		"preco": 2.5
	},
	{
		"id": 5,
		"nome": "Suco Natural",
		"preco": 4
	},
	{
		"id": 6,
		"nome": "Guaraná Natural",
		"preco": 2
	},
	{
		"id": 7,
		"nome": "Vitamina",
		"preco": 7
	},
	{
		"id": 8,
		"nome": "Milk Shake",
		"preco": 10
	}
];

const sanduices = 
[
	{
		"id": 1,
		"nome": "Hambúrguer",
		"preco": 5
	},
	{
		"id": 2,
		"nome": "Misto Quente",
		"preco": 3.5	
	},
	{
		"id": 3,
		"nome": "Cachorro Quente",
		"preco": 2.75
	}
];

const combos = 
[
	{
		"id": 9,
		"nome": "Primavera (1 Hambúrguer + 1 Milk Shake)",
		"preco": 11
	},
	{
		"id": 10,
		"nome": "Verão (2 Mistos Quentes + 1 Suco Natural)",
		"preco": 7.5
	},
	{
		"id": 11,
		"nome": "Outono (1 Hambúrguer + 1 Cachorro Quente + 2 Refrigerantes)",
		"preco": 12.5
	},
	{
		"id": 12,
		"nome": "Inverno (2 Hambúrgueres + 2 Refrigerantes)",
		"preco": 10
	}
];

var formatPrice = function(param){
	var value = parseFloat(param);

    var intPart = Math.trunc(value);
    var decimalPart = value % 1;
    decimalPart = decimalPart.toFixed(2);
    decimalPart = decimalPart > 0 ? Number(String(decimalPart).split('.')[1]) : 0;
    
    var text = '';

    if(intPart == 1){
        text += intPart + " real";
    }
    else if(intPart > 1){
        text += intPart + " reais";
    }

    if(intPart > 0 && decimalPart > 0){
        text += " e ";
    }

    if(decimalPart == 1){
        text += decimalPart + " centavo";
    }
    else if(decimalPart > 1){
        text += decimalPart + " centavos";
    }

    return text;
}

var Init = function(server){
	webhookFunctions.Init(server);
	webhookFunctions.AddIntentAction('cardapio.bebidas', function(params) {
		var speech = "As bebidas são: ";
		bebidas.forEach(function(bebida){
			speech += `${bebida.nome} - ${formatPrice(bebida.preco)}.`;
		});

		return speech;
	});

	webhookFunctions.AddIntentAction('cardapio.sanduices', function(params) {
		var speech = "Os sanduíches são: ";
		sanduices.forEach(function(sanduice){
			speech += `${sanduice.nome} - ${formatPrice(sanduice.preco)}.`;
		});

		return speech;
	});

	webhookFunctions.AddIntentAction('cardapio.combos', function(params) {
		var speech = "Os combos são: ";

		combos.forEach(function(combo){
			speech += `${combo.nome} - ${formatPrice(combo.preco)}.`;
		});

		return speech;
	});

	webhookFunctions.AddIntentAction('efetuar-pedido.item', function(params) {
		var value = "";
		for(var key in params){
			if(params[key] && params[key].length){
				value = params[key];
				break;
			}
		}

		return `Entendi. Você quer ${value}`;
	});

	webhookFunctions.AddIntentAction('valor-alterado', function(params) {
		console.log('parametros do valor alterado');
		console.log(params);
		
		var fieldItem = parseInt(params["item"]);
		var fieldQuantidade = parseInt(params["quantidade"]);
		
		//Se preencher ambos os campos, então inclui o pedido na lista
		if(fieldItem && fieldQuantidade){
			return "";	
		}

		//Se um dos campos estiver preenchido, informa qual campo falta preencher
		if(fieldItem){
			return "informe a quantidade desejada.";
		}

		return "Informe o item desejado."
	});
};

module.exports = {
	Init
}

