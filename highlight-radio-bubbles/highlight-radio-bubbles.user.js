// ==UserScript==
// @name              Highlight Radio Bubbles
// @version           2024.12.29
// @author            Adam Lui
// @namespace         https://adamlui.com
// @description       Makes radio bubbles bigger & more colorful when brought to focus.
// @license           MIT
// @icon              https://cdn.jsdelivr.net/gh/adamlui/userscripts@826773c/highlight-radio-bubbles/media/images/icons/radio-bubble/icon48.png
// @icon64            https://cdn.jsdelivr.net/gh/adamlui/userscripts@826773c/highlight-radio-bubbles/media/images/icons/radio-bubble/icon64.png
// @compatible        chrome
// @compatible        firefox
// @compatible        opera
// @compatible        safari
// @compatible        edge
// @match             *://*/*
// @downloadURL       https://update.greasyfork.org/scripts/26311/highlight-radio-bubbles.user.js
// @updateURL         https://update.greasyfork.org/scripts/26311/highlight-radio-bubbles.meta.js
// @homepageURL       https://github.com/adamlui/userscripts
// @supportURL        https://github.com/adamlui/userscripts/issues
// @contributionURL   https://github.com/sponsors/adamlui
// ==/UserScript==

const styleNode = document.createElement('style')
styleNode.innerHTML = 'input[type=radio]:focus { outline-color: red !important ; width: 25px !important ; height: 25px !important ; }'
document.head.appendChild(styleNode)
