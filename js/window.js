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
   */
  initialize(x = 0, y = 0, width = 300, height = 150){
    this._skin = Graphics.DefaultWindowSkin;
    this._children = [];
    this.createContents();
    this.moveto(x, y);
    this.resize(width, height);
    this.applySkin();
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
   * > Resize width/height
   */
  resize(w, h){
    this._width  = w;
    this._height = h;
    this._content.width  = w;
    this._content.height = h;
    this.applySkin();
  }
  /**-------------------------------------------------------------------------
   * Getter functions;
   */
  get x(){return this._x;}
  get y(){return this._y;}
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
    var ulr = new PIXI.Rectangle(src_rect.x,    src_rect.y,    16, 16)
    var ubr = new PIXI.Rectangle(src_rect.x+16, src_rect.y,    32, 16)
    var urr = new PIXI.Rectangle(src_rect.x+48, src_rect.y,    16, 16)
    var lbr = new PIXI.Rectangle(src_rect.x,    src_rect.y+16, 16, 32)
    var rbr = new PIXI.Rectangle(src_rect.x+48, src_rect.y+16, 16, 32)
    var dlr = new PIXI.Rectangle(src_rect.x,    src_rect.y+48, 16, 16)
    var dbr = new PIXI.Rectangle(src_rect.x+16, src_rect.y+48, 32, 16)
    var drr = new PIXI.Rectangle(src_rect.x+48, src_rect.y+48, 16, 16)

    // x and y start location of upper/down-left/right image
    var ulx = 0, uly = 0, urx = this.width - urr.width, ury = 0;
    var dlx = 0, dly = this.height - dlr.height;
    var drx = this.width - drr.width, dry = this.height - drr.height;
    
    // x/y start location and scale pixel of upper/down/left/right border image
    var usr = new PIXI.Rectangle(ulr.width, ulr.y, this.width - 32, 16);
    var dsr = new PIXI.Rectangle(dlr.width, this.height - dlr.height, this.width - 32, 16);
    var lsr = new PIXI.Rectangle(0, ulr.y + ulr.height, 16, this.height - 32);
    var rsr = new PIXI.Rectangle(this.width - urr.width, urr.y + urr.height, 16, this.height - 32);

    // Draw upper-left/right and down-left/right corner
    this.borderBitmap.blt(skin_image, ulr.x, ulr.y, ulr.width, ulr.height, ulx, uly, ulr.width, ulr.height);
    this.borderBitmap.blt(skin_image, urr.x, urr.y, urr.width, urr.height, urx, ury, urr.width, urr.height);
    this.borderBitmap.blt(skin_image, dlr.x, dlr.y, dlr.width, dlr.height, dlx, dly, dlr.width, dlr.height);
    this.borderBitmap.blt(skin_image, drr.x, drr.y, drr.width, urr.height, drx, dry, drr.width, drr.height);

    // Draw Up/Down/Left/Right Border
    this.borderBitmap.blt(skin_image, ubr.x, ubr.y, ubr.width, ubr.height, usr.x, usr.y, usr.width, usr.height);
    this.borderBitmap.blt(skin_image, dbr.x, dbr.y, dbr.width, dbr.height, dsr.x, dsr.y, dsr.width, dsr.height);
    this.borderBitmap.blt(skin_image, lbr.x, lbr.y, lbr.width, lbr.height, lsr.x, lsr.y, lsr.width, lsr.height);
    this.borderBitmap.blt(skin_image, rbr.x, rbr.y, rbr.width, rbr.height, rsr.x, rsr.y, rsr.width, rsr.height);

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
    let sx = src_rect.x, sy = src_rect.width, sw = src_rect.width, sh = src_rect.height;
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
   * > Clear children
   */
  clearChildren(){
    this._children = [];
  }
}