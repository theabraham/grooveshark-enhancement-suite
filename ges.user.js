// ==UserScript==
// @version         0.1
// @author          Ibrahim Al-Rajhi
// @namespace       http://ibrahimalrajhi.com/
// @name            Grooveshark Enhancement Suite
// @include         http://grooveshark.com/*
// ==/UserScript==

var RESOURCE_URL = 'http://localhost:4000/';

function appendScript(filename, async) {
    var script = document.createElement('script');
    filename = RESOURCE_URL + filename;
    
    if (async == null || async) {
        script.type = 'text/cjs';
        script.setAttribute('data-cjssrc', filename);
    } 
    else {
        script.src = filename;
    }

    document.body.appendChild(script);
}

appendScript('control.js', false);
appendScript('ges_styles.js');
appendScript('ges_events.js');
appendScript('ges_ui.js');
appendScript('ges_modules.js');
appendScript('modules/dupe_delete.js');
appendScript('modules/shortcuts.js');
appendScript('modules/lyrics.js');
appendScript('ges.js');
