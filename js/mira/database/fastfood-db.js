"use strict";

//Constantes para acesso ao banco de dados
const url = process.env.MONGODB_URI || "mongodb://localhost:27017/magela-db";
const mongoose = require('monogoose');
var path = require("path");
var fs = require('fs');

//Models para o fastfood
const Teste = mongoose.model('testes', new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    nome: mongoose.Schema.Types.String,
    email: mongoose.Schema.Types.String,
    encerrado: mongoose.Schema.Types.Boolean
}));

const Passo = mongoose.model('passos', new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    elemento: mongoose.Schema.Types.String,
    evento: mongoose.Schema.Types.String,
    checkpoint: mongoose.Schema.Types.Boolean,
    teste: { type: mongoose.Schema.Types.ObjectId, ref:'testes' },
}))

const Item = mongoose.model('itens', new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    nome: mongoose.Schema.Types.String,
    imagem: mongoose.Schema.Types.String,
    preco: mongoose.Schema.Types.Mixed,
    descricao: mongoose.Schema.Types.String
}));

const Categoria = mongoose.model('categorias', new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    nome: mongoose.Schema.Types.String,
    itens: [{ type: mongoose.Schema.Types.ObjectId, ref: 'itens'}]
}));

const Pedido = moongose.model('pedidos', new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    numero: mongoose.Schema.Types.String,
    itens:[
        {
            item: { type: mongoose.Schema.Types.ObjectId, ref:'itens' },
            quantidade: { type: mongoose.Schema.Types.Number }
        }
    ]
}));

var startDB = function(){
    var url = path.normalize(__dirname + '/../..') + '/data/fastfoodnovo/cardapio/list.json';
    var file;
    fs.readFile(url, 'utf8', function (err, data) {
        if (err) 
            throw err;
            
        //Busca as categorias com o itens
        file = JSON.parse(data);
        
        //Para cada categoria, salva os itens e depois a categoria
        var categorias = file.categorias.map((categoria) => {
            //Adiciona os itens
            var itens = categoria.itens.map(item => {
                return new Item({
                    nome: item.nome,
                    imagem: item.imagem,
                    preco: item.preco,
                    descricao: item.descricao
                })
            });

            var savedItems = await Item.InsertMany(itens);

            //cria a categoria a ser salva
            return new Categoria({
                nome: categoria.nome,
                itens: savedItems
            });
        });

        Categoria.InsertMany(categorias);
    });
}

var Init = function(){
    mongoose.connect(url, { useNewUrlParser: true});
    startDB();
}

module.exports = {
    Init,
    Item,
    Categoria,
    Pedido,
    Teste,
    Passo
};