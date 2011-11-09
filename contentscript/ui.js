function uiClosure() {

    var ui = {
          'addPlayerButton': addPlayerButton
        , 'removePlayerButton': removePlayerButton
        , 'restorePlayerButtons': restorePlayerButtons
        , 'placePlayerButton': placePlayerButton
        , 'createLightbox': createLightbox
        , 'toggleLightbox': toggleLightbox
        , 'openLightbox': openLightbox
        , 'closeLightbox': closeLightbox
        , 'notice': notice
    };

    // some css-selector constants
    var PLAYER_DIV = 'div#playerDetails_queue';
    var ORIGINAL_BTN = 'span#queue_songCount';
    var CLONED_BTN = 'span.ges_cloned_button';
    var playerButtons = {};

    function addPlayerButton(uid, options) {
        if (playerButtons[uid]) { return false; } 

        var $buttonTag;
        options = options || {};
        options.label = (options.label || '');
        options.onclick = (options.onclick || function() {});
        $buttonTag = $(ORIGINAL_BTN, PLAYER_DIV).clone()
            .attr('id', uid.slice(1))
            .addClass(CLONED_BTN.slice(5))
            .html('<a href="#">' + options.label + '</a>');

        playerButtons[uid] = { '$buttonTag': $buttonTag, 'options': options };
        me = playerButtons;
        placePlayerButton(uid);
    }

    function placePlayerButton(uid) { 
        var playerButton = playerButtons[uid];
        var $buttonTag = playerButton.$buttonTag;
        var callback = playerButton.options.onclick;

        $buttonTag.click(function() {
            callback();
            return false;
        });
        $(PLAYER_DIV).prepend($buttonTag);
    }

    function removePlayerButton(uid) { 
        if (playerButtons[uid]) {
            $(uid, PLAYER_DIV).remove();
            delete playerButtons[uid];
        }
    }

    function restorePlayerButtons() {
        _.forEach(playerButtons, function(button, key) { 
            if (!$(key, PLAYER_DIV).length) {
                placePlayerButton(key);
            }
        });
    }    

    function createLightbox(uid, options) { 
        var $lightbox, controller = {};
        options = (options || {});
        options.title = (options.title || '');
        options.content = (options.content || '');
        options.buttons = (options.buttons || null);
        options.onpopup = (options.onpopup || function() {});

        // clone another lightbox
        GS.lightbox.open('locale');
        $lightbox = $('#lightbox .locale').clone();
        GS.lightbox.close();

        // replace it's content, and add buttons
        $('#lightbox_header h3', $lightbox).html(options.title);
        $('#lightbox_content .lightbox_content_block', $lightbox).first().html(options.content);
        $('#lightbox_content .lightbox_content_block.separatedContent', $lightbox).remove();
        _.forEach(options.buttons, function(button) {
            addLightboxButton($lightbox, button);
        });

        // fill in and create the controller
        controller.name = 'GS.Controllers.Lightbox.' + uid + 'Controller';
        controller.proto = { 'onDocument': false };
        controller.init = function() {
            this.element.html($lightbox.html());
            options.onpopup.call(this);
        };

        GS.Controllers.BaseController.extend(controller.name, controller.proto, { 'init': controller.init });
        $('#lightbox').prepend('<div class="lbcontainer ' + uid + '"></div>');
    }

    function addLightboxButton($lightbox, options) {
        var $button, $container, linkText;
        options.label = (options.label || '');
        options.uid = (options.uid || options.label.trim().toLowerCase().replace(' ', '_'));
        options.link = (options.link || false);
        options.pos = (options.pos || 'left');

        $button = $('.close', $lightbox).clone()
            .removeClass('close')
            .addClass(options.uid);
        $('span', $button).html(options.label);
        
        // wrap the button with a link tag
        if (options.link) {
            linkText = '<a href="' + options.link + '" target="blank" class="' + $button.attr('class') + '">' + $button.html() + '</a>';
            $button = $button.replaceWith(linkText);
        }

        // get (or create) the right or left button container list
        $container = $('ul.' + options.pos, $lightbox);
        if ($container.length === 0) {
            $container = $('<ul class="' + options.pos + '"></ul>');
        }

        if ($('li.first').length) {
            $j
        $('li', $container).append($button);
        $('#lightbox_footer .left', $lightbox).before($container);
    }

    function toggleLightbox(uid) {
        GS.lightbox.isOpen ? closeLightbox()
                           : openLightbox(uid);
    }

    function openLightbox(uid) {
        GS.lightbox.open(uid); 
     }

    function closeLightbox() {
        GS.lightbox.close(); 
    }

    function notice(message, options) {
        options = (options || {});
        options.message = message;
        options.type = (options.type || '');
        options.styles = (options.styles || false);
        options.displayDuration = (options.displayDuration || 2500);
        options.manualClose = (options.manualClose || false);

        GS.notice.displayMessage(options);

        if (options.styles) {
            options.styles = options.styles.join(' ');
            $('#notifications .notification:first-child').addClass(options.styles);
        }
    }

    window.ges || (window.ges = {});
    window.ges.ui = ui;

}

