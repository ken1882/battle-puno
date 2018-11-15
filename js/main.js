// Start Processing
function start(){
  draw_background();
  draw_object();
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
function draw_object(){
  var sprite = new PIXI.Sprite(Cache.load_texture(Graphics.testObject));
  sprite.x = Graphics.appCenterWidth();
  sprite.y = Graphics.appCenterHeight();
  sprite.anchor.set(0.5);
  sprite.buttonMode = true;
  sprite.interactive = true;
  sprite.on('rightdown', function(){
    if(sprite.scale_flag){
      sprite.scale.x *= 0.9;
      sprite.scale.y *= 0.9;
      if(sprite.scale.x <= 1)sprite.scale_flag = false;
    }
    else{
      sprite.scale.x *= 1.1;
      sprite.scale.y *= 1.1;
      if(sprite.scale.x >= 3)sprite.scale_flag = true;
    }
  })
  app.stage.addChild(sprite);
}

var cnt = 0;

function update_main(){
  Input.update();
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
app.ticker.add(Input.keyListener);
app.ticker.add(update_main);
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