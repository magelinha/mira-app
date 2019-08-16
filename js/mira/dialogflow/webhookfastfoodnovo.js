"use strict";

var webhookFunctions = require('./webhookFunctions');

var Init = function(server, db){
    console.log("Iniciou o server");
    webhookFunctions.Init(server);
    
    //Falar os dados do produto
    webhookFunctions.AddIntentAction("evt-informar-produto", async (params) => {
        //Busca o produto
        var id = params.id;
        var message = "";
        var item = await db.Item.findById(id);
        message = `${item.nome}, custa R$${item.preco}. Você pode adicioná-lo ao pedido ou ir para o próximo.`;
        console.log("mensagem: " + message);
        return message;
    });

    //Informar quantidade no modal
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

    //Informar a quantidade de itens do pedido
    webhookFunctions.AddIntentAction("listar-pedido", async (params) => {
        
        let qtdPedido = await db.Pedido.count();

        return qtdPedido > 0 ? 
            `Vi que seu pedido tem ${qtdPedido} itens. Vou informá-los para você.` :
            "Seu pedido ainda não possui itens.";
    });

    var AdicionarItem = (idItem, quantidade) => {
        //Busca o pedido
        let pedido = await db.Pedido.findById(params.pedido).populate('itens').exec();

        //Busca o item desejado
        let item = await db.Item.findById(idItem);

        let itemPedido = pedido.itens.find(i => i._id == item._id);
        if(!itemPedido){
            pedido.itens.push({item: item._id, quantidade: quantidade});
        }
        else{
            itemPedido.quantidade = itemPedido.quantidade + quantidade;
        }

        try{
            await pedido.save();

            return "Item adicionado com sucesso ao pedido.";
        }catch(ex){
            return "Houve um problema ao adicionar o produto.";
        }
    };

    //Evento disparado ao clicar no botão de adicionar
    webhookFunctions.AddIntentAction('evt-adicionar-item', async(params) => {
        //Busca o produto pelo nome
        let item = await db.Item.find({ nome: params.item});

        //adicionar o item
        AdicionarItem(item._id, params.quantidade);
    });

    //Evento disparado ao clicar no botão de adicionar
    webhookFunctions.AddIntentAction('evt-adicionar-item', async(params) => {
        AdicionarItem(params.id, params.quantidade);
    });

    //Evento para finalizar o pedido
    webhookFunctions.AddIntentAction("evt-finalizar-pedido", async (params) => {
        //Busca o pedido
        let pedido = await db.Pedido.findById(params.pedido).populate('teste').exec();

        //Busca o teste relacionado ao pedido
        let teste = pedido.Teste;
        teste.Encerrado = true;

        try{
            await teste.save();

            return "Seu pedido foi finalizado com sucesso. Obrigado.";
        }catch(ex){
            return "Houve um problema ao finalizar seu pedido.";
        }
    });

    //Evento para remover um item do pedido
    webhookFunctions.AddIntentAction("evt-remover-item", async (params) => {
        //Busca o pedido
        let pedido = await db.Pedido.findById(params.pedido).populate('itens').exec();

        //Remove do pedido o item 
        pedido.itens = pedido.itens.filter(x => x._id != params.id);

        try{
            await pedido.save();

            return "Item removido com sucesso.";
        }catch(ex){
            return "Houve um problema ao remover o item.";
        }
    });

    var RemoveItemPedido = (pedido, idItem) => {
        pedido.itens = pedido.itens.filter(x => x._id != idItem);
    }

    webhookFunctions.AddIntentAction("evt-remover-item", async (params) => {
        //Busca o pedido
        let pedido = await db.Pedido.findById(params.pedido).populate('itens').exec();

        //Remove do pedido o item
        RemoveItemPedido(pedido, params.id); 

        try{
            await pedido.save();

            return "Item removido com sucesso.";
        }catch(ex){
            return "Houve um problema ao remover o item.";
        }
    });

    webhookFunctions.AddIntentAction("remover-item-específico", async (params) => {
        //Busca o pedido
        let pedido = await db.Pedido.findById(params.pedido).populate('itens').exec();

        //Remove do pedido o item 
        let item = pedido.itens.find(x => x.Nome != params.item);

        if(item == null)
            return `${params.item} já não estava no seu pedido.`

        RemoveItemPedido(pedido, item._id);

        try{
            
            await pedido.save();

            return `${params.item} foi retirado do pedido.`;
        } catch(ex){
            return "Houve um problema ao remover o item.";
        }
    });
};

module.exports = {
	Init
}
