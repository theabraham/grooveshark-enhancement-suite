Will add more here eventually; quick overview:

**browsers/**: Browser specific implementations of the extension, usually centered around injecting a user script -- a combination of all 'ges' files. Currently available for only Chrome, but could easily be extended to Firefox, Safari, and Opera.
**modules/**: Modules are pretty independant from the rest of the project, and have access to all the functions provided by the 'ges' object. Each module is exported to the enhancement suite via an object attached to the 'ges.modules.modules' object, providing a set of functions and variables for its execution. Here are a few particular attributes:
- **isEnabled** is a boolean that determines the modules default state (can be overidden if the user disabled the module in a previous session.)
- **style** is an object that takes a *css* string to assosciate with the modules and a *getValues* function. The getValues function should return an object that replaces template variables in the provided css: background-image:{{ iconURL }} -> { 'iconURL': $('someElement').css('background-image') }
- **setup** is called when the Grooveshark webpage is ready
- **construct** is called when the module is *enabled*
- **destruct** is called when the module is *disabled*
ntrol.js, ges.user.js, server.js**: Aren't used in the final product, but useful for development. Control.js ensures files are loaded in order, ges.user.js injects script files into the page, and server.js is a node.js server which hosts those files from localhost.
s files**: The implementation of the 'ges' object:
- **ges_ui.js** allows for on the fly lightboxes, notices, and player buttons
- **ges_events.js** creates an event for when the Grooveshark page has loaded and allows for the subscription to 'GS.player' events
- **ges_db.js** allows for easier localstorage usage; currently used to remember a modules enabled state
- **ges_styles.js** allows for the templatizing and loading of JavaScript string stylesheets
- **ges_modules.js** manages modules 
- **ges.js** actual implementation that brings everything together

        
