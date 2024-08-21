class BlackjackGame {
    constructor() {

        this.deck = [];
        this.hidden = null;
        this.dealersUpCard = null;
        this.dealersSum = 0;
        this.dealersAceCount = 0;
        this.playersSum = 0;
        this.playersAceCount = 0;
        this.cardValues = [];
        this.canHit = true;
        
// Data Selected queries
        this.popUp = document.querySelector('[data-popup]');
        this.closePop = document.querySelector('[data-close-rules]');
        this.rulesButton = document.querySelector('[data-rules-button]');
        this.adddeckButton = document.querySelector('[data-addDeck-button]');
        this.nextHandButton = document.querySelector('[data-nextHand-button]');
        this.stayButtons = document.querySelectorAll('[data-stay-button]');
        this.hitButtons = document.querySelectorAll('[data-hit-button]');
        this.playersCards = document.querySelectorAll('[data-players-cards]');
        this.playersScore = document.querySelector('[data-players-sum]');
        this.dealersCards = document.querySelector('[data-dealers-cards]');
        this.dealersHiddenCard = document.querySelector('[data-dealers-hidden-card]');
        this.dealersScore = document.querySelector('[data-dealers-sum]');
        this.resultsPop = document.querySelector('[data-results]');

// Initalize Game
        this.gameInit();
    };



    gameInit() {
        this.rulesButton.addEventListener('click', () => this.openPopup());

        this.closePop.addEventListener('click', () => this.closePopup());

        this.adddeckButton.addEventListener('click', () => this.buildDeck());

        this.nextHandButton.addEventListener('click', () => this.startGame());
        this.nextHandButton.disabled = true;


        this.hitButtons.forEach((button, index) => {
            button.addEventListener('click', () => this.hit(index));
        });

        this.stayButtons.forEach((button, index) => {
            button.addEventListener('click', () => this.stay(index));
        });

        this.buildDeck();
        this.startGame();
    };



    buildDeck() {
        let values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
        let types = ["C", "D", "H", "S"];

        for (let i = 0; i < types.length; i++) {
            for (let j = 0; j < values.length; j++) {
                this.deck.push(values[j] + "-" + types[i]);
            }
        }
        this.shuffleDeck(); // Shuffle deck after its built
        console.log(`deck: ${this.deck}`);
    };



    shuffleDeck() {
        for (let i = 0; i < this.deck.length; i++) {

            let j = Math.floor(Math.random() * this.deck.length);
            let temp = this.deck[i]; // Store card at i
            this.deck[i] = this.deck[j]; // replace card at i with card at j 
            this.deck[j] = temp; // replace card at j with stored card i
        }
        console.log(`this.deck: ${this.deck} `);
    };



    startGame() {
        for (let i = 0; i < 2; i++) {
            this.cardImg = document.createElement("img");
            this.card = this.deck.pop();
            this.cardImg.src = "./cards/" + this.card + ".png";

            this.playersCards[0].append(this.cardImg);

            this.playersSum += this.getValue(this.card);
            this.playersAceCount += this.checkAce(this.card);
        };



        for (let i = 0; i < 1; i++) {
            this.cardImg = document.createElement("img");
            this.dealersUpCard = this.deck.pop();
            this.hidden = this.deck.pop() // Set dealers hidden card to pop'd element
            this.cardImg.src = "./cards/" + this.dealersUpCard + ".png";

            this.dealersCards.append(this.cardImg);

            this.dealersSum += this.getValue(this.dealersUpCard) + this.getValue(this.hidden);
            this.dealersAceCount += this.checkAce(this.dealersUpCard) + this.checkAce(this.hidden);
        };
        console.log(`DealerHidden: ${this.hidden}`);
        console.log(`DealerSum: ${this.dealersSum}`);

        if (this.dealersSum == 21) {
            this.dealersHiddenCard.src = "./cards/" + this.hidden + ".png";
            this.dealersScore.innerText = this.dealersSum;
            this.playersScore.innerText = this.playersSum;
            this.resultsPop.innerText = "Dealer Wins by BlackJack!"
            this.resultsPop.classList.add("has-text");

            this.hitButtons.disabled = true;
            this.stayButtons.disabled = true;
            this.nextHandButton.disabled = false;

            this.nextHandButton.classList.add('show');
        };



        if (this.checkPairs()) {

            document.getElementsByClassName("js-sum-container")[0].classList.add("show");

            document.getElementsByClassName("js-card-container")[0].classList.add("show");
            this.playersCards[0].classList.add("show");

            document.getElementsByClassName("js-button-container")[0].classList.add("show");
            document.getElementsByClassName("js-second-handbutt")[0].style.display = "inline-block"

            const lastCard = document.querySelector(".js-players-cards img:last-child");
            this.cardImg = document.createElement("img");
            this.cardImg.src = "./cards/" + this.card + ".png";
            document.querySelector(".js-players-cards2").append(this.cardImg);
            lastCard.remove();

        };
    };



    checkPairs() {
        this.cardImg = this.playersCards[0].getElementsByTagName("img");
        for (let img of this.cardImg) {
            //const cardSrc = img.src;
            this.cardName = img.src.split("/").pop().split(".")[0];
            const value = this.cardName.split("-")[0];
            this.cardValues.push(value);
        }
        console.log(`Player Card Values: ${this.cardValues}`);
        console.log(`PlayerSum: ${this.playersSum}`)

        if (this.cardValues[0] == this.cardValues[1]) {
            return true
        } else {
            return false
        }
    }



    hit(index) {
        this.card = this.deck.pop();
        this.cardImg = document.createElement("img");
        this.cardImg.src = "./cards/" + this.card + ".png";

        this.playersSum += this.getValue(this.card);
        this.playersAceCount += this.checkAce(this.card);

        this.playersCards[index].append(this.cardImg);

        console.log(`PlayerSum (Hand ${index + 1}): ${this.playersSum[index]}`);

        if (this.reduceAce(this.playersSum, this.playersAceCount) > 21) {
            this.resultsPop.innerText = "BUSTED!"
            this.resultsPop.classList.add("has-text");

            this.hitButtons[index].disabled = true;
            this.stayButtons[index].disabled = true;

        if(this.hitButtons.every(btn => btn.disabled)) {
                this.nextHandButton.disabled = false;
                this.nextHandButton.classList.add("show");
            }
        }
    }



    stay() {
        this.dealersHiddenCard.src = "./cards/" + this.hidden + ".png";
        this.hitButtons.disabled = true;
        this.stayButtons.disabled = true;

        let intervalDeal = setInterval(() => {
            if (this.dealersSum < 17) {
                this.cardImg = document.createElement("img");
                this.card = this.deck.pop();
                this.cardImg.src = "./cards/" + this.card + ".png";

                this.dealersSum += this.getValue(this.card);
                this.dealersAceCount += this.checkAce(this.card);

                this.dealersCards.append(this.cardImg);

                this.dealerSum = this.reduceAce(this.dealerSum, this.dealersAceCount);
            } else {
                clearInterval(intervalDeal);
                this.results()
            }
        }, 700);
    }



    results() {
        this.canHit = false;

        let message = "";

        if (this.playersSum > 21) {
            message = "You Lose!";

        } else if (this.dealersSum > 21) {
            message = "You Win!";

        } else if (this.playersSum == this.dealersSum) {
            message = "Tie!";

        } else if (this.playersSum > this.dealersSum) {
            message = "You Win!";

        } else if (this.playersSum < this.dealersSum) {
            message = "You Lose!";
        }

        this.dealersScore.innerText = this.dealersSum;
        this.playersScore.innerText = this.playersSum;
        this.nextHandButton.disabled = false;
        this.nextHandButton.classList.add("show");
        this.resultsPop.innerText = message;
        this.resultsPop.classList.add("has-text");
    }



    getValue(card) {
        let data = card.split("-");
        let value = data[0];

        if (isNaN(value)) {
            if (value == "A") {
                return 11;
            }
            return 10;
        }
        return parseInt(value);
    }



    checkAce(card) {
        if (card == "A") {
            return 1;
        }
        return 0;
    }



    reduceAce(playerSum, playerAceCount) {
        while (playerSum > 21 && playerAceCount > 0) {
            playerSum -= 10;
            playerAceCount -= 1;
        }
        return playerSum;
    }


    openPopup() {
        this.popUp.style.display = "block";
    };

    closePopup() {
        this.popUp.style.display = "none";
    };
};


const game = new BlackjackGame();

