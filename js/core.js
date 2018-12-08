/*----------------------------------------------------------------------------*
 *                      Global utility functions                              *
 *----------------------------------------------------------------------------*/

// Firefox 1.0+
var isFirefox = typeof InstallTrigger !== 'undefined';

// Chrome 1+
var isChrome = !!window.chrome && !!window.chrome.webstore;

// Safari 3.0+ "[object HTMLElementConstructor]" 
var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));

window.mobilecheck = function() {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};

// Whether is mobile
var isMobile = window.mobilecheck();

/**----------------------------------------------------------------------------
 * > Disable web page scrolling
 */
function DisablePageScroll() {
  document.documentElement.style.overflow = 'hidden';
}
/**----------------------------------------------------------------------------
 * > Enable web page scrolling
 */
function EnablePageScroll(){
  document.documentElement.style.overflow = '';
}
/**----------------------------------------------------------------------------
 * > Ask use whether really want to leave the page
 */
function RegisterLeaveEvent() {
  window.onbeforeunload = function(){
    return "You have attempted to leave this page. If you have made any changes to the fields without clikcing the Save button, your changes will be lost. Are you sure you want to exit this page?";
  }
}
/**----------------------------------------------------------------------------
 * > Get domain URL of current page
 * @function
 * @global
 * @returns {string} - Domain URL
 */
function getDomainURL(){
  return location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '');
}
/**----------------------------------------------------------------------------
 * > Log debug information
 * @function
 * @global
 * @param {...} - things to be logged on console
 */
function debug_log(){
  if(DebugMode){
    for(let i=0;i<arguments.length;++i){ console.log(arguments[i]); }
  }
}
/**----------------------------------------------------------------------------
 * > Check audio support
 * @function
 * @global
 * @returns {boolean}
 */
function isAudioSupported(){
  var a = document.createElement('audio');
  return !!(a.canPlayType && a.canPlayType('audio/mpeg;').replace(/no/, ''));
}
/**----------------------------------------------------------------------------
 * > Check WebGL support
 * @function
 * @global
 * @returns {boolean}
 */
function isWebGLSupported(){
  let type = "WebGL", result = PIXI.utils.isWebGLSupported();
  if(!result){ type = "canvas"; }
  PIXI.utils.sayHello(type)
  return result
}
/**----------------------------------------------------------------------------
 * > Check whether given two object has same class
 * @function
 * @global
 * @returns {boolean}
 */
function isClassOf(obj, cls){
  return getClassName(obj) == cls.name;
}
/**----------------------------------------------------------------------------
 * > Get class name of object
 * @function
 * @global
 * @param {object} obj - the object to get class name for
 * @returns {string} - Class name of given object
 */
function getClassName(obj){
  return obj.constructor.name;
}
/**----------------------------------------------------------------------------
 * > Clone object
 */
function clone(obj){
  let dup = Object.assign({}, obj);
  dup.constructor = obj.constructor;
  return dup;
}
/**----------------------------------------------------------------------------
 * > Process given JSON file
 * @function
 * @global
 * @param {string} path - path to the json file
 * @param {function} handler - the handler to call, first arg is the read result
 */
function processJSON(path, handler, fallback){
  var xhr = new XMLHttpRequest();
  if(!handler){ handler = function(){} }
  xhr.open('GET', path, true);
  xhr.responseType = 'blob';
  xhr.onload = function(e) { 
    if(this.status == 200){
      var file = new File([this.response], 'temp');
      var fileReader = new FileReader();
      fileReader.addEventListener('load', function(){
        handler.call(this, fileReader.result);
      });
      fileReader.readAsText(file);
    }
    else{
      fallback.call(this, this.status);
    }
  }
  xhr.send();
}
/**----------------------------------------------------------------------------
 * > Report the error
 */
function reportError(e, fatel = true){
  if(Sound.isReady()){Sound.playSE(Sound.Error, 1.0);}
  console.error("An error occurred!")
  console.error(e.name + ':', e.message);
  console.error(e.stack);
  if(Sound.isReady()){
    window.setTimeout(function(){
      Sound.stopAll(); SceneManager.stop();
    }, 1000);
  }
  FatelError = fatel;
}

/**----------------------------------------------------------------------------
 * >> The static class that carries out graphics processing.
 * @namespace Graphics
 */
