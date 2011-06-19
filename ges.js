;(function() {

    Gs.ready(function() {
        loadModules();    
        buildUI();
    });

    function loadModules() {
        _.forEach(
              ges.modules.modules 
            , function(value, key) {
                if (value.isEnabled) {
                    ges.modules.doConstruct(key);
                }
            });
    }

    function buildUI() {
        var html = $('<ul id="ges_nav"><li id="header_nav_ges"><a></a></li></ul>');
        var left = $('#nav').width() + parseInt($('#nav').css('left'));

        $(html).css({ 'position': 'absolute', 'left': left, 'top': '4px' });
        $('a', html).css({ 'background-image': 'http://static.a.gs-cdn.net/webincludes/css/images/skeleton/nav.png', 'display': 'block', 'width': '32px', 'height': '32px', 'position': 'relative' });

        $('#header').append(html);
        $('a', '#header_nav_ges').click(openUI);
        // setupModal();
    }

    function setupModal() {
        var modal = cloneModal();

        $('#light_box_header h3', modal).html('Grooveshark Enhancement Suite');
        $('#lightbox_content', modal).html('Hello, world');

        // $('#lightbox', '#lightbox_wrapper').append(modal);
        // $('#lightbox_overlay').fadeIn('slow');
    }

    function cloneModal() {
        var clone;

        GS.lightbox.open('locale');
        clone = $('.gs_lightbox_locale', '#lightbox').clone();
        GS.lightbox.close();

        return clone;
    }

    function openUI() {}

    function closeUI() {} 

})();
