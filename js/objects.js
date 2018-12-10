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
  initialize(x, y, width, height){
    super.initialize(x, y, width, height);
    this.maxProgress     = 1;
    this.currentProgress = 0;
    this.createSprite();
    this.drawBorderSprite();
    this.setZ(1);
  }
  /*-------------------------------------------------------------------------*/
  get borderWidth(){return 4;}
  /*-------------------------------------------------------------------------*/
  resize(w, h){
    super.resize(w, h);
    this.clear();
    this.drawBorderSprite();
    this.refresh();
  }
  /*-------------------------------------------------------------------------*/
  refresh(){
    if(!this.indexSprite){return ;}
    this.indexSprite.clear();
    this.indexSprite.beginFill(0x1060e0);
    let dw = (this.width - this.borderWidth) * (this.currentProgress / this.maxProgress);
    this.indexSprite.drawRect(0, 0, dw, this.height - this.borderWidth);
    this.indexSprite.endFill();
  }
  /*-------------------------------------------------------------------------*/
  createSprite(){
    this.indexSprite  = new PIXI.Graphics();
    this.borderSprite = new PIXI.Graphics();
    this.indexSprite.setPOS(this.borderWidth, this.borderWidth);
    this.addChild(this.indexSprite);
    this.addChild(this.borderSprite);
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
  setMaxProgress(n){
    this.maxProgress = n;
    this.refresh();
  }
  /*-------------------------------------------------------------------------*/
  setProgress(n){
    this.currentProgress = n;
    this.refresh();
  }
  /*-------------------------------------------------------------------------*/
  drawBorderSprite(){
    if(!this.borderSprite){return ;}
    this.borderSprite.beginFill(0xffffff);
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