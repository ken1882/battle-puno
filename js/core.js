/*----------------------------------------------------------------------------*
 *                      Global utility functions                              *
 *----------------------------------------------------------------------------*/

/**----------------------------------------------------------------------------
 * > Disable web page scrolling when using wheel
 */
function DisablePageScroll() {
  document.documentElement.style.overflow = 'hidden';
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
function isSameClass(obj, cls){
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
 * > Process given JSON file
 * @function
 * @global
 * @param {string} path - path to the json file
 * @param {function} handler - the handler to call, first arg is the read result
 */
function processJSON(path, handler){
  var xhr = new XMLHttpRequest();
  if(!handler){ handler = function(){} }
  xhr.open('GET', path, true);
  xhr.responseType = 'blob';
  xhr.onload = function(e) { 
    if(this.status == 200){
      var file = new File([this.response], 'temp');
      var fileReader = new FileReader();
      fileReader.addEventListener('load', function(){
        handler.call(Vocab, fileReader.result);
      });
      fileReader.readAsText(file);
    } 
  }
  xhr.send();
}
/**----------------------------------------------------------------------------
 * >> The static class that process cached images in pixi loader
 * @class Cache
 */
class Cache{
  /**-------------------------------------------------------------------------
   * @constructor
   * @memberof Cache
   */
  constructor(){
    throw new Error('This is a static class');
  }
  /**-------------------------------------------------------------------------
   * > Return textire of pre-loaded resources
   * @param {string} name - name of resources
   */  
  static load_texture(name){
    return PIXI.loader.resources[name].texture;
  }
}
/**----------------------------------------------------------------------------
 * >> The static class that carries out graphics processing.
 * @class Graphics
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
   * @property {number} _frame_count    - frames passed after app starts
   * @property {object} _sprite_map     - Mapping sprite name to sprite instance
   * @property {boolean} _loader_ready  - whether the loader is completed
   * @property {PIXI.Sprite} fading_sprite - Sprite for fade effect
   */  
  static initialize(){
    this._width  = this.Resolution[0];
    this._height = this.Resolution[1];
    this._padding = 32;
    this._spacing = 4;
    this._frame_count = 0;
    this._sprite_map = {}
    this.fading_sprite  = null;
    this.unfocus_sprite = null;
    this._loader_ready  = true;
    
    this.create_fading_sprite();
    this.create_unfocus_sprite();
    this.create_app();
    this.init_renderer();
    this.init_loader();
  }
  /**----------------------------------------------------------------------------
   * > Sprite for fading effect
   */
  static create_fading_sprite(){
    this.fading_sprite = new PIXI.Graphics();
    this.fading_sprite.beginFill(0x000000);
    this.fading_sprite.drawRect(0, 0, this._width, this._height);
    this.fading_sprite.endFill();
    this.fading_sprite.name = "Fading Sprite"
  }
  /**----------------------------------------------------------------------------
   * > Create main viewport
   */
  static create_unfocus_sprite(){
    this.unfocus_sprite = new PIXI.Graphics();
    this.unfocus_sprite.beginFill(0xffffff);
    this.unfocus_sprite.drawRect(0, 0, this._width, this._height);
    this.unfocus_sprite.endFill();
    this.unfocus_sprite.alpha = 0.5;
    this.unfocus_sprite.zIndex = 1000;
    this.unfocus_sprite.name = "Unfocus Sprite"
  }
  /**----------------------------------------------------------------------------
   * > Create main viewport
   * @property {PIXI.Application} app - the PIXI web application
   */  
  static create_app(){
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
  static init_renderer(){
    this.renderer = PIXI.autoDetectRenderer(this._width, this._height);
    document.app = this.app;
    document.body.appendChild(this.app.view);
  }
  /**-------------------------------------------------------------------------
   * > Initialize PIXI Loader
   * @property {PIXI.loaders.Loader} loader - PIXI resources loader
   */
  static init_loader(){
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
   * @param {PIXI.Sprite} sprite - the sprite to be rendered
   */
  static renderSprite(sprite){
    SceneManager.scene.addChild(sprite);
  }
  /**-------------------------------------------------------------------------
   * > Render window to web page
   */
  static renderWindow(win){
    SceneManager.scene.addWindow(win)
  }
  /**-------------------------------------------------------------------------
   * > Remove the window that rendered to page
   */
  static removeWindow(win){
    SceneManager.scene.removeWindow(win);
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
   * @returns {number} - the x-pos after centered
   */  
  static appCenterWidth(x = 0){
    return (this._width - x) / 2;
  }
  /**-------------------------------------------------------------------------
   * > Get center y-pos of canva
   * @param {number} y - the object's height
   * @returns {number} - the y-pos after centerd
   */  
  static appCenterHeight(y = 0){
    return (this._height - y) / 2;
  }
  /**-------------------------------------------------------------------------
   * > Frame update
   * @memberof Graphics
   */  
  static update(){
    this._frame_count += 1;
  }
  /**-------------------------------------------------------------------------
   * > Add sprite and build a instance name map
   * @param {string} image_name - the path to the image
   * @param {string} instance_name - the name give to the sprite after created
   * @returns {PIXI.Sprite} - the created sprite
   */  
  static addSprite(image_name, instance_name = null){
    var sprite = new PIXI.Sprite(Cache.load_texture(image_name));
    if(instance_name == null){instance_name = image_name;}
    sprite.name = instance_name;
    this._sprite_map[instance_name] = sprite;
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
    this._sprite_map[instance_name] = sprite;
    debug_log("Add text: " + sprite.name)
    return sprite;
  }
  /**-------------------------------------------------------------------------
   * > Remove object in current scene
   * @param {PIXI.Sprite|string} - the sprite/instance name of sprite to remove
   */
  static removeSprite(obj){
    if(isSameClass(obj, String)){ obj = this._sprite_map[obj]; }
    debug_log("Remove sprite: " + obj.name)
    delete this._sprite_map[obj.name];
    SceneManager.scene.removeChild(obj);
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
    for(var sprite in this._sprite_map){
      if(this._sprite_map.hasOwnProperty(sprite)){
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
    // reserved
  }
  /*------------------------------------------------------------------------*/
  static onUnfocus(){
    this.renderSprite(this.unfocus_sprite);
    this.render();
  }
  /*------------------------------------------------------------------------*/
  static onFocus(){
    this.removeSprite(this.unfocus_sprite);
  }
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
   * @property {Array<boolean[]>} keystate_press   - array of pressed flag key ids
   * @property {Array<boolean[]>} keystate_trigger - array of trigger flag key ids
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
  /*-------------------------------------------------------------------------*/
  static setupEventHandlers(){
    window.addEventListener("keydown", this.onKeydown.bind(this));
    window.addEventListener("keyup", this.onKeyup.bind(this));
    window.addEventListener("mousedown", this.onKeydown.bind(this));
    window.addEventListener("mouseup", this.onKeyup.bind(this));
    window.addEventListener("mousewheel", this.processMouseWheel.bind(this));
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
   * > Module initialization
   * @memberof Sound
   * @property {float} _masterVolume - default master volume of audios
   */
  static initialize(){
    this._masterVolume = 0.5;
    this._currentBGM   = null;
    this._currentSE    = [];
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
        onload: this.reportLoadProgress,
      })
    })
  }
  /*-------------------------------------------------------------------------*/
  static reportLoadProgress(){
    Sound._loadProgess += 1;
    debug_log("Audio Loaded: " + Sound._loadProgess + '/' + Sound.resources.length + '(' + Sound.loadPercent + ')')
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
  /*-------------------------------------------------------------------------*/
  static fadeOutBGM(){

  }
  /*-------------------------------------------------------------------------*/
  static fadeOutSE(){

  }
  /*-------------------------------------------------------------------------*/
  static stopAll(){

  }
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
  resize(w, h){
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
  /*-------------------------------------------------------------------------*/
  setOpacity(opa){
    this._canvas.style.opacity = opa
  }
  /*-------------------------------------------------------------------------*/
  get canvas(){return this._canvas;}
  get context(){return this._context;}
  /*-------------------------------------------------------------------------*/
}