import Color from './card/color.js';
import Value from './card/value.js';
import Card from './card/card.js';
import Deck from './deck.js';
import Mode from './mode.js'
import Player from './player.js'

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
      /***********************  LOG  ***********************/
      for (let i in firstDraw) {
        console.log(this.players[i].name, firstDraw[i]);
      }
      /*****************************************************/
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

  initialize() {
    console.log("initialize");
    this.deck = new Deck(this.extraCardDisabled);
    this.currentPlayerIndex = this.chooseDealer();
    for (let i in this.players) {
      this.players[i].reset();
      this.players[i].deal(this.deck.draw(this.initCardNumber));
    }
    const firstCard = this.deck.drawColored(1)[0];
    this.discardPile.push(firstCard);
    if (firstCard.penalty) {
      this.penaltyStack.push(firstCard);
    }
    console.log("first card", firstCard);
    this.setNextColorAndValue(firstCard);
    console.log("init end");
  }

  isGameOver() {
    let allKnockOut = true;
    for (let i in this.players) {
      if (this.players[i].isGoingOut()) {
        return true;
      } else if (!this.players[i].knockOut) {
        allKnockOut = false;
      }
    }
    return allKnockOut;
  }

  reverse() {
    this.clockwise = !this.clockwise;
  }

  calcScore() {
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
      if (card.value === Value.WILD_CHAOS) {
        this.currentValue = getRandom(Value.ZERO, Value.NINE);
      } else {
        this.currentValue = undefined;
      }
    } else {
      this.currentColor = card.color;
      this.currentValue = card.value;
    }
    console.log("next color", this.currentColor);
    console.log("next value", this.currentValue);
  }

  discard(card) {
    console.log("discard: ", card);
    this.discardPile.push(card);
    if (card.value === 0) {
      if (this.damagePool < 20) {
        this.damagePool += 10;
      } else {
        this.damagePool = 0;
      }
    } else if (Value.ONE <= card.value && card.value <= Value.NINE) {
      this.damagePool += card.value;
    }
    this.setNextColorAndValue(card);
    if (card.penalty) {
      this.penaltyStack.push(card);
    }
    if (this.currentPlayer().hand.length === 1) {
      this.currentPlayer().uno();
    }
  }

  beginTurn() {
    console.log(this.currentPlayer().name, "round");
    console.log("hand", this.currentPlayer().hand.slice());
    console.log("last card:", this.lastCard());
    console.log("color:", this.currentColor);
    console.log("value:", this.currentValue);
    console.log("penalty stack", this.penaltyStack);

    // penalty
    if (this.penaltyStack.length > 0) {
      const penaltyCard = this.penaltyStack.pop();
      if (penaltyCard.value == Value.SKIP) {
        console.log("skip");
      } else {
        const avoidCard = this.currentPlayer().receivePenalty(penaltyCard);
        if (avoidCard != null) {
          discard(avoidCard);
          penaltyStack.push(penaltyCard);
        } else {
          if (penaltyCard.value === Value.DRAW_TWO) {
            console.log("draw two");
            this.currentPlayer().deal(this.deck.draw(2));
          } else if (penaltyCard.value === Value.WILD_DRAW_FOUR) {
            console.log("draw four");
            this.currentPlayer().deal(this.deck.draw(4));
          }
        }
      }
      return;
    }

    let matchedCard = this.currentPlayer().discard(this.currentColor,
                                                   this.currentValue);
    while (matchedCard === null) {
      if (this.gameMode === Mode.TRADITIONAL) {
        let card = this.deck.draw(1)[0];
        console.log("draw", card);
        if (card === undefined) {
          this.currentPlayer().knockOut = true;
          console.log("deck empty => player knocked out");
          return;
        }
        if (card.color === this.currentColor ||
            card.value === this.currentValue ||
            card.color === Color.WILD) {
          matchedCard = card;
        } else {
          this.currentPlayer().deal([card]);
        }
      } else if (this.gameMode === Mode.BATTLE_PUNO) {
        this.currentPlayer().deal(this.deck.draw(1));
        this.currentPlayer().hp -= damagePool;
        this.currentPlayer().knockOut = this.currentPlayer().hp <= 0;
        damagePool = 0;
      }
    }
    if (matchedCard.value === Value.REVERSE) {
      this.reverse();
    }
    this.discard(matchedCard);
  }

  endTurn() {
    this.currentPlayerIndex =
        this.clockwise ? mod(this.currentPlayerIndex + 1, 4)
                       : mod(this.currentPlayerIndex - 1, 4);
  }

  start() {
    console.log("score goal", this.scoreGoal);
    let scoreBoard = [this.players[0].score, this.players[1].score,
                      this.players[2].score, this.players[3].score];
    while (Math.max(...scoreBoard) < this.scoreGoal) {
      this.initialize();
      let round = 0;
      while (!this.isGameOver()) {
        if (!this.currentPlayer().knockOut) {
          this.beginTurn();
        }
        this.endTurn();
      }
      this.calcScore();
      scoreBoard = [this.players[0].score, this.players[1].score,
                    this.players[2].score, this.players[3].score];
      console.log(scoreBoard);
    }
  }

  /*********************************************************************/
  totalCards() {
    let numCards = this.deck.deck.length + this.discardPile.length;
    for (let i in this.players) {
      numCards += this.players[i].hand.length;
    }
    return numCards;
  }
  /*********************************************************************/
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

export default PunoGame;
