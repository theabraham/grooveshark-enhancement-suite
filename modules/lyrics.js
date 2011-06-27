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
