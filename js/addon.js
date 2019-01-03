/**
 * > Add-ons for library/default classes
 */

/**--------------------------------------------------------------------------
 * Check whether number between two value
 */
Number.prototype.between = function(a, b, closeure = true) {
  let minn = Math.min.apply(Math, [a, b]), maxn = Math.max.apply(Math, [a, b]);
  return closeure ? (this > minn && this < maxn) : (this >= minn && this <= maxn);
};
/**--------------------------------------------------------------------------
 * Make sprite visible
 */
PIXI.Sprite.prototype.show = function(){
  this.visible = true;
  return this;
}
/**--------------------------------------------------------------------------
 * Make sprite invisible
 */
PIXI.Sprite.prototype.hide = function(){
  this.visible = false;
  return this;
}
/**--------------------------------------------------------------------------
 * Change z-index
 */
PIXI.Sprite.prototype.setZ = function(z = 0){
  this.zIndex = z;
  return this;
}
/**--------------------------------------------------------------------------
 * Change opacity(alpha)
 */
PIXI.Sprite.prototype.setOpacity = function(opa){
  this.alpha = opa;
  return this;
}
/**--------------------------------------------------------------------------
 * Set sprite position
 */
PIXI.Sprite.prototype.setPOS = function(x, y){
  this.position.set(x == null ? this.x : x, y == null? this.y : y);
  return this;
}
/**--------------------------------------------------------------------------
 * Rotate the sprite to given degree
 */
PIXI.Sprite.prototype.rotateDegree = function(deg){
  this.rotation = (deg == 0) ? 0 : Math.PI * 2 * ((deg%360) / 360);
  return this;
}
/**-------------------------------------------------------------------------
 * > Activate to make sprite interactable
 */
PIXI.Sprite.prototype.activate = function(){
  this.interactive = true;
  return this;
}
/**-------------------------------------------------------------------------
 * > Deactivate to make sprite un-interactable
 */
PIXI.Sprite.prototype.deactivate = function(){
  this.interactive = false;
  return this;
}
PIXI.Sprite.prototype.isActivate = function(){return this.interactive;}
PIXI.Sprite.prototype.isActive   = function(){return this.interactive;}
/**--------------------------------------------------------------------------
 * Make graphics visible
 */
PIXI.Graphics.prototype.show = function(){
  this.visible = true;
  return this;
}
/**--------------------------------------------------------------------------
 * Make graphics invisible
 */
PIXI.Graphics.prototype.hide = function(){
  this.visible = false;
  return this;
}
/**--------------------------------------------------------------------------
 * Change z-index
 */
PIXI.Graphics.prototype.setZ = function(z = 0){
  this.zIndex = z;
  return this;
}
/**--------------------------------------------------------------------------
 * Change opacity(alpha)
 */
PIXI.Graphics.prototype.setOpacity = function(opa){
  this.alpha = opa;
  return this;
}
/**--------------------------------------------------------------------------
 * Set graphics position
 */
PIXI.Graphics.prototype.setPOS = function(x, y){
  this.position.set(x ? x : this.x, y ? y : this.y);
  return this;
}
/**-------------------------------------------------------------------------
 * > Activate to make graphics interactable
 */
PIXI.Graphics.prototype.activate = function(){
  this.interactive = true;
  return this;
}
/**-------------------------------------------------------------------------
 * > Deactivate to make graphics un-interactable
 */
PIXI.Graphics.prototype.deactivate = function(){
  this.interactive = false;
  return this;
}
PIXI.Graphics.prototype.isActivate = function(){return this.interactive;}
PIXI.Graphics.prototype.isActive   = function(){return this.interactive;}