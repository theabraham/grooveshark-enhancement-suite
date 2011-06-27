;(function() { 

    var menu = ' \
        #lightbox .mod_link { display:block; margin-bottom:10px; padding:10px; border:1px solid #b2b2b2; -moz-border-radius:3px; -webkit-border-radius:3px; } \
        #lightbox .mod_link:hover { background-color:#dedede; padding:9px; border-width:2px; } \
        #lightbox .mod_link:active { background:none !important; border-color:#1785cd !important; border-width:2px !important; } \
        #lightbox .mod_link.enabled { background-color:#d8ebf8; border:1px solid #1785cd; padding:10px; } \
        #lightbox .mod_link.enabled:hover { border-width:2px; padding:9px; } \
        #lightbox .mod_link .mod_icon { background-image:{{ iconURL }};  background-position:-4px -308px; float:right; display:inline-block; margin:12px 4px 0 0; height:8px; width:8px; } \
        #lightbox .mod_link.enabled .mod_icon { background-position:-36px 268px !important; } \
        #lightbox .mod_link:hover .mod_icon { background-position:-20px -308px; } \
        #lightbox .mod_link:active .mod_icon { background-position:12px -308px; } \
        #lightbox .mod_content { display:inline-block; width:520px; } \
        #lightbox .mod_name { display:block; color:#333; margin-bottom:8px; } \
        #lightbox .mod_desc { color:#666; } \
        #lightbox .mod_last { margin-bottom:0; } \
    \ ';

    var notices = ' \
        #notifications li.wide { width:400px; margin:0 0 3px -150px; } \
    \ ';

    var styles = {
          'load': load
        , 'menu': menu
        , 'notices': notices
    };

    function load(style, values) {
        style = style.replace(/\{\{.*\}\}/gi, function (match) { 
            match = match.slice(2, -2);
            match = match.trim();  
            return values[match];
        });

        $('<style/>').text(style).appendTo('body');
    }

    window.ges || (window.ges = {});
    window.ges.styles = styles;

})();
;(function() {

    var events = {
          'listeners': {}
        , 'ready': ready 
        , 'subscribe': subscribe
        , 'unsubscribe': unsubscribe
    };

    function ready (callback, waitForDOM) { 
        waitForDOM != null || (waitForDOM = true);
        var wait = function() {
            setTimeout(function() {
                ready.call(null, callback, waitForDOM); 
            }, 200); 
        }
        if (typeof GS === 'undefined' || typeof GS.player.player === 'undefined' || typeof jQuery === 'undefined' || typeof _ === 'undefined') {
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
        var listener = getListenerFor(methodName);      
        if (listener) {
            listener.callbacks.push(callback);
        }
    }

    function unsubscribe (methodName, callback) {
        var listener = getListenerFor(methodName);
        if (listener) {
            removeCallbackFor(methodName, callback, listener);
        }
    }

    function getListenerFor (methodName, createIfUndefined) { 
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

    function removeCallbackFor (methodName, callback, listener) {
        _.forEach(listener.callbacks, function(fn, index, callbacks) {
            if (fn === callback) { callbacks.splice(index, 1); }
        });
    } 

    window.ges || (window.ges = {});
    window.ges.events = events;

})();
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

    function addPlayerButton(uid, options) {
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

    function placePlayerButton(uid) { 
        var playerButton = ui.playerButtons[uid];
        var buttonTag = $(playerButton.buttonTag);
        var onclick = playerButton.options.onclick;
        var left = playerButton.options.pos;

        $(buttonTag).click(onclick);
        left ? $('.queueType', PLAYER_DIV).after(buttonTag)
             : $('#queue_radio_button', PLAYER_DIV).after(buttonTag);
    }

    function removePlayerButton(uid) { 
        if (this.playerButtons[uid]) {
            $(uid, PLAYER_DIV).remove();
            delete this.playerButtons[uid];
        }
    }

    function restorePlayerButtons() {
        _.forEach(ui.playerButtons, function(button, key) { 
            if (!$(key, PLAYER_DIV).length) {
                placePlayerButton(key);
            }
        });
    }    

    function createLightbox(uid, options) { 
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

    function addLightboxButton(lightbox, button) {
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

    function openLightbox(uid) {
        GS.lightbox.open(uid); 
    }

    function closeLightbox() {
        GS.lightbox.close(); 
    }

    function notice(message, options) {
        options || (options = {});
        options.message = message;
        options.type = (options.type || '');
        options.styles = (options.styles || false);
        options.displayDuration = (options.displayDuration || 2500);
        options.manualClose = (options.manualClose || false);

        GS.notice.displayMessage(options);

        if (options.styles) { styleNotice(options.styles); }
    }

    function styleNotice(styles) { 
        styles = styles.join(' ');
        $('#notifications .notification:first-child').addClass(styles);
    }

    window.ges || (window.ges = {});
    window.ges.ui = ui;

})();
;(function() {

    var modules = {
          'modules': {}
        , 'getModuleCount': getModuleCount
        , 'setModuleProperties': setModuleProperties
        , 'toggleModule': toggleModule
        , 'mapModules': mapModules
        , 'doSetup': doSetup
        , 'doConstruct': doConstruct
        , 'doDestruct': doDestruct
    };

    function getModuleCount() {
        return Object.keys(modules.modules).length;
    }

    function setModuleProperties(moduleName, properties) {
        var module = modules.modules[moduleName]
        _.forEach(properties, function(property, name) {
            if (module.hasOwnProperty(name)) {
                module[name] = property;
            }
        });
    }

    function toggleModule(moduleName) {
        var module = modules.modules[moduleName];
        module.isEnabled ? doDestruct(moduleName)
                         : doConstruct(moduleName);
    }

    function mapModules(mapfn) {
        _.forEach(modules.modules, mapfn); 
    } 

    function doSetup(moduleName) {
        var module = modules.modules[moduleName];
        module.setup();
    }

    function doConstruct(moduleName) {
        var module = modules.modules[moduleName];
        module.isEnabled = true;
        module.construct();
    }

    function doDestruct(moduleName) {
        var module = modules.modules[moduleName];
        module.isEnabled = false;
        module.destruct();
    }

    window.ges || (window.ges = {});
    window.ges.modules = modules;

})();
;(function(modules) {

    modules['dupeDelete'] = {
          'author': 'Ibrahim Al-Rajhi'
        , 'name': 'Duplicate Song Remover'
        , 'description': 'Removes duplicate songs from your current queue.'
        , 'isEnabled': true
        , 'construct': construct
        , 'destruct': destruct
        , 'style': null
    };

    function construct() { 
        ges.ui.addPlayerButton('#dupeDelete', {
              'label': 'Remove Duplicates'
            , 'pos': 'right'
            , 'onclick': removeDuplicates
        });
    }

    function destruct() {
        ges.ui.removePlayerButton('#dupeDelete');
    }

    function pluralize (count, single, plural) {
        return count === 1 ? single : plural;
    }

    function removeDuplicates() {
        var player = GS.player;
        var queue = player.getCurrentQueue().songs;
        var uniqueNames = {};
        var duplicateIds = [];
        var cleanName, length, message;

        _.forEach(queue, function(song, index) {
            cleanName = song.SongName.toLowerCase();
            uniqueNames[cleanName] ? duplicateIds.push(song.queueSongID)
                                   : uniqueNames[cleanName] = true;
        });
        player.removeSongs(duplicateIds);

        length = duplicateIds.length;
        message = length + ' duplicate' + pluralize(length, '', 's') + ' ' + pluralize(length, 'has', 'have') + ' been removed';
        ges.ui.notice(message);
    }

})(ges.modules.modules);
;(function(modules) {

    modules['bieberFever'] = {
          'author': 'Ibrahim Al-Rajhi'
        , 'name': 'Bieber Fever'
        , 'description': 'All songs added to the queue will be replaced with a random Justin Bieber song.'
        , 'isEnabled': false
        , 'construct': construct
        , 'destruct': destruct
        , 'style': null
    };

    var bieberSongIDs = ['26679682', '24919330', '24919377', '24477484', '29735743', '28490274'];

    ges.events.ready(function() {
        _.map(bieberSongIDs, function(elem, index) {
                GS.Models.Song.getSong(elem, function(info) {
                   bieberSongIDs.splice(index, 1, info);
                });
            });
    });

    function construct() { 
        ges.events.subscribe('addSongsToQueueAt', interceptBieber);
    }

    function destruct() {
        ges.events.unsubscribe('addSongsToQueueAt', interceptBieber);
    }

    function randomChoice(list) {
        return list[Math.floor(Math.random() * list.length)];
    }

    function interceptBieber() {
        this[0] = _.map(this[0], function(elem) { 
            return randomChoice(bieberSongIDs);
        });
    }

})(ges.modules.modules);
;(function(modules) {

    modules['lyrics'] = {
          'author': 'Ibrahim Al-Rajhi'
        , 'name': 'Song Lyrics'
        , 'description': 'Show the lyrics of the currently playing song.'
        , 'isEnabled': true
        , 'setup': setup
        , 'construct': construct
        , 'destruct': destruct
        , 'style': null
    };

    var getLyricsEvent = document.createEvent('Events');
    getLyricsEvent.initEvent('getLyricsEvent', true, false);
    window.addEventListener('returnLyricsEvent', displayLyrics);

    function setup() {
        var formTag = $('<form id="requestedLyricsInfo"><input name="song" type="hidden" value=""/><input name="artist" type="hidden" value=""/><textarea name="result" type="hidden"></textarea></form>');
        $('body').append(formTag);
    }

    function construct() { 
        ges.ui.addPlayerButton('#songLyrics', {
              'label': 'Show Lyrics'
            , 'pos': 'right'
            , 'onclick': requestLyrics
        });
    }

    function destruct() {
        ges.ui.removePlayerButton('#songLyrics');
    }

    function requestLyrics() {
        var song = GS.player.getCurrentSong();
        var formTag = $('#requestedLyricsInfo');
        var message, options;

        if (song) { 
            $('input[name="song"]', formTag).val(song.SongName);
            $('input[name="artist"]', formTag).val(song.ArtistName);
            document.dispatchEvent(getLyricsEvent);
        }
        else {
            message = 'Play a song before requesting its lyrics';
            options = { 'type': 'error', 'manualClose': false };
            ges.ui.notice(message, options);
        }
    }

    function displayLyrics() {
        var formTag = $('#requestedLyricsInfo');
        var result = JSON.parse($('textarea', formTag).val());
        var message, options;

        if (result.success) {
            // result.lyrics = cleanLyrics(result.lyrics);
            message = '<strong>' + result.song + '<strong><br/><p>' + result.lyrics + '</p>';
            options = { 'type': 'form', 'manualClose': true, 'styles': ['wide'] };
        } 
        else {
            message = 'Lyrics not available for <strong>' + result.song + '</strong>.<p>If you can find the lyrics, why not \
                       share them at <a href="' + result.url + '" target="blank">Lyrics Wikia</a>?'</p>';
            options = { 'type': 'error', 'manualClose': false };
        }

        ges.ui.notice(message, options);
    }

})(ges.modules.modules);
ges.events.ready(function () { 
    // setup interface
    ges.styles.load(ges.styles.menu, { 'iconURL': $('#sidebar_footer_new .icon').css('background-image') });
    ges.styles.load(ges.styles.notices);
    createMenu('Grooveshark Enhancement Suite', menuContent());
    placeMenuButton(function() { ges.ui.openLightbox('ges'); });
    $.subscribe('gs.player.queue.change', ges.ui.restorePlayerButtons);

    // construct modules
    ges.modules.mapModules(function (module, key) { 
        if (module.setup) { ges.modules.doSetup(key); }
        if (module.isEnabled) { ges.modules.doConstruct(key); }
    });
});

function placeMenuButton (onclick) {
    var html = $('<ul id="ges_nav"><li id="header_nav_ges"><a></a></li></ul>');
    var left = $('#nav').width() + parseInt($('#nav').css('left'));

    $(html).css({ 'position': 'absolute', 'left': left, 'top': '4px' });
    $('a', html).css({ 'background': 'url(http://static.a.gs-cdn.net/webincludes/css/images/skeleton/nav.png)', 'display': 'block', 'width': '32px', 'height': '32px', 'position': 'relative' });
    $('#header').append(html);
    $('a', '#header_nav_ges').click(onclick);
}

function createMenu (title, content) {
    var options = {
          'title': title
        , 'content': content
        , 'buttons': [
            { 
                  'label': 'Contribute Code'
                , 'link': 'http://github.com/theabraham/Grooveshark-Enhancement-Suite/'
                , 'pos': 'right'
            }
        ]
        , 'onpopup': function() { 
            var container = '#lightbox_content';
            ges.modules.mapModules(function(module, key, modules) {
                if (!module.isEnabled) { return; }
                $('#mod_' + key, container).addClass('enabled'); 
            });
            $('.mod_link:last-child', container).addClass('mod_last');
            $('.mod_link', container).click(function() {  
                toggleModule.call(this);
            });
        }
    };

    ges.ui.createLightbox('ges', options);              
}

function menuContent () {
    var content = '';
    var moduleBlock;
    var moduleTemplate = $('<div><a class="mod_link"><div class="mod_content"><span class="mod_name"></span><span class="mod_desc"></span></div><span class="mod_icon"></span></a></div>');
    
    ges.modules.mapModules(function(module, key, modules) {
        moduleBlock = $(moduleTemplate).clone();
        $('.mod_link', moduleBlock).attr('id', 'mod_' + key);
        $('.mod_name', moduleBlock).html(module.name);
        $('.mod_desc', moduleBlock).html(module.description);
        $('input', moduleBlock).val(key);
        content += $(moduleBlock).html();
    }); 

    return content;
}

function toggleModule() { 
    var moduleName = $(this).attr('id').slice(4);
    $(this).toggleClass('enabled'); 
    ges.modules.toggleModule(moduleName);
}
