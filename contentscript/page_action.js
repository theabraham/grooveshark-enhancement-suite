/* When the page action icon is clicked, inject a bit of code to 
   open the shortcuts help menu. */

var script = document.createElement('script');
script.textContent = '(function() { ges.modules.modules.shortcuts.toggleLightbox(); })();';
document.body.appendChild(script);

