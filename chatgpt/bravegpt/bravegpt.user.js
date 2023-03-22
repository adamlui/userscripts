// ==UserScript==
// @name             BraveGPT 🤖
// @version          2023.03.22
// @author           Adam Lui
// @namespace        https://github.com/adamlui
// @description      Adds ChatGPT answers to Brave Search sidebar
// @homepageURL      https://www.bravegpt.com
// @supportURL       https://github.com/adamlui/userscripts/issues
// @license          MIT
// @icon             https://brave.com/static-assets/images/brave-favicon.png
// @compatible       chrome
// @compatible       firefox
// @compatible       edge
// @compatible       opera
// @compatible       brave
// @compatible       vivaldi
// @compatible       librewolf
// @compatible       qq
// @match            https://search.brave.com/*
// @include          https://auth0.openai.com
// @connect          chat.openai.com
// @grant            GM.deleteValue
// @grant            GM.getValue
// @grant            GM.setValue
// @grant            GM.info
// @grant            GM.xmlHttpRequest
// @grant            GM_cookie
// @downloadURL      https://bravegpt.com/userscript/code/bravegpt.user.js
// @updateURL        https://bravegpt.com/userscript/code/bravegpt.user.js
// ==/UserScript==

var GM_deleteValue = (() => GM.deleteValue)()
var GM_info = (() => GM.info)()
var GM_xmlhttpRequest = (() => GM.xmlHttpRequest)()
var GM_getValue = (() => GM.getValue)()
var GM_setValue = (() => GM.setValue)()

// Stylize ChatGPT container + children
var styleNode = document.createElement('style')
styleNode.innerText = `
    .chatgpt-container { word-wrap: break-word ; white-space: pre-wrap ; margin-bottom: 20px }
    .chatgpt-container p { margin: 0 }
    .chatgpt-container .chatgpt-icon { position: relative ; bottom: -4px ; margin-right: 11px }
    .chatgpt-container .prefix { font-size: 20px ; font-family: var(--brand-font) }
    .chatgpt-container .loading { color: #b6b8ba ; animation: pulse 2s cubic-bezier(.4,0,.6,1) infinite }
    .chatgpt-container pre { /* ChatGPT output box */
        /* text spacing */ white-space: pre-wrap ; line-height: 21px ;
        font-family: Consolas, Menlo, Monaco, monospace ;
        /* box spacing */ padding: 0.55em ; margin: .5em 0 ; border-radius: 5px ;
        background-color: #eaeaea
    }
    .chatgpt-container .footer {
        margin: 20px 0 -32px 0 ; padding-top: 17px !important ;
        justify-content: right !important
    }
    .chatgpt-container .footer a { margin-right: -22px /* to counter .snippet padding */ }
    @keyframes pulse { 0%, to { opacity: 1 } 50% { opacity: .5 }}`
document.head.appendChild(styleNode) // append style to <head>

// Create ChatGPT container & add classes
var chatGPTcontainer = document.createElement('div') // create container div
chatGPTcontainer.setAttribute('id', 'infobox')
chatGPTcontainer.setAttribute( // assign Brave's .snippet + custom class
    'class', 'snippet chatgpt-container')

