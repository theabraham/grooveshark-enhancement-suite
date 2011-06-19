;(function() {

    var modules = {
          'moduleDir': 'modules/'
        , 'count': getModuleCount
        , 'doConstruct': doConstruct
        , 'doDestruct': doDestruct
        , 'mapModules': mapModules
        , 'setModuleProperties': setModuleProperties
        , 'modules': {}
    };

    function getModuleCount() {
        return _.keys(this.modules).length;
    }

    function doConstruct(moduleName) {
        var module = this.modules[moduleName];
        module.construct(this);
    }

    function doDestruct(moduleName) {
        var module = this.modules[moduleName];
        module.destruct(this);
    }

    function mapModules(mapfn) {
        _.forEach(this.modules, mapfn); 
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

    window.ges || (window.ges = {});
    window.ges.modules = modules;

})();
