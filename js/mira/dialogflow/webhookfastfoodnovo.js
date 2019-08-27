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
        message = `${DescreverProduto(item)}. Você pode adicioná-lo ao pedido ou ir para o próximo.`;
        console.log("mensagem: " + message);
        return message;
    });

    var DescreverProduto = (item) => {
        if(Array.isArray(item.preco)){
            console.log("preco é um array: " + item.preco.length);
            return item.preco.reduce((mensagemFinal, valor) => {
                
                return `${mensagemFinal}. ${valor.tamanho}, R$${valor.valor}`;
            }, `${item.nome}`)
        }

        return `${item.nome}, custa R$${item.preco}`;
    }

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
    webhookFunctions.AddIntentAction("evt-listar-pedido", async (params) => {
        
        let pedido = await db.Pedido.findById(params.pedido);
        
        if(pedido.itens.length == 0)
            return "Seu pedido ainda não possui itens.";
        
        if(pedido.itens.length == 1)
            return "Vi que seu pedido tem um item. Vou informá-los para você";

        return `Vi que seu pedido tem ${pedido.itens.length} itens. Vou informá-los para você.`;
    });

    var AdicionarItem = async (idPedido, idItem, quantidade) => {
        quantidade = quantidade || 1;
        //Busca o pedido
        let pedido = await db.Pedido.findById(idPedido).populate('itens').exec();

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

        if(params.id != null && params.id.length)
            return AdicionarItem(params.pedido, params.id, params.quantidade);

        //Caso não tenha passado o id, busca o item através do nome
        console.log("item: " + params.item.toLowerCase());
        let item = await db.Item.findOne({ nome: params.item});
        console.log("Id do item: " + item._id);

        return AdicionarItem(params.pedido, item._id, params.quantidade);
        
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

    webhookFunctions.AddIntentAction("evt-alterar-quantidade", async (params) => {
        //Busca o pedido
        let pedido = await db.Pedido.findById(params.pedido);
        console.log("itens:" + pedido.itens);
        console.log("params: " + params);
        //busca o item por nome ou id
        let itemPedido = null;
        if(params.id && params.id.length){
            itemPedido = pedido.itens.find(i => i.item == params.id);
        }
        else{
            var itemDB = await db.Item.findOne({nome: params.item});
            itemPedido = pedido.itens.find(i => i.item.equals(itemDB._id));
        }

        if(!itemPedido)
           return ""; 

        itemPedido.quantidade = params.quantidade;

        try{
            await pedido.save();

            return "A quantidade do item foi atualizada.";
        }catch(ex){
            return "Houve um problema ao atualizar a quantidade do item.";
        }
    });

    webhookFunctions.AddIntentAction("evt-remover-item", async (params) => {
        //Busca o pedido
        let pedido = await db.Pedido.findById(params.pedido);

        console.log(`quantidade antes de remover: ${pedido.itens.length}`);

        //verifica se tem o item no pedido
        let itemPedido = null;
        if(params.id && params.id.length){
            itemPedido = pedido.itens.find(i => i.item == params.id);
        }
        else{
            var itemDB = await db.Item.findOne({nome: params.item});
            itemPedido = pedido.itens.find(i => i.item.equals(itemDB._id));
        }

        pedido.itens = pedido.itens.filter(x => x != itemPedido);

        console.log(`quantidade depois de remover: ${pedido.itens.length}`);

        try{
            await pedido.save();

            return "Item removido com sucesso.";
        }catch(ex){
            return "Houve um problema ao remover o item.";
        }
    });

    webhookFunctions.AddIntentAction("evt-total-pedido", async (params) => {
        let pedido = await db.Pedido.findById(params.pedido);

        let total = 0;

        pedido.itens.forEach(async i => {
            let item = await db.Item.findById(i.item);
            let preco = Array.isArray(item.preco) ? item.preco[0].valor : item.preco;
            total += preco * i.quantidade;
        });

        return `Seu pedido atualmente está custando R$${total}`;
    });
};

module.exports = {
	Init
}
