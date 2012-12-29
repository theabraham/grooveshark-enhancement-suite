function lyricsClosure() {

    console.log('--> lyrics loaded');

    ges.modules.modules['lyrics'] = {
          'author': 'Ibrahim Al-Rajhi'
        , 'name': 'Song Lyrics'
        , 'description': 'Show the lyrics of the currently playing song.'
        , 'isEnabled': true
        , 'setup': false
        , 'construct': construct
        , 'destruct': destruct
        , 'requestLyrics': requestLyrics 
    };

    function construct() { 
    }

    function destruct() {
    }

    /* Using the current song's information, send a request to lyric's background
       script to fetch it's lyrics. */
    function requestLyrics() {
        var song = GS.Services.SWF.getCurrentQueue().activeSong;
        var songInfo;

        if (song) { 
            songInfo = { 'song': song.SongName, 'artist': song.ArtistName };
            ges.messages.send('lyrics', songInfo, displayLyrics);
        } else {
            ges.ui.notice('Play a song before requesting its lyrics.', { title: 'No active song', type: 'error' });
        }
    }

    /* Callback from requesting lyrics; display the lyrics if given, or display an error. */
    function displayLyrics(lyricsInfo) {
        var message, options;

        if (lyricsInfo.success) {
            lyricsInfo.lyrics = cleanLyrics(lyricsInfo.lyrics);
            message = '<div class="scrollable">' + lyricsInfo.lyrics + '</div>';
            options = { title: lyricsInfo.song, duration: 0 };
        } else {
            message = 'Lyrics not found for <strong>' + lyricsInfo.song + '</strong>. If you know the lyrics to this song, <a target="_blank" href="' + lyricsInfo.url +'">share them here</a>.';
            options = { title: 'Lyrics not found', type: 'error' };
        }

        ges.ui.notice(message, options);
    }

    /* Wrap the raw `lyrics` html in a div and remove unnecessary elements. */
    function cleanLyrics(lyrics) {
        var clean;
        lyrics = $('<div>' + lyrics + '</div>');
        clean = $(lyrics[0].outerHTML);
        $('.rtMatcher', clean).remove();
        
        return clean.html();
    }

}

