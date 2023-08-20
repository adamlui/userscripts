// ==UserScript==
// @name                GitHub Star History ⭐
// @name:zh             GitHub 之星历史 ⭐
// @name:zh-CN          GitHub 之星历史 ⭐
// @name:zh-HK          GitHub 之星曆史 ⭐
// @name:zh-SG          GitHub 之星历史 ⭐
// @name:zh-TW          GitHub 之星曆史 ⭐
// @description         Adds star history chart to sidebar of GitHub repos
// @description:zh      将明星历史图表添加到 GitHub 存储库的侧边栏
// @description:zh-CN   将明星历史图表添加到 GitHub 存储库的侧边栏
// @description:zh-HK   將明星曆史圖表添加到 GitHub 存儲庫的側邊欄
// @description:zh-SG   将明星历史图表添加到 GitHub 存储库的侧边栏
// @description:zh-TW   將明星曆史圖表添加到 GitHub 存儲庫的側邊欄
// @author              Adam Lui
// @namespace           https://github.com/adamlui
// @version             2023.8.20
// @license             MIT
// @icon                https://github.githubassets.com/favicons/favicon.png
// @compatible          chrome
// @compatible          firefox
// @compatible          brave
// @match               *://github.com/*
// @connect             api.star-history.com
// @grant               GM.xmlHttpRequest
// @downloadURL         https://greasyfork.org/scripts/473377/code/github-star-history.user.js
// @updateURL           https://greasyfork.org/scripts/473377/code/github-star-history.meta.js
// @homepageURL         https://github.com/adamlui/github-star-history
// @supportURL          https://github.com/adamlui/github-star-history/issues
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

    function sanitizeImgURL(url) {
        if (!url.startsWith('https://api.star-history.com/svg'))
            throw new Error('>> Invalid URL')
        return url
    }

    async function insertStarHistory() {
        const user = /github\.com\/(.*?)\//.exec(window.location)[1],
              repo = /.*\/(.*)/.exec(window.location)[1]
        if (!document.querySelector('#star-history')) {

            try { // to load/insert star history chart

                // Craft image URL
                const imgURL = sanitizeImgURL('https://api.star-history.com/svg?repos='
                    + `${ user }/${ repo }&type=Date`
                    + ( document.documentElement.dataset.colorMode === 'dark' ||
                        document.documentElement.dataset.darkreaderScheme === 'dark'
                            ? '&theme=dark' : '' ))

                // Fetch image as blob
                const response = await GM.xmlHttpRequest({
                    method: 'GET', url: imgURL, responseType: 'blob' })
                if (response.status !== 200) 
                    throw new Error('>> Failed to fetch image')

                // Convert blob to data URL
                const imgDataURL = await new Promise((resolve) => {
                    const reader = new FileReader()
                    reader.onload = () => resolve(reader.result)
                    reader.readAsDataURL(response.response)
                })

                // Create #star-history div + add attrs/HTML/listener
                const starHistoryDiv = document.createElement('div')
                starHistoryDiv.id = 'star-history'
                starHistoryDiv.style.cursor = 'pointer'
                starHistoryDiv.innerHTML = '<img style="width: 100% ; padding: 20px 0" '
                    + 'src="' + imgDataURL  + '">'
                starHistoryDiv.addEventListener('click', () => { zoomStarHistory(imgDataURL) })

                // Insert div
                const aboutSection = document.querySelector('[class$="sidebar"] > div > div')
                aboutSection.insertAdjacentElement('afterend', starHistoryDiv)

            } catch (err) { console.error('>> Error loading star history chart:', err) }
        }
    }

    function zoomStarHistory(imgURL) {
        const user = /github\.com\/(.*?)\//.exec(window.location)[1],
              repo = /.*\/(.*)/.exec(window.location)[1]

        // Create/stylize overlay
        const overlay = document.createElement('div')
        overlay.style.position = 'fixed' ; overlay.style.top = '0' ; overlay.style.left = '0'
        overlay.style.width = '100%' ; overlay.style.height = '100%'
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)' ; overlay.style.display = 'flex'
        overlay.style.alignItems = 'center' ; overlay.style.justifyContent = 'center'
        overlay.style.zIndex = '9999'

        // Stylize zoomed img
        const zoomedImg = new Image()
        zoomedImg.title = 'View on star-history.com' ; zoomedImg.src = imgURL
        zoomedImg.style.maxWidth = '90%' ; zoomedImg.style.maxHeight = '90%'
        zoomedImg.style.cursor = 'pointer'

        // Add listeners
        zoomedImg.addEventListener('click', () => { // view on star-history.com
            window.open(`https://star-history.com/#${ user }/${ repo }&Date`, '_blank') })
        overlay.addEventListener('click', () => { document.body.removeChild(overlay) })

        // Append elements
        overlay.appendChild(zoomedImg) ; document.body.appendChild(overlay)
    }

})()
