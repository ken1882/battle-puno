class Vocab{}
DebugMode = true;

function start(){
  processSecurityStage();
  startProcessing();
}

function processSecurityStage(){
  //window.alert("本專案目前只限國立臺灣海洋大學資工系的學生參考, 請回答以下問題以確認身分:\n");
  //window.answer = window.prompt("馬哥哥和馬叔叔的名字分別是? (中間用一個空格分開):");
  window.answer = "馬尚彬 馬永昌";
  window.answer = CryptoJS.SHA256(window.answer).toString();
  startProcessing();
}

function startProcessing(){
  if(checkSecurityOk()){
    let lan = new URL(document.URL).searchParams.get("language");
    lan = lan || JSON.parse(window.localStorage.getItem("language"));
    loadLanguage(lan);
  }
  else{
    window.alert("叭叭! 答錯了!");
  }
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