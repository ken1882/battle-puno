# battle-puno
Battle Puno (https://battle-puno.github.io/battle-puno/)


## Battle-Puno | Rules v0.1.0

Most rules are same as original uno, and all details will be listed below.


## General rules:
  - **Beginning:**<br>
  At the beginning of the game, each player draws a card from the deck, and the player with the highest card point(see the 'Card Point' below) will play first with clockwise order. 
  
  - **Main process:**<br>
  First, draws a coloured card on table(if not put back and draws again then shuffle), the one plays the card must play the card matched to last card's colour(red/blue/green/yellow) or symbol(0-9, skip, reverse......). The black color card can be played regardless of the color of previous card.
  If any player has no cards in the hand, the round ends and calculate the score. And the last card in the hand MUST NOT be black card except 'wild', otherwise draw a card from the deck.
  
  - **Overtime:**<br>
  When it comes there's no card left on deck, the game continues. If the player has no more card to play, he/she keeps the card in hand but no longer be able to play in this round(knocked out). The rest players follow the same process until there's only one player left and he/she also has no card to play.


## Cards Information:
There're total of 116 cards in the game.

### Number Cards:
Total of 76, four color with each two of 1-9 cards and one of 0 card.

### Special Cards:
  - **Coloured:** 24. Each two of skip, reversed and draw 2(+2).<br>
  - **Black:** 12. 4 Wild, 4 Wild Draw(+4), 2 Trade, 2 Wild Hit All, 2 Wild Chaos, 2 Discard All.

### Special card utility:
  - **Skip:** Next player cannot play the card for 1 turn. Or when the last player plays draw card(or the penalty is upon you by other player plays skip or reverse), you can play this card to transfer the penalty to next player but must match the color.
  
  - **Reverse:** Reverse the play order(clockwise to counter clockwise and vice versa). Or when last player plays draw card(or the penalty is upon you by other player plays skip or reverse), you can play this card to reflect the penalty to last player himself/herself but must match the color.
  
  - **Draw 2(+2):** Next player draw 2 cards as penalty.<br>
  - **Wild:** Choose any color you desired as next color.<br>
  - **Wild Draw(+4):** Choose any color you desired as next color, and next player draw 4 cards as penalty.<br>
  - **Trade:** Trade all of your cards in hand with another player by your choose.
  - **Wild Chaos:** After played, the next color and number will randomly chosen.
  - **Wild Hit All:** All other player draws 2 cards and choose a color desired as next color.
  - **Discard All:** Discard all of cards with same color as last card. If last card is also discard all, play this card without discard any other cards.

### Card Point:
  - **Number card:** Same as itd number.<br>
  - **Skip/Reverse/Draw 2:** 20.<br>
  - **Discard All/Trade:** 30.<br>
  - **Wild/Wild Draw/Wild Hit All/Wild Chaos:** 50.<br>

## Game Modes:
  - **Traditional:**<br>
  Traditional uno game. The one played all cards in hand or the last stand wins. (You can choose whether add Trade/Wild Chaos/Discard All card to deck since they're not in original uno game.)

  - **Battle Puno!:**<br>
  All cards are available in this mode. Every player begins with 200 hitpoints, when a number card is played, add its number to damage pool, if the card played is zero, the user can choose whether reset the damage pool or +10 to it. Whoever have no more card to play(or just don't wanna play one in the turn) and have to draw from the deck, his/her loses the hitpoints equal to the number in damage pool, resets the damage pool afterward and discards those cards.<br>
  When the round ends, every player loses the hitpoints equal to the sum of card points he/she left in the hand, then add the hitpoints left to the score(lose score if hp is negative).<br>
  The player who reach 500 scores first wins the game, and players are ranked by the score.

 - **Death Match:**<br>
 Most are same as **Battle Puno!**, but when the number of card in player's hand is less than the number had at beginning, draws the card from deck until the number met. If the deck is out of card, shuffle the discarded cards as the deck. In rare situation, the cards played are all in the damage pool and no card in deck; resets the damage pool and shuffle those cards as deck. The player whose hp is lower or equal to zero will be knocked out. The last stand wins.
