function shortcutsClosure() {

    console.log('--> shortcuts loaded');

    ges.modules.modules['shortcuts'] = {
          'name': 'Shortcuts'
        , 'description': 'Make Grooveshark responsive with keyboard shortcuts; type <strong>?</strong> to view commands.'
        , 'isEnabled': true
        , 'setup': setup
        , 'construct': construct
        , 'destruct': destruct
        , 'toggleLightbox': toggleLightbox
    };

    /* 
     * Map Shortcuts to Functions
     */

    var deletion = {  
          'name': 'Deletion'
        , 'a': deleteAllSongs
        , 's': function() { multiplyFn(function() { deleteCurrentSong(); }); }
    };

    var page = {
          'name': 'Song List'
        , 'a': playAllSongs
        , 'd': addAllSongs
    };

    var navigation = {
          'name': 'Navigation'
        , 'p': function() { follow(profileUrl); }
        , 'm': function() { follow(musicUrl); }
        , 'f': function() { follow(favoritesUrl); }
        , 'c': function() { follow(communityUrl); }
        , 'a': gotoCurrentArtist
        , 'l': gotoCurrentAlbum 
    };

    var shortcuts = {
          'name': 'Global'
        , '?': function() { toggleLightbox(); }
        , '/': findSearchBar
        , '<': function() { multiplyFn(function() { GS.Services.SWF.previousSong(); }); }
        , '>': function() { multiplyFn(function() { GS.Services.SWF.nextSong(); }); }
        , ',': function() { seekPosition(-3000); }
        , '.': function() { seekPosition(3000); }
        , '-': function() { multiplyFn(changeVolume, -5); }
        , '=': function() { multiplyFn(changeVolume, 5); }
        , '&nbsp;': function() {}
        , 'm': function() { $('#volume').click(); }
        , 'l': toggleLibrary
        , 'f': toggleFavorite
        , 'r': function() { GS.Services.SWF.restoreQueue(); }
        , 'q': toggleQueueDisplay
        , 'D': ges.modules.modules.dupeDelete.removeDuplicates
        , 'L': ges.modules.modules.lyrics.requestLyrics
        , 'd': deletion
        , 'p': page
        , 'g': navigation
				, 's': toggleSidebar
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
        , '&nbsp;': 'spacebar to play/pause'
        , 'm': 'toggle mute'
        , 'l': 'add song to library'
        , 'f': 'add song to favorites'
        , 'r': 'restore previous queue'
        , 'q': 'toggle queue display'
        , 'D': 'remove duplicate songs in queue'
        , 'L': 'show lyrics for the currently playing song'
        , 'ds': 'delete current song (<strong>*</strong> repeat count)'
        , 'da': 'delete all songs'
        , 'pa': 'play all songs on page'
        , 'pd': 'add all songs on page'
        , 'gp': 'go to my profile'
        , 'gm': 'go to my music'
        , 'gf': 'go to my favorites'
        , 'gc': 'go to community feed'
        , 'ga': 'open playing song\'s artist'
        , 'gl': 'open playing song\'s album'
				, 's' : 'toggle sidebar'
    };

    /* 
     * Setup, Construct, and Destruct 
     */

    var profileUrl, musicUrl, favoritesUrl, communityUrl;

    function setup() {
        profileUrl = $('a#profile-button').attr('href');
        musicUrl = profileUrl + '/collection';
        favoritesUrl = profileUrl + '/collection/favorites';
        communityUrl = '/community';

        /* Create the shortcut's lightbox view. */
        GS.Views.Lightboxes.Shortcuts = GS.Views.Lightboxes.Base.extend({
            initialize: function() {
                this._super('initialize');
            },

            render: function() {
                this._super('render'); 
                this.$el.html(this.renderTemplate(createHelpContent()));
                this._super('onTemplate'); 
            }
        });
    }
    
    function construct() { 
        $('body').bind('keydown', keyDownTarget);
        $('body').bind('keypress', keyPressCapture);
    }

    function destruct() {
        $('body').unbind('keydown', keyDownTarget);
        $('body').unbind('keypress', keyPressCapture);
    }

    /* 
     * Shortcut Lightbox
     */

    /* The content for our help lightbox that describes how to call the shortcuts
       and a list of available shortcuts with their descriptions. */
    function createHelpContent() {
        var header = '<h2 class="title">Shortcuts</h2><a id="lightbox-close" class="hide close btn btn-rounded btn-icon-only btn-dark"><i class="icon icon-ex-white-outline"></i></a>';
        var footer = '<div id="lightbox-footer-right" class="right"></div><div id="lightbox-footer-left" class="left"><a class="btn btn-large close" data-translate-text="CLOSE">Close</a></div>';

        var content = '<p><span class="sc_name">Shortcut Commands</span><p>' + descriptions['intro'] + '</p></p>';
        var shortcutTemplate = $('<div><div class="sc_wrap"><span class="sc_key"></span><span class="sc_desc"></span></div></div>');
        content = traverseShortcuts(shortcuts, '', content, shortcutTemplate);

        return '<div>' +
                   '<div id="lightbox-header">' + header + '</div>' +
                   '<div id="lightbox-content"><div class="lightbox-content-block">' + content + '</div></div>' +
                   '<div id="lightbox-footer">' + footer + '</div>' +
               '</div>';
    }

    /* Recursive function that goes through the shortcuts and their descriptions
       to fill out the help lightbox. */
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

    /* Open the shortcuts lightbox if none other is open. */
    function toggleLightbox() {
        $('#lightbox').html() ? GS.trigger('lightbox:close')
                              : GS.trigger('lightbox:open', 'shortcuts');
    }

    /* 
     * Key Events Handlers
     */

    /* Was the key pressed while focused on an input? If so, we shouldn't
       act on it, otherwise prevent any other input from stealing focus. */
    var targetIsInput = false;

    /* When a key is pressed, 'keydown' is the first of three events
       triggered, and it's the only one that will tell us the original target
       of the key event; used to determine if the target was an input or not. */
    function keyDownTarget(evt) {
        targetIsInput = $(evt.target).is('input, textarea');
    }

    /* When a key is pressed, 'keypress' is the second of three events
       triggered, and it's the only one that will give us reliable 'keyCode' 
       values; used to determine if we should act on the key character or not. */
    function keyPressCapture(evt) {
        var character = String.fromCharCode(evt.keyCode);
        if (targetIsInput && character === '/') {
            route(character);
        } else if (!targetIsInput) {
            $('input:focus, textarea:focus').blur();
            route(character);
        }
    }

    /* 
     * Key Router 
     */

    /* Object which will keep track of the current shortcut scope (for shortcut
       chains like 'da'), multiplier, and a reset timer. */
    var router = { 
          'scope': shortcuts
        , 'multiplier': 0
        , 'timer': null
    };

    /* See if the given character should be treated as a multiplier, change the
       router's scope, call a shortcut function, or reset the router */
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

    /* Call the given 'fn' function for as many times as the multipliers value. */
    function multiplyFn(fn, args) {
        args = (args instanceof Array || [args]);
        for (var i = getMultiplier(); i > 0; i--) {
            fn.apply(null, args);
        }
    }

    /* Reset the router's 'timer'. */
    function resetTimer() {
        clearTimeout(router.timer);
        router.timer = setTimeout(reset, 3e3);
    }

    /* Reset the router's values and clear its timer. */
    function reset() {
        router.scope = shortcuts;
        router.multiplier = 0;
        clearTimeout(router.timer);
        router.timer = null;
    }

    /* Return the multiplier value or a minimum value. */
    function getMultiplier() {
        var min = 1;
        return router.multiplier > min ? router.multiplier : min;
    }

    /* 
     * Shortcut Implementations
     */

    /* Grooveshark uses hashes for navigation. */
    function follow(hash) {
        location.hash = hash;
    }

    /* Toggle sidebar display. */
		function toggleSidebar() {
      $('#sidebar-utility a#toggle-sidebar').click();
		}

    /* Finds and focuses on the current page's search bar or navigates to the
       home page's search bar. */
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

    /* Used to fast-forward or rewind a song; multiplier makes each step larger. */
    function seekPosition(increment) {
        increment *= getMultiplier();
        var elapsed = convertToMS($('#time-elapsed').text());
        var duration = convertToMS($('#time-total').text());
        Grooveshark.seekToPosition(Math.max(0, Math.min(duration, elapsed + increment)));
    }
    
    /* Takes a time string formatted in MM:SS (e.g. 1:36), and returns the
       length in milliseconds (e.g. 96000.) */
    function convertToMS(timeStr) {
        var time = timeStr.split(':');
        var minutes = parseFloat(time[0]);
        var seconds = parseFloat(time[1]);
        return (minutes * 60 + seconds) * 1000;
    }

    /* Changes the volume by a given amount. Mimick a user hovering over the 
       volume slider (to show the volume bar.) */
    function changeVolume(amount) {
        Grooveshark.setVolume(Grooveshark.getVolume() + amount);
        $('#volume').trigger('mouseenter');  
        setTimeout(function() { 
            $('#volume').trigger('mouseleave');
        }, 500);
    }

    /* Add the current song to or remove from the user's library. */
    function toggleLibrary() {
        var song = new GS.Models.Song({ SongID: GS.Services.SWF.getCurrentQueue().activeSong.SongID });
        var user = new GS.Models.User({ UserID: GS.getLoggedInUserID() });
        
        if (song.get('fromLibrary')) {
            user.removeSongsFromLibrary([song.get('SongID')]);
        } else {
            user.addSongsToLibrary([song.get('SongID')]);
        }
    }

    /* Add the current song to or remove from the user's favorites. */
    function toggleFavorite() {
        var song = new GS.Models.Song({ SongID: GS.Services.SWF.getCurrentQueue().activeSong.SongID });
        var user = new GS.Models.User({ UserID: GS.getLoggedInUserID() });
        var type = 'Songs';
        
        if (song.get('isFavorite')) {
            user.unfavorite(type, song.get('SongID'));
        } else {
            user.favorite(type, song.get('SongID'));
        }
    }

    /* Toggle the queue display's visibility. */
    function toggleQueueDisplay() {
        $('#queue-toggle').click();
    }

    /* Clear the current queue. */
    function deleteAllSongs() { 
        $('#queue-menu-btn').click();
        $('.jj_menu_item_clear_queue').click();
    }

    /* Remove the currently active song from the queue. */
    function deleteCurrentSong() { 
        var song = GS.Services.SWF.getCurrentQueue().activeSong;
        GS.Services.SWF.removeSongs([song.queueSongID]);
    }

    /* Play all songs listed on the current page. */
    function playAllSongs() {
        $('a.play-button').first().click();
    }

    /* Add all songs listed on the current page. */
    function addAllSongs(autoplay) {
        $('a.add-button').first().click();
    }

    /* Open the currently playing song artist's page. */
    function gotoCurrentArtist() {
        var song = GS.Services.SWF.getCurrentQueue().activeSong;
        var artist = new GS.Models.Artist({ ArtistID: song.ArtistID });
        follow(artist.toUrl());
    }

    /* Open the currently playing song's album page. */
    function gotoCurrentAlbum() {
        var song = GS.Services.SWF.getCurrentQueue().activeSong;
        var album = new GS.Models.Album({ AlbumID: song.AlbumID });
        follow(album.toUrl());
    }

}
