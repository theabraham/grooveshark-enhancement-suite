;(function() {
    var modules = {
          'moduleDir': 'modules/'
        , 'count': getModuleCount
        , 'doConstruct': doConstruct
        , 'doDestruct': doDestruct
        , 'modules': {}
    };

    function doConstruct(moduleName) {
        var module = this.modules[moduleName];
        module.construct(this);
    }

    function doDestruct(moduleName) {
        var module = this.modules[moduleName];
        module.destruct(this);
    }

    function getModuleCount() {
        return Object.keys(this.modules).length;
    }

    window.ges || (window.ges = {});
    window.ges.modules = modules;
})();
