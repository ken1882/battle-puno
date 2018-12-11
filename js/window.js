/**
 * The Superclass of all windows within the game.
 * 
 * @class Window_Base
 * @extends SpriteCanvas
 * @property {String} _skin - path to window skin image
 * @property {Object} _renderedObjects - information of rendered stuffs
 */
class Window_Base extends SpriteCanvas{
  /**-------------------------------------------------------------------------
   * @constructor
   * @memberof Window_Base
   * @param {Number} x - X position in app
   * @param {Number} y - Y position in app
   * @param {Number} w - width of canvas, overflowed content will be hidden
   * @param {Number} h - height of canvas, overflowed content will be hidden
   */
  constructor(x = 0, y = 0, w = 300, h = 150){
    super(x, y, w, h);
    this._skin        = Graphics.DefaultWindowSkin;
    this.drawnObjects = [];
    this.applySkin();
    this.resize(w, h);
  }
  /**-------------------------------------------------------------------------
   * > Frame update
   * @memberof Window_Base
   */
  update(){
    // reserved
  }
  /**------------------------------------------------------------------------
   * @param {boolean} all - remove all children (dispose)
   */
  clear(all = false){
    for(let i=0;i<this.drawnObjects.length;++i){
      if(this.drawnObjects[i].destroy){
        this.drawnObjects[i].destroy({children: true});
      }
      this.removeChild(this.drawnObjects[i]);
    }
    this.drawnObjects = [];
    if(all){super.clear();}
  }
  /*-------------------------------------------------------------------------*/
  get padding(){return Graphics.padding;}
  get spacing(){return Graphics.spacing;}
  /**-------------------------------------------------------------------------
   * > Draw window skin
   */
  applySkin(){
    this.drawSkinIndex();
    this.drawSkinPattern();
    this.drawSkinArrows();
    this.drawSkinCursor();
    this.drawSkinButton();
    this.drawSkinBorder();
  }
  /**-------------------------------------------------------------------------
   * > Draw the border of skin
   */
  drawSkinBorder(){
    let tUL = Graphics.loadTexture(this._skin, Graphics.wSkinBorderUL);
    let tUP = Graphics.loadTexture(this._skin, Graphics.wSkinBorderUP);
    let tUR = Graphics.loadTexture(this._skin, Graphics.wSkinBorderUR);
    let tBL = Graphics.loadTexture(this._skin, Graphics.wSkinBorderBL);
    let tBT = Graphics.loadTexture(this._skin, Graphics.wSkinBorderBT);
    let tBR = Graphics.loadTexture(this._skin, Graphics.wSkinBorderBR);
    let tLT = Graphics.loadTexture(this._skin, Graphics.wSkinBorderLT);
    let tRT = Graphics.loadTexture(this._skin, Graphics.wSkinBorderRT);
    
    this.borderSpriteUL = new Sprite(tUL);
    this.borderSpriteUP = new Sprite(tUP);
    this.borderSpriteUR = new Sprite(tUR);
    this.borderSpriteBL = new Sprite(tBL);
    this.borderSpriteBT = new Sprite(tBT);
    this.borderSpriteBR = new Sprite(tBR);
    this.borderSpriteLT = new Sprite(tLT);
    this.borderSpriteRT = new Sprite(tRT);
    
    this.borderSprites = [
      this.borderSpriteUL, this.borderSpriteUP, this.borderSpriteUR,
      this.borderSpriteBL, this.borderSpriteBT, this.borderSpriteBR,
      this.borderSpriteLT, this.borderSpriteRT
    ]
    
    for(let i=0;i<this.borderSprites.length;++i){
      this.borderSprites[i].setZ(5).static = true;
      this.addChild(this.borderSprites[i]);
    }
  }
  /**-------------------------------------------------------------------------
   * > Draw the hover cursor of skin
   */
  drawSkinCursor(){
    let texture = Graphics.loadTexture(this._skin, Graphics.wSkinCursor);
    this.cursorSprite = new Sprite(texture);
    this.cursorSprite.setZ(4).hide().static = true;
    this.addChild(this.cursorSprite);
  }
  /**-------------------------------------------------------------------------
   * > Draw the index background of skin
   */
  drawSkinIndex(){
    let texture = Graphics.loadTexture(this._skin, Graphics.wSkinIndexRect);
    this.indexSprite = new Sprite(texture);
    this.indexSprite.setZ(0).setOpacity(0.5).static = true;
    this.addChild(this.indexSprite);
  }
  /**-------------------------------------------------------------------------
   * > Draw index pattern of skin
   */
  drawSkinPattern(){
    let texture = Graphics.loadTexture(this._skin, Graphics.wSkinPatternRect);
    this.patternSprite = new Sprite(texture);
    this.patternSprite.setZ(1).setOpacity(0.5).static = true;
    this.addChild(this.patternSprite);
  }
  /**-------------------------------------------------------------------------
   * > Draw continue icon of skin
   */
  drawSkinButton(){
    let rect  = Graphics.wSkinButton;
    rect.width /= 2; rect.height /= 2;
    let d = rect.width;
    let offset = [[0,0],[d,0],[0,d],[d,d]], textureArray = [];
    for(let i=0;i<4;++i){
      let srect = clone(rect);
      srect.x += offset[i][0]; srect.y += offset[i][1]
      textureArray.push(Graphics.loadTexture(this._skin, srect));
    }
    this.buttonSprite = new PIXI.extras.AnimatedSprite(textureArray);
    this.buttonSprite.setZ(3).static = true;
    this.buttonSprite.animationSpeed = 0.25;
    this.buttonSprite.hide();
    this.addChild(this.buttonSprite);
  }
  /**-------------------------------------------------------------------------
   * > Draw scroll arrows of skin
   */
  drawSkinArrows(){
    let tAU = Graphics.loadTexture(this._skin, Graphics.wSkinArrowUP);
    let tAD = Graphics.loadTexture(this._skin, Graphics.wSkinArrowBT);
    let tAL = Graphics.loadTexture(this._skin, Graphics.wSkinArrowLT);
    let tAR = Graphics.loadTexture(this._skin, Graphics.wSkinArrowRT);
    this.arrowDownSprite  = new Sprite(tAD);
    this.arrowUpSprite    = new Sprite(tAU);
    this.arrowLeftSprite  = new Sprite(tAL);
    this.arrowRightSprite = new Sprite(tAR);
    this.arrowSprites = [
      this.arrowDownSprite,  this.arrowLeftSprite,
      this.arrowRightSprite, this.arrowUpSprite
    ]
    for(let i=0;i<4;++i){
      this.arrowSprites[i].setZ(6).hide().static = true;
      this.addChild(this.arrowSprites[i]);
    }
  }
  /**-------------------------------------------------------------------------
   * > Draw Icon in Iconset
   * @param {Number} icon_index - the index of the icon in Iconset
   * @param {Number} x - the draw position of X
   * @param {Number} y - the draw position of Y
   */
  drawIcon(icon_index, x, y){
    let iconSprite = super.drawIcon(icon_index, x, y);
    this.drawnObjects.push(iconSprite);
    this.refresh();
    return iconSprite;
  }
  /**-------------------------------------------------------------------------
   * > Draw text inside the window
   * @param {String} text - the text to display
   * @param {Number} x - the x position of the text to draw
   * @param {Number} y - the y position of the text to draw
   * @param {Object} font - the font settings
   */
  drawText(text, x = 0, y = 0, font = Graphics.DefaultFontSetting){
    let ts = new PIXI.Text(text, font);
    x += this.spacing; y += this.spacing;
    ts.setPOS(x, y).setZ(2);
    this.drawnObjects.push(ts);
    this.addChild(ts);
    this.refresh();
  }
  /*-------------------------------------------------------------------------*/
  resize(w, h){
    w = Math.min(Math.max(1, w), 4096);
    h = Math.min(Math.max(1, h), 4096);
    super.resize(w, h);
    if(this.isDisposed()){return ;}
    // last work here
    let blen  = Graphics.wSkinBorder.width / 2;
    let brmpr = [(this.width - blen) / blen, (this.height - blen) / blen]
    
    this.indexSprite.scale.set(brmpr[0], brmpr[1]);
    this.patternSprite.scale.set(brmpr[0], brmpr[1]);
    this.borderSpriteUP.scale.set(brmpr[0], 1);
    this.borderSpriteBT.scale.set(brmpr[0], 1);
    this.borderSpriteLT.scale.set(1, brmpr[1]);
    this.borderSpriteRT.scale.set(1, brmpr[1]);

    this.borderSpriteUP.x = this.borderSpriteUL.width;
    this.borderSpriteUR.x = this.borderSpriteUP.x + this.borderSpriteUP.width;
    this.borderSpriteLT.y = this.borderSpriteUL.height;
    this.borderSpriteBL.y = this.borderSpriteLT.y + this.borderSpriteLT.height;
    this.borderSpriteBT.setPOS(this.borderSpriteUP.x, this.borderSpriteBL.y);
    this.borderSpriteBR.setPOS(this.borderSpriteUR.x, this.borderSpriteBL.y);
    this.borderSpriteRT.setPOS(this.borderSpriteUR.x, this.borderSpriteLT.y);

    let offset = [Graphics.wSkinArrowUP.width, Graphics.wSkinArrowUP.height];

    this.arrowUpSprite.setPOS((this.width - offset[0]) / 2, this.spacing);
    this.arrowLeftSprite.setPOS(this.spacing, (this.height - offset[0]) / 2);
    this.arrowDownSprite.setPOS(this.arrowUpSprite.x, this.height - this.spacing - offset[1])
    this.arrowRightSprite.setPOS(this.width - this.spacing - offset[1], this.arrowLeftSprite.y);
    this.buttonSprite.setPOS((this.width - this.spacing * 2) / 2, this.height - this.spacing * 2);
    return this;
  }
  /**-------------------------------------------------------------------------
   * > Dispose window
   */
  dispose(){
    SceneManager.scene.removeWindow(this);
  }
  /**-------------------------------------------------------------------------
   * > Check whether window has been disposed
   */
  isDisposed(){
    return this.children.length == 0;
  }
}
/**
 * The window that provides selectable item
 * 
 * @class Window_Selectable
 * @extends Window_Base
 * @property {Array.<Object>} selections - the available selections
 */
class Window_Selectable extends Window_Base{
  /**-------------------------------------------------------------------------
   * @constructor
   * @memberof Window_Selectable
   */
  constructor(x = 0, y = 0, w = 300, h = 150){
    super(x, y, w, h);
    this._active     = false;
    this._selections = [];
  }
  /*------------------------------------------------------------------------*/
  refresh(){
    super.refresh();
    this.syncChildrenProperties();
  }
  /**------------------------------------------------------------------------
   * 
   */
  syncChildrenProperties(){
    for(let i=0;i<this.children.length;++i){
      this.children[i].interactive = this.isActivate;
    }
  }
  /**-------------------------------------------------------------------------
   * > Activate to make selections interactable
   */
  activate(){
    this._active = true;
    return this;
  }
  /**-------------------------------------------------------------------------
   * > Deactivate to make selections un-interactable
   */
  deactivate(){
    this._active = false;
    return this;
  }
  /**-------------------------------------------------------------------------
   * > Checl whether window activated
   */
  get isActivate(){return this._active;}
  get isActive(){return this._active;}
  
}