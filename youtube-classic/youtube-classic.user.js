// ==UserScript==
// @name          YouTube™ Classic 📺 — (Remove rounded design + Return YouTube dislikes)
// @version       2024.10.29.5
// @author        Adam Lui, Magma_Craft, Anarios, JRWR, Fuim & hoothin
// @namespace     https://github.com/adamlui
// @description   Reverts YouTube to its classic design (before all the rounded corners & hidden dislikes) + redirects YouTube Shorts
// @license       MIT
// @icon          https://media.ytclassic.com/images/icon48.png
// @icon64        https://media.ytclassic.com/images/icon64.png
// @compatible    chrome
// @compatible    firefox
// @compatible    opera
// @compatible    safari
// @compatible    edge
// @match         *://*.youtube.com/*
// @grant         GM_registerMenuCommand
// @grant         GM_unregisterMenuCommand
// @grant         GM_getValue
// @grant         GM_setValue
// @run-at        document-start
// @downloadURL   https://update.greasyfork.org/scripts/456132/youtube-classic.user.js
// @updateURL     https://update.greasyfork.org/scripts/456132/youtube-classic.meta.js
// @homepageURL   https://www.ytclassic.com
// @supportURL    https://support.ytclassic.com
// ==/UserScript==

(() => {

    // Define FUNCTIONS

    function loadSetting(...keys) { keys.forEach(key => { config[key] = GM_getValue(config.prefix + '_' + key, false) })}
    function saveSetting(key, value) { GM_setValue(config.prefix + '_' + key, value) ; config[key] = value }
    function getUserscriptManager() { try { return GM_info.scriptHandler } catch (error) { return 'other' }}
    function registerMenu() {
        const menuIDs = [] // to store registered commands for removal while preserving order
        const state = {
            symbol: ['✔️', '❌'], word: ['ON', 'OFF'],
            separator: getUserscriptManager() === 'Tampermonkey' ? ' — ' : ': ' }

        // Add command to toggle Shorts redirect
        const rsLabel = state.symbol[+!config.disableShorts] + ' Redirect Shorts '
                      + state.separator + state.word[+!config.disableShorts]
        menuIDs.push(GM_registerMenuCommand(rsLabel, () => {
            saveSetting('disableShorts', !config.disableShorts)
            for (const id of menuIDs) { GM_unregisterMenuCommand(id) } registerMenu() // refresh menu
            if (unsafeWindow.location.href.match(/shorts\/.+/))
                unsafeWindow.location.replace(unsafeWindow.location.toString().replace('/shorts/', '/watch?v='))
        }))
    }

    // Run MAIN routine

    const config = { prefix: 'ytClassic' }
    loadSetting('disableShorts')
    registerMenu()

    // Redirect Shorts
    if (config.disableShorts) {
        var oldHref = location.href;
        if (unsafeWindow.location.href.match(/shorts\/.+/))
            unsafeWindow.location.replace(unsafeWindow.location.toString().replace('/shorts/', '/watch?v='))
        unsafeWindow.onload = () => {
            var bodyList = document.querySelector('body')
            var observer = new MutationObserver(function(mutations) {
                mutations.forEach(function() {
                    if (oldHref != location.href) {
                        oldHref = location.href
                        if (unsafeWindow.location.href.match(/shorts\/.+/))
                            unsafeWindow.location.replace(unsafeWindow.location.toString().replace('/shorts/', '/watch?v='))
            }})})
            var config = { childList: true, subtree: true }
            observer.observe(bodyList, config);
        }
    }

    // Config keys
    const CONFIGS = { BUTTON_REWORK: false }

    // Experiment flags
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
        web_modern_subscribe: true,
        web_modern_tabs: false,
        web_rounded_containers: false,
        web_rounded_thumbnails: false,
        web_searchbar_style: 'default',
        web_segmented_like_dislike_button: false,
        web_sheets_ui_refresh: false,
        web_snackbar_ui_refresh: false,
        web_watch_rounded_player_large: false
    }

    // Player flags
    const PLYRFLAGS = {
        web_rounded_containers: 'false',
        web_rounded_thumbnails: 'false'
    }

    class YTP {
        static observer = new MutationObserver(this.onNewScript);
        static _config = {};
        static isObject(item) {
            return (item && typeof item === 'object' && !Array.isArray(item));
        }
        static mergeDeep(target, ...sources) {
            if (!sources.length) return target;
            const source = sources.shift();
            if (this.isObject(target) && this.isObject(source)) {
                for (const key in source) {
                    if (this.isObject(source[key])) {
                        if (!target[key]) Object.assign(target, { [key]: {} });
                        this.mergeDeep(target[key], source[key]);
                    } else {
                        Object.assign(target, { [key]: source[key] });
                    }
                }
            }
            return this.mergeDeep(target, ...sources);
        }
        static onNewScript(mutations) {
            for (var mut of mutations) {
                for (var node of mut.addedNodes) { // eslint-disable-line no-unused-vars
                    YTP.bruteforce();
                }
            }
        }
        static start() { this.observer.observe(document, {childList: true, subtree: true}); }
        static stop() { this.observer.disconnect(); }
        static bruteforce() {
            if (!unsafeWindow.yt) return;
            if (!unsafeWindow.yt.config_) return;
            this.mergeDeep(unsafeWindow.yt.config_, this._config);
        }
        static setCfg(name, value) { this._config[name] = value; }
        static setCfgMulti(configs) { this.mergeDeep(this._config, configs); }
        static setExp(name, value) {
            if (!('EXPERIMENT_FLAGS' in this._config)) this._config.EXPERIMENT_FLAGS = {};
            this._config.EXPERIMENT_FLAGS[name] = value;
        }
        static setExpMulti(exps) {
            if (!('EXPERIMENT_FLAGS' in this._config)) this._config.EXPERIMENT_FLAGS = {};
            this.mergeDeep(this._config.EXPERIMENT_FLAGS, exps);
        }
        static decodePlyrFlags(flags) {
            var obj = {},
                dflags = flags.split('&');
            for (var i = 0; i < dflags.length; i++) {
                var dflag = dflags[i].split('=');
                obj[dflag[0]] = dflag[1];
            }
            return obj;
        }
        static encodePlyrFlags(flags) {
            var keys = Object.keys(flags),
                response = '';
            for (var i = 0; i < keys.length; i++) {
                if (i > 0) { response += '&'; }
                response += keys[i] + '=' + flags[keys[i]];
            }
            return response;
        }
        static setPlyrFlags(flags) {
            if (!unsafeWindow.yt) return;
            if (!unsafeWindow.yt.config_) return;
            if (!unsafeWindow.yt.config_.WEB_PLAYER_CONTEXT_CONFIGS) return;
            var conCfgs = unsafeWindow.yt.config_.WEB_PLAYER_CONTEXT_CONFIGS;
            if (!('WEB_PLAYER_CONTEXT_CONFIGS' in this._config)) this._config.WEB_PLAYER_CONTEXT_CONFIGS = {};
            for (var cfg in conCfgs) {
                var dflags = this.decodePlyrFlags(conCfgs[cfg].serializedExperimentFlags);
                this.mergeDeep(dflags, flags);
                this._config.WEB_PLAYER_CONTEXT_CONFIGS[cfg] = {
                    serializedExperimentFlags: this.encodePlyrFlags(dflags)
                }
            }
        }
    }

    const ATTRS = [ // Attributes to remove from <html>
        'darker-dark-theme', 'darker-dark-theme-deprecate'
    ];
    unsafeWindow.addEventListener('yt-page-data-updated', function tmp() {
        const ytLogo = document.getElementById('logo-icon'),
              classicLogo = document.createElement('img')
        classicLogo.style.marginLeft = '5px' ; classicLogo.height = 65
        classicLogo.src = document.querySelector('ytd-masthead').getAttribute('dark') != null
            ? 'https://i.imgur.com/brCETJj.png' // Dark mode
            : 'https://i.imgur.com/rHLcxEs.png' // Light mode    
        ytLogo.textContent = '' ; ytLogo.append(classicLogo)
        YTP.stop()
        for (var i = 0; i < ATTRS.length; i++) { document.getElementsByTagName('html')[0].removeAttribute(ATTRS[i]) }
        unsafeWindow.removeEventListener('yt-page-date-updated', tmp)
    })

    YTP.start();
    YTP.setCfgMulti(CONFIGS);
    YTP.setExpMulti(EXPFLAGS);
    YTP.setPlyrFlags(PLYRFLAGS);

    function $(q) { return document.querySelector(q) }

    // Re-add 'Explore' tab in sidebar (it also replaces the 'Shorts' tab)
    function waitForElm(selector) {
        return new Promise(resolve => {
            if (document.querySelector(selector))
                return resolve(document.querySelector(selector))
            const observer = new MutationObserver(() => {
                if (document.querySelector(selector)) {
                    resolve(document.querySelector(selector))
                    observer.disconnect()
                }
            })
            observer.observe(document.documentElement, { childList: true, subtree: true })
        })
    }

    function restoreTrending() {
        var trendingData = {
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

    waitForElm('#items.ytd-guide-section-renderer').then(() => { restoreTrending() })
    waitForElm('#items.ytd-mini-guide-section-renderer').then(() => { restoreTrending() })

    // Fix YouTube dislikes
    addEventListener('yt-page-data-updated', function() {
        if(!location.pathname.startsWith('/watch')) return;
        var lds = $('ytd-video-primary-info-renderer div#top-level-buttons-computed');
        var like = $('ytd-video-primary-info-renderer div#segmented-like-button > ytd-toggle-button-renderer');
        var share = $('ytd-video-primary-info-renderer div#top-level-buttons-computed > ytd-segmented-like-dislike-button-renderer + ytd-button-renderer');
        lds.insertBefore(like, share);
        like.setAttribute('class', like.getAttribute('class').replace('ytd-segmented-like-dislike-button-renderer', 'ytd-menu-renderer force-icon-button'));
        like.removeAttribute('is-paper-button-with-icon');
        like.removeAttribute('is-paper-button');
        like.setAttribute('style-action-button', '');
        like.setAttribute('is-icon-button', '');
        like.querySelector('a').insertBefore(like.querySelector('yt-formatted-string'), like.querySelector('tp-yt-paper-tooltip'));
        try { like.querySelector('paper-ripple').remove(); } catch(e) {}
        var paper = like.querySelector('tp-yt-paper-button');
        paper.removeAttribute('style-target');
        paper.removeAttribute('animated');
        paper.removeAttribute('elevation');
        like.querySelector('a').insertBefore(paper.querySelector('yt-icon'), like.querySelector('yt-formatted-string'));
        paper.outerHTML = paper.outerHTML.replace('<tp-yt-paper-button ', '<yt-icon-button ').replace('</tp-yt-paper-button>', '</yt-icon-button>');
        paper = like.querySelector('yt-icon-button');
        paper.querySelector('button#button').appendChild(like.querySelector('yt-icon'));
        var dislike = $('ytd-video-primary-info-renderer div#segmented-dislike-button > ytd-toggle-button-renderer');
        lds.insertBefore(dislike, share);
        $('ytd-video-primary-info-renderer ytd-segmented-like-dislike-button-renderer').remove();
        dislike.setAttribute('class', dislike.getAttribute('class').replace('ytd-segmented-like-dislike-button-renderer', 'ytd-menu-renderer force-icon-button'));
        dislike.removeAttribute('has-no-text');
        dislike.setAttribute('style-action-button', '');
        var dlabel = document.createElement('yt-formatted-stringx');
        dlabel.setAttribute('id', 'text');
        if (dislike.getAttribute('class').includes('style-default-active')) {
            dlabel.setAttribute('class', dlabel.getAttribute('class').replace('style-default', 'style-default-active')) }
        dislike.querySelector('a').insertBefore(dlabel, dislike.querySelector('tp-yt-paper-tooltip'));
        $('ytd-video-primary-info-renderer').removeAttribute('flex-menu-enabled');
    });

    // Restore classic comments UI
    var hl;
    const cfconfig = { unicodeEmojis: false };
    const cfi18n = {
        en: {
            viewSingular: 'View reply',
            viewMulti: 'View %s replies',
            viewSingularOwner: 'View reply from %s',
            viewMultiOwner: 'View %s replies from %s and others',
            hideSingular: 'Hide reply',
            hideMulti: 'Hide replies',
            replyCountIsolator: /( REPLIES)|( REPLY)/
        }
    }
    function getString(string, hl = 'en', ...args) {
        if (!string) return;
        var str;
        if (cfi18n[hl]) {
            if (cfi18n[hl][string]) {
                str = cfi18n[hl][string];
            } else if (cfi18n.en[string]) {
                str = cfi18n.en[string];
            } else {
                return;
            }
        } else { if (cfi18n.en[string]) str = cfi18n.en[string]; }
        for (var i = 0; i < args.length; i++) {
            str = str.replace(/%s/, args[i]);
        }
        return str;
    }
    function getSimpleString(object) {
        if (object.simpleText) return object.simpleText;
        var str = '';
        for (var i = 0; i < object.runs.length; i++) {
            str += object.runs[i].text;
        }
        return str;
    }
    function formatComment(comment) {
        if (cfconfig.unicodeEmojis) {
            var runs;
            try {
                runs = comment.contentText.runs
                for (var i = 0; i < runs.length; i++) {
                    delete runs[i].emoji;
                    delete runs[i].loggingDirectives;
                }
            } catch(err) {}
        }
        return comment;
    }
    async function formatCommentThread(thread) {
        if (thread.comment.commentRenderer) {
            thread.comment.commentRenderer = formatComment(thread.comment.commentRenderer);
        }
        var replies;
        try {
            replies = thread.replies.commentRepliesRenderer;
            if (replies.viewRepliesIcon) {
                replies.viewReplies.buttonRenderer.icon = replies.viewRepliesIcon.buttonRenderer.icon;
                delete replies.viewRepliesIcon;
            }
            if (replies.hideRepliesIcon) {
                replies.hideReplies.buttonRenderer.icon = replies.hideRepliesIcon.buttonRenderer.icon;
                delete replies.hideRepliesIcon;
            }
            var creatorName;
            try {
                creatorName = replies.viewRepliesCreatorThumbnail.accessibility.accessibilityData.label;
                delete replies.viewRepliesCreatorThumbnail;
            } catch(err) {}
            var replyCount = getSimpleString(replies.viewReplies.buttonRenderer.text);
            replyCount = +replyCount.replace(getString('replyCountIsolator', hl), '');
            var viewMultiString = creatorName ? 'viewMultiOwner' : 'viewMulti';
            var viewSingleString = creatorName ? 'viewSingularOwner' : 'viewSingular';
            replies.viewReplies.buttonRenderer.text = {
                runs: [
                    {
                        text: (replyCount > 1) ? getString(viewMultiString, hl, replyCount, creatorName) : getString(viewSingleString, hl, creatorName)
                    }
                ]
            }
            replies.hideReplies.buttonRenderer.text = {
                runs: [{ text: (replyCount > 1) ? getString('hideMulti', hl) :  getString('hideSingular', hl) }]
            };
        } catch(err) {}
        return thread;
    }
    function refreshData(element) {
        var clone = element.cloneNode();
        clone.data = element.data;
        clone.data.fixedByCF = true;
        for (var i in element.properties) { clone[i] = element[i]; }
        element.insertAdjacentElement('afterend', clone);
        element.remove();
    }
    var commentObserver = new MutationObserver((list) => {
        list.forEach(async(mutation) => {
            if (mutation.addedNodes) {
                for (var i = 0; i < mutation.addedNodes.length; i++) {
                    var elm = mutation.addedNodes[i];
                    if (elm.classList && elm.data && !elm.data.fixedByCF) {
                        if (elm.tagName == 'YTD-COMMENT-THREAD-RENDERER') {
                            elm.data = await formatCommentThread(elm.data);
                            refreshData(elm);
                        } else if (elm.tagName == 'YTD-COMMENT-RENDERER') {
                            if (!elm.classList.contains('ytd-comment-thread-renderer')) {
                                elm.data = formatComment(elm.data);
                                refreshData(elm);
                            }
                        }
                    }
                }
            }
        });
    });
    document.addEventListener('yt-page-data-updated', async() => {
        commentObserver.observe(document.querySelector('ytd-app'),  { childList: true, subtree: true });
    });

    // CSS adjustments and UI fixes
    const fixesStyle = document.createElement('style')
    fixesStyle.innerText = `
    /* Revert old background color and buttons */
    html[dark] {
      --yt-spec-general-background-a: #181818 !important;
      --yt-spec-general-background-b: #0f0f0f !important;
      --yt-spec-brand-background-primary: rgba(33, 33, 33, 0.98) !important;
      --yt-spec-10-percent-layer: rgba(255, 255, 255, 0.1) !important;
    }
    
    html:not([dark]) {
      --yt-spec-general-background-a: #f9f9f9 !important;
      --yt-spec-general-background-b: #f1f1f1 !important;
      --yt-spec-brand-background-primary: rgba(255, 255, 255, 0.98) !important;
      --yt-spec-10-percent-layer: rgba(0, 0, 0, 0.1) !important;
    }
    
    ytd-masthead {
      background: var(--yt-spec-brand-background-solid) !important;
    }
    
    ytd-app {
      background: var(--yt-spec-general-background-a) !important;
    }
    
    ytd-browse[page-subtype="channels"] {
      background: var(--yt-spec-general-background-b) !important;
    }
    
    ytd-c4-tabbed-header-renderer {
      --yt-lightsource-section1-color: var(--yt-spec-general-background-a) !important;
    }
    
    ytd-mini-guide-renderer, ytd-mini-guide-entry-renderer {
      background-color: var(--yt-spec-brand-background-solid) !important;
    }
    
    #cinematics.ytd-watch-flexy {
      display: none !important;
    }
    
    #tabs-divider.ytd-c4-tabbed-header-renderer {
      border-bottom: 0px !important;
    }
    
    #header.ytd-rich-grid-renderer {
      width: 100% !important;
    }
    
    [page-subtype="home"] #chips-wrapper.ytd-feed-filter-chip-bar-renderer {
      background-color: var(--yt-spec-brand-background-primary) !important;
      border-top: 1px solid var(--yt-spec-10-percent-layer) !important;
      border-bottom: 1px solid var(--yt-spec-10-percent-layer) !important;
    }
    
    ytd-feed-filter-chip-bar-renderer[is-dark-theme] #left-arrow.ytd-feed-filter-chip-bar-renderer::after {
      background: linear-gradient(to right, var(--yt-spec-brand-background-primary) 20%, rgba(33, 33, 33, 0) 80%) !important;
    }
    
    ytd-feed-filter-chip-bar-renderer[is-dark-theme] #right-arrow.ytd-feed-filter-chip-bar-renderer::before {
      background: linear-gradient(to left, var(--yt-spec-brand-background-primary) 20%, rgba(33, 33, 33, 0) 80%) !important;
    }
    
    ytd-feed-filter-chip-bar-renderer #left-arrow-button.ytd-feed-filter-chip-bar-renderer,
    ytd-feed-filter-chip-bar-renderer #right-arrow-button.ytd-feed-filter-chip-bar-renderer {
      background-color: var(--yt-spec-brand-background-primary) !important;
    }
    
    yt-chip-cloud-renderer[is-dark-theme] #right-arrow.yt-chip-cloud-renderer::before {
      background: linear-gradient(to left, var(--ytd-chip-cloud-background, var(--yt-spec-general-background-a)) 10%, rgba(24, 24, 24, 0) 90%) !important;
    }
    
    yt-chip-cloud-renderer #left-arrow-button.yt-chip-cloud-renderer,
    yt-chip-cloud-renderer #right-arrow-button.yt-chip-cloud-renderer {
      background: var(--ytd-chip-cloud-background, var(--yt-spec-general-background-a)) !important;
    }
    
    yt-chip-cloud-renderer[is-dark-theme] #left-arrow.yt-chip-cloud-renderer::after {
      background: linear-gradient(to right, var(--ytd-chip-cloud-background, var(--yt-spec-general-background-a)) 10%, rgba(24, 24, 24, 0) 90%) !important;
    }
    
    yt-chip-cloud-renderer #left-arrow.yt-chip-cloud-renderer::after {
      background: linear-gradient(to right, var(--ytd-chip-cloud-background, var(--yt-spec-general-background-a)) 10%, rgba(249, 249, 249, 0) 90%) !important;
    }
    
    yt-chip-cloud-renderer #right-arrow.yt-chip-cloud-renderer::before {
      background: linear-gradient(to left, var(--ytd-chip-cloud-background, var(--yt-spec-general-background-a)) 10%, rgba(249, 249, 249, 0) 90%) !important;
    }
    
    ytd-feed-filter-chip-bar-renderer[component-style="FEED_FILTER_CHIP_BAR_STYLE_TYPE_HASHTAG_LANDING_PAGE"] #chips-wrapper.ytd-feed-filter-chip-bar-renderer,
    ytd-feed-filter-chip-bar-renderer[component-style="FEED_FILTER_CHIP_BAR_STYLE_TYPE_CHANNEL_PAGE_GRID"] #chips-wrapper.ytd-feed-filter-chip-bar-renderer {
      background-color: var(--yt-spec-general-background-b) !important;
    }
    
    yt-chip-cloud-chip-renderer {
      height: 32px !important;
      border: 1px solid var(--yt-spec-10-percent-layer) !important;
      border-radius: 16px !important;
      box-sizing: border-box !important;
    }
    
    /* Remove rounded corners on buttons and boxes */
    #container.ytd-searchbox {
      background-color: var(--ytd-searchbox-background) !important;
      border-radius: 2px 0 0 2px !important;
      box-shadow: inset 0 1px 2px var(--ytd-searchbox-legacy-border-shadow-color) !important;
      color: var(--ytd-searchbox-text-color) !important;
      padding: 2px 6px !important;
    }
    
    ytd-searchbox[desktop-searchbar-style="rounded_corner_dark_btn"] #searchbox-button.ytd-searchbox {
      display: none !important;
    }
    
    ytd-searchbox[desktop-searchbar-style="rounded_corner_light_btn"] #searchbox-button.ytd-searchbox {
      display: none !important;
    }
    
    #search[has-focus] #search-input {
      margin-left: 32px !important;
    }
    
    #search-icon-legacy.ytd-searchbox {
      display: block !important;
      border-radius: 0px 2px 2px 0px !important;
    }
    
    .sbsb_a {
      border-radius: 2px !important;
    }
    
    .sbsb_c {
      padding-left: 10px !important;
    }
    
    div.sbqs_c::before {
      margin-right: 10px !important;
    }
    
    ytd-searchbox[has-focus] #search-icon.ytd-searchbox {
      padding-left: 10px !important;
      padding-right: 10px !important;
    }
    
    #voice-search-button.ytd-masthead {
      background-color: var(--yt-spec-general-background-a) !important;
      margin-left: 4px !important;
    }
    
    #guide-content.ytd-app {
      background: var(--yt-spec-brand-background-solid) !important;
    }
    
    yt-interaction.ytd-guide-entry-renderer,
    ytd-guide-entry-renderer {
      border-radius: 0px !important;
    }
    
    a#endpoint.yt-simple-endpoint.style-scope.ytd-mini-guide-entry-renderer {
      margin: 0px !important;
    }
    
    ytd-guide-entry-renderer[guide-refresh] {
      width: 100% !important;
      border-radius: 0px !important;
    }
    
    tp-yt-paper-item.ytd-guide-entry-renderer {
      --paper-item-focused-before-border-radius: 0px !important;
    }
    
    ytd-mini-guide-entry-renderer {
      border-radius: 0 !important;
    }
    
    ytd-guide-section-renderer.style-scope.ytd-guide-renderer {
      padding-left: 0px !important;
    }
    
    ytd-mini-guide-renderer[guide-refresh] {
      padding: 0 !important;
    }
    
    ytd-guide-entry-renderer[active] {
      border-radius: 0px !important;
    }
    
    .style-scope.ytd-guide-entry-renderer:hover {
      border-radius: 0 !important;
    }
    
    tp-yt-paper-item.style-scope.ytd-guide-entry-renderer {
      border-radius: 0px !important;
      padding-left: 24px !important;
    }
    
    #guide-section-title.ytd-guide-section-renderer {
      color: var(--yt-spec-text-secondary) !important;
      padding: 8px 24px !important;
      font-size: var(--ytd-tab-system-font-size) !important;
      font-weight: var(--ytd-tab-system-font-weight) !important;
      letter-spacing: var(--ytd-tab-system-letter-spacing) !important;
      text-transform: var(--ytd-tab-system-text-transform) !important;
    }
    
    .style-scope.ytd-rich-item-renderer {
      border-radius: 2px !important;
    }
    
    .style-scope.ytd-item-section-renderer {
      border-radius: 0px !important;
    }
    
    #tooltip.tp-yt-paper-tooltip {
      border-radius: 2px !important;
    }
    
    div.style-scope.yt-tooltip-renderer {
      border-radius: 0px !important;
    }
    
    .style-scope.ytd-topic-link-renderer {
      border-radius: 2px !important;
    }
    
    .bold.style-scope.yt-formatted-string {
      font-family: Roboto !important;
    }
    
    .style-scope.yt-formatted-string {
      font-family: Roboto !important;
    }
    
    #bar {
      border-radius: 2px !important;
    }
    
    ytd-multi-page-menu-renderer {
      border-radius: 0px !important;
      border: 1px solid var(--yt-spec-10-percent-layer) !important;
      border-top: none !important;
      box-shadow: none !important;
    }
    
    yt-dropdown-menu {
      --paper-menu-button-content-border-radius:  2px !important;
    }
    
    ytd-menu-popup-renderer {
      border-radius: 2px !important;
    }
    
    .style-scope.ytd-shared-post-renderer {
      border-radius: 0px !important;
    }
    
    div#repost-context.style-scope.ytd-shared-post-renderer {
      border-radius: 0px !important;
    }
    
    ytd-post-renderer.style-scope.ytd-shared-post-renderer {
      border-radius: 0px !important;
    }
    
    div#dismissed.style-scope.ytd-compact-video-renderer {
      border-radius: 0px !important;
    }
    
    .style-scope.ytd-feed-nudge-renderer {
      border-radius: 2px !important;
    }
    
    .style-scope.ytd-inline-survey-renderer {
      border-radius: 2px !important;
    }
    
    .style-scope.ytd-brand-video-shelf-renderer {
      border-radius: 0px !important;
    }
    
    div#dismissible.style-scope.ytd-brand-video-singleton-renderer {
      border-radius: 0px !important;
    }
    
    #inline-survey-compact-video-renderer {
      border-radius: 0px !important;
    }
    
    tp-yt-paper-button#button.style-scope.ytd-button-renderer.style-inactive-outline.size-default {
      border-radius: 2px !important;
    }
    
    div#dismissed.style-scope.ytd-rich-grid-media {
      border-radius: 0px !important;
    }
    
    ytd-thumbnail[size="large"] a.ytd-thumbnail, ytd-thumbnail[size="large"]::before {
      border-radius: 0 !important;
    }
    
    ytd-thumbnail[size="medium"] a.ytd-thumbnail, ytd-thumbnail[size="medium"]::before {
      border-radius: 0 !important;
    }
    
    ytd-playlist-thumbnail[size="medium"] a.ytd-playlist-thumbnail, ytd-playlist-thumbnail[size="medium"]::before {
      border-radius: 0 !important;
    }
    
    ytd-playlist-thumbnail[size="large"] a.ytd-playlist-thumbnail, ytd-playlist-thumbnail[size="large"]::before {
      border-radius: 0 !important;
    }
    
    ytd-playlist-panel-renderer[modern-panels]:not([within-miniplayer]) #container.ytd-playlist-panel-renderer {
      border-radius: 0 !important;
    }
    
    ytd-thumbnail-overlay-toggle-button-renderer.style-scope.ytd-thumbnail {
      border-radius: 2px !important;
    }
    
    ytd-compact-link-renderer.ytd-settings-sidebar-renderer {
      margin: 0px !important;
      border-radius: 0 !important;
    }
    
    ytd-compact-link-renderer[compact-link-style=compact-link-style-type-settings-sidebar][active] {
      border-radius: 0 !important;
    }
    
    tp-yt-paper-item.style-scope.ytd-compact-link-renderer::before {
      border-radius: 0 !important;
    }
    
    ytd-compact-link-renderer[compact-link-style=compact-link-style-type-settings-sidebar] tp-yt-paper-item.ytd-compact-link-renderer {
      padding-left: 24px !important;
      padding-right: 24px !important;
    }
    
    img#img.style-scope.yt-image-shadow {
      border-radius: 50px !important;
    }
    
    #title.style-scope.ytd-feed-nudge-renderer {
      font-family: Roboto !important;
    }
    
    yt-chip-cloud-chip-renderer.style-scope.ytd-feed-nudge-renderer {
      border-radius: 50px !important;
    }
    
    div#label-container.style-scope.ytd-thumbnail-overlay-toggle-button-renderer {
      border: 2px !important;
      text-transform: uppercase !important;
    }
    
    ytd-thumbnail-overlay-time-status-renderer.style-scope.ytd-thumbnail {
      border-radius: 2px !important;
    }
    
    ytd-backstage-post-dialog-renderer {
      border-radius: 2px !important;
    }
    
    yt-bubble-hint-renderer {
      border-radius: 2px !important;
    }
    
    #top-row.ytd-watch-metadata > div#actions.item.style-scope.ytd-watch-metadata > div#actions-inner.style-scope.ytd-watch-metadata > div#menu.style-scope.ytd-watch-metadata > ytd-menu-renderer.style-scope.ytd-watch-metadata > div#top-level-buttons-computed.top-level-buttons.style-scope.ytd-menu-renderer > ytd-button-renderer, #top-row.ytd-watch-metadata > div#actions.item.style-scope.ytd-watch-metadata > div#actions-inner.style-scope.ytd-watch-metadata > div#menu.style-scope.ytd-watch-metadata > ytd-menu-renderer.style-scope.ytd-watch-metadata > div#flexible-item-buttons.style-scope.ytd-menu-renderer > ytd-button-renderer, #top-row.ytd-watch-metadata > div#actions.item.style-scope.ytd-watch-metadata > div#actions-inner.style-scope.ytd-watch-metadata > div#menu.style-scope.ytd-watch-metadata > ytd-menu-renderer.style-scope.ytd-watch-metadata > div#top-level-buttons-computed.top-level-buttons.style-scope.ytd-menu-renderer > ytd-segmented-like-dislike-button-renderer.style-scope.ytd-menu-renderer > yt-smartimation.style-scope.ytd-segmented-like-dislike-button-renderer > div#segmented-buttons-wrapper.style-scope.ytd-segmented-like-dislike-button-renderer > div#segmented-like-button.style-scope.ytd-segmented-like-dislike-button-renderer > ytd-toggle-button-renderer {
      text-transform: capitalize !important;
    }
    
    #top-row.ytd-watch-metadata > div#actions.item.style-scope.ytd-watch-metadata > div#actions-inner.style-scope.ytd-watch-metadata > div#menu.style-scope.ytd-watch-metadata > ytd-menu-renderer.style-scope.ytd-watch-metadata > div#top-level-buttons-computed.top-level-buttons.style-scope.ytd-menu-renderer > ytd-segmented-like-dislike-button-renderer.style-scope.ytd-menu-renderer > yt-smartimation.style-scope.ytd-segmented-like-dislike-button-renderer > div#segmented-buttons-wrapper.style-scope.ytd-segmented-like-dislike-button-renderer > div#segmented-dislike-button.style-scope.ytd-segmented-like-dislike-button-renderer > ytd-toggle-button-renderer.style-scope.ytd-segmented-like-dislike-button-renderer.style-text > a.yt-simple-endpoint.style-scope.ytd-toggle-button-renderer > yt-icon-button#button.yt-simple-endpoint.style-scope.ytd-toggle-button-renderer > button#button.style-scope.yt-icon-button {
      width: 24px !important;
      height: 24px !important;
    }
    
    #top-row.ytd-watch-metadata > div#actions.item.style-scope.ytd-watch-metadata > div#actions-inner.style-scope.ytd-watch-metadata > div#menu.style-scope.ytd-watch-metadata > ytd-menu-renderer.style-scope.ytd-watch-metadata > div#top-level-buttons-computed.top-level-buttons.style-scope.ytd-menu-renderer > ytd-segmented-like-dislike-button-renderer.style-scope.ytd-menu-renderer > yt-smartimation.style-scope.ytd-segmented-like-dislike-button-renderer > div#segmented-buttons-wrapper.style-scope.ytd-segmented-like-dislike-button-renderer > div#segmented-dislike-button.style-scope.ytd-segmented-like-dislike-button-renderer > ytd-toggle-button-renderer.style-scope.ytd-segmented-like-dislike-button-renderer.style-text > a.yt-simple-endpoint.style-scope.ytd-toggle-button-renderer > yt-icon-button#button.yt-simple-endpoint.style-scope.ytd-toggle-button-renderer {
      padding: 6px !important;
    }
    
    ytd-watch-metadata[modern-metapanel] #description.ytd-watch-metadata, #description.ytd-watch-metadata {
    background-color: transparent !important;
    border-radius: 0px !important;
    }
    
    ytd-watch-metadata[modern-metapanel] #description-inner.ytd-watch-metadata, #description-inner.ytd-watch-metadata {
    margin: 0px !important;
    }
    
    ytd-watch-metadata[modern-metapanel-order] #comment-teaser.ytd-watch-metadata, #comment-teaser.ytd-watch-metadata {
    border: 1px solid var(--yt-spec-10-percent-layer) !important;
    border-radius: 4px !important;
    }
    
    ytd-comments-entry-point-header-renderer[modern-metapanel], #comment-teaser.ytd-watch-metadata {
    background-color: transparent !important;
    }
    
    div#title.text-shell.skeleton-bg-color {
      border-radius: 2px !important;
    }
    
    div#count.text-shell.skeleton-bg-color {
      border-radius: 2px !important;
    }
    
    div#owner-name.text-shell.skeleton-bg-color {
      border-radius: 2px !important;
    }
    
    div#published-date.text-shell.skeleton-bg-color {
      border-radius: 2px !important;
    }
    
    div#subscribe-button.skeleton-bg-color {
      border-radius: 4px !important;
    }
    
    div.rich-thumbnail.skeleton-bg-color {
      border-radius: 0px !important;
    }
    
    div.rich-video-title.text-shell.skeleton-bg-color {
      border-radius: 2px !important;
    }
    
    div.rich-video-meta.text-shell.skeleton-bg-color {
      border-radius: 2px !important;
    }
    
    ytd-video-view-count-renderer {
      font-size: 1.4rem !important;
    }
    
    #meta #avatar {
      width: 48px;
      height: 48px;
      margin-right: 16px;
    }
    
    #meta #avatar img {
      width: 100%;
    }
    
    #channel-name.ytd-video-owner-renderer {
      font-size: 1.4rem !important;
    }
    
    #info.ytd-video-primary-info-renderer {
      height: 40px !important;
    }
    
    ytd-merch-shelf-renderer {
      background-color: transparent !important;
    }
    
    div#clarify-box.attached-message.style-scope.ytd-watch-flexy {
      margin-top: 0px !important;
    }
    
    ytd-clarification-renderer.style-scope.ytd-item-section-renderer, ytd-clarification-renderer.style-scope.ytd-watch-flexy {
      border: 1px solid !important;
      border-color: #0000001a !important;
      border-radius: 0px !important;
    }
    
    yt-formatted-string.description.style-scope.ytd-clarification-renderer {
      font-size: 1.4rem !important;
    }
    
    div.content-title.style-scope.ytd-clarification-renderer {
      padding-bottom: 4px !important;
    }
    
    ytd-watch-flexy[rounded-player-large]:not([fullscreen]):not([theater]) #ytd-player.ytd-watch-flexy {
      border-radius: 0px !important;
    }
    
    ytd-rich-metadata-renderer[rounded] {
      border-radius: 0px !important;
    }
    
    ytd-live-chat-frame[rounded-container], ytd-live-chat-frame[rounded-container] #show-hide-button.ytd-live-chat-frame ytd-toggle-button-renderer.ytd-live-chat-frame, iframe.style-scope.ytd-live-chat-frame {
      border-radius: 0px !important;
    }
    
    ytd-toggle-button-renderer.style-scope.ytd-live-chat-frame, yt-live-chat-header-renderer.style-scope.yt-live-chat-renderer {
      background: var(--yt-spec-brand-background-solid) !important;
    }
    
    ytd-toggle-button-renderer.style-scope.ytd-live-chat-frame > a.yt-simple-endpoint.style-scope.ytd-toggle-button-renderer > tp-yt-paper-button.style-scope.ytd-toggle-button-renderer {
      padding-top: 4px !important;
      padding-bottom: 4px !important;
    }
    
    ytd-playlist-panel-renderer[modern-panels]:not([within-miniplayer]) #container.ytd-playlist-panel-renderer, ytd-tvfilm-offer-module-renderer[modern-panels], ytd-donation-shelf-renderer.style-scope.ytd-watch-flexy {
      border-radius: 0px !important;
    }
    
    ytd-playlist-panel-renderer[modern-panels]:not([hide-header-text]) .title.ytd-playlist-panel-renderer {
      font-family: Roboto !important;
      font-size: 1.4rem !important;
      line-height: 2rem !important;
      font-weight: 500 !important;
    }
    
    ytd-tvfilm-offer-module-renderer[modern-panels] #header.ytd-tvfilm-offer-module-renderer {
      border-radius: 0px !important;
      font-family: Roboto !important;
      font-size: 1.6rem !important;
      line-height: 2.2rem !important;
      font-weight: 400 !important;
    }
    
    ytd-donation-shelf-renderer[modern-panels] #header-text.ytd-donation-shelf-renderer {
      font-family: Roboto !important;
      font-size: 1.6rem !important;
      font-weight: 500 !important;
    }
    
    ytd-universal-watch-card-renderer[rounded] #header.ytd-universal-watch-card-renderer, ytd-universal-watch-card-renderer[rounded] #hero.ytd-universal-watch-card-renderer {
      border-radius: 0px !important;
    }
    
    /* Remove rounded corners from the video player (Thanks to oldbutgoldyt for the code) */
    .ytp-ad-player-overlay-flyout-cta-rounded {
    border-radius: 2px !important;
    }
    
    .ytp-flyout-cta .ytp-flyout-cta-action-button.ytp-flyout-cta-action-button-rounded {
    font-family: Arial !important;
    background: #167ac6 !important;
    border: solid 1px transparent !important;
    border-color: #167ac6 !important;
    border-radius: 2px !important;
    box-shadow: 0 1px 0 rgba(0,0,0,.05) !important;
    font-size: 11px !important;
    font-weight: 500 !important;
    height: 28px !important;
    margin: 0 8px 0 0 !important;
    max-width: 140px !important;
    padding: 0 10px !important;
    }
    
    .ytp-ad-action-interstitial-action-button.ytp-ad-action-interstitial-action-button-rounded {
    background-color: #167ac6 !important;
    border: none !important;
    border-radius: 2px;
    font-family: Roboto !important;
    font-size: 23px !important;
    height: 46px !important;
    line-height: 46px !important;
    min-width: 164px !important;
    padding: 0 20px !important;
    }
    
    .ytp-settings-menu {
    border-radius: 2px !important;
    }
    
    .ytp-sb-subscribe {
    border-radius: 2px !important;
    background-color: #f00 !important;
    color: #fff !important;
    text-transform: uppercase !important;
    }
    
    .ytp-sb-unsubscribe {
    border-radius: 2px !important;
    background-color: #eee !important;
    color: #606060 !important;
    text-transform: uppercase !important;
    }
    
    .ytp-sb-subscribe.ytp-sb-disabled {
    background-color: #f3908b !important;
    }
    
    .branding-context-container-inner.ytp-rounded-branding-context {
    border-radius: 2px !important;
    }
    
    .ytp-tooltip.ytp-rounded-tooltip:not(.ytp-preview) .ytp-tooltip-text {
    border-radius: 2px !important;
    }
    
    .ytp-autonav-endscreen-upnext-button.ytp-autonav-endscreen-upnext-button-rounded {
    border-radius: 2px !important;
    }
    
    .ytp-ad-overlay-container.ytp-rounded-overlay-ad .ytp-ad-overlay-image img, .ytp-ad-overlay-container.ytp-rounded-overlay-ad .ytp-ad-text-overlay, .ytp-ad-overlay-container.ytp-rounded-overlay-ad .ytp-ad-enhanced-overlay {
    border-radius: 0 !important;
    }
    
    .ytp-videowall-still-image {
    border-radius: 0 !important;
    }
    
    div.iv-card.iv-card-video.ytp-rounded-info {
    border-radius: 0 !important;
    }
    
    div.iv-card.iv-card-playlist.ytp-rounded-info {
    border-radius: 0 !important;
    }
    
    div.iv-card.iv-card-channel.ytp-rounded-info {
    border-radius: 0 !important;
    }
    
    div.iv-card.ytp-rounded-info {
    border-radius: 0 !important;
    }
    
    .ytp-tooltip.ytp-rounded-tooltip.ytp-text-detail.ytp-preview, .ytp-tooltip.ytp-rounded-tooltip.ytp-text-detail.ytp-preview .ytp-tooltip-bg {
    border-radius: 2px !important;
    }
    
    .ytp-ce-video.ytp-ce-medium-round, .ytp-ce-playlist.ytp-ce-medium-round, .ytp-ce-medium-round .ytp-ce-expanding-overlay-background {
    border-radius: 0 !important;
    }
    
    .ytp-autonav-endscreen-upnext-thumbnail {
    border-radius: 0 !important;
    }
    
    @font-face {
    font-family: no-parens;
    src: url("data:application/x-font-woff;base64,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");;
    unicode-range: U+0028, U+0029;
    }
    
    span.ytp-menu-label-secondary {
    font-family: "no-parens", "Roboto", sans-serif;
    }
    
    .ytp-swatch-color-white {
    color: #f00 !important;
    }
    
    .iv-card {
    border-radius: 0 !important;
    }
    
    .iv-branding .branding-context-container-inner {
    border-radius: 2px !important;
    }
    
    .ytp-offline-slate-bar {
    border-radius: 2px !important;
    }
    
    .ytp-offline-slate-button {
    border-radius: 2px !important;
    }
    
    .ytp-ce-video.ytp-ce-large-round, .ytp-ce-playlist.ytp-ce-large-round, .ytp-ce-large-round .ytp-ce-expanding-overlay-background {
    border-radius: 0 !important;
    }
    
    .ytp-flyout-cta .ytp-flyout-cta-icon.ytp-flyout-cta-icon-rounded {
    border-radius: 0 !important;
    }
    
    .ytp-player-minimized .html5-main-video, .ytp-player-minimized .ytp-miniplayer-scrim, .ytp-player-minimized.html5-video-player {
    border-radius: 0 !important;
    }
    
    ytd-miniplayer #player-container.ytd-miniplayer, ytd-miniplayer #video-container.ytd-miniplayer .video.ytd-miniplayer, ytd-miniplayer #card.ytd-miniplayer, ytd-miniplayer {
    border-radius: 0 !important;
    }
    
    ytd-channel-video-player-renderer[rounded] #player.ytd-channel-video-player-renderer {
    border-radius: 0 !important;
    }
    
    .ytp-tooltip.ytp-rounded-tooltip.ytp-preview:not(.ytp-text-detail), .ytp-tooltip.ytp-rounded-tooltip.ytp-preview:not(.ytp-text-detail) .ytp-tooltip-bg {
      border-radius: 2px !important;
    }
    
    #movie_player > div.ytp-promotooltip-wrapper > div.ytp-promotooltip-container {
    border-radius: 2px !important;
    }
    
    .ytp-fine-scrubbing-container {
    display: none !important;
    }
    
    .ytp-progress-bar, .ytp-heat-map-container, .ytp-fine-scrubbing-container {
    transform: translateY(0) !important;
    }
    
    .ytp-chrome-bottom {
    height: auto !important;
    }
    
    .ytp-tooltip-edu {
    display: none !important;
    }
    
    /* Subscribe button fixes + Old compact channel header UI and non-amsterdam playlists */
    #buttons.ytd-c4-tabbed-header-renderer {
      flex-direction: row-reverse !important;
    }
    
    yt-button-shape.style-scope.ytd-subscribe-button-renderer {
      display: flex !important;
    }
    
    #subscribe-button ytd-subscribe-button-renderer button {
      height: 37px !important;
      letter-spacing: 0.5px !important;
      border-radius: 2px !important;
      text-transform: uppercase !important;
    }
    
    .yt-spec-button-shape-next--mono.yt-spec-button-shape-next--filled {
      color: #fff !important;
      background: var(--yt-spec-brand-button-background) !important;
      border-radius: 2px !important;
      text-transform: uppercase !important;
      letter-spacing: 0.5px !important;
    }
    
    button.yt-spec-button-shape-next.yt-spec-button-shape-next--tonal.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--size-m {
      height: 37px !important;
      letter-spacing: 0.5px !important;
      border-radius: 2px !important;
      text-transform: uppercase !important;
    }
    
    #subscribe-button ytd-subscribe-button-renderer button.yt-spec-button-shape-next--tonal {
    background-color: var(--yt-spec-badge-chip-background) !important;
      color: var(--yt-spec-text-secondary) !important;
    }
    
    button.yt-spec-button-shape-next.yt-spec-button-shape-next--tonal.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--size-s {
      background-color: var(--yt-spec-badge-chip-background) !important;
      color: var(--yt-spec-text-secondary) !important;
      height: 25px !important;
      letter-spacing: 0.5px !important;
      border-radius: 2px !important;
      text-transform: uppercase !important;
    }
    
    div#notification-preference-button.style-scope.ytd-subscribe-button-renderer > ytd-subscription-notification-toggle-button-renderer-next.style-scope.ytd-subscribe-button-renderer > yt-button-shape > .yt-spec-button-shape-next--size-m {
      background-color: transparent !important;
      border-radius: 16px !important;
      padding-left: 14px !important;
      padding-right: 2px !important;
      margin-left: 4px !important;
    }
    
    div#notification-preference-button.style-scope.ytd-subscribe-button-renderer > ytd-subscription-notification-toggle-button-renderer-next.style-scope.ytd-subscribe-button-renderer > yt-button-shape > .yt-spec-button-shape-next--size-m > div.cbox.yt-spec-button-shape-next--button-text-content, div#notification-preference-button.style-scope.ytd-subscribe-button-renderer > ytd-subscription-notification-toggle-button-renderer-next.style-scope.ytd-subscribe-button-renderer > yt-button-shape > .yt-spec-button-shape-next--size-m > div.yt-spec-button-shape-next__secondary-icon, button.yt-spec-button-shape-next.yt-spec-button-shape-next--tonal.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--size-m.yt-spec-button-shape-next--icon-leading-trailing > div.yt-spec-button-shape-next__button-text-content {
      display: none !important;
    }
    
    #notification-preference-toggle-button:not([hidden]) + yt-animated-action #notification-preference-button.ytd-subscribe-button-renderer[invisible], #subscribe-button-shape.ytd-subscribe-button-renderer[invisible] {
      pointer-events: auto;
      visibility: visible;
      position: static;
    }
    
    yt-smartimation.ytd-subscribe-button-renderer, .smartimation__content > __slot-el {
      display: flex !important;
    }
    
    ytd-channel-tagline-renderer {
      display: none !important;
    }
    
    #avatar.ytd-c4-tabbed-header-renderer {
      width: 80px !important;
      height: 80px !important;
      margin: 0 24px 0 0 !important;
      flex: none !important;
      overflow: hidden !important;
    }
    
    #avatar-editor.ytd-c4-tabbed-header-renderer {
      --ytd-channel-avatar-editor-size: 80px !important;
    }
    
    #channel-name.ytd-c4-tabbed-header-renderer {
      margin-bottom: 0 !important;
    }
    
    #channel-header-container.ytd-c4-tabbed-header-renderer {
      padding-top: 0 !important;
      align-items: center !important;
    }
    
    #inner-header-container.ytd-c4-tabbed-header-renderer {
      margin-top: 0 !important;
      align-items: center !important;
    }
    
    yt-formatted-string#channel-handle.style-scope.ytd-c4-tabbed-header-renderer {
      display: none !important;
    }
    
    ytd-c4-tabbed-header-renderer[use-page-header-style] #channel-pronouns.ytd-c4-tabbed-header-renderer,
    yt-formatted-string#channel-pronouns.style-scope.ytd-c4-tabbed-header-renderer {
      display: none !important;
    }
    
    #videos-count {
      display: none !important;
    }
    
    .meta-item.ytd-c4-tabbed-header-renderer {
      display: block !important;
    }
    
    div#channel-header-links.style-scope.ytd-c4-tabbed-header-renderer {
      display: none !important;
    }
    
    ytd-c4-tabbed-header-renderer[use-page-header-style] #channel-name.ytd-c4-tabbed-header-renderer {
      font-size: 2.4em !important;
      font-weight: 400 !important;
      line-height: var(--yt-channel-title-line-height, 3rem) !important;
    }
    
    span.delimiter.style-scope.ytd-c4-tabbed-header-renderer {
      display: none !important;
    }
    
    div#meta.style-scope.ytd-c4-tabbed-header-renderer {
      width: auto !important;
    }
    
    ytd-c4-tabbed-header-renderer[use-page-header-style] #inner-header-container.ytd-c4-tabbed-header-renderer {
      flex-direction: row !important;
    }
    
    div.page-header-banner.style-scope.ytd-c4-tabbed-header-renderer {
      margin-left: 0px !important;
      margin-right: 0px !important;
      border-radius: 0px !important;
    }
    
    ytd-c4-tabbed-header-renderer[use-page-header-style] .page-header-banner.ytd-c4-tabbed-header-renderer {
      border-radius: 0px !important;
    }
    
    ytd-browse[darker-dark-theme][page-subtype="playlist"], ytd-browse[darker-dark-theme][page-subtype="show"] {
      background-color: var(--yt-spec-general-background-b) !important;
    }
    
    ytd-two-column-browse-results-renderer.ytd-browse[background-refresh] {
      background-color: var(--yt-spec-general-background-b) !important;
    }
    
    .yt-sans-20.yt-dynamic-sizing-formatted-string, .yt-sans-22.yt-dynamic-sizing-formatted-string, .yt-sans-24.yt-dynamic-sizing-formatted-string, .yt-sans-28.yt-dynamic-sizing-formatted-string, yt-text-input-form-field-renderer[component-style="INLINE_FORM_STYLE_TITLE"][amsterdam] tp-yt-paper-input.yt-text-input-form-field-renderer .input-content.tp-yt-paper-input-container > input {
      font-family: "Roboto", "Arial", sans-serif !important;
      font-size: 2.4rem !important;
      line-height: 3.2rem !important;
      font-weight: 400 !important;
    }
    
    ytd-browse[page-subtype=playlist][amsterdam] {
      padding-top: 0 !important;
    }
    
    ytd-browse[page-subtype=playlist][amsterdam] ytd-playlist-header-renderer.ytd-browse {
      margin-left: 0 !important;
      height: calc(100vh - var(--ytd-toolbar-height)) !important;
    }
    
    .immersive-header-container.ytd-playlist-header-renderer {
      margin-bottom: 0 !important;
      border-radius: 0 !important;
    }
    
    .image-wrapper.ytd-hero-playlist-thumbnail-renderer {
      border-radius: 0 !important;
    }
    
    ytd-playlist-header-renderer, yt-formatted-string[has-link-only_]:not([force-default-style]) a.yt-simple-endpoint.yt-formatted-string:visited, .metadata-stats.ytd-playlist-byline-renderer, .yt-spec-button-shape-next--overlay.yt-spec-button-shape-next--text, ytd-text-inline-expander.ytd-playlist-header-renderer {
      color: var(--yt-spec-text-primary) !important;
      --ytd-text-inline-expander-button-color: var(--yt-spec-text-primary) !important;
    }
    
    ytd-dropdown-renderer[no-underline] tp-yt-paper-dropdown-menu-light .tp-yt-paper-dropdown-menu-light[style-target=input], tp-yt-iron-icon.tp-yt-paper-dropdown-menu-light {
      color: var(--yt-spec-text-primary) !important;
    }
    
    .yt-spec-button-shape-next--overlay.yt-spec-button-shape-next--tonal, .yt-spec-button-shape-next--overlay.yt-spec-button-shape-next--filled {
      background: transparent !important;
      color: var(--yt-spec-text-primary) !important;
      border-radius: 2px !important;
      text-transform: uppercase;
    }
    
    .metadata-text-wrapper.ytd-playlist-header-renderer {
      --yt-endpoint-color: var(--yt-spec-text-primary) !important;
      --yt-endpoint-hover-color: var(--yt-spec-text-primary) !important;
    }
    
    div.immersive-header-background-wrapper.style-scope.ytd-playlist-header-renderer > div {
      background: var(--yt-spec-general-background-a) !important;
    }
    
    #contents > ytd-playlist-video-list-renderer {
      background: var(--yt-spec-general-background-b) !important;
      margin-right: 0px !important;
    }
    
    ytd-browse[page-subtype=playlist][amsterdam] #alerts.ytd-browse {
      padding-left: 388px !important;
      padding-right: 0px !important;
      margin-bottom: 0 !important;
    }
    
    ytd-alert-with-button-renderer[type=INFO], ytd-alert-with-button-renderer[type=SUCCESS] {
      background: var(--yt-spec-general-background-a) !important;
    }
    
    ytd-item-section-renderer.style-scope.ytd-section-list-renderer[page-subtype="playlist"] > #header.ytd-item-section-renderer > ytd-feed-filter-chip-bar-renderer {
      display: none !important;
    }
    
    .yt-spec-button-shape-next--overlay.yt-spec-button-shape-next--tonal {
      background: var(--yt-spec-base-background);
    }
    
    iron-input.tp-yt-paper-input > input.tp-yt-paper-input,
    textarea.tp-yt-iron-autogrow-textarea {
      color: var(--yt-spec-text-primary) !important;
    }
    
    #labelAndInputContainer.tp-yt-paper-input-container > label, #labelAndInputContainer.tp-yt-paper-input-container > .paper-input-label {
      color: var(--yt-spec-text-secondary);
    }
    
    .unfocused-line.tp-yt-paper-input-container, .focused-line.tp-yt-paper-input-container {
      border-bottom-color: var(--yt-spec-text-primary) !important;
    }
    
    [page-subtype="history"] #channel-header.ytd-tabbed-page-header {
      background-color: var(--yt-spec-general-background-a) !important;
      padding-top: 0 !important;
      padding-bottom: 0 !important;
    }
    
    .page-header-view-model-wiz__page-header-title--page-header-title-large {
      margin-top: 24px !important;
      margin-bottom: 8px !important;
      color: var(--yt-spec-text-primary) !important;
      font-size: 1.6em !important;
      line-height: 1.4em !important;
      font-weight: 500 !important;
    }
    
    #endpoint.yt-simple-endpoint.ytd-mini-guide-entry-renderer.style-scope[title="Shorts"] {
      display: none !important;
    }
    
    #endpoint.yt-simple-endpoint.ytd-guide-entry-renderer.style-scope[title="Trending"] {
      display: none !important;
    }
    
    #endpoint.yt-simple-endpoint.ytd-guide-entry-renderer.style-scope[title="Podcasts"] {
      display: none !important;
    }
    
    ytd-guide-entry-renderer > a[href*="/channel/UCkYQyvc_i9hXEo4xic9Hh2g"] {
      display: none !important;
    }
    
    .yt-tab-shape-wiz {
      padding: 0 32px !important;
      margin-right: 0 !important;
    }
    
    .yt-tab-shape-wiz__tab {
      font-size: 14px !important;
      font-weight: 500 !important;
      letter-spacing: var(--ytd-tab-system-letter-spacing) !important;
      text-transform: uppercase !important;
    }
    
    .yt-tab-group-shape-wiz__slider {
      display: none !important;
    }
    
    .yt-tab-shape-wiz__tab-bar {
      display: none !important;
    }
    
    yt-formatted-string.style-scope.yt-chip-cloud-chip-renderer, span.style-scope.ytd-rich-shelf-renderer {
      font-weight: 400 !important;
    }
    
    span.style-scope.ytd-shelf-renderer, ytd-reel-shelf-renderer[modern-typography] #title.ytd-reel-shelf-renderer {
      font-size: 1.6rem !important;
      font-weight: 500 !important;
    }
    
    .count-text.ytd-comments-header-renderer {
      font-size: 1.6rem !important;
      line-height: 2.2rem !important;
      font-weight: 400 !important;
    }
    
    ytd-item-section-renderer.style-scope.ytd-watch-next-secondary-results-renderer > div#contents.style-scope.ytd-item-section-renderer > ytd-reel-shelf-renderer.style-scope.ytd-item-section-renderer, ytd-reel-shelf-renderer.ytd-structured-description-content-renderer {
      display: none !important;
    }
    
    ytd-video-description-infocards-section-renderer.style-scope.ytd-structured-description-content-renderer > #header.ytd-video-description-infocards-section-renderer, ytd-video-description-infocards-section-renderer.style-scope.ytd-structured-description-content-renderer > #action-buttons.ytd-video-description-infocards-section-renderer {
      display: none !important;
    }
    
    ytd-video-description-infocards-section-renderer.style-scope.ytd-structured-description-content-renderer {
      border-top: 0px !important;
    }
    
    button.ytp-button.ytp-jump-button.ytp-jump-button-enabled {
      display: none !important;
    }
    
    ytd-player#ytd-player.style-scope.ytd-watch-flexy > div#container.style-scope.ytd-player > .html5-video-player > div.ytp-chrome-bottom > div.ytp-chrome-controls > div.ytp-left-controls > a.ytp-next-button.ytp-button {
      display: block !important;
    }
    
    div#chip-bar.style-scope.ytd-search-header-renderer > yt-chip-cloud-renderer.style-scope.ytd-search-header-renderer > div#container.style-scope.yt-chip-cloud-renderer {
    display: none !important;
    }
    
    #play.ytd-moving-thumbnail-renderer {
      color: #fff !important;
    }
    
    /* Fix disappearing bar in masthead */
    #background.ytd-masthead {
      opacity: 1 !important;
    }`

    waitForElm('head').then(() => document.head.append(fixesStyle));

    (() => {
        const css = [
            '[d*="M18 11C18 14.866 14.866 18 11 18C7.13401 18 4 14.866 4 11C4 7.13401 7.13401 4 11 4C14.866 4 18 7.13401 18 11ZM16.2961 16.9961C14.8853 18.2431 13.031 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11C19 13.0274 18.2458 14.8786 17.0028 16.2885L20.5583 19.8441L20.9119 20.1976L20.2048 20.9047L19.8512 20.5512L16.2961 16.9961Z"] {',
            'd: path("m20.87 20.17-5.59-5.59C16.35 13.35 17 11.75 17 10c0-3.87-3.13-7-7-7s-7 3.13-7 7 3.13 7 7 7c1.75 0 3.35-.65 4.58-1.71l5.59 5.59.7-.71zM10 16c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z")',
            '}',
            '[d*="m12.71 12 8.15 8.15-.71.71L12 12.71l-8.15 8.15-.71-.71L11.29 12 3.15 3.85l.71-.71L12 11.29l8.15-8.15.71.71L12.71 12z"] {',
            'd: path("M12.7,12l6.6,6.6l-0.7,0.7L12,12.7l-6.6,6.6l-0.7-0.7l6.6-6.6L4.6,5.4l0.7-0.7l6.6,6.6l6.6-6.6l0.7,0.7L12.7,12z")',
            '}'
        ].join('\n')
        const btnStyle = document.createElement('style')
        btnStyle.type = 'text/css' ; btnStyle.textContent = css
        const heads = document.getElementsByTagName('head'),
              btnStyleParent = heads.length > 0 ? heads[0] : document.documentElement
        btnStyleParent.appendChild(btnStyle)
    })()

    Object.defineProperties(document, { 'hidden': {value: false}, 'webkitHidden': {value: false}, 'visibilityState': {value: 'visible'}, 'webkitVisibilityState': {value: 'visible'} });
    
    setInterval(function(){
        document.dispatchEvent( new KeyboardEvent( 'keyup', { bubbles: true, cancelable: true, keyCode: 143, which: 143 } ) );
    }, 60000)

    const extConfig = {
        // BEGIN USER OPTIONS
        // You may change the following variables to allowed values listed in the corresponding brackets (* means default). Keep the style and keywords intact.
        showUpdatePopup: false, // [true, false*] Show a popup tab after extension update (See what's new)
        disableVoteSubmission: false, // [true, false*] Disable like/dislike submission (Stops counting your likes and dislikes)
        coloredThumbs: false, // [true, false*] Colorize thumbs (Use custom colors for thumb icons)
        coloredBar: false, // [true, false*] Colorize ratio bar (Use custom colors for ratio bar)
        colorTheme: 'classic', // [classic*, accessible, neon] Color theme (red/green, blue/yellow, pink/cyan)
        numberDisplayFormat: 'compactShort', // [compactShort*, compactLong, standard] Number format (For non-English locale users, you may be able to improve appearance with a different option. Please file a feature request if your locale is not covered)
        numberDisplayRoundDown: true, // [true*, false] Round down numbers (Show rounded down numbers)
        tooltipPercentageMode: 'none', // [none*, dash_like, dash_dislike, both, only_like, only_dislike] Mode of showing percentage in like/dislike bar tooltip.
        numberDisplayReformatLikes: false // [true, false*] Re-format like numbers (Make likes and dislikes format consistent)
        // END USER OPTIONS
    };

    let previousState = 3; // 1=LIKED, 2=DISLIKED, 3=NEUTRAL
    let likesvalue = 0;
    let dislikesvalue = 0;
    let isMobile = location.hostname == 'm.youtube.com';
    let isShorts = () => location.pathname.startsWith('/shorts');
    let mobileDislikes = 0;

    function cLog(text, subtext = '') {
        subtext = subtext.trim() === '' ? '' : `(${subtext})`;
        console.log(`[Return YouTube Dislikes] ${text} ${subtext}`);
    }

    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        const height = innerHeight || document.documentElement.clientHeight;
        const width = innerWidth || document.documentElement.clientWidth;
        return (
            // When short (channel) is ignored, the element (like/dislike AND short itself) is
            // hidden with a 0 DOMRect. In this case, consider it outside of Viewport
            !(rect.top == 0 && rect.left == 0 && rect.bottom == 0 && rect.right == 0) &&
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= height &&
            rect.right <= width
        );
    }

    function getButtons() {
        if (isShorts()) {
            let elements = document.querySelectorAll(
                isMobile
                    ? 'ytm-like-button-renderer'
                    : '#like-button > ytd-like-button-renderer'
            );
            for (let element of elements) {
                if (isInViewport(element)) {
                    return element;
                }
            }
        }
        if (isMobile) {
            return (
                document.querySelector('.slim-video-action-bar-actions .segmented-buttons') ??
                document.querySelector('.slim-video-action-bar-actions')
            );
        }
        if (document.getElementById('menu-container')?.offsetParent === null) {
            return (
                document.querySelector('ytd-menu-renderer.ytd-watch-metadata > div') ??
                document.querySelector('ytd-menu-renderer.ytd-video-primary-info-renderer > div')
            );
        } else {
            return document
                .getElementById('menu-container')
                ?.querySelector('#top-level-buttons-computed');
        }
    }

    function getLikeButton() {
        return getButtons().children[0].tagName ===
            'YTD-SEGMENTED-LIKE-DISLIKE-BUTTON-RENDERER'
            ? getButtons().children[0].children[0]
            : getButtons().children[0];
    }

    function getLikeTextContainer() {
        return (
            getLikeButton().querySelector('#text') ??
            getLikeButton().getElementsByTagName('yt-formatted-string')[0] ??
            getLikeButton().querySelector('span[role="text"]')
        );
    }

    function getDislikeButton() {
        return getButtons().children[0].tagName ===
            'YTD-SEGMENTED-LIKE-DISLIKE-BUTTON-RENDERER'
            ? getButtons().children[0].children[1]
            : getButtons().children[1];
    }

    function getDislikeTextContainer() {
        let result =
            getDislikeButton().querySelector('#text') ??
            getDislikeButton().getElementsByTagName('yt-formatted-string')[0] ??
            getDislikeButton().querySelector('span[role="text"]')
        if (result === null) {
            let textSpan = document.createElement('span');
            textSpan.id = 'text';
            textSpan.style.marginLeft = '2px';
            getDislikeButton().querySelector('button').appendChild(textSpan);
            getDislikeButton().querySelector('button').style.width = 'auto';
            result = getDislikeButton().querySelector('#text');
        }
        return result;
    }

    let mutationObserver = new Object();

    if (isShorts() && mutationObserver.exists !== true) {
        cLog('initializing mutation observer');
        mutationObserver.options = {
            childList: false,
            attributes: true,
            subtree: false
        };
        mutationObserver.exists = true;
        mutationObserver.observer = new MutationObserver(function(mutationList) {
            mutationList.forEach((mutation) => {
                if (
                    mutation.type === 'attributes' &&
                    mutation.target.nodeName === 'TP-YT-PAPER-BUTTON' &&
                    mutation.target.id === 'button'
                ) {
                    cLog('Short thumb button status changed');
                    if (mutation.target.getAttribute('aria-pressed') === 'true') {
                        mutation.target.style.color =
                            mutation.target.parentElement.parentElement.id === 'like-button'
                        ? getColorFromTheme(true)
                        : getColorFromTheme(false);
                    } else {
                        mutation.target.style.color = 'unset';
                    }
                    return;
                }
                cLog('unexpected mutation observer event: ' + mutation.target + mutation.type);
        })})
    }   

    function checkForUserAvatarButton() {
        if (isMobile) { return; }
        if (document.querySelector('#avatar-btn')) { return true;
        } else { return false; }
    }

    function setLikes(likesCount) {
        if (isMobile) {
            getButtons().children[0].querySelector('.button-renderer-text').innerText =
                likesCount;
            return;
        }
        getLikeTextContainer().innerText = likesCount;
    }

    function setDislikes(dislikesCount) {
        if (isMobile) {
            mobileDislikes = dislikesCount;
            return;
        }
        getDislikeTextContainer()?.removeAttribute('is-empty');
        getDislikeTextContainer().innerText = dislikesCount;
    }

    function getLikeCountFromButton() {
        try {
            if (isShorts()) { return false; }
            let likeButton = getLikeButton().querySelector('yt-formatted-string#text') ??
            getLikeButton().querySelector('button');
            let likesStr = likeButton.getAttribute('aria-label').replace(/\D/g, '');
            return likesStr.length > 0 ? parseInt(likesStr) : false;
        }
        catch { return false; }
    }

    function createRateBar(likes, dislikes) {
        if (isMobile) { return; }
        let rateBar = document.getElementById('return-youtube-dislike-bar-container');
        const widthPx =
            getButtons().children[0].clientWidth +
            getButtons().children[1].clientWidth +
            8;
        const widthPercent = likes + dislikes > 0 ? (likes / (likes + dislikes)) * 100 : 50;
        var likePercentage = parseFloat(widthPercent.toFixed(1));
        const dislikePercentage = (100 - likePercentage).toLocaleString();
        likePercentage = likePercentage.toLocaleString();
        var tooltipInnerHTML;
        switch (extConfig.tooltipPercentageMode) {
            case 'dash_like':
                tooltipInnerHTML = `${likes.toLocaleString()}&nbsp;/&nbsp;${dislikes.toLocaleString()}&nbsp;&nbsp;-&nbsp;&nbsp;${likePercentage}%`;
                break;
            case 'dash_dislike':
                tooltipInnerHTML = `${likes.toLocaleString()}&nbsp;/&nbsp;${dislikes.toLocaleString()}&nbsp;&nbsp;-&nbsp;&nbsp;${dislikePercentage}%`;
                break;
            case 'both':
                tooltipInnerHTML = `${likePercentage}%&nbsp;/&nbsp;${dislikePercentage}%`;
                break;
            case 'only_like':
                tooltipInnerHTML = `${likePercentage}%`;
                break;
            case 'only_dislike':
                tooltipInnerHTML = `${dislikePercentage}%`;
                break;
            default:
                tooltipInnerHTML = `${likes.toLocaleString()}&nbsp;/&nbsp;${dislikes.toLocaleString()}`;
        }
        if (!rateBar && !isMobile) {
            let colorDislikeStyle = '';
            if (extConfig.coloredBar) {
                colorDislikeStyle = '; background-color: ' + getColorFromTheme(false);
            }
            document.getElementById('menu-container').insertAdjacentHTML(
                'beforeend',
                `
                    <div class="ryd-tooltip" style="width: ${widthPx}px">
                    <div class="ryd-tooltip-bar-container">
                        <div
                            id="return-youtube-dislike-bar-container"
                            style="width: 100%; height: 2px;${colorDislikeStyle}"
                            >
                            <div
                                id="return-youtube-dislike-bar"
                                style="width: ${widthPercent}%; height: 100%${colorDislikeStyle}"
                                ></div>
                        </div>
                    </div>
                    <tp-yt-paper-tooltip position="top" id="ryd-dislike-tooltip" class="style-scope ytd-sentiment-bar-renderer" role="tooltip" tabindex="-1">
                        <!--css-build:shady-->${tooltipInnerHTML}
                    </tp-yt-paper-tooltip>
                    </div>`
            );
        } else {
            document.getElementById(
                'return-youtube-dislike-bar-container'
            ).style.width = widthPx + 'px';
            document.getElementById('return-youtube-dislike-bar').style.width =
                widthPercent + '%';
            document.querySelector('#ryd-dislike-tooltip > #tooltip').innerHTML =
                tooltipInnerHTML;
            if (extConfig.coloredBar) {
                document.getElementById(
                    'return-youtube-dislike-bar-container'
                ).style.backgroundColor = getColorFromTheme(false);
                document.getElementById(
                    'return-youtube-dislike-bar'
                ).style.backgroundColor = getColorFromTheme(true);
            }
        }
    }

    function setState() {
        cLog('Fetching votes...');
        let statsSet = false;
        fetch(
            `https://returnyoutubedislikeapi.com/votes?videoId=${getVideoId()}`
        ).then((response) => {
            response.json().then((json) => {
                if (json && !('traceId' in response) && !statsSet) {
                    const { dislikes, likes } = json;
                    cLog(`Received count: ${dislikes}`);
                    likesvalue = likes;
                    dislikesvalue = dislikes;
                    setDislikes(numberFormat(dislikes));
                    if (extConfig.numberDisplayReformatLikes === true) {
                        const nativeLikes = getLikeCountFromButton();
                        if (nativeLikes !== false) {
                            setLikes(numberFormat(nativeLikes));
                        }
                    }
                    createRateBar(likes, dislikes);
                    if (extConfig.coloredThumbs === true) {
                        if (isShorts()) {
                            // for shorts, leave deactived buttons in default color
                            let shortLikeButton = getLikeButton().querySelector(
                                'tp-yt-paper-button#button'
                            );
                            let shortDislikeButton = getDislikeButton().querySelector(
                                'tp-yt-paper-button#button'
                            );
                            if (shortLikeButton.getAttribute('aria-pressed') === 'true') {
                                shortLikeButton.style.color = getColorFromTheme(true);
                            }
                            if (shortDislikeButton.getAttribute('aria-pressed') === 'true') {
                                shortDislikeButton.style.color = getColorFromTheme(false);
                            }
                            mutationObserver.observer.observe(
                                shortLikeButton,
                                mutationObserver.options
                            );
                            mutationObserver.observer.observe(
                                shortDislikeButton,
                                mutationObserver.options
                            );
                        } else {
                            getLikeButton().style.color = getColorFromTheme(true);
                            getDislikeButton().style.color = getColorFromTheme(false);
                        }
                    }
                }
            });
        });
    }

    function likeClicked() {
        if (checkForUserAvatarButton() == true) {
            if (previousState == 1) {
                likesvalue--;
                createRateBar(likesvalue, dislikesvalue);
                setDislikes(numberFormat(dislikesvalue));
                previousState = 3;
            } else if (previousState == 2) {
                likesvalue++;
                dislikesvalue--;
                setDislikes(numberFormat(dislikesvalue));
                createRateBar(likesvalue, dislikesvalue);
                previousState = 1;
            } else if (previousState == 3) {
                likesvalue++;
                createRateBar(likesvalue, dislikesvalue);
                previousState = 1;
            }
            if (extConfig.numberDisplayReformatLikes === true) {
                const nativeLikes = getLikeCountFromButton();
                if (nativeLikes !== false) { setLikes(numberFormat(nativeLikes)); }
            }
        }
    }

    function dislikeClicked() {
        if (checkForUserAvatarButton() == true) {
            if (previousState == 3) {
                dislikesvalue++;
                setDislikes(numberFormat(dislikesvalue));
                createRateBar(likesvalue, dislikesvalue);
                previousState = 2;
            } else if (previousState == 2) {
                dislikesvalue--;
                setDislikes(numberFormat(dislikesvalue));
                createRateBar(likesvalue, dislikesvalue);
                previousState = 3;
            } else if (previousState == 1) {
                likesvalue--;
                dislikesvalue++;
                setDislikes(numberFormat(dislikesvalue));
                createRateBar(likesvalue, dislikesvalue);
                previousState = 2;
                if (extConfig.numberDisplayReformatLikes === true) {
                    const nativeLikes = getLikeCountFromButton();
                    if (nativeLikes !== false) { setLikes(numberFormat(nativeLikes)); }
                }
            }
        }
    }

    function setInitialState() { setState(); }

    function getVideoId() {
        const urlObject = new URL(unsafeWindow.location.href);
        const pathname = urlObject.pathname;
        if (pathname.startsWith('/clip')) { return document.querySelector('meta[itemprop="videoId"]').content;
        } else {
            if (pathname.startsWith('/shorts')) { return pathname.slice(8); }
            return urlObject.searchParams.get('v');
        }
    }

    function isVideoLoaded() {
        if (isMobile) { return document.getElementById('player').getAttribute('loading') == 'false'; }
        const videoId = getVideoId();
        return ( document.querySelector(`ytd-watch-flexy[video-id='${videoId}']`) !== null );
    }

    function roundDown(num) {
        if (num < 1000) return num;
        const int = Math.floor(Math.log10(num) - 2);
        const decimal = int + (int % 3 ? 1 : 0);
        const value = Math.floor(num / 10 ** decimal);
        return value * 10 ** decimal;
    }

    function numberFormat(numberState) {
        let numberDisplay;
        if (extConfig.numberDisplayRoundDown === false) { numberDisplay = numberState;
        } else { numberDisplay = roundDown(numberState); }
        return getNumberFormatter(extConfig.numberDisplayFormat).format(numberDisplay);
    }

    function getNumberFormatter(optionSelect) {
        let userLocales;
        if (document.documentElement.lang) { userLocales = document.documentElement.lang;
        } else if (navigator.language) { userLocales = navigator.language;
        } else {
            try {
                userLocales = new URL(
                    Array.from(document.querySelectorAll('head > link[rel="search"]'))
                        ?.find((n) => n?.getAttribute('href')?.includes('?locale='))
                        ?.getAttribute('href')
                )?.searchParams?.get('locale');
            } catch {
                cLog('Cannot find browser locale. Use en as default for number formatting.');
                userLocales = 'en';
            }
        }
        let formatterNotation;
        let formatterCompactDisplay;
        switch (optionSelect) {
            case 'compactLong':
                formatterNotation = 'compact';
                formatterCompactDisplay = 'long';
                break;
            case 'standard':
                formatterNotation = 'standard';
                formatterCompactDisplay = 'short';
                break;
            case 'compactShort':
            default:
                formatterNotation = 'compact';
                formatterCompactDisplay = 'short';
        }
        const formatter = Intl.NumberFormat(userLocales, {
            notation: formatterNotation,
            compactDisplay: formatterCompactDisplay
        });
        return formatter;
    }

    function getColorFromTheme(voteIsLike) {
        let colorString;
        switch (extConfig.colorTheme) {
            case 'accessible':
                if (voteIsLike === true) {
                    colorString = 'dodgerblue';
                } else { colorString = 'gold'; }
                break;
            case 'neon':
                if (voteIsLike === true) {
                    colorString = 'aqua';
                } else { colorString = 'magenta'; }
                break;
            case 'classic':
            default:
                if (voteIsLike === true) {
                    colorString = 'lime';
                } else { colorString = 'red'; }
        }
        return colorString;
    }

    function setEventListeners() {
        let jsInitChecktimer;
        function checkForJS_Finish() {
            if (isShorts() || (getButtons()?.offsetParent && isVideoLoaded())) {
                const buttons = getButtons();
                if (!unsafeWindow.returnDislikeButtonlistenersSet) {
                    cLog('Registering button listeners...');
                    try {
                        buttons.children[0].addEventListener('click', likeClicked);
                        buttons.children[1].addEventListener('click', dislikeClicked);
                        buttons.children[0].addEventListener('touchstart', likeClicked);
                        buttons.children[1].addEventListener('touchstart', dislikeClicked);
                    } catch { return; }
                    unsafeWindow.returnDislikeButtonlistenersSet = true;
                }
                setInitialState();
                clearInterval(jsInitChecktimer);
            }
        }
        cLog('Setting up...');
        jsInitChecktimer = setInterval(checkForJS_Finish, 111);
    }

    (function() {
        unsafeWindow.addEventListener('yt-navigate-finish', setEventListeners, true);
        setEventListeners();
    })();
    if (isMobile) {
        let originalPush = history.pushState;
        history.pushState = function(...args) {
            unsafeWindow.returnDislikeButtonlistenersSet = false;
            setEventListeners(args[2]);
            return originalPush.apply(history, args);
        };
        setInterval(() => {
            if (getDislikeButton().querySelector('.button-renderer-text') === null) {
                getDislikeTextContainer().innerText = mobileDislikes;
            } else { getDislikeButton().querySelector('.button-renderer-text').innerText = mobileDislikes; }
        }, 1000);
    }

    // Remove homepage ads/rich sections
    if (location.pathname == '/') {
        new MutationObserver(() => {
            const adSlot = document.querySelector('ytd-ad-slot-renderer'),
                  richSection = document.querySelector('ytd-rich-section-renderer')
            if (adSlot) adSlot.closest('[rendered-from-rich-grid]')?.remove()
            else if (richSection) richSection.remove()
        }).observe(document.documentElement, { childList: true, subtree: true })
    }

})()
