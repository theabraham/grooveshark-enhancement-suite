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
    // setup interface
    ges.loadCSS('ges.css', { 'iconURL': $('#sidebar_footer_new .icon').css('background-image') });
    createMenu('Grooveshark Enhancement Suite', menuContent());
    placeMenuButton(function() { ges.ui.openLightbox('ges'); });
    $.subscribe('gs.player.queue.change', ges.ui.restorePlayerButtons);

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

function createMenu (title, content) {
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
            var container = '#lightbox_content';
            ges.modules.mapModules(function(module, key, modules) {
                if (!module.isEnabled) { return; }
                $('#mod_' + key, container).addClass('enabled'); 
            });
            $('.mod_link:last-child', container).addClass('mod_last');
            $('.mod_link', container).click(function() {  
                toggleModule.call(this);
            });
        }
    };

    ges.ui.createLightbox('ges', options);              
}

function menuContent () {
    var content = '';
    var moduleBlock;
    var moduleTemplate = $('<div><a class="mod_link"><div class="mod_content"><span class="mod_name"></span><span class="mod_desc"></span></div><span class="mod_icon"></span></a></div>');
    
    ges.modules.mapModules(function(module, key, modules) {
        moduleBlock = $(moduleTemplate).clone();
        $('.mod_link', moduleBlock).attr('id', 'mod_' + key);
        $('.mod_name', moduleBlock).html(module.name);
        $('.mod_desc', moduleBlock).html(module.description);
        $('input', moduleBlock).val(key);
        content += $(moduleBlock).html();
    }); 

    return content;
}

function toggleModule() { 
    var moduleName = $(this).attr('id').slice(4);
    $(this).toggleClass('enabled'); 
    ges.modules.toggleModule(moduleName);
}
