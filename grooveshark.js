(function() 
{
    var Gs = {};

    Gs.version = '0.1';
    Gs.listeners = {};
    
    Gs.ready = function(callback, waitForDOM) { 
        var wait = function() { 
            setTimeout(function() { 
                Gs.ready.call(null, callback, waitForDOM); 
            }, 200); 
        }
        if (typeof GS === 'undefined' || GS.player.player === null || typeof jQuery === 'undefined') {
            wait();
        } 
        else if (waitForDOM && GS.user.isLoggedIn && !$('#userOptions').children().hasClass('first surveyLink')) {
            wait();
        } 
        else {
            callback();
        }
    }

    Gs.before = function(methodName, callback) {
        var listener = fetchListenerFor(methodName, true); 
        if (listener) {
            listener.before.push(callback);
        }
    }

    Gs.after = function(methodName, callback) {
        var listener = fetchListenerFor(methodName, true); 
        if (listener) {
            listener.after.push(callback);
        }
    }

    Gs.clear = function(methodName) {
        removeEventFor(methodName);
    }

    Gs.removeBefore = function(methodName, callback) {
        removeEventFor(methodName, callback, 'before');
    }

    Gs.removeAfter = function(methodName, callback) {
        removeEventFor(methodName, callback, 'after');
    }

    function fetchListenerFor(methodName, createIfUndefined) { 
        var origMethod = GS.player.player[methodName];
        var listener = Gs.listeners[methodName];
        if (!origMethod || typeof origMethod != 'function') { 
            console.error('Method "' + methodName + '" does not exist or is not a function'); 
            return false;
        }
        else {
            if (!listener) {
                if (!createIfUndefined) { return false; }
                listener = (Gs.listeners[methodName] = { 'original': origMethod, 'before': [], 'after': [] });
                GS.player.player[methodName] = function() {
                    var methodArgs = arguments;
                    listener.before.forEach(function(element) { element.apply(null, methodArgs); });
                    listener.original.apply(null, arguments);
                    listener.after.forEach(function(element) { element.apply(null, methodArgs); });
                }
            }
            return listener;
        }
    }

    function removeEventFor(methodName, callback, type) {
        var listener = fetchListenerFor(methodName, false);  
        if (listener) {
            if (callback) {
                for (var i = 0; i < listener[type].length; i++) {
                    if (callback === listener[type][i]) {
                        listener[type].splice(i, 1);
                        break;
                    }
                }
            }
            else if (!callback && type) {
                listener[type] = [];
            }
            else {
                GS.player.player[methodName] = listener.original;
                delete Gs.listeners[methodName];
            }
        }
    }

    window.Gs = Gs;
})();

console.log('--> Beginning test');
// Gs.ready(function() { console.log('Ready!', GS); });
// Gs.ready(function() { console.log('DOM Ready!', GS); }, true);
Gs.ready(runEvents, true);

function runEvents() {
    console.log('--> Testing events');
    Gs.before('addSongsToQueueAt', function(songIDs) { console.log('Before Addition', songIDs); });
    Gs.after('addSongsToQueueAt', function(songIDs) { console.log('After Addition', songIDs); });
    Gs.after('addSongsToQueueAt', testEvent);
}

function removeEvents() {
    Gs.removeBefore('addSongsToQueueAt');
    Gs.removeAfter('addSongsToQueueAt', testEvent);
}

function testEvent() {
    console.log('Callback for an event with args: ', arguments);
}
