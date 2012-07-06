function messagesClosure() {

    console.log('--> messages loaded');

    var messages = {
          'send': send
    };

    var buffer = new Buffer('gesMessageBuffer');
    var listeners = {};
    var clientRequestEvent; 

    function send(uid, data, callback) {
        buffer.setValue({ 'uid': uid, 'data': data });
        listeners[uid] = callback;
        document.dispatchEvent(clientRequestEvent);
    }

    window.addEventListener('clientResponseEvent', function() {
        var response = buffer.getValue();
        listeners[response.uid](response.data);
        delete listeners[uid];
    });

    // create the request event
    clientRequestEvent = document.createEvent('Events');
    clientRequestEvent.initEvent('clientRequestEvent', true, false);

    window.ges || (window.ges = {});
    window.ges.messages = messages;

}
