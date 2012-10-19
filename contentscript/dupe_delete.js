function dupeDeleteClosure() {

    console.log('--> dupedelete loaded');

    ges.modules.modules['dupeDelete'] = {
          'author': 'Ibrahim Al-Rajhi'
        , 'name': 'Duplicate Song Remover'
        , 'description': 'Remove duplicate songs from your current queue.'
        , 'isEnabled': true
        , 'options': {}
        , 'setup': false
        , 'construct': construct
        , 'destruct': destruct
        , 'removeDuplicates': removeDuplicates
    };

    function construct() { 
    }

    function destruct() {
    }

    function pluralize (count, single, plural) {
        return count === 1 ? single : plural;
    }

    function removeDuplicates() {
        var player = GS.Services.SWF;
        var queue = player.getCurrentQueue().songs;
        var uniqueNames = {};
        var duplicateIds = [];
        var cleanName, length, message;

        _.forEach(queue, function(song) {
            cleanName = song.SongName.toLowerCase();
            uniqueNames[cleanName] ? duplicateIds.push(song.queueSongID)
                                   : uniqueNames[cleanName] = true;
        });
        player.removeSongs(duplicateIds);

        length = duplicateIds.length;
        message = length + ' duplicate' + pluralize(length, '', 's') + ' ' + pluralize(length, 'has', 'have') + ' been removed';
        ges.ui.notice(message);
    }

}

