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
	param = param.replace("R$","");
	param = param.replace(",",".");
	console.log(param);
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
	if(tipo == 'bebida'){
		toSearch = bebidas;
	} else if(tipo == 'sanduiche'){
		toSearch = sanduices;
	}
	else{
		toSearch = combos;
	}

	return toSearch.find(it => it.nome == nome);
}

var getItemByName = function(nome){
	var item = getItem(nome, 'bebida') || getItem(nome, 'sanduiche') || getItem(nome, 'combos');

	if(!item)
		console.error(`Não foi possível encontrar o item com nome ${nome}`);

	return item;
}

var getPedidos = function(){
	return jsonfile.readFileSync(pathPedidos);
}

var setPedidos = function(pedidos){
	return jsonfile.writeFileSync(pathPedidos, pedidos);
}

var removeItem = function(nome){
	//faz a leitura do arquivo para verificar quais os itens do pedido
	var pedidos = jsonfile.readFileSync(pathPedidos);
	
	//verifica se o item a ser excluído está no pedido
	var exists = pedidos.itens.find(it => it.nome == nome);

	//Se não encontrou o item, informa para o usuário
	var result = {
		success: true,
		message: ""
	}

	if(!exists){
		result.success = false;
		result.message = `O item ${nome} não foi encontrado na lista de pedidos`;
		return result;
	}
	
	//caso tenha encontrado, remove da lista
	pedidos.itens.filter(it => it.nome != nome)

	//reescreve no arquivo json
	jsonfile.writeFileSync(pathPedidos, pedidos);

	return result;
}

var adicionarItem = function(item, quantidade){
	var pedidos = getPedidos();

	//verifica se já existe algum item na lista
	var index = pedidos.itens.findIndex(it => it.nome == item.nome);
	if(index >= 0){
		pedidos.itens[index].quantidade += quantidade;
		pedidos.itens[index].total += pedidos.itens[index].preco * quantidade;
	}
	else{
		var toAdd = Object.assign({}, item, {quantidade: quantidade, total: item.preco * quantidade});
		pedidos.itens.push(toAdd);
	}
	
	setPedidos(pedidos);

	var nome = item.nome;

	var speech = 
		quantidade > 1 ? `${quantidade} unidades do item ${nome} foram adicionadas ao pedido.` :
		`${quantidade} unidade do item ${nome} foi adicionada ao pedido.`;

	speech += "Você pode consultar o seu pedido a qualquer momento."
	console.log(speech);
	return speech;
};

