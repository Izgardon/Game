'strict mode'

import { ifClimbing, running, setUpManMovement, jumping, manElem, getManRect, roofRunning, gameOverKeyBindings, setUpMan } from "./man.js";
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

//Updating score

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

        classListOnStart()


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

function gameIntervalSetUp() {
    setUpManMovement()
    introMessage.classList.remove('intro-message')
}



//Winning the game

function gameWin() {
    let manLeft = getCustomProperty(manElem, '--left');
    if (manLeft >= 7000) {
        gameRunning = false;
        classListOnEnd()
        gameOverKeyBindings()

    }
}

function classListOnStart() {
    scoreElem.textContent = 0;
    introMessage.classList.add('intro-message')
    startGameSign.classList.add('hidden')
    scoreElem.classList.remove('center');

    //Starting the animations
    platformElems.forEach(element => {
        element.classList.add('animation-platform-background')
    });
    world.classList.add("animation-sky")
    sunContainer.classList.add("animation-sun");
}

function classListOnEnd() {

    scoreElem.classList.add('center');
    startGameSign.classList.remove('hidden')
        //Preventing animations running twice
    platformElems.forEach(element => {
        element.classList.remove('animation-platform-background')
    });

    world.classList.remove("animation-sky")
    sunContainer.classList.remove("animation-sun");
}