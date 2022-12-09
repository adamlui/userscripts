// ==UserScript==
// @name         Hide MTurk Instructions
// @version      2022.12.09
// @author       Adam Lui
// @namespace    https://elonsucks.org/@adam
// @description  Hides instructions from HITs on MTurk
// @license      GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
// @icon         https://www.mturk.com/assets/images/favicon.ico
// @compatible   chrome
// @compatible   firefox
// @compatible   opera
// @compatible   safari
// @compatible   edge
// @match        https://*.mturkcontent.com/*
// @run-at       document-start
// @grant        GM_addStyle
// @updateURL    https://greasyfork.org/scripts/28351-hide-mturk-instructions/code/hide-mturk-instructions.meta.js
// @downloadURL  https://greasyfork.org/scripts/28351-hide-mturk-instructions/code/hide-mturk-instructions.user.js
// ==/UserScript==

GM_addStyle('[id*="instruction"], [class*="instruction"] { display:none !important; }');
document.getElementsByClassName('panel panel-primary')[0].style.display='none';
