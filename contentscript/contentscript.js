function premiumClosure() {
    setTimeout(function() {
        GS.user.IsPremium = 1;
        GS.lightbox.close();
        console.log('--> upgraded');
    }, 3e3);
}

/*
 * inject closure functions that make up GES
 */

var script = document.createElement('script');
var closures = [
      bufferClosure
    , premiumClosure
    , eventsClosure
    , uiClosure
    , messagesClosure
    , modulesClosure
    , dupeDeleteClosure
    , shortcutsClosure
    , lyricsClosure
    , dbClosure
    , gesClosure
];

script.id = 'gesPackage';
closures.map(function(closure) {
    script.textContent += ';(' + closure.toString() + ')();';
});
document.body.appendChild(script);

/*
 * listeners for requests from the injected GES and passes them on to background scripts
 * allowing the client GES to interact with background scripts 
 */

bufferClosure();
var buffer = new Buffer('gesMessageBuffer');
var clientResponseEvent;

window.addEventListener('clientRequestEvent', function() {
    var request = buffer.getValue();
    chrome.extension.sendRequest(request, function(data) {
        var response = { 'uid': request.uid, 'data': data };
        buffer.setValue(response);
        document.dispatchEvent(clientResponseEvent);
    });
});

clientResponseEvent = document.createEvent('Events'); 
clientResponseEvent.initEvent('clientResponseEvent', true, false);

