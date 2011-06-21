;(function() {

    var GES = {
          'version': '0.1'
        , 'listeners': {}
        , 'buttons': {}
        , 'ready': ready 
        , 'subscribe': subscribe
        , 'unsubscribe': unsubscribe
        , 'method': method
        , 'addButton': addButton
        , 'removeButton': removeButton
        , 'growl': growl
    };


    function pluralize(count, single, plural) {
        return count === 1 ? single : plural;
    }

    Gs.ready(function() { 
        ges.modules.mapModules(function(module, key) { 
            if (module.isEnabled) { ges.modules.doConstruct(key); }
            if (module.style) { exportStyle(module.style); }
        });

        var iconURL = $('#sidebar_footer_new .icon').css('background-image');
        var style = '';
        style += '#lightbox .mod_link { display:block; margin-bottom:10px; padding:10px; border:1px solid #b2b2b2; -moz-border-radius:3px; -webkit-border-radius:3px; }';
        style += '#lightbox .mod_link:hover { background-color:#dedede; padding:9px; border-width:2px; }';
        style += '#lightbox .mod_link:active { background:none !important; border-color:#1785cd !important; border-width:2px !important; }';
        style += '#lightbox .mod_link.enabled { background-color:#d8ebf8; border:1px solid #1785cd; padding:10px; }';
        style += '#lightbox .mod_link.enabled:hover { border-width:2px; padding:9px; }';
        style += '#lightbox .mod_link .mod_icon { background-image:' + iconURL + '; background-position:-4px -308px; float:right; display:inline-block; margin:12px 4px 0 0; height:8px; width:8px; }';
        style += '#lightbox .mod_link.enabled .mod_icon { background-position:-36px 268px !important; }';
        style += '#lightbox .mod_link:hover .mod_icon { background-position:-20px -308px; }';
        style += '#lightbox .mod_link:active .mod_icon { background-position:12px -308px; }';
        style += '#lightbox .mod_content { display:inline-block; width:520px; }';
        style += '#lightbox .mod_name { display:block; color:#333; margin-bottom:8px; }';
        style += '#lightbox .mod_desc { color:#666; }';
        style += '#lightbox .mod_last { margin-bottom:0; }';
        exportStyle(style);
        buildMenuButton(openMenuModal);
        buildMenuModal('Grooveshark Enhancement Suite', MenuModalContent());
    });

    function exportStyle(style) {
        $('<style/>').html(style).appendTo('body');
    }

    function buildMenuButton(onclick) {
        var html = $('<ul id="ges_nav"><li id="header_nav_ges"><a></a></li></ul>');
        var left = $('#nav').width() + parseInt($('#nav').css('left'));

        $(html).css({ 'position': 'absolute', 'left': left, 'top': '4px' });
        $('a', html).css({ 'background-image': 'http://static.a.gs-cdn.net/webincludes/css/images/skeleton/nav.png', 'display': 'block', 'width': '32px', 'height': '32px', 'position': 'relative' });

        $('#header').append(html);
        $('a', '#header_nav_ges').click(onclick);
    }

    function buildMenuModal(title, content) {
        GS.lightbox.open('locale');
        var modal = $('#lightbox .locale').clone();
        GS.lightbox.close();

        $('#lightbox_header h3', modal).html(title);
        $('#lightbox_content .lightbox_content_block', modal).html(content);
        $('#lightbox').prepend('<div class="lbcontainer ges"></div>');

        var button = $('.close', modal).clone().removeClass('close').addClass('contribute').replaceWith('<a href="http://github.com/" target="blank" class="' + $('.close', modal).attr('class') + '">' + $('.close', modal).html() + '</a>');
        var buttonCont = $('<ul class="right"><li class="last"></li></ul>');
        $('span', button).html('Contribute Code');
        $('li', buttonCont).append(button);
        $('#lightbox_footer .left', modal).before(buttonCont);
    
        GS.Controllers.BaseController.extend(
              'GS.Controllers.Lightbox.GESController'
            , { onDocument: false }
            , {
                init: function() {
                    this.element.html(modal.html());
                    $('.mod_link:last-child', '#lightbox_content').addClass('mod_last');
                }
                , '.mod_link click': function(elem, evt) {
                    var self = $(elem); 
                    toggleModule.apply(self);
                }
            });
    }

    function MenuModalContent() {
        var content = '';
        var moduleBlock;
        var moduleTemplate = $('<div><a class="mod_link"><div class="mod_content"><span class="mod_name"></span><span class="mod_desc"></span></div><span class="mod_icon"></span><input type="hidden" /></a></div>');
        
        ges.modules.mapModules(function(module, key, modules) {
            moduleBlock = $(moduleTemplate).clone();
            if (module.isEnabled) { $('.mod_link', moduleBlock).addClass('enabled'); }
            $('.mod_name', moduleBlock).html(module.name);
            $('.mod_desc', moduleBlock).html(module.description);
            $('input', moduleBlock).val(key);
            content += $(moduleBlock).html();
        }); 

        return content;
    }

    function openMenuModal() {
        GS.lightbox.open('ges'); 
    }

    function toggleModule() { 
        var moduleName = $('input', this).val();
        $(this).toggleClass('enabled'); 
        ges.modules.toggleModule(moduleName);
    }

})();
