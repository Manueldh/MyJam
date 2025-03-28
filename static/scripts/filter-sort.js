const buttonInstruments = document.querySelector('.button-more-instruments')
const buttonGenre = document.querySelector('.button-more-genres')

const filterBtn = document.querySelector('.sort-container button')
const filterSortContent = document.querySelector('.filter-sort')
const filterMenu = document.querySelector('#left-column')

const filterMenuBackground = document.createElement('div')

const scrollContainer = document.querySelector('.selected-filters-container')

const body = document.body;

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

function checkIfScrollable() {
    const containerWidth = scrollContainer.offsetWidth;
    const contentWidth = scrollContainer.scrollWidth;
  
    if (contentWidth <= containerWidth) {
      scrollContainer.classList.add('no-scroll')
    } else {
      scrollContainer.classList.remove('no-scroll')
    }
}
  
  checkIfScrollable()
  
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

    const itemsPerPage = 20
    let currentPage = 1

    const container = document.querySelector("#results")
    const tracks = Array.from(container.children)
    const paginationContainer = document.querySelector('#pagination')

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            if (checkbox.checked) {
                addFilter(checkbox)
                checkIfScrollable()
            } else {
                removeFilter(checkbox)
                checkIfScrollable()
            }
        })
    })

    function addFilter(checkbox) {
        const filterTag = document.createElement('span')
        filterTag.classList.add('selected-filter')
        filterTag.dataset.value = checkbox.value
        
        filterTag.textContent = checkbox.value

        const removeBtn = document.createElementNS("http://www.w3.org/2000/svg", "svg")
        removeBtn.setAttribute("viewBox", "0 0 21 20")
        removeBtn.setAttribute("xmlns", "http://www.w3.org/2000/svg")
        removeBtn.innerHTML = `<path d="M3.93374 17.1929C2.97864 16.2704 2.21682 15.167 1.69273 13.9469C1.16864 12.7269 0.892775 11.4147 0.881237 10.0869C0.869699 8.7591 1.12272 7.44231 1.62552 6.21334C2.12833 4.98438 2.87086 3.86786 3.80979 2.92893C4.74872 1.99001 5.86524 1.24747 7.0942 0.744665C8.32316 0.241856 9.63996 -0.0111606 10.9678 0.000377568C12.2955 0.0119157 13.6077 0.287778 14.8278 0.811868C16.0478 1.33596 17.1513 2.09778 18.0737 3.05288C19.8953 4.9389 20.9033 7.46493 20.8805 10.0869C20.8577 12.7089 19.806 15.217 17.9519 17.0711C16.0978 18.9251 13.5897 19.9768 10.9678 19.9996C8.34579 20.0224 5.81976 19.0145 3.93374 17.1929ZM5.34374 15.7829C6.84487 17.284 8.88083 18.1273 11.0037 18.1273C13.1267 18.1273 15.1626 17.284 16.6637 15.7829C18.1649 14.2818 19.0082 12.2458 19.0082 10.1229C19.0082 7.99997 18.1649 5.96401 16.6637 4.46288C15.1626 2.96176 13.1267 2.11843 11.0037 2.11843C8.88083 2.11843 6.84487 2.96176 5.34374 4.46288C3.84262 5.96401 2.99929 7.99997 2.99929 10.1229C2.99929 12.2458 3.84262 14.2818 5.34374 15.7829ZM15.2437 7.29288L12.4137 10.1229L15.2437 12.9529L13.8337 14.3629L11.0037 11.5329L8.17374 14.3629L6.76374 12.9529L9.59374 10.1229L6.76374 7.29288L8.17374 5.88288L11.0037 8.71288L13.8337 5.88288L15.2437 7.29288Z"/>`

        removeBtn.addEventListener('click', function () {
            checkbox.checked = false
            filterTag.remove()
            checkIfScrollable()
        });

        filterTag.appendChild(removeBtn)

        filtersContainer.appendChild(filterTag)
    }

    function removeFilter(checkbox) {
        const filterToRemove = filtersContainer.querySelector(`.selected-filter[data-value='${checkbox.value}']`)
        if (filterToRemove) {
            filterToRemove.remove()
            checkIfScrollable()
        }
    }

    function showPage(page) {
        let start = (page - 1) * itemsPerPage
        let end = start + itemsPerPage

        tracks.forEach((track, index) => {
            track.style.display = index >= start && index < end ? "" : "none"
        })

        renderPagination()
    }

    function renderPagination() {
        paginationContainer.innerHTML = ""
        let totalPages = Math.ceil(tracks.length / itemsPerPage)

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

        for (let i = 1; i <= totalPages; i++) {
            let btn = document.createElement("button")
            btn.innerText = i
            if (currentPage === i) {
                btn.classList.add("active")
            }
            btn.addEventListener("click", () => {
                currentPage = i
                showPage(currentPage)
            })
            paginationContainer.appendChild(btn)
        }

        const next = document.createElement("button")
        const inBtnArrowRight = document.createElementNS("http://www.w3.org/2000/svg", "svg")
        prev.classList.add('previousBtn')
        inBtnArrowRight.setAttribute("viewBox", "0 0 12 9")
        inBtnArrowRight.setAttribute("xmlns", "http://www.w3.org/2000/svg")
        inBtnArrowRight.innerHTML = `<path d="M5.99921 9C5.74392 8.99871 5.49212 8.94061 5.26208 8.82991C5.03203 8.71922 4.82951 8.5587 4.66921 8.36L0.459215 3.26C0.213209 2.95297 0.0584007 2.583 0.0124318 2.19227C-0.0335371 1.80153 0.0311821 1.40574 0.199215 1.05C0.335494 0.740826 0.557888 0.477413 0.839834 0.291223C1.12178 0.105032 1.45136 0.00393305 1.78921 0H10.2092C10.5471 0.00393305 10.8767 0.105032 11.1586 0.291223C11.4405 0.477413 11.6629 0.740826 11.7992 1.05C11.9672 1.40574 12.032 1.80153 11.986 2.19227C11.94 2.583 11.7852 2.95297 11.5392 3.26L7.32921 8.36C7.16892 8.5587 6.9664 8.71922 6.73635 8.82991C6.50631 8.94061 6.25451 8.99871 5.99921 9Z"/>`
        next.classList.add('nextBtn')
        next.disabled = currentPage === totalPages
        next.addEventListener("click", () => {
            currentPage++
            showPage(currentPage)
        })
        next.appendChild(inBtnArrowRight)
        paginationContainer.appendChild(next)
    }

    showPage(currentPage)

    function restoreFilters() {
        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                addFilter(checkbox)
                checkIfScrollable()
            }
        })
    }

    restoreFilters()
})

buttonInstruments.addEventListener('click', showInstrumentOptions)
buttonGenre.addEventListener('click', showGenreOptions)

document.addEventListener('DOMContentLoaded', addFilterMenuBackground)
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


// Voornamelijk chatGPT code, scrollen met overflow-x wist is, maar het scrollen doen met daggen was wat lastiger.
let isDown = false;
let startX;
let scrollLeft;

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

// Touch events voor mobiele apparaten
scrollContainer.addEventListener("touchstart", (e) => {
  startX = e.touches[0].pageX - scrollContainer.offsetLeft
  scrollLeft = scrollContainer.scrollLeft
})

scrollContainer.addEventListener("touchmove", (e) => {
  const x = e.touches[0].pageX - scrollContainer.offsetLeft
  const walk = (x - startX) * 2
  scrollContainer.scrollLeft = scrollLeft - walk
})

