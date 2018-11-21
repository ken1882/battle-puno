//-----------------------------------------------------------------------------
/**
 *  Global constants
**/
const DebugMode = true;

// Start Processing
function start(){
  // wait until vocab is ready
  if(!Vocab.isReady()){
    return setTimeout(start, 500);
  }
  debug_log("start")
  SceneManager.run()
}

setTimeout(start, 100);