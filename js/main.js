//-----------------------------------------------------------------------------
/**
 *  Global constants
**/


// Initialize kernel module
DataManager.initialize();

/**
 * Debug mode flag, prints debug information and allow to use cheat function
 * if enabled.
 * @global
 * @type {boolean}
 */
const DebugMode   = DataManager.debugMode;

// Will go to Test Scene if set to true
const TestMode    = false;

/**
 * Flag that determines whether skips the intro scene
 * @global
 * @type {boolean}
 */
const QuickStart  = false;

/**
 * A paragraph-wrap line of string for debug console
 * @global
 * @type {string}
 */
const SplitLine   = "-------------------------\n"

/**
 * Flag represents whether the game has loaded and started
 * @global
 * @type {boolean}
 */
var GameStarted   = false;

/**
 * Flag whether encountered a fatel error and game cannot be continued
 * @global
 * @type {boolean}
 */
var FatelError    = false;

/**
 * > Game initialize process
 */
function initializeApplication(){
  // Disable page scrolling
  // DisablePageScroll();
  // Confirm leave before page unload
  RegisterLeaveEvent();
  Vocab.initialize();  
}

function startPorcessing(){
  // call start
  if(checkSecurityOk()){
    window.getGameImages();
    // window.alert("認證成功! 遊戲將在稍後開始")
    setTimeout(start, 2000);
    $('#downinfo').html('');
  }
  else{
    window.alert("認證失敗!")
  }
}

/**
 * Start Processing, call itself 0.5 sec later if DataManager is not ready
 */
function start(){
  // wait until initial data is ready
  if(!DataManager.isReady() || !Graphics.jsonReady || !Sound.jsonReady){
    return setTimeout(start, 500);
  }
  debug_log("start")
  
  try{
    SceneManager.run();
  }
  catch(e){
    reportError(e);
  }
}

function processSecurityStage(){
  // window.alert("本專案目前只限國立臺灣海洋大學資工系的學生參考, 請回答以下問題以確認身分:\n");
  // window.answer = window.prompt("馬哥哥和馬叔叔的名字分別是? (中間用一個空格分開):");
  window.answer = "馬尚彬 馬永昌";
  window.answerRaw = window.answer;
  window.answer = CryptoJS.SHA256(window.answer).toString();
  startPorcessing();
}

setTimeout(initializeApplication, 100);

