/* When the page action icon is clicked, inject a bit of code to 
   open the shortcuts help menu. */

var script = document.createElement('script');
script.textContent = '(function() {  GS.getLightbox().isOpen ? ges.ui.closeLightbox() : ges.ui.openLightbox(\'shortcuts\'); })();';
document.body.appendChild(script);

