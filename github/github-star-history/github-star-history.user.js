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
// @version             2024.10.17.14
// @license             MIT
// @icon                https://github.githubassets.com/favicons/favicon.png
// @compatible          chrome
// @compatible          firefox
// @compatible          edge
// @compatible          brave
// @match               *://github.com/*
// @connect             api.star-history.com
// @connect             cdn.jsdelivr.net
// @connect             update.greasyfork.org
// @grant               GM_registerMenuCommand
// @grant               GM_openInTab
// @grant               GM_xmlhttpRequest
// @grant               GM.xmlHttpRequest
// @downloadURL         https://update.greasyfork.org/scripts/473377/github-star-history.user.js
// @updateURL           https://update.greasyfork.org/scripts/473377/github-star-history.meta.js
// @homepageURL         https://github.com/adamlui/github-star-history
// @supportURL          https://github.com/adamlui/github-star-history/issues
// ==/UserScript==

(async () => {

    // Init ENV vars
    const env = {
        scriptManager: (() => { try { return GM_info.scriptHandler } catch (err) { return 'unknown' }})()
    }
    const xhr = env.scriptManager == 'OrangeMonkey' ? GM_xmlhttpRequest : GM.xmlHttpRequest

    // Init alert QUEUE
    var alertQueue = [] ; localStorage.alertQueue = JSON.stringify(alertQueue)

    // Init UI props
    const ui = { scheme: isDarkMode() ? 'dark' : 'light' }

    // Init APP info
    const app = { latestAssetCommitHash: '8405505' },
          assetHostURL = `https://cdn.jsdelivr.net/gh/adamlui/github-star-history@${app.latestAssetCommitHash}`
    Object.assign(app, await new Promise(resolve => xhr({
        method: 'GET', url: `${assetHostURL}/app.json`,
        onload: resp => resolve(JSON.parse(resp.responseText))
    })))
    app.urls.update = app.urls.greasyFork.replace('https://', 'https://update.')
        .replace(/(\d+)-?([a-zA-Z-]*)$/, (_, id, name) => `${id}/${ name || 'script' }.meta.js`)

    // Define SCRIPT functions

    function safeWinOpen(url) { open(url, '_blank', 'noopener') } // to prevent backdoor vulnerabilities

    function updateCheck() {

        // Fetch latest meta
        const currentVer = GM_info.script.version
        xhr({
            method: 'GET', url: app.urls.update + '?t=' + Date.now(),
            headers: { 'Cache-Control': 'no-cache' },
            onload: response => { const latestVer = /@version +(.*)/.exec(response.responseText)[1]

                // Compare versions                
                for (let i = 0 ; i < 4 ; i++) { // loop thru subver's
                    const currentSubVer = parseInt(currentVer.split('.')[i], 10) || 0,
                          latestSubVer = parseInt(latestVer.split('.')[i], 10) || 0
                    if (currentSubVer > latestSubVer) break // out of comparison since not outdated
                    else if (latestSubVer > currentSubVer) { // if outdated

                        // Alert to update
                        alert('Update available! 🚀', // title
                            `A newer version of ${app.name} v${latestVer} is available!  `
                                + '<a target="_blank" rel="noopener" style="font-size: 0.9rem" '
                                    + 'href="' + app.urls.gitHub + '/commits/main/greasemonkey/'
                                    + app.urls.update.replace(/.*\/(.*)meta\.js/, '$1user.js') + '" '
                                    + '>View changes</a>',
                            function update() { // button
                                GM_openInTab(app.urls.update.replace('meta.js', 'user.js') + '?t=' + Date.now(),
                                    { active: true, insert: true } // focus, make adjacent
                                ).onclose = () => location.reload() },
                            '', 383 // width
                        )
                        return
                }}

                alert('Up to date!', `${app.name} (v${currentVer}) is up-to-date!`)
    }})}

    function isDarkMode() {
        return document.documentElement.dataset.colorMode == 'dark'
            || document.documentElement.dataset.darkreaderScheme == 'dark'
            || window.matchMedia?.('(prefers-color-scheme: dark)')?.matches
    }

    // Define FEEDBACK functions

    function alert(title, msg, btns, checkbox, width) {
    // [ title/msg = strings, btns = [named functions], checkbox = named function, width (px) = int ] = optional
    // * Spaces are inserted into button labels by parsing function names in camel/kebab/snake case

        // Create modal parent/children elements
        const modalContainer = document.createElement('div')
        modalContainer.id = Math.floor(Math.random() * 1000000) + Date.now()
        modalContainer.classList.add('chatgpt-modal') // add class to main div
        const modal = document.createElement('div'),
              modalTitle = document.createElement('h2'),
              modalMessage = document.createElement('p')

        // Select or crate/append style
        let modalStyle
        if (!document.querySelector('#chatgpt-alert-style')) {
            modalStyle = document.createElement('style')
            modalStyle.id = 'chatgpt-alert-style'
            document.head.append(modalStyle)
        } else modalStyle = document.querySelector('#chatgpt-alert-style')

        // Define styles
        modalStyle.innerText = (

            // Background styles
            '.chatgpt-modal {' 
                + 'position: fixed ; top: 0 ; left: 0 ; width: 100% ; height: 100% ;' // expand to full view-port
                + 'background-color: rgba(67, 70, 72, 0.75) ;' // dim bg
                + 'display: flex ; justify-content: center ; align-items: center ; z-index: 9999 }' // align

            // Alert styles
            + '.chatgpt-modal > div {'
                + 'font-family: Söhne, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans,'
                    + 'sans-serif, Helvetica Neue, Arial, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji ;'
                + 'opacity: 0 ; transform: translateX(-2px) translateY(5px) ;'
                + 'transition: opacity 0.1s cubic-bezier(.165,.84,.44,1), transform 0.2s cubic-bezier(.165,.84,.44,1) ;'
                + `background-color: ${ ui.scheme == 'dark' ? 'black' : 'white' } ;`
                + ( width ? `width: ${width}px` : 'max-width: 458px ') + ' ;'
                + 'padding: 20px ; margin: 12px 23px ; border-radius: 5px ; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3) }'
            + '.chatgpt-modal h2 { font-size: 2em ; margin-bottom: 9px }'
            + '.chatgpt-modal p { font-size: 1.35em }'
            + `.chatgpt-modal a { color: ${ ui.scheme == 'dark' ? '#00cfff' : '#1e9ebb' }}`
            + '.chatgpt-modal.animated > div { opacity: 1 ; transform: translateX(0) translateY(0) }'

            // Button styles
            + '.modal-buttons { display: flex ; justify-content: flex-end ; margin: 20px -5px -3px 0 }'
            + '.chatgpt-modal button {'
                + 'margin-left: 10px ; padding: 4px 12px ; border-radius: 6px ;'
                + `border: 1px solid ${ ui.scheme == 'dark' ? 'white' : '#979797' }}`
            + '.primary-modal-btn {'
                + `border: 1px solid ${ ui.scheme == 'dark' ? 'white' : '#979797' } ;`
                + `background: ${ ui.scheme == 'dark' ? 'white' : 'black' } ;`
                + `color: ${ ui.scheme == 'dark' ? 'black' : 'white' }}`
            + '.chatgpt-modal button:hover { background-color: #42B4BF ; border-color: #42B4BF ; color: black }'

            /* Checkbox styles */
            + '.chatgpt-modal .checkbox-group { display: flex ; margin-top: -18px }'
            + '.chatgpt-modal .checkbox-group label {'
                + 'font-size: .7rem ; margin: -.04rem 0 0px .3rem ;'
                + `color: ${ ui.scheme == 'dark' ? '#e1e1e1' : '#1e1e1e' }}`
            + '.chatgpt-modal input[type="checkbox"] { transform: scale(0.7) ;'
                + `border: 1px solid ${ ui.scheme == 'dark' ? 'white' : 'black' }}`
            + '.chatgpt-modal input[type="checkbox"]:checked {'
                + `border: 1px solid ${ ui.scheme == 'dark' ? 'white' : 'black' } ;`
                + 'background-color: black ; position: inherit }'
            + '.chatgpt-modal input[type="checkbox"]:focus { outline: none ; box-shadow: none }'
        )

        // Insert text into elements
        modalTitle.innerText = app.symbol + ' ' + title || ''
        modalMessage.innerText = msg || '' ; renderHTML(modalMessage)

        // Create/append buttons (if provided) to buttons div
        const modalButtons = document.createElement('div')
        modalButtons.classList.add('modal-buttons')
        if (btns) { // are supplied
            if (!Array.isArray(btns)) btns = [btns] // convert single button to array if necessary
            btns.forEach(buttonFn => { // create title-cased labels + attach listeners
                const button = document.createElement('button')
                button.textContent = buttonFn.name
                    .replace(/[_-]\w/g, match => match.slice(1).toUpperCase()) // convert snake/kebab to camel case
                    .replace(/([A-Z])/g, ' $1') // insert spaces
                    .replace(/^\w/, firstChar => firstChar.toUpperCase()) // capitalize first letter
                button.onclick = () => { destroyAlert() ; buttonFn() }
                modalButtons.insertBefore(button, modalButtons.firstChild) // insert button to left
            })
        }

        // Create/append OK/dismiss button to buttons div
        const dismissBtn = document.createElement('button')
        dismissBtn.textContent = btns ? 'Dismiss' : 'OK'
        dismissBtn.onclick = destroyAlert
        modalButtons.insertBefore(dismissBtn, modalButtons.firstChild)

        // Highlight primary button
        modalButtons.lastChild.classList.add('primary-modal-btn')

        // Create/append checkbox (if provided) to checkbox group div
        const checkboxDiv = document.createElement('div')
        if (checkbox) { // is supplied
            checkboxDiv.classList.add('checkbox-group')
            const checkboxFn = checkbox, // assign the named function to checkboxFn
                  checkboxInput = document.createElement('input')
            checkboxInput.type = 'checkbox'
            checkboxInput.onchange = checkboxFn

            // Create/show label
            const checkboxLabel = document.createElement('label')
            checkboxLabel.onclick = () => {
                checkboxInput.checked = !checkboxInput.checked ; checkboxFn() }
            checkboxLabel.textContent = checkboxFn.name.charAt(0).toUpperCase() // capitalize first char
                + checkboxFn.name.slice(1) // format remaining chars
                    .replace(/([A-Z])/g, (match, letter) => ' ' + letter.toLowerCase()) // insert spaces, convert to lowercase
                    .replace(/\b(\w+)nt\b/gi, '$1n\'t') // insert apostrophe in 'nt' suffixes
                    .trim() // trim leading/trailing spaces

            checkboxDiv.append(checkboxInput) ; checkboxDiv.append(checkboxLabel)
        }

        // Assemble/append div
        const elements = [modalTitle, modalMessage, modalButtons, checkboxDiv]
        elements.forEach(elem => { modal.append(elem) })
        modalContainer.append(modal) ; document.body.append(modalContainer)

        // Enqueue alert
        alertQueue = JSON.parse(localStorage.alertQueue)
        alertQueue.push(modalContainer.id)
        localStorage.alertQueue = JSON.stringify(alertQueue)

        // Add listeners
        document.addEventListener('keydown', keyHandler)
        modalContainer.onclick = event => { if (event.target == modalContainer) destroyAlert() }

        // Show alert if none active
        modalContainer.style.display = 'none'
        if (alertQueue.length == 1) {
            modalContainer.style.display = ''
            setTimeout(() => { modalContainer.classList.add('animated') }, 100)
        }

        function destroyAlert() {
            modalContainer.remove() // remove from DOM
            alertQueue = JSON.parse(localStorage.alertQueue)
            alertQueue.shift() // + memory
            localStorage.alertQueue = JSON.stringify(alertQueue) // + storage

            // Prevent memory leaks
            modalContainer.removeEventListener('click', destroyAlert)
            document.removeEventListener('keydown', keyHandler)
            dismissBtn.removeEventListener('click', destroyAlert)

            // Check for pending alerts in queue
            if (alertQueue.length > 0) {
                const nextAlert = document.getElementById(alertQueue[0])
                setTimeout(() => {
                    nextAlert.style.display = ''
                    setTimeout(() => { nextAlert.classList.add('animated') }, 100)
                }, 500 )
            }
        }

        function keyHandler(event) {
            if ([13, 27].includes(event.keyCode)) { // enter/esc
                for (const alertId of alertQueue) { // look to handle only if triggering alert is active
                    const alert = document.getElementById(alertId)
                    if (alert && alert.style.display != 'none') { // active alert found
                        if (event.keyCode == 27) destroyAlert() // if esc pressed, dismiss alert & do nothing
                        else if (event.keyCode == 13) { // else if enter pressed
                            const mainButton = alert.querySelector('.modal-buttons').lastChild // look for main button
                            if (mainButton) { mainButton.click() ; event.preventDefault() } // click if found
                        } return
        }}}}

        return modalContainer.id
    }

    function renderHTML(node) {
        const reTags = /<([a-z\d]+)\b([^>]*)>([\s\S]*?)<\/\1>/g,
              reAttributes = /(\S+)=['"]?((?:.(?!['"]?\s+(?:\S+)=|[>']))+.)['"]?/g,
              nodeContent = node.childNodes

        // Preserve consecutive spaces + line breaks
        if (!renderHTML.preWrapSet) {
            node.style.whiteSpace = 'pre-wrap' ; renderHTML.preWrapSet = true
            setTimeout(() => { renderHTML.preWrapSet = false }, 100)
        }

        // Process child nodes
        for (const childNode of nodeContent) {

            // Process text node
            if (childNode.nodeType == Node.TEXT_NODE) {
                const text = childNode.nodeValue,
                      elems = Array.from(text.matchAll(reTags))

                // Process 1st element to render
                if (elems.length > 0) {
                    const elem = elems[0],
                          [tagContent, tagName, tagAttributes, tagText] = elem.slice(0, 4),
                          tagNode = document.createElement(tagName) ; tagNode.textContent = tagText

                    // Extract/set attributes
                    const attributes = Array.from(tagAttributes.matchAll(reAttributes))
                    attributes.forEach(attr => {
                        const name = attr[1], value = attr[2].replace(/['"]/g, '')
                        tagNode.setAttribute(name, value)
                    })

                    const renderedNode = renderHTML(tagNode) // render child elements of newly created node

                    // Insert newly rendered node
                    const beforeTextNode = document.createTextNode(text.substring(0, elem.index)),
                          afterTextNode = document.createTextNode(text.substring(elem.index + tagContent.length))

                    // Replace text node with processed nodes
                    node.replaceChild(beforeTextNode, childNode)
                    node.insertBefore(renderedNode, beforeTextNode.nextSibling)
                    node.insertBefore(afterTextNode, renderedNode.nextSibling)
                }

            // Process element nodes recursively
            } else if (childNode.nodeType == Node.ELEMENT_NODE) renderHTML(childNode)
        }

        return node // if assignment used
    }

    // Define CHART functions

    function sanitizeImgURL(url) {
        if (!url.startsWith('https://api.star-history.com/svg'))
            throw new Error('>> Invalid URL')
        return url
    }

    function getUserAndRepoOfCurrentPage() {
        const reGitHubURL = /github\.com\/(?<user>[\w-]+)\/(?<repo>[\w.-]+)\/?/,
              currentURL = location.href,
              groups = reGitHubURL.exec(currentURL)?.groups
        if (!groups?.user || !groups?.repo)
            throw new Error(`Invalid Github repository URL: ${currentURL}`)
        return groups
    }

    async function insertStarHistory() {
        const { user, repo } = getUserAndRepoOfCurrentPage()

        try { // to load/insert star history chart

            // Fetch image as blob
            const imgURL = sanitizeImgURL('https://api.star-history.com/svg?repos='
                + `${user}/${repo}&type=Date` + ( isDarkMode() ? '&theme=dark' : '' ))
            const response = await new Promise((resolve, reject) => xhr({
                method: 'GET', url: imgURL, responseType: 'blob', onload: resolve, onerror: reject}))
            if (response.status != 200) throw new Error('>> Failed to fetch image')

            if (!document.querySelector('#star-history')) {

                // Convert blob to data URL
                const imgDataURL = await new Promise(resolve => {
                    const reader = new FileReader()
                    reader.onload = () => resolve(reader.result)
                    reader.readAsDataURL(response.response)
                })

                // Create/size/pad star history img
                const starHistoryImg = document.createElement('img')
                starHistoryImg.style.width = '100%' ; starHistoryImg.style.padding = '20px 0'
                starHistoryImg.src = imgDataURL

                // Create #star-history div, add attrs/img/listener
                const starHistoryDiv = document.createElement('div')
                starHistoryDiv.id = 'star-history' ; starHistoryDiv.style.cursor = 'crosshair'
                starHistoryDiv.append(starHistoryImg)                
                starHistoryDiv.onclick = () => zoomStarHistory(imgDataURL)

                // Insert div
                const aboutSection = document.querySelector('[class$="sidebar"] > div > div')
                aboutSection.insertAdjacentElement('afterend', starHistoryDiv)
            }

        } catch (err) { console.error('>> Error loading star history chart:', err) }
    }

    function zoomStarHistory(imgURL) {
        const { user, repo } = getUserAndRepoOfCurrentPage()

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
        zoomedImg.onclick = () => // view on star-history.com
            safeWinOpen(`https://star-history.com/#${user}/${repo}&Date`)
        overlay.onclick = () => document.body.removeChild(overlay)

        // Append elements
        overlay.append(zoomedImg) ; document.body.append(overlay)
    }

    // Run MAIN routine

    // Register ABOUT menu command
    GM_registerMenuCommand('💡 About ' + app.name, async () => {

        // Show alert
        const headingStyle = 'font-size: 1.15rem ; font-weight: bold',
              pStyle = 'font-size: 1rem ; position: relative ; left: 3px',
              pBrStyle = 'font-size: 1rem ; position: relative ; left: 9px ; bottom: 3px '
        const aboutAlertID = alert(
            app.name, // title
            `<span style="${headingStyle}">🏷️ <i>Version</i>: </span>`
                + `<span style="${pStyle}">${ GM_info.script.version }</span>\n`
            + `<span style="${headingStyle}">📜 <i>Source code</i>:</span>\n`
                + `<span style="${pBrStyle}"><a href="${app.urls.gitHub}" target="_blank" rel="nopener">`
                + app.urls.gitHub + '</a></span>',
            [ // buttons
                function checkForUpdates() { updateCheck() },
                function leaveAReview() { safeWinOpen(app.urls.greasyFork + '/feedback#post-discussion') }
            ])

        // Re-format buttons to include emojis + re-case + hide 'Dismiss'
        for (const button of document.getElementById(aboutAlertID).querySelectorAll('button')) {
            if (/updates/i.test(button.textContent))
                button.textContent = '🚀 Check for Updates'
            else if (/review/i.test(button.textContent))
                button.textContent = '⭐ Leave a Review'
            else if (/github/i.test(button.textContent))
                button.textContent = '📜 GitHub Source'
            else button.style.display = 'none' // hide Dismiss button
        }
    })

    // Observe DOM for need to insert star history
    let starHistoryAdded = false, prevURL = location.href
    new MutationObserver(mutations => mutations.forEach(mutation => {
        if (mutation.type == 'childList' && mutation.addedNodes.length) {
            const onRepoPage = !!document.querySelector('meta[name="route-pattern"][content*="/:repository"]')
            if (location.href != prevURL) { prevURL = location.href ; starHistoryAdded = false }
            if (onRepoPage && !starHistoryAdded) { insertStarHistory() ; starHistoryAdded = true }
    }})).observe(document.documentElement, { childList: true, subtree: true })

})()
