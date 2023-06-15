// ==UserScript==
// @name        Pikpak Enhance
// @name:en     Pikpak Enhance
// @name:zh-CN  Pikpak 增强
// @name:zh-TW  Pikpak 增強
// @name:ja     Pikpak エンハンス
// @name:ko     Pikpak 개선
// @name:de     Pikpak Verbessern
// @name:fr     Pikpak Améliorer
// @name:es     Mejora de Pikpak
// @name:pt     Aumentar o pikpak
// @name:ru     Pikpak Улучшить
// @name:it     Miglioramento di Pikpak
// @name:tr     Pikpak Geliştirmek
// @name:ar     تعزيز Pikpak
// @name:th     Pikpak เสริม
// @name:vi     Nâng cao Pikpak
// @name:id     Tingkatkan Pikpak
// @namespace   Violentmonkey Scripts
// @match       *://mypikpak.com/drive/*
// @version     XiaoYing_2023.06.16.3
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
// @require     https://greasyfork.org/scripts/464929-module-jquery-xiaoying/code/module_jquery_XiaoYing.js
// @require     https://greasyfork.org/scripts/464780-global-module/code/global_module.js
// @require     https://greasyfork.org/scripts/465483-hookfetch/code/hookFetch.js
// @description Violentmonkey Scripts
// @description:en Violentmonkey Scripts
// @description:zh-CN Violentmonkey 脚本
// @description:zh-TW Violentmonkey 腳本
// @description:ja Violentmonkey スクリプト
// @description:ko Violentmonkey 스크립트
// @description:de Violentmonkey Skripte
// @description:fr Violentmonkey Scripts
// @description:es Violentmonkey Scripts
// @description:pt Violentmonkey Scripts
// @description:ru Violentmonkey Сценарии
// @description:it Violentmonkey Scripts
// @description:tr Violentmonkey Scripts
// @description:ar Violentmonkey Scripts
// @description:th Violentmonkey Scripts
// @description:vi Violentmonkey Scripts
// @description:id Violentmonkey Scripts
// ==/UserScript==

var GlobalVariable = {};

async function DealWithoverlay(i, callback) {
    return new Promise(async (resolve) => {
        let overlay = $('div.el-overlay:not([style*="display"])').eq(0);
        if (overlay.length === 0) {
            resolve();
            return;
        }
        let Target = null;
        if (i != null) {
            switch (i) {
                case 0:
                    Target = overlay.find('button[class*="is-text"]').eq(0);
                    break;
                case 1:
                    Target = overlay.find('button[class*="--primary"]').eq(0);
                    break;
                case 2:
                    Target = overlay.find('label[class^="el-checkbox"]').eq(0);
                    break;
            }
        }
        if (typeof callback == 'function') {
            callback(overlay, Target);
        } else {
            if (Target != null) {
                Target.click();
            }
            overlay.hide();
        }
        resolve();
    });
}

async function LiClick() {
    let activeLiHref = GlobalVariable.activeLi.attr('href');
    let that = $(this).find('a').eq(0);
    let thisHref = that.attr('href');
    if (activeLiHref == thisHref) {
        return;
    }
    GlobalVariable.activeLi = that;
    clearInterval(GlobalVariable.FindLiActiveInterval);
    $('ul[class^="context-menu"]').remove();
    await new Promise((resolve) => {
        GlobalVariable.FindLiActiveInterval = setInterval(() => {
            if (that.attr('class').indexOf('active') != -1) {
                clearInterval(GlobalVariable.FindLiActiveInterval);
                resolve();
            }
        }, 100);
    });
    MonitorMenu();
}

