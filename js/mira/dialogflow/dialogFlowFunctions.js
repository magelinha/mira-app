'use strict';

/************************* Funções para o dialogflow ****************************/

const dialogflow = require('dialogflow');
//configura as credenciais
const credentials = JSON.parse(process.env.GOOGLE_CLOUD_CREDENTIALS);
let config = {
    credentials: {
        private_key: credentials.private_key,
        client_email: credentials.client_email
    }
}

console.log(config);

const sessionClient = new dialogflow.SessionsClient(config);

//const grpc = require('grpc');
const structjson = require('./structjson.js');
const prompt = require('prompt');
const uuid = require('uuid-v4')
const sessionId = uuid();
const fs = require('fs');
const zipFolder = require('zip-dir');
const rimraf = require('rimraf');
const webhook = require('./webhook.js');

function DetectTextIntent(projectId, query, languageCode) {
    if (!query || !query.length) 
        return;

    // The path to identify the agent that owns the created intent.
    const sessionPath = sessionClient.sessionPath(projectId, sessionId);
    
    let promise;

    const request = {
        session: sessionPath,
        queryInput: {
            text: {
                text: query,
                languageCode: languageCode,
            },
        },
    };

    promise = sessionClient.detectIntent(request);

    return promise;
}

function DetectEventIntent(projectId, eventName, languageCode, params, context) {
    console.log(eventName, projectId, sessionId);
    // The path to identify the agent that owns the created intent.
    const sessionPath = sessionClient.sessionPath(projectId, sessionId);
    
    console.log(sessionPath);

    // The text query request.
    const request = {
        session: sessionPath,
        queryInput: {
            event: {
                name: eventName,
                parameters: structjson.jsonToStructProto(params || {}),
                languageCode: languageCode,
            },
        },
        queryParameters: {
            context: context
        }
    };
    
    return sessionClient.detectIntent(request);
}


function CreateEntityTypes(projectId, entities) {
    // Instantiates clients
    const entityTypesClient = new dialogflow.EntityTypesClient();
    const intentsClient = new dialogflow.IntentsClient();

    // The path to the agent the created entity type belongs to.
    const agentPath = intentsClient.projectAgentPath(projectId);

    const promises = [];

    entities.forEach(function(entity){

        var request = {
            parent: agentPath,
            entityType: entity
        };

        promises.push(
            entityTypesClient
            .createEntityType(request)
            .then(responses => {
                return responses[0];
            })
            .catch(error => {
                return error;
            })
        );
    });

    return Promise.all(promises);
}

function ListEntityTypes(projectId) {
    // Instantiates clients
    const entityTypesClient = new dialogflow.EntityTypesClient();
    const intentsClient = new dialogflow.IntentsClient();

    // The path to the agent the entity types belong to.
    const agentPath = intentsClient.projectAgentPath(projectId);

    // The request.
    const request = {
        parent: agentPath,
    };

    // Call the client library to retrieve a list of all existing entity types.
    return entityTypesClient
        .ListEntityTypes(request)
        .then(responses => {
            return responses[0];
        })
        .catch(err => {
            console.error('Failed to list entity types:', err);
        });
}

function ListIntents(projectId){
    const intentsClient = new dialogflow.IntentsClient();
    const agentPath = intentsClient.projectAgentPath(projectId);

    const request = {
        parent: agentPath
    };

    console.log(request);

    return intentsClient.listIntents(request)
        .then(responses => {
            return responses[0];
        })
        .catch(error => {
            console.error("Error ao acessar intenções", error);
        });

}

function ClearEntityTypes(projectId) {
    // List all entity types then delete all of them.
    return ListEntityTypes(projectId).then(entityTypes => {
        return Promise.all(
            entityTypes.map(entityType => {
                return DeleteEntityType(entityType);
            })
        );
    });
}

function GetIntent(projectId, intentName){
    return  ListIntents(projectId)
        .then(intents => {
            return intents.find(intent => {
                return intent.displayName == intentName;
            })
        });
}

