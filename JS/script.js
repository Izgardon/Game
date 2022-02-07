'strict mode'

import { ifClimbing, running, setUpMan, jumping, manElem, getManRect, roofRunning } from "./man.js";
import { getCustomProperty, setCustomProperty } from "./customProperty.js";



//Elements
const platformElems = document.querySelectorAll(".platform")
let world = document.querySelector('body')
let sunContainer = document.querySelector('.sun-container')
let startGameSign = document.querySelector('.start-game')


let lastTime
let gameRunning





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


//Game start and refresh

document.addEventListener('keydown', startGame)

function startGame(e) {
    if (gameRunning) return
    if (e.code === "Enter") {
        window.requestAnimationFrame(update)
        setUpMan()
        window.scroll(0, 0);
        platformElems.forEach(element => {
            element.classList.add('animation-platform-background')
        });
        ('animation-platform-background ')
        startGameSign.classList.add('hidden')
            //Starting the animations
        world.classList.add("animation-sky")
        sunContainer.classList.add("animation-sun")
            //Making sure it can only run once
        gameRunning = true
    }

}