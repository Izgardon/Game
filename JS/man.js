import { getCustomProperty, setCustomProperty, incrementCustomProperty } from "./customProperty.js";

import { getSkyscraperRects, getPlatformRects } from "./skyscraper.js";

import { gameLost } from "./script.js";






//Variables


export const manElem = document.querySelector('.man');

let manFrame = 1;
let keyState = {}
    //Jumping
let isJumping = false
let hasJumped = false
let yVelocity
    //Climbing
let isClimbingRight
let isClimbingLeft
    //RoofRunning
let landed = false
let onRoof

//Constants
const floor = 50;
const movement = 6;
const jumpSpeed = 10;
const gravity = 0.03
const downSpeed = 1.1
const climbSpeed = 5
const deathSpeed = 0.05


//Functions

//Function used to get the man's rectangle
export function getManRect() {
    return manElem.getBoundingClientRect()
}

//Function used to check if specific collision parameters are met between the man and a building, parameter function is different for each scenario but function returns true if paramter function is true for all skyscrapers
//Roof collisions
function checkCollisionRoof(whichCollision) {
    const manRect = getManRect()
    return getSkyscraperRects().some(rect => whichCollision(manRect, rect))
}
//Platform collisions
function checkCollisionPlatform(whichCollision) {
    const manRect = getManRect()
    return getPlatformRects().some(rect => whichCollision(manRect, rect))
}


//setUpMan and setUpManMovement functions runs when enter is pressed (and movement 5 seconds later), adding the keydown functions and making sure man starts at beginning
export function setUpMan() {
    window.scroll(0, 0);
    setCustomProperty(manElem, '--left', 30);
    setCustomProperty(manElem, '--bottom', 120)
    manElem.src = `./images/spiderman-4.png`
    manElem.classList.remove("flip")


}
export function setUpManMovement() {

    document.addEventListener("keydown", onJump)
    document.addEventListener("keydown", wallJump)
    window.addEventListener('keydown', keyDownEvent)
    window.addEventListener('keyup', keyUpEvent)


}

export function gameOverKeyBindings() {
    document.removeEventListener("keydown", onJump)
    document.removeEventListener("keydown", wallJump)
    window.removeEventListener('keydown', keyDownEvent)
    window.removeEventListener('keyup', keyUpEvent)
}
//To stop man running when not meant to be
export function stopAllMovement() {
    keyState['d'] = false;
    keyState['a'] = false;
    keyState['s'] = false;
}
//----------------------------------------------

//Running function

//Removing input delay with a keystate function to just return true if a key is down. The event listeners are in setUpMan function.



export function keyDownEvent(e) {
    keyState[e.key] = true;

}

export function keyUpEvent(e) {
    keyState[e.key] = false
}




//Main running function - adds a flip class for which direction he is going and also prevents character from going off left edge. Uses a custom property to incremet his position

export function running() {
    let manRect = getManRect()
    if (keyState['d'] && !isClimbingRight) {
        //Moving Right

        frame();
        incrementCustomProperty(manElem, "--left", movement)
        manElem.classList.remove("flip")
    }
    if (keyState['a'] && !isClimbingLeft) {
        if (manRect.left <= 0) return

        //Moving Left
        frame();

        manElem.classList.add("flip")
        incrementCustomProperty(manElem, "--left", -movement)
    }

}

//Changing image frames

function frame() {
    //So picture doesnt change to running
    if (isJumping) return
        //To stop picture changing rapidly when both are pressed and man is still
    if (keyState['d'] && keyState['a']) return
        //Added this line below to use this function in other areas without it being constantly active
    if (keyState['d'] || keyState['a']) {
        //To delay the picture changing to every 4 frames
        manFrame++
        if (manFrame === 16) {
            manFrame += -15
        }
        if (manFrame % 4 !== 0) return

        manElem.src = `./images/spiderman-${manFrame}.png`
    }



}



//--------------------------------------

//Jumping (hasJumped) refers to if man has already jumped twice)



function onJump(e) {
    if (hasJumped) return
    else {
        landed = false
            //First Jump
        if (!isJumping && e.code === 'Space') {
            isJumping = true
            yVelocity = jumpSpeed
                //Double Jump
        } else if (isJumping && e.code === 'Space') {
            isJumping = true
            hasJumped = true
            yVelocity = jumpSpeed


        }
    }
}

//Above function sets the Yvelocity to an immediate upward velocity which will then get incremented down

export function jumping(delta) {
    //check to see if man is climbing (will add a special case later)
    if (isClimbingLeft || isClimbingRight) {
        climbing()
    } else {
        if (!isJumping) return


        //Incrementing velocity to mimic gravity effect using delta function

        incrementCustomProperty(manElem, "--bottom", yVelocity);
        yVelocity -= gravity * delta;
        manElem.src = `./images/spiderman-jump.png`
            //Landing on the ground

    }


    // Holding S to go down faster using KeyState function
    if (isJumping && (yVelocity < 0) && (keyState['s'])) {

        yVelocity -= gravity * delta * downSpeed
        incrementCustomProperty(manElem, "--bottom", yVelocity)


    }
    //Function to check if man is dead, calls two other functions that handle game over

    if (getCustomProperty(manElem, "--bottom") <= 55) {

        sinking(delta)
        gameLost()

    }
}
//When man falls into acid this function will be called

