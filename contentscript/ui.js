function uiClosure() {

    console.log('--> ui loaded');

    var ui = {
          'notice': notice
    };

    function notice(description, options) {
        options = (options || {});
        options.description = (description || '');
        options.title = (options.title || '');
        options.type = (options.type || 'success'); // error or sucess
        options.duration = (options.duration || 6500); // falsy values make the notice stick
        options.url = (options.url || '');

        GS.trigger('notification:add', options);
    }

    window.ges || (window.ges = {});
    window.ges.ui = ui;

}