class Graphics{
  /**----------------------------------------------------------------------------
   * @constructor
   * @memberof Graphics
   */
  constructor(){
    throw new Error('This is a static class');
  }
  /**----------------------------------------------------------------------------
   * > Module Initialization
   * @memberof Graphics
   * @property {number} _width          - width of app canvas
   * @property {number} _height         - height of app canvas
   * @property {number} _padding        - default padding of app canvas
   * @property {number} _spacing        - width of space for sprites seperate
   * @property {number} _frameCount    - frames passed after app starts
   * @property {object} _spriteMap     - Mapping sprite name to sprite instance
   * @property {boolean} _loaderReady  - whether the loader is completed
   * @property {Sprite} fadingSprite - Sprite for fade effect
   */  
  static initialize(){
    this._width  = this.Resolution[0];
    this._height = this.Resolution[1];
    this._padding = 32;
    this._spacing = 4;
    this._frameCount = 0;
    this._spriteMap = {}
    this.fadingSprite   = null;
    this.unfocusSprite  = null;
    this._loader_ready  = true;
    this._frameCount    = 0;
    this.FPS_Sum        = 0;
    this.FPS_MaxSample  = 30;
    this.FPS_SampleIndex = 0;
    this.FPS_SamplePool = [];

    this.createApp();
    this.initRenderer();
    this.initLoader();
    this.aliasFunctions();
    this.createGlobalSprites();
  }
  /*---------------------------------------------------------------------------*/
  static createGlobalSprites(){
    this.createFadingSprite();
    this.createUnfocusSprite();
    this.createFPSSprite();
  }
  /**----------------------------------------------------------------------------
   * > Sprite for fading effect
   */
  static createFadingSprite(){
    this.fadingSprite = new Sprite();
    this.fadingSprite.fillRect(0, 0, this.width, this.height, 0x000000);
    this.fadingSprite.name = "Fading Sprite"
    this.fadingSprite.setZ(1000);
    this.fadingSprite.hide();
  }
  /**----------------------------------------------------------------------------
   * > Create unfocus effect sprite
   */
  static createUnfocusSprite(){
    this.unfocusSprite = new Sprite();
    this.unfocusSprite.fillRect(0, 0, this.width, this.height, 0xffffff);
    this.unfocusSprite.setOpacity(0.5);
    this.unfocusSprite.setZ(1001);
    this.unfocusSprite.name = "Unfocus Sprite";
    this.unfocusSprite.hide();
  }
  /**----------------------------------------------------------------------------
   * > Create sprite display FPS
   */
  static createFPSSprite(){
    let font = clone(this.DefaultFontSetting)
    font.fontSize = 18;
    this.FPSSprite = new PIXI.Text("FPS: ", font);
  }
  /**----------------------------------------------------------------------------
   * > Create main viewport
   * @property {PIXI.Application} app - the PIXI web application
   */  
  static createApp(){
    this.app = new PIXI.Application(
      {
        width: this._width,
        height: this._height,
        antialias: true,
        backgroundColor: this.AppBackColor,
      }
    );
    this.app.x = this.screenCenterWidth();
    this.app.y = this.screenCenterHeight();
    this.app.width  = this._width;
    this.app.height = this._height;
    this.app.view.style.left = this.app.x + 'px';
    this.app.view.style.top  = this.app.y + 'px';
    this.app.view.style.zIndex = 0;
  }
  /**----------------------------------------------------------------------------
   * @property {PIXI.WebGLRenderer} renderer - the rending software of the app
   */
  static initRenderer(){
    this.renderer = PIXI.autoDetectRenderer(this._width, this._height);
    document.app = this.app;
    document.body.appendChild(this.app.view);
  }
  /**-------------------------------------------------------------------------
   * > Initialize PIXI Loader
   * @property {PIXI.loaders.Loader} loader - PIXI resources loader
   */
  static initLoader(){
    this.loader = PIXI.loader;
    this.loader.onProgress.add( function(){Graphics._loader_ready = false;} );
    this.loader.onComplete.add( function(){Graphics._loader_ready = true;} );
    this.loader.add(this.LoadImage).load(function(){
      Graphics.app.ticker.add(SceneManager.updateMain);
      SceneManager.processFirstScene();
    });
  }
  /**-------------------------------------------------------------------------
   * > Pre-load all image assets
   */
  static preloadAllAssets(progresshandler, load_ok_handler){
    if(!progresshandler){ progresshandler = function(){} }
    if(!load_ok_handler){ load_ok_handler = function(){} }
    this.IconsetImage = new Image();
    this.IconsetImage.src = this.Iconset;
    this.windowSkins = {}
    this.WindowSkinSrc.forEach(function(path){
      Graphics.windowSkins[path]     = new Image();
      Graphics.windowSkins[path].src = path;
    })
    this.loader.add(this.Images);
    this.loader.onProgress.add(progresshandler);
    this.loader.load(load_ok_handler);
  }
  /**-------------------------------------------------------------------------
   * > Return textire of pre-loaded resources
   * @param {string} name - name of resources
   * @param {Rectangle} srect - Souce Slice Rect of the texture
   */  
  static loadTexture(name, srect = null){
    if(srect){
      return new PIXI.Texture(PIXI.loader.resources[name].texture, srect);
    }
    return PIXI.loader.resources[name].texture;
  }
  /**-------------------------------------------------------------------------
   * > Check whether loader has loaded all resources
   * @returns {boolean}
   */  
  static isReady(){
    return this._loader_ready;
  }
  /**-------------------------------------------------------------------------
   * > Render scene(stage)
   * @param {Scene_Base} stage - the scene to be rendered
   */  
  static render(stage){
    if(stage){
      this.app.stage = stage;
      this.renderer.render(stage)
    }
  }
  /**-------------------------------------------------------------------------
   * > Render sprite to current scene
   * @param {Sprite} sprite - the sprite to be rendered
   */
  static renderSprite(sprite){
    if(SceneManager.scene.children.indexOf(sprite) > -1){return ;}
    SceneManager.scene.addChild(sprite);
    SceneManager.scene.children.sort((a,b) => (a.zIndex || 0) - (b.zIndex || 0))
  }
  /**-------------------------------------------------------------------------
   * > Render window to web page
   */
  static renderWindow(win){
    SceneManager.scene.addWindow(win)
    SceneManager.scene.children.sort((a,b) => (a.zIndex || 0) - (b.zIndex || 0))
  }
  /*-------------------------------------------------------------------------*/
  static renderBitmap(bmp){
    document.body.appendChild(bmp.canvas);
  }
  /*-------------------------------------------------------------------------*/
  static removeBitmap(bmp){
    document.body.removeChild(bmp.canvas);
  }
  /**-------------------------------------------------------------------------
   * > Remove the window that rendered to page
   */
  static removeWindow(win){
    SceneManager.scene.removeWindow(win);
  }
  /**-------------------------------------------------------------------------
   * > Render bitmap to web page
   */
  static removeBitmap(bmp){
    document.body.removeChild(bmp.canvas);
  }
  /**-------------------------------------------------------------------------
   * > Get center x-pos of object in screen
   * @param {number} x - the object's width
   * @returns {number} - the x-pos after centered
   */  
  static screenCenterWidth(x = this._width){
    return (screen.width - x) / 2;
  }
  /**-------------------------------------------------------------------------
   * > Get center y-pos of object in screen
   * @param {number} y - the object's height
   * @returns {number} - the y-pos after centered
   */  
  static screenCenterHeight(y = this._height){
    return Math.max((screen.height - y) / 2 - this._padding * 2, 0);
  }
  /**-------------------------------------------------------------------------
   * > Get center x-pos of object in canva
   * @param {number} x - the object's width
   * @returns {number} - the x-pos after center
   */  
  static appCenterWidth(x = 0){
    return (this._width - x) / 2;
  }
  /**-------------------------------------------------------------------------
   * > Get center y-pos of canva
   * @param {number} y - the object's height
   * @returns {number} - the y-pos after center
   */  
  static appCenterHeight(y = 0){
    return (this._height - y) / 2;
  }
  /**-------------------------------------------------------------------------
   * > Frame update
   * @memberof Graphics
   */  
  static update(){
    this._frameCount += 1;
    this.FPS_Sum -= (this.FPS_SamplePool[this.FPS_SampleIndex] || 0);
    this.FPS_SamplePool[this.FPS_SampleIndex] = this.app.ticker.FPS;
    this.FPS_Sum += this.FPS_SamplePool[this.FPS_SampleIndex];
    this.FPS_SampleIndex = (this.FPS_SampleIndex + 1) % this.FPS_MaxSample;
    this.FPS = Math.floor(this.FPS_Sum / this.FPS_MaxSample);
    this.FPSSprite.text = "FPS: " + this.FPS;
  }
  /**-------------------------------------------------------------------------
   * > Add sprite and build a instance name map
   * @param {string} image_name - the path to the image
   * @param {string} instance_name - the name give to the sprite after created
   * @returns {PIXI.Sprite} - the created sprite
   */  
  static addSprite(image_name, instance_name = null){
    var sprite = new PIXI.Sprite(Graphics.loadTexture(image_name));
    if(instance_name == null){instance_name = image_name;}
    sprite.name = instance_name;
    this._spriteMap[instance_name] = sprite;
    debug_log("Add sprite: " + sprite.name)
    return sprite;
  }
  /**-------------------------------------------------------------------------
   * > Add text sprite and build a instance name map
   * @param {string} text - the text to show
   * @param {string} instance_name - the name give to the sprite after created
   * @param {object} fontsetting - the font setting for the text
   * @returns {PIXI.Sprite} - the created sprite
   */  
  static addText(text, instance_name = null, fontsetting = Graphics.DefaultFontSetting){
    var sprite = new PIXI.Text(text, fontsetting);
    if(instance_name == null){instance_name = text;}
    sprite.name = instance_name;
    this._spriteMap[instance_name] = sprite;
    debug_log("Add text: " + sprite.name)
    return sprite;
  }
  /**-------------------------------------------------------------------------
   * > Remove object in current scene
   * @param {PIXI.Sprite|string} - the sprite/instance name of sprite to remove
   */
  static removeSprite(...args){
    args.forEach(function(obj){
      if(isClassOf(obj, String)){ obj = Graphics._spriteMap[obj]; }
      debug_log("Remove sprite: " + obj.name)
      delete Graphics._spriteMap[obj.name];
      SceneManager.scene.removeChild(obj);
    })
  }
  /**-------------------------------------------------------------------------
   * > Process transition
   */
  static transition(){
    debug_log(SplitLine, "Process transition")
    this.disposeSprites();
  }
  /*------------------------------------------------------------------------*/
  static disposeSprites(){
    for(var sprite in this._spriteMap){
      if(this._spriteMap.hasOwnProperty(sprite)){
        this.removeSprite(sprite)
      }
    }
  }
  /*------------------------------------------------------------------------*/
  static startLoading(){
    // reserved
  }
  /*------------------------------------------------------------------------*/
  static updateLoading(){
    // reserved
  }
  /*------------------------------------------------------------------------*/
  static endLoading(){
    if(!this.fadingSprite){return ;}
    SceneManager.scene.startFadeIn();
    this.renderSprite(this.unfocusSprite);
  }
  /*------------------------------------------------------------------------*/
  static onUnfocus(){
    this.unfocusSprite.show();
  }
  /*------------------------------------------------------------------------*/
  static onFocus(){
    this.unfocusSprite.hide();
  }
  /**------------------------------------------------------------------------
   * > Getter functions
   */
  static get width(){return this._width;}
  static get height(){return this._height;}
  static get padding(){return this._padding;}
  static get spacing(){return this._spacing;}
  /**------------------------------------------------------------------------
   * > Alias functions
   * @function
   */
  static aliasFunctions(){
    /** @alias renderWindow */
    this.addWindow = this.renderWindow.bind(this);
  }
  /*------------------------------------------------------------------------*/
  static pauseAnimatedSprite(obj){
    if(isClassOf(obj, PIXI.extras.AnimatedSprite)){
      if(obj.playing){
        obj.paused = true;
        obj.stop();
      }
    }
    if(obj.children){
      obj.children.forEach(function(child){
        Graphics.pauseAnimatedSprite(child);
      })
    }
  }
  /*------------------------------------------------------------------------*/
  static resumeAnimatedSprite(obj){
    if(isClassOf(obj, PIXI.extras.AnimatedSprite)){
      if(obj.paused){
        obj.play();
        obj.paused = false;
      }
    }
    if(obj.children){
      obj.children.forEach(function(child){
        Graphics.resumeAnimatedSprite(child);
      })
    }
  }
  /*------------------------------------------------------------------------*/
} // class Graphics

