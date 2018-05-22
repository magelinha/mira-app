
'use strict';

//Configura o append do jquery para gerar um evento
(function($) {

    var origAppend = $.fn.append;

    $.fn.append = function () {
        return origAppend.apply(this, arguments).triggerHandler("append");
    };
})(jQuery);

var encodedString = function(object){
    var encodedString = '';
    for (var prop in object) {
        if (object.hasOwnProperty(prop)) {
            if (encodedString.length > 0) {
                encodedString += '&';
            }
            encodedString += encodeURI(prop + '=' + object[prop]);
        }
    }
    return encodedString;
}


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

window.textCurrency = function(param){
    var value = parseFloat(param);

    var intPart = Math.trunc(value);
    var decimalPart = value % 1;
    decimalPart = decimalPart.toFixed(2);
    decimalPart = decimalPart > 0 ? Number(String(decimalPart).split('.')[1]) : 0;
    
    var text = {
        "pt-BR" : "",
        "en-US" : ""
    };

    if(intPart == 1){
        text["pt-BR"] += intPart + " real";
        text["en-US"] += intPart + " dollar";
    }
    else if(intPart > 1){
        text["pt-BR"] += intPart + " reais";
        text["en-US"] += intPart + " dollars";    
    }

    if(intPart > 0 && decimalPart > 0){
        text["pt-BR"] += " e ";
        text["en-US"] += " and ";    
    }

    if(decimalPart == 1){
        text["pt-BR"] += decimalPart + " centavo";
        text["en-US"] += decimalPart + " cent";
    }
    else if(decimalPart > 1){
        text["pt-BR"] += decimalPart + " centavos";
        text["en-US"] += decimalPart + " cents";    
    }

    return text[appApi.currentLanguage];
};

window.textBoolean = function(value){
    return value ? "Sim" : "Não";
};

Date.prototype.isValid = function () {
    // An invalid date object returns NaN for getTime() and NaN is the only
    // object not strictly equal to itself.
    return this.getTime() === this.getTime();
};

ActionAPI.SpeechAction = function(conf){
    this.projectId = conf.projectId;
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

    this.canTTS = true;

    this.limitRecorder = 5;

    //Controle de audio capitado do microfone
    this.audioContext = null;
    this.audioStream = null;

    //Renponsável por transformar o audio em blob
    this.recorder = null;

    this.lastText = '';

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
    this.speak = null;
    this.currentContext = [];
};

/*
    Transforma um texto em fala
    @text: texto a ser transoformado em fala
*/
ActionAPI.SpeechAction.prototype.tts = function(text){
    var _this = this;
    if(!text.length || !this.canTTS)
        return;


    if(this.recorder){
        _this.stopRecording(false);
    }
    else{
        console.log('ainda não carregou o recording');
    }

    _this.lastText = text;

    speechRs.speechinit('Google português do Brasil',function(e){
        speechRs.speak(text, function() {
            if(_this.recorder){
                _this.startRecording();
            }
                
        }, false);     
     });
}

ActionAPI.SpeechAction.prototype.startRecording = function(){
    var _this = this;

    _this.recorder.record();

    console.log('iniciou a gravação');    

    setTimeout(function(){
        console.log('parou a gravação');
        _this.stopRecording(true);

    }, 4500);
};

ActionAPI.SpeechAction.prototype.stopRecording = function(toExport) {
    var _this = this;
    _this.recorder.stop();

    if(toExport) {
        //Cria a requisição
        _this.recorder.exportMonoWAV(function(blob){

            var reader = new FileReader;
            reader.onload = function(file){
                var audio = btoa(file.target.result);
                var config = {
                    rate: _this.audioContext.sampleRate,
                    audio: audio,
                    projectId: _this.projectId,
                    language: _this.currentLanguage,
                    context: _this.currentContext
                };
                
                _this.AjaxRequest('POST', '/audio', config, null,  function(data){
                    /*
                    *Aqui será recebido um objeto no modelo 
                    *{
                    *   action: '',
                    *   message: '',
                    *   params: {},
                    *   queryText: ''
                    *}
                    */
                    
                    //Caso tenha falado algo, seta a contexto do resultado
                    if(data.queryText && data.queryText.length){
                        _this.currentContext = data.context
                    }


                    if (data.success && data.action && data.action.length)
                        _this.executeCommand(data.action, data.params);
                        
                    
                    data.message.length ? _this.tts(data.message) : _this.startRecording();
                });
            };

            reader.readAsBinaryString(blob);
        }, "audio/wav");

        _this.recorder.clear();
    } 
};

/*
    Criar um instância para a captação de audio
*/
ActionAPI.SpeechAction.prototype.InitRecorder = function(){
    var _this = this;

    navigator.mediaDevices
        .getUserMedia({video:false, audio: true})
        .then(stream => {
            this.audioContext = new AudioContext();
            _this.audioStream = stream;
            var mic = _this.audioContext.createMediaStreamSource(stream);
            _this.recorder = new Recorder(mic, {
                workerPath: 'js/libs/recorderWorker.js'
            });    
        })
        .catch(error => {
            console.log(error);
        });
}

ActionAPI.SpeechAction.prototype.CallRequestQuery = function(text){
    var _this = this;
    var data = {
      projectId: _this.projectId,
      lang: _this.currentLanguage,
      text: text  
    };
    
    _this.AjaxRequest('POST', '/query', data, null, _this.OnApiResult);
}

