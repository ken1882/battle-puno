/**---------------------------------------------------------------------------
 * > SceneManager:
 *    The static class that manages scene transitions.
 * @namespace
 */
class SceneManager{
  /*-------------------------------------------------------------------------*/
  constructor(){
    throw new Error('This is a static class');
  }
  /*-------------------------------------------------------------------------*/
  static initialize(){
    this._scene             = null;
    this._nextScene         = null;
    this._stack             = [];
    this._stopped           = false;
    this._sceneStarted      = false;
    this._exiting           = false;
    this._previousClass     = null;
    this._backgroundSprite  = null;
    this._focused           = true;

    this.initGraphics();
    this.initSound();
    this.initInput();
  }
  /*-------------------------------------------------------------------------*/
  static updateMain(){
    if(FatelError)return ;
    try{
      Input.update();
      Graphics.update();
      if(!SceneManager.isGameFocused()){
        return SceneManager.unfocusGame();
      }
      SceneManager.focusGame();
      SceneManager.changeScene();
      SceneManager.updateScene();
      SceneManager.renderScene();
    }
    catch(e){
      reportError(e);
    }
  }
  /*-------------------------------------------------------------------------*/
  static isGameFocused(){
    if(!GameStarted)return true;
    if(!document.hasFocus())return false;
    let mouseKeys = [1,2,3];
    for(let i=0;i<mouseKeys.length;++i){
      let key = mouseKeys[i];
      if(Input.isTriggered(key)){
        if(!Input.isTriggerArea(key, Graphics.app)){return false;}
        else{return true;}
      }
    }
    return this._focused;
  }
  /*-------------------------------------------------------------------------*/
  static focusGame(){
    if(SceneManager._focused){return ;}
    debug_log("Focus Game")
    DisablePageScroll();
    SceneManager._focused = true;
    Graphics.onFocus();
    Sound.resumeAll();
    this._scene.resume();
  }
  /*-------------------------------------------------------------------------*/
  static unfocusGame(){
    if(!SceneManager._focused){return ;}
    debug_log("Unfocus Game")
    EnablePageScroll();
    SceneManager._focused = false;
    Sound.pauseAll();
    Graphics.onUnfocus();
    this._scene.pause();
  }
  /*-------------------------------------------------------------------------*/
  static run(){
    try{
      this.initialize();
    }
    catch(e){
      reportError(e);
    }
  }
  /*-------------------------------------------------------------------------*/
  static processFirstScene(){
    try{
      this.goto(this.firstSceneClass);
      this.startNextScene();
    }
    catch(e){
      reportError(e);
    }
  }
  /*-------------------------------------------------------------------------*/
  static get scene(){
    return this._scene;
  }
  /*-------------------------------------------------------------------------*/
  static initGraphics(){
    Graphics.initialize();
  }
  /*-------------------------------------------------------------------------*/
  static initSound(){
    Sound.initialize();
  }
  /*-------------------------------------------------------------------------*/
  static initInput(){
    Input.initialize();
  }
  /*-------------------------------------------------------------------------*/
  static goto(sceneClass, args){
    if(sceneClass){
      this._nextScene = new (sceneClass.bind.apply(sceneClass, args))();
    }
    if(this._scene){
      this._scene.preTerminate();
      this._scene.stop();
    }
  }
  /*-------------------------------------------------------------------------*/
  static push(sceneClass){
    this._stack.push(this._scene.constructor);
    this.goto(sceneClass);
  }
  /*-------------------------------------------------------------------------*/
  static pop(){
    if(this._stack.length > 0){
      this.goto(this._stack.pop());
    }
    else{ this.exit(); }
  }
  /*-------------------------------------------------------------------------*/
  static exit(){
    this.goto(null);
    this._exiting = true;
  }
  /*-------------------------------------------------------------------------*/
  static clearStack(){
    this._stack = [];
  }
  /*-------------------------------------------------------------------------*/
  static stop(){
    this._stopped = true;
  }
  /*-------------------------------------------------------------------------*/
  static prepareNextScene(){
    this._nextScene.prepare.apply(this._nextScene, arguments);
  }
  /*-------------------------------------------------------------------------*/
  static terminate(){
    window.location.reload();
  }
  /*-------------------------------------------------------------------------*/
  static updateScene(){
    if(this._scene){
      if(!this._sceneStarted && this._scene.isReady()) {
        this._scene.start();
        this._sceneStarted = true;
        this.onSceneStart();
      }
      if(this.isCurrentSceneStarted()) {
        this._scene.update();
      }
    }
  }
  /*-------------------------------------------------------------------------*/
  static renderScene(){
    if(this.isCurrentSceneStarted()) {
      Graphics.render(this._scene);
    }
    else if(this._scene) {
      this.onSceneLoading();
    }
  }
  /*-------------------------------------------------------------------------*/
  static onSceneCreate(){
    Graphics.startLoading();
  }
  /*-------------------------------------------------------------------------*/
  static onSceneLoading(){
    Graphics.updateLoading();
  }
  /*-------------------------------------------------------------------------*/
  static onSceneStart(){
    Graphics.endLoading();
  }
  /*-------------------------------------------------------------------------*/
  static isSceneChanging(){
    return this._exiting || !!this._nextScene;
  }
  /*-------------------------------------------------------------------------*/
  static isCurrentSceneBusy(){
    return this._scene && this._scene.isBusy(); 
  }
  /*-------------------------------------------------------------------------*/
  static isCurrentSceneStarted(){
    return this._scene && this._sceneStarted;
  }
  /*-------------------------------------------------------------------------*/
  static isNextScene(sceneClass){
    return this._nextScene && this._nextScene.constructor === sceneClass;
  }
  /*-------------------------------------------------------------------------*/
  static isPreviousScene(sceneClass){
    return this._previousClass === sceneClass;
  }
  /*-------------------------------------------------------------------------*/
  static changeScene(){
    if(!this.isSceneChanging() || this.isCurrentSceneBusy()){return ;}
    if (this._scene) {
      this._scene.terminate();
      Graphics.transition();
      this._previousClass = this._scene.constructor;
    }
    this.startNextScene();
  }
  /*-------------------------------------------------------------------------*/
  static startNextScene(){
    this._scene = this._nextScene;
    debug_log(SplitLine, "Scene changed: " + getClassName(this._scene))
    if (this._scene) {
      this._scene.create();
      this._nextScene = null;
      this._sceneStarted = false;
      this.onSceneCreate();
    }
    if (this._exiting) {
      this.terminate();
    }
  }
  /*-------------------------------------------------------------------------*/
}
/**---------------------------------------------------------------------------
 * > DataManager:
 *    The static class that manages data and settings.
 * @namespace
 */
