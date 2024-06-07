// ==UserScript==
// @name          Highlight Radio Bubbles
// @version       2024.6.6
// @author        Adam Lui
// @namespace     https://adamlui.com
// @description   Makes radio bubbles bigger & more colorful when brought to focus.
// @license       MIT
// @icon          https://cdn.jsdelivr.net/gh/adamlui/userscripts@latest/highlight-radio-bubbles/media/images/icons/radio-bubble/icon48.png?826773c
// @icon64        https://cdn.jsdelivr.net/gh/adamlui/userscripts@latest/highlight-radio-bubbles/media/images/icons/radio-bubble/icon64.png?826773c
// @compatible    chrome
// @compatible    firefox
// @compatible    opera
// @compatible    safari
// @compatible    edge
// @match         *://*/*
// @downloadURL   https://update.greasyfork.org/scripts/26311/highlight-radio-bubbles.user.js
// @updateURL     https://update.greasyfork.org/scripts/26311/highlight-radio-bubbles.meta.js
// @homepageURL   https://github.com/adamlui/userscripts
// @supportURL    https://github.com/adamlui/userscripts/issues
// ==/UserScript==

const styleNode = document.createElement('style')
styleNode.innerHTML = 'input[type=radio]:focus { outline-color: red !important ; width: 25px !important ; height: 25px !important ; }'
document.head.appendChild(styleNode)
