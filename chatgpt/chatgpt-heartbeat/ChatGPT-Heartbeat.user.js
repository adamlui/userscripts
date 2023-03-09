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
        let html = "<div id='_MaskLayer_' style='position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); z-index: 999999999;'><div style='position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: white; font-size: 20px; font-weight: bold;'>ChatGPT Checking whether you are a man-machine, please wait a moment, we are providing you with a better user experience in automation<br>If you stay here for a long time, please refresh the page directly!<br><br>ChatGPT 正在检测您是不是人机,请稍等,我们正在自动化为您提供更好的用户体验<br>如果您久留,请直接刷新页面!</div></div>";
        $("body").eq(0).append(html);
    },
    hide: function () {
        $("div#_MaskLayer_").eq(0).remove();
    },
}

let GlobalVariable = {};
GlobalVariable["NetworkErrorClass"] = "flex flex-col items-start gap-4 whitespace-pre-wrap flex flex-row gap-2 text-red-500";

unsafeWindow["ChatGPTHeartbeat.user.function"] = {};

unsafeWindow["ChatGPTHeartbeat.user.function"]["PostMessage"] = function (message) {
    let code = message.code;
    let data = message.data;
    if (code == 0001) {
        let primaryBtn = GlobalVariable["primaryBtn"];
        let openIframe = GlobalVariable["openIframe"];
        let MainElement = GlobalVariable["MainElement"];
        if (primaryBtn != null) {
            global_module.clickElement($(primaryBtn)[0]);
            primaryBtn = null;
        } else {
            (async function () {
                let NetworkErrorElement = await FindNetworkErrorElement(false);
                if (NetworkErrorElement == null) {
                    return;
                }
                let primaryBtn = await FindPrimaryBtn(NetworkErrorElement);
                if (primaryBtn == null) {
                    return;
                }
                global_module.clickElement($(primaryBtn)[0]);
            })();
        };
        if (openIframe != null) {
            openIframe.remove();
            openIframe = null;
        }
        if (MainElement != null) {
            $(MainElement).show();
            MainElement = null;
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
    let that = this;
    GlobalVariable["MainElement"] = await global_module.waitForElement("main[class^='relative ']", null, null, 100, -1);
    if (!force) {
        await FindPrimaryBtn();
    }
    $(GlobalVariable["MainElement"]).hide();
    that.createiframe = function () {
        let that = this;
        let iframe = document.createElement("iframe");
        iframe.src = "https://chat.openai.com/";
        iframe.style.width = "100%";
        iframe.style.height = "100%";
        iframe.style.display = "block";
        $(GlobalVariable["MainElement"]).after(iframe);
        that.reset = async function () {
            iframe.remove();
            await new Promise(async (resolve) => { setTimeout(resolve, 1000); });
            that.createiframe();
        }
        let interval = setInterval(() => {
            try {
                let href = $(iframe)[0].contentWindow.location.href;
                if (href == null) {
                    that.reset();
                }
            } catch (e) {
                let ee = e.toString();
                if (ee.indexOf("Blocked a frame with origin") != -1 && ee.indexOf("from accessing a cross-origin frame") != -1) {
                    clearInterval(interval);
                    that.reset();
                }
            }
        }, 5000);
        GlobalVariable["openIframe"] = iframe;
    };
    that.createiframe();
}

async function FindPrimaryBtn(NetworkErrorElement) {
    return new Promise(async (resolve) => {
        if (NetworkErrorElement == null) {
            NetworkErrorElement = GlobalVariable["NetworkErrorElement"];
        }
        if (NetworkErrorElement == null) {
            resolve(null);
            return null;
        }
        let w_full = "div[class^='w-full']";
        let LastMessageParent = $(NetworkErrorElement).parents(w_full).eq(0);
        let LastMessageElement = $(LastMessageParent).prev(w_full).eq(0);
        let buttons = $(LastMessageElement).find("button");
        for (let i = 0; i < buttons.length; i++) {
            let button = buttons.eq(i);
            let classStr = button.attr("class");
            let title = button.attr("title") || "";
            let svg = button.find("svg").eq(0);
            let svg_stroke = svg.attr("stroke-linejoin") || "";
            if (classStr.indexOf("rounded-md") != -1 && title == "" && svg_stroke == "round") {
                button.click();
                break;
            }
        }
        let primaryBtn = await global_module.waitForElement("button[class*='btn-primary']", null, null, 100, -1, LastMessageElement);
        primaryBtn = $(primaryBtn).eq(0);
        GlobalVariable["primaryBtn"] = primaryBtn;
        resolve(primaryBtn);
    });
}

async function FindAndDealWith() {
    return new Promise(async (resolve) => {
        await MaskLayerDisappear();
        let NetworkErrorElement = await FindNetworkErrorElement(true);
        let Check = await PassTest();
        if (Check) {
            // Explain that this NetworkErrorElement does not prompt a network error, but other related red warnings. In order to prevent repeated discovery of NetworkErrorElement, its `class` feature should be changed so that it does not meet the conditions.
            // 说明这个 NetworkErrorElement 并不是提示网络错误,而是其他相关的红色警告,为了防止重复找到 NetworkErrorElement,应该改变它的`类`特征,使它不符合条件成立
            NetworkErrorElement.attr("class", NetworkErrorElement.attr("class").replace("-red-", "-"));
            resolve();
            return;
        }
        MaskLayer.show();
        OpenNewChatGPTIniframe(false);
        resolve();
    });
}

async function FindNetworkErrorElement(wait) {
    let timeOut = 1000;
    if (wait) {
        timeOut = -1;
    }
    let Element = await global_module.waitForElement("div[class*='" + GlobalVariable["NetworkErrorClass"] + "']", null, null, 500, timeOut);
    if (Element == null) {
        return null;
    }
    GlobalVariable["NetworkErrorElement"] = Element;
    return Element;
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

async function PassTest() {
    let CheckURL = "/chat";
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
}

async function CheckInspection() {
    while (true) {
        let Check = await PassTest();
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
    if (window != window.parent) {
        unsafeWindow.parent["ChatGPTHeartbeat.user.function"].PostMessage({ "code": 0001, "data": {} });
    }
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
