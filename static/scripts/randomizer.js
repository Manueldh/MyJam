let liedjes = [
    "Bohemian Rhapsody - Queen",
    "Billie Jean - Michael Jackson",
    "Hotel California - Eagles",
    "Stairway to Heaven - Led Zeppelin",
    "Smells Like Teen Spirit - Nirvana",
    "One - Metallica",
    "Imagine - John Lennon",
    "Hey Jude - The Beatles",   
    "Sweet Child O' Mine - Guns N' Roses",
    "Like a Rolling Stone - Bob Dylan",
    "With or Without You - U2",
    "Angel - Massive Attack",
    "Purple Rain - Prince",
    "Like a tattoo - Sade",
];

const randomBtn = document.querySelector('.random');

function kiesWillekeurigLiedje() {
    let randomIndex = Math.floor(Math.random() * liedjes.length);
    let gekozenLiedje = liedjes[randomIndex];

    document.getElementById("liedjeWeergave").innerText = "🎵 " + gekozenLiedje;
}

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