// Create feedback footer & add HTML
var chatGPTfooter = document.createElement('div') // create footer div
chatGPTfooter.setAttribute('class', 'footer')
chatGPTfooter.innerHTML = `<a class="feedback svelte-8js1iq" target="_blank" href="https://github.com/adamlui/userscripts/discussions/new/choose"><svg class="icon" xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15"><path fill-rule="evenodd" d="M.577 6.23a.577.577 0 1 1 0-1.153H1.5a.577.577 0 0 1 0 1.154H.577ZM2.83 8.939a.576.576 0 0 1 0 .816l-1.385 1.385a.573.573 0 0 1-.816 0 .576.576 0 0 1 0-.816l1.385-1.385a.577.577 0 0 1 .816 0ZM.63.985a.576.576 0 1 1 .815-.816L2.83 1.553a.576.576 0 1 1-.816.816L.63.985ZM15 5.654a.577.577 0 0 1-.577.577H13.5a.577.577 0 0 1 0-1.154h.923c.319 0 .577.258.577.577Zm-.631 4.669a.576.576 0 1 1-.816.816l-1.385-1.385a.576.576 0 1 1 .816-.816l1.385 1.385Zm-2.2-7.954a.576.576 0 0 1 0-.816L13.553.17a.577.577 0 0 1 .816.816l-1.385 1.384a.575.575 0 0 1-.816 0ZM9.3 9.09a.579.579 0 0 0-.045.038c-.45.417-.486 1.23-.486 1.47v.238c-1.045.45-2.053.177-2.537-.013v-.226c0-.24-.036-1.053-.487-1.469a.687.687 0 0 0-.044-.037c-.81-.609-1.777-1.667-1.777-3.253 0-2.073 1.604-3.76 3.576-3.76s3.577 1.687 3.577 3.76c0 1.586-.967 2.644-1.777 3.252Zm-1.8 4.757c-.995 0-1.223-.623-1.27-.814v-.997a4.83 4.83 0 0 0 1.343.197c.374 0 .78-.057 1.195-.18v.978c-.05.202-.282.816-1.269.816ZM7.5.923c-2.609 0-4.73 2.204-4.73 4.914 0 1.616.757 3.047 2.192 4.141.058.094.114.39.115.618v2.494c0 .03.003.06.007.09.1.63.732 1.82 2.416 1.82s2.316-1.19 2.416-1.82a.674.674 0 0 0 .006-.09v-2.494c0-.206.054-.525.11-.613 1.438-1.096 2.198-2.528 2.198-4.146 0-2.71-2.121-4.914-4.73-4.914Z" clip-rule="evenodd"></path></svg> Feedback</a>`

async function main() {

    // Initialize ChatGPT container w/ loading status
    chatGPTcontainer.innerHTML = `<p class="loading"> ${ braveGPTalert('waitingResponse') } </p>`

    // Inject container + feedback link
    var siderbarContainer = document.querySelector('#side-right')
    siderbarContainer.prepend(chatGPTcontainer)
    getAnswer(new URL(window.location.href).searchParams.get("q"))

}

function getUserscriptManager() {
    try { return GM_info.scriptHandler } catch (error) { return "other" }}

// ANSWER functions

function show(answer) {
    chatGPTcontainer.innerHTML = `${ navigator.userAgent.includes('Firefox') ? // only load robot emoji in FF + forks
        '<span class="chatgpt-icon"><img width=25 src="https://raw.githubusercontent.com/adamlui/userscripts/master/chatgpt/bravegpt/media/images/robot-emoji.png"></span>' : '' }<span class="prefix">ChatGPT</span><pre></pre>`
    chatGPTcontainer.querySelector('pre').textContent = answer
    chatGPTcontainer.appendChild(chatGPTfooter) // append feedback link
}

async function getAnswer(question, callback) {
    try {
        var accessToken = await getAccessToken()
        GM_xmlhttpRequest({
            method: "POST",
            url: "https://chat.openai.com/backend-api/conversation",
            headers: {
                "Content-Type": "application/json",
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
            GM_deleteValue("chatGPT_accessToken")
            braveGPTalert('login')
        } ; console.error("getAnswer error: ", error)
    }
    function responseType() {
        if (getUserscriptManager() === "Tampermonkey") {
            return "stream" } else { return "text" }
    }
    function onLoad() {
        return function(event) {
            console.log(event.status)
            if (event.status === 401) { GM_deleteValue("chatGPT_accessToken") ; braveGPTalert('login') }
            if (event.status === 403) { GM_deleteValue("chatGPT_accessToken") ; braveGPTalert('login') }
            if (event.status === 429) { braveGPTalert('tooManyRequests') }
            if (getUserscriptManager() !== "Tampermonkey") {
                if (event.response) {
                    const answer = JSON.parse(event.response
                        .split("\n\n").slice(-3, -2)[0].slice(6)).message.content.parts[0]
                    show(answer)
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
                        show(answer)
                    } else if (responseItem.startsWith("data: [DONE]")) { return }
                    return reader.read().then(processText)
    })}}}
}

