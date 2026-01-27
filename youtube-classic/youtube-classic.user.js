// ==UserScript==
// @name              YouTube™ Classic 📺 — (Remove rounded design + Return YouTube dislikes)
// @version           2026.1.27.5
// @author            Adam Lui, Magma_Craft, Fuim & hoothin
// @namespace         https://github.com/adamlui
// @description       Reverts YouTube to its classic design (before all the rounded corners & hidden dislikes) + redirects YouTube Shorts
// @license           MIT
// @icon              https://assets.ytclassic.com/images/icons/app/icon48.png?v=3bd207d
// @icon64            https://assets.ytclassic.com/images/icons/app/icon64.png?v=3bd207d
// @compatible        chrome
// @compatible        firefox
// @compatible        opera
// @compatible        safari
// @compatible        edge
// @match             *://*.youtube.com/*
// @connect           gm.ytclassic.com
// @connect           raw.githubusercontent.com
// @require           https://cdn.jsdelivr.net/gh/adamlui/userscripts@ff2baba/assets/js/lib/css.js/dist/css.min.js#sha256-zf9s8C0cZ/i+gnaTIUxa0+RpDYpsJVlyuV5L2q4KUdA=
// @require           https://cdn.jsdelivr.net/gh/adamlui/userscripts@ff2baba/assets/js/lib/dom.js/dist/dom.min.js#sha256-nTc2by3ZAz6AR7B8fOqjloJNETvjAepe15t2qlghMDo=
// @require           https://cdn.jsdelivr.net/gh/Anarios/return-youtube-dislike@c0c3a2e/Extensions/UserScript/Return%20Youtube%20Dislike.user.js#sha256-BPRgJOQfxTUmr09fqGi1dlZ14jtZfdKHhKltqmf5B+Y=
// @grant             GM_registerMenuCommand
// @grant             GM_unregisterMenuCommand
// @grant             GM_getValue
// @grant             GM_setValue
// @run-at            document-end
// @downloadURL       https://gm.ytclassic.com
// @updateURL         https://gm.ytclassic.com
// @homepageURL       https://www.ytclassic.com
// @supportURL        https://github.com/adamlui/youtube-classic/issues
// @contributionURL   https://github.com/sponsors/adamlui
// ==/UserScript==

