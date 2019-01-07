/*----------------------------------------------------------------------------*
 *                      Global utility functions                              *
 *----------------------------------------------------------------------------*/

// Firefox 1.0+
var isFirefox = typeof InstallTrigger !== 'undefined';

// Chrome 1+
var isChrome = !!window.chrome;

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
  if(obj === undefined){return "undefined";}
  if(obj === null){return "null";}
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
 * > Get valid number of arguments
 */
function validArgCount(){
  let sum = 0;
  for(let i=0;i<arguments.length;++i){
    if(arguments[i] !== undefined){sum += 1;}
  }
  return sum;
}
/**----------------------------------------------------------------------------
 * > Get number of valid numeric from arguments
 * @param {function} handler - the extra condition
 * @param {...Nunber} - numbers to be checked
 */
function validNumericCount(){
  let sum = 0;
  let handler = arguments[0];
  if(!handler){
    handler = function(){return true;}
  }
  else if(!isClassOf(handler, Function)){
    throw new TypeError(Function, handler);
  }
  for(let i=1;i<arguments.length;++i){
    if(!isClassOf(arguments[i], Number) || isNaN(arguments[i])){
      continue;
    }
    else if(handler.call(this, arguments[i])){
      sum += 1;
    }
  }
  return sum;
}
/**--------------------------------------------------------------------------
 * Check whether two array contains same object
 */
function isArrayalike(a, b){
  if(!a || !b){return false;}
  try{
    if(a.length != b.length){return false;}
  }catch(e){
    return false;
  }
  for(let i=0;i<a.length;++i){
    if(a[i] !== b[i]){return false;}
  }
  return true;
}
/**--------------------------------------------------------------------------
 * Shuffle array index
 */
function shuffleArray(ar){
  var j, i;
  for (i = ar.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    [ar[i], ar[j]] = [ar[j], ar[i]];
  }
  return ar;
}
/**--------------------------------------------------------------------------
 * Convert degree to radian
 */
function toRad(deg){
  return deg * Math.PI / 180;
}
/**--------------------------------------------------------------------------
 * Capitalize string
 */
function capitalize(str){
  let tmp = str.toLowerCase();
  if(tmp.length){tmp[0] = tmp[0].toUpperCase()}
  return tmp;
}
/**----------------------------------------------------------------------------
 * > Check whether the object is interable 
 * @param {Object} obj - the object to checl
 */
