// ==UserScript==
// @name        XenForo/vBulletin Stealth Mode
// @version     2017.03.13
// @author      adaaaam
// @namespace   https://mturkers.org/adaaaam
// @description Hides images/videos from XenForo and vBulletin forums.
// @include     *
// @require       http://code.jquery.com/jquery-latest.min.js
// ==/UserScript==

if (document.querySelector('html[id^="vbulletin"]') || document.querySelector('html[id^="XenForo"]')) {
    var imgs = document.getElementsByTagName('img');
    for (var n = imgs.length; n--> 0;) {
        var img = imgs[n];
        img.setAttribute("src", "");
    }
    $(document).ready(function() {
        var $vid_embed = $('iframe[src^="//www.youtube.com"],iframe[src*="gifv"]');
        $vid_embed.each(function() {
            var $this = $(this);
            var vid_url = $this.attr('src');
            var vid_id = vid_url.replace(/(.*)embed\/(.*)\?(.*)/, "$2");
            var yt_url = "https://www.youtube.com/watch?v=" + vid_id;
            $this.after('<br><a href="'+yt_url+'" target="_blank">'+yt_url+'</a>');
            $this.remove();
        });
    });
}
