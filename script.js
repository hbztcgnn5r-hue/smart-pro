const GOOGLE_SYNC_URL = "https://google.com";

(() => {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);
  const main = $("#main");
  const terms = [3, 6, 9, 12];
  const categories = ["Apple iPhone", "Аксессуары"];
  const groups = ["Установка удалённых приложений из App Store", "Сервис"];
  const defaults = {
    rates: { 3: 8, 6: 15, 9: 22, 12: 30 },
    whatsapp: "79889354777", telegram: "smartpro_nalchik",
    address: "г. Нальчик, ул. Кирова 1Д, ТЦ «Галерея», 1 этаж у главного входа",
    hours: "Ежедневно с 10:00 до 21:00", syncUrl: GOOGLE_SYNC_URL
  };
  const STORAGE = "smartpro.catalog.v1";
  const SESSION = "smartpro.admin.v1";
  const rub = new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 2 });
  const money = n => rub.format(n) + " ₽";
  const esc = value => String(value ?? "").replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[c]);
  const colorHex = v => /^#[a-f\d]{6}$/i.test(v) ? v : "#475569";
  function httpsUrl(value) {
    try {
      const u = new URL(value);
      return u.protocol === "https:" && !u.username && !u.password ? u.href : "";
    } catch { return ""; }
  }
  const icons = {
    phone: '<rect x="6" y="2" width="12" height="20" rx="3"/><path d="M10 5h4m-3 14h2"/>',
    pin: '<path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.7"/>',
    call: '<path d="m5 3 3-1 3 5-2 2c1.5 3 3.2 4.7 6 6l2-2 5 3-1 3c-.5 2-3 3-5 2C9 18 5 14 2.8 7.5 2 5.5 3 4 5 3Z"/>',
    wa: '<path d="M21 11.6a9 9 0 0 1-13.4 7.8L3 20.8l1.3-4.6A9 9 0 1 1 21 11.6Z"/><path d="M8.2 7.2c-1.8 1.7 1.8 7.3 5.6 8 1 .2 2-.5 2.2-1.6l-2.3-1.2-.9.8c-1.3-.6-2.3-1.6-2.9-2.8l.7-.9-1.1-2.4Z"/>',
    tg: '<path d="m2 11 19-8-3.5 18-6.2-5-3 2 .5-5L18 6 7 12.8Z"/>',
    tools: '<path d="m14 6 3 3 4-4a6 6 0 0 1-7.6 7.5L6 20a2 2 0 0 1-3-3l7.4-7.4A6 6 0 0 1 18 2Z"/>',
    card: '<rect x="2" y="5" width="20" height="14" rx="3"/><path d="M2 10h20M6 15h4"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/>',
    search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
    left: '<path d="m14 5-7 7 7 7"/>', right: '<path d="m9 5 7 7-7 7"/>',
    back: '<path d="M20 12H4m7-7-7 7 7 7"/>',
    sort: '<path d="M3 6h17M3 12h12M3 18h7"/>', down: '<path d="m6 9 6 6 6-6"/>',
    settings: '<path d="m9 3 .7-1h4.6l.7 3 2 .9 2.5-.9 2 3.5-2 2v2.7l2 2-2 3.5-2.5-.8-2 .9-.7 2.6H9.7L9 19l-2-.9-2.5.8-2-3.5 2-2v-2.7l-2-2 2-3.5 2.5.9 2-.9Z"/><circle cx="12" cy="12" r="3.2"/>',
    grid: '<rect x="3" y="3" width="7" height="7" rx="1.4"/><rect x="14" y="3" width="7" height="7" rx="1.4"/><rect x="3" y="14" width="7" height="7" rx="1.4"/><rect x="14" y="14" width="7" height="7" rx="1.4"/>',
    check: '<path d="m4 12 5 5L20 6"/>', pack: '<path d="m3 7 9-5 9 5v10l-9 5-9-5Zm0 0 9 5 9-5M12 12v10"/>',
    bank: '<path d="m2 8 10-6 10 6ZM3 21h18M6 11v7m6-7v7m6-7v7"/>',
    transfer: '<rect x="2" y="6" width="6" height="15" rx="1.5"/><rect x="16" y="3" width="6" height="15" rx="1.5"/><path d="M6 3h7l-2-2m2 2-2 2M18 21h-7l2-2"/>',
    glass: '<rect x="5" y="2" width="14" height="20" rx="3"/><path d="m9 12 5-6m-5 13 7-9"/>',
    plus: '<path d="M12 4v16M4 12h16"/>', lock: '<rect x="4" y="10" width="16" height="12" rx="2"/><path d="M7 10V7a5 5 0 1 1 10 0v3m-5 4v4"/>',
    case: '<path d="M3 9h18v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4ZM8 9V7a4 4 0 0 1 8 0v2"/>',
    file: '<path d="M5 2h9l5 5v15H5Zm9 0v6h5m-11 5h8m-8 4h6"/>',
    edit: '<path d="m4 16 12-12 4 4L8 20l-5 1Zm9-9 4 4"/>',
    trash: '<path d="M3 6h18M9 6V3h6v3M6 6l1 15h10l1-15M10 10v7m4-7v7"/>',
    exit: '<path d="M10 4H4v16h6m-1-8h12m-5-5 5 5-5 5"/>',
    upload: '<path d="M12 16V3m-5 5 5-5 5 5M3 16v5h18v-5"/>',
    coin: '<circle cx="12" cy="12" r="9"/><path d="M10 17V7h3a3 3 0 1 1 0 6H8m0 2h5"/>',
    star: '<path d="m12 2 2.3 6.8L21 11l-6.7 2.3L12 20l-2.3-6.7L3 11l6.7-2.2Z"/>'
  };
  const icon = (name, size = 19) => '<svg aria-hidden="true" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round">' + (icons[name] || icons.phone) + '</svg>';
  const logo = () => '<span class="wordmark"><svg class="brandmark" aria-hidden="true" viewBox="0 0 42 40" fill="currentColor"><path d="M15 3h25l-6 9H18l-3 5H3Zm-4 20h16l3-5h11L29 37H3l6-9h15l3-5H11Z"/></svg><span>SMART<span class="pro">PRO</span></span></span>';

  function seed() {
    const list = [];
    function add(name, kind, price, color, hex, memory = "", sim = "", warranty = "") {
      list.push({id: "p" + (list.length + 1), name, kind, price, color, hex, memory, sim, warranty,
        category: kind === "phone" ? categories[0] : categories[1], available: true, photo: "", description: ""});
    }
    add("AirPods 4", "buds", 15000, "White", "#e9ebed");
    add("AirPods 4 (с шумоподавлением)", "buds", 16000, "White", "#e9ebed");
    add("AirPods 5", "buds", 17000, "White", "#e9ebed");
    add("Apple Watch Series S11 46 mm Grey Black M/L", "watch", 38000, "Grey Black", "#3b3e42", "", "", "1 год");
    add("iPhone 13", "phone", 51000, "Midnight", "#1c222a", "128 ГБ", "", "1 год");
    add("iPhone 17", "phone", 80000, "Black", "#1f2024", "256 ГБ", "eSIM + SIM", "1 год");
    const silver = ["Silver", "#d8dadd"], blue = ["Blue", "#3f5b78"], black = ["Black", "#1f2024"];
    const burgundy = ["Burgundy", "#5c2530"], glacier = ["Glacier", "#b8d0dc"];
    function iphone(model, price, shade, capacity, sim, warranty) {
      add("iPhone " + model, "phone", price, ...shade, capacity + " ГБ", sim, warranty);
    }
    iphone("17 Pro", 103000, silver, 256, "eSIM", "1 год");
    iphone("17 Pro", 104000, silver, 256, "eSIM", "2 месяца");
    iphone("17 Pro", 102000, blue, 256, "eSIM", "1 год");
    iphone("17 Pro Max", 106000, blue, 256, "eSIM", "1 год");
    iphone("18 Pro", 124000, silver, 256, "eSIM + SIM", "1 год");
    iphone("18 Pro", 134000, black, 512, "eSIM", "2 месяца");
    iphone("18 Pro", 125000, burgundy, 256, "eSIM + SIM", "1 год");
    iphone("18 Pro", 113000, glacier, 256, "eSIM", "");
    iphone("18 Pro", 114000, glacier, 256, "eSIM", "2 месяца");
    iphone("18 Pro Max", 146000, black, 512, "eSIM", "1 год");
    iphone("18 Pro Max", 146000, burgundy, 512, "eSIM", "1 год");
    iphone("18 Pro Max", 124000, silver, 256, "eSIM", "1 год");
    const serviceRows = [
      ["Установка СберБанк Онлайн",1000,"bank","Поможем установить доступную совместимую версию приложения на ваш iPhone. Перед визитом напишите модель телефона и версию iOS. Вход в банк и подтверждение операций вы выполняете самостоятельно."],
      ["Установка Т-Банк (Тинькофф)",1000,"bank","Проверим совместимость вашего iPhone и поможем установить приложение Т-Банка. После установки вы сами входите в свой аккаунт на устройстве."],
      ["Пакет банковских приложений (3 в 1)",2000,"grid","Установка трёх приложений за один визит. В пакет входят Сбер, Т-Банк и одно приложение на выбор — Альфа-Банк или ВТБ. Доступность версий уточним для вашей модели iPhone."],
      ["Полный перенос данных со старого телефона",1500,"transfer","Перенесём доступные контакты, фото и другие личные данные между iPhone и Android. Возьмите оба телефона. До начала работы согласуем состав переноса, а после проверим результат вместе."],
      ["Прошивка и восстановление iOS / Android",2000,"tools","Восстановим систему на совместимом iPhone или Android. До начала работ уточним состояние телефона, согласуем возможное удаление данных и обсудим резервную копию."],
      ["Поклейка защитного стекла Remax / Baseus",800,"glass","Подберём совместимое защитное стекло Remax или Baseus, очистим экран и аккуратно установим защиту. Наличие стекла для вашей модели и комплектацию уточните перед визитом."]
    ];
    return {products:list, services:serviceRows.map(([name,price,symbol,description],i) =>
      ({id:"s"+(i+1),name,price,symbol,description,group:groups[i<3?0:1]})), settings:structuredCopy(defaults)};
  }
  function structuredCopy(v) { return JSON.parse(JSON.stringify(v)); }
  const validPrice = n => typeof n === "number" && Number.isFinite(n) && n >= 0 && n <= 1e9;
  const digits = value => String(value).replace(/\D/g, "");
  const goodTel = s => /^[1-9]\d{7,14}$/.test(s);
  const goodTg = s => /^[a-zA-Z0-9_]{5,32}$/.test(s);
  const stringFields = (obj, fields) => Object.fromEntries(fields.map(k => [k, typeof obj[k] === "string" ? obj[k].trim() : ""]));
  function readState(raw, base = seed()) {
    if (!raw || !Array.isArray(raw.products)) throw Error("В базе отсутствует массив products.");
    function readList(records, isProduct) {
      if (!Array.isArray(records)) throw Error("Неверный формат списка.");
      const ids = new Set();
      return records.map(item => {
        if (!item || !/^[\w-]{1,100}$/.test(String(item.id)) || item.id == null || ids.has(String(item.id)) ||
          typeof item.name !== "string" || !item.name.trim() || !validPrice(item.price)) throw Error("Проверьте ID, названия и цены записей.");
        const id = String(item.id);
        ids.add(id);
        const common = {id, name:item.name.trim(), price:item.price, ...stringFields(item,["description"])};
        if (!isProduct) return {...common,group:groups.includes(item.group)?item.group:groups[1],
          symbol:Object.hasOwn(icons,item.symbol)?item.symbol:"tools"};
        const category = categories.includes(item.category) ? item.category : categories[0];
        return {...common,category, ...stringFields(item,["color","memory","sim","warranty"]),hex:colorHex(item.hex),
          kind:["phone","buds","watch","other"].includes(item.kind)?item.kind:category===categories[0]?"phone":"other",
          photo:httpsUrl(item.photo),available:item.available !== false};
      });
    }
    const cfg = raw.settings || {};
    const settings = {...base.settings, rates:{...base.settings.rates}};
    if (cfg.rates) for (const term of terms) {
      const rate = cfg.rates[term];
      if (!validPrice(rate) || rate > 1000) throw Error("Некорректная наценка.");
      settings.rates[term] = rate;
    }
    if (cfg.whatsapp !== undefined) {
      const n = digits(cfg.whatsapp);
      if (!goodTel(n)) throw Error("Некорректный номер WhatsApp.");
      settings.whatsapp = n;
    }
    if (cfg.telegram !== undefined) {
      const handle = String(cfg.telegram).replace(/^@/,"");
      if (!goodTg(handle)) throw Error("Некорректное имя Telegram.");
      settings.telegram = handle;
    }
    for (const k of ["hours","address"]) if (typeof cfg[k] === "string" && cfg[k].trim()) settings[k] = cfg[k].trim();
    if (httpsUrl(cfg.syncUrl)) settings.syncUrl = cfg.syncUrl;
    return {products:readList(raw.products,true), services:raw.services === undefined ? structuredCopy(base.services) : readList(raw.services,false),settings};
  }

  let state = seed(), dirty = false, revision = 0, storageOK = true, authenticated = false;
  let cloudVersion = 0, conflict = false, writeKey = "", keyUrl = "";
  try {
    const cached = JSON.parse(localStorage.getItem(STORAGE));
    if (cached) { state = readState(cached.state); dirty = cached.dirty === true; cloudVersion = Number(cached.cloudVersion) || 0; conflict = cached.conflict === true; }
  } catch { /* An invalid cache never prevents startup. */ }
  try {
    authenticated = sessionStorage.getItem(SESSION) === "yes";
    const auth = JSON.parse(sessionStorage.getItem(SESSION + ".cloud"));
    if (authenticated && auth) { writeKey = auth.key; keyUrl = auth.url; }
  } catch { /* Memory-only session. */ }
  if (state.settings.syncUrl.replace(/\/$/,"") === "https://google.com" && GOOGLE_SYNC_URL !== "https://google.com") state.settings.syncUrl=GOOGLE_SYNC_URL;
  const ui = {query:"", category:"Все товары",sort:"featured",slide:0};
  let publishing = false, cloudStatus = "", toastTimer = 0, uploadVersion = 0;
  let editorDirty = false;
  function notify(message) {
    const n = $("#notice"); n.textContent = message; n.classList.add("visible");
    clearTimeout(toastTimer); toastTimer = setTimeout(() => n.classList.remove("visible"), 5000);
  }
  function persist() {
    try { localStorage.setItem(STORAGE, JSON.stringify({state,dirty,cloudVersion,conflict})); storageOK = true; }
    catch { storageOK = false; }
  }
  function status(message) {
    cloudStatus = message;
    const el = $("#cloud-status");
    if (el) el.textContent = message;
  }
  function endpoint() {
    const url = httpsUrl(state.settings.syncUrl);
    if (!url || url.replace(/\/$/,"") === "https://google.com") return "";
    return url;
  }
  // Only signatures leave this session. The public catalog and backups contain no write key.
  async function signedUrl(url, body) {
    if (!writeKey || keyUrl !== url) return url;
    const encoder = new TextEncoder();
    const stamp = String(Date.now());
    const key = await crypto.subtle.importKey("raw",encoder.encode(writeKey),{name:"HMAC",hash:"SHA-256"},false,["sign"]);
    const input = stamp+"\n"+cloudVersion+"\n"+body;
    const digest = new Uint8Array(await crypto.subtle.sign("HMAC",key,encoder.encode(input)));
    const signature = btoa(String.fromCharCode(...digest)).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"");
    const target = new URL(url);
    target.searchParams.set("ts",stamp);target.searchParams.set("base",String(cloudVersion));target.searchParams.set("sig",signature);
    return target.href;
  }
  async function request(url, payload, timeout = 15000) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);
    try {
      const options = {signal:controller.signal,cache:"no-store",credentials:"omit",referrerPolicy:"no-referrer"};
      if (payload) {
        const body = JSON.stringify(payload);
        url = await signedUrl(url,body);
        Object.assign(options,{method:"POST",headers:{"Content-Type":"text/plain;charset=utf-8"},body});
      } else if (url.replace(/\/$/,"") === "https://google.com") {
        // The supplied placeholder cannot serve cross-origin JSON.
        options.mode = "no-cors";
      }
      const response = await fetch(url, options);
      if (response.type === "opaque" && !payload) return {};
      if (!response.ok) throw Error("Сервис вернул ошибку.");
      const data = await response.json();
      if (data?.error === "auth") throw Error("auth");
      if (data?.error === "conflict") throw Error("conflict");
      if (!data || typeof data !== "object" || Array.isArray(data) || data.error || data.ok === false || data.success === false || data.status === "error")
        throw Error("Облако отклонило запрос.");
      return data;
    } finally { clearTimeout(timer); }
  }
  async function publish() {
    if (publishing || !dirty) return;
    if (conflict) { status("Облачный каталог успел измениться. Скачайте локальную копию и откройте облачную версию в разделе резервных копий."); return; }
    const url = endpoint();
    if (!url) { status(storageOK ? "Сохранено на этом устройстве. Облако не подключено." : "Данные только в памяти. Скачайте резервную копию."); return; }
    if (!authenticated) { status("Есть локальные изменения. Войдите для публикации."); return; }
    publishing = true; const version = revision;
    status("Сохранение в облако Google…");
    try {
      const data = await request(url, {action:"save",state});
      if (!(data.ok === true || data.success === true || ["ok","success","saved"].includes(data.status) || data.saved === true))
        throw Error("Нет подтверждения записи.");
      if (url === endpoint() && Number.isSafeInteger(data._version)) { cloudVersion=data._version; persist(); }
      if (version === revision) {
        dirty = false; persist(); status("Сохранено в облаке и опубликовано для всех клиентов ✓"); notify(cloudStatus);
      }
    } catch (error) {
      if (url === endpoint() && error.message === "conflict") { conflict=true; persist(); }
      if (version === revision) {
        if (conflict) status("Облачный каталог успел измениться. В разделе резервных копий можно скачать свои правки и открыть актуальную версию.");
        else if (error.message === "auth") status("Облако отклонило подпись. Проверьте ключ публикации в настройках.");
        else status(storageOK ? "Сохранено на этом устройстве. Облако не подтвердило публикацию." : "Сохранение не подтверждено. Скачайте резервную копию.");
        notify(cloudStatus);
      }
    }
    finally { publishing = false; if (version !== revision && dirty) void publish(); }
  }
  function commit() {
    revision++; dirty = true; persist();
    if (!endpoint() || !storageOK) notify(storageOK ? "Сохранено на этом устройстве" : "Данные только в памяти. Скачайте резервную копию.");
    void publish();
  }
  async function pull() {
    const url = endpoint(), version = revision;
    if (dirty) { void publish(); return; }
    if (!url && navigator.onLine === false) return;
    try {
      const incoming = await request(url || GOOGLE_SYNC_URL);
      if (version !== revision || dirty || url !== endpoint() || !Array.isArray(incoming.products)) return;
      const next = readState(incoming,state);
      next.settings.syncUrl = state.settings.syncUrl;
      state = next; cloudVersion=Number(incoming._version)||0; revision++; persist();
      status("Каталог обновлён из облака.");
      refreshAfterSync();
    } catch { if (url) status("Облако недоступно. Открыта локальная версия каталога."); }
  }

  // Small vector illustrations share shapes and use the finish from each product.
  let artSerial = 0;
  function illustration(p, hero = false) {
    const id = "v" + (++artSerial), ref = key => "url(#" + id + key + ")";
    const c = colorHex(p.hex);
    function tinted(target, r) {
      const rgb = [1,3,5].map(i => Math.round(parseInt(c.slice(i,i+2),16)*(1-r)+target*r));
      return "rgb("+rgb.join(",")+")";
    }
    const g = (key, stops, x2="100%", y2="100%") =>
      '<linearGradient id="'+id+key+'" x2="'+x2+'" y2="'+y2+'">'+stops.map(([o,v])=>'<stop offset="'+o+'" stop-color="'+v+'"/>').join("")+'</linearGradient>';
    const metal = g("body", [["0%",tinted(235,.48)],["18%",tinted(210,.18)],["60%",c],["100%",tinted(7,.42)]]);
    const trim = g("trim",[["0%",tinted(245,.65)],["18%",c],["43%",tinted(250,.53)],["67%",tinted(10,.43)],["100%",tinted(240,.5)]]);
    const lens = g("lens",[["0%","#4c596c"],["20%","#151e2c"],["43%","#060a12"],["75%","#28333e"],["100%","#687587"]]);
    const glass = g("glass",[["0%","#0e1e36"],["25%","#385778"],["49%","#090e15"],["85%","#09111d"],["100%","#21364d"]]);
    const screen = g("screen",[["0%","#071326"],["43%","#193f78"],["77%","#0c203f"],["100%","#050d1c"]]);
    const ribbon = g("ribbon",[["0%","#0c2d5b"],["24%","#367bc5"],["46%","#8cc4f9"],["55%","#295197"],["84%","#101e3e"],["100%","#5477ae"]]);
    const white = g("white",[["0%","#fafcfe"],["31%","#dce2ea"],["57%","#fff"],["83%","#b8c0cd"],["100%","#7b8898"]]);
    const band = g("band",[["0%","#23272e"],["36%","#555b61"],["67%","#32373e"],["100%","#1e222a"]]);
    let defs = metal+trim+lens+glass+screen+ribbon+white+band;
    function camera(x,y,r) {
      return '<g transform="translate('+x+' '+y+')"><circle r="'+r+'" fill="'+ref("trim")+'" stroke="#202935" stroke-width=".8"/><circle r="'+(r-2)+'" fill="'+ref("lens")+'"/><circle r="'+(r-4)+'" fill="#070a10" stroke="#3c495a" stroke-width=".8"/><circle r="'+(r*.43)+'" fill="'+ref("glass")+'"/><circle cx="-2" cy="-2.5" r="2" fill="#5579a2" opacity=".6"/><circle cx="2.5" cy="2.5" r="1.4" fill="#8999c3" opacity=".5"/></g>';
    }
    let shapes = "";
    if (p.kind === "phone") {
      const pro = /Pro/i.test(p.name);
      const back = '<rect x="0" y="0" width="140" height="246" rx="24" fill="'+ref("trim")+'" stroke="'+tinted(210,.36)+'" stroke-width="1.4"/><rect x="3" y="2" width="134" height="240" rx="22" fill="'+ref("body")+'"/><path d="M3 36h2m129 0h4M3 207h3m127 0h4" stroke="'+tinted(235,.45)+'" stroke-width="2"/><rect x="-2" y="64" width="2.5" height="13" rx="1" fill="'+ref("trim")+'"/><rect x="-2" y="86" width="2.5" height="24" rx="1" fill="'+ref("trim")+'"/><rect x="139" y="82" width="2" height="32" rx="1" fill="'+ref("trim")+'"/>'+
        '<rect x="8" y="8" width="'+(pro?124:66)+'" height="70" rx="16" fill="'+ref("trim")+'" stroke="'+tinted(246,.32)+'" stroke-width=".8"/><rect x="10" y="10" width="'+(pro?120:62)+'" height="66" rx="14" fill="'+ref("body")+'"/>'+
        camera(31,29,15)+camera(pro?31:52,58,15)+(pro?camera(59,44,15):"")+
        '<circle cx="'+(pro?115:58)+'" cy="24" r="6" fill="#dfe0d7" stroke="#818895"/>'+(pro?'<circle cx="115" cy="61" r="5.7" fill="#222934"/><circle cx="115" cy="45" r="1.7" fill="#252c38"/>':"")+
        '<path d="M72 133c-3-4-6-3-8-2-5 2-6 8-3 14 2 5 4 8 7 8l4-1 4 1c3 0 5-3 7-8-5-2-5-8-1-11-3-4-6-4-10-1Zm0-4c0-4 2-7 6-8 0 4-2 7-6 8Z" fill="'+tinted(20,.38)+'" opacity=".7"/>';
      defs += '<clipPath id="'+id+'clip"><rect x="4.5" y="4.5" width="126" height="237" rx="20"/></clipPath>';
      const front = '<rect width="136" height="246" rx="23" fill="'+ref("trim")+'" stroke="#7591ae"/><rect x="2" y="2" width="131" height="242" rx="22" fill="#070a10"/><g clip-path="'+ref("clip")+'"><rect width="136" height="246" fill="'+ref("screen")+'"/><path d="M-70 110Q29-54 168-15Q85 0 46 72Q22 118-34 156Z" fill="'+ref("ribbon")+'"/><path d="M-36 171C42 148 57 63 125 43L156 37C76 84 87 152 23 189Z" fill="'+ref("ribbon")+'"/><path d="M-30 242C80 194 54 152 157 99L160 119C95 167 101 228 7 271Z" fill="'+ref("ribbon")+'"/><path d="M-10 169Q39 152 64 104M39 215Q71 192 91 158" fill="none" stroke="#aacdff" opacity=".48"/></g><rect x="49" y="10" width="36" height="9" rx="5" fill="#04070d"/><circle cx="77" cy="14.5" r="1.8" fill="#162a47"/>';
      shapes = hero
        ? '<g transform="translate(245 36) rotate(14 63 120) skewY(-6)">'+front+'</g><g transform="translate(116 17) rotate(-11 70 123) skewY(-4) scale(1.06)">'+back+'</g>'
        : '<g transform="translate(163 19) rotate(-10 68 123) scale(.93)">'+back+'</g>';
    } else if (p.kind === "buds") {
      const pod = '<path d="M1 4C-13 4-20 15-17 26c2 8 11 12 19 10l2 46c.4 9 13 10 15 1l2-54c11-13 2-27-12-26Z" fill="'+ref("white")+'" stroke="#929da9"/><ellipse cx="-6" cy="18" rx="8" ry="5.2" transform="rotate(-25 -6 18)" fill="#30373f"/><path d="M8 34c4 2 8 1 11-2M6 80q5 5 11 1" fill="none" stroke="#818b96" stroke-width="2"/>';
      shapes = '<g transform="translate(224 156) rotate(-6)"><g transform="translate(-43 -109) rotate(-18)">'+pod+'</g><g transform="translate(35 -120) rotate(18) scale(-1 1)">'+pod+'</g><rect x="-84" y="-12" width="165" height="91" rx="34" fill="'+ref("white")+'" stroke="#a2abb7" stroke-width="1.8"/><path d="M-83 13q81 8 163 0" stroke="#89919a" fill="none" stroke-width="2"/><ellipse cx="-1" cy="33" rx="2.1" ry="2" fill="#828b90"/><path d="M-72 8q2-13 16-14" stroke="#fff" fill="none" stroke-width="3"/></g>';
    } else if (p.kind === "watch") {
      shapes = '<g transform="translate(228 143) rotate(-16)"><rect x="-41" y="-123" width="82" height="246" rx="30" fill="'+ref("band")+'" stroke="#565c63"/><path d="M-35-95h70m-70 8h70m-70 174h70m-70 8h70" stroke="#24282d" opacity=".7"/><rect x="61" y="-29" width="10" height="26" rx="5" fill="'+ref("trim")+'" stroke="#68727c"/><rect x="-63" y="-70" width="126" height="140" rx="35" fill="'+ref("trim")+'" stroke="#8b949e"/><rect x="-58" y="-65" width="116" height="130" rx="30" fill="#060a0e"/><g transform="translate(0 -2) rotate(-90)" fill="none" stroke-width="8"><circle r="43" stroke="#45101d"/><circle r="43" stroke="#ff536f" stroke-dasharray="211 271" stroke-linecap="round"/><circle r="32" stroke="#21331c"/><circle r="32" stroke="#a9e756" stroke-dasharray="134 202" stroke-linecap="round"/><circle r="21" stroke="#13383e"/><circle r="21" stroke="#53dae0" stroke-dasharray="98 132" stroke-linecap="round"/></g><path d="m-21-18 21 18 30-26" stroke="#f1f4f8" stroke-width="5.5" stroke-linecap="round" fill="none"/><circle r="4" fill="#e4e9eb"/></g>';
    } else {
      shapes = '<g transform="translate(153 67) scale(6)" fill="none" stroke="'+tinted(238,.55)+'" stroke-width="1.1" stroke-linejoin="round">'+icons.pack+'</g>';
    }
    return '<svg class="device-art" aria-hidden="true" viewBox="'+(hero?"0 0 460 290":"67 3 326 269")+'" fill="none"><defs>'+defs+'</defs>'+shapes+'</svg>';
  }
  function art(p, hero = false) {
    return illustration(p,hero) + (p.photo ? '<img class="product-photo" src="'+esc(p.photo)+'" alt="'+esc(p.name)+'" loading="'+(hero?"eager":"lazy")+'" decoding="async" referrerpolicy="no-referrer">' : "");
  }
  function formatTel(n) {
    return /^7\d{10}$/.test(n) ? n.replace(/^7(\d{3})(\d{3})(\d{2})(\d{2})$/,"+7 ($1) $2-$3-$4") : "+"+n;
  }
  const wa = text => "https://wa.me/"+state.settings.whatsapp+(text?"?text="+encodeURIComponent(text):"");
  function external(href, body, cls="", label="") {
    return '<a '+(label?'aria-label="'+esc(label)+'" ':"")+'href="'+esc(href)+'" target="_blank" rel="noopener noreferrer" class="'+cls+'">'+body+'</a>';
  }
  function chrome() {
    const s=state.settings, route=path()[0];
    $("#header").innerHTML = '<div class="utility"><div class="wrap utility-inner"><span>'+icon("pin",15)+esc(s.address)+'</span><div><a href="tel:+'+s.whatsapp+'">'+icon("call",14)+esc(formatTel(s.whatsapp))+'</a><i>·</i>'+external(wa(),icon("wa",14)+'<span>WhatsApp</span>',"utility-wa","WhatsApp")+'</div></div></div>'+
      '<div class="wrap masthead"><a href="#phones" class="brand" aria-label="SMART PRO — главная">'+logo()+'<span class="brand-sub">САЛОН МОБИЛЬНЫХ УСТРОЙСТВ</span></a><span class="mast-hours">'+icon("clock",17)+esc(s.hours)+'</span></div>';
    const active = ({product:"phones",service:"services"})[route] || route;
    $("#navigation").innerHTML = '<div class="wrap nav-inner">'+[["phones","phone","Телефоны"],["services","tools","Услуги"],["installments","card","Рассрочка (информация)"]].map(([id,symbol,label])=>
      '<a href="#'+id+'"'+(id===active?' class="current" aria-current="page"':'')+'>'+icon(symbol,18)+label+'</a>').join("")+'</div>';
    $("#footer").innerHTML = '<div class="wrap"><div class="footer-main"><a href="#phones" aria-label="SMART PRO — каталог">'+logo()+'</a><div class="footer-info"><span>'+icon("pin",16)+esc(s.address)+'</span><span>'+icon("clock",16)+esc(s.hours)+'</span></div><div class="footer-social">'+external(wa(),icon("wa")+"WhatsApp","btn secondary small")+external("https://t.me/"+s.telegram,icon("tg")+"Telegram","btn secondary small")+'</div></div><div class="footer-bottom"><span>© SMART PRO</span><a href="#admin" class="btn secondary small">'+icon("settings",16)+'Управление салоном</a></div></div>';
  }
  function path() { return (location.hash.slice(1)||"phones").split("/"); }
  function characteristics(p) {
    return [p.memory,p.color,p.sim,p.warranty && "Гарантия "+p.warranty].filter(Boolean).join(" · ");
  }
  function stock(p) {
    return '<span class="stock '+(p.available?"":"order")+'"><i></i>'+(p.available?"В наличии":"Под заказ")+'</span>';
  }
  const rank = ["p9","p13","p1","p4","p7","p14","p2","p5","p10","p12"];
  function featured() {
    const picks = ["p9","p1","p4"].map(id => state.products.find(p=>p.id===id)).filter(Boolean);
    return [...new Set([...picks,...state.products])].slice(0,3);
  }
  function heroMarkup() {
    const picks=featured();
    if (!picks.length) return "";
    ui.slide = ui.slide % picks.length;
    const p=picks[ui.slide], title = p.kind==="watch" && p.name.startsWith("Apple Watch Series S11")?"Apple Watch S11":p.name;
    return '<div class="hero-copy"><div class="eyebrow"><span></span>ВЫБОР САЛОНА</div><h1>'+esc(title)+'</h1><p>'+esc([p.memory,p.color,p.sim].filter(Boolean).join(" · ") || p.category)+'</p><div class="hero-buy"><a class="btn primary" href="#product/'+p.id+'">Смотреть модель</a><strong>'+money(p.price)+'</strong></div></div>'+
      '<div class="hero-art">'+art(p,true)+'</div><b class="crosshair ch-one" aria-hidden="true"></b><b class="crosshair ch-two" aria-hidden="true"></b><div class="hero-controls">'+
      (picks.length>1?'<div class="indicators">'+picks.map((_,i)=>'<button type="button" data-slide="'+i+'" aria-label="Модель '+(i+1)+'" aria-pressed="'+(i===ui.slide)+'"></button>').join("")+'</div><button class="round" data-step="-1" aria-label="Предыдущая модель">'+icon("left",16)+'</button><button class="round" data-step="1" aria-label="Следующая модель">'+icon("right",16)+'</button>':"")+'</div>';
  }
  function catalog() {
    const labels=["Все товары",...categories];
    main.innerHTML = (state.products.length?'<section id="hero" class="hero" aria-label="Выбор салона">'+heroMarkup()+'</section>':"")+
      '<section aria-labelledby="catalog-title"><div class="catalog-head"><div class="title-count"><h2 id="catalog-title">Каталог устройств</h2><span id="result-count" aria-live="polite"></span></div><label class="search">'+icon("search",18)+'<input type="search" id="search" placeholder="Поиск по модели или цвету" aria-label="Поиск по модели или цвету" value="'+esc(ui.query)+'"></label></div>'+
      '<div class="filters"><div class="chips" aria-label="Категории">'+labels.map((v,i)=>'<button class="chip" data-category="'+esc(v)+'" aria-pressed="'+(ui.category===v)+'">'+(i===0?icon("grid",15):"")+esc(v)+'</button>').join("")+'</div><label class="sort">'+icon("sort",16)+'<select id="sort" aria-label="Сортировка"><option value="featured">По умолчанию</option><option value="asc">Сначала дешевле</option><option value="desc">Сначала дороже</option><option value="az">По названию</option></select>'+icon("down",13)+'</label></div><div id="products" class="products"></div></section>';
    $("#sort").value=ui.sort; showProducts();
  }
  function showProducts() {
    const q=ui.query.trim().toLocaleLowerCase("ru");
    const items = state.products.filter(p=>(ui.category==="Все товары" || p.category===ui.category) &&
      (p.name+" "+characteristics(p)+" "+p.category).toLocaleLowerCase("ru").includes(q));
    function order(p) { const n=rank.indexOf(p.id); return n < 0 ? rank.length : n; }
    items.sort((a,b)=>ui.sort==="asc"?a.price-b.price:ui.sort==="desc"?b.price-a.price:ui.sort==="az"?a.name.localeCompare(b.name,"ru"):order(a)-order(b));
    $("#result-count").textContent=items.length;
    $("#products").innerHTML = items.map(p=>'<a class="product-card" href="#product/'+p.id+'"><div class="card-media" style="--tone:'+p.hex+'">'+art(p)+stock(p)+'</div><div class="card-info"><span class="category-text">'+esc(p.category)+'</span><h3>'+esc(p.name)+'</h3><p class="variant"><i style="--tone:'+p.hex+'"></i>'+esc([p.color,p.memory].filter(Boolean).join(" · ") || p.category)+'</p><span class="spec-mini">'+esc([p.sim,p.warranty && "Гарантия "+p.warranty].filter(Boolean).join(" · "))+'</span><div class="card-bottom"><strong>'+money(p.price)+'</strong><span>'+icon("card",15)+'Рассрочка</span></div></div></a>').join("") ||
      '<div class="empty">'+icon("search",30)+'<h3>Товары не найдены</h3><p>Попробуйте другое название или категорию.</p><button class="btn secondary" data-action="clear">Сбросить фильтры</button></div>';
  }
  const backLink = (url,label) => '<a class="back" href="#'+url+'">'+icon("back",17)+label+'</a>';
  function productPage(p) {
    const specs=[["Категория",p.category],["Память",p.memory],["Цвет",p.color],["SIM",p.sim],["Гарантия",p.warranty],["Наличие",p.available?"В наличии":"Под заказ"]].filter(row=>row[1]);
    main.innerHTML=backLink("phones","Назад в каталог")+'<div class="product-detail"><div class="detail-art" style="--tone:'+p.hex+'">'+art(p,true)+stock(p)+'</div><section class="product-details"><div class="eyebrow"><span></span>'+esc(p.category)+'</div><h1>'+esc(p.name)+'</h1><table class="spec-table"><caption class="sr">Характеристики</caption><tbody>'+specs.map(([a,b])=>'<tr><th scope="row">'+esc(a)+'</th><td>'+esc(b)+'</td></tr>').join("")+'</tbody></table>'+(p.description?'<p class="preline">'+esc(p.description)+'</p>':"")+'<div class="cash"><div><small>Цена за наличные</small><strong>'+money(p.price)+'</strong></div>'+external(wa("Здравствуйте! Хочу купить за наличные "+p.name+" ("+characteristics(p)+") за "+money(p.price)+". Уточните наличие."),icon("wa")+'Купить за наличные',"btn primary")+'</div></section></div>'+calculator(p);
    updateCalc();
  }
  function servicesPage() {
    main.innerHTML='<div class="page-heading"><div class="eyebrow"><span></span>SMART PRO</div><h1>Услуги салона</h1></div>'+groups.map(group=>{
      const rows=state.services.filter(s=>s.group===group);
      if (!rows.length) return "";
      return '<section class="service-section"><h2>'+esc(group)+'</h2><div class="service-grid">'+rows.map(s=>'<a class="service-card" href="#service/'+s.id+'"><span class="service-icon">'+icon(s.symbol,27)+'</span><h3>'+esc(s.name)+'</h3><div><strong>'+money(s.price)+'</strong>'+icon("right",16)+'</div></a>').join("")+'</div></section>';
    }).join("")+(!state.services.length?'<div class="empty">Список услуг пока пуст.</div>':"");
  }
  function servicePage(s) {
    main.innerHTML=backLink("services","Назад ко всем услугам")+'<article class="service-detail panel"><span class="service-icon large">'+icon(s.symbol,44)+'</span><div class="eyebrow">'+esc(s.group)+'</div><h1>'+esc(s.name)+'</h1><p class="preline">'+esc(s.description || "Уточните подробности и удобное время у сотрудника салона.")+'</p><div class="cash"><div><small>Стоимость услуги</small><strong>'+money(s.price)+'</strong></div>'+external(wa("Здравствуйте! Хочу записаться на услугу «"+s.name+"» за "+money(s.price)+". Подскажите свободное время."),icon("wa")+"Записаться в WhatsApp","btn primary")+'</div></article>';
  }

  function calculator(p) {
    const price=p?p.price:80000;
    return '<section id="calc" class="calc panel" data-product="'+(p?p.id:"")+'" data-months="6"><div class="section-title"><span class="title-icon">'+icon("card",22)+'</span><h2>Калькулятор рассрочки</h2></div><div class="calc-grid"><div class="calc-fields">'+
      (p?'':'<label>Цена за наличные, ₽<input id="calc-price" type="number" min="1" max="1000000000" step="1" required inputmode="numeric" value="'+price+'"></label>')+
      '<fieldset><legend>Срок рассрочки</legend><div class="term-list">'+terms.map(t=>'<button type="button" data-term="'+t+'" aria-pressed="'+(t===6)+'">'+t+' мес.</button>').join("")+'</div></fieldset><label>Первоначальный взнос, ₽<input id="calc-deposit" type="number" min="0" step="1" inputmode="numeric" required value="'+Math.round(price*.2)+'"></label><p class="muted calc-hint">Фиксированная торговая наценка на весь срок.</p></div><div id="calc-output" class="calc-output" aria-live="polite"></div></div></section>';
  }
  function updateCalc() {
    const el=$("#calc"); if (!el) return;
    const p=state.products.find(i=>i.id===el.dataset.product), priceInput=$("#calc-price",el);
    const price=p?p.price:priceInput?.valueAsNumber, months=Number(el.dataset.months), rate=state.settings.rates[months];
    const total=Math.round(price*(10000+Math.round(rate*100))/10000), input=$("#calc-deposit",el), deposit=input.valueAsNumber;
    input.max=Number.isFinite(total)?total:"";
    const out=$("#calc-output",el);
    if (!validPrice(price) || (priceInput && !priceInput.validity.valid)) { out.innerHTML='<p>Введите цену устройства от 1 до 1 000 000 000 ₽ целыми рублями.</p>'; return; }
    if (!input.validity.valid || !Number.isFinite(deposit) || deposit>total) {out.innerHTML='<p>Введите взнос от 0 до '+money(total)+' целыми рублями.</p>';return;}
    const rest=total-deposit;
    const cents=Math.round(rest*100/months), monthly=cents/100, last=(rest*100-cents*(months-1))/100;
    const adjustment=cents===Math.round(last*100) ? "" : "Последний платёж с учётом округления — "+money(last)+".";
    const label=p?p.name+" ("+characteristics(p)+")":"устройство по моему расчёту";
    const message="Здравствуйте! Хочу уточнить рассрочку на "+label+". Цена за наличные: "+money(price)+". Срок: "+months+" мес. Наценка: "+rate+"%. Итоговая цена: "+money(total)+". Взнос: "+money(deposit)+". Остаток: "+money(rest)+". Ежемесячный платёж: "+money(monthly)+". "+adjustment;
    out.innerHTML='<div class="payment"><small>Ежемесячный платёж</small><strong>'+money(monthly)+'<em> / мес.</em></strong></div><dl class="calc-lines">'+
      [["Цена за наличные",money(price)],["Торговая наценка ("+rub.format(rate)+"%)",money(total-price)],["Итоговая цена",money(total)],["Остаток после взноса",money(rest)]].map(([k,v])=>'<div><dt>'+k+'</dt><dd>'+v+'</dd></div>').join("")+'</dl>'+(adjustment?'<small class="rounding">'+adjustment+'</small>':"")+external(wa(message.trim()),icon("wa")+"Оформить / уточнить в WhatsApp","btn primary") ;
  }
  function installmentsPage() {
    main.innerHTML='<div class="page-heading"><div class="eyebrow"><span></span>УСЛОВИЯ ПОКУПКИ</div><h1>Исламская рассрочка</h1><p>Мурабаха — покупка конкретного устройства по заранее согласованной цене с торговой наценкой.</p></div>'+calculator(null)+
      '<section class="terms-info"><h2>Как проходит покупка</h2><div class="info-grid">'+
      [["case","Выбор устройства","Салон должен владеть товаром перед продажей. До заключения договора продавец раскрывает покупателю закупочную стоимость товара и свою прибыль."],
       ["card","Фиксация цены","Калькулятор считает предложение от розничной цены за наличные. Салон согласует с вами итоговую цену, взнос, срок и даты платежей, затем фиксирует их в договоре."],
       ["check","Оплата по графику","Взнос уменьшает остаток к оплате. По условиям салона цена после заключения договора фиксирована. Банковские проценты, скрытые комиссии и пени за просрочку не предусмотрены."]].map(([i,h,t])=>'<article class="panel"><span class="service-icon">'+icon(i,24)+'</span><h3>'+h+'</h3><p>'+t+'</p></article>').join("")+'</div><p class="muted">Расчёт предварительный. Сотрудник подтвердит наличие устройства и согласует условия договора в WhatsApp или в салоне.</p><p class="source-note">'+external("https://www.sbp.org.pk/faqs/faqs-islamic-banking","О принципах мурабахи — разъяснения Государственного банка Пакистана")+'</p></section>';
    updateCalc();
  }

  const tabs=[["products","phone","Товары"],["services","tools","Услуги"],["settings","settings","Рассрочка и контакты"],["backup","file","Резервная копия"]];
  function field(label,name,value="",type="text",attrs="") {
    return '<label>'+esc(label)+'<input type="'+type+'" name="'+name+'" value="'+esc(value)+'" '+attrs+'></label>';
  }
  function selectField(label,name,entries,selected) {
    return '<label>'+esc(label)+'<select name="'+name+'">'+entries.map(([v,l])=>'<option value="'+esc(v)+'"'+(v===selected?" selected":"")+'>'+esc(l)+'</option>').join("")+'</select></label>';
  }
  function textField(label,name,value) {
    return '<label class="wide">'+esc(label)+'<textarea name="'+name+'" rows="3">'+esc(value)+'</textarea></label>';
  }
  function adminPage(route) {
    if (!authenticated) {
      main.innerHTML='<section class="login panel"><div class="service-icon large">'+icon("lock",34)+'</div><h1>Управление салоном</h1><p>Введите пароль сотрудника SMART PRO.</p><form id="login-form"><label>Пароль<input type="password" name="password" autocomplete="current-password" required></label><span class="form-error" role="alert" id="login-error"></span><button class="btn primary">Войти</button></form></section>'; return;
    }
    const sub=tabs.some(([id])=>id===route[1])?route[1]:"products", edit=route[2];
    main.innerHTML='<div class="admin-head"><div><div class="eyebrow"><span></span>SMART PRO</div><h1>Управление салоном</h1></div><button class="btn secondary" data-action="logout">'+icon("exit",17)+'Выйти</button></div>'+
      '<nav class="admin-tabs" aria-label="Разделы управления">'+tabs.map(([id,i,label])=>'<a href="#admin/'+id+'"'+(id===sub?' aria-current="page"':"")+'>'+icon(i,17)+label+'</a>').join("")+'</nav><div class="sync-row"><span id="cloud-status" role="status">'+esc(cloudStatus || (endpoint()?(dirty?"Изменения ожидают публикации.":"Подключена синхронизация Google."):"Локальный режим. Облако не подключено."))+'</span>'+(dirty&&endpoint()?'<button type="button" data-action="retry" class="text-btn">Повторить публикацию</button>':"")+'</div><div id="admin-content"></div>';
    const container=$("#admin-content");
    if (sub==="settings") { container.innerHTML=settingsForm(); return; }
    if (sub==="backup") {
      container.innerHTML='<section class="panel form-panel"><h2>Резервная копия</h2><p class="muted">В JSON сохраняются товары, услуги, ссылки на фото, контакты и наценки. Фотографии остаются по своим адресам.</p><div class="backup-actions"><button class="btn secondary" data-action="export">'+icon("file")+'Скачать базу (JSON)</button><label class="btn secondary file-btn">'+icon("upload")+'Загрузить базу из файла (JSON)<input type="file" id="import" accept=".json,application/json"></label></div>'+(endpoint()?'<div class="reset-block"><h3>Облачная версия</h3><p class="muted">Можно заменить локальную базу актуальной версией из облака. Для сохранения своих правок скачайте JSON.</p><button class="btn secondary" data-action="reload-cloud">Открыть облачную версию</button></div>':"")+'<div class="reset-block"><h3>Стартовый каталог</h3><p class="muted">Заменяет товары и услуги стартовым набором. Настройки салона сохраняются.</p><button class="btn danger" data-action="reset">Сбросить к стартовому каталогу</button></div></section>'; return;
    }
    const isProduct=sub==="products", list=state[sub];
    if (edit) {
      const item=edit==="new"?null:list.find(i=>i.id===edit);
      container.innerHTML=item||edit==="new"?itemForm(isProduct,item):'<p>Запись не найдена.</p>'+backLink("admin/"+sub,"К списку"); return;
    }
    container.innerHTML='<div class="list-head"><h2>'+(isProduct?"Товары":"Услуги")+' <small>'+list.length+'</small></h2><a class="btn primary small" href="#admin/'+sub+'/new">'+icon("plus",16)+(isProduct?"Добавить товар":"Добавить услугу")+'</a></div><div class="admin-list">'+(list.map(item=>'<article class="admin-row"><div class="row-symbol">'+icon(isProduct?(item.kind==="phone"?"phone":"pack"):item.symbol)+'</div><div class="row-name"><strong>'+esc(item.name)+'</strong><small>'+esc(isProduct?characteristics(item):item.group)+'</small></div><strong class="row-price">'+money(item.price)+'</strong>'+(isProduct?'<button class="stock-toggle" data-stock="'+item.id+'" title="Переключить наличие">'+stock(item)+'</button>':"")+'<div class="row-actions"><a class="btn secondary small" href="#admin/'+sub+'/'+item.id+'">'+icon("edit",15)+'Изменить</a><button class="icon-btn" data-delete="'+item.id+'" data-list="'+sub+'" aria-label="Удалить '+esc(item.name)+'">'+icon("trash",17)+'</button></div></article>').join("") || '<div class="empty">Список пока пуст.</div>')+'</div>';
  }
  function itemForm(isProduct,item) {
    const section=isProduct?"products":"services";
    const i=item || (isProduct?{category:categories[0],kind:"phone",hex:"#3f5b78",available:true}:{group:groups[1],symbol:"tools"});
    const noun=isProduct?"товар":"услугу";
    const symbolList=[["bank","Банк"],["grid","Пакет приложений"],["transfer","Перенос данных"],["tools","Инструменты"],["glass","Защита экрана"],["phone","Телефон"]];
    return backLink("admin/"+section,"К списку")+'<form id="item-form" class="panel form-panel" data-list="'+section+'" data-id="'+(item?item.id:"")+'"><h2>'+(item?"Изменить ":"Добавить ")+noun+'</h2><div class="form-grid">'+
      field("Название","name",i.name,"text",'required maxlength="180"')+field("Цена, ₽","price",i.price,"number",'required min="0" max="1000000000" step="1"')+
      (isProduct?selectField("Категория","category",categories.map(v=>[v,v]),i.category)+selectField("Иллюстрация без фото","kind",[["phone","Смартфон"],["buds","Наушники"],["watch","Часы"],["other","Аксессуар"]],i.kind)+
        field("Название цвета","color",i.color)+field("Цвет корпуса","hex",i.hex,"color")+field("Память","memory",i.memory,"text",'placeholder="256 ГБ"')+field("SIM","sim",i.sim,"text",'placeholder="eSIM + SIM"')+field("Гарантия","warranty",i.warranty,"text",'placeholder="1 год"')+selectField("Наличие","available",[["yes","В наличии"],["no","Под заказ"]],i.available?"yes":"no"):
        selectField("Раздел","group",groups.map(v=>[v,v]),i.group)+selectField("Значок","symbol",symbolList,i.symbol))+
      textField("Описание","description",i.description)+(isProduct?'<div class="photo-box wide">'+field("Ссылка на фото (HTTPS)","photo",i.photo,"url",'placeholder="https://…"')+'<label>Загрузить фотографию<input id="photo-file" type="file" accept="image/*"></label><small id="photo-status" role="status">jpeg, ширина до 900 пикселей.</small></div>':"")+'</div>'+formButtons("admin/"+section)+'</form>';
  }
  function formButtons(cancel) {
    return '<p class="form-error" role="alert"></p><div class="form-actions"><button type="submit" class="btn primary">'+icon("check",17)+'Сохранить изменения</button><a class="btn secondary" href="#'+cancel+'">Отмена</a></div>';
  }
  function cloudGuide() {
    return '<details class="cloud-guide"><summary>Как подключить Google Apps Script</summary><ol><li>Создайте проект в Google Apps Script и вставьте приведённый ниже код.</li><li>В настройках проекта добавьте свойство сценария SMARTPRO_WRITE_KEY с длинным случайным ключом. Этот же ключ введите в поле публикации. Он хранится только в сессии сотрудника.</li><li>Разверните веб-приложение от своего имени с доступом для всех. Каталог будет доступен для чтения. Для записи скрипт проверяет подпись запроса.</li><li>Впишите полученный публичный URL /exec здесь и в GOOGLE_SYNC_URL в начале script.js. Фотографии должны быть доступны для просмотра по ссылке.</li></ol><label>Код для редактора Google<textarea readonly rows="8" spellcheck="false">'+esc(serverExample)+'</textarea></label></details>';
  }
  function settingsForm() {
    const s=state.settings;
    return '<form id="settings-form" class="panel form-panel"><h2>Рассрочка и контакты</h2><h3>Фиксированная наценка</h3><div class="form-grid rates">'+terms.map(t=>field(t+" мес., %","rate"+t,s.rates[t],"number",'min="0" max="1000" step="0.01" required')).join("")+'</div><h3>Контакты салона</h3><div class="form-grid">'+
      field("Телефон и WhatsApp","whatsapp",formatTel(s.whatsapp),"tel","required")+field("Telegram","telegram","@"+s.telegram,"text","required")+field("Адрес","address",s.address,"text","required")+field("Часы работы","hours",s.hours,"text","required")+'</div><h3>Синхронизация Google</h3>'+field("URL веб-приложения Google Apps Script","syncUrl",s.syncUrl,"url","required")+'<p class="muted">Для подключения укажите адрес развёрнутого приложения с окончанием /exec. Для новых посетителей этот же адрес должен быть задан в GOOGLE_SYNC_URL в script.js. Доступ на запись настраивается на сервере.</p>'+field("Ключ публикации (для встроенного примера скрипта)","writeKey","","password",'autocomplete="off" placeholder="'+(writeKey?"Ключ сохранён в этой сессии":"Введите ключ из свойств сценария")+'"')+cloudGuide()+formButtons("admin/products")+'</form>';
  }
  function missing() { main.innerHTML='<div class="empty"><h1>Страница не найдена</h1>'+backLink("phones","Назад в каталог")+'</div>'; }
  function render() {
    const route=path(), page=route[0];
    chrome();
    if (page==="phones") catalog();
    else if (page==="services") servicesPage();
    else if (page==="installments") installmentsPage();
    else if (page==="admin") adminPage(route);
    else if (page==="product" || page==="service") {
      const item=state[page==="product"?"products":"services"].find(i=>i.id===route[1]);
      if (!item) missing(); else if (page==="product") productPage(item); else servicePage(item);
    } else missing();
    const heading=$("h1",main);
    const title=page==="phones"?"Каталог устройств":heading?.textContent || "SMART PRO";
    document.title=title+" — SMART PRO, Нальчик";
  }
  function refreshAfterSync() {
    if (path()[0]==="phones" && $("#products") && $("#hero") && state.products.length) {
      chrome(); $("#hero").innerHTML=heroMarkup(); showProducts();
    } else if (editorDirty && (path()[0]==="admin" || $("#calc"))) {
      chrome();
      if ($("#calc")) updateCalc();
    } else render();
  }
  function afterChange(section) {
    editorDirty=false; commit();
    if (location.hash==="#admin/"+section) render(); else location.hash="admin/"+section;
  }
  function newId(prefix) {
    const bytes=new Uint8Array(10);
    crypto.getRandomValues(bytes);
    return prefix+Array.from(bytes,b=>b.toString(16).padStart(2,"0")).join("");
  }
  document.addEventListener("submit", async event=>{
    const form=event.target; event.preventDefault();
    if (form.id==="login-form") {
      if (form.elements.password.value !== "SmartPro07") { $("#login-error").textContent="Неверный пароль."; form.elements.password.select(); return; }
      authenticated=true;
      try { sessionStorage.setItem(SESSION,"yes"); } catch { /* Keep authorization in memory. */ }
      render(); if (dirty) void publish(); return;
    }
    if (!authenticated || path()[0]!=="admin") return;
    const f=new FormData(form), value=k=>String(f.get(k) ?? "").trim();
    try {
      if (form.id==="item-form") {
        if (form.dataset.upload==="yes") return;
        const section=form.dataset.list, isProduct=section==="products";
        const input={id:form.dataset.id || newId(isProduct?"p":"s"),name:value("name"),price:Number(value("price")),description:value("description")};
        if (!input.name) throw Error("Введите название.");
        if (isProduct) {
          for (const k of ["category","kind","hex","color","memory","sim","warranty","photo"]) input[k]=value(k);
          if (input.photo && !httpsUrl(input.photo)) throw Error("Укажите HTTPS-ссылку на фотографию.");
          input.available=value("available")==="yes";
        } else { input.group=value("group"); input.symbol=value("symbol"); }
        const next=structuredCopy(state), index=next[section].findIndex(i=>i.id===input.id);
        if (form.dataset.id && index<0) throw Error("Запись уже удалена. Вернитесь к списку.");
        if (index<0) next[section].push(input); else next[section][index]=input;
        state=readState(next); afterChange(section);
      } else if (form.id==="settings-form") {
        const settings={rates:Object.fromEntries(terms.map(t=>[t,Number(value("rate"+t))]))};
        for (const k of ["whatsapp","telegram","hours","address","syncUrl"]) settings[k]=value(k);
        if (!httpsUrl(settings.syncUrl)) throw Error("Укажите полный HTTPS-адрес синхронизации.");
        if (!settings.address || !settings.hours) throw Error("Заполните адрес и график работы.");
        let next=readState({...state,settings});
        const newUrl=httpsUrl(settings.syncUrl), changed=newUrl!==httpsUrl(state.settings.syncUrl);
        let nextVersion=cloudVersion;
        if (changed && newUrl.replace(/\/$/,"")!=="https://google.com") {
          const start=revision; const button=$('button[type="submit"]',form);
          button.disabled=true;status("Проверка каталога по новому адресу…");
          let remote;
          try { remote=await request(newUrl); }
          catch { throw Error("Не удалось прочитать каталог по новому адресу. Проверьте URL /exec и права доступа."); }
          finally { button.disabled=false;status("Проверка адреса завершена."); }
          if (!form.isConnected || !authenticated) return;
          if (start!==revision) throw Error("Каталог обновился. Повторите сохранение настроек.");
          if (Object.keys(remote).length) {
            const connected=readState(remote,state);
            if (!confirm("По этому адресу уже есть каталог. Подключить его на этом устройстве? Товаров: "+connected.products.length+", услуг: "+connected.services.length+".")) return;
            for (const k of ["whatsapp","telegram","address","hours"]) if (next.settings[k]!==state.settings[k]) connected.settings[k]=next.settings[k];
            for (const t of terms) if (next.settings.rates[t]!==state.settings.rates[t]) connected.settings.rates[t]=next.settings.rates[t];
            connected.settings.syncUrl=settings.syncUrl;next=connected;
          }
          nextVersion=Number(remote._version)||0;
        }
        if (changed) {conflict=false;cloudVersion=nextVersion;writeKey="";keyUrl="";}
        if (value("writeKey")) {writeKey=value("writeKey");keyUrl=newUrl;}
        try {sessionStorage.setItem(SESSION+".cloud",JSON.stringify({key:writeKey,url:keyUrl}));} catch { /* Keep in memory. */ }
        state=next;afterChange("settings");
      }
    } catch (err) { const msg=$(".form-error",form); if (msg) msg.textContent=err.message; }
  });

  async function compressPhoto(file) {
    const url=URL.createObjectURL(file);
    try {
      const img=new Image();
      await new Promise((resolve,reject)=>{img.onload=resolve;img.onerror=()=>reject(Error("Не удалось прочитать изображение. Выберите JPEG, PNG или jpeg."));img.src=url;});
      const scale=Math.min(1,900/img.naturalWidth,1800/img.naturalHeight);
      const canvas=document.createElement("canvas");
      canvas.width=Math.max(1,Math.round(img.naturalWidth*scale));canvas.height=Math.max(1,Math.round(img.naturalHeight*scale));
      const ctx=canvas.getContext("2d");
      ctx.imageSmoothingQuality="high"; ctx.drawImage(img,0,0,canvas.width,canvas.height);
      const result=canvas.toDataURL("image/jpeg",0.82);
      if (!result.startsWith("data:image/jpeg;base64,")) throw Error("Этот браузер не поддерживает сохранение jpeg.");
      return result;
    } finally { URL.revokeObjectURL(url); }
  }
  async function uploadPhoto(input) {
    const form=input.form,file=input.files[0],label=$("#photo-status",form),target=endpoint();
    if (!file) return;
    const token=++uploadVersion;
    if (!target) {label.textContent="Сначала укажите адрес Google Apps Script в разделе «Рассрочка и контакты».";input.value="";return;}
    const save=$('button[type="submit"]',form);
    form.dataset.upload="yes";save.disabled=true;label.textContent="Загрузка фото в облако Google…";
    try {
      const base64=await compressPhoto(file);
      if (!authenticated || !form.isConnected || token!==uploadVersion) return;
      const data=await request(target,{action:"upload",base64},30000);
      if (!form.isConnected || token!==uploadVersion || !authenticated) return;
      const link=httpsUrl(data.url);
      if (!link) throw Error("Облако не вернуло постоянную HTTPS-ссылку.");
      form.elements.photo.value=link;label.textContent="Фото загружено. Сохраните товар.";editorDirty=true;
    } catch (err) { if (token===uploadVersion) label.textContent=err.message.startsWith("Облако")||err.message.includes("jpeg")?err.message:"Не удалось загрузить фото. Проверьте соединение и URL Google."; }
    finally {if (token===uploadVersion) {delete form.dataset.upload;save.disabled=false;input.value="";} }
  }
  async function importBackup(input) {
    const file=input.files[0]; if (!file) return;
    try {
      const data=JSON.parse(await file.text());
      if (!Array.isArray(data.services) || !data.settings || !data.settings.rates) throw Error("Файл должен содержать товары, услуги и настройки.");
      const next=readState(data);
      if (!authenticated || !input.isConnected) return;
      if (!confirm("Заменить текущую базу? Товаров: "+next.products.length+", услуг: "+next.services.length+". Изменения будут отправлены по текущему адресу синхронизации.")) return;
      next.settings.syncUrl=state.settings.syncUrl;state=next;commit();render();
    } catch (err) { notify(err instanceof SyntaxError?"Некорректный файл JSON.":err.message); }
    finally {input.value="";}
  }
  async function restoreCloud() {
    const url=endpoint(), version=revision;
    try {
      const incoming=await request(url), next=readState(incoming);
      if (version!==revision || !authenticated || path()[1]!=="backup") return;
      if (!confirm("Заменить локальную базу данными из облака? Неопубликованные правки будут удалены с этого устройства.")) return;
      next.settings.syncUrl=state.settings.syncUrl;state=next;dirty=false;conflict=false;
      cloudVersion=Number(incoming._version)||0;revision++;persist();status("Открыта актуальная облачная версия.");render();
    } catch {notify("Не удалось прочитать облачную базу. Текущие данные сохранены.");}
  }
  function download() {
    const blob=new Blob([JSON.stringify(state,null,2)],{type:"application/json;charset=utf-8"});
    const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="SMART-PRO-"+new Date().toISOString().slice(0,10)+".json";
    document.body.append(a);a.click();a.remove(); setTimeout(()=>URL.revokeObjectURL(a.href),1000);
  }
  document.addEventListener("input",event=>{
    const t=event.target;
    if (t.id==="search") { ui.query=t.value;showProducts(); }
    if (t.closest("#item-form,#settings-form,#calc,#login-form")) editorDirty=true;
    if (t.id==="calc-price") {
      const d=$("#calc-deposit");
      if (!d.dataset.manual && Number.isFinite(t.valueAsNumber)) d.value=Math.round(t.valueAsNumber*.2);
      updateCalc();
    }
    if (t.id==="calc-deposit") {t.dataset.manual="yes";updateCalc();}
  });
  document.addEventListener("change",event=>{
    const t=event.target;
    if (t.id==="sort") {ui.sort=t.value;showProducts();}
    if (!authenticated || path()[0]!=="admin") return;
    if (t.id==="photo-file") void uploadPhoto(t);
    if (t.id==="import") void importBackup(t);
  });
  document.addEventListener("click",event=>{
    const target=event.target.closest("button,a");
    if (!target) return;
    if (target.classList.contains("skip")) {event.preventDefault();main.focus();main.scrollIntoView();return;}
    const d=target.dataset;
    if (d.category) {
      ui.category=d.category;
      document.querySelectorAll("[data-category]").forEach(b=>b.setAttribute("aria-pressed",String(b===target)));
      showProducts();return;
    }
    if (d.action==="clear") {ui.query="";ui.category="Все товары";catalog();$("#search").focus();return;}
    if (d.slide!==undefined || d.step) {
      const count=featured().length;
      ui.slide=d.step?(ui.slide+Number(d.step)+count)%count:Number(d.slide);
      const selector=d.step?'[data-step="'+d.step+'"]':'[data-slide="'+d.slide+'"]';
      $("#hero").innerHTML=heroMarkup();$(selector,$("#hero"))?.focus({preventScroll:true});return;
    }
    if (d.term) {
      editorDirty=true;const calc=target.closest("#calc");calc.dataset.months=d.term;
      calc.querySelectorAll("[data-term]").forEach(b=>b.setAttribute("aria-pressed",String(b===target)));updateCalc();return;
    }
    if (path()[0]!=="admin" || !authenticated) return;
    if (d.stock) {
      const item=state.products.find(p=>p.id===d.stock);
      if (item) {item.available=!item.available;commit();render();}
    } else if (d.delete && ["products","services"].includes(d.list)) {
      const item=state[d.list].find(p=>p.id===d.delete);
      if (item && confirm("Удалить «"+item.name+"»?")) {state[d.list]=state[d.list].filter(p=>p.id!==item.id);commit();render();}
    } else if (d.action==="logout") {
      authenticated=false;uploadVersion++;editorDirty=false;
      writeKey="";keyUrl="";
      try { sessionStorage.removeItem(SESSION); sessionStorage.removeItem(SESSION+".cloud"); } catch { /* Memory-only session. */ }
      if (location.hash!=="#admin") location.hash="admin"; else render();
    } else if (d.action==="export") download();
    else if (d.action==="retry") void publish();
    else if (d.action==="reload-cloud") void restoreCloud();
    else if (d.action==="reset" && confirm("Заменить все товары и услуги на 18 стартовых товаров и 6 услуг? Собственные позиции будут удалены.")) {
      const initial=seed();state.products=initial.products;state.services=initial.services;commit();render();
    }
  });
  document.addEventListener("error",event=>{
    if (event.target instanceof HTMLImageElement && event.target.classList.contains("product-photo")) event.target.remove();
  },true);
  document.addEventListener("load",event=>{
    if (event.target instanceof HTMLImageElement && event.target.classList.contains("product-photo")) event.target.classList.add("ready");
  },true);
  window.addEventListener("hashchange",()=>{
    uploadVersion++;editorDirty=false;render();window.scrollTo(0,0);main.focus({preventScroll:true});
  });
  window.addEventListener("storage",event=>{
    if (event.key!==STORAGE || !event.newValue) return;
    try {
      const cached=JSON.parse(event.newValue), next=readState(cached.state);
      state=next;dirty=cached.dirty===true;cloudVersion=Number(cached.cloudVersion)||0;conflict=cached.conflict===true;revision++;refreshAfterSync();
    } catch { /* Ignore incomplete data from another tab. */ }
  });
  window.addEventListener("online",()=>dirty?void publish():void pull());
  const serverExample = String.raw`// SMART PRO: вставьте этот код в редактор Google Apps Script.
function jsonResult(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);
}

function catalogFile() {
  var id = PropertiesService.getScriptProperties().getProperty("CATALOG_FILE_ID");
  return id ? DriveApp.getFileById(id) : null;
}

function doGet() {
  var file = catalogFile();
  return file ? ContentService.createTextOutput(file.getBlob().getDataAsString("UTF-8")).setMimeType(ContentService.MimeType.JSON) : jsonResult({});
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    var props = PropertiesService.getScriptProperties();
    var secret = props.getProperty("SMARTPRO_WRITE_KEY");
    var text = e.postData.contents;
    var timestamp = e.parameter.ts || "";
    if (!secret || !timestamp || Math.abs(Date.now() - Number(timestamp)) > 120000 || !/^\d{13}$/.test(timestamp))
      return jsonResult({error:"auth"});
    var signed = timestamp + "\n" + (e.parameter.base || "0") + "\n" + text;
    var expected = Utilities.base64EncodeWebSafe(Utilities.computeHmacSha256Signature(signed, secret, Utilities.Charset.UTF_8)).replace(/=+$/, "");
    if (e.parameter.sig !== expected) return jsonResult({error:"auth"});
    var data = JSON.parse(text);
    lock.waitLock(10000);
    if (data.action === "save") {
      var state = data.state;
      if (!state || !Array.isArray(state.products) || !Array.isArray(state.services) || !state.settings)
        return jsonResult({error:"format"});
      var file = catalogFile();
      var version = file ? Number(JSON.parse(file.getBlob().getDataAsString("UTF-8"))._version || 0) : 0;
      if (Number(e.parameter.base || 0) !== version) return jsonResult({error:"conflict"});
      var contents = JSON.stringify({products:state.products,services:state.services,settings:state.settings,_version:version+1});
      if (file) file.setContent(contents);
      else {
        file = DriveApp.createFile("SMART PRO — каталог.json", contents, MimeType.PLAIN_TEXT);
        props.setProperty("CATALOG_FILE_ID", file.getId());
      }
      return jsonResult({ok:true,_version:version+1});
    }
    if (data.action === "upload") {
      var prefix = "data:image/jpeg;base64,";
      if (typeof data.base64 !== "string" || data.base64.indexOf(prefix) !== 0 || data.base64.length > 6000000) return jsonResult({error:"image"});
      var bytes = Utilities.base64Decode(data.base64.slice(prefix.length));
      if (bytes.length < 12 || String.fromCharCode.apply(null,bytes.slice(0,4)) !== "RIFF" || String.fromCharCode.apply(null,bytes.slice(8,12)) !== "jpeg") return jsonResult({error:"image"});
      var photo = DriveApp.createFile(Utilities.newBlob(bytes,"image/jpeg","smartpro-"+Utilities.getUuid()+".jpeg"));
      try {
        photo.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        var resource = photo.getResourceKey();
        return jsonResult({ok:true,url:"https://drive.google.com/thumbnail?sz=w900&id="+encodeURIComponent(photo.getId())+(resource?"&resourcekey="+encodeURIComponent(resource):"")});
      } catch (error) {
        photo.setTrashed(true);
        return jsonResult({error:"sharing"});
      }
    }
    return jsonResult({error:"action"});
  } catch (error) {
    return jsonResult({error:"server"});
  } finally {
    if (lock.hasLock()) lock.releaseLock();
  }
}`;
  render();
  void pull();
})();
