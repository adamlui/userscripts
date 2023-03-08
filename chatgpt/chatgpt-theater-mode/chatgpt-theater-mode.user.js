// ==UserScript==
// @name             ChatGPT Theater Mode
// @version          2023.03.10
// @author           Adam Lui & Xiao Ying Yo
// @namespace        https://github.com/adamlui
// @namespace        https://github.com/xiaoyingyo
// @description      Adds Theater + Full-Window modes to ChatGPT for enhanced viewing
// @homepageURL      https://github.com/adamlui/userscripts
// @supportURL       https://github.com/adamlui/userscripts/issues
// @license          MIT
// @match            https://chat.openai.com/*
// @icon             https://www.google.com/s2/favicons?sz=48&domain=openai.com
// @icon64           https://www.google.com/s2/favicons?sz=64&domain=openai.com
// @grant            none
// @downloadURL      https://greasyfork.org/scripts/461473/code/chatgpt-theater-mode.user.js
// @updateURL        https://greasyfork.org/scripts/461473/code/chatgpt-theater-mode.meta.js
// ==/UserScript==

(function() {

    // Collect OpenAI classes + input button color
    var sendButtonClasses = document.querySelector("form button[class*='bottom']").classList
    var sendSVGclasses = document.querySelector("form button[class*='bottom'] > svg").classList
    var inputButtonColor = 'currentColor' // value changes w/ scheme
    var sidepadClasses = classListToCSS(
        document.querySelector('#__next > div > div').classList )
    var sidebarClasses = classListToCSS(
        document.querySelector('#__next > div > div.dark').classList )

    // Define SVG viewbox/paths
    var svgViewBox = '8 8 ' // move to XY coords to crop whitespace
                   + '20 20' // shrink to 20x20 to match Send button size
    var theaterONpaths = `
        <path fill="${ inputButtonColor }" fill-rule="evenodd"
            d="m 26,13 0,10 -16,0 0,-10 z m -14,2 12,0 0,6 -12,0 0,-6 z"></path>`
    var theaterOFFpaths = `
        <path fill="${ inputButtonColor }" fill-rule="evenodd"
            d="m 28,11 0,14 -20,0 0,-14 z m -18,2 16,0 0,10 -16,0 0,-10 z"></path>`
    var fullWindowONpaths = `
        <path fill="${ inputButtonColor }" d="m 14,14 -4,0 0,2 6,0 0,-6 -2,0 0,4 0,0 z"></path>
        <path fill="${ inputButtonColor }" d="m 22,14 0,-4 -2,0 0,6 6,0 0,-2 -4,0 0,0 z"></path>
        <path fill="${ inputButtonColor }" d="m 20,26 2,0 0,-4 4,0 0,-2 -6,0 0,6 0,0 z"></path>
        <path fill="${ inputButtonColor }" d="m 10,22 4,0 0,4 2,0 0,-6 -6,0 0,2 0,0 z"></path>`
    var fullWindowOFFpaths = `
        <path fill="${ inputButtonColor }" d="m 10,16 2,0 0,-4 4,0 0,-2 L 10,10 l 0,6 0,0 z"></path>
        <path fill="${ inputButtonColor }" d="m 20,10 0,2 4,0 0,4 2,0 L 26,10 l -6,0 0,0 z"></path>
        <path fill="${ inputButtonColor }" d="m 24,24 -4,0 0,2 L 26,26 l 0,-6 -2,0 0,4 0,0 z"></path>
        <path fill="${ inputButtonColor }" d="M 12,20 10,20 10,26 l 6,0 0,-2 -4,0 0,-4 0,0 z"></path>`

    // Create Theater button & add classes/SVG/position/listener
    var theaterButton = document.createElement('button') // create button
    theaterButton.setAttribute('class', sendButtonClasses) // assign borrowed classes
    updateSVG('theater') // insert SVG
    theaterButton.style.cssText = 'right: 3.83rem' // position left of Send button
    theaterButton.addEventListener( // add click listener
        'click', () => { toggleMode('theater') }) // to toggle

    // Create Full-Window button & add classes/SVG/position/listener
    var fullWindowButton = document.createElement('button') // create button
    fullWindowButton.setAttribute('class', sendButtonClasses) // assign borrowed classes
    updateSVG('fullWindow') // insert SVG
    fullWindowButton.style.cssText = 'right: 2.17rem' // position left of Theater button
    fullWindowButton.addEventListener('click', () => { // add click listener
        if (!isModeON('fullWindow')) toggleMode('theater', 'ON') // to be fuller screen
        toggleMode('fullWindow') // or just toggle
    })

    insertToggles() // on page load

    // Monitor node changes to retain buttons + auto-toggle once
    var virginToggled = false
    var navObserver = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList' && mutation.addedNodes.length) {
                insertToggles()
                if (!virginToggled) { // load keys to restore previous session's state
                    if (localStorage.getItem('chatGPT_theater') == 'on') toggleMode('theater', 'ON')
                    if (localStorage.getItem('chatGPT_fullWindow') == 'on') toggleMode('fullWindow', 'ON')
                    virginToggled = true
                }
    }})})
    navObserver.observe(document.documentElement, {childList: true, subtree: true})


    // Functions

    function classListToCSS(classList) { // convert DOM classList to single CSS selector
        return '.' + classList.toString() // prepend dot to converted string
            .replace(/ /g, '.') // concatenate classes w/ dots
            .replace(/([:\[\]])/g, '\\$1') // escape CSS special chars
    }

    function updateSVG(mode) {
        var button = mode == 'theater' ? theaterButton : fullWindowButton
        var ONpaths = mode == 'theater' ? theaterONpaths : fullWindowONpaths
        var OFFpaths = mode == 'theater' ? theaterOFFpaths : fullWindowOFFpaths

        // Initialize rem margin offset vs. OpenAI's .mr-1 for hover overlay centeredness
        var lMargin = mode == 'theater' ? .11 : .12
        var rMargin = (.25 - lMargin)

        // Update SVG
        button.innerHTML = '<svg '
            + `class="${ sendSVGclasses }" ` // assign borrowed classes
            + `style="margin: 0 ${ rMargin }rem 0 ${ lMargin }rem" `
            + `viewBox="${ svgViewBox }"> ` // set viewbox pre-tweaked to match Send
            + (localStorage.getItem( // dynamically insert paths based on cached key
                'chatGPT_' + mode) == 'on' ? ONpaths : OFFpaths + '</svg>')
    }

    function insertToggles() {
        var chatbar = document.querySelector("form button[class*='bottom']").parentNode
        if (!chatbar.contains(fullWindowButton)) { // if toggles missing from chatbar
            chatbar.append(fullWindowButton, theaterButton) // add them
    }}

    function isModeON(mode) { // hard check to avoid faulty storage
        var modeStyle = document.getElementById(mode + '-mode')
        return modeStyle ? true : false
    }

    function toggleMode(mode, state = '') {

        var modeCSS = ( mode == // build CSS based on mode
            'theater' ? '.text-base { max-width: 96% !important }' : // if Theater, expand txt to 96% of txt window
            'fullWindow' ? sidebarClasses + '{ display: none }' // if Full-Window, hide sidebar...
                + sidepadClasses + '{ padding-left: 0px }' : '' ) // + remove sidebar padding

        var modeStyle = document.getElementById(mode + '-mode') // look for existing style node
        if (state.toUpperCase() == 'ON' || !modeStyle ) { // if missing or ON-state passed

            // Activate mode
            modeStyle = document.createElement('style')
            modeStyle.id = mode + '-mode' // assign ID for isModeOn()
            modeStyle.appendChild(document.createTextNode(modeCSS))
            document.head.appendChild(modeStyle)
            localStorage.setItem('chatGPT_' + mode, 'on')

        } else { // de-activate mode
            modeStyle.parentNode.removeChild(modeStyle)
            localStorage.setItem('chatGPT_' + mode, 'off')
        }

        updateSVG(mode) // to reflect change in button
    }

})()
