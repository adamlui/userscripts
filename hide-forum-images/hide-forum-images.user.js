// ==UserScript==
// @name              Hide Forum Images
// @version           2025.1.18
// @author            Adam Lui
// @namespace         https://adamlui.com
// @description       Hides images/videos from XenForo, vBulletin & Discourse forums.
// @license           MIT
// @icon              https://cdn.jsdelivr.net/gh/adamlui/userscripts@9d1da77/hide-forum-images/media/images/icons/private-eye/black/icon48.png
// @icon64            https://cdn.jsdelivr.net/gh/adamlui/userscripts@9d1da77/hide-forum-images/media/images/icons/private-eye/black/icon64.png
// @compatible        chrome
// @compatible        firefox
// @compatible        opera
// @compatible        safari
// @compatible        edge
// @match             *://*/*
// @downloadURL       https://github.com/adamlui/userscripts/raw/refs/heads/master/hide-forum-images/hide-forum-images.user.js
// @updateURL         https://github.com/adamlui/userscripts/raw/refs/heads/master/hide-forum-images/hide-forum-images.user.js
// @homepageURL       https://github.com/adamlui/userscripts
// @supportURL        https://github.com/adamlui/userscripts/issues
// @contributionURL   https://github.com/sponsors/adamlui
// ==/UserScript==

if (document.querySelector('[src*="vbulletin"], [src*="discourse"]') || /xenforo/i.test(document.querySelector('.copyright').textContent)) {
    const css = 'img, [style*="background-image"], [class*="avatar"], [class*="player"] { display:none !important; }'
    const styleNode = document.createElement('style') ; styleNode.innerText = css
    document.head.appendChild(styleNode)
}
