import Color from './color.js'
import Value from './value.js'

/** Class Card
  * A card consists of 5 properties
  * color, value, point, optional, number of cards
  */
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
        case Value.TRADE:
        case Value.DISCARD_ALL:
          return 30;
        case Value.WILD:
        case Value.WILD_CHAOS:
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
    this.penalty = !!(value === Value.SKIP ||
                      value === Value.DRAW_TWO ||
                      value === Value.WILD_DRAW_FOUR);
  }
}

export default Card;
