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
Graphics.Background = "assets/backgorund.png";
Graphics.Background2 = "assets/background2.png";
Graphics.LoadImage = "assets/CrystalHeart.png";

// Collection of all images for preloading, fuck front-js has no glob
Graphics.Images = [
  Graphics.Background,
  Graphics.Background2,
  
]

Audio.BGM = "audio/bgm/main.mp3"
Audio.resources = [
  Audio.BGM,
  
]