function isIterable(obj) {
  if (obj == null) {
    return false;
  }
  return (typeof obj[Symbol.iterator] === 'function') || false;
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
 * @param {boolean} fatel - whether the application is able to continue
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
 * > Get a random int
 * @param {Number} minn - minimum number
 * @param {Number} maxn - maximum number
 */
function randInt(minn = 0, maxn){
  let re = parseInt(Math.random(42) * 100000000)
  if(maxn){
    return re % (maxn - minn + 1) + minn
  }
  return minn + re;
}
/**----------------------------------------------------------------------------
 * > Get GCD of two numbers
 */
function gcd(a, b){
  if(b > a){[a, b] = [b, a];}
  if(a % b == 0){
    return b;
  }
  return (b, a % b);
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
    this._width   = this.Resolution[0];
    this._height  = this.Resolution[1];
    this._padding = 32;
    this._spacing = 8;
    this._lineHeight = 24;
    this._frameCount = 0;
    this._spriteMap  = {}
    this.fadingSprite     = null;
    this.unfocusSprite    = null;
    this._loaderReady     = false;
    this._assetsReady     = false;
    this._frameCount      = 0;
    this._loadProgress    = 0;
    this.FPS_Sum          = 0;
    this.FPS_MaxSample    = 30;
    this.FPS_SampleIndex  = 0;
    this.FPS_SamplePool   = [];
    this.globalSprites    = [];
    this.globalWindows    = [];

    this.createApp();
    this.initRenderer();
    this.initLoader();
    this.aliasFunctions();
    this.createBasicSprites();
  }
  /*---------------------------------------------------------------------------*/
  static createBasicSprites(){
    this.createFadingSprite();
    this.createDimSprite();
    this.createUnfocusSprite();
    this.createFPSSprite();
  }
  /*---------------------------------------------------------------------------*/
  static createGlobalSprites(){
    this.createOptionSprite();
    this.createBGMSprite();
    this.createSESprite();
  }
  /*---------------------------------------------------------------------------*/
  static createGlobalWindows(){
    this.createOptionWindow();
  }
  /**----------------------------------------------------------------------------
   * > Sprite for fading effect
   */
  static createFadingSprite(){
    this.fadingSprite = new Sprite();
    this.fadingSprite.fillRect(0, 0, this.width, this.height, Graphics.color.Black);
    this.fadingSprite.name = "Fading Sprite"
    this.fadingSprite.setZ(1000);
    this.fadingSprite.hide();
  }
  /**----------------------------------------------------------------------------
   * > Create unfocus effect sprite
   */
  static createUnfocusSprite(){
    this.unfocusSprite = new Sprite();
    this.unfocusSprite.fillRect(0, 0, this.width, this.height, Graphics.color.White);
    this.unfocusSprite.setOpacity(0.5);
    this.unfocusSprite.setZ(1001);
    this.unfocusSprite.name = "Unfocus Sprite";
    this.unfocusSprite.hide();
  }
  /*---------------------------------------------------------------------------*/
  static createDimSprite(){
    this.dimSprite = new Sprite();
    this.dimSprite.fillRect(0, 0, this.width, this.height, Graphics.color.Black);
    this.dimSprite.name = "Dim Sprite";
    this.dimSprite.setZ(0x100).setOpacity(0.7);
  }
  /**-------------------------------------------------------------------------
   * Option icon on bottom-left corner to open the option window
   */
  static createOptionSprite(){
    this.optionSprite = new SpriteCanvas(this.IconRect);
    let dy = this.height - this.IconRect.height - this.spacing;
    let dx = this.spacing
    this.optionSprite.drawIcon(this.IconID.Option,0,0);
    
    let handler = function(){
      Sound.playSE(Sound.IconOK);
      if(Graphics.optionWindow.visible){
        SceneManager.scene.closeOverlay();
      }
      else{
        SceneManager.scene.raiseOverlay(Graphics.optionWindow);
      }
    }
    this.optionSprite.on('click', handler);
    this.optionSprite.on('tap', handler);
    this.optionSprite.defaultActiveState = true;
    this.optionSprite.setZ(0x200).setPOS(dx, dy).alwaysActive = true;
    this.globalSprites.push(this.optionSprite)
  }
  /**-------------------------------------------------------------------------
   * Option icon on bottom-left corner to enable/disable the BGM
   */
  static createBGMSprite(){
    this.BGMSprite = new SpriteCanvas(this.IconRect);
    let dy = this.height - this.IconRect.height - this.spacing;
    let dx = this.IconRect.width + this.spacing * 2

    // the X mark shows when disable
    this.BGMSprite.drawIcon(this.IconID.BGM,0,0);
    this.BGMSprite.Xmark = this.BGMSprite.drawIcon(this.IconID.Xmark,0,0).setZ(2);

    // handler when sprite clicked
    let handler = function(){
      this.toggleBGM();
      this.playSE(Sound.IconOK);
    }.bind(Sound);
    this.BGMSprite.on('click', handler);
    this.BGMSprite.on('tap', handler);
    this.BGMSprite.defaultActiveState = true;
    this.BGMSprite.setZ(0x200).setPOS(dx, dy).alwaysActive = true;
    if(Sound.isBGMEnabled){this.BGMSprite.Xmark.hide();}
    this.globalSprites.push(this.BGMSprite)
  }
  /**-------------------------------------------------------------------------
   * Option icon on bottom-left corner to enable/disable the SE
   */
  static createSESprite(){
    this.SESprite = new SpriteCanvas(this.IconRect);
    let dy = this.height - this.IconRect.height - this.spacing;
    let dx = this.spacing + (this.IconRect.width + this.spacing)  * 2

    // the X mark shows when disable
    this.SESprite.drawIcon(this.IconID.SE,0,0);
    this.SESprite.Xmark = this.SESprite.drawIcon(this.IconID.Xmark,0,0).setZ(2);

    // handler when sprite clicked
    let handler = function(){
      this.toggleSE();
      this.playSE(Sound.IconOK);
    }.bind(Sound);
    this.SESprite.on('click', handler);
    this.SESprite.on('tap', handler);
    this.SESprite.defaultActiveState = true;
    this.SESprite.setZ(0x200).setPOS(dx, dy).alwaysActive = true;
    if(Sound.isSEEnabled){this.SESprite.Xmark.hide();}
    this.globalSprites.push(this.SESprite)
  }
  /**----------------------------------------------------------------------------
   * > Create sprite display FPS
   */
  static createFPSSprite(){
    let font = clone(this.DefaultFontSetting)
    font.fontSize = 18;
    this.FPSSprite = new PIXI.Text("FPS: ", font);
    this.FPSSprite.setZ(0x100);
  }
  /*---------------------------------------------------------------------------*/
  static createOptionWindow(){
    this.optionWindow = new Window_Option();
    this.optionWindow.hide();
    this.optionWindow.deactivate();
    this.globalWindows.push(this.optionWindow);
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
    this.renderer.plugins.interaction.interactionFrequency = 100
    document.app = this.app;
    document.getElementById('GAME').replaceWith(this.app.view);
    $('#languageSelect').css('top', this.app.y + this.app.height + this.spacing + 'px');
  }
  /**-------------------------------------------------------------------------
   * > Initialize PIXI Loader
   * @property {PIXI.loaders.Loader} loader - PIXI resources loader
   */
  static initLoader(){
    this.loader = PIXI.loader;
    this.loader.onProgress.add( function(){Graphics._loaderReady = false;} );
    this.loader.onComplete.add( function(){Graphics._loaderReady = true;} );
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
      if(path){
        Graphics.windowSkins[path]     = new Image();
        Graphics.windowSkins[path].src = path;
      }
    })
    this.loader.add(this.Images);
    this.loader.onProgress.add(progresshandler);
    this.loader.onError.add(this.onLoadError.bind(this));
    this.loader.load(load_ok_handler);
    this.loader.onComplete.add(function(){
      this._assetsReady = true;
    }.bind(this));
  }
  /*------------------------------------------------------------------------*/
  static onLoadError(msg, loader, rss){
    reportError(new ResourceError("PIXI Loader error:\n" + msg + '\n' + 'filename: ' + rss.name));
  }
  /**-------------------------------------------------------------------------
   * > Return textire of pre-loaded resources
   * @param {string} name - name of resources
   * @param {Rectangle} [srect] - (Opt)Souce Slice Rect of the texture
   */  
  static loadTexture(name, srect){
    if(srect){
      return new PIXI.Texture(PIXI.loader.resources[name].texture, srect);
    }
    return PIXI.loader.resources[name].texture;
  }
  /*-------------------------------------------------------------------------*/
  static get getLoadingProgress(){
    return [this._loadProgress, this.Images.length];
  }
  /**-------------------------------------------------------------------------
   * > Check whether loader has loaded all resources
   * @returns {boolean}
   */  
  static isReady(){
    return this._loaderReady && this._assetsReady;
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
    if(sprite.isWindow){return this.renderWindow(sprite);}
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
    if(bmp.input){
      document.body.removeChild(bmp.input);
    }
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
    this.updateFPS();
    this.updateMouseEffect();
  }
  /**-------------------------------------------------------------------------
   * > Update FPS information
   */
  static updateFPS(){
    this._frameCount += 1;
    this.FPS_Sum -= (this.FPS_SamplePool[this.FPS_SampleIndex] || 0);
    this.FPS_SamplePool[this.FPS_SampleIndex] = this.app.ticker.FPS;
    this.FPS_Sum += this.FPS_SamplePool[this.FPS_SampleIndex];
    this.FPS_SampleIndex = (this.FPS_SampleIndex + 1) % this.FPS_MaxSample;
    this.FPS = Math.floor(this.FPS_Sum / this.FPS_MaxSample);
    this.FPSSprite.text = "FPS: " + this.FPS;
  }
  /**-------------------------------------------------------------------------
   * > Update mouse trailing effect
   */
  static updateMouseEffect(){
    if(Input.isMouseMoved){
      this.mouseMoveTrailingEffect();
    }
    if(Input.isTriggered(Input.keymap.kMOUSE1)){
      this.mouseClickEffect();
    }
  }
  /**-------------------------------------------------------------------------
   * > Add sprite and build a instance name map
   * @param {string} image_name - the path to the image
   * @param {string} instance_name - the name give to the sprite after created
   * @returns {Sprite} - the created sprite
   */  
  static addSprite(image_name, instance_name = null){
    var sprite = new Sprite(Graphics.loadTexture(image_name));
    if(instance_name == null){instance_name = image_name;}
    sprite.name = instance_name;
    this._spriteMap[instance_name] = sprite;
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
    return sprite;
  }
  /**-------------------------------------------------------------------------
   * > Remove object in current scene
   * @param {PIXI.Sprite|string} - the sprite/instance name of sprite to remove
   */
  static removeSprite(...args){
    args.forEach(function(obj){
      if(isClassOf(obj, String)){ obj = Graphics._spriteMap[obj]; }
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
  static get lineHeight(){return this._lineHeight;}
  /**------------------------------------------------------------------------
   * > Return a random color from color.json
   */
  static randomColor(exclude = []){
    let candidates = [];
    for(let k in this.color){
      if(this.color.hasOwnProperty(k)){
        candidates.push(this.color[k]);
      }
    }
    for(let i=0;i<exclude.length;++i){
      let idx = candidates.indexOf(exclude[i]);
      if(idx >= 0){candidates.splice(idx, 1);}
    }
    let ki = parseInt(Math.random() * 1000) % candidates.length;
    let re = candidates[ki];
    return re;
  }
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
    if(obj.unpause){return ;}
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
  /**----------------------------------------------------------------------------
   * Clicking feedback effect
   */
  static mouseClickEffect(){
    if(!this.isReady() || !Input.mouseAppPOS){return ;}
    let dx = Input.mouseAppPOS[0];
    let dy = Input.mouseAppPOS[1];
    /**
     * @property {boolean} unpause - won't pause regardless game unfocused
     */
    let sp = this.playAnimation(dx, dy, this.Clicking, 2);
    sp.setZ(0x1000).setOpacity(this.mouseClickOpacity).unpause = true;    
  }
  /**----------------------------------------------------------------------------
   * Mouse move trailing visual effect
   */
  static mouseMoveTrailingEffect(){
    if(!this.isReady()){return ;}
    let dx = Input.mouseAppPOS[0];
    let dy = Input.mouseAppPOS[1];
    /**
     * @property {boolean} unpause - won't pause regardless game unfocused
     */
    let sp = this.playAnimation(dx, dy, this.Trailing, 2)
    sp.setOpacity(this.mouseTrailOpacity).setZ(0x1000).unpause = true;
  }
  /**------------------------------------------------------------------------
   * Create animated sprite
   * @param {String} image - the image name
   * @param {boolean} crt_holder - create holder to avoid the direct render 
   * crash on scene. The animatedSprite can be accessed with <Holder.anim>
   */
  static generateAnimation(image, crt_holder = false){
    let oriImage = this.loadTexture(image);
    let sqlen    = oriImage.width / this.AnimRowCount
    let src_rect = new Rect(0, 0, sqlen, sqlen)
    let textureArray = [];
    let rowMax   = oriImage.width  / src_rect.width;
    let colMax   = oriImage.height / src_rect.height;
    for(let i=0;i<colMax;++i){
      src_rect.x = 0;
      for(let j=0;j<rowMax;++j){
        textureArray.push(this.loadTexture(image, src_rect))
        src_rect.x += src_rect.width;
      }
      src_rect.y += src_rect.height;
    }
    let re = new PIXI.extras.AnimatedSprite(textureArray);
    re.loop = false;
    if(crt_holder){
      let holder = new SpriteCanvas(0, 0, re.width, re.height);
      holder.addChild(animSprite);
      holder.anim = re;
      re.onComplete = function(){Graphics.removeSprite(holder)};
      return holder;
    }
    else{re.onComplete = function(){Graphics.removeSprite(re)};}
    return re;
  }
  /**------------------------------------------------------------------------
   * Play an animation on the screen
   * @param {Number} x
   * @param {Number} y
   * @param {String} image - image key(path)
   * @param {Number} [align] - (Default=1) 1: Same as given position, 2: center
   */
  static playAnimation(x, y, image, align = 1){
    let animSprite = this.generateAnimation(image);
    let holder = new SpriteCanvas(0, 0, animSprite.width, animSprite.height);
    holder.addChild(animSprite);
    animSprite.loop = false;
    animSprite.onComplete = function(){Graphics.removeSprite(holder)};
    let dx = align == 1 ? x : (x - animSprite.width  / 2);
    let dy = align == 1 ? y : (y - animSprite.height / 2);
    holder.setPOS(dx, dy).setZ(0x1000);
    this.renderSprite(holder);
    animSprite.play();
    return animSprite;
  }
  /**-------------------------------------------------------------------------
   * > Creates an input canvas
   * @param {Number} x
   * @param {Number} y
   * @param {Number} width
   * @param {Number} height
   * @param {Object} args - the options
   * @param {Function} args.handler - the handler to call when input submitted
   * @param {String} args.message - same as text input's place holder
   * @param {Number} args.fontSize
   */
  static createInputCanvas(x, y, w, h, args = {}){
    let bmp = new Bitmap(x, y, w, h);
    if(!args.fontSize){args.fontSize = 18;}
    bmp.input = new CanvasInput({
      canvas: bmp._canvas,
      fontSize: args.fontSize,
      fontFamily: 'Arial',
      fontColor: '#212121',
      fontWeight: 'bold',
      width: w - Graphics.padding,
      padding: 8,
      borderWidth: 1,
      borderColor: '#000',
      borderRadius: 3,
      boxShadow: '1px 1px 0px #fff',
      innerShadow: '0px 0px 5px rgba(0, 0, 0, 0.5)',
      placeHolder: args.message || '',
      onsubmit: args.handler
    });
    return bmp;
  }
  /**-------------------------------------------------------------------------
   * If performance is lower, haste the object to make it looks normal
   * @returns {Number} - the delta multiple factor
   */
  static get speedFactor(){
    return 60.0 / this.FPS;
  }
  /*------------------------------------------------------------------------*/
} // class Graphics

/**---------------------------------------------------------------------------
 * The static class handles the input
 *
 * @class Input
 * @property {Array.<Number>} mousePagePOS - mouse position in the web page
 * @property {Array.<Nunber>} mouseClientPOS - mouse position in window viewport
 * @property {Array.<Nunber>} mouseAppPOS - mouse position inside the application
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
    this.mouseAppPOS      = [0, 0];
    this.mouseClientPOS   = [0, 0];
    this.mousePagePOS     = [0, 0];
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
    let px = event.pageX || 0, py = event.pageY || 0;
    this._mouseMoved    = !(isArrayalike([px, py], this.mousePagePOS));
    this.mousePagePOS   = [px, py];
    this.mouseClientPOS = [event.clientX || 0, event.clientY || 0];
    this.mouseAppPOS    = [this.mousePagePOS[0] - Graphics.app.x, this.mousePagePOS[1] - Graphics.app.y];
    this.state_changed  = true;
  }
  /*-------------------------------------------------------------------------*/
  static setupEventHandlers(){
    window.addEventListener("keydown", this.onKeydown.bind(this));
    window.addEventListener("keyup", this.onKeyup.bind(this));
    window.addEventListener("mousedown", this.onKeydown.bind(this));
    window.addEventListener("mouseup", this.onKeyup.bind(this));
    window.addEventListener("mousewheel", this.processMouseWheel.bind(this));
    document.addEventListener("mousemove", this.processMouseMove.bind(this));

    let app = Graphics.app.view;
    app.addEventListener('mouseover', function(){this._pointerInside = true;}.bind(this));
    app.addEventListener('mouseout', function(){this._pointerInside = false;}.bind(this));
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
      this._mouseMoved  = false;
      this.reset_needed = false;
      for(let i=0;i<0xff;++i){this.keystate_trigger[i] = false;}
      this.wheelstate = 0;
    }
  }
  /**-------------------------------------------------------------------------
   * > Check whether mouse is in certain area
   * @param {Rect} crect - the collision rect
   */
  static isMouseInArea(crect){
    return crect.contains(this.mouseAppPOS[0], this.mouseAppPOS[1]);
  }
  /**-------------------------------------------------------------------------
   * > Check whether key is triggered in certain area
   * @param {Number} kid - key id
   * @param {Rect} crect - collision rect
   */
  static isTriggerArea(kid, crect){
    if(!crect || !Input.mousePagePOS){return false;}
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
   * > Check whether mouse moved
   */
  static get isMouseMoved(){
    return this._mouseMoved;
  }
  /**-------------------------------------------------------------------------
   * > Check whether pointer is inside the app
   */
  static get isPointerInside(){
    return this._pointerInside;
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
    this._bgmVolume    = 1;
    this._seVolume     = 1;
    this._currentBGM   = null;
    this._currentSE    = [];
    this._audioMap     = {};
    this.track         = {};
    this._loadProgress = 0;
    this._stackedBGM   = null;
    this._stageProgres = [];
    
    this.loadVolumeSetting();
    this.loadAudioEnable();
    this.preloadAllAudio();
  }
  /*-------------------------------------------------------------------------*/
  static loadVolumeSetting(){
    let vol = DataManager.volume;
    this._masterVolume = vol[0];
    this._bgmVolume    = vol[1];
    this._seVolume     = vol[2];
  }
  /*-------------------------------------------------------------------------*/
  static loadAudioEnable(){
    this.audioEnable   = DataManager.audioEnable;
  }
  /*-------------------------------------------------------------------------*/
  static preloadAllAudio(){
    debug_log("Load audios...")
    Sound.resources.forEach((filename) => {
      this.loadAudio(filename)
    })
  }
  /*-------------------------------------------------------------------------*/
  static loadAudio(filename){
    this.track[filename] = new Howl({
      src: [filename],
      volume: Sound._masterVolume,
      onload: function(){Sound.reportLoadProgress(filename)},
      onfade: function(SoundID){Sound.onAudioFadeComplete(SoundID)},
      onstop: function(soundID){Sound.unregisterAudio(soundID);}, 
      onend: function(soundID){Sound.unregisterAudio(soundID);},
      onloaderror: function(sid, msg){
        reportError(new ResourceError(msg + ' ' + filename));
      },
    });
    return this.track[filename];
  }
  /*-------------------------------------------------------------------------*/
  static loadStageAudio(){
    if(this._loadingStage){return ;}
    debug_log("Load stage audios...")
    $.getJSON('js/json/stage_audio.json', function(data){
      for(prop in data){
        if(prop == "resources" || prop == "_comment"){continue;}
        Sound[prop] = data[prop];
        Sound.resources.push(data[prop]);
        Sound.loadAudio(data[prop])
      }
    }.bind(this))
    this._loadingStage = true;
  }
  /*-------------------------------------------------------------------------*/
  static registerAudio(soundInstance){
    debug_log("Audio registered: " + soundInstance.id);
    Sound._audioMap[soundInstance.id] = soundInstance;
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
    debug_log("Audio unregisterd: " + soundID);
    let soundContext = Sound.track[soundInstance.symbol];
    if(soundInstance && !soundContext.loop(soundID)){
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
  static get getLoadingProgress(){
    return [this._loadProgress, this.resources.length];
  }
  /*-------------------------------------------------------------------------*/
  static reportLoadProgress(fname){
    Sound._loadProgress += 1;
    debug_log("Audio Loaded: " + fname + ' ' + Sound._loadProgress + '/' + Sound.resources.length + '(' + Sound.loadPercent + ')')
  }
  /*-------------------------------------------------------------------------*/
  static onAudioFadeComplete(soundID){
    if(!Sound._audioMap[soundID]){
      console.error("Untracked audio: " + soundID);
      return ;
    }
    let soundGroup = Sound.track[Sound._audioMap[soundID].symbol];
    if(soundGroup.volume(soundID) == 0.0){
      soundGroup.loop(false, soundID);
      Sound.unregisterAudio(soundID)
    }
  }
  /*-------------------------------------------------------------------------*/
  static isReady(){
    return this._loadProgress == this.resources.length;
  }
  /*-------------------------------------------------------------------------*/
  static isStageReady(){
    return this._loadingStage && this.isReady();
  }
  /*-------------------------------------------------------------------------*/
  static get loadProgress(){
    return this._loadProgress;
  }
  /*-------------------------------------------------------------------------*/
  static get loadPercent(){
    return this._loadProgress / this.resources.length;
  }
  /**-------------------------------------------------------------------------
   * > Play the audio file as Sound Effect of given symbol
   * @param {string} symbol - symbol of the audio file
   */
  static playSE(symbol, volume = this._seVolume){
    if(!this.isSEEnabled){return ;}
    if(!this.track[symbol]){
      throw new Error("Undefined audio track: " + symbol)
    }
    let pid = -1;
    pid = this.track[symbol].play();
    this.track[symbol].volume(volume * this._masterVolume, pid);
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
    if(!this.isBGMEnabled){
      this._stackedBGM = symbol;
      return 0;
    }
    if(this._currentBGM){this.stopBGM();}
    let pid = -1;
    pid = this.track[symbol].play();
    this.track[symbol].loop(true, pid);
    this.track[symbol].volume(this._masterVolume * this._bgmVolume);
    this.registerAudio( {id:pid, type:'BGM', symbol:symbol} );

    return pid;
  }
  /**-------------------------------------------------------------------------
   * > Play the SE with fade-in effect
   */
  static fadeInSE(symbol, duration = Sound.fadeDurationSE){
    if(!this.isSEEnabled){return ;}
    let pid = -1;
    pid = this.track[symbol].play();
    let vol = this._masterVolume * this._seVolume
    this.track[symbol].fade(0.0, vol, duration, pid);
    this.registerAudio( {id:pid, type:'SE',symbol:symbol} );
    return pid;
  }
  /**-------------------------------------------------------------------------
   * > Play the BGM with fade-in effect
   */
  static fadeInBGM(symbol, duration = Sound.fadeDurationBGM){
    if(!this.isBGMEnabled){
      this._stackedBGM = symbol;
      return 0;
    }
    if(this._currentBGM){this.fadeOutBGM();}
    let pid = -1;
    pid = this.track[symbol].play();
    this.track[symbol].loop(true, pid);

    if(!this.isBGMEnabled){
      this.track[symbol].volume(0);
    }
    else{
      this.track[symbol].fade(0.0, this._masterVolume * this._bgmVolume, duration, pid);
    }

    this.registerAudio( {id:pid, type:'BGM', symbol:symbol} );
    return pid;
  }
  /*-------------------------------------------------------------------------*/
  static fadeOutBGM(duration = Sound.fadeDurationBGM){
    let s = this._currentBGM;
    if(!s){return;}
    if(!this.isBGMEnabled){return this.stopBGM();}
    this.track[s.symbol].fade(this._masterVolume * this._bgmVolume, 0.0, duration, s.id);
  }
  /*-------------------------------------------------------------------------*/
  static fadeOutSE(soundID, duration = Sound.fadeDurationSE){
    if(!this.isSEEnabled){return this.stopSE(soundID, duration);}
    let vol = this._masterVolume * this._seVolume;
    if(soundID){
      let s = this._audioMap[soundID];
      this.track[s.symbol].fade(vol, 0.0, duration, s.id);
    }
    else{
      for(let i=0;i<this._currentSE.length;++i){
        let s = this._currentSE[i];
        this.track[s.symbol].fade(vol, 0.0, duration, s.id);
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
  static changeMasterVolume(vol){
    this._masterVolume = vol;
    this.changeBGMVolume(this._bgmVolume);
    this.changeSEVolume(this._seVolume);
    DataManager.changeSetting(DataManager.kVolume, this.volumeData);
  }
  /*-------------------------------------------------------------------------*/
  static changeBGMVolume(vol){
    this._bgmVolume = vol;
    DataManager.changeSetting(DataManager.kVolume, this.volumeData)
    if(!this._currentBGM){return ;}
    this.track[this._currentBGM.symbol].volume(this._masterVolume * vol);
  }
  /*-------------------------------------------------------------------------*/
  static changeSEVolume(vol){
    this._seVolume = vol;
    for(let i=0;i<this._currentSE.length;++i){
      let s = this._currentSE[i];
      this.track[s.symbol].volume(this._masterVolume * vol)
    }
    DataManager.changeSetting(DataManager.kVolume, this.volumeData)
  }
  /*-------------------------------------------------------------------------*/
  static enableBGM(){
    this.audioEnable[0] = true;
    if(this._stackedBGM){
      this.playBGM(this._stackedBGM);
      this._stackedBGM = null;
    }
    if(Graphics.BGMSprite){Graphics.BGMSprite.Xmark.hide();}
    DataManager.changeSetting(DataManager.kAudioEnable, this.audioEnable)
  }
  /*-------------------------------------------------------------------------*/
  static disableBGM(){
    this.audioEnable[0] = false;
    if(this._currentBGM){this._stackedBGM = this._currentBGM.symbol;}
    this.stopBGM();
    if(Graphics.BGMSprite){Graphics.BGMSprite.Xmark.show();}
    DataManager.changeSetting(DataManager.kAudioEnable, this.audioEnable)
  }
  /*-------------------------------------------------------------------------*/
  static toggleBGM(){
    if(this.isBGMEnabled){
      this.disableBGM();
    }
    else{
      this.enableBGM();
    }
  }
  /*-------------------------------------------------------------------------*/
  static enableSE(){
    this.audioEnable[1] = true;
    if(Graphics.SESprite){Graphics.SESprite.Xmark.hide();}
    DataManager.changeSetting(DataManager.kAudioEnable, this.audioEnable);
  }
  /*-------------------------------------------------------------------------*/
  static disableSE(){
    this.audioEnable[1] = false;
    this.stopSE();
    if(Graphics.SESprite){Graphics.SESprite.Xmark.show();}
    DataManager.changeSetting(DataManager.kAudioEnable, this.audioEnable);
  }
  /*-------------------------------------------------------------------------*/
  static toggleSE(){
    if(this.isSEEnabled){
      this.disableSE();
    }
    else{
      this.enableSE();
    }
  }
  /*-------------------------------------------------------------------------*/
  static playCardDraw(){
    let cand = ["audio/se/cardDraw.mp3", "audio/se/cardDraw2.mp3"]
    this.playSE(cand[parseInt(randInt(0, cand.length-1))])
  }
  /*-------------------------------------------------------------------------*/
  static playCardPlace(){
    let cand = ["audio/se/cardPlace1.mp3", "audio/se/cardPlace2.mp3", "audio/se/cardPlace3.mp3"]
    this.playSE(cand[parseInt(randInt(0, cand.length-1))])
  }
  /*-------------------------------------------------------------------------*/
  static getVictoryTheme(id = -1){
    let cand = [this.Victory0, this.Victory1, this.Victory2]
    if(id < 0 || id >= cand.length){
      id = parseInt(randInt(0, cand.length-1))
    }
    return cand[id];
  }
  /*-------------------------------------------------------------------------*/
  static getStageTheme(id = -1){
    let cand = [this.Stage0, this.Stage1, this.Stage2]
    if(id < 0 || id >= cand.length){
      id = parseInt(randInt(0, cand.length-1))
    }
    return cand[id];
  }
  /*-------------------------------------------------------------------------*/
  static playDefeat(){
    this.playBGM(this.Defeat);
  }
  /*-------------------------------------------------------------------------*/
  static playCardPlace(){
    let cand = ["audio/se/cardPlace1.mp3", "audio/se/cardPlace2.mp3", "audio/se/cardPlace3.mp3"]
    this.playSE(cand[parseInt(randInt(0, cand.length-1))])
  }
  /*-------------------------------------------------------------------------*/
  static playOK(){this.playSE(this.OK);}
  static playOK2(){this.playSE(this.OK2);}
  static playBuzzer(){this.playSE(this.Buzzer);}
  static playCursor(){this.playSE(this.Cursor);}
  static playCancel(){this.playSE(this.Cancel);}
  static playSaveLoad(){this.playSE(this.SaveLoad);}
  static playShuffle(){this.playSE(this.Shuffle);}
  static playDeal(){this.playSE(this.Deal);}
  static get volumeData(){return [this._masterVolume, this._bgmVolume, this._seVolume];}
  static get isBGMEnabled(){return this.audioEnable[0];}
  static get isSEEnabled(){return this.audioEnable[1];}
  /*-------------------------------------------------------------------------*/
}

/**---------------------------------------------------------------------------
 * The extended class of PIXI.Sprite
 *
 * @class Sprite
 * @constructor
 * @extends PIXI.Sprite
 * @property {boolean} static - When is child, the position won't effected by
 *                              parent's display origin (ox/oy)
 * 
 * @property {Number} speed   - Pixel delta per average frame
 * @property {Number} realX   - The final x position the sprite should be
 * @property {Number} realY   - The final y position the sprite should be
 */
class Sprite extends PIXI.Sprite{
  /**-------------------------------------------------------------------------
   * @constructor
   * @memberof Sprite
   * @param {Texture} texture - A PIXI.Texture to convert to sprite
   */
  constructor(...args){
    super(...args);
    this.realX = this.x;
    this.realY = this.y;
    this.setZ(0);
    this.static = false;
    this.interactive = false;
    this.speed = 8;
    return this;
  }
  /*-------------------------------------------------------------------------*/
  get z(){return this.zIndex;}
  /*-------------------------------------------------------------------------*/
  get rect(){
    return new Rect(this.x, this.y, this.width, this.height);
  }
  /*-------------------------------------------------------------------------*/
  update(){
    this.updateMovement();
  }
  /*-------------------------------------------------------------------------*/
  updateMovement(){
    if(this.deltaX == 0 && this.deltaY == 0){return ;}
    if(this.realX == this.x && this.realY == this.y){
      this.deltaX = 0; this.deltaY = 0;
      this.callMoveCompleteFunction();
      return ;
    }
    if(this.x < this.realX){
      this.x = Math.min(this.realX, this.x + this.deltaX * Graphics.speedFactor);
    }
    else{
      this.x = Math.max(this.realX, this.x + this.deltaX * Graphics.speedFactor);
    }
    if(this.y < this.realY){
      this.y = Math.min(this.realY, this.y + this.deltaY * Graphics.speedFactor);
    }
    else{
      this.y = Math.max(this.realY, this.y + this.deltaY * Graphics.speedFactor);
    }
  }
  /**-------------------------------------------------------------------------
   * Move to given position step by step (called from update)
   */
  moveto(x, y, fallback=null){
    if(x == null){x = this.x;}
    if(y == null){y = this.y;}
    if(this.isMoving){this.callMoveCompleteFunction();}
    this.moveCompleteFallback = fallback;
    this.realX = x;
    this.realY = y;
    let dx = (this.realX - this.x), dy = (this.realY - this.y);
    let h = Math.sqrt(dx*dx + dy*dy);
    this.deltaX = this.speed * dx / h;
    this.deltaY = this.speed * dy / h;
    if(this.deltaX == 0 && this.deltaY == 0){
      this.callMoveCompleteFunction();
    }
  }
  /*-------------------------------------------------------------------------*/
  callMoveCompleteFunction(delay=0){
    if(!this.moveCompleteFallback){return ;}
    if(delay > 0){
      EventManager.setTimeout(()=>{
        if(this.moveCompleteFallback){
          this.moveCompleteFallback();
          this.moveCompleteFallback = null;
        };
      }, delay);
    }
    else{
      this.moveCompleteFallback();
      this.moveCompleteFallback = null;
    }
  }
  /*-------------------------------------------------------------------------*/
  resize(w, h){
    if(w === null){w = this.width;}
    if(h === null){w = this.height;}
    var scale = [w / this.width, h / this.height]
    this.setTransform(this.x, this.y, scale[0], scale[1]);
    this.children.forEach(function(sp){
      sp.setTransform(sp.x, sp.y, scale[0], scale[1]);
    });
    return this;
  }
  /*-------------------------------------------------------------------------*/
  clear(){
    for(let i=0;i<this.children.length;++i){
      if(!this.children[i].destroy){continue;}
      this.children[i].destroy({children: true});
    }
    this.children = []
    return this;
  }
  /*-------------------------------------------------------------------------*/
  setPOS(x, y){
    if(this.isMoving){this.callMoveCompleteFunction(2);}
    super.setPOS(x, y);
    this.realX = this.x;
    this.realY = this.y;
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
    return rect;
  }
  /*-------------------------------------------------------------------------*/
  drawText(x, y, text, font = Graphics.DefaultFontSetting, autowrap = true){
    if(!font){font = Graphics.DefaultFontSetting}
    if(autowrap){text = this.textWrap(text, font);}
    let txt = new PIXI.Text(text, font);
    txt.alpha  = this.opacity;
    txt.setPOS(x,y).setZ(2);
    this.addChild(txt);
    return txt;
  }
  /**-------------------------------------------------------------------------
   * > Draw Icon in Iconset
   * @param {Number} icon_index - the index of the icon in Iconset
   * @param {Number} x - the draw position of X
   * @param {Number} y - the draw position of Y
   */
  drawIcon(icon_index, x, y){
    icon_index = parseInt(icon_index);
    let src_rect = clone(Graphics.IconRect);
    src_rect.x = icon_index % Graphics.IconRowCount * src_rect.width;
    src_rect.y = parseInt(icon_index / Graphics.IconRowCount) * src_rect.height;
    let sx = src_rect.x, sy = src_rect.y, sw = src_rect.width, sh = src_rect.height;
    let bitmap = new Bitmap(0, 0, sw, sh);
    bitmap.blt(Graphics.IconsetImage, sx, sy, sw, sh, 0, 0, sw, sh);
    let texture = new PIXI.Texture.fromCanvas(bitmap.canvas);
    let iconSprite = new Sprite(texture);
    iconSprite.setPOS(x, y).setZ(2);
    this.addChild(iconSprite);
    return iconSprite;
  }
  /*-------------------------------------------------------------------------*/
  addChild(...args){
    super.addChild(...args);
    this.children.sort((a,b) => (a.zIndex || 0) - (b.zIndex || 0));
  }
  /*-------------------------------------------------------------------------*/
  render(){
    Graphics.renderSprite(this);
  }
  /*-------------------------------------------------------------------------*/
  remove(){
    Graphics.removeSprite(this);
  }
  /*-------------------------------------------------------------------------*/
  getStringWidth(text, font = Graphics.DefaultFontSetting){
    return new PIXI.Text(text, font).width;
  }
  /*-------------------------------------------------------------------------*/
  textWrap(text, font = Graphics.DefaultFontSetting){
    if(!text){return ;}
    let paddingW = Graphics.padding / 2; // Padding width
    if(this.width - paddingW - Graphics.spacing < 0){
      console.error("Window too small to text warp: " + getClassName(text));
      return text;
    }

    // Line width
    let lineWidth = this.width - paddingW;

    let formated = "";  // Formated string to return
    let curW = 0;       // Current Line Width
    let line = "";      // Current line string
    let strings = text.split(/[\r\n ]+/) // Split strings
    let minusW = this.getStringWidth('-', font);
    let spaceW = this.getStringWidth(' ', font);
    let endl = false;   // End Of Line Flag
    let strW = 0;       // Current processing string width

    let str = null; // Current processing string
    while(str = strings[0]){
      if((str || '').length == 0){continue;}
      strW = this.getStringWidth(str, font);
      endl = false; 
      // String excessed line limit
      if(strW + paddingW > lineWidth){
        line = "";
        let curW = minusW, last_i = 0;
        let processed = false;
        // Process each character in current string
        for(let i=0;i<str.length;++i){
          strW = this.getStringWidth(str[i], font);
          last_i = i;
          // Display not possible
          if(!processed && curW + strW >= lineWidth){
            return text;
          } // Current character acceptable
          else if(curW + strW < lineWidth){
            curW += strW;
            line += str[i];
            processed = true;
          } // Unable to add more
          else{
            break;
          }
        }

        line += '-'
        strings[0] = str.substr(last_i, str.length);
        endl = true;
      } // current string can fully add to line
      else if(curW + strW < lineWidth){
        curW += strW + spaceW;
        line += strings.shift() + ' ';
        if(strings.length == 0){endl = true;}
      }
      else{
        endl = true;
      }
      
      if(endl){
        formated += line;
        if(strings.length > 0){formated += '\n';}
        line = "";
        curW = paddingW;
      }
    }
    if(line.length > 0){formated += line;}
    return formated;
  }
  /*-------------------------------------------------------------------------*/
  get translucentAlpha(){return 0.4;}
  /*-------------------------------------------------------------------------*/
  get isMoving(){return this.x != this.realX || this.y != this.realY;}
  /**-------------------------------------------------------------------------
   * > Getter function
   */
  get opacity(){return parseFloat(this.alpha);}
  /*-------------------------------------------------------------------------*/
}

/**---------------------------------------------------------------------------
 * > An object holds collection of sprites, does not an actual sprite 
 * class itself. Supposed to be superclass so won't call initialize itself.
 * 
 * @class
 * @extends Sprite
 * @property {Number} x - X position in app
 * @property {Number} y - Y position in app
 * @property {Number} w - width of canvas, overflowed content will be hidden
 * @property {Number} h - height of canvas, overflowed content will be hidden
 * @property {Number} ox - Display origin x
 * @property {Number} oy - Display origin y
 * @property {Bitset} surplusDirection - bitset that represent which direction
 *                                       has overflowed item.
 *                                       Range: 0000-1111(Up/Right/Left/Down)
 */
class SpriteCanvas extends Sprite{
  /**-------------------------------------------------------------------------
   * @constructor
   * @param {Rect} rect - initialize by an rect object
   *//**
   * @constructor
   * @param {Number} x - X position in app
   * @param {Number} y - Y position in app
   * @param {Number} w - width of canvas, overflowed content will be hidden
   * @param {Number} h - height of canvas, overflowed content will be hidden
   */
  constructor(x, y, w, h){
    if(isClassOf(x, Rect)){
      let rect = x;
      y = rect.x;
      w = rect.width;
      h = rect.height;
      x = rect.x;
    }
    if(validArgCount(x, y, w, h) != 4){
      throw new ArgumentError(4, validArgCount(x,y,w,h));
    }
    super(PIXI.Texture.EMPTY);
    this.setPOS(x, y);
    this.resize(w, h);
    this.surplusDirection = 0;
    this.ox = 0; this.oy = 0;
    this.lastDisplayOrigin = [0,0];
    this.applyMask();
    this.hitArea = new Rect(0, 0, w, h);
  }
  /*-------------------------------------------------------------------------*/
  get width(){return this._width;}
  get height(){return this._height;}
  /**------------------------------------------------------------------------
   * > Check whether the object is inside the visible area
   * @param {Sprite|Bitmap} obj - the DisplayObject to be checked
   * @returns {Number} - which diection it overflowed. 
   *                     8: Up, 6: Right, 4: Left, 2: Down
   */
  isObjectVisible(obj){
    let dx = obj.x - this.ox + this.lastDisplayOrigin[0] * 2;
    let dy = obj.y - this.oy + this.lastDisplayOrigin[1] * 2;
    if(dx > this.width){return 6;}
    if(dy > this.height){return 2;}
    let dw = dx + obj.width, dh = dy + obj.height;
    if(dw < 0){return 4;}
    if(dh < 0){return 8;}
    return 0;
  }
  /*-------------------------------------------------------------------------*/
  refresh(){
    this.surplusDirection = 0;
    let dox = this.ox - this.lastDisplayOrigin[0];
    let doy = this.oy - this.lastDisplayOrigin[1];
    this.children.sort((a,b) => (a.zIndex || 0) - (b.zIndex || 0));
    for(let i=0;i<this.children.length;++i){
      let sp = this.children[i];
      if(sp.static){continue;}
      let overflowDir = this.isObjectVisible(sp);
      if(overflowDir > 0){
        sp.hide();
        this.surplusDirection |= (1 << ((overflowDir - 2) / 2))
      }
      else{sp.show();}
      let dx = sp.x - dox, dy = sp.y - doy;
      sp.setPOS(dx, dy);
    }
    this.lastDisplayOrigin = [this.ox, this.oy];
  }
  /**------------------------------------------------------------------------
   * > Synchronize child properties to parent's
   */
  syncChildrenProperties(){
    for(let i=0;i<this.children.length;++i){
      this.children[i].interactive = this.isActivate();
    }
  }
  /*-------------------------------------------------------------------------*/
  resize(w, h){
    if(w === null){w = this._width;}
    if(h === null){w = this._height;}
    this._width  = w;
    this._height = h;
    this.drawMask();
    this.hitArea = new Rect(0, 0, w, h);
    return this;
  }
  /**-------------------------------------------------------------------------
   * > Apply mask to prevent shown overflow objects
   */
  applyMask(){
    this.maskGraphics = new PIXI.Graphics();
    this.drawMask();
    this.maskGraphics.static = true;
    this.addChild(this.maskGraphics);
    this.mask = this.maskGraphics;
  }
  /*------------------------------------------------------------------------*/
  drawMask(){
    if(!this.maskGraphics){return ;}
    this.maskGraphics.clear();
    this.maskGraphics.beginFill(Graphics.color.White);
    this.maskGraphics.drawRect(0, 0, this.width, this.height);
    this.maskGraphics.endFill();
  }
  /*------------------------------------------------------------------------*/
  clear(){
    for(let i=0;i<this.children.length;++i){
      if(this.children[i].destroy){
        this.children[i].destroy({children: true});
      }
      this.removeChild(this.children[i]);
    }
    this.children = [];
  }
  /*------------------------------------------------------------------------*/
  sortChildren(){
    this.children.sort((a,b) => (a.zIndex || 0) - (b.zIndex || 0));
  }
  /**-------------------------------------------------------------------------
   * > Scroll window horz/vert
   */
  scroll(sx = 0, sy = 0){
    this.ox += sx;
    this.oy += sy;
    this.refresh();
  }
  /**-------------------------------------------------------------------------
   * > Set display origin
   * @param {Number} x - new ox, should be real x in pixel
   * @param {Number} y - new oy, should be rael y in pixel
   */
  setDisplayOrigin(x, y){
    this.ox = x;
    this.oy = y;
    this.refresh();
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
  setZ(z){
    this._canvas.style.zIndex = z;
    return this;
  }
  /*-------------------------------------------------------------------------*/
  resize(w, h){
    if(w === null){w = this._width;}
    if(h === null){w = this._height;}
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
    if(this.input){this.input.destroy();}
    this.input = null;
  }
  /*-------------------------------------------------------------------------*/
  isDisposed(){
    return this._canvas === null;
  }
  /*-------------------------------------------------------------------------*/
  render(){
    Graphics.renderBitmap(this);
  }
  /*-------------------------------------------------------------------------*/
  remove(){
    Graphics.removeBitmap(this);
  }
  /*-------------------------------------------------------------------------*/
  get canvas(){return this._canvas;}
  get context(){return this._context;}
  /*-------------------------------------------------------------------------*/
}
/**---------------------------------------------------------------------------
 * The Rectangle object for abbreviation of PIXI's one
 * @class Rect
 * @extends PIXI.Rectangle
 */
class Rect extends PIXI.Rectangle{
  /**
   * @constructor
   * @param {Object} rect - initialize by the object that contain rect data
   * @param {...Number} [params] - initialize by given x, y, w, h
   * @param {Number} x - The X point of the bitmap
   * @param {Number} y - The Y point of the bitmap
   * @param {Number} width - The width of the bitmap
   * @param {Number} height - The height of the bitmap
   */
  constructor(...args){
    super(0,0,0,0);
    let arglen = validArgCount.apply(window, args);
    if(arglen == 1){
      this.x = args[0].x;
      this.y = args[0].y;
      this.width = args[0].width;
      this.height = args[0].height;
    }
    else if(arglen == 4){
      this.x = args[0];
      this.y = args[1];
      this.width = args[2];
      this.height = args[3];
    }
    else{
      throw new ArgumentError([1,4], arglen)
    }
  }
}