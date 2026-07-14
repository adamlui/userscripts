// ==UserScript==
// @name              Hide Forum Images
// @version           2026.7.14
// @author            Adam Lui
// @namespace         https://adamlui.com
// @description       Hides images/videos from XenForo, vBulletin & Discourse forums.
// @license           MIT
// @icon              https://cdn.jsdelivr.net/gh/adamlui/userscripts@ccc23a5/hide-forum-images/assets/images/icons/private-eye/black/icon48.png
// @icon64            https://cdn.jsdelivr.net/gh/adamlui/userscripts@ccc23a5/hide-forum-images/assets/images/icons/private-eye/black/icon64.png
// @compatible        chrome
// @compatible        edge
// @compatible        firefox
// @compatible        opera
// @compatible        safari
// @match             *://*/*
// @downloadURL       https://scriptcat.org/scripts/code/6907/hide-forum-images.user.js
// @updateURL         https://scriptcat.org/scripts/code/6907/hide-forum-images.meta.js
// @homepageURL       https://github.com/adamlui/userscripts/tree/master/hide-forun-images/#readme
// @supportURL        https://github.com/adamlui/userscripts/issues
// @contributionURL   https://ko-fi.com/adamlui
// ==/UserScript==

(() => {
    'use strict'
    if (document.querySelector('[src*="vbulletin"], [src*="discourse"]')
        || /xenforo/i.test(document.querySelector('.copyright')?.textContent)
    ) {
        const style = document.createElement('style')
        style.textContent = `img, [style*="background-image"], [class*="avatar"], [class*="player"] {
            display:none !important }`
        document.head.append(style)
    }
})()
