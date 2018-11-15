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
  let texture = Cache.load_texture(Graphics.background);
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

// Preload assets
const loader = PIXI.loader.add(Graphics.images)
loader.onProgress.add(function(loader, resources){
  console.log('Loaded : ' + loader.progress + '%' + ', name : ' + resources.name + ', url : ' + resources.url);
})

// Start processing
loader.load(start);