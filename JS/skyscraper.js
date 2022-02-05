import { manElem, getManRect } from "./man.js";

//Getting Skyscraper rectangle
const skyscraperElem = document.querySelector('.skyscraper')

export function getSkyscraperRect() {
    return skyscraperElem.getBoundingClientRect()
}

export function getSkyscraperRects() {
    return [...document.querySelectorAll(".skyscraper")].map(skyscraper => {
        return skyscraper.getBoundingClientRect()
    })
}