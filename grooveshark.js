;(function() {

    //
    // Setup
    //

    var Gs = {
          'version': '0.1'
        , 'listeners': {}
        , 'buttons': {}
        , 'ready': ready 
        , 'subscribe': subscribe
        , 'unsubscribe': unsubscribe
        , 'method': method
        , 'addButton': addButton
        , 'removeButton': removeButton
        , 'growl': growl
    };

    //
    // Events
    // 

    function ready(callback, waitForDOM) { 
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

    function subscribe(methodName, callback) {
        var listener = fetchListenerFor(methodName, true);      
        if (listener) {
            listener.callbacks.push(callback);
        }
    }

    function unsubscribe(methodName, callback) {
        var listener = fetchListenerFor(methodName, true);
        if (listener) {
            removeCallbackFor(methodName, callback, listener);
        }
    }

    function method(methodName) {
        var origMethod = Gs.listeners[methodName].original;
        var args = Array.prototype.slice.call(arguments); 
        origMethod.apply(null, args.slice(1));
    }

    function fetchListenerFor(methodName, createIfUndefined) { 
        var origMethod = GS.player.player[methodName];
        var listener = Gs.listeners[methodName];

        if (origMethod == null || typeof origMethod != 'function') { 
            console.error('Method "' + methodName + '" does not exist or is not a function'); 
            return false;
        }

        if (listener == null && createIfUndefined) {
            listener = Gs.listeners[methodName] = { 'original': origMethod, 'callbacks': [] };
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

    function removeCallbackFor(methodName, callback, listener) {
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

    //
    // Interface 
    // 

    var PLAYER_DETAILS_DIV = '#playerDetails_queue';

    function addButton(id, options) {
        if (this.buttons[id] || id.substr(0, 1) != '#') {
            console.error('Button "' + id + '" already exists or is an invalid identifier');
            return;
        }

        var button, span;
        options.label = options.label || '';
        options.placement = (options.placement === 'prepend');
        options.onclick = (options.onclick || function() {});
        button = $('#queue_songs_button').clone().attr('id', id.slice(1)).click(options.onclick);
        span = $('span', button).removeAttr('id').removeAttr('data-translate-text').html(options.label);

        this.buttons[id] = { 'button': button, 'options': options };
        placeButton(id, prepend);
    }

    function removeButton(id) { 
        if (this.buttons[id]) {
            $(id, PLAYER_DETAILS_DIV).remove();
            delete this.buttons[id];
        }
    }

    function placeButton(id, prepend) { 
        var button = Gs.buttons[id].button;
        prepend ? $('.queueType', PLAYER_DETAILS_DIV).after(button)
                : $(PLAYER_DETAILS_DIV).append(button);
    }

    $.subscribe('gs.player.queue.change', restoreButtons);
    function restoreButtons() {
        _.forEach(Gs.buttons, function(button, key) { 
            if (!$(key, PLAYER_DETAILS_DIV).length) {
                placeButton(key, value.options.placement); 
            }
        });
    }    

    function growl(sender, message, delay) {
        delay || (delay = 2500);
        var container = growlContainer();
        var template = growlTemplate(sender, message);
        $(container).append(template);
        $(template).slideDown('fast').delay(delay).fadeOut('slow');
        setTimeout(function() { $(template).remove(); }, delay + 1000);
    }

    function growlTemplate(sender, message) {
        var style = 'display:none; background:rgba(0,0,0,0.7); z-index:1000; padding:10px; color:#ddd; -moz-border-radius:3px; -webkit-border-radius:3px; font-size:11px; margin-top:6px;';
        var template = $('<li style="' + style + '"><span class="sender">' + sender + '</span><span class="message">' + message + '</span></li>');
        $('.sender', template).css({ 'display': 'block', 'margin-bottom': '6px', 'color': '#fff' });  
        return $(template);
    }

    function growlContainer() {
        var container = $('#growl_container');
        if (container.length === 0) {
            container = $('<ul id="growl_container"></ul>');
            $(container).css({ 'position': 'absolute', 'width': '200px', 'bottom': 10, 'right': 10, 'z-index': '1000' });
            $('#page_wrapper').append(container);
        }
        return $(container);
    }

    window.Gs = Gs;

})();
