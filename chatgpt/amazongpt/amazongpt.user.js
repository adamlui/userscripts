// ==UserScript==
// @name                   AmazonGPT 🤖
// @description            Adds the magic of AI to Amazon shopping
// @author                 KudoAI
// @namespace              https://kudoai.com
// @version                2024.12.15.8
// @license                MIT
// @icon                   https://amazongpt.kudoai.com/assets/images/icons/amazongpt/black-gold-teal/icon48.png?v=0fddfc7
// @icon64                 https://amazongpt.kudoai.com/assets/images/icons/amazongpt/black-gold-teal/icon64.png?v=0fddfc7
// @compatible             chrome except for Streaming Mode w/ Tampermonkey (use ScriptCat instead)
// @compatible             firefox
// @compatible             edge except for Streaming Mode w/ Tampermonkey (use ScriptCat instead)
// @compatible             opera
// @compatible             operagx
// @compatible             brave except for Streaming Mode w/ Tampermonkey (use ScriptCat instead)
// @compatible             vivaldi except for Streaming Mode w/ Tampermonkey (use ScriptCat instead)
// @compatible             waterfox
// @compatible             librewolf
// @compatible             ghost
// @compatible             qq
// @compatible             whale
// @compatible             kiwi
// @compatible             mask
// @match                  *://www.amazon.com/*
// @match                  *://www.amazon.ae/*
// @match                  *://www.amazon.com.be/*
// @match                  *://www.amazon.ca/*
// @match                  *://www.amazon.cn/*
// @match                  *://www.amazon.co.jp/*
// @match                  *://www.amazon.co.uk/*
// @match                  *://www.amazon.co.za/*
// @match                  *://www.amazon.com.au/*
// @match                  *://www.amazon.com.br/*
// @match                  *://www.amazon.com.mx/*
// @match                  *://www.amazon.com.tr/*
// @match                  *://www.amazon.com/*
// @match                  *://www.amazon.de/*
// @match                  *://www.amazon.eg/*
// @match                  *://www.amazon.es/*
// @match                  *://www.amazon.fr/*
// @match                  *://www.amazon.in/*
// @match                  *://www.amazon.it/*
// @match                  *://www.amazon.nl/*
// @match                  *://www.amazon.pl/*
// @match                  *://www.amazon.sa/*
// @match                  *://www.amazon.se/*
// @match                  *://www.amazon.sg/*
// @exclude                *://*.amazon.*/ap/signin*
// @include                https://auth0.openai.com
// @connect                api.binjie.fun
// @connect                api.openai.com
// @connect                api11.gptforlove.com
// @connect                cdn.jsdelivr.net
// @connect                chatai.mixerbox.com
// @connect                chatgpt.com
// @connect                update.greasyfork.org
// @connect                fanyi.sogou.com
// @require                https://cdn.jsdelivr.net/npm/@kudoai/chatgpt.js@3.3.5/dist/chatgpt.min.js#sha256-rfC4kk8q0byrafp7X0Qf9vaa3JNvkHRwNnUt6uL2hUE=
// @require                https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.2.0/crypto-js.min.js#sha256-dppVXeVTurw1ozOPNE3XqhYmDJPOosfbKQcHyQSE58w=
// @require                https://cdn.jsdelivr.net/npm/generate-ip@2.4.4/dist/generate-ip.min.js#sha256-aQQKAQcMgCu8IpJp9HKs387x0uYxngO+Fb4pc5nSF4I=
// @require                https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js#sha256-g3pvpbDHNrUrveKythkPMF2j/J7UFoHbUyFQcFe1yEY=
// @require                https://cdn.jsdelivr.net/npm/katex@0.16.10/dist/katex.min.js#sha256-n0UwfFeU7SR6DQlfOmLlLvIhWmeyMnIDp/2RmVmuedE=
// @require                https://cdn.jsdelivr.net/npm/katex@0.16.10/dist/contrib/auto-render.min.js#sha256-e1fUJ6xicGd9r42DgN7SzHMzb5FJoWe44f4NbvZmBK4=
// @require                https://cdn.jsdelivr.net/npm/marked@12.0.2/marked.min.js#sha256-Ffq85bZYmLMrA/XtJen4kacprUwNbYdxEKd0SqhHqJQ=
// @resource amzgptLSicon  https://amazongpt.kudoai.com/assets/images/icons/amazongpt/black-gold-teal/icon64.png.b64?v=0fddfc7#sha256-0AAauajMY4eRCDUtqRMRqBl1gaxxF0mFt4eRnFGlU24=
// @resource amzgptDSicon  https://amazongpt.kudoai.com/assets/images/icons/amazongpt/white/icon64.png.b64?v=1ac5561#sha256-qTQ5tnMF6XeH3UZkQOlJZvdE1nkn5/9srNKJqFtcCDo=
// @resource amzgptLSlogo  https://amazongpt.kudoai.com/assets/images/logos/amazongpt/black-gold/logo509x74.png.b64?v=1ac5561#sha256-wSW1EtGtscP0ZcUweFBqKfswt3NzEjbKxn5COYyihVA=
// @resource amzgptDSlogo  https://amazongpt.kudoai.com/assets/images/logos/amazongpt/white-teal/logo509x74.png.b64?v=1ac5561#sha256-EWstwtlU8+gXSM98gpr6OR3OZ63ttHVNp/NQ7IMzFDA=
// @resource hljsCSS       https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/dark.min.css#sha256-v0N76BFFkH0dCB8bUr4cHSVN8A/zCaOopMuSmJWV/5w=
// @resource brsCSS        https://assets.aiwebextensions.com/styles/rising-stars/css/black.min.css?v=891df10#sha256-XXTVJUEWrx/FwnEXbj5DcnIjwJtFAEAp0CdT6pV1+n8=
// @resource wrsCSS        https://assets.aiwebextensions.com/styles/rising-stars/css/white.min.css?v=891df10#sha256-7epqkWDhCgDP7Lv/ASLvlqbOn4D5GpnGolOUl65e9j8=
// @grant                  GM_getValue
// @grant                  GM_setValue
// @grant                  GM_deleteValue
// @grant                  GM_cookie
// @grant                  GM_registerMenuCommand
// @grant                  GM_unregisterMenuCommand
// @grant                  GM_openInTab
// @grant                  GM_getResourceText
// @grant                  GM_xmlhttpRequest
// @grant                  GM.xmlHttpRequest
// @noframes
// @downloadURL            https://update.greasyfork.org/scripts/500663/amazongpt.user.js
// @updateURL              https://update.greasyfork.org/scripts/500663/amazongpt.meta.js
// @homepageURL            https://amazongpt.kudoai.com
// @supportURL             https://amazongpt.kudoai.com/issues
// @contributionURL        https://github.com/sponsors/KudoAI
// ==/UserScript==

// Dependencies:
// ✓ chatgpt.js (https://chatgpt.js.org) © 2023–2024 KudoAI & contributors under the MIT license
// ✓ generate-ip (https://generate-ip.org) © 2024 Adam Lui & contributors under the MIT license
// ✓ highlight.js (https://highlightjs.org) © 2006 Ivan Sagalaev under the BSD 3-Clause license
// ✓ KaTeX (https://katex.org) © 2013–2020 Khan Academy & other contributors under the MIT license
// ✓ Marked (https://marked.js.org) © 2018+ MarkedJS © 2011–2018 Christopher Jeffrey under the MIT license

