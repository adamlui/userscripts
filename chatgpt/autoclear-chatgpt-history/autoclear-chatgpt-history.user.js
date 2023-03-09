// ==UserScript==
// @name             Autoclear ChatGPT History
// @version          2023.03.04.11
// @author           Adam Lui & Tripp1e
// @namespace        https://github.com/adamlui
// @description      Auto-clears chat history when visiting chat.openai.com
// @homepageURL      https://github.com/adamlui/userscripts
// @supportURL       https://github.com/adamlui/userscripts/issues
// @license          MIT
// @icon             https://www.google.com/s2/favicons?sz=48&domain=openai.com
// @icon64           https://www.google.com/s2/favicons?sz=64&domain=openai.com
// @compatible       chrome
// @compatible       edge
// @compatible       firefox
// @compatible       opera
// @compatible       brave
// @compatible       vivaldi
// @match            https://chat.openai.com/*
// @grant            GM_registerMenuCommand
// @grant            GM_unregisterMenuCommand
// @grant            GM_setValue
// @grant            GM_getValue
// @grant            unsafeWindow
// @run-at           document-end
// @grant            none
// @updateURL        https://greasyfork.org/scripts/460805/code/autoclear-chatgpt-history.meta.js
// @downloadURL      https://greasyfork.org/scripts/460805/code/autoclear-chatgpt-history.user.js
// ==/UserScript==

// Stylize toggle switch
var styleNode = document.createElement('style');
styleNode.innerHTML = `/* Stylize switch */
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
toggleLabel.setAttribute("onclick", "window.toggleAutoclear()") // link to toggleAutoclear()
for (var link of document.querySelectorAll('a')) { // inspect sidebar links for classes
    if (link.innerHTML.includes('New chat')) { // focus on 'New chat'
        toggleLabel.setAttribute("class", link.classList) // borrow its classes
        break // stop looping since class assignment is done
    }
};

updateToggleHTML();
var autoclearToggle = toggleLabel.querySelector('#autoclearToggle');

// Insert full toggle on page load + during navigation
// 在导航期间插入页面加载 + 的完整切换
insertToggle();
var navObserver = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
        if (mutation.type === 'childList' && mutation.addedNodes.length) {
            insertToggle();
        }
    })
})
navObserver.observe(document.documentElement, { childList: true, subtree: true })

// Auto-clear chats if activated
// 自动清除聊天是否激活
var labels = ['Clear conversations', 'Confirm clear conversations']
var clearObserver = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
        if (mutation.addedNodes[0]?.innerHTML?.includes(labels[0])) {
            clearAllMsgs(); clearObserver.disconnect()
        }
    })
    // Also disconnect after 5sec to avoid clearing new convos
    // 还要在5秒后断开连接,以避免清除新的频道
    setTimeout(function () { clearObserver.disconnect() }, 5000)
})

if (GM_getValue('chatGPT_autoclear', false)) {
    clearObserver.observe(document, { childList: true, subtree: true });
}

// Functions
// 功能
function updateToggleHTML() {
    let chatGPT_autoclear = false;
    if (autoclearToggle == null) {
        chatGPT_autoclear = GM_getValue("chatGPT_autoclear", false);
    } else {
        chatGPT_autoclear = autoclearToggle.checked;
        GM_setValue("chatGPT_autoclear", chatGPT_autoclear);
    }
    let state = ["enabled", "disabled"];
    toggleLabel.innerHTML = `<img width="18px" src="https://raw.githubusercontent.com/adamlui/userscripts/master/chatgpt/autoclear-chatgpt-history/navicon.png">
        Auto-clear ${state[chatGPT_autoclear == true ? 0 : 1]}
        <label class="switch" ><input id="autoclearToggle" type="checkbox" disabled="disabled"
            ${chatGPT_autoclear == true ? "checked='true'" : ""} >
            <span class="slider" disabled="disabled"></span></label>`;
    let hideCheckbox = GM_getValue("hideCheckbox", false);
    if (hideCheckbox) {
        toggleLabel.style.display = "none";
    }
}

function insertToggle() {
    for (var nav of document.querySelectorAll('nav')) {
        // check if label exists first
        // 检查标签是否首先存在
        if (!nav.contains(toggleLabel)) {
            // insert before 'New chat'
            // 在"新聊天"之前插入
            nav.insertBefore(toggleLabel, nav.childNodes[0]);
        }
    }
}

function debounce(fn, wait) {
    var timeout;
    return function () {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(fn, wait);
    }
}


unsafeWindow.toggleAutoclear = debounce(function () {
    autoclearToggle.checked = !autoclearToggle.checked;
    // save setting
    // 保存设置
    GM_setValue("chatGPT_autoclear", autoclearToggle.checked);
    // sync label change w/ switch movement
    // 同步标签更改带开关移动
    updateToggleHTML();
}, 100);

var labelCnt = 0
function clearAllMsgs() {
    if (labelCnt >= labels.length) return // exit if already confirmed
    for (var link of document.querySelectorAll('a')) {
        if (link.innerHTML.includes(labels[labelCnt])) {
            link.click(); labelCnt++
            setTimeout(clearAllMsgs, 500); return // repeat to confirm
        }
    }
}

var MenuId = [];

function registerMenu() {
    let state = ["×", "√"];
    let hideCheckbox = GM_getValue("hideCheckbox", false);
    MenuId.push(GM_registerMenuCommand("Hide Checkbox " + state[+hideCheckbox], function () {
        GM_setValue("hideCheckbox", !hideCheckbox);
        hideCheckbox = GM_getValue("hideCheckbox", false);
        if (hideCheckbox) {
            toggleLabel.style.display = "none";
        } else {
            toggleLabel.style.display = "block";
        }
        reRegisterMenu();
    }));
}

function unregisterMenu() {
    for (var id of MenuId) {
        GM_unregisterMenuCommand(id);
    }
}

function reRegisterMenu() {
    unregisterMenu();
    registerMenu();
}

registerMenu();