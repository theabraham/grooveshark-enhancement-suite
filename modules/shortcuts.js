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

    function setup() {
        createHelpBox('Keyboard Shortcuts', createHelpContent());        
    }
    
    function construct() { 
        $('body').bind('keypress', captureKey);
    }

    function destruct() {
        $('body').unbind('keypress', captureKey);
    }

    var deletion = {  
          'name': 'Deletion'
        , 's': function() { for (var i = 0, j = cleanQuant(); i < j; i++) { GS.player.removeSongs(GS.player.currentSong.queueSongID); } }
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
        , '?': 'toggle the help dialogue'
        , '/': 'enter into search mode'
        , 'ds': 'delete current song (<strong>*</strong> repeat count)'
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
    };

    function reset() {
        router.scope = shortcuts;
        router.quantifier = '';
        router.timer = null;
    }

    function captureKey(evt) {
        var isNumber, isInput = $(this).is('input, textarea');
        if (!isInput) { 
            removeTimer();
            router.curChar = String.fromCharCode(evt.keyCode);
            isNumber = !isNaN(parseInt(router.curChar));

            isNumber ? router.quantifier += router.curChar
                     : route();

            setTimer();
            console.log('char:', router.curChar, 'quantifier:', router.quantifier, 'scope:', router.scope, 'timer:', router.timer);
        }
    }

    function route() {
        switch (typeof router.scope[router.curChar]) {
            case 'object':
                router.scope = router.scope[router.curChar];
                break;
            case 'function':
                callShortcut();
                break;
            default:
                reset();
                break;
        }
    } 

    function callShortcut() {
        var shortcut = router.scope[router.curChar];
        if (typeof shortcut === 'function') {
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

    function cleanQuant() { 
        var quantifier = parseInt(router.quantifier);
        if (isNaN(quantifier)) { return 1; }
        return quantifier;
    }

    function preventFocus() {
        $(this).blur();
    }

    function follow(hash) {
        location.hash = hash;
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
