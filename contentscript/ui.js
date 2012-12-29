function uiClosure() {

    console.log('--> ui loaded');

    var ui = {
          'notice': notice
    };

    function notice(description, options) {
        /* 
         * Options attributes:
         *   - title: the notice's title.
         *   - description: the notice's message.
         *   - type: either 'success' or 'error'; default is neither.
         *   - url: link to send those who click the notice.
         *   - duration: set to 0ms to make the notice sticky; default 6500ms.
         */
        options = (options || {});
        options.description = description;

        GS.trigger('notification:add', options);
    }

    window.ges || (window.ges = {});
    window.ges.ui = ui;

}

