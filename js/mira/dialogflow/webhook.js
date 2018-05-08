"use strict";
var webhookFunctions = require('./webhookFunctions');
var jsonfile = require('jsonfile');
var pathPedidos = '';

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
};

var novoPedido = function(){
	var pedidos = { itens:[] };
	setPedidos(pedidos);
};

var getItem = function(nome, tipo){
	var toSearch = [];
	if(tipo == 'bebidas'){
		toSearch = bebidas;
	} else if(tipo == 'sanduiches'){
		toSearch = sanduices;
	}
	else{
		toSearch = combos;
	}

	return toSearch.find(it => it.nome == nome);
}

var getPedidos = function(){
	return jsonfile.readFileSync(pathPedidos);
}

var setPedidos = function(pedidos){
	return jsonfile.writeFileSync(pathPedidos, pedidos);
}

var removeItem = function(item){
	//busca do parâmetro qual o item a ser removido
	var item = '';
	var tipo = typeof(params.item);
	if(tipo === 'object'){
		Object.keys(params.item).forEach(key => {
			if(params.item[key])
				item = params.item[key];
		});
	} else if(tipo === 'string'){
		item = params.item;
	}

	//faz a leitura do arquivo para verificar quais os itens do pedido
	var pedidos = jsonfile.readFileSync(pathPedidos);
	
	//verifica se o item a ser excluído está no pedido
	var exists = pedidos.itens.find(it => it.nome == item);

	//Se não encontrou o item, informa para o usuário
	if(!exists)
		return `O item ${item} não foi encontrado na lista de pedidos`;
	
	//caso tenha encontrado, remove da lista
	pedidos.itens.filter(it => it.nome == item)

	//reescreve no arquivo json
	jsonfile.writeFileSync(pathPedidos, pedidos);

	return item;
}

var Init = function(server){
	webhookFunctions.Init(server);
	pathPedidos = webhookFunctions.BaseURL + 'data/pedidos.json';

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


	webhookFunctions.AddIntentAction('efetuar-pedido.item-quantidade', function(params){
		
		console.log(params);
		
		var quantidade = params.quantidade;
		var nome = '';
		var tipo = '';

		if(!params.item)
			return;

		Object.keys(params.item).forEach(key => {
			if(params.item[key]){
				nome = params.item[key];
				tipo = key;
				return;
			}
		});
		
		//Adiciona o item no pedido
		var item = getItem(nome, tipo);
		
		var pedidos = getPedidos();

		//verifica se já existe algum item na lista
		var index = pedidos.itens.findIndex(it => it.nome == item.nome);
		if(index >= 0){
			pedidos.itens[index].quantidade += quantidade;
			pedidos.itens[index].total = pedidos.itens[index].preco * quantidade;
		}
		else{
			var toAdd = Object.assign({}, item, {quantidade: quantidade, total: item.preco * quantidade});
			pedidos.itens.push(toAdd);
		}
		
		setPedidos(pedidos);

		return 
			quantidade > 1 ? `Entendi. Você quer ${quantidade} unidades do item ${item}.` :
			`Entendi. Você quer ${quantidade} unidade do item ${item}.`;
	});

	webhookFunctions.AddIntentAction('welcome-landing', function(params){
		novoPedido();
	});

	webhookFunctions.AddIntentAction('pedido.novo-pedido', function(params){
		novoPedido();
	});

	webhookFunctions.AddIntentAction('pedido.alterar-item-event', function(params){
		var item = '';
		if(params.item){
			Object.keys(params.item).forEach(key => {
				if(params.item[key])
					item = params.item[key];
			});
		};

		return `Vamos alterar o item ${item}. Qual a nova quantidade desejada?`;
	});

	webhookFunctions.AddIntentAction('pedido.excluir-item-especifico', function(params){
		var item = removeItem(params.item);

		//Informa ao usuário que o item foi removido com sucesso
		return `O item ${item} foi removido do pedido.`;
	});

	webhookFunctions.AddIntentAction('pedido.excluir-item-event', function(params){
		var item = removeItem(params.item);

		//Informa ao usuário que o item foi removido com sucesso
		return `O item ${item} foi removido do pedido.`;
	});
	

	webhookFunctions.AddIntentAction('pedido.total', function(params){
		var pedidos = getPedidos();
		var total = 0; 
		pedidos.itens.forEach(item => total += item.total);

		var totalMoeda = formatPrice(total);

		return `O total do pedido é ${totalMoeda}`;
	});

};

module.exports = {
	Init
}

