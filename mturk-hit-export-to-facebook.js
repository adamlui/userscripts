// ==UserScript==
// @name          MTurk HIT Export to Facebook
// @namespace     https://mturkers.org/adaaaam
// @description   Export MTurk HIT information to post on Facebook
// @version       2017.03.12
// @author        adaaaam
// @icon          http://www.google.com/s2/favicons?domain=facebook.com
// @include       https://www.mturk.com/mturk/*searchbar*
// @include       https://www.mturk.com/mturk/findhits*
// @include       https://www.mturk.com/mturk/viewhits*
// @include       https://www.mturk.com/mturk/sorthits*
// @include       https://www.mturk.com/mturk/myhits*
// @include       https://worker.mturk.com/*
// @exclude       https://www.mturk.com/mturk/*selectedSearchType=quals*
// @grant         GM_setClipboard
// @grant         GM_notification
// ==/UserScript==

document.head.appendChild(document.createElement('style')).innerHTML = ".fbButton { margin-top:auto; margin-bottom:auto; margin-left:3px; valign:center; color:white; border:0px; font-size: 8px; height: 14px; width: 22px;  background: #4267b2; }";

function iniFBbutton() {
    fbButton = document.createElement('button');
    fbButton.classList.add("fbButton");
    fbButton.textContent = 'FB';
    fbButton.title = 'Click to copy HIT information formatted for Facebook';
    fbButton.addEventListener("click", exportFB, false);
}

if (/worker\.mturk\./.test(window.location.host)) {
    var j = 0;
    for (let element of document.querySelectorAll('li[class*="hit-set-table-row"]')) {
        iniFBbutton();
        fbButton.setAttribute("place", j);
        element.insertAdjacentElement('afterbegin', fbButton);
        j++;
    }
} else {
    var capsules = document.getElementsByClassName('capsulelink');
    for (var i = 0; i < capsules.length / 2; i++) {
        iniFBbutton();
        fbButton.setAttribute("place", i);
        document.getElementById('capsule' + i + '-0').parentNode.appendChild(fbButton);  // Append button to HIT title
    }
}

function getTO(id) {
    var toURL = 'https://turkopticon.ucsd.edu/api/multi-attrs.php?ids='+id;
    requestTO = new XMLHttpRequest();
    requestTO.onreadystatechange = function () { rated = (requestTO.responseText.split(':').length) < 3 ? false : true; };
    requestTO.open('GET', toURL, false);
    requestTO.send(null);
}

function exportFB(a) {
    var theButton = a.target;
    if (/worker\.mturk\./.test(window.location.host)) {  // If on worker.mturk.com
        k = theButton.getAttribute("place");
        hitRow = document.querySelector('li[data-reactid*=".4.1:$' + theButton.getAttribute("place") + '"]');
        hitTitle = hitRow.querySelector('span[class*="project-name-column"]').textContent;
        hitURL = hitRow.querySelector('a[href*="tasks?"]');
        hitReward = hitRow.querySelector('span[class*="reward-column"]').textContent;
        hitsAvailable = hitRow.querySelector('span[class*="task-column"]').textContent;
        requesterURL = hitRow.querySelector('a[href^="/requesters/"]');
        requesterID = requesterURL.href.match(/requesters\/(.*)\//)[1];
        qualList = hitRow.querySelector('[class*="qualifications-list"]');
        masters = (qualList && qualList.textContent.indexOf('Masters') > -1 ) ? 'Masters, ' : '';
    } else {
        capTitle = document.getElementById('capsule'+theButton.getAttribute("place")+'-0');
        hitTitle = capTitle.textContent.trim();
        tBodies = capTitle.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
        requesterID = tBodies.getElementsByClassName('requesterIdentity')[0].parentNode.href.split('requesterId=')[1];
        groupID = capTitle.parentNode.parentNode.getElementsByClassName('capsulelink')[1].firstChild.nextSibling.href.split('=')[1];
        hitReward = tBodies.getElementsByClassName('reward')[0].textContent;
        hitsAvailable = (tBodies.getElementsByClassName('capsule_field_text')[4].textContent).replace(new RegExp("[^0-9]", "g"), "");
        hitURL = 'https://www.mturk.com/mturk/preview?groupId=' + groupID;
        qualList = document.getElementById('capsule'+theButton.getAttribute("place")+'target').getElementsByTagName('tbody')[2];  // Find div id capsulexTARGET and goto 2nd tbody
        qualColl = qualList.getElementsByTagName('td');
        masters = '';
        for ( var m = 3; m < qualColl.length; m++ ) if ( qualColl[m].textContent.indexOf('Masters') > -1 ) masters = 'Masters, ';
    }
    to = getTO(requesterID);
    rated = (!rated) ? ", no TO" : "";
    var hitDetails = hitTitle + ' ' + hitURL + '\n\n' + masters + hitReward + ' x ' + hitsAvailable + ' available' + rated + '\n\n';
    GM_setClipboard(hitDetails);
    var notification = {
        text: hitTitle + ' ' + '\n\n' + masters + hitReward + ' x ' + hitsAvailable + ' available' + rated,
        title: 'MTurk HIT Details Copied',
        timeout: 25000,
        onclick: function() { window.open('https://www.facebook.com/groups/mturkers'); },
    };
    GM_notification(notification);
}
