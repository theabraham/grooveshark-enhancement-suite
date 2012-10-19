function messagesClosure() {

    console.log('--> messages loaded');

    var messages = {
          'setup': setup
        , 'send': send
    };

    var buffer, listeners, clientRequestEvent;

    function setup() {
        buffer = new Buffer('gesMessageBuffer');
        listeners = {};
        clientRequestEvent; 
    }

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

    /* Create the request event. */
    clientRequestEvent = document.createEvent('Events');
    clientRequestEvent.initEvent('clientRequestEvent', true, false);

    window.ges || (window.ges = {});
    window.ges.messages = messages;

}
