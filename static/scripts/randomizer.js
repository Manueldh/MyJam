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

randomBtn.addEventListener('click', kiesWillekeurigLiedje);

