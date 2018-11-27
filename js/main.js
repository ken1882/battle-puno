//-----------------------------------------------------------------------------
/**
 *  Global constants
**/

/**
 * Debug mode flag, prints debug information and allow to use cheat function
 * if enabled.
 * @global
 */
const DebugMode = true;
const SplitLine = "-------------------------\n"
var GameStarted = false;

// Start Processing
function start(){
  // Disable page scrolling
  DisablePageScroll();
  // wait until vocab is ready
  if(!Vocab.isReady()){
    return setTimeout(start, 500);
  }
  debug_log("start")
  SceneManager.run()
}

setTimeout(start, 100);