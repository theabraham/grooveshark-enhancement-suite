;(function(modules) {

    modules['bieberFever'] = {
          'version': '0.1'
        , 'name': 'Bieber Fever'
        , 'description': 'All songs added to the queue will be replaced with a random Justin Bieber song.'
        , 'style': null
        , 'isEnabled': false
        , 'construct': construct
        , 'destruct': destruct
    };

    var bieberSongIDs = ['26679682', '24919330', '24919377', '24477484'];
    var active = true;

    ges.events.ready(function() {
        _.map(bieberSongIDs, function(elem, index) {
                GS.Models.Song.getSong(elem, function(info) {
                   bieberSongIDs.splice(index, 1, info);
                });
            });
    });

    function construct(instance) { 
        console.log('constructing bieberFever');
        ges.events.subscribe('addSongsToQueueAt', interceptBieber);
        ges.ui.addButton('#bieberFever', {
              'label': 'bieberFever'
            , 'placement': 'prepend'
            , 'onclick': function() { active = (active ? false : true); }
        });
    }

    function destruct(instance) {
        ges.events.unsubscribe('addSongsToQueueAt', interceptBieber);
        ges.ui.removeButton('#bieberFever');
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
            ges.events.method('addSongsToQueueAt', songs, index, playOnAdd);
            return false;
        }
    }

})(ges.modules.modules);
