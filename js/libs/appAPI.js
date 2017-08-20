
'use strict';

var appApi = null;
var ActionAPI = window.ActionAPI || {};

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    
    var replacer = function(match){
        return "\\" + match;
    };

    var reg = new RegExp(search.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, replacer), 'g');
    
    var result = target.replace(reg, replacement);
    return target.replace(reg, replacement);
};

Number.prototype.formatMoney = function(places, symbol, thousand, decimal) {
    places = !isNaN(places = Math.abs(places)) ? places : 2;
    symbol = symbol !== undefined ? symbol : appApi.currentLanguage == "pt-BR" ? "R$" : "US$";
    thousand = thousand || appApi.currentLanguage == "pt-BR" ? "." : ",";
    decimal = decimal || appApi.currentLanguage == "pt-BR" ? "," : ".";
    var number = this, 
        negative = number < 0 ? "-" : "",
        i = parseInt(number = Math.abs(+number || 0).toFixed(places), 10) + "",
        j = (j = i.length) > 3 ? j % 3 : 0;
    return symbol + negative + (j ? i.substr(0, j) + thousand : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) + (places ? decimal + Math.abs(number - i).toFixed(places).slice(2) : "");
};

Date.prototype.isValid = function () {
    // An invalid date object returns NaN for getTime() and NaN is the only
    // object not strictly equal to itself.
    return this.getTime() === this.getTime();
}; 

ActionAPI.SpeechAction = function(conf){
    //Acesso ao API.ai
    //SERVER_PROTO : 'wss',
    //SERVER_DOMAIN:  'api-ws.api.ai',
    //SERVER_PORT:  '4435',
    //SERVER_VERSION:  '20150910',
    //READING_INTERVAL: 1000
    //ACCESS_TOKEN:  '1351a6de0c914e3fbf3a2e9d5522f680',
    //LANG:  'pt-BR',
    //TIME_ZONE : 'GMT+3',
    this.ServerProto = "wss";
    this.ServerDomain = "api-ws.api.ai";
    this.ServerPort = "4435";
    this.ServerVersion = "20150910";
    this.tokens = conf.tokens;
    this.defaultLanguage = conf.defaultLanguage;
    this.validsLanguages = ['pt-BR', 'en-US'];
    this.messagesInterface = {},
    this.titles = {
        "pt-BR":[],
        "en-US":[]
    }

    this.languages = [
        { 
            name: 'pt-BR', 
            timezone: 'GMT+3', 
            alias: 
            {
                "pt-BR": "Português",
                "en-US": "Brazilian Portuguese"
            }
        },
        { 
            name: 'en-US', 
            timezone: 'GMT+6',
            alias: 
            {
                "pt-BR": "Inglês",
                "en-US": "English"
            }
        },
    ];

    this.appActions = 
    {

        changeLanguage: 
        {
            "pt-BR": ["Mudar linguagem para Inglês"],
            "en-US": ["Change language to Portuguese"]
        },

        nextItem: 
        {
            "pt-BR": ["Próximo", "Próximo Item", "Avançar"],
            "en-US": ["Next", "Next Item"]
        },

        prevItem: 
        {
            "pt-BR": ["Anterior", "Item anterior", "Voltar"],
            "en-US": ["Previous"]
        },

        checkItem: 
        {
            "pt-BR": ["Marcar", "Marcar item", "Marcar esse", "Marcar este"],
            "en-US": ["Check", "Check item", "check this"]
        },

        uncheckItem: 
        {
            "pt-BR": ["Desmarcar", "Desmarcar item", "Desmarcar esse", "Desmarcar este"],
            "en-US": ["Uncheck", "Uncheck item", "Uncheck this"]
        },

        selectItem: 
        {
            "pt-BR": ["Selecionar", "Selecionar item", "Selecionar esse", "Selecionar este"],
            "en-US": ["Select", "Select item", "select this"]
        },
    };
    

    //Controle de audio capitado do microfone
    this.audioContext = null;

    //Rensável por transforma o audio em blob
    this.recorder = null;

    //Faz a comunicação com o API.ai
    this.apiAi = null;

    //Chave para fazer a comunicação com o Cloud Speech
    this.googleSpeechKey = 'AIzaSyC4oqjriZB1lLFSfNQyvLnXa43s8nGRoW4';

    // Url onde deverá ser feito o Ajax
    this.googleSpeechURL = 'https://speech.googleapis.com/v1beta1/speech:syncrecognize?key=' + this.googleSpeechKey;

    this.sessionId = null;

    this.isProcessing = false;

    //intenções cadastradas no API.ai
    this.intents = {};

    //Entidades cadastradas no API.ai
    this.entities = JSON.parse(localStorage.getItem('entities'));



    //Internacionalização

    this.defaultLanguage = "pt-BR";

    //Atual linguamge usada no sistema
    this.currentLanguage = this.defaultLanguage;
    /*
    Mensagem de erro: errorMessage[lang][key][widget-name]
    */
    this.errorMessage = { "pt-BR" :[], "en-US": [] };

    /*
    Mensagem de ajuda: helpMessage[lang][widget-name]
    */
    this.helpMessage = { "pt-BR" :[], "en-US": [] };

    /*
    Mensagem ao receber o foco: ttsMessage[lang][widget-name]
    */
    this.ttsMessage = { "pt-BR" :[], "en-US": [] };

    /*
        Títulos dos elementos
    */
    this.titleMessage = { "pt-BR" :{}, "en-US": {} };

    /*
    Todas as interfaces abstratas. Será usado para buscar os dados
    */
    this.abstracts = null;

    /*
        Widgets WAI que foram usados para montagem das interfaces;
    */
    this.widgets = [];

    this.MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
    this.observer = null;
};

