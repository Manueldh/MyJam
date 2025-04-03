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

buttonInstruments.addEventListener('click', showInstrumentOptions)
buttonGenre.addEventListener('click', showGenreOptions)

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

filterBtn.addEventListener('click', () => {
    filterMenu.classList.add('showFilterMenu')
    filterMenuBackground.classList.remove('filterMenuClosed')
    filterMenuBackground.classList.add('filterMenuOpen')
    body.classList.add('no-scroll')
})

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

document.addEventListener('DOMContentLoaded', () => {
    const items = document.querySelectorAll('.item') // Selecteer alle items met de class "item"

    items.forEach((item, index) => {
        setTimeout(() => {
            item.classList.add('animate') // Voeg de animatieklasse toe
        }, index * 100) // Voeg een vertraging toe voor een "staggered" effect
    })


    /********** Voor title en artist animatie bij songs **********/
    const PIXELS_PER_SECOND = 40
    const MIN_OVERFLOW_PX = 5
    const MAX_DURATION = 10
    
    let isProcessing = false
    
    function setupVisibleTextOverflow() {
        if (isProcessing) return
        isProcessing = true
        
        const visibleSongs = document.querySelectorAll('.song:not([style*="display: none"]), .song[style*="display: grid"], .song[style*="display:grid"]')
        
        visibleSongs.forEach(song => {
            const title = song.querySelector('.title')
            const artist = song.querySelector('.artist')
            
            if (title) setupScrollForElement(title)
            if (artist) setupScrollForElement(artist)
        })
        
        isProcessing = false
    }
    
    function setupScrollForElement(element) {
        const newElement = element.cloneNode(true)
        element.parentNode.replaceChild(newElement, element)
        element = newElement
        
        element.style.whiteSpace = 'nowrap'
        element.style.overflow = 'hidden'
        element.style.textOverflow = 'ellipsis'
        element.style.display = 'block'
        
        const diff = element.scrollWidth - element.clientWidth
        
        if (diff > MIN_OVERFLOW_PX) {
            const duration = Math.min(MAX_DURATION, diff / PIXELS_PER_SECOND)
            
            element.addEventListener('mouseenter', function() {
                this.style.transition = 'none'
                this.style.transform = 'translateX(0)'
                void this.offsetWidth
                
                this.style.overflow = 'visible'
                this.style.textOverflow = 'clip'
                this.style.transition = `transform ${duration}s linear`
                this.style.transform = `translateX(-${diff}px)`
            })
            
            element.addEventListener('mouseleave', function() {
                this.style.overflow = 'hidden'
                this.style.textOverflow = 'ellipsis'
                this.style.transition = '0.3s ease-out'
                this.style.transform = 'translateX(0)'
            })
        }
    }
    
    function setupPaginationMonitoring() {
        const paginationContainer = document.querySelector('#pagination')
        if (paginationContainer) {
            paginationContainer.addEventListener('click', function() {
                setTimeout(setupVisibleTextOverflow, 300)
            })
        }
        
        let lastActivePage = document.querySelector('#pagination .active')
        
        setInterval(function() {
            const currentActivePage = document.querySelector('#pagination .active')
            
            if (currentActivePage && (!lastActivePage || 
                lastActivePage.textContent !== currentActivePage.textContent)) {
                lastActivePage = currentActivePage
                setupVisibleTextOverflow()
            }
        }, 500)
        
        const resultsContainer = document.querySelector('.results-container')
        if (resultsContainer) {
            const observer = new MutationObserver(function(mutations) {
                let displayChanged = false
                
                mutations.forEach(function(mutation) {
                    if (mutation.type === 'attributes' && 
                        mutation.attributeName === 'style' && 
                        mutation.target.classList.contains('song')) {
                        displayChanged = true
                    }
                })
                
                if (displayChanged) {
                    setTimeout(setupVisibleTextOverflow, 100)
                }
            })
            
            observer.observe(resultsContainer, {
                attributes: true,
                attributeFilter: ['style'],
                subtree: true
            })
        }
    }
    
    setupVisibleTextOverflow()
    
    window.addEventListener('resize', setupVisibleTextOverflow)
    window.addEventListener('load', function() {
        setupVisibleTextOverflow()
        setupPaginationMonitoring()
    })
    window.refreshTextOverflow = setupVisibleTextOverflow

    /********** Voor het openen van de extra info van de songs **********/
    document.body.addEventListener('click', function(event) {
        const song = event.target.closest('.song');
        
        if (!song || event.target.closest(".actions")) return;
        
        const extraInfo = song.querySelector(".extraSongInfo");
        
        if (extraInfo.classList.contains("visible")) {
            extraInfo.classList.remove("visible");
        } else {
            document.querySelectorAll(".song .extraSongInfo.visible").forEach(info => {
                info.classList.remove("visible");
            });
            
            extraInfo.classList.add("visible");
        }
        
        event.stopPropagation();
    });
    addFilterMenuBackground()
})

function lazyLoadCovers() {
    const visibleSongs = document.querySelectorAll('.song:not([style*="display: none"]) .cover.lazy-load')

    visibleSongs.forEach(img => {
        if (!img.dataset.src) return

        img.src = img.dataset.src
        img.removeAttribute('data-src')
        img.classList.remove('lazy-load')
    })
}

// Roep deze functie aan na het laden van de pagina en bij paginatie updates
document.addEventListener("DOMContentLoaded", lazyLoadCovers)
document.addEventListener("pageChange", lazyLoadCovers)

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