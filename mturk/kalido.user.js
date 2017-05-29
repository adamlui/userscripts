// ==UserScript==
// @name        Kalido Categorization
// @version     2017.05.28
// @namespace   https://mturkers.org
// @description Kalido
// ==/UserScript==

var content = document.getElementById("wrapper");
content.tabIndex = "0";
content.focus();
 
document.onkeydown = showkeycode;
function showkeycode(evt){
    var keycode = evt.keyCode;
       switch (keycode) {
            case 65: //a
                document.getElementById("Excellent").click();
                document.getElementById("mturk_form").submit();
                break;
            case 83: //s
                document.getElementById("Good").click();
                document.getElementById("mturk_form").submit();
                break;
            case 68: //d
                document.getElementById("Weak").click();
                document.getElementById("mturk_form").submit();
                break;
            case 70: //f
                document.getElementById("Unrelated").click();
                document.getElementById("mturk_form").submit();
                break;
            case 71: //g
                document.getElementById("Opposite").click();
                document.getElementById("mturk_form").submit();
                break;
    }
}
