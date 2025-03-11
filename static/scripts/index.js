const editDetails = document.querySelector('.edit-details')

function toggleEditing() {

  const emailField = document.querySelector('.email')
  const usernameField = document.querySelector('.username')
  const passwordField = document.querySelector('.password')


  emailField.toggleAttribute('readonly');
  usernameField.toggleAttribute('readonly')
  passwordField.toggleAttribute('readonly')

  if (emailField.hasAttribute('readonly')) {
    editDetails.textContent = 'change info'
  } else {
    editDetails.textContent = 'cancel'
  }
}

editDetails.addEventListener('click', toggleEditing)