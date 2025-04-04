/********** Voor het afspelen van de muziek previews **********/
let audioPlayer = new Audio()
let currentlyPlayingButton = null
let isProcessing = false

audioPlayer.preload = "auto"

document.addEventListener("click", (event) => {
    const button = event.target.closest('.play')
    
    if (!button) return
    
    if (isProcessing) return
    isProcessing = true
    
    const previewUrl = button.dataset.previewUrl
    
    if (!previewUrl) {
        console.error("Geen preview URL gevonden voor deze knop")
        isProcessing = false
        return
    }
    
    if (currentlyPlayingButton === button) {
        audioPlayer.pause()
        button.classList.remove("playing")
        currentlyPlayingButton = null
        setTimeout(() => { isProcessing = false; }, 50)
    } else {
        audioPlayer.pause()
        
        if (currentlyPlayingButton) {
            currentlyPlayingButton.classList.remove("playing")
        }
        
        button.classList.add("playing")
        currentlyPlayingButton = button
        
        try {
            audioPlayer.src = previewUrl
            
            audioPlayer.load()
            
            const playPromise = audioPlayer.play()
            
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.error("Fout bij afspelen van audio:", error)
                    button.classList.remove("playing")
                    currentlyPlayingButton = null
                })
            }
        } catch (e) {
            console.error("Fout bij het instellen van audio:", e)
            button.classList.remove("playing")
            currentlyPlayingButton = null
        }
        
        setTimeout(() => { isProcessing = false; }, 50)
    }
})

audioPlayer.addEventListener("ended", () => {
    if (currentlyPlayingButton) {
        currentlyPlayingButton.classList.remove("playing")
        currentlyPlayingButton = null
    }
})

audioPlayer.addEventListener("error", () => {
    if (currentlyPlayingButton) {
        currentlyPlayingButton.classList.remove("playing")
        currentlyPlayingButton = null
    }
    isProcessing = false
})