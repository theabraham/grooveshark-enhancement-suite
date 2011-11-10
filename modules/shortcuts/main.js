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

    // Constant strings for certain useful Url's.
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
        createHelpBox('Keyboard Shortcuts');        
    }
    
    function construct() { 
        $('body').bind('keydown', keyDownTarget);
        $('body').bind('keypress', keyPressCapture);
    }

    function destruct() {
        $('body').unbind('keydown', keyDownTarget);
        $('body').unbind('keypress', keyPressCapture);
    }

    // Key Events Handlers
    // -------------------

    // Was the key pressed while focused on an input? If so, we shouldn't
    // act on it, otherwise prevent any other input from stealing focus.
    var targetIsInput = false;

    // When a key is pressed, 'keydown' is the first of three events
    // triggered, and it's the only one that will tell us the original target
    // of the key press; used to determine if the target was an input or not.
    function keyDownTarget(evt) {
        targetIsInput = $(evt.target).is('input');
    }

    // When a key is pressed, 'keypress' is the second of three events
    // triggered, and it's the only one that will give us reliable 'keyCode'
    // values; used to determine if we should act on the key character or not.
    function keyPressCapture(evt) {
        var character = String.fromCharCode(evt.keyCode);
        if ((targetIsInput && character === '/') || !targetIsInput) {
            route(character);
            $('input:focus').blur();
        }
    }

    // Key Router
    // ----------

    // Object which will keep track of the current shortcut scope (for shortcut
    // chains like 'da'), multiplier, and a reset timer.
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

    // Help Lightbox
    // -------------

    // Create the help lightbox.
    function createHelpBox(title) {
        ges.ui.createLightbox('shortcuts', {
              'title': title
            , 'content': createHelpContent()
        });
    }

    // The content for our help lightbox that describes how to call the shortcuts
    // and a list of available shortcuts with their descriptions.
    function createHelpContent() {
        var content = '<p><span class="sc_name">Shortcut Commands</span><p>' + descriptions['intro'] + '</p></p>';
        var shortcutTemplate = $('<div><div class="sc_wrap"><span class="sc_key"></span> <span class="sc_desc"></span></div></div>');
        content = traverseShortcuts(shortcuts, '', content, shortcutTemplate);
        return content;
    }

    // Recursive function that goes through the shortcuts and their descriptions
    // to fill out the help lightbox.
    function traverseShortcuts(scope, parentKey, content, template) {
        var shortcutTag;
        _.forEach(scope, function(shortcut, key) {
            if (typeof shortcut === 'object') { 
                content = traverseShortcuts(scope[key], parentKey + key, content, template); 
            } else if (typeof shortcut === 'string') {
                content += '</p><p><span class="sc_name">' + shortcut + '</span>';
            } else {
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

    // Grooveshark uses hashes for navigation.
    function follow(hash) {
        location.hash = hash;
    }

    // Finds and focuses on the current page's search bar or navigates to the
    // home page's search bar.
    function findSearchBar() { 
        if ($('input.search').length === 0) { 
            follow('#/'); 
        } else if ($('input:focus, textarea:focus').length > 0) {
            $('input:focus, textarea:focus').blur().val('');
        } else {
            $('input.search').focus();
            setTimeout(function() { $('input.search').val(''); }, 50);
        }
    }

    // Used to fast-forward or rewind a song; multiplier makes each step larger.
    function seekPosition(increment) {
        if (GS.player.isPlaying) { 
            increment *= getMultiplier();
            var elapsed = convertToMS($('#player_elapsed').text());
            var duration = convertToMS($('#player_duration').text());
            GS.player.seekTo(Math.max(0, Math.min(duration, elapsed + increment)));
        }
    }
    
    // Takes a time string formatted in MM:SS (e.g. 1:36), and returns the
    // length in milliseconds (e.g. 96000.)
    function convertToMS(timeStr) {
        var time = timeStr.split(':');
        var minutes = parseFloat(time[0]);
        var seconds = parseFloat(time[1]);
        return (minutes * 60 + seconds) * 1000;
    }

    // Changes the volume by a given amount. Slider timers are manually created
    // to mimick a user hovering over the volume slider (to show the volume bar.)
    function changeVolume(amount) {
        clearTimeout(GS.player.volumeSliderTimeout);
        $('#volumeControl').show();  
        GS.player.setVolume(GS.player.getVolume() + amount);
        GS.player.volumeSliderTimeout = setTimeout(function() { 
            $('#volumeControl').hide();
        }, GS.player.volumeSliderDuration);
    }

    // Add the current song to the user's favorites, only if your unable to
    // remove the song from their favorites.
    function toggleFavorite() {
        var songID = GS.player.getCurrentSong().SongID;
        if (typeof GS.user.removeFromLibrary(songID) === 'undefined') {
            GS.user.addToSongFavorites(songID); 
        }
    }

    // Open the playlist identified by the multiplier. If no multiplier is set
    // just open the user's playlist page.
    function openPlaylist() {
        var playlistUrls = [];
        var playlistUrl;
        if (router.multiplier) {
            _.forEach(GS.user.playlists, function(playlist) { 
                playlistUrls[playlist.sidebarSort - 1] = playlist.toUrl(); 
            });
            playlistUrl = playlistUrls[router.multiplier - 1];
        } else { 
            playlistUrl = myPlaylistsUrl;
        } 
        follow(playlistUrl);
    }

    // Open the currently playing song's album page.
    function openAlbum() {
        var albumID = GS.player.getCurrentSong().AlbumID;
        GS.Models.Album.getAlbum(albumID, function(album) { 
            follow(album.toUrl()); 
        }); 
    }

}

