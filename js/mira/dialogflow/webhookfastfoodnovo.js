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
};

module.exports = {
	Init
}
