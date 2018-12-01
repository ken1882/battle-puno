//-----------------------------------------------------------------------------
/**
 *  This script defines Graphics/Audio settings and resources constants
 */

Graphics.DefaultFontSetting = {
  fontFamily: 'CelestiaMediumRedux',
  fontSize: 24,
  align: 'center',
  fill: 0xffffff,
}

Graphics.LanguageFontMap = {
  'zh_tw':{
    fontFamily: 'NotoSansCJKtc-Regular',
    fontSize: 24,
    align: 'center',
    fill: 0xffffff,
  },
}

SceneManager.firstSceneClass = Scene_Load;

Graphics.Resolution         = [1280, 720]
Graphics.AppBackColor       = 0x000000;
Graphics.Background         = "assets/backgorund.png";
Graphics.Background2        = "assets/background2.png";
Graphics.LoadImage          = "assets/CrystalHeart.png";
Graphics.DefaultWindowSkin  = "assets/wskin_base.png";
Graphics.Iconset            = "assets/IconSet.png";
Graphics.IconRect           = {x:0, y:0, width:24, height:24}
Graphics.IconRowCount       = 16

Graphics.ntouSplash         = "assets/ntou.png";
Graphics.pixiSplash         = "assets/pixijs.png";
Graphics.howlerSplash       = "assets/howlerjs.png";

// Collection of all images for PIXI preloading, fuck front-js has no glob
Graphics.Images = [
  Graphics.Background,
  Graphics.Background2,
  Graphics.Iconset,
  Graphics.DefaultWindowSkin,
  Graphics.ntouSplash,
  Graphics.pixiSplash,
  Graphics.howlerSplash,
]

Graphics.WindowSkinSrc = [
  Graphics.DefaultWindowSkin,
]

Sound.BGM      = "audio/bgm/main.mp3";
Sound.Cancel   = 'audio/se/KHSE_Cancel.wav';
Sound.Cursor   = 'audio/se/KHSE_CursorMove.wav';
Sound.Buzzer   = 'audio/se/KHSE_ErrorSelect.wav';
Sound.Get      = 'audio/se/KHSE_ItemGet.wav';
Sound.SaveLoad = 'audio/se/KHSE_SaveLoad.wav';
Sound.OK       = 'audio/se/KHSE_Select.wav';
Sound.Error    = 'audio/se/Buzzer1.mp3';
Sound.Wave     = 'audio/se/seawave.wav';

Sound.resources = [
  Sound.BGM, Sound.Cancel, Sound.Cursor, Sound.Buzzer, Sound.Get,
  Sound.SaveLoad, Sound.OK, Sound.Error,
  Sound.Wave,
]

Sound.fadeDurationBGM = 3000;
Sound.fadeDurationSE  = 2000;

// Graphics window settings
Graphics.LineHeight = 24;

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
Graphics.wSkinSelect        = new PIXI.Rectangle( 64, 64, 32, 32); // Selection Rect
Graphics.wSkinButton        = new PIXI.Rectangle( 96, 64, 32, 32); // Confirm button (4)
Graphics.wSkinScrollUp      = new PIXI.Rectangle( 64, 96, 16, 16); // Scroll up button
Graphics.wSkinScrollDown    = new PIXI.Rectangle( 64,112, 16, 16); // Scroll down button
Graphics.wSkinScrollVert    = new PIXI.Rectangle( 64, 96, 16, 16); // Vertical scroll bar
Graphics.wSkinScrollVButton = new PIXI.Rectangle( 80,112, 16, 16); // Vertical scroll 
Graphics.wSkinScrollRight   = new PIXI.Rectangle( 96, 96, 16, 16); // Scroll right butoon
Graphics.wSkinScrollLeft    = new PIXI.Rectangle( 96,112, 16, 16); // Scroll left button
Graphics.wSkinScrollHorz    = new PIXI.Rectangle(112, 96, 16, 16); // Horizontal scroll bar
Graphics.wSkinScrollVButton = new PIXI.Rectangle(112,112, 16, 16); // Horizontal scroll buton