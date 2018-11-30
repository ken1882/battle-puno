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