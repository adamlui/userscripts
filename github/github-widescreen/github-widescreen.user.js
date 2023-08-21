// ==UserScript==
// @name                GitHub Widescreen 🖥️
// @name:zh             GitHub 宽银幕 🖥️
// @name:zh-CN          GitHub 宽银幕 🖥️
// @name:zh-HK          GitHub 寬銀幕 🖥️
// @name:zh-SG          GitHub 宽银幕 🖥️
// @name:zh-TW          GitHub 寬銀幕 🖥️
// @description         Auto-hides obtrusive side panels on GitHub
// @description:zh      自动隐藏 GitHub 上引人注目的侧面板
// @description:zh-CN   自动隐藏 GitHub 上引人注目的侧面板
// @description:zh-HK   自動隱藏 GitHub 上引人注目的側面板
// @description:zh-SG   自动隐藏 GitHub 上引人注目的侧面板
// @description:zh-TW   自動隱藏 GitHub 上引人注目的側面板
// @author              Adam Lui
// @namespace           https://github.com/adamlui
// @version             2023.8.21.1
// @license             MIT
// @icon                https://github.githubassets.com/favicons/favicon.png
// @match               *://github.com/*
// @connect             greasyfork.org
// @grant               GM_registerMenuCommand
// @grant               GM_openInTab
// @grant               GM.xmlHttpRequest
// @downloadURL         https://greasyfork.org/scripts/473439/code/github-widescreen.user.js
// @updateURL           https://greasyfork.org/scripts/473439/code/github-widescreen.meta.js
// @homepageURL         https://github.com/adamlui/github-widescreen
// @supportURL          https://github.com/adamlui/github-widescreen/issues
// ==/UserScript==

