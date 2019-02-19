"use strict";

define([
    'mira/helper',
    'mira/widgets/simple-html',
    'mira/widgets/map',
    'mira/widgets/input',
    'mira/widgets/head',
    'mira/widgets/script',
    'mira/widgets/meta',
    'mira/widgets/title',
    'mira/widgets/image-html',
    'mira/widgets/bootstrap-base',
    'mira/widgets/bootstrap-modal',
    'mira/widgets/bootstrap-carousel',
    'mira/widgets/bootstrap-image-box',
    'mira/widgets/bootstrap-navigation',
    'mira/widgets/bootstrap-footer',
    'mira/widgets/bootstrap-form',
    'mira/widgets/audio',
    'mira/widgets/profile',
    'mira/widgets/freebase',
    'mira/widgets/tecweb',
    'mira/widgets/WAI/wai-content',
    'mira/widgets/WAI/wai-form',
    'mira/widgets/WAI/wai-control',
    'mira/widgets/WAI/wai-list',
    'mira/widgets/WAI/wai-menu'

    ],function (Helper, SimpleHtml, Map, Input, Head, Script, Meta, Title, ImageHtml,
                BootstrapBase, BootstrapModal, BootstrapCarousel, BootstrapImageBox, BootstrapNavigation, BootstrapFooter,
                BootstrapForm, Audio, Profile, Freebase, TecWeb, 
                //WAI Components
                WaiContent, WaiForm, WaiControl, WaiList, WaiMenu
    ) {

    var pathToWidget = function(name){
        var root = 'mira/widgets/';
        var file = name.replace(/([A-Z])/g, function($1){return "-"+$1.toLowerCase();}).substring(1);
        return file.indexOf("wai") > -1 ? (root + "WAI/" + file) : (root + file);
    };
    var default_widget = 'SimpleHtml';
    var widgets = {
        SimpleHtml:SimpleHtml,
        MapStatic:Map.Static,
        MapDynamic:Map.Dynamic,
        Input:Input,
        Head: Head,
        Script: Script,
        Meta: Meta,
        Title: Title,
        ImageHtml:ImageHtml,
        BootstrapSimple: BootstrapBase.Simple,
        BootstrapFormControl: BootstrapForm.FormControl,
        BootstrapModalDialog: BootstrapModal.Dialog,
        BootstrapModalHeader: BootstrapModal.Header,
        BootstrapModalBody: BootstrapModal.Body,
        BootstrapModalFooter: BootstrapModal.Footer,
        BootstrapPanelBody: BootstrapBase.PanelBody,
        BootstrapCarousel: BootstrapCarousel.Carousel,
        BootstrapCarouselItem: BootstrapCarousel.Item,
        BootstrapIcon: BootstrapBase.Icon,
        BootstrapImageBox: BootstrapImageBox,
        BootstrapFooter: BootstrapFooter,
        AudioPlayer: Audio.Player,
        ProfileContainer: Profile.Container,
        ProfileImage: Profile.Image,
        ProfileDetail: Profile.Detail,
        ProfileCount: Profile.Counts,
        BootstrapNavigation: BootstrapNavigation.Main,
        BootstrapNavigationList: BootstrapNavigation.List,
        BootstrapNavigationListItem: BootstrapNavigation.ListItem,
        BootstrapFormGroupButton: BootstrapForm.GroupButton,
        FreebaseTypes: Freebase.Types,
        TecWebRodape: TecWeb.Rodape,
        WaiContent: WaiContent,
        WaiForm: WaiForm,
        WaiInput: WaiControl.Input,
        WaiStatic: WaiControl.Static,
        WaiSelect: WaiControl.Select,
        WaiOption: WaiControl.Option,
        WaiTextarea: WaiControl.Textarea,
        WaiRadio: WaiControl.RadioButton,
        WaiCheckbox: WaiControl.Checkbox,
        WaiButton: WaiControl.Button,
        WaiListContent: WaiList.Content,
        WaiListSelect: WaiList.Select,
        WaiListCheck: WaiList.Check,
        WaiMenu: WaiMenu.Main,
        WaiMenuDropdown: WaiMenu.Dropdown,
        WaiMenuItem: WaiMenu.Item
    };

    return  {
        setDefault: function (widget) {
            default_widget = widget;
        },
        call: function(map, $parent, $data, $env, $bind, callback){
            var widget_name = map.get('widget') || default_widget;

            var widget = widgets[widget_name];
            if(widget) {
                var $context = {
                    $data: $data.attributes || $data,
                    $env: $env,
                    $bind: $bind,
                    $dataObj: $data,
                    $map: map
                };

                var attributes = _.omit(map.attributes, 'children');

                return widgets[widget_name].call(
                    map,
                    $parent,
                    map.get('name'),
                    $context,
                    attributes,
                    callback
                );
            } else {
                console.error('Widget Concrete not Founded', widget_name, map);
            }
        },
        register: function(custom_widgets){
            _.extend(widgets, custom_widgets);
        }
    };
});