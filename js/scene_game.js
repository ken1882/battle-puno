/**-------------------------------------------------------------------------
 * The main scene during gameplay
 * @class Scene_Game
 * @property {String} bgiName - Path to background image
 * @property {String} bgmName - Path to background music
 * @property {String} meName  - Path to music effect (victory theme)
 * @property {Number} cardSpritePoolSize - Object pool size of card sprite
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
    this.createHuds();
    this.createHitSprite();
    this.createDimBack();
    this.createScoreBoard();
    this.createNextButton();
  }
  /*-------------------------------------------------------------------------*/
  start(){
    super.start();
    this.selectionWindow.render();
    this.nextButton.render();
    this.dimBack.render();
    Graphics.renderSprite(this.infoSprite);
    EventManager.setTimeout(this.gameStart.bind(this), 90);
  }
  /*-------------------------------------------------------------------------*/
  playStageBGM(){
    if(!this.bgmName){
      setTimeout(this.playStageBGM.bind(this), 500);
    }
    else{Sound.fadeInBGM(this.bgmName, 500);}
  }
  /*-------------------------------------------------------------------------*/
  gameStart(){
    this.playStageBGM();
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
  randomBackground(draw=false){
    this.bgiName = Graphics["Background" + randInt(0, 3)];
    if(draw){
      if(this.backgroundImage){
        this.backgroundImage.texture = Graphics.loadTexture(this.bgiName);
      }
      else{this.createBackground();}
    }
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
      this.bgmName = Sound.getStageTheme(amb_id);
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
    this.deckSprite.on('mousemove', ()=>{this.updateHintWindow()});
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
    this.discardPile.on('mousemove', ()=>{this.updateHintWindow()});
    this.discardPile.on("mouseout",()=>{this.hideHintWindow()});
    if(this.game.gameMode != Mode.TRADITIONAL){
      this.createDamageText();
    }
    Graphics.renderSprite(this.discardPile);
  }
  /*-------------------------------------------------------------------------*/
  createDamageText(){
    let font = clone(Graphics.DefaultFontSetting);
    font.fill = Graphics.color.Crimson;
    let dx = Graphics.spacing / 2;
    let dy = this.discardPile.height - Graphics.lineHeight;
    let txt = this.discardPile.drawText(dx, dy, '0', font);
    this.discardPile.damageText = txt;
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
      let ssw = (i == 0) ? 500 : sw;
      this.handCanvas.push(new SpriteCanvas(0, 0, ssw, sh));
      this.handCanvas[i].playerIndex = i;
      this.handCanvas[i].activate().render();
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
  getCollisionRect(sp){
    let rect = new Rect(sp.hitArea);
    [rect.x, rect.y] = [sp.x, sp.y]
    return rect;
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
    this.infoSprite = new SpriteCanvas(0, 0, 350, 24);
    let font = clone(Graphics.DefaultFontSetting);
    font.fill = 0x000000;
    let bk  = this.infoSprite.fillRect(0, 0, 350, 24, Graphics.color.White);
    bk.setOpacity(0.5).hide();
    let txt = this.infoSprite.drawText(Graphics.spacing, 0, '', font);
    this.infoSprite.textSprite = txt;
    this.infoSprite.backSprite = bk;
  }
  /*-------------------------------------------------------------------------*/
  createHuds(){
    if(this.game.gameMode == Mode.TRADITIONAL){return ;}
    this.hudCanvas = [];
    for(let i in this.handCanvas){
      i = parseInt(i);
      let side = i % 4;
      let hcs = this.handCanvas[i];
      let cw = Math.max(hcs.width, hcs.height), ch = 30;
      let cx = hcs.x, cy = hcs.y;
      if(!(side&1)){cy += + Graphics.spacing / 2;}
      if(side == 0){
        cx += Graphics.IconRect.width + Graphics.spacing;
        cy += hcs.height - ch + Graphics.spacing/2;
      }
      else if(side == 3){
        cx += hcs.width - ch;
      }
      if(!!(side&1)){[cw, ch] = [ch,cw]}
      let canvas = new SpriteCanvas(cx, cy, cw, ch);
      let font = clone(Graphics.DefaultFontSetting);
      font.fontSize = 16;
      let txt = canvas.drawText(Graphics.spacing/2, 0, "HP ", font);
      let bx = !(side&1) ? txt.width: 0;
      let by = !(side&1) ? 0: txt.height;
      let bw = !(side&1) ? (hcs.width - Graphics.spacing*2 - txt.width) :  20;
      let bh = !(side&1) ?  20 : (hcs.height - Graphics.spacing - txt.height);
      if(!(side&1)){
        bx += Graphics.spacing/2;
        if(side == 0){bw -= (Graphics.IconRect.width + Graphics.padding);}
      }

      let bar = new Sprite_ProgressBar(bx, by, bw, bh)
      bar.changeColor(Graphics.color.LightGreen);
      bar.setMaxProgress(GameManager.initHP);
      bar.setProgress(GameManager.initHP);
      bar.on('mouseover', ()=>{
        this.showHintWindow(null, null, this.getPlayerHPText(i));
      });
      bar.on('mousemove', ()=>{
        this.updateHintWindow();
      });
      bar.on('mouseout', ()=>{
        this.hideHintWindow();
      });
      bar.activate();

      canvas.hpBar = bar;
      canvas.addChild(bar);
      canvas.show().setZ(0x1a).render();
      this.hudCanvas.push(canvas);
    }
  }
  /*-------------------------------------------------------------------------*/
  createHitSprite(){
    let sp = new SpriteCanvas(0, 0, 300, 300);
    let rect = sp.fillRect(0,0,300,300, Graphics.color.White);
    sp.effectRect = rect;
    sp.hide().setZ(0x30).render();
    this.hitEffectSprite = sp;
  }
  /*-------------------------------------------------------------------------*/
  createScoreBoard(){
    this.resultWindow = new Window_Scoreboard();
    this.resultWindow.setZ(0x50).hide().render();
  }
  /*-------------------------------------------------------------------------*/
  createNextButton(){
    this.nextButton = new Window_Back(0, 0, this.onActionNext.bind(this), Vocab.Next);
    let wx = Graphics.width - this.nextButton.width - Graphics.padding;
    let wy = Graphics.padding;
    this.nextButton.setPOS(wx, wy).setZ(0x50).hide();
  }
  /*-------------------------------------------------------------------------*/
  createDimBack(){
    this.dimBack = new Sprite(0, 0, Graphics.width, Graphics.height);
    this.dimBack.fillRect(0, 0, Graphics.width, Graphics.height);
    this.dimBack.setOpacity(0.7).setZ(0x4f).hide();
  }
  /*-------------------------------------------------------------------------*/
  displayHitEffect(i){
    let sx = this.handCanvas[i].x;
    let sy = this.handCanvas[i].y;
    let sw = this.handCanvas[i].width;
    let sh = this.handCanvas[i].height;
    let rect = this.hitEffectSprite.effectRect;
    rect.clear();
    rect.beginFill(Graphics.color.White);
    rect.drawRect(0, 0, sw, sh);
    rect.endFill();
    this.hitEffectSprite.setPOS(sx, sy).resize(sw, sh);
    this.hitEffectSprite.setOpacity(0.01).show();
    this.hitEffectSprite.flag = true;
  }
  /*-------------------------------------------------------------------------*/
  getPlayerHPText(i){
    let v = 0;
    if(this.players){v = String(this.players[i].hp)}
    return v + ' / ' + GameManager.initHP + '; score: ' + this.players[i].score;
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
    console.log("Arrange " + index);
    for(let i in cur_player.hand){
      let dx = 0, dy = 0;
      let card = cur_player.hand[i];
      let next_index = (side <= 1) ? i : cardSize - i - 1;
      if(!(side&1)){
        dx = base_pos + cardWidth * stackPortion * next_index + cardWidth / 2;
        dy = (side == 0) ? canvasHeight - cardHeight + cardHeight / 2 : cardHeight / 2;
        if(this.game.gameMode != Mode.TRADITIONAL){
          if(side == 0){dy -= 30;}
          else{dy += 30;}
        }
      }
      else{
        dy = base_pos + cardWidth * stackPortion * next_index + cardWidth / 2;
        dx = (side == 1) ? Graphics.spacing + cardHeight/2: canvasHeight - cardHeight + cardHeight / 2;
        if(this.game.gameMode != Mode.TRADITIONAL){
          if(side == 1){dx += 30;}
          else{dx -= 30;}
        }
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
      if(card.sprite.parent && card.sprite.parent != hcs){
        card.sprite.parent.removeChild(card.sprite);
        hcs.addChild(card.sprite);
        card.sprite.setPOS(canvasWidth/2,canvasHeight/2);
      }
      card.sprite.setZ(0x11 + parseInt(i));
      card.sprite.rotateDegree(deg);
      card.sprite.moveto(dx, dy);
      card.lastZ = card.sprite.z; card.lastY = dy;
      if(index == 0){
        this.detachCardInfo(card);
        this.attachCardInfo(card);
      }
    }
    EventManager.setTimeout(()=>{
      this.purifyHandCards(index)
      if(index == 0){this.activatePlayerCards()}
    }, 20);
    this.animationCount += 1;
    hcs.sortChildren();
  }
  /*-------------------------------------------------------------------------*/
  purifyHandCards(index){
    let trash = [];
    for(let i in this.handCanvas[index].children){
      let sprite = this.handCanvas[index].children[i];
      if(!sprite.instance){continue;}
      if(this.players[index].hand.indexOf(sprite.instance) == -1){
        trash.push(sprite);
      }
    }
    for(let i in trash){
      this.recycleCardSprite(trash[i]);
    }
  }
  /*-------------------------------------------------------------------------*/
  getPlayerPosition(pid){
    return {x: this.handCanvas[pid].x + this.handCanvas[pid].width / 2,
            y: this.handCanvas[pid].y + this.handCanvas[pid].height / 2};
  }
  /*-------------------------------------------------------------------------*/
  playColorEffect(cid){

  }
  /*-------------------------------------------------------------------------*/
  onHPChange(pid, types = []){
    this.updateHPBar(pid);
    console.log("On HP Change: ", pid, types);
    let hit = false;
    for(let i in types){
      if(!types[i]){continue;}
      switch(parseInt(i)){
        case Color.RED:
          this.playFireDanage(pid);
          hit = true;
          break;
        case Color.YELLOW:
          this.playThunderDamage(pid);
          hit = true;
          break;
        case Color.GREEN:
          this.playWindDamage(pid);
          hit = true;
          break;
        case Color.BLUE:
          this.playIceDamage(pid);
          hit = true;
          break;
      }
    }
    if(hit){
      this.displayHitEffect(pid);
    }
  }
  /*-------------------------------------------------------------------------*/
  playFireDanage(pid){
    this.shake(2);
    let pos = this.getPlayerPosition(pid);
    Sound.playSE(Sound.FireHit);
    Graphics.playAnimation(pos.x, pos.y, Graphics.FireHit, 2);
  }
  /*-------------------------------------------------------------------------*/
  playIceDamage(pid){
    this.shake(2);
    let pos = this.getPlayerPosition(pid);
    Sound.playSE(Sound.IceHit);
    Graphics.playAnimation(pos.x, pos.y, Graphics.IceHit, 2);
  }
  /*-------------------------------------------------------------------------*/
  playWindDamage(pid){
    this.shake(2);
    let pos = this.getPlayerPosition(pid);
    Sound.playSE(Sound.WindHit);
    Graphics.playAnimation(pos.x, pos.y, Graphics.WindHit, 2);
  }
  /*-------------------------------------------------------------------------*/
  playThunderDamage(pid){
    this.shake(2);
    let pos = this.getPlayerPosition(pid);
    Sound.playSE(Sound.ThunderHit);
    Graphics.playAnimation(pos.x, pos.y, Graphics.ThunderHit, 2);
  }
  /*-------------------------------------------------------------------------*/
  onDamageChange(){
    this.updateDamagePool();
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
    console.log("Discard ", sx, sy, card.sprite.x, card.sprite.y);
    this.animationCount += 1;
    card.sprite.moveto(sx, sy, function(){
      this.playColorEffect(card.color);
      if(card.sprite.parent != SceneManager.scene){
        card.sprite.parent.removeChild(card.sprite);
      }
      this.discardPile.addChild(card.sprite);
      if(ext != -1){this.updateLastCardInfo();}
      else{
        let len = this.discardPile.children.length;
        [this.discardPile.children[len-1], this.discardPile.children[len-2]] = [
          this.discardPile.children[len-2], this.discardPile.children[len-1]
        ]
      }
      card.sprite.setPOS(cx, cy);
    }.bind(this));
    let repos = 1;
    while(this.discardPile.children.length > this.discardPileSize){
      let re = this.recycleCardSprite(this.discardPile.children[repos]);
      if(!re){repos += 1;}
      if(re >= this.discardPile.length){break;}
    }
  }
  /*-------------------------------------------------------------------------*/
  recycleCardSprite(sprite){
    if(!sprite || this.spritePool.indexOf(sprite) == -1){return false;}
    sprite.playerIndex = -2;
    sprite.instance = null;
    if(sprite.parent){
      sprite.parent.removeChild(sprite);
    }
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
    this.updateHintWindowVisibility();
    this.updateHitEffect();
    this.updateDimBack();
  }
  /*-------------------------------------------------------------------------*/
  updateGame(){
    if(this.flagResulting){return ;}
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
  updateHintWindowVisibility(){
    if(this.hintWindow.hoverNumber <= 0){return ;}
    const ar = [this.deckSprite, this.discardPile].concat(this.handCanvas);
    let ok = false;
    for(let i in ar){
      let rect = this.getCollisionRect(ar[i]);
      if(Input.isMouseInArea(rect)){ok = true; break;}
    }
    if(!ok){
      this.hintWindow.hoverNumber = 0;
      this.hideHintWindow();
    }
  }
  /*-------------------------------------------------------------------------*/
  updateHitEffect(){
    if(!this.hitEffectSprite.visible){return ;}
    if(this.hitEffectSprite.flag){
      let opa = Math.min(1, this.hitEffectSprite.opacity + 0.1);
      this.hitEffectSprite.setOpacity(opa);
      if(opa >= 1){this.hitEffectSprite.flag = false;}
    }
    else{
      let opa = Math.max(1, this.hitEffectSprite.opacity - 0.1);
      this.hitEffectSprite.setOpacity(opa);
      if(opa <= 1){this.hitEffectSprite.hide();}
    }
  }
  /*-------------------------------------------------------------------------*/
  updateDimBack(){
    if(!this.dimBack.visible){return ;}
    let opa = this.dimBack.opacity;
    if(opa >= 0.8){return ;}
    this.dimBack.setOpacity(opa + 0.02);
  }
  /*-------------------------------------------------------------------------*/
  updateLastCardInfo(){
    let txt = this.getLastCardInfo() + ' ';
    let tsp = this.infoSprite.textSprite;
    tsp.text = txt;
    let sx = Graphics.width - Graphics.spacing - tsp.width;
    let sy = Graphics.spacing;
    let sw = tsp.width, sh = tsp.height;
    this.infoSprite.backSprite.show();
    this.infoSprite.setPOS(sx, sy).resize(sw + Graphics.spacing*2, sh);
    let bsp = this.infoSprite.backSprite;
    bsp.clear();
    bsp.beginFill(Graphics.color.White);
    bsp.drawRect(0, 0, sw + + Graphics.spacing*2, sh);
    bsp.endFill();
  }
  /*-------------------------------------------------------------------------*/
  updateDamagePool(){
    if(!this.discardPile.damageText){return ;}
    this.discardPile.damageText.text = String(this.game.damagePool);
  }
  /*-------------------------------------------------------------------------*/
  updateHPBar(i = null){
    if(!this.players){return ;}
    if(i == null){
      for(let i in this.hudCanvas){
        this.updateHPBar(parseInt(i));
        this.hudCanvas[i].hpBar.setProgress(this.players[i].hp);
      }
    }
    else{
      this.hudCanvas[i].hpBar.setProgress(this.players[i].hp);
    }
  }
  /*-------------------------------------------------------------------------*/
  updatePenaltyInfo(current=false){
    let idx = this.game.getNextAlivePlayerIndex();
    if(current){idx = this.game.currentPlayerIndex;}
    let pcard = this.game.penaltyCard;
    for(let i in this.penaltyCanvas){
      i = parseInt(i);
      if(!pcard || i != idx){
        let status = this.game.players[i].knockOut ? Vocab.KnockOut
                                                   : Vocab.Normal;
        this.setPenaltyInfo(i, status);
        continue;
      }
      switch(pcard.value){
        case Value.SKIP:
          return this.setPenaltyInfo(i, Vocab.SKIP);
        case Value.DRAW_TWO:
          return this.setPenaltyInfo(i, "+2");
        case Value.WILD_DRAW_FOUR:
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
    this.flagBusy = true;
    EventManager.setTimeout(()=>{this.flagBusy = false}, Graphics.FPS);
    pid = parseInt(pid);
    if(!card.sprite){
      let sx = this.deckSprite.x + this.deckSprite.width / 2;
      let sy = this.deckSprite.y + this.deckSprite.height / 2;
      this.assignCardSprite(card, sx, sy, true);
    }

    if(pid == -1){
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
    let wt = 10; // wait time
    for(let i in cards){
      i = parseInt(i);
      let ar = (i+1 == cards.length);
      EventManager.setTimeout(this.processCardDrawAnimation.bind(this, pid, cards[i], show, ar,i), wt * i);
    }
    this.updateDeckInfo();
  }
  /*-------------------------------------------------------------------------*/
  processCardDrawAnimation(pid, card, show=false, ar=false, ord=0){
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
    if(show){
      sprite.texture = Graphics.loadTexture(this.getCardImage(card));
      sprite.setZ(0x40 + ord);
    }else{sprite.setZ(0x20 + ord);}

    debug_log(`${pid} Draw`);
    this.animationCount += 1;
    sprite.moveto(dx, dy, function(){
      if(pid == 0){
        this.attachCardInfo(card);
        sprite.texture = Graphics.loadTexture(this.getCardImage(card));
      }
      if(show){EventManager.setTimeout(this.sendCardToDeck.bind(this, pid, card), 150);}
      else if(ar){EventManager.setTimeout(()=>{this.arrangeHandCards(pid)}, 30)}
    }.bind(this));
  }
  /*-------------------------------------------------------------------------*/
  onCardTrigger(card){
    debug_log("Trigger: ", card);
    if(this.playerPhase && this.game.isCardPlayable(card)){
      this.hideCardInfo(card);
      if(this.game.isCardAbilitySelectionNeeded(card)){
        Sound.playOK();
        this.processCardAbilitySelection(card);
        this.raiseOverlay(this.selectionWindow);
      }
      else{
        this.onUserCardPlay(card, null);
      }
    }
    else{
      Sound.playBuzzer();
    }
  }
  /*-------------------------------------------------------------------------*/
  processCardAbilitySelection(card){
    let effid = this.selectionWindow.setupCard(card);
    this.setupCardAbilityHandler(card, effid);
  }
  /*-------------------------------------------------------------------------*/
  setupCardAbilityHandler(card, effid){
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
  deactivatePlayerCards(){
    for(let i in this.handCanvas[0].children){
      if(this.handCanvas[0].children[i].isActive()){
        this.handCanvas[0].children[i].lastActiveState = true;
        this.handCanvas[0].children[i].deactivate();
      }
    }
  }
  /*-------------------------------------------------------------------------*/
  activatePlayerCards(){
    for(let i in this.handCanvas[0].children){
      if(this.handCanvas[0].children[i].lastActiveState){
        this.handCanvas[0].children[i].activate();
      }
    }
  }
  /*-------------------------------------------------------------------------*/
  deactivateAllHuds(){
    this.deactivatePlayerCards();
    const ar = [this.deckSprite, this.discardPile, this.handCanvas[0].arrangeIcon];
    for(let i in ar){
      ar[i].deactivate();
    }
    for(let i in this.hudCanvas){
      this.hudCanvas[i].hpBar.deactivate();
    }
  }
  /*-------------------------------------------------------------------------*/
  actiavteAllHuds(){
    this.activatePlayerCards();
    const ar = [this.deckSprite, this.discardPile, this.handCanvas[0].arrangeIcon];
    for(let i in ar){
      ar[i].activate();
    }
    for(let i in this.hudCanvas){
      this.hudCanvas[i].hpBar.activate();
    }
  }
  /*-------------------------------------------------------------------------*/
  onUserCardPlay(card, ext){
    Sound.playOK();
    this.deactivatePlayerCards();
    this.detachCardInfo(card);
    this.hideCardInfo(card);
    let cardIndex = this.players[0].findCard(card, true);
    if(cardIndex >= 0){
      this.game.discard(cardIndex, ext);
      this.processUserTurnEnd();
      this.animationCount += 1;
    }
    else{
      console.error("Selected card not in hand: ", card);
      this.arrangeHandCards(0);
    }
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
    if(!this.game.penaltyCard){
      this.game.processPlayerDamage(0);
    }
    this.game.penaltyCard = undefined;
    const cards = GameManager.game.deck.draw(numCards);
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
    EventManager.setTimeout(()=>{
      this.updatePenaltyInfo(true);
    }, 5);
  }
  /*-------------------------------------------------------------------------*/
  processUserTurnEnd(){
    this.playerPhase = false;
  }
  /*-------------------------------------------------------------------------*/
  processNPCTurn(pid){
    this.setCursor(pid);
    EventManager.setTimeout(()=>{
      this.updatePenaltyInfo(true);
    }, 5);
  }
  /*-------------------------------------------------------------------------*/
  setCursor(pid){
    if(pid == -1){return this.cursor.hide();}
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
    this.flagResulting = true;
    this.setCursor(-1);
    SceneManager.goto(Scene_GameOver, this.game);
  }
  /*-------------------------------------------------------------------------*/
  processRoundOver(){
    debug_log("Round Ends")
    this.flagResulting = true;
    this.setCursor(-1);
    this.updateHPBar();
    this.dimBack.show().setOpacity(0);
    EventManager.setTimeout(()=>{
      this.displayRoundResult();
    }, 60);
  }
  /*-------------------------------------------------------------------------*/
  processRoundStart(){
    debug_log("Round Start");
    this.flagResulting = false;
    this.clearTable();
    this.updateDamagePool();
    this.updateHPBar();
  }
  /*-------------------------------------------------------------------------*/
  displayRoundResult(){
    this.resultWindow.drawRank();
    this.resultWindow.show().activate();
    this.nextButton.show().activate();
  }
  /*-------------------------------------------------------------------------*/
  onActionNext(){
    Sound.playOK();
    this.resultWindow.hide().deactivate().clear();
    this.dimBack.hide();
    this.nextButton.hide().deactivate();
    this.game.roundStart();
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
        this.recycleCardSprite(sprite);
      }
    }
  }
  /*-------------------------------------------------------------------------*/
  processGameStart(){
    debug_log("Game Start")
  }
  /*-------------------------------------------------------------------------*/
  isBusy(){
    return super.isBusy() || this.isAnimationPlaying() ||
           this.isPlayerThinking() || this.flagBusy;
  }
  /*-------------------------------------------------------------------------*/
  isAnimationPlaying(){
    if(!this.animationCount){return false;}
    this.animationCount = 0;
    for(let i in this.spritePool){
      if(this.spritePool[i].isMoving){
        this.animationCount = 1;
        return true;
      }
    }
    return false;
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
    if(this.game.currentValue !== 0 && !this.game.currentValue){
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
