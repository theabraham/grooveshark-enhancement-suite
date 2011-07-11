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
        $('body').bind('keydown', escapeField); 
    }
    
    function construct() { 
        $('body').bind('keypress', captureKey);
        $(document).bind('keydown', preventHomeFocus);
        $(window).bind('hashchange', preventPageFocus);
    }

    function destruct() {
        $('body').unbind('keypress', captureKey);
        $(document).unbind('keydown', preventHomeFocus);
        $(window).unbind('hashchange', preventPageFocus);
    }

    var deletion = {  
          'name': 'Deletion'
        , 'a': function() { $('#queue_clear_button').click(); }
        , 's': function() { multiplier(function() { GS.player.removeSongs(GS.player.currentSong.queueSongID); }); }
    };

    var page = {
          'name': 'Song List'
        , 'a': function() { $('.play.playTop', '#page_header .page_controls').click(); }
        , 'd': function() { $('.dropdown a[name="addToQueue"]', '#page_header .page_controls').click(); }
    };

    var navigation = {
          'name': 'Navigation'
        , 'p': openPlaylist
        , 'm': function() { follow($('a', '#sidebar li.sidebar_myMusic').attr('href')); }
        , 'f': function() { follow($('a', '#sidebar li.sidebar_favorites').attr('href')); }
        , 'c': function() { follow($('a', '#header_nav_people').attr('href')); }
        , 'a': function() { follow(GS.player.getCurrentSong().toArtistUrl()); }
        , 'l': openAlbum
    };

    var shortcuts = {
          'name': 'Global'
        , '?': function() { GS.lightbox.isOpen ? ges.ui.closeLightbox() : ges.ui.openLightbox('shortcuts'); } 
        , '/': findSearchBar
        , '<': function() { multiplier(function() { $('#player_previous').click() }); }
        , '>': function() { multiplier(function() { $('#player_next').click(); }); }
        , ',': function() { seekPosition(-3000); }
        , '.': function() { seekPosition(3000); }
        , '-': function() { multiplier(changeVolume(-5)); }
        , '=': function() { multiplier(changeVolume(5)); }
        , 'm': function() { $('#player_volume').click(); }
        , 's': function() { GS.player.saveQueue(); }
        , 'f': toggleFavorite
        , 'r': function() { if (GS.player.player.getQueueIsRestorable()) { GS.player.restoreQueue(); } }
        , 'Y': function() { GS.player.showVideoLightbox(); }
        , 'F': function() { $('#player_shuffle').click(); }
        , 'H': function() { GS.player.toggleQueue(); }
        , 'L': function() { $('#player_loop').click(); }
        , 'd': deletion
        , 'p': page
        , 'g': navigation
    };

    var descriptions = {
          'intro': 'Commands marked with an asterisk (*) take <em>multipliers</em>: numbers typed before the command\'s key is pressed that will be used as an argument for the command (always optional.)'
        , '?': 'toggle the help dialogue'
        , '/': 'find a search bar'
        , '<': 'previous song (<strong>*</strong> repeat count)'
        , '>': 'next song (<strong>*</strong> repeat count)'
        , ',': 'rewind song (<strong>*</strong> skip size)'
        , '.': 'fast-forward song (<strong>*</strong> skip size)'
        , '-': 'decrease volume'
        , '=': 'increase volume'
        , 'm': 'toggle mute'
        , 's': 'save current queue as a playlist'
        , 'f': 'add current song to favorites'
        , 'r': 'restore previous queue'
        , 'Y': 'youtube current song'
        , 'F': 'toggle shuffle'
        , 'H': 'toggle queue size'
        , 'L': 'cycle looping'
        , 'ds': 'delete current song (<strong>*</strong> repeat count)'
        , 'da': 'delete all songs'
        , 'pa': 'play all songs on page'
        , 'pd': 'add all songs on page'
        , 'gp': 'go to playlist (<strong>*</strong> sidebar position)'
        , 'gm': 'go to my music'
        , 'gf': 'go to my favorites'
        , 'gc': 'go to community feed'
        , 'ga': 'open playing song\'s artist'
        , 'gl': 'open playing song\'s album'
    };

    var router = { 
          'scope': shortcuts
        , 'multiplier': ''
        , 'curChar': ''
        , 'timer': null
    };

    function reset() {
        router.scope = shortcuts;
        router.multiplier = '';
        router.timer = null;
    }

    function captureKey(evt) {
        var isNumber, isInput = ($('input:focus, textarea:focus', this).length > 0);
        if (!isInput) { 
            removeTimer();
            router.curChar = String.fromCharCode(evt.keyCode);
            isNumber = !isNaN(parseInt(router.curChar));

            isNumber ? router.multiplier += router.curChar
                     : route();

            setTimer();
            console.log('char:', router.curChar, 'multiplier:', router.multiplier, 'scope:', router.scope, 'timer:', router.timer);
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

    function cleanMulti() { 
        var multiplier = parseInt(router.multiplier);
        if (isNaN(multiplier)) { return 1; }
        return multiplier;
    }

    function multiplier(fn) {
        for (var i = 0, j = cleanMulti(); i < j; i++) { 
            fn();
        }
    }

    function preventHomeFocus(evt) {
        var isHome = $('#page').is('.gs_page_home');
        var isInput = $(evt.target).is('input');

        if (isHome && !isInput) {
            $('input.search').blur();
        }
    }

    function preventPageFocus() {
        $('input.search').blur();
    }

    // Command implementations

    function follow(hash) {
        location.hash = hash;
    }

    function findSearchBar() { 
        if (!$('input.search').length > 0) { 
            follow('#/'); 
        }
        $('input.search').focus();
        $('input.search').val('');
    }
    
    function convertToMS(timeStr) {
        var time = timeStr.split(':');
        var minutes = parseFloat(time[0]);
        var seconds = parseFloat(time[1]);
        return (minutes * 60 + seconds) * 1000;
    }

    function seekPosition(increment) {
        if (GS.player.isPlaying) {
            var elapsed = convertToMS($('#player_elapsed').text());
            var duration = convertToMS($('#player_duration').text());
            GS.player.seekTo(Math.max(0, Math.min(duration, elapsed + increment)));
        }
    }

    function changeVolume(amount) {
        clearTimeout(GS.player.volumeSliderTimeout);
        $('#volumeControl').show();  
        GS.player.setVolume(GS.player.getVolume() + amount);
        GS.player.volumeSliderTimeout = setTimeout(function() { $('#volumeControl').hide(); }, GS.player.volumeSliderDuration);
    }

    function toggleFavorite() {
        var songID = GS.player.getCurrentSong().SongID;
        if (typeof GS.user.removeFromLibrary(songID) === 'undefined') {
            GS.user.addToSongFavorites(songID); 
        }
    }

    function openPlaylist() {
        var playlistUrls = [];
        var playlistUrl;

        if (this.multiplier) {
            _.forEach(GS.user.playlists, function(playlist, key) { 
                playlistUrls[playlist.sidebarSort - 1] = playlist.toUrl(); 
            });
            playlistUrl = playlistUrls[this.multiplier - 1];
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

    // Help lightbox

    function createHelpBox(title, content) {
        var options = {
              'title': title
            , 'content': content
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
