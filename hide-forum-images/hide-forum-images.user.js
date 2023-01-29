// ==UserScript==
// @name             Hide Forum Images
// @version          2023.01.29
// @author           Adam Lui
// @namespace        https://elonsucks.org/@adam
// @description      Hides images/videos from XenForo, vBulletin & Discourse forums.
// @supportURL       https://github.com/adamlui/userscripts/issues
// @license          MIT
// @icon             https://i.imgur.com/TABwyUq.png
// @compatible       chrome
// @compatible       firefox
// @compatible       opera
// @compatible       safari
// @compatible       edge
// @match            http*://*/*
// @updateURL        https://greasyfork.org/scripts/12639/code/hide-forum-images.meta.js
// @downloadURL      https://greasyfork.org/scripts/12639/code/hide-forum-images.user.js
// ==/UserScript==

if (document.querySelector('[src*="vbulletin"], [src*="discourse"]') || document.querySelector('.copyright').textContent.match(/xenforo/i)) {
    var css = `img, [style*="background-image"], [class*="avatar"], [class*="player"] { display:none !important; }`
    var styleNode = document.createElement('style') ; styleNode.innerText = css
    document.head.appendChild(styleNode)
}