ActionAPI.SpeechAction.prototype.CallRequestEvent = function(eventName, params){
    var _this = this;
    var data = {
      projectId: _this.projectId,
      lang: _this.currentLanguage,
      eventName: eventName,
      context: _this.currentContext
    };

    if(params){
        data = Object.assign({}, data, params);
    }
    
    _this.AjaxRequest('POST', '/event', data, null, function(response){
        if (response.success && response.action && response.action.length)
            _this.executeCommand(response.action, response.params);
            
        if(response.message && response.message.length)
            _this.tts(response.message);
    });
}


ActionAPI.SpeechAction.prototype.AjaxRequest = function(method, url, data, config, callback) {
    var configBase = {
        url: url,
        type: method,
        data:data,
        success: function(data){
            if(callback)
                callback(data);
        },

        error: function(err){
            console.log(err);
        }
    };

    if(config)
        configBase = _.extend(configBase, config);

    $.ajax(configBase);
}

ActionAPI.SpeechAction.prototype.RegisterEntity = function(entityValues){
    
    var _this = this;
    var findEntity = function(entity){
        return this.name == entity.name;
    }

    var entitiesToRegister = entityValues["pt-BR"];

    var entitiesUS = entityValues["en-US"] && entityValues["en-US"].length >= 0 ? entityValues["en-US"] : [];
    entitiesUS.forEach(function(entity){
        var exists = entitiesToRegister.find(findEntity(entity));
        if(exists){
            Array.prototype.push.apply(exists.synonys, entity.synonys);
            exists.synonys.push(entity.value);
        }
    });

    var request = {
        entities: entitiesToRegister,
        projectId: _this.projectId
    };

    console.log(request);

    _this.AjaxRequest('POST', '/entity/register', request, null, function(data){
        if(data.success){
            console.log('entidades salvas com sucesso.');
        }
        else{
            console.log('erro ao salvar entidades: ', data);
        }
    });
    
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
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

    this.ConfigureObserver();
    this.InitRecorder();

    //Configura para desativar o tts via comando do teclado
    $(document).keydown(function(e){
        if(e.ctrlKey && e.altKey && e.which == 84){
            console.log("mudou o estado do canTTS");
            appApi.canTTS = !appApi.canTTS;
        }
    });
};

ActionAPI.SpeechAction.prototype.InitialMessage = function(welcomeEvent) {
    var _this = this;
    _this.CallRequestEvent(welcomeEvent);
}

//Métodos a serem executados pelo APP
window.NextItem = function(){
    var currentElement = $(document.activeElement);
    var index = currentElement.index();
    var parent = currentElement.parent();
    var allChildren = parent.children();
    var children = parent.children('div:visible, blockquote:visible, a:visible, li:visible, section:visible, tr:visible');
    
    index = allChildren.length == (index - 1) ? 0 : index + 1;

    while(!$(allChildren[index]).is('div:visible, blockquote:visible, a:visible, li:visible, section:visible, tr:visible')){
        index = allChildren.length == (index - 1) ? 0 : index + 1;
    }

    var next = allChildren[index];
    next.focus();
};

window.PrevItem = function(){
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

window.SelectItem = function(){
    var currentElement = $(document.activeElement);
    
    if(!currentElement.length){
        _this.speak("Não há nenhum item focalizado para ser selecionado");
        return;
    }

    currentElement.click();
};

window.CheckItem = function(){
    var currentElement = $(document.activeElement);
    if(currentElement.is('input')){
        currentElement.prop('checked', true).change(); 
    }else{
        currentElement.find('input').prop('checked', true).change();
    }
};

window.UncheckItem = function(){
    var currentElement = $(document.activeElement);
    if(currentElement.is('input')){
        currentElement.prop('checked', false).change(); 
    }else{
        currentElement.find('input').prop('checked', false).change();
    }
};

window.ChangeLanguage = function(){
    this.currentLanguage = this.currentLanguage == "pt-BR" ? "en-US" : "pt-BR";
    var text = this.currentLanguage == "pt-BR" ? "A linguagem foi alterada para Português." : "The current Language is English.";
    document.documentElement.lang = this.currentLanguage;

    this.tts(text);
    appApi.tts(this.messagesInterface[this.currentInterface][this.currentLanguage]);
};

window.Repeat = function(){
    var text = this.lastText.length ? this.lastText : "Não há fala para ser repetida.";
    this.tts(this.lastText);
};

window.SetValue = function(params){
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
        //var input = $input[0];

        if($input.is("select")){
            //Se não passar um valor, desconsidera o setValue
            if(!value || !value.length)
                return;
                
            var option = $input.find("option").filter(function(){
                var valueOption =  $(this).html().toUpperCase();
                return valueOption == value.toUpperCase(); 
            });
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

window.ConfirmForm = function(params){
    $('form').submit();
};

window.RequestFocus = function(params){
    console.log(params);
    var value = params['container'];

    var $container = $('#' + value);
    if(!$container.length){
        console.log("Não encontrou o container para setar o foco.");
        return;
    }

    setTimeout(function(){
        $container[0].focus();
    }, 0);
};

ActionAPI.SpeechAction.prototype.executeCommand = function(action, params){
    console.log(action);
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