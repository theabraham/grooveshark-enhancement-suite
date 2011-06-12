// ==UserScript==
// @author          Ibrahim Al-Rajhi
// @name            Sandbox
// @version         1.0
// @namespace       Sandbox
// @include         http://grooveshark.com/#/*
// ==/UserScript==

var URL = 'http://localhost:4000';

var grooveshark = document.createElement('script');
grooveshark.src = URL + '/grooveshark.js';
document.body.appendChild(grooveshark);

