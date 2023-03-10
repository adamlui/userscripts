// ==UserScript==
// @name             ChatGPT Widescreen Mode 🖥️
// @version          2023.03.09.3
// @author           Adam Lui & Xiao Ying Yo
// @namespace        https://github.com/adamlui
// @namespace        https://github.com/xiaoyingyo
// @description      Adds Widescreen + Full-Window modes to ChatGPT for reduced scrolling
// @homepageURL      https://github.com/adamlui/userscripts
// @supportURL       https://github.com/adamlui/userscripts/issues
// @license          MIT
// @match            https://chat.openai.com/*
// @icon             https://www.google.com/s2/favicons?sz=48&domain=openai.com
// @icon64           https://www.google.com/s2/favicons?sz=64&domain=openai.com
// @grant            none
// @downloadURL      https://greasyfork.org/scripts/461473/code/chatgpt-widescreen-mode.user.js
// @updateURL        https://greasyfork.org/scripts/461473/code/chatgpt-widescreen-mode.meta.js
// ==/UserScript==

(function() {

    var tooltips = {
        wideScreenON: 'Exit wide screen', wideScreenOFF: 'Wide screen',
        fullWindowON: 'Exit full window', fullWindowOFF: 'Full-window mode' }

	// Initialize mode states for updateTooltips() in case auto-toggle never triggers
    var wideScreenState = 'off', fullWindowState = 'off'

    // Create/stylize tooltip div
    var tooltipDiv = document.createElement('div')
    tooltipDiv.classList.add('toggle-tooltip')
    var tooltipStyle = document.createElement('style')
    tooltipStyle.innerHTML = `.toggle-tooltip {
            /* Box style */   background: black ; padding: 5px ; border-radius: 5px ;
            /* Font style */  font-size: 0.7rem ; color: white ;
            /* Visibility */  position: absolute ; top: -22px ; opacity: 0 ; transition: opacity 0.1s ; z-index: 9999 }`
    document.head.appendChild(tooltipStyle)

    // Collect OpenAI classes/colors
    var sendButton = document.querySelector('form button[class*="bottom"]')
    var sendButtonColor = 'currentColor' // changes w/ scheme
    var sendButtonClasses = document.querySelector('form button[class*="bottom"]').classList
    var sendSVGclasses = document.querySelector('form button[class*="bottom"] > svg').classList
    var sidepadClasses = classListToCSS( document.querySelector('#__next > div > div').classList )
    var sidebarClasses = classListToCSS( document.querySelector('#__next > div > div.dark').classList )

    // Create wide screen style
    var wideScreenStyle = document.createElement('style')
    wideScreenStyle.id = 'wideScreen-mode' // for toggleMode()
    wideScreenStyle.innerHTML = '.text-base { max-width: 96% !important }'

    // Create full window style
    var fullWindowStyle = document.createElement('style')
    fullWindowStyle.id = 'fullWindow-mode' // for toggleMode()
    fullWindowStyle.innerHTML = sidebarClasses + '{ display: none }' // hide sidebar
                              + sidepadClasses + '{ padding-left: 0px }' // remove side padding

    // Define SVG viewbox + paths
    var svgViewBox = '8 8 ' // move to XY coords to crop whitespace
                   + '20 20' // shrink to 20x20 to match Send button size
    var wideScreenONpaths = `
        <path fill="${ sendButtonColor }" fill-rule="evenodd"
            d="m 26,13 0,10 -16,0 0,-10 z m -14,2 12,0 0,6 -12,0 0,-6 z"></path>`
    var wideScreenOFFpaths = `
        <path fill="${ sendButtonColor }" fill-rule="evenodd"
            d="m 28,11 0,14 -20,0 0,-14 z m -18,2 16,0 0,10 -16,0 0,-10 z"></path>`
    var fullWindowONpaths = `
        <path fill="${ sendButtonColor }" d="m 14,14 -4,0 0,2 6,0 0,-6 -2,0 0,4 0,0 z"></path>
        <path fill="${ sendButtonColor }" d="m 22,14 0,-4 -2,0 0,6 6,0 0,-2 -4,0 0,0 z"></path>
        <path fill="${ sendButtonColor }" d="m 20,26 2,0 0,-4 4,0 0,-2 -6,0 0,6 0,0 z"></path>
        <path fill="${ sendButtonColor }" d="m 10,22 4,0 0,4 2,0 0,-6 -6,0 0,2 0,0 z"></path>`
    var fullWindowOFFpaths = `
        <path fill="${ sendButtonColor }" d="m 10,16 2,0 0,-4 4,0 0,-2 L 10,10 l 0,6 0,0 z"></path>
        <path fill="${ sendButtonColor }" d="m 20,10 0,2 4,0 0,4 2,0 L 26,10 l -6,0 0,0 z"></path>
        <path fill="${ sendButtonColor }" d="m 24,24 -4,0 0,2 L 26,26 l 0,-6 -2,0 0,4 0,0 z"></path>
        <path fill="${ sendButtonColor }" d="M 12,20 10,20 10,26 l 6,0 0,-2 -4,0 0,-4 0,0 z"></path>`

    // Create wide screen button & add classes/SVG/position/listeners
    var wideScreenButton = document.createElement('button') // create button
    wideScreenButton.id = 'wideScreen-button' // for toggleTooltip()
    wideScreenButton.setAttribute('class', sendButtonClasses) // assign borrowed classes
    updateSVG('wideScreen') // insert SVG
    wideScreenButton.style.cssText = 'right: 3.83rem' // position left of Send button
    wideScreenButton.addEventListener( 'click', () => { toggleMode('wideScreen') })
    wideScreenButton.addEventListener( 'mouseover', (event) => { toggleTooltip() })
    wideScreenButton.addEventListener( 'mouseout', (event) => { toggleTooltip() })

    // Create full window button & add classes/SVG/position/listeners
    var fullWindowButton = document.createElement('button') // create button
    fullWindowButton.id = 'fullWindow-button' // for toggleTooltip()
    fullWindowButton.setAttribute('class', sendButtonClasses) // assign borrowed classes
    updateSVG('fullWindow') // insert SVG
    fullWindowButton.style.cssText = 'right: 2.17rem' // position left of wide screen button
    fullWindowButton.addEventListener('click', () => { // on clicks
        if (!document.getElementById('fullWindow-mode')) { // if not full-window
            toggleMode('wideScreen', 'ON') } // then make fuller screen
        toggleMode('fullWindow') }) // but toggle full-window in any case
    fullWindowButton.addEventListener( 'mouseover', (event) => { toggleTooltip() })
    fullWindowButton.addEventListener( 'mouseout', (event) => { toggleTooltip() })

    insertToggles() // on page load

    // Monitor node changes to maintain button visibility + auto-toggle once
    var prevSessionChecked = false
    var navObserver = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList' && mutation.addedNodes.length) {
                insertToggles()
                if (!prevSessionChecked) { // load keys to restore previous session's state
                    if (localStorage.getItem('chatGPT_wideScreen') == 'on') toggleMode('wideScreen', 'ON')
                    if (localStorage.getItem('chatGPT_fullWindow') == 'on') toggleMode('fullWindow', 'ON')
                    prevSessionChecked = true
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
        var button = mode == 'wideScreen' ? wideScreenButton : fullWindowButton
        var ONpaths = mode == 'wideScreen' ? wideScreenONpaths : fullWindowONpaths
        var OFFpaths = mode == 'wideScreen' ? wideScreenOFFpaths : fullWindowOFFpaths

        // Initialize rem margin offset vs. OpenAI's .mr-1 for hover overlay centeredness
        var lMargin = mode == 'wideScreen' ? .11 : .12
        var rMargin = (.25 - lMargin)

        // Update SVG
        button.innerHTML = '<svg '
            + `class="${ sendSVGclasses }" ` // assign borrowed classes
            + `style="margin: 0 ${ rMargin }rem 0 ${ lMargin }rem ; ` // center overlay
            + `pointer-events: none" ` // prevent triggering tooltips twice
            + `viewBox="${ svgViewBox }"> ` // set viewbox pre-tweaked to match Send
            + (localStorage.getItem( // dynamically insert paths based on cached key
                'chatGPT_' + mode) == 'on' ? ONpaths : OFFpaths + '</svg>')
    }

    function insertToggles() {
        var chatbar = document.querySelector("form button[class*='bottom']").parentNode
        if (!chatbar.contains(fullWindowButton)) { // if toggles missing from chatbar
            chatbar.append(fullWindowButton, wideScreenButton, tooltipDiv) // add them + tooltip
    }}

    function toggleMode(mode, state = '') {
        var modeStyle = document.getElementById(mode + '-mode') // look for existing style node
        if (state.toUpperCase() == 'ON' || !modeStyle ) { // if missing or ON-state passed
            modeStyle = mode == 'wideScreen' ? wideScreenStyle : fullWindowStyle
            document.head.appendChild(modeStyle) ; state = 'on' // activate mode
        } else { // de-activate mode
            modeStyle.parentNode.removeChild(modeStyle) ; state = 'off'
        }
        mode == 'wideScreen' ? wideScreenState = state : fullWindowState = state
        localStorage.setItem('chatGPT_' + mode, state) // cache for new sessions
        updateSVG(mode) ; updateTooltip(mode, state) // update icon/tooltip
    }

    function toggleTooltip() {
        var [buttonType, modeState] = ( event.target.id.includes('wide') ?
            ['wideScreen', wideScreenState] : ['fullWindow', fullWindowState] )
        updateTooltip(buttonType, modeState) // since mouseover's can indicate change
        tooltipDiv.style.opacity = event.type === 'mouseover' ? '0.8' : '0' // toggle visibility
    }

    function updateTooltip(buttonType, modeState) { // text & position
        tooltipDiv.innerHTML = tooltips[buttonType + modeState.toUpperCase()]
        var ctrAddend = 17, overlayWidth = 30
        var iniRoffset = overlayWidth * ( buttonType.includes('Window') ? 1 : 2 ) + ctrAddend
        tooltipDiv.style.right = `${ // horizontal position
                iniRoffset - tooltipDiv.getBoundingClientRect().width / 2 }px`
    }

})()
