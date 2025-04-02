document.addEventListener("DOMContentLoaded", function () {
    // Functie om opgeslagen keuzes te laden en checkboxes correct te zetten
    function loadSelections(category) {
        let savedSelections = JSON.parse(localStorage.getItem(category)) || [];
        console.log(`Loaded ${category}:`, savedSelections)
        savedSelections.forEach(value => {
            let checkbox = document.querySelector(`input[name="${category}"][value="${value}"]`);
            if (checkbox) {
                checkbox.checked = true;
            } else {
                console.warn(`Checkbox met value '${value}' niet gevonden`);
            }
        });
    }

    // Functie om keuzes op te slaan in localStorage wanneer een checkbox wordt aangeklikt
    function saveSelections(category) {
        let selected = [...document.querySelectorAll(`input[type="checkbox"]:checked`)]
            .map(checkbox => checkbox.value);
        localStorage.setItem(category, JSON.stringify(selected));

        console.log(`Saved ${category}:`, selected)
    }

    // Detecteer de huidige pagina en stel de juiste categorie in
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

        // Voeg eventlisteners toe aan alle checkboxes
        document.querySelectorAll(`input[type="checkbox"]`).forEach(checkbox => {
            checkbox.addEventListener("change", () => saveSelections(category));
        });
    }
});