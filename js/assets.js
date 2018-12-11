//-----------------------------------------------------------------------------
/**
 *  This script defines Graphics/Audio settings and resources constants
 */

// First scene class
SceneManager.firstSceneClass = Scene_Load;

 // Get color json
$.getJSON('js/json/color.json', function(data){
  Graphics.color = {};
  for(let prop in data){
    Graphics.color[prop] = parseInt(data[prop])
  }
})

// Graphics window settings
Graphics.LineHeight = 24;

// Default font setting
Graphics.DefaultFontSetting = {
  fontFamily: "CelestiaMediumRedux",
  fontSize: 20,
  align: "center",
  fill: 0xffffff,
}

// Language font setting
Graphics.LanguageFontMap = {
  'en_us': Graphics.DefaultFontSetting,
  'zh_tw':{
    fontFamily: 'NotoSansCJKtc-Regular',
    fontSize: 24,
    align: 'center',
    fill: 0xffffff,
  },
}

Graphics.Resolution         = [1280, 720];
Graphics.AppBackColor       = 0x000000;
Graphics.Iconset            = "assets/IconSet.png";
Graphics.IconRect           = {x:0, y:0, width:24, height:24}
Graphics.AnimRect           = {x:0, y:0, width:192, height:192}
Graphics.IconRowCount       = 16
Graphics.LoadImage          = "assets/CrystalHeart.png",

// Get collection of all images for PIXI preloading
$.getJSON('js/json/image.json', function(data){
  Graphics.Images = data["Images"];
  for(prop in data){
    if(prop == "Images" || prop == "_comment"){continue;}
    Graphics[prop] = data[prop];
    Graphics.Images.push(data[prop]);
  }
})

// Window skins
Graphics.WindowSkinSrc = [
  Graphics.DefaultWindowSkin,
]

// Get json contains path audio resources and properties
$.getJSON('js/json/audio.json', function(data){
  Sound.resources = data["resources"];
  for(prop in data){
    if(prop == "resources" || prop == "_comment"){continue;}
    Sound[prop] = data[prop];
    Sound.resources.push(data[prop]);
  }
})

Sound.fadeDurationBGM = 3000;
Sound.fadeDurationSE  = 2000;


// Source Slice Rect of Windowskin Image           X   Y   W   H
Graphics.wSkinIndexRect     = new PIXI.Rectangle(  0,  0, 64, 64); // Window Index Fill
Graphics.wSkinPatternRect   = new PIXI.Rectangle(  0, 64, 64, 64); // Window Index back-pattern fill

Graphics.wSkinBorder        = new PIXI.Rectangle( 64,  0, 64, 64); // Window border
Graphics.wSkinBorderUL      = new PIXI.Rectangle( 64,  0, 16, 16); // Window Upper-left border
Graphics.wSkinBorderUP      = new PIXI.Rectangle( 80,  0, 32, 16); // Window Upper border
Graphics.wSkinBorderUR      = new PIXI.Rectangle(112,  0, 16, 16); // Window Upper-right border
Graphics.wSkinBorderBL      = new PIXI.Rectangle( 64, 48, 16, 16); // Window Bottom-left border
Graphics.wSkinBorderBT      = new PIXI.Rectangle( 80, 48, 32, 16); // Window Bottom border
Graphics.wSkinBorderBR      = new PIXI.Rectangle(112, 48, 16, 16); // Window Bottom-right border

Graphics.wSkinBorderLT      = new PIXI.Rectangle( 64, 16, 16, 32); // Window left border
Graphics.wSkinBorderRT      = new PIXI.Rectangle(112, 16, 16, 32); // Window right border
Graphics.wSkinArrowUP       = new PIXI.Rectangle( 80, 16, 32,  8); // Window up arrow
Graphics.wSkinArrowBT       = new PIXI.Rectangle( 80, 40, 32,  8); // Window bottom arrow
Graphics.wSkinArrowLT       = new PIXI.Rectangle( 80, 16,  8, 32); // Window left arrow
Graphics.wSkinArrowRT       = new PIXI.Rectangle(104, 16,  8, 32); // Window right arrow

Graphics.wSkinCursor        = new PIXI.Rectangle( 64, 64, 32, 32); // Cursor selection Rect
Graphics.wSkinCursorIndex   = new PIXI.Rectangle( 67, 67, 26, 26); // Cursor index
Graphics.wSkinCursorUL      = new PIXI.Rectangle( 64, 64,  3,  3); // Upper-left
Graphics.wSkinCursorUP      = new PIXI.Rectangle( 67, 64, 26,  3); // Upper
Graphics.wSkinCursorUR      = new PIXI.Rectangle( 93, 64,  3,  3); // Upper-right
Graphics.wSkinCursorBL      = new PIXI.Rectangle( 64, 93,  3,  3); // Bottom-left
Graphics.wSkinCursorBT      = new PIXI.Rectangle( 67, 93, 26,  3); // Bottom
Graphics.wSkinCursorBR      = new PIXI.Rectangle( 93, 93,  3,  3); // Bottom-right
Graphics.wSkinCursorLT      = new PIXI.Rectangle( 64, 67,  3, 26); // Left
Graphics.wSkinCursorRT      = new PIXI.Rectangle( 93, 67,  3, 26); // Right

Graphics.wSkinButton        = new PIXI.Rectangle( 96, 64, 32, 32); // Confirm button (4)
Graphics.wSkinScrollUp      = new PIXI.Rectangle( 64, 96, 16, 16); // Scroll up button
Graphics.wSkinScrollDown    = new PIXI.Rectangle( 64,112, 16, 16); // Scroll down button
Graphics.wSkinScrollVert    = new PIXI.Rectangle( 64, 96, 16, 16); // Vertical scroll bar
Graphics.wSkinScrollVButton = new PIXI.Rectangle( 80,112, 16, 16); // Vertical scroll 
Graphics.wSkinScrollRight   = new PIXI.Rectangle( 96, 96, 16, 16); // Scroll right butoon
Graphics.wSkinScrollLeft    = new PIXI.Rectangle( 96,112, 16, 16); // Scroll left button
Graphics.wSkinScrollHorz    = new PIXI.Rectangle(112, 96, 16, 16); // Horizontal scroll bar
Graphics.wSkinScrollVButton = new PIXI.Rectangle(112,112, 16, 16); // Horizontal scroll buton
