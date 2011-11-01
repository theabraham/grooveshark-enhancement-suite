function lyricsClosure() {

    ges.modules.modules['lyrics'] = {
          'author': 'Ibrahim Al-Rajhi'
        , 'name': 'Song Lyrics'
        , 'description': 'Show the lyrics of the currently playing song.'
        , 'isEnabled': true
        , 'setup': false
        , 'construct': construct
        , 'destruct': destruct
    };

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
        var songInfo, message, options;

        if (song) { 
            songInfo = { 'song': song.SongName, 'artist': song.ArtistName };
            ges.messages.send('lyrics', songInfo, displayLyrics);
        }
        else {
            message = 'Play a song before requesting its lyrics';
            options = { 'type': 'error', 'manualClose': false };
            ges.ui.notice(message, options);
        }
    }

    function displayLyrics(lyricsInfo) {
        var message, options;

        if (lyricsInfo.success) {
            lyricsInfo.lyrics = cleanLyrics(lyricsInfo.lyrics);
            message = '<p><strong>' + lyricsInfo.song + '</strong> - <em>' + lyricsInfo.artist + '</em></p><br/><div class="scrollable"><p>' + lyricsInfo.lyrics + '</p></div>';
            options = { 'type': 'form', 'manualClose': true, 'styles': ['wide'] };
        } 
        else {
            message = '<p>Lyrics not found for <strong>' + lyricsInfo.song + '</strong>. If you can find the lyrics, why not share them at <a href="' + lyricsInfo.url + '" target="blank">Lyrics Wikia</a>?</p>';
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

}

