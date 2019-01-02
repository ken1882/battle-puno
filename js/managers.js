import PunoGame from "../src/game";
import Effect from "../src/effect";
import Value from "../src/card/value";
import Color from "../src/card/color";

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

    this.initModules();
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
    if(!GameStarted || this._alwaysFocus)return true;
    if(!document.hasFocus())return false;
    let mouseKeys = [1,2,3];
    for(let i=0;i<mouseKeys.length;++i){
      let key = mouseKeys[i];
      if(Input.isTriggered(key)){
        switch(key){
          case 1:
            return Input.isPointerInside;
          case 2:
          case 3:
            return false;
        }
      }
    }
    return this._focused;
  }
  /*-------------------------------------------------------------------------*/
  static alwaysFocus(){this._alwaysFocus = true;}
  static autoFocus(){this._alwaysFocus = false;}
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
  static initModules(){
    Graphics.initialize();
    Sound.initialize();
    Input.initialize();
    GameManager.initialize();
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
 * @property {object} database - The Local Storage
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
    this.loadVolumeSetting();
    this.loadAudioEnable();
    this.ready    = true;
  }
  /*-------------------------------------------------------------------------*/
  static setupSettingKeys(){
    this.DefaultLanguage = "en_us"
    this.DefaultVolume   = [0.5, 1, 1]
    this.kLanguage       = "language";
    this.kVolume         = "volume";
    this.kAudioEnable    = "audioEnable";
  }
  /*-------------------------------------------------------------------------*/
  static loadDatabase(){
    for(let i=0;i<this.database.length;++i){
      let k = this.database.key(i);
      this.setting[k] = null;
      try{
        this.setting[k] = JSON.parse(this.database.getItem(k));
      }
      catch(e){
        console.error("Invalid database item: " + k + ": " + this.database.getItem(k))
      }
    }
  }
  /*-------------------------------------------------------------------------*/
  static loadLanguageSetting(){
    let lan = this.language;
    if(!lan){lan = this.DefaultLanguage;}
    this.changeSetting(this.kLanguage, lan);
  }
  /*-------------------------------------------------------------------------*/
  static loadVolumeSetting(){
    let check = function(n){return 0 <= n && n <= 1;}
    if(validArgCount.apply(window, this.volume) != 3){
      this.changeSetting(this.kVolume, this.DefaultVolume);
    }
    else if(validNumericCount.apply(this, [check, this.volume].flat()) != 3){
      this.changeSetting(this.kVolume, this.DefaultVolume);
    }
  }
  /*-------------------------------------------------------------------------*/
  static loadLanguageFont(){
    if(Graphics.LanguageFontMap[this.language]){
      Graphics.DefaultFontSetting = Graphics.LanguageFontMap[this.language];
    }
  }
  /*-------------------------------------------------------------------------*/
  static loadAudioEnable(){
    let en = this.audioEnable
    if(!isClassOf(en, Array) || en.length != 2){
      this.changeSetting(this.kAudioEnable, [true, true]);
    }
  }
  /*-------------------------------------------------------------------------*/
  static changeSetting(key, value){
    this.setting[key] = value;
    this.database.setItem(key, JSON.stringify(value));
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
  static get volume(){return this.setting[this.kVolume];}
  static get audioEnable(){return this.setting[this.kAudioEnable];}
  /*-------------------------------------------------------------------------*/
}
/**---------------------------------------------------------------------------
 * > GameManager:
 *    The static class that manage the game information
 * @namespace
 * @property {Array.[Number,Number]} initCardPeak - the min/max value of initial
 *                                                  card number in hand
 * @property {Array.[Number,Number]} initHPPeak - the min/max value of initial hitpoint
 * @property {Array.[Number,Number]} scoreGoalPeak - the min/max value of score needed
 *                                                   to end the game
 * @property {Number} initCardNumber - Initial card number in hand
 * @property {Number} initHP - Initial hitpoint
 * @property {Number} scoreGoal - Score needed to end the game
 * @property {Boolean} extraCardDisabled - Whether not using extra black cards
 * 
 * @property {object} game - The PunoGame instance
 */
