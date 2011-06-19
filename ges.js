;(function() {

    Gs.ready(function() { 
        ges.modules.mapModules(function(value, key) { 
            if (value.isEnabled) { ges.modules.doConstruct(key); }
        });

        buildMenuButton(openMenuModal);
        buildMenuModal('Grooveshark Enhancement Suite', MenuModalContent());
    });

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

        GS.Controllers.BaseController.extend(
              'GS.Controllers.Lightbox.GESController'
            , { onDocument: false }
            , {
                init: function() {
                    this.element.html(modal.html());
                },
            });
    }

    function MenuModalContent() {
        var content = '';
        var moduleBlock;
        var moduleTemplate = $('<div><a class="mod_link"><span class="mod_name"></span><span class="mod_desc"></span></a></div>');
        $('.mod_link', moduleTemplate).css({ 'display': 'block', 'float': 'left', 'width': '45%', 'padding': '10px', 'margin-bottom': '5px', 'background': '#fff', 'border-bottom': '1px solid rgba(0,0,0,0.1)', '-moz-border-radius': '3px', '-webkit-border-radius': '3px' });
        $('.mod_name', moduleTemplate).css({ 'display': 'block' });
        $('.mod_desc', moduleTemplate).css({ });
        
        ges.modules.mapModules(function(module, key, modules) {
            moduleBlock = $(moduleTemplate).clone();
            $('.mod_name', moduleBlock).html(module.name);
            $('.mod_desc', moduleBlock).html(module.description);
            content += $(moduleBlock).html();
        }); 

        return content;
    }

    function openMenuModal() {
        GS.lightbox.open('ges'); 
    }

})();
