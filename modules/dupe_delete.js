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
        Gs.createPlayerButton('#dupeDelete', {
              'label': 'dupeDelete'
            , 'placement': 'prepend'
            , 'onclick': removeDuplicates
        });
    }

    function destruct(instance) {
        Gs.removePlayerButton('#dupeDelete');
    }

    function removeDuplicates() {
        var player = GS.player;
        var queue = player.getCurrentQueue().songs;
        var uniqueNames = {};
        var duplicateIds = [];
        var cursong, sanitizedName, length;

        for (var i = 0; i < queue.length; i++) {
            cursong = queue[i];
            sanitizedName = cursong.SongName.toLowerCase();

            (uniqueNames[sanitizedName] ? duplicateIds.push(cursong.queueSongID)
                                        : uniqueNames[sanitizedName] = true);
        }

        player.removeSongs(duplicateIds);

        length = duplicateIds.length;
        var message = length + ' duplicate' + Gs.pluralize(length, '', 's') + ' ' + Gs.pluralize(length, 'has', 'have') + ' been removed';
        Gs.growl(modules['dupeDelete'].name, message);
    }

})(ges.modules.modules);
