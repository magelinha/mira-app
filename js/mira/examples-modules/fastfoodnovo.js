"use strict";

const db = require('../database/fastfood-db.js');
const webhook = require('../dialogflow/webhookfastfoodnovo.js');

var Init = function(server){
    db.Init();
    webhook.Init(server, db);

    // Incia um teste
    server.post('/api/fastfoodnovo/teste/criar', (req, res) =>{
        
        let testeToSave = new db.Teste({
            nome: req.body.nome,
            email: req.body.email,
            encerrado: false
        });

        testeToSave.save().then((result) => 
        {
            //após salva o teste, cria um pedido relacionado ao testes
            let pedido = new db.Pedido({
                numero : GenerateNumber(10),
                teste: result._id,
                itens: []
            });

            pedido.save().then(pedidoSalvo => {
                let response = {
                    pedido: pedidoSalvo,
                    teste: result
                };
                res.send(response);
            });
        });
    });

    //Salva os logs de um teste
    server.post('/api/fastfoodnovo/logs/', (req, res) => {
        
        let logsToSave = req.body.logs.map((data) => {
            return new db.Passo({
                elemento: data.elemento,
                evento: data.evento,
                checkpoint: data.checkpoint,
                teste: data.teste
            });
        });

        db.Passo.InsertMany(logsToSave).then((result) => res.send(true));

        res.send(true);
    });

    //Busca a lista de promocções
    server.get('/api/fastfoodnovo/promocoes/', (req, res) => {
        db.Categoria
            .findOne({nome: "Promoções"})
            .populate("itens")
            .exec(function(error, categoria){
                if(error)
                    throw error;
                    
                res.send(categoria.itens);
                
            });
    });

    server.get('/api/fastfoodnovo/pedido/:id', async (req, res) => {
        let categorias = await db.Categoria
            .find()
            .populate("itens")
            .exec();

        console.log("total: "  + categorias.length);
        
        let idPedido = req.params.id;
        db.Pedido
            .findById(idPedido)
            .exec(async (error, pedido) => {
                let promises  = await pedido.itens.map(async (itemArray) => {
                    let item = await db.Item.findById(itemArray.item);

                    var preco = Array.isArray(item.preco) ? item.preco[itemArray.tamanho].valor : item.preco;

                    let result = {
                        id: item._id,
                        nome:  item.nome,
                        quantidade: itemArray.quantidade,
                        total: itemArray.quantidade * preco
                    };
                    
                    console.log(result);

                    return result;
                });

                let itens = await Promise.all(promises); 
                let totalPedido = itens.reduce((current, processado) => current + processado.total, 0);
                let response = {
                    categorias : categorias,
                    itens: itens,
                    totalPedido : totalPedido
                }

                res.send(response);
            });
    });

    server.get('/api/fastfoodnovo/cardapio', (req, res) => {
        GetCategorias(res);
    });

    //Cria um novo pedido e retorna o id do mesmo
    server.post('/api/fastfoodnovo/pedido', (req, res) => {
        var pedido = new db.Pedido({
            numero: GenerateNumber(10),
            itens: req.body.itens
        });

        pedido.save().then((saved) => { res.send(saved)});
    });

    server.post('/api/fastfoodnovo/pedido/:id', (req, res) => {
        var id = req.body.id;
        var pedido = GetPedido(id);

        //Atualiza a lista de itens
        if(req.body.item){
            var index = pedido.itens.findIndex((element) => element.item == req.body.item.id);
            
            //Se o item já existe, apenas incrementa a quantidade
            if(index > -1){
                pedido.itens[index].quantidade++;
            }
            else{
                pedido.itens.push(req.body.item);
            }
        }
        else if(req.body.itens){
            pedido.itens = req.body.itens;
        }
        
        pedido.save().then(() => { res.send(true)});
    });

    server.post('/api/fastfoodnovo/pedido/item', (req, res) => {
        var id = req.body.id;
        var pedido = GetPedido(id);

        //Atualiza a lista de itens
        var index = pedido.itens.findIndex((element) => element.item == req.body.item.id);
            
        //Se o item já existe, apenas incrementa a quantidade
        if(index > -1)
            pedido.itens.splice(index, 1);
        
        pedido.save().then(() => { res.send(true)});
    });

    server.get('/api/fastfoodnovo/pedido-finalizado', (req, res) => {
        var result = {
            mensagem: "Obrigado por comprar na Fast Food UAI. Trem bão demais."
        }
        
        res.send(result);
    });

};

function GetPedido(id) 
{
    var pedido = db.Pedido
    .findById(id)
    .populate("itens");

    console.log("pedido: " + pedido);
    return pedido;
}

function GetCategorias(res){
    db.Categoria
            .find()
            .populate("itens")
            .exec((error, categorias) => res.send({ categorias : categorias }));
}

function GenerateNumber(size){
    return Array
        .apply(0, Array(size))
        .map(() => { return randomIntFromInterval(1, 10); })
        .reduce((currentResult, currentValue) => currentResult.concat(currentValue), "");
}

function randomIntFromInterval(min,max) // min and max included
{
    return Math.floor(Math.random()*(max-min+1)+min);
}

module.exports = {
    Init,
}