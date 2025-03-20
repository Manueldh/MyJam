document.addEventListener('DOMContentLoaded', () => {
    const checkbox = document.getElementById('Electric-guitar'); // Vervang 'Electric-guitar' door het ID van je checkbox
  
    checkbox.addEventListener('change', () => {
      console.log(checkbox.checked); // Logt 'true' als aangevinkt, anders 'false'
    });
  });
