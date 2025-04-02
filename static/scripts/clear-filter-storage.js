document.addEventListener('DOMContentLoaded', function() {
    const findJamButton = document.querySelector('.home a[href="/instrument"]');
    
    if (findJamButton) {
        findJamButton.addEventListener('click', function() {
            localStorage.removeItem("selectedInstruments")
            localStorage.removeItem("selectedGenres")
            localStorage.removeItem("selectedDifficulty")
        });
    }
});