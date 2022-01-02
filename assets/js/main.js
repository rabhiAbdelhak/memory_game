class MemoryGame {
    constructor(totalTime, cards, nbCards, enableAudio) {
        this.totalTime = totalTime;
        this.nbCards = nbCards;
        this.cards = cards;
        this.ticker = document.querySelector('.flips #counter');
        this.timer = document.querySelector('.time');
        this.victoryOverlay = document.querySelector('#victory-overlay');
        this.GameOverOverlay = document.querySelector('#game-over-overlay');
        this.cardsContainer = document.querySelector('.cards-container')
        this.musicController = new MusicController();
        this.enableAudio = enableAudio;

    }

    play() {
        this.enableAudio ? this.musicController.PlayBackMusic() : '';
        this.cardToCheck = null;
        this.totalClicks = 0;
        this.metchedCards = [];
        this.busy = true;
        this.remainingTime = this.totalTime;
        this.timer.innerText = this.totalTime;
        this.ticker.innerText = 0;
        this.shuffledCards();
        this.OrganizeGame();
        this.showAllCards();
        setTimeout(() => {
            this.hideAllCards();
            this.timing();
            this.busy = false;
        }, 5000);
    }

    timing() {
        this.intervalTime = setInterval(() => {
            this.remainingTime --;
            this.timer.innerText = this.remainingTime;
            if (this.remainingTime == 0) {
                this.gameOver();
            }
        }, 1000)
    }

    hideAllCards() {
        this.cards.forEach(card => {
            card.classList.remove('visible')
        })
    }

    showAllCards() {
        this.cards.forEach(card => {
            card.classList.add('visible')
        })
    }

    shuffledCards() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            let randIndex = Math.floor(Math.random() * (i + 1));
            this.cards[randIndex].style.order = i;
            this.cards[i].style.order = randIndex;
        }
    }
    gameOver() {
        this.musicController.stopBackMusic();
        this.enableAudio ? this.musicController.playGoMusic() : '';
        this.GameOverOverlay.classList.add('visible');
        clearInterval(this.intervalTime);
        this.hideAllCards();
    }

    checkWinGame() {
        if (this.metchedCards.length == this.cards.length) {
            this.musicController.stopBackMusic();
            this.enableAudio ? this.musicController.playVictoryMusic() : '';
            this.victoryOverlay.classList.add('visible');
            clearInterval(this.intervalTime);
        }

    }

    check(card) {
        let cardValue = card.querySelector('.card-value').getAttribute('src');
        let cardTocheckValue = this.cardToCheck.querySelector('.card-value').getAttribute('src');
        this.totalClicks ++;
        if (cardValue == cardTocheckValue) {
            this.metchedCards.push(card);
            this.metchedCards.push(this.cardToCheck);
            this.cardToCheck = null;
            this.checkWinGame();
        } else {
            for (let i = 0; i < this.cards.length; i++) {
                if (!this.metchedCards.includes(this.cards[i])) {
                    this.cards[i].classList.remove('visible');
                    this.cardToCheck = null;
                }
            }
        }
        this.busy = false;
        this.ticker.innerText = this.totalClicks;
    }
    flipCard(card) {
        if (this.cardCanbeFliped(card)) {
            this.musicController.flip();
            card.classList.add('visible');
            console.log(this.ticker)
            if (this.cardToCheck == null) {
                this.cardToCheck = card;
            } else {
                this.busy = true;
                setTimeout(() => {
                    this.check(card);
                }, 1000)

            }

        }
    }

    OrganizeGame() {
        for (let i = this.cards.length - 1; i > this.nbCards - 1; i--) {
            this.cards[i].remove();
            this.cards.pop();
        }
        console.log(this.cards);

    }

    cardCanbeFliped(card) {
        return(!this.busy && !(this.cardToCheck == card) && !this.metchedCards.includes(card))
    }
}

class MusicController {
    constructor() {
        this.backMusic = new Audio('assets/sounds/creepy.mp3');
        this.flipSound = new Audio('assets/sounds/flip.wav');
        this.GoMusic = new Audio('assets/sounds/gameOver.wav');
        this.MathMusic = new Audio('assets/sounds/match.wav');
        this.victoryMusic = new Audio('assets/sounds/victory.wav');

    }

    PlayBackMusic() {
        this.backMusic.currentTime = 0;
        this.backMusic.play()
    }

    stopBackMusic() {
        this.backMusic.currentTime = 0;
        this.backMusic.pause();
    }

    flip() {
        this.flipSound.play();
    }

    playVictoryMusic() {
        this.victoryMusic.play();
    }

    playGoMusic() {
        this.GoMusic.play();
    }
}


function ready() {
    let startInstructions = Array.from(document.getElementsByClassName('start-instruction'));
    let cards = Array.from(document.getElementsByClassName('card'));
    let game;
    let nbCards = 16;
    let time = 120;
    let enableAudio = true;
    let nbCardsSelections = Array.from(document.querySelectorAll('.menu ul li'));
    let soundCheck = document.querySelector('#sound');


    nbCardsSelections.forEach(select => {
        select.addEventListener('click', (e) => {
            time = e.target.dataset.time;
            nbCards = e.target.dataset.nbcards;
            e.target.parentElement.querySelectorAll('li').forEach(li => li.classList.remove('active'))
            e.target.classList.add('active');

        });
    });
    soundCheck.addEventListener('click', (e) => {
        if (this.checked == true) {
            enableAudio = true;
        } else {
            enableAudio = false;
        }
    })

    startInstructions.forEach(instruction => {
        instruction.addEventListener('click', (e) => {
            if (instruction.classList.contains('visible')) {
                instruction.classList.remove('visible');
            } else {
                instruction.parentElement.parentElement.classList.remove('visible');
            } game = new MemoryGame(time, cards, nbCards, enableAudio);
            game.play();
        });
    });


    cards.forEach(card => {
        card.addEventListener('click', (e) => {
            game.flipCard(card);
        })
    })
}


if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready());
} else {
    ready();
}
