// Variable Declarations
let dealerSum = 0;
let dealerAceCount = 0;
let dealersCards = document.getElementById("dealer-cards");

let yourSum = 0;
let yourAceCount = 0;

let cardValues = []
let cardName;
let cardImg;
let card;

let hidden;
let deck = [];

let canHit = true; 

let popUpDiv = document.getElementById("popup_bg");
let closePopUpDiv = document.getElementById("losePopUp")

// Disable 'Deal' button for now
document.getElementById("nextHand").disabled = true;


// Functions to run on load
window.onload = function() {
    buildDeck();
    startGame();
    //openPopup(); // Cache this so it only shows up the first time
}



function openPopup() {
    popUpDiv.style.display = "block";
}



function closePopup() {
    popUpDiv.style.display = "none";
}



//function openLosePopup() {
//    closePopUpDiv.style.display = "inline-block";
//    return document.getElementById("results").innerText = "BUSTED"
//}


// Builds deck from names of corresponding card values, extracts values from name 
function buildDeck() {
    let values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    let types = ["C", "D", "H", "S"];

    for(let i = 0; i < types.length; i++) {
        for(let j = 0; j < values.length; j++) {
            deck.push(values[j] + "-" + types[i]); 
        }
    }
    shuffleDeck(); // Shuffle deck after its built
                                             console.log(`Deck: ${deck}`);
}

/* Fisher-Yates algorithm used to shuffle ordered deck takes a list of all elements
in a sequence & continually determines the next element in the shuffled sequence by
randomly drawing an element from the list until no elements remain. 
*/
function shuffleDeck() {
     for(let i = 0; i < deck.length; i++) {

        let j = Math.floor(Math.random() * deck.length);
        let temp = deck[i]; // Store card at i
        deck[i] = deck[j]; // replace card at i with card at j 
        deck[j] = temp; // replace card at j with stored card i
    }
                                            console.log(`Deck: ${deck} `);
}

/*
    Game starts here with two for loops. First loop is responsible for dealing 
    players cards & second loop deals dealers cards. Both loops start by creating
    a variable that will store a new "img" element. Then we set another variable 
    (card) to equal a random card popped off the deck. We then take the newly
    made "img element" (which at this point is just and empty img element) and
    edit its .src to equal the file path ./cards/ + card + .png. This ultimately
    allows us to set our cardImg varaible to the appropriate card we need.
    We then select our element by id and append or newly set cardImg.

    Note that the second loop does the exact same thing, only difference is the
    pressence of the 'hidden' variable which represents the hidden dealer card.

    Function ends with a check if the dealer is dealt blackjack immediately.
    When this happens both scores are shown and a popup is shown. 'hit' & 'stay'
    functionality are both disabled while the next hand button is enabled. 
*/
let dealerCard;
function startGame() {
    for(let i = 0; i < 2; i++) {
        cardImg = document.createElement("img");
        card = deck.pop();
        cardImg.src = "./cards/" + card + ".png";

        document.getElementById("your-cards").append(cardImg);

        yourSum += getValue(card);
        yourAceCount += checkAce(card);
    }
                                            console.log(`PlayerSum: ${yourSum}`);
    for(let i = 0; i < 1; i++) {
        cardImg = document.createElement("img");
        dealerCard = deck.pop();
        hidden = deck.pop() // Set dealers hidden card to pop'd element
        cardImg.src = "./cards/" + dealerCard + ".png";

        document.getElementById("dealer-cards").append(cardImg);

        dealerSum += getValue(dealerCard) + getValue(hidden);
        dealerAceCount += checkAce(dealerCard) + checkAce(hidden);
    }
                                            console.log(`DealerHidden: ${hidden}`);
                                            console.log(`DealerSum: ${dealerSum}`);
    if(dealerSum == 21) {
        document.getElementById("hidden").src = "./cards/" + hidden + ".png";

        document.getElementById("dealer-sum").innerText = dealerSum;
        document.getElementById("your-sum").innerText = yourSum;
        document.getElementById("results").innerText = "Dealer Wins by BlackJack!"
        document.getElementById("results").classList.add("has-text");

        document.getElementById("hit").disabled = true;
        document.getElementById("stay").disabled = true;
        
        document.getElementById("nextHand").disabled = false;
        document.getElementById("nextHand").classList.add("show");
    }
     if(checkPairs()) {
        document.getElementById("card-container").classList.add("show");
        document.getElementById("your-cards").classList.add("show");
        document.getElementById("your-cards2").classList.add("show");
        document.getElementById("button-container").classList.add("show");
        document.getElementById("second-handbutt").style.display = "inline-block"
                                            console.log('pair')
        const lastCard = document.querySelector("#your-cards img:last-child");
        cardImg = document.createElement("img");
        cardImg.src = "./cards/" + card + ".png";
        document.getElementById("your-cards2").append(cardImg);
        lastCard.remove();

        //document.getElementById("your-cards2").append(lastCard.cloneNode(true));
    }
}