class DataManager{
  /*-------------------------------------------------------------------------*/
  constructor(){
    throw new Error("This is a static class")
  }
  /**-------------------------------------------------------------------------
   * @property {object} setting - the system settings
   */
  static initialize(){
    this.setting  = {}
    this.database = window.localStorage;
    this.ready    = false;
    this.setupSettingKeys();
    this.loadDatabase();
    this.loadLanguageSetting();
    this.loadLanguageFont();
    this.ready    = true;
  }
  /*-------------------------------------------------------------------------*/
  static setupSettingKeys(){
    this.DefaultLanguage = "en_us"
    this.kLanguage = "language";
  }
  /*-------------------------------------------------------------------------*/
  static loadDatabase(){
    for(let i=0;i<this.database.length;++i){
      let k = this.database.key(i);
      this.setting[k] = this.database.getItem(k);
    }
  }
  /*-------------------------------------------------------------------------*/
  static loadLanguageSetting(){
    let lan = this.setting[this.kLanguage];
    if(!lan){lan = this.DefaultLanguage;}
    this.changeSetting(this.kLanguage, lan);
  }
  /*-------------------------------------------------------------------------*/
  static loadLanguageFont(){
    if(Graphics.LanguageFontMap[this.language]){
      Graphics.DefaultFontSetting = Graphics.LanguageFontMap[this.language];
    }
  }
  /*-------------------------------------------------------------------------*/
  static changeSetting(key, value){
    this.setting[key] = value;
    this.database.setItem(key, value);
  }
  /*-------------------------------------------------------------------------*/
  static isReady(){
    return Vocab.isReady() && this.ready;
  }
  /*-------------------------------------------------------------------------*/
  static getSetting(key){
    return this.setting[key];
  }
  /**-------------------------------------------------------------------------
   * > Getter functions
   */
  static get language(){return this.setting[this.kLanguage];}
  /*-------------------------------------------------------------------------*/
}