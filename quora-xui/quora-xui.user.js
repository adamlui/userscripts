// ==UserScript==
// @name                Quora XUI
// @name:zh             Quora XUI
// @name:zh-CN          Quora XUI
// @name:zh-HK          Quora XUI
// @name:zh-SG          Quora XUI
// @name:zh-TW          Quora XUI
// @description         Block low-quality AI answers from Quora
// @description:zh      屏蔽 Quora 上的低质量 AI 答案
// @description:zh-CN   屏蔽 Quora 上的低质量 AI 答案
// @description:zh-HK   屏蔽 Quora 上的低品質 AI 答案
// @description:zh-SG   屏蔽 Quora 上的低质量 AI 答案
// @description:zh-TW   屏蔽 Quora 上的低品質 AI 答案
// @author              Adam Lui
// @namespace           https://github.com/adamlui
// @version             2025.8.17
// @license             MIT
// @icon                https://cdn.jsdelivr.net/gh/adamlui/userscripts@f3e6bf0/assets/images/icons/sites/quora/icon64.png
// @match               *://*.quora.com/*
// @exclude             *://*.quora.com/answer/*
// @exclude             *://*.quora.com/profile/*
// @grant               GM_addStyle
// @run-at              document-start
// @downloadURL         https://raw.githubusercontent.com/adamlui/userscripts/master/quora-xui/quora-xui.user.js
// @updateURL           https://raw.githubusercontent.com/adamlui/userscripts/master/quora-xui/quora-xui.user.js
// @homepageURL         https://github.com/adamlui/userscripts/tree/master/quora-xui
// @supportURL          https://github.com/adamlui/userscripts/issues
// @contributionURL     https://github.com/sponsors/adamlui
// ==/UserScript==

GM_addStyle('div[class*="dom_annotate"]:has(img.q-image[src*="assets.images.poe"]) { display: none }')
