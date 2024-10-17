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
// @version             2024.10.17.15
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
        scriptManager: (() => { try { return GM_info.scriptHandler } catch (err) { return 'unknown' } })()
    }
    const xhr = env.scriptManager == 'OrangeMonkey' ? GM_xmlhttpRequest : GM.xmlHttpRequest

    // Init alert QUEUE
    var alertQueue = []; localStorage.alertQueue = JSON.stringify(alertQueue)

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
        .replace(/(\d+)-?([a-zA-Z-]*)$/, (_, id, name) => `${id}/${name || 'script'}.meta.js`)

    // Define SCRIPT functions

    function safeWinOpen(url) { open(url, '_blank', 'noopener') } // to prevent backdoor vulnerabilities

    function updateCheck() {

        // Fetch latest meta
        const currentVer = GM_info.script.version
        xhr({
            method: 'GET', url: app.urls.update + '?t=' + Date.now(),
            headers: { 'Cache-Control': 'no-cache' },
            onload: response => {
                const latestVer = /@version +(.*)/.exec(response.responseText)[1]

                // Compare versions                
                for (let i = 0; i < 4; i++) { // loop thru subver's
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
                                ).onclose = () => location.reload()
                            },
                            '', 383 // width
                        )
                        return
                    }
                }

                alert('Up to date!', `${app.name} (v${currentVer}) is up-to-date!`)
            }
        })
    }

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
            + `background-color: ${ui.scheme == 'dark' ? 'black' : 'white'} ;`
            + (width ? `width: ${width}px` : 'max-width: 458px ') + ' ;'
            + 'padding: 20px ; margin: 12px 23px ; border-radius: 5px ; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3) }'
            + '.chatgpt-modal h2 { font-size: 2em ; margin-bottom: 9px }'
            + '.chatgpt-modal p { font-size: 1.35em }'
            + `.chatgpt-modal a { color: ${ui.scheme == 'dark' ? '#00cfff' : '#1e9ebb'}}`
            + '.chatgpt-modal.animated > div { opacity: 1 ; transform: translateX(0) translateY(0) }'

            // Button styles
            + '.modal-buttons { display: flex ; justify-content: flex-end ; margin: 20px -5px -3px 0 }'
            + '.chatgpt-modal button {'
            + 'margin-left: 10px ; padding: 4px 12px ; border-radius: 6px ;'
            + `border: 1px solid ${ui.scheme == 'dark' ? 'white' : '#979797'}}`
            + '.primary-modal-btn {'
            + `border: 1px solid ${ui.scheme == 'dark' ? 'white' : '#979797'} ;`
            + `background: ${ui.scheme == 'dark' ? 'white' : 'black'} ;`
            + `color: ${ui.scheme == 'dark' ? 'black' : 'white'}}`
            + '.chatgpt-modal button:hover { background-color: #42B4BF ; border-color: #42B4BF ; color: black }'

            /* Checkbox styles */
            + '.chatgpt-modal .checkbox-group { display: flex ; margin-top: -18px }'
            + '.chatgpt-modal .checkbox-group label {'
            + 'font-size: .7rem ; margin: -.04rem 0 0px .3rem ;'
            + `color: ${ui.scheme == 'dark' ? '#e1e1e1' : '#1e1e1e'}}`
            + '.chatgpt-modal input[type="checkbox"] { transform: scale(0.7) ;'
            + `border: 1px solid ${ui.scheme == 'dark' ? 'white' : 'black'}}`
            + '.chatgpt-modal input[type="checkbox"]:checked {'
            + `border: 1px solid ${ui.scheme == 'dark' ? 'white' : 'black'} ;`
            + 'background-color: black ; position: inherit }'
            + '.chatgpt-modal input[type="checkbox"]:focus { outline: none ; box-shadow: none }'
        )

        // Insert text into elements
        modalTitle.innerText = app.symbol + ' ' + title || ''
        modalMessage.innerText = msg || ''; renderHTML(modalMessage)

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
                button.onclick = () => { destroyAlert(); buttonFn() }
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
                checkboxInput.checked = !checkboxInput.checked; checkboxFn()
            }
            checkboxLabel.textContent = checkboxFn.name.charAt(0).toUpperCase() // capitalize first char
                + checkboxFn.name.slice(1) // format remaining chars
                    .replace(/([A-Z])/g, (match, letter) => ' ' + letter.toLowerCase()) // insert spaces, convert to lowercase
                    .replace(/\b(\w+)nt\b/gi, '$1n\'t') // insert apostrophe in 'nt' suffixes
                    .trim() // trim leading/trailing spaces

            checkboxDiv.append(checkboxInput); checkboxDiv.append(checkboxLabel)
        }

        // Assemble/append div
        const elements = [modalTitle, modalMessage, modalButtons, checkboxDiv]
        elements.forEach(elem => { modal.append(elem) })
        modalContainer.append(modal); document.body.append(modalContainer)

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
                }, 500)
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
                            if (mainButton) { mainButton.click(); event.preventDefault() } // click if found
                        } return
                    }
                }
            }
        }

        return modalContainer.id
    }

    function renderHTML(node) {
        const reTags = /<([a-z\d]+)\b([^>]*)>([\s\S]*?)<\/\1>/g,
            reAttributes = /(\S+)=['"]?((?:.(?!['"]?\s+(?:\S+)=|[>']))+.)['"]?/g,
            nodeContent = node.childNodes

        // Preserve consecutive spaces + line breaks
        if (!renderHTML.preWrapSet) {
            node.style.whiteSpace = 'pre-wrap'; renderHTML.preWrapSet = true
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
                        tagNode = document.createElement(tagName); tagNode.textContent = tagText

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
                + `${user}/${repo}&type=Date` + (isDarkMode() ? '&theme=dark' : ''))
            const response = await new Promise((resolve, reject) => xhr({
                method: 'GET', url: imgURL, responseType: 'blob', onload: resolve, onerror: reject
            }))
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
                starHistoryImg.style.width = '100%'; starHistoryImg.style.padding = '20px 0'
                starHistoryImg.src = imgDataURL

                // Create #star-history div, add attrs/img/listener
                const starHistoryDiv = document.createElement('div')
                starHistoryDiv.id = 'star-history'; starHistoryDiv.style.cursor = 'crosshair'
                starHistoryDiv.append(starHistoryImg)
                starHistoryDiv.onclick = () => zoomStarHistory(imgDataURL)

                // Insert div
                const aboutSection = document.querySelector('[class$="sidebar"] > div > div')
                aboutSection.insertAdjacentElement('afterend', starHistoryDiv)
                //移动设备添加顶部按钮
                insertBtn(imgDataURL)
            }

        } catch (err) { console.error('>> Error loading star history chart:', err) }
    }
    function insertBtn(imgDataURL) {
        const el = document.querySelector('#responsive-meta-container .d-flex.gap-2.mt-n3.mb-3.flex-wrap')
        if (!el) return
        if (document.getElementById('zoomStarHistory')) return
        const svgStr = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="16px" height="16px" viewBox="0 0 64 64" style="shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd" xmlns:xlink="http://www.w3.org/1999/xlink">
  <g>
    <path style="opacity:0.76" fill="#05ca00" d="M 63.5,33.5 C 63.5,34.5 63.5,35.5 63.5,36.5C 58.7514,40.2077 53.4181,42.8743 47.5,44.5C 45.9969,51.0438 43.9969,57.3771 41.5,63.5C 40.1667,63.5 38.8333,63.5 37.5,63.5C 34.1218,60.1239 31.1218,56.4572 28.5,52.5C 28.8966,51.475 29.5632,51.3083 30.5,52C 32.7089,53.8734 34.5422,56.04 36,58.5C 36.5,58 37,57.5 37.5,57C 33.0463,52.5508 29.3796,47.5508 26.5,42C 26.7432,41.0979 27.0766,40.2646 27.5,39.5C 28.7899,40.0577 29.6232,41.0577 30,42.5C 33.2391,40.648 36.7391,39.648 40.5,39.5C 40.6646,36.4816 40.498,33.4816 40,30.5C 37.1383,28.9296 34.3049,27.263 31.5,25.5C 29.8144,26.8569 28.1477,28.1902 26.5,29.5C 25.6236,29.6309 24.9569,29.2975 24.5,28.5C 29.8152,23.1463 29.1486,22.4797 22.5,26.5C 21.8933,26.3764 21.56,26.0431 21.5,25.5C 25.2992,23.6276 25.2992,21.9609 21.5,20.5C 27.6877,20.5267 33.1877,22.86 38,27.5C 38.7504,26.8742 39.5838,26.3742 40.5,26C 35.5908,22.8756 29.5908,19.8756 22.5,17C 21.1175,15.5391 21.4508,14.7058 23.5,14.5C 25.91,15.0629 28.2433,15.5629 30.5,16C 33.7853,11.0463 37.452,6.37966 41.5,2C 45.029,-0.379275 47.529,0.454059 49,4.5C 49.032,11.8717 49.1987,19.2051 49.5,26.5C 54.5427,28.2445 59.2094,30.5778 63.5,33.5 Z M 41.5,12.5 C 42.0967,12.7352 42.4301,13.2352 42.5,14C 41.8148,16.7952 41.3148,19.6285 41,22.5C 39.1839,21.6705 37.3506,20.8372 35.5,20C 37.3336,17.3367 39.3336,14.8367 41.5,12.5 Z M 47.5,33.5 C 51.2965,34.9114 51.2965,35.9114 47.5,36.5C 47.5,35.5 47.5,34.5 47.5,33.5 Z M 34.5,47.5 C 35.8333,47.5 37.1667,47.5 38.5,47.5C 37.5954,53.9632 36.2621,53.9632 34.5,47.5 Z"/>
  </g>
  <g>
    <path style="opacity:0.71" fill="#05ca00" d="M 23.5,14.5 C 21.4508,14.7058 21.1175,15.5391 22.5,17C 29.5908,19.8756 35.5908,22.8756 40.5,26C 39.5838,26.3742 38.7504,26.8742 38,27.5C 33.1877,22.86 27.6877,20.5267 21.5,20.5C 19.2965,19.0538 16.9631,18.2204 14.5,18C 15.8554,21.2118 17.3554,24.3785 19,27.5C 19.7083,26.6195 20.5416,25.9528 21.5,25.5C 21.56,26.0431 21.8933,26.3764 22.5,26.5C 29.1486,22.4797 29.8152,23.1463 24.5,28.5C 24.9569,29.2975 25.6236,29.6309 26.5,29.5C 25.1999,30.8267 23.8665,32.16 22.5,33.5C 24.1897,35.5193 25.8564,37.5193 27.5,39.5C 27.0766,40.2646 26.7432,41.0979 26.5,42C 29.3796,47.5508 33.0463,52.5508 37.5,57C 37,57.5 36.5,58 36,58.5C 34.5422,56.04 32.7089,53.8734 30.5,52C 29.5632,51.3083 28.8966,51.475 28.5,52.5C 27.7387,51.6091 26.7387,50.9424 25.5,50.5C 18.553,51.9205 11.553,52.4205 4.5,52C 3.19551,51.196 2.52884,50.0293 2.5,48.5C 6.30907,43.5097 9.97574,38.3431 13.5,33C 11.5293,28.892 9.69592,24.7253 8,20.5C 7.33333,16.8333 7.33333,13.1667 8,9.5C 8.73869,8.42575 9.73869,7.75908 11,7.5C 15.8157,8.84699 19.9824,11.1803 23.5,14.5 Z M 21.5,20.5 C 25.2992,21.9609 25.2992,23.6276 21.5,25.5C 20.5416,25.9528 19.7083,26.6195 19,27.5C 17.3554,24.3785 15.8554,21.2118 14.5,18C 16.9631,18.2204 19.2965,19.0538 21.5,20.5 Z M 25,42 C 25.8297,40.5295 26.9956,38.2066 28.5,36C 27.5056,34.7603 26.0778,33.6204 25,32.5C 23.4918,34.4059 21.4906,36.6554 20,38.5C 18.9282,37.2717 18.25,35.8398 18,34.5C 17.25,35.75 16.1667,37.1667 15,38C 14.5,38.5 14.5,39.5 15,40C 16.9993,40.6089 19.1075,39.5245 21,38C 21.6706,39.5368 22.0079,41.0933 22.5,42.5C 21.4079,43.9192 21.5,45.5684 22.5,47C 22.5,46 22.5,45 23,44C 23.5295,43.3543 24.5,43 25,42 Z"/>
  </g>
</svg>
`
        const title = 'Star History'
        const buttonHtml = `<button id="zoomStarHistory" data-show-dialog-id="repo-delete-menu-dialog" type="button"
data-view-component="true"
class="btn btn-sm tooltipped tooltipped-s">
<span class="Button-content">
    <span class="Button-label tooltipped tooltipped-s"  aria-label="${title}">${svgStr}</span>
</span>
</button>`
        el.insertAdjacentHTML('afterbegin', buttonHtml)
        const button = document.getElementById('zoomStarHistory')
        button.addEventListener('click', () => zoomStarHistory(imgDataURL))
    }
    function zoomStarHistory(imgURL) {
        const { user, repo } = getUserAndRepoOfCurrentPage()

        // Create/stylize overlay
        const overlay = document.createElement('div')
        overlay.style.position = 'fixed'; overlay.style.top = '0'; overlay.style.left = '0'
        overlay.style.width = '100%'; overlay.style.height = '100%'
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)'; overlay.style.display = 'flex'
        overlay.style.alignItems = 'center'; overlay.style.justifyContent = 'center'
        overlay.style.zIndex = '9999'

        // Stylize zoomed img
        const zoomedImg = new Image()
        zoomedImg.title = 'View on star-history.com'; zoomedImg.src = imgURL
        zoomedImg.style.maxWidth = '90%'; zoomedImg.style.maxHeight = '90%'
        zoomedImg.style.cursor = 'pointer'

        // Add listeners
        zoomedImg.onclick = () => // view on star-history.com
            safeWinOpen(`https://star-history.com/#${user}/${repo}&Date`)
        overlay.onclick = () => document.body.removeChild(overlay)

        // Append elements
        overlay.append(zoomedImg); document.body.append(overlay)
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
            + `<span style="${pStyle}">${GM_info.script.version}</span>\n`
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
            if (location.href != prevURL) { prevURL = location.href; starHistoryAdded = false }
            if (onRepoPage && !starHistoryAdded) { insertStarHistory(); starHistoryAdded = true }
        }
    })).observe(document.documentElement, { childList: true, subtree: true })

})()
