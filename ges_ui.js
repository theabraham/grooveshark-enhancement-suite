;(function() {

    var ui = {
          'buttons': {}
        , 'addButton': addButton
        , 'removeButton': removeButton
        , 'growl': growl
    };

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
        placeButton(id, options.placement);
    }

    function removeButton(id) { 
        if (this.buttons[id]) {
            $(id, PLAYER_DETAILS_DIV).remove();
            delete this.buttons[id];
        }
    }

    function placeButton(id, prepend) { 
        var button = ui.buttons[id].button;
        prepend ? $('.queueType', PLAYER_DETAILS_DIV).after(button)
                : $(PLAYER_DETAILS_DIV).append(button);
    }

    $.subscribe('gs.player.queue.change', restoreButtons);
    function restoreButtons() {
        _.forEach(ui.buttons, function(button, key) { 
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

    window.ges || (window.ges = {});
    window.ges.ui = ui;

})();
