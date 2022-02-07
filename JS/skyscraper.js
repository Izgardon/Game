//Getting Skyscraper rectangle

const skyscraperElems = document.querySelectorAll(".skyscraper")
const platformElems = document.querySelectorAll(".platform")


export function getSkyscraperRects() {
    return [...skyscraperElems].map(skyscraper => {
        return skyscraper.getBoundingClientRect()
    })
}
export function getPlatformRects() {
    return [...platformElems].map(skyscraper => {
        return skyscraper.getBoundingClientRect()
    })
}