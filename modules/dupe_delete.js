;(function(modules) {

    modules['dupeDelete'] = {
          'version': '0.1'
        , 'name': 'Duplicate Song Remover'
        , 'description': 'Removes duplicate songs from your current queue.'
        , 'isEnabled': true
        , 'construct': construct
        , 'destruct': destruct
    };

    function construct(instance) { 
        console.log('constructing dupeDelete');
        // place dupe delete button on player
    }

    function destruct(instance) {
        // remove button
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
