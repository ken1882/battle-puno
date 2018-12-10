/**----------------------------------------------------------------------------
 * > Object that shows load progress
 * @class
 * @extends SpriteCanvas
 */
class Sprite_ProgressBar extends SpriteCanvas{
  /*-------------------------------------------------------------------------*/
  constructor(){
    super();
    this.initialize.apply(this, arguments);
  }
  /*-------------------------------------------------------------------------*/
  initialize(x, y, width, height, total = 1){
    super.initialize(x, y, width, height);
    this.createSprite();
    this.drawBorderSprite();
    this.setZ(1);
  }
  /*-------------------------------------------------------------------------*/
  get borderWidth(){return 12;}
  /*-------------------------------------------------------------------------*/
  resize(w, h){
    super.resize(w, h);
    this.clear();
    this.drawBorderSprite();
  }
  /*-------------------------------------------------------------------------*/
  createSprite(){
    this.indexSprite  = new PIXI.Graphics();
    this.borderSprite = new PIXI.Graphics();
  }
  /*-------------------------------------------------------------------------*/
  clear(){
    if(!this.borderSprite){return ;}
    this.borderSprite.destroy({children: true});
    this.borderSprite = null;
    this.createSprite();
    this.drawBorderSprite();
  }
  /*-------------------------------------------------------------------------*/
  drawBorderSprite(){
    if(!this.borderSprite){return ;}
    this.borderSprite.beginFill(0x0);
    // Draw upper border
    this.borderSprite.drawRect(0, 0, this._width, this.borderWidth);
    // Draw bottom border
    this.borderSprite.drawRect(0, this._height - this.borderWidth, this._width, this.borderWidth);
    // Draw left border;
    this.borderSprite.drawRect(0, 0, this.borderWidth, this.height);
    // Draw right border;
    this.borderSprite.drawRect(this._width - this.borderWidth, 0, this.borderWidth, this.height);
    this.borderSprite.endFill(); 
  }
  // last work here: progress bar
  /*-------------------------------------------------------------------------*/
}