// ==UserScript==
// @version         0.1
// @author          Ibrahim Al-Rajhi
// @namespace       http://ibrahimalrajhi.com/
// @name            Grooveshark Enhancement Suite
// @include         http://grooveshark.com/#/*
// ==/UserScript==

var RESOURCE_URL = 'http://localhost:4000/';

function appendScript(filename, async) {
        async != undefined || (async = true);
        filename = RESOURCE_URL + filename;
        var script = document.createElement('script');
        
        if (async) {
            script.type = 'text/cjs';
            script.setAttribute('data-cjssrc', filename);
        } else {
            script.src = filename;
        }

        document.body.appendChild(script);
}

appendScript('control.js', false);
appendScript('grooveshark.js');
appendScript('ges_modules.js');
appendScript('modules/dupe_delete.js');
appendScript('modules/bieber_fever.js');
appendScript('ges.js');
