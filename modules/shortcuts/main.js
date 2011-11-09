function shortcutsClosure() {

    ges.modules.modules['shortcuts'] = {
          'author': 'Ibrahim Al-Rajhi'
        , 'name': 'Shortcuts'
        , 'description': 'Make Grooveshark responsive with keyboard shortcuts; type <strong>?</strong> to view commands.'
        , 'isEnabled': true
        , 'setup': setup
        , 'construct': construct
        , 'destruct': destruct
    };

    var myMusicUrl = $('a#header_music_btn', '#header_mainNavigation').attr('href');
    var myFavoritesUrl = myMusicUrl + '/favorites';
    var myPlaylistsUrl = myMusicUrl + '/playlists';
    var myCommunityUrl = $('a#header_community_btn', '#header_mainNavigation').attr('href')

    var deletion = {  
          'name': 'Deletion'
        , 'a': function() { $('#queue_clear_button').click(); }
        , 's': function() { multiplyFn(function() { GS.player.removeSongs(GS.player.currentSong.queueSongID); }); }
    };

    var page = {
          'name': 'Song List'
        , 'a': function() { $('.play.playTop', '#page_header .page_controls').click(); }
        , 'd': function() { $('.dropdown a[name="addToQueue"]', '#page_header .page_controls').click(); }
    };

    var navigation = {
          'name': 'Navigation'
        , 'p': openPlaylist
        , 'm': function() { follow(myMusicUrl); }
        , 'f': function() { follow(myFavoritesUrl); }
        , 'c': function() { follow(myCommunityUrl); }
        , 'a': function() { follow(GS.player.getCurrentSong().toArtistUrl()); }
        , 'l': openAlbum
    };

    var shortcuts = {
          'name': 'Global'
        , '?': function() { GS.lightbox.isOpen ? ges.ui.closeLightbox() : ges.ui.openLightbox('shortcuts'); } 
        , '/': findSearchBar
        , '<': function() { multiplyFn(function() { $('#player_previous').click() }); }
        , '>': function() { multiplyFn(function() { $('#player_next').click(); }); }
        , ',': function() { seekPosition(-3000); }
        , '.': function() { seekPosition(3000); }
        , '-': function() { multiplyFn(changeVolume, -5); }
        , '=': function() { multiplyFn(changeVolume, 5); }
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
        , '/': 'find/escape a search bar'
        , '<': 'previous song (<strong>*</strong> repeat count)'
        , '>': 'next song (<strong>*</strong> repeat count)'
        , ',': 'rewind song (<strong>*</strong> skip size)'
        , '.': 'fast-forward song (<strong>*</strong> skip size)'
        , '-': 'decrease volume (<strong>*</strong> repeat count)'
        , '=': 'increase volume (<strong>*</strong> repeat count)'
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

    function setup() {
        createHelpBox('Keyboard Shortcuts', createHelpContent());        
    }
    
    function construct() { 
        $('body').bind('keypress', captureKey);
        $.subscribe('gs.page.home.view', rebindPreventHomeFocus);
        $(window).bind('hashchange', rebindPreventPageFocus);
        //rebindPreventHomeFocus();
    }

    function destruct() {
        $('body').unbind('keypress', captureKey);
        $.unsubscribe('gs.page.home.view', rebindPreventHomeFocus);
        $(window).unbind('hashchange', preventPageFocus);
    }

    // Key Router
    // ----------

    var router = { 
          'scope': shortcuts
        , 'multiplier': 0
        , 'timer': null
    };

    // See if the given character should be treated as a multiplier, change the
    // router's scope, call a shortcut function, or reset the router
    function route(character) {
        var next = router.scope[character];
        if (!isNaN(parseInt(character))) {
            router.multiplier = (router.multiplier * 10) + parseInt(character);
            resetTimer();
        } else {
            if (typeof next === 'object') {
                router.scope = router.scope[character];
                resetTimer();
            } else {
                if (typeof next === 'function') next();
                reset();
            }
        }
    }

    // Call the given 'fn' function for as many times as the multipliers value.
    function multiplyFn(fn, args) {
        args = (args instanceof Array || [args]);
        for (var i = getMultiplier(); i > 0; i--) {
            fn.apply(null, args);
        }
    }

    // Reset the router's 'timer'.
    function resetTimer() {
        clearTimeout(router.timer);
        router.timer = setTimeout(reset, 3e3);
    }

    // Reset the router's values and clear its timer.
    function reset() {
        router.scope = shortcuts;
        router.multiplier = 0;
        clearTimeout(router.timer);
        router.timer = null;
    }

    // Return the multiplier value or a minimum value.
    function getMultiplier() {
        var min = 1;
        return router.multiplier > min ? router.multiplier : min;
    }

    // Events Handlers
    // ---------------

    // Pass the character from the keypress event to the router if it wasn't
    // triggered inside of an input or textarea (except for the '/' character.)
    function captureKey(evt) {
        var character = String.fromCharCode(evt.keyCode);
        var focused = $('input:focus, textarea:focus').length;
        if ((focused && character === '/') || !focused) {
            route(character);
        }
    }

    // Rebinds the 'preventHomeFocus' function when returning to the homepage.
    function rebindPreventHomeFocus() {
        var keyEvents = $(document).data('events').keydown;
        var isBound = false;
        _.forEach(keyEvents, function(handler) {
            if (handler.callback === preventHomeFocus) isBound = true;
        });
        if (!isBound) $(document).bind('keydown', preventHomeFocus);
    }
    
    // Prevents the home page search bar from stealing focus.
    function preventHomeFocus(evt) {
        if (!$(evt.target).is('input')) {
            console.log('HOME BLOCKED!');
            $('input:focus').blur();
        }
    }

    function rebindPreventPageFocus() {
        $('input.search').blur();
    }

    // Prevents search bars on individual pages from stealing focus.
    function preventPageFocus() {
        console.log('PAGE BLOCKED!');
        $('input.search').blur();
    }

    // Help Lightbox
    // -------------

    function createHelpBox(title, content) {
        var options = {
              'title': title
            , 'content': content
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

    // Shortcut Implementations
    // ------------------------

    function follow(hash) {
        location.hash = hash;
    }

    function findSearchBar() { 
        if ($('input.search').length === 0) { 
            follow('#/'); 
        }
        else if ($('input:focus, textarea:focus').length > 0) {
            $('input:focus, textarea:focus').blur().val('');
        }
        else {
            $('input.search').focus();
            setTimeout(function() { $('input.search').val(''); }, 50);
        }
    }
    
    function convertToMS(timeStr) {
        var time = timeStr.split(':');
        var minutes = parseFloat(time[0]);
        var seconds = parseFloat(time[1]);
        return (minutes * 60 + seconds) * 1000;
    }

    function seekPosition(increment) {
        if (GS.player.isPlaying) { 
            increment *= getMultiplier();
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

        if (router.multiplier) {
            _.forEach(GS.user.playlists, function(playlist, key) { 
                playlistUrls[playlist.sidebarSort - 1] = playlist.toUrl(); 
            });
            playlistUrl = playlistUrls[router.multiplier - 1];
        }
        else { 
            playlistUrl = myPlaylistsUrl;
        } 

        follow(playlistUrl);
    }

    function openAlbum() {
        var albumID = GS.player.getCurrentSong().AlbumID;
        GS.Models.Album.getAlbum(albumID, function(album) { 
            follow(album.toUrl()); 
        }); 
    }

}

