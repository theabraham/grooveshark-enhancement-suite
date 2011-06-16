// ==UserScript==
// @version         0.1
// @author          Ibrahim Al-Rajhi
// @namespace       http://ibrahimalrajhi.com/
// @name            Grooveshark Enhancement Suite
// @include         http://grooveshark.com/#/*
// ==/UserScript==

var RESOURCE_URL = 'http://localhost:4000/';

function appendScript(filename, content) {
    setTimeout(function() { 
        var script = document.createElement('script');
        filename ? script.src = RESOURCE_URL + filename
                 : script.textContent = content;
        document.body.appendChild(script);
    }, 750);
}

appendScript('grooveshark.js');
appendScript('ges_modules.js');
appendScript('modules/dupe_delete.js');
appendScript('modules/bieber_fever.js');
appendScript('ges.js');
