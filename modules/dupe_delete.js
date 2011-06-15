(function(modules) {

    modules['dupeDelete'] = {
          'version': '0.1'
        , 'name': 'Duplicate Song Remover'
        , 'description': 'Removes duplicate songs from your current queue.'
        , 'isEnabled': true
        , 'construct': construct
        , 'destruct': destruct
    };

    function construct(instance) { 
        Gs.on('addSongsToQueueAt', function() { setTimeout(function() { removeDuplicates(); }, 3e3); });
    }

    function destruct(instance) {
        Gs.removeAfter('addSongsToQueueAt', removeDuplicates);
    }

    function removeDuplicates() {
        var player = GS.player;
        var queue = player.getCurrentQueue().songs;
        var uniqueNames = {};
        var duplicateIds = [];
        var cursong, sanitizedName;

        for (var i = 0; i < queue.length; i++) {
            cursong = queue[i];
            sanitizedName = cursong.SongName.toLowerCase();

            (uniqueNames[sanitizedName] ? duplicateIds.push(cursong.queueSongID)
                                        : uniqueNames[sanitizedName] = true);
        }

        player.removeSongs(duplicateIds);
        console.log('-->', duplicateIds.length, 'duplicates have been removed');    
    }

})(ges.modules.modules);
