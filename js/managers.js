//-----------------------------------------------------------------------------
// SceneManager
//
// The static class that manages scene transitions.

class SceneManager{
  /*-------------------------------------------------------------------------*/
  constructor(){
    throw new Error('This is a static class');
  }
  /*-------------------------------------------------------------------------*/
  static initialize(){
    SceneManager._scene             = null;
    SceneManager._nextScene         = null;
    SceneManager._stack             = [];
    SceneManager._stopped           = false;
    SceneManager._sceneStarted      = false;
    SceneManager._exiting           = false;
    SceneManager._previousClass     = null;
    SceneManager._backgroundSprite  = null;
    this.initGraphics();
    this.initAudio();
    this.initInput();
  }
  /*-------------------------------------------------------------------------*/
  static updateMain(){
    if(!document.hasFocus()){return ;}
    Input.update();
    Graphics.update();
    SceneManager.changeScene();
    SceneManager.updateScene();
    SceneManager.renderScene();
  }
  /*-------------------------------------------------------------------------*/
  static run(){
    try {
      this.initialize();
    } catch (e) {
      this.catchException(e);
    }
  }
  /*-------------------------------------------------------------------------*/
  static processFirstScene(){
    try {
      this.goto(this.firstSceneClass);
      this.startNextScene();
    } catch (e) {
      this.catchException(e);
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
  static initAudio(){
    Audio.initialize();
  }
  /*-------------------------------------------------------------------------*/
  static initInput(){
    Input.initialize();
  }
  /*-------------------------------------------------------------------------*/
  static goto(sceneClass, args){
    if (sceneClass) {
      this._nextScene = new (sceneClass.bind.apply(sceneClass, args))();
    }
    if (this._scene) {
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
  static catchException(e){
    if(e instanceof Error){
      console.error(e.name + ':', e.message);
      console.error(e.stack);
    } else {
      console.log('UnknownError', e);
    }
    Audio.stopAll();
    this.stop();
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
      this._previousClass = this._scene.constructor;
    }
    this.startNextScene();
  }
  /*-------------------------------------------------------------------------*/
  static startNextScene(){
    this._scene = this._nextScene;
    debug_log("Scene changed: " + getClassName(this._scene))
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