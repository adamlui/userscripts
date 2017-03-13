// ==UserScript==
// @name          MTurk A9 Data Validation Hotkeys
// @namespace     https://mturkers.org/adaaaam
// @version       2017.02.27
// @description   Hotkeys for Amazon's A9 Data Validation HITs on MTurk
// @author        adaaaam
// @include       https://*.mturk.com/*
// @include       https://*.amazonaws.com/*
// @require       http://code.jquery.com/jquery-latest.min.js
// @icon          http://i.imgur.com/UIjnpzD.png
// @requesterURL  https://www.mturk.com/mturk/searchbar?selectedSearchType=hitgroups&requesterId=A3HLF55H6JSTI0
// @updateURL     https://raw.githubusercontent.com/adaaaam/userscripts/master/mturk-a9-data-validation-hotkeys.js
// @downloadURL   https://raw.githubusercontent.com/adaaaam/userscripts/master/mturk-a9-data-validation-hotkeys.js
// ==/UserScript==

/*
HOTKEYS:
 A or 1 - Strongly Dissimilar
 S or 2 - Somewhat Dissimilar
 D or 3 - Neither Similar nor Dissimilar
 F or 4 - Somewhat Similar
 G or 5 - Strongly Similar

 E or Enter - Submit HIT

NOTE: To activate auto-submission, replace the third line after this with "var autoSubmit = true"
*/

var autoSubmit = false;

if (document.querySelector('iframe')) document.querySelector('iframe').focus();
if ($('center:contains(On a scale of 1 to 5, rate how)').length) {
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
        if (mkey.match('e')) document.querySelector(`[type='submit']`).click();
    });
}
