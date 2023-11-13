// ==UserScript==
// @name         Hide MTurk Alerts
// @version      2023.11.12.1
// @author       Adam Lui
// @namespace    https://adamlui.com
// @description  Hides MTurk alerts.
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
// @downloadURL  https://update.greasyfork.org/scripts/458346/hide-mturk-alerts.user.js
// @updateURL    https://update.greasyfork.org/scripts/458346/hide-mturk-alerts.meta.js
// @homepageURL  https://github.com/adamlui/userscripts
// @supportURL   https://github.com/adamlui/userscripts/issues
// ==/UserScript==

GM_addStyle('.mturk-alert, .title { display:none !important; }');
