'strict mode'

import { ifClimbing, running, setUpMan, jumping, manElem, getManRect, roofRunning } from "./man.js";
import { getCustomProperty, setCustomProperty } from "./customProperty.js";


//Elements
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
    let absoluteManLeft = getManRect().left
    let manLeft = getCustomProperty(manElem, '--left')

    if (absoluteManLeft > 1000) {
        moveScreenWithMan(manLeft - 1000)
    }
    if (absoluteManLeft < 300 && manLeft > 300) {
        moveScreenWithMan((manLeft - 300))
    }

    function moveScreenWithMan(position) {
        window.scroll(position, 0)

    }
}


//Game start and refresh

document.addEventListener('keydown', startGame)

function startGame(e) {
    if (gameRunning) return
    if (e.code === "Enter") {
        window.requestAnimationFrame(update)
        setUpMan()
        window.scroll(0, 0)
        startGameSign.classList.add('hidden')
            //Starting the animations
        world.classList.add("animation-sky")
        sunContainer.classList.add("animation-sun")
            //Making sure it can only run once
        gameRunning = true
    }

}