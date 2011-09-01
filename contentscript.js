var body = document.body;
var script = document.createElement('script');

window.exports.map(function(closureCode) {
    script.textContent += ';(' + closureCode + ')();';
});

script.id = 'gesPackage';
body.appendChild(script);

