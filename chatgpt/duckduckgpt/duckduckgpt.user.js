// ==UserScript==
// @name                DuckDuckGPT 🤖
// @version             2023.03.29
// @description         Adds ChatGPT answers to DuckDuckGo sidebar
// @author              Adam Lui
// @namespace           https://github.com/adamlui
// @description:zh-CN   将 ChatGPT 答案添加到 DuckDuckGo 侧边栏
// @description:zh-SG   将 ChatGPT 答案添加到 DuckDuckGo 侧边栏
// @description:zh-TW   將 ChatGPT 答案添加到 DuckDuckGo 側邊欄
// @description:zh-HK   將 ChatGPT 答案添加到 DuckDuckGo 側邊欄
// @description:ja      ChatGPT の回答を DuckDuckGo サイドバーに追加します
// @description:ko      DuckDuckGo 사이드바에 ChatGPT 답변 추가
// @description:ru      Добавляет ответы ChatGPT на боковую панель DuckDuckGo
// @description:de      Fügt ChatGPT-Antworten zur Seitenleiste von DuckDuckGo hinzu
// @description:es      Agrega respuestas de ChatGPT a la barra lateral de DuckDuckGo
// @description:fr      Ajoute les réponses ChatGPT à la barre latérale DuckDuckGo
// @description:it      Aggiunge le risposte di ChatGPT alla barra laterale di DuckDuckGo
// @license             MIT
// @icon                https://raw.githubusercontent.com/adamlui/userscripts/master/chatgpt/duckduckgpt/media/images/ddgpt-icon48.png
// @icon64              https://raw.githubusercontent.com/adamlui/userscripts/master/chatgpt/duckduckgpt/media/images/ddgpt-icon64.png
// @compatible          chrome
// @compatible          firefox
// @compatible          edge
// @compatible          opera
// @compatible          brave
// @compatible          vivaldi
// @compatible          librewolf
// @compatible          qq
// @match               https://duckduckgo.com/*
// @include             https://auth0.openai.com
// @connect             chat.openai.com
// @grant               GM.deleteValue
// @grant               GM.getValue
// @grant               GM.setValue
// @grant               GM.xmlHttpRequest
// @grant               GM_cookie
// @downloadURL         https://www.duckduckgpt.com/userscript/code/duckduckgpt.user.js
// @updateURL           https://www.duckduckgpt.com/userscript/code/duckduckgpt.meta.js
// @homepageURL         https://www.duckduckgpt.com
// @supportURL          https://github.duckduckgpt.com/issues
// ==/UserScript==

var GM_setValue = (() => GM.setValue)()
var GM_deleteValue = (() => GM.deleteValue)()
var GM_xmlhttpRequest = (() => GM.xmlHttpRequest)()
var GM_getValue = (() => GM.getValue)()

function getUserscriptManager() {
    try { return GM_info.scriptHandler } catch (error) { return "other" }}

function deleteOpenAIcookies() {
    if (getUserscriptManager() !== "Tampermonkey") return
    var openAIauthURL = 'https://auth0.openai.com'
    GM_cookie.list({ url: openAIauthURL }, function(cookies, error) {
        if (!error) { for (var i = 0; i < cookies.length; i++) {
            GM_cookie.delete({ url: openAIauthURL, name: cookies[i].name })
}}})}

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

var container = document.createElement("div")
function getContainer() { return container }

var alerts = {
    waitingResponse: "Waiting for ChatGPT response...",
    login: "Please login @ ",
    tooManyRequests: "ChatGPT is flooded with too many requests. Check back later!",
    checkCloudflare: "Please pass Cloudflare security check @ ",
    unknowError: "An unknown error has occurred",
    networkException: "Network exception, please refresh the page",
}
function chatGPTalert(msg) {
    if (msg.includes('login')) deleteOpenAIcookies()
    container.innerHTML = (
        /waiting|loading/i.test(msg) ? // if alert involves loading, add class
            '<p class="loading">' : '<p>') + alerts[msg]
        + (alerts[msg].includes('@') ? // if msg needs a link, add it
            '<a href="https://chat.openai.com" target="_blank">chat.openai.com</a></p>' : '</p>')
}

function containerShow(answer) {
    var container2 = getContainer()
    container2.innerHTML = '<p><span class="prefix">ChatGPT</span><pre></pre></p>'
    container2.querySelector("pre").textContent = answer
}

function containerAlert(htmlStr) {
    var container2 = getContainer()
    container2.innerHTML = htmlStr
}

function isBlockedbyCloudflare(resp) {
    try {
        var html = new DOMParser().parseFromString(resp, "text/html")
        var title = html.querySelector("title")
        return title.innerText === "Just a moment..."
    } catch (error) { return false }
}

var timeoutPromise = new Promise((resolve, reject) => {
  setTimeout(() => { reject(new Error('Timeout occurred')) }, 3000) })

async function getAnswer(question, callback) {
    try {
        var accessToken = await Promise.race([getAccessToken(), timeoutPromise])
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
            chatGPTalert('login')
        }
        console.error("getAnswer error: ", error)
    }
    function responseType() {
      if (getUserscriptManager() === "Tampermonkey") {
        return "stream" } else { return "text" }
    }
    function onLoad() {
        return function(event) {
            if (event.status === 401) { GM_deleteValue("accessToken") ; chatGPTalert('login') }
            if (event.status === 403) { chatGPTalert('checkCloudflare') }
            if (event.status === 429) { chatGPTalert('tooManyRequests') }
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
                        chatGPTalert('login') ; return }
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
        var container2 = getContainer()
        container2.className = "chatgpt-container"
        chatGPTalert('waitingResponse')

        // Initialize feedback link
        var container3 = document.createElement("div")
        container3.className = "feedback-prompt chatgpt-feedback"
        container3.innerHTML = `<a href="https://github.com/adamlui/userscripts/discussions/new/choose" class="feedback-prompt__link" target="_blank">Share Feedback</a>`

        // Inject container + feedback link
        var siderbarContainer = document.getElementsByClassName("results--sidebar")[0]
        siderbarContainer.prepend(container2, container3)
        getAnswer(new URL(window.location.href).searchParams.get("q"))

} ; main()
