//-----------------------------------------------------------------------------
/**
 *  Global constants
**/

/**
 * Debug mode flag, prints debug information and allow to use cheat function
 * if enabled.
 * @global
 */
const DebugMode   = true;
const QuickStart  = false;
const SplitLine   = "-------------------------\n"
var GameStarted   = false;
var FatelError    = false;

function initializeApplication(){
  // Disable page scrolling
  DisablePageScroll();
  // Confirm leave before page unload
  RegisterLeaveEvent();
  // Initialize kernel module
  DataManager.initialize();
  Vocab.initialize();
  // call start
  setTimeout(start, 500);
}

// Start Processing
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