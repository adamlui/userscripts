// ==UserScript==
// @name        Highlight Radio Bubbles
// @namespace   https://mturkers.org/adaaaam
// @version     2017.02.26
// @descrption  Makes radio bubbles bigger, more colorful and thereby more conspicuous when brought to focus. Ideal for completing surveys and long HITs on MTurk.
// @author      adaaaam
// @include     *
// @icon        https://mturkers.org/images/04nrzj7K_400x400.png
// @updateURL   https://raw.githubusercontent.com/adaaaam/userscripts/master/highlight-radio-bubbles.js
// @downloadURL https://raw.githubusercontent.com/adaaaam/userscripts/master/highlight-radio-bubbles.js
// ==/UserScript==

var sheet = document.createElement('style') ;
sheet.innerHTML = "input[type=radio]:focus { outline-color: red !important ; width: 25px !important ; height: 25px !important ; }" ;
document.head.appendChild(sheet) ;
