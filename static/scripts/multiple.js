const btnSelected = document.querySelectorAll('.instrument-button , .level-btn, .genre-button');

btnSelected.forEach(button => {
  button.addEventListener("click", () => {
    button.classList.toggle("selected");
  });
});
