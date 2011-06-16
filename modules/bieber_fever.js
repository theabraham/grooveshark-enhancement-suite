;(function(modules) {

    modules['bieberFever'] = {
          'version': '0.1'
        , 'name': 'Bieber Fever'
        , 'description': 'Replace all songs with Bieber'
        , 'isEnabled': true
        , 'construct': construct
        , 'destruct': destruct
    };

    var bieberSongIDs = [26679682, 24919330, 24919377, 24477484];

    Gs.ready(function() {
        _.map(bieberSongIDs, function(elem, index) {
                GS.Models.Song.getSong(elem, function(info) {
                   bieberSongIDs.splice(index, 1, info);
                });
            });
    });

    function construct(instance) { 
        console.log('constructing bieberFever');
        Gs.subscribe('addSongsToQueueAt', interceptBieber);
    }

    function destruct(instance) {
        Gs.unsubscribe('addSongsToQueueAt', interceptBieber);
    }

    function randomChoice(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    function interceptBieber(songIDs, index, playOnAdd) {
        console.log('intercepting with args', arguments);

        var songs = _.map(songIDs, function(elem) { 
                return randomChoice(bieberSongIDs);
            });
        Gs.method('addSongsToQueueAt', songs, index, playOnAdd);

        return false;
    }

})(ges.modules.modules);
