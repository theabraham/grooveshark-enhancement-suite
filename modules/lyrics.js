;(function(modules) {

    modules['lyrics'] = {
          'author': 'Ibrahim Al-Rajhi'
        , 'name': 'Song Lyrics'
        , 'description': 'Show the lyrics of the currently playing song.'
        , 'isEnabled': true
        , 'construct': construct
        , 'destruct': destruct
        , 'style': null
    };

    function construct() { 
        ges.ui.addPlayerButton('#songLyrics', {
              'label': 'Show Lyrics'
            , 'pos': 'right'
            , 'onclick': function() {}
        });
    }

    function destruct() {
        ges.ui.removePlayerButton('#songLyrics');
    }

    /*
    function getLyrics(artist, song) {
        console.log('REQUEST', 'http://lyrics.wikia.com/api.php?artist='+ encodeURIComponent(artist) +'&song='+ encodeURIComponent(song) +'&fmt=json');
        $.ajax({
              'url': 'http://localhost:4000/e
            , 'data': { artist: artist, song: song, fmt: 'xml' }
            , 'success': function(data) { 
                  console.log('GOT', data); 
                  return getLyricsFromLink(data)
              }
            , 'error': function() { console.log('ERR', arguments); }
        });
    }

    function getLyricsFromLink(data) {
        
    }

    function displayLyrics() {
        var song = GS.player.getCurrentSong();
        console.log('SONG', song);
        var lyrics = getLyrics(song.ArtistName, song.SongName);
    }
    */

})(ges.modules.modules);
