'strict mode'

import { ifClimbing, running, setUpMan, jumping, manElem, getManRect, roofRunning, gameOver } from "./man.js";
import { getCustomProperty, setCustomProperty } from "./customProperty.js";



//Elements
const platformElems = document.querySelectorAll(".platform")
let world = document.querySelector('body')
let sunContainer = document.querySelector('.sun-container')
let startGameSign = document.querySelector('.start-game')


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


    lastTime = time
    window.requestAnimationFrame(update)
    console.log(firstLoad)
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


//Game start and refresh


document.addEventListener('keydown', startGame)

function startGame(e) {
    if (gameRunning) return
    if (e.code === "Enter") {


        setUpMan()
        window.scroll(0, 0);

        startGameSign.classList.add('hidden')

        //Starting the animations
        platformElems.forEach(element => {
            element.classList.add('animation-platform-background')
        });
        world.classList.add("animation-sky")
        sunContainer.classList.add("animation-sun");
        //Making sure it can only run once
        gameRunning = true
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
        platformElems.forEach(element => {
            element.classList.remove('animation-platform-background')
        });

        startGameSign.classList.remove('hidden')
            //Starting the animations
        world.classList.remove("animation-sky")
        sunContainer.classList.remove("animation-sun");
        gameOver()

    }
}