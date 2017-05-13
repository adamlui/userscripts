// ==UserScript==
// @name          MTurk A9 Data Validation Hotkeys
// @namespace     https://mturkers.org/
// @version       2017.05.13
// @description   Hotkeys for Amazon's A9 Data Validation HITs on MTurk
// @author        adaaaam
// @include       https://*.mturk.com/*
// @include       https://*.amazonaws.com/*
// @require       http://code.jquery.com/jquery-latest.min.js
// @icon          http://i.imgur.com/UIjnpzD.png
// @requesterURL  https://www.mturk.com/mturk/searchbar?selectedSearchType=hitgroups&requesterId=A3HLF55H6JSTI0
// ==/UserScript==

/*
HOTKEYS:
 A or 1 - Strongly Dissimilar
 S or 2 - Somewhat Dissimilar
 D or 3 - Neither Similar nor Dissimilar
 F or 4 - Somewhat Similar
 G or 5 - Strongly Similar

Z - Poor Lighting / Blurry
X - No Product in Image
C - Product Obscured
V - Too Small
B - Top/Side Obscured

E or Enter - Submit HIT

NOTE: To activate auto-submission, replace the third line after this with "var autoSubmit = true"
*/

var autoSubmit = false;

if (document.querySelector('iframe')) document.querySelector('iframe').focus();
if ($('center:contains(a scale of 1 to 5, rate)').length) {
    window.addEventListener(`keydown`, function(event) {
        const mkey = event.key;
        if (mkey.match(/[asdfgzxcvb1-5]/)) {
            if (mkey.match('z')) document.querySelectorAll(`[type='radio']`)[0].click();
            else if (mkey.match('x')) document.querySelectorAll(`[type='radio']`)[1].click();
            else if (mkey.match('c')) document.querySelectorAll(`[type='radio']`)[2].click();
            else if (mkey.match('v')) document.querySelectorAll(`[type='radio']`)[3].click();
            else if (mkey.match('b')) document.querySelectorAll(`[type='radio']`)[4].click();
            else if (mkey.match(/[a1]/)) document.querySelector(`[type='radio'][value='1']`).click();
            else if (mkey.match(/[s2]/)) document.querySelector(`[type='radio'][value='2']`).click();
            else if (mkey.match(/[d3]/)) document.querySelector(`[type='radio'][value='3']`).click();
            else if (mkey.match(/[f4]/)) document.querySelector(`[type='radio'][value='4']`).click();
            else if (mkey.match(/[g5]/)) document.querySelector(`[type='radio'][value='5']`).click();
            if (autoSubmit) document.querySelector(`[type='submit']`).click();
        }
        if (mkey.match('e')) document.querySelector(`[type='submit']`).click();
    });
}
