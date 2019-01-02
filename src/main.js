function loadPunoGame() {
  import('./game.js').then((module) => {
    const PunoGame = module.default;
    let game = new PunoGame(GameManager.initCardNumber,
                            GameManager.initHP,
                            GameManager.scoreGoal,
                            GameManager.extraCardDisabled,
                            GameManager.gameMode);
    game.start();
  });
}
