/**
 * The Superclass of all scene within the game.
 * 
 * @class Scene_Base
 * @constructor 
 * @extends Stage
 */
class Scene_Base extends Stage{
  /**-------------------------------------------------------------------------
   * @constructor
   * @memberof Scene_Base
   */
  constructor(...args){
    super(...args);
    this.initialize.apply(this, arguments);
  }
  /**-------------------------------------------------------------------------
   * > Object initialization
   * @memberof Scene_Base
   * @property {boolean}     _active      - acitve flag
   * @property {number}      _fadingFlag  - fade type flag
   * @property {number}      _fadingTimer - timer of fade effect
   * @property {PIXI.Sprite} _fadeSprite  - sprite of fade effect
   */
  initialize(){
    this._active  = false;
    this._windows = [];
    this._fadingFlag = 0;
    this._fadingTimer = 0;
    this._fadingSprite = Graphics.fading_sprite;
  }
  /**-------------------------------------------------------------------------
   * > Frame update
   * @memberof Scene_Base
   */
  update(){
    this.updateFading();
    this.updateChildren();
    this.updateAllWindow();
  }
  /*-------------------------------------------------------------------------*/
  updateChildren(){
    this.children.forEach(function(child){
      if(child.update){child.update();}
    })
  }
  /*-------------------------------------------------------------------------*/
  updateAllWindow(){
    this._windows.forEach(function(win){
      win.update();
    })
  }
  /**-------------------------------------------------------------------------
   * @returns {boolean} - whether scene is fading
   */
  isBusy(){
    return this._fadingTimer > 0;
  }
  /*-------------------------------------------------------------------------*/
  preTerminate(){
    debug_log("Scene pre-terminate: " + getClassName(this));
    this.disposeAllWindows();
    this.startFadeOut();
  }
  /*-------------------------------------------------------------------------*/
  terminate(){
    debug_log("Scene terminated: " + getClassName(this));
  }
  /**-------------------------------------------------------------------------
   * > Create the components and add them to the rendering process.
   */
  create(){
    this.createBackground();
  }
  /**-------------------------------------------------------------------------
   * > Remove windows from page
   */
  disposeAllWindows(){
    for(let i=0;i<this._windows.length;++i){
      this.disposeWindowAt(i);
    }
    this._windows = [];
  }
  /**-------------------------------------------------------------------------
   * > Remove a single window
   */
  removeWindow(win){
    this.disposeWindowAt(this._windows.indexOf(win));
  }
  /**-------------------------------------------------------------------------
   * > Dispose window
   */
  disposeWindowAt(index){
    if(index <= -1){
      console.error("Trying to dispose the window not rendered yet")
      return ;
    }
    debug_log("Dispose window: " + getClassName(this._windows[index]));
    this._windows[index].children.forEach(function(bitmap){
      document.body.removeChild(bitmap.canvas);
      bitmap.dispose();
    })
    this._windows[index].clearChildren();
    this._windows.splice(index, 1);
  }
  /**-------------------------------------------------------------------------
   * > Create background
   */
  createBackground(){
    // reserved for inherited class
  }
  /**-------------------------------------------------------------------------
   * @returns {boolean} - whether current scene is active
   */
  isActive(){
    return this._active;
  }
  /*-------------------------------------------------------------------------*/
  start(){
    this._active = true;
    this._fadingSprite = Graphics.fading_sprite;
  }
  /*-------------------------------------------------------------------------*/
  stop(){
    this._active = false;
  }
  /*-------------------------------------------------------------------------*/
  startFadeIn(duration){
    this.addChild(this._fadingSprite);
    this._fadeSign = 1;
    this._fadingTimer = duration || 30;
    this._fadingSprite.alpha = 1;
  }
  /*-------------------------------------------------------------------------*/
  startFadeOut(duration){
    this.addChild(this._fadingSprite);
    this._fadeSign = -1;
    this._fadingTimer = duration || 30;
    this._fadingSprite.alpha = 0;
  }
  /*-------------------------------------------------------------------------*/
  updateFading(){
    if(this._fadingTimer <= 0){return ;}
    let d = this._fadingTimer;
    if(this._fadeSign > 0){
      this._fadingSprite.alpha -= this._fadingSprite.alpha / d;
    }
    else{
      this._fadingSprite.alpha += (1 - this._fadingSprite.alpha) / d;
    }
    this._fadingTimer -= 1;
  }
  /*-------------------------------------------------------------------------*/
  fadeOutAll(){
    var time = this.slowFadeSpeed() / 60;
    Sound.fadeOutBGM(time);
    Sound.fadeOutSE(time);
    this.startFadeOut(this.slowFadeSpeed());
  }
  /**-------------------------------------------------------------------------
   * @returns {number} - frames before fade completed, slower one
   */
  slowFadeSpeed(){
    return this.fadeSpeed() * 2;
  }
  /**-------------------------------------------------------------------------
   * @returns {number} - frames before fade completed
   */
  fadeSpeed(){
    return 24;
  }
  /**-------------------------------------------------------------------------
   * @returns {boolean} - Graphics is loaded and ready
   */
  isReady(){
    return Graphics.isReady();
  }
  /**-------------------------------------------------------------------------
   * > Add window to page view
   */
  addWindow(win){
    if(!this.isActive()){
      console.error("Trying to add window to stopped scene")
      return ;
    }
    if(win.isDisposed()){
      console.error("Try to add disposed window: " + getClassName(win));
      return ;
    }
    this._windows.push(win);
    win.children.forEach(function(bitmap){
      document.body.appendChild(bitmap.canvas)
    })
  }
  /*-------------------------------------------------------------------------*/
} // Scene_Base

