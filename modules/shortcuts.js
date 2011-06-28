;(function(modules) {

    modules['shortcuts'] = {
          'author': 'Ibrahim Al-Rajhi'
        , 'name': 'Shortcuts'
        , 'description': 'Make Grooveshark more responsive with keyboard shortcuts.'
        , 'isEnabled': true
        , 'setup': false
        , 'construct': construct
        , 'destruct': destruct
        , 'style': false
    };

    var deletion = {  
          's': function() { GS.player.removeSongs(GS.player.currentSong.queueSongID); }
        , 'a': function() { $('#queue_clear_button').click(); }
    };

    // how to open pages pragmatically?
    var navigation = {
          'h': function() { console.log('HOME'); }
        , 'p': function() { console.log('PLAYLISTS'); }
        , 'm': function() { console.log('MUSIC'); }
        , 'f': function() { console.log('FAVORITES'); }
    };

    // create a lightbox for help
    var shortcuts = {
          '?': function() { console.log('QUESTION'); }
        , 'd': deletion
        , 'g': navigation

          // Playlist
        , 'p': function() { for (var i = 0, j = cleanQuant(); i < j; i++) { $('#player_previous').click(); } }
        , 'n': function() { for (var i = 0, j = cleanQuant(); i < j; i++) { $('#player_next').click(); } }
        , 'v': function() { GS.player.setVolume(this.quantifier); }
        , 'm': function() { $('#player_volume').click(); }
        , 's': function() { GS.player.saveQueue(); }
        , 'r': function() { if (GS.player.player.getQueueIsRestorable()) { GS.player.restoreQueue(); } }
        , 'y': function() { GS.player.showVideoLightbox(); }
        , 'S': function() { $('#player_shuffle').click(); }
        , 'F': function() { $('#player_crossfade').click(); }
        , 'L': function() { $('#player_loop').click(); }
        , 'H': function() { GS.player.toggleQueue(); }
    };

    var router = { 
          'scope': shortcuts
        , 'quantifier': ''
        , 'curChar': ''
        , 'timer': null
    };

    function construct() { 
        $('body').bind('keypress', route);
    }

    function destruct() {
        $('body').unbind('keypress', route);
    }

    function route(evt) {
        if ($('input:focus, textarea:focus').length > 0) { return; }

        removeTimer();
        router.curChar = String.fromCharCode(evt.keyCode);
        var isNumber = !isNaN(parseInt(router.curChar));

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
        if (typeof shortcut === 'function') {
            shortcut.call(router, parseInt(router.quantifier));
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

})(ges.modules.modules);
