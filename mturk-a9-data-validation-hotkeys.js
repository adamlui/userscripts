// ==UserScript==
// @name          MTurk A9 Data Validation Hotkeys
// @namespace     https://mturkers.org/adaaaam
// @version       2017.02.25
// @description   Hotkeys for Amazon's A9 Data Validation HITs on MTurk
// @author        adaaaam
// @include       /(.*)\.(mturk|amazonaws)\.com/
// @icon          https://mturkers.org/images/04nrzj7K_400x400.png
// @requesterURL  https://www.mturk.com/mturk/searchbar?selectedSearchType=hitgroups&requesterId=A3HLF55H6JSTI0
// @updateURL     https://raw.githubusercontent.com/adaaaam/userscripts/master/mturk-a9-data-validation-hotkeys.js
// @downloadURL   https://raw.githubusercontent.com/adaaaam/userscripts/master/mturk-a9-data-validation-hotkeys.js
// ==/UserScript==

/*
USAGE NOTES:
- Press A-G or 1-5 to select bubbles
- Press E or Enter to submit
- Set autoSubmit to 'true' to auto-submit after selections
*/

var autoSubmit = false;

var mframe = document.querySelector("iframe");
if (mframe) mframe.focus();
window.addEventListener(`keydown`, function(event) {
    const mkey = event.key;
    if (mkey.match(/[asdfg1-5]/)) {
        if (mkey.match(/[a1]/)) document.querySelector(`[type='radio'][value='1']`).click();
        else if (mkey.match(/[s2]/)) document.querySelector(`[type='radio'][value='2']`).click();
        else if (mkey.match(/[d3]/)) document.querySelector(`[type='radio'][value='3']`).click();
        else if (mkey.match(/[f4]/)) document.querySelector(`[type='radio'][value='4']`).click();
        else if (mkey.match(/[g5]/)) document.querySelector(`[type='radio'][value='5']`).click();
        if (autoSubmit) document.querySelector(`[type='submit']`).click();
    }
    if (mkey.match(/e/)) document.querySelector(`[type='submit']`).click();
});
