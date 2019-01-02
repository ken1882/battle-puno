class GameManager {
  constructor() {}
  static init() {
    this.initCardNumber = 7;
    this.initHP = 200;
    this.scoreGoal = 300;
    this.extraCardDisabled = true;
    this.gameMode = 0;
  }
}

function loadPunoGame() {
  import('./game.js').then((module) => {
    const PunoGame = module.default;
    // let game = new PunoGame(7, 200, 300, true, 0);
    let game = new PunoGame(GameManager.initCardNumber,
                            GameManager.initHP,
                            GameManager.scoreGoal,
                            GameManager.extraCardDisabled,
                            GameManager.gameMode);
    game.start();
  });
}
