// ==UserScript==
// @name             Autoclear ChatGPT History
// @version          2023.02.26.1
// @author           Adam Lui & Tripp1e
// @namespace        https://github.com/adamlui
// @description      Auto-clears chat history when visiting chat.openai.com
// @homepageURL      https://github.com/adamlui/userscripts
// @supportURL       https://github.com/adamlui/userscripts/issues
// @license          MIT
// @icon             https://openai.com/favicon.ico
// @compatible       chrome
// @compatible       edge
// @compatible       firefox
// @compatible       opera
// @compatible       brave
// @compatible       vivaldi
// @match            https://chat.openai.com/*
// @run-at           document-end
// @grant            none
// ==/UserScript==

var labels = ['Clear conversations', 'Confirm clear conversations']
var observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    if (mutation.addedNodes[0]?.innerHTML.includes(labels[0])) {
      clearAllMsgs() ; observer.disconnect()
}})})
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
