/**----------------------------------------------------------------------------
 * > Object that shows load progress
 * @class
 * @extends SpriteCanvas
 */
class Sprite_ProgressBar extends SpriteCanvas{
  /*-------------------------------------------------------------------------*/
  constructor(x, y, width, height){
    super(x, y, width, height);
    this.maxProgress     = 1;
    this.currentProgress = 0;
    this._borderWidth    = 4;
    this.fillHorz        = (width > height);
    this.changeColor(Graphics.color.DeepSkyBlue);
    this.createSprite();
    this.drawBorderSprite();
    this.setZ(1);
  }
  /*-------------------------------------------------------------------------*/
  get borderWidth(){return this._borderWidth;}
  get color(){return this._color;}
  /*-------------------------------------------------------------------------*/
  changeBorderWidth(w){
    this._borderWidth = w;
    this.drawBorderSprite();
    this.refresh();
  }
  /*-------------------------------------------------------------------------*/
  changeColor(c){
    this._color = c;
    this.refresh();
  }
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
    this.indexSprite.beginFill(this.color);
    if(this.fillHorz){
      let dw = (this.width - this.borderWidth * 2) * (this.currentProgress / this.maxProgress);
      this.indexSprite.drawRect(0, 0, dw, this.height - this.borderWidth);
    }
    else{
      let dh = (this.height - this.borderWidth * 2) * (this.currentProgress / this.maxProgress);
      this.indexSprite.drawRect(0, 0, this.width - this.borderWidth, dh);
    }
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
    this.borderSprite.clear();
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
 * @property {function} handler - the function to call when refreshed
 *                                (value changed)
 */
class Sprite_DragBar extends SpriteCanvas{
  /**------------------------------------------------------------------------
   * @param {Number} x
   * @param {Number} y
   * @param {Number} width
   * @param {Number} height
   * @param {Number} minn  - minimum value
   * @param {Number} maxn  - maximum value
   * @param {Number} initn - initial value
   */
  constructor(x, y, width, height = 30, minn = 0, maxn = 100, initn = null){
    if(!height){height = 30;}
    if(!minn){minn = 0;}
    if(!maxn){maxn = 100;}
    super(x, y, width, height);
    if(!initn){initn = (minn + maxn) / 2;}
    this.valuePeak = [minn, maxn];
    this.value     = initn;
    this.handler   = null;
    this.fillColor = Graphics.color.DeepSkyBlue;
    this.createDragButton();
    this.createDragBar();
    this.refresh();
  }
  /*-------------------------------------------------------------------------*/
  get barHeight(){return 4;}
  get barWidth(){return this.width - this.dragButton.width;}
  get xOffset(){return this.dragButton.width / 2;}
  /*-------------------------------------------------------------------------*/
  get valuedWidth(){
    return this.barWidth * (this.value - this.valuePeak[0]) / (this.valuePeak[1] - this.valuePeak[0]);
  }
  /*-------------------------------------------------------------------------*/
  refresh(){
    this.updateButtonLocation();
    this.drawBar();
    if(this.handler){this.handler(this.value);}
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
    let dx = event.data.global.x - this.worldTransform.tx - offset;
    this.dragButton.x = Math.min(Math.max(0, dx), this.barWidth);
    this.value = this.valuePeak[0] + (this.valuePeak[1] - this.valuePeak[0]) * (this.dragButton.x / this.dragBar.width);
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
  setValue(v){
    this.value = Math.min(this.valuePeak[1], Math.max(this.valuePeak[0], v));
    this.refresh();
  }
  /*-------------------------------------------------------------------------*/
  updateButtonLocation(){
    this.dragButton.x = this.dragBar.x + this.valuedWidth - this.dragButton.width / 2;
  }
  /*-------------------------------------------------------------------------*/
  drawBar(){
    this.dragBar.clear();
    this.dragBar.beginFill(this.fillColor);
    this.dragBar.drawRect(0, 0, this.valuedWidth, this.barHeight);
    this.dragBar.endFill();
    this.dragBar.beginFill(Graphics.color.Black);
    this.dragBar.drawRect(this.valuedWidth, 0, this.barWidth - this.valuedWidth, this.barHeight);
    this.dragBar.endFill();
  }
  /*-------------------------------------------------------------------------*/
  changeColor(c){
    this.fillColor = c;
    this.refresh();
  }
  /*-------------------------------------------------------------------------*/
}
/**
 * This object represent the deck durnig the game
 */
class Game_Deck{
  /**
   * @constructor
   * @param {boolean} extraCardsEnabled
   */
  constructor(extraCardsEnabled){
    this.extraCardsEnabled = extraCardsEnabled;
    this.deck = [];
    if(this.extraCardsEnabled){this.totalCardsNumber = 116;}
    else{this.totalCardsNumber = 108;}
  }
  /*-------------------------------------------------------------------------*/
  get size(){return this.deck.length;}
  /**-------------------------------------------------------------------------
   * Shuffle the deck
   */ 
  shuffle(){
    this.deck.shuffle();
    return this;
  }
  /**-------------------------------------------------------------------------
   * Restore all cards
   */
  restore(){

  }
  /*-------------------------------------------------------------------------*/
  push(){

  }
  /*-------------------------------------------------------------------------*/
  pop(){

  }
  /*-------------------------------------------------------------------------*/
  insert(){

  }
  /*-------------------------------------------------------------------------*/
  remove(){

  }
  /*-------------------------------------------------------------------------*/
  top(){
    return this.deck[this.size - 1];
  }
  /*-------------------------------------------------------------------------*/
  /**
   * Get the card sprite at the top of the deck
   * @param {Boolean} covered - Return the card cover if true
   */
  getTopImage(covered = false){
    if(covered){
      return Graphics.CardBack;
    }

  }
  /*-------------------------------------------------------------------------*/
}
/**
 * The basic puno card object
 */
class Game_Card extends SpriteCanvas{
  /**
   * @constructor
   * @param {Number} cardId - Id of the card
   */
  constructor(cardId){
    super(0, 0, 212, 300);
    this.cardId = cardId;
  }
  /*-------------------------------------------------------------------------*/
  loadSprite(){
    
  }
  /*-------------------------------------------------------------------------*/
}
/**
 * The player object, also including NPC
 */
class Game_Player{

  constructor(){
    this.hands = [];
  }

  
}