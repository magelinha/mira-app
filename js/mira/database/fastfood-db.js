"use strict";

//Constantes para acesso ao banco de dados
const url = process.env.MONGODB_URI || "mongodb://localhost:27017/magela-db";
const mongoose = require('mongoose');
var path = require("path");
var fs = require('fs');

//Models para o fastfood
const Teste = mongoose.model('Teste', new mongoose.Schema({
    //_id: mongoose.Schema.Types.ObjectId,
    nome: String,
    email: String,
    encerrado: Boolean
}, {collection: "testes"}));

const Passo = mongoose.model('Passo', new mongoose.Schema({
    //_id: mongoose.Schema.Types.ObjectId,
    elemento: String,
    evento: String,
    checkpoint: Boolean,
    teste: { type: mongoose.Schema.Types.ObjectId, ref:'Teste' },
}, {collection: "passos"}))

const Item = mongoose.model('Item', new mongoose.Schema({
    //_id: mongoose.Schema.Types.ObjectId,
    nome: String,
    imagem: String,
    preco: mongoose.Schema.Types.Mixed,
    descricao: String
}, {collection: "itens"}));

const Categoria = mongoose.model('Categoria', new mongoose.Schema({
    //_id: mongoose.Schema.Types.ObjectId,
    nome: String,
    itens: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item'}]
}, {collection: "categorias"}));

const Pedido = mongoose.model('Pedido', new mongoose.Schema({
    //_id: mongoose.Schema.Types.ObjectId,
    numero: String,
    itens:[
        {
            item: { type: mongoose.Schema.Types.ObjectId, ref:'Item' },
            quantidade: { type: Number }
        }
    ]
}, {collection: "pedidos"}));

var startDB = function(){
    var url = path.normalize(__dirname + '/../../..') + '/data/fastfoodnovo/cardapio/list.json';
    var file;
    fs.readFile(url, 'utf8', (err, data) => {
        if (err) 
            throw err;
            
        //Busca as categorias com o itens
        file = JSON.parse(data);
       

        file.categorias.forEach(async (categoria) => {
            //Salva o itens da categoria
            await Item.insertMany(categoria.itens, async (error, itens) => {
                if(error){
                    console.log("erro ao salvar: " + error);
                    return;
                };

                console.log("salvou os itens");
                console.log(itens);                    
                let ids = itens.map(item => item._id);
                let categoriaDB = new Categoria({
                    nome: categoria.nome,
                    itens: ids
                });
                await categoriaDB.save();
                console.log("salvou a categoria");
            })
        });
    });
}

var Init = function(){
    console.log(url);
    mongoose.connect(url, { useNewUrlParser: true});
    //startDB();
}

module.exports = {
    Init,
    Item,
    Categoria,
    Pedido,
    Teste,
    Passo
};