// ==UserScript==
// @name         ChatGPT Width Pro.js
// @namespace    http://tampermonkey.net/
// @version      0.1
// @grant       none
// @version     1.0
// @grant       unsafeWindow
// @run-at      document-start
// @author      bitmunja & github.com @XiaoYingYo
// @require     https://raw.githubusercontent.com/XiaoYingYo/ScriptModule/main/module_jquery.js
// @require     https://raw.githubusercontent.com/XiaoYingYo/ScriptModule/main/module.js
// @license MIT
// @match        https://chat.openai.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

global_module = window["global_module"];
var $ = window["$$$"];

unsafeWindow.addGlobalStyle = function (id, css) {
    if ($('#' + id).length > 0) { 
        return;
    }
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.id = id;
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

async function Process() {
    await global_module.waitForElement("main[class^='relative ']", null, null, 100, -1);
    unsafeWindow.addGlobalStyle("ChatGPT Width Pro", '.text-base { max-width: 98% !important; }');
}

(function () {
    Process();
})();