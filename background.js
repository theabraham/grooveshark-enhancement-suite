var clientCallback;

chrome.extension.onRequest.addListener(function(songInfo, sender, callback) { 
    clientCallback = callback;

    $.ajax({
          'url': 'http://lyrics.wikia.com/api.php'
        , 'data': { 'song': songInfo.song, 'artist': songInfo.artist, 'fmt': 'xml' }
        , 'success': getLyricsFromLink
    });
});

function getLyricsFromLink(data) {
    var result = { 
          'success': true
        , 'lyrics': data.getElementsByTagName('lyrics')[0].textContent
        , 'url': data.getElementsByTagName('url')[0].textContent
        , 'artist': data.getElementsByTagName('artist')[0].textContent
        , 'song': data.getElementsByTagName('song')[0].textContent
    };

    if (result.lyrics === 'Not found') { 
        result.success = false; 
        clientCallback(result);
        return; 
    }

    $.get(result.url, function(html) { 
        result.lyrics = $('div.lyricbox', html).html(); 
        clientCallback(result);
    }); 
}
