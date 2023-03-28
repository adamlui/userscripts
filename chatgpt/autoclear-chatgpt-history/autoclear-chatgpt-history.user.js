// ==UserScript==
// @name             Autoclear ChatGPT History
// @version          2023.03.28
// @author           Adam Lui, Tripp1e & Xiao-Ying Yo
// @description      Auto-clears chat history when visiting chat.openai.com
// @namespace        https://github.com/adamlui
// @namespace        https://github.com/Tripp1e
// @namespace        https://github.com/XiaoYingYo
// @homepageURL      https://github.com/adamlui/userscripts
// @supportURL       https://github.com/adamlui/userscripts/issues
// @license          MIT
// @icon             https://raw.githubusercontent.com/adamlui/userscripts/master/chatgpt/media/icons/openai-favicon48.png
// @icon64           https://raw.githubusercontent.com/adamlui/userscripts/master/chatgpt/media/icons/openai-favicon64.png
// @compatible       chrome
// @compatible       edge
// @compatible       firefox
// @compatible       opera
// @compatible       brave
// @compatible       vivaldi
// @compatible       librewolf
// @compatible       qq
// @match            https://chat.openai.com/*
// @run-at           document-end
// @grant            GM_setValue
// @grant            GM_getValue
// @grant            GM_registerMenuCommand
// @grant            GM_unregisterMenuCommand
// @updateURL        https://greasyfork.org/scripts/460805/code/autoclear-chatgpt-history.meta.js
// @downloadURL      https://greasyfork.org/scripts/460805/code/autoclear-chatgpt-history.user.js
// ==/UserScript==

// NOTE: This script uses code from the powerful chatgpt.js library @ https://chatgptjs.org (c) 2023 Adam Lui & 冯不游 under the MIT license.

(function () {

    // Import chatgpt.js functions

    var navLinkLabels = {
        clearChats: 'Clear conversations',
        confirmClearChats: 'Confirm clear conversations'
    };

    var chatgpt = {
        clearChats: function() {
            if (!this.clearChats.cnt) this.clearChats.cnt = 0;
            for (var navLink of document.querySelectorAll('nav > a')) {
                if (navLink.text.includes(navLinkLabels[(
                        this.clearChats.cnt > 0 ? 'confirmC' : 'c') + 'learChats'])) {
                    navLink.click(); this.clearChats.cnt++;
                    if (this.clearChats.cnt < 2) { // repeat to confirm
                        setTimeout(this.clearChats.bind(this), 500);
                    } else { this.clearChats.cnt = 0; }
                    return; // break navLink loop
        }}}
    };

    // Define script functions

    function registerMenu() {
        var menuID = [] // to store registered commands for removal while preserving order

        // Add 'Toggle Visibility' command
        var tvStateSymbol = ['✔️', '❌']
        var tvStateWord = ['ON', 'OFF']
        var tvLabel = tvStateSymbol[+config.toggleHidden] + ' Toggle Visibility'
            + (getUserscriptManager() === 'Tampermonkey' ? ' — ' : ': ')
            + tvStateWord[+config.toggleHidden]
        menuID.push(GM_registerMenuCommand(tvLabel, function () {
            saveSetting('toggleHidden', !config.toggleHidden)
            toggleLabel.style.display = config.toggleHidden ? 'none' : 'flex' // toggle visibility
            for (var id of menuID) { GM_unregisterMenuCommand(id) }; registerMenu() // refresh menu
        }))
    }

    function getUserscriptManager() {
        try { return GM_info.scriptHandler } catch (error) { return "other" }}

    function loadSetting(...keys) {
        keys.forEach(function (key) {
            config[key] = GM_getValue(configKeyPrefix + key, false)
    })}

    function saveSetting(key, value) {
        GM_setValue(configKeyPrefix + key, value) // save to browser
        config[key] = value // and memory
    }

    function updateToggleHTML() {
        toggleLabel.innerHTML = `
            <img width="18px" src="https://raw.githubusercontent.com/adamlui/autoclear-chatgpt-history/main/media/images/navicon.png">
            Auto-clear ${config.autoclear ? 'enabled' : 'disabled'}
            <label class="switch" ><input id="autoclearToggle" type="checkbox"
                ${config.autoclear ? "checked='true'" : ""} >
                <span class="slider"></span></label>`
        toggleLabel.style.display = config.toggleHidden ? 'none' : 'flex'
    }

    function insertToggle() {
        for (var nav of document.querySelectorAll('nav')) {
            if (!nav.contains(toggleLabel)) { // check if label exists first // 检查标签是否首先存在
                nav.insertBefore(toggleLabel, nav.childNodes[0]) // insert before 'New chat'// 在"新聊天"之前插入
    }}}

    function toggleAutoclear() {
        var toggleInput = document.querySelector('#autoclearToggle')
        if (event.target == toggleLabel) toggleInput.click() // to avoid double-toggle
        setTimeout(updateToggleHTML, 200) // sync label change w/ switch movement
        saveSetting('autoclear', toggleInput.checked)
    }

    // Run main routine

    // Initialize script
    var config = {}, configKeyPrefix = 'chatGPTac_' // initialize config variables
    loadSetting('autoclear', 'toggleHidden') // load script settings
    registerMenu() // create browser toolbar menu

    // Stylize toggle switch
    var switchStyle = document.createElement('style')
    switchStyle.innerHTML = `/* Stylize switch */
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

    document.head.appendChild(switchStyle)

    // Create toggle label & add listener/classes/HTML
    var toggleLabel = document.createElement("div") // create label div
    toggleLabel.addEventListener('click', (event) => { toggleAutoclear(event) })
    for (var link of document.querySelectorAll('a')) { // inspect sidebar links for classes
        if (link.innerHTML.includes('New chat')) { // focus on 'New chat'
            toggleLabel.setAttribute("class", link.classList) // borrow its classes
            break // stop looping since class assignment is done
        }
    } ; updateToggleHTML()

    // Insert full toggle on page load + during navigation // 在导航期间插入页面加载 + 的完整切换
    insertToggle()
    var navObserver = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (mutation.type === 'childList' && mutation.addedNodes.length) {
                insertToggle()
    }})})
    navObserver.observe(document.documentElement, { childList: true, subtree: true })

    // Auto-clear chats if activated // 自动清除聊天是否激活
    var clearObserver = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (mutation.addedNodes[0]?.innerHTML.includes('Clear conversations')) {
                chatgpt.clearChats(); clearObserver.disconnect()
    }})})
    if (config.autoclear) {
        clearObserver.observe(document, { childList: true, subtree: true })
        // Auto-disconnect after 2.5sec to avoid clearing new chats // 还要在2.5秒后断开连接,以避免清除新的频道
        setTimeout(function () { clearObserver.disconnect() }, 2500)
    }

})()
