;(function() {

    var modules = {
          'moduleDir': 'modules/'
        , 'modules': {}
        , 'doConstruct': doConstruct
        , 'doDestruct': doDestruct
        , 'getModuleCount': getModuleCount
        , 'setModuleProperties': setModuleProperties
        , 'mapModules': mapModules
    };

    function doConstruct(moduleName) {
        var module = this.modules[moduleName];
        if (module) { module.construct(this); }
    }

    function doDestruct(moduleName) {
        var module = this.modules[moduleName];
        if (module) { module.destruct(this); }
    }

    function getModuleCount() {
        return Object.keys(this.modules).length;
    }

    function setModuleProperties(moduleName, properties) {
        var module = this.modules[moduleName]
        if (module) {
            _.forEach(properties, function(property, name) {
                if (module.hasOwnProperty(name)) {
                    module[name] = property;
                }
            });
        }
    }

    function mapModules(mapfn) {
        _.forEach(this.modules, mapfn); 
    } 

    window.ges || (window.ges = {});
    window.ges.modules = modules;

})();
