;(function(modules) {

    modules['dupeDelete'] = {
          'author': 'Ibrahim Al-Rajhi'
        , 'name': 'Duplicate Song Remover'
        , 'description': 'Remove duplicate songs from your current queue.'
        , 'isEnabled': true
        , 'construct': construct
        , 'destruct': destruct
        , 'style': null
    };

    function construct() { 
        ges.ui.addPlayerButton('#dupeDelete', {
              'label': 'Remove Duplicates'
            , 'pos': 'right'
            , 'onclick': removeDuplicates
        });
    }

    function destruct() {
        ges.ui.removePlayerButton('#dupeDelete');
    }

    function pluralize (count, single, plural) {
        return count === 1 ? single : plural;
    }

    function removeDuplicates() {
        var player = GS.player;
        var queue = player.getCurrentQueue().songs;
        var uniqueNames = {};
        var duplicateIds = [];
        var cleanName, length, message;

        _.forEach(queue, function(song, index) {
            cleanName = song.SongName.toLowerCase();
            uniqueNames[cleanName] ? duplicateIds.push(song.queueSongID)
                                   : uniqueNames[cleanName] = true;
        });
        player.removeSongs(duplicateIds);

        length = duplicateIds.length;
        message = length + ' duplicate' + pluralize(length, '', 's') + ' ' + pluralize(length, 'has', 'have') + ' been removed';
        ges.ui.notice(message);
    }

})(ges.modules.modules);
