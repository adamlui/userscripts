// ==UserScript==
// @name        ChatGPT Heartbeat
// @namespace   Violentmonkey Scripts
// @match       *://chat.openai.com/*
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
// @grant       unsafeWindow
// @run-at      document-start
// @author      github.com @XiaoYingYo
// @require     https://raw.githubusercontent.com/XiaoYingYo/ScriptModule/main/module_jquery.js
// @require     https://raw.githubusercontent.com/XiaoYingYo/ScriptModule/main/module.js
// @icon        https://www.google.com/s2/favicons?sz=48&domain=openai.com
// @icon64      https://www.google.com/s2/favicons?sz=64&domain=openai.com
// @description 2023-3-6 13:25:06
// ==/UserScript==

var global_module = window["global_module"];
var $ = window["$$$"];

let cookiescache = {};

MaskLayer = {
    show: function () {
        if (MaskLayerIsExist()) {
            return;
        }
        let html = "<div id='_MaskLayer_' style='position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); z-index: 999999999;'><div style='position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: white; font-size: 20px; font-weight: bold;'>ChatGPT Checking whether you are a man-machine, please wait a moment, we are providing you with a better user experience in automation</div></div>";
        $("body").eq(0).append(html);
    },
    hide: function () {
        $("div#_MaskLayer_").eq(0).remove();
    },
}

function getCookie(name, force) {
    if (name == null || name.length == 0) {
        return null;
    }
    if (!force) {
        if (cookiescache[name] != null) {
            return cookiescache[name];
        }
    }
    let cookies = document.cookie;
    let cookieArray = cookies.split(";");
    for (let i = 0; i < cookieArray.length; i++) {
        let kv = cookieArray[i].split("=");
        cookiescache[kv[0].trim()] = kv[1];
    }
    return cookiescache[name];
}

function setCookie(name, value, expire) {
    if (expire == null) {
        expire = 10 * 365 * 24 * 60 * 60 * 1000;
    }
    let date = new Date();
    date.setTime(date.getTime() + expire);
    document.cookie = name + "=" + value + ";expires=" + date.toGMTString();
    cookiescache[name] = value;
}

function getCommunicationID() {
    let communicationID = getCookie("communicationID");
    if (communicationID == null) {
        communicationID = Math.random();
        setCookie("communicationID", communicationID);
    }
    return communicationID;
}

let channel = new BroadcastChannel(getCommunicationID());

let GlobalVariable = {};

channel.onmessage = function (e) {
    let message = JSON.parse(e.data);
    if (typeof message == "string") {
        message = JSON.parse(message);
    }
    let code = message.code;
    let data = message.data;
    if (code == 0001) {
        let primaryBtn = GlobalVariable["primaryBtn"];
        let openIframe = GlobalVariable["openIframe"];
        if (primaryBtn != null) {
            global_module.clickElement($(primaryBtn)[0]);
            primaryBtn = null;
        }
        if (openIframe != null) {
            openIframe.remove();
            openIframe = null;
        }
        MaskLayer.hide();
    }
}

function errorToLog() {
    // This can force a large number of errors related to the oil monkey script on the page. In fact, these errors are basically caused by conflicts with ChatGPT's official JS files, and in fact they do not affect the normal use of the oil monkey script and ChatGPT.
    // 这样可以强制在页面上 存在大量与油猴脚本的错误,其实这些错误基本都是与ChatGPT官方的JS文件有所冲突导致的,实际上都不影响油猴脚本和ChatGPT的正常使用
    console.error = function () {
        console.log(arguments);
    };
}

function MaskLayerIsExist() {
    return $("div#_MaskLayer_").length > 0;
}

async function MaskLayerDisappear() {
    return await new Promise((resolve) => {
        let interval = setInterval(() => {
            if (!MaskLayerIsExist()) {
                clearInterval(interval);
                resolve();
            }
        }, 500);
    });
}

async function OpenNewChatGPTIniframe(force) { 
    if (!force) {
        if (GlobalVariable["NetworkErrorElement"] == null) {
            return;
        }
        let w_full = "div[class^='w-full']";
        let LastMessageParent = $(GlobalVariable["NetworkErrorElement"]).parents(w_full).eq(0);
        GlobalVariable["NetworkErrorElement"] = null;
        let LastMessageElement = $(LastMessageParent).prev(w_full).eq(0);
        let buttons = $(LastMessageElement).find("button");
        for (let i = 0; i < buttons.length; i++) {
            let button = buttons.eq(i);
            let classStr = button.attr("class");
            if (classStr.indexOf("rounded-md") != -1) {
                button.click();
                break;
            }
        }
        GlobalVariable["primaryBtn"] = await global_module.waitForElement("button[class*='btn-primary']", null, null, 100, -1, LastMessageElement);
    }
    let iframe = document.createElement("iframe");
    iframe.src = "https://chat.openai.com/";
    iframe.style.display = "none";
    document.body.appendChild(iframe);
    GlobalVariable["openIframe"] = iframe;
}

async function FindAndDealWith() {
    return new Promise(async (resolve) => {
        await MaskLayerDisappear();
        let NetworkErrorClass = "flex flex-col items-start gap-4 whitespace-pre-wrap flex flex-row gap-2 text-red-500";
        GlobalVariable["NetworkErrorElement"] = await global_module.waitForElement("div[class*='" + NetworkErrorClass + "']", null, null, 500, -1);
        let Text = $(NetworkErrorElement).html();
        if (Text.indexOf("help.") == -1 || Text.indexOf(".com") == -1) {
            resolve();
            return;
        }
        MaskLayer.show();
        OpenNewChatGPTIniframe(false);
        resolve();
    });
}

function isChatGPT() {
    let meta = $("meta[property='og:title']");
    if (meta.length == 0) {
        return false;
    }
    let content = meta.attr("content");
    if (content == "ChatGPT") {
        return true;
    }
    return false;
}

async function CheckInspection() {
    let that = this;
    let CheckURL = "/chat";
    that.Inspection = async function () {
        return new Promise(async (resolve) => {
            let res = null;
            try {
                res = await fetch(CheckURL, {
                    method: 'GET',
                    mode: 'no-cors',
                    cache: 'no-cache',
                });
            } catch (e) {
                console.log(e);
            }
            if (res == null) {
                resolve(false);
                return false;
            }
            let status = res.status;
            if (status != 200) {
                resolve(false);
                return false;
            }
            let html = await res.text();
            if (html.indexOf(">Redirecting...</p>") != -1) {
                resolve(false);
                return false;
            }
            resolve(true);
            return true;
        });
    };
    while (true) {
        let Check = await that.Inspection();
        if (!Check) {
            if (!MaskLayerIsExist()) {
                MaskLayer.show();
                OpenNewChatGPTIniframe(true);
            }
            await MaskLayerDisappear();
        }
        await new Promise((resolve) => setTimeout(resolve, 8888));
    }
}

async function Main() {
    if (!isChatGPT()) {
        return;
    }
    channel.postMessage(JSON.stringify({ "code": 0001, "data": {} }));
    CheckInspection();
    $(document).ready(async function () {
        errorToLog();
    });
    while (true) {
        await FindAndDealWith();
        await new Promise((resolve) => setTimeout(resolve, 3000));
    }
}

Main();
