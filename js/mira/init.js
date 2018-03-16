"use strict";

define([
    'mira/widgets/render',
    'mira/base/init',
    'mira/models/api',
    'mira/models/selection',
    'mira/models/abstract',
    'mira/models/concrete',
    'mira/models/map',
    'mira/models/rule',
    'libs/sprintf.min',
    'libs/resampler',
    'libs/processors',
    'libs/api.ai',
    'libs/appAPI',
    'libs/jquery.easing.min',
    'libs/agency.min',
    'mira/application',
    'mira/interface',
    'mira/helper',

], function(
        Widget,
        Base,
        Api,
        Selection,
        Abstract,
        Concrete,
        Map,
        Rule,
        Sprintf,
        Resampler,
        Processors,
        APIAi,
        MiraApiai,
        JqueryEasing,
        Agency,
        Application,
        Interface,
        Helper
    ) {

    return {
        Base: Base,
        Api: Api,
        Selection: Selection,
        Rule: Rule,
        Concrete: Concrete,
        Abstract: Abstract,
        Map : Map,
        Widget : Widget,
        Sprintf: Sprintf,
        Processors : Processors,
        APIAi : APIAi,
        MiraApiai : MiraApiai,
        JqueryEasing: JqueryEasing,
        Agency: Agency,
        Application : Application,
        Interface: Interface,
        Helper: Helper
    }
});