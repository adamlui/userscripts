// ==UserScript==
// @name         Hide MTurk Instructions
// @version      2023.01.16.1
// @author       Adam Lui
// @namespace    https://elonsucks.org/@adam
// @description  Hides instructions from HITs on MTurk
// @supportURL   https://github.com/adamlui/userscripts/issues
// @license      MIT
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
GM_addStyle('.guidance, .headerContainer { display:none !important; }');
GM_addStyle('.top_bar { height:0px !important; }');
GM_addStyle('.everything { display: flex; margin-right: 35%; margin-left: -5% }');
document.getElementsByClassName('panel panel-primary')[0].style.display='none';
