// ==UserScript==
// @name        Hide Forum Images
// @version     2022.12.07.3
// @author      Adam Lui
// @namespace   https://elonsucks.org/@adam
// @description Hides images + videos from XenForo and vBulletin forums.
// @include     *
// @require     http://code.jquery.com/jquery-latest.min.js
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
