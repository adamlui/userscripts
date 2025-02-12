// ==UserScript==
// @name                GitHub Star History ⭐
// @name:zh             GitHub 之星历史 ⭐
// @name:zh-CN          GitHub 之星历史 ⭐
// @name:zh-HK          GitHub 之星曆史 ⭐
// @name:zh-SG          GitHub 之星历史 ⭐
// @name:zh-TW          GitHub 之星曆史 ⭐
// @description         Adds star history chart to sidebar of GitHub repos
// @description:zh      将明星历史图表添加到 GitHub 存储库的侧边栏
// @description:zh-CN   将明星历史图表添加到 GitHub 存储库的侧边栏
// @description:zh-HK   將明星曆史圖表添加到 GitHub 存儲庫的側邊欄
// @description:zh-SG   将明星历史图表添加到 GitHub 存储库的侧边栏
// @description:zh-TW   將明星曆史圖表添加到 GitHub 存儲庫的側邊欄
// @author              Adam Lui
// @namespace           https://github.com/adamlui
// @version             2025.2.12
// @license             MIT
// @icon                https://github.githubassets.com/favicons/favicon.png
// @compatible          chrome
// @compatible          firefox
// @compatible          edge
// @compatible          brave
// @match               *://github.com/*
// @connect             api.star-history.com
// @connect             cdn.jsdelivr.net
// @connect             raw.githubusercontent.com
// @require             https://cdn.jsdelivr.net/npm/@kudoai/chatgpt.js@3.6.3/dist/chatgpt.min.js#sha256-pqYk/Y2iYTPCeA6kM8vQXxzv55idgp9Q4Lcz82+0VIw=
// @grant               GM_registerMenuCommand
// @grant               GM_openInTab
// @grant               GM_xmlhttpRequest
// @grant               GM.xmlHttpRequest
// @downloadURL         https://raw.githubusercontent.com/adamlui/github-star-history/main/greasemonkey/github-star-history.user.js
// @updateURL           https://raw.githubusercontent.com/adamlui/github-star-history/main/greasemonkey/github-star-history.user.js
// @homepageURL         https://github.com/adamlui/github-star-history
// @supportURL          https://github.com/adamlui/github-star-history/issues
// @contributionURL     https://github.com/sponsors/adamlui
// ==/UserScript==