GlobalVariable.MonitorMenuClickFun = global_module.debounce(MonitorMenuClick, 100);
GlobalVariable.InterfacelanguageList = ['en', 'zh-CN', 'zh-TW', 'ja', 'ko', 'de', 'fr', 'es', 'pt', 'ru', 'it', 'tr', 'ar', 'th', 'vi', 'id'];
GlobalVariable.Navigatorlanguage = GlobalVariable.InterfacelanguageList.indexOf(navigator.language) != -1 ? navigator.language : 'en';
GlobalVariable.Pikpaklanguage = localStorage.getItem('pp_locale') || 'en';
GlobalVariable.Interfacelanguage = {
    login: {
        '001': {
            en: 'preferred use Sign in or Register with Email',
            'zh-CN': '首选使用邮箱登录或注册',
            'zh-TW': '首選使用郵箱登錄或註冊',
            ja: 'メールでログインまたは登録することを好む',
            ko: '이메일로 로그인 또는 등록하는 것을 선호합니다',
            de: 'Bevorzugte Anmeldung oder Registrierung per E-Mail',
            fr: 'Préférez-vous vous connecter ou vous inscrire par e-mail',
            es: 'Preferencia para iniciar sesión o registrarse con correo electrónico',
            pt: 'Preferência para fazer login ou registrar com e-mail',
            ru: 'Предпочтительный вход или регистрация по электронной почте',
            it: 'Preferenza per accedere o registrarsi con e-mail',
            tr: 'E-posta ile oturum açın veya kaydolun',
            ar: 'تفضيل تسجيل الدخول أو التسجيل باستخدام البريد الإلكتروني',
            th: 'การเข้าสู่ระบบหรือลงทะเบียนด้วยอีเมลที่ต้องการ',
            vi: 'Ưu tiên sử dụng Đăng nhập hoặc Đăng ký bằng Email',
            id: 'Pilihan untuk masuk atau mendaftar dengan email'
        },
        '002': {
            en: 'Enter your email address and password here to automatically try to log in',
            'zh-CN': '在此输入您的电子邮件地址和密码，以自动尝试登录',
            'zh-TW': '在此輸入您的電子郵件地址和密碼，以自動嘗試登錄',
            ja: 'ここにメールアドレスとパスワードを入力して、自動的にログインを試みます',
            ko: '이메일 주소와 비밀번호를 입력하여 자동으로 로그인하십시오',
            de: 'Geben Sie hier Ihre E-Mail-Adresse und Ihr Passwort ein, um sich automatisch anzumelden',
            fr: 'Entrez votre adresse e-mail et votre mot de passe ici pour vous connecter automatiquement',
            es: 'Ingrese su dirección de correo electrónico y contraseña aquí para iniciar sesión automáticamente',
            pt: 'Insira seu endereço de e-mail e senha aqui para fazer login automaticamente',
            ru: 'Введите здесь свой адрес электронной почты и пароль, чтобы автоматически войти в систему',
            it: 'Inserisci qui il tuo indirizzo email e la tua password per accedere automaticamente',
            tr: 'E-posta adresinizi ve şifrenizi buraya girin ve otomatik olarak oturum açmaya çalışın',
            ar: 'أدخل عنوان بريدك الإلكتروني وكلمة المرور هنا للمحاولة تسجيل الدخول تلقائيًا',
            th: 'ป้อนที่อยู่อีเมลและรหัสผ่านของคุณที่นี่เพื่อล็อกอินโดยอัตโนมัติ',
            vi: 'Nhập địa chỉ email và mật khẩu của bạn ở đây để tự động đăng nhập',
            id: 'Masukkan alamat email dan kata sandi Anda di sini untuk masuk secara otomatis'
        },
        '003': {
            en: 'Register new account with one click and log in immediately',
            'zh-CN': '一键注册新的账号并立即登录',
            'zh-TW': '一鍵註冊新的賬號並立即登錄',
            ja: 'ワンクリックで新しいアカウントを登録してすぐにログインする',
            ko: '한 번의 클릭으로 새 계정을 등록하고 즉시 로그인하십시오',
            de: 'Registrieren Sie ein neues Konto mit einem Klick und melden Sie sich sofort an',
            fr: 'Enregistrez un nouveau compte en un clic et connectez-vous immédiatement',
            es: 'Registre una nueva cuenta con un clic e inicie sesión de inmediato',
            pt: 'Registre uma nova conta com um clique e faça login imediatamente',
            ru: 'Зарегистрируйте новую учетную запись одним щелчком и войдите в систему немедленно',
            it: 'Registra un nuovo account con un clic e accedi immediatamente',
            tr: 'Bir tıklamayla yeni bir hesabı kaydedin ve hemen oturum açın',
            ar: 'سجل حساب جديد بنقرة واحدة وسجل الدخول على الفور',
            th: 'ลงทะเบียนบัญชี ใหม่ด้วยคลิกเดียวและเข้าสู่ระบบทันที',
            vi: 'Đăng ký tài khoản mới chỉ với một cú nhấp chuột và đăng nhập ngay lập tức',
            id: 'Daftar akun baru dengan satu klik dan masuk segera'
        }
    },
    main: {
        '001': {
            en: 'Auto confirm all delete tasks',
            'zh-CN': '自动确认全部删除任务',
            'zh-TW': '自動確認全部刪除任務',
            ja: 'すべての削除タスクを自動確認する',
            ko: '모든 삭제 작업 자동 확인',
            de: 'Alle Löschvorgänge automatisch bestätigen',
            fr: 'Confirmer automatiquement toutes les tâches de suppression',
            es: 'Confirmar automáticamente todas las tareas de eliminación',
            pt: 'Confirmar automaticamente todas as tarefas de exclusão',
            ru: 'Автоматически подтверждать все задачи на удаление',
            it: 'Conferma automaticamente tutti i compiti di eliminazione',
            tr: 'Tüm silme görevlerini otomatik olarak onaylayın',
            ar: 'تأكيد جميع مهام الحذف تلقائيًا',
            th: 'ยืนยันงานลบทั้งหมดโดยอัตโนมัติ',
            vi: 'Tự động xác nhận tất cả các tác vụ xóa',
            id: 'Konfirmasi otomatis semua tugas penghapusan'
        }
    }
};

