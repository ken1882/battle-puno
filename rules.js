class Vocab{}
DebugMode = true;

function start(){
  loadLanguage(new URL(document.URL).searchParams.get("language"));
}

function loadLanguage(lan){
  var path = 'js/json/' + lan + '.json';
  processJSON(path, (result)=>{
    let dict = JSON.parse(result);
    for(let key in dict){
      Vocab[key] = dict[key];
    }
    debug_log("Vocab loaded");
    setupLanguage();
  }, onLanguageError);
}

function setupLanguage(){
  document.getElementById("title").innerHTML = Vocab.RulesTitle;
  document.getElementById("table_content").innerHTML = Vocab.TableOfContent;
  document.getElementById("ta_basic").innerHTML = Vocab.Basic;
  document.getElementById("ta_trad").innerHTML = Vocab.GameModeTraditional;
  document.getElementById("ta_battle").innerHTML = Vocab.GameModeBattlePuno;
  document.getElementById("ta_dm").innerHTML = Vocab.GameModeDeathMatch;
  document.getElementById("ta_ui").innerHTML = Vocab.UI;
  document.getElementById("ta_cp").innerHTML = Vocab.CP;
  document.getElementById("basic").innerHTML = Vocab.Basic;
  document.getElementById("basic_content").innerHTML = Vocab.BasicContent;
  document.getElementById("trad").innerHTML = Vocab.GameModeTraditional;
  document.getElementById("battle").innerHTML = Vocab.GameModeBattlePuno;
  document.getElementById("dm").innerHTML = Vocab.GameModeDeathMatch;
  document.getElementById("trad_content").innerHTML = Vocab.TraditionalContent;
  document.getElementById("battle_content").innerHTML = Vocab.BattlePunoContent;
  document.getElementById("dm_content").innerHTML = Vocab.DeathMatchContent;
  document.getElementById("ui").innerHTML = Vocab.UI;
  document.getElementById("ui_content").innerHTML = Vocab.UIContent;
  document.getElementById("cp").innerHTML = Vocab.CP;
  document.getElementById("cp_content").innerHTML = Vocab.CPContent;
}

function onLanguageError(){
  loadLanguage("en_us");
}

window.addEventListener("load", start, false);