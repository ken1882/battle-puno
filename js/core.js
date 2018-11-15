//-----------------------------------------------------------------------------
/**
 * Global utility functions
 */
function getDomainURL(){
  return location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '');
}

//-----------------------------------------------------------------------------
/**
 * The static class that process cached images in pixi loader
 *
 * @class Cache
 */
function Cache() {
  throw new Error('This is a static class');
}

// load resources
Cache.load_texture = function(name){
  return PIXI.loader.resources[name].texture;
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
Graphics.background = "assets/backgorund.png"
Graphics.testObject = "assets/CrystalHeart.png"

// Collection of all images for preloading
Graphics.images = [
  Graphics.background,
  Graphics.testObject,
]

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
//-----------------------------------------------------------------------------
/**
 * The static class handles the input
 *
 * @class Input
 */
function Input() {
  throw new Error('This is a static class');
}

Input.keymap = { 
  k0: 48, k1: 49, k2: 50, k3: 51, k4: 52, k5: 53,
  k6: 54, k7: 55, k8: 56, k9: 57,
  
  kA: 65, kB: 66, kC: 67, kD: 68, kE: 69, kF: 70,
  kG: 71, kH: 72, kI: 73, kJ: 74, kK: 75, kL: 76,
  kM: 77, kN: 78, kO: 79, kP: 80, kQ: 81, kR: 82,
  kS: 83, kT: 84, kU: 85, kV: 86, kW: 87, kX: 88,
  kY: 89, kZ: 90,
  
  kENTER: 13,    kRETURN: 13,  kBACKSPACE: 8, kSPACE: 32,
  kESCAPE: 27,   kESC: 27,     kSHIFT: 16,    kTAB: 9,
  kALT: 18,      kCTRL: 17,    kDELETE: 46,   kDEL: 46,
  kINSERT: 45,   kINS: 45,     kPAGEUP: 33,   kPUP: 33,
  kPAGEDOWN: 34, kPDOWN: 34,   kHOME: 36,     kEND: 35,
  kLALT: 164,    kLCTRL: 162,  kRALT: 165,    kRCTRL: 163,
  kLSHIFT: 160,  kRSHIFT: 161,
  
  kLEFT: 37, kRIGHT: 39, kUP: 38, kDOWN: 40,
  
  kCOLON: 186,     kAPOSTROPHE: 222, kQUOTE: 222,
  kCOMMA: 188,     kPERIOD: 190,     kSLASH: 191,
  kBACKSLASH: 220, kLEFTBRACE: 219,  kRIGHTBRACE: 221,
  kMINUS: 189,     kUNDERSCORE: 189, kPLUS: 187,
  kEQUAL: 187,     kEQUALS: 187,     kTILDE: 192,
  
  kF1: 112,  kF2: 113,  kF3: 114, kF4: 115, kF5: 116,
  kF6: 117,  kF7: 118,  kF8: 119, kF9: 120, kF10: 121,
  kF11: 122, kF12: 123,
  
  kArrows: 224,
}

Input.key_press   = new Array(0xff);
Input.key_trigger = new Array(0xff);
Input.changed     = false;
Input.reset       = false;

Input.update = function(){
  if(Input.changed){
    Input.changed = false;
    Input.reset   = true;
  }
  else if(Input.reset){
    Input.reset = false;
    for(i=0;i<0xff;++i){Input.key_trigger[i] = false;}
  }
}

Input.onKeydown = event => {
  kid = parseInt(event.which);
  if(!Input.key_press[kid]){
    Input.key_trigger[kid] = true;
  }
  Input.key_press[kid] = true;
  Input.changed = true;
}

Input.onKeyup = event => {
  Input.key_press[parseInt(event.which)] = false;
  Input.changed = true;
}

Input.trigger = function(kid){
  return Input.key_trigger[kid];
}

Input.press = function(kid){
  return Input.key_press[kid];
}

const KeydownListener = Input.onKeydown.bind();
const KeyupListener = Input.onKeyup.bind();

window.addEventListener("keydown", Input.onKeydown);
window.addEventListener("keyup", Input.onKeyup);