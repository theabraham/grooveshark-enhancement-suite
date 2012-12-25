chrome.extension.onMessage.addListener(function(request, sender, clientCallback) { 
    if (request.uid !== 'lyrics') {
        return;
    }
    
    var songInfo = request.data
    $.ajax({
          'url': 'http://lyrics.wikia.com/api.php'
        , 'data': { 'song': songInfo.song, 'artist': songInfo.artist, 'fmt': 'xml' }
        , 'success': function(data) {
              getLyricsFromLink(data, clientCallback);
          }
    });

    return true;
});

function getLyricsFromLink(data, clientCallback) {
    var lyricsInfo = { 
          'success': true
        , 'lyrics': data.getElementsByTagName('lyrics')[0].textContent
        , 'url': data.getElementsByTagName('url')[0].textContent
        , 'artist': data.getElementsByTagName('artist')[0].textContent
        , 'song': data.getElementsByTagName('song')[0].textContent
    };

    if (lyricsInfo.lyrics === 'Not found') { 
        lyricsInfo.success = false; 
        clientCallback(lyricsInfo);
        return; 
    }

    $.get(lyricsInfo.url, function(html) { 
        lyricsInfo.lyrics = $('div.lyricbox', html).html(); 
        clientCallback(lyricsInfo);
    }); 
}