(async () => {

    // Init ENV context
    const env = { browser: { isPhone: chatgpt.browser.isMobile() && window.innerWidth <= 480 }},
          xhr = typeof GM != 'undefined' && GM.xmlHttpRequest || GM_xmlhttpRequest

    // Init APP info
    const app = {
        latestResourceCommitHash: '27cf60e',
        urls: { update: 'https://raw.githubusercontent.com/adamlui/github-star-history/main/greasemonkey/github-star-history.user.js' }
    }
    app.urls.resourceHost = `https://cdn.jsdelivr.net/gh/adamlui/github-star-history@${app.latestResourceCommitHash}`
    const remoteAppData = await new Promise(resolve => xhr({
        method: 'GET', url: `${app.urls.resourceHost}/assets/data/app.json`,
        onload: resp => resolve(JSON.parse(resp.responseText))
    }))
    Object.assign(app, { ...remoteAppData, urls: { ...app.urls, ...remoteAppData.urls }})

    // Define SCRIPT functions

    function safeWinOpen(url) { open(url, '_blank', 'noopener') } // to prevent backdoor vulnerabilities

    function updateCheck() {

        // Fetch latest meta
        const currentVer = GM_info.script.version
        xhr({
            method: 'GET', url: app.urls.update + '?t=' + Date.now(),
            headers: { 'Cache-Control': 'no-cache' },
            onload: response => { const updateAlertWidth = 377

                // Compare versions
                app.latestVer = /@version +(.*)/.exec(response.responseText)?.[1]
                if (app.latestVer) for (let i = 0 ; i < 4 ; i++) { // loop thru subver's
                    const currentSubVer = parseInt(currentVer.split('.')[i], 10) || 0,
                          latestSubVer = parseInt(app.latestVer.split('.')[i], 10) || 0
                    if (currentSubVer > latestSubVer) break // out of comparison since not outdated
                    else if (latestSubVer > currentSubVer) { // if outdated

                        // Alert to update
                        chatgpt.alert('🚀 Update available!', // title
                            `A newer version of ${app.name} v${app.latestVer} is available!  `
                                + '<a target="_blank" rel="noopener" style="font-size: 0.9rem" href="'
                                    + `${app.urls.gitHub}/commits/main/greasemonkey/${app.slug}.user.js`
                                + '">View changes</a>',
                            function update() { // button
                                GM_openInTab(app.urls.update.replace('meta.js', 'user.js') + '?t=' + Date.now(),
                                    { active: true, insert: true } // focus, make adjacent
                                ).onclose = () => location.reload()
                            },
                            '', updateAlertWidth // width
                        )

                        return
                }}

                // Alert to no update
                chatgpt.alert('Up to date!', `${app.name} (v${currentVer}) is up to date!`)
    }})}

    function isDarkMode() {
        return document.documentElement.dataset.colorMode == 'dark'
            || document.documentElement.dataset.darkreaderScheme == 'dark'
            || window.matchMedia?.('(prefers-color-scheme: dark)')?.matches
    }

    // Define CHART functions

    function sanitizeImgURL(url) {
        if (!url.startsWith('https://api.star-history.com/svg'))
            throw new Error('>> Invalid URL')
        return url
    }

    function getUserAndRepoOfCurrentPage() {
        const reGitHubURL = /github\.com\/(?<user>[\w-]+)\/(?<repo>[\w.-]+)\/?/,
            currentURL = location.href,
            groups = reGitHubURL.exec(currentURL)?.groups
        if (!groups?.user || !groups?.repo)
            throw new Error(`Invalid Github repository URL: ${currentURL}`)
        return groups
    }

    async function insertStarHistory() {
        const { user, repo } = getUserAndRepoOfCurrentPage()

        try { // to load/insert star history chart

            // Fetch image as blob
            const imgURL = sanitizeImgURL('https://api.star-history.com/svg?repos='
                + `${user}/${repo}&type=Date` + (isDarkMode() ? '&theme=dark' : ''))
            const response = await new Promise((resolve, reject) => xhr({
                method: 'GET', url: imgURL, responseType: 'blob', onload: resolve, onerror: reject
            }))
            if (response.status != 200) throw new Error('>> Failed to fetch image')

            if (!document.querySelector('#star-history')) {

                // Convert blob to data URL
                const imgDataURL = await new Promise(resolve => {
                    const reader = new FileReader()
                    reader.onload = () => resolve(reader.result)
                    reader.readAsDataURL(response.response)
                })

                // Create/size/pad star history img
                const starHistoryImg = document.createElement('img')
                starHistoryImg.style.width = '100%'; starHistoryImg.style.padding = '20px 0'
                starHistoryImg.src = imgDataURL

                // Create #star-history div, add attrs/img/listener
                const starHistoryDiv = document.createElement('div')
                starHistoryDiv.id = 'star-history'; starHistoryDiv.style.cursor = 'crosshair'
                starHistoryDiv.append(starHistoryImg)
                starHistoryDiv.onclick = () => zoomStarHistory(imgDataURL)

                // Insert div
                const aboutSection = document.querySelector('.about-margin > div')
                aboutSection.insertAdjacentElement('afterend', starHistoryDiv)

                // Add top button to show chart on phones
                if (env.browser.isPhone) insertPhoneBtn(imgDataURL)
            }

        } catch (err) { console.error('>> Error loading star history chart:', err) }
    }

    function insertPhoneBtn(imgDataURL) {
        if (document.getElementById('zoomStarHistoryBtn')) return
        const repoBtnsDiv = document.querySelector('#responsive-meta-container .d-flex.gap-2.mt-n3.mb-3.flex-wrap')
        if (!repoBtnsDiv) return

        // Create/config button elems
        const zoomStarHistoryBtn = document.createElement('button')
        zoomStarHistoryBtn.style.padding = '4px 7px 0' // center star logo
        Object.assign(zoomStarHistoryBtn, {
            id: 'zoomStarHistoryBtn', type: 'button', className: 'btn btn-sm tooltipped tooltipped-s',
            onclick: () => zoomStarHistory(imgDataURL)
        })
        zoomStarHistoryBtn.dataset.showDialogId = 'repo-delete-menu-dialog'
        zoomStarHistoryBtn.dataset.viewComponent = true

        // Create/config button spans
        const outerBtnSpan = document.createElement('span')
        outerBtnSpan.classList.add('Button-content')
        const innerBtnSpan = document.createElement('span')
        Object.assign(innerBtnSpan, { className: 'Button-label tooltipped tooltipped-s', ariaLabel: 'Star History' })

        // Create/config SVG elems
        const btnSVG = createSVGelem('svg', {
            version: '1.1', viewBox: '0 0 64 64', width: '16px', height: '16px',
            style: 'shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd'
        })
        const svgPath1 = createSVGelem('path', {
            style: 'opacity :0.76', fill: 'currentColor',
            d: 'M 63.5,33.5 C 63.5,34.5 63.5,35.5 63.5,36.5C 58.7514,40.2077 53.4181,42.8743 47.5,44.5C 45.9969,51.0438 43.9969,57.3771 41.5,63.5C 40.1667,63.5 38.8333,63.5 37.5,63.5C 34.1218,60.1239 31.1218,56.4572 28.5,52.5C 28.8966,51.475 29.5632,51.3083 30.5,52C 32.7089,53.8734 34.5422,56.04 36,58.5C 36.5,58 37,57.5 37.5,57C 33.0463,52.5508 29.3796,47.5508 26.5,42C 26.7432,41.0979 27.0766,40.2646 27.5,39.5C 28.7899,40.0577 29.6232,41.0577 30,42.5C 33.2391,40.648 36.7391,39.648 40.5,39.5C 40.6646,36.4816 40.498,33.4816 40,30.5C 37.1383,28.9296 34.3049,27.263 31.5,25.5C 29.8144,26.8569 28.1477,28.1902 26.5,29.5C 25.6236,29.6309 24.9569,29.2975 24.5,28.5C 29.8152,23.1463 29.1486,22.4797 22.5,26.5C 21.8933,26.3764 21.56,26.0431 21.5,25.5C 25.2992,23.6276 25.2992,21.9609 21.5,20.5C 27.6877,20.5267 33.1877,22.86 38,27.5C 38.7504,26.8742 39.5838,26.3742 40.5,26C 35.5908,22.8756 29.5908,19.8756 22.5,17C 21.1175,15.5391 21.4508,14.7058 23.5,14.5C 25.91,15.0629 28.2433,15.5629 30.5,16C 33.7853,11.0463 37.452,6.37966 41.5,2C 45.029,-0.379275 47.529,0.454059 49,4.5C 49.032,11.8717 49.1987,19.2051 49.5,26.5C 54.5427,28.2445 59.2094,30.5778 63.5,33.5 Z M 41.5,12.5 C 42.0967,12.7352 42.4301,13.2352 42.5,14C 41.8148,16.7952 41.3148,19.6285 41,22.5C 39.1839,21.6705 37.3506,20.8372 35.5,20C 37.3336,17.3367 39.3336,14.8367 41.5,12.5 Z M 47.5,33.5 C 51.2965,34.9114 51.2965,35.9114 47.5,36.5C 47.5,35.5 47.5,34.5 47.5,33.5 Z M 34.5,47.5 C 35.8333,47.5 37.1667,47.5 38.5,47.5C 37.5954,53.9632 36.2621,53.9632 34.5,47.5 Z'
        })
        const svgPath2 = createSVGelem('path', {
            style: 'opacity: .71', fill: 'currentColor',
            d: 'M 23.5,14.5 C 21.4508,14.7058 21.1175,15.5391 22.5,17C 29.5908,19.8756 35.5908,22.8756 40.5,26C 39.5838,26.3742 38.7504,26.8742 38,27.5C 33.1877,22.86 27.6877,20.5267 21.5,20.5C 19.2965,19.0538 16.9631,18.2204 14.5,18C 15.8554,21.2118 17.3554,24.3785 19,27.5C 19.7083,26.6195 20.5416,25.9528 21.5,25.5C 21.56,26.0431 21.8933,26.3764 22.5,26.5C 29.1486,22.4797 29.8152,23.1463 24.5,28.5C 24.9569,29.2975 25.6236,29.6309 26.5,29.5C 25.1999,30.8267 23.8665,32.16 22.5,33.5C 24.1897,35.5193 25.8564,37.5193 27.5,39.5C 27.0766,40.2646 26.7432,41.0979 26.5,42C 29.3796,47.5508 33.0463,52.5508 37.5,57C 37,57.5 36.5,58 36,58.5C 34.5422,56.04 32.7089,53.8734 30.5,52C 29.5632,51.3083 28.8966,51.475 28.5,52.5C 27.7387,51.6091 26.7387,50.9424 25.5,50.5C 18.553,51.9205 11.553,52.4205 4.5,52C 3.19551,51.196 2.52884,50.0293 2.5,48.5C 6.30907,43.5097 9.97574,38.3431 13.5,33C 11.5293,28.892 9.69592,24.7253 8,20.5C 7.33333,16.8333 7.33333,13.1667 8,9.5C 8.73869,8.42575 9.73869,7.75908 11,7.5C 15.8157,8.84699 19.9824,11.1803 23.5,14.5 Z M 21.5,20.5 C 25.2992,21.9609 25.2992,23.6276 21.5,25.5C 20.5416,25.9528 19.7083,26.6195 19,27.5C 17.3554,24.3785 15.8554,21.2118 14.5,18C 16.9631,18.2204 19.2965,19.0538 21.5,20.5 Z M 25,42 C 25.8297,40.5295 26.9956,38.2066 28.5,36C 27.5056,34.7603 26.0778,33.6204 25,32.5C 23.4918,34.4059 21.4906,36.6554 20,38.5C 18.9282,37.2717 18.25,35.8398 18,34.5C 17.25,35.75 16.1667,37.1667 15,38C 14.5,38.5 14.5,39.5 15,40C 16.9993,40.6089 19.1075,39.5245 21,38C 21.6706,39.5368 22.0079,41.0933 22.5,42.5C 21.4079,43.9192 21.5,45.5684 22.5,47C 22.5,46 22.5,45 23,44C 23.5295,43.3543 24.5,43 25,42 Z'
        })

        // Assemble all elems
        btnSVG.append(svgPath1, svgPath2)
        innerBtnSpan.append(btnSVG) ; outerBtnSpan.append(innerBtnSpan)
        zoomStarHistoryBtn.append(outerBtnSpan)

        // Append button to GitHub
        repoBtnsDiv.prepend(zoomStarHistoryBtn)

        function createSVGelem(type, attrs) {
            const elem = document.createElementNS('http://www.w3.org/2000/svg', type)
            for (const attr in attrs) elem.setAttributeNS(null, attr, attrs[attr])
            return elem
        }
    }

    function zoomStarHistory(imgURL) {
        const { user, repo } = getUserAndRepoOfCurrentPage()

        // Create/stylize overlay
        const overlay = document.createElement('div')
        overlay.style.position = 'fixed'; overlay.style.top = '0'; overlay.style.left = '0'
        overlay.style.width = '100%'; overlay.style.height = '100%'
        overlay.style.backgroundColor = 'rgba(0,0,0,0.7)'; overlay.style.display = 'flex'
        overlay.style.alignItems = 'center'; overlay.style.justifyContent = 'center'
        overlay.style.zIndex = '9999'

        // Stylize zoomed img
        const zoomedImg = new Image()
        zoomedImg.title = 'View on star-history.com'; zoomedImg.src = imgURL
        zoomedImg.style.maxWidth = '90%'; zoomedImg.style.maxHeight = '90%'
        zoomedImg.style.cursor = 'pointer'

        // Add listeners
        zoomedImg.onclick = () => // view on star-history.com
            safeWinOpen(`https://star-history.com/#${user}/${repo}&Date`)
        overlay.onclick = () => document.body.removeChild(overlay)

        // Append elements
        overlay.append(zoomedImg); document.body.append(overlay)
    }

    // Run MAIN routine

    // Register ABOUT menu command
    GM_registerMenuCommand(`💡 About ${app.name}`, async () => {

        // Show alert
        const headingStyle = 'font-size: 1.15rem ; font-weight: bold',
            pStyle = 'font-size: 1rem ; position: relative ; left: 3px',
            pBrStyle = 'font-size: 1rem ; position: relative ; left: 9px ; bottom: 3px '
        const aboutAlertID = chatgpt.alert(
            app.name, // title
            `<span style="${headingStyle}">🏷️ <i>Version</i>: </span>`
            + `<span style="${pStyle}">${GM_info.script.version}</span>\n`
            + `<span style="${headingStyle}">📜 <i>Source code</i>:</span>\n`
            + `<span style="${pBrStyle}"><a href="${app.urls.gitHub}" target="_blank" rel="nopener">`
            + app.urls.gitHub + '</a></span>',
            [ // buttons
                function checkForUpdates() { updateCheck() },
                function getSupport() { safeWinOpen(app.urls.support) },
                function discuss() { safeWinOpen(app.urls.discuss) }
            ])

        // Re-format buttons to include emojis + re-case + hide 'Dismiss'
        for (const button of document.getElementById(aboutAlertID).querySelectorAll('button')) {
            if (/updates/i.test(button.textContent))
                button.textContent = '🚀 Check for Updates'
            else if (/support/i.test(button.textContent))
                button.textContent = '🧠 Get Support'
            else if (/discuss/i.test(button.textContent))
                button.textContent = '🗨️ Discuss'
            else button.style.display = 'none' // hide Dismiss button
        }
    })

    // Observe DOM for need to insert star history
    let starHistoryAdded = false, prevURL = location.href
    new MutationObserver(mutations => mutations.forEach(mutation => {
        if (mutation.type == 'childList' && mutation.addedNodes.length) {
            const onRepoPage = !!document.querySelector('meta[name="route-pattern"][content*="/:repository"]')
            if (location.href != prevURL) { prevURL = location.href; starHistoryAdded = false }
            if (onRepoPage && !starHistoryAdded) { insertStarHistory(); starHistoryAdded = true }
        }
    })).observe(document.documentElement, { childList: true, subtree: true })

})()
