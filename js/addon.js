/**
 * > Add-ons for PIXI classes
 */

/**
 * Make sprite visible
 */
PIXI.Sprite.prototype.show = function(){
  this.visible = true;
  return this;
}
/**
 * Make sprite invisible
 */
PIXI.Sprite.prototype.hide = function(){
  this.visible = false;
  return this;
}
/**
 * Set sprite position
 */
PIXI.Sprite.prototype.setPOS = function(x, y){
  this.position.set(x ? x : this.x, y ? y : this.y);
  return this;
}