(async () => {

    // Init ENV context
    const env = {
        browser: { language: chatgpt.getUserLanguage() },
        scriptManager: {
            name: (() => { try { return GM_info.scriptHandler } catch (err) { return 'unknown' }})(),
            version: (() => { try { return GM_info.version } catch (err) { return 'unknown' }})()
        }
    };
    ['Chrome', 'Firefox', 'Edge', 'Brave', 'Mobile'].forEach(platform =>
        env.browser[`is${ platform == 'Firefox' ? 'FF' : platform }`] = chatgpt.browser['is' + platform]())
    env.browser.isPortrait = env.browser.isMobile && (window.innerWidth < window.innerHeight)
    const xhr = typeof GM != 'undefined' && GM.xmlHttpRequest || GM_xmlhttpRequest

    // Init APP data
    const app = {
        name: 'AmazonGPT', version: GM_info.script.version, symbol: '🤖',
        configKeyPrefix: 'amazonGPT', cssPrefix: 'amazongpt',
        chatgptJSver: /chatgpt\.js@([\d.]+)/.exec(GM_info.scriptMetaStr)[1],
        urls: {
            app: 'https://amazongpt.kudoai.com',
            chatgptJS: 'https://chatgpt.js.org',
            gitHub: 'https://github.com/KudoAI/amazongpt',
            greasyFork: 'https://greasyfork.org/scripts/500663-amazongpt',
            publisher: 'https://www.kudoai.com',
            relatedExtensions: 'https://github.com/adamlui/ai-web-extensions',
            review: { greasyFork: 'https://greasyfork.org/scripts/500663-amazongpt/feedback#post-discussion' }
        },
        latestAssetCommitHash: 'fa6053d' // for cached messages.json
    }
    app.urls.support = app.urls.gitHub + '/issues/new'
    app.urls.assetHost = app.urls.gitHub.replace('github.com', 'cdn.jsdelivr.net/gh') + `@${app.latestAssetCommitHash}`
    app.urls.update = app.urls.greasyFork.replace('https://', 'https://update.')
        .replace(/(\d+)-?([a-z-]*)$/i, (_, id, name) => `${id}/${ name || 'script' }.meta.js`)
    app.msgs = {
        appDesc: 'Adds AI to Amazon shopping',
        menuLabel_proxyAPImode: 'Proxy API Mode',
        menuLabel_autoFocusChatbar: 'Auto-Focus Chatbar',
        menuLabel_whenStreaming: 'when streaming',
        menuLabel_background: 'Background',
        menuLabel_foreground: 'Foreground',
        menuLabel_animations: 'Animations',
        menuLabel_replyLanguage: 'Reply Language',
        menuLabel_colorScheme: 'Color Scheme',
        menuLabel_auto: 'Auto',
        menuLabel_about: 'About',
        menuLabel_settings: 'Settings',
        about_version: 'Version',
        about_poweredBy: 'Powered by',
        about_sourceCode: 'Source code',
        scheme_light: 'Light',
        scheme_dark: 'Dark',
        mode_proxy: 'Proxy Mode',
        mode_streaming: 'Streaming Mode',
        mode_autoScroll: 'Auto-Scroll',
        mode_debug: 'Debug Mode',
        tooltip_playAnswer: 'Play answer',
        tooltip_fontSize: 'Font size',
        tooltip_sendReply: 'Send reply',
        tooltip_askRandQuestion: 'Ask random question',
        tooltip_minimize: 'Minimize',
        tooltip_restore: 'Restore',
        tooltip_expand: 'Expand',
        tooltip_shrink: 'Shrink',
        tooltip_close: 'Close',
        tooltip_copy: 'Copy',
        tooltip_regen: 'Regenerate',
        tooltip_reply: 'Reply',
        tooltip_code: 'Code',
        helptip_proxyAPImode: 'Uses a Proxy API for no-login access to AI',
        helptip_streamingMode: 'Receive replies in a continuous text stream',
        helptip_autoFocusChatbar: 'Auto-focus chatbar whenever it appears',
        helptip_autoScroll: 'Auto-scroll responses as they generate in Streaming Mode',
        helptip_bgAnimations: 'Show animated backgrounds in UI components',
        helptip_fgAnimations: 'Show foreground animations in UI components',
        helptip_replyLanguage: 'Language for AmazonGPT to reply in',
        helptip_colorScheme: 'Scheme to display AmazonGPT UI components in',
        helptip_debugMode: 'Show detailed logging in browser console',
        placeholder_typeSomething: 'Type something',
        prompt_updateReplyLang: 'Update reply language',
        alert_langUpdated: 'Language updated',
        alert_willReplyIn: 'will reply in',
        alert_yourSysLang: 'your system language',
        alert_choosePlatform: 'Choose a platform',
        alert_updateAvail: 'Update available',
        alert_newerVer: 'An update to',
        alert_isAvail: 'is available',
        alert_upToDate: 'Up-to-date',
        alert_isUpToDate: 'is up-to-date',
        alert_isUnsupportedIn: 'is unsupported in',
        alert_whenUsing: 'when using',
        alert_pleaseUse: 'Please use',
        alert_instead: 'instead',
        alert_unavailable: 'unavailable',
        alert_isOnlyAvailFor: 'is only available for',
        alert_and: 'and',
        alert_userscriptMgrNoStream: 'Your userscript manager does not support returning stream responses',
        alert_isCurrentlyOnlyAvailBy: 'is currently only available by',
        alert_openAIsupportSoon: 'Support for OpenAI API will be added shortly',
        alert_waitingFor: 'Waiting for',
        alert_response: 'response',
        alert_login: 'Please login',
        alert_thenRefreshPage: 'then refresh this page',
        alert_tooManyRequests: 'ChatGPT is flooded with too many requests',
        alert_parseFailed: 'Failed to parse response JSON',
        alert_checkCloudflare: 'Please pass Cloudflare security check',
        alert_notWorking: 'is not working',
        alert_ifIssuePersists: 'If issue persists',
        alert_try: 'Try',
        alert_switchingOn: 'switching on',
        alert_switchingOff: 'switching off',
        notif_copiedToClipboard: 'Copied to clipboard',
        btnLabel_moreAIextensions: 'More AI Extensions',
        btnLabel_rateUs: 'Rate Us',
        btnLabel_getSupport: 'Get Support',
        btnLabel_checkForUpdates: 'Check for Updates',
        btnLabel_update: 'Update',
        btnLabel_dismiss: 'Dismiss',
        link_viewChanges: 'View changes',
        state_on: 'On',
        state_off: 'Off'
    }

    // Init DEBUG mode
    const config = {}
    const settings = {
        load(...keys) {
            if (Array.isArray(keys[0])) keys = keys[0] // use 1st array arg, else all comma-separated ones
            keys.forEach(key => config[key] = GM_getValue(app.configKeyPrefix + '_' + key, false))
        },
        save(key, val) { GM_setValue(app.configKeyPrefix + '_' + key, val) ; config[key] = val }
    } ; settings.load('debugMode')

    // Define LOG props/functions
    const log = {

        styles: {
            prefix: {
                base: `color: white ; padding: 2px 3px 2px 5px ; border-radius: 2px ; ${
                    env.browser.isFF ? 'font-size: 13px ;' : '' }`,
                info: 'background: linear-gradient(344deg, rgba(0,0,0,1) 0%,'
                    + 'rgba(0,0,0,1) 39%, rgba(30,29,43,0.6026611328125) 93%)',
                working: 'background: linear-gradient(342deg, rgba(255,128,0,1) 0%,'
                    + 'rgba(255,128,0,0.9612045501794468) 57%, rgba(255,128,0,0.7539216370141807) 93%)' ,
                success: 'background: linear-gradient(344deg, rgba(0,107,41,1) 0%,'
                    + 'rgba(3,147,58,1) 39%, rgba(24,126,42,0.7735294801514356) 93%)',
                warning: 'background: linear-gradient(344deg, rgba(255,0,0,1) 0%,'
                    + 'rgba(232,41,41,0.9079832616640406) 57%, rgba(222,49,49,0.6530813008797269) 93%)',
                caller: 'color: blue'
            },

            msg: { working: 'color: #ff8000', warning: 'color: red' }
        },

        regEx: {
            greenVals: { caseInsensitive: /\b(?:true|\d+)\b|success\W?/i, caseSensitive: /\bON\b/ },
            redVals: { caseInsensitive: /\bfalse\b|error\W?/i, caseSensitive: /\BOFF\b/ },
            purpVals: /[ '"]\w+['"]?: / },

        prettifyObj(obj) { return JSON.stringify(obj)
            .replace(/([{,](?=")|":)/g, '$1 ') // append spaces to { and "
            .replace(/((?<!\})\})/g, ' $1') // prepend spaces to }
            .replace(/"/g, '\'') // replace " w/ '
        },

        toTitleCase(str) { return str.charAt(0).toUpperCase() + str.slice(1) }

    } ; ['info', 'error', 'debug'].forEach(logType =>
        log[logType] = function() {
            if (logType == 'debug' && !config.debugMode) return

            const args = Array.from(arguments).map(arg => typeof arg == 'object' ? JSON.stringify(arg) : arg)
            const msgType = args.some(arg => /\.{3}$/.test(arg)) ? 'working'
                          : args.some(arg => /\bsuccess\b|!$/i.test(arg)) ? 'success'
                          : args.some(arg => /\b(?:error|fail)\b/i.test(arg)) || logType == 'error' ? 'warning'
                                                                                                    : 'info'
            const prefixStyle = log.styles.prefix.base + log.styles.prefix[msgType]
            const baseMsgStyle = log.styles.msg[msgType], msgStyles = []

            // Combine regex
            const allPatterns = Object.values(log.regEx).flatMap(val =>
                val instanceof RegExp ? [val] : Object.values(val).filter(val => val instanceof RegExp))
            const combinedPattern = new RegExp(allPatterns.map(pattern => pattern.source).join('|'), 'g')

            // Combine args into finalMsg, color chars
            let finalMsg = logType == 'error' && args.length == 1 ? 'ERROR: ' : ''
            args.forEach((arg, idx) => {
                finalMsg += idx > 0 ? (idx == 1 ? ': ' : ' ') : '' // separate multi-args
                finalMsg += arg?.toString().replace(combinedPattern, match => {
                    const matched = (
                        Object.values(log.regEx.greenVals).some(val => {
                            if (val.test(match)) { msgStyles.push('color: green', baseMsgStyle) ; return true }})
                     || Object.values(log.regEx.redVals).some(val => {
                            if (val.test(match)) { msgStyles.push('color: red', baseMsgStyle) ;  return true }}))
                    if (!matched && log.regEx.purpVals.test(match)) { msgStyles.push('color: #dd29f4', baseMsgStyle) }
                    return `%c${match}%c`
                })
            })

            console[logType == 'error' ? logType : 'info'](
                `${app.symbol} %c${app.name}%c ${ log.caller ? `${log.caller} » ` : '' }%c${finalMsg}`,
                prefixStyle, log.styles.prefix.caller, baseMsgStyle, ...msgStyles
            )
        }
    )

    // LOCALIZE app.msgs for non-English users
    if (!env.browser.language.startsWith('en')) {
        log.debug('Localizing app messages...')
        const localizedMsgs = await new Promise(resolve => {
            const msgHostDir = app.urls.assetHost + '/greasemonkey/_locales/',
                  msgLocaleDir = ( env.browser.language ? env.browser.language.replace('-', '_') : 'en' ) + '/'
            let msgHref = msgHostDir + msgLocaleDir + 'messages.json', msgXHRtries = 0
            function fetchMsgs() { xhr({ method: 'GET', url: msgHref, onload: handleMsgs })}
            function handleMsgs(resp) {
                try { // to return localized messages.json
                    const msgs = JSON.parse(resp.responseText), flatMsgs = {}
                    for (const key in msgs)  // remove need to ref nested keys
                        if (typeof msgs[key] == 'object' && 'message' in msgs[key])
                            flatMsgs[key] = msgs[key].message
                    resolve(flatMsgs)
                } catch (err) { // if bad response
                    msgXHRtries++ ; if (msgXHRtries == 3) return resolve({}) // try original/region-stripped/EN only
                    msgHref = env.browser.language.includes('-') && msgXHRtries == 1 ? // if regional lang on 1st try...
                        msgHref.replace(/([^_]+_[^_]+)_[^/]*(\/.*)/, '$1$2') // ...strip region before retrying
                            : ( msgHostDir + 'en/messages.json' ) // else use default English messages
                    fetchMsgs()
                }
            }
            fetchMsgs()
        })
        Object.assign(app.msgs, localizedMsgs)
        log.debug(`Success! app.msgs = ${log.prettifyObj(app.msgs)}`)
    }

    // Init COMPATIBILITY flags
    log.debug('Initializing compatibility flags...')
    const streamingSupported = {
        byBrowser: !(env.scriptManager.name == 'Tampermonkey'
            && (env.browser.isChrome || env.browser.isEdge || env.browser.isBrave)),
        byScriptManager: /Tampermonkey|ScriptCat/.test(env.scriptManager.name)
    }
    log.debug(`Success! streamingSupported = ${log.prettifyObj(streamingSupported)}`)

    // Init SETTINGS
    log.debug('Initializing settings...')
    Object.assign(settings, { controls: {
        proxyAPIenabled: { type: 'toggle', icon: 'sunglasses',
            label: app.msgs.menuLabel_proxyAPImode,
            helptip: app.msgs.helptip_proxyAPImode },
        streamingDisabled: { type: 'toggle', icon: 'signalStream',
            label: app.msgs.mode_streaming,
            helptip: app.msgs.helptip_streamingMode },
        autoFocusChatbarDisabled: { type: 'toggle', mobile: false, icon: 'caretsInward',
            label: app.msgs.menuLabel_autoFocusChatbar,
            helptip: app.msgs.helptip_autoFocusChatbar },
        autoScroll: { type: 'toggle', mobile: false, icon: 'arrowsDown',
            label: `${app.msgs.mode_autoScroll} (${app.msgs.menuLabel_whenStreaming})`,
            helptip: app.msgs.helptip_autoScroll },
        bgAnimationsDisabled: { type: 'toggle', icon: 'sparkles',
            label: `${app.msgs.menuLabel_background} ${app.msgs.menuLabel_animations}`,
            helptip: app.msgs.helptip_bgAnimations },
        fgAnimationsDisabled: { type: 'toggle', icon: 'sparkles',
            label: `${app.msgs.menuLabel_foreground} ${app.msgs.menuLabel_animations}`,
            helptip: app.msgs.helptip_fgAnimations },
        replyLang: { type: 'prompt', icon: 'languageChars',
            label: app.msgs.menuLabel_replyLanguage,
            helptip: app.msgs.helptip_replyLanguage },
        scheme: { type: 'modal', icon: 'scheme',
            label: app.msgs.menuLabel_colorScheme,
            helptip: app.msgs.helptip_colorScheme },
        debugMode: { type: 'toggle', icon: 'bug',
            label: app.msgs.mode_debug,
            helptip: app.msgs.helptip_debugMode },
        about: { type: 'modal', icon: 'questionMarkCircle',
            label: `${app.msgs.menuLabel_about} ${app.name}...` }
    }})
    Object.assign(config, { minFontSize: 11, maxFontSize: 24, lineHeightRatio: 1.28 })
    settings.load('autoFocusChatbarDisabled', 'autoScroll', 'bgAnimationsDisabled', 'expanded', 'fgAnimationsDisabled',
                  'fontSize', 'minimized', 'proxyAPIenabled', 'replyLanguage', 'scheme', 'streamingDisabled')
    if (!config.replyLanguage) settings.save('replyLanguage', env.browser.language) // init reply language if unset
    if (!config.fontSize) settings.save('fontSize', 14) // init reply font size if unset
    if (!streamingSupported.byBrowser || !streamingSupported.byScriptManager)
        settings.save('streamingDisabled', true) // disable Streaming in unspported env
    log.debug(`Success! config = ${log.prettifyObj(config)}`)

    // Init UI props
    env.ui = { app: { scheme: config.scheme || ( chatgpt.isDarkMode() ? 'dark' : 'light' ) }}

    // Init API props
    const apis = {
        'AIchatOS': {
            endpoint: 'https://api.binjie.fun/api/generateStream',
            expectedOrigin: {
                url: 'https://chat18.aichatos68.com',
                headers: {
                    'Accept': 'application/json, text/plain, */*', 'Priority': 'u=0', 'Sec-Fetch-Site': 'cross-site'
                }
            },
            method: 'POST', streamable: true, accumulatesText: false, failFlags: ['很抱歉地', '系统公告'],
            userID: '#/chat/' + Date.now()
        },
        'GPTforLove': {
            endpoint: 'https://api11.gptforlove.com/chat-process',
            expectedOrigin: {
                url: 'https://ai27.gptforlove.com',
                headers: {
                    'Accept': 'application/json, text/plain, */*', 'Priority': 'u=0', 'Sec-Fetch-Site': 'same-site'
                }
            },
            method: 'POST', streamable: true, accumulatesText: true,
            failFlags: ['[\'"]?status[\'"]?:\\s*[\'"]Fail[\'"]']
        },
        'MixerBox AI': {
            endpoint: 'https://chatai.mixerbox.com/api/chat/stream',
            expectedOrigin: {
                url: 'https://chatai.mixerbox.com',
                headers: { 'Accept': '*/*', 'Alt-Used': 'chatai.mixerbox.com', 'Sec-Fetch-Site': 'same-origin' }
            },
            method: 'POST', streamable: true, accumulatesText: false
        },
        'OpenAI': {
            endpoints: {
                auth: 'https://auth0.openai.com',
                completions: 'https://api.openai.com/v1/chat/completions',
                session: 'https://chatgpt.com/api/auth/session'
            },
            expectedOrigin: {
                url: 'https://chatgpt.com',
                headers: { 'Accept': '*/*', 'Priority': 'u=4', 'Sec-Fetch-Site': 'same-site' }
            },
            method: 'POST', streamable: true
        }
    }

    // Init INPUT EVENTS
    const inputEvents = {} ; ['down', 'move', 'up'].forEach(action =>
          inputEvents[action] = ( window.PointerEvent ? 'pointer' : env.browser.isMobile ? 'touch' : 'mouse' ) + action)

    // Init ALERTS
    Object.assign(app, { alerts: {
        waitingResponse:  `${app.msgs.alert_waitingFor} ${app.name} ${app.msgs.alert_response}...`,
        login:            `${app.msgs.alert_login} @ `,
        checkCloudflare:  `${app.msgs.alert_checkCloudflare} @ `,
        tooManyRequests:  `${app.msgs.alert_tooManyRequests}.`,
        parseFailed:      `${app.msgs.alert_parseFailed}.`,
        proxyNotWorking:  `${app.msgs.mode_proxy} ${app.msgs.alert_notWorking}.`,
        openAInotWorking: `OpenAI API ${app.msgs.alert_notWorking}.`,
        suggestProxy:     `${app.msgs.alert_try} ${app.msgs.alert_switchingOn} ${app.msgs.mode_proxy}`,
        suggestOpenAI:    `${app.msgs.alert_try} ${app.msgs.alert_switchingOff} ${app.msgs.mode_proxy}`
    }})

    // Define MENU functions

    const menu = {
        ids: [], state: {
            symbols: ['❌', '✔️'], separator: env.scriptManager.name == 'Tampermonkey' ? ' — ' : ': ',
            words: [app.msgs.state_off.toUpperCase(), app.msgs.state_on.toUpperCase()]
        },

        register() {
            const tooltipsSupported = env.scriptManager.name == 'Tampermonkey'
                                   && parseInt(env.scriptManager.version.split('.')[0]) >= 5

            // Add Proxy API Mode toggle
            const pmLabel = menu.state.symbols[+config.proxyAPIenabled] + ' '
                          + settings.controls.proxyAPIenabled.label + ' '
                          + menu.state.separator + menu.state.words[+config.proxyAPIenabled]
            menu.ids.push(GM_registerMenuCommand(pmLabel, toggle.proxyMode,
                tooltipsSupported ? { title: settings.controls.proxyAPIenabled.helptip } : undefined))

            // Add About entry
            const aboutLabel = `💡 ${settings.controls.about.label}`
            menu.ids.push(GM_registerMenuCommand(aboutLabel, () => modals.open('about'),
                tooltipsSupported ? { title: ' ' } : undefined ))

            // Add Settings entry
            const settingsLabel = `⚙️ ${app.msgs.menuLabel_settings}`
            menu.ids.push(GM_registerMenuCommand(settingsLabel, () => modals.open('settings'),
                tooltipsSupported ? { title: ' ' } : undefined))
        },

        refresh() {
            if (typeof GM_unregisterMenuCommand == 'undefined') {
                log.debug('GM_unregisterMenuCommand not supported.') ; return }
            for (const id of menu.ids) { GM_unregisterMenuCommand(id) } menu.register()
        }
    }

    function updateCheck() {
        log.caller = 'updateCheck()'
        log.debug(`currentVer = ${app.version}`)

        // Fetch latest meta
        log.debug('Fetching latest userscript metadata...')
        xhr({
            method: 'GET', url: app.urls.update + '?t=' + Date.now(),
            headers: { 'Cache-Control': 'no-cache' },
            onload: resp => {
                log.debug('Success! Response received')

                // Compare versions, alert if update found
                log.debug('Comparing versions...')
                app.latestVer = /@version +(.*)/.exec(resp.responseText)[1]
                for (let i = 0 ; i < 4 ; i++) { // loop thru subver's
                    const currentSubVer = parseInt(app.version.split('.')[i], 10) || 0,
                          latestSubVer = parseInt(app.latestVer.split('.')[i], 10) || 0
                    if (currentSubVer > latestSubVer) break // out of comparison since not outdated
                    else if (latestSubVer > currentSubVer) // if outdated
                        return modals.open('update', 'available')
                }

                // Alert to no update found, nav back to About
                modals.open('update', 'unavailable')
        }})
    }

    // Define FACTORY functions

    const create = {

        anchor(linkHref, displayContent, attrs = {}) {
            const anchor = document.createElement('a'),
                  defaultAttrs = { href: linkHref, target: '_blank', rel: 'noopener' },
                  finalAttrs = { ...defaultAttrs, ...attrs }
            Object.entries(finalAttrs).forEach(([attr, value]) => anchor.setAttribute(attr, value))
            if (displayContent) anchor.append(displayContent)
            return anchor
        },

        style(content) {
            const style = document.createElement('style')
            if (content) style.innerText = content
            return style
        },

        svgElem(type, attrs) {
            const elem = document.createElementNS('http://www.w3.org/2000/svg', type)
            for (const attr in attrs) elem.setAttributeNS(null, attr, attrs[attr])
            return elem
        }
    }

    // Define FEEDBACK functions

    function appAlert(...alerts) {
        alerts = alerts.flat() // flatten array args nested by spread operator
        appDiv.textContent = ''
        const alertP = document.createElement('p')
        alertP.id = `${app.cssPrefix}-alert` ; alertP.className = 'no-user-select'

        alerts.forEach((alert, idx) => { // process each alert for display
            let msg = app.alerts[alert] || alert // use string verbatim if not found in app.alerts
            if (idx > 0) msg = ' ' + msg // left-pad 2nd+ alerts
            if (msg.includes(app.alerts.login)) session.deleteOpenAIcookies()
            if (msg.includes(app.alerts.waitingResponse)) alertP.classList.add('loading')

            // Add login link to login msgs
            if (msg.includes('@'))
                msg += '<a class="alert-link" target="_blank" rel="noopener"'
                     + ' href="https://chatgpt.com">chatgpt.com</a>,'
                     + ` ${app.msgs.alert_thenRefreshPage}.`
                     + ` (${app.msgs.alert_ifIssuePersists},`
                     + ` ${( app.msgs.alert_try ).toLowerCase() }`
                     + ` ${app.msgs.alert_switchingOn}`
                     + ` ${app.msgs.mode_proxy})`

            // Hyperlink app.msgs.alert_switching<On|Off>
            const foundState = ['On', 'Off'].find(state =>
                msg.includes(app.msgs['alert_switching' + state]) || new RegExp(`\\b${state}\\b`, 'i').test(msg))
            if (foundState) { // hyperlink switch phrase for click listener to toggle.proxyMode()
                const switchPhrase = app.msgs['alert_switching' + foundState] || 'switching ' + foundState.toLowerCase()
                msg = msg.replace(switchPhrase, `<a class="alert-link" href="#">${switchPhrase}</a>`)
            }

            // Create/fill/append msg span
            const msgSpan = document.createElement('span')
            msgSpan.innerHTML = msg ; alertP.append(msgSpan)

            // Activate toggle link if necessary
            msgSpan.querySelector('[href="#"]')?.addEventListener('click', toggle.proxyMode)
        })
        appDiv.append(alertP)
    }

    function notify(msg, pos = '', notifDuration = '', shadow = 'shadow') {

        // Strip state word to append styled one later
        const foundState = menu.state.words.find(word => msg.includes(word))
        if (foundState) msg = msg.replace(foundState, '')

        // Show notification
        chatgpt.notify(msg, pos, notifDuration, shadow)
        const notif = document.querySelector('.chatgpt-notif:last-child')

        // Prepend app icon
        const notifIcon = icons.amzgpt.create('white')
        notifIcon.style.cssText = 'width: 28px ; position: relative ; top: 4.8px ; margin-right: 8px'
        notif.prepend(notifIcon)

        // Append notif type icon
        const iconStyles = 'width: 28px ; height: 28px ; position: relative ; top: 3.5px ; margin-left: 11px ;',
              mode = Object.keys(settings.controls).find(key => settings.controls[key].label.includes(msg.trim()))
        if (mode && !/(?:pre|suf)fix/.test(mode)) {
            const modeIcon = icons[settings.controls[mode].icon].create()
            modeIcon.style.cssText = iconStyles
                + ( // raise some icons
                    /focus|scroll/i.test(mode) ? 'top: 4px' : '' )
                + ( // shrink some icons
                    /animation|debug/i.test(mode) ? 'width: 23px ; height: 23px ; margin-top: 3px' : '' )
            notif.append(modeIcon)
        }

        // Append styled state word
        if (foundState) {
            const styledStateSpan = document.createElement('span')
            styledStateSpan.style.cssText = `font-weight: bold ; color: ${
                foundState == menu.state.words[0] ? '#ef4848 ; text-shadow: rgba(255, 169, 225, 0.44) 2px 1px 5px'
                                                  : '#5cef48 ; text-shadow: rgba(255, 250, 169, 0.38) 2px 1px 5px' }`
            styledStateSpan.append(foundState) ; notif.insertBefore(styledStateSpan, notif.children[2])
        }
    }

    // Define MODAL functions

    const modals = {
        stack: [], // of types of undismissed modals
        class: `${app.cssPrefix}-modal`,

        alert(title = '', msg = '', btns = '', checkbox = '', width = '') { // generic one from chatgpt.alert()
            const alertID = chatgpt.alert(title, msg, btns, checkbox, width),
                  alert = document.getElementById(alertID).firstChild
            this.init(alert) // add classes/listeners/hack bg/glowup btns
            return alert
        },

        open(modalType, modalSubType) { // custom ones
            const modal = modalSubType ? modals[modalType][modalSubType]()
                        : (modals[modalType].show || modals[modalType])()
            if (settings.controls[modalType]?.type != 'prompt') { // add to stack
                this.stack.unshift(modalSubType ? `${modalType}_${modalSubType}` : modalType)
                log.debug(`Modal stack: ${JSON.stringify(modals.stack)}`)
            }
            this.init(modal) // add classes/listeners/hack bg/glowup btns
            this.observeRemoval(modal, modalType, modalSubType) // to maintain stack for proper nav
            if (!modals.handlers.key.added) { // add key listener to dismiss modals
                document.addEventListener('keydown', modals.handlers.key) ; modals.handlers.key.added = true }
        },

        init(modal) {
            if (!this.styles) this.stylize() // to init/append stylesheet

            // Add classes
            modal.classList.add(this.class) ; modal.parentNode.classList.add(`${this.class}-bg`)

            // Add listeners
            modal.onwheel = modal.ontouchmove = event => event.preventDefault() // disable wheel/swipe scrolling
            modal.onmousedown = modals.handlers.drag.mousedown

            // Hack BG
            fillStarryBG(modal)
            setTimeout(() => { // dim bg
                modal.parentNode.style.backgroundColor = `rgba(67, 70, 72, ${
                    env.ui.app.scheme == 'dark' ? 0.62 : 0.33 })`
                modal.parentNode.classList.add('animated')
            }, 100) // delay for transition fx

            // Glowup btns
            if (env.ui.app.scheme == 'dark' && !config.fgAnimationsDisabled) toggle.btnGlow()
        },

        stylize() {
            if (!this.styles) {
                this.styles = document.createElement('style') ; this.styles.id = `${this.class}-styles`
                document.head.append(this.styles)
            }
            this.styles.innerText = (
                '@keyframes modal-zoom-fade-out {'
                  + '0% { opacity: 1 } 50% { opacity: 0.25 ; transform: scale(1.05) }'
                  + '100% { opacity: 0 ; transform: scale(1.35) }}'
              + '.chatgpt-modal > div {'
                  + 'padding: 20px 25px 24px 25px !important ;' // increase alert padding
                  + 'background-color: white !important ; color: black }'
              + '.chatgpt-modal p { margin: -8px 0 -14px 4px ; font-size: 22px ; line-height: 31px }'
              + `.chatgpt-modal a { color: #${ env.ui.app.scheme == 'dark' ? '00cfff' : '1e9ebb' } !important }`
              + '.modal-buttons {'
                  + `margin: 35px -5px 2px ; ${ env.browser.isMobile ? -5 : -15 }px !important ; width: 100% }`
              + '.chatgpt-modal button {'
                  + 'font-size: 1rem ; text-transform: uppercase ; min-width: 121px ;'
                  + `padding: ${ env.browser.isMobile ? '7px' : '4px 10px' } !important ;`
                  + 'cursor: pointer ; border-radius: 0 !important ; height: 39px ;'
                  + 'border: 1px solid ' + ( env.ui.app.scheme == 'dark' ? 'white' : 'black' ) + '!important ;'
                  + `${ env.ui.app.scheme == 'dark' ? 'background: none ; color: white' : '' }}`
              + '.primary-modal-btn { background: black !important ; color: white !important }'
              + '.chatgpt-modal button:hover { background-color: #9cdaff !important ; color: black !important }'
              + ( env.ui.app.scheme == 'dark' ? // darkmode chatgpt.alert() styles
                  ( '.chatgpt-modal > div, .chatgpt-modal button:not(.primary-modal-btn) {'
                      + 'background-color: black !important ; color: white }'
                  + '.primary-modal-btn { background: hsl(186 100% 69%) !important ; color: black !important }'
                  + '.chatgpt-modal a { color: #00cfff !important }'
                  + '.chatgpt-modal button:hover {'
                      + 'background-color: #00cfff !important ; color: black !important }' ) : '' )
              + `.${modals.class} { display: grid ; place-items: center }` // for centered icon/logo
              + '[class*="modal-close-btn"] {'
                  + 'position: absolute !important ; float: right ; top: 14px !important ; right: 16px !important ;'
                  + 'cursor: pointer ; width: 33px ; height: 33px ; border-radius: 20px }'
              + `[class*="modal-close-btn"] path {${ env.ui.app.scheme == 'dark' ? 'stroke: white ; fill: white'
                                                                             : 'stroke: #9f9f9f ; fill: #9f9f9f' }}`
              + ( env.ui.app.scheme == 'dark' ?  // invert dark mode hover paths
                    '[class*="modal-close-btn"]:hover path { stroke: black ; fill: black }' : '' )
              + '[class*="modal-close-btn"]:hover { background-color: #f2f2f2 }' // hover underlay
              + '[class*="modal-close-btn"] svg { margin: 11.5px }' // center SVG for hover underlay
              + '[class*="-modal"] h2 {'
                  + 'font-size: 27px ; font-weight: bold ; line-height: 32px ; padding: 0 ;'
                  + 'margin: 9px 0 22px !important ;'
                  + `${ env.browser.isMobile ? 'text-align: center' // center on mobile
                                             : 'justify-self: start' }}` // left-align on desktop
              + '[class*="-modal"] p { justify-self: start ; font-size: 20px }'
              + '[class*="-modal"] button { font-size: 14px }'
              + '[class*="-modal-bg"] {'
                  + 'position: fixed ; top: 0 ; left: 0 ; width: 100% ; height: 100% ;' // expand to full view-port
                  + 'transition: background-color .25s ease !important ;' // speed to show bg dim
                  + 'display: flex ; justify-content: center ; align-items: center ; z-index: 9999 }' // align
              + '[class*="-modal-bg"].animated > div {'
                  + 'z-index: 13456 ; opacity: 0.98 ; transform: translateX(0) translateY(0) }'
              + '[class$="-modal"] {' // native modals + chatgpt.alert()s
                  + 'z-index: 13456 ; position: absolute ;' // to be click-draggable
                  + 'opacity: 0 ;' // to fade-in
                  + `background-image: linear-gradient(180deg, ${
                       env.ui.app.scheme == 'dark' ? '#99a8a6 -200px, black 200px' : '#b6ebff -296px, white 171px' }) ;`
                  + `border: 1px solid ${ env.ui.app.scheme == 'dark' ? 'white' : '#b5b5b5' } !important ;`
                  + `color: ${ env.ui.app.scheme == 'dark' ? 'white' : 'black' } ;`
                  + 'transform: translateX(-3px) translateY(7px) ;' // offset to move-in from
                  + 'transition: opacity 0.65s cubic-bezier(.165,.84,.44,1),' // for fade-ins
                              + 'transform 0.55s cubic-bezier(.165,.84,.44,1) !important }' // for move-ins
              + ( config.fgAnimationsDisabled || env.browser.isMobile ? '' : (
                    '[class$="-modal"] button { transition: transform 0.15s ease }'
                  + '[class$="-modal"] button:hover { transform: scale(1.055) }' ))

              // Glowing modal btns
              + ':root { --glow-color: hsl(186 100% 69%); }'
              + '.glowing-btn {'
                  + 'perspective: 2em ; font-weight: 900 ; animation: border-flicker 2s linear infinite ;'
                  + '-webkit-box-shadow: inset 0 0 0.5em 0 var(--glow-color), 0 0 0.5em 0 var(--glow-color) ;'
                  + 'box-shadow: inset 0 0 0.5em 0 var(--glow-color), 0 0 0.5em 0 var(--glow-color) ;'
                  + '-moz-box-shadow: inset 0 0 0.5em 0 var(--glow-color), 0 0 0.5em 0 var(--glow-color) }'
              + '.glowing-txt {'
                  + 'animation: text-flicker 3s linear infinite ;'
                  + '-webkit-text-shadow: 0 0 0.125em hsl(0 0% 100% / 0.3), 0 0 0.45em var(--glow-color) ;'
                  + '-moz-text-shadow: 0 0 0.125em hsl(0 0% 100% / 0.3), 0 0 0.45em var(--glow-color) ;'
                  + 'text-shadow: 0 0 0.125em hsl(0 0% 100% / 0.3), 0 0 0.45em var(--glow-color) }'
              + '.faulty-letter {'
                  + 'opacity: 0.5 ; animation: faulty-flicker 2s linear infinite }'
                  + ( !env.browser.isMobile ? 'background: var(--glow-color) ;'
                        + 'transform: translateY(120%) rotateX(95deg) scale(1, 0.35)' : '' ) + '}'
              + '.glowing-btn::after {'
                  + 'content: "" ; position: absolute ; top: 0 ; bottom: 0 ; left: 0 ; right: 0 ;'
                  + 'opacity: 0 ; z-index: -1 ; box-shadow: 0 0 2em 0.2em var(--glow-color) ;'
                  + 'background-color: var(--glow-color) ; transition: opacity 100ms linear }'
              + '.glowing-btn:hover { color: rgba(0, 0, 0, 0.8) ; text-shadow: none ; animation: none }'
              + '.glowing-btn:hover .glowing-txt { animation: none }'
              + '.glowing-btn:hover .faulty-letter { animation: none ; text-shadow: none ; opacity: 1 }'
              + '.glowing-btn:hover:before { filter: blur(1.5em) ; opacity: 1 }'
              + '.glowing-btn:hover:after { opacity: 1 }'
              + '@keyframes faulty-flicker {'
                  + '0% { opacity: 0.1 } 2% { opacity: 0.1 } 4% { opacity: 0.5 } 19% { opacity: 0.5 }'
                  + '21% { opacity: 0.1 } 23% { opacity: 1 } 80% { opacity: 0.5 } 83% { opacity: 0.4 }'
                  + '87% { opacity: 1 }}'
              + '@keyframes text-flicker {'
                  + '0% { opacity: 0.1 } 2% { opacity: 1 } 8% { opacity: 0.1 } 9% { opacity: 1 }'
                  + '12% { opacity: 0.1 } 20% { opacity: 1 } 25% { opacity: 0.3 } 30% { opacity: 1 }'
                  + '70% { opacity: 0.7 } 72% { opacity: 0.2 } 77% { opacity: 0.9 } 100% { opacity: 0.9 }}'
              + '@keyframes border-flicker {'
                  + '0% { opacity: 0.1 } 2% { opacity: 1 } 4% { opacity: 0.1 } 8% { opacity: 1 }'
                  + '70% { opacity: 0.7 } 100% { opacity: 1 }}'

              // Settings modal
              + `#${app.cssPrefix}-settings {`
                  + `min-width: ${ env.browser.isPortrait ? 288 : 755 }px ; max-width: 75vw ; margin: 12px 23px ;`
                  + 'word-wrap: break-word ; border-radius: 15px ; box-shadow: 0 30px 60px rgba(0, 0, 0, .12) ;'
                  + `${ env.ui.app.scheme == 'dark' ? 'stroke: white ; fill: white' : 'stroke: black ; fill: black' }}`
              + `#a${app.cssPrefix}-settings-title {`
                  + 'font-weight: bold ; line-height: 19px ; text-align: center ;'
                  + `margin: 0 ${ env.browser.isMobile ? 6 : 24 }px 8px 0 }`
              + `#${app.cssPrefix}-settings-title h4 {`
                  + `font-size: ${ env.browser.isPortrait ? 26 : 31 }px ; font-weight: bold ; margin-top: -25px }`
              + `#${app.cssPrefix}-settings ul {`
                  + 'list-style: none ; padding: 0 ; margin: 0 0 2px -3px ;' // hide bullets, close bottom gap
                  + `width: ${ env.browser.isPortrait ? 100 : 50 }% }` // set width based on column cnt
              + `#${app.cssPrefix}-settings li {`
                  + `color: ${ env.ui.app.scheme == 'dark' ? 'rgb(255, 255, 255, 0.65)' : 'rgba(0, 0, 0, 0.45)' } ;`
                  + `fill: ${ env.ui.app.scheme == 'dark' ? 'rgb(255, 255, 255, 0.65)' : 'rgba(0, 0, 0, 0.45)' } ;`
                  + `stroke: ${ env.ui.app.scheme == 'dark' ? 'rgb(255, 255, 255, 0.65)' : 'rgba(0, 0, 0, 0.45)' } ;`
                  + 'list-style: none ; height: 37px ; font-size: 15.5px ; transition: transform 0.1s ease ;'
                  + `color: ${ env.ui.app.scheme == 'dark' ? 'white' : 'black' } ;`
                  + `padding: 6px 10px 4px ; border-bottom: 1px dotted ${ env.ui.app.scheme == 'dark' ? 'white' : 'black' } ;`
                  + 'border-radius: 3px }' // make highlight strips slightly rounded
              + `#${app.cssPrefix}-settings li.active {`
                  + `color: ${ env.ui.app.scheme == 'dark' ? 'rgb(255, 255, 255)' : 'rgba(0, 0, 0)' } ;` // for text
                  + `fill: ${ env.ui.app.scheme == 'dark' ? 'rgb(255, 255, 255)' : 'rgba(0, 0, 0)' } ;` // for icons
                  + `stroke: ${ env.ui.app.scheme == 'dark' ? 'rgb(255, 255, 255)' : 'rgba(0, 0, 0)' }}` // for icons
              + `#${app.cssPrefix}-settings li label {`
                  + 'display: contents ; padding-right: 20px ;' // right-pad labels so toggles don't hug
                  + 'font-weight: normal }' // override Amazon boldening
              + `#${app.cssPrefix}-settings li:last-of-type { border-bottom: none }` // remove last bottom-border
              + `#${app.cssPrefix}-settings li, #${app.cssPrefix}-settings li label { cursor: pointer }` // add finger on hover
              + `#${app.cssPrefix}-settings li:hover {`
                  + 'opacity: 1 ;'
                  + 'background: rgba(100, 149, 237, 0.88) ; color: white ; fill: white ; stroke: white ;'
                  + `${ config.fgAnimationsDisabled || env.browser.isMobile ? '' : 'transform: scale(1.22)' }}`
              + `#${app.cssPrefix}-settings li > input { float: right }` // pos toggles
              + '#scheme-menu-entry > span { margin: 0 -2px }' // align Scheme status
              + '#scheme-menu-entry > span > svg {' // v-align/left-pad Scheme status icon
                  + 'position: relative ; top: 3px ; margin-left: 4px }'
              + ( config.fgAnimationsDisabled ? '' // spin cycle arrows icon when scheme is Auto
                  : ( '#scheme-menu-entry svg:has([d^="M204-318q-22"]),'
                        + '.chatgpt-notif svg:has([d^="M204-318q-22"]) { animation: rotation 5s linear infinite }' ))
              + '@keyframes rotation { from { transform: rotate(0deg) } to { transform: rotate(360deg) }}'
              + `#about-menu-entry span { color: ${ env.ui.app.scheme == 'dark' ? '#28ee28' : 'green' }}`
              + '#about-menu-entry > span {' // outer About status span
                  + `width: ${ env.browser.isPortrait ? '15vw' : '92px' } ; height: 20px ; overflow: hidden ;`
                  + `${ config.fgAnimationsDisabled ? '' : ( // fade edges
                            'mask-image: linear-gradient('
                                + 'to right, transparent, black 20%, black 89%, transparent) ;'
                  + '-webkit-mask-image: linear-gradient('
                                + 'to right, transparent, black 20%, black 89%, transparent)' )}}`
              + '#about-menu-entry > span > div {'
                  + `text-wrap: nowrap ; ${
                        config.fgAnimationsDisabled ? '' : 'animation: ticker linear 60s infinite' }}`
              + '@keyframes ticker { 0% { transform: translateX(100%) } 100% { transform: translateX(-2000%) }}'
              + `.about-em { color: ${ env.ui.app.scheme == 'dark' ? 'white' : 'green' } !important }`
            )
        },

        observeRemoval(modal, modalType, modalSubType) { // to maintain stack for proper nav
            const modalBG = modal.parentNode
            new MutationObserver(([mutation], obs) => {
                mutation.removedNodes.forEach(removedNode => { if (removedNode == modalBG) {
                    if (modals.stack[0].includes(modalSubType || modalType)) { // new modal not launched so nav back
                        modals.stack.shift() // remove this modal type from stack 1st
                        const prevModalType = modals.stack[0]
                        if (prevModalType) { // open it
                            modals.stack.shift() // remove type from stack since re-added on open
                            modals.open(prevModalType)
                        }
                    }
                    obs.disconnect()
                }})
            }).observe(modalBG.parentNode, { childList: true, subtree: true })
        },

        hide(modal) {
            log.caller = 'modals.hide()'
            log.debug(`Dismissing div#${modal?.id}...`)
            const modalContainer = modal?.parentNode
            if (!modalContainer) return
            modalContainer.style.animation = 'modal-zoom-fade-out .135s ease-out'
            setTimeout(() => { modalContainer.remove() ; log.debug(`Success! div#${modal?.id} dismissed`)
                }, 105) // delay for fade-out
        },

        handlers: {

            click(event) { // to dismiss non-chatgpt.alert() modals
                log.caller = 'modals.handlers.click()'
                if (event.target == event.currentTarget || event.target instanceof SVGPathElement) {
                    const targetModal = document.querySelector('[class$="-modal"]')
                    log.debug(`Dismiss element of div#${targetModal?.id} clicked`)
                    modals.hide(targetModal)
                }
            },

            drag: {

                mousedown(event) { // find modal, attach listeners, init XY offsets
                    if (event.button != 0) return // prevent non-left-click drag
                    if (getComputedStyle(event.target).cursor == 'pointer') return // prevent drag on interactive elems
                    modals.handlers.drag.draggableElem = event.currentTarget
                    modals.handlers.drag.draggableElem.style.cursor = 'grabbing'
                    event.preventDefault(); // prevent sub-elems like icons being draggable
                    ['mousemove', 'mouseup'].forEach(event => document.addEventListener(event, modals.handlers.drag[event]))
                    const draggableElemRect = modals.handlers.drag.draggableElem.getBoundingClientRect()
                    modals.handlers.drag.offsetX = event.clientX - draggableElemRect.left +21
                    modals.handlers.drag.offsetY = event.clientY - draggableElemRect.top +12
                },

                mousemove(event) { // drag modal
                    if (modals.handlers.drag.draggableElem) {
                        const newX = event.clientX - modals.handlers.drag.offsetX,
                              newY = event.clientY - modals.handlers.drag.offsetY
                        Object.assign(modals.handlers.drag.draggableElem.style, { left: `${newX}px`, top: `${newY}px` })
                    }
                },

                mouseup() { // remove listeners, reset modals.handlers.drags.draggableElem
                    modals.handlers.drag.draggableElem.style.cursor = 'inherit';
                    ['mousemove', 'mouseup'].forEach(event =>
                        document.removeEventListener(event, modals.handlers.drag[event]))
                    modals.handlers.drag.draggableElem = null
                }

            },

            key(event) { // to dismiss non-chatgpt.alert() modals
                log.caller = 'modals.handlers.key()'
                if (['Escape', 'Esc'].includes(event.key) || event.keyCode == 27) {
                    log.debug('Escape pressed')
                    const modal = document.querySelector('[class$="-modal"]')
                    if (modal) modals.hide(modal)
                }
            }
        },

        about() {
            log.caller = 'modals.about()'
            log.debug('Showing About modal...')

            // Show modal
            const aboutModal = modals.alert('',
                `🏷️ ${app.msgs.about_version}: <span class="about-em">${app.version}</span>\n`
                    + '⚡ ' + ( app.msgs.about_poweredBy ) + ': '
                        + `<a href="${app.urls.chatgptJS}" target="_blank" rel="noopener">chatgpt.js</a>`
                            + ` v${app.chatgptJSver}\n`
                    + '📜 ' + ( app.msgs.about_sourceCode )
                        + `: <a href="${app.urls.gitHub}" target="_blank" rel="nopener">`
                            + app.urls.gitHub + '</a>',
                [ // buttons
                    function checkForUpdates() { updateCheck() },
                    function getSupport(){},
                    function rateUs() { modals.open('feedback') },
                    function moreAIextensions(){}
                ], '', 656 // modal width
            )

            // Add logo
            const aboutHeaderLogo = logos.amzgpt.create() ; aboutHeaderLogo.width = 420
            aboutHeaderLogo.style.cssText = `max-width: 98% ; margin: 15px ${
                env.browser.isMobile ? 'auto' : '15.5%' } 17px`
            aboutModal.insertBefore(aboutHeaderLogo, aboutModal.firstChild.nextSibling) // after close btn

            // Center text
            aboutModal.querySelector('h2').remove() // remove empty title h2
            aboutModal.querySelector('p').style.cssText = (
                'justify-self: center ; text-align: center ; overflow-wrap: anywhere ;'
              + `margin: ${ env.browser.isPortrait ? '6px 0 -16px' : '3px 0 -6px' }` )

            // Hack buttons
            aboutModal.querySelectorAll('button').forEach(btn => {
                btn.style.cssText = 'height: 58px ; min-width: 136px ; text-align: center'

                // Replace link buttons w/ clones that don't dismiss modal
                if (/support|extensions/i.test(btn.textContent)) {
                    const btnClone = btn.cloneNode(true)
                    btn.parentNode.replaceChild(btnClone, btn) ; btn = btnClone
                    btn.onclick = () => modals.safeWinOpen(app.urls[
                        btn.textContent.includes(app.msgs.btnLabel_getSupport) ? 'support' : 'relatedExtensions' ])
                }

                // Prepend emoji + localize labels
                if (/updates/i.test(btn.textContent))
                    btn.textContent = `🚀 ${app.msgs.btnLabel_checkForUpdates}`
                else if (/support/i.test(btn.textContent))
                    btn.textContent = `🧠 ${app.msgs.btnLabel_getSupport}`
                else if (/rate/i.test(btn.textContent))
                    btn.textContent = `⭐ ${app.msgs.btnLabel_rateUs}`
                else if (/extensions/i.test(btn.textContent))
                    btn.textContent = `🤖 ${app.msgs.btnLabel_moreAIextensions}`

                // Hide Dismiss button
                else btn.style.display = 'none'
            })

            log.debug('Success! About Modal shown')

            return aboutModal
        },

        feedback() {
            log.caller = 'modals.feedback()'
            log.debug('Showing Feedback modal...')

            // Init buttons
            let btns = [ function greasyFork() {} ]
            if (modals.stack[1] != 'about') btns.push(function github(){})

            // Show modal
            const feedbackModal = modals.alert(`${app.msgs.alert_choosePlatform}:`, '', btns, '', 408)

            // Center CTA
            feedbackModal.querySelector('h2').style.justifySelf = 'center'

            // Re-style button cluster
            const btnsDiv = feedbackModal.querySelector('.modal-buttons')
            btnsDiv.style.cssText += 'display: flex ; flex-wrap: wrap ; justify-content: center ;'
                                   + 'margin-top: -2px !important' // close gap between title/btns
            // Hack buttons
            btns = btnsDiv.querySelectorAll('button')
            btns.forEach((btn, idx) => {
                if (idx == 0) btn.style.display = 'none' // hide Dismiss button
                if (idx == btns.length -1) btn.classList.remove('primary-modal-btn') // de-emphasize last link
                btn.style.marginTop = btn.style.marginBottom = '5px' // v-pad btns

                // Replace buttons w/ clones that don't dismiss modal
                const btnClone = btn.cloneNode(true)
                btn.parentNode.replaceChild(btnClone, btn) ; btn = btnClone
                btn.onclick = () => modals.safeWinOpen(
                    btn.textContent == 'Greasy Fork' ? app.urls.review.greasyFork
                                                     : `${app.urls.gitHub}/discussions/new/choose`
                )
            })

            log.debug('Success! Feedback modal shown')

            return feedbackModal
        },

        replyLang() {
            log.caller = 'modals.replyLang()'
            while (true) {
                let replyLang = prompt(
                    ( app.msgs.prompt_updateReplyLang ) + ':', config.replyLanguage)
                if (replyLang == null) break // user cancelled so do nothing
                else if (!/\d/.test(replyLang)) {
                    replyLang = ( // auto-case for menu/alert aesthetics
                        replyLang.length < 4 || replyLang.includes('-') ? replyLang.toUpperCase()
                            : replyLang.charAt(0).toUpperCase() + replyLang.slice(1).toLowerCase() )
                    log.debug('Saving reply language...')
                    settings.save('replyLanguage', replyLang || env.browser.language)
                    log.debug(`Success! config.replyLanguage = ${config.replyLanguage}`)
                    modals.alert(`${app.msgs.alert_langUpdated}!`, // title
                        `${app.name} ${app.msgs.alert_willReplyIn} `
                            + ( replyLang || app.msgs.alert_yourSysLang ) + '.',
                        '', '', 375) // confirmation width
                    if (modals.settings.get()) // update settings menu status label
                        document.querySelector('#replyLang-menu-entry span').textContent = replyLang
                    break
                }
            }
        },

        scheme() {
            log.caller = 'modals.scheme()'
            log.debug('Showing Scheme modal...')

            // Show modal
            const schemeModal = modals.alert(`${
                app.name } ${( app.msgs.menuLabel_colorScheme ).toLowerCase() }:`, '',
                [ function auto() {}, function light() {}, function dark() {} ] // buttons
            )

            // Center title/button cluster
            schemeModal.querySelector('h2').style.justifySelf = 'center'
            schemeModal.querySelector('.modal-buttons')
                .style.cssText = 'justify-content: center ; margin-top: -2px !important'

            // Re-format each button
            const buttons = schemeModal.querySelectorAll('button'),
                  schemes = { 'light': '☀️', 'dark': '🌘', 'auto': '🌗'}
            for (const btn of buttons) {
                const btnScheme = btn.textContent.toLowerCase()

                // Emphasize active scheme
                btn.classList = (
                    config.scheme == btn.textContent.toLowerCase() || (btn.textContent == 'Auto' && !config.scheme)
                      ? 'primary-modal-btn' : '' )

                // Prepend emoji + localize labels
                if (Object.prototype.hasOwnProperty.call(schemes, btnScheme))
                    btn.textContent = `${schemes[btnScheme]} ${ // emoji
                        app.msgs['scheme_' + btnScheme] || app.msgs['menuLabel_' + btnScheme]
                            || btnScheme.toUpperCase() }`
                else btn.style.display = 'none' // hide Dismiss button

                // Clone button to replace listener to not dismiss modal on click
                const newBtn = btn.cloneNode(true) ; btn.parentNode.replaceChild(newBtn, btn)
                newBtn.onclick = () => {
                    const newScheme = btnScheme == 'auto' ? ( chatgpt.isDarkMode() ? 'dark' : 'light' ) : btnScheme
                    settings.save('scheme', btnScheme == 'auto' ? false : newScheme)
                    schemeModal.querySelectorAll('button').forEach(btn =>
                        btn.classList = '') // clear prev emphasized active scheme
                    newBtn.classList = 'primary-modal-btn' // emphasize newly active scheme
                    newBtn.style.cssText = 'pointer-events: none' // disable hover fx to show emphasis
                    setTimeout(() => { newBtn.style.pointerEvents = 'auto' }, // re-enable hover fx
                        100) // ...after 100ms to flicker emphasis
                    update.scheme(newScheme) ; schemeNotify(btnScheme)
                }
            }

            log.debug('Success! Scheme modal shown')

            function schemeNotify(scheme) {

                // Show notification
                notify(`${app.msgs.menuLabel_colorScheme}: `
                      + ( scheme == 'light' ? app.msgs.scheme_light || 'Light'
                        : scheme == 'dark'  ? app.msgs.scheme_dark  || 'Dark'
                                            : app.msgs.menuLabel_auto ).toUpperCase() )

                // Append scheme icon
                const notifs = document.querySelectorAll('.chatgpt-notif')
                const notif = notifs[notifs.length -1]
                const schemeIcon = icons[scheme == 'light' ? 'sun' : scheme == 'dark' ? 'moon' : 'arrowsCycle'].create()
                schemeIcon.style.cssText = 'width: 23px ; height: 23px ; position: relative ;'
                                         + 'top: 3px ; margin: 3px 0 0 6px'
                notif.append(schemeIcon)
            }

            return schemeModal
        },

        settings: {

            createAppend() {
                log.caller = 'modals.settings.createAppend()'

                // Init master elems
                const settingsContainer = document.createElement('div'),
                      settingsModal = document.createElement('div') ; settingsModal.id = `${app.cssPrefix}-settings`
                      settingsContainer.append(settingsModal)

                // Init settings keys
                log.debug('Initializing settings keys...')
                const settingsKeys = Object.keys(settings.controls).filter(key =>
                    !(env.browser.isMobile && settings.controls[key].mobile == false))
                log.debug(`Success! settingsKeys = ${log.prettifyObj(settingsKeys)}`)

                // Init logo
                const settingsIcon = icons.amzgpt.create()
                settingsIcon.style.cssText += `width: 65px ; margin-bottom: ${ env.browser.isPortrait ? -4 : 4 }px ;`
                                            + `position: relative ; top: -30px ; right: ${
                                                   env.browser.isPortrait ? -5 : 7 }px`

                // Init title
                const settingsTitleDiv = document.createElement('div')
                settingsTitleDiv.id = `${app.cssPrefix}-settings-title`
                const settingsTitleH4 = document.createElement('h4')
                settingsTitleH4.textContent = app.msgs.menuLabel_settings
                const settingsTitleIcon = icons.cogwheel.create()
                settingsTitleIcon.style.cssText = 'width: 21px ; height: 21px ; margin-right: 3px ;'
                                                + 'position: relative ; top: 1.5px ; right: 3px'
                settingsTitleH4.prepend(settingsTitleIcon) ; settingsTitleDiv.append(settingsTitleH4)

                // Init settings lists
                log.debug('Initializing settings lists...')
                const settingsLists = [], middleGap = 30 // px
                const settingsListContainer = document.createElement('div')
                const settingsListCnt = (
                    env.browser.isMobile && ( env.browser.isPortrait || settingsKeys.length < 8 )) ? 1 : 2
                const settingItemCap = Math.floor(settingsKeys.length /2)
                for (let i = 0 ; i < settingsListCnt ; i++) settingsLists.push(document.createElement('ul'))
                settingsListContainer.style.width = '95%' // pad vs. parent
                if (settingsListCnt > 1) { // style multi-list landscape mode
                    settingsListContainer.style.cssText += ( // make/pad flexbox, add middle gap
                        `display: flex ; padding: 11px 0 13px ; gap: ${ middleGap /2 }px` )
                    settingsLists[0].style.cssText = ( // add vertical separator
                        `padding-right: ${ middleGap /2 }px ; border-right: 1px dotted ${
                            env.ui.app.scheme == 'dark' ? 'white' : 'black '}` )
                }
                log.debug(`Success! settingsListCnt = ${settingsListCnt}`)

                // Create/append setting icons/labels/toggles
                settingsKeys.forEach((key, idx) => {
                    const setting = settings.controls[key]

                    // Create/append item/label elems
                    const settingItem = document.createElement('li') ; settingItem.id = key + '-menu-entry'
                    settingItem.title = setting.helptip || '' // for hover assistance
                    const settingLabel = document.createElement('label') ; settingLabel.textContent = setting.label
                    settingItem.append(settingLabel);
                    (settingsLists[env.browser.isPortrait ? 0 : +(idx >= settingItemCap)]).append(settingItem)

                    // Create/prepend icons
                    const settingIcon = icons[setting.icon].create(/bg|fg/.exec(key)?.[0] ?? '')
                    settingIcon.style.cssText = 'position: relative ;' + (
                        /proxy/i.test(key) ? 'top: 3px ; left: -0.5px ; margin-right: 9px'
                      : /streaming/i.test(key) ? 'top: 3px ; left: 0.5px ; margin-right: 9px'
                      : /auto(?:get|focus)/i.test(key) ? 'top: 4.5px ; margin-right: 7px'
                      : /autoscroll/i.test(key) ? 'top: 3.5px ; left: -1.5px ; margin-right: 6px'
                      : /animation/i.test(key) ? 'top: 3px ; left: -1.5px ; margin-right: 6.5px'
                      : /replylang/i.test(key) ? 'top: 3px ; left: -1.5px ; margin-right: 9px'
                      : /scheme/i.test(key) ? 'top: 2.5px ; left: -1.5px ; margin-right: 8px'
                      : /debug/i.test(key) ? 'top: 3.5px ; left: -1.5px ; margin-right: 8px'
                      : /about/i.test(key) ? 'top: 3px ; left: -3px ; margin-right: 5.5px' : ''
                    )
                    settingItem.prepend(settingIcon)

                    // Create/append toggles/listeners
                    if (setting.type == 'toggle') {

                        // Init toggle input
                        const settingToggle = document.createElement('input'),
                              settingToggleAttrs = [['type', 'checkbox'], ['disabled', true]]
                        settingToggleAttrs.forEach(([attr, value]) => settingToggle.setAttribute(attr, value))
                        settingToggle.checked = config[key] ^ key.includes('Disabled') // init based on config/name
                            && !(key == 'streamingDisabled' && !config.proxyAPIenabled) // uncheck Streaming in OAI mode
                        settingToggle.style.display = 'none' // hide checkbox

                        // Create/stylize switch
                        const switchSpan = document.createElement('span')
                        Object.assign(switchSpan.style, {
                            position: 'relative', left: '-1px', bottom:'-5.5px', float: 'right',
                            backgroundColor: settingToggle.checked ? '#ccc' : '#AD68FF', // init opposite  final color
                            width: '26px', height: '13px', '-webkit-transition': '.4s',
                            transition: '0.4s',  borderRadius: '28px'
                        })

                        // Create/stylize knob
                        const knobSpan = document.createElement('span')
                        Object.assign(knobSpan.style, {
                            position: 'absolute', left: '1px', bottom: '1px',
                            width: '11px', height: '11px', content: '""', borderRadius: '28px',
                            transform: settingToggle.checked ? // init opposite final pos
                                'translateX(0)' : 'translateX(14px) translateY(0)',
                            backgroundColor: 'white',  '-webkit-transition': '0.2s', transition: '0.2s'
                        })

                        // Append elems
                        switchSpan.append(knobSpan) ; settingItem.append(settingToggle, switchSpan)

                        // Update visual state w/ animation
                        setTimeout(() => modals.settings.toggle.updateStyles(settingToggle), idx *25 -25)

                        // Add click listener
                        settingItem.onclick = () => {
                            if (!(key == 'streamingDisabled' // visually switch toggle if not Streaminng...
                                && ( // ...in unsupported env...
                                    !streamingSupported.byBrowser || !streamingSupported.byScriptManager
                                        || !config.proxyAPIenabled )
                            )) modals.settings.toggle.switch(settingToggle)

                            // Call specialized toggle funcs
                            if (key.includes('proxy')) toggle.proxyMode()
                            else if (key.includes('streaming')) toggle.streaming()
                            else if (key.includes('bgAnimation')) toggle.animations('bg')
                            else if (key.includes('fgAnimation')) toggle.animations('fg')

                            // ...or generically toggle/notify
                            else {
                                log.caller = 'settings.createAppend()'
                                log.debug(`Toggling ${settingItem.textContent} ${
                                    key.includes('Disabled') ^ config[key] ? 'OFF' : 'ON' }...`)
                                settings.save(key, !config[key]) // update config
                                notify(`${settings.controls[key].label} ${
                                    menu.state.words[+(key.includes('Disabled') ^ config[key])]}`)
                                log[key.includes('debug') ? 'info' : 'debug'](`Success! config.${key} = ${config[key]}`)
                            }
                        }

                    // Add .active + config status + listeners to pop-up settings
                    } else {
                        settingItem.classList.add('active')
                        const configStatusSpan = document.createElement('span')
                        configStatusSpan.style.cssText = 'float: right ; font-size: 11px ; margin-top: 3px ;'
                            + ( !key.includes('about') ? 'text-transform: uppercase !important' : '' )
                        if (key.includes('replyLang')) {
                            configStatusSpan.textContent = config.replyLanguage
                            settingItem.onclick = () => modals.open('replyLang')
                        } else if (key.includes('scheme')) {
                            modals.settings.updateSchemeStatus(configStatusSpan)
                            settingItem.onclick = () => modals.open('scheme')
                        } else if (key.includes('about')) {
                            const innerDiv = document.createElement('div'),
                                  textGap = '&emsp;&emsp;&emsp;&emsp;&emsp;'
                            modals.settings.aboutContent = {}
                            modals.settings.aboutContent.short = `v${GM_info.script.version}`
                            modals.settings.aboutContent.long = (
                                  `${app.msgs.about_version}: <span class="about-em">v${
                                       GM_info.script.version + textGap }</span>`
                                + `${app.msgs.about_poweredBy} <span class="about-em">chatgpt.js</span>${textGap}` )
                            for (let i = 0; i < 7; i++)
                                modals.settings.aboutContent.long += modals.settings.aboutContent.long // make long af
                            innerDiv.innerHTML = modals.settings.aboutContent[
                                config.fgAnimationsDisabled ? 'short' : 'long']
                            innerDiv.style.float = config.fgAnimationsDisabled ? 'right' : ''
                            configStatusSpan.append(innerDiv) ; settingItem.onclick = () => modals.open('about')
                        } settingItem.append(configStatusSpan)
                    }
                })
                settingsListContainer.append(...settingsLists)

                // Create close button
                log.debug('Creating Close button...')
                const closeBtn = document.createElement('div')
                closeBtn.classList.add(`${app.cssPrefix}-modal-close-btn`, 'no-mobile-tap-outline')
                closeBtn.title = app.msgs.tooltip_close
                const closeSVG = icons.x.create() ; closeBtn.append(closeSVG)

                // Assemble/append elems
                settingsModal.append(settingsIcon, settingsTitleDiv, closeBtn, settingsListContainer)
                document.body.append(settingsContainer)

                // Add listeners to dismiss modal
                const dismissElems = [settingsContainer, closeBtn, closeSVG]
                dismissElems.forEach(elem => elem.onclick = modals.handlers.click)

                return settingsContainer
            },

            get() { return document.getElementById(`${app.cssPrefix}-settings`) },

            show() {
                log.caller = 'modals.settings.show()'
                log.debug('Showing Settings modal...')
                const settingsContainer = modals.settings.get()?.parentNode || modals.settings.createAppend()
                settingsContainer.style.display = '' // show modal
                log.caller = 'modals.settings.show()'
                if (env.browser.isMobile) { // scale 93% to viewport sides
                    log.debug('Scaling 93% to viewport sides...')
                    const settingsModal = settingsContainer.querySelector(`#${app.cssPrefix}-settings`),
                          scaleRatio = 0.93 * window.innerWidth / settingsModal.offsetWidth
                    settingsModal.style.transform = `scale(${scaleRatio})`
                }
                log.debug('Success! Settings modal shown')
                return settingsContainer.firstChild
            },

            toggle: {
                switch(settingToggle) {
                    settingToggle.checked = !settingToggle.checked
                    modals.settings.toggle.updateStyles(settingToggle)
                },

                updateStyles(settingToggle) { // for .toggle.show() + staggered switch animations in .createAppend()
                    const settingLi = settingToggle.parentNode,
                          switchSpan = settingLi.querySelector('span'),
                          knobSpan = switchSpan.querySelector('span')
                    setTimeout(() => {
                        switchSpan.style.backgroundColor = settingToggle.checked ? '#ad68ff' : '#ccc'
                        switchSpan.style.boxShadow = settingToggle.checked ? '2px 1px 9px #d8a9ff' : 'none'
                        knobSpan.style.transform = settingToggle.checked ?
                            'translateX(14px) translateY(0)' : 'translateX(0)'
                        settingLi.classList[settingToggle.checked ? 'add' : 'remove']('active') // dim/brighten entry
                    }, 1) // min delay to trigger transition fx
                }
            },

            updateSchemeStatus(schemeStatusSpan = null) {
                schemeStatusSpan = schemeStatusSpan || document.querySelector('#scheme-menu-entry span')
                if (schemeStatusSpan) {
                    schemeStatusSpan.textContent = ''
                    schemeStatusSpan.append(...( // status txt + icon
                        config.scheme == 'dark' ? [document.createTextNode(app.msgs.scheme_dark), icons.moon.create()]
                      : config.scheme == 'light' ? [document.createTextNode(app.msgs.scheme_light), icons.sun.create()]
                      : [document.createTextNode(app.msgs.menuLabel_auto), icons.arrowsCycle.create()] ))
                    schemeStatusSpan.style.cssText += `; margin-top: ${ !config.scheme ? 3 : 0 }px !important`
                }
            }
        },

        update: {
            width: 488,

            available() {
                log.debug(`Update v${app.latestVer} found!`)

                // Show modal
                const updateAvailModal = modals.alert(`🚀 ${app.msgs.alert_updateAvail}!`, // title
                    `${app.msgs.alert_newerVer} ${app.name} `
                        + `(v${app.latestVer}) ${app.msgs.alert_isAvail}!  `
                        + '<a target="_blank" rel="noopener" style="font-size: 1.1rem" href="'
                            + app.urls.update.replace(/.+\/([^/]+)meta\.js/,
                                `${app.urls.gitHub}/blob/main/greasemonkey/$1user.js`)
                        + `">${app.msgs.link_viewChanges}</a>`,
                    function update() { // button
                        GM_openInTab(app.urls.update.replace('meta.js', 'user.js') + '?t=' + Date.now(),
                            { active: true, insert: true } // focus, make adjacent
                        ).onclose = () => location.reload()
                    }, '', modals.update.width
                )

                // Localize button labels if needed
                if (!env.browser.language.startsWith('en')) {
                    log.debug('Localizing button labels in non-English alert...')
                    const updateBtns = updateAvailModal.querySelectorAll('button')
                    updateBtns[1].textContent = app.msgs.btnLabel_update
                    updateBtns[0].textContent = app.msgs.btnLabel_dismiss
                }

                return updateAvailModal
            },

            unavailable() {
                log.debug('No update found.')
                return modals.alert(`${app.msgs.alert_upToDate}!`, // title
                    `${app.name} (v${app.version}) ${app.msgs.alert_isUpToDate}!`, // msg
                    '', '', modals.update.width
                )
            }
        },

        safeWinOpen(url) { open(url, '_blank', 'noopener') } // to prevent backdoor vulnerabilities
    }

    // Define ICON functions

    const icons = {

        amzgpt: {
            create(color = '') {
                const icon = document.createElement('img') ; icon.id = `${app.cssPrefix}-icon`
                icons.amzgpt.update(icon, color)
                return icon
            },

            update(targetIcons = [], color = '') {
                if (!Array.isArray(targetIcons)) targetIcons = [targetIcons]
                if (targetIcons.length == 0) targetIcons = document.querySelectorAll(`#${app.cssPrefix}-icon`)
                targetIcons.forEach(icon => {
                    icon.src = GM_getResourceText(`amzgpt${
                        color == 'white' || !color && env.ui.app.scheme == 'dark' ? 'DS' : 'LS' }icon`)
                    icon.style.filter = icon.style.webkitFilter = (
                        'drop-shadow(5px 5px 15px rgba(0, 0, 0, 0.3))' // drop shadow
                      + ( env.ui.app.scheme == 'dark' ? // RGB shift
                            'drop-shadow(2px 1px 0 #ff5b5b) drop-shadow(-1px -1px 0 rgb(73, 215, 73, 0.75))' : '' ))
                })
            }
        },

        arrowsCycle: {
            create() {
                const svg = create.svgElem('svg', {
                    width: 13, height: 13, viewBox: '197 -924 573 891', style: 'transform: rotate(14deg)' })
                const svgPath = create.svgElem('path', { stroke: 'none',
                    d: 'M204-318q-22-38-33-78t-11-82q0-134 93-228t227-94h7l-64-64 56-56 160 160-160 160-56-56 64-64h-7q-100 0-170 70.5T240-478q0 26 6 51t18 49l-60 60ZM481-40 321-200l160-160 56 56-64 64h7q100 0 170-70.5T720-482q0-26-6-51t-18-49l60-60q22 38 33 78t11 82q0 134-93 228t-227 94h-7l64 64-56 56Z' })
                svg.append(svgPath) ; return svg
            }
        },

        arrowsDiagonal: {
            inwardSVGpath() { return create.svgElem('path', { stroke: 'none',
                d: 'M5 1h2v6H1V5h2.59L0 1.41 1.41 0 5 3.59zm7.41 10H15V9H9v6h2v-2.59L14.59 16 16 14.59z'
            })},

            outwardSVGpath() { return create.svgElem('path', { stroke: 'none',
                d: 'M8 6.59L6.59 8 3 4.41V7H1V1h6v2H4.41zM13 9v2.59L9.41 8 8 9.41 11.59 13H9v2h6V9z'
            })},

            create() {
                const svg = create.svgElem('svg', {
                    id: 'arrows-diagonal-icon', width: 16, height: 16, viewBox: '0 0 16 16' })
                icons.arrowsDiagonal.update(svg) ; return svg
            },

            update(...targetIcons) {
                targetIcons = targetIcons.flat() // flatten array args nested by spread operator
                if (targetIcons.length == 0) targetIcons = document.querySelectorAll('#arrows-diagonal-icon')
                targetIcons.forEach(icon => {
                    icon.firstChild?.remove() // clear prev paths
                    icon.append(icons.arrowsDiagonal[config.expanded ? 'inwardSVGpath' : 'outwardSVGpath']())
                })
            }
        },

        arrowsDown: {
            create() {
                const svg = create.svgElem('svg', { width: 19, height: 19, viewBox: '0 0 24 24' })
                svg.append(
                    create.svgElem('path', { stroke: 'none', d: 'M18,13H6a1,1,0,0,1,0-2H18a1,1,0,0,1,0,2Z' }),
                    create.svgElem('path', { stroke: 'none',
                        d: 'M14.71,18.29a1,1,0,0,1,0,1.42l-2,2a1,1,0,0,1-1.42,0l-2-2a1,1,0,0,1,1.42-1.42l.29.3V16a1,1,0,0,1,2,0v2.59l.29-.3A1,1,0,0,1,14.71,18.29ZM11.29,8.71a1,1,0,0,0,1.42,0l2-2a1,1,0,1,0-1.42-1.42l-.29.3V3a1,1,0,0,0-2,0V5.59l-.29-.3A1,1,0,0,0,9.29,6.71Z' }))
                return svg
            }
        },

        arrowsTwistedRight: {
            create() {
                const svg = create.svgElem('svg', { width: 21, height: 21, viewBox: '-1 -1 32 32' })
                const svgPath = create.svgElem('path', { stroke: '',
                    d: 'M23.707,16.293L28.414,21l-4.707,4.707l-1.414-1.414L24.586,22H23c-2.345,0-4.496-1.702-6.702-3.753c0.498-0.458,0.984-0.92,1.46-1.374C19.624,18.6,21.393,20,23,20h1.586l-2.293-2.293L23.707,16.293zM23,11h1.586l-2.293,2.293l1.414,1.414L28.414,10l-4.707-4.707l-1.414,1.414L24.586,9H23c-2.787,0-5.299,2.397-7.957,4.936C12.434,16.425,9.736,19,7,19H4v2h3c3.537,0,6.529-2.856,9.424-5.618C18.784,13.129,21.015,11,23,11zM11.843,14.186c0.5-0.449,0.995-0.914,1.481-1.377C11.364,11.208,9.297,10,7,10H4v2h3C8.632,12,10.25,12.919,11.843,14.186z' })
                svg.append(svgPath) ; return svg
            }
        },

        arrowUp: {
            create() {
                const svg = create.svgElem('svg', {
                    width: 16, height: 16, viewBox: '4 2 16 16', 'stroke-width': '2',
                    'stroke-linecap': 'round', 'stroke-linejoin': 'round' })
                const svgPath = create.svgElem('path', {
                    stroke: '', fill: 'none', 'stroke-width': '2', linecap: 'round',
                    'stroke-linejoin': 'round', d: 'M7 11L12 6L17 11M12 18V7' })
                svg.append(svgPath) ; return svg
            }
        },

        bug: {
            create() {
                const svg = create.svgElem('svg', { width: 16, height: 16, viewBox: '0 0 17 17' })
                svg.append(
                    create.svgElem('path', {
                        d: 'M7 0V1.60002C7.32311 1.53443 7.65753 1.5 8 1.5C8.34247 1.5 8.67689 1.53443 9 1.60002V0H11V2.49963C11.8265 3.12041 12.4543 3.99134 12.7711 5H3.2289C3.5457 3.99134 4.17354 3.12041 5 2.49963V0H7Z' }),
                    create.svgElem('path', {
                        d: 'M0 7V9H3V10.4957L0.225279 11.2885L0.774721 13.2115L3.23189 12.5095C3.87194 14.5331 5.76467 16 8 16C10.2353 16 12.1281 14.5331 12.7681 12.5095L15.2253 13.2115L15.7747 11.2885L13 10.4957V9H16V7H9V12H7V7H0Z' }))
                return svg
            }
        },

        caretsInward: {
            create() {
                const svg = create.svgElem('svg', { width: 17, height: 17, viewBox: '0 0 24 24' })
                const svgPath = create.svgElem('path', { stroke: '',
                    d: 'M11.29,9.71a1,1,0,0,0,1.42,0l5-5a1,1,0,1,0-1.42-1.42L12,7.59,7.71,3.29A1,1,0,0,0,6.29,4.71Zm1.42,4.58a1,1,0,0,0-1.42,0l-5,5a1,1,0,0,0,1.42,1.42L12,16.41l4.29,4.3a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42Z' })
                svg.append(svgPath) ; return svg
            }
        },

        checkmarkDouble: {
            create() {
                const svg = create.svgElem('svg', { width: 17, height: 17, viewBox: '0 0 24 24' })
                svg.append(
                    create.svgElem('path', { stroke: 'none',
                        d: 'M23.228 8.01785C23.6186 7.62741 23.6187 6.99424 23.2283 6.60363L22.5213 5.89638C22.1309 5.50577 21.4977 5.50563 21.1071 5.89607L10.0862 16.9122C9.69563 17.3027 9.6955 17.9359 10.0859 18.3265L10.7929 19.0337C11.1833 19.4243 11.8165 19.4245 12.2071 19.034L23.228 8.01785Z' }),
                    create.svgElem('path', { stroke: 'none',
                        d: 'M17.2285 8.01777C17.619 7.62724 17.619 6.99408 17.2285 6.60356L16.5214 5.89645C16.1309 5.50592 15.4977 5.50592 15.1072 5.89645L5.54542 15.4582L2.76773 12.6805C2.37721 12.29 1.74404 12.29 1.35352 12.6805L0.646409 13.3876C0.255884 13.7782 0.255885 14.4113 0.646409 14.8019L4.83831 18.9938C5.22883 19.3843 5.862 19.3843 6.25252 18.9938L17.2285 8.01777Z' })
                )
                return svg
            }
        },

        chevronDown: {
            create() {
                const svg = create.svgElem('svg', { width: 20, height: 20, viewBox: '0 0 16 16' }),
                      svgPath = create.svgElem('path', { stroke: 'none', d: 'M1 5l7 4.61L15 5v2.39L8 12 1 7.39z' })
                svg.append(svgPath) ; return svg
            }
        },

        chevronUp: {
            create() {
                const svg = create.svgElem('svg', { width: 20, height: 20, viewBox: '0 0 16 16' }),
                      svgPath = create.svgElem('path', { stroke: 'none', d: 'M15 11L8 6.39 1 11V8.61L8 4l7 4.61z' })
                svg.append(svgPath) ; return svg
            }
        },

        cogwheel: {
            create() {
                const svg = create.svgElem('svg', { width: 17, height: 17, viewBox: '0 0 24 24' })
                svg.append(
                    create.svgElem('path', { 'fill-rule': 'evenodd',
                        d: 'M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.67 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z' }))
                return svg
            }
        },

        copy: {
            create() {
                const svg = create.svgElem('svg', { width: 18, height: 18, viewBox: '0 0 1024 1024' })
                svg.append(
                    create.svgElem('path', { stroke: 'none',
                        d: 'M768 832a128 128 0 0 1-128 128H192A128 128 0 0 1 64 832V384a128 128 0 0 1 128-128v64a64 64 0 0 0-64 64v448a64 64 0 0 0 64 64h448a64 64 0 0 0 64-64h64z' }),
                    create.svgElem('path', { stroke: 'none',
                        d: 'M384 128a64 64 0 0 0-64 64v448a64 64 0 0 0 64 64h448a64 64 0 0 0 64-64V192a64 64 0 0 0-64-64H384zm0-64h448a128 128 0 0 1 128 128v448a128 128 0 0 1-128 128H384a128 128 0 0 1-128-128V192A128 128 0 0 1 384 64z' }))
                return svg
            }
        },

        fontSize: {
            create() {
                const svg = create.svgElem('svg', { width: 17, height: 17, viewBox: '0 0 512 512' })
                svg.append(
                    create.svgElem('path', { stroke: 'none',
                        d: 'M234.997 448.199h-55.373a6.734 6.734 0 0 1-6.556-5.194l-11.435-48.682a6.734 6.734 0 0 0-6.556-5.194H86.063a6.734 6.734 0 0 0-6.556 5.194l-11.435 48.682a6.734 6.734 0 0 1-6.556 5.194H7.74c-4.519 0-7.755-4.363-6.445-8.687l79.173-261.269a6.734 6.734 0 0 1 6.445-4.781h69.29c2.97 0 5.59 1.946 6.447 4.79l78.795 261.269c1.303 4.322-1.933 8.678-6.448 8.678zm-88.044-114.93l-19.983-84.371c-1.639-6.921-11.493-6.905-13.111.02l-19.705 84.371c-.987 4.224 2.22 8.266 6.558 8.266H140.4c4.346 0 7.555-4.056 6.553-8.286z' }),
                    create.svgElem('path', { stroke: 'none',
                        d: 'M502.572 448.199h-77.475a9.423 9.423 0 0 1-9.173-7.268l-16-68.114a9.423 9.423 0 0 0-9.173-7.268H294.19a9.423 9.423 0 0 0-9.173 7.268l-16 68.114a9.423 9.423 0 0 1-9.173 7.268h-75.241c-6.322 0-10.851-6.104-9.017-12.155L286.362 70.491a9.422 9.422 0 0 1 9.017-6.69h96.947a9.422 9.422 0 0 1 9.021 6.702l110.245 365.554c1.825 6.047-2.703 12.142-9.02 12.142zM379.385 287.395l-27.959-118.047c-2.293-9.683-16.081-9.661-18.344.029l-27.57 118.047c-1.38 5.91 3.106 11.565 9.175 11.565h55.529c6.082-.001 10.571-5.676 9.169-11.594z' })
                )
                return svg
            }
        },

        languageChars: {
            create() {
                const svg = create.svgElem('svg', { width: 15, height: 15, viewBox: '0 -960 960 960' })
                const svgPath = create.svgElem('path', { stroke: 'none',
                    d: 'm459-48 188-526h125L960-48H847l-35-100H603L568-48H459ZM130-169l-75-75 196-196q-42-45-78-101t-55-105h117q17 32 40.5 67.5T325-514q35-37 70-93t64-119H0v-106h290v-80h106v80h290v106H572q-23 74-70 152T399-438l82 85-39 111-118-121-194 194Zm508-79h139l-69-197-70 197Z' })
                svg.append(svgPath) ; return svg
            }
        },

        moon: {
            create() {
                const svg = create.svgElem('svg', { width: 17, height: 17, viewBox: '0 0 24 24' })
                const svgPath = create.svgElem('path', {
                    fill: 'none', stroke: '', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round',
                    d: 'M3.32031 11.6835C3.32031 16.6541 7.34975 20.6835 12.3203 20.6835C16.1075 20.6835 19.3483 18.3443 20.6768 15.032C19.6402 15.4486 18.5059 15.6834 17.3203 15.6834C12.3497 15.6834 8.32031 11.654 8.32031 6.68342C8.32031 5.50338 8.55165 4.36259 8.96453 3.32996C5.65605 4.66028 3.32031 7.89912 3.32031 11.6835Z' })
                svg.append(svgPath) ; return svg
            }
        },

        questionMarkCircle: {
            create() {
                const svg = create.svgElem('svg', { width: 17, height: 17, viewBox: '0 0 56.693 56.693' })
                const svgPath = create.svgElem('path', { stroke: 'none',
                    d: 'M28.765,4.774c-13.562,0-24.594,11.031-24.594,24.594c0,13.561,11.031,24.594,24.594,24.594  c13.561,0,24.594-11.033,24.594-24.594C53.358,15.805,42.325,4.774,28.765,4.774z M31.765,42.913c0,0.699-0.302,1.334-0.896,1.885  c-0.587,0.545-1.373,0.82-2.337,0.82c-0.993,0-1.812-0.273-2.431-0.814c-0.634-0.551-0.954-1.188-0.954-1.891v-1.209  c0-0.703,0.322-1.34,0.954-1.891c0.619-0.539,1.438-0.812,2.431-0.812c0.964,0,1.75,0.277,2.337,0.82  c0.594,0.551,0.896,1.186,0.896,1.883V42.913z M38.427,24.799c-0.389,0.762-0.886,1.432-1.478,1.994  c-0.581,0.549-1.215,1.044-1.887,1.473c-0.643,0.408-1.248,0.852-1.798,1.315c-0.539,0.455-0.99,0.963-1.343,1.512  c-0.336,0.523-0.507,1.178-0.507,1.943v0.76c0,0.504-0.247,1.031-0.735,1.572c-0.494,0.545-1.155,0.838-1.961,0.871l-0.167,0.004  c-0.818,0-1.484-0.234-1.98-0.699c-0.532-0.496-0.801-1.055-0.801-1.658c0-1.41,0.196-2.611,0.584-3.572  c0.385-0.953,0.86-1.78,1.416-2.459c0.554-0.678,1.178-1.27,1.854-1.762c0.646-0.467,1.242-0.93,1.773-1.371  c0.513-0.428,0.954-0.885,1.312-1.354c0.328-0.435,0.489-0.962,0.489-1.608c0-1.066-0.289-1.83-0.887-2.334  c-0.604-0.512-1.442-0.771-2.487-0.771c-0.696,0-1.294,0.043-1.776,0.129c-0.471,0.083-0.905,0.223-1.294,0.417  c-0.384,0.19-0.745,0.456-1.075,0.786c-0.346,0.346-0.71,0.783-1.084,1.301c-0.336,0.473-0.835,0.83-1.48,1.062  c-0.662,0.239-1.397,0.175-2.164-0.192c-0.689-0.344-1.11-0.793-1.254-1.338c-0.135-0.5-0.135-1.025-0.002-1.557  c0.098-0.453,0.369-1.012,0.83-1.695c0.451-0.67,1.094-1.321,1.912-1.938c0.814-0.614,1.847-1.151,3.064-1.593  c1.227-0.443,2.695-0.668,4.367-0.668c1.648,0,3.078,0.249,4.248,0.742c1.176,0.496,2.137,1.157,2.854,1.967  c0.715,0.809,1.242,1.738,1.568,2.762c0.322,1.014,0.486,2.072,0.486,3.146C39.024,23.075,38.823,24.024,38.427,24.799z' })
                svg.append(svgPath) ; return svg
            }
        },

        scheme: {
            create() {
                const svg = create.svgElem('svg', { width: 15, height: 15, viewBox: '0 -960 960 960' })
                const svgPath = create.svgElem('path', { stroke: 'none',
                    d: 'M479.92-34q-91.56 0-173.4-35.02t-142.16-95.34q-60.32-60.32-95.34-142.24Q34-388.53 34-480.08q0-91.56 35.02-173.4t95.34-142.16q60.32-60.32 142.24-95.34Q388.53-926 480.08-926q91.56 0 173.4 35.02t142.16 95.34q60.32 60.32 95.34 142.24Q926-571.47 926-479.92q0 91.56-35.02 173.4t-95.34 142.16q-60.32 60.32-142.24 95.34Q571.47-34 479.92-34ZM530-174q113-19 186.5-102.78T790-480q0-116.71-73.5-201.35Q643-766 530-785v611Z' })
                svg.append(svgPath) ; return svg
            }
        },

        signalStream: {
            create() {
                const svg = create.svgElem('svg', { width: 16, height: 16, viewBox: '0 0 32 32' })
                const svgPath = create.svgElem('path', { stroke: '', 'stroke-width': 0.5,
                    d: 'M16 11.75c-2.347 0-4.25 1.903-4.25 4.25s1.903 4.25 4.25 4.25c2.347 0 4.25-1.903 4.25-4.25v0c-0.003-2.346-1.904-4.247-4.25-4.25h-0zM16 17.75c-0.966 0-1.75-0.784-1.75-1.75s0.784-1.75 1.75-1.75c0.966 0 1.75 0.784 1.75 1.75v0c-0.001 0.966-0.784 1.749-1.75 1.75h-0zM3.25 16c0.211-3.416 1.61-6.471 3.784-8.789l-0.007 0.008c0.223-0.226 0.361-0.536 0.361-0.879 0-0.69-0.56-1.25-1.25-1.25-0.344 0-0.655 0.139-0.881 0.363l0-0c-2.629 2.757-4.31 6.438-4.506 10.509l-0.001 0.038c0.198 4.109 1.879 7.79 4.514 10.553l-0.006-0.006c0.226 0.228 0.54 0.369 0.886 0.369 0.69 0 1.249-0.559 1.249-1.249 0-0.346-0.141-0.659-0.368-0.885l-0-0c-2.173-2.307-3.573-5.363-3.774-8.743l-0.002-0.038zM9.363 16c0.149-2.342 1.109-4.436 2.6-6.026l-0.005 0.005c0.224-0.226 0.363-0.537 0.363-0.88 0-0.69-0.56-1.25-1.25-1.25-0.345 0-0.657 0.139-0.883 0.365l0-0c-1.94 2.035-3.179 4.753-3.323 7.759l-0.001 0.028c0.145 3.032 1.384 5.75 3.329 7.79l-0.005-0.005c0.226 0.228 0.54 0.369 0.886 0.369 0.69 0 1.249-0.559 1.249-1.249 0-0.346-0.141-0.659-0.368-0.885l-0-0c-1.49-1.581-2.451-3.676-2.591-5.993l-0.001-0.027zM26.744 5.453c-0.226-0.227-0.54-0.368-0.886-0.368-0.691 0-1.251 0.56-1.251 1.251 0 0.345 0.139 0.657 0.365 0.883l-0-0c2.168 2.31 3.567 5.365 3.775 8.741l0.002 0.040c-0.21 3.417-1.609 6.471-3.784 8.789l0.007-0.008c-0.224 0.226-0.362 0.537-0.362 0.88 0 0.691 0.56 1.251 1.251 1.251 0.345 0 0.657-0.14 0.883-0.365l-0 0c2.628-2.757 4.308-6.439 4.504-10.509l0.001-0.038c-0.198-4.108-1.878-7.79-4.512-10.553l0.006 0.007zM21.811 8.214c-0.226-0.224-0.537-0.363-0.881-0.363-0.69 0-1.25 0.56-1.25 1.25 0 0.343 0.138 0.653 0.361 0.879l-0-0c1.486 1.585 2.447 3.678 2.594 5.992l0.001 0.028c-0.151 2.343-1.111 4.436-2.601 6.027l0.005-0.005c-0.224 0.226-0.362 0.537-0.362 0.88 0 0.691 0.56 1.251 1.251 1.251 0.345 0 0.657-0.14 0.883-0.365l-0 0c1.939-2.036 3.178-4.754 3.323-7.759l0.001-0.028c-0.145-3.033-1.385-5.751-3.331-7.791l0.005 0.005z' })
                svg.append(svgPath) ; return svg
            }
        },

        sparkles: {
            create(style) { // style = ( 'fg' ? filled front sparkle : 'bg' ? filled rear sparkles )
                const svg = create.svgElem('svg', { width: 18, height: 18, viewBox: '0 0 512 512' })
                svg.append(create.svgElem('path', { // large front sparkle
                    fill: style == 'bg' ? 'none' : '', stroke: '',
                    'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': 32,
                    d: 'M259.92,262.91,216.4,149.77a9,9,0,0,0-16.8,0L156.08,262.91a9,9,0,0,1-5.17,5.17L37.77,311.6a9,9,0,0,0,0,16.8l113.14,43.52a9,9,0,0,1,5.17,5.17L199.6,490.23a9,9,0,0,0,16.8,0l43.52-113.14a9,9,0,0,1,5.17-5.17L378.23,328.4a9,9,0,0,0,0-16.8L265.09,268.08A9,9,0,0,1,259.92,262.91Z' }))
                svg.append(create.svgElem('polygon', { // small(est) rear-left sparkle
                    fill: style == 'fg' ? 'none' : '', stroke: '',
                    'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': 24,
                    points: '108 68 88 16 68 68 16 88 68 108 88 160 108 108 160 88 108 68' }))
                svg.append(create.svgElem('polygon', { // small rear-right sparkle
                    fill: style == 'fg' ? 'none' : '', stroke: '',
                    'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': 32,
                    points: '426.67 117.33 400 48 373.33 117.33 304 144 373.33 170.67 400 240 426.67 170.67 496 144 426.67 117.33' }))
                return svg
            }
        },

        speaker: {
            create() {
                const svg = create.svgElem('svg', { width: 22, height: 22, viewBox: '0 0 32 32' })
                svg.append(
                    create.svgElem('path', { stroke: '', 'stroke-width': '2px', fill: 'none',
                        d: 'M24.5,26c2.881,-2.652 4.5,-6.249 4.5,-10c0,-3.751 -1.619,-7.348 -4.5,-10' }),
                    create.svgElem('path', { stroke: '', 'stroke-width': '2px', fill: 'none',
                        d: 'M22,20.847c1.281,-1.306 2,-3.077 2,-4.924c0,-1.846 -0.719,-3.617 -2,-4.923' }),
                    create.svgElem('path', { stroke: 'none', fill: '',
                        d: 'M9.957,10.88c-0.605,0.625 -1.415,0.98 -2.262,0.991c-4.695,0.022 -4.695,0.322 -4.695,4.129c0,3.806 0,4.105 4.695,4.129c0.846,0.011 1.656,0.366 2.261,0.991c1.045,1.078 2.766,2.856 4.245,4.384c0.474,0.49 1.18,0.631 1.791,0.36c0.611,-0.272 1.008,-0.904 1.008,-1.604c0,-4.585 0,-11.936 0,-16.52c0,-0.7 -0.397,-1.332 -1.008,-1.604c-0.611,-0.271 -1.317,-0.13 -1.791,0.36c-1.479,1.528 -3.2,3.306 -4.244,4.384Z' })
                )
                return svg
            }
        },

        speechBalloonLasso: {
            create() {
                const svg = create.svgElem('svg', { width: 17, height: 17, viewBox: '0 -960 960 960' })
                const svgPath = create.svgElem('path', { stroke: 'none',
                    d: 'M323-41v-247h-10q-105 0-172.5-67T73-528q0-105 74-179t179-74h36l-44-44 69-69 162 162-162 162-69-69 44-44h-36q-64 0-109.5 45.5T171-528q0 64 45.5 109.5T326-373h95v96l96-96h117q64 0 109.5-45.5T789-528q0-64-45.5-109.5T634-683h10v-98h-10q105 0 179 74t74 179q0 105-74 179t-179 74h-77L323-41Z' })
                svg.append(svgPath) ; return svg
            }
        },

        speechBalloons: {
            create() {
                const svg = create.svgElem('svg', { width: 16, height: 16, viewBox: '0 -960 960 960' })
                const svgPath = create.svgElem('path', { stroke: 'none',
                    d: 'M350-212q-32.55 0-55.27-22.73Q272-257.45 272-290v-64h492v-342h63.67q33.33 0 55.83 22.72Q906-650.55 906-618v576L736-212H350ZM54-256v-582.4q0-32.38 22.72-54.99Q99.45-916 132-916h482q32.55 0 55.28 22.72Q692-870.55 692-838v334q0 32.55-22.72 55.27Q646.55-426 614-426H224L54-256Zm540-268v-294H152v294h442Zm-442 0v-294 294Z' })
                svg.append(svgPath) ; return svg
            }
        },

        sun: {
            create() {
                const svg = create.svgElem('svg', { width: 17, height: 17, viewBox: '0 -960 960 960' })
                const svgPath = create.svgElem('path', { stroke: 'none',
                    d: 'M440-760v-160h80v160h-80Zm266 110-55-55 112-115 56 57-113 113Zm54 210v-80h160v80H760ZM440-40v-160h80v160h-80ZM254-652 140-763l57-56 113 113-56 54Zm508 512L651-255l54-54 114 110-57 59ZM40-440v-80h160v80H40Zm157 300-56-57 112-112 29 27 29 28-114 114Zm283-100q-100 0-170-70t-70-170q0-100 70-170t170-70q100 0 170 70t70 170q0 100-70 170t-170 70Zm0-80q66 0 113-47t47-113q0-66-47-113t-113-47q-66 0-113 47t-47 113q0 66 47 113t113 47Zm0-160Z' })
                svg.append(svgPath) ; return svg
            }
        },

        sunglasses: {
            create() {
                const svg = create.svgElem('svg', { width: 17, height: 17, viewBox: '0 0 512 512' })
                const svgPath = create.svgElem('path', { stroke: 'none',
                    d: 'M507.44,185.327c-4.029-5.124-10.185-8.112-16.704-8.112c0,0-48.021,0-156.827,0h-65.774H243.87h-65.774c-108.806,0-156.827,0-156.827,0c-6.519,0-12.675,2.988-16.714,8.112c-4.028,5.125-5.486,11.815-3.965,18.152c0,0,12.421,56.269,19.927,82.534c7.506,26.265,26.265,48.772,86.29,48.772s59.827,0,74.828,0c21.258,0,46.256-19.99,55.028-45.023c4.97-14.16,12.756-32.738,19.338-47.876c6.582,15.138,14.368,33.716,19.338,47.876c8.773,25.033,33.77,45.023,55.028,45.023c15.001,0,14.803,0,74.828,0s78.784-22.507,86.29-48.772c7.496-26.264,19.918-82.534,19.918-82.534C512.935,197.142,511.478,190.452,507.44,185.327z M90.339,278.734C45.314,263.732,40.318,198.7,40.318,198.7s22.507,0,55.028,0L90.339,278.734z M340.464,278.734c-45.015-15.001-50.022-80.034-50.022-80.034s22.508,0,55.029,0L340.464,278.734z' })
                svg.append(svgPath) ; return svg
            }
        },

        x: {
            create() {
                const svg = create.svgElem('svg', { height: 10, viewBox: '0 0 14 14', fill: 'none' })
                const svgPath = create.svgElem('path', {
                    d: 'M13.7071 1.70711C14.0976 1.31658 14.0976 0.683417 13.7071 0.292893C13.3166 -0.0976312 12.6834 -0.0976312 12.2929 0.292893L7 5.58579L1.70711 0.292893C1.31658 -0.0976312 0.683417 -0.0976312 0.292893 0.292893C-0.0976312 0.683417 -0.0976312 1.31658 0.292893 1.70711L5.58579 7L0.292893 12.2929C-0.0976312 12.6834 -0.0976312 13.3166 0.292893 13.7071C0.683417 14.0976 1.31658 14.0976 1.70711 13.7071L7 8.41421L12.2929 13.7071C12.6834 14.0976 13.3166 14.0976 13.7071 13.7071C14.0976 13.3166 14.0976 12.6834 13.7071 12.2929L8.41421 7L13.7071 1.70711Z' })
                svg.append(svgPath) ; return svg
            }
        }
    }

    // Define LOGO functions

    const logos = {
        amzgpt: {

            create() {
                const amzgptLogo = document.createElement('img')
                amzgptLogo.id = `${app.cssPrefix}-logo` ; amzgptLogo.className = 'no-mobile-tap-outline'
                logos.amzgpt.update(amzgptLogo)
                return amzgptLogo
            },

            update(...targetLogos) {
                targetLogos = targetLogos.flat() // flatten array args nested by spread operator
                if (targetLogos.length == 0) targetLogos = document.querySelectorAll(`#${app.cssPrefix}-logo`)
                targetLogos.forEach(logo =>
                    logo.src = GM_getResourceText(`amzgpt${ env.ui.app.scheme == 'dark' ? 'DS' : 'LS' }logo`))
            }
        }
    }

    // Define UPDATE functions

    const update = {

        appBottomPos() { appDiv.style.bottom = `${ config.minimized ? 55 - appDiv.offsetHeight : -7 }px` },

        replyPrefix() {
            const firstP = appDiv.querySelector('pre p')
            if (!firstP) return
            const prefixNeeded = env.ui.app.scheme == 'dark' && !config.bgAnimationsDisabled,
                  prefixExists = firstP.textContent.startsWith('>> ')
            if (prefixNeeded && !prefixExists) firstP.prepend('>> ')
            else if (!prefixNeeded && prefixExists) firstP.textContent = firstP.textContent.replace(/^>> /, '')
        },

        scheme(newScheme) {
            log.caller = `update.scheme('${newScheme}')`
            log.debug(`Updating ${app.name} scheme to ${log.toTitleCase(newScheme)}...`)
            env.ui.app.scheme = newScheme ; logos.amzgpt.update() ; icons.amzgpt.update() ; update.style.app()
            update.stars() ; update.replyPrefix() ; toggle.btnGlow() ; modals.settings.updateSchemeStatus()
            log.debug(`Success! ${app.name} updated to ${log.toTitleCase(newScheme)} scheme`)
        },

        stars() {
            ['sm', 'med', 'lg'].forEach(size =>
                document.querySelectorAll(`[id*="stars-${size}"]`).forEach(starsDiv =>
                    starsDiv.id = config.bgAnimationsDisabled ? `stars-${size}-off`
                    : `${ env.ui.app.scheme == 'dark' ? 'white' : 'black' }-stars-${size}`
            ))
        },

        style: {
            app() {
                const isStarryDM = env.ui.app.scheme == 'dark' && !config.bgAnimationsDisabled
                modals.stylize() // update modal styles
                appStyle.innerText = (
                    ':root {' // color vars
                      + '--app-bg-color-light-scheme: #ffffff ; --app-bg-color-dark-scheme: #282828 ;'
                      + '--pre-bg-color-light-scheme: #e7e7e799 ; --pre-bg-color-dark-scheme: #3a3a3a ;'
                      + '--font-color-light-scheme: #282828 ; --font-color-dark-scheme: #f2f2f2 }'
                  + '@keyframes btn-zoom-fade-out {'
                      + '0% { opacity: 1 } 50% { opacity: 0.65 ; transform: scale(1.85) }'
                      + '75% { opacity: 0.05 ; transform: scale(3.15) } 100% { opacity: 0 ; transform: scale(5.85) }}'
                  + '.no-user-select {'
                      + '-webkit-user-select: none ; -moz-user-select: none ;'
                      + '-ms-user-select: none ; user-select: none }'
                  + '.no-mobile-tap-outline { outline: none ; -webkit-tap-highlight-color: transparent }'
                  + `#${app.cssPrefix} * { scrollbar-width: thin }` // make scrollbars thin in Firefox
                  + '.cursor-overlay {' // for fontSizeSlider.createAppend() drag listeners
                      // ...to show resize cursor everywhere
                      + 'position: fixed ; top: 0 ; left: 0 ; width: 100% ; height: 100% ;'
                      + 'z-index: 9999 ; cursor: ew-resize }'
                  + `#${app.cssPrefix} {`
                      + 'z-index: 5555 ; border-radius: 8px ; padding: 17px 26px 16px ; flex-basis: 0 ;'
                      + `border: ${ env.ui.app.scheme == 'dark' ? 'none' : '1px solid #dadce0' } ;`
                      + 'border-radius: 15px ; flex-grow: 1 ; word-wrap: break-word ; white-space: pre-wrap ;'
                          + 'box-shadow: 0 2px 3px rgba(0, 0, 0, 0.06) ;'
                      + ( config.bgAnimationsDisabled ? // classic flat bg
                            `background: var(--app-bg-color-${env.ui.app.scheme}-scheme) ;`
                          + `color: var(--font-color-${env.ui.app.scheme}-scheme) ;`
                      : `background-image: linear-gradient(180deg, ${ // gradient bg to match stars
                              env.ui.app.scheme == 'dark' ? '#99a8a6 -245px, black 185px'
                                                      : '#b6ebff -163px, white 65px' }) ;` )
                      + ( !config.fgAnimationsDisabled ?
                            'transition: bottom 0.1s cubic-bezier(0, 0, 0.2, 1),' // smoothen Anchor Y minimize/restore
                                      + 'width 0.167s cubic-bezier(0, 0, 0.2, 1),' // smoothen Anchor X expand/shrink
                                      + 'opacity 0.5s ease, transform 0.5s ease ;' : '' ) + '}' // smoothen 1st fade-in
                  + `#${app.cssPrefix}:hover {`
                      + 'box-shadow: 0 1px 6px rgba(0, 0, 0, 0.14) ; transition: box-shadow 0.15s ease }'
                  + `#${app.cssPrefix} p { margin: 0 ; ${ env.ui.app.scheme == 'dark' ? 'color: #ccc' : '' }}`
                  + `#${app.cssPrefix} .alert-link { color: ${
                        env.ui.app.scheme == 'light' ? '#190cb0' : 'white ; text-decoration: underline' }}`
                  + `.${app.cssPrefix}-name, .${app.cssPrefix}-name:hover {`
                      + 'font-size: 1.5rem ; font-weight: 700 ; text-decoration: none ;'
                      + `color: ${ env.ui.app.scheme == 'dark' ? 'white' : 'black' }}`
                  + '.kudoai { margin-left: 6px ; color: #aaa } '
                  + '.kudoai a, .kudoai a:visited { color: #aaa ; text-decoration: none !important } '
                  + `.kudoai a:hover { color: ${ env.ui.app.scheme == 'dark' ? 'white' : 'black' }}`
                  + `#${app.cssPrefix}-div-corner-btns { float: right ; margin-top: -2px }`
                  + `.${app.cssPrefix}-div-corner-btn {`
                      + 'float: right ; cursor: pointer ; position: relative ; top: 4px ;'
                      + `${ env.ui.app.scheme == 'dark' ? 'fill: white ; stroke: white'
                                                        : 'fill: #adadad ; stroke: #adadad' };` // color
                      + 'transition: transform 0.15s ease,' // for hover zooms
                          + 'opacity 0.1s ease-in-out }' // for appDiv.onmouseover + btn-zoom-fade-out shows
                  + `.${app.cssPrefix}-div-corner-btn:hover {`
                      + `${ env.ui.app.scheme == 'dark' ? 'fill: #d9d9d9 ; stroke: #d9d9d9'
                                                        : 'fill: black ; stroke: black' } ;`
                      + `${ config.fgAnimationsDisabled || env.browser.isMobile ? '' : 'transform: scale(1.285)' }}`
                  + `.${app.cssPrefix}-div-corner-btn:active {`
                      + `${ env.ui.app.scheme == 'dark' ? 'fill: #999999 ; stroke: #999999'
                                                        : 'fill: #638ed4 ; stroke: #638ed4' }}`
                  + ( config.bgAnimationsDisabled ? '' : (
                        `#${app.cssPrefix}-logo, .${app.cssPrefix}-div-corner-btn svg {`
                          + `filter: drop-shadow(${ env.ui.app.scheme == 'dark' ? '#7171714d 10px'
                                                                                : '#aaaaaa21 7px' } 7px 3px) }` ))
                  + `#${app.cssPrefix} .loading {`
                      + 'color: #b6b8ba ; animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite }'
                  + `#${app.cssPrefix}.sidebar-free { margin-left: 60px ; height: fit-content }`
                  + `#${app.cssPrefix}-font-size-slider-track {`
                      + 'width: 98% ; height: 7px ; margin: -6px auto -13px ; padding: 15px 0 ;'
                      + 'background-color: #ccc ; box-sizing: content-box; background-clip: content-box ;'
                      + '-webkit-background-clip: content-box }'
                  + `#${app.cssPrefix}-font-size-slider-track::before {` // to add finger cursor to unpadded core only
                      + 'content: "" ; position: absolute ; top: 10px ; left: 0 ; right: 0 ;'
                      + 'height: calc(100% - 20px) ; cursor: pointer }'
                  + `#${app.cssPrefix}-font-size-slider-tip {`
                      + 'z-index: 1 ; position: absolute ; bottom: 20px ;'
                      + 'border-left: 4.5px solid transparent ; border-right: 4.5px solid transparent ;'
                      + 'border-bottom: 16px solid #ccc }'
                  + `#${app.cssPrefix}-font-size-slider-thumb {`
                      + 'z-index: 2 ; width: 10px ; height: 25px ; border-radius: 30% ; position: relative ;'
                      + 'top: -7.65px ; transition: transform 0.05s ease ;'
                      + `background-color: ${ env.ui.app.scheme == 'dark' ? 'white' : '#4a4a4a' } ;`
                      + 'box-shadow: rgba(0, 0, 0, 0.21) 1px 1px 9px 0 ; cursor: ew-resize }'
                  + ( config.fgAnimationsDisabled || env.browser.isMobile ?
                        '' : `#${app.cssPrefix}-font-size-slider-thumb:hover { transform: scale(1.125) }` )
                  + `.${app.cssPrefix}-reply-tip {`
                      + 'content: "" ; position: relative ; border: 7px solid transparent ;'
                      + 'float: left ; left: 7px ; margin: 1.89em -14px 0 0 ;' // positioning
                      + 'border-bottom-style: solid ; border-bottom-width: 16px ; border-top: 0 ; border-bottom-color:'
                          + `${ // hide reply tip for terminal aesthetic
                                isStarryDM ? '#0000' : `var(--pre-bg-color-${env.ui.app.scheme}-scheme)` }}`
                  + `#${app.cssPrefix} > pre {`
                      + `font-size: ${config.fontSize}px ; white-space: pre-wrap ; min-width: 0 ;`
                      + `line-height: ${ config.fontSize * config.lineHeightRatio }px ; overscroll-behavior: contain ;`
                      + 'margin: .99rem 0 7px 0 ; padding: 1.25em 1.25em 0 1.25em ;'
                      + 'border-radius: 10px ; overflow: auto ;'
                      + ( config.bgAnimationsDisabled ? // classic opaque bg
                            `background: var(--pre-bg-color-${env.ui.app.scheme}-scheme) ;`
                          + `color: var(--font-color-${env.ui.app.scheme}-scheme)`
                      : `${ env.ui.app.scheme == 'dark' ? // slightly tranluscent bg
                            'background: #2b3a40cf ; color: var(--font-color-dark-scheme) ; border: 1px solid white'
                                : 'background: var(--pre-bg-color-light-scheme) ;'
                                    + 'color: var(--font-color-light-scheme) ; border: none' } ;` )
                      + ( !config.fgAnimationsDisabled ? // smoothen Anchor mode vertical expand/shrink
                            'transition: max-height 0.167s cubic-bezier(0, 0, 0.2, 1) ;' : '' ) + '}'
                  + `#${app.cssPrefix} > pre a, #${app.cssPrefix} > pre a:visited { color: #4495d4 }`
                  + `#${app.cssPrefix} pre a:hover { color: ${ env.ui.app.scheme == 'dark' ? 'white' : '#ea7a28' }}`
                  + '@keyframes pulse { 0%, to { opacity: 1 } 50% { opacity: .5 }}'
                  + `#${app.cssPrefix} section.loading { padding-left: 5px }` // left-pad loading status when sending replies
                  + `.${app.cssPrefix}-reply-corner-btns {`
                      + `float: right ; fill: ${ env.ui.app.scheme == 'dark' ? 'white' : '#6f6f6f' }}`
                  + `code #${app.cssPrefix}-copy-btn { position: relative ; top: -6px ; right: -9px }`
                  + `code #${app.cssPrefix}-copy-btn > svg { height: 13px ; width: 13px ; fill: white }`
                  + `#${app.cssPrefix}-chatbar {`
                      + `border: solid 1px ${ env.ui.app.scheme == 'dark' ?
                            ( config.bgAnimationsDisabled ? '#777' : '#aaa' ) : '#638ed4' } ;`
                      + 'border-radius: 12px 13px 12px 0 ; margin: 3px 0 15px 0 ; padding: 13px 57px 9px 10px ;'
                      + 'font-size: 14.5px ; height: 46px ; width: 100% ; max-height: 200px ; resize: none ; '
                      + `position: relative ; z-index: 555 ; color: #${ env.ui.app.scheme == 'dark' ? 'eee' : '222' } ;`
                      + `background: ${ env.ui.app.scheme == 'light' ? '#eeeeee9e'
                            : `#515151${ config.bgAnimationsDisabled ? '' : '9e' }` } ;`
                      + `${ env.ui.app.scheme == 'light' ? 'box-shadow: 0 1px 2px rgba(15,17,17,.1) inset' : '' }}`
                  + `#${app.cssPrefix}-chatbar:focus-visible { outline: -webkit-focus-ring-color auto 1px }`
                  + '.fade-in { opacity: 0 ; transform: translateY(10px) }'
                  + '.fade-in-less { opacity: 0 ; transition: opacity 0.2s ease }'
                  + '.fade-in.active, .fade-in-less.active { opacity: 1 ; transform: translateY(0) }'
                  + `.${app.cssPrefix}-chatbar-btn {`
                      + 'z-index: 560 ; border: none ; float: right ; position: relative ;'
                      + 'bottom: 50px ; background: none ; cursor: pointer ;'
                      + `${ env.ui.app.scheme == 'dark' ? 'color: #aaa ; fill: #aaa ; stroke: #aaa'
                                                    : 'color: lightgrey ; fill: lightgrey ; stroke: lightgrey' }}`
                  + `.${app.cssPrefix}-chatbar-btn:hover {`
                      + `${ env.ui.app.scheme == 'dark' ? 'color: white ; fill: white ; stroke: white'
                                                        : 'color: #638ed4 ; fill: #638ed4 ; stroke: #638ed4' }}`
                  + ( // rendered markdown styles
                        `#${app.cssPrefix} > pre h1 { font-size: 1.8em }`
                      + `#${app.cssPrefix} > pre h2 { font-size: 1.65em }`
                      + `#${app.cssPrefix} > pre h3 { font-size: 1.4em }`
                      + `#${app.cssPrefix} > pre h1, #${app.cssPrefix} > pre h2, #${app.cssPrefix} > pre h3 {`
                          + 'margin-bottom: -15px }'
                      + `#${app.cssPrefix} > pre ol {`
                          + `color: var(--font-color-${env.ui.app.scheme}-scheme) ;` // override ol styles
                          + 'margin: -30px 0 -21px }' // reduce v-padding
                      + `#${app.cssPrefix} > pre ol > li {` // reduce v-padding, show number markers
                          + 'margin: -10px 0 0 1.6em ; list-style: decimal }'
                      + `#${app.cssPrefix} > pre ol > li::marker { font-size: 0.9em }` // shrink number markers
                      + `#${app.cssPrefix} > pre ul {`
                          + `color: var(--font-color-${env.ui.app.scheme}-scheme) ;` // override ul styles
                          + 'margin-bottom: -21px }' // reduce bottom-gap
                      + `#${app.cssPrefix} > pre ul > li { list-style: inside }` ) // show bullets
                  + '.katex-html { display: none } ' // hide unrendered math
                  + `#${app.cssPrefix} + footer { margin: 2px 0 25px ; position: relative }`
                  + `#${app.cssPrefix} + footer * {`
                      + `color: ${ env.ui.app.scheme == 'dark' ? '#ccc' : '#666' } !important }`
                  + '.chatgpt-notif {'
                      + 'font-size: 26px !important ; fill: white ; stroke: white ; color: white ;'
                      + 'padding: 9px 14px 18px 11.5px !important }'
                  + '.notif-close-btn { display: none !important }' // hide notif close btn
                  + `.${app.cssPrefix}-menu {`
                      + 'position: absolute ; z-index: 2250 ;'
                      + 'padding: 3.5px 5px !important ; font-family: "Source Sans Pro", sans-serif ; font-size: 12px }'
                  + `.${app.cssPrefix}-menu ul { margin: 0 ; padding: 0 ; list-style: none }`
                  + `.${app.cssPrefix}-menu-item { padding: 0 5px ; line-height: 20.5px }`
                  + `.${app.cssPrefix}-menu-item:not(.${app.cssPrefix}-menu-header):hover {`
                      + 'cursor: pointer ; background: white ; color: black ; fill: black }'
                )
            },

            tweaks() {

                // Update tweaks style based on settings
                tweaksStyle.innerText = anchorStyles + ( config.expanded ? expandedStyles : '' )

                // Update 'by KudoAI' visibility based on corner space available
                const kudoAIspan = appDiv.querySelector('.kudoai')
                if (kudoAIspan) {
                    const visibleBtnCnt = [...appDiv.querySelectorAll(`.${app.cssPrefix}-div-corner-btn`)]
                        .filter(btn => getComputedStyle(btn).display != 'none').length
                    kudoAIspan.style.display = visibleBtnCnt <= (
                        env.browser.isMobile ? 3 : !config.expanded ? 5 : 8 ) ? '' : 'none'
                }

                // Update <pre> max-height for various mode toggles
                const answerPre = appDiv.querySelector('pre'),
                      longerPreHeight = window.innerHeight - 255
                if (answerPre) answerPre.style.maxHeight = `${ longerPreHeight - ( config.expanded ? 115 : 365 )}px`
            }
        }
    }

    // Define UI functions

    function fillStarryBG(targetNode) { // requires https://assets.aiwebextensions.com/styles/rising-stars/css/<black|white>.min.css
        const starsDivsContainer = document.createElement('div')
        starsDivsContainer.style.cssText = 'position: absolute ; top: 0 ; left: 0 ;' // hug targetNode's top-left corner
          + 'height: 100% ; width: 100% ; border-radius: 15px ; overflow: clip ;' // bound innards exactly by targetNode
          + 'z-index: -1'; // allow interactive elems to be clicked
        ['sm', 'med', 'lg'].forEach(starSize => {
            const starsDiv = document.createElement('div')
            starsDiv.id = config.bgAnimationsDisabled ? `stars-${starSize}-off`
                : `${ env.ui.app.scheme == 'dark' ? 'white' : 'black' }-stars-${starSize}`
            starsDivsContainer.append(starsDiv)
        })
        targetNode.prepend(starsDivsContainer)
    }

    const listenerize = {

        appDiv() {
            appDiv.addEventListener(inputEvents.down, event => { // to dismiss visible font size slider
                if (event.button != 0) return // prevent non-left-click dismissal
                if (document.getElementById(`${app.cssPrefix}-font-size-slider-track`) // slider is visible
                    && !event.target.closest('[id*="font-size"]') // not clicking slider elem
                    && getComputedStyle(event.target).cursor != 'pointer') // ...or other interactive elem
                        fontSizeSlider.toggle('off')
            })
            appDiv.onmouseover = appDiv.onmouseout = event =>
                appDiv.querySelectorAll(`.${app.cssPrefix}-div-corner-btn`).forEach(btn => {
                    if (/about|settings|chevron/.test(btn.id)) return
                    btn.style.opacity = event.type == 'mouseover' ? 1 : 0
                })
        },

        appDivCornerBtns() {
            appDiv.querySelectorAll(`.${app.cssPrefix}-div-corner-btn`).forEach(btn => { // from right to left
                if (btn.id.endsWith('chevron-btn')) btn.onclick = () => {
                    if (appDiv.querySelector(`#${app.cssPrefix}-font-size-slider-track`)?.classList.contains('active'))
                        fontSizeSlider.toggle('off')
                    toggle.minimized()
                }
                else if (btn.id.endsWith('about-btn')) btn.onclick = () => modals.open('about')
                else if (btn.id.endsWith('settings-btn')) btn.onclick = () => modals.open('settings')
                else if (btn.id.endsWith('speak-btn')) btn.onclick = () => {
                    const wholeAnswer = appDiv.querySelector('pre').textContent
                    const cjsSpeakOptions = { voice: 2, pitch: 1, speed: 1.5 }
                    const sgtDialectMap = [
                        { code: 'en', regex: /^(eng(lish)?|en(-\w\w)?)$/i, rate: 2 },
                        { code: 'ar', regex: /^(ara?(bic)?|اللغة العربية)$/i, rate: 1.5 },
                        { code: 'cs', regex: /^(cze(ch)?|[cč]e[sš].*|cs)$/i, rate: 1.4 },
                        { code: 'da', regex: /^dan?(ish|sk)?$/i, rate: 1.3 },
                        { code: 'de', regex: /^(german|deu?(tsch)?)$/i, rate: 1.5 },
                        { code: 'es', regex: /^(spa(nish)?|espa.*|es(-\w\w)?)$/i, rate: 1.5 },
                        { code: 'fi', regex: /^(fin?(nish)?|suom.*)$/i, rate: 1.4 },
                        { code: 'fr', regex: /^fr/i, rate: 1.2 },
                        { code: 'hu', regex: /^(hun?(garian)?|magyar)$/i, rate: 1.5 },
                        { code: 'it', regex: /^ita?(lian[ao]?)?$/i, rate: 1.4 },
                        { code: 'ja', regex: /^(ja?pa?n(ese)?|日本語|ja)$/i, rate: 1.5 },
                        { code: 'nl', regex: /^(dut(ch)?|flemish|nederlandse?|vlaamse?|nld?)$/i, rate: 1.3 },
                        { code: 'pl', regex: /^po?l(ish|ski)?$/i, rate: 1.4 },
                        { code: 'pt', regex: /^(por(tugu[eê]se?)?|pt(-\w\w)?)$/i, rate: 1.5 },
                        { code: 'ru', regex: /^(rus?(sian)?|русский)$/i, rate: 1.3 },
                        { code: 'sv', regex: /^(swe?(dish)?|sv(enska)?)$/i, rate: 1.4 },
                        { code: 'tr', regex: /^t[uü]?r(k.*)?$/i, rate: 1.6 },
                        { code: 'vi', regex: /^vi[eệ]?t?(namese)?$/i, rate: 1.5 },
                        { code: 'zh-CHS', regex: /^(chi(nese)?|zh|中[国國])/i, rate: 2 }
                    ]
                    const sgtReplyDialect = sgtDialectMap.find(entry =>
                        entry.regex.test(config.replyLanguage)) || sgtDialectMap[0]
                    const payload = {
                        text: wholeAnswer, curTime: Date.now(), spokenDialect: sgtReplyDialect.code,
                        rate: sgtReplyDialect.rate.toString()
                    }
                    const key = CryptoJS.enc.Utf8.parse('76350b1840ff9832eb6244ac6d444366')
                    const iv = CryptoJS.enc.Utf8.parse(
                        atob('AAAAAAAAAAAAAAAAAAAAAA==') || '76350b1840ff9832eb6244ac6d444366')
                    const securePayload = CryptoJS.AES.encrypt(JSON.stringify(payload), key, {
                        iv: iv, mode: CryptoJS.mode.CBC, pad: CryptoJS.pad.Pkcs7 }).toString()
                    xhr({ // audio from Sogou TTS
                        url: 'https://fanyi.sogou.com/openapi/external/getWebTTS?S-AppId=102356845&S-Param='
                            + encodeURIComponent(securePayload),
                        method: 'GET', responseType: 'arraybuffer',
                        onload: async resp => {
                            if (resp.status != 200) chatgpt.speak(wholeAnswer, cjsSpeakOptions)
                            else {
                                const audioContext = new (window.AudioContext || window.webkitAudioContext)()
                                audioContext.decodeAudioData(resp.response, buffer => {
                                    const audioSrc = audioContext.createBufferSource()
                                    audioSrc.buffer = buffer
                                    audioSrc.connect(audioContext.destination) // connect source to speakers
                                    audioSrc.start(0) // play audio
                                }).catch(() => chatgpt.speak(wholeAnswer, cjsSpeakOptions))
                    }}})
                }
                else if (btn.id.endsWith('font-size-btn')) btn.onclick = () => fontSizeSlider.toggle()
                else if (btn.id.endsWith('arrows-btn')) btn.onclick = () => toggle.expandedMode()
                if (!env.browser.isMobile) // add hover listeners for tooltips
                    btn.onmouseover = btn.onmouseout = toggle.tooltip
                if (/about|settings|speak/.test(btn.id)) btn.onmouseup = () => { // add zoom/fade-out to select buttons
                    if (config.fgAnimationsDisabled) return
                    btn.style.animation = 'btn-zoom-fade-out .220s ease-out'
                    setTimeout(() => { // hide btn after animation nears completion
                        Object.assign(btn.style, { opacity: '0', visibility: 'hidden', animation: '' })
                        setTimeout(() => // show btn after short delay
                            Object.assign(btn.style, { visibility: 'visible', opacity: '1' }), 200)
                    }, 170)
                }
            })
        },

        replySection() {

            // Add form key listener
            const replyForm = appDiv.querySelector('form')
            replyForm.onkeydown = event => {
                if (event.key == 'Enter' || event.keyCode == 13) {
                    if (event.ctrlKey) { // add newline
                        const chatTextarea = appDiv.querySelector(`#${app.cssPrefix}-chatbar`),
                              caretPos = chatTextarea.selectionStart,
                              textBefore = chatTextarea.value.substring(0, caretPos),
                              textAfter = chatTextarea.value.substring(caretPos)
                        chatTextarea.value = textBefore + '\n' + textAfter // add newline
                        chatTextarea.selectionStart = chatTextarea.selectionEnd = caretPos + 1 // preserve caret pos
                        listenerize.replySection.chatbarAutoSizer()
                    } else if (!event.shiftKey) listenerize.replySection.submitHandler(event)
            }}

            // Add form submit listener
            listenerize.replySection.submitHandler = event => {
                event.preventDefault()
                const chatTextarea = appDiv.querySelector(`#${app.cssPrefix}-chatbar`)

                // No reply, change placeholder + focus chatbar
                if (chatTextarea.value.trim() == '') {
                    chatTextarea.placeholder = `${app.msgs.placeholder_typeSomething}...`
                    chatTextarea.focus()

                // Yes reply, submit it + transform to loading UI
                } else {

                    // Modify/submit msg chain
                    if (msgChain.length > 2) msgChain.splice(0, 2) // keep token usage maintainable
                    msgChain = stripQueryAugments(msgChain)
                    const prevReplyTrimmed = appDiv.querySelector('pre')
                        ?.textContent.substring(0, 250 - chatTextarea.value.length) || ''
                    msgChain.push({ role: 'assistant', content: prevReplyTrimmed })
                    msgChain.push({ role: 'user', content: augmentQuery(chatTextarea.value) })
                    get.reply(msgChain)

                    // Hide/remove elems
                    if (!env.browser.isMobile) // hide 'Send reply' tooltip post-send btn click
                        tooltipDiv.style.opacity = 0

                    // Show loading status
                    const replySection = appDiv.querySelector('section')
                    replySection.classList.add('loading', 'no-user-select')
                    replySection.innerText = app.alerts.waitingResponse

                    // Set flags
                    show.reply.chatbarFocused = false ; show.reply.userInteracted = true
                }
            }
            replyForm.onsubmit = listenerize.replySection.submitHandler

            // Add chatbar autosizer
            const chatTextarea = appDiv.querySelector(`#${app.cssPrefix}-chatbar`)
            let prevLength = chatTextarea.value.length
            listenerize.replySection.chatbarAutoSizer = () => {
                const newLength = chatTextarea.value.length
                if (newLength < prevLength) { // if deleting txt
                    chatTextarea.style.height = 'auto' // ...auto-fit height
                    if (parseInt(getComputedStyle(chatTextarea).height) < 55) { // if down to one line
                        chatTextarea.style.height = '46px' } // ...reset to original height
                }
                chatTextarea.style.height = `${ chatTextarea.scrollHeight > 60 ? ( chatTextarea.scrollHeight +2 )
                                                                               : 46 }px`
                prevLength = newLength
            }
            chatTextarea.oninput = listenerize.replySection.chatbarAutoSizer

            // Add button listeners
            appDiv.querySelectorAll(`.${app.cssPrefix}-chatbar-btn`).forEach(btn => {
                if (btn.id.endsWith('shuffle-btn')) btn.onclick = () => {
                    const randQAprompt = 'Generate a single random question on any topic then answer it. '
                                       + 'Don\'t talk about Canberra, Tokyo, blue whales, photosynthesis, oceans, '
                                           + 'deserts, mindfulness meditation, the Fibonacci sequence, the liver, '
                                           + 'Jupiter, the Great Wall of China, Sheakespeare or da Vinci. '
                                       + 'Try to give an answer that is 50-100 words. '
                                       + 'Do not type anything but the question and answer. Reply in markdown.'
                    chatTextarea.value = augmentQuery(randQAprompt)
                    chatTextarea.dispatchEvent(new KeyboardEvent('keydown',
                        { key: 'Enter', bubbles: true, cancelable: true }))
                }
                if (!env.browser.isMobile) // add hover listener for tooltips
                    btn.onmouseover = btn.onmouseout = toggle.tooltip
            })
        }
    }

    const fontSizeSlider = {
        fadeInDelay: 5, // ms
        hWheelDistance: 10, // px

        createAppend() {
            log.caller = 'fontSizeSlider.createAppend()'
            log.debug('Creating/appending Font Size slider...')

            // Create/ID/classify slider elems
            fontSizeSlider.cursorOverlay = document.createElement('div')
            fontSizeSlider.cursorOverlay.classList.add('cursor-overlay') // for resize cursor
            const slider = document.createElement('div') ; slider.id = `${app.cssPrefix}-font-size-slider-track`
            slider.className = 'fade-in-less' ; slider.style.display = 'none'
            const sliderThumb = document.createElement('div')
            sliderThumb.id = `${app.cssPrefix}-font-size-slider-thumb`
            sliderThumb.title = Math.floor(config.fontSize *10) /10 + 'px' // font size tooltip
            const sliderTip = document.createElement('div') ; sliderTip.id = `${app.cssPrefix}-font-size-slider-tip`

            // Assemble/insert elems
            slider.append(sliderThumb, sliderTip)
            appDiv.insertBefore(slider, appDiv.querySelector(`.${app.cssPrefix}-btn-tooltip,` // desktop
                                                           + 'pre')) // mobile
            // Init thumb pos
            setTimeout(() => {
                const iniLeft = (config.fontSize - config.minFontSize) / (config.maxFontSize - config.minFontSize)
                              * (slider.offsetWidth - sliderThumb.offsetWidth) // slider width
                sliderThumb.style.left = iniLeft + 'px'
            }, fontSizeSlider.fadeInDelay) // to ensure visibility for accurate dimension calcs

            // Add event listeners for dragging thumb
            let isDragging = false, startX, startLeft
            sliderThumb.addEventListener(inputEvents.down, event => {
                if (event.button != 0) return // prevent non-left-click drag
                event.preventDefault() // prevent text selection
                isDragging = true ; startX = event.clientX ; startLeft = sliderThumb.offsetLeft
                document.body.appendChild(fontSizeSlider.cursorOverlay)
            })
            document.addEventListener(inputEvents.move, event => {
                if (isDragging) moveThumb(startLeft + event.clientX - startX) })
            document.addEventListener(inputEvents.up, () => {
                isDragging = false
                if (fontSizeSlider.cursorOverlay.parentNode)
                    fontSizeSlider.cursorOverlay.remove()
            })

            // Add event listener for wheel-scrolling thumb
            if (!env.browser.isMobile) slider.onwheel = event => {
                event.preventDefault()
                moveThumb(sliderThumb.offsetLeft - Math.sign(event.deltaY) * fontSizeSlider.hWheelDistance)
            }

            // Add event listener for seek/dragging by inputEvents.down on track
            slider.addEventListener(inputEvents.down, event => {
                if (event.button != 0) return // prevent non-left-click drag
                event.preventDefault() // prevent text selection
                const clientX = event.clientX || event.touches?.[0]?.clientX
                moveThumb(clientX - slider.getBoundingClientRect().left - sliderThumb.offsetWidth / 2)
                isDragging = true ; startX = clientX ; startLeft = sliderThumb.offsetLeft // manually init dragging
                document.body.appendChild(fontSizeSlider.cursorOverlay)
            })

            function moveThumb(newLeft) {

                // Bound thumb
                const sliderWidth = slider.offsetWidth - sliderThumb.offsetWidth
                if (newLeft < 0) newLeft = 0
                if (newLeft > sliderWidth) newLeft = sliderWidth

                // Move thumb
                sliderThumb.style.left = newLeft + 'px'

                // Adjust font size based on thumb position
                const answerPre = appDiv.querySelector('pre'),
                      fontSizePercent = newLeft / sliderWidth,
                      fontSize = config.minFontSize + fontSizePercent * (config.maxFontSize - config.minFontSize)
                answerPre.style.fontSize = fontSize + 'px'
                answerPre.style.lineHeight = fontSize * config.lineHeightRatio + 'px'
                settings.save('fontSize', fontSize)
                sliderThumb.title = Math.floor(config.fontSize *10) /10 + 'px'
            }

            return slider
        },

        toggle(state = '') {
            log.caller = `fontSizeSlider.toggle(${ state ? `'${state}'` : '' })`
            const slider = document.getElementById(`${app.cssPrefix}-font-size-slider-track`)
                         || fontSizeSlider.createAppend()
            const replyTip = appDiv.querySelector(`.${app.cssPrefix}-reply-tip`)
            const sliderTip = document.getElementById(`${app.cssPrefix}-font-size-slider-tip`)

            // Show slider
            if (state == 'on' || (!state && slider.style.display == 'none')) {
                log.debug('Showing Font Size slider...')

                // Position slider tip
                const btnSpan = document.getElementById(`${app.cssPrefix}-font-size-btn`),
                      rects = { appDiv: appDiv.getBoundingClientRect(), btnSpan: btnSpan.getBoundingClientRect() }
                sliderTip.style.right = `${ rects.appDiv.right - ( rects.btnSpan.left + rects.btnSpan.right )/2 -35 }px`

                // Show slider, hide reply tip
                slider.style.display = sliderTip.style.display = '' ; if (replyTip) replyTip.style.display = 'none'
                setTimeout(() => slider.classList.add('active'), fontSizeSlider.fadeInDelay)

                log.debug('Success! Font Size slider shown')

            // Hide slider
            } else if (state == 'off' || (!state && slider.style.display != 'none')) {
                log.debug('Hiding Font Size slider...')
                slider.classList.remove('active') ; if (replyTip) replyTip.style.display = ''
                sliderTip.style.display = slider.style.display = 'none'
                log.debug('Success! Font Size slider hidden')
            }
        }
    }

    // Define TOGGLE functions

    const toggle = {

        animations(layer) {
            log.caller = `toggle.animations('${layer}')`
            const configKey = layer + 'AnimationsDisabled'
            log.debug(`Toggling ${layer.toUpperCase()} animations ${ config[configKey] ? 'ON' : 'OFF' }...`)
            settings.save(configKey, !config[configKey])
            update.style.app() ; if (layer == 'bg') { update.stars() ; update.replyPrefix() }
            if (layer == 'fg' && modals.settings.get()) {

                // Toggle ticker-scroll of About status label
                const aboutStatusLabel = document.querySelector('#about-menu-entry > span > div')
                aboutStatusLabel.innerHTML = modals.settings.aboutContent[
                    config.fgAnimationsDisabled ? 'short' : 'long']
                aboutStatusLabel.style.float = config.fgAnimationsDisabled ? 'right' : ''

                // Toggle button glow
                if (env.ui.app.scheme == 'dark') toggle.btnGlow()
            }
            log.caller = `toggle.animations('${layer}')`
            log.debug(`Success! ${layer.toUpperCase()} animations toggled ${ config[configKey] ? 'OFF' : 'ON' }`)
            notify(`${settings.controls[layer + 'AnimationsDisabled'].label} ${
                menu.state.words[+!config[layer + 'AnimationsDisabled']]}`)
        },

        btnGlow(state = '') {
            const removeCondition = state == 'off' || env.ui.app.scheme != 'dark' || config.fgAnimationsDisabled
            document.querySelectorAll('[class*="-modal"] button').forEach((btn, idx) => {
                setTimeout(() => btn.classList[removeCondition ? 'remove' : 'add']('glowing-btn'),
                    (idx +1) *50 *chatgpt.randomFloat()) // to unsync flickers
                let btnTextSpan = btn.querySelector('span')
                if (!btnTextSpan) { // wrap btn.textContent for .glowing-txt
                    btnTextSpan = document.createElement('span')
                    btnTextSpan.textContent = btn.textContent ; btn.textContent = ''
                    btn.append(btnTextSpan)
                }
                btnTextSpan.classList[removeCondition ? 'remove' : 'add']('glowing-txt')
            })
        },

        expandedMode(state = '') {
            log.caller = `toggle.expandedMode(${ state ? `'${state}'` : '' })`
            const toExpand = state == 'on' || !state && !config.expanded
            log.debug(`${ toExpand ? 'Expanding' : 'Shrinking' } ${app.name}...`)
            settings.save('expanded', toExpand)
            if (config.minimized) toggle.minimized('off') // since user wants to see stuff
            update.style.tweaks() // apply new state to UI
            icons.arrowsDiagonal.update() ; tooltipDiv.style.opacity = 0 // update icon/tooltip
            log.caller = `toggle.expandedMode(${ state ? `'${state}'` : '' })`
            log.debug(`Success! ${app.name} ${ toExpand ? 'expanded' : 'shrunk' }`)
        },

        minimized(state = '') {
            log.caller = `toggle.minimized(${ state ? `'${state}'` : '' })`
            const toMinimize = state == 'on' || !state && !config.minimized
            log.debug(`${ toMinimize ? 'Mimizing' : 'Restoring' } ${app.name}...`)
            settings.save('minimized', toMinimize)
            const chevronBtn = appDiv.querySelector(`#${app.cssPrefix}-chevron-btn`)
            if (chevronBtn) { // update icon
                const chevronSVG = icons[`chevron${ config.minimized ? 'Up' : 'Down' }`].create()
                chevronBtn.firstChild.remove() ; chevronBtn.append(chevronSVG)
                chevronBtn.onclick = () => {
                    if (appDiv.querySelector(`#${app.cssPrefix}-font-size-slider-track`)?.classList.contains('active'))
                        fontSizeSlider.toggle('off')
                    toggle.minimized()
                }
            }
            update.appBottomPos() // toggle visual minimization
            if (!env.browser.isMobile) setTimeout(() => tooltipDiv.style.opacity = 0, 1) // remove lingering tooltip
            log.caller = `toggle.minimized(${ state ? `'${state}'` : '' })`
            log.debug(`Success! ${app.name} ${ toMinimize ? 'minimized' : 'restored' }`)
        },

        proxyMode() {
            log.caller = 'toggle.proxyMode()'
            log.debug(`Toggling Proxy Mode ${ config.proxyAPIenabled ? 'OFF' : 'ON' }...`)
            settings.save('proxyAPIenabled', !config.proxyAPIenabled)
            notify(`${app.msgs.menuLabel_proxyAPImode} ${menu.state.words[+config.proxyAPIenabled]}`)
            menu.refresh()
            if (modals.settings.get()) { // update visual states of Settings toggles
                const proxyToggle = document.querySelector('[id*="proxy"][id*="menu-entry"] input'),
                      streamingToggle = document.querySelector('[id*="streaming"][id*="menu-entry"] input')
                if (proxyToggle.checked != config.proxyAPIenabled) // Proxy state out-of-sync (from using toolbar menu)
                        modals.settings.toggle.switch(proxyToggle)
                if (streamingToggle.checked && !config.proxyAPIenabled // Streaming checked but OpenAI mode
                    || // ...or Streaming unchecked but enabled in Proxy mode
                        !streamingToggle.checked && config.proxyAPIenabled && !config.streamingDisabled)
                            modals.settings.toggle.switch(streamingToggle)
            }
            if (appDiv.querySelector(`#${app.cssPrefix}-alert`)) location.reload() // re-send query if user alerted
            else {
                log.caller = 'toggle.proxyMode()'
                log.debug(`Success! config.proxyAPIenabled = ${config.proxyAPIenabled}`)
            }
        },

        streaming() {
            log.caller = 'toggle.streaming()'
            const scriptCatLink = env.browser.isFF ?
                    'https://addons.mozilla.org/firefox/addon/scriptcat/'
                : env.browser.isEdge ?
                    'https://microsoftedge.microsoft.com/addons/detail/scriptcat/liilgpjgabokdklappibcjfablkpcekh'
                  : 'https://chromewebstore.google.com/detail/scriptcat/ndcooeababalnlpkfedmmbbbgkljhpjf'
            if (!streamingSupported.byScriptManager) { // alert userscript manager unsupported, suggest TM/SC
                log.debug(`Streaming Mode unsupported in ${env.scriptManager.name}`)
                modals.alert(
                    `${settings.controls.streamingDisabled.label} ${app.msgs.alert_unavailable}`,
                    `${settings.controls.streamingDisabled.label} ${app.msgs.alert_isOnlyAvailFor}`
                        + ( !env.browser.isEdge && !env.browser.isBrave ? // suggest TM for supported browsers
                            ` <a target="_blank" rel="noopener" href="https://tampermonkey.net">Tampermonkey</a> ${
                                app.msgs.alert_and}` : '' )
                        + ` <a target="_blank" rel="noopener" href="${scriptCatLink}">ScriptCat</a>.` // suggest SC
                        + ` (${app.msgs.alert_userscriptMgrNoStream}.)`
                )
            } else if (!streamingSupported.byBrowser) { // alert TM/browser unsupported, suggest SC
                log.debug('Streaming Mode unsupported in browser')
                modals.alert(
                    `${settings.controls.streamingDisabled.label} ${app.msgs.alert_unavailable}`,
                    `${settings.controls.streamingDisabled.label} ${app.msgs.alert_isUnsupportedIn} `
                        + `${ env.browser.isChrome ? 'Chrome' : env.browser.isEdge ? 'Edge' : 'Brave' } ${
                            app.msgs.alert_whenUsing} Tampermonkey. `
                        + `${app.msgs.alert_pleaseUse} <a target="_blank" rel="noopener" href="${
                            scriptCatLink}">ScriptCat</a> ${app.msgs.alert_instead}.`
                )
            } else if (!config.proxyAPIenabled) { // alert OpenAI API unsupported, suggest Proxy Mode
                log.debug('Streaming Mode unsupported in OpenAI mode')
                let msg = `${settings.controls.streamingDisabled.label} `
                        + `${app.msgs.alert_isCurrentlyOnlyAvailBy} `
                        + `${app.msgs.alert_switchingOn} ${app.msgs.mode_proxy}. `
                        + `(${app.msgs.alert_openAIsupportSoon}!)`
                const switchPhrase = app.msgs.alert_switchingOn
                msg = msg.replace(switchPhrase, `<a class="alert-link" href="#">${switchPhrase}</a>`)
                const alert = modals.alert(`${app.msgs.mode_streaming} ${app.msgs.alert_unavailable}`, msg)
                alert.querySelector('[href="#"]').onclick = () => {
                    alert.querySelector('.modal-close-btn').click() ; toggle.proxyMode() }
            } else { // functional toggle
                log.debug(`Toggling Streaming Mode ${ config.streamingDisabled ? 'ON' : 'OFF' }`)
                settings.save('streamingDisabled', !config.streamingDisabled)
                notify(`${settings.controls.streamingDisabled.label} ${menu.state.words[+!config.streamingDisabled]}`)
                log.debug(`Success! config.streamingDisabled = ${config.streamingDisabled}`)
            }
        },

        tooltip(event) {
            const btnElem = event.currentTarget, btnType = /[^-]+-([\w-]+)-btn/.exec(btnElem.id)[1],
                  appCornerBtnTypes = ['chevron', 'about', 'settings', 'speak', 'font-size', 'arrows'],
                  replyCornerBtnTypes = ['copy', 'regen']

            // Update text
            tooltipDiv.innerText = (
                btnType == 'chevron' ? ( config.minimized ? `${app.msgs.tooltip_restore}`
                                                          : `${app.msgs.tooltip_minimize}` )
              : btnType == 'about' ? app.msgs.menuLabel_about
              : btnType == 'settings' ? app.msgs.menuLabel_settings
              : btnType == 'speak' ? app.msgs.tooltip_playAnswer
              : btnType == 'font-size' ? app.msgs.tooltip_fontSize
              : btnType == 'arrows' ? ( config.expanded ? `${app.msgs.tooltip_shrink}`
                                                        : `${app.msgs.tooltip_expand}` )
              : btnType == 'copy' ? ( btnElem.firstChild.id.endsWith('copy-icon') ?
                    `${app.msgs.tooltip_copy} ${
                        app.msgs[`tooltip_${ btnElem.closest('code') ? 'code' : 'reply' }`].toLowerCase()}`
                  : `${app.msgs.notif_copiedToClipboard}!` )
              : btnType == 'regen' ? `${app.msgs.tooltip_regen} ${app.msgs.tooltip_reply.toLowerCase()}`
              : btnType == 'send' ? app.msgs.tooltip_sendReply
              : btnType == 'shuffle' ? app.msgs.tooltip_askRandQuestion : '' )

            // Update position
            const elems = { appDiv, btnElem, tooltipDiv },
                  rects = {} ; Object.keys(elems).forEach(key => rects[key] = elems[key].getBoundingClientRect())
            tooltipDiv.style.top = `${
                appCornerBtnTypes.includes(btnType) ? -22
              : replyCornerBtnTypes.includes(btnType) && !event.currentTarget.closest('code') ? 38
              : rects.btnElem.top - rects.appDiv.top -36 - ( event.currentTarget.closest('code') ? 7 : 0 )
            }px`
            tooltipDiv.style.right = `${
                rects.appDiv.right - ( rects.btnElem.left + rects.btnElem.right )/2 - rects.tooltipDiv.width/2 }px`

            // Toggle visibility
            tooltipDiv.style.opacity = event.type == 'mouseover' ? 1 : 0
        }
    }

    // Define SESSION functions

    const session = {

        deleteOpenAIcookies() {
            log.caller = 'session.deleteOpenAIcookies()'
            log.debug('Deleting OpenAI cookies...')
            GM_deleteValue(app.configKeyPrefix + '_openAItoken')
            if (env.scriptManager.name != 'Tampermonkey') return
            GM_cookie.list({ url: apis.OpenAI.endpoints.auth }, (cookies, error) => {
                if (!error) { for (const cookie of cookies) {
                    GM_cookie.delete({ url: apis.OpenAI.endpoints.auth, name: cookie.name })
            }}})
        },

        generateGPTFLkey() {
            log.caller = 'session.generateGPTFLkey()'
            log.debug('Generating GPTforLove key...')
            let nn = Math.floor(new Date().getTime() / 1e3)
            const fD = e => {
                let t = CryptoJS.enc.Utf8.parse(e),
                    o = CryptoJS.AES.encrypt(t, 'vrewbhjvbrejhbevwjh156645', {
                        mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7
                })
                return o.toString()
            }
            const gptflKey = fD(nn)
            log.debug(gptflKey) ; return gptflKey
        },

        getOAItoken() {
            log.caller = 'session.getOAItoken()'
            log.debug('Getting OpenAI token...')
            return new Promise(resolve => {
                const accessToken = GM_getValue(app.configKeyPrefix + '_openAItoken')
                if (accessToken) { log.debug(accessToken) ; resolve(accessToken) }
                else {
                    log.debug(`No token found. Fetching from ${apis.OpenAI.endpoints.session}...`)
                    xhr({ url: apis.OpenAI.endpoints.session, onload: resp => {
                        if (session.isBlockedByCF(resp.responseText)) {
                            appAlert('checkCloudflare') ; return }
                        try {
                            const newAccessToken = JSON.parse(resp.responseText).accessToken
                            GM_setValue(app.configKeyPrefix + '_openAItoken', newAccessToken)
                            log.debug(`Success! newAccessToken = ${newAccessToken}`)
                            resolve(newAccessToken)
                        } catch { if (get.reply.api == 'OpenAI') appAlert('login') ; return }
            }})}})
        },

        isBlockedByCF(resp) {
            try {
                const html = new DOMParser().parseFromString(resp, 'text/html'),
                      title = html.querySelector('title')
                if (title.innerText == 'Just a moment...') {
                    log.caller = 'session.isBlockedByCF'
                    log.debug('Blocked by CloudFlare')
                    return true
                }
            } catch (err) { return false }
        }
    }

    // Define API functions

    const api = {

        clearTimedOut(triedAPIs) { // to retry on new queries
            triedAPIs.splice(0, triedAPIs.length, // empty apiArray
                ...triedAPIs.filter(entry => Object.values(entry)[0] != 'timeout')) // replace w/ err'd APIs
        },

        createHeaders(api) {
            const ip = ipv4.generate({ verbose: false })
            const headers = {
                'Accept-Encoding': 'gzip, deflate, br, zstd',
                'Connection': 'keep-alive', 'Content-Type': 'application/json', 'DNT': '1',
                'Host': new URL(apis[api].endpoints?.completions || apis[api].endpoint).hostname,
                'Origin': apis[api].expectedOrigin.url,
                'Sec-Fetch-Dest': 'empty', 'Sec-Fetch-Mode': 'cors',
                'TE': 'trailers', 'X-Forwarded-For': ip, 'X-Real-IP': ip
            }
            headers.Referer = headers.Origin + '/'
            if (api == 'OpenAI') headers.Authorization = 'Bearer ' + config.openAIkey
            Object.assign(headers, apis[api].expectedOrigin.headers)
            return headers
        },

        createPayload(api, msgs) {
            let payload = {}
            if (api == 'OpenAI')
                payload = { messages: msgs, model: 'gpt-3.5-turbo', max_tokens: 4000 }
            else if (api == 'AIchatOS') {
                payload = {
                    prompt: msgs[msgs.length - 1].content,
                    withoutContext: false, userId: apis.AIchatOS.userID, network: true
                }
            } else if (api == 'GPTforLove') {
                payload = {
                    prompt: msgs[msgs.length - 1].content,
                    secret: session.generateGPTFLkey(), top_p: 1, temperature: 0.8,
                    systemMessage: 'You are ChatGPT, the version is GPT-4o, a large language model trained by OpenAI.'
                                 + 'Follow the user\'s instructions carefully.'
                }
                if (apis.GPTforLove.parentID) payload.options = { parentMessageId: apis.GPTforLove.parentID }
            } else if (api == 'MixerBox AI')
                payload = { prompt: msgs, model: 'gpt-3.5-turbo' }
            return JSON.stringify(payload)
        },

        pick(caller) {
            log.caller = `get.${caller.name}() » api.pick()`
            const untriedAPIs = Object.keys(apis).filter(api =>
                   api != ( caller == get.reply ? 'OpenAI' : '' ) // exclude OpenAI for get.reply() since Proxy Mode
                && !caller.triedAPIs.some(entry => // exclude tried APIs
                    Object.prototype.hasOwnProperty.call(entry, api))
                && ( // exclude unstreamable APIs if !config.streamingDisabled
                    config.streamingDisabled || apis[api].streamable))
            const chosenAPI = untriedAPIs[ // pick random array entry
                Math.floor(chatgpt.randomFloat() * untriedAPIs.length)]
            if (!chosenAPI) { log.error('No proxy APIs left untried') ; return null }
            log.debug('Endpoint chosen', apis[chosenAPI].endpoints?.completions || apis[chosenAPI].endpoint)
            return chosenAPI
        },

        tryNew(caller, reason = 'err') {
            log.caller = `get.${caller.name}() » api.tryNew()`
            if (caller.status == 'done') return
            log.error(`Error using ${ apis[caller.api].endpoints?.completions
                                   || apis[caller.api].endpoint } due to ${reason}`)
            caller.triedAPIs.push({ [caller.api]: reason })
            if (caller.attemptCnt < Object.keys(apis).length -+(caller == get.reply)) {
                log.debug('Trying another endpoint...')
                caller.attemptCnt++
                caller(caller == get.reply ? msgChain : stripQueryAugments(msgChain)[msgChain.length - 1].content)
            } else {
                log.debug('No remaining untried endpoints')
                if (caller == get.reply) appAlert('proxyNotWorking', 'suggestOpenAI')
            }
        }
    }

    // Define QUERY AUGMENT functions

    function augmentQuery(query) { return query + ` (reply in ${config.replyLanguage})` }

    function stripQueryAugments(msgChain) {
        const augmentCnt = augmentQuery.toString().match(/\+/g).length
        return msgChain.map(msg => { // stripped chain
            if (msg.role == 'user') {
                let content = msg.content
                const augments = content.match(/\s*\([^)]*\)\s*/g)
                if (augments) for (let i = 0 ; i < augmentCnt ; i++) // strip augments
                    content = content.replace(augments[augments.length - 1 - i], '')
                return { ...msg, content: content.trim() }
            } else return msg // agent's unstripped
        })
    }

    // Define GET functions

    const get = {

        json(url, callback) { // for dynamic footer
            xhr({ method: 'GET', url: url, onload: resp => {
                if (resp.status >= 200 && resp.status < 300) {
                    try { const data = JSON.parse(resp.responseText) ; callback(null, data) }
                    catch (err) { callback(err, null) }
                } else callback(new Error('Failed to load data: ' + resp.statusText), null)
            }})
        },

        async reply(msgChain) {

            // Init API attempt props
            get.reply.status = 'waiting'
            if (!get.reply.triedAPIs) get.reply.triedAPIs = []
            if (!get.reply.attemptCnt) get.reply.attemptCnt = 1

            // Pick API
            get.reply.api = config.proxyAPIenabled ? api.pick(get.reply) : 'OpenAI'
            if (!get.reply.api) { // no more proxy APIs left untried
                appAlert('proxyNotWorking', 'suggestOpenAI') ; return }

            // Init OpenAI key
            if (!config.proxyAPIenabled)
                config.openAIkey = await Promise.race(
                    [session.getOAItoken(), new Promise(reject => setTimeout(reject, 3000))])

            // Try diff API after 7-10s of no response
            else {
                const iniAPI = get.reply.api
                setTimeout(() => {
                    if (config.proxyAPIenabled // only do in Proxy mode
                        && get.reply.status != 'done' && !get.reply.sender // still no reply received
                        && get.reply.api == iniAPI // not already trying diff API from err
                        && get.reply.triedAPIs.length != Object.keys(apis).length -1 // untried APIs remain
                    ) api.tryNew(get.reply, 'timeout')
                }, config.streamingDisabled ? 10000 : 7000)
            }

            // Get/show answer from AI
            xhr({
                method: apis[get.reply.api].method,
                url: apis[get.reply.api].endpoints?.completions || apis[get.reply.api].endpoint,
                responseType: config.streamingDisabled || !config.proxyAPIenabled ? 'text' : 'stream',
                headers: api.createHeaders(get.reply.api), data: api.createPayload(get.reply.api, msgChain),
                onload: resp => dataProcess.text(get.reply, resp),
                onloadstart: resp => dataProcess.stream(get.reply, resp),
                onerror: err => { log.error(err)
                    if (!config.proxyAPIenabled)
                        appAlert(!config.openAIkey ? 'login' : ['openAInotWorking', 'suggestProxy'])
                    else api.tryNew(get.reply)
                }
            })
        }
    }

    // Define PROCESS functions

    const dataProcess = {

        initFailFlags(api) { // escape/merge URLs w/ fail flags
            const { failFlags = [], endpoint = apis[api].endpoints.completions, expectedOrigin } = apis[api],
                  escapedAPIurls = [endpoint, expectedOrigin.url].map(url => url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
            return new RegExp([...failFlags, ...escapedAPIurls].join('|'))
        },

        stream(caller, stream) {
            if (config.streamingDisabled || !config.proxyAPIenabled) return
            log.caller = `get.${caller.name}() » dataProcess.stream()`
            const failFlagsAndURLs = dataProcess.initFailFlags(caller.api),
                  reader = stream.response.getReader() ; let accumulatedChunks = ''
            reader.read().then(processStreamText).catch(err => log.error('Error processing stream', err.message))

            function processStreamText({ done, value }) {
                if (done) { caller.sender = null
                    if (appDiv.querySelector('.loading')) // no text shown
                        api.tryNew(caller)
                    else { // text was shown
                        caller.status = 'done' ; caller.attemptCnt = null
                        show.replyCornerBtns() ; api.clearTimedOut(caller.triedAPIs)
                    } return
                }
                let chunk = new TextDecoder('utf8').decode(new Uint8Array(value))
                if (caller.api == 'MixerBox AI') { // pre-process chunks
                    const extractedChunks = Array.from(chunk.matchAll(/data:(.*)/g), match => match[1]
                        .replace(/\[SPACE\]/g, ' ').replace(/\[NEWLINE\]/g, '\n'))
                        .filter(match => !/message_(?:start|end)|done/.test(match))
                    chunk = extractedChunks.join('')
                }
                accumulatedChunks = apis[caller.api].accumulatesText ? chunk : accumulatedChunks + chunk
                if (/^(?:\{|event:)/.test(accumulatedChunks)) api.tryNew(caller)
                else {
                    try { // to show stream text
                        let textToShow = ''
                        if (caller.api == 'GPTforLove') { // extract parentID + latest chunk text
                            const jsonLines = accumulatedChunks.split('\n'),
                                  nowResult = JSON.parse(jsonLines[jsonLines.length - 1])
                            if (nowResult.id) apis.GPTforLove.parentID = nowResult.id // for contextual replies
                            textToShow = nowResult.text
                        } else textToShow = accumulatedChunks
                        const failMatch = failFlagsAndURLs.exec(textToShow)
                        if (failMatch) {
                            log.debug('Response text', textToShow)
                            log.error('Fail flag detected', `'${failMatch[0]}'`)
                            if (caller.status != 'done' && !caller.sender) api.tryNew(caller)
                            return
                        } else if (caller.status != 'done') { // app waiting or sending
                            if (!caller.sender) caller.sender = caller.api // app is waiting, become sender
                            if (caller.sender == caller.api // app is sending from this caller.api
                                && textToShow.trim() != '' // empty chunk not read
                            ) show.reply(textToShow)
                        }
                    } catch (err) { log.error('Error showing stream', err.message) }
                    return reader.read().then(({ done, value }) => {
                        if (caller.sender == caller.api) // am designated sender, recurse
                            processStreamText({ done, value })
                    }).catch(err => log.error('Error reading stream', err.message))
                }
            }
        },

        text(caller, resp) {
            return new Promise(() => {
                if (caller == get.reply && config.proxyAPIenabled && !config.streamingDisabled
                    || caller.status == 'done') return
                log.caller = `get.${caller.name}() » dataProcess.text()`
                const failFlagsAndURLs = dataProcess.initFailFlags(caller.api) ; let respText = ''
                if (resp.status != 200) {
                    log.error('Response status', resp.status)
                    log.info('Response text', resp.response || resp.responseText)
                    if (caller == get.reply && caller.api == 'OpenAI')
                        appAlert(resp.status == 401 ? 'login'
                               : resp.status == 403 ? 'checkCloudflare'
                               : resp.status == 429 ? ['tooManyRequests', 'suggestProxy']
                                                    : ['openAInotWorking', 'suggestProxy'] )
                    else api.tryNew(caller)
                } else if (caller.api == 'OpenAI' && resp.response) {
                    const failMatch = failFlagsAndURLs.exec(resp.response)
                    if (failMatch) { // suggest proxy
                        log.debug('Response text', resp.response)
                        log.error('Fail flag detected', `'${failMatch[0]}'`)
                        appAlert('openAInotWorking', 'suggestProxy')
                    } else {
                        try { // to show response or return related queries
                            respText = JSON.parse(resp.response).choices[0].message.content
                            handleProcessCompletion()
                        } catch (err) { handleProcessError(err) }
                    }
                } else if (resp.responseText) {
                    if (caller.api == 'AIchatOS') {
                        try { // to show response
                            const text = resp.responseText, chunkSize = 1024
                            let currentIdx = 0
                            while (currentIdx < text.length) {
                                const chunk = text.substring(currentIdx, currentIdx + chunkSize)
                                respText += chunk ; currentIdx += chunkSize
                            }
                            handleProcessCompletion()
                        } catch (err) { handleProcessError(err) }
                    } else if (caller.api == 'GPTforLove') {
                        try { // to show response
                            let chunks = resp.responseText.trim().split('\n'),
                                lastObj = JSON.parse(chunks[chunks.length - 1])
                            if (lastObj.id) apis.GPTforLove.parentID = lastObj.id
                            respText = lastObj.text ; handleProcessCompletion()
                        } catch (err) { handleProcessError(err) }
                    } else if (caller.api == 'MixerBox AI') {
                        try { // to show response
                            const extractedData = Array.from(resp.responseText.matchAll(/data:(.*)/g), match => match[1]
                                .replace(/\[SPACE\]/g, ' ').replace(/\[NEWLINE\]/g, '\n'))
                                .filter(match => !/message_(?:start|end)|done/.test(match))
                            respText = extractedData.join('') ; handleProcessCompletion()
                        } catch (err) { handleProcessError(err) }
                    }
                } else if (caller.status != 'done') { // proxy 200 response failure
                    log.info('Response text', resp.responseText) ; api.tryNew(caller) }

                function handleProcessCompletion() {
                    if (caller.status != 'done') {
                        log.debug('Response text', respText)
                        const failMatch = failFlagsAndURLs.exec(respText)
                        if (!respText || failMatch || /^(?:\{|event:)/.test(respText)) {
                            if (failMatch) log.error('Fail flag detected', `'${failMatch[0]}'`)
                            api.tryNew(caller)
                        } else {
                            caller.status = 'done' ; api.clearTimedOut(caller.triedAPIs) ; caller.attemptCnt = null
                            show.reply(respText) ; show.replyCornerBtns()
                }}}

                function handleProcessError(err) { // suggest proxy or try diff API
                    log.debug('Response text', resp.response)
                    log.error(app.alerts.parseFailed, err)
                    if (caller.api == 'OpenAI' && caller == get.reply) appAlert('openAInotWorking', 'suggestProxy')
                    else api.tryNew(caller)
                }
        })}
    }

    // Define SHOW functions

    const show = {

        replyCornerBtns() {
            if (document.getElementById(`${app.cssPrefix}-copy-btn`)) return
            const baseBtnStyles = 'float: right ; cursor: pointer ;'

            // Add top parent div
            const cornerBtnsDiv = document.createElement('div')
            cornerBtnsDiv.className = `${app.cssPrefix}-reply-corner-btns`
            appDiv.querySelector('pre').prepend(cornerBtnsDiv)

            // Add Copy buttons
            appDiv.querySelectorAll(`#${app.cssPrefix} > pre, code`).forEach(parentElem => {
                const copyBtn = document.createElement('btn'),
                      copySVG = icons.copy.create(parentElem)
                copyBtn.id = `${app.cssPrefix}-copy-btn` ; copySVG.id = `${app.cssPrefix}-copy-icon`
                copyBtn.className = 'no-mobile-tap-outline' ; copyBtn.style.cssText = baseBtnStyles
                copyBtn.append(copySVG) ; let elemToPrepend = copyBtn

                // Wrap code button in div for v-offset
                if (parentElem.tagName == 'CODE') {
                    elemToPrepend = document.createElement('div')
                    elemToPrepend.style.cssText = 'height: 11px ; margin: 4px 5px 0 0'
                    elemToPrepend.append(copyBtn)
                }

                // Add listeners
                if (!env.browser.isMobile) copyBtn.onmouseover = copyBtn.onmouseout = toggle.tooltip
                copyBtn.onclick = event => { // copy text, update icon + tooltip status
                    const copySVG = copyBtn.querySelector(`#${app.cssPrefix}-copy-icon`)
                    if (!copySVG) return // since clicking on Copied icon
                    const textContainer = (
                        copyBtn.parentNode.tagName == 'PRE' ? copyBtn.parentNode // reply container
                                                            : copyBtn.parentNode.parentNode ) // code container
                    const textToCopy = textContainer.textContent.replace(/^>> /, '').trim()
                    const checkmarksSVG = icons.checkmarkDouble.create()
                    checkmarksSVG.style.marginLeft = '1px' // set same left boundary as Copy icon to not shift other ones
                    copyBtn.replaceChild(checkmarksSVG, copySVG) // change to Copied icon
                    setTimeout(() => copyBtn.replaceChild(copySVG, checkmarksSVG), 1355) // change back to copy icon
                    navigator.clipboard.writeText(textToCopy) // copy text to clipboard
                    if (!env.browser.isMobile) toggle.tooltip(event) // show copied status in tooltip
                }

                // Prepend button
                const parentToInsertInto = parentElem.tagName == 'CODE' ? parentElem : cornerBtnsDiv
                parentToInsertInto.prepend(elemToPrepend)
            })

            // Add Regenerate button
            const regenBtn = document.createElement('btn') ; regenBtn.id = `${app.cssPrefix}-regen-btn`
            regenBtn.className = 'no-mobile-tap-outline'
            regenBtn.style.cssText = baseBtnStyles + 'position: relative ; top: 1px ; margin: 0 9px 0 5px'
            const regenSVG = icons.arrowsCycle.create();
            ['width', 'height'].forEach(attr => regenSVG.setAttribute(attr, 17))
            regenBtn.append(regenSVG) ; cornerBtnsDiv.append(regenBtn)
            if (!env.browser.isMobile) regenBtn.onmouseover = regenBtn.onmouseout = toggle.tooltip
            regenBtn.onclick = () => {
                get.reply(msgChain) ; appAlert('waitingResponse')
                if (!env.browser.isMobile) tooltipDiv.style.opacity = 0 // or tooltip shows on next reply
                show.reply.chatbarFocused = false ; show.reply.userInteracted = true
            }
        },

        reply(answer) {

            // Build answer interface up to reply section if missing
            if (!appDiv.querySelector('pre')) {
                appDiv.textContent = ''
                fillStarryBG(appDiv) // add stars

                // Create/append title
                const appHeaderLogo = logos.amzgpt.create()
                appHeaderLogo.style.width = env.browser.isMobile ? '55%' : '181px'
                const appTitleAnchor = create.anchor(app.urls.app, appHeaderLogo)
                appTitleAnchor.classList.add(`${app.cssPrefix}-name`, 'no-user-select')
                appDiv.append(appTitleAnchor)

                // Create/append corner buttons div
                const cornerBtnsDiv = document.createElement('div')
                cornerBtnsDiv.id = `${app.cssPrefix}-div-corner-btns`
                cornerBtnsDiv.className = 'no-mobile-tap-outline'
                appDiv.append(cornerBtnsDiv)

                // Create/append Chevron button
                const chevronBtn = document.createElement('btn'),
                      chevronSVG = icons[`chevron${ config.minimized ? 'Up' : 'Down' }`].create()
                chevronBtn.id = `${app.cssPrefix}-chevron-btn` // for toggle.tooltip()
                chevronBtn.className = `${app.cssPrefix}-div-corner-btn`
                chevronBtn.style.margin = '-1.5px 1px 0 11px' // position
                chevronBtn.style.display = 'none' // show when config.anchored only
                chevronBtn.append(chevronSVG) ; cornerBtnsDiv.append(chevronBtn)

                // Create/append About button
                const aboutBtn = document.createElement('btn'),
                      aboutSVG = icons.questionMarkCircle.create()
                aboutBtn.id = `${app.cssPrefix}-about-btn` // for toggle.tooltip()
                aboutBtn.className = `${app.cssPrefix}-div-corner-btn`
                aboutBtn.append(aboutSVG) ; cornerBtnsDiv.append(aboutBtn)

                // Create/append Settings button
                const settingsBtn = document.createElement('btn'),
                      settingsSVG = icons.cogwheel.create()
                settingsBtn.id = `${app.cssPrefix}-settings-btn` // for toggle.tooltip()
                settingsBtn.className = `${app.cssPrefix}-div-corner-btn`
                settingsBtn.style.margin = '0.5px 10.5px 0 0.5px' // position
                settingsBtn.append(settingsSVG) ; cornerBtnsDiv.append(settingsBtn)

                // Create/append Speak button
                const speakerBtn = document.createElement('btn'),
                      speakerSVG = icons.speaker.create()
                speakerBtn.id = `${app.cssPrefix}-speak-btn` // for toggle.tooltip()
                speakerBtn.className = `${app.cssPrefix}-div-corner-btn`
                speakerBtn.style.margin = '-2px 8px 0 0' // position
                speakerBtn.style.opacity = 0 // show when appDiv.onmouseover only
                speakerBtn.append(speakerSVG) ; cornerBtnsDiv.append(speakerBtn)

                // Create/append Font Size button
                const fontSizeBtn = document.createElement('btn'),
                      fontSizeSVG = icons.fontSize.create()
                fontSizeBtn.id = `${app.cssPrefix}-font-size-btn` // for toggle.tooltip()
                fontSizeBtn.className = `${app.cssPrefix}-div-corner-btn`
                fontSizeBtn.style.marginRight = '10px' // position
                fontSizeBtn.style.opacity = 0 // show when appDiv.onmouseover only
                fontSizeBtn.append(fontSizeSVG) ; cornerBtnsDiv.append(fontSizeBtn)

                if (!env.browser.isMobile) {

                // Create/append Expand/Shrink button
                    var arrowsBtn = document.createElement('btn'),
                        arrowsSVG = icons.arrowsDiagonal.create()
                    arrowsSVG.style.transform = 'rotate(-7deg)' // tilt slightly to hint expansions often horizontal
                    arrowsBtn.id = `${app.cssPrefix}-arrows-btn` // for toggle.tooltip()
                    arrowsBtn.className = `${app.cssPrefix}-div-corner-btn`
                    arrowsBtn.style.margin = '0.5px 12px 0 0' // position
                    arrowsBtn.style.display = 'none' // show when config.anchored only
                    arrowsBtn.style.opacity = 0 // show when appDiv.onmouseover only
                    arrowsBtn.append(arrowsSVG) ; cornerBtnsDiv.append(arrowsBtn)

                // Add tooltips
                    appDiv.append(tooltipDiv)
                }

                // Add app div corner button listeners
                listenerize.appDivCornerBtns()

                // Create/append 'by KudoAI'
                const kudoAIspan = document.createElement('span')
                kudoAIspan.classList.add('kudoai', 'no-user-select') ; kudoAIspan.textContent = 'by '
                kudoAIspan.append(create.anchor(app.urls.publisher, 'KudoAI'))
                appDiv.querySelector(`.${app.cssPrefix}-name`).insertAdjacentElement('afterend', kudoAIspan)

                // Create/append answer bubble
                const answerPre = document.createElement('pre'),
                      replyTipSpan = document.createElement('span')
                replyTipSpan.className = `${app.cssPrefix}-reply-tip`
                appDiv.append(replyTipSpan, answerPre)

                update.style.tweaks() // show/hide 'by KudoAI', update pre-height based on mode
            }

            // Build reply section if missing
            if (!appDiv.querySelector(`#${app.cssPrefix}-chatbar`)) {

                // Init/clear reply section content/classes
                const replySection = appDiv.querySelector('section') || document.createElement('section')
                replySection.textContent = '' ; replySection.classList.remove('loading', 'no-user-select')

                // Create/append section elems
                const replyForm = document.createElement('form'),
                      continueChatDiv = document.createElement('div'),
                      chatTextarea = document.createElement('textarea')
                chatTextarea.id = `${app.cssPrefix}-chatbar` ; chatTextarea.rows = '1'
                chatTextarea.placeholder = `${app.msgs.tooltip_sendReply}...`
                continueChatDiv.append(chatTextarea)
                replyForm.append(continueChatDiv) ; replySection.append(replyForm)
                appDiv.append(replySection);

                // Create/append chatbar buttons
                ['send', 'shuffle'].forEach(btnType => {
                    const btnElem = document.createElement('button') ; btnElem.id = `${app.cssPrefix}-${btnType}-btn`
                    btnElem.classList.add(`${app.cssPrefix}-chatbar-btn`, 'no-mobile-tap-outline')
                    btnElem.style.right = `${ btnType == 'send' ? ( env.browser.isFF ? 12 : 9 )
                                                                : ( env.browser.isFF ? 13 : 7 )}px` // Shuffle btn
                    btnElem.append(icons[btnType == 'send' ? 'arrowUp' : 'arrowsTwistedRight'].create())
                    continueChatDiv.append(btnElem)
                })

                // Add listeners
                listenerize.replySection()

                // Scroll to top on mobile if user interacted
                if (env.browser.isMobile && show.reply.userInteracted) {
                    document.body.scrollTop = 0 // Safari
                    document.documentElement.scrollTop = 0 // Chromium/FF/IE
                }
            }

            // Render/show answer
            const answerPre = appDiv.querySelector('pre')
            try { // to render markdown
                answerPre.innerHTML = marked.parse(answer) } catch (err) { log.error(err.message) }
            hljs.highlightAll() // highlight code
            update.replyPrefix() // prepend '>> ' if dark scheme w/ bg animations to emulate terminal

            // Typeset math
            answerPre.querySelectorAll('code').forEach(codeBlock => // add linebreaks after semicolons
                codeBlock.innerHTML = codeBlock.innerHTML.replace(/;\s*/g, ';<br>'))
            const elemsToRenderMathIn = [answerPre, ...answerPre.querySelectorAll('*')]
            elemsToRenderMathIn.forEach(elem => { renderMathInElement(elem, {
                delimiters: [
                    { left: '$$', right: '$$', display: true },
                    { left: '$', right: '$', display: false },
                    { left: '\\(', right: '\\)', display: false },
                    { left: '\\[', right: '\\]', display: true },
                    { left: '\\begin{equation}', right: '\\end{equation}', display: true },
                    { left: '\\begin{align}', right: '\\end{align}', display: true },
                    { left: '\\begin{alignat}', right: '\\end{alignat}', display: true },
                    { left: '\\begin{gather}', right: '\\end{gather}', display: true },
                    { left: '\\begin{CD}', right: '\\end{CD}', display: true },
                    { left: '\\[', right: '\\]', display: true }
                ],
                throwOnError: false
            })})

            // Auto-scroll if active
            if (config.autoScroll && !env.browser.isMobile && config.proxyAPIenabled && !config.streamingDisabled)
                answerPre.scrollTop = answerPre.scrollHeight

            // Focus chatbar conditionally
            if (!show.reply.chatbarFocused // do only once
                && !env.browser.isMobile // exclude mobile devices to not auto-popup OSD keyboard
                && (!config.autoFocusChatbarDisabled // AF enabled
                    || (  // ...or AF disabled & user interacted
                        config.autoFocusChatbarDisabled && show.reply.userInteracted))
            ) { appDiv.querySelector(`#${app.cssPrefix}-chatbar`).focus() ; show.reply.chatbarFocused = true }

            // Update styles
            update.appBottomPos() // restore minimized/restored state

            show.reply.userInteracted = false
        }
    }

    // Run MAIN routine

    menu.register()

    // Exit on specific pages
    if (location.pathname == '/message-us')
        return log.debug('Exited from support bot')
    else if (document.querySelector('form[action*="Captcha"]'))
        return log.debug('Exited from Captcha page')
    else if (document.querySelector('a > img[src*="/error"]'))
        return log.debug('Exited from 404 page')

    // Create/ID/classify/listenerize/stylize APP container
    const appDiv = document.createElement('div') ; appDiv.id = app.cssPrefix
    appDiv.classList.add('fade-in') ; listenerize.appDiv()
    const appStyle = create.style() ; update.style.app() ; document.head.append(appStyle);
    ['brs', 'wrs', 'hljs'].forEach(cssType => // black rising stars, white rising stars, code highlighting
        document.head.append(create.style(GM_getResourceText(`${cssType}CSS`))))

    // Stylize SITE elems
    const tweaksStyle = create.style()
    const anchorStyles = `#${app.cssPrefix} { position: fixed ; bottom: -7px ;`
                       + `right: ${ env.browser.isMobile ? window.innerWidth *0.01 : 35 }px ;`
                       + `width: ${ env.browser.isMobile ? '98%' : '441px' }}`
                       + `#${app.cssPrefix}-chevron-btn, #${app.cssPrefix}-arrows-btn { display: block !important }`
    const expandedStyles = `#${app.cssPrefix} { width: 528px }`
    update.style.tweaks() ; document.head.append(tweaksStyle)

    // Create/stylize TOOLTIPs
    if (!env.browser.isMobile) {
        var tooltipDiv = document.createElement('div')
        tooltipDiv.classList.add(`${app.cssPrefix}-btn-tooltip`, 'no-user-select')
        document.head.append(create.style(`.${app.cssPrefix}-btn-tooltip {`
            + 'background-color:' // bubble style
                + 'rgba(0, 0, 0, 0.64) ; padding: 4px 6px ; border-radius: 6px ; border: 1px solid #d9d9e3 ;'
            + 'font-size: 0.87em ; color: white ; fill: white ; stroke: white ;' // font/icon style
            + 'position: absolute ;' // for update.tooltip() calcs
            + 'box-shadow: 3px 5px 16px 0 rgb(0 0 0 / 21%) ;' // drop shadow
            + 'opacity: 0 ; transition: opacity 0.1s ; height: fit-content ; z-index: 1250 }' // visibility
        ))
    }

    // APPEND AMAZONGPT to Amazon
    document.body.append(appDiv)
    setTimeout(() => appDiv.classList.add('active'), 350) // fade in

    // Get/show FIRST REPLY
    const firstQuery = (
        /\/(?:dp|product)\//.test(location.href) ? (
            'Tell me more about this product, including benefits and the brand if possible.'
          + ' Also talk about similar products in a markdown list. The product is: ' + document.title
        ) : /\/b\//.test(location.href) ?
            ( 'Tell me more about what to look for when shopping for this category: ' + document.title
        ) : 'Hi there'
    )
    let msgChain = [{ role: 'user', content: augmentQuery(firstQuery) }]
    appAlert('waitingResponse') ; get.reply(msgChain)

})()
