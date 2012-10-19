function modulesClosure() {

    console.log('--> modules loaded');

    var modules = {
          'modules': {}
        , 'mapModules': mapModules
        , 'doSetup': doSetup
        , 'doConstruct': doConstruct
        , 'doDestruct': doDestruct
    };

    /* Apply `mapfn` to each module. */
    function mapModules(mapfn) {
        _.forEach(modules.modules, mapfn); 
    } 

    /* Call the module's setup function. */
    function doSetup(moduleName) {
        var module = modules.modules[moduleName];
        if (module.setup) {
            module.setup();
        }
    }

    /* Call the module's construct function. */
    function doConstruct(moduleName) {
        var module = modules.modules[moduleName];
        module.isEnabled = true;
        module.construct();
    }

    /* Call the module's destruct function. */
    function doDestruct(moduleName) {
        var module = modules.modules[moduleName];
        module.isEnabled = false;
        module.destruct();
    }

    window.ges || (window.ges = {});
    window.ges.modules = modules;

}

