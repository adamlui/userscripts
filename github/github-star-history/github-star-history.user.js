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
// @version             2025.9.6.1
// @license             MIT
// @icon                data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%2248%22%20height=%2248%22%20viewBox=%220%200%2048%2048%22%3E%3Cstyle%3E:root%7B--fill:%23000%7D@media%20(prefers-color-scheme:dark)%7B:root%7B--fill:%23fff%7D%7D%3C/style%3E%3Cpath%20fill=%22var(--fill)%22%20d=%22M24%201.9a21.6%2021.6%200%200%200-6.8%2042.2c1%20.2%201.8-.9%201.8-1.8v-2.9c-6%201.3-7.9-2.9-7.9-2.9a6.5%206.5%200%200%200-2.2-3.2c-2-1.4.1-1.3.1-1.3a4.3%204.3%200%200%201%203.3%202c1.7%202.9%205.5%202.6%206.7%202.1a5.4%205.4%200%200%201%20.5-2.9C12.7%2032%209%2028%209%2022.6a10.7%2010.7%200%200%201%202.9-7.6%206.2%206.2%200%200%201%20.3-6.4%208.9%208.9%200%200%201%206.4%202.9%2015.1%2015.1%200%200%201%205.4-.8%2017.1%2017.1%200%200%201%205.4.7%209%209%200%200%201%206.4-2.8%206.5%206.5%200%200%201%20.4%206.4%2010.7%2010.7%200%200%201%202.8%207.6c0%205.4-3.7%209.4-10.5%2010.6a5.4%205.4%200%200%201%20.5%202.9v6.2a1.8%201.8%200%200%200%201.9%201.8A21.7%2021.7%200%200%200%2024%201.9Z%22/%3E%3C/svg%3E
// @icon64              data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%2264%22%20height=%2264%22%20viewBox=%220%200%2048%2048%22%3E%3Cstyle%3E:root%7B--fill:%23000%7D@media%20(prefers-color-scheme:dark)%7B:root%7B--fill:%23fff%7D%7D%3C/style%3E%3Cpath%20fill=%22var(--fill)%22%20d=%22M24%201.9a21.6%2021.6%200%200%200-6.8%2042.2c1%20.2%201.8-.9%201.8-1.8v-2.9c-6%201.3-7.9-2.9-7.9-2.9a6.5%206.5%200%200%200-2.2-3.2c-2-1.4.1-1.3.1-1.3a4.3%204.3%200%200%201%203.3%202c1.7%202.9%205.5%202.6%206.7%202.1a5.4%205.4%200%200%201%20.5-2.9C12.7%2032%209%2028%209%2022.6a10.7%2010.7%200%200%201%202.9-7.6%206.2%206.2%200%200%201%20.3-6.4%208.9%208.9%200%200%201%206.4%202.9%2015.1%2015.1%200%200%201%205.4-.8%2017.1%2017.1%200%200%201%205.4.7%209%209%200%200%201%206.4-2.8%206.5%206.5%200%200%201%20.4%206.4%2010.7%2010.7%200%200%201%202.8%207.6c0%205.4-3.7%209.4-10.5%2010.6a5.4%205.4%200%200%201%20.5%202.9v6.2a1.8%201.8%200%200%200%201.9%201.8A21.7%2021.7%200%200%200%2024%201.9Z%22/%3E%3C/svg%3E
// @compatible          chrome
// @compatible          firefox
// @compatible          edge
// @compatible          brave
// @match               *://github.com/*
// @connect             api.star-history.com
// @connect             cdn.jsdelivr.net
// @connect             raw.githubusercontent.com
// @require             https://cdn.jsdelivr.net/gh/adamlui/ai-web-extensions@7595cd7/assets/js/lib/dom.js/dist/dom.min.js#sha256-xovdxRnmYD/eCgBiGCu5+Vd3+WWIvLUKVtU/MnRueeU=
// @resource rpgCSS     https://cdn.jsdelivr.net/gh/adamlui/ai-web-extensions@727feff/assets/styles/rising-particles/dist/gray.min.css#sha256-48sEWzNUGUOP04ur52G5VOfGZPSnZQfrF3szUr4VaRs=
// @resource rpwCSS     https://cdn.jsdelivr.net/gh/adamlui/ai-web-extensions@727feff/assets/styles/rising-particles/dist/white.min.css#sha256-6xBXczm7yM1MZ/v0o1KVFfJGehHk47KJjq8oTktH4KE=
// @grant               GM_getResourceText
// @grant               GM_openInTab
// @grant               GM_registerMenuCommand
// @grant               GM_xmlhttpRequest
// @grant               GM.xmlHttpRequest
// @downloadURL         https://raw.githubusercontent.com/adamlui/github-star-history/main/greasemonkey/github-star-history.user.js
// @updateURL           https://raw.githubusercontent.com/adamlui/github-star-history/main/greasemonkey/github-star-history.user.js
// @homepageURL         https://github.com/adamlui/github-star-history
// @supportURL          https://github.com/adamlui/github-star-history/issues
// @contributionURL     https://github.com/sponsors/adamlui
// ==/UserScript==

