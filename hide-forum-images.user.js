// ==UserScript==
// @name             Hide Forum Images
// @version          2023.01.15.1
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
// @updateURL        https://greasyfork.org/en/scripts/12639/code/youtube-classic.meta.js
// @downloadURL      https://greasyfork.org/en/scripts/12639/code/youtube-classic.user.js
// ==/UserScript==

if (document.querySelector('[src*="vbulletin"]') || document.querySelector('a[href*="xenforo"]')) {
    GM_addStyle('img, [style*="background-image"], [class*="avatar"], [class*="player"] { display:none !important; }');}
