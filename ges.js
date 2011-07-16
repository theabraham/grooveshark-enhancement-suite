ges.events.ready(function () { 
    _.forEach(ges.styles.defaults, function(style, index) {
        ges.styles.load(style.css, style.getValues());
    });
    
    // setup interface
    createMenu('Grooveshark Enhancement Suite', menuContent());
    placeMenuButton(function() { ges.ui.openLightbox('ges'); });
    $.subscribe('gs.player.queue.change', ges.ui.restorePlayerButtons);

    // construct modules
    ges.modules.mapModules(function (module, key) { 
        module.isEnabled = ges.db.getIsEnabled(key);
        if (module.style) { ges.styles.load(module.style.css, module.style.getValues()); }
        if (module.setup) { ges.modules.doSetup(key); }
        if (module.isEnabled) { ges.modules.doConstruct(key); }
    });
});

function placeMenuButton(onclick) {
    var html = $('<ul id="ges_nav"><li id="header_nav_ges"><a></a></li></ul>');
    var left = $('#nav').width() + parseInt($('#nav').css('left'));

    $('#header').append(html);
    $('a', '#header_nav_ges').click(onclick);
}

function createMenu(title, content) {
    var options = {
          'title': title
        , 'content': content
        , 'buttons': [
              { 
                    'label': 'Add Code'
                  , 'link': 'http://github.com/theabraham/Grooveshark-Enhancement-Suite/'
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

function menuContent() {
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
    var isEnabled = ges.modules.toggleModule(moduleName);
    $(this).toggleClass('enabled'); 
    ges.db.setIsEnabled(moduleName, isEnabled);
}