/**
 * > The scene that shows the load process
 * 
 * @class Scene_Load
 * @extends Scene_Base
 */
class Scene_Load extends Scene_Base{
  /**-------------------------------------------------------------------------
   * @constructor
   * @memberof Scene_Load
   * @property {boolean} allLoaded - Graphics and Audio are both loaded
   */
  constructor(...args){
    super(...args)
    this.initialize.apply(this, arguments);
    this.allLoaded = false;
  }
  /**-------------------------------------------------------------------------
   * > Object Initializatoin
   * @memberof Scene_Load
   * @property {number} loading_timer - timer record of loading phase
   */
  initialize(){
    super.initialize();
    this.loading_timer = 0;
  }
  /**-------------------------------------------------------------------------
   * > Start processing
   */
  start(){
    super.start();
    this.processLoadingPhase();
  }
  /*-------------------------------------------------------------------------*/
  create(){
    super.create();
    this.createLoadingImage();
    this.createLoadingText();
  }
  /*-------------------------------------------------------------------------*/
  update(){
    super.update();
    this.updateLoading();
  }
  /*-------------------------------------------------------------------------*/
  createLoadingImage(){
    this.loading_sprite = Graphics.addSprite(Graphics.LoadImage);
    this.loading_sprite.x = Graphics.appCenterWidth(this.loading_sprite.width);
    this.loading_sprite.y = Graphics.appCenterHeight(this.loading_sprite.height);
    this.loading_sprite.anchor.set(0.5);
  }
  /*-------------------------------------------------------------------------*/
  createLoadingText(){
    this.load_text = Graphics.addText(Vocab.LoadText);
    let lt = this.load_text, ls = this.loading_sprite;
    let offset = Graphics._spacing;
    lt.x = Graphics.appCenterWidth(lt.width);
    lt.y = Graphics.appCenterHeight(lt.height) + ls.height + offset;
  }
  /*-------------------------------------------------------------------------*/
  reportLoaderProgress(loader, resources){
    let message = 'Graphics Loaded : ' + loader.progress + '%';
    if(resources){message += ', name : ' + resources.name + ', url : ' + resources.url;}
    debug_log(message);
  }
  /*-------------------------------------------------------------------------*/
  updateLoading(){
    this.updateImage();
    this.updateText();
    if(this.allLoaded){
      if(this.loading_timer < 60)this.loading_timer += 1;
      if(this.loading_timer == 60){this.processLoadingComplete();}
    }
  }
  /*-------------------------------------------------------------------------*/
  updateImage(){
    let sprite = SceneManager.scene.loading_sprite;
    if(sprite.scale_flag){
      sprite.scale.x *= 0.98;
      sprite.scale.y *= 0.98;
      if(sprite.scale.x <= 0.5)sprite.scale_flag = false;
    }
    else{
      sprite.scale.x *= 1.02;
      sprite.scale.y *= 1.02;
      if(sprite.scale.x >= 1.5)sprite.scale_flag = true;
    }
  }
  /*-------------------------------------------------------------------------*/
  updateText(){
    let gr = Graphics.isReady(), sr = Sound.isReady();
    let sprite = this.load_text;
    let txt = Vocab.LoadText;
    if(gr && !sr){
      txt = Vocab.LoadTextAudio;
    }
    else if(!gr && sr){
      txt = Vocab.LoadTextGraphics;
    }
    else if(gr && sr){
      txt = Vocab.LoadTextComplete;
      this.allLoaded = true;
    }
    if(sprite.text == txt){return ;}
    sprite.text = txt;
    sprite.x = Graphics.appCenterWidth(sprite.width) - Graphics._spacing * 2;
  }
  /*-------------------------------------------------------------------------*/
  processLoadingPhase(){
    debug_log("Init loading phase");
    Graphics.renderSprite(this.loading_sprite);
    Graphics.renderSprite(this.load_text);
    Graphics.preloadAllAssets(this.reportLoaderProgress, null);
  }
  /*-------------------------------------------------------------------------*/
  processLoadingComplete(){
    debug_log("Loading Complete called");
    this.loading_timer = 0xff;
    GameStarted = true;
    this.preTerminate();
    SceneManager.goto(Scene_Title);
  }
  /*-------------------------------------------------------------------------*/
}
/**
 * > The title scene
 * 
 * @class Scene_Title
 * @extends Scene_Title
 */
class Scene_Title extends Scene_Base{
  /**-------------------------------------------------------------------------
   * @constructor
   * @memberof Scene_Title
   */
  constructor(...args){
    super(...args)
    this.initialize.apply(this, arguments);
  }
  /**-------------------------------------------------------------------------
   * > Object Initializatoin
   * @memberof Scene_Title
   */
  initialize(){
    super.initialize();
  }
  /**-------------------------------------------------------------------------
   * > Start processing
   */
  start(){
    super.start();
    // reserved
  }
  /*-------------------------------------------------------------------------*/
  create(){
    super.create();
    this.createTitleText();
  }
  /*-------------------------------------------------------------------------*/
  update(){
    super.update();
    // reserved
  }
  /*-------------------------------------------------------------------------*/
  createBackground(){
    this.backgroundImage = Graphics.addSprite(Graphics.Background);
    Graphics.renderSprite(this.backgroundImage);
  }
  /*-------------------------------------------------------------------------*/
  createTitleText(){
    let font = Graphics.DefaultFontSetting;
    font.fontSize = 48;
    this.titleText   = Graphics.addText(Vocab.TitleText, null, font);
    this.titleText.x = Graphics.appCenterWidth(this.titleText.width)
    this.titleText.y = Graphics._padding * 2;
    Graphics.renderSprite(this.titleText)
  }
  /*-------------------------------------------------------------------------*/
}