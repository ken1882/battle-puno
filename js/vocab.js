/**
 * > The module that handles vocabularies
 * 
 * @class Vocab
 */
class Vocab{
  /**
   * @constructor
   */
  constructor(){
    throw new Error('this is a static class');
  }

  /**
   * Setup
   */
  static initialize(){
    this.Language   = "en_us";
    this.FolderPath = "js/json";
    this.ready      = false;
    this.loadLanguageFile();
  }

  static loadLanguageFile(){
    var path = this.FolderPath + '/' + this.Language + '.json';
    processJSON(path, function(result){
      this.dict = JSON.parse(result);
      this.ready = true;
      debug_log("Vocab loaded");
    })
  }

  static isReady(){
    return this.ready;
  }
}

Vocab.initialize();