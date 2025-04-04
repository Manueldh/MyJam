
// Haal de favoriete liedjes uit de DOM
function getFavoriteSongsFromDOM() {
    const songElements = document.querySelectorAll('.song');
    const favoriteSongs = Array.from(songElements).map(song => ({
        trackName: song.querySelector('.title').textContent,
        artist: song.querySelector('.artist').textContent,
        spotifyId: song.dataset.spotifyId
    }));
    return favoriteSongs;
}

let favoriteSongs = getFavoriteSongsFromDOM();

// Randomizer-functie
function kiesWillekeurigLiedje() {
    if (favoriteSongs.length === 0) {
        document.getElementById("liedjeWeergave").innerText = "🎵 No favorite songs available!";
        return;
    }

    let randomIndex = Math.floor(Math.random() * favoriteSongs.length);
    let gekozenLiedje = favoriteSongs[randomIndex];

    document.getElementById("liedjeWeergave").innerText = `🎵 ${gekozenLiedje.trackName} - ${gekozenLiedje.artist}`;
}

// Voeg een event listener toe aan de randomizer-knop
const randomBtn = document.querySelector('.random');
if (randomBtn) {
    randomBtn.addEventListener('click', kiesWillekeurigLiedje);
}



    document.addEventListener('DOMContentLoaded', () => {
        let allSongs = document.querySelectorAll(".song");  

        allSongs.forEach(song => {
            song.addEventListener("click", function(event) {
                if (event.target.closest(".actions")) return;
    
                let extraInfo = song.querySelector(".extraSongInfo");
    
                if (extraInfo.classList.contains("visible")) {
                    extraInfo.classList.remove("visible");
                } else {
                    allSongs.forEach(otherSong => {
                        let otherExtraInfo = otherSong.querySelector(".extraSongInfo");
                        otherExtraInfo.classList.remove("visible");
                    });
                    extraInfo.classList.add("visible");
                }
                event.stopPropagation();
            });
        });

    function getSelectedFilters() {
        const selectedFilters = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
            .map(checkbox => checkbox.nextElementSibling.textContent.trim().toLowerCase());
        return selectedFilters;
    }    


    /********** Geeft de extra informatie een highlight die match met de geselecteerde filters **********/
    function highlightMatchingSpans() {
        const selectedFilters = getSelectedFilters();

        document.querySelectorAll(".extraSongInfoBG").forEach(span => {
            const spanText = span.textContent.trim().toLowerCase();

            if (selectedFilters.includes(spanText)) {
                if (!span.classList.contains("highlight")) {
                    span.classList.add("highlight");
                } else {
            }
            } else {
                if (span.classList.contains("highlight")) {
                    span.classList.remove("highlight");
                }
            }
        });
    }
    highlightMatchingSpans()
})