function RegisterEntityTypes(projectId, entities){
    var promises = [];

    var findEntity = function(entity){
        return this.name == entity.name;
    };

    //Busca todos a entidades cadastradas no dialogflow e determina qual deve ser criada e qual deve ser atualizada
    return ListEntityTypes(projectId)
        .then(allEntities => {
            var toUpdate = [], toCreate = [];

            //deve-se verificar se é necessário atualizar a entidade, verificando se há diferença nos objetos
            entities.forEach(function(entity){
                var exists = allEntities.find(findEntity(entity));
                if(exists != null){
                    exists.entries = entity.entries;
                    toUpdate.push(exists);
                }
                else{
                    toCreate.push(entity);
                }
            });

            toUpdate.forEach(function(value){
                promises.push(UpdateEntityType(projectId, value));
            });

            if(toCreate.length)
                promises.push(CreateEntityTypes(projectId, toCreate));

            return Promise.all(promises);
        });
}

function DeleteEntityType(entityType) {
    // [START dialogflow_delete_entity]

    // Instantiates clients
    const entityTypesClient = new dialogflow.EntityTypesClient();

    // The request.
    const request = {
        name: entityType.name,
    };

    // Call the client library to delete the entity type.
    return entityTypesClient
        .deleteEntityType(request)
        .then(() => {
            console.log(`Entity type ${entityType.displayName} deleted`);
        })
        .catch(err => {
            console.error(`Failed to delete entity type ${entityType.displayName}:`,err);
        });
  // [END dialogflow_delete_entity]
}

function ShowEntityTypes(projectId) {
    // List all entity types then delete all of them.
    return ListEntityTypes(projectId).then(entityTypes => {
        return Promise.all(
            entityTypes.map(entityType => {
                return GetEntityType(entityType);
            })
        );
    });
}

function GetEntityType(entityType) {
    // Instantiates client
    const entityTypesClient = new dialogflow.EntityTypesClient();

    // The request.
    const request = {name: entityType.name};

    // Call the client library to retrieve an entity type.
    return entityTypesClient
        .getEntityType(request)
        .then(responses => {
            console.log('Found entity type:');
            return responses[0];
        })
        .catch(err => {
            console.error(`Failed to get entity type ${entityType.displayName}`, err);
        });
}

function UpdateEntityType(projectId, entityToUpdate) {
    // Instantiates client
    const entityTypesClient = new dialogflow.EntityTypesClient();

    // The path to the entity type to be updated.
    const entityTypePath = entityTypesClient.entityTypePath(projectId, entityToUpdate.id);

    // UpdateEntityType does full snapshot update. For incremental update
    // fetch the entity type first then modify it.
    const getEntityTypeRequest = {
        name: entityTypePath,
    };

    entityTypesClient
        .getEntityType(getEntityTypeRequest)
        .then(responses => {
            const entityType = responses[0];

            // Add a new entity foo to the entity type.
            entityType.entities = newValue;
            const request = {
                entityType: entityType,
            };

            return entityTypesClient.updateEntityType(request);
        })
        .then(responses => {
            console.log('Updated entity type:');
            return responses[0];
        })
        .catch(err => {
            console.error('Failed to update entity type', err);
        });
};

var RequestTextIntent = function(params){
    var result = {};
    //Verifica se algum frase foi informada
    if(!params.text || !params.text.length){
        result = {
            success: false,
            errorMessage: 'A frase não foi informada' 
        };

        return result;
    }

    //Verifica se a mensagem informada é uma ação interna
    var internalAction = GetInternalActions(params.text, params.lang);
    if(internalAction){
        result = {
            success: true,
            action: internalAction
        };

        return result;
    }


    //Retorna a requisição vinda do dialogFlow
    return  DetectTextIntent(params.projectId, params.text, params.lang);
}

var  proccessResponse = function(response, lang){
    var data = {
        audio: response.output_audio,
        message: response.queryResult.fulfillmentText,
        action: response.queryResult.action,
        queryText: response.queryResult.queryText, //Apenas para debug
        context: response.queryResult.outputContexts
    };

    var internalIntent = GetInternalActions(response.queryResult.queryText, lang || response.queryResult.languageCode);

    if(internalIntent){
        data.action = internalIntent;
        data.message = "";
    }
        

    //mapeia os parametros
    if(response.queryResult.parameters && response.queryResult.parameters.fields) {
        data.params = structjson.structProtoToJson(response.queryResult.parameters);
    }                

    var result = Object.assign({}, { success: true }, data)
    return result;
}


