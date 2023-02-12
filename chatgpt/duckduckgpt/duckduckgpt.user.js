// ==UserScript==
// @name             DuckDuckGPT 🤖
// @version          2023.02.11
// @author           Adam Lui
// @namespace        https://github.com/adamlui
// @description      Adds ChatGPT answers to DuckDuckGo sidebar
// @homepageURL      https://www.duckduckgpt.com
// @supportURL       https://github.com/adamlui/userscripts/issues
// @license          MIT
// @icon             https://raw.githubusercontent.com/adamlui/userscripts/master/duckduckgpt/images/ddgpt-icon48.png
// @icon64           https://raw.githubusercontent.com/adamlui/userscripts/master/duckduckgpt/images/ddgpt-icon64.png
// @compatible       chrome
// @compatible       firefox
// @match            https://duckduckgo.com/*
// @connect          chat.openai.com
// @grant            GM_deleteValue
// @grant            GM_getValue
// @grant            GM_setValue
// @grant            GM_info
// @grant            GM_xmlhttpRequest
// @updateURL        https://www.duckduckgpt.com/userscript/code/duckduckgpt.meta.js
// @downloadURL      https://www.duckduckgpt.com/userscript/code/duckduckgpt.user.js
// ==/UserScript==

var monkeyWindow = window
var GM_setValue = (() => window.GM_setValue)()
var GM_deleteValue = (() => window.GM_deleteValue)()
var GM_info = (() => monkeyWindow.GM_info)()
var GM_xmlhttpRequest = (() => window.GM_xmlhttpRequest)()
var GM_getValue = (() => window.GM_getValue)()

function getUserscriptManager() {
    try {
        const userscriptManager = GM_info.scriptHandler
        return userscriptManager
    } catch (error) { return "other" }
}

var alerts = {
    waitingResponse: "Waiting for ChatGPT response...",
    login: "Please login @ ",
    tooManyRequests: "ChatGPT is flooded with too many requests. Check back later!",
    checkCloudflare: "Please pass Cloudflare security check @ ",
    unknowError: "Oops, maybe it is a bug, please check or submit ",
    networkException: "Network exception, please refresh the page."
};

function uuidv4() {
    var s = [], hexDigits = "0123456789abcdef"
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 16), 1) }
    s[14] = "4"
    s[19] = hexDigits.substr(s[19] & 3 | 8, 1)
    s[8] = s[13] = s[18] = s[23] = "-"
    var uuid = s.join("")
    return uuid
}

function i18n(name, param) {
    return alerts[name] ? alerts[name].replace("#t#", param) : name }

var container = document.createElement("div")
function getContainer() { return container }

function containerShow(answer) {
    var container2 = getContainer()
    container2.innerHTML = '<p><span class="prefix">ChatGPT</span><pre></pre></p>'
    container2.querySelector("pre").textContent = answer
}

function containerAlert(htmlStr) {
    var container2 = getContainer()
    container2.innerHTML = htmlStr
}

function alertLogin() {
    containerAlert(`<p>${i18n("login")}<a href="https://chat.openai.com" target="_blank" rel="noreferrer">chat.openai.com</a></p>`) }

function alertBlockedByCloudflare() {
    containerAlert(`<p>${i18n("checkCloudflare")}<a href="https://chat.openai.com" target="_blank" rel="noreferrer">chat.openai.com</a></p>`) }

function alertFrequentRequests() {
    containerAlert(`<p>${i18n("tooManyRequests")}</p>`) }

function isBlockedbyCloudflare(resp) {
    try {
        var html = new DOMParser().parseFromString(resp, "text/html")
        var title = html.querySelector("title")
        return title.innerText === "Just a moment..."
    } catch (error) { return false }
}

