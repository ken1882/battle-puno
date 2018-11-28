/**----------------------------------------------------------------------------
 * > The module that handles vocabularies
 * 
 * @namespace Vocab
 */
class Vocab{
  /**--------------------------------------------------------------------------
   * @constructor
   */
  constructor(){
    throw new Error('this is a static class');
  }
  /**--------------------------------------------------------------------------
   * Setup
   */
  static initialize(){
    this.Language   = DataManager.language;
    this.FolderPath = "js/json";
    this.ready      = false;
    this.loadLanguageFile();
  }
  /*-------------------------------------------------------------------------*/
  static loadLanguageFile(){
    var path = this.FolderPath + '/' + this.Language + '.json';
    processJSON(path, function(result){
      let dict = JSON.parse(result);
      for(let key in dict){
        Vocab[key] = dict[key];
      }
      this.ready = true;
      debug_log("Vocab loaded");
    })
  }
  /*-------------------------------------------------------------------------*/
  static isReady(){
    return this.ready;
  }
  /*-------------------------------------------------------------------------*/
}