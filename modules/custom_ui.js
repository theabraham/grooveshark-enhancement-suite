;(function(modules) {

    modules['customUI'] = {
          'author': 'Ibrahim Al-Rajhi'
        , 'name': 'Custom UI'
        , 'description': 'Customize Grooveshark\'s interface.'
        , 'isEnabled': true
        , 'style': false
        , 'setup': false
        , 'construct': construct
        , 'destruct': destruct
    };

    var marquee = {
          'original': ''
        , 'text': ''
        , 'interval': null
        , 'stepTime': 250
        , 'pauseLength': 10
        , 'pausedFor': 0
    };

    function construct() {
        $.subscribe('gs.player.queue.change', changeTitle);
        // hashchange -> remove facebook buttons, add song count
        // hide sidebar
        //      on hover -> show sidebar
        //      mouse out -> hide sidebar
        //      community button
    }

    function destruct() {
        $.unsubscribe('gs.player.queue.change', changeTitle);
    }

    function resetMarquee() {
        marquee.text = '';
        marquee.original = '';
        // clearInterval(marquee.interval);
        marquee.interval = null;
        marquee.pausedFor = 0;
    }

    function changeTitle() {
        var song = GS.player.getCurrentSong();
        var title = '"' + song.SongName + '" by ' + song.ArtistName + ' (' + (song.index + 1) + ' of ' + GS.player.getCurrentQueue().songs.length + ')';

        if (marquee.original != title) {
            resetMarquee();
            document.title = marquee.original = marquee.text = title;
            stepMarquee();
        }
    }

    function stepMarquee() {
        if (marquee.text === marquee.original && marquee.pausedFor < marquee.pauseLength) {
            marquee.pausedFor += 1;
        } 
        else {
            marquee.pausedFor = 0;
            marquee.text = document.title = (marquee.text.slice(1) + marquee.text[0]);
            setTimeout(stepMarquee, marquee.stepTime);
        }
    }

})(ges.modules.modules);