/*
    Gera um Id para ser usado no API.ai
*/
ActionAPI.SpeechAction.prototype.GenerateId = function(length) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

/*
    Enviar uma query para ser executada no API.ai
    @query: fala em formato de texto informado pelo usuário
    @contexts: contextos a serem usados no API.ai
*/
ActionAPI.SpeechAction.prototype.SendJson = function(query, contexts){
    var queryJson = {
        "v": this.ServerVersion,
        "query": query,
        "timezone": this.GetTimeZone(),
        "lang": this.currentLanguage,
        "contexts" : contexts,
        "sessionId": this.sessionId
    };

    this.apiAi.sendJson(queryJson);
};

/*
    Transforma um texto em fala
    @text: texto a ser transoformado em fala
*/
ActionAPI.SpeechAction.prototype.tts = function(text){
    var _this = this;
    var getVoice = function(){
        switch(_this.currentLanguage){
            case "pt-BR": return "Brazilian Portuguese Female";
            case "en-US": return "UK English Female"; 
        }
    }

    responsiveVoice.speak(text, getVoice());    
}

/*
    Inicia a gravação de um áudio
*/
ActionAPI.SpeechAction.prototype.startRecording = function(){
    //if(this.isProcessing)
    //    return;
    var _this = this;
    try{
        _this.recorder.start();    
    }catch(e){

    }
};


/*
    Criar um instância para a captação de audio
*/
ActionAPI.SpeechAction.prototype.InitRecorder = function(){
    var _this = this;
    _this.recorder = new (window.SpeechRecognition || window.webkitSpeechRecognition 
                            || window.mozSpeechRecognition || window.msSpeechRecognition)();

    _this.recorder.continuous = true;
    _this.recorder.interimResults = false;
    this.recorder.maxAlternatives = 1;
    _this.recorder.lang = _this.currentLanguage;
    _this.final_transcript = '';

    _this.recorder.onresult = function(event){
        console.log(this);

        var interim_transcript = '';
        for (var i = event.resultIndex; i < event.results.length; ++i) {
            console.log(event.results[i]);
            if (event.results[i].isFinal) {
                _this.final_transcript += event.results[i][0].transcript;
            } else {
                interim_transcript += event.results[i][0].transcript;
            }
        }
        
        if(_this.final_transcript.length > 0){
            //Verifica se o comando foi para alterar a linguagem;
            console.log(_this.final_transcript.trim())
            if(!_this.IsAppAction(_this.final_transcript.trim())){
                _this.apiAi
                    .textRequest(_this.final_transcript.trim())
                    .then(_this.OnApiResult)
                    .catch(function(error){
                        console.log(error);
                    });
            }
            
            _this.final_transcript = '';
        }
    };

    _this.recorder.onstart = function(event){
        //console.log('iniciou o recorder');
    };

    _this.recorder.onerror = function(event){
        if(event.error == "not-allowed"){
            if(_this.recorder){
                _this.recorder.canDestroy = true;
                _this.recorder = null;    
            }

            return;
        }

        _this.InitRecorder();
    };

    _this.recorder.onend = function(event){
        if(_this.recorder && !_this.recorder.canDestroy)
            _this.startRecording();
    }

    _this.recorder.start();
}


