document.addEventListener('DOMContentLoaded', () => {
    const showFriendsButton = document.querySelector('.showFriends');
    const friendsModal = document.querySelector('.showFriendsModal');
    const modalCloseButton = document.querySelector('.modalClose');

  
    // Open de dialog wanneer op de knop wordt geklikt
    showFriendsButton.addEventListener('click', () => {
      if (friendsModal) {
        friendsModal.showModal();
      }
    });
  
    // Sluit de dialog wanneer op de sluitknop wordt geklikt
    modalCloseButton.addEventListener('click', () => {
      if (friendsModal) {
        friendsModal.close();
      }
    });
  });