//-----------------------------------------------------------------------------
/**
 *  This script defines Graphics/Audio settings and resources constants
 */

Graphics.DefaultFontSetting = {
  fontFamily: 'Arial',
  fontSize: 24,
  align: 'center',
  fill: 0xffffff,
}

SceneManager.firstSceneClass = Scene_Load;
Graphics.AppBackColor = 0x000000;
Graphics.Background   = "assets/backgorund.png";
Graphics.Background2  = "assets/background2.png";
Graphics.LoadImage    = "assets/CrystalHeart.png";
Graphics.Iconset      = "assets/IconSet.png"

// Collection of all images for preloading, fuck front-js has no glob
Graphics.Images = [
  Graphics.Background,
  Graphics.Background2,
  Graphics.Iconset,
  
]

Sound.BGM      = "audio/bgm/main.mp3";
Sound.Cancel   = 'audio/se/KHSE_Cancel.wav';
Sound.Cursor   = 'audio/se/KHSE_CursorMove.wav';
Sound.Buzzer   = 'audio/se/KHSE_ErrorSelect.wav';
Sound.Get      = 'audio/se/KHSE_ItemGet.wav';
Sound.SaveLoad = 'audio/se/KHSE_SaveLoad.wav';
Sound.OK       = 'audio/se/KHSE_Select.wav';

Sound.resources = [
  Sound.BGM, Sound.Cancel, Sound.Cursor, Sound.Buzzer, Sound.Get,
  Sound.SaveLoad, Sound.OK,
]
