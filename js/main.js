// Start Processing
function start(){
  draw_background();
  draw_circle();
}

// Create pixi app
function create_app(){
  var app = new PIXI.Application(
    {
      width: Graphics.width,
      height: Graphics.height,
      antialias: true,
      backgroundColor: 0xffffff,
    }
  );
  app.view.style.left = Graphics.screenCenterWidth() + 'px';
  app.view.style.top  = Graphics.screenCenterHeight() + 'px';
  return app;
}

// Draw background on current stage
function draw_background(){
  path = FileManager.load_image(Graphics.background);
  let texture  = PIXI.Texture.fromImage(path);
  let renderer = PIXI.autoDetectRenderer(Graphics.width, Graphics.height);
  var sprite = new PIXI.Sprite(texture);
  app.stage.addChild(sprite);
}

// test function, draw a circle
function draw_circle(){
  var circle = new PIXI.Graphics();
  circle.beginFill(0x5cafe2);
  rad = 80;
  circle.drawCircle(0, 0, rad);
  circle.x = Graphics.appCenterWidth(rad);
  circle.y = Graphics.appCenterHeight(rad);
  app.stage.addChild(circle);
}

//-----------------------------------------------------------------------------
/**
 *  (Global) Application Initlization
**/

// Test PIXI utility
let type = "WebGL"
if(!PIXI.utils.isWebGLSupported()){
  type = "canvas"
}
PIXI.utils.sayHello(type)

// Create PIXI APP & Renderer
var app = create_app();
var renderer = PIXI.autoDetectRenderer(Graphics.width, Graphics.height);
document.app = app;
document.body.appendChild(app.view);

// Start processing
start();