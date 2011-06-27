;(function() { 

    var menu = ' \
        #lightbox .mod_link { display:block; margin-bottom:10px; padding:10px; border:1px solid #b2b2b2; -moz-border-radius:3px; -webkit-border-radius:3px; } \
        #lightbox .mod_link:hover { background-color:#dedede; padding:9px; border-width:2px; } \
        #lightbox .mod_link:active { background:none !important; border-color:#1785cd !important; border-width:2px !important; } \
        #lightbox .mod_link.enabled { background-color:#d8ebf8; border:1px solid #1785cd; padding:10px; } \
        #lightbox .mod_link.enabled:hover { border-width:2px; padding:9px; } \
        #lightbox .mod_link .mod_icon { background-image:{{ iconURL }};  background-position:-4px -308px; float:right; display:inline-block; margin:12px 4px 0 0; height:8px; width:8px; } \
        #lightbox .mod_link.enabled .mod_icon { background-position:-36px 268px !important; } \
        #lightbox .mod_link:hover .mod_icon { background-position:-20px -308px; } \
        #lightbox .mod_link:active .mod_icon { background-position:12px -308px; } \
        #lightbox .mod_content { display:inline-block; width:520px; } \
        #lightbox .mod_name { display:block; color:#333; margin-bottom:8px; } \
        #lightbox .mod_desc { color:#666; } \
        #lightbox .mod_last { margin-bottom:0; } \
    \ ';

    var notices = ' \
        #notifications .scrollable { max-height:200px; overflow-y:auto; } \
        #notifications li.wide { width:400px; margin:0 0 3px -150px; } \
    \ ';

    var styles = {
          'load': load
        , 'menu': menu
        , 'notices': notices
    };

    function load(style, values) {
        style = style.replace(/\{\{.*\}\}/gi, function (match) { 
            match = match.slice(2, -2);
            match = match.trim();  
            return values[match];
        });

        $('<style/>').text(style).appendTo('body');
    }

    window.ges || (window.ges = {});
    window.ges.styles = styles;

})();
