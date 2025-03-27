document.addEventListener('DOMContentLoaded', () => {
    const options = {
        valueNames: ['friends'] 
    }
    const userList = new List('user-list', options)

    type()

})

const input = document.querySelector('.search')

function type() { 
    const ul = document.querySelector('.list')

    if (input.value === '') {
        ul.style.display = 'none'
    } else {
       ul.style.display = 'block'
    }
}


input.addEventListener('keyup', type)