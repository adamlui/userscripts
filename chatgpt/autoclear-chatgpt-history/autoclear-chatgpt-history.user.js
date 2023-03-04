// ==UserScript==
// @name             Autoclear ChatGPT History
// @version          2023.03.03
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

var labels = ['Clear conversations', 'Confirm clear conversations']
var observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    if (mutation.addedNodes[0]?.innerHTML.includes(labels[0])) {
      clearAllMsgs() ; observer.disconnect() }})
    // Also disconnect after 5sec to avoid clearing new convos
    setTimeout(function() { observer.disconnect() }, 5000)
})
observer.observe(document, {childList: true, subtree: true})

var labelCnt = 0
function clearAllMsgs() {
    if (labelCnt >= labels.length) return
    var links = document.querySelectorAll('a')
    for (var i = 0; i < links.length; i++) {
        if (links[i].innerHTML.includes(labels[labelCnt])) {
            links[i].click() ; labelCnt++
            setTimeout(clearAllMsgs, 500) ; return
}}}
