// ==UserScript==
// @name              Highlight Radio Bubbles
// @version           2025.10.19.2
// @author            Adam Lui
// @namespace         https://adamlui.com
// @description       Makes radio bubbles bigger & more colorful when brought to focus.
// @license           MIT
// @icon              https://cdn.jsdelivr.net/gh/adamlui/userscripts@ccc23a5/highlight-radio-bubbles/assets/images/icons/radio-bubble/icon48.png
// @icon64            https://cdn.jsdelivr.net/gh/adamlui/userscripts@ccc23a5/highlight-radio-bubbles/assets/images/icons/radio-bubble/icon64.png
// @compatible        chrome
// @compatible        firefox
// @compatible        opera
// @compatible        safari
// @compatible        edge
// @match             *://*/*
// @downloadURL       https://raw.githubusercontent.com/adamlui/userscripts/master/highlight-radio-bubbles/highlight-radio-bubbles.user.js
// @updateURL         https://raw.githubusercontent.com/adamlui/userscripts/master/highlight-radio-bubbles/highlight-radio-bubbles.user.js
// @homepageURL       https://github.com/adamlui/userscripts
// @supportURL        https://github.com/adamlui/userscripts/issues
// @contributionURL   https://github.com/sponsors/adamlui
// ==/UserScript==

(() => {
    'use strict'
    const style = document.createElement('style')
    style.innerHTML = `input[type=radio]:focus {
        outline-color: red !important ; width: 25px !important ; height: 25px !important }`
    document.head.append(style)
})()
