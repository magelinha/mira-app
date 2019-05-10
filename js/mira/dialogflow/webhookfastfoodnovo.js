"use strict";

var webhookFunctions = require('./webhookFunctions');

var Init = function(server, db){
    webhookFunctions.Init(server);
    
    webhookFunctions.AddIntentAction("falar-produto", async (params) => {
        console.log(params)
        //Busca o produto
        var id = params.id;
        var message = "";
        var item = await db.Item.findById(id);
        message = `${item.nome}, custa R$${item.preco}. Você pode adicioná-lo ao produto ou ir para o próximo.`;
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
};

module.exports = {
	Init
}
