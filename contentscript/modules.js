function modulesClosure() {

    console.log('--> modules loaded');
    var modules = {
          'modules': {}
        , 'getModuleCount': getModuleCount
        , 'setModuleProperties': setModuleProperties
        , 'toggleModule': toggleModule
        , 'mapModules': mapModules
        , 'doSetup': doSetup
        , 'doConstruct': doConstruct
        , 'doDestruct': doDestruct
    };

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

    function toggleModule(moduleName) {
        var module = modules.modules[moduleName];
        module.isEnabled ? doDestruct(moduleName)
                         : doConstruct(moduleName);
        return module.isEnabled;
    }

    function mapModules(mapfn) {
        _.forEach(modules.modules, mapfn); 
    } 

    function doSetup(moduleName) {
        var module = modules.modules[moduleName];
        module.setup();
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

    window.ges || (window.ges = {});
    window.ges.modules = modules;

}

