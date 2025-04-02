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
    
    function setupPaginationMonitoring() {
        const paginationContainer = document.querySelector('#pagination')
        if (paginationContainer) {
            paginationContainer.addEventListener('click', function() {
                setTimeout(setupVisibleTextOverflow, 300)
            })
        }
        
        let lastActivePage = document.querySelector('#pagination .active')
        
        setInterval(function() {
            const currentActivePage = document.querySelector('#pagination .active')
            
            if (currentActivePage && (!lastActivePage || 
                lastActivePage.textContent !== currentActivePage.textContent)) {
                lastActivePage = currentActivePage
                setupVisibleTextOverflow()
            }
        }, 500)
        
        const resultsContainer = document.querySelector('.results-container')
        if (resultsContainer) {
            const observer = new MutationObserver(function(mutations) {
                let displayChanged = false
                
                mutations.forEach(function(mutation) {
                    if (mutation.type === 'attributes' && 
                        mutation.attributeName === 'style' && 
                        mutation.target.classList.contains('song')) {
                        displayChanged = true
                    }
                })
                
                if (displayChanged) {
                    setTimeout(setupVisibleTextOverflow, 100)
                }
            })
            
            observer.observe(resultsContainer, {
                attributes: true,
                attributeFilter: ['style'],
                subtree: true
            })
        }
    }
    
    setupVisibleTextOverflow()
    
    window.addEventListener('resize', setupVisibleTextOverflow)
    window.addEventListener('load', function() {
        setupVisibleTextOverflow()
        setupPaginationMonitoring()
    })
    window.refreshTextOverflow = setupVisibleTextOverflow
})