//-----------------------------------------------------------------------------
/**
 *  This script defines Graphics/Audio settings and resources constants
 */

Graphics.DefaultFontSetting = {
  fontFamily: 'CelestiaMediumRedux',
  fontSize: 20,
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


Graphics.Resolution         = [1280, 720];
Graphics.AppBackColor       = 0x000000;
Graphics.Title              = "assets/Title.png";
Graphics.Background         = "assets/backgorund.png";
Graphics.Background2        = "assets/background2.png";
Graphics.LoadImage          = "assets/CrystalHeart.png";
Graphics.DefaultWindowSkin  = "assets/wskin_base.png";
Graphics.Particle           = "assets/particle.png";
Graphics.Particle2          = "assets/particle2.png";
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
  Graphics.Title,
  Graphics.Particle,
  Graphics.Particle2,
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

// Colors
Graphics.color = {
  AliceBlue: 0xF0F8FF,
  AntiqueWhite: 0xFAEBD7,
  Aqua: 0x00FFFF,
  Aquamarine: 0x7FFFD4,
  Azure: 0xF0FFFF,
  Beige: 0xF5F5DC,
  Bisque: 0xFFE4C4,
  Black: 0x000000,
  BlanchedAlmond: 0xFFEBCD,
  Blue: 0x0000FF,
  BlueViolet: 0x8A2BE2,
  Brown: 0xA52A2A,
  BurlyWood: 0xDEB887,
  CadetBlue: 0x5F9EA0,
  Chartreuse: 0x7FFF00,
  Chocolate: 0xD2691E,
  Coral: 0xFF7F50,
  CornflowerBlue: 0x6495ED,
  Cornsilk: 0xFFF8DC,
  Crimson: 0xDC143C,
  Cyan: 0x00FFFF,
  DarkBlue: 0x00008B,
  DarkCyan: 0x008B8B,
  DarkGoldenRod: 0xB8860B,
  DarkGray: 0xA9A9A9,
  DarkGrey: 0xA9A9A9,
  DarkGreen: 0x006400,
  DarkKhaki: 0xBDB76B,
  DarkMagenta: 0x8B008B,
  DarkOliveGreen: 0x556B2F,
  DarkOrange: 0xFF8C00,
  DarkOrchid: 0x9932CC,
  DarkRed: 0x8B0000,
  DarkSalmon: 0xE9967A,
  DarkSeaGreen: 0x8FBC8F,
  DarkSlateBlue: 0x483D8B,
  DarkSlateGray: 0x2F4F4F,
  DarkSlateGrey: 0x2F4F4F,
  DarkTurquoise: 0x00CED1,
  DarkViolet: 0x9400D3,
  DeepPink: 0xFF1493,
  DeepSkyBlue: 0x00BFFF,
  DimGray: 0x696969,
  DimGrey: 0x696969,
  DodgerBlue: 0x1E90FF,
  FireBrick: 0xB22222,
  FloralWhite: 0xFFFAF0,
  ForestGreen: 0x228B22,
  Fuchsia: 0xFF00FF,
  Gainsboro: 0xDCDCDC,
  GhostWhite: 0xF8F8FF,
  Gold: 0xFFD700,
  GoldenRod: 0xDAA520,
  Gray: 0x808080,
  Grey: 0x808080,
  Green: 0x008000,
  GreenYellow: 0xADFF2F,
  HoneyDew: 0xF0FFF0,
  HotPink: 0xFF69B4,
  IndianRed: 0xCD5C5C,
  Indigo: 0x4B0082,
  Ivory: 0xFFFFF0,
  Khaki: 0xF0E68C,
  Lavender: 0xE6E6FA,
  LavenderBlush: 0xFFF0F5,
  LawnGreen: 0x7CFC00,
  LemonChiffon: 0xFFFACD,
  LightBlue: 0xADD8E6,
  LightCoral: 0xF08080,
  LightCyan: 0xE0FFFF,
  LightGoldenRodYellow: 0xFAFAD2,
  LightGray: 0xD3D3D3,
  LightGrey: 0xD3D3D3,
  LightGreen: 0x90EE90,
  LightPink: 0xFFB6C1,
  LightSalmon: 0xFFA07A,
  LightSeaGreen: 0x20B2AA,
  LightSkyBlue: 0x87CEFA,
  LightSlateGray: 0x778899,
  LightSlateGrey: 0x778899,
  LightSteelBlue: 0xB0C4DE,
  LightYellow: 0xFFFFE0,
  Lime: 0x00FF00,
  LimeGreen: 0x32CD32,
  Linen: 0xFAF0E6,
  Magenta: 0xFF00FF,
  Maroon: 0x800000,
  MediumAquaMarine: 0x66CDAA,
  MediumBlue: 0x0000CD,
  MediumOrchid: 0xBA55D3,
  MediumPurple: 0x9370DB,
  MediumSeaGreen: 0x3CB371,
  MediumSlateBlue: 0x7B68EE,
  MediumSpringGreen: 0x00FA9A,
  MediumTurquoise: 0x48D1CC,
  MediumVioletRed: 0xC71585,
  MidnightBlue: 0x191970,
  MintCream: 0xF5FFFA,
  MistyRose: 0xFFE4E1,
  Moccasin: 0xFFE4B5,
  NavajoWhite: 0xFFDEAD,
  Navy: 0x000080,
  OldLace: 0xFDF5E6,
  Olive: 0x808000,
  OliveDrab: 0x6B8E23,
  Orange: 0xFFA500,
  OrangeRed: 0xFF4500,
  Orchid: 0xDA70D6,
  PaleGoldenRod: 0xEEE8AA,
  PaleGreen: 0x98FB98,
  PaleTurquoise: 0xAFEEEE,
  PaleVioletRed: 0xDB7093,
  PapayaWhip: 0xFFEFD5,
  PeachPuff: 0xFFDAB9,
  Peru: 0xCD853F,
  Pink: 0xFFC0CB,
  Plum: 0xDDA0DD,
  PowderBlue: 0xB0E0E6,
  Purple: 0x800080,
  RebeccaPurple: 0x663399,
  Red: 0xFF0000,
  RosyBrown: 0xBC8F8F,
  RoyalBlue: 0x4169E1,
  SaddleBrown: 0x8B4513,
  Salmon: 0xFA8072,
  SandyBrown: 0xF4A460,
  SeaGreen: 0x2E8B57,
  SeaShell: 0xFFF5EE,
  Sienna: 0xA0522D,
  Silver: 0xC0C0C0,
  SkyBlue: 0x87CEEB,
  SlateBlue: 0x6A5ACD,
  SlateGray: 0x708090,
  SlateGrey: 0x708090,
  Snow: 0xFFFAFA,
  SpringGreen: 0x00FF7F,
  SteelBlue: 0x4682B4,
  Tan: 0xD2B48C,
  Teal: 0x008080,
  Thistle: 0xD8BFD8,
  Tomato: 0xFF6347,
  Turquoise: 0x40E0D0,
  Violet: 0xEE82EE,
  Wheat: 0xF5DEB3,
  White: 0xFFFFFF,
  WhiteSmoke: 0xF5F5F5,
  Yellow: 0xFFFF00,
  YellowGreen: 0x9ACD32,
}