/*
    Criar um instância de comunicação com o API.ai
*/
ActionAPI.SpeechAction.prototype.InitAPIAi = function(){
    var _this = this;

    /*Funções padrão */
    if (_this.recorder) {
        _this.recorder.canDestroy = true;
        _this.recorder.stop();
    }

    _this.apiAi = new ApiAi.ApiAiClient({ 
        accessToken: _this.tokens[_this.currentLanguage], 
        lang: _this.currentLanguage == "en-US" ? "en" : _this.currentLanguage
    });

    _this.InitRecorder();
}


ActionAPI.SpeechAction.prototype.AjaxCurl = function(url, type, callback, data, token){
    var _this = this;
    return $.ajax({
        url: url,
        beforeSend: function(xhr) { 
          xhr.setRequestHeader("Authorization", "Bearer " + (token ? token : _this.tokens[_this.currentLanguage]));
        },
        type: type,
        crossDomain: true,
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        processData: false,
        data: data ? JSON.stringify(data) : undefined,
        success: callback,
        
        error: function(err){
          //console.log(err);
        }
    });
}

ActionAPI.SpeechAction.prototype.RegisterEntityByLanguage = function(entityValues, lang){
    var _this = this;
    var urlBase = 'https://api.api.ai/v1/entities%s?v=20150910';
    var valuesToSave = entityValues[lang];
    var token = _this.tokens[lang];

    if(!valuesToSave.entries.length)
        return;

    _this.AjaxCurl(sprintf(urlBase,""), "GET", function(data){
        var exists = _.find(data, function(x){ return x.name == valuesToSave.name; })
        var type = "POST";
        if(exists){
            type = "PUT";
            valuesToSave.id = exists.id;
        }

        urlBase = exists ? sprintf(urlBase,'/' + exists.id) : sprintf(urlBase,'');            

        _this.AjaxCurl(urlBase, type, function(data){
            console.log('entidades registradas com sucesso');
        }, valuesToSave, token);
    }, undefined, token);

}

ActionAPI.SpeechAction.prototype.RegisterEntity = function(entityValues){
    var _this = this;
    $.ajaxSetup({ async: false });
    _this.RegisterEntityByLanguage(entityValues, "pt-BR");
    _this.RegisterEntityByLanguage(entityValues, "en-US");
    $.ajaxSetup({ async: true });
}

/*
    Sempre que um elemento ganhar focus, busca qual texto deve ser falado de acordo com os dados atuais do widget abstrado
    @$element: Elemment
*/
ActionAPI.SpeechAction.prototype.SetTTSOnFocus = function(widgetName) {
    var widget = _.find(this.abstracts, function(x){
        return widgetName == $element.prop('id');
    });

    var $data = widget.get('data');
    var name = widget.get('name');

    var tts = _this.ttsMessage[this.currentLanguage][name];
    tts = tts.indexOf("$data" != -1) ? tts = eval(tts) : tts;

    appApi.tts(tts);
};

ActionAPI.SpeechAction.prototype.GetTimeZone = function() {
    var current = this.currentLanguage;
    var language = _.find(this.languages, function(x){ return x.name == current });
    return language != null ? language.timezone : null;
};

/*
    Configura o observer para mudar os valores dos títulos de acordo com a linguagem atual do sistema
*/
ActionAPI.SpeechAction.prototype.ConfigureObserver = function(){
    var _this = this;
    _this.observer = new MutationObserver(function(mutations){
        if (mutations[0].type == "attributes") {
            //Passa por todos os widgts WAI-Content e altera a título
            _.each(_this.widgets, function(widget){
                if(_.isFunction(widget.update))
                    widget.update();
            });
        }
    });

    _this.observer.observe(
        $("html")[0], 
        { 
            attributes: true, 
            attributeFilter: ['lang'] 
        }
    );
};

/*
    Inicia a aplicaçao permitindo o controle por voz
*/
ActionAPI.SpeechAction.prototype.Init = function() {
    this.sessionId = this.GenerateId(32);
    //this.InitRecorder();
    this.InitAPIAi();
    this.ConfigureObserver();
};

//Métodos a serem executados pelo APP
ActionAPI.SpeechAction.prototype.nextItem = function(){
    var currentElement = $(document.activeElement);
    var index = currentElement.index();
    var parent = currentElement.parent();
    var allChildren = parent.children();
    var children = parent.children('div:visible, blockquote:visible, a:visible, li:visible, section:visible');
    
    index = allChildren.length == (index - 1) ? 0 : index + 1;

    while(!$(allChildren[index]).is('div:visible, blockquote:visible, a:visible, li:visible, section:visible')){
        index = allChildren.length == (index - 1) ? 0 : index + 1;
    }

    var next = allChildren[index];
    next.focus();
};

