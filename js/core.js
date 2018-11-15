//-----------------------------------------------------------------------------
/**
 * Global utility functions
 */
function getDomainURL(){
  return location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '');
}

//-----------------------------------------------------------------------------
/**
 * The static class that process file loading paths.
 *
 * @class FileManager
 */
function FileManager() {
  throw new Error('This is a static class');
}

// get path of image
FileManager.load_image = function(name){
  return getDomainURL() + '/' + name;
}

//-----------------------------------------------------------------------------
/**
 * The static class that carries out graphics processing.
 *
 * @class Graphics
 */
function Graphics() {
  throw new Error('This is a static class');
}

// Constants
Graphics.width  = 1280;
Graphics.height = 720;
Graphics.padding = 32;
Graphics.background = "resources/backgorund.png"

// Get center x-pos of screen
Graphics.screenCenterWidth = function(x = this.width){
  return (screen.width - x) / 2;
}

// Get center y-pos of screen
Graphics.screenCenterHeight = function(y = this.height){
  return Math.max((screen.height - y) / 2 - this.padding * 2, 0);
}

// Get center x-pos of canva
Graphics.appCenterWidth = function(x = 0){
  return (this.width - x) / 2;
}

// Get center y-pos of canva
Graphics.appCenterHeight = function(y = 0){
  return (this.height - y) / 2;
}
