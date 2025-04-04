/********** Animatie voor verstoppen en tonen van de filteropties **********/
const buttonInstruments = document.querySelector('.button-more-instruments')
const buttonGenre = document.querySelector('.button-more-genres')

const filterBtn = document.querySelector('.sort-container button')
const filterSortContent = document.querySelector('.filter-sort')
const filterMenu = document.querySelector('#left-column')
const filterMenuBackground = document.createElement('div')
const body = document.body

const scrollContainer = document.querySelector('.selected-filters-container')

/********** Animatie voor verstoppen en tonen van de filteropties **********/
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

if (buttonInstruments) {
    buttonInstruments.addEventListener('click', showInstrumentOptions);
}

if (buttonGenre) {
    buttonGenre.addEventListener('click', showGenreOptions);
}

/********** Voegt faded overlay toe wanneer filter menu open is, bij smal scherm **********/  
function addFilterMenuBackground() {
    if (window.innerWidth <= 750) {
        if (!filterSortContent.contains(filterMenuBackground)) {
            filterSortContent.appendChild(filterMenuBackground)
            filterMenuBackground.classList.add('filterMenuClosed')

            if (!filterMenuBackground.querySelector('.closeFiltersBtn')) {
                const filterCloseBtn = document.createElement('button')
                filterMenuBackground.appendChild(filterCloseBtn)
                filterCloseBtn.classList.add('closeFiltersBtn')

                const closeBtnImg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
                closeBtnImg.setAttribute("viewBox", "6 6 12 12")
                closeBtnImg.setAttribute("xmlns", "http://www.w3.org/2000/svg")
                closeBtnImg.innerHTML = `<path d="M16 16L12 12M12 12L8 8M12 12L16 8M12 12L8 16"/>`
                filterCloseBtn.appendChild(closeBtnImg)
            }
        }
    } else {
        if (filterSortContent.contains(filterMenuBackground)) {
            filterMenuBackground.remove()
        }
    }
}

window.addEventListener('resize', addFilterMenuBackground)


if (filterBtn) {
    filterBtn.addEventListener('click', () => {
        filterMenu.classList.add('showFilterMenu')
        filterMenuBackground.classList.remove('filterMenuClosed')
        filterMenuBackground.classList.add('filterMenuOpen')
        body.classList.add('no-scroll')
    })
}

document.addEventListener('click', (event) => {
    if (!filterMenu.contains(event.target) && !filterBtn.contains(event.target)) {
        filterMenu.classList.remove('showFilterMenu')
        filterMenuBackground.classList.remove('filterMenuOpen')
        filterMenuBackground.classList.add('filterMenuClosed')
        body.classList.remove('no-scroll')
    }
})

window.addEventListener('resize', () => {
    if (window.innerWidth > 750) {
        filterMenu.classList.remove('showFilterMenu')
        filterMenuBackground.remove()
        filterMenuBackground.classList.remove('filterMenuOpen')
        body.classList.remove('no-scroll')
    }
})

/********** Checkt of selected-filters scrolbaar zijn bij smal scherm **********/
function checkIfScrollable() {
    const containerWidth = scrollContainer.offsetWidth
    const contentWidth = scrollContainer.scrollWidth
  
    if (contentWidth <= containerWidth) {
      scrollContainer.classList.add('no-scroll')
    } else {
      scrollContainer.classList.remove('no-scroll')
    }
}
  
  checkIfScrollable()

window.addEventListener('resize', checkIfScrollable)

/********** Voor het scrollen met drag van de selected-filters **********/
// Voornamelijk chatGPT code, scrollen met overflow-x wist is, maar het scrollen doen met daggen was wat lastiger.
let isDown = false
let startX
let scrollLeft

// Muis ingedrukt houden
scrollContainer.addEventListener("mousedown", (e) => {
  isDown = true
  scrollContainer.classList.add("active")
  startX = e.pageX - scrollContainer.offsetLeft
  scrollLeft = scrollContainer.scrollLeft
});

scrollContainer.addEventListener("mouseleave", () => {
  isDown = false
  scrollContainer.classList.remove("active")
})

scrollContainer.addEventListener("mouseup", () => {
  isDown = false
  scrollContainer.classList.remove("active")
});

// Muis bewegen en slepen
scrollContainer.addEventListener("mousemove", (e) => {
  if (!isDown) return
  e.preventDefault()
  const x = e.pageX - scrollContainer.offsetLeft
  const walk = (x - startX) * 2; // Hoe snel gesleept wordt
  scrollContainer.scrollLeft = scrollLeft - walk
})