ActionAPI.SpeechAction.prototype.prevItem = function(){
    var currentElement = $(document.activeElement);
    var parent = currentElement.parent();
    var index = currentElement.index();
    var children = parent.children('div:visible, blockquote:visible, a:visible, li:visible, section:visible');
    var allChildren = parent.children();
    
    index = index == 0 ? allChildren.length-1 : index - 1;

    while(!$(allChildren[index]).is('div:visible, blockquote:visible, a:visible, li:visible, section:visible')){
        index = index ==  0 ? allChildren.length-1 : index - 1;
    }

    var prev = allChildren[index];
    prev.focus();
};

ActionAPI.SpeechAction.prototype.selectItem = function(){
    var currentElement = $(document.activeElement);
    
    if(!currentElement.length){
        _this.speak("Não há nenhum item focalizado para ser selecionado");
        return;
    }

    currentElement.click();
};

ActionAPI.SpeechAction.prototype.checkItem = function(){
    var currentElement = $(document.activeElement);
    if(currentElement.is('input')){
        currentElement.prop('checked', true).change(); 
    }else{
        currentElement.find('input').prop('checked', true).change();
    }
};

ActionAPI.SpeechAction.prototype.uncheckItem = function(){
    var currentElement = $(document.activeElement);
    if(currentElement.is('input')){
        currentElement.prop('checked', false).change(); 
    }else{
        currentElement.find('input').prop('checked', false).change();
    }
};

ActionAPI.SpeechAction.prototype.changeLanguage = function(){
    this.currentLanguage = this.currentLanguage == "pt-BR" ? "en-US" : "pt-BR";
    var text = this.currentLanguage == "pt-BR" ? "A linguagem foi alterada para Português." : "The current Language is English.";
    document.documentElement.lang = this.currentLanguage;
    
    //Api.ai
    this.InitAPIAi();
    //this.InitRecorder();


    this.tts(text);
    appApi.tts(this.messagesInterface[this.currentInterface][this.currentLanguage]);
    //document.documentElement.lang = this.currentLanguage;
};

ActionAPI.SpeechAction.prototype.executeCommand = function(action, params){
    if(typeof(window[action]) != "undefined"){
        window[action](params);
        return;
    }

    try{
        eval(action + ';');
    }catch(ex){
        console.error(ex);
    }
};

ActionAPI.SpeechAction.prototype.setValue = function(params){
    var formatDate = function(date){
        var day = date.getDate();
        var month = date.getMonth() + 1;
        var year = date.getFullYear();

        var dayString = day < 10 ? '0' + day.toString() : day.toString();
        var monthString = month < 10 ? '0' + month.toString() : month.toString();

        var result = dayString + '-' + monthString + '-' + year;
        console.log(result);
        return result;
    }

    for(var key in params){
        
        var value = params[key];
        
        var $input = $('#'+ key);
        var input = $input[0];
        
        console.log(input.validation(value));
        var validate = input.validation(value);

        if(!validate.success){
            var errorMessage = typeof(input.errorMessage) == "string" ? input.errorMessage :
                                _.find(input.errorMessage, function(error) { error.name == validate.error}) || input.errorMessage[0];

            return errorMessage + ' ' + input.helpMessage || '';
        }   

        if($input.is("select")){
            var option = $input.find("option").filter(function(){ return $(this).html() == value; });

            if(option.length){
                $input.val(option.val());
            }
        }
        else{
            $input.val(value);    
        }
        
        $input.change();
        //$('#'+ key).val(value);
    }

    return true;
};

ActionAPI.SpeechAction.prototype.confirmForm = function(){
    $('form').submit();
};

ActionAPI.SpeechAction.prototype.requestFocus = function(params){
    var value = params['container'];

    var $container = $('#' + value);
    if(!$container.length){
        console.log("Não encontrou o container para setar o foco.");
        return;
    }

    $container.focus();
    
    setTimeout(function(){
        var children = $container.children('div:visible, blockquote:visible, a:visible, li:visible, section:visible');
        if(children.length >= 1){
            $(children[0]).focus();
        }
    },0)
    
};

ActionAPI.SpeechAction.prototype.IsAppAction = function(text){
    var _this = this;
    
    for(var key in _this.appActions){
        var isAction = _.find(_this.appActions[key][_this.currentLanguage], function(x){ return x.toUpperCase() == text.toUpperCase(); });
        
        if(isAction){
            _this.ExecuteAppAction(key);
            return true;
        }
    }

    return false;
}

