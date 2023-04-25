// ==UserScript==
// @name        Pikpak Enhance
// @namespace   Violentmonkey Scripts
// @match       *://mypikpak.com/drive/*
// @grant       none
// @version     2023.4.27
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
// @grant       GM_openInTab
// @grant       unsafeWindow
// @run-at      document-start
// @author      github.com @XiaoYingYo
// @require     https://greasyfork.org/scripts/464779-module-jquery/code/module_jquery.js
// @require     https://greasyfork.org/scripts/464780-global-module/code/global_module.js
// @downloadURL  https://raw.githubusercontent.com/XiaoYingYo/MonkeyUserScripts/main/pikpak/pikpak-enhance/pikpak-enhance.js
// @description 2023/4/23 20:06:50
// ==/UserScript==

var global_module = window["global_module"];
var $ = window["$$$"];

var GlobalVariable = {};

async function DealWithoverlay(i, callback) {
    return new Promise(async (resolve) => {
        let overlay = $("div.el-overlay:not([style*='display'])").eq(0);
        if (overlay.length === 0) {
            resolve();
            return;
        }
        let btn = null;
        if (i != null) {
            switch (i) {
                case 0:
                    btn = overlay.find("button[class*='is-text']").eq(0);
                    break;
                case 1:
                    btn = overlay.find("button[class*='--primary']").eq(0);
                    break;
            }
        }
        if (typeof (callback) == "function") {
            callback(overlay, btn);
        } else {
            if (btn != null) {
                btn.click();
            }
            overlay.hide();
        }
        resolve();
    });
}

async function LiClick() {
    let activeLiHref = GlobalVariable.activeLi.attr("href");
    let that = $(this).find("a").eq(0);
    let thisHref = that.attr("href");
    if (activeLiHref == thisHref) {
        return;
    }
    GlobalVariable.activeLi = that;
    clearInterval(GlobalVariable.FindLiActiveInterval);
    $("ul[class^='context-menu']").remove();
    await new Promise((resolve) => {
        GlobalVariable.FindLiActiveInterval = setInterval(() => {
            if (that.attr("class").indexOf("active") != -1) {
                clearInterval(GlobalVariable.FindLiActiveInterval);
                resolve();
            }
        }, 100);
    });
    MonitorMenu();
}

GlobalVariable.MonitorMenuClickFun = global_module.debounce(MonitorMenuClick, 100);
GlobalVariable.InterfacelanguageList = ["en", "zh-CN", "zh-TW", "ja", "ko", "de", "fr", "es", "pt", "ru", "it", "tr", "ar", "th", "vi", "id"];
GlobalVariable.Navigatorlanguage = GlobalVariable.InterfacelanguageList.indexOf(navigator.language) != -1 ? navigator.language : "en";
GlobalVariable.Interfacelanguage = {
    "login": {
        001: {
            "en": "preferred use Sign in or Register with Email",
            "zh-CN": "首选使用邮箱登录或注册",
            "zh-TW": "首選使用郵箱登錄或註冊",
            "ja": "メールでログインまたは登録することを好む",
            "ko": "이메일로 로그인 또는 등록하는 것을 선호합니다",
            "de": "Bevorzugte Anmeldung oder Registrierung per E-Mail",
            "fr": "Préférez-vous vous connecter ou vous inscrire par e-mail",
            "es": "Preferencia para iniciar sesión o registrarse con correo electrónico",
            "pt": "Preferência para fazer login ou registrar com e-mail",
            "ru": "Предпочтительный вход или регистрация по электронной почте",
            "it": "Preferenza per accedere o registrarsi con e-mail",
            "tr": "E-posta ile oturum açın veya kaydolun",
            "ar": "تفضيل تسجيل الدخول أو التسجيل باستخدام البريد الإلكتروني",
            "th": "การเข้าสู่ระบบหรือลงทะเบียนด้วยอีเมลที่ต้องการ",
            "vi": "Ưu tiên sử dụng Đăng nhập hoặc Đăng ký bằng Email",
            "id": "Pilihan untuk masuk atau mendaftar dengan email"
        },
        002: {
            "en": "Enter your email address and password here to automatically try to log in",
            "zh-CN": "在此输入您的电子邮件地址和密码，以自动尝试登录",
            "zh-TW": "在此輸入您的電子郵件地址和密碼，以自動嘗試登錄",
            "ja": "ここにメールアドレスとパスワードを入力して、自動的にログインを試みます",
            "ko": "이메일 주소와 비밀번호를 입력하여 자동으로 로그인하십시오",
            "de": "Geben Sie hier Ihre E-Mail-Adresse und Ihr Passwort ein, um sich automatisch anzumelden",
            "fr": "Entrez votre adresse e-mail et votre mot de passe ici pour vous connecter automatiquement",
            "es": "Ingrese su dirección de correo electrónico y contraseña aquí para iniciar sesión automáticamente",
            "pt": "Insira seu endereço de e-mail e senha aqui para fazer login automaticamente",
            "ru": "Введите здесь свой адрес электронной почты и пароль, чтобы автоматически войти в систему",
            "it": "Inserisci qui il tuo indirizzo email e la tua password per accedere automaticamente",
            "tr": "E-posta adresinizi ve şifrenizi buraya girin ve otomatik olarak oturum açmaya çalışın",
            "ar": "أدخل عنوان بريدك الإلكتروني وكلمة المرور هنا للمحاولة تسجيل الدخول تلقائيًا",
            "th": "ป้อนที่อยู่อีเมลและรหัสผ่านของคุณที่นี่เพื่อล็อกอินโดยอัตโนมัติ",
            "vi": "Nhập địa chỉ email và mật khẩu của bạn ở đây để tự động đăng nhập",
            "id": "Masukkan alamat email dan kata sandi Anda di sini untuk masuk secara otomatis"
        }
    }
};