function sinking(delta) {
    yVelocity = -0.1;

    manElem.src = `./images/spiderman-jump.png`
    yVelocity -= gravity * delta * deathSpeed
    incrementCustomProperty(manElem, "--bottom", yVelocity)

}









//--------------------------------------------------

// Climbing



//Main climbing function - numbers adjusted so he climbs slightly inside the wall similar to a wall

//Specific sides are noted as he can still move in the other direciton

export function ifClimbing() {

    if (checkCollisionRoof(isCollisionRight)) {
        isClimbingRight = true
    } else if (checkCollisionRoof(isCollisionLeft)) {
        isClimbingLeft = true
    } else {
        isClimbingRight = false;
        isClimbingLeft = false;
    }

}

//Function checks if any of this areas intersect which specifies the man coming into contact with right side of any skyscraper
function isCollisionRight(rect1, rect2) {
    return (

        rect1.right > rect2.left + 30 &&
        rect1.right < rect2.left + 40 &&
        rect1.bottom > rect2.top + 20
    )
}

//As above for left side

function isCollisionLeft(rect1, rect2) {
    return (
        rect2.right - 30 > rect1.left &&
        rect2.right - 40 < rect1.left &&
        rect1.bottom > rect2.top + 20
    )
}





//Climbing movement, can use w and s to move up and down at a constant speed while hugging the wall - also adds a climbing image. Also uses keystate function so no input delay

function climbing() {
    manElem.src = `./images/spiderman-climb.png`
    yVelocity = 0
    jumpResetClimb()

    landed = false

    if (keyState['w']) {
        incrementCustomProperty(manElem, '--bottom', climbSpeed)
    }
    if (keyState['s'] && getCustomProperty(manElem, '--bottom') > floor) {
        incrementCustomProperty(manElem, '--bottom', -climbSpeed)

    }


}

//Making sure when jumping off a wall it doesnt auto set you back to climbing but moving character to other direciton slightly

function wallJump(e) {
    if (isClimbingLeft) {
        if (e.code === 'Space') {
            incrementCustomProperty(manElem, '--left', 20)
        }
    } else if (isClimbingRight) {
        if (e.code === 'Space') {
            incrementCustomProperty(manElem, '--left', -20)
        }
    }

}
//This function still allows one jump when leaving a wall

function jumpResetClimb() {
    isJumping = true
    hasJumped = false
    landed = false
}

//------------------------------------------

//Roof Running functions- this one checks to see if man is in a specific zone on the roof to allow for frame as he can be moving quite fast in y-direction.
//It then resets the image when landing and uses a landed variable to refresh this.
//It also refreshes all jumps and sets velocity to 0. 
//Second if function checks to see if man has left either side of roof and if so for him to start falling but still have a jump

export function roofRunning(delta) {

    if (yVelocity > 0) return

    if (checkCollisionRoof(isCollisionRoofGeneral) || checkCollisionPlatform(isCollisionPlatformGeneral)) {

        //Image reset function on landing, refreshes when other actions are taken
        if (!landed) {
            landed = true
            manElem.src = `./images/spiderman-4.png`
        }
        //Sets him still, resets jumps and allows running
        isJumping = false
        hasJumped = false
        yVelocity = 0
        frame()


        //As high velocity and slow frames sometimes means man slips through roof, I have increased the capture range with the following funcitons moving his character up after
        if (checkCollisionRoof(isCollisionRoofTooFast1)) {
            incrementCustomProperty(manElem, '--bottom', 9)
        } else if (checkCollisionRoof(isCollisionRoofTooFast2)) {
            incrementCustomProperty(manElem, '--bottom', 20)
        }


    } else if (checkCollisionRoof(isCollisionOffRoof) || checkCollisionPlatform(isCollisionOffPlatform)) {


        if (isJumping || hasJumped) return

        window.setTimeout(jumpFix, 50);






    } else return




}
//This timeout on function allows game to feel smoother and less punishing on jump times to still get his double jump
function jumpFix() {
    isJumping = true
}

//Building collision functions

function isCollisionRoofGeneral(rect1, rect2) {

    return (

        rect1.right - 10 > rect2.left &&
        rect2.right - 10 > rect1.left &&
        rect1.bottom - 40 < rect2.top &&
        rect1.bottom - 8 > rect2.top
    )
}

function isCollisionRoofTooFast1(rect1, rect2) {

    return (


        rect1.bottom - 30 < rect2.top &&
        rect1.bottom - 18 > rect2.top
    )
}

function isCollisionRoofTooFast2(rect1, rect2) {
    return (

        rect1.bottom - 40 < rect2.top &&
        rect1.bottom - 30 > rect2.top
    )
}

function isCollisionOffRoof(rect1, rect2) {

    return (

        (rect1.right - 10 < rect2.left || rect2.right - 10 < rect1.left) && rect1.bottom - 30 < rect2.top)

}



//Platform collision functions

function isCollisionPlatformGeneral(rect1, rect2) {
    return (
        rect1.right - 10 > rect2.left &&
        rect2.right - 10 > rect1.left &&
        rect1.bottom - 30 < rect2.top &&
        rect1.bottom > rect2.top

    )
}

function isCollisionOffPlatform(rect1, rect2) {
    return (

        (rect1.right - 10 < rect2.left || rect2.right - 10 < rect1.left) && rect1.bottom - 30 < rect2.top)

}