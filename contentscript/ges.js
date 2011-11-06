function gesClosure() {

    ges.events.ready(function() { 
        // setup interface
        console.log('--> GES is ready');
        createMenu('Grooveshark Enhancement Suite', menuContent());
        $.subscribe('gs.player.queue.change', ges.ui.restorePlayerButtons);

        // construct modules
        ges.modules.mapModules(function (module, moduleName) { 
            module.isEnabled = ges.db.getModule(moduleName, 'isEnabled');
            if (module.setup) { ges.modules.doSetup(moduleName); }
            if (module.isEnabled) { ges.modules.doConstruct(moduleName); }
        });
    });

    function createMenu(title, content) {
        var onpopup = function() {
            var container = '#lightbox_content';
            ges.modules.mapModules(function(module, key, modules) {
                if (!module.isEnabled) { return; }
                $('#mod_' + key, container).addClass('enabled'); 
            });
            $('.mod_link:last-child', container).addClass('mod_last');
            $('.mod_link', container).click(function() {  
                toggleModule.call(this);
            });
        };

        var options = {
              'title': title
            , 'content': content
            , 'buttons': [
                  { 
                        'label': 'Contribute Code'
                      , 'link': 'http://github.com/theabraham/Grooveshark-Enhancement-Suite/'
                      , 'pos': 'right'
                  }
            ] 
            , 'onpopup': onpopup
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
        ges.db.setModule(moduleName, { 'isEnabled': isEnabled }); 
    }

}

