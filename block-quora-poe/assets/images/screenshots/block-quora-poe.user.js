// ==UserScript==
// @name                Block Quora Poe
// @name:zh             屏蔽 Quora Poe
// @name:zh-CN          屏蔽 Quora Poe
// @name:zh-HK          屏蔽 Quora Poe
// @name:zh-SG          屏蔽 Quora Poe
// @name:zh-TW          屏蔽 Quora Poe
// @description         Block low-quality AI answers from Quora
// @description:zh      屏蔽 Quora 上的低质量 AI 答案
// @description:zh-CN   屏蔽 Quora 上的低质量 AI 答案
// @description:zh-HK   屏蔽 Quora 上的低品質 AI 答案
// @description:zh-SG   屏蔽 Quora 上的低质量 AI 答案
// @description:zh-TW   屏蔽 Quora 上的低品質 AI 答案
// @author              Adam Lui
// @namespace           https://github.com/adamlui
// @version             2025.8.10
// @license             MIT
// @icon                https://cdn.jsdelivr.net/gh/adamlui/userscripts@f3e6bf0/assets/images/icons/sites/quora/icon64.png
// @match               *://*.quora.com/*
// @exclude             *://*.quora.com/answer/*
// @exclude             *://*.quora.com/profile/*
// @grant               GM_addStyle
// @run-at              document-start
// @downloadURL         https://raw.githubusercontent.com/adamlui/userscripts/master/block-quora-poe/block-quora-poe.user.js
// @updateURL           https://raw.githubusercontent.com/adamlui/userscripts/master/block-quora-poe/block-quora-poe.user.js
// @homepageURL         https://github.com/adamlui/userscripts/tree/master/block-quora-poe
// @supportURL          https://github.com/adamlui/userscripts/issues
// @contributionURL     https://github.com/sponsors/adamlui
// ==/UserScript==

GM_addStyle('div[class*="dom_annotate"]:has(img.q-image[src*="assets.images.poe"]) { display: none }')
