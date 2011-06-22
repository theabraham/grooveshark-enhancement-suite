;(function() {

    var events = {
          'listeners': {}
        , 'ready': ready 
        , 'subscribe': subscribe
        , 'unsubscribe': unsubscribe
        , 'method': method
    };

    function ready (callback, waitForDOM) { 
        (waitForDOM != null) || (waitForDOM = true);
        var wait = function() {
            setTimeout(function() {
                ready.call(null, callback, waitForDOM); 
            }, 200); 
        }
        if (typeof GS === 'undefined' || GS.player.player == null || typeof jQuery === 'undefined' || typeof _ === 'undefined') {
            wait();
        } 
        else if (waitForDOM && GS.user.isLoggedIn && !$('#userOptions').children().hasClass('first surveyLink')) {
            wait();
        } 
        else {
            callback();
        }
    }

    function subscribe (methodName, callback) {
        var listener = fetchListenerFor(methodName, true);      
        if (listener) {
            listener.callbacks.push(callback);
        }
    }

    function unsubscribe (methodName, callback) {
        var listener = fetchListenerFor(methodName, true);
        if (listener) {
            removeCallbackFor(methodName, callback, listener);
        }
    }

    function method (methodName) {
        var origMethod = events.listeners[methodName].original;
        var args = Array.prototype.slice.call(arguments); 
        origMethod.apply(null, args.slice(1));
    }

    function fetchListenerFor (methodName, createIfUndefined) { 
        var origMethod = GS.player.player[methodName];
        var listener = events.listeners[methodName];

        if (origMethod == null || typeof origMethod != 'function') { 
            console.error('Method "' + methodName + '" does not exist or is not a function'); 
            return false;
        }

        if (listener == null && createIfUndefined) {
            listener = events.listeners[methodName] = { 'original': origMethod, 'callbacks': [] };
            GS.player.player[methodName] = function() {
                var methodArgs = arguments; 
                var cont = true;
                var iterator = function(element) { 
                    cont = element.apply(null, methodArgs); 
                };

                _.forEach(listener.callbacks, iterator);
                if (cont == undefined || cont) {
                    listener.original.apply(null, arguments);
                }
            }
        }

        if (listener == null && !createIfUndefined) {
            return false;
        }

        return listener;
    }

    function removeCallbackFor (methodName, callback, listener) {
        var callbacks = listener.callbacks;

        if (callback == false) {
            callbacks = [];
        }

        for (var i = 0; i < callbacks.length; i++) {
            if (callback === callbacks[i]) {
                callbacks.splice(i, 1);
                break;
            }
       }
    } 

    window.ges || (window.ges = {});
    window.ges.events = events;

})();
