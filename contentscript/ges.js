function gesClosure() {

    console.log('--> ges loaded');

    /* Call the CALLBACK after Grooveshark has had a chance to load. */
    function ready(callback) { 
        var wait = function() {
            setTimeout(function() {
                ready.call(null, callback); 
            }, 500); 
        };

        /* Epic ternary. */
        try {
            (  isUndefined(Grooveshark)         
            || isUndefined(GS.Models)      
            || isUndefined(GS.Views)      
            || isUndefined(GS.Services)      
            || isUndefined(GS.Views.Lightboxes)      
            || isUndefined(GS.Views.Lightbox)      
            ) ? wait() : setTimeout(function() { callback(); }, 3e3);
        } catch (err) {
            console.log('WAITING');
            wait(); 
        }
    }

    function isUndefined(value) {
        return typeof value === 'undefined';
    }

    /* Load each GES module. */
    ready(function() { 
        console.log('Grooveshark\'s ready, GES now running...');

        ges.messages.setup();

        ges.modules.mapModules(function (module, moduleName) { 
            ges.modules.doSetup(moduleName);
            ges.modules.doConstruct(moduleName);
        });
    });

}
