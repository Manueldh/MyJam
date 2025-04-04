const showfriends = document.querySelector('.showFriends')
const showfriendsModal = document.querySelector('.showFriendsModal')
const showfriendsClose = document.querySelector('.modalClose')
const editDetails = document.querySelector('.edit-details'); 

let originalValues = {}; // Hier bewaren we de originele waarden

function toggleEditing() {
  const emailField = document.querySelector('.email');
  const usernameField = document.querySelector('.username');

  // Als we naar bewerkmodus gaan, sla de originele waarden op. 
  // If else statement om te checken of het readonly is of niet.
  if (emailField.hasAttribute('readonly')) {
    originalValues.email = emailField.value;
    originalValues.username = usernameField.value;
  } else {
    // Als we annuleren, zet de oude waarden terug
    emailField.value = originalValues.email;
    usernameField.value = originalValues.username;
  }

  // Toggle de readonly status, wat betekent of je het invoerveld kan bewerken of niet. 
  // Als het readonly is, kan je het niet bewerken.
  emailField.toggleAttribute('readonly');
  usernameField.toggleAttribute('readonly');

  // Pas de knoptekst aan
  if (emailField.hasAttribute('readonly')) {
    editDetails.textContent = 'edit details';
  } else {
    editDetails.textContent = 'cancel';
  }
}

// Event listener voor de knop
editDetails.addEventListener('click', toggleEditing);


if (showfriends && showfriendsModal && showfriendsClose) {
  showfriends.addEventListener('click', () => {
    showfriendsModal.showModal()
  })


  showfriendsClose.addEventListener('click', () => {
    showfriendsModal.close()
  })
}