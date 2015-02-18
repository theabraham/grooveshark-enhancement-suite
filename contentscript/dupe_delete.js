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
        var $module = $('#sidebar .queue-item').first();
        var collection = $module.length && $module.data().module.grid.collection;
        var uniqueNames = {};
        var duplicateSongs = [];
        var cleanName, length, message;

        if (!collection) {
            return;
        }

        collection.each(function(song) {
            cleanName = song.get('SongName').toLowerCase();
            if (uniqueNames[cleanName]) {
                duplicateSongs.push(song);
            } else {
                uniqueNames[cleanName] = true;
            }
        });
        GS.trigger('player:removeSongs', duplicateSongs);

        length = duplicateSongs.length;
        message = length + ' duplicate' + pluralize(length, '', 's') + ' ' + pluralize(length, 'has', 'have') + ' been removed';
        ges.ui.notice(message, {type: 'success'});
    }

}

