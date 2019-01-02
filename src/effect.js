/**
 * An enum with the card effect ids
 * @enum {number}
 */
const Effect = {
  NULL: 0,            // No effects
  ADD_DAMAGE: 1,      // Add damage to pool
  CLEAR_DAMAGE: 2,    // Reset damage pool
  CHOOSE_COLOR: 3,    // Choose next color
  DRAW_TWO: 4,        // Penalty 2
  DRAW_FOUR: 5,       // Penalty 4
  SKIP: 6,            // Next player skip turn
  REVERSE: 7,         // Reverse play order
  SKIP_PENALTY: 8,    // Bypass penalty to next player
  REVERSE_PENALTY: 9, // Reverse penalty to original player
  HIT_ALL: 10,        // All other player draws 2, cannot be skipped or reversed

  DISCARD_ALL: 11,    // Discard all cards with same color as last card played on table,
                      // if last card is also 'discard all', play this card will not
                      // discard any other cards

  TRADE: 12,          // Exchange all hand cards with another player
  WILD_CHAOS: 13      // Random decide color and number
};

export default Effect;
