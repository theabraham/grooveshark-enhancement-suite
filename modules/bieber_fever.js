;(function(modules) {

    modules['bieberFever'] = {
          'version': '0.1'
        , 'name': 'Bieber Fever'
        , 'description': 'Replace all songs with Bieber'
        , 'isEnabled': false
        , 'construct': construct
        , 'destruct': destruct
    };

    var bieberSongIDs = ['26679682', '24919330', '24919377', '24477484'];
    var active = true;

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
        Gs.createPlayerButton('#bieberFever', {
              'label': 'bieberFever'
            , 'placement': 'prepend'
            , 'onclick': function() { active = (active ? false : true); }
        });
    }

    function destruct(instance) {
        Gs.unsubscribe('addSongsToQueueAt', interceptBieber);
        Gs.removePlayerButton('#bieberFever');
    }

    function randomChoice(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    function interceptBieber(songIDs, index, playOnAdd) {
        if (active) {
            var songs;
            songs = _.map(songIDs, function(elem) { 
                return randomChoice(bieberSongIDs);
            });
            Gs.method('addSongsToQueueAt', songs, index, playOnAdd);
            return false;
        }
    }

})(ges.modules.modules);
