class Deck {
  constructor(extraCardDisabled) {
    this.deck = [];
    // colored cards
    for (let color = Color.RED; color <= Color.BLUE; ++color) {
      for (let value = Value.ZERO; value <= Value.DRAW_TWO; ++value) {
        let coloredCard = new Card(color, value);
        for (let i = 0; i < coloredCard.numCards; ++i) {
          let _card = new Card(color, value);
          // Load different image with same value and color
          _card.numID = i;
          this.deck.push(_card);
        }
      }
    }
    // wild cards
    for (let value = Value.TRADE; value <= Value.WILD_DRAW_FOUR; ++value) {
      let wildCard = new Card(Color.WILD, value);
      if (extraCardDisabled && wildCard.optional) {
        continue;
      }
      for (let i = 0; i < wildCard.numCards; ++i) {
        let _card = new Card(Color.WILD, value);
        // Load different image with same value and color
        _card.numID = i;
        this.deck.push(_card);
      }
    }
    this.shuffle();
  }

  shuffle() {
    for (let i = this.deck.length - 1; i > 0; --i) {
      let j = Math.floor(Math.random() * this.deck.length);
      [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
    }
  }

  draw(numCards, supplement=undefined) {
    if (numCards <= 0) {
      return [];
    }
    if (numCards > this.deck.length) {
      if (supplement === undefined || supplement.length === 0) {
        return this.deck.splice(0);
      } else {
        this.putback(supplement.splice(0));
        this.shuffle();
      }
    }
    return this.deck.splice(-numCards);
  }

  drawNumbered(numCards) {
    let numberedCards = [];
    let notNumberedCards = [];
    while (this.deck.length != 0 && numberedCards.length < numCards) {
      let card = this.deck.splice(-1)[0];
      if (card.numbered) {
        numberedCards.push(card);
      } else {
        notNumberedCards.push(card);
      }
    }
    this.putback(notNumberedCards);
    return numberedCards;
  }

  drawColored(numCards) {
    let coloredCards = [];
    let wildCards = [];
    while (this.deck.length != 0 && coloredCards.length < numCards) {
      let card = this.deck.splice(-1)[0];
      if (card.color === Color.WILD) {
        wildCards.push(card);
      } else {
        coloredCards.push(card);
      }
    }
    this.putback(wildCards);
    return coloredCards;
  }

  putback(cards) {
    this.deck = cards.concat(this.deck);
  }

  get length() { return this.deck.length; }
}