/**---------------------------------------------------------------------------
 * The static class handles the input
 *
 * @class Input
 */
class Input{
  /**-------------------------------------------------------------------------
   * @constructor
   * @memberof Input
   */
  constructor(){
    throw new Error('This is a static class');
  }
  /**-------------------------------------------------------------------------
   * > Module initialization
   * @memberof Input
   * @property {Array.<boolean>} keystate_press   - array of pressed flag key ids
   * @property {Array.<boolean>} keystate_trigger - array of trigger flag key ids
   * @property {boolean} state_changed - key state changed flag
   * @property {boolean} reset_needed  - flag of whether need to reset keystates
   */
  static initialize(){
    this.build_keymap();
    this.keystate_press   = new Array(0xff);
    this.keystate_trigger = new Array(0xff);
    this.state_changed    = false;
    this.reset_needed     = false;
    this.wheelstate       = 0;
    this.setupEventHandlers();
  }
  /**-------------------------------------------------------------------------
   * > Setup keymap for acceptable keys
   * @property {object} keymap - key map, mapping to the key id
   */
  static build_keymap(){
    this.keymap = { 
      kMOUSE1: 1, kMOUSE2: 2, kMOUSE3: 3,
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
  }
  /**-------------------------------------------------------------------------
   * > Process when key is down
   * @param {KeyboardEvent|MouseEvent} event - the keydown event
   */
  static onKeydown(event){
    let key_id = parseInt(event.which);
    if(!this.keystate_press[key_id]){
      this.keystate_trigger[key_id] = true;
    }
    this.keystate_press[key_id] = true;
    this.state_changed = true;
  }
  /**-------------------------------------------------------------------------
   * > Process when key is up
   * @param {KeyboardEvent|MouseEvent} event - the keyup event
   */
  static onKeyup(event){
    this.keystate_press[parseInt(event.which)] = false;
    this.state_changed = true;
  }
  /**-------------------------------------------------------------------------
   * > Mouse wheel handler
   */
  static processMouseWheel(event){
    this.wheelstate = Math.max( -1, Math.min(1, (event.wheelDelta || -event.detail)) );
    this.state_changed = true;
  }
  /**-------------------------------------------------------------------------
   * > Record client mouse pos
   * @param {MouseEvent} event 
   */
  static processMouseMove(event){
    this.mousePagePOS   = [event.pageX || 0, event.pageY || 0];
    this.mouseClientPOS = [event.clientX || 0, event.clientY || 0];
  }
  /*-------------------------------------------------------------------------*/
  static setupEventHandlers(){
    window.addEventListener("keydown", this.onKeydown.bind(this));
    window.addEventListener("keyup", this.onKeyup.bind(this));
    window.addEventListener("mousedown", this.onKeydown.bind(this));
    window.addEventListener("mouseup", this.onKeyup.bind(this));
    window.addEventListener("mousewheel", this.processMouseWheel.bind(this));
    document.addEventListener("mousemove", this.processMouseMove.bind(this));
  }
  /**-------------------------------------------------------------------------
   * > Frame update
   * @memberof Input
   */
  static update(){
    if(this.state_changed){
      this.state_changed = false;
      this.reset_needed  = true;
    }
    else if(this.reset_needed){
      this.reset_needed = false;
      for(let i=0;i<0xff;++i){this.keystate_trigger[i] = false;}
      this.wheelstate = 0;
    }
  }
  /**-------------------------------------------------------------------------
   * > Check whether key is triggered in certain area
   * @param {Number} kid - key id
   * @param {PIXI.Rectangle} crect - collision rect
   */
  static isTriggerArea(kid, crect){
    if(!Input.isTriggered(kid)){return false;}
    if(Input.mousePagePOS[0] < crect.x){return false;}
    if(Input.mousePagePOS[1] < crect.y){return false;}
    let cwidth = crect.x + crect.width, cheight = crect.y + crect.height;
    if(Input.mousePagePOS[0] > cwidth){return false;}
    if(Input.mousePagePOS[1] > cheight){return false;}
    return true;
  }
  /**-------------------------------------------------------------------------
   * > Check whether the given key id is triggered
   * @param {number} key_id - id of the key
   * @returns {boolean}
   */
  static isTriggered(key_id){
    return this.keystate_trigger[key_id];
  }
  /**-------------------------------------------------------------------------
   * > Check whether the given key id is pressed
   * @param {number} key_id - id of the key
   * @returns {boolean}
   */
  static isPressed(key_id){
    return this.keystate_press[key_id];
  }
  /**-------------------------------------------------------------------------
   * > Check whether mouse wheel scrolled up
   */
  static isWheelUp(){
    return this.wheelstate == 1;
  }
  /**-------------------------------------------------------------------------
   * > Check whether mouse wheel scrolled down
   */
  static isWheelDown(){
    return this.wheelstate == -1;  
  }

} // class Input

/**---------------------------------------------------------------------------
 * >> The root object of the display tree.
 *
 * @class Stage
 * @extends PIXI.Container
 */
class Stage extends PIXI.Container{
  /**-------------------------------------------------------------------------
   * @constructor
   * @memberof Stage
   */
  constructor(...args){
    super(...args);
    this.initialize.apply(this, arguments);
  }
  /**-------------------------------------------------------------------------
   * > Object initialization
   * @memberof Stage
   */
  initialize(){
    PIXI.Container.call(this);
    // The interactive flag causes a memory leak.
    this.interactive = false;
  }
}

/**---------------------------------------------------------------------------
 * >> The static class that process audios
 *
 * @class Sound
 */
class Sound{
  /**-------------------------------------------------------------------------
   * @constructor
   * @memberof Sound
   */
  constructor(){
    throw new Error('This is a static class');
  }

