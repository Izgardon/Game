'strict mode'

import { ifClimbing, running, setUpMan, jumping, manElem, getManRect, roofRunning, gameOverKeyBindings } from "./man.js";
import { getCustomProperty, setCustomProperty } from "./customProperty.js";



//Elements
const platformElems = document.querySelectorAll(".platform")
let world = document.querySelector('body')
let sunContainer = document.querySelector('.sun-container')
let startGameSign = document.querySelector('.start-game')
let scoreElem = document.querySelector(".score")

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
    console.log(score)
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
        score = manLeft / 10;
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
        window.scroll(0, 0);

        //Making sure it can only run once
        gameRunning = true
            //Making sure it doesn't run 2 timeloops at once
        if (!firstLoad) {
            window.requestAnimationFrame(update)
            firstLoad = true
        }
    }

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