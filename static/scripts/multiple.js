document.addEventListener('DOMContentLoaded', () => {
    const checkbox = document.getElementById('Electric-guitar'); 
  
    checkbox.addEventListener('change', () => {
      console.log(checkbox.checked); 
    });
  });
