// ==UserScript==
// @name             Highlight Radio Bubbles
// @version          2023.11.12.1
// @author           Adam Lui
// @namespace        https://github.com/adamlui
// @description      Makes radio bubbles bigger & more colorful when brought to focus.
// @supportURL       https://github.com/adamlui/userscripts/issues
// @license          MIT
// @icon             https://i.imgur.com/ribh0wE.png
// @compatible       chrome
// @compatible       firefox
// @compatible       opera
// @compatible       safari
// @compatible       edge
// @match            *://*/*
// @downloadURL      https://update.greasyfork.org/scripts/26311/highlight-radio-bubbles.user.js
// @updateURL        https://update.greasyfork.org/scripts/26311/highlight-radio-bubbles.meta.js
// @homepageURL      https://github.com/adamlui/userscripts
// @supportURL       https://github.com/adamlui/userscripts/issues
// ==/UserScript==

const styleNode = document.createElement('style')
styleNode.innerHTML = 'input[type=radio]:focus { outline-color: red !important ; width: 25px !important ; height: 25px !important ; }'
document.head.appendChild(styleNode)