ActionAPI.SpeechAction.prototype.OnApiResult = function(data){
    var _this = appApi;
    console.log("> ON RESULT");
    //console.log(data);
    var status = data.status;
    var code;
    var responseSpeech;

    if (!(status && (code = status.code) && isFinite(parseFloat(code)) && code < 300 && code > 199)) {
        _this.tts("Houve um erro ao processar a fala. Tente novamente.")
        return;
    }

    responseSpeech = (data.result.fulfillment) ? data.result.fulfillment.speech : data.result.speech;

    if(data.result.action != 'input.unknown' && data.result.action != 'Fallback' && !data.result.actionIncomplete ) {
        var action = data.result.action.toUpperCase();
         switch(action){
            case 'SETVALUE':
                var messageError = _this.setValue(data.result.parameters);
                if(messageError.length)
                    responseSpeech = messageError;

                break;

            case 'SUBMIT':
                _this.confirmForm();
                break;

            case 'REQUESTFOCUS':
                _this.requestFocus(data.result.parameters);
                break;

            default:
                _this.executeCommand(data.result.action, data.result.parameters);
                break;
        }
    }

    // Use Text To Speech service to play text.
    if(responseSpeech){
        _this.tts(responseSpeech);
    }
};

ActionAPI.SpeechAction.prototype.ExecuteAppAction = function(action){
    var _this = this;
    switch(action){
        case "changeLanguage": 
            _this.changeLanguage();
            break;
        case "nextItem": 
            _this.nextItem();
            break;

        case "prevItem": 
            _this.prevItem();
            break;

        case "checkItem": 
            _this.checkItem();
            break;

        case "uncheckItem": 
            _this.uncheckItem();
            break;

        case "selectItem": 
            _this.selectItem();
            break;
    }
};

ActionAPI.SpeechAction.prototype.RegisterTitle = function(title, abstractName, $context) {
    var $data, $bind, $dataObj, $env;
    if($context != null){
        $data = $context.$data; $bind = $context.$bind; $dataObj = $context.$dataObj;  $env = $context.$env;
    }
    if(title && appApi){
        var matches = title.match(/(\$\w+\.\w+)|(\$\w+)\w+/g);
        if(matches != null){
            title = eval(title);
        }

        if(_.isObject(title) && title["pt-BR"]){
            console.log(this.titles["pt-BR"][abstractName]);
            
            if(!this.titles["pt-BR"][abstractName].includes(title["pt-BR"]));
                this.titles["pt-BR"][abstractName].push(title["pt-BR"]);

            if(!this.titles["en-US"][abstractName].includes(title["en-US"]));
                this.titles["en-US"][abstractName].push(title["en-US"]);

        }
        else if(_.isString(title)){

            if(!this.titles["pt-BR"][abstractName].includes(title));
                this.titles["pt-BR"][abstractName].push(title);

            if(!this.titles["en-US"][abstractName].includes(title));
                this.titles["en-US"][abstractName].push(title);
        }
    }
};


ActionAPI.SpeechAction.prototype.SpeakInitialMessage = function(titleInterface, abstractName){
    //Verifica se já não há uma mensagem criada
    var messages = {
        "pt-BR": this.titleMessage["pt-BR"][abstractName],
        "en-US": this.titleMessage["en-US"][abstractName]
    };

    if(messages[this.currentLanguage] && messages[this.currentLanguage].length){
        this.tts(messages[this.currentLanguage]);
        return;
    }

    //Cria uma mensagem com base nos parâmetros passados
    var initialMessage = {
        "pt-BR": "Você está em %s. %s O que deseja?",
        "en-US": "You are in %s. %s What do you want?"
    };

    var titles = this.titles[appApi.currentLanguage][abstractName];
    
    var messageOptions = {
        "pt-BR": "As opções são: %s.",
        "en-US": "The options are: %s."
    };

    var options = {
        "pt-BR": "",
        "en-US": ""
    };

    var filter = function(value){
        return value.length;
    }

    if(titles.length){
        options["pt-BR"] = sprintf(messageOptions["pt-BR"], this.titles["pt-BR"][abstractName].filter(filter).join(", "));
        options["en-US"] = sprintf(messageOptions["en-US"], this.titles["en-US"][abstractName].filter(filter).join(", "));
    }
    console.log(options);

    var text = {
        "pt-BR": sprintf(initialMessage[this.currentLanguage], titleInterface["pt-BR"], options["pt-BR"]),
        "en-US": sprintf(initialMessage[this.currentLanguage], titleInterface["en-US"], options["en-US"])
    }
    

    this.titleMessage["pt-BR"][abstractName] = text["pt-BR"];
    this.titleMessage["en-US"][abstractName] = text["en-US"];

    this.tts(text[this.currentLanguage]);
}