async function getAnswer(question, callback) {
    try {
        var accessToken = await getAccessToken()
        GM_xmlhttpRequest({
            method: "POST",
            url: "https://chat.openai.com/backend-api/conversation",
            headers: {
                "Content-Type": "   application/json",
                Authorization: `Bearer ${accessToken}`
            },
            responseType: responseType(),
            data: JSON.stringify({
                action: "next",
                messages: [
                    {
                        id: uuidv4(),
                        role: "user",
                        content: {
                            content_type: "text",
                            parts: [question]
                        }
                    }
                ],
                model: "text-davinci-002-render",
                parent_message_id: uuidv4()
            }),
            onloadstart: onLoadStart(),
            onload: onLoad()
        })
    } catch (error) {
        if (error === "UNAUTHORIZED") {
            GM_deleteValue("accessToken")
            alertLogin()
        }
        console.error("getAnswer error: ", error)
    }
    function responseType() {
      if (getUserscriptManager() === "Tampermonkey") {
        return "stream" } else { return "text" }
    }
    function onLoad() {
        return function(event) {
            if (event.status === 401) { GM_deleteValue("accessToken") ; alertLogin() }
            if (event.status === 403) { alertBlockedByCloudflare() }
            if (event.status === 429) { alertFrequentRequests() }
            if (getUserscriptManager() !== "Tampermonkey") {
                if (event.response) {
                    const answer = JSON.parse(event.response
                        .split("\n\n").slice(-3, -2)[0].slice(6)).message.content.parts[0]
                    containerShow(answer)
        }}}
    }
    function onLoadStart() {
        if (getUserscriptManager() === "Tampermonkey") {
            return function(stream) {
                var reader = stream.response.getReader()
                reader.read().then(function processText({ done, value }) {
                    if (done) { return }
                    let responseItem = String.fromCharCode(...Array.from(value))
                    var items = responseItem.split("\n\n")
                    if (items.length > 2) {
                        var lastItem = items.slice(-3, -2)[0]
                        if (lastItem.startsWith("data: [DONE]")) {
                            responseItem = items.slice(-4, -3)[0]
                        } else { responseItem = lastItem }
                    }
                    if (responseItem.startsWith("data: {")) {
                        var answer = JSON.parse(responseItem.slice(6)).message.content.parts[0]
                        containerShow(answer)
                    } else if (responseItem.startsWith("data: [DONE]")) { return }
                    return reader.read().then(processText)
    })}}}
}

function getAccessToken() {
    return new Promise(async (resolve, rejcet) => {
        var accessToken = await GM_getValue("accessToken")
        if (!accessToken) {
            GM_xmlhttpRequest({
                url: "https://chat.openai.com/api/auth/session",
                onload: function(response) {
                    if (isBlockedbyCloudflare(response.responseText)) {
                        alertLogin() ; return }
                    var accessToken2 = JSON.parse(response.responseText).accessToken;
                    if (!accessToken2) { rejcet("UNAUTHORIZED") }
                    GM_setValue("accessToken", accessToken2)
                    resolve(accessToken2)
                },
                onerror: function(error) { rejcet(error) },
                ontimeout: () => { console.error("getAccessToken timeout!") }
            })
        } else { resolve(accessToken) }
})}

// Stylize ChatGPT container to match DDG's
var css = `
    .chatgpt-container { border-radius: 8px ; border: 1px solid #dadce0 ; padding: 15px ; flex-basis: 0 ;
        flex-grow: 1 ; word-wrap: break-word ; white-space: pre-wrap ; box-shadow: 0 2px 3px rgba(0, 0, 0, 0.06) }
    .chatgpt-container p { margin: 0 }
    .chatgpt-container .prefix { font-weight: 700 }
    .chatgpt-container .loading { color: #b6b8ba ; animation: pulse 2s cubic-bezier(.4,0,.6,1) infinite }
    .chatgpt-container.sidebar-free { margin-left: 60px ; height: fit-content }
    .chatgpt-container pre { white-space: pre-wrap ; min-width: 0 ; margin-bottom: 0 ; line-height: 20px }
    @keyframes pulse { 0%, to { opacity: 1 } 50% { opacity: .5 }}
    .chatgpt-feedback { margin: 2px 0 25px 0 }`
var styleNode = document.createElement('style') ; styleNode.innerText = css
document.head.appendChild(styleNode)

// Run injection function
async function main() {

        // Initialize container
        var container2 = getContainer();
        container2.className = "chatgpt-container";
        container2.innerHTML = `<p class="loading">${i18n("waitingResponse")}</p>`;

        // Initialize feedback link
        var container3 = document.createElement("div");
        container3.className = "feedback-prompt chatgpt-feedback";
        container3.innerHTML = `<a href="https://github.com/adamlui/userscripts/discussions/new/choose" class="feedback-prompt__link" target="_blank">Share Feedback</a>`;

        // Inject container + feedback link
        var siderbarContainer = document.getElementsByClassName("results--sidebar")[0];
        siderbarContainer.prepend(container2, container3);
        getAnswer(new URL(window.location.href).searchParams.get("q"));

} ; main()
