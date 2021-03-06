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
		"alias": "Primavera",
		"nome": "Primavera (1 Hambúrguer + 1 Milk Shake)",
		"preco": 11
	},
	{
		"id": 10,
		"alias": "Verão",
		"nome": "Verão (2 Mistos Quentes + 1 Suco Natural)",
		"preco": 7.5
	},
	{
		"id": 11,
		"alias": "Outono",
		"nome": "Outono (1 Hambúrguer + 1 Cachorro Quente + 2 Refrigerantes)",
		"preco": 12.5
	},
	{
		"id": 12,
		"alias": "Inverno",
		"nome": "Inverno (2 Hambúrgueres + 2 Refrigerantes)",
		"preco": 10
	}
];

var replaceAccent = function(str) {
	return str.replace(
		/([àáâãäå])|([ç])|([èéêë])|([ìíîï])|([ñ])|([òóôõöø])|([ß])|([ùúûü])|([ÿ])|([æ])/g, 
		function (str, a, c, e, i, n, o, s, u, y, ae) {
			if (a) return 'a';
			if (c) return 'c';
			if (e) return 'e';
			if (i) return 'i';
			if (n) return 'n';
			if (o) return 'o';
			if (s) return 's';
			if (u) return 'u';
			if (y) return 'y';
			if (ae) return 'ae';
		}
	);
}

var formatPrice = function(param){
	var value = typeof param == "string" ? param.replace("R$","").replace(",",".") : param.toString();
	value = parseFloat(value);

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
	var searchInCombos = false;
	if(tipo == 'bebida'){
		toSearch = bebidas;
	} else if(tipo == 'sanduiche'){
		toSearch = sanduices;
	}
	else{
		searchInCombos = true;
		toSearch = combos;
	}

	var formatName = replaceAccent(nome).toUpperCase();
	return toSearch.find(it => 
	{
		return searchInCombos ? 
		replaceAccent(it.alias).toUpperCase() == formatName || replaceAccent(it.nome).toUpperCase() == formatName :
		replaceAccent(it.nome).toUpperCase() == formatName;
	});
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
	var pedidos = getPedidos();
	
	//verifica se o item a ser excluído está no pedido
	var formatName = replaceAccent(nome).toUpperCase();
	var exists = pedidos.itens.find(it => replaceAccent(it.nome).toUpperCase() == formatName);

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
	pedidos.itens = pedidos.itens.filter(it => replaceAccent(it.nome).toUpperCase() != formatName);

	setPedidos(pedidos);

	return result;
}

var adicionarItem = function(item, quantidade){
	var pedidos = getPedidos();

	//verifica se já existe algum item na lista
	console.log(pedidos.itens);
	console.log(item);

	var formatName = replaceAccent(item.nome).toUpperCase();
	var index = pedidos.itens.findIndex(it => replaceAccent(it.nome).toUpperCase() == formatName);
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

	speech += "Você pode consultar o seu pedido, ou finalizar a compra a qualquer momento."
	console.log(speech);
	return speech;
};

var alterarItem = function(nome, quantidade){
	var formatName = nome.toUpperCase();

	//Atualiza o pedido corrente
	var pedido = getPedidos();

	var msg = "";

	//Informa qual a nova quantidade do item
	pedido.itens.forEach(item => {
		var itemName = item.nome.toUpperCase();
		if(itemName != formatName)
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
};

var Init = function(server){
	webhookFunctions.Init(server);
	pathPedidos = webhookFunctions.BaseURL + 'data/pedidos.json';

	server.get('/fastfood/gerarPedido', function(req, res, next){
		var pedidos = getPedidos();
		pedidos.numero = Math.floor(Math.random() * (100 - 11 + 1)) + 11;
		pedidos.atual = pedidos.numero - 5;
		setPedidos(pedidos);

		var numeroPedido = {
			numero: pedidos.numero,
			atual: pedidos.atual
		};
	
		res.json(numeroPedido);
	});

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
	});

	server.post('/total-item', (req, res) => {
		console.log(req.body);

		var nome = req.body.item;
		var quantidade = req.body.quantidade;

		var item = getItemByName(nome);

		var result = {
			total: item.preco * parseInt(quantidade)
		};

		res.json(result);
	});

	webhookFunctions.AddIntentAction('cardapio.bebidas', function(params) {
		var speech = "As bebidas são: ";
		bebidas.forEach(function(bebida){
			speech += `${bebida.nome} - ${formatPrice(bebida.preco)}.`;
		});

		return speech;
	});

	webhookFunctions.AddIntentAction('cardapio.sanduiches', function(params) {
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
		
		console.log(nome, tipo);
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

		if(params.view == "landing")
			speech += "Você pode aumentar ou diminuir a quantidade, removê-lo do pedido, ou ir para o próximo item.";

		return speech;
	});

	webhookFunctions.AddIntentAction('pedido.novo-pedido', function(params){
		novoPedido();
	});

	webhookFunctions.AddIntentAction('pedido.alterar-item-event', function(params){
		var nome = params.nome;
		var quantidade = params.quantidade;

		return alterarItem(nome, quantidade);		
	});

	webhookFunctions.AddIntentAction('pedido.alterar-item', function(params){
		var nome = "";
		Object.keys(params.item).forEach(key => {
			if(params.item[key])
				nome = params.item[key];
		});

		var quantidade = params.quantidade;

		return alterarItem(nome, quantidade);
	});

	webhookFunctions.AddIntentAction('pedido.reduzir-quantidade-event', function(params){
		var nome = params.nome.toUpperCase();

		//Atualiza o pedido corrente
		var pedido = getPedidos();

		var msg = "";

		//Informa qual a nova quantidade do item
		pedido.itens.forEach(item => {
			var itemName = item.nome.toUpperCase();
			if(itemName != nome)
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
		console.log(params);


		var nome = params.nome.toUpperCase();

		//Atualiza o pedido corrente
		var pedido = getPedidos();

		var msg = "";

		//Informa qual a nova quantidade do item
		pedido.itens.forEach(item => {
			var itemName = item.nome.toUpperCase();
			if(itemName != nome)
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

	webhookFunctions.AddIntentAction('pedido.cadastrar-pedido-event', function(params){
		var pedidos = getPedidos();

		return pedidos.itens.length > 0 ? 
			"Estamos gerando o número do seu pedido. Aguarde." : 
			"O pedido deve ter pelo menos um item.";
	});

	webhookFunctions.AddIntentAction('proximo-item', function(params){
		var numeroAtual = params.numeroAtual + 1;
		var pedido = params.numeroPedido;
		
		return numeroAtual == pedido ? `Seu pedido está pronto` : `O pedido de número ${numeroAtual} está pronto.`;
	});

	webhookFunctions.AddIntentAction('ultimo-pedido', function(params){
		var pedido = getPedidos();

		return pedido.atual ? `O último pedido chamado foi o ${pedido.atual}.` : 
		"Você ainda não finalizou a compra do seu pedido.";
	});

	webhookFunctions.AddIntentAction('meu-pedido', function(params){
		var pedido = getPedidos();

		return pedido.numero ? `O número do seu pedido é ${pedido.numero}.` : 
			"Você ainda não finalizou a compra do seu pedido.";
	});

	webhookFunctions.AddIntentAction('welcome-pedido', function(params){
		var pedido = getPedidos();

		return `Seu pedido é ${pedido.numero}.`;
	});


	//#endregion

};

module.exports = {
	Init
}

