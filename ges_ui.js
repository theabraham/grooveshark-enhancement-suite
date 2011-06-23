;(function() {

    var ui = {
          'playerButtons': {}
        , 'addPlayerButton': addPlayerButton
        , 'removePlayerButton': removePlayerButton
        , 'restorePlayerButtons': restorePlayerButtons
        , 'createLightbox': createLightbox
        , 'openLightbox': openLightbox
        , 'closeLightbox': closeLightbox
        , 'notice': notice
    };

    var PLAYER_DIV = '#playerDetails_queue';

    function addPlayerButton (uid, options) {
        var buttonTag;
        options.label = (options.label || '');
        options.pos = (options.pos === 'left');
        options.onclick = (options.onclick || function() {});

        if (this.playerButtons[uid]) { 
            return false; 
        } else {
            buttonTag = $('#queue_songs_button', PLAYER_DIV).clone().attr('id', uid.slice(1)).html('<span>' + options.label + '</span>');
            this.playerButtons[uid] = { 'buttonTag': buttonTag, 'options': options };
            placePlayerButton(uid);
        }
    }

    function placePlayerButton (uid) { 
        var playerButton = ui.playerButtons[uid];
        var buttonTag = $(playerButton.buttonTag);
        var onclick = playerButton.options.onclick;
        var left = playerButton.options.pos;

        $(buttonTag).click(onclick);
        left ? $('.queueType', PLAYER_DIV).after(buttonTag)
             : $('#queue_radio_button', PLAYER_DIV).after(buttonTag);
    }

    function removePlayerButton (uid) { 
        if (this.playerButtons[uid]) {
            $(uid, PLAYER_DIV).remove();
            delete this.playerButtons[uid];
        }
    }

    function restorePlayerButtons () {
        _.forEach(ui.playerButtons, function(button, key) { 
            if (!$(key, PLAYER_DIV).length) {
                placePlayerButton(key);
            }
        });
    }    

    function createLightbox (uid, options) { 
        var clone, button, controller = {};
        options.title = (options.title || '');
        options.content = (options.content || '');
        options.buttons = (options.buttons || null);
        options.onpopup = (options.onpopup || function() {});

        // clone another lightbox, replace it's content, and add buttons
        GS.lightbox.open('locale');
        clone = $('#lightbox .locale').clone();
        GS.lightbox.close();

        $('#lightbox_header h3', clone).html(options.title);
        $('#lightbox_content .lightbox_content_block', clone).html(options.content);
        _.forEach(options.buttons, function(button, index) {
            addLightboxButton(clone, button);
        });

        // fill in and create the controller
        controller.name = 'GS.Controllers.Lightbox.' + uid + 'Controller';
        controller.proto = { 'onDocument': false };
        controller.init = function() {
            this.element.html(clone.html());
            options.onpopup.call(this);
        };

        GS.Controllers.BaseController.extend(controller.name, controller.proto, { 'init': controller.init });
        $('#lightbox').prepend('<div class="lbcontainer ' + uid + '"></div>');
    }

    function addLightboxButton (lightbox, button) {
        var buttonTag, containerTag, linkText;
        button.label = (button.label || '');
        button.uid = (button.uid || button.label.trim().toLowerCase().replace(" ", "_"));
        button.link = (button.link || false);
        button.pos = (button.pos === 'left' ? true : false);

        // TODO: should check if 'left/right' tag already exists?
        // TODO: accessing uid for event listeners?
        containerTag = $('<ul class="' + (button.pos ? 'left' : 'right') + '"><li class="last"></li></ul>');
        buttonTag = $('.close', lightbox).clone().removeClass('close').addClass(button.uid);
        $('span', buttonTag).html(button.label);
        
        if (button.link) {
            linkText = '<a href="' + button.link + '" target="blank" class="' + $(buttonTag).attr('class') + '">' + $(buttonTag).html() + '</a>';
            buttonTag = $(buttonTag).replaceWith(linkText); 
        }

        $('li', containerTag).append(buttonTag);
        $('#lightbox_footer .left', lightbox).before(containerTag);
    }

    function openLightbox (uid) {
        GS.lightbox.open(uid); 
    }

    function closeLightbox () {
        GS.lightbox.close(); 
    }

    function notice (message, options) {
        options || (options = {});
        options.message = message;
        options.type = (options.type || '');
        options.displayDuration = (options.displayDuration || 2500);
        options.manualClose = (options.manualClose || false);

        GS.notice.displayMessage(options);
    }

    window.ges || (window.ges = {});
    window.ges.ui = ui;

})();
