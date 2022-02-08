'strict mode'

import { ifClimbing, running, setUpManMovement, jumping, manElem, getManRect, roofRunning, gameOverKeyBindings, setUpMan, sinking, stopAllMovement } from "./man.js";
import { getCustomProperty, setCustomProperty } from "./customProperty.js";



//Elements
const platformElems = document.querySelectorAll(".platform-background")
let world = document.querySelector('body')
let sunContainer = document.querySelector('.sun-container')
let startGameSign = document.querySelector('.start-game')
let scoreElem = document.querySelector(".score")
let introMessage = document.querySelector(".intro")

let score = 0
let lastTime
let gameRunning
let firstLoad = false;





//Game loop time function
function update(time) {
    if (lastTime == null) {
        lastTime = time
        window.requestAnimationFrame(update)
        return
    }
    const delta = time - lastTime

    ifClimbing()
    running()
    jumping(delta)
    scroll()
    roofRunning()
    gameWin()
    updateScore()
    gameLost(delta)


    lastTime = time
    window.requestAnimationFrame(update)

}




//Window Scrolling
function scroll() {
    let manRect = getManRect()
    let manLeft = getCustomProperty(manElem, '--left')
    let manBottom = getCustomProperty(manElem, '--bottom')

    if (manRect.left > 1000) {
        moveScreenWithMan((manLeft - 1000))
    }
    if (manRect.left < 300 && manLeft > 300) {
        moveScreenWithMan((manLeft - 300))
    }

    function moveScreenWithMan(positionX) {
        window.scroll(positionX, 0)


    }
}

//Updating score with mans position

function updateScore() {
    if (gameRunning) {
        let manLeft = getCustomProperty(manElem, '--left')
        score = manLeft - 30;
        if (score < 0) return
        scoreElem.textContent = Math.floor(score)
    }
}


//Game start and refresh


document.addEventListener('keydown', startGame)

function startGame(e) {
    if (gameRunning) return
    if (e.code === "Enter") {
        stopAllMovement()
            //Adds all the classlists ready such as animations
        classListOnStart()

        //Initial position set up of man
        setUpMan()

        window.setTimeout(gameIntervalSetUp, 4000);

        //Making sure it can only run once
        gameRunning = true
            //Making sure it doesn't run 2 timeloops at once
        if (!firstLoad) {
            window.requestAnimationFrame(update)
            firstLoad = true
        }
    }

}
//Delayed function that adds all the keydown events to move the man and clears the screen of words
function gameIntervalSetUp() {
    setUpManMovement()
    introMessage.classList.remove('intro-message')
}



//Winning the game when the flag is reached, will differentiate it from a loss

function gameWin() {
    let manLeft = getCustomProperty(manElem, '--left');
    if (manLeft >= 7000) {
        stopAllMovement()
        classListOnEnd()
        gameOverKeyBindings()
        startGameSign.innerText = "Congratulations! - Press Enter to Play Again"

    }
}

function gameLost(delta) {
    if (getCustomProperty(manElem, "--bottom") <= 55) {
        stopAllMovement()
        sinking(delta)

        window.setTimeout(classListOnEnd(), 200)
        gameOverKeyBindings()


    }

}








//All the things that need to be added when game begins
function classListOnStart() {
    scoreElem.textContent = 0;
    introMessage.classList.add('intro-message')
    startGameSign.classList.add('hidden')
    scoreElem.classList.remove('center');

    //Starting the animations(removing and readding)
    platformElems.forEach(element => {
        element.classList.remove('animation-platform-background')
    });

    world.classList.remove("animation-sky")
    sunContainer.classList.remove("animation-sun");

    platformElems.forEach(element => {
        element.classList.add('animation-platform-background')
    });
    world.classList.add("animation-sky")
    sunContainer.classList.add("animation-sun");
}
//All the removed classes so animations can be reset without refreshing page
function classListOnEnd() {
    gameRunning = false;

    scoreElem.classList.add('center');
    startGameSign.classList.remove('hidden')
    startGameSign.innerText = "FAILURE  Press Enter to Try Again"
        //Preventing animations running twice

}