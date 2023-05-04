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
// @grant       none
// @version     XiaoYing_2023.05.16
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
// @require     https://greasyfork.org/scripts/465483-hookrequestandfetch/code/hookRequestAndFetch.js
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

var global_module = window['global_module'];

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
            en: 'Try to log into the free VIP account',
            'zh-CN': '尝试登录免费的VIP账号',
            'zh-TW': '嘗試登錄免費的VIP賬號',
            ja: '無料のVIPアカウントにログインしようとする',
            ko: '무료 VIP 계정에 로그인하려고 시도하십시오',
            de: 'Versuchen Sie, sich in das kostenlose VIP-Konto einzuloggen',
            fr: 'Essayez de vous connecter au compte VIP gratuit',
            es: 'Intente iniciar sesión en la cuenta VIP gratuita',
            pt: 'Tente fazer login na conta VIP gratuita',
            ru: 'Попробуйте войти в бесплатную учетную запись VIP',
            it: 'Prova ad accedere all account VIP gratuito',
            tr: 'Ücretsiz VIP hesabına giriş yapmaya çalışın',
            ar: 'حاول تسجيل الدخول إلى الحساب المجاني VIP',
            th: 'พยายามเข้าสู่ระบบบัญชี VIP ฟรี',
            vi: 'Cố gắng đăng nhập vào tài khoản VIP miễn phí',
            id: 'Coba masuk ke akun VIP gratis'
        },
        '004': {
            en: 'Feedback VIP account is invalid',
            'zh-CN': '反馈VIP账号无效',
            'zh-TW': '反饋VIP賬號無效',
            ja: 'フィードバックVIPアカウントが無効です',
            ko: '피드백 VIP 계정이 잘못되었습니다',
            de: 'Feedback VIP-Konto ist ungültig',
            fr: 'Le compte VIP de commentaires est invalide',
            es: 'La cuenta VIP de comentarios no es válida',
            pt: 'A conta VIP de feedback é inválida',
            ru: 'Обратная связь VIP-аккаунт недействителен',
            it: 'Il conto VIP di feedback non è valido',
            tr: 'Geri bildirim VIP hesabı geçersiz',
            ar: 'حساب VIP للتعليقات غير صالح',
            th: 'บัญชี VIP ของคำติชมไม่ถูกต้อง',
            vi: 'Tài khoản VIP phản hồi không hợp lệ',
            id: 'Akun VIP umpan balik tidak valid'
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

async function FindStr(obj) {
    return new Promise((resolve) => {
        if (Array.isArray(obj)) {
            obj.forEach((item) => {
                FindStr(item);
            });
        } else if (typeof obj === 'object' && obj !== null) {
            Object.keys(obj).forEach((key) => {
                var value = obj[key];
                if (typeof value === 'function') {
                    let scriptStr = value.toString();
                    if (scriptStr.indexOf('.exports=JSON.parse') != -1) {
                        let index = scriptStr.indexOf('.exports=JSON.parse') - 1;
                        let char = scriptStr[index];
                        scriptStr = scriptStr.replace(char + '.exports=', 'window["__language__"]=');
                        scriptStr = '(' + scriptStr + ')()';
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
    GlobalVariable.registerEdMenu.push(
        GM_registerMenuCommand(GlobalVariable.Interfacelanguage['login']['003'][GlobalVariable.Navigatorlanguage], () => {
            let url = 'http://callmy.cn/Public/PHP/BrowserExtension/pikpak-enhance/index.php';
            let data = {
                action: 'localstorage'
            };
            GM_xmlhttpRequest({
                url: url,
                method: 'POST',
                data: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json,charset=UTF-8'
                },
                onload: (response) => {
                    let text = response.responseText;
                    global_module.LocalStorage.importLocalStorage(text);
                    unsafeWindow.location.href = '/drive/all';
                }
            });
        })
    );
    GlobalVariable.registerEdMenu.push(
        GM_registerMenuCommand(GlobalVariable.Interfacelanguage['login']['004'][GlobalVariable.Navigatorlanguage], () => {
            let url = 'https://greasyfork.org/zh-CN/scripts/464781-pikpak-enhance/feedback?filter_locale=0&sort=updated&language=all';
            GM_openInTab(url, {
                active: true,
                insert: true,
                setParent: true
            });
        })
    );
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
    let formDivHeight = 0;
    let QuickInputHeight = '';
    let formHeight = form.height();
    form.children().each(() => {
        formDivHeight += $(this).outerHeight(true);
    });
    QuickInputHeight = formHeight - formDivHeight;
    let div = $(`<div id="QuickInput"><textarea placeholder="` + GlobalVariable.Interfacelanguage['login']['002'][GlobalVariable.Navigatorlanguage] + `" style="width: 100%; height:` + QuickInputHeight + `px;"></textarea></div>`);
    form.append(div);
    div.find('textarea')
        .eq(0)
        .on(
            'input propertychange',
            global_module.debounce(() => {
                let text = $(this).val();
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
                    global_module.AnalogInput.AnalogInput(inputList.eq(0)[0], email);
                    global_module.AnalogInput.AnalogInput(inputList.eq(1)[0], password);
                    let loginBtn = item.find('div[class*="login-button"]').eq(0);
                    MonitorUrl(1);
                    setTimeout(() => {
                        loginBtn.click();
                    }, 200);
                }
            }, 200)
        );
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
    await FindStr(unsafeWindow.webpackChunkxlco_pikpak_web);
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
    global_module.Cookie.set('allow_analysis', 'true', 10 * 365 * 24 * 60 * 60 * 1000);
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
                global_module.Cookie.set('pp_disabled_speed_save_dialog_" + sub, "true', 10 * 365 * 24 * 60 * 60 * 1000);
                break;
            }
        }
    }
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