async function MonitorMenuClick() {
    let Download = GlobalVariable.language['download'];
    let Delete = GlobalVariable.language['i18n-delete'];
    let DeletePermanently = GlobalVariable.language['delete-permanently'];
    let DownloadElement = GlobalVariable.menu.find('li[aria-label="' + Download + '"]').eq(0);
    let DeleteElement = GlobalVariable.menu.find('li[aria-label="' + Delete + '"]').eq(0);
    let DeletePermanentlyElement = GlobalVariable.menu.find('li[aria-label="' + DeletePermanently + '"]').eq(0);
    if (DownloadElement.length != 0) {
        DownloadElement.on('click', () => {
            DealWithoverlay(0);
        });
    }
    if (DeleteElement.length != 0) {
        DeleteElement.on('click', () => {
            DealWithoverlay(1);
        });
    }
    if (DeletePermanentlyElement.length != 0) {
        DeletePermanentlyElement.on('click', () => {
            DealWithoverlay(1);
        });
    }
}

async function MonitorMenu() {
    let menu = await global_module.waitForElement('ul[class^="context-menu"]', null, null, 100);
    if (menu.html() != '') {
        return;
    }
    GlobalVariable.menu = menu;
    $(menu).on('DOMSubtreeModified', GlobalVariable.MonitorMenuClickFun);
}

