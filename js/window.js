/**
 * The Superclass of all windows within the game.
 * 
 * @class Window_Base
 * @constructor 
 */
class Window_Base{
  /**-------------------------------------------------------------------------
   * @constructor
   * @memberof Window_Base
   */
  constructor(){
    this.initialize.apply(this, arguments);
  }
  /**-------------------------------------------------------------------------
   * > Object initialization
   * @memberof Window_Base
   * @property {Number} ox - Display origin x
   * @property {Number} oy - Display origin y
   * @property {String} _skin - path to window skin image
   * @property {Array.<Bitmap>} _children - child bitmaps
   * @property {Object} _renderedObjects - information of rendered stuffs
   */
  initialize(x = 0, y = 0, width = 300, height = 150){
    this.ox = 0; this.oy = 0;
    this._skin  = Graphics.DefaultWindowSkin;
    this._children = [];
    this._renderedObjects = [];
    this.createContents();
    this.resize(width, height);
    this.applySkin();
    this.moveto(x, y);
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
   * > Create base content canva
   */
  createContents(){
    this._content = new Bitmap(this.x, this.y, this.width, this.height)
    this._children.push(this._content);
  }
  /**-------------------------------------------------------------------------
   * > Move to position in app
   */
  moveto(x, y){
    this._x = x;
    this._y = y;
    this.real_x = this._x + Graphics.app.x;
    this.real_y = this._y + Graphics.app.y;
    this.relocateChildren();
  }
  /**-------------------------------------------------------------------------
   * > Move to position in app
   */
  setZ(z){
    this.zIndex = z;
    this.backBitmap.setZ(z);
    this._content.setZ(z+1);
    this.borderBitmap.setZ(z+3);
    
  }
  /**-------------------------------------------------------------------------
   * > Resize width/height
   */
  resize(w, h){
    this._width  = w;
    this._height = h;
    this._content.resize(w, h);
    this.applySkin();
  }
  /**-------------------------------------------------------------------------
   * > Getter functions;
   */
  get x(){return this._x;}
  get y(){return this._y;}
  get z(){return this.zIndex;}
  get width(){return this._width;}
  get height(){return this._height;}
  get children(){return this._children;}
  get padding(){return Graphics._padding;}
  get spcaing(){return Graphics._spacing;}
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
    this.drawSkinPattern();
    this.drawSkinIndex();
    this.drawSkinArrows();
    this.drawSkinCursor();
    this.drawSkinButton();
    this.drawSkinBorder();
    this.relocateChildren();
  }
  /**-------------------------------------------------------------------------
   * > Draw the border of skin
   */
  drawSkinBorder(){
    let skin_image = Graphics.windowSkins[this._skin];
    
    this.borderBitmap  = new Bitmap(0, 0, this.width, this.height)

    // Slicing Source Rect in full image
    var src_rect = new PIXI.Rectangle(64, 0, 64, 64)

    // 8 Rects of upper/down-left/border/right and right/left border
    var ulr = Graphics.wSkinBorderUL;
    var upr = Graphics.wSkinBorderUP;
    var urr = Graphics.wSkinBorderUR;
    var ltr = Graphics.wSkinBorderLT;
    var rtr = Graphics.wSkinBorderRT;
    var blr = Graphics.wSkinBorderBL;
    var btr = Graphics.wSkinBorderBT;
    var brr = Graphics.wSkinBorderBR;

    // x and y start location of upper/down-left/right image
    var ulx = 0, uly = 0, urx = this.width - urr.width, ury = 0;
    var dlx = 0, dly = this.height - blr.height;
    var drx = this.width - brr.width, dry = this.height - brr.height;
    
    // x/y start location and scale pixel of upper/down/left/right border image
    var usr = new PIXI.Rectangle(ulr.width, ulr.y, this.width - 32, 16);
    var dsr = new PIXI.Rectangle(blr.width, this.height - blr.height, this.width - 32, 16);
    var lsr = new PIXI.Rectangle(0, ulr.y + ulr.height, 16, this.height - 32);
    var rsr = new PIXI.Rectangle(this.width - urr.width, urr.y + urr.height, 16, this.height - 32);

    // Draw upper-left/right and down-left/right corner
    this.borderBitmap.blt(skin_image, ulr.x, ulr.y, ulr.width, ulr.height, ulx, uly, ulr.width, ulr.height);
    this.borderBitmap.blt(skin_image, urr.x, urr.y, urr.width, urr.height, urx, ury, urr.width, urr.height);
    this.borderBitmap.blt(skin_image, blr.x, blr.y, blr.width, blr.height, dlx, dly, blr.width, blr.height);
    this.borderBitmap.blt(skin_image, brr.x, brr.y, brr.width, urr.height, drx, dry, brr.width, brr.height);

    // Draw Up/Down/Left/Right Border
    this.borderBitmap.blt(skin_image, upr.x, upr.y, upr.width, upr.height, usr.x, usr.y, usr.width, usr.height);
    this.borderBitmap.blt(skin_image, btr.x, btr.y, btr.width, btr.height, dsr.x, dsr.y, dsr.width, dsr.height);
    this.borderBitmap.blt(skin_image, ltr.x, ltr.y, ltr.width, ltr.height, lsr.x, lsr.y, lsr.width, lsr.height);
    this.borderBitmap.blt(skin_image, rtr.x, rtr.y, rtr.width, rtr.height, rsr.x, rsr.y, rsr.width, rsr.height);

    this._children.push(this.borderBitmap);
  }
  /**-------------------------------------------------------------------------
   * > Draw the hover cursor of skin
   */
  drawSkinCursor(){
    let skin_image = Graphics.windowSkins[this._skin];
    var srect = new PIXI.Rectangle(64, 64, 32, 32);
    this.cursorBitmap = new Bitmap(0, 0, srect.width, srect.height)
    this.cursorBitmap.blt(skin_image, srect.x, srect.y, srect.width, srect.height, 0, 0, srect.width, srect.height);
    this._children.push(this.cursorBitmap);
    this.cursorBitmap.hide();
  }
  /**-------------------------------------------------------------------------
   * > Draw the index background of skin
   */
  drawSkinIndex(){
    let skin_image = Graphics.windowSkins[this._skin];
    var srect = new PIXI.Rectangle(0,0,64,64);
    this.backBitmap.blt(skin_image, srect.x, srect.y, srect.width, srect.height, 0, 0, this.width, this.height);
  }
  /**-------------------------------------------------------------------------
   * > Draw index pattern of skin
   */
  drawSkinPattern(){
    let skin_image = Graphics.windowSkins[this._skin];
    this.backBitmap = new Bitmap(0, 0, this.width, this.height)
    this.backBitmap.setOpacity(0.5);
    var srect = new PIXI.Rectangle(0,64,64,64);
    this.backBitmap.blt(skin_image, srect.x, srect.y, srect.width, srect.height, 0, 0, this.width, this.height);
    this._children.push(this.backBitmap);
  }
  /**-------------------------------------------------------------------------
   * > Draw continue icon of skin
   */
  drawSkinButton(){
    let skin_image = Graphics.windowSkins[this._skin];
    let srect      = new PIXI.Rectangle(96, 64, 32, 32);
    this.buttonBitmap = []
    for(let i=0;i<4;++i){
      this.buttonBitmap = new Bitmap(0, 0, 8, 8);
      new Bitmap(0, 0, )
    }
  }
  /**-------------------------------------------------------------------------
   * > Draw scroll arrows of skin
   */
  drawSkinArrows(){

  }
  /**-------------------------------------------------------------------------
   * > Draw Icon in Iconset
   */
  drawIcon(icon_index, x, y){
    icon_index = parseInt(icon_index);
    let src_rect = Object.assign({}, Graphics.IconRect);
    src_rect.x = icon_index % Graphics.IconRowCount * src_rect.width;
    src_rect.y = parseInt(icon_index / Graphics.IconRowCount) * src_rect.height;
    let sx = src_rect.x, sy = src_rect.y, sw = src_rect.width, sh = src_rect.height;
    // this._renderedObjects.push([Graphics.IconsetImage, sx, sy, sw, sh, x, y, sw, sh]);
    console.log(sx, sy, sw, sh, x, y, sw, sh);
    this._content.blt(Graphics.IconsetImage, sx, sy, sw, sh, x, y, sw, sh);
  }
  /**-------------------------------------------------------------------------
   * > Relocate children sprite after window moved
   */
  relocateChildren(){
    this._content.setPOS(this.x, this.y)
    if(this.children.length == 0){return;}
    this.cursorBitmap.setPOS(this.x, this.y);
    this.borderBitmap.setPOS(this.x, this.y);
    this.backBitmap.setPOS(this.x, this.y);
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
    return this._content.isDisposed();
  }
  /**-------------------------------------------------------------------------
   * > Clear children
   */
  clearChildren(){
    this._children = [];
  }
}