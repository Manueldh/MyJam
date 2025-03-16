const buttonInstruments = document.querySelector('.button-more-instruments')
const buttonGenre = document.querySelector('.button-more-genres')
/*     /*Voor animatie van sorting*/    /*
const select = document.querySelector("#sort")
const selectWrapper = document.querySelector("#select-style")
const arrow = selectWrapper.querySelector("svg")
*/
function showInstrumentOptions() {
    const hiddenOptions = document.querySelectorAll('.section-instruments .hidden-option')
    const isVisible = hiddenOptions[0].style.visibility === 'visible'

    hiddenOptions.forEach(option => {
        option.style.visibility = isVisible ? 'hidden' : 'visible'
        option.style.height = isVisible ? '0' : '2em'
    })

    this.querySelector('p').textContent = isVisible ? 'More' : 'Less'
    this.querySelector('svg').style.transform = isVisible ? 'rotate(0deg)' : 'rotate(180deg)'
}

function showGenreOptions() {
    const hiddenOptions = document.querySelectorAll('.section-genre .hidden-option')
    const isVisible = hiddenOptions[0].style.visibility === 'visible'

    hiddenOptions.forEach(option => {
        option.style.visibility = isVisible ? 'hidden' : 'visible'
        option.style.height = isVisible ? '0' : '2em'
    })

    this.querySelector('p').textContent = isVisible ? 'More' : 'Less'
    this.querySelector('svg').style.transform = isVisible ? 'rotate(0deg)' : 'rotate(180deg)'
}
/*    /*Voor animatie van sorting*/    /*
select.addEventListener("focus", () => {
    selectWrapper.classList.add("open")
})

select.addEventListener("change", () => {
    selectWrapper.classList.remove("open")
})

select.addEventListener("click", (event) => {
    if (!selectWrapper.contains(event.target)) {
        selectWrapper.classList.remove("open")
    }
})

select.addEventListener("click", function() {
    if (selectWrapper.classList.contains("open")) {
        selectWrapper.classList.remove("open")
    } else {
        selectWrapper.classList.add("open")
    }
});
*/
buttonInstruments.addEventListener('click', showInstrumentOptions)
buttonGenre.addEventListener('click', showGenreOptions)