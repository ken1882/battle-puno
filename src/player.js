import Color from './card/color.js';
import Value from './card/value.js'

class Player {
  constructor(name, initHP, AI=true) {
    this.name = name;
    this.score = 0;
    this.hp = initHP;
    this.ai = AI;
    this.knockOut = false;
    this.hand = [];
  }

  deal(cards) {
    this.hand = this.hand.concat(cards);
    this.sortHand();
    return this.hand;
  }

  sortHand() {
    this.hand.sort(function(a, b) {
      if (a.color === b.color) {
        return a.value - b.value;
      }
      return b.color - a.color;
    });
  }

  findMatchedCard(color, value) {
    for (let i in this.hand) {
      if (this.hand[i].color === color ||
          this.hand[i].value === value) {
        return i;
      }
    }
    return this.findWildCard();
  }

  findWildCard() {
    for (let i in this.hand) {
      if (this.hand[i].color == Color.WILD) {
        return i;
      }
    }
    return -1;
  }

  findCard(color, value) {
    for (let i in this.hand) {
      if (this.hand[i].color == color &&
          this.hand[i].value === value) {
        return i;
      }
    }
    return -1;
  }

  discard(color, value) {
    let matchedCard = this.findMatchedCard(color, value);
    if (matchedCard === -1) {
      return null;
    }
    return this.hand.splice(matchedCard, 1)[0];
  }

  receivePenalty(penaltyCard, currentColor) {
    if (penaltyCard.value === Value.SKIP) {
      return null;
    }
    let matchedCard = this.findCard(currentColor, Value.SKIP);
    if (matchedCard === -1) {
      matchedCard = this.findCard(currentColor, Value.REVERSE);
      if (matchedCard === -1) {
        return null;
      }
    }
    return this.hand.splice(matchedCard, 1)[0];
  }

  isGoingOut() {
    return this.hand.length === 0;
  }

  uno() {
    console.log(this.name, "call uno");
  }

  cardsPointSum() {
    let sum = 0;
    for (let i in this.hand) {
      sum += this.hand[i].point;
    }
    return sum;
  }

  reset() {
    this.hand.length = 0;
    this.knockOut = false;
  }
}

export default Player;
