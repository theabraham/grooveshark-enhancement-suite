;(function() {

    Gs.ready(function() {
        loadModules();
    });

    function loadModules() {
        _.forEach(
              ges.modules.modules 
            , function(value, key) {
                if (value.isEnabled) {
                    ges.modules.doConstruct(key);
                }
            });
    }

})();
