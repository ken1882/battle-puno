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
  // call start
  setTimeout(start, 2000);
}

/**
 * Start Processing, call itself 0.5 sec later if DataManager is not ready
 */
function start(){
  // wait until initial data is ready
  if(!DataManager.isReady()){
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

setTimeout(initializeApplication, 100);