function codeForInjection() 
{
    // ... the combination of ges files will be placed here ...    
}

var returnLyricsEvent = document.createEvent('Events');
returnLyricsEvent.initEvent('returnLyricsEvent', true, false);
window.addEventListener('getLyricsEvent', getLyrics);

function getLyrics() {
    var formTag = $('#requestedLyricsInfo');
    var song = $('input[name="song"]', formTag).val();
    var artist = $('input[name="artist"]', formTag).val();
    chrome.extension.sendRequest({ 'song': song, 'artist': artist }, setLyrics);
}

function setLyrics(result) {
    var formTag = $('#requestedLyricsInfo');
    var result = JSON.stringify(result);
    $('textarea', formTag).val(result);
    document.dispatchEvent(returnLyricsEvent);
}

function injectFunction(fn) {
    var scriptID = 'gesContentScript';
    var container = document.body;
    var script = document.getElementById(scriptID);

    if (!script) {
        script = document.createElement('script');
        script.id = scriptID;
        script.textContent = '(' + fn.toString() + ')();';
        container.appendChild(script);
    }
}

injectFunction(codeForInjection);
