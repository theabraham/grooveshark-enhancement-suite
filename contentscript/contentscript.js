/*
 * inject closure functions that make up GES
 */

var script = document.createElement('script');
var closures = [
      bufferClosure
    , uiClosure
    , messagesClosure
    , modulesClosure
    , dupeDeleteClosure
    , lyricsClosure
    , shortcutsClosure
    , gesClosure
];

script.id = 'gesPackage';
closures.map(function(closure) {
    script.textContent += ';(' + closure.toString() + ')();';
});
document.body.appendChild(script);

/*
 * listen for requests from the injected GES and pass them on to background scripts
 * allowing the client GES to interact with background scripts 
 */

bufferClosure();
var buffer = new Buffer('gesMessageBuffer');
var clientResponseEvent;

window.addEventListener('clientRequestEvent', function() {
    var request = buffer.getValue();
    chrome.extension.sendMessage(request, function(data) {
        var response = { 'uid': request.uid, 'data': data };
        buffer.setValue(response);
        document.dispatchEvent(clientResponseEvent);
    });
});

clientResponseEvent = document.createEvent('Events'); 
clientResponseEvent.initEvent('clientResponseEvent', true, false);
