;(function() { 

    var db = {
          'getIsEnabled': getIsEnabled
        , 'setIsEnabled': setIsEnabled
        , 'getOptions': getOptions
        , 'setOptions': setOptions
        , 'getData': getData
        , 'setData': setData
    };

    var dbName = 'ges_database';

    function getIsEnabled(moduleName) {
        var moduleStore = getModule(moduleName) 
        return moduleStore.isEnabled;
    } 

    function setIsEnabled(moduleName, isEnabled) { 
        setModule(moduleName, { 'isEnabled': isEnabled });
    }

    function getOptions(moduleName) {
        var moduleStore = getModule(moduleName) 
        return moduleStore.options;
    }

    function setOption(moduleName, options) {
        setModule(moduleName, { 'options': options });
    }

    function getData(moduleName) {
        var moduleStore = getModule(moduleName) 
        return moduleStore.data;
    }

    function setData(moduleName, data) {
        setModule(moduleName, { 'data': data });
    }

    function getDB() {
        var database = (JSON.parse(localStorage.getItem(dbName)) || {});
        var moduleStore = database.moduleStore || (database.moduleStore = {});

        // make sure all modules are represented
        _.forEach(ges.modules.modules, function(module, name) {
            if (moduleStore[name] == null || typeof moduleStore[name] != 'object') {
                moduleStore[name] = defaultModuleInfo(module);
            }
        });
        
        return database;
    }

    function setDB(database) {
        database = JSON.stringify(database);
        localStorage.setItem(dbName, database);
    }

    function defaultModuleInfo(module) {
        var isEnabled = module.isEnabled;
        var options = {};

        _.forEach(module.options, function(option, name) {
            options[name] = option.defaultValue;
        });

        return { 'isEnabled': isEnabled, 'options': options, 'data': {} };
    }

    function getModule(moduleName) {
        return getDB().moduleStore[moduleName];
    }

    function setModule(moduleName, properties) {
        var database = getDB();
        var moduleStore = getModule(moduleName);

        _.forEach(properties, function(name, value) {
            if (moduleStore[name] == null) { return; }
            moduleStore[name] = value;
        });

        database.moduleStore[moduleName] = moduleStore;
        setDB(database);
    }

    window.ges || (window.ges = {});
    window.ges.db = db;

})();
