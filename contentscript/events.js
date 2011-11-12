function eventsClosure() {

    console.log('--> events loaded');
    var events = {
          'listeners': {}
        , 'ready': ready 
        , 'subscribe': subscribe
        , 'unsubscribe': unsubscribe
    };

    function ready(callback) { 
        var wait = function() {
            setTimeout(function() {
                ready.call(null, callback); 
            }, 200); 
        };

        // epic ternary
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

    function subscribe(methodName, callback) {
        var listener = getListenerFor(methodName);      
        if (listener) {
            listener.callbacks.push(callback);
        }
    }

    function unsubscribe(methodName, callback) {
        var listener = getListenerFor(methodName);
        if (listener) {
            removeCallbackFor(methodName, callback, listener);
        }
    }

    function getListenerFor(methodName, createIfUndefined) { 
        createIfUndefined != null || (createIfUndefined = true);
        var origMethod = GS.player.player[methodName];
        var listener = events.listeners[methodName];

        if (origMethod == null || typeof origMethod != 'function') { return false; }

        if (listener == null) {
            if (createIfUndefined) {
                listener = events.listeners[methodName] = { 'original': origMethod, 'callbacks': [] };
                GS.player.player[methodName] = function() {
                    var args = _.map(arguments, function(value, key) { return value; });

                    // callbacks will have their 'this' = args, so they can intercept the functions 'arguments' values
                    _.forEach(listener.callbacks, function(callback, index) {
                        callback.apply(args);     
                    });

                    listener.original.apply(null, args);
                }
            }
            else {
                return false;
            }
        }

        return listener;
    }

    function removeCallbackFor(methodName, callback, listener) {
        _.forEach(listener.callbacks, function(fn, index, callbacks) {
            if (fn === callback) { callbacks.splice(index, 1); }
        });
    } 

    window.ges || (window.ges = {});
    window.ges.events = events;

}

