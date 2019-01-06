/**
 * The Superclass of all scene within the game.
 * 
 * @class Scene_Base
 * @constructor 
 * @extends Stage
 * @property {boolean} _active      - acitve flag
 * @property {number}  _fadingFlag  - fade type flag
 * @property {number}  _fadingTimer - timer of fade effect
 * @property {Sprite}  _fadeSprite  - sprite of fade effect
 */
class Scene_Base extends Stage{
  /**-------------------------------------------------------------------------
   * @constructor
   * @memberof Scene_Base
   */
  constructor(){
    super();
    this._active  = false;
    this._windows = [];
    this._fadingFlag = 0;
    this._fadingTimer = 0;
    this.fadeDuration = 30;
    this._buttonCooldown = new Array(0xff);
    this._fadingSprite = Graphics.fadingSprite;
    this._terminating  = false;
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
      if(child.update){
        if(this._terminating && child.isWindow){return ;}
        if(!this.overlay || !child.isWindow || child === this.overlay){
          child.update();
        }
      }
    }.bind(this))
  }
  /*------------------------------------------------------------------------*/
  sortChildren(){
    this.children.sort((a,b) => (a.zIndex || 0) - (b.zIndex || 0));
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
    this._terminating = true;
    Sound.fadeOutAll();
    this.startFadeOut();
    this.deactivateChildren();
  }
  /*-------------------------------------------------------------------------*/
  terminate(){
    debug_log("Scene terminated: " + getClassName(this));
    this.disposeAllWindows();
  }
  /**-------------------------------------------------------------------------
   * > Create the components and add them to the rendering process.
   */
  create(){
    this.createBackground();
  }
  /**-------------------------------------------------------------------------
   * Deactivate all sprites to prevent interaction during terminating
   */
  deactivateChildren(){
    this.children.forEach(function(sp){
      sp.deactivate();
    })
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
    if(Graphics.globalWindows.indexOf(this._windows[index]) == -1){
      this._windows[index].clear(true)
    }else{this._windows[index].hide()}
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
    this._fadingSprite = Graphics.fadingSprite;
    if(DebugMode){this.addChild(Graphics.FPSSprite)}
    this.renderGlobalSprites();
    this.renderGlobalWindows();
  }
  /*-------------------------------------------------------------------------*/
  stop(){
    this._active = false;
  }
  /*-------------------------------------------------------------------------*/
  renderGlobalSprites(){
    Graphics.globalSprites.forEach(function(sp){
      Graphics.renderSprite(sp);
      if(sp.defaultActiveState){sp.activate(); sp.show();}
    });
  }
  /*-------------------------------------------------------------------------*/
  renderGlobalWindows(){
    Graphics.globalWindows.forEach(function(win){
      Graphics.renderWindow(win);
      if(win.defaultActiveState){win.activate(); win.show();}
    });
  }
  /*-------------------------------------------------------------------------*/
  startFadeIn(duration = this.fadeDuration){
    Graphics.renderSprite(Graphics.fadingSprite);
    this._fadingSprite.show();
    this._fadeSign = 1;
    this._fadingTimer = duration;
    this._fadingSprite.setOpacity(1);
  }
  /*-------------------------------------------------------------------------*/
  startFadeOut(duration = this.fadeDuration){
    Graphics.renderSprite(Graphics.fadingSprite);
    this._fadingSprite.show();
    this._fadeSign = -1;
    this._fadingTimer = duration;
    this._fadingSprite.setOpacity(0);
  }
  /*-------------------------------------------------------------------------*/
  updateFading(){
    if(this._fadingTimer <= 0){return ;}
    let d = this._fadingTimer;
    let opa = this._fadingSprite.opacity;
    if(this._fadeSign > 0){
      this._fadingSprite.setOpacity(opa - opa / d)
    }
    else{
      this._fadingSprite.setOpacity(opa + (1 - opa) / d)
    }
    this._fadingTimer -= 1;
    if(this._fadingTimer <= 0){this.onFadeComplete();}
  }
  /**-------------------------------------------------------------------------
   * > Fade out screen and sound
   */
  fadeOutAll(){
    var time = this.slowFadeSpeed() / 60;
    Sound.fadeOutBGM(time);
    Sound.fadeOutSE(time);
    this.startFadeOut(this.slowFadeSpeed());
  }
  /*-------------------------------------------------------------------------*/
  onFadeComplete(){
    this._fadingFlag  = 0;
    this._fadingTimer = 0;
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
   * @param {Window_Base} win - the window class
   */
  addWindow(win, forced = false){
    if(!this.isActive() && !forced){
      console.error("Trying to add window to stopped scene")
      return ;
    }
    if(win.isDisposed()){
      console.error("Try to add disposed window: " + getClassName(win));
      return ;
    }
    this._windows.push(win);
    this.addChild(win);
  }
  /**-------------------------------------------------------------------------
   * > Pause animate sprites
   */
  pause(){
    this.children.forEach(function(sp){
      Graphics.pauseAnimatedSprite(sp);
      if(sp.isActive()){sp.lastActiveState = sp.isActive();}
      sp.deactivate();
    })
  }
  /**-------------------------------------------------------------------------
   * > Resume paused animate sprites
   */
  resume(){
    this.children.forEach(function(sp){
      Graphics.resumeAnimatedSprite(sp);
      if(sp.lastActiveState){
        sp.activate();
      }
    })
  }
  /*-------------------------------------------------------------------------*/
  heatupButton(kid){
    this._buttonCooldown[kid] = 4;
  }
  /*-------------------------------------------------------------------------*/
  isButtonCooled(kid){
    return (this._buttonCooldown[kid] || 0) == 0;
  }
  /*-------------------------------------------------------------------------*/
  raiseOverlay(ovs, fallback=null){
    if(!ovs){return ;}
    debug_log("Raise overlay: " + getClassName(ovs));
    this.overlay = ovs;
    this.overlay.oriZ = ovs.z;
    this.overlay.setZ(0x111);
    this.overlayFallback = fallback;
    this.children.forEach(function(sp){
      if(sp.alwaysActive){return ;}
      if(sp !== ovs){
        sp.lastActiveState = sp.isActive();
        sp.deactivate();
      }
    })
    Graphics.renderSprite(Graphics.dimSprite);
    ovs.show(); ovs.activate();
  }
  /*-------------------------------------------------------------------------*/
  closeOverlay(){
    if(!this.overlay){return ;}
    debug_log("Close overlay");
    this.overlay.hide(); this.overlay.deactivate();
    this.children.forEach(function(sp){
      if(sp !== this.overlay && sp.lastActiveState){
        sp.activate();
      }
    }.bind(this))
    Graphics.removeSprite(Graphics.dimSprite);
    this.overlay.setZ(this.overlay.oriZ);
    this.overlay = null;
    EventManager.setTimeout(()=>{
      this.overlayFallback();
      this.overlayFallback = null;
    }, 2);
  }
  /*-------------------------------------------------------------------------*/
} // Scene_Base

/**
 * > The scene that shows the load process
 * 
 * @class Scene_Load
 * @extends Scene_Base
 * @property {number} loading_timer - timer record of loading phase
 */
