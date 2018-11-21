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
    this._active = false;
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
  }
  /*-------------------------------------------------------------------------*/
  updateChildren(){
    this.children.forEach(function(child){
      if(child.update){child.update();}
    })
  }
  /**-------------------------------------------------------------------------
   * @returns {boolean} - whether scene is fading
   */
  isBusy(){
    return this._fadingTimer > 0;
  }
  /*-------------------------------------------------------------------------*/
  terminate(){
    // reserved
  }
  /**-------------------------------------------------------------------------
   * > Create the components and add them to the rendering process.
   */
  create(){
    // reserved
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
    this._fadeSprite = Graphics.fading_sprite;
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
    this._fadeSprite.opacity = 255; 
  }
  /*-------------------------------------------------------------------------*/
  startFadeOut(duration){
    this.addChild(this._fadingSprite);
    this._fadeSign = -1;
    this._fadingTimer = duration || 30;
    this._fadeSprite.opacity = 0;
  }
  /*-------------------------------------------------------------------------*/
  updateFading(){
    if(this._fadingTimer <= 0){return ;}
    let d = this._fadingTimer;
    if(this._fadeSign > 0){
      this._fadeSprite.opacity -= this._fadeSprite.opacity / d;
    }
    else{
      this._fadeSprite.opacity += (255 - this._fadeSprite.opacity) / d;
    }
    this._fadingTimer -= 1;
  }
  /*-------------------------------------------------------------------------*/
  fadeOutAll(){
    var time = this.slowFadeSpeed() / 60;
    Audio.fadeOutBGM(time);
    Audio.fadeOutSE(time);
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
   */
  constructor(...args){
    super(...args)
    this.initialize.apply(this, arguments);
  }
  /**-------------------------------------------------------------------------
   * > Object Initializatoin
   * @memberof Scene_Load
   * @property {number} loading_timer - timer record of loading phase
   */
  initialize(){
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
  createLoadingImage(){
    this.loading_sprite = Graphics.addSprite(Graphics.LoadImage);
    this.loading_sprite.x = Graphics.appCenterWidth(this.loading_sprite.width);
    this.loading_sprite.y = Graphics.appCenterHeight(this.loading_sprite.height);
    this.loading_sprite.anchor.set(0.5);
  }
  /*-------------------------------------------------------------------------*/
  createLoadingText(){
    this.load_text = Graphics.addText(Vocab.dict.LoadText);
    let lt = this.load_text, ls = this.loading_sprite;
    let offset = Graphics._padding / 8;
    lt.x = Graphics.appCenterWidth(lt.width) - offset;
    lt.y = Graphics.appCenterHeight(lt.height) + ls.height + offset;
  }
  /*-------------------------------------------------------------------------*/
  updateLoading(loader, resources){
    SceneManager.scene.loading_timer += 1;
    
    let message = 'Loaded : ' + loader.progress + '%';
    if(resources){message += ', name : ' + resources.name + ', url : ' + resources.url;}
    debug_log(message);

    let sprite = SceneManager.scene.loading_sprite;
    if(sprite.scale_flag){
      sprite.scale.x *= 0.95;
      sprite.scale.y *= 0.95;
      if(sprite.scale.x <= 0.5)sprite.scale_flag = false;
    }
    else{
      sprite.scale.x *= 1.05;
      sprite.scale.y *= 1.05;
      if(sprite.scale.x >= 1.5)sprite.scale_flag = true;
    }
  }
  /*-------------------------------------------------------------------------*/
  processLoadingPhase(){
    debug_log("Init loading phase");
    Graphics.renderSprite(this.loading_sprite);
    Graphics.renderSprite(this.load_text);
    Graphics.preloadAllAssets(this.updateLoading, this.processLoadingComplete);
  }
  /*-------------------------------------------------------------------------*/
  processLoadingComplete(){
    let sprite = SceneManager.scene.load_text;
    sprite.text = "Load completed!"
    sprite.x = Graphics.appCenterWidth(sprite.width) - (Graphics._padding / 4)
  }
  /*-------------------------------------------------------------------------*/
}
