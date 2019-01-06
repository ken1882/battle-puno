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
    if(DebugMode){this.alwaysFocus();}
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
      EventManager.update();
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
    EventManager.initialize();
  }
  /*-------------------------------------------------------------------------*/
  static goto(sceneClass, args){
    if(sceneClass){
      this._nextScene = new (sceneClass.bind.apply(sceneClass, args))();
      this.prepareNextScene(args);
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
    this.loadDebugOption();
    this.ready    = true;
  }
  /*-------------------------------------------------------------------------*/
  static setupSettingKeys(){
    this.DefaultLanguage = "en_us"
    this.DefaultVolume   = [0.5, 1, 1]
    this.kLanguage       = "language";
    this.kVolume         = "volume";
    this.kAudioEnable    = "audioEnable";
    this.kDebug          = "debug"
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
  static loadDebugOption(){
    let dbg = this.debugOption;
    if(!dbg){
      dbg = {
        "log": true,
        "showHand": false
      }
      this.changeSetting(this.kDebug, dbg);
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
  /*-------------------------------------------------------------------------*/
  static changeDebugOption(key, value){
    let dbg = this.debugOption;
    dbg[key] = value;
    this.changeSetting(this.kDebug, dbg);
  }
  /**-------------------------------------------------------------------------
   * > Getter functions
   */
  static get language(){return this.setting[this.kLanguage];}
  static get volume(){return this.setting[this.kVolume];}
  static get audioEnable(){return this.setting[this.kAudioEnable];}
  static get debugOption(){return this.setting[this.kDebug];}
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
    this.importModules();
    this.initGameKeys();
    this.loadGameSettings();
  }
/*-------------------------------------------------------------------------*/
  static importModules(){
    
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
    return this.game;
  }
  /**-------------------------------------------------------------------------
   * Get the effect ID after card played
   * @param {Number} ext - extra information
   */
  static interpretCardAbility(card, ext){
    if(ext == -1){return [];}
    switch(card.value){
      case Value.DRAW_TWO:
        return [Effect.DRAW_TWO];
      // ext=0: normal;  ext=1: reactive;
      case Value.SKIP:
        return !ext ? [Effect.SKIP] : [Effect.SKIP_PENALTY];
      // ext=0: normal;  ext=1: reactive;
      case Value.REVERSE:
        return !ext ? [Effect.REVERSE] : [Effect.REVERSE_PENALTY];
      // ext=0: reset;  ext=1: +10;
      case Value.ZERO:
        return !ext ? [Effect.CLEAR_DAMAGE] : [Effect.ADD_DAMAGE];
      case Value.WILD:
        return [Effect.CHOOSE_COLOR];
      case Value.WILD_DRAW_FOUR:
        return [Effect.CHOOSE_COLOR, Effect.DRAW_FOUR];
      case Value.WILD_HIT_ALL:
        return [Effect.CHOOSE_COLOR, Effect.HIT_ALL];
      case Value.WILD_CHAOS:
        return [Effect.WILD_CHAOS]
      case Value.TRADE:
        return [Effect.CHOOSE_COLOR, Effect.TRADE];
      case Value.DISCARD_ALL:
        return [Effect.CHOOSE_COLOR, Effect.DISCARD_ALL];
      default:
        return [Effect.ADD_DAMAGE];
    }
  }
  /**-------------------------------------------------------------------------
   * Fired when a card is played onto table
   * @param {Number} player_id - the player id, 0 is the user, -1 is the beginning card
   * @param {Number} card_instance - the card object
   * @param {Number} ext - The extra information value, as following list:
   * -1:
   *  This card has no any effect (discarded by discard-all)
   * Value.SKIP:
   *  0: Normal use, 1: Reactive use;
   * Value.REVERSE:
   *  0: Normal use, 1: Reactive use;
   * Value.ZERO: (Does not effect in traditional mode)
   *  0: Clear damage, 1: +10 damage;
   * Value.WILD:
   * Value.WILD_DRAW_FOUR:
   * Value.WILD_HIT_ALL:
   * Value.DISCARD_ALL:
   *  ext = <Color Value>;
   * Value.TRADE:
   *  ext = Array.<Color Value, Player id that traded with>;
   * Value.WILD_CHAOS:
   *  ext = Array.<Color Value, Number Value>;
   */
  static onCardPlay(player_id, card_instance, ext = null){
    let effects = this.interpretCardAbility(card_instance, ext);
    SceneManager.scene.onCardPlay(player_id, card_instance, effects, ext);
  }
  /**-------------------------------------------------------------------------
   * Fired when a player draws card(s)
   * @param {Number} player_id - The player id
   * @param {Array.<Card>} cards - The cards newly drew
   * @param {Boolean} show     - Show the card to everyone or not
   */
  static onCardDraw(player_id, cards, show = false){
    if(cards.length < 1){return false;}
    SceneManager.scene.onCardDraw(player_id, cards, show);
    return true;
  }
  /**-------------------------------------------------------------------------
   * Fired when a user's turn begins
   */
  static onUserTurnBegin(player_id){
    debug_log(`User ${player_id} turn start`)
    SceneManager.scene.processUserTurn(player_id);
    this._inTurn = true;
  }
  /**-------------------------------------------------------------------------
   * Fired when other player/NPC's turn begins
   * @param {Number} player_id - the player's id
   */
  static onNPCTurnBegin(player_id){
    debug_log(`CPU ${player_id} turn start`)
    SceneManager.scene.processNPCTurn(player_id);
    this._inTurn = true;
  }
  /*-------------------------------------------------------------------------*/
  static onTurnEnd(player_id){
    this._inTurn = false;
    if(player_id == 0){
      SceneManager.scene.processUserTurnEnd();
    }
  }
  /*-------------------------------------------------------------------------*/
  static changeColor(color_id){
    if(color_id == Color.WILD){
      throw new Error("Color Id should not be zero!")
    }
    SceneManager.scene.applyColorChangeEffect(color_id);
  }
  /*-------------------------------------------------------------------------*/
  static isCardPlayable(card){
    return card && this.game.isCardPlayable(card);
  }
  /*-------------------------------------------------------------------------*/
  static isInTurn(){
    return this._inTurn || false;
  }
  /*-------------------------------------------------------------------------*/
  static isSceneBusy(){
    if(isClassOf(SceneManager.scene, Scene_Game)){
      return SceneManager.scene.isBusy();
    }
    return false;
  }
  /*-------------------------------------------------------------------------*/
  static onGameStart(){
    SceneManager.scene.processGameStart();
  }
  /*-------------------------------------------------------------------------*/
  static onRoundStart(){
    SceneManager.scene.processRoundStart();
  }
  /*-------------------------------------------------------------------------*/
  static processGameOver(){
    SceneManager.scene.processGameOver();
  }
  /*-------------------------------------------------------------------------*/
  static processRoundOver(){
    SceneManager.scene.processRoundOver();
  }
  /*-------------------------------------------------------------------------*/
  static getCardDrawNumber(){
    let pcard = this.game.penaltyCard;
    if(!pcard){return 1;}
    switch(pcard.value){
      case Value.DRAW_TWO:
        return 2;
      case Value.WILD_DRAW_FOUR:
        return 4;
      default:
        throw new Error("Unknown penalty card: " + pcard);
    }
  }
  /*-------------------------------------------------------------------------*/
  static quickWin(pid){
    if(!DebugMode){return ;}
    let cards = this.game.players[pid].hand;
    while(cards.length > 0){
      this.forcePlayCard(pid, cards[0]);
    }
    if(pid == 0){
      EventManager.setTimeout(()=>{
        SceneManager.scene.processUserTurnEnd();
      }, 60);
    }
  }
  /*-------------------------------------------------------------------------*/
  static forcePlayCard(pid, card){
    console.log("Force play: " + pid + card);
    let cardIndex = this.game.players[pid].hand.indexOf(card);
    this.game.discardPile.push(card);
    this.game.players[pid].discard(cardIndex);
    GameManager.onCardPlay(pid, card, -1);
  }
  /*-------------------------------------------------------------------------*/
}
/**-------------------------------------------------------------------------
 * A class that manages scheduled functions/events
 * @namespace
 */
class EventManager{
  /*-------------------------------------------------------------------------*/
  constructor(){
    throw new Error("This is a static class")
  }
  /*-------------------------------------------------------------------------*/
  static initialize(){
    this.container   = [];
    this.event_timer = [];
    this.indexMap    = [];
    this.symbolMap   = {};
  }
  /*-------------------------------------------------------------------------*/
  static update(){
    for(let i in this.container){
      i = parseInt(i);
      this.event_timer[i] -= 1;
      if(this.event_timer[i] <= 0){
        this.executeEvent(this.container[i]);
        this.unregisterEventByIndex(i);
      }
    }
  }/*-------------------------------------------------------------------------*/
  /**
   * Works just like window.setTimeout about the timer is in frame and called
   * via the frame updates.
   * @param {Function} func - The function to be fired 
   * @param {Number} timer  - Frames to wait before fire the function
   * @param {String} symbol - Symbol of this event
   */
  static setTimeout(func, timer, symbol=null){
    if(symbol){
      if(!this.symbolMap[symbol]){
        this.symbolMap[symbol] = this.container.length;
        this.indexMap[this.container.length] = symbol;
      }
      else{
        console.error("Duplicated event symbol: " + symbol);
        console.error("And it will be ignored");
      }
    }
    this.container.push(func);
    this.event_timer.push(timer || 0);
  }
  /*-------------------------------------------------------------------------*/
  static executeEvent(eve){
    eve();
  }
  /*-------------------------------------------------------------------------*/
  static unregisterEventByIndex(idx){
    this.container.splice(idx, 1);
    this.event_timer.splice(idx, 1);
    let sym = this.indexMap[idx];
    if(sym){
      this.symbolMap[sym] = null;
      this.indexMap.splice(idx, 1);
    }
  }
  /*-------------------------------------------------------------------------*/
  static unregisterEventBySymbol(sym){
    if(!this.symbolMap[sym]){
      return console.error("Symbol not found: " + sym);
    }
    this.unregisterEventByIndex(this.symbolMap[sym]);
  }
  /*-------------------------------------------------------------------------*/
}