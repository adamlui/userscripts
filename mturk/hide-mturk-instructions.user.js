// ==UserScript==
// @name         Hide MTurk Instructions
// @version      2022.12.08.2
// @author       Adam Lui
// @namespace    https://elonsucks.org/@adam
// @description  Hides instructions from HITs on MTurk
// @match        https://*.mturkcontent.com/*
// @icon         https://www.mturk.com/assets/images/favicon.ico
// @run-at       document-start
// @grant        GM_addStyle
// @updateURL    https://greasyfork.org/scripts/28351-hide-mturk-instructions/code/hide-mturk-instructions.meta.js
// @downloadURL  https://greasyfork.org/scripts/28351-hide-mturk-instructions/code/hide-mturk-instructions.user.js
// ==/UserScript==

GM_addStyle('[id*="instruction"], [class*="instruction"] { display:none !important; }');
document.getElementsByClassName('panel panel-primary')[0].style.display='none';
