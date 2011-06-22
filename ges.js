;(function() {

    var main = {
          'version': '0.1'
        , 'pluralize': pluralize
        , 'loadCSS': loadCSS
    };

    function pluralize (count, single, plural) {
        return count === 1 ? single : plural;
    }

    function loadCSS (filename, values) {
        $.get('http://localhost:4000/public/' + filename, function (text) {
            // mustache style css templating
            text = text.replace(/\{\{.*\}\}/gi, function (match) { 
                match = match.slice(2, -2);
                match = match.trim();  
                return values[match];
            });

            $('<style/>').text(text).appendTo('body');
        });
    }

    window.ges || (window.ges = {});
    for (var key in main) { window.ges[key] = main[key]; }

})();

ges.events.ready(function () { 
    ges.loadCSS('ges.css', { 'iconURL': $('#sidebar_footer_new .icon').css('background-image') });
    placeMenuButton(function() { ges.ui.openLightbox('ges'); });
    createMenuModal('Grooveshark Enhancement Suite', MenuModalContent());

    // construct enabled modules
    ges.modules.mapModules(function (module, key) { 
        if (module.isEnabled) { ges.modules.doConstruct(key); }
        if (module.style) { loadCSS(module.style); }
    });
});

function placeMenuButton (onclick) {
    var html = $('<ul id="ges_nav"><li id="header_nav_ges"><a></a></li></ul>');
    var left = $('#nav').width() + parseInt($('#nav').css('left'));

    $(html).css({ 'position': 'absolute', 'left': left, 'top': '4px' });
    $('a', html).css({ 'background': 'url(http://static.a.gs-cdn.net/webincludes/css/images/skeleton/nav.png)', 'display': 'block', 'width': '32px', 'height': '32px', 'position': 'relative' });
    $('#header').append(html);
    $('a', '#header_nav_ges').click(onclick);
}

function createMenuModal (title, content) {
    var options = {
          'title': title
        , 'content': content
        , 'buttons': [
            { 
                  'label': 'Contribute Code'
                , 'link': 'http://github.com/'
                , 'pos': 'right'
            }
        ]
        , 'onpopup': function() {
            $('.mod_link:last-child', '#lightbox_content').addClass('mod_last');
            $('.mod_link', '#lightbox_content').click(function() {  
                toggleModule.call(this);
            });
        }
    };

    ges.ui.createLightbox('ges', options);              
}

function MenuModalContent () {
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

function toggleModule() { 
    var moduleName = $('input', this).val();
    $(this).toggleClass('enabled'); 
    ges.modules.toggleModule(moduleName);
}