var Init = function(server){
	webhookFunctions.Init(server);
	pathPedidos = webhookFunctions.BaseURL + 'data/pedidos.json';

	server.get('/pedido', (req, res) => {
		var pedidos = getPedidos();
		res.json(pedidos.itens);
	});

	server.get('/total-pedido', (req, res) => {
		var pedidos = getPedidos();
		var total = pedidos.itens
			.map(x => x.total)
			.reduce((acc, current) => acc+current, 0);

		
		res.json([{total: total}]);
	})

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
		
		var quantidade = parseInt(params.quantidade);
		var nome = '';
		var tipo = '';

		if(!params.item)
			return;

		Object.keys(params.item).some(key => {
			if(params.item[key]){
				nome = params.item[key];
				tipo = key;
				return true;
			}

			return false;
		});
		
		var item = getItem(nome, tipo);

		return adicionarItem(item, quantidade);
	});

	webhookFunctions.AddIntentAction('efetuar-pedido.item-adicionado', function(params){
		console.log(params);
		var quantidade = parseInt(params.quantidade);
		var item = getItemByName(params.item);
		
		return adicionarItem(item, quantidade);
	});

	webhookFunctions.AddIntentAction('welcome-landing', function(params){
		
		//novoPedido();
	});

	//#region Pedido

	webhookFunctions.AddIntentAction('pedido.item-selecionado', function(params){
		var speech = params.quantidade > 1 ?
			`${params.quantidade} unidades de ${params.nome}. Total: ${formatPrice(params.total)}.` :
			`${params.quantidade} unidade de ${params.nome}. Total: ${formatPrice(params.total)}.`;

		speech += "Você pode aumentar ou diminuir a quantidade, removê-lo do pedido, ou ir para o próximo item.";

		return speech;
	});

	webhookFunctions.AddIntentAction('pedido.novo-pedido', function(params){
		novoPedido();
	});

	webhookFunctions.AddIntentAction('pedido.alterar-item-event', function(params){
		var nome = params.nome;
		var quantidade = params.quantidade;

		//Atualiza o pedido corrente
		var pedido = getPedidos();

		var msg = "";

		//Informa qual a nova quantidade do item
		pedido.itens.forEach(item => {
			if(item.nome != nome)
				return;
				
			if(item.quantidade == quantidade){
				msg = "A quantidade informada é a mesma já informada no pedido";
				return;
			}

			item.total = item.preco * quantidade;
			item.quantidade = quantidade;

			msg = `A nova quantidade do item ${item.nome} é ${quantidade}.`;
		});

		msg = msg == "" ? "O item a ter sua quantidade alterada não foi encontrado" : msg; 

		setPedidos(pedido);
		return msg;
	});

	webhookFunctions.AddIntentAction('pedido.reduzir-quantidade-event', function(params){
		var nome = params.nome;

		//Atualiza o pedido corrente
		var pedido = getPedidos();

		var msg = "";

		//Informa qual a nova quantidade do item
		pedido.itens.forEach(item => {
			if(item.nome != nome)
				return;
				
			if(item.quantidade <= 1){
				msg = "A quantidade mínima é 1";
				return;
			}

			var quantidade = item.quantidade - 1;

			item.total = item.preco * quantidade;
			item.quantidade = quantidade;

			msg = `A nova quantidade do item ${item.nome} é ${quantidade}.`;
		});

		msg = msg == "" ? "O item a ter sua quantidade reduzida não foi encontrado" : msg; 

		setPedidos(pedido);
		return msg;
	});

	webhookFunctions.AddIntentAction('pedido.aumentar-quantidade-event', function(params){
		var nome = params.nome;

		//Atualiza o pedido corrente
		var pedido = getPedidos();

		var msg = "";

		//Informa qual a nova quantidade do item
		pedido.itens.forEach(item => {
			if(item.nome != nome)
				return;

			var quantidade = item.quantidade + 1;

			item.total = item.preco * quantidade;
			item.quantidade = quantidade;

			msg = `A nova quantidade do item ${item.nome} é ${quantidade}.`;
		});

		msg = msg == "" ? "O item a ter sua quantidade aumentada não foi encontrado" : msg; 

		setPedidos(pedido);
		return msg;
	});

	webhookFunctions.AddIntentAction('pedido.excluir-item-especifico', function(params){
		var nome = "";
		Object.keys(params.item).forEach(key => {
			if(params.item[key])
				nome = params.item[key];
		});

		var result = removeItem(nome);

		//Informa ao usuário que o item foi removido com sucesso ou a mensagem de erro, caso tenha ocorrido
		return result.success ? `O item ${nome} foi removido do pedido.` : result.message;
	});

	webhookFunctions.AddIntentAction('pedido.excluir-item-event', function(params){
		var result = removeItem(params.item);

		//Informa ao usuário que o item foi removido com sucesso ou a mensagem de erro, caso tenha ocorrido
		return result.success ? `O item ${params.item} foi removido do pedido.` : result.message;
	});
	

	webhookFunctions.AddIntentAction('pedido.total', function(params){
		var pedidos = getPedidos();
		var total = 0; 
		pedidos.itens.forEach(item => total += item.total);

		var totalMoeda = formatPrice(total);

		return `O total do pedido é ${totalMoeda}`;
	});

	//#endregion

};

module.exports = {
	Init
}

