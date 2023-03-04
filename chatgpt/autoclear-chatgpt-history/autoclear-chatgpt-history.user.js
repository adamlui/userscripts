// ==UserScript==
// @name             Autoclear ChatGPT History
// @version          2023.03.04.4
// @author           Adam Lui & Tripp1e
// @namespace        https://github.com/adamlui
// @description      Auto-clears chat history when visiting chat.openai.com
// @homepageURL      https://github.com/adamlui/userscripts
// @supportURL       https://github.com/adamlui/userscripts/issues
// @license          MIT
// @icon             https://www.google.com/s2/favicons?sz=64&domain=openai.com
// @compatible       chrome
// @compatible       edge
// @compatible       firefox
// @compatible       opera
// @compatible       brave
// @compatible       vivaldi
// @match            https://chat.openai.com/*
// @run-at           document-end
// @grant            none
// @updateURL        https://greasyfork.org/scripts/460805/code/autoclear-chatgpt-history.meta.js
// @downloadURL      https://greasyfork.org/scripts/460805/code/autoclear-chatgpt-history.user.js
// ==/UserScript==

// Stylize toggle switch
var styleNode = document.createElement('style')
styleNode.innerHTML = `

        /* Stylize switch */
        .switch { position:absolute ; right:22px ; width:34px ; height:18px }
        .switch input { opacity:0 ; width:0 ; height:0 } /* hide checkbox */
        .slider { position:absolute ; cursor:pointer ; top:0 ; left:0 ; right:0 ; bottom:0 ; background-color:#ccc ; -webkit-transition:.4s ; transition:.4s ; border-radius:28px }
        .slider:before { position:absolute ; content:"" ; height:14px ; width:14px ; left:3px; bottom:2px ; background-color:white ; -webkit-transition:.4s ; transition:.4s ; border-radius:28px }

        /* Position/color ON-state */
        input:checked { position:absolute ; right:3px }
        input:checked + .slider { background-color:#42B4BF }
        input:checked + .slider:before {
            -webkit-transform: translateX(14px) translateY(1px) ;
            -ms-transform: translateX(14px) translateY(1px) ;
            transform: translateX(14px) }`

document.head.appendChild(styleNode)

// Create toggle label & add classes/HTML
var toggleLabel = document.createElement("div") // create label div
for (var link of document.querySelectorAll('a')) { // inspect sidebar links for classes
    if (link.innerHTML.includes('New chat')) { // focus on 'New chat'
        toggleLabel.setAttribute("class", link.classList) // borrow its classes
        break // stop looping since class assignment is done
}} ; updateToggleHTML()

// Insert full toggle on page load + during navigation
insertToggle()
var navObserver = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        if (mutation.type === 'childList' && mutation.addedNodes.length) {
            insertToggle()
}})})
navObserver.observe(document.documentElement, {childList: true, subtree: true});

// Toggle switch on label clicks too
document.addEventListener('click', event => {
    if (event.target == toggleLabel) {
        document.querySelector('#autoclearToggle').click()
}})

// Auto-clear chats if activated
var labels = ['Clear conversations', 'Confirm clear conversations'], labelCnt = 0
var clearObserver = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        if (mutation.addedNodes[0]?.innerHTML.includes(labels[0])) {
            clearAllMsgs() ; clearObserver.disconnect() }})
        // Also disconnect after 5sec to avoid clearing new convos
        setTimeout(function() { clearObserver.disconnect() }, 5000)
})
if (localStorage.getItem("autoclear") == 'true') {
    clearObserver.observe(document, {childList: true, subtree: true})
}

// Functions

function updateToggleHTML() {
    toggleLabel.innerHTML = `
        <img width="18px" src="https://i.imgur.com/TIIqQPv.png">
        Auto-clear ${localStorage.getItem("autoclear") == 'true' ? "enabled" : "disabled"}
        <label class="switch" >
            <input id="autoclearToggle" type="checkbox" ${localStorage.getItem("autoclear") == 'true' ? "checked='true'" : ""} 
                onclick="window.toggleAutoclear()" ><span class="slider"></span>
        </label>`
}

function insertToggle() {
    for (var nav of document.querySelectorAll('nav')) {
        if (!nav.contains(toggleLabel)) { // check if label exists first
            nav.insertBefore(toggleLabel, nav.childNodes[0]) // insert before 'New chat'
}}}

window.toggleAutoclear = function() {
    localStorage.setItem( // save setting
        'autoclear', true ? document.querySelector('input#autoclearToggle').checked : false)
    setTimeout(updateToggleHTML, 200) // sync label change w/ switch movement
}

function clearAllMsgs() {
    if (labelCnt >= labels.length) return
    for (var link of document.querySelectorAll('a')) {
        if (link.innerHTML.includes(labels[labelCnt])) {
            link.click() ; labelCnt++
            setTimeout(clearAllMsgs, 500) ; return
}}}