// SESSION functions

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

function deleteOpenAIcookies() {
    if (getUserscriptManager() !== "Tampermonkey") return
    var openAIauthURL = 'https://auth0.openai.com'
    GM_cookie.list({ url: openAIauthURL }, function(cookies, error) {
        if (!error) { for (var i = 0; i < cookies.length; i++) {
            GM_cookie.delete({ url: openAIauthURL, name: cookies[i].name })
        }}})}

function getAccessToken() {
    return new Promise(async (resolve, reject) => {
        var accessToken = await GM_getValue("chatGPT_accessToken")
        if (!accessToken) {
            GM_xmlhttpRequest({
                url: "https://chat.openai.com/api/auth/session",
                onload: function(response) {
                    if (isBlockedbyCloudflare(response.responseText)) {
                        braveGPTalert('checkCloudflare') ; return }
                    try {
                        var accessToken2 = JSON.parse(response.responseText).accessToken
                    } catch { braveGPTalert('invalidResponse') }
                    if (!accessToken2) { reject("UNAUTHORIZED") }
                    GM_setValue("accessToken", accessToken2)
                    resolve(accessToken2)
                },
                onerror: function(error) { reject(error) },
                ontimeout: () => { console.error("getAccessToken timeout!") }
            })
        } else { resolve(accessToken) }
})}

function getAccessTokenNew() {
    return new Promise(async (resolve, reject) => {
        var accessToken = await GM_getValue('chatGPT_accessToken')
        if (!accessToken) {
            try {
                const response = await GM.xmlHttpRequest({
                    method: 'GET',
                    url: 'https://chat.openai.com/api/auth/session',
                    headers: { 'Content-Type': 'application/json',
                               'User-Agent': navigator.userAgent,

                    },
                    responseType: 'json',
                    withCredentials: true, // Include cookies in the request
                });
                console.log('response.responseText is:\n\n' + response.responseText)
                if (isBlockedbyCloudflare(response.responseText)) {
                    braveGPTalert('checkCloudflare') ; return }
                try {
                    accessToken = response.response.accessToken
                } catch {
                    console.error('Response is not valid JSON!!')
                    deleteOpenAIcookies() ; braveGPTalert('checkCloudflare') ; return
                }
                if (accessToken) {
                    GM.setValue('chatGPT_accessToken', accessToken); // Store the access token for future use
                    resolve(accessToken);
                } else {
                    reject('UNAUTHORIZED');
                }
            } catch (error) {
                reject(error);
            }
        } else { resolve(accessToken) }
        console.log('getAccessToken() finished and returned ' + accessToken)
    });
}

function isBlockedbyCloudflare(resp) {
    try {
        var html = new DOMParser().parseFromString(resp, "text/html")
        var title = html.querySelector("title")
        return title.innerText === "Just a moment..."
    } catch (error) { return false }
}

// ALERT function

var alerts = {
    waitingResponse: "Waiting for ChatGPT response...",
    login: "Please login @ ",
    tooManyRequests: "ChatGPT is flooded with too many requests. Check back later!",
    checkCloudflare: "Please pass Cloudflare security check @ ",
    unknowError: "An unknown error has occurred",
    networkException: "Network exception, please refresh the page",
    invalidResponse: "OpenAI is returning an invalid access token. Try to logout/login @ "
}
function braveGPTalert(msg) {
    if (msg.includes('login')) deleteOpenAIcookies()
    chatGPTcontainer.innerHTML = (
        /waiting|loading/i.test(msg) ? // if alert involves loading, add class
            '<p class="loading">' : '<p>') + alerts[msg]
        + (alerts[msg].includes('@') ? // if msg needs a link, add it
            '<a href="https://chat.openai.com" target="_blank">chat.openai.com</a></p>' : '</p>')
}

// Execute MAIN function

main()
