function codeForInjection() {
    // CODEGOESHEREOKAY
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
        #ges_nav { position:absolute; left:{{ leftPos }}px; top:4px; } \
        #ges_nav a { background:url(http://static.a.gs-cdn.net/webincludes/css/images/skeleton/nav.png); background-position:0px 128px; display:block; width:32px; height:32px; position:relative; } \
        #ges_nav a:hover { background-position:64px 128px; } \
        #ges_nav a:active { background-position:32px 128px; } \
    \ ';

    var notices = ' \
        #notifications .scrollable { max-height:200px; overflow-y:auto; } \
        #notifications li.wide { width:400px; margin:0 0 3px -150px; } \
    \ ';

    var styles = {
          'load': load
        , 'defaults': [
              { 'css': menu, 'getValues': menuValues }
            , { 'css': notices, 'getValues': function() { return false; } }
        ]
    };

    function load(style, values) {
        if (values) {
            style = style.replace(/\{\{.*?\}\}/gi, function (match) { 
                match = match.slice(2, -2);
                match = match.trim();  
                return values[match];
            });
        }

        $('<style/>').text(style).appendTo('body');
    }

    function menuValues() { 
        var iconURL = $('#sidebar_footer_new .icon').css('background-image'); 
        var leftPos = $('#nav').width() + parseInt($('#nav').css('left'));
        return { 'iconURL': iconURL, 'leftPos': leftPos };
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

    function ready(callback, waitForDOM) { 
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
        return module.isEnabled;
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
        , 'description': 'Remove duplicate songs from your current queue.'
        , 'isEnabled': true
        , 'style': false
        , 'setup': false
        , 'construct': construct
        , 'destruct': destruct
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

    modules['lyrics'] = {
          'author': 'Ibrahim Al-Rajhi'
        , 'name': 'Song Lyrics'
        , 'description': 'Show the lyrics of the currently playing song.'
        , 'isEnabled': true
        , 'style': false
        , 'setup': setup
        , 'construct': construct
        , 'destruct': destruct
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
            result.lyrics = cleanLyrics(result.lyrics);
            message = '<p><strong>' + result.song + '</strong> - <em>' + result.artist + '</em></p><br/><div class="scrollable"><p>' + result.lyrics + '</p></div>';
            options = { 'type': 'form', 'manualClose': true, 'styles': ['wide'] };
        } 
        else {
            message = '<p>Lyrics not found for <strong>' + result.song + '</strong>. If you can find the lyrics, why not \
                       share them at <a href="' + result.url + '" target="blank">Lyrics Wikia</a>?</p>';
            options = { 'type': 'error', 'manualClose': false };
        }

        ges.ui.notice(message, options);
    }

    function cleanLyrics(lyrics) {
        var clean;
        lyrics = $('<div>' + lyrics + '</div>');
        clean = $(lyrics[0].outerHTML);
        $('.rtMatcher', clean).remove();
        
        return clean.html();
    }

})(ges.modules.modules);
;(function(modules) {

    var css = ' \
        #lightbox .sc_name { display:block; color:#333; margin-bottom:8px; } \
        #lightbox .sc_wrap { display:inline-block; width:270px; margin-bottom:4px; } \
        #lightbox .sc_wrap.sc_left { margin-right:15px; } \
        #lightbox .sc_key { background:#F6F6F6; box-shadow:inset 0 1px 0 #fff; border:1px solid #B3B3B3; -webkit-border-radius:3px; width:2em; display:inline-block; text-align:center; margin-right:12px; border-bottom:2px solid #B3B3B3; font:normal 12px/20px Arial; } \
        #lightbox .sc_desc { } \
        #ges_search_pane { position:absolute; display:none; width:420px; margin-left:-222px; top:0; left:50%; z-index:99999; padding:24px; font:bold 20px/30px "Lucida Grande", Verdana, Arial, sans-serif; background:rgba(0,0,0,0.75); color:#fff; -webkit-border-radius:3px; } \
    \ ';

    modules['shortcuts'] = {
          'author': 'Ibrahim Al-Rajhi'
        , 'name': 'Shortcuts'
        , 'description': 'Make Grooveshark responsive with keyboard shortcuts; type <strong>`</strong> (backtick) to activate.'
        , 'isEnabled': true
        , 'style': { 'css': css, 'getValues': function() { return false; } }
        , 'setup': setup
        , 'construct': construct
        , 'destruct': destruct
    };

    var deletion = {  
          'name': 'Deletion'
        , 's': function() { GS.player.removeSongs(GS.player.currentSong.queueSongID); }
        , 'a': function() { $('#queue_clear_button').click(); }
    };

    var navigation = {
          'name': 'Navigation'
        , 'h': function() { follow('#/'); }
        , 'p': openPlaylist
        , 'm': function() { follow($('li.sidebar_myMusic a', '#sidebar').attr('href')); }
        , 'f': function() { follow($('li.sidebar_favorites a', '#sidebar').attr('href')); }
        , 'a': function() { follow(GS.player.getCurrentSong().toArtistUrl()); }
        , 'l': openAlbum
    };

    var shortcuts = {
          'name': 'Global'
        , '`': toggleComMode
        , '?': function() { if (GS.lightbox.isOpen) { ges.ui.closeLightbox(); } else { ges.ui.openLightbox('shortcuts'); } }
        , '/': enterSearchMode
        , '<': function() { for (var i = 0, j = cleanQuant(); i < j; i++) { $('#player_previous').click(); } }
        , '>': function() { for (var i = 0, j = cleanQuant(); i < j; i++) { $('#player_next').click(); } }
        , 'v': function() { GS.player.setVolume(this.quantifier); }
        , '+': function() { GS.player.setVolume(GS.player.getVolume() + 10); }
        , '-': function() { GS.player.setVolume(GS.player.getVolume() - 10); }
        , 'm': function() { $('#player_volume').click(); }
        , 's': function() { exitComMode(); GS.player.saveQueue(); }
        , 'a': function() { $('.page_controls .play.playTop', '#page_header').click(); }
        , 'f': function() { GS.user.addToSongFavorites(GS.player.getCurrentSong().SongID); }
        , 'r': function() { if (GS.player.player.getQueueIsRestorable()) { GS.player.restoreQueue(); } }
        , 'y': function() { GS.player.showVideoLightbox(); }
        , 'F': function() { $('#player_shuffle').click(); }
        , 'C': function() { GS.player.setCrossfadeEnabled(!GS.player.getCrossfadeEnabled()); }
        , 'H': function() { GS.player.toggleQueue(); }
        , 'L': function() { $('#player_loop').click(); }
        , 'd': deletion
        , 'g': navigation
    };

    var descriptions = {
          'intro': 'Commands marked with astericks (*) take <em>quantifiers</em>, or numbers typed before the command\'s key is pressed. This will either repeat \
                    the command a specified number of times or be used as an argument; for example, typing <em>25v</em> will set the player\'s volume to 25%.'
        , '`': 'toggle command mode'
        , '?': 'toggle the help dialogue'
        , '/': 'enter into search mode'
        , 'ds': 'delete current song'
        , 'da': 'delete all songs'
        , 'gh': 'go home'
        , 'gp': 'go to playlist (<strong>*</strong> sidebar position)'
        , 'gm': 'go to my music'
        , 'gf': 'go to my favorites'
        , 'ga': 'open playing song\'s artist'
        , 'gl': 'open playing song\'s album'
        , '<': 'previous song (<strong>*</strong> repeat count)'
        , '>': 'next song (<strong>*</strong> repeat count)'
        , 'v': 'set volume (<strong>*</strong> percentage)'
        , '+': 'increase volume'
        , '-': 'decrease volume'
        , 'm': 'toggle mute'
        , 's': 'save current queue as a playlist'
        , 'a': 'play all songs on page'
        , 'f': 'add current song to favorites'
        , 'r': 'restore previous queue'
        , 'y': 'youtube current song'
        , 'F': 'toggle shuffle'
        , 'C': 'toggle cross-fade'
        , 'H': 'toggle queue size'
        , 'L': 'cycle loop'
    };

    var router = { 
          'scope': shortcuts
        , 'quantifier': ''
        , 'curChar': ''
        , 'timer': null
        , 'comMode': false
        , 'searchMode': false
        , 'query': ''
    };

    function setup() {
        createHelpBox('Keyboard Shortcuts', createHelpContent());        
    }
    
    function construct() { 
        $('body').bind('keypress', route);
    }

    function destruct() {
        $('body').unbind('keypress', route);
        exitComMode();
    }

    function toggleComMode() {
        router.comMode ? exitComMode()
                       : enterComMode();
    }

    function enterComMode() {
        if (!router.comMode) {
            ges.ui.notice('Using <em>command mode</em><br/>type <strong>?</strong> for help<br/>press <strong>`</strong> to exit', { 'type': 'success', 'displayDuration': 5e3 });
            router.comMode = true;
            $('input, textarea').live('focus', preventFocus);        
        }
    }

    function exitComMode() {
        if (router.comMode) {
            ges.ui.notice('Exited <em>command mode</em>');
            router.comMode = false;
            $('input, textarea').die('focus', preventFocus);        
        }
    }
    
    function preventFocus() {
        $(this).blur();
    }

    function enterSearchMode() {
        if (!router.searchMode) {
            router.searchMode = true;
            router.query = '';
            showSearchPane();
            $('body').bind('keydown', buildSearch);
        }
    }

    function exitSearchMode() {
        if (router.searchMode) {
            router.searchMode = false;
            router.query = '';
            hideSearchPane();
            $('body').unbind('keydown', buildSearch);
            reset();
        }
    }

    function buildSearch(evt) {
        var curKey = String.fromCharCode(evt.keyCode);
        var isEnter = (evt.keyCode === 13);
        var isSpace = (evt.keyCode === 32);
        var isBackspace = (evt.keyCode === 8);
        var isEscape = (evt.keyCode === 27);

        if (isEnter) {
            GS.router.performSearch('song', router.query);
            exitSearchMode();
            return;
        }
        else if (isEscape) {
            exitSearchMode();
            return;
        }
        else if (isSpace) {
            router.query += ' ';
        }
        else if (isBackspace) {
            router.query = router.query.slice(0, -1);
        }
        else {
            curKey = curKey.toLowerCase();
            router.query += curKey;
        }

        updateSearchPane(router.query);
        return false;
    }

    function showSearchPane() {
        var searchTag = '<div id="ges_search_pane">...</div>';
        $('body').append(searchTag);
        $('#ges_search_pane').slideDown(250);
    }

    function hideSearchPane() {
        $('#ges_search_pane').slideUp(250).delay(250).remove();
    }

    function updateSearchPane(query) {
        $('#ges_search_pane').html(query); 
    }

    function follow(hash) {
        window.location.hash = hash;
    }

    function openPlaylist() {
        var playlistUrls = [];
        var playlistUrl;

        if (this.quantifier) {
            _.forEach(GS.user.playlists, function(playlist, key) { 
                playlistUrls[playlist.sidebarSort - 1] = playlist.toUrl(); 
            });
            playlistUrl = playlistUrls[this.quantifier - 1];
        }
        else { 
            playlistUrl = $('li.sidebar_playlists a', '#sidebar').attr('href');
        } 

        follow(playlistUrl);
    }

    function openAlbum() {
        var albumID = GS.player.getCurrentSong().AlbumID;
        GS.Models.Album.getAlbum(albumID, function(album) { 
            follow(album.toUrl()); 
        }); 
    }

    function route(evt) {
        removeTimer();
        router.curChar = String.fromCharCode(evt.keyCode);
        var isNumber = !isNaN(parseInt(router.curChar));

        if (router.searchMode) { return false; }

        if (isNumber) {
            router.quantifier += router.curChar;
        } 
        else if (typeof router.scope[router.curChar] === 'object') {
            router.scope = router.scope[router.curChar];
        }
        else if (typeof router.scope[router.curChar] === 'function') {
            callShortcut();
        }
        else {
            reset();
        }

        setTimer();
        console.log('char:', router.curChar, 'quantifier:', router.quantifier, 'scope:', router.scope, 'timer:', router.timer);
    } 

    function reset() {
        router.scope = shortcuts;
        router.quantifier = '';
        router.timer = null;
    }

    function cleanQuant() { 
        var quantifier = parseInt(router.quantifier);
        if (isNaN(quantifier)) { return 1; }
        return quantifier;
    }

    function callShortcut() {
        var shortcut = router.scope[router.curChar];
        if (typeof shortcut === 'function' && (router.comMode || shortcut === toggleComMode)) {
            shortcut.call(router);
            reset();
        }
    }

    function setTimer() {
        if (!router.timer) {
            router.timer = setTimeout(reset, 3e3);
        }
    }

    function removeTimer() {
        if (router.timer) {
            clearTimeout(router.timer);
            router.timer = null;
        }
    }

    function createHelpBox(title, content) {
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
            , 'onpopup': function() { }
        };

        ges.ui.createLightbox('shortcuts', options);              
    }

    function createHelpContent() {
        var content = '<p><span class="sc_name">Shortcut Commands</span><p>' + descriptions['intro'] + '</p></p>';
        var shortcutTemplate = $('<div><div class="sc_wrap"><span class="sc_key"></span> <span class="sc_desc"></span></div></div>');
        content = traverseShortcuts(shortcuts, '', content, shortcutTemplate);
        return content;
    }

    function traverseShortcuts(scope, parentKey, content, template) {
        var shortcutTag;

        _.forEach(scope, function(shortcut, key) {
            if (typeof shortcut === 'object') { 
                content = traverseShortcuts(scope[key], parentKey + key, content, template); 
            }
            else if (typeof shortcut === 'string') {
                content += '</p><p><span class="sc_name">' + shortcut + '</span>';
            }
            else {
                shortcutTag = $(template).clone();
                $('.sc_key', shortcutTag).html(parentKey + key);
                $('.sc_desc', shortcutTag).html(descriptions[parentKey + key]);
                content += $(shortcutTag).html();
            }
        });

        content += '</p>';
        return content;
    }

})(ges.modules.modules);
;(function() { 

    var db = {
          'getIsEnabled': getIsEnabled
        , 'setIsEnabled': setIsEnabled
    };

    var dbName = 'ges_modules';

    function getDB() {
        var moduleStore = (JSON.parse(localStorage.getItem(dbName)) || {});

        // make sure all modules are represented
        _.forEach(ges.modules.modules, function(module, name) {
            if (moduleStore[name] == null || typeof moduleStore[name] != 'object') {
                moduleStore[name] = { 'isEnabled': module.isEnabled };
            }
        });
        
        return moduleStore;
    }

    function setDB(moduleStore) {
        moduleStore = JSON.stringify(moduleStore);
        localStorage.setItem(dbName, moduleStore);
    }

    function getIsEnabled(moduleName) {
        var moduleStore = getDB();
        return moduleStore[moduleName].isEnabled;
    } 

    function setIsEnabled(moduleName, isEnabled) { 
        var moduleStore = getDB();
        moduleStore[moduleName].isEnabled = isEnabled;
        setDB(moduleStore);
    }

    window.ges || (window.ges = {});
    window.ges.db = db;

})();
ges.events.ready(function () { 
    _.forEach(ges.styles.defaults, function(style, index) {
        ges.styles.load(style.css, style.getValues());
    });
    
    // setup interface
    createMenu('Grooveshark Enhancement Suite', menuContent());
    placeMenuButton(function() { ges.ui.openLightbox('ges'); });
    $.subscribe('gs.player.queue.change', ges.ui.restorePlayerButtons);

    // construct modules
    ges.modules.mapModules(function (module, key) { 
        module.isEnabled = ges.db.getIsEnabled(key);
        if (module.style) { ges.styles.load(module.style.css, module.style.getValues()); }
        if (module.setup) { ges.modules.doSetup(key); }
        if (module.isEnabled) { ges.modules.doConstruct(key); }
    });
});

