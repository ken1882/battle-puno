/**
 * The Superclass of all windows within the game.
 * 
 * @class Window_Base
 * @extends Sprite
 */
class Window_Base extends Sprite{
  /**-------------------------------------------------------------------------
   * @constructor
   * @memberof Window_Base
   */
  constructor(...args){
    super(PIXI.Texture.EMPTY);
    this.initialize.apply(this, arguments);
  }
  /**-------------------------------------------------------------------------
   * > Object initialization
   * @memberof Window_Base
   * @property {Number} ox - Display origin x
   * @property {Number} oy - Display origin y
   * @property {String} _skin - path to window skin image
   * @property {Object} _renderedObjects - information of rendered stuffs
   */
  initialize(x = 0, y = 0, w = 300, h = 150){
    // Prevent initalization called from parent again
    if(!isClassOf(x, Number)){return ;}
    super.initialize();
    this._skin  = Graphics.DefaultWindowSkin;
    this.ox = 0; this.oy = 0;
    this.lastDisplayOrigin = [0,0];
    this.scaleMultipler = [Graphics.wSkinIndexRect.width, Graphics.wSkinIndexRect.height];
    this.drawnObjects   = [];
    this.applySkin();
    this.applyMask();
    this.setPOS(x, y);
    this.resize(w, h);
    this.setZ(0);
  }
  /**-------------------------------------------------------------------------
   * > Frame update
   * @memberof Window_Base
   */
  update(){
    // reserved
  }
  /**------------------------------------------------------------------------
   * > Check whether the object is inside the visible area
   * @param {Sprite|Bitmap} obj - the DisplayObject to be checked
   * @returns {boolean}
   */
  isObjectVisible(obj){
    let dx = this.origX(obj.x) - this.ox, dy = this.origY(obj.y) - this.oy;
    if(dx > this.realWidth() || dy > this.realHeight()){return false;}
    let dw = dx + this.realWidth(obj.width), dh = dy + this.realHeight(obj.height);
    if(dx + dw < 0 || dy + dh < 0){return false;}
    return true;
  }
  /*------------------------------------------------------------------------*/
  clear(){
    for(let i=0;i<this.drawnObjects.length;++i){
      this.removeChild(this.drawnObjects[i]);
    }
  }
  /*------------------------------------------------------------------------*/
  refresh(){
    let dox = this.ox - this.lastDisplayOrigin[0];
    let doy = this.oy - this.lastDisplayOrigin[1];
    this.children.sort((a,b) => (a.zIndex || 0) - (b.zIndex || 0));
    for(let i=0;i<this.children.length;++i){
      let sp = this.children[i];
      if(sp.static){continue;}
      if(!this.isObjectVisible(sp)){sp.hide();}
      else{sp.show();}
      let dx = this.origX(sp.x) - dox, dy = this.origY(sp.y) - doy;
      sp.setPOS(this.innerX(dx), this.innerY(dy));
    }
    this.lastDisplayOrigin = [this.ox, this.oy];
  }
  /**-------------------------------------------------------------------------
   * > Set Z-Index
   */
  setZ(z){
    this.zIndex = z;
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
  get z(){return this.zIndex;}
  get padding(){return Graphics.padding;}
  get spacing(){return Graphics.spacing;}
  /**-------------------------------------------------------------------------
   * > The scale needed for zoom the sprite to original size
   * @returns {[Float, Float]} - width[0] and height[1] scale number
   */
  get origScale(){return [1 / this.width, 1 / this.height];}  
  /**-------------------------------------------------------------------------
   * > Get the X position inside the window
   * @param {Number} x - the real x position on screen
   */
  innerX(x){return x / this.width;}
  /**-------------------------------------------------------------------------
   * > Get the Y position inside the window
   * @param {Number} y - the real Y position on screen
   */
  innerY(y){return y / this.height;}
  /**-------------------------------------------------------------------------
   * > Get the real X position on the screen
   * @param {Number} x - the x position inside the windoe
   */
  origX(x){return x * this.width;}
  /**-------------------------------------------------------------------------
   * > Get the real Y position on the screen
   * @param {Number} y - the y position inside the windoe
   */
  origY(y){return y * this.height;}
  /**-------------------------------------------------------------------------
   * > Get the real width on the screen
   * @param {Number|undefined} w - if non argument given, return this window's
   *                               real width in pixel; otherwiase return the
   *                               object's original width.
   */
  realWidth(w = null){
    if(!w){ return this.width * this.scaleMultipler[0]; }
    return w / this.origScale[0];
  }
  /**-------------------------------------------------------------------------
   * > Get the real height on the screen
   * @param {Number|undefined} h - if non argument given, return this window's
   *                               real height in pixel; otherwiase return the
   *                               object's original height.
   */
  realHeight(h = null){
    if(!h){ return this.height * this.scaleMultipler[1]; }
    return h / this.origScale[1];
  }
  /**-------------------------------------------------------------------------
   * > Get the scale value to given width and length
   * @param {Number} ow - the original width
   * @param {Number} oh - the original height 
   * @param {Number} gw - goal width
   * @param {Number} gh - goal height
   * @returns {[Float, Float]} - width(0) and height(1) scale number
   */
  getResizeScale(ow, oh, gw, gh){
    return [gw / this.width / ow, gh / this.height / oh];
  }
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
   * > Apply mask to prevent shown overflow objects
   */
  applyMask(){
    this.maskGraphics = new PIXI.Graphics();
    this.maskGraphics.beginFill(0xffffff);
    this.maskGraphics.drawRect(0, 0, this.realWidth(), this.realHeight());
    this.maskGraphics.endFill();
    this.maskGraphics.static = true;
    this.addChild(this.maskGraphics);
    this.mask = this.maskGraphics;
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
      this.borderSprites[i].setZ(5);
      this.borderSprites[i].static = true;
      this.addChild(this.borderSprites[i]);
    }
  }
  /**-------------------------------------------------------------------------
   * > Draw the hover cursor of skin
   */
  drawSkinCursor(){
    let texture = Graphics.loadTexture(this._skin, Graphics.wSkinCursor);
    this.cursorSprite = new Sprite(texture);
    this.cursorSprite.static = true;
    this.cursorSprite.setZ(4);
    this.cursorSprite.hide();
    this.addChild(this.cursorSprite);
  }
  /**-------------------------------------------------------------------------
   * > Draw the index background of skin
   */
  drawSkinIndex(){
    let texture = Graphics.loadTexture(this._skin, Graphics.wSkinIndexRect);
    this.indexSprite = new Sprite(texture);
    this.indexSprite.setZ(0).setOpacity(0.5).static  = true;
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
    this.buttonSprite.zIndex = 3;
    this.buttonSprite.static = true;
    this.buttonSprite.animationSpeed = 0.25;
    this.buttonSprite.position.set(32,32);
    this.buttonSprite.origX = 32;
    this.buttonSprite.origY = 32;
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
      this.arrowSprites[i].setZ(6);
      this.arrowSprites[i].hide();
      this.arrowSprites[i].static = true;
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
    x += this.spacing; y += this.spacing;
    icon_index = parseInt(icon_index);
    let src_rect = clone(Graphics.IconRect);
    src_rect.x = icon_index % Graphics.IconRowCount * src_rect.width;
    src_rect.y = parseInt(icon_index / Graphics.IconRowCount) * src_rect.height;
    let sx = src_rect.x, sy = src_rect.y, sw = src_rect.width, sh = src_rect.height;
    let bitmap = new Bitmap(0, 0, sw, sh);
    bitmap.blt(Graphics.IconsetImage, sx, sy, sw, sh, 0, 0, sw, sh);
    let texture = new PIXI.Texture.fromCanvas(bitmap.canvas);
    let iconSprite = new Sprite(texture);
    iconSprite.scale.set(this.origScale[0], this.origScale[1]);
    iconSprite.setPOS(this.innerX(x), this.innerY(y));
    iconSprite.setZ(2);
    this.drawnObjects.push(iconSprite);
    this.addChild(iconSprite);
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
    ts.scale.set(this.origScale[0], this.origScale[1]);
    ts.position.set(this.innerX(x), this.innerY(y));
    ts.zIndex = 2;
    this.drawnObjects.push(ts);
    this.addChild(ts);
    this.refresh();
  }
  /*-------------------------------------------------------------------------*/
  resize(w, h){
    w = Math.min(Math.max(1, w), 4096);
    h = Math.min(Math.max(1, h), 4096);
    let childrenPOS = []
    for(let i=0;i<this.children.length;++i){
      if(this.children[i].static){continue;}
      childrenPOS[i] = [this.origX(this.children[i].x), this.origY(this.children[i].y)]
    }

    this.width  = (w / this.scaleMultipler[0]);
    this.height = (h / this.scaleMultipler[1]);
    let blen    = Graphics.wSkinBorder.width / 2;
    let stmpr   = this.origScale;
    let brmpr   = this.getResizeScale(blen, blen, 
                  this.realWidth() - blen, this.realHeight() - blen)
    
    this.borderSpriteUL.scale.set(stmpr[0], stmpr[1]);
    this.borderSpriteUP.scale.set(brmpr[0], stmpr[1]);
    this.borderSpriteUR.scale.set(stmpr[0], stmpr[1]);
    this.borderSpriteBL.scale.set(stmpr[0], stmpr[1]);
    this.borderSpriteBT.scale.set(brmpr[0], stmpr[1]);
    this.borderSpriteBR.scale.set(stmpr[0], stmpr[1]);
    this.borderSpriteLT.scale.set(stmpr[0], brmpr[1]);
    this.borderSpriteRT.scale.set(stmpr[0], brmpr[1]);

    this.borderSpriteUP.x = this.borderSpriteUL.width;
    this.borderSpriteUR.x = this.borderSpriteUP.x + this.borderSpriteUP.width;
    this.borderSpriteLT.y = this.borderSpriteUL.height;
    this.borderSpriteBL.y = this.borderSpriteLT.y + this.borderSpriteLT.height;
    this.borderSpriteBT.setPOS(this.borderSpriteUP.x, this.borderSpriteBL.y);
    this.borderSpriteBR.setPOS(this.borderSpriteUR.x, this.borderSpriteBL.y);
    this.borderSpriteRT.setPOS(this.borderSpriteUR.x, this.borderSpriteLT.y);

    for(let i=0;i<this.arrowSprites.length;++i){
      this.arrowSprites[i].scale.set(stmpr[0], stmpr[1]);
    }
    let offset = [Graphics.wSkinArrowUP.width, Graphics.wSkinArrowUP.height];

    this.arrowUpSprite.setPOS(this.innerX((this.realWidth() - offset[0]) / 2 ), this.innerY(this.spacing));

    this.arrowLeftSprite.setPOS(this.innerX(this.spacing),
                                this.innerY((this.realHeight() - offset[0]) / 2));

    this.arrowDownSprite.setPOS(this.arrowUpSprite.x, 
                                this.innerY(this.realHeight() - this.spacing - offset[1]))

    this.arrowRightSprite.setPOS(this.innerX(this.realWidth() - this.spacing - offset[1]),
                                 this.arrowLeftSprite.y);

    this.cursorSprite.scale.set(stmpr[0], stmpr[1]);
    this.buttonSprite.scale.set(stmpr[0], stmpr[1]);

    for(let i=0;i<this.children.length;++i){
      if(this.children[i].static){continue;}
      this.children[i].scale.set(stmpr[0], stmpr[1]);
      console.log(childrenPOS[i]);
      this.children[i].setPOS(this.innerX(childrenPOS[i][0]), this.innerY(childrenPOS[i][1]));
    }

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
  /**-------------------------------------------------------------------------
   * > Clear children
   */
  clearChildren(){
    this.children = [];
  }
}