"use strict";

var webhookFunctions = require('./webhookFunctions');

var Init = function(server, db){
    console.log("Iniciou o server");
    webhookFunctions.Init(server);
    
    webhookFunctions.AddIntentAction("falar-produto", async (params) => {
        console.log("vai executar o falar produto com os parâmetros: " + params);

        //Busca o produto
        var id = params.id;
        var message = "";
        var item = await db.Item.findById(id);
        message = `${item.nome}, custa R$${item.preco}. Você pode adicioná-lo ao pedido ou ir para o próximo.`;
        console.log("mensagem: " + message);
        return message;
    });

    webhookFunctions.AddIntentAction("quantidade-informada", async (params) => {
        console.log(params);
        //busca o pedido em andamento
        let pedido = await db.Pedido.findById(params.pedido).populate('itens').exec();

        //Busca o item desejado
        let item = await db.Item.findById(params.id);

        //Insere o item no pedido
        pedido.itens.push({item: item._id, quantidade: params.quantidade});

        console.log(pedido);

        try{
            await pedido.save();

            return "Item adicionado com sucesso ao pedido.";
        }catch(ex){
            return "Houve um problema ao adicionar o produto.";
        }
    });

    webhookFunctions.AddIntentAction("itens-pedido", async (params) => {
        
        let qtdPedido = await db.Pedido.count();

        return qtdPedido > 0 ? 
            `Vi que seu pedido tem ${qtdPedido} itens. Vou informá-los para você.` :
            "Seu pedido ainda não possui itens.";
    });

    webhookFunctions.AddIntentAction('adicionar-item-botao', async(params) => {
        //Busca o pedido
        let pedido = await db.Pedido.findById(params.pedido).populate('itens').exec();

        //Busca o produto
        //Busca o item desejado
        let item = await db.Item.findById(params.id);

        let itemPedido = pedido.itens.find(i => i._id == item._id);
        if(!itemPedido){
            pedido.itens.push({item: item._id, quantidade: params.quantidade});
        }
        else{
            itemPedido.quantidade = itemPedido.quantidade + params.quantidade;
        }

        try{
            await pedido.save();

            return "Item adicionado com sucesso ao pedido.";
        }catch(ex){
            return "Houve um problema ao adicionar o produto.";
        }
    });

    webhookFunctions.AddIntentAction("finalizar-pedido", async (params) => {
        
    });
};

module.exports = {
	Init
}
