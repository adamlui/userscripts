// ==UserScript==
// @name         Hide MTurk Alerts
// @version      2023.01.16
// @author       Adam Lui
// @namespace    https://elonsucks.org/@adam
// @description  Hides MTurk alerts.
// @supportURL   https://github.com/adamlui/userscripts/issues
// @license      MIT
// @icon         https://www.mturk.com/assets/images/favicon.ico
// @compatible   chrome
// @compatible   firefox
// @compatible   opera
// @compatible   safari
// @compatible   edge
// @match        https://worker.mturk.com/*
// @grant        GM_addStyle
// @updateURL    https://greasyfork.org/scripts/458346-hide-mturk-alerts/code/hide-mturk-alerts.meta.js
// @downloadURL  https://greasyfork.org/scripts/458346-hide-mturk-alerts/code/hide-mturk-alerts.user.js
// ==/UserScript==

GM_addStyle('.mturk-alert, .title { display:none !important; }');
