const buttonInstruments = document.querySelector('.button-more-instruments')
const buttonGenre = document.querySelector('.button-more-genres')

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

document.addEventListener('DOMContentLoaded', function () {
    const filtersContainer = document.querySelector('#selected-filters')
    const checkboxes = document.querySelectorAll("input[type='checkbox']")

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            if (checkbox.checked) {
                addFilter(checkbox)
            } else {
                removeFilter(checkbox)
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
        removeBtn.innerHTML = `<path d="M3.93374 17.1929C2.97864 16.2704 2.21682 15.167 1.69273 13.9469C1.16864 12.7269 0.892775 11.4147 0.881237 10.0869C0.869699 8.7591 1.12272 7.44231 1.62552 6.21334C2.12833 4.98438 2.87086 3.86786 3.80979 2.92893C4.74872 1.99001 5.86524 1.24747 7.0942 0.744665C8.32316 0.241856 9.63996 -0.0111606 10.9678 0.000377568C12.2955 0.0119157 13.6077 0.287778 14.8278 0.811868C16.0478 1.33596 17.1513 2.09778 18.0737 3.05288C19.8953 4.9389 20.9033 7.46493 20.8805 10.0869C20.8577 12.7089 19.806 15.217 17.9519 17.0711C16.0978 18.9251 13.5897 19.9768 10.9678 19.9996C8.34579 20.0224 5.81976 19.0145 3.93374 17.1929ZM5.34374 15.7829C6.84487 17.284 8.88083 18.1273 11.0037 18.1273C13.1267 18.1273 15.1626 17.284 16.6637 15.7829C18.1649 14.2818 19.0082 12.2458 19.0082 10.1229C19.0082 7.99997 18.1649 5.96401 16.6637 4.46288C15.1626 2.96176 13.1267 2.11843 11.0037 2.11843C8.88083 2.11843 6.84487 2.96176 5.34374 4.46288C3.84262 5.96401 2.99929 7.99997 2.99929 10.1229C2.99929 12.2458 3.84262 14.2818 5.34374 15.7829ZM15.2437 7.29288L12.4137 10.1229L15.2437 12.9529L13.8337 14.3629L11.0037 11.5329L8.17374 14.3629L6.76374 12.9529L9.59374 10.1229L6.76374 7.29288L8.17374 5.88288L11.0037 8.71288L13.8337 5.88288L15.2437 7.29288Z"/>`

        removeBtn.addEventListener('click', function () {
            checkbox.checked = false
            filterTag.remove()
        });

        filterTag.appendChild(removeBtn)

        filtersContainer.appendChild(filterTag)
    }

    function removeFilter(checkbox) {
        const filterToRemove = filtersContainer.querySelector(`.selected-filter[data-value='${checkbox.value}']`)
        if (filterToRemove) {
            filterToRemove.remove()
        }
    }

    function restoreFilters() {
        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                addFilter(checkbox)
            }
        })
    }

    restoreFilters()
})