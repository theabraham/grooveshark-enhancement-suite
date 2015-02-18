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
        , 's': function() { multiplyFn(deleteCurrentSong); }
    };

    var page = {
          'name': 'Song List'
        , 'a': playAllSongs
        , 'd': addAllSongs
    };

    var navigation = {
          'name': 'Navigation'
        , 'h': function() { follow('!/'); }
        , 'p': function() { follow(profileUrl); }
        , 'c': function() { follow(collectionUrl); }
        , 'f': function() { follow(favoritesUrl); }
        , 'q': function() { follow('!/queue'); }
        , 'a': gotoCurrentArtist
        , 'l': gotoCurrentAlbum 
    };

    var shortcuts = {
          'name': 'Global'
        , '?': function() { toggleLightbox(); }
        , '<': function() { multiplyFn(Grooveshark.previous); }
        , '>': function() { multiplyFn(Grooveshark.next); }
        , ',': function() { seekPosition(-3000); }
        , '.': function() { seekPosition(3000); }
        , '-': function() { multiplyFn(changeVolume, -5); }
        , '=': function() { multiplyFn(changeVolume, 5); }
        , '&nbsp;': function() {}
        , 'm': function() { $('#volume').click(); }
        , 'l': toggleLibrary
        , 'f': toggleFavorite
        , 'r': function() { GS.trigger('player:restore'); }
        , 'h': shareCurrentSong
        , 'D': ges.modules.modules.dupeDelete.removeDuplicates
        , 'L': ges.modules.modules.lyrics.requestLyrics
        , 'd': deletion
        , 'p': page
        , 'g': navigation
    };

    var descriptions = {
          'intro': 'Commands marked with an asterisk (*) take <em>multipliers</em>: numbers typed before the command\'s key is pressed that will be used as an argument for the command (always optional.)'
        , '?': 'toggle the help dialogue'
        , '<': 'previous song (<strong>*</strong> repeat count)'
        , '>': 'next song (<strong>*</strong> repeat count)'
        , ',': 'rewind song (<strong>*</strong> skip length)'
        , '.': 'fast-forward song (<strong>*</strong> skip length)'
        , '-': 'decrease volume (<strong>*</strong> repeat count)'
        , '=': 'increase volume (<strong>*</strong> repeat count)'
        , '&nbsp;': 'spacebar to play/pause'
        , 'm': 'toggle mute'
        , 'l': 'add song to library'
        , 'f': 'add song to favorites'
        , 'r': 'restore previous queue'
        , 'h': 'share current song'
        , 'D': 'remove duplicate songs in queue'
        , 'L': 'show lyrics for the currently playing song'
        , 'ds': 'delete current song (<strong>*</strong> repeat count)'
        , 'da': 'delete all songs'
        , 'pa': 'play all songs on page'
        , 'pd': 'add all songs on page'
        , 'gh': 'go home'
        , 'gp': 'go to my profile'
        , 'gc': 'go to my collection'
        , 'gf': 'go to my favorites'
        , 'gq': 'go to queue'
        , 'ga': 'open playing song\'s artist'
        , 'gl': 'open playing song\'s album'
    };

    /* 
     * Setup, Construct, and Destruct 
     */

    var profileUrl, collectionUrl, favoritesUrl;

    function updateUserUrls() {
        var authUser = GS.Models.AuthUser.newOrUpdate({ UserID: GS.getLoggedInUserID() });
        profileUrl = authUser.toUrl();
        collectionUrl = authUser.toUrl('collection');
        favoritesUrl = authUser.toUrl('collection/favorites');
    }

    function setup() {
        updateUserUrls();

        /* Create the shortcut's lightbox view. */
        GS.Views.Lightboxes.Shortcuts = GS.Views.Lightboxes.Base.extend({
            initialize: function() {
                this._super('initialize');
            },

            render: function() {
                this._super('render'); 
                this.$el.html(this.renderTemplate(createHelpContent()));
                this._super('onTemplate'); 
                GS.trigger('lightbox:rendered');
            }
        });
    }
    
    function construct() { 
        GS.on('switchUser', updateUserUrls);
        $('body').bind('keydown.ges', keyDownTarget);
        $('body').bind('keypress.ges', keyPressCapture);
    }

    function destruct() {
        GS.off('switchUser', updateUserUrls);
        $('body').unbind('keydown.ges', keyDownTarget);
        $('body').unbind('keypress.ges', keyPressCapture);
    }

    /* 
     * Shortcut Lightbox
     */

    /* The content for our help lightbox that describes how to call the shortcuts
       and a list of available shortcuts with their descriptions. */
    function createHelpContent() {
        var header = '<h2 class="title">Shortcuts</h2>';
        var footer = '<a class="btn btn-full btn-success close">Got it!</a>';

        var content = '<p><span class="sc_name">Shortcut Commands</span><p>' + descriptions['intro'] + '</p></p>';
        var shortcutTemplate = $('<div><div class="sc_wrap"><span class="sc_key"></span><span class="sc_desc"></span></div></div>');
        content = traverseShortcuts(shortcuts, '', content, shortcutTemplate);

        return '<div>' +
                   '<div class="lightbox-header">' + header + '</div>' +
                   '<div class="lightbox-content"><div class="lightbox-content-block">' + content + '</div></div>' +
                   '<div class="lightbox-footer">' + footer + '</div>' +
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
        if ($('#lightbox-outer').hasClass('hide-lb')) {
            GS.trigger('lightbox:open', 'shortcuts');
        } else {
            GS.trigger('lightbox:close');
        }
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
        targetIsInput = $(evt.target).is('input, textarea, select, [contenteditable]');
    }

    /* When a key is pressed, 'keypress' is the second of three events
       triggered, and it's the only one that will give us reliable 'keyCode' 
       values; used to determine if we should act on the key character or not. */
    function keyPressCapture(evt) {
        var character = String.fromCharCode(evt.keyCode);
        if (!targetIsInput) {
            $('input:focus, textarea:focus, select:focus, [contenteditable]:focus').blur();
            route(character);
            return false;
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

    /* Share the currently playing song. */
    function shareCurrentSong() {
        var song = Grooveshark.getCurrentSongStatus().song;
        if (song) {
            GS.trigger('lightbox:open', 'share', { item: GS.Models.Song.newOrUpdate({ SongID: song.songID }) });
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
    var volumeMouseOutTimer;
    function changeVolume(amount) {
        var current = Grooveshark.getVolume() * 100;
        var updated = Math.max(0, Math.min(100, current + amount));
        Grooveshark.setVolume(updated);
        $('#volume').trigger('mouseenter');
        clearTimeout(volumeMouseOutTimer);
        volumeMouseOutTimer = setTimeout(function() { 
            $('#volume').trigger('mouseleave');
        }, 2000);
    }

    /* Add the current song to or remove from the user's library. */
    function toggleLibrary() {
        var song = Grooveshark.getCurrentSongStatus().song;
        var user = GS.Models.AuthUser.newOrUpdate({ UserID: GS.getLoggedInUserID() });
        var songModel;
        
        if (!song) {
            return;
        }
        songModel = GS.Models.Song.newOrUpdate({ SongID: song.songID });
        if (song.isInLibrary) {
            user.removeSongsFromLibrary([songModel]);
        } else {
            user.addSongsToLibrary([songModel]);
        }
    }

    /* Add the current song to or remove from the user's favorites. */
    function toggleFavorite() {
        var song = Grooveshark.getCurrentSongStatus().song;
        var user = GS.Models.AuthUser.newOrUpdate({ UserID: GS.getLoggedInUserID() });
        var type = 'Songs';
        var songModel;
        
        if (!song) {
            return;
        }
        songModel = GS.Models.Song.newOrUpdate({ SongID: song.songID });
        if (song.isFavorite) {
            user.unfavorite(type, songModel);
        } else {
            user.favorite(type, songModel);
        }
    }

    /* Clear the current queue. */
    function deleteAllSongs() { 
        $('.queue-trash').click();
    }

    /* Remove the currently active song from the queue. */
    function deleteCurrentSong() { 
        Grooveshark.removeCurrentSongFromQueue();
    }

    /* Play all songs listed on the current page. */
    function playAllSongs() {
        var data = $('#page-content .module.song').first().data(); 
        var collection = data && data.module.grid && data.module.grid.collection;
        var playContext = new GS.Models.PlayContext();
        
        if (collection) {
            GS.trigger('player:addSongs', collection.models, GS.Models.Player.playSpecialIndexes.DEFAULT, true, playContext);
        }
    }

    /* Add all songs listed on the current page. */
    function addAllSongs() {
        var data = $('#page-content .module.song').first().data(); 
        var collection = data && data.module.grid && data.module.grid.collection;
        var playContext = new GS.Models.PlayContext();
        
        if (collection) {
            GS.trigger('player:addSongs', collection.models, GS.Models.Player.playSpecialIndexes.LAST, false, playContext);
        }
    }

    /* Open the currently playing song artist's page. */
    function gotoCurrentArtist() {
        var song = Grooveshark.getCurrentSongStatus().song;
        var artist = GS.Models.Artist.newOrUpdate({ ArtistID: song.artistID });
        follow(artist.toUrl());
    }

    /* Open the currently playing song's album page. */
    function gotoCurrentAlbum() {
        var song = Grooveshark.getCurrentSongStatus().song;
        var album = GS.Models.Album.newOrUpdate({ AlbumID: song.albumID });
        follow(album.toUrl());
    }

}
