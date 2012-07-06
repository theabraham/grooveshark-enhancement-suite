function eventsClosure() {

    var events = {
          'ready': ready 
    };

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

    window.ges || (window.ges = {});
    window.ges.events = events;

}
