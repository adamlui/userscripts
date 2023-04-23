// ==UserScript==
// @name        Pikpak Enhance
// @namespace   Violentmonkey Scripts
// @match       *://mypikpak.com/drive/*
// @grant       none
// @version     1.0
// @grant       GM_info 
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_addStyle
// @grant       GM_deleteValue
// @grant       GM_xmlhttpRequest
// @grant       GM_setClipboard
// @grant       GM_registerMenuCommand
// @grant       GM_unregisterMenuCommand
// @grant       GM_getResourceText
// @grant       GM_getResourceURL
// @grant       GM_openInTab
// @grant       unsafeWindow
// @run-at      document-start
// @author      github.com @XiaoYingYo
// @require     https://raw.githubusercontent.com/XiaoYingYo/ScriptModule/main/module_jquery.js
// @require     https://raw.githubusercontent.com/XiaoYingYo/ScriptModule/main/module.js
// @description 2023/4/23 20:06:50
// ==/UserScript==

var global_module = window["global_module"];
var $ = window["$$$"];

var GlobalVariable = {};

async function DealWithoverlay(i) {
    return new Promise(async (resolve) => {
        let overlay = $("div.el-overlay:not([style*='display'])").eq(0);
        if (overlay.length === 0) {
            resolve();
            return;
        }
        switch (i) {
            case 0:
                overlay.find("button[class*='is-text']").eq(0).click();
                break;
            case 1:
                overlay.find("button[class*='--primary']").eq(0).click();
                break;
        }
        overlay.hide();
        resolve();
    });
}

async function LiClick() {
    let activeLiHref = GlobalVariable.activeLi.attr("href");
    let that = $(this).find("a").eq(0);
    let thisHref = that.attr("href");
    if (activeLiHref == thisHref) {
        return;
    }
    GlobalVariable.activeLi = that;
    clearInterval(GlobalVariable.FindLiActiveInterval);
    $("ul[class^='context-menu']").remove();
    await new Promise((resolve) => {
        GlobalVariable.FindLiActiveInterval = setInterval(() => {
            if (that.attr("class").indexOf("active") != -1) {
                clearInterval(GlobalVariable.FindLiActiveInterval);
                resolve();
            }
        }, 100);
    });
    MonitorMenu();
}

GlobalVariable.MonitorMenuClickFun = global_module.debounce(MonitorMenuClick, 100);

async function MonitorMenuClick() {
    let Download = GlobalVariable.language["download"];
    let Delete = GlobalVariable.language["i18n-delete"];
    let DeletePermanently = GlobalVariable.language["delete-permanently"];
    let DownloadElement = GlobalVariable.menu.find("li[aria-label='" + Download + "']").eq(0);
    let DeleteElement = GlobalVariable.menu.find("li[aria-label='" + Delete + "']").eq(0);
    let DeletePermanentlyElement = GlobalVariable.menu.find("li[aria-label='" + DeletePermanently + "']").eq(0);
    if (DownloadElement.length != 0) {
        DownloadElement.on("click", async function () {
            DealWithoverlay(0);
        });
    }
    if (DeleteElement.length != 0) {
        DeleteElement.on("click", function () {
            DealWithoverlay(1);
        });
    }
    if (DeletePermanentlyElement.length != 0) {
        DeletePermanentlyElement.on("click", function () {
            DealWithoverlay(1);
        });
    }
}

async function MonitorMenu() {
    let menu = await global_module.waitForElement("ul[class^='context-menu']", null, null, 100);
    if (menu.html() != "") {
        return;
    }
    GlobalVariable.menu = menu;
    $(menu).on("DOMSubtreeModified", GlobalVariable.MonitorMenuClickFun);
}

async function FindStr(obj) {
    return new Promise((resolve) => {
        if (Array.isArray(obj)) {
            obj.forEach(function (item) {
                FindStr(item);
            });
        } else if (typeof obj === 'object' && obj !== null) {
            Object.keys(obj).forEach(function (key) {
                var value = obj[key];
                if (typeof value === 'function') {
                    let scriptStr = value.toString();
                    if (scriptStr.indexOf("e.exports=JSON.parse") != -1) {
                        scriptStr = scriptStr.replace("e.exports=", "window['__language__'] = ");
                        scriptStr = "(" + scriptStr + ")()";
                        let func = new Function(scriptStr);
                        func();
                        GlobalVariable.language = unsafeWindow.__language__;
                        resolve();
                        return;
                    }
                } else {
                    FindStr(value);
                }
            });
        }
        resolve();
    });
}

async function main() {
    let nav = await global_module.waitForElement("ul[class='nav']", null, null, 100, -1);
    await FindStr(unsafeWindow.webpackChunkxlco_pikpak_web);
    GlobalVariable.nav = nav;
    let activeLi = await global_module.waitForElement("a[class^='active']", null, null, 100, -1, nav);
    GlobalVariable.activeLi = activeLi;
    nav.find("li").on("click", LiClick);
    MonitorMenu();
}

main();