  /**-------------------------------------------------------------------------
   * @class soundInstance
   * @property {string} symbol - symbol/key of audio file
   * @property {string} type   - type of audio file: SE(non-looping)/BGM(looping)
   * @property {Number} id     - Id of audio file's eigen-object
   */

  /**-------------------------------------------------------------------------
   * > Module initialization
   * @memberof Sound
   * @property {float} _masterVolume - default master volume of audios
   * @property {soundInstance} _currentBGM - current BGM
   * @property {Array.<soundInstance>} _currentSE - list of current playing SE
   * @property {Object.<Number, soundInstance>} _audioMap 
   *          - Dictionary of audio id to its soundInstance
   * @property {Object.<String, Howl>} tacck - Dictionary of audio file symbol
   * 
   */
  static initialize(){
    this._masterVolume = 0.5;
    this._currentBGM   = null;
    this._currentSE    = [];
    this._audioMap     = {};
    this.track         = {};
    this._loadProgess  = 0;
    this.preloadAllAudio();
  }
  /*-------------------------------------------------------------------------*/
  static preloadAllAudio(){
    debug_log("Load audios...")
    Sound.resources.forEach(filename => {
      this.track[filename] = new Howl({
        src: [filename],
        volume: Sound._masterVolume,
        onload: function(){Sound.reportLoadProgress(filename)},
        onfade: this.onAudioFadeComplete,
        onstop: function(soundID){Sound.unregisterAudio(soundID);}, 
        onend: function(soundID){Sound.unregisterAudio(soundID);},
      })
    })
  }
  /*-------------------------------------------------------------------------*/
  static registerAudio(soundInstance){
    Sound._audioMap[soundInstance.id] = soundInstance;
    debug_log("Audio registered:", soundInstance.id, soundInstance.symbol);
    if(soundInstance.type == 'SE'){
      Sound._currentSE.push(soundInstance);
    }
    else if(soundInstance.type == 'BGM'){
      Sound._currentBGM = soundInstance;
    }
  }
  /*-------------------------------------------------------------------------*/
  static unregisterAudio(soundID){
    let soundInstance = Sound._audioMap[soundID];
    if(!soundInstance){return ;}
    let soundContext = Sound.track[soundInstance.symbol];
    if(soundInstance && !soundContext.loop(soundID)){
      debug_log("Audio unregisterd:", soundID, soundInstance.symbol)
      if(soundInstance.type == 'SE'){
        let index = Sound._currentSE.indexOf(soundInstance);
        Sound._currentSE.splice(index, 1);
      }
      else if(soundInstance.type == 'BGM'){
        if(Sound._currentBGM.id == soundID){Sound._currentBGM = null;}
      }
      Sound._audioMap[soundID] = null;
    }
  }
  /*-------------------------------------------------------------------------*/
  static reportLoadProgress(fname){
    Sound._loadProgess += 1;
    debug_log("Audio Loaded: " + fname + ' ' + Sound._loadProgess + '/' + Sound.resources.length + '(' + Sound.loadPercent + ')')
  }
  /*-------------------------------------------------------------------------*/
  static onAudioFadeComplete(soundID){
    let soundGroup = Sound.track[Sound._audioMap[soundID].symbol];
    if(soundGroup.volume(soundID) == 0.0){
      soundGroup.loop(false, soundID);
      Sound.unregisterAudio(soundID)
    }
  }
  /*-------------------------------------------------------------------------*/
  static isReady(){
    return this._loadProgess == this.resources.length;
  }
  /*-------------------------------------------------------------------------*/
  static get loadProgess(){
    return this._loadProgess;
  }
  /*-------------------------------------------------------------------------*/
  static get loadPercent(){
    return this._loadProgess / this.resources.length;
  }
  /**-------------------------------------------------------------------------
   * > Play the audio file as Sound Effect of given symbol
   * @param {string} symbol - symbol of the audio file
   */
  static playSE(symbol, volume = this._masterVolume){
    let pid = -1;
    pid = this.track[symbol].play();
    this.track[symbol].volume(volume, pid);
    this.registerAudio( {id:pid, type:'SE', symbol:symbol} );
    return pid;
  }
  /**-------------------------------------------------------------------------
   * > Play the audio file as BGM(looping)
   */
  static playBGM(symbol){
    if(arguments.length != 1){
      throw new ArgumentError(1, arguments.length);
    }
    if(this._currentBGM){this.fadeOutBGM();}
    let pid = -1;
    pid = this.track[symbol].play();
    this.track[symbol].loop(true, pid);
    this.registerAudio( {id:pid, type:'BGM', symbol:symbol} );
    return pid;
  }
  /**-------------------------------------------------------------------------
   * > Play the SE with fade-in effect
   */
  static fadeInSE(symbol, duration = Sound.fadeDurationSE){
    let pid = -1;
    pid = this.track[symbol].play();
    this.track[symbol].fade(0.0, this._masterVolume, duration, pid);
    this.registerAudio( {id:pid, type:'SE',symbol:symbol} );
    return pid;
  }
  /**-------------------------------------------------------------------------
   * > Play the BGM with fade-in effect
   */
  static fadeInBGM(symbol, duration = Sound.fadeDurationBGM){
    if(this._currentBGM){this.fadeOutBGM();}
    let pid = -1;
    pid = this.track[symbol].play();
    this.track[symbol].loop(true, pid);
    this.track[symbol].fade(0.0, this._masterVolume, duration, pid);
    this.registerAudio( {id:pid, type:'BGM', symbol:symbol} );
    return pid;
  }
  /*-------------------------------------------------------------------------*/
  static fadeOutBGM(duration = Sound.fadeDurationBGM){
    let s = this._currentBGM;
    if(!s){return;}
    this.track[s.symbol].fade(this._masterVolume, 0.0, duration, s.id);
  }
  /*-------------------------------------------------------------------------*/
  static fadeOutSE(soundID, duration = Sound.fadeDurationSE){
    if(soundID){
      let s = this._audioMap[soundID];
      this.track[s.symbol].fade(this._masterVolume, 0.0, duration, s.id);
    }
    else{
      for(let i=0;i<this._currentSE.length;++i){
        let s = this._currentSE[i];
        this.track[s.symbol].fade(this._masterVolume, 0.0, duration, s.id);
      }
    }
  }
  /*-------------------------------------------------------------------------*/
  static stopBGM(){
    let s = this._currentBGM;
    if(!s){return;}
    this.track[s.symbol].loop(false, s.id);
    this.track[s.symbol].stop();
  }
  /*-------------------------------------------------------------------------*/
  static stopSE(soundID){
    if(soundID){
      let s = this._audioMap[soundID];
      this.track[s.symbol].stop(s.id);
    }
    else{
      for(let i=0;i<this._currentSE.length;++i){
        let s = this._currentSE[i];
        this.track[s.symbol].stop(s.id)
      }
    }
  }
  /*-------------------------------------------------------------------------*/
  static stopAll(){
    this.stopBGM();
    this.stopSE();
  }
  /*-------------------------------------------------------------------------*/
  static fadeOutAll(){
    this.fadeOutBGM();
    this.fadeOutSE();
  }
  /*-------------------------------------------------------------------------*/
  static resumeAll(){
    this.resumeBGM();
    this.resumeSE()
  }
  /*-------------------------------------------------------------------------*/
  static pauseAll(){
    this.pauseBGM();
    this.pauseSE()
  }
  /*-------------------------------------------------------------------------*/
  static pauseBGM(){
    let s = this._currentBGM;
    if(!s){return;}
    this.track[s.symbol].pause(s.id);
  }
  /*-------------------------------------------------------------------------*/
  static resumeBGM(){
    let s = this._currentBGM;
    if(!s){return;}
    this.track[s.symbol].play(s.id);
  }
  /*-------------------------------------------------------------------------*/
  static pauseSE(soundID){
    if(soundID){
      let s = this._audioMap[soundID];
      this.track[s.symbol].pause(s.id);
    }
    else{
      for(let i=0;i<this._currentSE.length;++i){
        let s = this._currentSE[i];
        this.track[s.symbol].pause(s.id)
      }
    }
  }
  /*-------------------------------------------------------------------------*/
  static resumeSE(soundID){
    if(soundID){
      let s = this._audioMap[soundID];
      this.track[s.symbol].play(s.id);
    }
    else{
      for(let i=0;i<this._currentSE.length;++i){
        let s = this._currentSE[i];
        this.track[s.symbol].play(s.id)
      }
    }
  }
  /*-------------------------------------------------------------------------*/
}

/**---------------------------------------------------------------------------
 * The extended class of PIXI.Sprite
 *
 * @class Sprite
 * @constructor
 * @extends PIXI.Sprite
 */
class Sprite extends PIXI.Sprite{
  /**-------------------------------------------------------------------------
   * @constructor
   * @memberof Sprite
   * @property {boolean} static - When is child, the position won't effected by
   *                              parent's display origin (ox/oy)
   */
  constructor(...args){
    super(...args);
    this.initialize.apply(this, arguments);
    this.static = false;
    return this;
  }
  /**-------------------------------------------------------------------------
   * > Object initialization
   * @memberof Sprite
   */
  initialize(){
    this.setZ(0);
  }
  /*-------------------------------------------------------------------------*/
  setZ(z){
    this.zIndex = z;
    return this;
  }
  /*-------------------------------------------------------------------------*/
  resize(w, h){
    var scale = [w / this.width, h / this.height]
    this.setTransform(this.x, this.y, scale[0], scale[1]);
    this.children.forEach(function(sp){
      sp.setTransform(sp.x, sp.y, scale[0], scale[1]);
    });
    return this;
  }
  setOpacity(opa){
    this.alpha = opa;
    return this;
  }
  /*-------------------------------------------------------------------------*/
  setPOS(x, y){
    this.position.set(x ? x : this.x, y ? y : this.y);
    return this;
  }
  /*-------------------------------------------------------------------------*/
  fillRect(x, y, w, h, c){
    let rect = new PIXI.Graphics();
    rect.beginFill(c);
    rect.drawRect(x, y, w, h);
    rect.endFill();
    rect.zIndex = 2;
    rect.alpha = this.opacity;
    this.addChild(rect);
  }
  /*-------------------------------------------------------------------------*/
  drawText(x, y, text, font = Graphics.DefaultFontSetting){
    let txt = new PIXI.Text(text, font);
    txt.alpha  = this.opacity;
    txt.zIndex = 2;
    this.addChild(txt);
  }
  /*-------------------------------------------------------------------------*/
  addChild(...args){
    super.addChild(...args);
    this.children.sort((a,b) => (a.zIndex || 0) - (b.zIndex || 0));
  }
  /*-------------------------------------------------------------------------*/
  
