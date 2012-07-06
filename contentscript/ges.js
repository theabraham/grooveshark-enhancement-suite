function gesClosure() {

    console.log('--> ges loaded');

    /* Call the CALLBACK after Grooveshark has had a chance to load. */
    function ready(callback) { 
        var wait = function() {
            setTimeout(function() {
                ready.call(null, callback); 
            }, 200); 
        };

        /* Epic ternary. */
        (  isUndefined(jQuery)         
        || isUndefined(_)              
        || isUndefined(GS)             
        || isUndefined(GS.Models)      
        || isUndefined(GS.Controllers) 
        || isUndefined(GS.getLightbox)
        || isUndefined(GS.getNotice)
        || isUndefined(GS.player)
        ) ? wait() : setTimeout(function() { callback(); }, 3e3);
    }

    function isUndefined(value) {
        return typeof value === 'undefined';
    }

    /* Load each GES module. */
    ready(function() { 
        $.subscribe('gs.player.queue.change', ges.ui.restorePlayerButtons);

        ges.modules.mapModules(function (module, moduleName) { 
            ges.modules.doSetup(moduleName);
            ges.modules.doConstruct(moduleName);
        });
    });

}
