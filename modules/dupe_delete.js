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

    function construct() { 
        ges.ui.addPlayerButton('#dupeDelete', {
              'label': 'remove duplicates'
            , 'pos': 'left'
            , 'onclick': removeDuplicates
        });
    }

    function destruct() {
        ges.ui.removePlayerButton('#dupeDelete');
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
        ges.ui.notice(message);
    }

})(ges.modules.modules);
