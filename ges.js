;(function() {

    Gs.ready(function() {
        loadModules();
    });

    function loadModules() {
        /*
        ges.modules.doConstruct('dupeDelete');
        ges.modules.doConstruct('bieberFever');
        */
        _.forEach(
              ges.modules.modules 
            , function(value, key, list) {
                  ges.modules.doConstruct(key);
            });
    }

})();
