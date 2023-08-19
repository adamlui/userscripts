// ==UserScript==
// @name                GitHub Widescreen 🖥️
// @name:zh             GitHub 宽银幕 ⭐
// @name:zh-CN          GitHub 宽银幕 ⭐
// @name:zh-HK          GitHub 寬銀幕 ⭐
// @name:zh-SG          GitHub 宽银幕 ⭐
// @name:zh-TW          GitHub 寬銀幕 ⭐
// @description         Auto-hides side panels from various views on GitHub
// @description:zh      自动隐藏 GitHub 上各种视图的侧面板
// @description:zh-CN   自动隐藏 GitHub 上各种视图的侧面板
// @description:zh-HK   自動隱藏 GitHub 上各種視圖的側面板
// @description:zh-SG   自动隐藏 GitHub 上各种视图的侧面板
// @description:zh-TW   自動隱藏 GitHub 上各種視圖的側面板
// @author              Adam Lui
// @namespace           https://github.com/adamlui
// @version             2023.8.19
// @license             MIT
// @icon                https://github.githubassets.com/favicons/favicon.png
// @match               *://github.com/*
// ==/UserScript==

(async () => {

    // Init notifications queue
    var notifyQueue = { quadrants: { topRight: [], bottomRight: [], bottomLeft: [], topLeft: [] }};
    localStorage.notifyQueue = JSON.stringify(notifyQueue);

    // Observe DOM for need to hide side panels
    let prevURL = null
    const panelObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList' && mutation.addedNodes.length) {
                if (window.location.href !== prevURL) { // if loaded/naved to new page
                    try { // to hide both panels
                        document.querySelector('button[aria-expanded="true"]').click()
                        notify('🖥️ Side panels OFF')
                        setTimeout(() => { // slight delay to not click same button
                            document.querySelector('button[aria-expanded="true"]').click() }, 5)
                    } catch (err) {}
                    prevURL = window.location.href
                }
    }})}) ; panelObserver.observe(document.documentElement, { childList: true, subtree: true })

    function notify(msg, position, notifDuration, shadow) {
        notifDuration = notifDuration ? +notifDuration : 1.75; // sec duration to maintain notification visibility
        const fadeDuration = 0.6; // sec duration of fade-out
        const vpYoffset = 23, vpXoffset = 27; // px offset from viewport border

        // Make/stylize/insert div
        const notificationDiv = document.createElement('div'); // make div
        notificationDiv.id = Math.floor(Math.random() * 1000000) + Date.now();
        notificationDiv.style.cssText = ( // stylize it
              ' background-color: black ; padding: 10px ; border-radius: 8px ; ' // box style
            + ' opacity: 0 ; position: fixed ; z-index: 9999 ; font-size: 1.8rem ; color: white ; ' // visibility
            + ' -webkit-user-select: none ; -moz-user-select: none ; -ms-user-select: none ; user-select: none ; ' // disable selection
            + ( shadow ? ( 'box-shadow: -8px 13px 25px 0 ' + ( /\b(shadow|on)\b/gi.test(shadow) ? 'gray' : shadow )) : '' ));
        document.body.appendChild(notificationDiv); // insert into DOM

        // Determine div position/quadrant
        notificationDiv.isTop = !position || !/low|bottom/i.test(position);
        notificationDiv.isRight = !position || !/left/i.test(position);
        notificationDiv.quadrant = (notificationDiv.isTop ? 'top' : 'bottom')
            + (notificationDiv.isRight ? 'Right' : 'Left');

        // Store div
        notifyQueue = JSON.parse(localStorage.notifyQueue);
        notifyQueue.quadrants[notificationDiv.quadrant].push(notificationDiv.id);
        localStorage.notifyQueue = JSON.stringify(notifyQueue);

        // Position notification (defaults to top-right)
        notificationDiv.style.top = notificationDiv.isTop ? vpYoffset.toString() + 'px' : '';
        notificationDiv.style.bottom = !notificationDiv.isTop ? vpYoffset.toString() + 'px' : '';
        notificationDiv.style.right = notificationDiv.isRight ? vpXoffset.toString() + 'px' : '';
        notificationDiv.style.left = !notificationDiv.isRight ? vpXoffset.toString() + 'px' : '';

        // Reposition old notifications
        const thisQuadrantDivIDs = notifyQueue.quadrants[notificationDiv.quadrant];
        if (thisQuadrantDivIDs.length > 1) {
            try { // to move old notifications
                for (const divId of thisQuadrantDivIDs.slice(0, -1)) { // exclude new div
                    const oldDiv = document.getElementById(divId);
                    const offsetProp = oldDiv.style.top ? 'top' : 'bottom'; // pick property to change
                    const vOffset = +/\d+/.exec(oldDiv.style[offsetProp])[0] + 5 + oldDiv.getBoundingClientRect().height;
                    oldDiv.style[offsetProp] = `${vOffset}px`; // change prop
                }
            } catch (error) {}
        }

        // Show notification
        notificationDiv.innerText = msg; // insert msg
        notificationDiv.style.transition = 'none'; // remove fade effect
        notificationDiv.style.opacity = 1; // show msg

        // Hide notification
        const hideDelay = ( // set delay before fading
            fadeDuration > notifDuration ? 0 // don't delay if fade exceeds notification duration
            : notifDuration - fadeDuration); // otherwise delay for difference
        notificationDiv.hideTimer = setTimeout(() => { // maintain notification visibility, then fade out
            notificationDiv.style.transition = 'opacity ' + fadeDuration.toString() + 's'; // add fade effect
            notificationDiv.style.opacity = 0; // hide notification
            notificationDiv.hideTimer = null; // prevent memory leaks
        }, hideDelay * 1000); // ...after pre-set duration

        // Destroy notification
        notificationDiv.destroyTimer = setTimeout(() => {
            notificationDiv.remove(); // remove from DOM
            notifyQueue = JSON.parse(localStorage.notifyQueue);
            notifyQueue.quadrants[notificationDiv.quadrant].shift(); // + memory
            localStorage.notifyQueue = JSON.stringify(notifyQueue); // + storage
            notificationDiv.destroyTimer = null; // prevent memory leaks
        }, Math.max(fadeDuration, notifDuration) * 1000); // ...after notification hid
    }

})()
