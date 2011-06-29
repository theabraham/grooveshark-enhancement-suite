;(function(modules) {

    modules['bieberFever'] = {
          'author': 'Ibrahim Al-Rajhi'
        , 'name': 'Bieber Fever'
        , 'description': 'All songs added to the queue will be replaced with a random Justin Bieber song.'
        , 'isEnabled': false
        , 'style': false 
        , 'setup': false 
        , 'construct': construct
        , 'destruct': destruct
    };

    var bieberSongIDs = ['26679682', '24919330', '24919377', '24477484', '29735743', '28490274'];

    ges.events.ready(function() {
        _.map(bieberSongIDs, function(elem, index) {
                GS.Models.Song.getSong(elem, function(info) {
                   bieberSongIDs.splice(index, 1, info);
                });
            });
    });

    function construct() { 
        ges.events.subscribe('addSongsToQueueAt', interceptBieber);
    }

    function destruct() {
        ges.events.unsubscribe('addSongsToQueueAt', interceptBieber);
    }

    function randomChoice(list) {
        return list[Math.floor(Math.random() * list.length)];
    }

    function interceptBieber() {
        this[0] = _.map(this[0], function(elem) { 
            return randomChoice(bieberSongIDs);
        });
    }

})(ges.modules.modules);
