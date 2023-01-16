// ==UserScript==
// @name             Hide Forum Images
// @version          2023.01.16
// @author           Adam Lui
// @namespace        https://elonsucks.org/@adam
// @description      Hides images/videos from XenForo and vBulletin forums.
// @supportURL       https://github.com/adamlui/userscripts/issues
// @license          MIT
// @compatible       chrome
// @compatible       firefox
// @compatible       opera
// @compatible       safari
// @compatible       edge
// @match            http*://*/*
// @grant            GM_addStyle
// @updateURL        https://greasyfork.org/scripts/12639-hide-forum-images/code/hide-forum-images.meta.js
// @downloadURL      https://greasyfork.org/scripts/12639-hide-forum-images/code/hide-forum-images.user.js
// ==/UserScript==

if (document.querySelector('[src*="vbulletin"]') || document.querySelector('.copyright').textContent.match(/xenforo/i)) {
    GM_addStyle('img, [style*="background-image"], [class*="avatar"], [class*="player"] { display:none !important; }');}
