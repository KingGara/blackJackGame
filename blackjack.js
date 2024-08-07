let dealerSum = 0;
let dealerAceCount = 0;
let dealersCards = document.getElementById("dealer-cards");

let yourSum = 0;

let yourAceCount = 0;


let hidden;
let deck;

let canHit = true; 

let popUpDiv = document.getElementById("popup_bg");
let closePopUpDiv = document.getElementById("losePopUp")




window.onload = function() {
    buildDeck();
    shuffleDeck();
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


// Retrives card images based of corresponding values 
function buildDeck() {
    let values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    let types = ["C", "D", "H", "S"];
    deck = [];

    for(let i = 0; i < types.length; i++) {
        for(let j = 0; j < values.length; j++) {
            deck.push(values[j] + "-" + types[i]); 
        }
    }
                                             console.log(`Deck: ${deck}`);
}


// fisher-yates algorithm 
function shuffleDeck() {
     for(let i = 0; i < deck.length; i++) {

        let j = Math.floor(Math.random() * deck.length);
        let temp = deck[i]; // Store card at i
        deck[i] = deck[j]; // replace card at i with card at j 
        deck[j] = temp; // replace card at j with stored card i
    }
                                            console.log(`Deck: ${deck} `);
}



function startGame() {
    for(let i = 0; i < 2; i++) {
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "./cards/" + card + ".png";

        yourSum += getValue(card);
        yourAceCount += checkAce(card);

        document.getElementById("your-cards").append(cardImg);
    }
                                            console.log(`PlayerSum: ${yourSum}`);

    for(let i = 0; i < 1; i++) {
        hidden = deck.pop() // Set dealers hidden card to pop'd element

        let cardImg = document.createElement("img");
        let card = deck.pop();

        cardImg.src = "./cards/" + card + ".png";
        dealerSum += getValue(card) + getValue(hidden);
        dealerAceCount += checkAce(card) + checkAce(hidden);

        document.getElementById("dealer-cards").append(cardImg);
    }
                                            console.log(`DealerHidden: ${hidden}`);
                                            console.log(`DealerSum: ${dealerSum}`);
    if(dealerSum == 21) {
    document.getElementById("dealer-sum").innerText = dealerSum;

        document.getElementById("results").innerText = "Dealer Wins by BlackJack!"
        document.getElementById("hit").disabled = true;
        document.getElementById("stay").disabled = true;
    
        document.getElementById("results").classList.add('has-text');
        
    }
}



function hit() {
    let card = deck.pop();
    let cardImg = document.createElement("img");
    cardImg.src = "./cards/" + card + ".png";

    yourSum += getValue(card);
    yourAceCount += checkAce(card);
    document.getElementById("your-cards").append(cardImg);

    if(reduceAce(yourSum, yourAceCount) > 21) {
        //canHit = false;
        document.getElementById("results").innerText = "BUSTED!"
        document.getElementById("results").classList.add('has-text');
        document.getElementById("hit").disabled = true;
        document.getElementById("stay").disabled = true;
    }

    //if (!canHit) {
    //    document.getElementById("results").innerText = "BUSTED!";
    //}
}

function stay() {

    while(dealerSum < 17) {
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "./cards/" + card + ".png";
        dealerSum += getValue(card);
        dealerAceCount += checkAce(card);
        document.getElementById("dealer-cards").append(cardImg);
    }

    dealerSum = reduceAce(dealerSum, dealerAceCount);
    yourSum = reduceAce(yourSum, yourAceCount);

    canHit = false;
    document.getElementById("hidden").src = "./cards/" + hidden + ".png";

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

    const resultsElement = document.getElementById("results");
    resultsElement.innerText = message;
    
    resultsElement.classList.add('has-text');
}


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

function checkAce(card) {
    if(card[0] == "A") {
        return 1;
    }
    return 0;
}

function reduceAce(yourSum, yourAceCount) {
    while(yourSum > 21 && yourAceCount > 0) {
        yourSum -= 10;
        yourAceCount -= 1;
    }
    return yourSum;
}


document.getElementById("stay").addEventListener("click", stay);
document.getElementById("hit").addEventListener("click", hit);