(async () => {

    localStorage.alertQueue = '[]' ; window.config = { bgAnimationsDisabled: false }

    // Init ENV context
    window.env = {
        browser: {
            isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) },
        ui: { scheme: isDarkMode() ? 'dark' : 'light' }
    }
    env.browser.isPhone = env.browser.isMobile && ( window.innerWidth <= 480 )
    const xhr = typeof GM != 'undefined' && GM.xmlHttpRequest || GM_xmlhttpRequest

    // Init APP info
    const app = {
        latestResourceCommitHash: '27cf60e',
        urls: { update: 'https://raw.githubusercontent.com/adamlui/github-star-history/main/greasemonkey/github-star-history.user.js' }
    }
    app.urls.resourceHost = `https://cdn.jsdelivr.net/gh/adamlui/github-star-history@${app.latestResourceCommitHash}`
    const remoteAppData = await new Promise(resolve => xhr({
        method: 'GET', url: `${app.urls.resourceHost}/assets/data/app.json`,
        onload: resp => resolve(JSON.parse(resp.responseText))
    }))
    Object.assign(app, { ...remoteAppData, urls: { ...app.urls, ...remoteAppData.urls }})

    // Define SCRIPT functions

    function ghAlert(title, msg, btns, checkbox, width) {
    // [ title/msg = strings, btns = [named functions], checkbox = named function, width (px) = int ] = optional
    // * Spaces are inserted into button labels by parsing function names in camel/kebab/snake case

        // Init env context
        const scheme = env.ui.scheme,
              isMobile = env.browser.isMobile

        // Define event handlers
        const handlers = {

            dismiss: {
                click(event) {
                    if (event.target == event.currentTarget || event.target.closest('[class*=-close-btn]'))
                        dismissAlert()
                },

                key(event) {
                    if (!/^(?: |Space|Enter|Return|Esc)/.test(event.key) || ![32, 13, 27].includes(event.keyCode))
                        return
                    for (const alertId of alertQueue) { // look to handle only if triggering alert is active
                        const alert = document.getElementById(alertId)
                        if (!alert || alert.style.display == 'none') return
                        if (event.key.startsWith('Esc') || event.keyCode == 27) dismissAlert() // and do nothing
                        else { // Space/Enter pressed
                            const mainBtn = alert.querySelector('.modal-buttons').lastChild // look for main button
                            if (mainBtn) { mainBtn.click() ; event.preventDefault() } // click if found
                        }
                    }
                }
            },

            drag: {
                mousedown(event) { // find modal, update styles, attach listeners, init XY offsets
                    if (event.button != 0) return // prevent non-left-click drag
                    if (!/auto|default/.test(getComputedStyle(event.target).cursor))
                        return // prevent drag on interactive elems
                    env.draggingModal = event.currentTarget
                    event.preventDefault() // prevent sub-elems like icons being draggable
                    Object.assign(env.draggingModal.style, {
                        transition: '0.1s', willChange: 'transform', transform: 'scale(1.05)' })
                    document.body.style.cursor = 'grabbing' // update cursor
                    ;[...env.draggingModal.children] // prevent hover FX if drag lags behind cursor
                        .forEach(child => child.style.pointerEvents = 'none')
                    ;['mousemove', 'mouseup'].forEach(eventType => // add listeners
                        document.addEventListener(eventType, handlers.drag[eventType]))
                    const draggingModalRect = env.draggingModal.getBoundingClientRect()
                    handlers.drag.offsetX = event.clientX - draggingModalRect.left +21
                    handlers.drag.offsetY = event.clientY - draggingModalRect.top +12
                },

                mousemove(event) { // drag modal
                    if (!env.draggingModal) return
                    const newX = event.clientX - handlers.drag.offsetX,
                          newY = event.clientY - handlers.drag.offsetY
                    Object.assign(env.draggingModal.style, { left: `${newX}px`, top: `${newY}px` })
                },

                mouseup() { // restore styles/pointer events, remove listeners, reset env.draggingModal
                    Object.assign(env.draggingModal.style, { // restore styles
                        cursor: 'inherit', transition: 'inherit', willChange: 'auto', transform: 'scale(1)' })
                    document.body.style.cursor = '' // restore cursor
                    ;[...env.draggingModal.children] // restore pointer events
                        .forEach(child => child.style.pointerEvents = '')
                    ;['mousemove', 'mouseup'].forEach(eventType => // remove listeners
                        document.removeEventListener(eventType, handlers.drag[eventType]))
                    env.draggingModal = null
                }
            }
        }

        // Create modal parent/children elems
        const modalContainer = document.createElement('div')
        modalContainer.id = Math.floor(randomFloat() * 1000000) + Date.now()
        modalContainer.classList.add('chatgpt-modal') // add class to main div
        const modal = document.createElement('div'),
              modalTitle = document.createElement('h2'),
              modalMessage = document.createElement('p')

        // Create/append/update modal style (if missing or outdated)
        const thisUpdated = 1739338889852 // timestamp of last edit for this file's `modalStyle`
        let modalStyle = document.querySelector('#chatgpt-modal-style') // try to select existing style
        if (!modalStyle || parseInt(modalStyle.getAttribute('last-updated'), 10) < thisUpdated) { // if missing or outdated
            if (!modalStyle) { // outright missing, create/id/attr/append it first
                modalStyle = document.createElement('style') ; modalStyle.id = 'chatgpt-modal-style'
                modalStyle.setAttribute('last-updated', thisUpdated.toString())
                document.head.append(modalStyle)
            }
            modalStyle.textContent = ( // update prev/new style contents
                `.chatgpt-modal { /* vars */
                    --transition: opacity 0.65s cubic-bezier(.165,.84,.44,1), /* for fade-in */
                                  transform 0.55s cubic-bezier(.165,.84,.44,1) ; /* for move-in */
                    --bg-transition: background-color 0.25s ease ; /* for bg dim */
                    --btn-transition: transform 0.1s ease-in-out, box-shadow 0.1s ease-in-out ; /* for smooth zoom */
                    --btn-shadow: 2px 1px ${ scheme == 'dark' ? '54px #00cfff' : '30px #9cdaff' }}`

                + '.no-mobile-tap-outline { outline: none ; -webkit-tap-highlight-color: transparent }'

                // Background styles
                + `.chatgpt-modal {
                      pointer-events: auto ; /* override any disabling from site modals (like guest login spam) */
                      position: fixed ; top: 0 ; left: 0 ; width: 100% ; height: 100% ; /* expand to full view-port */
                      display: flex ; justify-content: center ; align-items: center ; z-index: 9999 ; /* align */
                      transition: var(--bg-transition) ; /* for bg dim */
                         -webkit-transition: var(--bg-transition) ; -moz-transition: var(--bg-transition) ;
                         -o-transition: var(--bg-transition) ; -ms-transition: var(--bg-transition) }`

                // Alert styles
                + `.chatgpt-modal > div {
                      position: absolute ; /* to be click-draggable */
                      opacity: 0 ; /* to fade-in */
                      font-family: -apple-system, system-ui, BlinkMacSystemFont, Segoe UI, Roboto,
                                   Oxygen-Sans, Ubuntu, Cantarell, Helvetica Neue, sans-serif ;
                      padding: 20px ; margin: 12px 23px ; font-size: 20px ;
                      color: ${ scheme == 'dark' ? 'white' : 'black' };
                      background-image: linear-gradient(180deg, ${
                          scheme == 'dark' ? '#99a8a6 -200px, black 200px' : '#b6ebff -296px, white 171px' }) ;
                      border: 1px solid ${ scheme == 'dark' ? 'white' : '#b5b5b5' };
                      transform: translateX(-3px) translateY(7px) ; /* offset to move-in from */
                      max-width: 75vw ; word-wrap: break-word ; border-radius: 15px ;
                    --shadow: 0 30px 60px rgba(0,0,0,0.12) ; box-shadow: var(--shadow) ;
                         -webkit-box-shadow: var(--shadow) ; -moz-box-shadow: var(--shadow) ;
                      user-select: none ; -webkit-user-select: none ; -moz-user-select: none ;
                         -o-user-select: none ; -ms-user-select: none ;
                      transition: var(--transition) ; /* for fade-in + move-in */
                         -webkit-transition: var(--transition) ; -moz-transition: var(--transition) ;
                         -o-transition: var(--transition) ; -ms-transition: var(--transition) }
                  .chatgpt-modal h2 {
                      text-align: center ; font-weight: bold ; font-size: 44px ;
                      line-height: 46px ; margin: 0 0 14px 15px }
                  .chatgpt-modal p { text-align: center ; font-size: 16px ; line-height: 28px }
                  .chatgpt-modal a { color: ${ scheme == 'dark' ? '#00cfff' : '#1e9ebb' }}
                  .chatgpt-modal a:hover { text-decoration: underline }
                  .chatgpt-modal.animated > div {
                      z-index: 13456 ; opacity: 0.98 ; transform: translateX(0) translateY(0) }
                  @keyframes alert-zoom-fade-out {
                      0% { opacity: 1 } 50% { opacity: 0.25 ; transform: scale(1.05) }
                      100% { opacity: 0 ; transform: scale(1.35) }}`

                // Button styles
                + `.modal-buttons {
                        display: flex ; justify-content: flex-end ; margin: 20px -5px -3px 0 ;
                        ${ isMobile ? 'flex-direction: column-reverse' : '' }}
                  .chatgpt-modal button {
                      font-size: 14px ; text-transform: uppercase ; cursor: crosshair ;
                      margin-left: ${ isMobile ? 0 : 10 }px ; padding: ${ isMobile ? 15 : 8 }px 18px ;
                      ${ isMobile ? 'margin-top: 5px ; margin-bottom: 3px ;' : '' }
                      border-radius: 0 ; border: 1px solid ${ scheme == 'dark' ? 'white' : 'black' };
                      transition: var(--btn-transition) ;
                         -webkit-transition: var(--btn-transition) ; -moz-transition: var(--btn-transition) ;
                         -o-transition: var(--btn-transition) ; -ms-transition: var(--btn-transition) }
                  .chatgpt-modal button:hover {
                      transform: scale(1.055) ; color: black ;
                      background-color: #${ scheme == 'dark' ? '00cfff' : '9cdaff' };
                      box-shadow: var(--btn-shadow) ;
                          -webkit-box-shadow: var(--btn-shadow) ; -moz-box-shadow: var(--btn-shadow) }
                  .primary-modal-btn {
                      border: 1px solid ${ scheme == 'dark' ? 'white' : 'black' };
                      background: ${ scheme == 'dark' ? 'white' : 'black' };
                      color: ${ scheme == 'dark' ? 'black' : 'white' }}
                  .modal-close-btn {
                      cursor: pointer ; width: 29px ; height: 29px ; border-radius: 17px ;
                      float: right ; position: relative ; right: -6px ; top: -5px }
                  .modal-close-btn svg { margin: 10px } /* center SVG for hover underlay */
                  .modal-close-btn:hover { background-color: #f2f2f2${ scheme == 'dark' ? '00' : '' }}`

                // Checkbox styles
                + `.chatgpt-modal .checkbox-group { margin: 5px 0 -8px 5px }
                  .chatgpt-modal input[type=checkbox] {
                      cursor: pointer ; transform: scale(0.7) ; margin-right: 5px ;
                      border: 1px solid ${ scheme == 'dark' ? 'white' : 'black' }}
                  .chatgpt-modal input[type=checkbox]:checked {
                      background-color: black ; position: inherit ;
                      border: 1px solid ${ scheme == 'dark' ? 'white' : 'black' }}
                  .chatgpt-modal input[type=checkbox]:focus {
                      outline: none ; box-shadow: none ; -webkit-box-shadow: none ; -moz-box-shadow: none }
                  .chatgpt-modal .checkbox-group label {
                      cursor: pointer ; font-size: 14px ; color: ${ scheme == 'dark' ? '#e1e1e1' : '#1e1e1e' }}`
            )
        }

        // Insert text into elems
        modalTitle.textContent = title || '' ; modalMessage.innerText = msg || '' ; renderHTML(modalMessage)

        // Create/append buttons (if provided) to buttons div
        const modalButtons = document.createElement('div')
        modalButtons.classList.add('modal-buttons', 'no-mobile-tap-outline')
        if (btns) { // are supplied
            if (!Array.isArray(btns)) btns = [btns] // convert single button to array if necessary
            btns.forEach((buttonFn) => { // create title-cased labels + attach listeners
                const button = document.createElement('button')
                button.textContent = buttonFn.name
                    .replace(/[_-]\w/g, match => match.slice(1).toUpperCase()) // convert snake/kebab to camel case
                    .replace(/([A-Z])/g, ' $1') // insert spaces
                    .replace(/^\w/, firstChar => firstChar.toUpperCase()) // capitalize first letter
                button.onclick = () => { dismissAlert() ; buttonFn() }
                modalButtons.insertBefore(button, modalButtons.firstChild)
            })
        }

        // Create/append OK/dismiss button to buttons div
        const dismissBtn = document.createElement('button')
        dismissBtn.textContent = btns ? 'Dismiss' : 'OK'
        modalButtons.insertBefore(dismissBtn, modalButtons.firstChild)

        // Highlight primary button
        modalButtons.lastChild.classList.add('primary-modal-btn')

        // Create/append checkbox (if provided) to checkbox group div
        const checkboxDiv = document.createElement('div')
        if (checkbox) { // is supplied
            checkboxDiv.classList.add('checkbox-group')
            const checkboxFn = checkbox, // assign the named function to checkboxFn
                  checkboxInput = document.createElement('input')
            checkboxInput.type = 'checkbox' ; checkboxInput.onchange = checkboxFn

            // Create/show label
            const checkboxLabel = document.createElement('label')
            checkboxLabel.onclick = () => { checkboxInput.checked = !checkboxInput.checked ; checkboxFn() }
            checkboxLabel.textContent = checkboxFn.name[0].toUpperCase() // capitalize first char
                + checkboxFn.name.slice(1) // format remaining chars
                    .replace(/([A-Z])/g, (match, letter) => ' ' + letter.toLowerCase()) // insert spaces, convert to lowercase
                    .replace(/\b(\w+)nt\b/gi, '$1n\'t') // insert apostrophe in 'nt' suffixes
                    .trim() // trim leading/trailing spaces

            checkboxDiv.append(checkboxInput) ; checkboxDiv.append(checkboxLabel)
        }

        // Create close button
        const closeBtn = document.createElement('div')
        closeBtn.title = 'Close' ; closeBtn.classList.add('modal-close-btn', 'no-mobile-tap-outline')
        const closeSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
        closeSVG.setAttribute('height', '10px')
        closeSVG.setAttribute('viewBox', '0 0 14 14')
        closeSVG.setAttribute('fill', 'none')
        const closeSVGpath = document.createElementNS('http://www.w3.org/2000/svg', 'path')
        closeSVGpath.setAttribute('fill-rule', 'evenodd')
        closeSVGpath.setAttribute('clip-rule', 'evenodd')
        closeSVGpath.setAttribute('fill', isDarkMode() ? 'white' : 'black')
        closeSVGpath.setAttribute('d', 'M13.7071 1.70711C14.0976 1.31658 14.0976 0.683417 13.7071 0.292893C13.3166 -0.0976312 12.6834 -0.0976312 12.2929 0.292893L7 5.58579L1.70711 0.292893C1.31658 -0.0976312 0.683417 -0.0976312 0.292893 0.292893C-0.0976312 0.683417 -0.0976312 1.31658 0.292893 1.70711L5.58579 7L0.292893 12.2929C-0.0976312 12.6834 -0.0976312 13.3166 0.292893 13.7071C0.683417 14.0976 1.31658 14.0976 1.70711 13.7071L7 8.41421L12.2929 13.7071C12.6834 14.0976 13.3166 14.0976 13.7071 13.7071C14.0976 13.3166 14.0976 12.6834 13.7071 12.2929L8.41421 7L13.7071 1.70711Z')
        closeSVG.append(closeSVGpath) ; closeBtn.append(closeSVG)

        // Assemble/append div
        modal.append(closeBtn, modalTitle, modalMessage, checkboxDiv, modalButtons)
        modal.style.width = `${ width || 458 }px`
        modalContainer.append(modal) ; document.body.append(modalContainer)

        // Enqueue alert
        let alertQueue = JSON.parse(localStorage.alertQueue)
        alertQueue.push(modalContainer.id)
        localStorage.alertQueue = JSON.stringify(alertQueue)

        // Show alert if none active
        modalContainer.style.display = 'none'
        if (alertQueue.length == 1) {
            modalContainer.style.display = ''
            setTimeout(() => { // dim bg
                modal.parentNode.style.backgroundColor = `rgba(67,70,72,${ scheme == 'dark' ? 0.62 : 0.33 })`
                modal.parentNode.classList.add('animated')
            }, 100) // delay for transition fx
        }

        // Add listeners
        [modalContainer, closeBtn, closeSVG, dismissBtn].forEach(elem => elem.onclick = handlers.dismiss.click)
        document.addEventListener('keydown', handlers.dismiss.key)
        modal.onmousedown = handlers.drag.mousedown // enable click-dragging

        // Define alert dismisser
        const dismissAlert = () => {
            modalContainer.style.backgroundColor = 'transparent'
            modal.style.animation = 'alert-zoom-fade-out 0.165s ease-out'
            modal.onanimationend = () => {

                // Remove alert
                modalContainer.remove() // ...from DOM
                alertQueue = JSON.parse(localStorage.alertQueue)
                alertQueue.shift() // + memory
                localStorage.alertQueue = JSON.stringify(alertQueue) // + storage
                document.removeEventListener('keydown', handlers.dismiss.key) // prevent memory leaks

                // Check for pending alerts in queue
                if (alertQueue.length) {
                    const nextAlert = document.getElementById(alertQueue[0])
                    setTimeout(() => {
                        nextAlert.style.display = ''
                        setTimeout(() => nextAlert.classList.add('animated'), 100)
                    }, 500)
                }
            }
        }
        dom.addRisingParticles(modal)

        return modalContainer.id // if assignment used
    }

    function isDarkMode() {
        return document.documentElement.dataset.colorMode == 'dark'
            || document.documentElement.dataset.darkreaderScheme == 'dark'
            || window.matchMedia?.('(prefers-color-scheme: dark)')?.matches
    }

    function randomFloat() {
    // * Generates a random, cryptographically secure value between 0 (inclusive) & 1 (exclusive)
        const crypto = window.crypto || window.msCrypto
        return crypto?.getRandomValues(new Uint32Array(1))[0] / 0xFFFFFFFF || Math.random()
    }

    function renderHTML(node) {
        const reTags = /<([a-z\d]+)\b([^>]*)>([\s\S]*?)<\/\1>/g,
              reAttrs = /(\S+)=['"]?((?:.(?!['"]?\s+\S+=|[>']))+.)['"]?/g, // eslint-disable-line
              nodeContent = node.childNodes

        // Preserve consecutive spaces + line breaks
        if (!renderHTML.preWrapSet) {
            node.style.whiteSpace = 'pre-wrap' ; renderHTML.preWrapSet = true
            setTimeout(() => renderHTML.preWrapSet = false, 100)
        }

        // Process child nodes
        for (const childNode of nodeContent) {

            // Process text node
            if (childNode.nodeType == Node.TEXT_NODE) {
                const text = childNode.nodeValue,
                      elems = [...text.matchAll(reTags)]

                // Process 1st element to render
                if (elems.length) {
                    const elem = elems[0],
                          [tagContent, tagName, tagAttrs, tagText] = elem.slice(0, 4),
                          tagNode = document.createElement(tagName) ; tagNode.textContent = tagText

                    // Extract/set attributes
                    const attrs = [...tagAttrs.matchAll(reAttrs)]
                    attrs.forEach(attr => {
                        const name = attr[1], value = attr[2].replace(/['"]/g, '')
                        tagNode.setAttribute(name, value)
                    })

                    const renderedNode = renderHTML(tagNode) // render child elems of newly created node

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

    function safeWinOpen(url) { open(url, '_blank', 'noopener') } // to prevent backdoor vulnerabilities

    function updateCheck() {

        // Fetch latest meta
        const currentVer = GM_info.script.version
        xhr({
            method: 'GET', url: app.urls.update + '?t=' + Date.now(),
            headers: { 'Cache-Control': 'no-cache' },
            onload: response => { const updateAlertWidth = 377

                // Compare versions
                app.latestVer = /@version +(.*)/.exec(response.responseText)?.[1]
                if (app.latestVer) for (let i = 0 ; i < 4 ; i++) { // loop thru subver's
                    const currentSubVer = parseInt(currentVer.split('.')[i], 10) || 0,
                          latestSubVer = parseInt(app.latestVer.split('.')[i], 10) || 0
                    if (currentSubVer > latestSubVer) break // out of comparison since not outdated
                    else if (latestSubVer > currentSubVer) { // if outdated

                        // Alert to update
                        ghAlert('🚀 Update available!', // title
                            `A newer version of ${app.name} v${app.latestVer} is available!  `
                                + '<a target="_blank" rel="noopener" style="font-size: 0.9rem" href="'
                                    + `${app.urls.gitHub}/commits/main/greasemonkey/${app.slug}.user.js`
                                + '">View changes</a>',
                            function update() { // button
                                GM_openInTab(app.urls.update.replace('meta.js', 'user.js') + '?t=' + Date.now(),
                                    { active: true, insert: true } // focus, make adjacent
                                ).onclose = () => location.reload()
                            },
                            '', updateAlertWidth // width
                        )

                        return
                }}

                // Alert to no update
                ghAlert('Up to date!', `${app.name} (v${currentVer}) is up to date!`)
    }})}

    // Define CHART functions

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
                const aboutSection = document.querySelector('.about-margin > div')
                aboutSection.insertAdjacentElement('afterend', starHistoryDiv)

                // Add top button to show chart on phones
                if (env.browser.isPhone) insertPhoneBtn(imgDataURL)
            }

        } catch (err) { console.error('>> Error loading star history chart:', err) }
    }

    function insertPhoneBtn(imgDataURL) {
        if (document.getElementById('zoomStarHistoryBtn')) return
        const repoBtnsDiv = document.querySelector('#responsive-meta-container .d-flex.gap-2.mt-n3.mb-3.flex-wrap')
        if (!repoBtnsDiv) return

        // Create/config button elems
        const zoomStarHistoryBtn = document.createElement('button')
        zoomStarHistoryBtn.style.padding = '4px 7px 0' // center star logo
        Object.assign(zoomStarHistoryBtn, {
            id: 'zoomStarHistoryBtn', type: 'button', className: 'btn btn-sm tooltipped tooltipped-s',
            onclick: () => zoomStarHistory(imgDataURL)
        })
        zoomStarHistoryBtn.dataset.showDialogId = 'repo-delete-menu-dialog'
        zoomStarHistoryBtn.dataset.viewComponent = true

        // Create/config button spans
        const outerBtnSpan = document.createElement('span')
        outerBtnSpan.classList.add('Button-content')
        const innerBtnSpan = document.createElement('span')
        Object.assign(innerBtnSpan, { className: 'Button-label tooltipped tooltipped-s', ariaLabel: 'Star History' })

        // Create/config SVG elems
        const btnSVG = createSVGelem('svg', {
            version: '1.1', viewBox: '0 0 64 64', width: '16px', height: '16px',
            style: 'shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd'
        })
        const svgPath1 = createSVGelem('path', {
            style: 'opacity :0.76', fill: 'currentColor',
            d: 'M 63.5,33.5 C 63.5,34.5 63.5,35.5 63.5,36.5C 58.7514,40.2077 53.4181,42.8743 47.5,44.5C 45.9969,51.0438 43.9969,57.3771 41.5,63.5C 40.1667,63.5 38.8333,63.5 37.5,63.5C 34.1218,60.1239 31.1218,56.4572 28.5,52.5C 28.8966,51.475 29.5632,51.3083 30.5,52C 32.7089,53.8734 34.5422,56.04 36,58.5C 36.5,58 37,57.5 37.5,57C 33.0463,52.5508 29.3796,47.5508 26.5,42C 26.7432,41.0979 27.0766,40.2646 27.5,39.5C 28.7899,40.0577 29.6232,41.0577 30,42.5C 33.2391,40.648 36.7391,39.648 40.5,39.5C 40.6646,36.4816 40.498,33.4816 40,30.5C 37.1383,28.9296 34.3049,27.263 31.5,25.5C 29.8144,26.8569 28.1477,28.1902 26.5,29.5C 25.6236,29.6309 24.9569,29.2975 24.5,28.5C 29.8152,23.1463 29.1486,22.4797 22.5,26.5C 21.8933,26.3764 21.56,26.0431 21.5,25.5C 25.2992,23.6276 25.2992,21.9609 21.5,20.5C 27.6877,20.5267 33.1877,22.86 38,27.5C 38.7504,26.8742 39.5838,26.3742 40.5,26C 35.5908,22.8756 29.5908,19.8756 22.5,17C 21.1175,15.5391 21.4508,14.7058 23.5,14.5C 25.91,15.0629 28.2433,15.5629 30.5,16C 33.7853,11.0463 37.452,6.37966 41.5,2C 45.029,-0.379275 47.529,0.454059 49,4.5C 49.032,11.8717 49.1987,19.2051 49.5,26.5C 54.5427,28.2445 59.2094,30.5778 63.5,33.5 Z M 41.5,12.5 C 42.0967,12.7352 42.4301,13.2352 42.5,14C 41.8148,16.7952 41.3148,19.6285 41,22.5C 39.1839,21.6705 37.3506,20.8372 35.5,20C 37.3336,17.3367 39.3336,14.8367 41.5,12.5 Z M 47.5,33.5 C 51.2965,34.9114 51.2965,35.9114 47.5,36.5C 47.5,35.5 47.5,34.5 47.5,33.5 Z M 34.5,47.5 C 35.8333,47.5 37.1667,47.5 38.5,47.5C 37.5954,53.9632 36.2621,53.9632 34.5,47.5 Z'
        })
        const svgPath2 = createSVGelem('path', {
            style: 'opacity: .71', fill: 'currentColor',
            d: 'M 23.5,14.5 C 21.4508,14.7058 21.1175,15.5391 22.5,17C 29.5908,19.8756 35.5908,22.8756 40.5,26C 39.5838,26.3742 38.7504,26.8742 38,27.5C 33.1877,22.86 27.6877,20.5267 21.5,20.5C 19.2965,19.0538 16.9631,18.2204 14.5,18C 15.8554,21.2118 17.3554,24.3785 19,27.5C 19.7083,26.6195 20.5416,25.9528 21.5,25.5C 21.56,26.0431 21.8933,26.3764 22.5,26.5C 29.1486,22.4797 29.8152,23.1463 24.5,28.5C 24.9569,29.2975 25.6236,29.6309 26.5,29.5C 25.1999,30.8267 23.8665,32.16 22.5,33.5C 24.1897,35.5193 25.8564,37.5193 27.5,39.5C 27.0766,40.2646 26.7432,41.0979 26.5,42C 29.3796,47.5508 33.0463,52.5508 37.5,57C 37,57.5 36.5,58 36,58.5C 34.5422,56.04 32.7089,53.8734 30.5,52C 29.5632,51.3083 28.8966,51.475 28.5,52.5C 27.7387,51.6091 26.7387,50.9424 25.5,50.5C 18.553,51.9205 11.553,52.4205 4.5,52C 3.19551,51.196 2.52884,50.0293 2.5,48.5C 6.30907,43.5097 9.97574,38.3431 13.5,33C 11.5293,28.892 9.69592,24.7253 8,20.5C 7.33333,16.8333 7.33333,13.1667 8,9.5C 8.73869,8.42575 9.73869,7.75908 11,7.5C 15.8157,8.84699 19.9824,11.1803 23.5,14.5 Z M 21.5,20.5 C 25.2992,21.9609 25.2992,23.6276 21.5,25.5C 20.5416,25.9528 19.7083,26.6195 19,27.5C 17.3554,24.3785 15.8554,21.2118 14.5,18C 16.9631,18.2204 19.2965,19.0538 21.5,20.5 Z M 25,42 C 25.8297,40.5295 26.9956,38.2066 28.5,36C 27.5056,34.7603 26.0778,33.6204 25,32.5C 23.4918,34.4059 21.4906,36.6554 20,38.5C 18.9282,37.2717 18.25,35.8398 18,34.5C 17.25,35.75 16.1667,37.1667 15,38C 14.5,38.5 14.5,39.5 15,40C 16.9993,40.6089 19.1075,39.5245 21,38C 21.6706,39.5368 22.0079,41.0933 22.5,42.5C 21.4079,43.9192 21.5,45.5684 22.5,47C 22.5,46 22.5,45 23,44C 23.5295,43.3543 24.5,43 25,42 Z'
        })

        // Assemble all elems
        btnSVG.append(svgPath1, svgPath2)
        innerBtnSpan.append(btnSVG) ; outerBtnSpan.append(innerBtnSpan)
        zoomStarHistoryBtn.append(outerBtnSpan)

        // Append button to GitHub
        repoBtnsDiv.prepend(zoomStarHistoryBtn)

        function createSVGelem(type, attrs) {
            const elem = document.createElementNS('http://www.w3.org/2000/svg', type)
            for (const attr in attrs) elem.setAttributeNS(null, attr, attrs[attr])
            return elem
        }
    }

    function sanitizeImgURL(url) {
        if (!url.startsWith('https://api.star-history.com/svg'))
            throw new Error('>> Invalid URL')
        return url
    }

    function zoomStarHistory(imgURL) {
        const { user, repo } = getUserAndRepoOfCurrentPage()

        // Create/stylize overlay
        const overlay = document.createElement('div')
        overlay.style.position = 'fixed'; overlay.style.top = '0'; overlay.style.left = '0'
        overlay.style.width = '100%'; overlay.style.height = '100%'
        overlay.style.backgroundColor = 'rgba(0,0,0,0.7)'; overlay.style.display = 'flex'
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
    GM_registerMenuCommand(`💡 About ${app.name}`, async () => {

        // Show alert
        const pStyle = 'font-size: 1rem ; position: relative ; left: 3px ;',
              pBrStyle = 'font-size: 1rem ; position: relative ; left: 9px ; bottom: 3px ;'
        const aboutAlertID = ghAlert(
            app.name, // title
            `🏷️ Version: <span style="${pStyle} color: ${ env.ui.scheme == 'dark' ? '#00cd00' : 'green' }">${
                GM_info.script.version}</span>\n`
            + `📜 Source code:\n<span style="${pBrStyle}"><a href="${app.urls.gitHub}" target="_blank" rel="nopener">`
            + app.urls.gitHub + '</a></span>',
            [ // buttons
                function checkForUpdates() { updateCheck() },
                function getSupport() { safeWinOpen(app.urls.support) },
                function discuss() { safeWinOpen(app.urls.discuss) }
            ], null, 501)

        // Re-format buttons to include emojis + re-case + hide 'Dismiss'
        for (const button of document.getElementById(aboutAlertID).querySelectorAll('button')) {
            if (/updates/i.test(button.textContent))
                button.textContent = '🚀 Check for Updates'
            else if (/support/i.test(button.textContent))
                button.textContent = '🧠 Get Support'
            else if (/discuss/i.test(button.textContent))
                button.textContent = '🗨️ Discuss'
            else button.style.display = 'none' // hide Dismiss button
        }
    })

    ;['rpg', 'rpw'].forEach(cssType => // rising particles
        document.head.append(dom.create.style(GM_getResourceText(`${cssType}CSS`))))

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
