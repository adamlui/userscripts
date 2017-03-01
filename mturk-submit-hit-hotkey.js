// ==UserScript==
// @name          MTurk Submit HIT Hotkey
// @namespace     https://mturkers.org/adaaaam
// @version       2017.02.28.1
// @description   Enables pressing grave (`) to submit HITs on MTurk
// @author        adaaaam
// @include       *
// @updateURL     https://raw.githubusercontent.com/adaaaam/userscripts/master/mturk-submit-hit-hotkey.js
// @downloadURL   https://raw.githubusercontent.com/adaaaam/userscripts/master/mturk-submit-hit-hotkey.js
// ==/UserScript==

if (document.querySelector('iframe')) document.querySelector('iframe').focus();
if ( $("a[href*='mturk/return']").length ) {
    window.addEventListener("keydown", function(e) {
        if (e.keyCode == "192") {
            e.preventDefault();
            document.querySelector(`[type='submit']`).click();
        }
    });
}
