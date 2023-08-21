// ==UserScript==
// @name                GitHub Widescreen 🖥️
// @name:zh             GitHub 宽银幕 🖥️
// @name:zh-CN          GitHub 宽银幕 🖥️
// @name:zh-HK          GitHub 寬銀幕 🖥️
// @name:zh-SG          GitHub 宽银幕 🖥️
// @name:zh-TW          GitHub 寬銀幕 🖥️
// @description         Auto-hides obtrusive side panels on GitHub
// @description:zh      自动隐藏 GitHub 上引人注目的侧面板
// @description:zh-CN   自动隐藏 GitHub 上引人注目的侧面板
// @description:zh-HK   自動隱藏 GitHub 上引人注目的側面板
// @description:zh-SG   自动隐藏 GitHub 上引人注目的侧面板
// @description:zh-TW   自動隱藏 GitHub 上引人注目的側面板
// @author              Adam Lui
// @namespace           https://github.com/adamlui
// @version             2023.8.21
// @license             MIT
// @icon                https://github.githubassets.com/favicons/favicon.png
// @match               *://github.com/*
// @downloadURL         https://greasyfork.org/scripts/473439/code/github-widescreen.user.js
// @updateURL           https://greasyfork.org/scripts/473439/code/github-widescreen.meta.js
// @homepageURL         https://github.com/adamlui/github-widescreen
// @supportURL          https://github.com/adamlui/github-widescreen/issues
// ==/UserScript==

(async () => {

    // Observe DOM for need to hide side panels
    const hideBtns = [] ; let prevURL = null
    const panelObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList' && mutation.addedNodes.length) {
                if (window.location.href !== prevURL) { // if loaded/naved to new page

                    // Detect hide buttons
                    setTimeout(() => {
                        hideBtns.push(...document.querySelectorAll(
                            // File Tree + Symbols Panel buttons in editor
                            'button[aria-expanded="true"][data-testid], '
                            // Hide File Tree button in diff views
                            + 'button[id^="hide"]:not([hidden])'))                        
                        if (hideBtns.length > 0) // click if needed
                            hideBtns.forEach((btn) => { btn.click() })
                    }, window.location.href.includes('edit') ? 1000 : 0)

                    prevURL = window.location.href

    }}})}) ; panelObserver.observe(document.documentElement, { childList: true, subtree: true })

})()
