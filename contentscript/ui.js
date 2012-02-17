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

    // commonly used CSS selectors
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

        console.log('BUTTON', $buttonTag);
        playerButtons[uid] = { '$buttonTag': $buttonTag, 'options': options };
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
        GS.getLightbox().open('locale');
        $lightbox = $('#lightbox .locale').clone();
        console.log('lightbox', $lightbox);
        GS.getLightbox().close();

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
        var $closeBtn, $newBtn, $ulContainer, $liContainer, linkText;
        options.label = (options.label || '');
        options.uid = (options.uid || options.label.trim().toLowerCase().replace(' ', '_'));
        options.link = (options.link || '');
        options.onclick = (options.onclick || false);

        $closeBtn = $('.close', $lightbox);
        $newBtn = $('<a></a>').attr({
                  'href': options.link
                , 'target': 'blank'
                , 'class': $closeBtn.attr('class')
            })
            .removeClass('close')
            .addClass(options.uid)
            .html($closeBtn.html());
        $('span', $newBtn).text(options.label);

        if (options.onclick) {
            $newBtn.click(function() {
                options.onclick();
                return false;
            });
        }

        // find (or create) the right ul container
        $ulContainer = $('ul.right', $lightbox);
        if (!$ulContainer.length) {
            $ulContainer = $('<ul class="right"></ul>');
            $('#lightbox_footer .left', $lightbox).before($ulContainer);
        }

        // place the li container, with the button inside; label as first or last (always last if not first)
        $liContainer = $('<li></li>').append($newBtn);
        $liContainer.attr('class', ($('li.first', $ulContainer).length ? 'last' : 'first'));
        $ulContainer.append($liContainer);
    }

    function toggleLightbox(uid) {
        GS.getLightbox().isOpen ? closeLightbox()
                           : openLightbox(uid);
    }

    function openLightbox(uid) {
        GS.getLightbox().open(uid); 
     }

    function closeLightbox() {
        GS.getLightbox().close(); 
    }

    function notice(message, options) {
        options = (options || {});
        options.message = message;
        options.type = (options.type || '');
        options.styles = (options.styles || false);
        options.displayDuration = (options.displayDuration || 2500);
        options.manualClose = (options.manualClose || false);

        GS.getNotice().displayMessage(options);

        if (options.styles) {
            options.styles = options.styles.join(' ');
            $('#notifications .notification:first-child').addClass(options.styles);
        }
    }

    window.ges || (window.ges = {});
    window.ges.ui = ui;

}

