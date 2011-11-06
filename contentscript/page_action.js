/*
 * when the page action icon is clicked, inject a bit of code to 
 * open the GES menu
 */

var script = document.createElement('script');
script.textContent = '(function() { ges.ui.toggleLightbox("ges"); })();';
document.body.appendChild(script);

