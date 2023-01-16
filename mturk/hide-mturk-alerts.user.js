// ==UserScript==
// @name         Hide MTurk Alerts
// @version      2022.12.08
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
// ==/UserScript==

GM_addStyle('.mturk-alert, .title { display:none !important; }');