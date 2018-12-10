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
 * Change z-index
 */
PIXI.Sprite.prototype.setZ = function(z = 0){
  this.zIndex = z;
  return this;
}
/**
 * Change opacity(alpha)
 */
PIXI.Sprite.prototype.setOpacity = function(opa){
  this.alpha = opa;
  return this;
}
/**
 * Set sprite position
 */
PIXI.Sprite.prototype.setPOS = function(x, y){
  this.position.set(x ? x : this.x, y ? y : this.y);
  return this;
}