async function MonitorMenuClick() {
    let Download = GlobalVariable.language["download"];
    let Delete = GlobalVariable.language["i18n-delete"];
    let DeletePermanently = GlobalVariable.language["delete-permanently"];
    let DownloadElement = GlobalVariable.menu.find("li[aria-label='" + Download + "']").eq(0);
    let DeleteElement = GlobalVariable.menu.find("li[aria-label='" + Delete + "']").eq(0);
    let DeletePermanentlyElement = GlobalVariable.menu.find("li[aria-label='" + DeletePermanently + "']").eq(0);
    if (DownloadElement.length != 0) {
        DownloadElement.on("click", async function () {
            DealWithoverlay(0);
        });
    }
    if (DeleteElement.length != 0) {
        DeleteElement.on("click", function () {
            DealWithoverlay(1);
        });
    }
    if (DeletePermanentlyElement.length != 0) {
        DeletePermanentlyElement.on("click", function () {
            DealWithoverlay(1);
        });
    }
}

async function MonitorMenu() {
    let menu = await global_module.waitForElement("ul[class^='context-menu']", null, null, 100);
    if (menu.html() != "") {
        return;
    }
    GlobalVariable.menu = menu;
    $(menu).on("DOMSubtreeModified", GlobalVariable.MonitorMenuClickFun);
}

async function FindStr(obj) {
    return new Promise((resolve) => {
        if (Array.isArray(obj)) {
            obj.forEach(function (item) {
                FindStr(item);
            });
        } else if (typeof obj === 'object' && obj !== null) {
            Object.keys(obj).forEach(function (key) {
                var value = obj[key];
                if (typeof value === 'function') {
                    let scriptStr = value.toString();
                    if (scriptStr.indexOf("e.exports=JSON.parse") != -1) {
                        scriptStr = scriptStr.replace("e.exports=", "window['__language__'] = ");
                        scriptStr = "(" + scriptStr + ")()";
                        let func = new Function(scriptStr);
                        func();
                        GlobalVariable.language = unsafeWindow.__language__;
                        unsafeWindow.GlobalVariable = GlobalVariable;
                        resolve();
                        return;
                    }
                } else {
                    FindStr(value);
                }
            });
        }
        resolve();
    });
}

GlobalVariable.registerEdMenu = [];

function OverloadMenu() {
    for (let i = 0; i < GlobalVariable.registerEdMenu.length; i++) {
        GM_unregisterMenuCommand(GlobalVariable.registerEdMenu[i]);
    }
    let L001 = GlobalVariable.Interfacelanguage["login"][001][GlobalVariable.Navigatorlanguage];
    let V001 = GM_getValue("loginForEmail", false) ? "√" : "×";
    GlobalVariable.registerEdMenu.push(GM_registerMenuCommand(L001 + " " + V001, function () {
        GM_setValue("loginForEmail", !GM_getValue("loginForEmail", false));
        OverloadMenu();
    }));
}

