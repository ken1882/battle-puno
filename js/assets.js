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

Graphics.Resolution         = [1280, 720]; // Better not change this
Graphics.AppBackColor       = 0x000000;

Graphics.Iconset            = "assets/IconSet.png";
Graphics.IconRect           = new Rect(0,0,24,24);
Graphics.IconRowCount       = 16

Graphics.CardRectOri        = new Rect(0, 0, 210, 300);
Graphics.CardRectReg        = new Rect(0, 0, 105, 150);

Graphics.IconID = {
  BGM: 758,
  SE: 6437,
  Xmark: 1142,
  Option: 3161,
}

Graphics.mouseTrailOpacity  = 0.25
Graphics.mouseClickOpacity  = 0.8

// How many frames in a row of original animation image
Graphics.AnimRowCount       = 5

// Loading image, will be loaded first and won't loaded in meta-preload
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


// Source Slice Rect of Windowskin Image           
//                                       X   Y   W   H
Graphics.wSkinIndexRect     = new Rect(  0,  0, 64, 64); // Window Index Fill
Graphics.wSkinPatternRect   = new Rect(  0, 64, 64, 64); // Window Index back-pattern fill

Graphics.wSkinBorder        = new Rect( 64,  0, 64, 64); // Window border
Graphics.wSkinBorderUL      = new Rect( 64,  0, 16, 16); // Window Upper-left border
Graphics.wSkinBorderUP      = new Rect( 80,  0, 32, 16); // Window Upper border
Graphics.wSkinBorderUR      = new Rect(112,  0, 16, 16); // Window Upper-right border
Graphics.wSkinBorderBL      = new Rect( 64, 48, 16, 16); // Window Bottom-left border
Graphics.wSkinBorderBT      = new Rect( 80, 48, 32, 16); // Window Bottom border
Graphics.wSkinBorderBR      = new Rect(112, 48, 16, 16); // Window Bottom-right border

Graphics.wSkinBorderLT      = new Rect( 64, 16, 16, 32); // Window left border
Graphics.wSkinBorderRT      = new Rect(112, 16, 16, 32); // Window right border
Graphics.wSkinArrowUP       = new Rect( 80, 16, 32,  8); // Window up arrow
Graphics.wSkinArrowBT       = new Rect( 80, 40, 32,  8); // Window bottom arrow
Graphics.wSkinArrowLT       = new Rect( 80, 16,  8, 32); // Window left arrow
Graphics.wSkinArrowRT       = new Rect(104, 16,  8, 32); // Window right arrow

Graphics.wSkinCursor        = new Rect( 64, 64, 32, 32); // Cursor selection Rect
Graphics.wSkinCursorIndex   = new Rect( 67, 67, 26, 26); // Cursor index
Graphics.wSkinCursorUL      = new Rect( 64, 64,  3,  3); // Upper-left
Graphics.wSkinCursorUP      = new Rect( 67, 64, 26,  3); // Upper
Graphics.wSkinCursorUR      = new Rect( 93, 64,  3,  3); // Upper-right
Graphics.wSkinCursorBL      = new Rect( 64, 93,  3,  3); // Bottom-left
Graphics.wSkinCursorBT      = new Rect( 67, 93, 26,  3); // Bottom
Graphics.wSkinCursorBR      = new Rect( 93, 93,  3,  3); // Bottom-right
Graphics.wSkinCursorLT      = new Rect( 64, 67,  3, 26); // Left
Graphics.wSkinCursorRT      = new Rect( 93, 67,  3, 26); // Right

Graphics.wSkinButton        = new Rect( 96, 64, 32, 32); // Confirm button (4)
Graphics.wSkinScrollUp      = new Rect( 64, 96, 16, 16); // Scroll up button
Graphics.wSkinScrollDown    = new Rect( 64,112, 16, 16); // Scroll down button
Graphics.wSkinScrollVert    = new Rect( 64, 96, 16, 16); // Vertical scroll bar
Graphics.wSkinScrollVButton = new Rect( 80,112, 16, 16); // Vertical scroll 
Graphics.wSkinScrollRight   = new Rect( 96, 96, 16, 16); // Scroll right butoon
Graphics.wSkinScrollLeft    = new Rect( 96,112, 16, 16); // Scroll left button
Graphics.wSkinScrollHorz    = new Rect(112, 96, 16, 16); // Horizontal scroll bar
Graphics.wSkinScrollVButton = new Rect(112,112, 16, 16); // Horizontal scroll buton
