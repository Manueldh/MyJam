
const showfriends = document.querySelector('.showFriends, .friendsOfFriends')
const showfriendsModal = document.querySelector('.showFriendsModal')
const showfriendsClose = document.querySelector('.modalClose')


if (showfriends && showfriendsModal && showfriendsClose) {
    showfriends.addEventListener('click', () => {
      showfriendsModal.showModal()
    })
  
  
    showfriendsClose.addEventListener('click', () => {
      showfriendsModal.close()
    })
  }