function loginPaneleModified() {
    let forgetPasswordElement = GlobalVariable.loginPanel.find("div[class*='forget-password']").eq(0);
    if (forgetPasswordElement.length == 0) {
        return;
    }
    let item = forgetPasswordElement.parent();
    let form = item.parent().eq(0);
    if (form.find("div#QuickInput").length != 0) {
        return;
    }
    let formDivHeight = 0;
    let QuickInputHeight = "";
    let formHeight = form.height();
    form.children().each(function () {
        formDivHeight += $(this).outerHeight(true);
    });
    QuickInputHeight = formHeight - formDivHeight;
    let div = $(`<div id="QuickInput"><textarea placeholder="` + GlobalVariable.Interfacelanguage["login"][002][GlobalVariable.Navigatorlanguage] + `" style="width: 100%; height:` + QuickInputHeight + `px;"></textarea></div>`);
    form.append(div);
    div.find("textarea").eq(0).on("input propertychange", global_module.debounce(function () {
        let text = $(this).val();
        let emailReg = /([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/g;
        let email = text.match(emailReg);
        if (email == null) {
            return;
        }
        let password = "";
        text = text.replace(emailReg, "");
        text = text.replace(/\n/g, "");
        email = email[0];
        if (text.indexOf(":") != -1) {
            let index = text.lastIndexOf(":");
            password = text.substring(index + 1);
        } else if (!/\s/.test(text)) {
            password = text.replace(/[^a-zA-Z0-9\!\@\#\$\%\^\&\*\(\)\_\+\-\=\[\]\{\}\|\\\:\;\"\'\,\.\/\<\>\?]/g, "");
        } else {
            let index = text.lastIndexOf(" ");
            password = text.substring(index + 1);
        }
        if (email != "" && password != "") {
            let inputList = item.find("input[class][placeholder][type]");
            global_module.AnalogInput.AnalogInput(inputList.eq(0)[0], email);
            global_module.AnalogInput.AnalogInput(inputList.eq(1)[0], password);
            let loginBtn = item.find("div[class*='login-button']").eq(0);
            MonitorUrl(1);
            setTimeout(function () {
                loginBtn.click();
            }, 200);
        }
    }, 200));
}

function StopMonitorUrl() {
    if (GlobalVariable.MonitorUrlInterval != null) {
        for (let i = 0; i < GlobalVariable.MonitorUrlInterval.length; i++) {
            clearInterval(GlobalVariable.MonitorUrlInterval[i]);
        }
        GlobalVariable.MonitorUrlInterval = [];
    }
}

function MonitorUrl(to) {
    GlobalVariable.HistoricalUrlPath = unsafeWindow.location.pathname;
    if (GlobalVariable.MonitorUrlInterval == null) {
        GlobalVariable.MonitorUrlInterval = [];
    }
    StopMonitorUrl();
    GlobalVariable.MonitorUrlInterval.push(setInterval(function () {
        let path = unsafeWindow.location.pathname;
        if (path == GlobalVariable.HistoricalUrlPath) {
            return;
        }
        if (path.indexOf("/drive/login") != -1 && to == 0) {
            login();
        } else if (to == 1) {
            main();
        }
        StopMonitorUrl();
    }, 500));
}

async function login() {
    let loginPanel = await global_module.waitForElement("div[class*='login-panel']", null, null, 100, -1);
    loginPanel = loginPanel.eq(0);
    GlobalVariable.loginPanel = loginPanel;
    loginPanel.on("DOMSubtreeModified", global_module.debounce(loginPaneleModified, 200));
    if (GM_getValue("loginForEmail", false)) {
        let emailBtn = await global_module.waitForElement("div[class*='icon-email']", null, null, 100, -1);
        emailBtn.eq(0).click();
    }
    Init(0);
}

async function MonitorLogout() {
    let nav = await global_module.waitForElement("ul[class='user-nav']", null, null, 100, -1);
    let li = nav.find("li").eq(-1);
    li.on("click", function () {
        DealWithoverlay(1, function (overlay, btn) {
            if (btn != null) {
                btn.on("click", function () {
                    overlay.hide();
                    global_module.Cookie.clear();
                    unsafeWindow.location.href = "/drive/login";
                });
            }
        });
    });
}

async function main() {
    MonitorUrl(0);
    MonitorLogout();
    let nav = await global_module.waitForElement("ul[class='nav']", null, null, 100, 60 * 1000);
    if (nav == null) {
        for (let i = 0; i < 5; i++) {
            new Error("nav is null");
        }
        return;
    }
    await FindStr(unsafeWindow.webpackChunkxlco_pikpak_web);
    GlobalVariable.nav = nav;
    let activeLi = await global_module.waitForElement("a[class^='active']", null, null, 100, 60 * 1000, nav);
    if (activeLi == null) {
        for (let i = 0; i < 5; i++) {
            new Error("activeLi is null");
        }
        return;
    }
    StopMonitorUrl();
    GlobalVariable.activeLi = activeLi;
    nav.find("li").on("click", LiClick);
    $("svg[class='safety']").eq(0).remove();
    MonitorMenu();
    Init(1);
}

function Init(index) {
    global_module.Cookie.set("allow_analysis", "true", 10 * 365 * 24 * 60 * 60 * 1000);
    if (index == 0) {

    } else if (index == 1) {
        for (let i = 0; i < localStorage.length; i++) {
            let key = localStorage.key(i);
            let value = localStorage.getItem(key);
            if (key.indexOf("credentials_") == -1) {
                let json = JSON.parse(value);
                let sub = json.sub;
                global_module.Cookie.set("pp_disabled_speed_save_dialog_" + sub, "true", 10 * 365 * 24 * 60 * 60 * 1000);
            }
            break;
        }
    }
}

function Preload() {
    OverloadMenu();
    Init();
    let href = unsafeWindow.location.href;
    if (href.indexOf("/drive/login") != -1) {
        login();
    } else {
        main();
    }
}

Preload();