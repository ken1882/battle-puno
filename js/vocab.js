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
    var path = Vocab.FolderPath + '/' + Vocab.Language + '.json';
    processJSON(path, function(result){
      let dict = JSON.parse(result);
      for(let key in dict){
        Vocab[key] = dict[key];
      }
      Vocab.ready = true;
      debug_log("Vocab loaded");
    }, this.onLoadError);
  }
  /*-------------------------------------------------------------------------*/
  static onLoadError(){
    DataManager.changeSetting(DataManager.kLanguage, DataManager.DefaultLanguage);
    Vocab.Language = DataManager.language;
    Vocab.loadLanguageFile();
  }
  /*-------------------------------------------------------------------------*/
  static isReady(){
    return this.ready;
  }
  /*-------------------------------------------------------------------------*/
}