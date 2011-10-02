function injectClosureStrings() {
    var script = document.createElement('script');
    script.id = 'gesPackage';

    window.closureStrings.map(function(closureString) {
        script.textContent += ';(' + closureString + ')();';
    });

    document.body.appendChild(script);
}

injectClosureStrings();