(async () => {

    // Init alert QUEUE
    var alertQueue = [] ; localStorage.alertQueue = JSON.stringify(alertQueue)

    // Init CONFIG
    const config = {
        appSymbol: '🖥️',
        gitHubURL: 'https://github.com/adamlui/github-widescreen',
        greasyForkURL: 'https://greasyfork.org/scripts/473439-github-widescreen' }
    config.updateURL = config.greasyForkURL + '/code/github-widescreen.meta.js'

    // Register ABOUT menu command
    GM_registerMenuCommand('💡 About GitHub Widescreen', async () => {

        // Show alert
        const aboutAlertID = alert(
            'GitHub Widescreen v' + GM_info.script.version, '',            
            [ // buttons
                function checkForUpdates() { updateCheck() },
                function githubSource() { safeWindowOpen(config.gitHubURL) },
                function leaveAReview() { safeWindowOpen(
                    config.greasyForkURL + '/feedback#post-discussion') }
            ], '', 507) // About modal width

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

    // Observe DOM for need to hide side panels
    const hideBtns = [] ; let prevURL = null
    const sidePanelObserver = new MutationObserver( (mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList' && mutation.addedNodes.length) {
                if (window.location.href !== prevURL) { // if loaded/naved to new page
                    if (window.location.href.includes('edit')) { // if on editor, wait for side panel load
                        const editorSidePanelobserver = new MutationObserver(() => {
                            if (document.querySelector('[data-testid="editor-side-panel"]')) {
                                editorSidePanelobserver.disconnect() ; hideSidePanels()
                        }}) ; editorSidePanelobserver.observe(document.body, { childList: true, subtree: true })
                    } else hideSidePanels()
                    prevURL = window.location.href
    }}})}) ; sidePanelObserver.observe(document.documentElement, { childList: true, subtree: true })

    // Define SCRIPT functions

    function safeWindowOpen(url) { window.open(url, '_blank', 'noopener') } // to prevent backdoor vulnerabilities

    function updateCheck() {

        // Fetch latest meta
        const currentVer = GM_info.script.version
        GM.xmlHttpRequest({
            method: 'GET', url: config.updateURL + '?t=' + Date.now(),
            headers: { 'Cache-Control': 'no-cache' },
            onload: (response) => {

                // Compare versions
                const latestVer = /@version +(.*)/.exec(response.responseText)[1]
                for (let i = 0 ; i < 4 ; i++) { // loop thru subver's
                    const currentSubVer = parseInt(currentVer.split('.')[i], 10) || 0,
                          latestSubVer = parseInt(latestVer.split('.')[i], 10) || 0
                    if (currentSubVer > latestSubVer) break // out of comparison since not outdated
                    else if (latestSubVer > currentSubVer) { // if outdated

                        // Alert to update
                        alert('Update available! 🚀', // title
                            'A newer version of GitHub Widescreen v' + latestVer + ' is available!  '
                                + '<a target="_blank" rel="noopener" style="font-size: 0.9rem" '
                                    + 'href="' + config.gitHubURL + '/commits/main/greasemonkey/'
                                    + config.updateURL.replace(/.*\/(.*)meta\.js/, '$1user.js') + '" '
                                    + '>View changes</a>',
                            function update() { // button
                                GM_openInTab(config.updateURL.replace('meta.js', 'user.js') + '?t=' + Date.now(),
                                    { active: true, insert: true } // focus, make adjacent
                                ).onclose = () => location.reload() },
                            '', 383 // width
                        )
                        return
                }}

                alert('Up to date!', `GitHub Widescreen (v${ currentVer }) is up-to-date!`)
    }})}

    function isDarkMode() {
        return document.documentElement.dataset.colorMode === 'dark' ||
               document.documentElement.dataset.darkreaderScheme === 'dark'
    }

    function hideSidePanels() {
        hideBtns.push(...document.querySelectorAll(
            // File Tree + Symbols Panel buttons in editor
            'button[aria-expanded="true"][data-testid], '
            // Hide File Tree button in diff views
            + 'button[id^="hide"]:not([hidden])'))                        
        if (hideBtns.length > 0) // click if needed
            hideBtns.forEach((btn) => { btn.click() })
    }

    // Define FEEDBACK functions

    function alert(title, msg, btns, checkbox, width) {
    // [ title/msg = strings, btns = [named functions], checkbox = named function, width (px) = int ] = optional
    // * Spaces are inserted into button labels by parsing function names in camel/kebab/snake case

        // Create modal parent/children elements
        const modalContainer = document.createElement('div')
        modalContainer.id = Math.floor(Math.random() * 1000000) + Date.now()
        modalContainer.classList.add('chatgpt-modal') // add class to main div
        const modal = document.createElement('div')
        const modalTitle = document.createElement('h2')
        const modalMessage = document.createElement('p')

        // Select or crate/append style
        let modalStyle
        if (!document.querySelector('#chatgpt-alert-style')) {
            modalStyle = document.createElement('style')
            modalStyle.id = 'chatgpt-alert-style'
            document.head.appendChild(modalStyle)
        } else modalStyle = document.querySelector('#chatgpt-alert-style')

        // Define styles
        const scheme = isDarkMode() ? 'dark' : 'light'
        modalStyle.innerText = (

            // Background styles
            '.chatgpt-modal {' 
                + 'position: fixed ; top: 0 ; left: 0 ; width: 100% ; height: 100% ;' // expand to full view-port
                + 'background-color: rgba(67, 70, 72, 0.75) ;' // dim bg
                + 'display: flex ; justify-content: center ; align-items: center ; z-index: 9999 }' // align

            // Alert styles
            + '.chatgpt-modal > div {'
                + `background-color: ${ scheme == 'dark' ? 'black' : 'white' } ;`
                + ( width ? `width: ${ width }px` : 'max-width: 458px ') + ' ;'
                + 'padding: 20px ; margin: 12px 23px ; border-radius: 5px ; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3) }'
            + '.chatgpt-modal h2 { font-size: 2em ; margin-bottom: 9px }'
            + '.chatgpt-modal p { font-size: 1.35em }'
            + `.chatgpt-modal a { color: ${ scheme == 'dark' ? '#00cfff' : '#1e9ebb' }}`

            // Button styles
            + '.modal-buttons { display: flex ; justify-content: flex-end ; margin: 20px -5px -3px 0 }'
            + '.chatgpt-modal button {'
                + 'margin-left: 10px ; padding: 4px 12px ; border-radius: 6px ;'
                + `border: 1px solid ${ scheme == 'dark' ? 'white' : '#979797' }}`
            + '.primary-modal-btn {'
                + `border: 1px solid ${ scheme == 'dark' ? 'white' : '#979797' } ;`
                + `background: ${ scheme == 'dark' ? 'white' : 'black' } ;`
                + `color: ${ scheme == 'dark' ? 'black' : 'white' }}`
            + '.chatgpt-modal button:hover { background-color: #42B4BF ; border-color: #42B4BF ; color: black }'

            /* Checkbox styles */
            + '.chatgpt-modal .checkbox-group { display: flex ; margin-top: -18px }'
            + '.chatgpt-modal .checkbox-group label {'
                + 'font-size: .7rem ; margin: -.04rem 0 0px .3rem ;'
                + `color: ${ scheme == 'dark' ? '#e1e1e1' : '#1e1e1e' }}`
            + '.chatgpt-modal input[type="checkbox"] { transform: scale(0.7) ;'
                + `border: 1px solid ${ scheme == 'dark' ? 'white' : 'black' }}`
            + '.chatgpt-modal input[type="checkbox"]:checked {'
                + `border: 1px solid ${ scheme == 'dark' ? 'white' : 'black' } ;`
                + 'background-color: black ; position: inherit }'
            + '.chatgpt-modal input[type="checkbox"]:focus { outline: none ; box-shadow: none }'
        )

        // Insert text into elements
        modalTitle.innerText = config.appSymbol + ' ' + title || ''
        modalMessage.innerText = msg || '' ; renderHTML(modalMessage)

        // Create/append buttons (if provided) to buttons div
        const modalButtons = document.createElement('div')
        modalButtons.classList.add('modal-buttons')
        if (btns) { // are supplied
            if (!Array.isArray(btns)) btns = [btns] // convert single button to array if necessary
            btns.forEach((buttonFn) => { // create title-cased labels + attach listeners
                const button = document.createElement('button')
                button.textContent = buttonFn.name
                    .replace(/[_-]\w/g, match => match.slice(1).toUpperCase()) // convert snake/kebab to camel case
                    .replace(/([A-Z])/g, ' $1') // insert spaces
                    .replace(/^\w/, firstChar => firstChar.toUpperCase()) // capitalize first letter
                button.addEventListener('click', () => { destroyAlert() ; buttonFn() })
                modalButtons.insertBefore(button, modalButtons.firstChild) // insert button to left
            });
        }

        // Create/append OK/dismiss button to buttons div
        const dismissBtn = document.createElement('button')
        dismissBtn.textContent = btns ? 'Dismiss' : 'OK'
        dismissBtn.addEventListener('click', destroyAlert)
        modalButtons.insertBefore(dismissBtn, modalButtons.firstChild)

        // Highlight primary button
        modalButtons.lastChild.classList.add('primary-modal-btn')

        // Create/append checkbox (if provided) to checkbox group div
        const checkboxDiv = document.createElement('div')
        if (checkbox) { // is supplied
            checkboxDiv.classList.add('checkbox-group')
            const checkboxFn = checkbox // assign the named function to checkboxFn
            const checkboxInput = document.createElement('input')
            checkboxInput.type = 'checkbox'
            checkboxInput.addEventListener('change', checkboxFn)

            // Create/show label
            const checkboxLabel = document.createElement('label')
            checkboxLabel.addEventListener('click', function() {
                checkboxInput.checked = !checkboxInput.checked ; checkboxFn() })
            checkboxLabel.textContent = checkboxFn.name.charAt(0).toUpperCase() // capitalize first char
                + checkboxFn.name.slice(1) // format remaining chars
                    .replace(/([A-Z])/g, (match, letter) => ' ' + letter.toLowerCase()) // insert spaces, convert to lowercase
                    .replace(/\b(\w+)nt\b/gi, '$1n\'t') // insert apostrophe in 'nt' suffixes
                    .trim() // trim leading/trailing spaces

            checkboxDiv.appendChild(checkboxInput) ; checkboxDiv.appendChild(checkboxLabel)
        }

        // Assemble/append div
        const elements = [modalTitle, modalMessage, modalButtons, checkboxDiv]
        elements.forEach((element) => { modal.appendChild(element); })
        modalContainer.appendChild(modal) ; document.body.appendChild(modalContainer);

        // Enqueue alert
        alertQueue = JSON.parse(localStorage.alertQueue)
        alertQueue.push(modalContainer.id)
        localStorage.alertQueue = JSON.stringify(alertQueue)

        // Add listeners
        document.addEventListener('keydown', keyHandler)
        modalContainer.addEventListener('click', (event) => {
            if (event.target === modalContainer) destroyAlert() })

        // Show alert if none active
        modalContainer.style.display = (alertQueue.length === 1) ? '' : 'none'

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
                setTimeout(() => { nextAlert.style.display = 'flex' }, 500 )
            }
        }

        function keyHandler(event) {
            const dismissKeys = [13, 27] // enter/esc
            if (dismissKeys.includes(event.keyCode)) {
                for (const alertId of alertQueue) { // look to handle only if triggering alert is active
                    const alert = document.getElementById(alertId)
                    if (alert && alert.style.display !== 'none') { // active alert found
                        if (event.keyCode === 27) destroyAlert() // if esc pressed, dismiss alert & do nothing
                        else if (event.keyCode === 13) { // else if enter pressed
                            const mainButton = alert.querySelector('.modal-buttons').lastChild // look for main button
                            if (mainButton) { mainButton.click() ; event.preventDefault() } // click if found
                        } return
        }}}}

        return modalContainer.id
    }

    function renderHTML(node) {
        const reTags = /<([a-z\d]+)\b([^>]*)>([\s\S]*?)<\/\1>/g
        const reAttributes = /(\S+)=['"]?((?:.(?!['"]?\s+(?:\S+)=|[>']))+.)['"]?/g
        const nodeContent = node.childNodes

        // Preserve consecutive spaces + line breaks
        if (!renderHTML.preWrapSet) {
            node.style.whiteSpace = 'pre-wrap' ; renderHTML.preWrapSet = true
            setTimeout(() => { renderHTML.preWrapSet = false }, 100)
        }

        // Process child nodes
        for (const childNode of nodeContent) {

            // Process text node
            if (childNode.nodeType === Node.TEXT_NODE) {
                const text = childNode.nodeValue
                const elems = Array.from(text.matchAll(reTags))

                // Process 1st element to render
                if (elems.length > 0) {
                    const elem = elems[0]
                    const [tagContent, tagName, tagAttributes, tagText] = elem.slice(0, 4)
                    const tagNode = document.createElement(tagName) ; tagNode.textContent = tagText

                    // Extract/set attributes
                    const attributes = Array.from(tagAttributes.matchAll(reAttributes))
                    attributes.forEach(attribute => {
                        const name = attribute[1], value = attribute[2].replace(/['"]/g, '')
                        tagNode.setAttribute(name, value)
                    })

                    const renderedNode = renderHTML(tagNode) // render child elements of newly created node

                    // Insert newly rendered node
                    const beforeTextNode = document.createTextNode(text.substring(0, elem.index))
                    const afterTextNode = document.createTextNode(text.substring(elem.index + tagContent.length))

                    // Replace text node with processed nodes
                    node.replaceChild(beforeTextNode, childNode)
                    node.insertBefore(renderedNode, beforeTextNode.nextSibling)
                    node.insertBefore(afterTextNode, renderedNode.nextSibling)
                }

            // Process element nodes recursively
            } else if (childNode.nodeType === Node.ELEMENT_NODE) renderHTML(childNode)
        }

        return node // if assignment used
    }

})()