function checkPairs() {
    const playerCards = document.getElementById("your-cards");
                                            console.log(`PlayersCardsObj: ${playerCards}`);
    cardImg = playerCards.getElementsByTagName("img");
                                            console.log(`PlayersCardsImg: ${cardImg}`);
    for(let img of cardImg) {
        const cardSrc = img.src;
                                            console.log(`CardSrc: ${cardSrc}`);
        cardName = img.src.split("/").pop().split(".")[0];
        const value = cardName.split("-")[0];
        cardValues.push(value);
    }
                                            console.log(`Card Values: ${cardValues}`);
    if(cardValues[0] == cardValues[1]) {
        return true 
    } else {
        return false
    }
}


/*
    When called adds another card to the players hand and appends that card img
    to the 'your-cards' element using the same logic found in startGame().
    
    Function ends with a check to see if reduceAce() > 21 if it is then game is 
    over and end state is reached.
*/
function hit() {
    card = deck.pop();
    cardImg = document.createElement("img");
    cardImg.src = "./cards/" + card + ".png";

    yourSum += getValue(card);
    yourAceCount += checkAce(card);

    document.getElementById("your-cards").append(cardImg);

                                            console.log(`PlayerSum: ${yourSum}`);

    if(reduceAce(yourSum, yourAceCount) > 21) {
        document.getElementById("results").innerText = "BUSTED!"
        document.getElementById("results").classList.add('has-text');

        document.getElementById("hit").disabled = true;
        document.getElementById("stay").disabled = true;

        document.getElementById("nextHand").disabled = false;
        document.getElementById("nextHand").classList.add('show');
    }
}

/*
    TODO:
    [] Figure out a setInterval to animate cards being dealt
    

    This function is called when the player is satisfied with their hand and 
    wants to take their chances to 'stand' against the dealer. When called, a
    while loop is initaited that will run until the dealers sum is no longer
    less than 17. The same method as before is applied to retrieve a card from 
    the deck and then appended to the already existing dealers-cards img element.

    Once dealersSum >= 17 a serious of checks is called by results() 
    to decided which end message to be displyed. Once this is done end state 
    is reached & pop up should be visible.
*/


function stay() {
    document.getElementById("hidden").src = "./cards/" + hidden + ".png";
    document.getElementById("hit").disabled = true;

    let intervalDeal = setInterval(() => {
        if (dealerSum < 17) {
            cardImg = document.createElement("img");
            card = deck.pop();
            cardImg.src = "./cards/" + card + ".png";

            dealerSum += getValue(card);
            dealerAceCount += checkAce(card);

            document.getElementById("dealer-cards").append(cardImg);

            dealerSum = reduceAce(dealerSum, dealerAceCount);
        } else {
            clearInterval(intervalDeal);
            results()
        }
    }, 700);
}



function results() {
    canHit = false;

    let message = "";

    if(yourSum > 21) {
        message = "You Lose!";

    } else if(dealerSum > 21) {
        message = "You Win!";

    } else if(yourSum == dealerSum) {
        message = "Tie!";

    } else if(yourSum > dealerSum) {
        message = "You Win!";

    } else if (yourSum < dealerSum) {
        message = "You Lose!";
    }

    document.getElementById("dealer-sum").innerText = dealerSum;
    document.getElementById("your-sum").innerText = yourSum;

    document.getElementById("nextHand").disabled = false;
    document.getElementById("nextHand").classList.add('show');

    const resultsElement = document.getElementById("results");
    resultsElement.innerText = message;
    resultsElement.classList.add('has-text');

}

                                            console.log(`DealerSum: ${dealerSum}`);


/*
    Method that allows us to extract an integer value from the card images.
    does this by splitting the string in which the card is saved as and returning
    the parseInt result of the [0] split.

    not that for the values of the face cards we have a check if(isNaN) we can
    safely say that if it is not a number and the value == "A" then we return
    11 for the Ace.. else{} we return 10 to account for all other face cards.

    method returns a parseInt of the value.
*/
function getValue(card) {
    let data = card.split("-");
    let value = data[0];

    if(isNaN(value)) {
        if(value == "A") {
            return 11;
        }
        return 10;
    }
    return parseInt(value);
}

/*
    Keeps track of total # of aces in hand        
*/
function checkAce(card) {
    if(card == "A") {
        return 1;
    }
    return 0;
}

/*
    Sets ace value to 1 if our sum > 21 and aceCount > 0
*/
function reduceAce(yourSum, yourAceCount) {
    while(yourSum > 21 && yourAceCount > 0) {
        yourSum -= 10;
        yourAceCount -= 1;
    }
    return yourSum;
}

// Even listeners
document.getElementById("stay").addEventListener("click", stay);
document.getElementById("hit").addEventListener("click", hit);
document.getElementById("rulesButton").addEventListener("click", openPopup);
document.getElementById("addDeck").addEventListener("click", buildDeck);
document.getElementById("nextHand").addEventListener("click", buildDeck);


