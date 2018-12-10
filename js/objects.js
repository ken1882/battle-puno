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
    this.indexSprite.beginFill(Graphics.color.DeepSkyBlue);
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
    this.borderSprite.beginFill(Graphics.color.White);
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
/**----------------------------------------------------------------------------
 * > A bar that allowed to drag with mouse to adjust values
 * @class
 * @extends SpriteCanvas
 */
class Sprite_DragBar extends SpriteCanvas{
  /**------------------------------------------------------------------------
   * @param {Number} x
   * @param {Number} y
   * @param {Number} width
   * @param {Number} minn  - minimum value
   * @param {Number} maxn  - maximum value
   * @param {Number} initn - initial value
   */
  constructor(){
    super();
    this.initialize.apply(this, arguments);
  }
  /**-------------------------------------------------------------------------
   * @property {function} handler - the function to call when refreshed
   *                                (value changed)
   */
  initialize(x, y, width, minn = 0, maxn = 100, initn = null){
    super.initialize(x, y, width, this.height);
    if(!initn){initn = (minn + maxn) / 2;}
    this.valuePeak = [minn, maxn];
    this.value     = initn;
    this.handler   = null;
    this.createDragButton();
    this.createDragBar();
    this.refresh();
  }
  /*-------------------------------------------------------------------------*/
  get height(){return 30;}
  get barHeight(){return 4;}
  get barWidth(){return this.width - this.dragButton.width;}
  get xOffset(){return this.dragButton.width / 2;}
  /*-------------------------------------------------------------------------*/
  get valuedWidth(){
    return this.barWidth * this.value / (this.valuePeak[1] - this.valuePeak[0]);
  }
  /*-------------------------------------------------------------------------*/
  refresh(){
    this.updateButtonLocation();
    this.drawBar();
    if(this.handler){this.handler.call(this.value);}
  }
  /*-------------------------------------------------------------------------*/
  createDragButton(){
    this.dragButton = (new Sprite()).drawIcon(184,0,0);
    let offset = 2;
    this.dragButton.y = (this.height - this.barHeight) / 2 - (this.dragButton.height / 2) + offset;
    this.dragButton.setZ(1);
    this.addChild(this.dragButton);
    this.dragButton.interactive = true;
    this.dragButton.on('mousedown',  this.onDragStart.bind(this));
    this.dragButton.on('touchstart', this.onDragStart.bind(this));
    this.dragButton.on('mouseup',    this.onDragEnd.bind(this));
    this.dragButton.on('mouseupoutside', this.onDragEnd.bind(this));
    this.dragButton.on('touched',        this.onDragEnd.bind(this));
    this.dragButton.on('touchedoutside', this.onDragEnd.bind(this));
    this.dragButton.on('mousemove', this.onDragMove.bind(this));
    this.dragButton.on('touchmove', this.onDragMove.bind(this));
  }
  /*-------------------------------------------------------------------------*/
  onDragStart(event){
    this.dragButton.dragging = true;
  }
  /*-------------------------------------------------------------------------*/
  onDragEnd(event){
    this.dragButton.dragging = false;
  }
  /*-------------------------------------------------------------------------*/
  onDragMove(event){
    if(!this.dragButton.dragging){return ;}
    let offset = this.xOffset;
    let dx = event.data.global.x - this.x - offset;
    this.dragButton.x = Math.min(Math.max(0, dx), this.barWidth);
    this.value = (this.valuePeak[1] - this.valuePeak[0]) * (this.dragButton.x / this.dragBar.width);
    this.refresh();
  }
  /*-------------------------------------------------------------------------*/
  createDragBar(){
    this.dragBar   = new PIXI.Graphics();
    this.dragBar.x = this.xOffset;
    this.dragBar.y = (this.height - this.barHeight) / 2;
    this.addChild(this.dragBar);
  }
  /*-------------------------------------------------------------------------*/
  updateButtonLocation(){
    this.dragButton.x = this.dragBar.x + this.valuedWidth - this.dragButton.width / 2;
  }
  /*-------------------------------------------------------------------------*/
  drawBar(){
    this.dragBar.clear();
    this.dragBar.beginFill(Graphics.color.DeepSkyBlue);
    this.dragBar.drawRect(0, 0, this.valuedWidth, this.barHeight);
    this.dragBar.endFill();
    this.dragBar.beginFill(Graphics.color.Black);
    this.dragBar.drawRect(this.valuedWidth, 0, this.barWidth - this.valuedWidth, this.barHeight);
    this.dragBar.endFill();
  }
  /*-------------------------------------------------------------------------*/
}