function placeMenuButton(onclick) {
    var html = $('<ul id="ges_nav"><li id="header_nav_ges"><a></a></li></ul>');
    var left = $('#nav').width() + parseInt($('#nav').css('left'));

    $('#header').append(html);
    $('a', '#header_nav_ges').click(onclick);
}

function createMenu(title, content) {
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

function menuContent() {
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
    var isEnabled = ges.modules.toggleModule(moduleName);
    $(this).toggleClass('enabled'); 
    ges.db.setIsEnabled(moduleName, isEnabled);
}
}

var returnLyricsEvent = document.createEvent('Events');
returnLyricsEvent.initEvent('returnLyricsEvent', true, false);
window.addEventListener('getLyricsEvent', getLyrics);

function getLyrics() {
    var formTag = $('#requestedLyricsInfo');
    var song = $('input[name="song"]', formTag).val();
    var artist = $('input[name="artist"]', formTag).val();
    chrome.extension.sendRequest({ 'song': song, 'artist': artist }, setLyrics);
}

function setLyrics(result) {
    var formTag = $('#requestedLyricsInfo');
    var result = JSON.stringify(result);
    $('textarea', formTag).val(result);
    document.dispatchEvent(returnLyricsEvent);
}

function injectFunction(fn) {
    var scriptID = 'gesContentScript';
    var container = document.body;
    var script = document.getElementById(scriptID);

    if (!script) {
        script = document.createElement('script');
        script.id = scriptID;
        script.textContent = '(' + fn.toString() + ')();';
        container.appendChild(script);
    }
}

injectFunction(codeForInjection);
