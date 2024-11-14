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
// @version             2024.11.14.1
// @license             MIT
// @icon                https://github.githubassets.com/favicons/favicon.png
// @match               *://github.com/*
// @connect             update.greasyfork.org
// @require             https://cdn.jsdelivr.net/npm/@kudoai/chatgpt.js@3.3.5/dist/chatgpt.min.js#sha256-rfC4kk8q0byrafp7X0Qf9vaa3JNvkHRwNnUt6uL2hUE=
// @grant               GM_registerMenuCommand
// @grant               GM_openInTab
// @grant               GM.xmlHttpRequest
// @downloadURL         https://update.greasyfork.org/scripts/473439/github-widescreen.user.js
// @updateURL           https://update.greasyfork.org/scripts/473439/github-widescreen.meta.js
// @homepageURL         https://github.com/adamlui/github-widescreen
// @supportURL          https://github.com/adamlui/github-widescreen/issues
// ==/UserScript==

(async () => {

    // Init CONFIG
    const config = {
        appName: 'GitHub Widescreen', appSymbol: '🖥️',
        gitHubURL: 'https://github.com/adamlui/github-widescreen',
        greasyForkURL: 'https://greasyfork.org/scripts/473439-github-widescreen' }
    config.updateURL = config.greasyForkURL.replace('https://', 'https://update.')
        .replace(/(\d+)-?([a-z-]*)$/i, (_, id, name) => `${ id }/${ !name ? 'script' : name }.meta.js`)

    // Register ABOUT menu command
    GM_registerMenuCommand('💡 About ' + config.appName, async () => {

        // Show alert
        const headingStyle = 'font-size: 1.15rem ; font-weight: bold',
              pStyle = 'font-size: 1rem ; position: relative ; left: 3px',
              pBrStyle = 'font-size: 1rem ; position: relative ; left: 9px ; bottom: 3px '
        const aboutAlertID = chatgpt.alert(
            config.appName, // title
            `<span style="${ headingStyle }">🏷️ <i>Version</i>: </span>`
                + `<span style="${ pStyle }">${ GM_info.script.version }</span>\n`
            + `<span style="${ headingStyle }">📜 <i>Source code</i>:</span>\n`
                + `<span style="${ pBrStyle }"><a href="${ config.gitHubURL }" target="_blank" rel="nopener">`
                + config.gitHubURL + '</a></span>',
            [ // buttons
                function checkForUpdates() { updateCheck() },
                function leaveAReview() { safeWindowOpen(
                    config.greasyForkURL + '/feedback#post-discussion') }
            ])

        // Re-format buttons to include emojis + re-case + hide 'Dismiss'
        for (const button of document.getElementById(aboutAlertID).querySelectorAll('button')) {
            if (/updates/i.test(button.textContent))
                button.textContent = '🚀 Check for Updates'
            else if (/review/i.test(button.textContent))
                button.textContent = '⭐ Leave a Review'
            else if (/github/i.test(button.textContent))
                button.textContent = '📜 GitHub Source'
            else button.style.display = 'none' // hide Dismiss button
        }
    })

    // Observe DOM for need to hide side panels
    const hideBtns = [] ; let prevURL = null
    const sidePanelObserver = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.type == 'childList' && mutation.addedNodes.length) {
                if (location.href !== prevURL) { // if loaded/naved to new page
                    if (location.href.includes('edit')) { // if on editor, wait for side panel load
                        const editorSidePanelobserver = new MutationObserver(() => {
                            if (document.querySelector('[data-testid="editor-side-panel"]')) {
                                editorSidePanelobserver.disconnect() ; hideSidePanels()
                        }}) ; editorSidePanelobserver.observe(document.body, { childList: true, subtree: true })
                    } else hideSidePanels()
                    prevURL = location.href
    }}})}) ; sidePanelObserver.observe(document.documentElement, { childList: true, subtree: true })

    // Define SCRIPT functions

    function safeWindowOpen(url) { window.open(url, '_blank', 'noopener') } // to prevent backdoor vulnerabilities

    function updateCheck() {

        // Fetch latest meta
        const currentVer = GM_info.script.version
        GM.xmlHttpRequest({
            method: 'GET', url: config.updateURL + '?t=' + Date.now(),
            headers: { 'Cache-Control': 'no-cache' },
            onload: response => { const latestVer = /@version +(.*)/.exec(response.responseText)[1]

                // Compare versions                
                for (let i = 0 ; i < 4 ; i++) { // loop thru subver's
                    const currentSubVer = parseInt(currentVer.split('.')[i], 10) || 0,
                          latestSubVer = parseInt(latestVer.split('.')[i], 10) || 0
                    if (currentSubVer > latestSubVer) break // out of comparison since not outdated
                    else if (latestSubVer > currentSubVer) { // if outdated

                        // Alert to update
                        chatgpt.alert('Update available! 🚀', // title
                            `A newer version of ${ config.appName } v${ latestVer } is available!  `
                                + '<a target="_blank" rel="noopener" style="font-size: 0.9rem" '
                                    + 'href="' + config.gitHubURL + '/commits/main/greasemonkey/'
                                    + config.updateURL.replace(/[^/]*\/([^/]*?)meta\.js/, '$1user.js') + '" '
                                    + '>View changes</a>',
                            function update() { // button
                                GM_openInTab(config.updateURL.replace('meta.js', 'user.js') + '?t=' + Date.now(),
                                    { active: true, insert: true } // focus, make adjacent
                                ).onclose = () => location.reload() },
                            '', 383 // width
                        )
                        return
                }}

                chatgpt.alert('Up to date!', `${ config.appName } (v${ currentVer }) is up-to-date!`)
    }})}

    function isDarkMode() {
        return document.documentElement.dataset.colorMode == 'dark' ||
               document.documentElement.dataset.darkreaderScheme == 'dark' ||
               window.matchMedia?.('(prefers-color-scheme: dark)')?.matches
    }

    function hideSidePanels() {
        hideBtns.push(...document.querySelectorAll(
            // File Tree + Symbols Panel buttons in editor
            'button[aria-expanded="true"][data-testid], '
            // Hide File Tree button in diff views
            + 'button[id^="hide"]:not([hidden])'))
        if (hideBtns.length > 0) // click if needed
            hideBtns.forEach(btn => { btn.click() })
    }

})()
