;(function() { 

    var db = {
          'getIsEnabled': getIsEnabled
        , 'setIsEnabled': setIsEnabled
    };

    var dbName = 'ges_modules';

    function getDB() {
        var moduleStore = (JSON.parse(localStorage.getItem(dbName)) || {});

        // make sure all modules are represented
        _.forEach(ges.modules.modules, function(module, name) {
            if (moduleStore[name] == null || typeof moduleStore[name] != 'object') {
                moduleStore[name] = { 'isEnabled': module.isEnabled };
            }
        });
        
        return moduleStore;
    }

    function setDB(moduleStore) {
        moduleStore = JSON.stringify(moduleStore);
        localStorage.setItem(dbName, moduleStore);
    }

    function getIsEnabled(moduleName) {
        var moduleStore = getDB();
        return moduleStore[moduleName].isEnabled;
    } 

    function setIsEnabled(moduleName, isEnabled) { 
        var moduleStore = getDB();
        moduleStore[moduleName].isEnabled = isEnabled;
        setDB(moduleStore);
    }

    window.ges || (window.ges = {});
    window.ges.db = db;

})();
