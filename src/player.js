class Player {
  constructor(name, initHP, AI=true) {
    this.name = name;
    this.score = 0;
    this.initHP = initHP;
    this.hp = initHP;
    this.ai = AI;
    this.knockOut = false;
    this.hand = [];
  }

  reset() {
    this.hp = this.initHP;
    this.hand.length = 0;
    this.knockOut = false;
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
      return a.color - b.color;
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

  discard(index) {
    return this.hand.splice(index, 1)[0];
  }

  matching(color, value) {
    let matchedCardIndex = this.findMatchedCard(color, value);
    if (matchedCardIndex === -1) {
      return null;
    }
    return this.discard(matchedCardIndex);
  }

  discardAllByColor(color) {
    let matched = [];
    for (let i in this.hand) {
      if (this.hand[i].color === color) {
        matched.push(i);
      }
    }
    while (matched.length != 0) {
      this.discard(matched.pop());
    }
    console.log("DISCARD ALL COLOR", color);
    console.log(this.hand.slice());
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
    console.log(this.name, "CALL UNO!!!");
  }

  cardsPointSum() {
    let sum = 0;
    for (let i in this.hand) {
      sum += this.hand[i].point;
    }
    return sum;
  }
}