function FindStr(obj) {
    global_module.objectDepthEnumerate(obj, function (key, obj) {
        if (key == null) {
            return false;
        }
        if (typeof obj === 'function') {
            let scriptStr = obj.toString();
            if (scriptStr.indexOf('.exports=JSON.parse') != -1 && GlobalVariable['allFileText'] && scriptStr.indexOf(GlobalVariable['allFileText']) != -1) {
                let index = scriptStr.indexOf('.exports=JSON.parse') - 1;
                let char = scriptStr[index];
                scriptStr = scriptStr.replace(char + '.exports=', 'window["__language__"]=');
                scriptStr = '(' + scriptStr + ')()';
                let func = new Function(scriptStr);
                func();
                GlobalVariable.language = unsafeWindow.__language__;
                unsafeWindow.GlobalVariable = GlobalVariable;
                return true;
            }
        }
        return false;
    });
}

GlobalVariable.registerEdMenu = [];

function OverloadMenu() {
    for (let i = 0; i < GlobalVariable.registerEdMenu.length; i++) {
        GM_unregisterMenuCommand(GlobalVariable.registerEdMenu[i]);
    }
    let L001 = GlobalVariable.Interfacelanguage['login']['001'][GlobalVariable.Navigatorlanguage];
    let V001 = GM_getValue('loginForEmail', false) ? '√' : '×';
    GlobalVariable.registerEdMenu.push(
        GM_registerMenuCommand(L001 + ' ' + V001, () => {
            GM_setValue('loginForEmail', !GM_getValue('loginForEmail', false));
            OverloadMenu();
        })
    );
    let L002 = GlobalVariable.Interfacelanguage['main']['001'][GlobalVariable.Navigatorlanguage];
    let V002 = GM_getValue('autoConfirmAllDeleteTasks', false) ? '√' : '×';
    GlobalVariable.registerEdMenu.push(
        GM_registerMenuCommand(L002 + ' ' + V002, () => {
            GM_setValue('autoConfirmAllDeleteTasks', !GM_getValue('autoConfirmAllDeleteTasks', false));
            OverloadMenu();
        })
    );
    let L003 = GlobalVariable.Interfacelanguage['login']['003'][GlobalVariable.Navigatorlanguage];
    GlobalVariable.registerEdMenu.push(
        GM_registerMenuCommand(L003, () => {
            RegisterNewAccount();
        })
    );
}

async function _sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, ms);
    });
}

async function RegisterNewAccount() {
    let QuickInput = $('div#QuickInput').eq(0);
    if (QuickInput.length === 0) {
        alert('Not in the login interface, unable to continue');
        return;
    }
    if ($('input[class*="-login"][class*="password-repeat"][type="password"]').eq(0).length === 0) {
        let tipsLink = $('span[class*="tips-link"]').eq(0);
        global_module.clickElement(tipsLink[0]);
    }
    let email = await global_module.Mail.Change();
    await _sleep(1000);
    let formEmail = $('input[class*="-login"][class*="email"][type="text"]').eq(0);
    global_module.AnalogInput.AnalogInput(formEmail[0], email);
    let sendCode = $('div[class*="-login"][class*="send-message"]').eq(0);
    global_module.clickElement(sendCode[0]);
    while (true) {
        let Mails = await global_module.Mail.getMails();
        if (Mails.length !== 0) {
            let r = await handlingPikpakCaptchasAndLogin(Mails);
            if (r) {
                break;
            }
        }
        await _sleep(1000);
    }
}

function extractNumbers(str) {
    let reg = /\d{6}/g;
    str = str.match(reg);
    if (str == null) {
        return null;
    }
    return str[0];
}