class Scene_Load extends Scene_Base{
  /**-------------------------------------------------------------------------
   * @constructor
   * @memberof Scene_Load
   * @property {boolean} allLoaded - Graphics and Audio are both loaded
   */
  constructor(){
    super()
    this.allLoaded = false;
    this.loading_timer = 0;
  }
  /**-------------------------------------------------------------------------
   * > Start processing
   */
  start(){
    super.start();
    this.processLoadingPhase();
    let bitset = DataManager.getSetting('hideWarning');
    if(validNumericCount(null, bitset) != 1){bitset = 0;}
    let newSetting = 0;

    if(isMobile){
      if(!(bitset & 1)){
        let b = window.confirm(Vocab["MobileWarning"] + '\n' + Vocab["DontShowWarning"])
        newSetting |= (b + 0)
      }else{newSetting |= 1;}
    }

    if(!isChrome && !isFirefox && !isSafari){
      if(!(bitset & 2)){
        let b = window.confirm(Vocab["BrowserWarning"]+ '\n' + Vocab["DontShowWarning"])
        newSetting |= ((b + 0) << 1);
      }else{newSetting |= (1 << 1);}
    }

    if(isFirefox){
      if(!(bitset & 4)){
        let b = window.confirm(Vocab["FirefoxWarning"]+ '\n' + Vocab["DontShowWarning"])
        newSetting |= ((b+0) << 2);
      }else{newSetting |= (1 << 2);}
    }

    DataManager.changeSetting('hideWarning', newSetting);
  }
  /**-------------------------------------------------------------------------
   * @returns {boolean}
   */
  isReady(){
    return Graphics._loaderReady;
  }
  /*-------------------------------------------------------------------------*/
  create(){
    super.create();
    this.createLoadingImage();
    this.createLoadingText();
    this.createProgressBar();
  }
  /*-------------------------------------------------------------------------*/
  update(){
    super.update();
    this.updateLoading();
    this.updateButtonCooldown();
    this.updateProgressBar();
  }
  /*-------------------------------------------------------------------------*/
  createProgressBar(){
    let dw = Graphics.width * 0.3;
    let dh = 24;
    let dx = Graphics.appCenterWidth(dw), dy = this.load_text.y + 36;
    this.bar = new Sprite_ProgressBar(dx, dy, dw, dh);
    this.bar.setMaxProgress(Graphics.getLoadingProgress[1] + Sound.getLoadingProgress[1]);
  }
  /*-------------------------------------------------------------------------*/
  createLoadingImage(){
    this.loading_sprite = Graphics.addSprite(Graphics.LoadImage);
    let sx = Graphics.appCenterWidth(this.loading_sprite.width);;
    let sy = Graphics.appCenterHeight(this.loading_sprite.height);
    this.loading_sprite.setPOS(sx, sy);
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
    Graphics._loadProgress += 1;
    let message = 'Graphics Loaded : ' + loader.progress + '%';
    if(resources){message += ', name : ' + resources.name + ', url : ' + resources.url;}
    debug_log(message);
  }
  /*-------------------------------------------------------------------------*/
  updateButtonCooldown(){
    for(let i=0;i<0xff;++i){
      if((this._buttonCooldown[i] || 0) > 0){
        this._buttonCooldown[i] -= 1;
      }
    }
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
  updateProgressBar(){
    this.bar.setProgress(Graphics.getLoadingProgress[0] + Sound.getLoadingProgress[0]);
  }
  /*-------------------------------------------------------------------------*/
  processLoadingPhase(){
    debug_log("Init loading phase");
    Graphics.renderSprite(this.loading_sprite);
    Graphics.renderSprite(this.load_text);
    Graphics.renderSprite(this.bar);
    Graphics.preloadAllAssets(this.reportLoaderProgress, null);
  }
  /*-------------------------------------------------------------------------*/
  processLoadingComplete(){
    debug_log("Loading Complete called");
    this.loading_timer = 0xff;
    GameStarted = true;
    Sound.playSaveLoad();
    if(TestMode){
      SceneManager.goto(Scene_Test);
    }
    else if(QuickStart){
      SceneManager.goto(Scene_Title);
    }
    else{
      SceneManager.goto(Scene_Intro);
    }
  }
  /*-------------------------------------------------------------------------*/
}
/**---------------------------------------------------------------------------
 * > The intro scene that display the splash image
 * @class Scene_Intro
 * @extends Scene_Base
 */
class Scene_Intro extends Scene_Base{
  /*-------------------------------------------------------------------------*/
  constructor(...args){
    super(...args)
  }
  /*-------------------------------------------------------------------------*/
  create(){
    super.create();
    this.createNTOUSplash();
    this.createPIXISplash();
    this.createHowlerSplash();
  }
  /*-------------------------------------------------------------------------*/
  createBackground(){
    this.backgroundImage = new PIXI.Graphics();
    this.backgroundImage.beginFill(0);
    this.backgroundImage.drawRect(0, 0, Graphics.width, Graphics.height);
    this.backgroundImage.endFill();
    Graphics.renderSprite(this.backgroundImage);
  }
  /*-------------------------------------------------------------------------*/
  start(){
    super.start();
    this.timer        = 0;
    this.fadeDuration = 30;
    this.NTOUmoment   = 150;
    this.ENDmoment    = 500;
    this.drawLibrarySplash();
    Sound.loadStageAudio();
  }
  /*-------------------------------------------------------------------------*/
  update(){
    super.update();
    this.timer += 1;
    this.updateSplashStage();
    this.updateSkip();
    if(this.requestFilterUpdate){
      this.ntouSplash.filters[0].time += 1;
    }
  }
  /*-------------------------------------------------------------------------*/
  updateSplashStage(){
    if(this.timer == this.NTOUmoment){
      this.startFadeOut();
    }
    else if(this.timer == this.NTOUmoment + this.fadeDuration){
      this.startFadeIn();
      this.processNTOUSplash();
    }
    else if(this.timer == this.NTOUmoment + this.fadeDuration + 40){
      Sound.playSE(Sound.Wave);
    }
    else if(this.timer == this.NTOUmoment + this.fadeDuration + 60){
      this.startSplashEffect();
    }
    else if(this.timer == this.ENDmoment){
      this.startFadeOut();
      Sound.fadeOutAll();
      SceneManager.goto(Scene_Title);
    }
  }
  /*-------------------------------------------------------------------------*/
  updateSkip(){
    if(!Input.isTriggered(Input.keymap.kMOUSE1)){return ;}
    this.heatupButton(Input.keymap.kMOUSE1);
    if(this.timer < this.NTOUmoment){
      this.timer = this.NTOUmoment - 1;
    }
    else if(this.timer < this.NTOUmoment + this.fadeDuration){
      this.timer = this.NTOUmoment + this.fadeDuration - 1;
    }
    else if(this.timer < this.ENDmoment){
      this.timer = this.ENDmoment - 1;
    }
  }
  /*-------------------------------------------------------------------------*/
  createPIXISplash(){
    this.pixiSplash = Graphics.addSprite(Graphics.pixiSplash);
    this.pixiSplash.setPOS(Graphics.appCenterWidth(this.pixiSplash.width));
  }
  /*-------------------------------------------------------------------------*/
  createHowlerSplash(){
    this.howlerSplash = Graphics.addSprite(Graphics.howlerSplash);
    this.howlerSplash.setPOS(Graphics.appCenterWidth(this.howlerSplash.width));
  }
  /*-------------------------------------------------------------------------*/
  createNTOUSplash(){
    this.ntouSplash = Graphics.addSprite(Graphics.ntouSplash);
    let dx = Graphics.appCenterWidth(this.ntouSplash.width);
    let dy = Graphics.appCenterHeight(this.ntouSplash.height);
    this.ntouSplash.setPOS(dx, dy);
  }
  /*-------------------------------------------------------------------------*/
  drawLibrarySplash(){
    let totalW  = this.pixiSplash.height + this.howlerSplash.height;
    let padding = Graphics.height - totalW;
    this.pixiSplash.setPOS(null, padding / 3);
    this.howlerSplash.setPOS(null, padding);
    Graphics.renderSprite(this.pixiSplash);
    Graphics.renderSprite(this.howlerSplash);
  }
  /*-------------------------------------------------------------------------*/
  terminate(){
    super.terminate();
    Graphics.createGlobalWindows();
    Graphics.createGlobalSprites();
  }
  /*-------------------------------------------------------------------------*/
  processNTOUSplash(){
    this.ntouSplash.filters = []
    Graphics.removeSprite(this.pixiSplash, this.howlerSplash);
    Graphics.renderSprite(this.ntouSplash);
  }
  /*-------------------------------------------------------------------------*/
  startSplashEffect(){
    let wave = new PIXI.filters.ShockwaveFilter([0.5, 0.5],{
      speed: 5,
      brightness: 8
    });
    this.ntouSplash.filters = [wave];
    this.requestFilterUpdate = true;
  }
  /*-------------------------------------------------------------------------*/
}
/**---------------------------------------------------------------------------
 * > The title scene
 * @class Scene_Title
 * @extends Scene_Base
 */
class Scene_Title extends Scene_Base{
  /**-------------------------------------------------------------------------
   * @constructor
   * @memberof Scene_Title
   */
  constructor(){
    super()
    this.particles = [];
    this.particleNumber = 16;
  }
  /**-------------------------------------------------------------------------
   * > Start processing
   */
  start(){
    super.start();
    Sound.fadeInBGM(Sound.Title, 500);
    Graphics.addWindow(this.menu);
    this.menu.activate();
    this.particles.forEach(function(sp){sp.render();})
    this.fadeDuration = 60;
  }
  /*-------------------------------------------------------------------------*/
  create(){
    super.create();
    this.createMenu();
    this.createparticles();
    this.createGameModeWindow();
    this.createGameOptionWindow();
    this.createHelpWindow();
    this.createBackButton();
    this.createDimBack();
    this.assignHandlers();
  }
  /*-------------------------------------------------------------------------*/
  assignHandlers(){
    this.gameModeWindow.setHandler(this.gameModeWindow.kTraditional, this.onGameTraditional);
    this.gameModeWindow.setHandler(this.gameModeWindow.kBattlepuno, this.onGameBattlePuno);
    this.gameModeWindow.setHandler(this.gameModeWindow.kDeathMatch, this.onGameDeathMatch);
  }
  /*-------------------------------------------------------------------------*/
  update(){
    super.update();
    this.updateparticles();
  }
  /*-------------------------------------------------------------------------*/
  updateparticles(){
    for(let i=0;i<this.particleNumber;++i){
      let sp = this.particles[i];
      sp.y -= sp.speedFactor;
      if(!(i&1)){sp.rotation += sp.rotationDelta * Graphics.speedFactor;}
      if(sp.opacity < 0.6){sp.setOpacity(sp.opacity + 0.05 * Graphics.speedFactor);}
      if(sp.y < -50){this.setParticlePosition(i);}
    }
  }
  /*-------------------------------------------------------------------------*/
  createBackground(){
    this.backgroundImage = Graphics.addSprite(Graphics.Title);
    Graphics.renderSprite(this.backgroundImage);
  }
  /*-------------------------------------------------------------------------*/
  createMenu(){
    let ww = 200, wh = 200;
    let wx = Graphics.width - ww - Graphics.padding / 2;
    let wy = Graphics.height / 2;
    this.menu = new Window_Menu(wx, wy, ww, wh);
  }
  /*-------------------------------------------------------------------------*/
  createDimBack(){
    this.dimBack = new Sprite(0, 0, Graphics.width, Graphics.height);
    this.dimBack.fillRect(0, 0, Graphics.width, Graphics.height);
    this.dimBack.setOpacity(0.7).setZ(0x0a).hide();
  }
  /*-------------------------------------------------------------------------*/
  createparticles(){
    let p = Graphics.Particle, p2 = Graphics.Particle2;
    for(let i=0;i<this.particleNumber;++i){
      let pn = !(i&1) ? p2: p;
      let sp = Graphics.addSprite(pn);
      sp.setZ(0.1);
      this.particles.push(sp);
      this.setParticlePosition(i, true);
    }
  }
  /*-------------------------------------------------------------------------*/
  setParticlePosition(index, randomDist = false){
    let sp = this.particles[index];
    let ux = (Graphics.width - Graphics.padding) / this.particleNumber;
    let dx = ux * index, dy = Graphics.height - Graphics.padding * 2;
    dx = randInt(dx, dx + ux);
    dy = randInt(randomDist ? Graphics.padding : dy, Graphics.height);
    sp.speedFactor = randInt(10,50) / 10.0
    sp.filters = [new PIXI.filters.AdjustmentFilter({red: 1, green: 1, blue: 1})]
    sp.anchor.set(0.5);
    sp.setPOS(dx, dy).setOpacity(0);
    if(!(index & 1)){
      sp.rotationDelta = randInt(20,100) / 2000.0
    }
  }
  /*-------------------------------------------------------------------------*/
  createGameModeWindow(){
    this.gameModeWindow = new Window_GameModeSelect(0, 0, 300, 400);
    let wx = (Graphics.width - this.gameModeWindow.width) / 5;
    this.gameModeWindow.setPOS(wx, 150).setZ(0x10).hide();
  }
  /*-------------------------------------------------------------------------*/
  createGameOptionWindow(){
    this.gameOptionWindow = new Window_GameOption(0, 0, 520, 400);
    let wx = (Graphics.width - this.gameOptionWindow.width) * 7 / 10;
    this.gameOptionWindow.setPOS(wx,150).setZ(0x10).hide();
  }
  /*-------------------------------------------------------------------------*/
  createHelpWindow(){
    let wx = this.gameModeWindow.x, wy = this.gameModeWindow.y;
    let ww = this.gameOptionWindow.width + this.gameOptionWindow.x - wx;
    let wh = 80;
    wy -= wh;
    this.helpWindow = new Window_Help(wx, wy, ww, wh);
    this.helpWindow.setZ(0x10).hide();
    this.gameModeWindow.helpWindow = this.helpWindow;
    this.gameOptionWindow.helpWindow = this.helpWindow;
  }
  /*-------------------------------------------------------------------------*/
  createBackButton(){
    this.backButton = new Window_Back(0, 0, this.onActionBack.bind(this));
    let wx = Graphics.width - this.backButton.width - Graphics.padding;
    let wy = Graphics.padding;
    this.backButton.setPOS(wx, wy).setZ(0x10).hide();
  }
  /*-------------------------------------------------------------------------*/
  onGameStart(){
    this.helpWindow.show().activate().render();
    this.gameModeWindow.show().activate().render();
    this.gameOptionWindow.show().activate().render();
    this.backButton.show().activate().render();
    this.dimBack.show().render();
  }
  /*-------------------------------------------------------------------------*/
  onActionBack(){
    Sound.playCancel();
    this.helpWindow.hide().deactivate();
    this.gameModeWindow.hide().deactivate();
    this.gameOptionWindow.hide().deactivate();
    this.backButton.hide().deactivate();
    this.dimBack.hide().remove();
  }
  /*-------------------------------------------------------------------------*/
  onGameTraditional(){
    Sound.playOK();
    GameManager.changeGameMode(0);
    SceneManager.goto(Scene_Game);
  }
  /*-------------------------------------------------------------------------*/
  onGameBattlePuno(){
    Sound.playOK();
    GameManager.changeGameMode(1);
    SceneManager.goto(Scene_Game);
  }
  /*-------------------------------------------------------------------------*/
  onGameDeathMatch(){
    Sound.playOK2();
    GameManager.changeGameMode(2);
    SceneManager.goto(Scene_Game);
  }
  /*-------------------------------------------------------------------------*/
}
/**-------------------------------------------------------------------------
 * Test scene
 */
class Scene_Test extends Scene_Base{
  /*-------------------------------------------------------------------------*/
  constructor(){
    super();
    GameManager.changeGameMode(0);
  }
  /*-------------------------------------------------------------------------*/
  start(){
    super.start();
    SceneManager.goto(Scene_Game);
  }
}
/**-------------------------------------------------------------------------
 * The main scene during gameplay
 * @class Scene_Game
 * @property {String} bgiName - Path to background image
 * @property {String} bgmName - Path to background music
 * @property {String} meName  - Path to music effect (victory theme)
 * @property {Number} cardSpritePoolSize - Object pool size of card sprite
 * @property {Number} animationCount - Counter of animations playing
 * @property {boolean} playerPhase - Whether is user/player's turn
 */
class Scene_Game extends Scene_Base{
  /**-------------------------------------------------------------------------
   * @constructors
   */
  constructor(){
    super();
    this.game = GameManager.initStage();
    this.fadeDuration       = 60;
    this.cardSpritePoolSize = 50;
    this.discardPileSize    = 15;
    this.animationCount     = 0;
    this.playerPhase        = false;
  }
  /*-------------------------------------------------------------------------*/
  create(){
    this.changeAmbient(GameManager.gameMode);
    super.create();
    this.createDeckSprite();
    this.createDiscardPile();
    this.createCardSpritePool();
    this.createHandCanvas();
    this.createHintWindow();
    this.createSelectionWindow();
    this.createInfoSprite();
  }
  /*-------------------------------------------------------------------------*/
  start(){
    super.start();
    this.playStageBGM();
    this.selectionWindow.render();
    Graphics.renderSprite(this.infoSprite);
    EventManager.setTimeout(this.gameStart.bind(this), 90);
  }
  /*-------------------------------------------------------------------------*/
  playStageBGM(){
    if(!this.bgmName){
      EventManager.setTimeout(this.playStageBGM.bind(this), 10);
    }
    else{Sound.playBGM(this.bgmName);}
  }
  /*-------------------------------------------------------------------------*/
  gameStart(){
    this.game.gameStart();
    for(let i in this.players){
      this.players[i].lastHand = this.players[i].hand.slice();
    }
    this.players = this.game.players;
    this.createNameSprites();
    this.createPenaltySprites();
    this.createDummyWindow();
  }
  /*-------------------------------------------------------------------------*/
  roundStart(){

  }
  /*-------------------------------------------------------------------------*/
  randomBackground(){
    this.bgiName = Graphics["Background" + randInt(0, 3)];
  }
  /*-------------------------------------------------------------------------*/
  changeAmbient(amb_id){
    this.randomBackground();
    this.changeAmbientMusic(amb_id);
  }
  /*-------------------------------------------------------------------------*/
  changeAmbientMusic(amb_id){
    if(!Sound.isStageReady()){
      Sound.loadStageAudio();
      setTimeout(this.changeAmbientMusic.bind(this, amb_id), 500);
    }
    else{
      this.bgmName = Sound["Stage" + amb_id];
      this.meName  = Sound["Victory" + amb_id];
    }
  }
  /*-------------------------------------------------------------------------*/
  createBackground(){
    this.backgroundImage = Graphics.addSprite(this.bgiName);
    Graphics.renderSprite(this.backgroundImage);
  }
  /*-------------------------------------------------------------------------*/
  createDeckSprite(){
    let st = Graphics.addSprite(Graphics.CardBack).show();
    let sb = Graphics.addSprite(Graphics.CardEmpty).hide();
    this.deckSprite = new SpriteCanvas(0, 0, st.width, st.height).setZ(0x10);
    this.deckSprite.addChild(st); this.deckSprite.top = st;
    this.deckSprite.addChild(sb); this.deckSprite.bot = sb;
    let sx = Graphics.appCenterWidth(st.width) - 100;
    let sy = Graphics.appCenterHeight(st.height / 2);
    this.deckSprite.setPOS(sx, sy).activate().scale.set(0.5, 0.5);
    this.deckSprite.on('mouseover', ()=>{
      this.showHintWindow(null,null,Vocab["HelpDeck"] + this.getDeckLeftNumber)
    });
    this.deckSprite.on('mouseout', ()=>{this.hideHintWindow()});
    this.deckSprite.on('click', ()=>{this.onDeckTrigger()})
    this.deckSprite.on('tap', ()=>{this.onDeckTrigger()})
    Graphics.renderSprite(this.deckSprite);
  }
  /*-------------------------------------------------------------------------*/
  createDiscardPile(){
    let sw = 200, sh = 200;
    let sx = Graphics.appCenterWidth(sw) + Graphics.padding;
    let sy = Graphics.appCenterHeight(sh);
    this.discardPile = new SpriteCanvas(sx, sy, sw, sh);
    this.discardPile.activate().setZ(0x10);
    if(DebugMode){this.discardPile.fillRect(0, 0, sw, sh).setZ(0).setOpacity(0.5);}
    this.discardPile.on("mouseover", ()=>{
      this.showHintWindow(null,null, this.getLastCardInfo())
    });
    this.discardPile.on("mouseout",()=>{this.hideHintWindow()});
    Graphics.renderSprite(this.discardPile);
  }
  /*-------------------------------------------------------------------------*/
  getIdleCardSprite(){
    for(let i in this.spritePool){
      if(this.spritePool[i].playerIndex == -2){
        return this.spritePool[i];
      }
    }
    this.cardSpritePoolSize += 1;
    let sp = this.createCardSprite();
    this.spritePool.push(sp);
    return sp;
  }
  /*-------------------------------------------------------------------------*/
  createCardSpritePool(){
    this.spritePool = [];
    this.cardValueCount = [];
    for(let i=0;i<this.cardSpritePoolSize;++i){
      this.spritePool.push(this.createCardSprite());
    } 
  }
  /*-------------------------------------------------------------------------*/
  createCardSprite(){
    let i  = this.spritePool.length;
    let sp = Graphics.addSprite(Graphics.CardBack, "card" + i).hide();
    let sx = this.deckSprite.x + this.deckSprite.width / 2;
    let sy = this.deckSprite.y + this.deckSprite.height / 2;
    sp.setZ(0x11).scale.set(0.5, 0.5);
    sp.anchor.set(0.5, 0.5);
    sp.index    = i;      // index in the pool
    sp.handIndex = -1;    // index in player's hand
    sp.playerIndex = -2;  // this card belongs to which player
    sp.setPOS(sx, sy);
    return sp;
  }
  /*-------------------------------------------------------------------------*/
  createHandCanvas(){
    this.handCanvas = [];
    let maxNumbers  = [3, 2, 2, 3];
    let counter     = [0, 0, 0, 0];
    let sh = 225, sw = 350, sx, sy;

    for(let i=0;i<GameManager.playerNumber;++i){
      counter[i % 4] += 1;
      this.handCanvas.push(new SpriteCanvas(0, 0, sw, sh));
      this.handCanvas[i].playerIndex = i;
      this.handCanvas[i].render();
    }

    for(let i=0;i<4;++i){
      let portion = Math.min(counter[i], maxNumbers[i]);
      let partWidth  = Graphics.width  / portion;
      let partHeight = Graphics.height / portion;
      for(let j=0;j<counter[i];++j){
        let index = i + (4 * j);
        let hcs   = this.handCanvas[index];
        // up/down
        if(!(i&1)){
          // Divide canvas space
          sx = partWidth * j;
          if(partWidth > hcs.width){sx = (partWidth - hcs.width) / 2;}
          // Align bottom if i == 0 (down)
          sy = (i == 0) ? Graphics.height - hcs.height : Graphics.spacing;
        }
        // left/right
        else{
          hcs.resize(sh, sw);
          sy = partHeight * j;
          if(partHeight > hcs.height){sy = (partHeight - hcs.height) / 2;}
          // Align left if i == 1 (left)
          sx = (i == 1) ? Graphics.spacing : Graphics.width - hcs.width;
        }
        hcs.setPOS(sx, sy).setZ(0x10);
        if(DebugMode){hcs.fillRect(0, 0, hcs.width, hcs.height).setOpacity(0.5);}
      }
    }
    this.createArrangeIcon(0);
  }
  /*-------------------------------------------------------------------------*/
  createArrangeIcon(idx){
    let hcs = this.handCanvas[idx];
    let sx = 0, sy = hcs.height - Graphics.IconRect.height;
    hcs.arrangeIcon = hcs.drawIcon(117, sx, sy).setZ(0x30).activate();
    hcs.arrangeIcon.on('click', ()=>{this.arrangeHandCards(idx)});
    hcs.arrangeIcon.on('tap', ()=>{this.arrangeHandCards(idx)});
    hcs.arrangeIcon.on('mouseover', ()=>{
      this.showHintWindow(null, null,Vocab.HelpArrange)
    });
    hcs.arrangeIcon.on('mouseout', ()=>{this.hideHintWindow()});
  }
  /*-------------------------------------------------------------------------*/
  createNameSprites(){
    this.nameCanvas = []
    for(let i in this.handCanvas){
      i = parseInt(i);
      let side = i % 4;
      let sp = new SpriteCanvas(0, 0, 150, 24);
      let font = clone(Graphics.DefaultFontSetting);
      font.fill = 0x000000;
      let txt = sp.drawText(0, 0, this.players[i].name, font);
      let sx = 0, sy = 0;
      if(side == 0){
        sx = this.handCanvas[i].x - txt.width;
        sy = this.handCanvas[i].y + this.handCanvas[i].height - txt.height - Graphics.spacing;
      }
      else if(side == 1){
        sx = this.handCanvas[i].x;
        sy = this.handCanvas[i].y - txt.height;
      }
      else if(side == 2){
        sx = this.handCanvas[i].x + this.handCanvas[i].width;
        sy = this.handCanvas[i].y;
      }
      else if(side == 3){
        sx = this.handCanvas[i].x + this.handCanvas[i].width - txt.width;
        sy = this.handCanvas[i].y + this.handCanvas[i].height;
      }
      sp.textSprite = txt;
      this.nameCanvas.push(sp.setPOS(sx, sy).setZ(0x10));
      sp.render();
    }
  }
  /*-------------------------------------------------------------------------*/
  createPenaltySprites(){
    this.penaltyCanvas = []
    for(let i in this.handCanvas){
      i = parseInt(i);
      let side = i % 4;
      let sp = new SpriteCanvas(0, 0, 150, 24);
      let font = clone(Graphics.DefaultFontSetting);
      font.fill = Graphics.color.Crimson;
      let txt = sp.drawText(0, 0, '', font);
      let sx = 0, sy = 0;
      if(side == 0){
        sx = this.handCanvas[i].x + this.handCanvas[i].width;
        sy = this.nameCanvas[i].y
      }
      else if(side == 1){
        sx = this.nameCanvas[i].x;
        sy = this.handCanvas[i].y + this.handCanvas[i].height;
      }
      else if(side == 2){
        sx = this.handCanvas[i].x - this.nameCanvas[i].textSprite.width;
        sy = this.nameCanvas[i].y;
      }
      else if(side == 3){
        sx = this.nameCanvas[i].x;
        sy = this.handCanvas[i].y - this.nameCanvas[i].height;
      }
      sp.textSprite = txt;
      sp.baseX = sx; sp.baseY = sy;
      this.penaltyCanvas.push(sp.setPOS(sx, sy).setZ(0x10));
      sp.render();
    }
  }
  /*-------------------------------------------------------------------------*/
  createDummyWindow(){
    this.dummy = new Window_Selectable(0, 0, 300, 150);
    this.dummy.changeSkin(Graphics.WSkinTrans);
    Graphics.renderWindow(this.dummy);
    this.dummy.hide();
    this.cursor = this.dummy.cursorSprite;
    this.dummy.removeChild(this.cursor);
    this.cursor.setZ(0x20).render();
  }
  /*-------------------------------------------------------------------------*/
  createSelectionWindow(){
    let ww = 300, wh = 250;
    let wx = Graphics.appCenterWidth(ww);
    let wy = Graphics.appCenterHeight(wh);
    this.selectionWindow = new Window_CardSelection(wx, wy, ww, wh);
    this.selectionWindow.hide().setZ(0x30);
    this.selectionWindow.setHandler('cancel', ()=>{
      this.onUserAbilityCancel();
    });
  }
  /*-------------------------------------------------------------------------*/
  createInfoSprite(){
    this.infoSprite = new SpriteCanvas(0, 0, 300, 24);
    let font = clone(Graphics.DefaultFontSetting);
    font.fill = 0x000000;
    let bk  = this.infoSprite.fillRect(0, 0, 300, 24, Graphics.color.White);
    bk.setOpacity(0.5);
    let txt = this.infoSprite.drawText(0, 0, '', font);
    this.infoSprite.textSprite = txt;
    this.infoSprite.backSprite = bk;
  }
  /*-------------------------------------------------------------------------*/
  arrangeHandCards(index){
    let hcs  = this.handCanvas[index];
    let side = index % 4;
    let cardSize  = this.players[index].hand.length;
    let cardWidth = Graphics.CardRectReg.width;
    let cardHeight = Graphics.CardRectReg.height;
    let canvasWidth  = !(index&1) ? hcs.width  : hcs.height;
    let canvasHeight = !(index&1) ? hcs.height : hcs.width;
    let stackPortion = parseFloat(((canvasWidth - cardWidth) / (cardSize * cardWidth)).toFixed(3));
    let totalWidth   = cardWidth + (cardWidth * stackPortion * (cardSize - 1));
    let cur_player   = this.players[index];
    let base_pos     = (canvasWidth - totalWidth) / 2;
    let deg = index * (360 / GameManager.playerNumber);
    this.animationCount += 1;
    console.log("Arrange " + index);
    for(let i in cur_player.hand){
      let dx = 0, dy = 0;
      let card = cur_player.hand[i];
      let next_index = (side <= 1) ? i : cardSize - i - 1;
      if(!(side&1)){
        dx = base_pos + cardWidth * stackPortion * next_index + cardWidth / 2;
        dy = (side == 0) ? canvasHeight - cardHeight + cardHeight / 2 : cardHeight / 2;
      }
      else{
        dy = base_pos + cardWidth * stackPortion * next_index + cardWidth / 2;
        dx = (side == 1) ? Graphics.spacing + cardHeight/2: canvasHeight - cardHeight + cardHeight / 2;
      }
      if(!card.sprite){
        this.assignCardSprite(card, 0, 0, true);
      }

      if(index == 0 || DataManager.debugOption["showHand"]){
        card.sprite.texture = Graphics.loadTexture(this.getCardImage(card));
      }
      else{
        card.sprite.texture = Graphics.loadTexture(Graphics.CardBack);
      }
      card.sprite.setPOS(canvasWidth/2,canvasHeight/2).setZ(0x11 + parseInt(i));
      hcs.addChild(card.sprite);
      card.sprite.rotateDegree(deg);
      card.sprite.moveto(dx, dy);
      card.lastZ = card.sprite.z; card.lastY = dy;
      if(index == 0 && !card.attached){this.attachCardInfo(card);}
    }
    EventManager.setTimeout(()=>{this.animationCount -= 1}, 60);
    hcs.sortChildren();
  }
  /*-------------------------------------------------------------------------*/
  onCardZoomIn(card){

  }
  /*-------------------------------------------------------------------------*/
  onCardZoomOut(card){

  }
  /*-------------------------------------------------------------------------*/
  playColorEffect(cid){

  }
  /*-------------------------------------------------------------------------*/
  addDiscardCard(card, player_id, ext){
    player_id = parseInt(player_id);
    card.sprite.show();
    if(player_id >= 0){
      let deg = -20 + player_id * (360 / GameManager.playerNumber) + randInt(0, 40);
      card.sprite.rotateDegree(deg);
      EventManager.setTimeout(()=>{
        this.arrangeHandCards(player_id);
      }, parseInt(20));
    }
    card.sprite.texture = Graphics.loadTexture(this.getCardImage(card));
    let sx = this.discardPile.x + this.discardPile.width / 2;
    let sy = this.discardPile.y + this.discardPile.height / 2;
    let cx = (this.discardPile.width) / 2;
    let cy = (this.discardPile.height) / 2;
    this.animationCount += 1;
    console.log("Discard ", sx, sy, card.sprite.x, card.sprite.y);
    card.sprite.moveto(sx, sy, function(){
      this.playColorEffect(card.color);
      this.animationCount -= 1;
      if(card.sprite.parent != SceneManager.scene){
        card.sprite.parent.removeChild(card.sprite);
      }
      this.discardPile.addChild(card.sprite);
      if(ext != -1){this.updateLastCardInfo();}
      card.sprite.setPOS(cx, cy);
    }.bind(this));
    let repos = 1;
    while(this.discardPile.children.length > this.discardPileSize){
      let re = this.recycleCard(this.discardPile.children[repos].instance);
      if(!re){repos += 1;}
      if(re >= this.discardPile.length){break;}
    }
  }
  /*-------------------------------------------------------------------------*/
  recycleCard(card){
    if(!card){return false;}
    let sprite = card.sprite;
    card.playerIndex = -2;
    sprite.instance = null;
    this.discardPile.removeChild(sprite);
    sprite.hide();
  }
  /*-------------------------------------------------------------------------*/
  createHintWindow(){
    this.hintWindow = new Window_Help(0, 0, 250, 120);
    this.hintWindow.changeSkin(Graphics.WSkinTrans);
    this.hintWindow.font.fontSize = 16;
    this.hintWindow.padding_left  = 20;
    this.hintWindow.hoverNumber   = 0;
    this.hintWindow.setZ(0x20).hide().render();
  }
  /*-------------------------------------------------------------------------*/
  update(){
    super.update();
    this.updateGame();
    this.updateCards();
  }
  /*-------------------------------------------------------------------------*/
  updateGame(){
    if(this.game.isRoundOver()){return ;}
    if(this.game.deck){this.game.update();}
  }
  /*-------------------------------------------------------------------------*/
  updateCards(){
    for(let i in this.spritePool){
      this.spritePool[i].update();
    }
  }
  /*-------------------------------------------------------------------------*/
  updateHintWindow(txt=null){
    if(!this.hintWindow){return ;}
    if(!this.hintWindow.visible){return ;}
    let x = Input.mouseAppPOS[0];
    let y = Input.mouseAppPOS[1];
    x = Math.max(0, Math.min(x, Graphics.width  - this.hintWindow.width));
    y = Math.max(0, Math.min(y, Graphics.height - this.hintWindow.height));
    if(txt){this.hintWindow.setText(txt);}
    if(x && y){this.hintWindow.setPOS(x, y);}
  }
  /*-------------------------------------------------------------------------*/
  updateDeckInfo(){
    this.updateHintWindow(Vocab["HelpDeck"] + this.getDeckLeftNumber);
    if(this.game.deck.length == 0){
      this.deckSprite.top.hide();
      this.deckSprite.bot.show();
    }else{
      this.deckSprite.bot.hide();
      this.deckSprite.top.show();
    }
  }
  /*-------------------------------------------------------------------------*/
  updateLastCardInfo(){
    let txt = this.getLastCardInfo();
    let tsp = this.infoSprite.textSprite;
    tsp.text = txt;
    let sx = Graphics.width - Graphics.spacing - tsp.width;
    let sy = Graphics.spacing;
    let sw = tsp.width, sh = tsp.height;
    this.infoSprite.setPOS(sx, sy).resize(sw, sh);
    let bsp = this.infoSprite.backSprite;
    bsp.clear();
    bsp.beginFill(Graphics.color.White);
    bsp.drawRect(0, 0, sw, sh);
    bsp.endFill();
  }
  /*-------------------------------------------------------------------------*/
  updatePenaltyInfo(){
    let next = this.game.getNextPlayerIndex();
    debug_log("Next player: " + next);
    for(let i in this.penaltyCanvas){
      let hcs = this.penaltyCanvas[i];
      let pcard = this.game.penaltyCard;
      if(!pcard || i != next){this.setPenaltyInfo(i, Vocab.Normal); continue;}
      switch(pcard.value){
        case Value.SKIP:
          return this.setPenaltyInfo(i, Vocab.SKIP);
        case Value.DRAW_TWO:
          return this.setPenaltyInfo(i, "+2");
        case Value.DRAW_FOUR:
          return this.setPenaltyInfo(i, "+4");
        default:
          return this.setPenaltyInfo(i, Vocab.Normal);
      }
    }
  }
  /*-------------------------------------------------------------------------*/
  setPenaltyInfo(i, txt){
    let hcs = this.penaltyCanvas[i];
    let tsp = hcs.textSprite;
    tsp.text = txt;
    let side = i % 4, sx = 0, sy = 0;
    if(side == 0){
      sx = this.handCanvas[i].x + this.handCanvas[i].width;
      sy = this.nameCanvas[i].y
    }
    else if(side == 1){
      sx = this.handCanvas[i].x;
      sy = this.handCanvas[i].y + this.handCanvas[i].height;
    }
    else if(side == 2){
      sx = this.handCanvas[i].x - tsp.width;
      sy = this.nameCanvas[i].y;
    }
    else if(side == 3){
      sx = this.handCanvas[i].x + this.handCanvas[i].width - tsp.width;
      sy = this.handCanvas[i].y - tsp.height;
    }
    let sw = tsp.width, sh = tsp.height;
    hcs.setPOS(sx, sy).resize(sw, sh);
  }
  /*-------------------------------------------------------------------------*/
  raiseOverlay(w){
    super.raiseOverlay(w);
    this.deckSprite.deactivate();
    this.discardPile.deactivate();
    for(let i in this.spritePool){
      let sp = this.spritePool[i];
      sp.lastActiveState = sp.isActive();
      sp.deactivate();
    }
  }
  /*-------------------------------------------------------------------------*/
  closeOverlay(){
    super.closeOverlay();
    this.deckSprite.activate();
    this.discardPile.activate();
    for(let i in this.spritePool){
      let sp = this.spritePool[i];
      if(sp.lastActiveState){
        sp.activate();
      }
    }
  }
  /*-------------------------------------------------------------------------*/
  showHintWindow(x, y, txt = ''){
    this.hintWindow.hoverNumber += 1;
    if(x === null){x = Input.mouseAppPOS[0];}
    if(y === null){y = Input.mouseAppPOS[1];}
    x = Math.max(0, Math.min(x, Graphics.width  - this.hintWindow.width));
    y = Math.max(0, Math.min(y, Graphics.height - this.hintWindow.height));
    this.hintWindow.show().setPOS(x, y).setText(txt);
  }
  /*-------------------------------------------------------------------------*/
  hideHintWindow(){
    this.hintWindow.hoverNumber -= 1;
    if(this.hintWindow.hoverNumber <= 0){
      this.hintWindow.hoverNumber = 0;
      this.hintWindow.hide();
    }
  }
  /*-------------------------------------------------------------------------*/
  attachCardInfo(card){
    if(!card.sprite || card.attached){return ;}
    card.attached = true;
    card.sprite.activate();
    card.sprite.on('mouseover', ()=>{this.showCardInfo(card)})
    card.sprite.on('mousemove', ()=>{this.updateHintWindow()})
    card.sprite.on('mouseout',  ()=>{this.hideCardInfo(card)})
    card.sprite.on('click', ()=>{this.onCardTrigger(card)});
    card.sprite.on('tap',   ()=>{this.onCardTrigger(card)});
  }
  /*-------------------------------------------------------------------------*/
  detachCardInfo(card){
    card.attached = false;
    if(!card.sprite){return ;}
    card.sprite.deactivate();
    card.sprite.removeAllListeners();
  }
  /*-------------------------------------------------------------------------*/
  showCardInfo(card){
    let info = this.getCardHelp(card);
    card.sprite.setZ(0x30).scale.set(0.6, 0.6);
    card.sprite.setPOS(null, card.lastY - 32);
    this.handCanvas[0].sortChildren();
    this.showHintWindow(null, null, info);
  }
  /*-------------------------------------------------------------------------*/
  hideCardInfo(card){
    card.sprite.setZ(card.lastZ).scale.set(0.5, 0.5);
    card.sprite.setPOS(null, card.lastY);
    this.handCanvas[0].sortChildren();
    this.hideHintWindow(true);
  }
  /*-------------------------------------------------------------------------*/
  getCardHelp(card){
    let re = ''
    switch(card.color){
      case Color.RED:
        re += Vocab.HelpColorRed + '; '; break;
      case Color.BLUE:
        re += Vocab.HelpColorBlue + '; '; break;
      case Color.YELLOW:
        re += Vocab.HelpColorYellow + '; '; break;
      case Color.GREEN:
        re += Vocab.HelpColorGreen + '; '; break;
      case Color.WILD:
        re += Vocab.HelpColorWild + '; '; break;      
      default:
        re += "???";
    }
    re += 'Effects: \n';
    switch(card.value){
      case Value.ZERO:
        re += Vocab.HelpZero + '; '; break;
      case Value.REVERSE:
        re += Vocab.HelpReverse + '; '; break;
      case Value.SKIP:
        re += Vocab.HelpSkip + '; '; break;
      default:
        re += this.getEffectsHelp(GameManager.interpretCardAbility(card, 0));
    }
    re += this.getCharacterHelp(card);
    return re;
  }
  /*-------------------------------------------------------------------------*/
  getEffectsHelp(effects){
    let re = '';
    for(let i in effects){
      let eff = effects[i];
      switch(eff){
        case Effect.DRAW_TWO:
          re += Vocab.HelpPlusTwo + '; '; break;
        case Effect.DRAW_FOUR:
          re += Vocab.HelpPlusFour + '; '; break;
        case Effect.CHOOSE_COLOR:
          re += Vocab.HelpChooseColor + '; '; break;
        case Effect.HIT_ALL:
          re += Vocab.HelpHitAll + '; '; break;
        case Effect.TRADE:
          re += Vocab.HelpTrade + '; '; break;
        case Effect.WILD_CHAOS:
          re += Vocab.HelpChaos + '; '; break;
        case Effect.DISCARD_ALL:
          re += Vocab.HelpDiscardAll + '; '; break;
        case Effect.ADD_DAMAGE:
          re += Vocab.HelpNumber + '; '; break;
      }
    }
    re += '\n';
    return re;
  }
  /*-------------------------------------------------------------------------*/
  getCharacterHelp(card){
    return ''
  }
  /*-------------------------------------------------------------------------*/
  assignCardSprite(card, ix=0, iy=0, rnd=false){
    if(card.sprite){return ;}
    let sprite = this.getIdleCardSprite();
    sprite.texture = Graphics.loadTexture(this.getCardImage(card)); 
    sprite.setPOS(ix, iy);
    card.sprite = sprite;
    sprite.instance = card;
    if(rnd){sprite.render();}
    return card;
  }
  /*-------------------------------------------------------------------------*/
  onCardPlay(pid, card, effects, ext){
    pid = parseInt(pid);
    if(pid == -1){
      let sx = this.deckSprite.x + this.deckSprite.width / 2;
      let sy = this.deckSprite.y + this.deckSprite.height / 2;
      this.assignCardSprite(card, sx, sy, true);
      this.updateDeckInfo();
      EventManager.setTimeout(()=>{
        this.updatePenaltyInfo();
      }, 10);
    }
    else{
      let pos = card.sprite.worldTransform;
      card.sprite.setPOS(pos.tx, pos.ty);
      this.handCanvas[pid].removeChild(card.sprite);
      card.sprite.render();
    }
    if(ext != -1){
      this.processCardEffects(effects, ext);
      EventManager.setTimeout(()=>{
        this.updatePenaltyInfo();
      }, 2);
    }
    this.detachCardInfo(card);
    Sound.playCardPlace();
    card.sprite.setZ(0x20).handIndex = -1;
    card.sprite.playerIndex = -1;
    console.log("Card play: " + pid, card);
    this.addDiscardCard(card, pid, ext);
  }
  /*-------------------------------------------------------------------------*/
  processCardEffects(effects, ext){
    ext = [].concat(ext);
    debug_log("Effects: " + effects);
    debug_log("Ext: " + ext);
    for(let i in effects){
      if(ext[i] == -1){continue;}
      switch(effects[i]){
        case Effect.CHOOSE_COLOR:
          this.processColorChangeEffect(parseInt(ext[i]));
          break;
        case Effect.TRADE:
          this.processTradeEffect(parseInt(ext[i]));
          break;
      }
    }
  }
  /*-------------------------------------------------------------------------*/
  processTradeEffect(ext){
    let pid = this.game.currentPlayerIndex;
    EventManager.setTimeout(()=>{
      this.arrangeHandCards(pid);
      this.arrangeHandCards(ext);
    }, 10);
  }
  /*-------------------------------------------------------------------------*/
  processColorChangeEffect(cid){
    debug_log("Color changed: " + cid);
  }
  /*-------------------------------------------------------------------------*/
  onCardDraw(pid, cards, show=false){
    pid = parseInt(pid);
    let wt = 20; // wait time
    for(let i in cards){
      i = parseInt(i);
      let ar = (i+1 == cards.length);
      debug_log(cards[i], wt * i);
      EventManager.setTimeout(this.processCardDrawAnimation.bind(this, pid, cards[i], show, ar,i), wt * i);
    }
    this.updateDeckInfo();
  }
  /*-------------------------------------------------------------------------*/
  processCardDrawAnimation(pid, card, show=false, ar=false,ord=0){
    let sprite = this.getIdleCardSprite().show();
    sprite.texture = Graphics.loadTexture(Graphics.CardBack);
    sprite.render();
    sprite.playerIndex = pid;
    card.sprite = sprite;
    let dx = 0, dy = 0;
    if(pid >= 0){
      let sx = this.deckSprite.x + this.deckSprite.width / 3;
      let sy = this.deckSprite.y + this.deckSprite.height / 3;
      let deg = pid * (360 / GameManager.playerNumber);
      dx = this.handCanvas[pid].x + this.handCanvas[pid].width / 2;
      dy = this.handCanvas[pid].y + this.handCanvas[pid].height / 2;
      sprite.setPOS(sx, sy).rotateDegree(deg);
    }
    Sound.playCardDraw();
    sprite.instance = card;  
    this.animationCount += 1;
    if(show){
      sprite.texture = Graphics.loadTexture(this.getCardImage(card));
      sprite.setZ(0x30);
    }
    debug_log(`${pid} Draw`);
    sprite.moveto(dx, dy, function(){
      this.animationCount -= 1;
      if(pid == 0){
        this.attachCardInfo(card);
        sprite.texture = Graphics.loadTexture(this.getCardImage(card));
      }
      if(show){EventManager.setTimeout(this.sendCardToDeck.bind(this, pid, card), 200);}
      else if(ar){EventManager.setTimeout(()=>{this.arrangeHandCards(pid)}, 20)}
    }.bind(this));
  }
  /*-------------------------------------------------------------------------*/
  onCardTrigger(card){
    if(this.playerPhase && this.game.isCardPlayable(card)){
      this.hideCardInfo(card);
      if(this.game.isCardAbilitySelectionNeeded(card)){
        Sound.playOK();
        this.processCardAbilitySelection(card);
        this.raiseOverlay(this.selectionWindow);
      }
      else{this.onUserCardPlay(card, null);}
    }
    else{
      Sound.playBuzzer();
    }
  }
  /*-------------------------------------------------------------------------*/
  processCardAbilitySelection(card){
    let effid = this.selectionWindow.setupCard(card);
    this.setupCardAbilityHandler(effid);
  }
  /*-------------------------------------------------------------------------*/
  setupCardAbilityHandler(effid){
    switch(effid){
      case Effect.CLEAR_DAMAGE:
        return this.setupZeroHandlers(card);
      case Effect.TRADE:
        return this.setupTradeHandlers(card);
      case Effect.CHOOSE_COLOR:
        return this.setupColorSelectionHandlers(card);
      default:
        throw new Error(`Unknown Card Selection: ${effid}, ${card}`)
    }
  }
  /*-------------------------------------------------------------------------*/
  setupZeroHandlers(card){
    this.selectionWindow.setHandler(1, ()=>{
      this.onUserAbilityDecided(card, 0)
    });
    this.selectionWindow.setHandler(2, ()=>{
      this.onUserAbilityDecided(card, 1)
    });
  }
  /*-------------------------------------------------------------------------*/
  setupTradeHandlers(card){
    let alives = this.game.getAlivePlayers();
    let cnt = 1;
    for(let i in alives){
      if(alives[i] == GameManager.game.players[0]){continue;}
        this.selectionWindow.setHandler(cnt++, ()=>{
        this.onUserAbilityDecided(card, this.players.indexOf(alives[i]))
      });
    }
  }
  /*-------------------------------------------------------------------------*/
  setupColorSelectionHandlers(card){
    this.selectionWindow.setHandler(1, ()=>{
      this.onUserAbilityDecided(card, Color.RED)
    });
    this.selectionWindow.setHandler(2, ()=>{
      this.onUserAbilityDecided(card, Color.YELLOW)
    });
    this.selectionWindow.setHandler(3, ()=>{
      this.onUserAbilityDecided(card, Color.GREEN)
    });
    this.selectionWindow.setHandler(4, ()=>{
      this.onUserAbilityDecided(card, Color.BLUE)
    });
  }
  /*-------------------------------------------------------------------------*/
  onUserCardPlay(card, ext){
    Sound.playOK();
    this.detachCardInfo(card);
    this.hideCardInfo(card);
    this.game.discard(this.game.currentPlayer().findCard(card), ext);
    this.processUserTurnEnd();
  }
  /*-------------------------------------------------------------------------*/
  onUserAbilityCancel(){
    Sound.playCancel();
    this.closeOverlay();
  }
  /*-------------------------------------------------------------------------*/
  onUserAbilityDecided(card, ext){
    Sound.playOK();
    this.closeOverlay();
    this.onUserCardPlay(card, ext);
  }
  /*-------------------------------------------------------------------------*/
  onDeckTrigger(){
    if(!this.playerPhase){return Sound.playBuzzer();}
    let numCards = GameManager.getCardDrawNumber();
    this.game.penaltyCard = undefined;
    let cards = GameManager.game.deck.draw(numCards);
    this.players[0].deal(cards);
    GameManager.onCardDraw(0, cards);
    this.processUserTurnEnd();
  }
  /*-------------------------------------------------------------------------*/
  sendCardToDeck(pid, card){
    card.sprite.playerIndex = -2;
    let sx = this.deckSprite.x + this.deckSprite.width / 2;
    let sy = this.deckSprite.y + this.deckSprite.height / 2;
    this.handCanvas[pid].removeChild(card.sprite);
    card.sprite.hide().setPOS(sx,sy);
  }
  /*-------------------------------------------------------------------------*/
  getCardImage(card){
    let symbol = '';
    switch(card.color){
      case Color.RED:
        symbol += 'Red'; break;
      case Color.BLUE:
        symbol += 'Blue'; break;
      case Color.YELLOW:
        symbol += 'Yellow'; break;
      case Color.GREEN:
        symbol += 'Green'; break;
      case Color.WILD:
        symbol += 'Wild'; break;
      default:
        throw new Error("Invalid card color: " + card.color);
    }
    switch(card.value){
      case Value.REVERSE:
        symbol += 'Reverse'; break;
      case Value.SKIP:
        symbol += 'Ban'; break;
      case Value.DRAW_TWO:
        symbol += 'Plus2'; break;
      case Value.WILD_DRAW_FOUR:
        symbol += 'Plus4'; break;
      case Value.WILD:
        symbol += 'Wild'; break;
      case Value.TRADE:
        symbol += 'Exchange'; break;
      case Value.WILD_HIT_ALL:
        symbol += 'Hit'; break;
      case Value.DISCARD_ALL:
        symbol += 'Discard'; break;
      case Value.WILD_CHAOS:
        symbol += 'Chaos'; break;
      default:
        symbol += card.value;
    }
    if(card.value > 9 && card.numID > 0){
      let tmp = symbol + '_' + (card.numID + 1);
      if(Graphics[tmp]){symbol = tmp;}
    }
    // debug_log("Card Image Symbol: " + symbol);
    return Graphics[symbol];
  }
  /*-------------------------------------------------------------------------*/
  processUserTurn(pid){
    this.setCursor(pid);
    this.playerPhase = true;
  }
  /*-------------------------------------------------------------------------*/
  processUserTurnEnd(){
    this.playerPhase = false;
  }
  /*-------------------------------------------------------------------------*/
  processNPCTurn(pid){
    this.setCursor(pid);
  }
  /*-------------------------------------------------------------------------*/
  setCursor(pid){
    let sx = this.nameCanvas[pid].x - Graphics.spacing;
    let sy = this.nameCanvas[pid].y - Graphics.spacing;
    let sw = this.nameCanvas[pid].textSprite.width + Graphics.padding + Graphics.spacing;
    let sh = Graphics.lineHeight;
    this.dummy.resize(sw, sh);
    this.cursor.setPOS(sx, sy).show();
  }
  /*-------------------------------------------------------------------------*/
  applyColorChangeEffect(cid){
    debug_log("Color Changed: " + cid);
  }
  /*-------------------------------------------------------------------------*/
  processGameOver(){
    debug_log("Game Ends")
  }
  /*-------------------------------------------------------------------------*/
  processRoundOver(){
    debug_log("Round Ends")
  }
  /*-------------------------------------------------------------------------*/
  processRoundStart(){
    debug_log("Round Start");
    this.clearTable();
  }
  /*-------------------------------------------------------------------------*/
  clearTable(){
    this.clearDeck();
    this.clearCardSprites();
  }
  /*-------------------------------------------------------------------------*/
  clearDeck(){
    this.updateDeckInfo();
  }
  /*-------------------------------------------------------------------------*/
  clearCardSprites(){
    for(let i in this.spritePool){
      let sprite = this.spritePool[i];
      if(!sprite.instance){continue;}
      if(sprite.instance != this.game.lastCard()){
        this.recycleCard(sprite.instance);
      }
    }
  }
  /*-------------------------------------------------------------------------*/
  processGameStart(){
    debug_log("Game Start")
  }
  /*-------------------------------------------------------------------------*/
  isBusy(){
    return super.isBusy() || this.isAnimationPlaying() || this.isPlayerThinking();
  }
  /*-------------------------------------------------------------------------*/
  isAnimationPlaying(){
    return this.animationCount != 0;
  }
  /*-------------------------------------------------------------------------*/
  isPlayerThinking(){
    return this.playerPhase;
  }
  /*-------------------------------------------------------------------------*/
  getLastCardInfo(){
    if(!this.game || !this.game.currentColor){return 'No cards played yet';}
    let re = 'Current Color/Value: ';
    switch(this.game.currentColor){
      case Color.RED:
        re += 'Red'; break;
      case Color.BLUE:
        re += 'Blue'; break;
      case Color.GREEN:
        re += 'Green'; break;
      case Color.YELLOW:
        re += 'Yellow'; break;
      default:
        re += 'Any';
    }
    re += " / ";
    if(!this.game.currentValue){
      re += Vocab.Any;
    }
    else if(this.game.currentValue < 10){
      re += this.game.currentValue;
    }
    else{
      for(let p in Value){
        if(!Value.hasOwnProperty(p)){continue;}
        if(Value[p] == this.game.currentValue){
          re += capitalize(p);
        }
      }
    }
    return re;
  }
  /*-------------------------------------------------------------------------*/
  get getDeckLeftNumber(){
    return this.game.deck ? this.game.deck.length : 0;
  }
  /*-------------------------------------------------------------------------*/
}