const buttonInstruments = document.querySelector('.button-more-instruments')
const buttonGenre = document.querySelector('.button-more-genres')

const filterBtn = document.querySelector('.sort-container button')
const filterSortContent = document.querySelector('.filter-sort')
const filterMenu = document.querySelector('#left-column')

const filterMenuBackground = document.createElement('div')
const scrollContainer = document.querySelector('.selected-filters-container')
const body = document.body

let audioPlayer = new Audio()
let currentlyPlayingButton = null
let isProcessing = false

/********** Verstoppen en tonen van de filteropties **********/
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

window.addEventListener('resize', checkIfScrollable)

document.addEventListener('DOMContentLoaded', function () {
    const filtersContainer = document.querySelector('#selected-filters')
    const checkboxes = document.querySelectorAll("input[type='checkbox']")
    const songs = document.querySelectorAll(".song")
    const resultsContainer = document.querySelector("#results")
    const paginationContainer = document.querySelector('#pagination')

    const freshCheckboxes = Array.from(checkboxes).map(checkbox => {
        const newCheckbox = checkbox.cloneNode(true)
        checkbox.parentNode.replaceChild(newCheckbox, checkbox)
        return newCheckbox
    });

    const itemsPerPage = 20
    let currentPage = 1

    /********** Voor het aanpassen van de localStorage op resultaat pagina **********/
    function updateLocalStorage() {
        const selectedInstruments = Array.from(document.querySelectorAll("input[name='instruments']:checked"))
            .map(checkbox => checkbox.value)
        
        const selectedGenres = Array.from(document.querySelectorAll("input[name='genre']:checked"))
            .map(checkbox => checkbox.value)
        
        const selectedDifficulty = Array.from(document.querySelectorAll("input[name='difficulty']:checked"))
            .map(checkbox => checkbox.value)
        
        localStorage.setItem("selectedInstruments", JSON.stringify(selectedInstruments))
        localStorage.setItem("selectedGenres", JSON.stringify(selectedGenres))
        localStorage.setItem("selectedDifficulty", JSON.stringify(selectedDifficulty))
    }

    /********** Voor het ophalen van de eerder gekozen filters uit localStorage **********/
    function loadSavedFilters() {
        filtersContainer.innerHTML = ''

        const savedInstruments = JSON.parse(localStorage.getItem("selectedInstruments")) || []
        const savedGenres = JSON.parse(localStorage.getItem("selectedGenres")) || []
        const savedDifficulty = JSON.parse(localStorage.getItem("selectedDifficulty")) || []
        
        freshCheckboxes.forEach(checkbox => {
            const value = checkbox.value
            const category = checkbox.name
            
            if ((category === "instruments" && savedInstruments.includes(value)) ||
                (category === "genre" && savedGenres.includes(value)) ||
                (category === "difficulty" && savedDifficulty.includes(value))) {
                checkbox.checked = true
            }
        })
        
        freshCheckboxes.forEach(checkbox => {
            if (checkbox.checked) {
                addFilter(checkbox)
            }
        })
        filterSongs()
    }
    
    freshCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            if (checkbox.checked) {
                addFilter(checkbox)
            } else {
                removeFilter(checkbox)
            }
            
            checkIfScrollable()
            filterSongs()
            updateLocalStorage()
            highlightMatchingSpans()
        })
    })
    
    /********** Voor het filteren van de content **********/
    function filterSongs() {
        const selectedFilters = {
            instruments: [],
            genre: [],
            difficulty: []
        }

        let anyFilterSelected = false

        freshCheckboxes.forEach(checkbox => {
            if (checkbox.checked) {
                anyFilterSelected = true
                const category = checkbox.name
                const value = checkbox.value.toLowerCase()
                selectedFilters[category].push(value)
            }
        })

        songs.forEach(song => {
            if (!anyFilterSelected) {
                song.classList.remove("filtered-out")
                return
            }

            const songGenre = song.dataset.genre.toLowerCase()
            const songInstruments = song.dataset.instruments.toLowerCase().split(",")
            const songDifficulty = song.dataset.difficulty.toLowerCase()

            let matchesGenre = selectedFilters.genre.length === 0 || selectedFilters.genre.includes(songGenre)
            let matchesInstrument = selectedFilters.instruments.length === 0 || songInstruments.some(instr => selectedFilters.instruments.includes(instr))
            let matchesDifficulty = selectedFilters.difficulty.length === 0 || selectedFilters.difficulty.includes(songDifficulty)

            let matches = matchesGenre && matchesInstrument && matchesDifficulty

            song.classList.toggle("filtered-out", !matches)
        })
        currentPage = 1
        showPage(currentPage)
    }

    filterSongs()


    /********** Voegt de selected filters bovenaan de pagina **********/
    function addFilter(checkbox) {
        const label =checkbox.closest('li').querySelector('label')
        const filterText = label.textContent
        
        const filterTag = document.createElement('span')
        filterTag.classList.add('selected-filter')
        filterTag.dataset.value = checkbox.value
        
        filterTag.textContent = filterText

        const removeBtn = document.createElementNS("http://www.w3.org/2000/svg", "svg")
        removeBtn.setAttribute("viewBox", "0 0 21 20")
        removeBtn.setAttribute("xmlns", "http://www.w3.org/2000/svg")
        removeBtn.innerHTML = `<path d="M3.93374 17.1929C2.97864 16.2704 2.21682 15.167 1.69273 13.9469C1.16864 12.7269 0.892775 11.4147 0.881237 10.0869C0.869699 8.7591 1.12272 7.44231 1.62552 6.21334C2.12833 4.98438 2.87086 3.86786 3.80979 2.92893C4.74872 1.99001 5.86524 1.24747 7.0942 0.744665C8.32316 0.241856 9.63996 -0.0111606 10.9678 0.000377568C12.2955 0.0119157 13.6077 0.287778 14.8278 0.811868C16.0478 1.33596 17.1513 2.09778 18.0737 3.05288C19.8953 4.9389 20.9033 7.46493 20.8805 10.0869C20.8577 12.7089 19.806 15.217 17.9519 17.0711C16.0978 18.9251 13.5897 19.9768 10.9678 19.9996C8.34579 20.0224 5.81976 19.0145 3.93374 17.1929ZM5.34374 15.7829C6.84487 17.284 8.88083 18.1273 11.0037 18.1273C13.1267 18.1273 15.1626 17.284 16.6637 15.7829C18.1649 14.2818 19.0082 12.2458 19.0082 10.1229C19.0082 7.99997 18.1649 5.96401 16.6637 4.46288C15.1626 2.96176 13.1267 2.11843 11.0037 2.11843C8.88083 2.11843 6.84487 2.96176 5.34374 4.46288C3.84262 5.96401 2.99929 7.99997 2.99929 10.1229C2.99929 12.2458 3.84262 14.2818 5.34374 15.7829ZM15.2437 7.29288L12.4137 10.1229L15.2437 12.9529L13.8337 14.3629L11.0037 11.5329L8.17374 14.3629L6.76374 12.9529L9.59374 10.1229L6.76374 7.29288L8.17374 5.88288L11.0037 8.71288L13.8337 5.88288L15.2437 7.29288Z"/>`

        removeBtn.addEventListener('click', function () {
            checkbox.checked = false
            filterTag.remove()
            checkIfScrollable()
            filterSongs()
            highlightMatchingSpans()
            updateLocalStorage()
        });

        filterTag.appendChild(removeBtn)

        filtersContainer.appendChild(filterTag)
    }

    /********** Haalt de filters weer weg **********/
    function removeFilter(checkbox) {
        const filterToRemove = filtersContainer.querySelector(`.selected-filter[data-value='${checkbox.value}']`)
        if (filterToRemove) {
            filterToRemove.remove()
            checkIfScrollable()
        }
    }

    /********** Voor de paginatie onderaan de pagina **********/
    function showPage(page) {
        const tracks = document.querySelectorAll('#results .song:not(.filtered-out)')
        let start = (page - 1) * itemsPerPage
        let end = start + itemsPerPage

        tracks.forEach((track, index) => {
            track.style.display = index >= start && index < end ? "grid" : "none"
        })

        renderPagination(tracks.length)
        lazyLoadCovers()
    }

    function renderPagination(totalTracks) {
        paginationContainer.innerHTML = ""
        let totalPages = Math.ceil(totalTracks / itemsPerPage)

        if (totalPages <= 1) return

        const prev = document.createElement("button")
        const inBtnArrowLeft = document.createElementNS("http://www.w3.org/2000/svg", "svg")
        prev.classList.add('previousBtn')
        inBtnArrowLeft.setAttribute("viewBox", "0 0 12 9")
        inBtnArrowLeft.setAttribute("xmlns", "http://www.w3.org/2000/svg")
        inBtnArrowLeft.innerHTML = `<path d="M5.99921 9C5.74392 8.99871 5.49212 8.94061 5.26208 8.82991C5.03203 8.71922 4.82951 8.5587 4.66921 8.36L0.459215 3.26C0.213209 2.95297 0.0584007 2.583 0.0124318 2.19227C-0.0335371 1.80153 0.0311821 1.40574 0.199215 1.05C0.335494 0.740826 0.557888 0.477413 0.839834 0.291223C1.12178 0.105032 1.45136 0.00393305 1.78921 0H10.2092C10.5471 0.00393305 10.8767 0.105032 11.1586 0.291223C11.4405 0.477413 11.6629 0.740826 11.7992 1.05C11.9672 1.40574 12.032 1.80153 11.986 2.19227C11.94 2.583 11.7852 2.95297 11.5392 3.26L7.32921 8.36C7.16892 8.5587 6.9664 8.71922 6.73635 8.82991C6.50631 8.94061 6.25451 8.99871 5.99921 9Z"/>`
        prev.disabled = currentPage === 1
        prev.addEventListener("click", () => {
            currentPage--
            showPage(currentPage)
        })
        prev.appendChild(inBtnArrowLeft)
        paginationContainer.appendChild(prev)

        let startPage = Math.max(1, currentPage - 2)
        let endPage = Math.min(totalPages, currentPage + 2)

        if (startPage > 1) {
            paginationContainer.appendChild(createPageButton(1))
            if (startPage > 2) paginationContainer.appendChild(createDots())
        }

        for (let i = startPage; i <= endPage; i++) {
            paginationContainer.appendChild(createPageButton(i))
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) paginationContainer.appendChild(createDots())
            paginationContainer.appendChild(createPageButton(totalPages))
        }

        const next = document.createElement("button")
        const inBtnArrowRight = document.createElementNS("http://www.w3.org/2000/svg", "svg")
        next.classList.add('nextBtn')
        inBtnArrowRight.setAttribute("viewBox", "0 0 12 9")
        inBtnArrowRight.setAttribute("xmlns", "http://www.w3.org/2000/svg")
        inBtnArrowRight.innerHTML = `<path d="M5.99921 9C5.74392 8.99871 5.49212 8.94061 5.26208 8.82991C5.03203 8.71922 4.82951 8.5587 4.66921 8.36L0.459215 3.26C0.213209 2.95297 0.0584007 2.583 0.0124318 2.19227C-0.0335371 1.80153 0.0311821 1.40574 0.199215 1.05C0.335494 0.740826 0.557888 0.477413 0.839834 0.291223C1.12178 0.105032 1.45136 0.00393305 1.78921 0H10.2092C10.5471 0.00393305 10.8767 0.105032 11.1586 0.291223C11.4405 0.477413 11.6629 0.740826 11.7992 1.05C11.9672 1.40574 12.032 1.80153 11.986 2.19227C11.94 2.583 11.7852 2.95297 11.5392 3.26L7.32921 8.36C7.16892 8.5587 6.9664 8.71922 6.73635 8.82991C6.50631 8.94061 6.25451 8.99871 5.99921 9Z"/>`
        next.disabled = currentPage === totalPages
        next.addEventListener("click", () => {
            currentPage++
            showPage(currentPage)
        })
        next.appendChild(inBtnArrowRight)
        paginationContainer.appendChild(next)
    }

    function createPageButton(page) {
        const btn = document.createElement("button")
        btn.innerText = page;
        if (currentPage === page) {
            btn.classList.add("active")
        }
        btn.addEventListener("click", () => {
            currentPage = page
            showPage(currentPage)
        })
        return btn
    }
    
    function createDots() {
        const dots = document.createElement("span")
        dots.innerText = "..."
        dots.classList.add("dots")
        return dots
    }

    /********** Voor het sorteren van songs **********/
    function sortSongs() {
        const sortOption = document.getElementById("sort").value

        let tracks = Array.from(document.querySelectorAll('#results .song'))

        tracks.sort((a, b) => {
            switch (sortOption) {
                case "popular":
                    const popA = parseInt(a.querySelector(".topRow span:nth-child(3) .extraSongInfoBG").innerText.replace("/100", "").trim())
                    const popB = parseInt(b.querySelector(".topRow span:nth-child(3) .extraSongInfoBG").innerText.replace("/100", "").trim())
                    return popB - popA; // Hoogste populariteit eerst

                case "recent":
                    const dateA = new Date(a.querySelector(".date-added").innerText.trim())
                    const dateB = new Date(b.querySelector(".date-added").innerText.trim())
                    return dateB - dateA; // Nieuwste eerst

                case "durationLong":
                    const durationA = getDurationInSeconds(a.querySelector(".duration").innerText.trim())
                    const durationB = getDurationInSeconds(b.querySelector(".duration").innerText.trim())
                    return durationB - durationA; // Langste nummers eerst

                case "durationShort":
                    const durA = getDurationInSeconds(a.querySelector(".duration").innerText.trim())
                    const durB = getDurationInSeconds(b.querySelector(".duration").innerText.trim())
                    return durA - durB; // Kortste nummers eerst

                default:
                    return 0
            }
        })

        currentPage = 1

        resultsContainer.innerHTML = ""
        tracks.forEach(track => resultsContainer.appendChild(track))

        filterSongs()

        showPage(currentPage)
    }

    function getDurationInSeconds(durationString) {
        const [minutes, seconds] = durationString.split(":").map(Number)
        return (minutes * 60) + seconds
    }

    document.getElementById("sort").addEventListener("change", () => {
        sortSongs()
    })

    /********** Voor het openen van de extra info van de songs **********/
    let allSongs = document.querySelectorAll(".song")

    allSongs.forEach(song => {
        song.addEventListener("click", function(event) {
            if (event.target.closest(".actions")) return

            let extraInfo = song.querySelector(".extraSongInfo")

            if (extraInfo.classList.contains("visible")) {
                extraInfo.classList.remove("visible")
            } else {
                allSongs.forEach(otherSong => {
                    let otherExtraInfo = otherSong.querySelector(".extraSongInfo")
                    otherExtraInfo.classList.remove("visible")
                })
                extraInfo.classList.add("visible")
            }
            event.stopPropagation()
        })
    })

    function getSelectedFilters() {
        const selectedFilters = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
            .map(checkbox => checkbox.nextElementSibling.textContent.trim().toLowerCase())
        return selectedFilters
    }

    /********** Geeft de extra informatie een highlight die match met de geselecteerde filters **********/
    function highlightMatchingSpans() {
        const selectedFilters = getSelectedFilters()

        document.querySelectorAll(".extraSongInfoBG").forEach(span => {
            const spanText = span.textContent.trim().toLowerCase()

            if (selectedFilters.includes(spanText)) {
                if (!span.classList.contains("highlight")) {
                    span.classList.add("highlight")
                } else {
            }
            } else {
                if (span.classList.contains("highlight")) {
                    span.classList.remove("highlight")
                }
            }
        });
    }

    /********** Roept de meeste functies aan bij het laden/herladen van de pagina **********/
    loadSavedFilters()
    filterSongs()
    sortSongs()
    showPage(currentPage)
    highlightMatchingSpans()
})

