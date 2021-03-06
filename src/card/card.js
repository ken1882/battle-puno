class Card {
  constructor(color, value) {
    this.color = color;
    this.value = value;
    this.point = (function() {
      switch (value) {
        case Value.SKIP:
        case Value.REVERSE:
        case Value.DRAW_TWO:
          return 20;
        case Value.WILD:
        case Value.WILD_CHAOS:
          return 30;
        case Value.TRADE:
        case Value.DISCARD_ALL:
        case Value.WILD_HIT_ALL:
        case Value.WILD_DRAW_FOUR:
          return 50;
        default:
          return value;
      }
    })();
    this.optional = (function() {
      switch (value) {
        case Value.TRADE:
        case Value.DISCARD_ALL:
        case Value.WILD_CHAOS:
        case Value.WILD_HIT_ALL:
          return true;
        default:
          return false;
      }
    })();
    this.numCards = (function() {
      if (value === Value.ZERO) {
        return 1;
      }
      if (value === Value.WILD ||
          value === Value.WILD_DRAW_FOUR) {
        return 4;
      }
      return 2;
    })();
    this.numbered = !!(value >= Value.ZERO && value <= Value.NINE);
    this.penalty = !!(value === Value.SKIP ||
                      value === Value.DRAW_TWO ||
                      value === Value.WILD_DRAW_FOUR);
  }

  isEqual(card, compareId=false) {
    if (compareId) {
      return (this.numID === card.numID &&
              (card.color === -1 || this.color === card.color) &&
              this.value === card.value);
    }
    return (card.color === -1 || this.color === card.color) && this.value === card.value;
  }

  isMatched(color, value) {
    return (this.color === color ||
            this.value === value ||
            this.color === Color.WILD);
  }
}
