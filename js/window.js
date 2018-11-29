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
    if(!isClassOf(x, Number)){return ;}
    super.initialize();
    this._skin  = Graphics.DefaultWindowSkin;
    this.ox = 0; this.oy = 0;
    this.scaleMultipler = Graphics.wSkinIndexRect.width;
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
  /**-------------------------------------------------------------------------
   * > Set Z-Index
   */
  setZ(z){
    this.zIndex = z;
  }
  /**-------------------------------------------------------------------------
   * > Getter functions;
   */
  get realWidth(){return this.width * this.scaleMultipler;}
  get realHeight(){return this.height * this.scaleMultipler;}
  get z(){return this.zIndex;}
  get padding(){return Graphics.padding;}
  get spcaing(){return Graphics.spacing;}
  get origScale(){return [1 / this.width, 1 / this.height];}
  innerX(x){return x / this.scaleMultipler;}
  innerY(y){return y / this.scaleMultipler;}
  getResizeScale(ow, oh, gw, gh){
    return [gw / this.width / ow, gh / this.height / oh];
  }
  /**-------------------------------------------------------------------------
   * > Render window onto page
   */
  render(){
    if(this.rendered){return ;}
    document.body.appendChild(this._content);
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
    this.maskGraphics.drawRect(0, 0, this.realWidth, this.realHeight);
    this.maskGraphics.endFill();
    this.addChild(this.maskGraphics);
    this.mask = this.maskGraphics;
  }
  /**-------------------------------------------------------------------------
   * > Draw the border of skin
   */
  drawSkinBorder(){
    let tUL = Cache.loadTexture(this._skin, Graphics.wSkinBorderUL);
    let tUP = Cache.loadTexture(this._skin, Graphics.wSkinBorderUP);
    let tUR = Cache.loadTexture(this._skin, Graphics.wSkinBorderUR);
    let tBL = Cache.loadTexture(this._skin, Graphics.wSkinBorderBL);
    let tBT = Cache.loadTexture(this._skin, Graphics.wSkinBorderBT);
    let tBR = Cache.loadTexture(this._skin, Graphics.wSkinBorderBR);
    let tLT = Cache.loadTexture(this._skin, Graphics.wSkinBorderLT);
    let tRT = Cache.loadTexture(this._skin, Graphics.wSkinBorderRT);
    
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
    let shows = [true, false, false, false, false, false, false, false]
    for(let i=0;i<this.borderSprites.length;++i){
      this.borderSprites[i].setZ(5);
      this.addChild(this.borderSprites[i]);
      //if(!shows[i]){this.borderSprites[i].hide()}
    }
  }
  /**-------------------------------------------------------------------------
   * > Draw the hover cursor of skin
   */
  drawSkinCursor(){
    let texture = Cache.loadTexture(this._skin, Graphics.wSkinCursor);
    this.cursorSprite = new Sprite(texture);
    this.cursorSprite.setZ(4);
    this.cursorSprite.hide();
    this.addChild(this.cursorSprite);
  }
  /**-------------------------------------------------------------------------
   * > Draw the index background of skin
   */
  drawSkinIndex(){
    let texture = Cache.loadTexture(this._skin, Graphics.wSkinIndexRect);
    this.indexSprite = new Sprite(texture);
    this.indexSprite.setZ(0).setOpacity(0.5);
    this.addChild(this.indexSprite);
  }
  /**-------------------------------------------------------------------------
   * > Draw index pattern of skin
   */
  drawSkinPattern(){
    let texture = Cache.loadTexture(this._skin, Graphics.wSkinPatternRect);
    this.patternSprite = new Sprite(texture);
    this.patternSprite.setZ(1).setOpacity(0.5);
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
      textureArray.push(Cache.loadTexture(this._skin, srect));
    }
    this.buttonSprite = new PIXI.extras.AnimatedSprite(textureArray);
    this.buttonSprite.zIndex = 3;
    this.addChild(this.buttonSprite);
  }
  /**-------------------------------------------------------------------------
   * > Draw scroll arrows of skin
   */
  drawSkinArrows(){
    let tAU = Cache.loadTexture(this._skin, Graphics.wSkinArrowUP);
    let tAD = Cache.loadTexture(this._skin, Graphics.wSkinArrowBT);
    let tAL = Cache.loadTexture(this._skin, Graphics.wSkinArrowLT);
    let tAR = Cache.loadTexture(this._skin, Graphics.wSkinArrowRT);
    this.arrowDownSprite  = new Sprite(tAD);
    this.arrowUpSprite    = new Sprite(tAU);
    this.arrowLeftSprite  = new Sprite(tAL);
    this.arrowRightSprite = new Sprite(tAR);
    this.arrowSprites = [
      this.arrowDownSprite,  this.arrowLeftSprite,
      this.arrowRightSprite, this.arrowUpSprite
    ]
    for(let i=0;i<4;++i){
      this.arrowSprites[i].setZ(3);
      this.arrowSprites[i].hide();
    }
    this.addChild(this.arrowDownSprite,  this.arrowLeftSprite, 
                  this.arrowRightSprite, this.arrowUpSprite);
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
    let bitmap = new Bitmap(0,0,this.realWidth,this.realHeight);
    bitmap.blt(Graphics.IconsetImage, sx, sy, sw, sh, x, y, sw, sh);
    let texture = new PIXI.Texture.fromCanvas(bitmap.canvas);
    let iconSprite = new Sprite(texture);
    iconSprite.scale.set(this.origScale[0], this.origScale[1]);
    iconSprite.setPOS(this.innerX(x), this.innerY(y));
    iconSprite.setZ(3);
    this.addChild(iconSprite);
    return iconSprite;
  }
  /*-------------------------------------------------------------------------*/
  resize(w, h){
    this.width  = (w / this.scaleMultipler);
    this.height = (h / this.scaleMultipler);
    let blen    = Graphics.wSkinBorder.width / 2;
    let stmpr   = this.origScale;
    let brmpr   = this.getResizeScale(blen, blen, 
                  this.realWidth - blen, this.realHeight - blen)
    
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

    for(let i=0;i<this.arrowSprites;++i){
      this.arrowSprites[i].scale.set(stmpr[0], stmpr[1]);
    }

    this.cursorSprite.scale.set(stmpr[0], stmpr[1]);
    this.buttonSprite.scale.set(stmpr[0], stmpr[1]);

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