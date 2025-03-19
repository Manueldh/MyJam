// Up-down scrollen navbar verdwijnen bron: https://stackoverflow.com/questions/31223341/detecting-scroll-direction
let lastScrollTop = 0

window.addEventListener("scroll", function(){
    let st = window.scrollY || document.documentElement.scrollTop
    let scrollDown = document.querySelector("#menu-container")
    if (st > lastScrollTop) {
        scrollDown.classList.add("nav-up")
    } else if (st < lastScrollTop) {
        scrollDown.classList.remove("nav-up")
    }
    lastScrollTop = st <= 0 ? 0 : st
}, false)