(() => {
    'use strict'

    // Init DATA
    window.env = {
        scriptManager: {
            name: (() => { try { return GM_info.scriptHandler } catch (err) { return 'unknown' }})(),
            version: (() => { try { return GM_info.version } catch (err) { return 'unknown' }})()
        },
        ui: {
            scheme: document.documentElement.hasAttribute('dark')
                 || window.matchMedia?.('(prefers-color-scheme: dark)')?.matches ? 'dark' : 'light'
        }
    }
    env.scriptManager.supportsTooltips = env.scriptManager.name == 'Tampermonkey'
                                      && parseInt(env.scriptManager.version.split('.')[0]) >= 5
    window.app = { symbol: '📺', configKeyPrefix: 'ytClassic' }

    // Init SETTINGS
    app.config ??= {}
    window.settings = {

        controls: { // displays top-to-bottom in toolbar menu
            disableShorts: {
                type: 'toggle', label: 'Redirect Shorts', defaultVal: true,
                helptip: 'Redirect Shorts to classic wide player'
            },
            shortsBlock: {
                type: 'toggle', label: 'Hide Shorts', defaultVal: true,
                helptip: 'Hide Shorts from appearing in home page + results'
            },
            playablesBlock: {
                type: 'toggle', label: 'Hide Playables', defaultVal: true,
                helptip: 'Hide Playables from appearing in home page'
            },
            adBlock: {
                type: 'toggle', label: 'Block Ads', defaultVal: false,
                helptip: 'Hide ad thumbnails from homepage layouts'
            },
            aiBlock: {
                type: 'toggle', label: 'Block AI Summaries', defaultVal: true,
                helptip: 'Hide AI summaries from video pages'
            },
            notifDisabled: {
                type: 'toggle', label: 'Mode Notifications', defaultVal: false,
                helptip: 'Show notifications when toggling mode/settings'
            }
        },

        load(...keys) {
            keys.flat().forEach(key =>
                app.config[key] = processKey(key, GM_getValue(`${app.configKeyPrefix}_${key}`, undefined)))
            function processKey(key, val) {
                const ctrl = settings.controls?.[key]
                if (val != undefined && ( // validate stored val
                        (ctrl?.type == 'toggle' && typeof val != 'boolean')
                     || (ctrl?.type == 'slider' && isNaN(parseFloat(val)))
                )) val = undefined
                return val ?? (ctrl?.defaultVal ?? (ctrl?.type == 'slider' ? 100 : false))
            }
        },

        save(key, val) { GM_setValue(`${app.configKeyPrefix}_${key}`, val) ; app.config[key] = val },

        typeIsEnabled(key) { // for menu labels + notifs to return ON/OFF
            const reInvertSuffixes = /disabled|hidden/i
            return reInvertSuffixes.test(key) // flag in control key name
                && !reInvertSuffixes.test(this.controls[key]?.label || '') // but not in label msg key name
                    ? !app.config[key] : app.config[key] // so invert since flag reps opposite type state, else don't
        }
    }
    settings.load(Object.keys(settings.controls))

    app.selectors = { site: {
        ad: { masthead: 'div#masthead-ad' }, // https://imgur.com/a/kOWzh3O
        ai: {
            askBtn: 'button:has(path[d*=M480-80q0-83])',
            askSection: 'yt-video-description-youchat-section-view-model',
            summary: 'div#header[class*=expandable-metadata]:has(path[d*=M480-80q0-83])'
        },
        playables: { shelf: 'ytd-rich-section-renderer:has(a[href*="/playables/"])' },
        shorts: {
            navEntry: 'a#endpoint[title=Shorts]',
            shelf: {
                homepage: 'div.ytd-rich-shelf-renderer:has(a[href*="/shorts/"])', // https://imgur.com/a/LMdO92M
                results: 'grid-shelf-view-model:has(a[href*="/shorts/"])' // https://imgur.com/a/vVzoEfH
            }
        }
    }}

    const CONFIGS = { BUTTON_REWORK: false }

    const EXPFLAGS = {
        enable_channel_page_header_profile_section: false,
        enable_header_channel_handler_ui: false,
        kevlar_unavailable_video_error_ui_client: false,
        kevlar_refresh_on_theme_change: false,
        kevlar_modern_sd_v2: false,
        kevlar_watch_cinematics: false,
        kevlar_watch_comments_panel_button: false,
        kevlar_watch_grid: false,
        kevlar_watch_grid_hide_chips: false,
        kevlar_watch_metadata_refresh: false,
        kevlar_watch_metadata_refresh_no_old_secondary_data: false,
        kevlar_watch_modern_metapanel: false,
        kevlar_watch_modern_panels: false,
        kevlar_watch_panel_height_matches_player: false,
        smartimation_background: false,
        web_amsterdam_playlists: false,
        web_animated_actions: false,
        web_animated_like: false,
        web_button_rework: false,
        web_button_rework_with_live: false,
        web_darker_dark_theme: false,
        web_enable_youtab: false,
        web_guide_ui_refresh: false,
        web_modern_ads: false,
        web_modern_buttons: false,
        web_modern_chips: false,
        web_modern_collections_v2: false,
        web_modern_dialogs: false,
        web_modern_playlists: false,
        web_modern_subscribe: false,
        web_modern_tabs: false,
        web_rounded_containers: false,
        web_rounded_thumbnails: false,
        web_searchbar_style: 'default',
        web_segmented_like_dislike_button: false,
        web_sheets_ui_refresh: false,
        web_snackbar_ui_refresh: false,
        web_watch_rounded_player_large: false
    }

    const PLYRFLAGS = {
        web_rounded_containers: 'false',
        web_rounded_thumbnails: 'false'
    }

    // Define FUNCTIONS

    function cjsNotify(...args) {
        const scheme = document.querySelector('html[dark]')
            || window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'

        let msg, position, notifDuration, shadow, toast
        if (typeof args[0] == 'object' && !Array.isArray(args[0]))
            ({ msg, position, notifDuration, shadow, toast } = args[0])
        else [msg, position, notifDuration, shadow] = args
        notifDuration = notifDuration ? +notifDuration : 1.75 // sec duration to maintain notification visibility
        const fadeDuration = 0.35, // sec duration of fade-out
              vpYoffset = 23, vpXoffset = 27 // px offset from viewport border

        // Create/append notification div
        const notificationDiv = document.createElement('div') // make div
        notificationDiv.id = Math.floor(Math.random() * 1000000) + Date.now()
        notificationDiv.classList.add('chatgpt-notif')
        notificationDiv.textContent = msg // insert msg
        document.body.append(notificationDiv) // insert into DOM

        // Create/append close button
        const closeBtn = document.createElement('div')
        closeBtn.title = 'Dismiss' ; closeBtn.classList.add('notif-close-btn', 'no-mobile-tap-outline')
        const closeSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
        closeSVG.setAttribute('height', '8px')
        closeSVG.setAttribute('viewBox', '0 0 14 14')
        closeSVG.setAttribute('fill', 'none')
        closeSVG.style.height = closeSVG.style.width = '8px' // override SVG styles on non-OpenAI sites
        const closeSVGpath = document.createElementNS('http://www.w3.org/2000/svg', 'path')
        closeSVGpath.setAttribute('fill-rule', 'evenodd')
        closeSVGpath.setAttribute('clip-rule', 'evenodd')
        closeSVGpath.setAttribute('fill', 'white')
        closeSVGpath.setAttribute('d', 'M13.7071 1.70711C14.0976 1.31658 14.0976 0.683417 13.7071 0.292893C13.3166 -0.0976312 12.6834 -0.0976312 12.2929 0.292893L7 5.58579L1.70711 0.292893C1.31658 -0.0976312 0.683417 -0.0976312 0.292893 0.292893C-0.0976312 0.683417 -0.0976312 1.31658 0.292893 1.70711L5.58579 7L0.292893 12.2929C-0.0976312 12.6834 -0.0976312 13.3166 0.292893 13.7071C0.683417 14.0976 1.31658 14.0976 1.70711 13.7071L7 8.41421L12.2929 13.7071C12.6834 14.0976 13.3166 14.0976 13.7071 13.7071C14.0976 13.3166 14.0976 12.6834 13.7071 12.2929L8.41421 7L13.7071 1.70711Z')
        closeSVG.append(closeSVGpath) ; closeBtn.append(closeSVG) ; notificationDiv.append(closeBtn)

        // Determine div position/quadrant
        notificationDiv.isTop = !position || !/low|bottom/i.test(position)
        notificationDiv.isRight = !position || !/left/i.test(position)
        notificationDiv.quadrant = (notificationDiv.isTop ? 'top' : 'bottom')
                                 + (notificationDiv.isRight ? 'Right' : 'Left')

        // Create/append/update notification style (if missing or outdated)
        const thisUpdated = 1746996635555 // timestamp of last edit for this file's `notifStyle`
        let notifStyle = document.querySelector('#chatgpt-notif-style') // try to select existing style
        if (!notifStyle || parseInt(notifStyle.getAttribute('last-updated'), 10) < thisUpdated) { // if missing or outdated
            if (!notifStyle) { // outright missing, create/id/attr/append it first
                notifStyle = document.createElement('style') ; notifStyle.id = 'chatgpt-notif-style'
                notifStyle.setAttribute('last-updated', thisUpdated.toString())
                document.head.append(notifStyle)
            }
            notifStyle.textContent = ( // update prev/new style contents
                '.chatgpt-notif {'
                    + 'font-family: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC",'
                        + '"Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", sans-serif ;'
                    + '.no-mobile-tap-outline { outline: none ; -webkit-tap-highlight-color: transparent }'
                    + 'background-color: black ; padding: 10px 13px 10px 18px ;' // bubble style
                        + 'border-radius: 11px ; border: 1px solid #f5f5f7 ;'
                    + 'opacity: 0 ; position: fixed ; z-index: 9999 ; font-size: 1.8rem ; color: white ;' // visibility
                    + 'user-select: none ; -webkit-user-select: none ; -moz-user-select: none ; -o-user-select: none ;'
                        + '-ms-user-select: none ;'
                    + `transform: translateX(${ // init off-screen for transition fx
                          !notificationDiv.isRight ? '-' : '' }35px) ;`
                    + ( shadow ? `--shadow: -8px 13px 25px 0 ${ /\b(?:shadow|on)\b/i.test(shadow) ? 'gray' : shadow };
                        box-shadow: var(--shadow) ; -webkit-box-shadow: var(--shadow) ; -moz-box-shadow: var(--shadow)`
                            : '' ) + '}'
                + `.notif-close-btn {
                      cursor: pointer ; float: right ; position: relative ; right: -4px ; margin-left: -3px ;`
                    + 'display: grid }' // top-align for non-OpenAI sites
                + '@keyframes notif-zoom-fade-out { 0% { opacity: 1 ; transform: scale(1) }' // transition out keyframes
                    + '15% { opacity: 0.35 ; transform: rotateX(-27deg) scale(1.05) }'
                    + '45% { opacity: 0.05 ; transform: rotateX(-81deg) }'
                    + '100% { opacity: 0 ; transform: rotateX(-180deg) scale(1.15) }}'
            )
            if (toast) notifStyle.textContent += `
                div.chatgpt-notif {
                    position: absolute ; left: 50% ; right: 21% !important ; text-align: center ;
                    ${ scheme == 'dark' ? 'border: 2px solid white ;' : '' }
                    margin-${ !notificationDiv.isTop ? 'bottom: 105px' : 'top: 42px' };
                    transform: translate(-50%, -50%) scale(0.6) !important }
                div.chatgpt-notif > div.notif-close-btn { top: 18px ; right: 7px ; transform: scale(2) }`
        }

        // Enqueue notification
        let notifyProps = JSON.parse(localStorage.notifyProps
            ??= JSON.stringify({ queue: { topRight: [], bottomRight: [], bottomLeft: [], topLeft: [] }}))
        notifyProps.queue[notificationDiv.quadrant].push(notificationDiv.id)
        localStorage.notifyProps = JSON.stringify(notifyProps)

        // Position notification (defaults to top-right)
        notificationDiv.style.top = notificationDiv.isTop ? vpYoffset.toString() + 'px' : ''
        notificationDiv.style.bottom = !notificationDiv.isTop ? vpYoffset.toString() + 'px' : ''
        notificationDiv.style.right = notificationDiv.isRight ? vpXoffset.toString() + 'px' : ''
        notificationDiv.style.left = !notificationDiv.isRight ? vpXoffset.toString() + 'px' : ''

        // Re-position old notifications
        const thisQuadrantQueue = notifyProps.queue[notificationDiv.quadrant]
        if (thisQuadrantQueue.length > 1) {
            try { // to move old notifications
                for (const divID of thisQuadrantQueue.slice(0, -1)) { // exclude new div
                    const oldDiv = document.getElementById(divID),
                          offsetProp = oldDiv.style.top ? 'top' : 'bottom', // pick property to change
                          vOffset = +parseInt(oldDiv.style[offsetProp]) +5 + oldDiv.getBoundingClientRect().height
                    oldDiv.style[offsetProp] = `${vOffset}px` // change prop
                }
            } catch (err) { console.warn('Failed to re-position notification:', err) }
        }

        // Show notification
        setTimeout(() => {
            notificationDiv.style.opacity = scheme == 'dark' ? 0.8 : 0.67 // show msg
            notificationDiv.style.transform = 'translateX(0)' // bring from off-screen
            notificationDiv.style.transition = 'transform 0.15s ease, opacity 0.15s ease'
        }, 10)

        // Init delay before hiding
        const hideDelay = fadeDuration > notifDuration ? 0 // don't delay if fade exceeds notification duration
                        : notifDuration - fadeDuration // otherwise delay for difference

        // Add notification dismissal to timeout schedule + button clicks
        const dismissNotif = () => {
            notificationDiv.style.animation = `notif-zoom-fade-out ${fadeDuration}s ease-out`
            clearTimeout(dismissFuncTID)
        }
        const dismissFuncTID = setTimeout(dismissNotif, hideDelay * 1000) // maintain visibility for `hideDelay` secs, then dismiss
        closeSVG.onclick = dismissNotif // add to close button clicks

        // Destroy notification
        notificationDiv.onanimationend = () => {
            notificationDiv.remove() // remove from DOM
            notifyProps = JSON.parse(localStorage.notifyProps)
            notifyProps.queue[notificationDiv.quadrant].shift() // + memory
            localStorage.notifyProps = JSON.stringify(notifyProps) // + storage
        }

        return notificationDiv
    }

    const toolbarMenu = {
        state: {
            symbols: ['❌', '✔️'], separator: env.scriptManager.name == 'Tampermonkey' ? ' — ' : ': ',
            words: ['OFF', 'ON']
        },

        refresh() {
            if (typeof GM_unregisterMenuCommand == 'undefined') return
            this.entryIDs.forEach(id => GM_unregisterMenuCommand(id))
            this.register()
        },

        register() {
            this.entryIDs = Object.keys(settings.controls).map(key => {
                const ctrl = settings.controls[key]
                const menuLabel = `${
                    ctrl.symbol || this.state.symbols[+settings.typeIsEnabled(key)] } ${ctrl.label} ${
                        ctrl.type == 'toggle' ? this.state.separator + this.state.words[+settings.typeIsEnabled(key)]
                      : ctrl.type == 'slider' ? ': ' + app.config[key] + ctrl.labelSuffix || ''
                      : ctrl.status ? ` — ${ctrl.status}` : '' }`
                return GM_registerMenuCommand(menuLabel, () => {
                    settings.save(key, !app.config[key]) ; syncConfigToUI({ updatedKey: key })
                    notify(`${ctrl.label}: ${this.state.words[+settings.typeIsEnabled(key)]}`)
                }, env.scriptManager.supportsTooltips ? { title: ctrl.helptip || ' ' } : undefined)
            })
        }
    }

    function notify(msg, pos = '', notifDuration = '', shadow = '') { // requires dom.js
        if (app.config.notifDisabled && !msg.includes(settings.controls.notifDisabled.label)) return

        // Strip state word to append colored one later
        const foundState = toolbarMenu.state.words.find(word => msg.includes(word))
        if (foundState) msg = msg.replace(foundState, '')

        // Show notification
        cjsNotify(`${app.symbol} ${msg}`, pos, notifDuration, shadow || env.ui.scheme == 'dark' ? '' : 'shadow')
        const notif = document.querySelector('.chatgpt-notif:last-child')

        // Tweak styles
        notif.style.fontSize = '385%'
        if (foundState) { // append styled state word
            const styledStateSpan = dom.create.elem('span', { style: `color: ${
                foundState == toolbarMenu.state.words[0] ?
                    '#ef4848 ; text-shadow: rgba(255,169,225,0.44) 2px 1px 5px'
                  : '#5cef48 ; text-shadow: rgba(255,250,169,0.38) 2px 1px 5px'
            }`})
            styledStateSpan.append(foundState) ; notif.append(styledStateSpan)
        }
    }

    function syncConfigToUI(options) {
        if (options?.updatedKey == 'disableShorts') {
            if (app.config.disableShorts && !checkShortsToRedir.id)
                checkShortsToRedir()
            else if (!app.config.disableShorts && checkShortsToRedir.id) {
                cancelAnimationFrame(checkShortsToRedir.id) ; checkShortsToRedir.id = null }
        } else if (options?.updatedKey.includes('Block'))
            app.styles.config.textContent = Object.entries(app.selectors.site)
                .map(([key, selectors]) => !app.config[`${key}Block`] ? ''
                    : `${css.selectors.extract(selectors).join(',')} { display: none }`
                ).join('')
        toolbarMenu.refresh() // prefixes/suffixes
    }

    // Run MAIN routine

    toolbarMenu.register()

    class YTP {
        static observer = new MutationObserver(this.onNewScript)
        static _config = {}
        static isObject(item) { return (item && typeof item == 'object' && !Array.isArray(item)) }
        static mergeDeep(target, ...sources) {
            if (!sources.length) return target
            const source = sources.shift()
            if (this.isObject(target) && this.isObject(source)) for (const key in source)
                if (this.isObject(source[key])) {
                    if (!target[key]) Object.assign(target, { [key]: {} })
                    this.mergeDeep(target[key], source[key])
                } else Object.assign(target, { [key]: source[key] })
            return this.mergeDeep(target, ...sources)
        }
        static onNewScript(mutations) { if (mutations.some(mut => mut.addedNodes.length)) YTP.bruteforce() }
        static start() { this.observer.observe(document, { childList: true, subtree: true }) }
        static stop() { this.observer.disconnect() }
        static bruteforce() {
            if (!unsafeWindow.yt?.config_) return
            this.mergeDeep(unsafeWindow.yt.config_, this._config)
        }
        static setCfg(name, value) { this._config[name] = value }
        static setCfgMulti(configs) { this.mergeDeep(this._config, configs) }
        static setExp(name, value) {
            if (!('EXPERIMENT_FLAGS' in this._config)) this._config.EXPERIMENT_FLAGS = {}
            this._config.EXPERIMENT_FLAGS[name] = value
        }
        static setExpMulti(exps) {
            if (!('EXPERIMENT_FLAGS' in this._config)) this._config.EXPERIMENT_FLAGS = {}
            this.mergeDeep(this._config.EXPERIMENT_FLAGS, exps)
        }
        static decodePlyrFlags(flags) {
            const obj = {}, dflags = flags.split('&')
            for (const dflagStr of dflags) {
                const dflag = dflagStr.split('=') ; obj[dflag[0]] = dflag[1] }
            return obj
        }
        static encodePlyrFlags(flags) {
            const keys = Object.keys(flags) ; let response = ''
            for (const [i, key] of keys.entries()) {
                if (i > 0) response += '&'
                response += key + '=' + flags[key]
            }
            return response
        }
        static setPlyrFlags(flags) {
            if (!unsafeWindow.yt?.config_?.WEB_PLAYER_CONTEXT_CONFIGS) return
            const conCfgs = unsafeWindow.yt.config_.WEB_PLAYER_CONTEXT_CONFIGS
            if (!('WEB_PLAYER_CONTEXT_CONFIGS' in this._config)) this._config.WEB_PLAYER_CONTEXT_CONFIGS = {}
            for (const cfg in conCfgs) {
                const dflags = this.decodePlyrFlags(conCfgs[cfg].serializedExperimentFlags)
                this.mergeDeep(dflags, flags)
                this._config.WEB_PLAYER_CONTEXT_CONFIGS[cfg] = {
                    serializedExperimentFlags: this.encodePlyrFlags(dflags) }
            }
        }
    }

    const ATTRS = [ // to remove from <html>
        'darker-dark-theme', 'darker-dark-theme-deprecate' ]
    unsafeWindow.addEventListener('yt-page-data-updated', function tmp() {
        const ytLogo = document.getElementById('logo-icon'),
              classicLogo = dom.create.elem('img', { style: 'margin-left: 5px', height: 65 })
        classicLogo.src = document.querySelector('ytd-masthead').getAttribute('dark') != null
            ? 'https://i.imgur.com/brCETJj.png' // Dark mode
            : 'https://i.imgur.com/rHLcxEs.png' // Light mode
        ytLogo.textContent = '' ; ytLogo.append(classicLogo)
        YTP.stop()
        ATTRS.forEach(attr => document.getElementsByTagName('html')[0].removeAttribute(attr))
        unsafeWindow.removeEventListener('yt-page-date-updated', tmp)
    })

    YTP.start()
    YTP.setCfgMulti(CONFIGS)
    YTP.setExpMulti(EXPFLAGS)
    YTP.setPlyrFlags(PLYRFLAGS)

    dom.get.loadedElem('#items.ytd-guide-section-renderer').then(restoreTrending)
    dom.get.loadedElem('#items.ytd-mini-guide-section-renderer').then(restoreTrending)
    function restoreTrending() {
        const trendingData = {
            'navigationEndpoint': {
                'clickTrackingParams': 'CBwQtSwYASITCNqYh-qO_fACFcoRrQYdP44D9Q==',
                'commandMetadata': {
                    'webCommandMetadata': {
                        'url': '/feed/explore',
                        'webPageType': 'WEB_PAGE_TYPE_BROWSE',
                        'rootVe': 6827,
                        'apiUrl': '/youtubei/v1/browse'
                    }
                },
                'browseEndpoint': { 'browseId': 'FEtrending' }
            },
            'icon': { 'iconType': 'EXPLORE' },
            'trackingParams': 'CBwQtSwYASITCNqYh-qO_fACFcoRrQYdP44D9Q==',
            'formattedTitle': { 'simpleText': 'Explore' },
            'accessibility': { 'accessibilityData': { 'label': 'Explore' }},
            'isPrimary': true
        }
        document.querySelector('#items > ytd-guide-entry-renderer:nth-child(2)').data = trendingData
        document.querySelector('#items > ytd-mini-guide-entry-renderer:nth-child(2)').data = trendingData
    }

    // CSS adjustments and UI fixes
    app.styles = { fixes: dom.create.style(`
        yt-thumbnail-view-model { border-radius: 0 !important } /* square homepage thumbs */

        /* Revert old background color and buttons */
        html[dark] {
          --yt-spec-general-background-a: #181818 !important ;
          --yt-spec-general-background-b: #0f0f0f !important ;
          --yt-spec-brand-background-primary: rgba(33,33,33,0.98) !important ;
          --yt-spec-10-percent-layer: rgba(255,255,255,0.1) !important
        }
        html:not([dark]) {
          --yt-spec-general-background-a: #f9f9f9 !important ;
          --yt-spec-general-background-b: #f1f1f1 !important ;
          --yt-spec-brand-background-primary: rgba(255,255,255,0.98) !important ;
          --yt-spec-10-percent-layer: rgba(0,0,0,0.1) !important
        }

        /* Un-segment engagement buttons below vid https://github.com/adamlui/youtube-classic/issues/10 */
        :where(segmented-like-dislike-button-view-model, yt-button-view-model) button { background: none !important }

        ytd-masthead { background: var(--yt-spec-brand-background-solid) !important }
        ytd-app { background: var(--yt-spec-general-background-a) !important }
        ytd-browse[page-subtype="channels"] { background: var(--yt-spec-general-background-b) !important }
        ytd-c4-tabbed-header-renderer {
          --yt-lightsource-section1-color: var(--yt-spec-general-background-a) !important }
        ytd-mini-guide-renderer, ytd-mini-guide-entry-renderer {
            background-color: var(--yt-spec-brand-background-solid) !important }
        #cinematics.ytd-watch-flexy { display: none !important }
        #tabs-divider.ytd-c4-tabbed-header-renderer { border-bottom: 0px !important }
        #header.ytd-rich-grid-renderer { width: 100% !important }
        [page-subtype="home"] #chips-wrapper.ytd-feed-filter-chip-bar-renderer {
            background-color: var(--yt-spec-brand-background-primary) !important ;
            border-top: 1px solid var(--yt-spec-10-percent-layer) !important ;
            border-bottom: 1px solid var(--yt-spec-10-percent-layer) !important
        }    
        ytd-feed-filter-chip-bar-renderer[is-dark-theme] #left-arrow.ytd-feed-filter-chip-bar-renderer::after {
            background: linear-gradient(
                to right, var(--yt-spec-brand-background-primary) 20%, rgba(33,33,33,0) 80%) !important
        }    
        ytd-feed-filter-chip-bar-renderer[is-dark-theme] #right-arrow.ytd-feed-filter-chip-bar-renderer::before {
            background: linear-gradient(
                to left, var(--yt-spec-brand-background-primary) 20%, rgba(33,33,33,0) 80%) !important
        }
        ytd-feed-filter-chip-bar-renderer :where(#left-arrow-button,
            #right-arrow-button).ytd-feed-filter-chip-bar-renderer
                { background-color: var(--yt-spec-brand-background-primary) !important }
        yt-chip-cloud-renderer[is-dark-theme] #right-arrow.yt-chip-cloud-renderer::before {
            background: linear-gradient(to left, var(--ytd-chip-cloud-background,
                var(--yt-spec-general-background-a)) 10%, rgba(24,24,24,0) 90%) !important
        }    
        yt-chip-cloud-renderer :where(#left-arrow-button, #right-arrow-button).yt-chip-cloud-renderer {
            background: var(--ytd-chip-cloud-background, var(--yt-spec-general-background-a)) !important }
        yt-chip-cloud-renderer[is-dark-theme] #left-arrow.yt-chip-cloud-renderer::after {
            background: linear-gradient(to right, var(--ytd-chip-cloud-background,
                var(--yt-spec-general-background-a)) 10%, rgba(24,24,24,0) 90%) !important
        }    
        yt-chip-cloud-renderer #left-arrow.yt-chip-cloud-renderer::after {
            background: linear-gradient(
                to right, var(--ytd-chip-cloud-background, var(--yt-spec-general-background-a)) 10%,
                rgba(249,249,249,0) 90%
            ) !important
        }
        yt-chip-cloud-renderer #right-arrow.yt-chip-cloud-renderer::before {
            background: linear-gradient(
                to left, var(--ytd-chip-cloud-background, var(--yt-spec-general-background-a)) 10%,
                rgba(249,249,249,0) 90%
            ) !important
        }
        ytd-feed-filter-chip-bar-renderer[component-style="FEED_FILTER_CHIP_BAR_STYLE_TYPE_HASHTAG_LANDING_PAGE"]
            #chips-wrapper.ytd-feed-filter-chip-bar-renderer,
        ytd-feed-filter-chip-bar-renderer[component-style="FEED_FILTER_CHIP_BAR_STYLE_TYPE_CHANNEL_PAGE_GRID"]
            #chips-wrapper.ytd-feed-filter-chip-bar-renderer
                { background-color: var(--yt-spec-general-background-b) !important }
        ytd-feed-filter-chip-bar-renderer:where(
            [component-style="FEED_FILTER_CHIP_BAR_STYLE_TYPE_HASHTAG_LANDING_PAGE"],
            [component-style="FEED_FILTER_CHIP_BAR_STYLE_TYPE_CHANNEL_PAGE_GRID"]
        ) #chips-wrapper.ytd-feed-filter-chip-bar-renderer {
            background-color: var(--yt-spec-general-background-b) !important }
        yt-chip-cloud-chip-renderer {
            height: 32px !important ; border: 1px solid var(--yt-spec-10-percent-layer) !important ;
            border-radius: 16px !important ; box-sizing: border-box !important
        }

        /* Remove rounded corners on buttons and boxes */
        #container.ytd-searchbox {
            background-color: var(--ytd-searchbox-background) !important ;
            border-radius: 2px 0 0 2px !important ;
            box-shadow: inset 0 1px 2px var(--ytd-searchbox-legacy-border-shadow-color) !important ;
            color: var(--ytd-searchbox-text-color) !important ; padding: 2px 6px !important
        }

        ytd-searchbox[desktop-searchbar-style="rounded_corner_dark_btn"] #searchbox-button.ytd-searchbox {
            display: none !important }
        ytd-searchbox[desktop-searchbar-style="rounded_corner_light_btn"] #searchbox-button.ytd-searchbox {
            display: none !important }
        #search[has-focus] #search-input { margin-left: 32px !important }
        #search-icon-legacy.ytd-searchbox { display: block !important ; border-radius: 0px 2px 2px 0px !important }
        .sbsb_a { border-radius: 2px !important }
        .sbsb_c { padding-left: 10px !important }
        div.sbqs_c::before { margin-right: 10px !important }
        ytd-searchbox[has-focus] #search-icon.ytd-searchbox {
            padding-left: 10px !important ; padding-right: 10px !important }
        #voice-search-button.ytd-masthead {
            background-color: var(--yt-spec-general-background-a) !important ; margin-left: 4px !important }
        #guide-content.ytd-app { background: var(--yt-spec-brand-background-solid) !important }
        yt-interaction.ytd-guide-entry-renderer, ytd-guide-entry-renderer { border-radius: 0px !important }
        a#endpoint.yt-simple-endpoint.style-scope.ytd-mini-guide-entry-renderer { margin: 0px !important }
        ytd-guide-entry-renderer[guide-refresh] { width: 100% !important ; border-radius: 0px !important }
        tp-yt-paper-item.ytd-guide-entry-renderer { --paper-item-focused-before-border-radius: 0px !important }
        ytd-mini-guide-entry-renderer { border-radius: 0 !important }
        ytd-guide-section-renderer.style-scope.ytd-guide-renderer { padding-left: 0px !important }
        ytd-mini-guide-renderer[guide-refresh] { padding: 0 !important }
        ytd-guide-entry-renderer[active] { border-radius: 0px !important }
        .style-scope.ytd-guide-entry-renderer:hover { border-radius: 0 !important }
        tp-yt-paper-item.style-scope.ytd-guide-entry-renderer {
            border-radius: 0px !important ; padding-left: 24px !important }
        #guide-section-title.ytd-guide-section-renderer {
            color: var(--yt-spec-text-secondary) !important ; padding: 8px 24px !important ;
            font-size: var(--ytd-tab-system-font-size) !important ;
            font-weight: var(--ytd-tab-system-font-weight) !important ;
            letter-spacing: var(--ytd-tab-system-letter-spacing) !important ;
            text-transform: var(--ytd-tab-system-text-transform) !important
        }    
        .style-scope.ytd-rich-item-renderer { border-radius: 2px !important }
        .style-scope.ytd-item-section-renderer { border-radius: 0px !important }
        #tooltip.tp-yt-paper-tooltip { border-radius: 2px !important }
        div.style-scope.yt-tooltip-renderer { border-radius: 0px !important }
        .style-scope.ytd-topic-link-renderer { border-radius: 2px !important }
        .bold.style-scope.yt-formatted-string { font-family: Roboto !important }
        .style-scope.yt-formatted-string { font-family: Roboto !important }
        #bar { border-radius: 2px !important }
        ytd-multi-page-menu-renderer {
            border-radius: 0px !important ; border: 1px solid var(--yt-spec-10-percent-layer) !important ;
            border-top: none !important ; box-shadow: none !important
        }    
        yt-dropdown-menu { --paper-menu-button-content-border-radius:  2px !important }
        ytd-menu-popup-renderer { border-radius: 2px !important }
        .style-scope.ytd-shared-post-renderer { border-radius: 0px !important }
        div#repost-context.style-scope.ytd-shared-post-renderer { border-radius: 0px !important }
        ytd-post-renderer.style-scope.ytd-shared-post-renderer { border-radius: 0px !important }
        div#dismissed.style-scope.ytd-compact-video-renderer { border-radius: 0px !important }
        .style-scope.ytd-feed-nudge-renderer { border-radius: 2px !important }
        .style-scope.ytd-inline-survey-renderer { border-radius: 2px !important}
        .style-scope.ytd-brand-video-shelf-renderer { border-radius: 0px !important }
        div#dismissible.style-scope.ytd-brand-video-singleton-renderer { border-radius: 0px !important }
        #inline-survey-compact-video-renderer { border-radius: 0px !important }
        tp-yt-paper-button#button.style-scope.ytd-button-renderer.style-inactive-outline.size-default {
            border-radius: 2px !important }
        div#dismissed.style-scope.ytd-rich-grid-media { border-radius: 0px !important }
        ytd-thumbnail[size="large"] a.ytd-thumbnail, ytd-thumbnail[size="large"]::before { border-radius: 0 !important }
        ytd-thumbnail[size="medium"] a.ytd-thumbnail, ytd-thumbnail[size="medium"]::before {
            border-radius: 0 !important }
        ytd-playlist-thumbnail[size="medium"] a.ytd-playlist-thumbnail, ytd-playlist-thumbnail[size="medium"]::before {
            border-radius: 0 !important }
        ytd-playlist-thumbnail[size="large"] a.ytd-playlist-thumbnail, ytd-playlist-thumbnail[size="large"]::before {
            border-radius: 0 !important }
        ytd-playlist-panel-renderer[modern-panels]:not([within-miniplayer]) #container.ytd-playlist-panel-renderer {
            border-radius: 0 !important }
        ytd-thumbnail-overlay-toggle-button-renderer.style-scope.ytd-thumbnail { border-radius: 2px !important }
        ytd-compact-link-renderer.ytd-settings-sidebar-renderer { margin: 0px !important ; border-radius: 0 !important }
        ytd-compact-link-renderer[compact-link-style=compact-link-style-type-settings-sidebar][active] {
            border-radius: 0 !important }
        tp-yt-paper-item.style-scope.ytd-compact-link-renderer::before { border-radius: 0 !important }
        ytd-compact-link-renderer[compact-link-style=compact-link-style-type-settings-sidebar]
            tp-yt-paper-item.ytd-compact-link-renderer
                { padding-left: 24px !important ; padding-right: 24px !important }
        img#img.style-scope.yt-image-shadow { border-radius: 50px !important }
        #title.style-scope.ytd-feed-nudge-renderer { font-family: Roboto !important }
        yt-chip-cloud-chip-renderer.style-scope.ytd-feed-nudge-renderer { border-radius: 50px !important }
        div#label-container.style-scope.ytd-thumbnail-overlay-toggle-button-renderer {
            border: 2px !important ; text-transform: uppercase !important }
        ytd-thumbnail-overlay-time-status-renderer.style-scope.ytd-thumbnail { border-radius: 2px !important }
        ytd-backstage-post-dialog-renderer { border-radius: 2px !important }
        yt-bubble-hint-renderer { border-radius: 2px !important }
        #top-row.ytd-watch-metadata > div#actions.item.style-scope.ytd-watch-metadata
            > div#actions-inner.style-scope.ytd-watch-metadata > div#menu.style-scope.ytd-watch-metadata
            > ytd-menu-renderer.style-scope.ytd-watch-metadata
            > div#top-level-buttons-computed.top-level-buttons.style-scope.ytd-menu-renderer > ytd-button-renderer,
        #top-row.ytd-watch-metadata > div#actions.item.style-scope.ytd-watch-metadata
            > div#actions-inner.style-scope.ytd-watch-metadata > div#menu.style-scope.ytd-watch-metadata
            > ytd-menu-renderer.style-scope.ytd-watch-metadata > div#flexible-item-buttons.style-scope.ytd-menu-renderer
            > ytd-button-renderer,
        #top-row.ytd-watch-metadata > div#actions.item.style-scope.ytd-watch-metadata
            > div#actions-inner.style-scope.ytd-watch-metadata > div#menu.style-scope.ytd-watch-metadata
            > ytd-menu-renderer.style-scope.ytd-watch-metadata
            > div#top-level-buttons-computed.top-level-buttons.style-scope.ytd-menu-renderer
            > ytd-segmented-like-dislike-button-renderer.style-scope.ytd-menu-renderer
            > yt-smartimation.style-scope.ytd-segmented-like-dislike-button-renderer
            > div#segmented-buttons-wrapper.style-scope.ytd-segmented-like-dislike-button-renderer
            > div#segmented-like-button.style-scope.ytd-segmented-like-dislike-button-renderer
            > ytd-toggle-button-renderer
                { text-transform: capitalize !important }
        #top-row.ytd-watch-metadata > div#actions.item.style-scope.ytd-watch-metadata
            > div#actions-inner.style-scope.ytd-watch-metadata > div#menu.style-scope.ytd-watch-metadata
            > ytd-menu-renderer.style-scope.ytd-watch-metadata
            > div#top-level-buttons-computed.top-level-buttons.style-scope.ytd-menu-renderer
            > ytd-segmented-like-dislike-button-renderer.style-scope.ytd-menu-renderer
            > yt-smartimation.style-scope.ytd-segmented-like-dislike-button-renderer
            > div#segmented-buttons-wrapper.style-scope.ytd-segmented-like-dislike-button-renderer
            > div#segmented-dislike-button.style-scope.ytd-segmented-like-dislike-button-renderer
            > ytd-toggle-button-renderer.style-scope.ytd-segmented-like-dislike-button-renderer.style-text
            > a.yt-simple-endpoint.style-scope.ytd-toggle-button-renderer
            > yt-icon-button#button.yt-simple-endpoint.style-scope.ytd-toggle-button-renderer
            > button#button.style-scope.yt-icon-button
                { width: 24px !important ; height: 24px !important }
        #top-row.ytd-watch-metadata > div#actions.item.style-scope.ytd-watch-metadata
            > div#actions-inner.style-scope.ytd-watch-metadata > div#menu.style-scope.ytd-watch-metadata
            > ytd-menu-renderer.style-scope.ytd-watch-metadata
            > div#top-level-buttons-computed.top-level-buttons.style-scope.ytd-menu-renderer
            > ytd-segmented-like-dislike-button-renderer.style-scope.ytd-menu-renderer
            > yt-smartimation.style-scope.ytd-segmented-like-dislike-button-renderer
            > div#segmented-buttons-wrapper.style-scope.ytd-segmented-like-dislike-button-renderer
            > div#segmented-dislike-button.style-scope.ytd-segmented-like-dislike-button-renderer
            > ytd-toggle-button-renderer.style-scope.ytd-segmented-like-dislike-button-renderer.style-text
            > a.yt-simple-endpoint.style-scope.ytd-toggle-button-renderer
            > yt-icon-button#button.yt-simple-endpoint.style-scope.ytd-toggle-button-renderer
                { padding: 6px !important }
        ytd-watch-metadata[modern-metapanel] #description.ytd-watch-metadata, #description.ytd-watch-metadata {
            background-color: transparent !important ; border-radius: 0px !important }
        ytd-watch-metadata[modern-metapanel] #description-inner.ytd-watch-metadata,
            #description-inner.ytd-watch-metadata
                { margin: 0px !important }
        ytd-watch-metadata[modern-metapanel-order] #comment-teaser.ytd-watch-metadata,
            #comment-teaser.ytd-watch-metadata
                { border: 1px solid var(--yt-spec-10-percent-layer) !important ; border-radius: 4px !important }
        ytd-comments-entry-point-header-renderer[modern-metapanel], #comment-teaser.ytd-watch-metadata {
            background-color: transparent !important }
        div#title.text-shell.skeleton-bg-color { border-radius: 2px !important }
        div#count.text-shell.skeleton-bg-color { border-radius: 2px !important }
        div#owner-name.text-shell.skeleton-bg-color { border-radius: 2px !important }
        div#published-date.text-shell.skeleton-bg-color { border-radius: 2px !important }
        div#subscribe-button.skeleton-bg-color { border-radius: 4px !important }
        div.rich-thumbnail.skeleton-bg-color { border-radius: 0px !important }    
        div.rich-video-title.text-shell.skeleton-bg-color { border-radius: 2px !important }
        div.rich-video-meta.text-shell.skeleton-bg-color { border-radius: 2px !important }
        ytd-video-view-count-renderer { font-size: 1.4rem !important }
        #meta #avatar { width: 48px ; height: 48px ; margin-right: 16px }
        #meta #avatar img { width: 100% }
        #channel-name.ytd-video-owner-renderer { font-size: 1.4rem !important }
        #info.ytd-video-primary-info-renderer { height: 40px !important }
        ytd-merch-shelf-renderer { background-color: transparent !important }
        div#clarify-box.attached-message.style-scope.ytd-watch-flexy { margin-top: 0px !important }
        ytd-clarification-renderer.style-scope:where(.ytd-item-section-renderer, .ytd-watch-flexy) {
        border: 1px solid !important ; border-color: #0000001a !important ; border-radius: 0px !important }    
        yt-formatted-string.description.style-scope.ytd-clarification-renderer { font-size: 1.4rem !important }
        div.content-title.style-scope.ytd-clarification-renderer { padding-bottom: 4px !important }
        ytd-rich-metadata-renderer[rounded] { border-radius: 0px !important }
        ytd-live-chat-frame[rounded-container],
            ytd-live-chat-frame[rounded-container]
                #show-hide-button.ytd-live-chat-frame ytd-toggle-button-renderer.ytd-live-chat-frame,
            iframe.style-scope.ytd-live-chat-frame
                { border-radius: 0px !important }
        ytd-toggle-button-renderer.style-scope.ytd-live-chat-frame,
            yt-live-chat-header-renderer.style-scope.yt-live-chat-renderer
                { background: var(--yt-spec-brand-background-solid) !important }
        ytd-toggle-button-renderer.style-scope.ytd-live-chat-frame
            > a.yt-simple-endpoint.style-scope.ytd-toggle-button-renderer
            > tp-yt-paper-button.style-scope.ytd-toggle-button-renderer
                { padding-top: 4px !important ; padding-bottom: 4px !important }
        ytd-playlist-panel-renderer[modern-panels]:not([within-miniplayer]) #container.ytd-playlist-panel-renderer,
            ytd-tvfilm-offer-module-renderer[modern-panels], ytd-donation-shelf-renderer.style-scope.ytd-watch-flexy
                { border-radius: 0px !important }
        ytd-playlist-panel-renderer[modern-panels]:not([hide-header-text]) .title.ytd-playlist-panel-renderer {
            font-family: Roboto !important ; font-size: 1.4rem !important ; line-height: 2rem !important ;
            font-weight: 500 !important
        }    
        ytd-tvfilm-offer-module-renderer[modern-panels] #header.ytd-tvfilm-offer-module-renderer {
            border-radius: 0px !important ; font-family: Roboto !important ; font-size: 1.6rem !important ;
            line-height: 2.2rem !important ; font-weight: 400 !important
        }    
        ytd-donation-shelf-renderer[modern-panels] #header-text.ytd-donation-shelf-renderer {
            font-family: Roboto !important ; font-size: 1.6rem !important ; font-weight: 500 !important }
        ytd-universal-watch-card-renderer[rounded] #header.ytd-universal-watch-card-renderer,
            ytd-universal-watch-card-renderer[rounded] #hero.ytd-universal-watch-card-renderer
                { border-radius: 0px !important }
        ytd-player { border-radius: 0 !important } /* square player */
        .ytp-flyout-cta .ytp-flyout-cta-action-button.ytp-flyout-cta-action-button-rounded {
            font-family: Arial !important ; background: #167ac6 !important ;
            border: solid 1px transparent !important ; border-color: #167ac6 !important ;
            border-radius: 2px !important ; box-shadow: 0 1px 0 rgba(0,0,0,.05) !important ;
            font-size: 11px !important ; font-weight: 500 !important ; height: 28px !important ;
            margin: 0 8px 0 0 !important ; max-width: 140px !important ; padding: 0 10px !important
        }    
        .ytp-ad-action-interstitial-action-button.ytp-ad-action-interstitial-action-button-rounded {
            background-color: #167ac6 !important ; border: none !important ; border-radius: 2px ;
            font-family: Roboto !important ; font-size: 23px !important ; height: 46px !important ;
            line-height: 46px !important ; min-width: 164px !important ; padding: 0 20px !important
        }    
        .ytp-settings-menu { border-radius: 2px !important }
        .ytp-sb-subscribe {
            border-radius: 2px !important ; background-color: #f00 !important ; color: #fff !important ;
            text-transform: uppercase !important
        }    
        .ytp-sb-unsubscribe {
            border-radius: 2px !important ; background-color: #eee !important ; color: #606060 !important ;
            text-transform: uppercase !important
        }    
        .ytp-sb-subscribe.ytp-sb-disabled { background-color: #f3908b !important }
        .branding-context-container-inner.ytp-rounded-branding-context { border-radius: 2px !important }
        .ytp-tooltip.ytp-rounded-tooltip:not(.ytp-preview) .ytp-tooltip-text { border-radius: 2px !important }
        .ytp-autonav-endscreen-upnext-button.ytp-autonav-endscreen-upnext-button-rounded {
            border-radius: 2px !important }
        .ytp-ad-overlay-container.ytp-rounded-overlay-ad .ytp-ad-overlay-image img,
            .ytp-ad-overlay-container.ytp-rounded-overlay-ad .ytp-ad-text-overlay,
            .ytp-ad-overlay-container.ytp-rounded-overlay-ad .ytp-ad-enhanced-overlay
                { border-radius: 0 !important }
        .ytp-videowall-still-image { border-radius: 0 !important }
        div.iv-card.iv-card-video.ytp-rounded-info { border-radius: 0 !important}
        div.iv-card.iv-card-playlist.ytp-rounded-info { border-radius: 0 !important }
        div.iv-card.iv-card-channel.ytp-rounded-info { border-radius: 0 !important }
        div.iv-card.ytp-rounded-info { border-radius: 0 !important }
        .ytp-tooltip.ytp-rounded-tooltip.ytp-text-detail.ytp-preview,
            .ytp-tooltip.ytp-rounded-tooltip.ytp-text-detail.ytp-preview .ytp-tooltip-bg
                { border-radius: 2px !important }
        .ytp-ce-video.ytp-ce-medium-round, .ytp-ce-playlist.ytp-ce-medium-round,
            .ytp-ce-medium-round .ytp-ce-expanding-overlay-background
                { border-radius: 0 !important }
        .ytp-autonav-endscreen-upnext-thumbnail { border-radius: 0 !important }
        @font-face {
            font-family: no-parens ;
            src: url("data:application/x-font-woff;base64,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");;
            unicode-range: U+0028, U+0029
        }
        span.ytp-menu-label-secondary { font-family: "no-parens", "Roboto", sans-serif }
        .ytp-swatch-color-white { color: #f00 !important }
        .iv-card { border-radius: 0 !important }
        .iv-branding .branding-context-container-inner { border-radius: 2px !important }
        .ytp-offline-slate-bar { border-radius: 2px !important }
        .ytp-offline-slate-button { border-radius: 2px !important }
        .ytp-ce-video.ytp-ce-large-round, .ytp-ce-playlist.ytp-ce-large-round,
            .ytp-ce-large-round .ytp-ce-expanding-overlay-background
                { border-radius: 0 !important }
        .ytp-flyout-cta .ytp-flyout-cta-icon.ytp-flyout-cta-icon-rounded { border-radius: 0 !important }
        .ytp-player-minimized .html5-main-video, .ytp-player-minimized .ytp-miniplayer-scrim,
            .ytp-player-minimized.html5-video-player
                { border-radius: 0 !important }
        ytd-miniplayer #player-container.ytd-miniplayer,
            ytd-miniplayer #video-container.ytd-miniplayer .video.ytd-miniplayer,
            ytd-miniplayer #card.ytd-miniplayer, ytd-miniplayer
                { border-radius: 0 !important }
        ytd-channel-video-player-renderer[rounded] #player.ytd-channel-video-player-renderer {
            border-radius: 0 !important }
        .ytp-tooltip.ytp-rounded-tooltip.ytp-preview:not(.ytp-text-detail),
            .ytp-tooltip.ytp-rounded-tooltip.ytp-preview:not(.ytp-text-detail) .ytp-tooltip-bg
                { border-radius: 2px !important }
        #movie_player > div.ytp-promotooltip-wrapper > div.ytp-promotooltip-container { border-radius: 2px !important }
        .ytp-fine-scrubbing-container { display: none !important }
        .ytp-progress-bar, .ytp-heat-map-container, .ytp-fine-scrubbing-container {
            transform: translateY(0) !important }
        .ytp-chrome-bottom { height: auto !important }
        .ytp-tooltip-edu { display: none !important }

        /* Subscribe button fixes + Old compact channel header UI and non-amsterdam playlists */
        #buttons.ytd-c4-tabbed-header-renderer { flex-direction: row-reverse !important }

        yt-button-shape.style-scope.ytd-subscribe-button-renderer { display: flex !important }
        #subscribe-button ytd-subscribe-button-renderer button {
            height: 37px !important ; letter-spacing: 0.5px !important ; border-radius: 2px !important ;
            text-transform: uppercase !important
        }
        .yt-spec-button-shape-next--mono.yt-spec-button-shape-next--filled {
            color: #fff !important ; background: var(--yt-spec-brand-button-background) !important ;
            border-radius: 2px !important ; text-transform: uppercase !important ; letter-spacing: 0.5px !important
        }    
        button.yt-spec-button-shape-next.yt-spec-button-shape-next--tonal.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--size-m {
            height: 37px !important ; letter-spacing: 0.5px !important ; border-radius: 2px !important ;
            text-transform: uppercase !important
        }    
        #subscribe-button ytd-subscribe-button-renderer button.yt-spec-button-shape-next--tonal {
            background-color: var(--yt-spec-badge-chip-background) !important ;
            color: var(--yt-spec-text-secondary) !important
        }    
        button.yt-spec-button-shape-next.yt-spec-button-shape-next--tonal.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--size-s {
            background-color: var(--yt-spec-badge-chip-background) !important ;
            color: var(--yt-spec-text-secondary) !important ; height: 25px !important ; letter-spacing: 0.5px !important ;
            border-radius: 2px !important ; text-transform: uppercase !important
        }    
        div#notification-preference-button.style-scope.ytd-subscribe-button-renderer
            > ytd-subscription-notification-toggle-button-renderer-next.style-scope.ytd-subscribe-button-renderer
            > yt-button-shape > .yt-spec-button-shape-next--size-m
        {
            background-color: transparent !important ; border-radius: 16px !important ; padding-left: 14px !important ;
            padding-right: 2px !important ; margin-left: 4px !important
        }
        div#notification-preference-button.style-scope.ytd-subscribe-button-renderer
            > ytd-subscription-notification-toggle-button-renderer-next.style-scope.ytd-subscribe-button-renderer
            > yt-button-shape > .yt-spec-button-shape-next--size-m
            > div.cbox.yt-spec-button-shape-next--button-text-content,
        div#notification-preference-button.style-scope.ytd-subscribe-button-renderer
            > ytd-subscription-notification-toggle-button-renderer-next.style-scope.ytd-subscribe-button-renderer
            > yt-button-shape > .yt-spec-button-shape-next--size-m > div.yt-spec-button-shape-next__secondary-icon,
        button.yt-spec-button-shape-next.yt-spec-button-shape-next--tonal.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--size-m.yt-spec-button-shape-next--icon-leading-trailing
            > div.yt-spec-button-shape-next__button-text-content
                { display: none !important }
        #notification-preference-toggle-button:not([hidden])
            + yt-animated-action #notification-preference-button.ytd-subscribe-button-renderer[invisible],
        #subscribe-button-shape.ytd-subscribe-button-renderer[invisible]
                { pointer-events: auto ; visibility: visible ; position: static }
        yt-smartimation.ytd-subscribe-button-renderer, .smartimation__content > __slot-el { display: flex !important }
        ytd-channel-tagline-renderer { display: none !important }
        #avatar.ytd-c4-tabbed-header-renderer {
            width: 80px !important ; height: 80px !important ; margin: 0 24px 0 0 !important ; flex: none !important ;
            overflow: hidden !important
        }    
        #avatar-editor.ytd-c4-tabbed-header-renderer { --ytd-channel-avatar-editor-size: 80px !important }
        #channel-name.ytd-c4-tabbed-header-renderer { margin-bottom: 0 !important }
        #channel-header-container.ytd-c4-tabbed-header-renderer {
            padding-top: 0 !important ; align-items: center !important }
        #inner-header-container.ytd-c4-tabbed-header-renderer {
            margin-top: 0 !important ; align-items: center !important }
        yt-formatted-string#channel-handle.style-scope.ytd-c4-tabbed-header-renderer { display: none !important }
        ytd-c4-tabbed-header-renderer[use-page-header-style] #channel-pronouns.ytd-c4-tabbed-header-renderer,
            yt-formatted-string#channel-pronouns.style-scope.ytd-c4-tabbed-header-renderer 
                { display: none !important }
        #videos-count { display: none !important }
        .meta-item.ytd-c4-tabbed-header-renderer { display: block !important }
        div#channel-header-links.style-scope.ytd-c4-tabbed-header-renderer { display: none !important }
        ytd-c4-tabbed-header-renderer[use-page-header-style] #channel-name.ytd-c4-tabbed-header-renderer {
            font-size: 2.4em !important ; font-weight: 400 !important ;
            line-height: var(--yt-channel-title-line-height, 3rem) !important
        }    
        span.delimiter.style-scope.ytd-c4-tabbed-header-renderer { display: none !important }
        div#meta.style-scope.ytd-c4-tabbed-header-renderer { width: auto !important }
        ytd-c4-tabbed-header-renderer[use-page-header-style] #inner-header-container.ytd-c4-tabbed-header-renderer {
        flex-direction: row !important }
        div.page-header-banner.style-scope.ytd-c4-tabbed-header-renderer {
            margin-left: 0px !important ; margin-right: 0px !important ; border-radius: 0px !important }
        ytd-c4-tabbed-header-renderer[use-page-header-style] .page-header-banner.ytd-c4-tabbed-header-renderer {
            border-radius: 0px !important }
        ytd-browse[darker-dark-theme][page-subtype="playlist"], ytd-browse[darker-dark-theme][page-subtype="show"] {
            background-color: var(--yt-spec-general-background-b) !important}
        ytd-two-column-browse-results-renderer.ytd-browse[background-refresh] {
            background-color: var(--yt-spec-general-background-b) !important }
        .yt-sans-20.yt-dynamic-sizing-formatted-string, .yt-sans-22.yt-dynamic-sizing-formatted-string,
            .yt-sans-24.yt-dynamic-sizing-formatted-string, .yt-sans-28.yt-dynamic-sizing-formatted-string,
            yt-text-input-form-field-renderer[component-style="INLINE_FORM_STYLE_TITLE"][amsterdam]
                tp-yt-paper-input.yt-text-input-form-field-renderer .input-content.tp-yt-paper-input-container > input
        {
            font-family: "Roboto", "Arial", sans-serif !important ; font-size: 2.4rem !important ;
            line-height: 3.2rem !important ; font-weight: 400 !important
        }
        ytd-browse[page-subtype=playlist][amsterdam] { padding-top: 0 !important }
        ytd-browse[page-subtype=playlist][amsterdam] ytd-playlist-header-renderer.ytd-browse {
            margin-left: 0 !important ; height: calc(100vh - var(--ytd-toolbar-height)) !important }
        .immersive-header-container.ytd-playlist-header-renderer {
            margin-bottom: 0 !important ; border-radius: 0 !important }
        .image-wrapper.ytd-hero-playlist-thumbnail-renderer { border-radius: 0 !important }
        ytd-playlist-header-renderer,
            yt-formatted-string[has-link-only_]:not([force-default-style])
                a.yt-simple-endpoint.yt-formatted-string:visited,
            .metadata-stats.ytd-playlist-byline-renderer,
            .yt-spec-button-shape-next--overlay.yt-spec-button-shape-next--text,
            ytd-text-inline-expander.ytd-playlist-header-renderer
        {
            color: var(--yt-spec-text-primary) !important ;
          --ytd-text-inline-expander-button-color: var(--yt-spec-text-primary) !important
        }
        ytd-dropdown-renderer[no-underline] tp-yt-paper-dropdown-menu-light
            .tp-yt-paper-dropdown-menu-light[style-target=input],
        tp-yt-iron-icon.tp-yt-paper-dropdown-menu-light
                { color: var(--yt-spec-text-primary) !important }
        .yt-spec-button-shape-next--overlay.yt-spec-button-shape-next--tonal,
        .yt-spec-button-shape-next--overlay.yt-spec-button-shape-next--filled {
            background: transparent !important ; color: var(--yt-spec-text-primary) !important ;
            border-radius: 2px !important ; text-transform: uppercase
        }    
        .metadata-text-wrapper.ytd-playlist-header-renderer {
          --yt-endpoint-color: var(--yt-spec-text-primary) !important ;
          --yt-endpoint-hover-color: var(--yt-spec-text-primary) !important
        }    
        div.immersive-header-background-wrapper.style-scope.ytd-playlist-header-renderer > div {
            background: var(--yt-spec-general-background-a) !important }
        #contents > ytd-playlist-video-list-renderer {
            background: var(--yt-spec-general-background-b) !important ; margin-right: 0px !important }
        ytd-browse[page-subtype=playlist][amsterdam] #alerts.ytd-browse {
            padding-left: 388px !important ; padding-right: 0px !important ; margin-bottom: 0 !important }
        ytd-alert-with-button-renderer[type=INFO], ytd-alert-with-button-renderer[type=SUCCESS] {
            background: var(--yt-spec-general-background-a) !important }
        .yt-spec-button-shape-next--overlay.yt-spec-button-shape-next--tonal {
            background: var(--yt-spec-base-background) }
        iron-input.tp-yt-paper-input > input.tp-yt-paper-input, textarea.tp-yt-iron-autogrow-textarea {
            color: var(--yt-spec-text-primary) !important }
        #labelAndInputContainer.tp-yt-paper-input-container :where(> label, > .paper-input-label) {
            color: var(--yt-spec-text-secondary) }
        .unfocused-line.tp-yt-paper-input-container, .focused-line.tp-yt-paper-input-container {
            border-bottom-color: var(--yt-spec-text-primary) !important }
        [page-subtype="history"] #channel-header.ytd-tabbed-page-header {
            background-color: var(--yt-spec-general-background-a) !important ; padding-top: 0 !important ;
            padding-bottom: 0 !important
        }
        .page-header-view-model-wiz__page-header-title--page-header-title-large {
            margin-top: 24px !important ; margin-bottom: 8px !important ;
            color: var(--yt-spec-text-primary) !important ;
            font-size: 1.6em !important ; line-height: 1.4em !important ; font-weight: 500 !important
        }    
        #endpoint.yt-simple-endpoint.ytd-guide-entry-renderer.style-scope[title="Trending"] { display: none !important }
        #endpoint.yt-simple-endpoint.ytd-guide-entry-renderer.style-scope[title="Podcasts"] { display: none !important }
        ytd-guide-entry-renderer > a[href*="/channel/UCkYQyvc_i9hXEo4xic9Hh2g"] { display: none !important }
        .yt-tab-shape-wiz { padding: 0 32px !important ; margin-right: 0 !important }
        .yt-tab-shape-wiz__tab {
            font-size: 14px !important ; font-weight: 500 !important ;
            letter-spacing: var(--ytd-tab-system-letter-spacing) !important ; text-transform: uppercase !important
        }    
        .yt-tab-group-shape-wiz__slider { display: none !important }
        .yt-tab-shape-wiz__tab-bar { display: none !important }
        yt-formatted-string.style-scope.yt-chip-cloud-chip-renderer, span.style-scope.ytd-rich-shelf-renderer {
            font-weight: 400 !important }
        span.style-scope.ytd-shelf-renderer, ytd-reel-shelf-renderer[modern-typography] #title.ytd-reel-shelf-renderer {
            font-size: 1.6rem !important ; font-weight: 500 !important }
        .count-text.ytd-comments-header-renderer {
            font-size: 1.6rem !important ; line-height: 2.2rem !important ; font-weight: 400 !important }
        ytd-item-section-renderer.style-scope.ytd-watch-next-secondary-results-renderer
            > div#contents.style-scope.ytd-item-section-renderer
            > ytd-reel-shelf-renderer.style-scope.ytd-item-section-renderer,
        ytd-reel-shelf-renderer.ytd-structured-description-content-renderer
                { display: none !important }
        ytd-video-description-infocards-section-renderer.style-scope.ytd-structured-description-content-renderer
            > #header.ytd-video-description-infocards-section-renderer,
        ytd-video-description-infocards-section-renderer.style-scope.ytd-structured-description-content-renderer
            > #action-buttons.ytd-video-description-infocards-section-renderer
                { display: none !important }
        ytd-video-description-infocards-section-renderer.style-scope.ytd-structured-description-content-renderer {
            border-top: 0px !important }
        button.ytp-button.ytp-jump-button.ytp-jump-button-enabled {display: none !important}
        ytd-player#ytd-player.style-scope.ytd-watch-flexy > div#container.style-scope.ytd-player > .html5-video-player
            > div.ytp-chrome-bottom > div.ytp-chrome-controls > div.ytp-left-controls > a.ytp-next-button.ytp-button\
                { display: block !important }    
        div#chip-bar.style-scope.ytd-search-header-renderer
            > yt-chip-cloud-renderer.style-scope.ytd-search-header-renderer
            > div#container.style-scope.yt-chip-cloud-renderer
                { display: none !important }
        #play.ytd-moving-thumbnail-renderer { color: #fff !important }
        
        /* Subscribe button */
        #subscribe-button ytd-subscribe-button-renderer button.yt-spec-button-shape-next--filled {
            background-color: #cc0000 !important ; color: #fff !important ; border-radius: 2px !important ;
            text-transform: uppercase !important ; font-weight: 500 !important ; letter-spacing: 0.5px !important
        }
        #subscribe-button ytd-subscribe-button-renderer button.yt-spec-button-shape-next--tonal {
            background-color: #f2f2f2 !important ; color: #606060 !important ; border-radius: 2px !important ;
            text-transform: uppercase !important ; font-weight: 500 !important ; letter-spacing: 0.5px !important
        }
        #subscribe-button ytd-subscribe-button-renderer button.yt-spec-button-shape-next--tonal:hover {
            background-color: #e5e5e5 !important }
        yt-smartimation.ytd-subscribe-button-renderer, .smartimation__content { display: flex !important }
        #notification-preference-button.ytd-subscribe-button-renderer { margin-left: 4px !important }
        #notification-preference-button.ytd-subscribe-button-renderer button { border-radius: 16px !important }

        /* Hide Edit your custom feed chip */
        yt-chip-cloud-chip-renderer:has(path[d^="M5 0a5 5"]) { display: none }
    `)}
    dom.get.loadedElem('head').then(() => document.head.append(app.styles.fixes))

    Object.defineProperties(document, {
        'hidden': {value: false}, 'webkitHidden': {value: false}, 'visibilityState': {value: 'visible'},
        'webkitVisibilityState': {value: 'visible'}
    })

    setInterval(() => document.dispatchEvent(new KeyboardEvent('keyup', {
        bubbles: true, cancelable: true, keyCode: 143, which: 143 })), 60000)

    // CONFIG hacks

    let locationPath = location.pathname // to track nav
    const obsConfig = { childList: true, subtree: true }

    // Redirect Shorts to classic player
    if (app.config.disableShorts) checkShortsToRedir()
    function checkShortsToRedir() {
        if (location.pathname.startsWith('/shorts/'))
            return location.replace(`https://www.youtube.com/watch?v=${location.pathname.split('/')[2]}`)
        checkShortsToRedir.id = requestAnimationFrame(checkShortsToRedir)
    }

    // Remove homepage ads/rich sections
    const homeObserver = new MutationObserver(() => {
        if (location.pathname != locationPath) { // nav'd to diff page, re-observe
            locationPath = location.pathname ; homeObserver.disconnect()
            dom.get.loadedElem('html').then(() => homeObserver.observe(document.documentElement, obsConfig))
        } else if (locationPath == '/') { // remove regenerating homepage stuff
            if (app.config.adBlock) // remove ads
                document.querySelector('ytd-ad-slot-renderer')?.closest('[rendered-from-rich-grid]')?.remove()
            if (app.config.shortsBlock || app.config.playablesBlock) // remove shelves
                document.querySelector(`ytd-rich-section-renderer${
                    !app.config.shortsBlock ? ':not(:has(a[href*="/shorts/"]))' : '' }${
                    !app.config.playablesBlock ? ':not(:has(a[href*="/playables/"]))' : '' }`
                )?.remove()
        }
    })
    dom.get.loadedElem('html').then(() => homeObserver.observe(document.documentElement, obsConfig))

    // Set/update subscribe button pos
    dom.get.loadedElem('ytd-subscribe-button-renderer button').then(subBtn => {
        requestAnimationFrame(updateSubBtnPos)
        new MutationObserver(updateSubBtnPos).observe(subBtn, { childList: true, subtree: true })
        window.addEventListener('resize', updateSubBtnPos)
    })
    function updateSubBtnPos() {
        if (updateSubBtnPos.timeout) clearTimeout(updateSubBtnPos.timeout)
        updateSubBtnPos.timeout = setTimeout(async () => {
            const primaryDiv = await dom.get.loadedElem('div#primary'),
                  actionsDiv = await dom.get.loadedElem('div#actions'),
                  subBtn = await dom.get.loadedElem('div#subscribe-button'),
                  bellIcon = await dom.get.loadedElem('[animated-icon-type=NOTIFICATION_BELL] svg'),
                  bellWidth = parseInt(getComputedStyle(bellIcon).width),
                  primaryWidth = parseInt(getComputedStyle(primaryDiv).width),
                  idealActionsRpadding = primaryWidth < 768 ? '' : `${ 125 +( bellWidth == 100 ? 0 : bellWidth )}px`
            Object.assign(subBtn.style,
                primaryWidth > 768 ? { position: 'absolute', right: 0 } : { position: '', right: '' })
            if (getComputedStyle(actionsDiv).paddingRight != idealActionsRpadding)
                actionsDiv.style.paddingRight = idealActionsRpadding
        }, 50)
    }

    // Block stuff
    document.head.append(app.styles.config ??= dom.create.style())
    app.styles.config.textContent = Object.entries(app.selectors.site).map(([key, selectors]) =>
        !app.config[`${key}Block`] ? '' : `${css.selectors.extract(selectors).join(',')} { display: none }`).join('')
})()