async function handlingPikpakCaptchasAndLogin(Mails) {
    return new Promise((resolve) => {
        let code = null;
        for (let i = 0; i < Mails.length; i++) {
            let Mail = Mails[i];
            let sender = Mail.sender;
            if (sender.search(/Pikpak/i) === -1) {
                continue;
            }
            let text = Mail.text;
            code = extractNumbers(text);
            if (code === null) {
                continue;
            }
            break;
        }
        if (code == null) {
            resolve(false);
            return false;
        }
        let formCode = $('input[class*="-login"][class*="code"][type="text"]').eq(0);
        let formPassword = $('input[class*="-login"][class*="password"][type="password"]').eq(0);
        let formPasswordRepeat = $('input[class*="-login"][class*="password-repeat"][type="password"]').eq(0);
        global_module.AnalogInput.AnalogInput(formCode[0], code);
        let pass = global_module.getRandomString(16);
        global_module.AnalogInput.AnalogInput(formPassword[0], pass);
        global_module.AnalogInput.AnalogInput(formPasswordRepeat[0], pass);
        let loginBtn = $('div[class*="-login"][class*="button"]').eq(0);
        setTimeout(() => {
            global_module.clickElement(loginBtn[0]);
            let now = Date.now();
            let t = setInterval(() => {
                if (Date.now() - now > 30000) {
                    clearInterval(t);
                    resolve(false);
                    return false;
                }
                if (window.location.href.search(/login/i) === -1) {
                    clearInterval(t);
                    alert('Your password is:' + pass);
                    MonitorUrl(1);
                }
            }, 1000);
            resolve(true);
        }, 200);
    });
}