var Init = function(server){
    /************************* Criação das requisições ****************************/
    server.route('/dialogflow/import', function(res, req){
        res.render('dialogflow/import/index.html');
    });

    server.post("/event", function(req, res) {
        var params = {};
        Object.keys(req.body).forEach(key => {
            if(key == 'projectId' ||key == 'eventName' || key == 'lang')
                return;
            params[key] = req.body[key];
        });

        //Retorna a requisição vinda do dialogFlow
        let promise;
        promise = DetectEventIntent(req.body.projectId, req.body.eventName, req.body.lang, params, req.body.context);
        promise
            .then(response => {
                var result = proccessResponse(response[0], req.body.lang);
                res.json(result);
            }).catch(error => {
                console.log("erro ao detectar eventos");
                console.error(error);
                //res.json(Object.assign({},{success: true},error));
            });
    });

    server.post("/audio", function(req, res) {
        
        // The path to identify the agent that owns the created 
        
        const sessionPath = sessionClient.sessionPath(req.body.projectId, sessionId);

        const request = {
            session: sessionPath,
            queryInput: {
                audioConfig: {
                    audioEncoding: req.body.encoding ? req.body.encoding : 'AUDIO_ENCODING_LINEAR16',
                    languageCode: req.body.language,
                    phrase_hints: getInternalPhrases(req.body.language),
                },
            },
            inputAudio: req.body.audio,
            queryParameters: { 
                contexts: req.body.context || []
            }
        };

        sessionClient.detectIntent(request)
            .then(responses => {
                var result = proccessResponse(responses[0], req.body.language);
                res.json(result);
            })
            .catch(error => {
                var result = Object.assign({}, { success: false }, error);
                console.log('deu erro');
                res.json(result);
            });
    });

    server.post("/initial-message", function(req, res) {
        
        var intentName = req.body.intentName;

        let promise;
        promise = GetIntent(req.body.projectId, intentName);

        promise
            .then(intent => {
                res.json({
                    success: true,
                    initialMessage: intent.messages[0].text.text[0]
                });
            })
            .catch(error => {
                res.json(Object.assign({}, {success: false}, error));  
            });
    });

    server.post("/entity/register", function(req, res) {

        console.log(req.body);
        //Retorna a requisição vinda do dialogFlow
        let promise;
        promise = registerEntityTypes(req.body.projectId, req.body.entities);
        promise
            .then(response => {
                res.json(Object.assign({}, {success: true}, response));
            }).catch(error => {
                res.json(Object.assign({}, {success: true}, error));
            });
    });


    server.post("/entity/update", function(req, res) {

        //Retorna a requisição vinda do dialogFlow
        var promises = [];

        req.body.entitiesToUpdate.forEach(function(entityToUpdate){
            promises.push(updateEntityType(req.body.projectId, entityToUpdate.id, entityToUpdate.values));
        });

        Promise.all(promises)
            .then(response => {
                res.json(Object.assign({},{success: true},response));
            })
            .catch(error => {
                res.json(Object.assign({},{success: true},error));
            });

    });

    server.post("/entity/delete", function(req, res) {

        //Retorna a requisição vinda do dialogFlow
        var promises = [];

        req.body.entitiesToUpdate.forEach(function(entityToRemove){
            promises.push(deleteEntityType(entityToRemove));
        });

        Promise.all(promises)
            .then(response => {
                res.json(Object.assign({},{success: true},response));
            })
            .catch(error => {
                res.json(Object.assign({},{success: true},error));
            });
    });

    server.post("/dialogflow/import/proccess", function(req, res) {
        //Fazer a leitura do json com as entidade e intenções
        var langs = req.body.lang;
        var entities = req.body.entities;
        var intents = req.body.intents;

        //Criar os arquivos com os dados

        var tempName = uuid();
        var baseDir = './temp/' + tempName;
        fs.mkdirSync('./dialogflow/temp/' + tempName + '/entities'); //cria a pasta temporária para entidades
        fs.mkdirSync('./dialogflow/temp/' + tempName + '/intents'); //cria a pasta temporária para intenções

        //Crias os arquivo de acordo com as linguagens informadas
        langs.forEach(lang => {
            //Cria os arquivos com as entidades
            var keysEntities = Object.keys(entities[lang]);
            keysEntities.forEach(key => {
                //Determina o nome do arquivo de acordo com a linguagem
                var nameFile = lang == 'en' ? key : (key + '_entries_' + lang.toLowerCase());
                var json = JSON.stringify(entities[lang][key], null, '\t');
                fs.writeFile(baseDir + '/entities/' + nameFile + '.json', json, 'utf8');
            });

            //Cria os arquivos com as intenções
            var keysIntents = Object.keys(intents[lang]);
            keysIntents.forEach(key => {
                //Determina o nome do arquivo de acordo com a linguagem
                var nameFile = lang == 'en' ? key : (key + 'usersays' + lang.toLowerCase());
                var json = JSON.stringify(entities[lang][key], null, '\t');
                fs.writeFile(baseDir + '/entities/' + nameFile + '.json', json, 'utf8');
            });
        });

        //Cria o json do agente e do package
        fs.writeFile(baseDir + '/agent.json', JSON.stringify(req.body.agent, null, '\t'), 'utf8');
        fs.writeFile(baseDir + '/package.json', JSON.stringify({version: "1.0.0"}, null, '\t'), 'utf8');

        //Compacta toda a pasta temporária
        zipdir(baseDir, function (err, buffer) {
            if(err){
                //Se deu algum erro, exibe o motivo e apaga o arquivo
                console.log(err);
            }

            restoreAgent(req.body.projectId, buffer)
            .then(() =>{
                console.log("projeto importado com sucesso");
            })
            .finnaly(() => {
                //Remove o diretório ao final do processo
                rimraf('/some/directory', function () { console.log('done'); });
            });
        });

        //faze a requisição com o dialogflow

        //Retorna a requisição vinda do dialogFlow. Remove a pasta temporária e o arquivo compatado no fim da requisição
        var promises = [];

        req.body.entitiesToUpdate.forEach(function(entityToRemove){
            promises.push(deleteEntityType(entityToRemove));
        });

        Promise.all(promises)
            .then(response => {
                res.json(Object.assign({},{success: true},response));
            })
            .catch(error => {
                res.json(Object.assign({},{success: true},error));
            });
    });

    webhook.Init(server);
}

