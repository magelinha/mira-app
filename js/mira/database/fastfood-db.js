"use strict";

//Constantes para acesso ao banco de dados
const url = process.env.MONGODB_URI || "mongodb://localhost:27017/magela-db";
const mongoose = require('monogoose');
var db_heroku = 'heroku_2hlrrqz9';

//Models para o fastfood
const Teste = mongoose.model('Teste', new mongoose.Schema({
    _id: mongoose.Schema.Types.Number,
    nome: mongoose.Schema.Types.String,
    email: mongoose.Schema.Types.String,
    encerrado: mongoose.Schema.Types.Boolean
}));

const Passo = mongoose.model('Passo', new mongoose.Schema({
    _id: mongoose.Schema.Types.Number,
    elemento: mongoose.Schema.Types.String,
    evento: mongoose.Schema.Types.String,
    checkpoint: mongoose.Schema.Types.Boolean,
    teste: { type: mongoose.Schema.Types.ObjectId, ref:'Teste' },
}))

const Item = mongoose.model('Item', new mongoose.Schema({
    _id: mongoose.Schema.Types.Number,
    nome: mongoose.Schema.Types.String,
    imagem: mongoose.Schema.Types.String,
    preco: mongoose.Schema.Types.Mixed,
    descricao: mongoose.Schema.Types.String
}));

const Categoria = mongoose.model('Categoria', new mongoose.Schema({
    _id: mongoose.Schema.Types.Number,
    nome: mongoose.Schema.Types.String,
    itens: [{ type: mongoose.Schema.Types.Number, ref: 'Item'}]
}));

const Pedido = moongose.model('Pedido', new mongoose.Schema({
    _id: mongoose.Schema.Types.Number,
    numero: mongoose.Schema.Types.String,
    itens:[
        {
            item: { type: mongoose.Schema.Types.ObjectId, ref:'Item' },
            quantidade: { type: mongoose.Schema.Types.Number }
        }
    ]
}));

var Init = function(){
    mongoose.connect(url, { useNewUrlParser: true});
}

module.exports = {
    Init,
    Item,
    Categoria,
    Pedido,
    Teste,
    Passo
};