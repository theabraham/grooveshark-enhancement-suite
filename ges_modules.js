;(function() {

    var modules = {
          'moduleDir': 'modules/'
        , 'modules': {}
        , 'toggleModule': toggleModule
        , 'doConstruct': doConstruct
        , 'doDestruct': doDestruct
        , 'getModuleCount': getModuleCount
        , 'setModuleProperties': setModuleProperties
        , 'mapModules': mapModules
    };

    function toggleModule(moduleName) {
        var module = modules.modules[moduleName];
        module.isEnabled ? doDestruct(moduleName)
                         : doConstruct(moduleName);
    }

    function doConstruct(moduleName) {
        var module = modules.modules[moduleName];
        module.isEnabled = true;
        module.construct();
    }

    function doDestruct(moduleName) {
        var module = modules.modules[moduleName];
        module.isEnabled = false;
        module.destruct();
    }

    function getModuleCount() {
        return Object.keys(modules.modules).length;
    }

    function setModuleProperties(moduleName, properties) {
        var module = modules.modules[moduleName]
        _.forEach(properties, function(property, name) {
            if (module.hasOwnProperty(name)) {
                module[name] = property;
            }
        });
    }

    function mapModules(mapfn) {
        _.forEach(modules.modules, mapfn); 
    } 

    window.ges || (window.ges = {});
    window.ges.modules = modules;

})();