function analyzeLoginInfo(item, text) {
    let emailReg = /([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/g;
    let email = text.match(emailReg);
    if (email == null) {
        return;
    }
    let password = '';
    text = text.replace(emailReg, '');
    text = text.replace(/\n/g, '');
    email = email[0];
    if (text.indexOf(':') != -1) {
        let index = text.lastIndexOf(':');
        password = text.substring(index + 1);
    } else if (!/\s/.test(text)) {
        password = text.replace(/[^a-zA-Z0-9\!\@\#\$\%\^\&\*\(\)\_\+\-\=\[\]\{\}\|\\\:\;\"\'\,\.\/\<\>\?]/g, '');
    } else {
        let index = text.lastIndexOf(' ');
        password = text.substring(index + 1);
    }
    if (email != '' && password != '') {
        let inputList = item.find('input[class][placeholder][type]');
        email = email.replace(/\s/g, '');
        password = password.replace(/\s/g, '');
        global_module.AnalogInput.AnalogInput(inputList.eq(0)[0], email);
        global_module.AnalogInput.AnalogInput(inputList.eq(1)[0], password);
        let loginBtn = item.find('div[class*="login-button"]').eq(0);
        MonitorUrl(1);
        setTimeout(() => {
            loginBtn.click();
        }, 200);
    }
}

function loginPaneleModified() {
    let forgetPasswordElement = GlobalVariable.loginPanel.find('div[class*="forget-password"]').eq(0);
    if (forgetPasswordElement.length == 0) {
        return;
    }
    let item = forgetPasswordElement.parent();
    let form = item.parent().eq(0);
    if (form.find('div#QuickInput').length != 0) {
        return;
    }
    let QuickInputHeight = 188;
    let div = $(`<div id="QuickInput"><textarea placeholder="` + GlobalVariable.Interfacelanguage['login']['002'][GlobalVariable.Navigatorlanguage] + `" style="width: 100%; height:` + QuickInputHeight + `px;"></textarea></div>`);
    form.append(div);
    let formHeight = form.height();
    form.css('height', formHeight + QuickInputHeight + 'px');
    form.find('div[class="agreement"]').eq(0).css('display', 'none');
    let textarea = div.find('textarea').eq(0);
    textarea.on(
        'input propertychange',
        global_module.debounce(() => {
            let text = $(textarea).val();
            analyzeLoginInfo(item, text);
        }, 200)
    );
    if (unsafeWindow['_autoLoginInfo_']) {
        analyzeLoginInfo(item, unsafeWindow['_autoLoginInfo_']());
    }
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
    GlobalVariable.MonitorUrlInterval.push(
        setInterval(() => {
            let path = unsafeWindow.location.pathname;
            if (path == GlobalVariable.HistoricalUrlPath) {
                return;
            }
            if (path.indexOf('/drive/login') != -1 && to == 0) {
                login();
            } else if (to == 1) {
                main();
            }
            StopMonitorUrl();
        }, 500)
    );
}

async function login() {
    let loginPanel = await global_module.waitForElement('div[class*="login-panel"]', null, null, 100, -1);
    loginPanel = loginPanel.eq(0);
    GlobalVariable.loginPanel = loginPanel;
    loginPanel.on('DOMSubtreeModified', global_module.debounce(loginPaneleModified, 200));
    if (GM_getValue('loginForEmail', false)) {
        let emailBtn = await global_module.waitForElement('div[class*="icon-email"]', null, null, 100, -1);
        emailBtn.eq(0).click();
    }
    Init(0);
}

async function MonitorLogout() {
    let nav = await global_module.waitForElement('ul[class="user-nav"]', null, null, 100, -1);
    let li = nav.find('li').eq(-1);
    li.on('click', () => {
        $('body').remove();
        for (let key in localStorage) {
            localStorage.removeItem(key);
        }
        global_module.Cookie.clear();
        unsafeWindow.location.href = '/drive/login';
    });
}

async function ListenControlButtonClick() {
    let controlButton = await global_module.waitForElement('div[class="menu-box"]', null, null, 1000, 60 * 1000);
    GlobalVariable.controlButton = {
        controlButton
    };
    let globalActionClick = () => {
        DealWithoverlay(2, (overlay, Target) => {
            if (Target.hasClass('is-checked')) {
                Target.click();
            }
            setTimeout(() => {
                DealWithoverlay(1);
            }, 100);
        });
    };
    let Btn = controlButton;
    controlButton.click(() => {
        if (!GM_getValue('autoConfirmAllDeleteTasks', false)) {
            return;
        }
        if (GlobalVariable.controlButton.transferContent == null || GlobalVariable.controlButton.transferContent.length == 0) {
            GlobalVariable.controlButton.transferContent = $(Btn).parent().eq(0).parent().eq(0).find('div[class^="transfer-content"]').eq(0);
        }
        let transferContent = GlobalVariable.controlButton.transferContent;
        let clearTimes = () => {
            if (GlobalVariable.controlButton.FindTime != null) {
                clearTimeout(GlobalVariable.controlButton.FindTime);
            }
            if (GlobalVariable.controlButton.FindGlobalActionTime != null) {
                clearInterval(GlobalVariable.controlButton.FindGlobalActionTime);
            }
        };
        clearTimes();
        GlobalVariable.controlButton.FindTime = setTimeout(() => {
            let isShow = transferContent.css('display') != 'none';
            if (!isShow) {
                if (GlobalVariable.controlButton.globalAction != null) {
                    GlobalVariable.controlButton.globalAction.off('click', globalActionClick);
                }
                clearTimes();
                return;
            }
            let _class = 'global-action';
            let transferContentFather = transferContent.find('div[class="' + _class + '"]').eq(0);
            let FindGlobalAction = () => {
                let globalAction = transferContentFather.find('div[class^="' + _class + '"]').eq(0);
                GlobalVariable.controlButton.globalAction = globalAction;
                globalAction.on('click', globalActionClick);
            };
            if (transferContentFather.length > 0) {
                FindGlobalAction();
            } else {
                GlobalVariable.controlButton.FindGlobalActionTime = setInterval(() => {
                    transferContentFather = transferContent.find('div[class="' + _class + '"]').eq(0);
                    if (transferContentFather.length == 0) {
                        return;
                    }
                    clearTimes();
                    FindGlobalAction();
                }, 200);
            }
        }, 260);
    });
}

async function main() {
    MonitorUrl(0);
    MonitorLogout();
    let nav = await global_module.waitForElement('ul[class="nav"]', null, null, 100, 60 * 1000);
    if (nav == null) {
        for (let i = 0; i < 5; i++) {
            new Error('nav is null');
        }
        return;
    }
    await new Promise((resolve) => {
        let timer = setInterval(() => {
            try {
                let text = $('span[class="nav-item-name"]').eq(0).text();
                if (text == null || text == '') {
                    return;
                }
                clearInterval(timer);
                GlobalVariable['allFileText'] = text;
                resolve();
            } catch (e) {}
        }, 200);
    });
    FindStr(unsafeWindow.webpackChunkxlco_pikpak_web);
    if (GlobalVariable.language == null) {
        GlobalVariable.language = {
            'my-vip-days': 'Vip remaining {0} days',
            download: 'Download',
            'i18n-delete': 'Delete',
            'delete-permanently': 'Delete permanently'
        };
    }
    GlobalVariable.nav = nav;
    let activeLi = await global_module.waitForElement('a[class^="active"]', null, null, 100, 60 * 1000, nav);
    if (activeLi == null) {
        for (let i = 0; i < 5; i++) {
            new Error('activeLi is null');
        }
        return;
    }
    ListenControlButtonClick();
    StopMonitorUrl();
    GlobalVariable.activeLi = activeLi;
    nav.find('li').on('click', LiClick);
    $('svg[class="safety"]').eq(0).remove();
    MonitorMenu();
    Init(1);
}

unsafeWindow['__hookRequest__'].FetchCallback.add('/vip/v1/vip/info', (_object, period) => {
    if (period === 'preRequest') {
        return null;
    } else if (period === 'done') {
        (async () => {
            let json = JSON.parse(_object.text);
            let data = json.data;
            let expire = data.expire;
            let now = new Date();
            let expireDate = new Date(expire);
            let day = (expireDate.getTime() - now.getTime()) / (24 * 60 * 60 * 1000);
            day = Math.ceil(day);
            if (day < 0) {
                return;
            }
            if (unsafeWindow['Pikpak_Archive'] != null) {
                try {
                    unsafeWindow['Pikpak_Archive']();
                } catch (e) {}
            }
            await new Promise((resolve) => {
                let Time = setInterval(() => {
                    if (GlobalVariable.language == null) {
                        return;
                    }
                    if (GlobalVariable.language['my-vip-days'] == null) {
                        return;
                    }
                    clearInterval(Time);
                    resolve();
                }, 500);
            });
            let title = GlobalVariable.language['my-vip-days'].replace('{0}', day);
            if (GlobalVariable.vipDaysDom != null) {
                GlobalVariable.vipDaysDom.text(title);
                return;
            }
            let cloneDom = await global_module.waitForElement('div[class="header-bar-right"]', null, null, 100, -1);
            cloneDom = cloneDom.find('a').eq(0);
            let newDom = $(global_module.cloneAndHide(cloneDom[0], 1));
            newDom.attr('id', '_vipdays_');
            GlobalVariable.vipDaysDom = newDom;
            cloneDom.show();
            $(newDom).text(title);
        })();
    }
});

function Init(index) {
    SaveStorage('pp_access_to_visit', 'true');
    SaveStorage('allow_analysis', 'true');
    if (index == 0) {
    } else if (index == 1) {
        for (let i = 0; i < localStorage.length; i++) {
            let key = localStorage.key(i);
            let value = localStorage.getItem(key);
            if (key.indexOf('credentials_') != -1) {
                let json = JSON.parse(value);
                let sub = json.sub;
                let token = json.access_token;
                GlobalVariable.Token = token;
                if (sub == null) {
                    new Error(json);
                    return;
                }
                SaveStorage('pp_disabled_speed_save_dialog_' + sub, 'true');
                break;
            }
        }
    }
}

function SaveStorage(key, value) {
    global_module.Cookie.set(key, value, 365);
    localStorage.setItem(key, value);
}

function Preload() {
    OverloadMenu();
    Init();
    let href = unsafeWindow.location.href;
    if (href.indexOf('/drive/login') != -1) {
        login();
    } else {
        main();
    }
}

Preload();
