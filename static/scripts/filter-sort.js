document.addEventListener('DOMContentLoaded', function () {
    const filtersContainer = document.querySelector('#selected-filters')
    const checkboxes = document.querySelectorAll("input[type='checkbox']")
    const songs = document.querySelectorAll(".song")
    const resultsContainer = document.querySelector("#results")

    const paginationContainer = document.querySelector('#pagination')
    const prevButton = paginationContainer.querySelector('.previousBtn');
    const nextButton = paginationContainer.querySelector('.nextBtn');

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

            const songGenre = song.querySelector('.extraSongInfo .topRow span:first-child .extraSongInfoBG').textContent.toLowerCase();
            const instrumentElements = song.querySelectorAll('.extraSongInfo .bottomRow .extraSongInfoBG');
            const songInstruments = Array.from(instrumentElements).map(el => el.textContent.toLowerCase());
            const difficultyText = song.querySelector('.extraSongInfo .topRow span:nth-child(2) .extraSongInfoBG').textContent.toLowerCase();
            let songDifficulty;
            switch(difficultyText) {
                case 'amateur': 
                    songDifficulty = '1'; 
                    break;
                case 'beginner': 
                    songDifficulty = '2'; 
                    break;
                case 'intermediate': 
                    songDifficulty = '3'; 
                    break;
                case 'experienced': 
                    songDifficulty = '4'; 
                    break;
                case 'master': 
                    songDifficulty = '5'; 
                    break;
                default: 
                    songDifficulty = '1';
            }

            let matchesGenre = selectedFilters.genre.length === 0 || selectedFilters.genre.includes(songGenre)
            let matchesInstrument = selectedFilters.instruments.length === 0 || songInstruments.some(instr => selectedFilters.instruments.includes(instr))
            let matchesDifficulty = selectedFilters.difficulty.length === 0 || selectedFilters.difficulty.includes(songDifficulty)

            let matches = matchesGenre && matchesInstrument && matchesDifficulty

            song.classList.toggle("filtered-out", !matches)
        })
        currentPage = 1
        showPage(currentPage)
    }

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
        while (prevButton.nextSibling && prevButton.nextSibling !== nextButton) {
            paginationContainer.removeChild(prevButton.nextSibling);
        }
        
        let totalPages = Math.ceil(totalTracks / itemsPerPage);
        
        if (totalPages <= 1) {
            prevButton.style.display = 'none';
            nextButton.style.display = 'none';
            return;
        } else {
            prevButton.style.display = '';
            nextButton.style.display = '';
        }
        prevButton.disabled = currentPage === 1;
        nextButton.disabled = currentPage === totalPages;
        
        const fragment = document.createDocumentFragment();
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, currentPage + 2);
        
        if (startPage > 1) {
            fragment.appendChild(createPageButton(1));
            if (startPage > 2) fragment.appendChild(createDots());
        }  
        for (let i = startPage; i <= endPage; i++) {
            fragment.appendChild(createPageButton(i));
        }     
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) fragment.appendChild(createDots());
            fragment.appendChild(createPageButton(totalPages));
        }
        paginationContainer.insertBefore(fragment, nextButton);
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

    prevButton.addEventListener("click", () => {
        currentPage--
        showPage(currentPage)
    })
    nextButton.addEventListener("click", () => {
        currentPage++
        showPage(currentPage)
    })

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
        showPage(currentPage)
    }

    function getDurationInSeconds(durationString) {
        const [minutes, seconds] = durationString.split(":").map(Number)
        return (minutes * 60) + seconds
    }

    document.getElementById("sort").addEventListener("change", () => {
        sortSongs()
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