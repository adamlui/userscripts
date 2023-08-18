// ==UserScript==
// @name                GitHub Star History ⭐
// @description         Adds star history graph to sidebar of GitHub repos
// @author              Adam Lui
// @namespace           https://github.com/adamlui
// @version             2023.8.18
// @license             MIT
// @icon                https://github.githubassets.com/favicons/favicon.png
// @match               *://github.com/*
// ==/UserScript==

(async () => {

	// Observe DOM for need to insert star history
    let starHistoryAdded = false
    const repoObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList' && mutation.addedNodes.length) {
                const onRepoPage = window.location.href.split('/').length === 5
                if (onRepoPage && !starHistoryAdded) {
                    insertStarHistory() ; starHistoryAdded = true
                } else if (!onRepoPage && starHistoryAdded) starHistoryAdded = false
            }
    })}) ; repoObserver.observe(document.documentElement, { childList: true, subtree: true })

    // Define FUNCTIONS

    async function insertStarHistory() {
        const user = /github\.com\/(.*?)\//.exec(window.location)[1],
              repo = /.*\/(.*)/.exec(window.location)[1]

        try { // to load/insert star history chart
            const imgURL = `https://api.star-history.com/svg?repos=${ user }/${ repo }&type=Date`,
                  img = await loadImg(imgURL)

            if (img.complete && img.naturalHeight !== 0) {

            	// Create div + add attrs/HTML/listener
                const starHistoryDiv = document.createElement('div')
                starHistoryDiv.id = 'star-history'
                starHistoryDiv.style.cursor = 'pointer'
                starHistoryDiv.innerHTML = '<img style="width: 100% ; padding: 20px 0" '
                    + 'src="' + imgURL + '">'
                starHistoryDiv.addEventListener('click', () => { zoomStarHistory(imgURL) })

                // Insert div
                const aboutSection = document.querySelector('[class$="sidebar"] > div > div')
                aboutSection.insertAdjacentElement('afterend', starHistoryDiv)
            }

        } catch (err) { console.error('Error loading star history chart:', err) }
    }

    function loadImg(url) {
        return new Promise((resolve, reject) => {
            const img = new Image()
            img.onload = () => resolve(img)
            img.onerror = (error) => reject(error)
            img.src = url
        })
    }

	function zoomStarHistory(imgURL) {
	    const user = /github\.com\/(.*?)\//.exec(window.location)[1],
	          repo = /.*\/(.*)/.exec(window.location)[1]              

        // Create/stylize overlay
	    const overlay = document.createElement('div')
	    overlay.style.position = 'fixed'
	    overlay.style.top = '0'
	    overlay.style.left = '0'
	    overlay.style.width = '100%'
	    overlay.style.height = '100%'
	    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)'
	    overlay.style.display = 'flex'
	    overlay.style.alignItems = 'center'
	    overlay.style.justifyContent = 'center'
	    overlay.style.zIndex = '9999'

	    // Stylize zoomed img
	    const zoomedImg = new Image()
	    zoomedImg.style.maxWidth = '90%'
	    zoomedImg.style.maxHeight = '90%'
	    zoomedImg.style.cursor = 'pointer'
	    zoomedImg.src = imgURL
	    zoomedImg.title = 'View on star-history.com'

	    // Add listeners
	    zoomedImg.addEventListener('click', () => { // view on star-history.com
	        window.open(`https://star-history.com/#${ user }/${ repo }&Date`, '_blank') })
	    overlay.addEventListener('click', () => { document.body.removeChild(overlay) })

	    // Append elements
	    overlay.appendChild(zoomedImg) ; document.body.appendChild(overlay)
	}

})()
