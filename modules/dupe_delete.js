;(function(modules) {

    modules['dupeDelete'] = {
          'version': '0.1'
        , 'name': 'Duplicate Song Remover'
        , 'description': 'Removes duplicate songs from your current queue.'
        , 'style': null
        , 'isEnabled': true
        , 'construct': construct
        , 'destruct': destruct
    };

    function construct(instance) { 
        console.log('constructing dupeDelete');
        ges.ui.addButton('#dupeDelete', {
              'label': 'dupeDelete'
            , 'placement': 'prepend'
            , 'onclick': removeDuplicates
        });
    }

    function destruct(instance) {
        console.log('destructing dupeDelete');
        // ges.ui.removeButton('#dupeDelete');
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
        var message = length + ' duplicate' + ges.pluralize(length, '', 's') + ' ' + ges.pluralize(length, 'has', 'have') + ' been removed';
        ges.ui.growl(modules['dupeDelete'].name, message);
    }

})(ges.modules.modules);
