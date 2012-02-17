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
        var content, name, opt, proto;
        options = (options || {});
        options.title = (options.title || '');
        options.content = (options.content || '');
        options.buttons = (options.buttons || null);
        options.onpopup = (options.onpopup || function() {});

        // fill in and create the controller
        content = createLightboxContent(options.title, options.content, options.buttons);
        name = 'GS.Controllers.Lightbox.' + uid + 'Controller';
        opt = { 'onDocument': false };
        proto = {
            'init': function() {
                this.update();
            },
            'update': function() {
                $(this.element).html(content);
                options.onpopup.call(this);
            }
        };

        GS.Controllers.BaseController.extend(name, opt, proto);
    }

    function createLightboxContent(title, content, buttons) {
        var $template = $('<div><div id="lightbox_header"> <div class="cap right"><div class="cap left"><div class="inner"> <h3 data-translate-text="LANGUAGE"></h3> </div></div></div> </div> <div id="lightbox_content"> <div class="lightbox_content_block"> <div class="clear noHeight"></div> </div> </div> <div id="lightbox_footer"> <div class="shadow"></div> <div class="highlight"></div> <ul class="left"> <li class="first last"> <button class="btn btn_style4 close" type="button"> <div> <span data-translate-text="CLOSE">Close</span> </div> </button> </li> </ul> <div class="clear"></div> </div> <div class="clear"></div></div>');
        $('#lightbox_header h3', $template).html(title);
        $('#lightbox_content .lightbox_content_block', $template).first().html(content);
        _.forEach(buttons, function(button) {
            addLightboxButton($template, button);
        });
        return $template.html();
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

