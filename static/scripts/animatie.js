document.addEventListener('DOMContentLoaded', () => {
    const items = document.querySelectorAll('.item'); // Selecteer alle items met de class "item"

    items.forEach((item, index) => {
        setTimeout(() => {
            item.classList.add('animate'); // Voeg de animatieklasse toe
        }, index * 100); // Voeg een vertraging toe voor een "staggered" effect
    });
});