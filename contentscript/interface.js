var getLyricsEvent = document.createEvent('Events');
getLyricsEvent.initEvent('getLyricsEvent', true, false);
window.addEventListener('returnLyricsEvent', displayLyrics);

