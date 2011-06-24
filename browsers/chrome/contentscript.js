function codeForInjection() 
{
    // ... the combination of ges files will be placed here ...
    
}

function injectFunction(fn) {
    var scriptID = 'gesContentScript';
    var container = document.body;
    var script = document.getElementById(scriptID);

    if (!script) {
        script = document.createElement('script');
        script.id = scriptID;
        script.textContent = '(' + fn.toString() + ')();';
        container.appendChild(script);
    }
}

injectFunction(codeForInjection);
