"use strict";

const db = require('../database/fastfood-db.js');

var Init = function(server){
    db.Init();

    // Incia um teste
    server.post('/api/fastfoodnovo/teste/criar', function(req, res){
        let testeToSave = new db.Teste({
            nome: req.params.nome,
            email: req.params.email,
            encerrado: false
        });

        testeToSave.save().then((result) => res.send(result));
    });

    //Salva os logs de um teste
    server.post('/api/fastfoodnovo/logs/', function(req, res){
        let logsToSave = req.params.logs.map((data) => {
            return new db.Passo({
                elemento: data.elemento,
                evento: data.evento,
                checkpoint: data.checkpoint,
                teste: data.teste
            });
        });

        db.Passo.InsertMany(logsToSave).then((result) => res.send(true));
    });

    //Busca a lista de promocções
    server.get('/api/fastfoodnovo/promocoes/', function(req, res){
        db.Categoria
            .where({nome: "Promoções"})
            .findOne()
            .populate("itens")
            .exec(function(error, categoria){
                if(error)
                    throw error;
                    
                res.send(categoria.itens);
                
            });
    });

    server.get('/api/fastfoodnovo/cardapio', function(req, res){
        var categorias = await db.Categoria
            .find()
            .findOne()
            .populate("itens");

        res.send(categorias);
    });

    server.get('/api/fastfoodnovo/pedido', function(req, res){
        var id = req.params.id;
        var pedido = GetPedido(id);

        res.send(pedido);
    });

    //Cria um novo pedido e retorna o id do mesmo
    server.post('/api/fastfoodnovo/pedido', (req, res) => {
        var pedido = new db.Pedido({
            numero: GenerateNumber(10),
            itens: []
        });

        pedido.save().then((saved) => { res.send(saved)});
    });

    server.post('/api/fastfoodnovo/pedido/:id', (req, res) => {
        var id = req.params.id;
        var pedido = GetPedido(id);

        //Atualiza a lista de itens
        if(req.params.item){
            var index = pedido.itens.findIndex((element) => element.item == req.params.item.id);
            
            //Se o item já existe, apenas incrementa a quantidade
            if(index > -1){
                pedido.itens[index].quantidade++;
            }
            else{
                pedido.itens.push(req.params.item);
            }
        }
        else if(req.params.itens){
            pedido.itens = req.params.itens;
        }
        
        pedido.save().then(() => { res.send(true)});
    });

    server.post('/api/fastfoodnovo/pedido/item', (req, res) => {
        var id = req.params.id;
        var pedido = GetPedido(id);

        //Atualiza a lista de itens
        var index = pedido.itens.findIndex((element) => element.item == req.params.item.id);
            
        //Se o item já existe, apenas incrementa a quantidade
        if(index > -1)
            pedido.itens.splice(index, 1);
        
        pedido.save().then(() => { res.send(true)});
    });

    server.get('/api/fastfoodnovo/finalizar', (req, res) => {
        var id = req.params.id;
        var pedido = GetPedido(id);

        res.send(pedido);
    });

};

function GetPedido(id) {
    return db.Pedido
    .FindById(id)
    .populate("itens");
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