/************************* Apoio para o DialogFlow Plugin ****************************/
const appActions = 
{

    ChangeLanguage: 
    {
        "pt-BR": ["Mudar linguagem para Inglês"],
        "en-US": ["Change language to Portuguese"]
    },

    OptionsView:
    {
        "pt-BR": ["Minhas opções", "O que posso fazer", "Opções", "Onde estou"],
        "en-US": ["My options", "What do I do", "Options", "Where I am"]
    },

    Repeat: 
    {
        "pt-BR": ["Repetir", "Repita", "Fale novamente"],
        "en-US": ["Repeat"]
    },

    NextItem: 
    {
        "pt-BR": ["Ir para o próximo", "Próximo", "Próximo Item", "Avançar", "Para o próximo"],
        "en-US": ["Next", "Next Item"]
    },

    PrevItem: 
    {
        "pt-BR": ["Para o anterior", "Ir para o anterior", "Anterior", "Item anterior", "Voltar"],
        "en-US": ["Previous"]
    },

    CheckItem: 
    {
        "pt-BR": ["Marcar", "Marcar item", "Marcar esse", "Marcar este"],
        "en-US": ["Check", "Check item", "check this"]
    },

    UncheckItem: 
    {
        "pt-BR": ["Desmarcar", "Desmarcar item", "Desmarcar esse", "Desmarcar este"],
        "en-US": ["Uncheck", "Uncheck item", "Uncheck this"]
    },

    SelectItem: 
    {
        "pt-BR": ["Selecionar", "Selecionar item", "Selecionar esse", "Selecionar este"],
        "en-US": ["Select", "Select item", "select this"]
    },
};

function getInternalPhrases(lang){
    var phrases = [];

    Object.keys(appActions).forEach(key => {
        phrases.push(appActions[key][lang]);
    });

    return phrases;
}

function restoreAgent(projectId, data) {
    // Instantiates agent client
    const agentsClient = new dialogflow.AgentsClient();

    const agentPath = agentsClient.projectPath(projectId);

    // construct restore agent request
    const request = {
        agentContent: data,
        parent: agentPath,
    };

    agentsClient.restoreAgent(request).catch(err => {
        console.error(err);
    });
}


function GetInternalActions(text, lang){
    console.log(text, lang);
    var textUpper = text.toUpperCase();
    //Retorna todas as propriedades do objeto
    var keys = Object.keys(appActions);
    for(var i in keys) {
        var propertyName = keys[i];

        //Busca o textos referente a ação
        var action = appActions[propertyName][lang];
        
        for(var j in action){
            //Verifica se o texto informado é igual ao texto 
            if(textUpper == action[j].toUpperCase())
                return propertyName;
        }
    }

    return null;
}

module.exports = {
    RequestTextIntent,
    Init
};