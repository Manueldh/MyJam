/********** Voor het opslaan van gekoze filters in de local storage **********/
document.addEventListener("DOMContentLoaded", function () {
    function loadSelections(category) {
        let savedSelections = JSON.parse(localStorage.getItem(category)) || [];
        savedSelections.forEach(value => {
            let checkbox = document.querySelector(`input[name="${category}"][value="${value}"]`);
            if (checkbox) {
                checkbox.checked = true;
            } else {
                console.warn(`Checkbox met value '${value}' niet gevonden`);
            }
        });
    }

    function saveSelections(category) {
        let selected = [...document.querySelectorAll(`input[type="checkbox"]:checked`)]
            .map(checkbox => checkbox.value);
        localStorage.setItem(category, JSON.stringify(selected));
    }

    let category;
    if (window.location.pathname.includes("instrument")) {
        category = "selectedInstruments";
    } else if (window.location.pathname.includes("genre")) {
        category = "selectedGenres";
    } else if (window.location.pathname.includes("difficulty")) {
        category = "selectedDifficulty";
    }

    if (category) {
        loadSelections(category);

        document.querySelectorAll(`input[type="checkbox"]`).forEach(checkbox => {
            checkbox.addEventListener("change", () => saveSelections(category));
        });
    }
});