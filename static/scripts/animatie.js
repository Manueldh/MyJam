document.addEventListener('DOMContentLoaded', () => {
    const items = document.querySelectorAll('.item') // Selecteer alle items met de class "item"

    items.forEach((item, index) => {
        setTimeout(() => {
            item.classList.add('animate') // Voeg de animatieklasse toe
        }, index * 100) // Voeg een vertraging toe voor een "staggered" effect
    })


    /********** Voor title en artist animatie bij songs **********/
    const PIXELS_PER_SECOND = 40
    const MIN_OVERFLOW_PX = 5
    const MAX_DURATION = 10
    
    let isProcessing = false
    
    function setupVisibleTextOverflow() {
        if (isProcessing) return
        isProcessing = true
        
        const visibleSongs = document.querySelectorAll('.song:not([style*="display: none"]), .song[style*="display: grid"], .song[style*="display:grid"]')
        
        visibleSongs.forEach(song => {
            const title = song.querySelector('.title')
            const artist = song.querySelector('.artist')
            
            if (title) setupScrollForElement(title)
            if (artist) setupScrollForElement(artist)
        })
        
        isProcessing = false
    }
    
    function setupScrollForElement(element) {
        const newElement = element.cloneNode(true)
        element.parentNode.replaceChild(newElement, element)
        element = newElement
        
        element.style.whiteSpace = 'nowrap'
        element.style.overflow = 'hidden'
        element.style.textOverflow = 'ellipsis'
        element.style.display = 'block'
        
        const diff = element.scrollWidth - element.clientWidth
        
        if (diff > MIN_OVERFLOW_PX) {
            const duration = Math.min(MAX_DURATION, diff / PIXELS_PER_SECOND)
            
            element.addEventListener('mouseenter', function() {
                this.style.transition = 'none'
                this.style.transform = 'translateX(0)'
                void this.offsetWidth
                
                this.style.overflow = 'visible'
                this.style.textOverflow = 'clip'
                this.style.transition = `transform ${duration}s linear`
                this.style.transform = `translateX(-${diff}px)`
            })
            
            element.addEventListener('mouseleave', function() {
                this.style.overflow = 'hidden'
                this.style.textOverflow = 'ellipsis'
                this.style.transition = '0.3s ease-out'
                this.style.transform = 'translateX(0)'
            })
        }
    }
    
    window.addEventListener('resize', setupVisibleTextOverflow)
    window.addEventListener('load', function() {
        setupVisibleTextOverflow()
    })
    window.refreshTextOverflow = setupVisibleTextOverflow

    /********** Voor het openen van de extra info van de songs **********/
    document.body.addEventListener('click', function(event) {
        const song = event.target.closest('.song');
        
        if (!song || event.target.closest(".actions")) return;
        
        const extraInfo = song.querySelector(".extraSongInfo");
        
        if (extraInfo.classList.contains("visible")) {
            extraInfo.classList.remove("visible");
        } else {
            document.querySelectorAll(".song .extraSongInfo.visible").forEach(info => {
                info.classList.remove("visible");
            });
            
            extraInfo.classList.add("visible");
        }
        
        event.stopPropagation();
    });
})

function lazyLoadCovers() {
    const visibleSongs = document.querySelectorAll('.song:not([style*="display: none"]) .cover.lazy-load')

    visibleSongs.forEach(img => {
        if (!img.dataset.src) return

        img.src = img.dataset.src
        img.removeAttribute('data-src')
        img.classList.remove('lazy-load')
    })
}

// Roep deze functie aan na het laden van de pagina en bij paginatie updates
document.addEventListener("DOMContentLoaded", lazyLoadCovers)
document.addEventListener("pageChange", lazyLoadCovers)