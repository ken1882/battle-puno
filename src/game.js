class PunoGame {
  constructor(initCardNumber, initHP, scoreGoal, extraCardDisabled, gameMode) {
    this.players = [new Player("User", initHP, false),
                    new Player("CPU1", initHP),
                    new Player("CPU2", initHP),
                    new Player("CPU3", initHP)];
    this.initCardNumber = initCardNumber;
    this.scoreGoal = scoreGoal;
    this.extraCardDisabled = extraCardDisabled;
    this.clockwise = true;
    this.currentPlayerIndex = undefined;
    this.currentColor = undefined;
    this.currentValue = undefined;
    this.deck = null;
    this.discardPile = [];
    this.penaltyStack = [];
    this.gameMode = gameMode;
    this.damagePool = 0;
  }

  chooseDealer() {
    let highest = 0;
    let deadlock = true;
    while (deadlock) {
      let firstDraw = this.deck.drawNumbered(4);
      for (let i in firstDraw) {
        console.log(this.players[i].name, firstDraw[i]);
      }
      deadlock = false;
      for (let i = 1; i < 4; ++i) {
        if (firstDraw[i].value > firstDraw[highest].value) {
          highest = i;
          deadlock = false;
        } else if (firstDraw[i].value === firstDraw[highest].value) {
          deadlock = true;
        }
      }
      this.deck.putback(firstDraw);
      if (deadlock) {
        console.log("deadlock => redraw");
      }
    }
    return highest;
  }

  currentPlayer() {
    return this.players[this.currentPlayerIndex];
  }

  lastCard() {
    if (this.discardPile.length === 0) {
      return null;
    }
    return this.discardPile.slice(-1)[0];
  }

  drawCard(numCards) {
    if (this.gameMode === Mode.DEATH_MATCH) {
      return this.deck.draw(numCards, this.discardPile);
    } else {
      return this.deck.draw(numCards);
    }
  }

  initialize() {
    console.log("--------------INITIALIZE--------------");
    this.deck = new Deck(this.extraCardDisabled);
    this.currentPlayerIndex = this.chooseDealer();
    for (let i in this.players) {
      this.players[i].reset();
      this.players[i].deal(this.drawCard(this.initCardNumber));
    }
    const firstCard = this.deck.drawColored(1)[0];
    this.discardPile.push(firstCard);
    if (firstCard.penalty) {
      this.penaltyStack.push(firstCard);
    }
    console.log("first card", firstCard);
    this.setNextColorAndValue(firstCard);
    console.log("--------------------------------------");
  }

  isGameOver() {
    let knockOutCount = 0;
    for (let i in this.players) {
      if (this.players[i].isGoingOut()) {
        return true;
      }
      if (this.players[i].knockOut)  ++knockOutCount;
    }
    return knockOutCount === 3;
  }

  reverse() {
    console.log("REVERSE");
    this.clockwise = !this.clockwise;
  }

  findTarget() {
    let target = undefined;
    for (let i in this.players) {
      if (i != this.currentPlayerIndex && !this.players[i].knockOut) {
        if (target === undefined ||
           this.players[i].hand.length < this.players[target].hand.length) {
          target = i;
        }
      }
    }
    return target;
  }

  trade(player1, player2) {
    console.log("TRADE");
    console.log(this.players[player1].name, this.players[player1].hand.slice());
    console.log(this.players[player2].name, this.players[player2].hand.slice());
    const temp = this.players[player1].hand.slice();
    this.players[player1].hand = this.players[player2].hand.slice();
    this.players[player2].hand = temp;
    console.log(this.players[player1].name, this.players[player1].hand.slice());
    console.log(this.players[player2].name, this.players[player2].hand.slice());
  }

  wildHitAll(currentPlayerIndex) {
    console.log("WILD HIT ALL");
    for (let i in this.players) {
      if (i != currentPlayerIndex) {
        this.players[i].deal(this.drawCard(2));
      }
    }
  }

  gameResult() {
    for (let i in this.players) {
      if (this.gameMode === Mode.TRADITIONAL) {
        this.players[i].score += this.players[i].cardsPointSum();
      } else if (this.gameMode === Mode.BATTLE_PUNO) {
        this.players[i].hp -= this.players[i].cardsPointSum();
        this.players[i].score += Math.max(this.players[i].hp, 0);
      }
    }
  }

  setNextColorAndValue(card) {
    if (card.color === Color.WILD) {
      this.currentColor = getRandom(Color.RED, Color.BLUE, this.currentColor);
      console.log("WILD CHOOSE NEXT COLOR", this.currentColor);
      if (card.value === Value.WILD_CHAOS) {
        this.currentValue = getRandom(Value.ZERO, Value.NINE);
        console.log("WILD CHAOS, NEXT VALUE", this.currentValue);
      } else {
        this.currentValue = undefined;
      }
    } else {
      this.currentColor = card.color;
      this.currentValue = card.value;
    }
  }

  discard(card, ext=null) {
    console.log("discard: ", card);
    this.discardPile.push(card);
    if (this.gameMode === Mode.BATTLE_PUNO ||
        this.gameMode === Mode.DEATH_MATCH) {
      if (card.value === Value.ZERO) {
        if (this.damagePool < 30 || !!getRandom(0, 1)) {
          console.log("+10");
          this.damagePool += 10;
        } else {
          console.log("reset: 0");
          this.damagePool = 0;
        }
        console.log("damage pool", this.damagePool);
      } else if (Value.ONE <= card.value && card.value <= Value.NINE) {
        this.damagePool += card.value;
        console.log("damage pool", this.damagePool);
      }
    }
    if (card.value === Value.REVERSE) {
      this.reverse();
    } else if (card.value === Value.TRADE) {
      const target = this.findTarget();
      this.trade(this.currentPlayerIndex, target);
    } else if (card.value === Value.DISCARD_ALL) {
      this.currentPlayer().discardAllByColor(this.currentColor);
    } else if (card.value === WILD_HIT_ALL) {
      this.wildHitAll(this.currentPlayerIndex);
    }
    this.setNextColorAndValue(card);
    if (card.penalty) {
      this.penaltyStack.push(card);
    }
    if (this.currentPlayer().hand.length === 1) {
      this.currentPlayer().uno();
    }
    GameManager.onCardPlay(this.currentPlayerIndex, card, ext);
  }

  beginTurn() {
    console.log(this.currentPlayer().name, "round");
    if (this.gameMode != Mode.TRADITIONAL) {
      console.log("hp:", this.currentPlayer().hp);
    }
    console.log("hand", this.currentPlayer().hand.slice());
    console.log("last card:", this.lastCard());
    console.log("CURRENT COLOR:", this.currentColor);
    console.log("CURRENT VALUE:", this.currentValue);

    if (this.gameMode === Mode.DEATH_MATCH) {
      while (this.currentPlayer().hand.length < this.initCardNumber) {
        console.log("death match - draw");
        this.currentPlayer().deal(this.drawCard(1));
      }
      console.log("hand", this.currentPlayer().hand.slice());
    }

    // penalty
    if (this.penaltyStack.length > 0) {
      console.log("PENALTY");
      const penaltyCard = this.penaltyStack.pop();
      if (penaltyCard.value == Value.SKIP) {
        console.log("SKIP");
      } else {
        const avoidCard = this.currentPlayer().receivePenalty(penaltyCard);
        if (avoidCard != null) {
          discard(avoidCard);
          this.penaltyStack.push(penaltyCard);
        } else {
          if (penaltyCard.value === Value.DRAW_TWO) {
            console.log("DRAW TWO");
            this.currentPlayer().deal(this.drawCard(2));
          } else if (penaltyCard.value === Value.WILD_DRAW_FOUR) {
            console.log("DRAW FOUR");
            this.currentPlayer().deal(this.drawCard(4));
          }
        }
      }
      return;
    }

    let matchedCard = this.currentPlayer().matching(this.currentColor,
                                                    this.currentValue);
    if (matchedCard == null) {
      if (this.gameMode === Mode.BATTLE_PUNO ||
          this.gameMode === Mode.DEATH_MATCH) {
        this.currentPlayer().hp -= this.damagePool;
        this.currentPlayer().knockOut = this.currentPlayer().hp <= 0;
        this.damagePool = 0;
        console.log("RECIEVE DAMAGE");
        console.log("hp", this.currentPlayer().hp);
        console.log("reset damage pool");
      }
      const card = this.drawCard(1)[0];
      if (card === undefined) {
        console.log("deck empty => player knocked out");
        this.currentPlayer().knockOut = true;
      } else {
        console.log("no matched card => draw");
        this.currentPlayer().deal([card]);
      }
    } else {
      this.discard(matchedCard);
    }
  }

  endTurn() {
    this.currentPlayerIndex =
        this.clockwise ? mod(this.currentPlayerIndex + 1, 4)
                       : mod(this.currentPlayerIndex - 1, 4);
  }

  scoreBoard() {
    return [this.players[0].score, this.players[1].score,
            this.players[2].score, this.players[3].score];
  }

  start() {
    console.log("SCORE GOAL", this.scoreGoal);
    while (Math.max(...this.scoreBoard()) < this.scoreGoal) {
      this.initialize();
      while (!this.isGameOver()) {
        if (!this.currentPlayer().knockOut) {
          if (this.currentPlayer.ai) {
            // GameManager.onNPCTurnBegin();
            this.beginTurn();
          } else {
            // GameManager.onUserTurnBegin(this.currentPlayerIndex);
            this.beginTurn();
          }
        } else {
          console.log(this.currentPlayer().name, "knocked out - SKIP");
        }
        this.endTurn();
        while (GameManager.isSceneBusy())  continue;
      }
      this.gameResult();
      console.log(this.scoreBoard());
      break;
    }
  }

}

/************************** helper function **************************/
function getRandom(a, b, filter=undefined) {
  const random = Math.floor(Math.random() * (b - a + 1) + a);
  return random != filter ? random : getRandom(a, b, filter);
}

function mod(n, m) {
  return ((n % m) + m) % m;
}
/*********************************************************************/