buttonInstruments.addEventListener('click', showInstrumentOptions)
buttonGenre.addEventListener('click', showGenreOptions)

document.addEventListener('DOMContentLoaded', addFilterMenuBackground)//Waarscijnlook ook niet meer nodig, nog controleren!!
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

function lazyLoadCovers() {
    const visibleSongs = document.querySelectorAll('.song:not([style*="display: none"]) .cover.lazy-load')

    visibleSongs.forEach(img => {
        if (!img.dataset.src) return // Als er geen data-src is, skippen

        img.src = img.dataset.src // Zet de echte afbeelding
        img.removeAttribute('data-src') // Voorkomt dat het opnieuw wordt geladen
        img.classList.remove('lazy-load') // Verwijdert de class na laden
    })
}

// Roep deze functie aan na het laden van de pagina en bij paginatie updates
document.addEventListener("DOMContentLoaded", lazyLoadCovers)
document.addEventListener("pageChange", lazyLoadCovers)

audioPlayer.preload = "auto"

/********** Voor het afspelen van de muziek previews **********/
document.addEventListener("click", (event) => {
    const button = event.target.closest('.play')
    
    if (!button) return
    
    if (isProcessing) return
    isProcessing = true
    
    const previewUrl = button.dataset.previewUrl
    
    if (!previewUrl) {
        console.error("Geen preview URL gevonden voor deze knop")
        isProcessing = false
        return
    }
    
    if (currentlyPlayingButton === button) {
        audioPlayer.pause()
        button.classList.remove("playing")
        currentlyPlayingButton = null
        setTimeout(() => { isProcessing = false; }, 50)
    } else {
        audioPlayer.pause()
        
        if (currentlyPlayingButton) {
            currentlyPlayingButton.classList.remove("playing")
        }
        
        button.classList.add("playing")
        currentlyPlayingButton = button
        
        try {
            audioPlayer.src = previewUrl
            
            audioPlayer.load()
            
            const playPromise = audioPlayer.play()
            
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.error("Fout bij afspelen van audio:", error)
                    button.classList.remove("playing")
                    currentlyPlayingButton = null
                })
            }
        } catch (e) {
            console.error("Fout bij het instellen van audio:", e)
            button.classList.remove("playing")
            currentlyPlayingButton = null
        }
        
        setTimeout(() => { isProcessing = false; }, 50)
    }
})

audioPlayer.addEventListener("ended", () => {
    if (currentlyPlayingButton) {
        currentlyPlayingButton.classList.remove("playing")
        currentlyPlayingButton = null
    }
})

audioPlayer.addEventListener("error", () => {
    if (currentlyPlayingButton) {
        currentlyPlayingButton.classList.remove("playing")
        currentlyPlayingButton = null
    }
    isProcessing = false
})