  /**-------------------------------------------------------------------------
   * > Getter function
   */
  get opacity(){return parseFloat(this.alpha);}
  /*-------------------------------------------------------------------------*/
}

/**---------------------------------------------------------------------------
 * The basic object that represents an image.
 *
 * @class Bitmap
 * @constructor
 * @param {Number} x - The X point of the bitmap
 * @param {Number} y - The Y point of the bitmap
 * @param {Number} width - The width of the bitmap
 * @param {Number} height - The height of the bitmap
 */
class Bitmap{
  /**-------------------------------------------------------------------------
   * @constructor
   * @memberof Bitmap
   */
  constructor(){
    this.initialize.apply(this, arguments);
  }
  /**-------------------------------------------------------------------------
   * > Object initialization
   * @memberof Bitmap
   */
  initialize(x = 0, y = 0, w = 1, h = 1){
    this.createCanvas();
    this.setPOS(x, y);
    this.resize(w, h);
  }
  /*-------------------------------------------------------------------------*/
  createCanvas(){
    this._canvas  = document.createElement("canvas");
    this._context = this._canvas.getContext("2d");
  }
  /*-------------------------------------------------------------------------*/
  setX(x){
    this._x = x;
    this.realX = Graphics.app.x + this._x;
    this._canvas.style.left = this.realX + 'px'
  }
  /*-------------------------------------------------------------------------*/
  setY(y){
    this._y = y;
    this.realY = Graphics.app.y + this._y;
    this._canvas.style.top = this.realY + 'px'
  }
  /*-------------------------------------------------------------------------*/
  setPOS(x, y){
    this.setX(x);
    this.setY(y);
    return this;
  }
  /*-------------------------------------------------------------------------*/
  setZ(z){
    this._canvas.style.zIndex = z;
    return this;
  }
  /*-------------------------------------------------------------------------*/
  resize(w, h){
    this._width = w; this._height = h;
    this._canvas.width  = w;
    this._canvas.height = h;
    return this;
  }
  /*-------------------------------------------------------------------------*/
  hide(){
    this._canvas.style.display = "none";
    return this;
  }
  /*-------------------------------------------------------------------------*/
  show(){
    this._canvas.style.display = '';
    return this;
  }
  /*-------------------------------------------------------------------------*/
  blt(){
    this._context.drawImage.apply(this._context, arguments);
  }
  /**-------------------------------------------------------------------------
   * > Draw Icon in Iconset
   */
  drawIcon(icon_index, x, y){
    icon_index = parseInt(icon_index);
    let src_rect = clone(Graphics.IconRect);
    src_rect.x = icon_index % Graphics.IconRowCount * src_rect.width;
    src_rect.y = parseInt(icon_index / Graphics.IconRowCount) * src_rect.height;
    let sx = src_rect.x, sy = src_rect.y, sw = src_rect.width, sh = src_rect.height;
    this.blt(Graphics.IconsetImage, sx, sy, sw, sh, x, y, sw, sh);
  }
  /*-------------------------------------------------------------------------*/
  setOpacity(opa){
    this._canvas.style.opacity = opa
  }
  /*-------------------------------------------------------------------------*/
  dispose(){
    this._canvas  = null;
    this._context = null;
  }
  /*-------------------------------------------------------------------------*/
  isDisposed(){
    return this._canvas === null;
  }
  /*-------------------------------------------------------------------------*/
  get canvas(){return this._canvas;}
  get context(){return this._context;}
  /*-------------------------------------------------------------------------*/
}