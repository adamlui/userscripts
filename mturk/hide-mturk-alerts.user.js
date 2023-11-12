// ==UserScript==
// @name         Hide MTurk Alerts
// @version      2023.11.12
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
// @require      https://cdn.jsdelivr.net/gh/jquery/jquery@32b00373b3f42e5cdcb709df53f3b08b7184a944/dist/jquery.min.js
// @downloadURL  https://update.greasyfork.org/scripts/458346.user.js
// @updateURL    https://update.greasyfork.org/scripts/458346.meta.js
// ==/UserScript==

GM_addStyle('.mturk-alert, .title { display:none !important; }');
