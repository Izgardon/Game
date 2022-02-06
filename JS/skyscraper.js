//Getting Skyscraper rectangle

const skyscraperElems = document.querySelectorAll(".skyscraper")


export function getSkyscraperRects() {
    return [...document.querySelectorAll(".skyscraper")].map(skyscraper => {
        return skyscraper.getBoundingClientRect()
    })
}