class GameManager{
  /*-------------------------------------------------------------------------*/
  constructor(){
    throw new Error('This is a static class');
  }
  /*-------------------------------------------------------------------------*/
  static initialize(){
    this._mode = null;
    this.initCardPeak   = [4, 10];
    this.initCardNumber = 7;
    this.initHPPeak     = [50, 1000];
    this.initHP         = 200;
    this.scoreGoalPeak  = [100, 5000];
    this.scoreGoal      = 500;
    this.extraCardDisabled = false;
    this.playerNumber   = 4;
    this.gameMode       = 0;
    this.initGameKeys();
    this.loadGameSettings();
  }
  /*-------------------------------------------------------------------------*/
  static initGameKeys(){
    this.kInitCardNumber = 'initCardNumber';
    this.kInitHP = 'iniHP';
    this.kExtraCardDisabled = 'extraCardDisabled';
    this.kScoreGoal = 'scoreGoal';
  }
  /**-------------------------------------------------------------------------
   * Load game setting from database
   */
  static loadGameSettings(){ 
    let keys = [this.kInitCardNumber, this.kInitHP, this.kScoreGoal, this.kExtraCardDisabled];
    for(let i=0;i<keys.length;++i){
      let k = keys[i];
      let ok = this.changeGameSetting(k, DataManager.getSetting(k));
      if(!ok){
        let v = null;
        if(k == this.kInitCardNumber){v = this.initCardNumber;}
        else if(k == this.kInitHP){v = this.initHP;}
        else if(k == this.kScoreGoal){v = this.scoreGoal;}
        else if(k == this.kExtraCardDisabled){v = this.extraCardDisabled;}
        DataManager.changeSetting(k, v);
      }
    }
  }
  /*-------------------------------------------------------------------------*/
  static changeGameSetting(k, v){
    let ok = false;
    if(k == this.kInitCardNumber){
      if(this.isCardNumberValid(v)){this.initCardNumber = v; ok = true;}
    }
    else if(k == this.kInitHP){
      if(this.isHPValid(v)){this.initHP = v; ok = true;}
    }
    else if(k == this.kScoreGoal){
      if(this.isScoreGoalValid(v)){this.scoreGoal = v; ok = true;}
    }
    else if(k == this.kExtraCardDisabled){
      ok = true;
      v = !!(v);
      this.extraCardDisabled = v;
    }

    if(ok){
      DataManager.changeSetting(k, v);
    }

    return ok;
  }
  /*-------------------------------------------------------------------------*/
  static isCardNumberValid(n){
    let h = function(n){
      return n.between(this.initCardPeak[0], this.initCardPeak[1], false)
    }.bind(this);
    return validNumericCount(h, n) == 1;
  }
  /*-------------------------------------------------------------------------*/
  static isHPValid(n){
    let h = function(n){
      return n.between(this.initHPPeak[0], this.initHPPeak[1], false)
    }.bind(this);
    return validNumericCount(h, n) == 1;
  }
  /*-------------------------------------------------------------------------*/
  static isScoreGoalValid(n){
    let h = function(n){
      return n.between(this.scoreGoalPeak[0], this.scoreGoalPeak[1], false)
    }.bind(this);
    return validNumericCount(h, n) == 1;
  }
  /*-------------------------------------------------------------------------*/
  static getCardImageById(cid){
    let color = '', id = '';
    
    return color + id + '.png';
  }
  /*-------------------------------------------------------------------------*/
  static get extraCardEnabled(){return !this.extraCardDisabled;}
  /*-------------------------------------------------------------------------*/
  static changeGameMode(gm){
    this.gameMode = gm;
  }
  /**-------------------------------------------------------------------------
   * Initialize game stage
   */
  static initStage(){
    this.game = new PunoGame(this.initCardNumber, this.initHP, this.scoreGoal, 
                             this.extraCardDisabled, this.gameMode);
  }
  /**-------------------------------------------------------------------------
   * Get the effect ID after card played
   */
  static interpretCardAbility(card, ext){
    switch(card.value){
      case Value.DRAW_TWO:
        return [Effect.DRAW_TWO];
      // ext=0: normal;  ext=1: reactive;
      case Value.SKIP:
        return ext ? [Effect.SKIP] : [Effect.SKIP_PENALTY];
      // ext=0: normal;  ext=1: reactive;
      case Value.REVERSE:
        return ext ? [Effect.REVERSE] : [Effect.REVERSE_PENALTY];
      // ext=0: reset;  ext=1: +10;
      case Value.ZERO:
        return ext ? [Effect.CLEAR_DAMAGE] : [Effect.ADD_DAMAGE];
      case Value.WILD:
        return [Effect.CHOOSE_COLOR];
      case Value.WILD_DRAW_FOUR:
        return [Effect.CHOOSE_COLOR, Effect.DRAW_FOUR];
      case Value.WILD_HIT_ALL:
        return [Effect.CHOOSE_COLOR, Effect.HIT_ALL];
      case Value.WILD_CHAOS:
        return [Effect.WILD_CHAOS]
      case Value.TRADE:
        return [Effect.TRADE];
      case Value.DISCARD_ALL:
        return [Effect.DISCARD_ALL];
      default:
        return [Effect.ADD_DAMAGE];
    }
  }
  /**-------------------------------------------------------------------------
   * Fired when a card is played onto table
   * @param {Number} player_id - the player id, 0 is the user
   * @param {Number} hand_index - the index of card gonna be played in the hand
   * @param {Number} ext - The extra information value
   */
  static onCardPlay(player_id, hand_index, ext = null){
    let card_instance = this.game.players[player_id].hand[hand_index];
    effects = this.interpretCardAbility(card_instance, ext);
    effects.forEach(effect_id => {
      if(effect_id === Effect.CHOOSE_COLOR){this.changeColor(ext)}
      else{
        // Reserved
      }
    });
  }
  /*-------------------------------------------------------------------------*/
  static changeColor(color_id){
    if(color_id == Color.WILD){
      throw new Error("Color Id should not be zero!")
    }
    else if(color_id == Color.RED){
      // Reserved
    }
    else if(color_id == Color.YELLOW){
      // Reserved
    }
    else if(color_id == Color.GREEN){
      // Reserved
    }
    else if(color_id == Color.BLUE){
      // Reserved
    }
  }
  /*-------------------------------------------------------------------------*/
}