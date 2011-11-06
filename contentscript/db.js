function dbClosure() { 

    console.log('--> db loaded');
    var db = {
          'getModule': getModule
        , 'setModule': setModule
    };

    var dbName = 'ges_database';

    function getDB() {
        var database = (JSON.parse(localStorage.getItem(dbName)) || {});

        // make sure all modules are represented
        _.forEach(ges.modules.modules, function(module, moduleName) {
            if (database[moduleName] == null || typeof database[moduleName] != 'object') {
                database[moduleName] = defaultModuleInfo(module);
            }
        });
        
        return database;
    }

    function setDB(database) {
        database = JSON.stringify(database);
        localStorage.setItem(dbName, database);
    }

    function getModule(moduleName, property) {
        var moduleStore = getDB()[moduleName];
        return property == null ? moduleStore
                                : moduleStore[property];
    }

    function setModule(moduleName, properties) {
        var database = getDB();
        var moduleStore = database[moduleName];

        _.forEach(properties, function(property, key) {
            moduleStore[key] = property;
        });

        database[moduleName] = moduleStore;
        setDB(database);
    }

    function defaultModuleInfo(module) {
        return { 'isEnabled': module.isEnabled, 'options': [] };
    }

    window.ges || (window.ges = {});
    window.ges.db = db;

}

