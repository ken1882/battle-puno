/**
 * > Add-ons for PIXI classes
 */

PIXI.Sprite.prototype.show = function(){
  this.visible = true;
  return this;
}

PIXI.Sprite.prototype.hide = function(){
  this.visible = false;
  return this;
}

PIXI.Sprite.prototype.setPOS = function(x, y){
  this.position.set(x ? x : this.x, y ? y : this.y);
  return this;
}