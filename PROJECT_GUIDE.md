# Resume — Сайт-резюме Микиты Калчевского

## Что это

Персональный сайт-резюме: одна HTML-страница с портфолио, стеком, опытом и контактами.  
Написан на чистом HTML/CSS/JS — без фреймворков, без сборщика, без зависимостей.

**Где живёт:**
- Локально: `C:\Users\Nik\resume-deploy\resume\`
- GitHub: https://github.com/NikitaKalchevsky/resume
- Публикация: GitHub Pages (ветка `main`, папка `/` или `/docs` — проверить в Settings → Pages)

---

## Стек и зависимости

| Что | Версия / детали |
|-----|----------------|
| HTML/CSS/JS | Чистые, без фреймворков |
| Шрифты | Google Fonts (Fraunces — дисплей, Hanken Grotesk — тело, JetBrains Mono — моно) — загружаются из сети |
| Тема | Светлая, Warm Editorial: тёплый бумажный фон, палитра в OKLCH, вермилионовый акцент |
| Мультиязычность | Виджет Google Website Translator (`translate.google.com/translate_a/element.js`), стиль как в Apelsin Rozmarin (плагин GTranslate). **Без API-ключа.** Переключатель EN (основной) + UK / RU / ES |
| Хостинг | GitHub Pages |
| Git-репозиторий | https://github.com/NikitaKalchevsky/resume.git |
| Ветка | `main` |

**Своих API, токенов и баз данных нет.** Перевод — внешний бесплатный виджет Google (без ключа, без подписки), всё остальное статичное.

---

## Структура проекта

```
resume/
├── index.html          — разметка (HTML) + <head> с SEO-метой; тянет styles.css, main.js, scene.js
├── styles.css          — все стили (тёплая тема Organic: токены, компоненты, адаптив, reduced-motion)
├── main.js             — интеракции: i18n (EN/UK/RU/ES), reveal, счётчики, tilt карточек, переключатель языков
├── scene.js            — three.js 3D-сцена «MK» в hero (ленивый import, 3 режима, фолбэк при reduced-motion/no-WebGL)
├── index.legacy.html   — бэкап прежнего однофайлового дизайна (на случай отката)
├── images/             — скриншоты проектов для карточек
│   ├── airbag-bot-chat.jpg
│   ├── fruktbox-home.jpg
│   ├── personal-bot-menu.jpg
│   ├── personal-bot-nutrition.jpg
│   ├── tuningstore-home.jpg
│   ├── dca-bot-all.jpg         — длинный скрин: market scan + buy signal + positions (используется)
│   ├── dca-bot-menu.jpg        — buy signal (запасной)
│   ├── dca-bot-positions.jpg   — market scan (запасной)
│   └── ...
├── resume.pdf          — PDF-версия резюме (кнопка «Download PDF»); перегенерируется из текущего сайта, см. «Как обновить resume.pdf»
├── scripts/
│   ├── generate-pdf.js — генератор PDF (headless Chrome, точная копия сайта)
│   └── hooks/
│       └── pre-commit  — авто-перегенерация resume.pdf при коммите index.html
├── package.json        — npm-скрипты (pdf, pdf:watch, hooks) + puppeteer-core
└── PROJECT_GUIDE.md    — этот файл
```

## Позиционирование

Резюме спозиционировано как **Full-Stack Developer & AI Automation Engineer** (гибрид: веб-разработка + AI-автоматизация/Telegram-боты) — под выход на биржи. Флагман — **Exclusive Style** (exclusivestyle-yp.com).

## Проекты в резюме (порядок отображения)

1. **Exclusive Style, Bespoke Embroidery Atelier** — флагман, `article.project.featured` (акцентная верхняя граница + pill «Flagship»), browser frame (`exclusivestyle-home.jpg` — скрин снят с живого сайта через puppeteer, также используется в og/twitter) · LIVE · E-COMMERCE
2. **Apelsin Rozmarin, Full-Stack E-Commerce** — browser frame (`fruktbox-home.jpg`, съедобные букеты) · LIVE · PRODUCTION
3. **TuningStore** — browser frame (`tuningstore-home.jpg`) · LIVE · PRODUCTION
4. **Airbag ECU Lookup Bot** — phone mockup (`airbag-bot-chat.jpg`) · LIVE · COMMERCIAL
5. **Forge Hub, Multi-Tenant AI Assistant** — веер из трёх телефонов (`forge-hub-*.png`, класс `.phones-trio`) · LIVE · SAAS
6. **Smart DCA Trade Bot** — dual phones (`dca-bot-all.jpg` + `dca-bot-menu.jpg`, `.phones-duo`)
7. **LangChain Bot Fleet** — terminal frame (CSS-only, без изображений)

Порядок карточек чётные/нечётные чередуются через класс `.project.reverse` (визуал слева/справа). Номера секций проставлены в разметке.

**Ключевой принцип (изменён 2026-07-02):** сайт теперь **многофайловый** — `index.html` (разметка) + `styles.css` + `main.js` + `scene.js`. Прежний однофайловый вариант сохранён как `index.legacy.html`.

> ВАЖНО: из-за внешних `styles.css`/`scene.js` **открывать `index.html` напрямую через `file://` НЕЛЬЗЯ** — Chrome трактует каждый `file://`-ресурс как отдельный opaque-origin, внешний CSS не применяется, а ES-модуль `scene.js` блокируется CORS. Локальный просмотр — только через http (VS Code Live Server или `npx serve`). PDF-генератор поднимает свой http-сервер сам.
>
> В комментариях `.css` не писать пути со звёздочкой-слэшем (`*/`) — это преждевременно закрывает CSS-комментарий и роняет разбор всего файла (уже ловили эту ошибку).
>
> КЭШ: ссылки на `styles.css`/`main.js`/`scene.js` в `index.html` идут с версией `?v=N`. **При правке любого из этих файлов увеличивай `N`** (во всех трёх ссылках), иначе браузер/CDN GitHub Pages отдадут старую версию из кэша, и правки «не появятся» без хард-рефреша. Текущая версия: `v=6`.

---

## Мультиязычность (переключатель языков)

> УСТАРЕЛО (до 2026-07-02, актуально для `index.legacy.html`). В новом дизайне i18n сделан **вручную**: элементы с атрибутом `data-i18n="ключ"`, словарь EN/UK/RU/ES в `main.js` (EN снимается из самой разметки как исходник, переводятся только UK/RU/ES; значения могут содержать HTML). Переключатель — `.lang-switch` в навбаре, выбор языка хранится в `localStorage`. UK/ES пока машинные — заменить на живые. Ниже — прежний механизм на Google-виджете.

Реализовано так же, как на сайте **Apelsin Rozmarin**, — через бесплатный виджет Google Website Translator (тот же движок, что использует плагин GTranslate). **API-ключ и подписка не нужны.**

- **Основной язык** — английский (`<html lang="en">`). Переключатель: EN + Українська (UK) + Русский (RU) + Español (ES).
- **UI переключателя** — кастомная кнопка-таблетка в верхнем status-bar (`.lang-switch` / `.lang-btn` / `.lang-menu`), в стиле Warm Editorial (моно-шрифт, вермилионовый акцент, выпадающее меню). Глобус + текущий код языка + шеврон. Доступность: `aria-haspopup`, `aria-expanded`, `role="menuitemradio"`, навигация стрелками, Escape, клик вне меню закрывает.
- **Движок перевода** — `translate.google.com/translate_a/element.js` со скрытым `#google_translate_element` (`includedLanguages: 'uk,ru,es'`, `autoDisplay:false`). Родная панель Google спрятана через CSS (`.skiptranslate`, `.goog-te-banner-frame`, `body { top:0 }`).
- **Механизм переключения** — cookie `googtrans` (`/en/<lang>`) + перезагрузка страницы; при выборе English cookie удаляется. На загрузке кнопка синхронизирует подпись и активный пункт из cookie. Cookie ставится на текущий хост и его поддомены.

**Как добавить ещё язык:** добавьте код в `includedLanguages` (вызов `googleTranslateElementInit`) и новый `<li><button role="menuitemradio" data-lang="xx" data-code="XX">…</button></li>` в `.lang-menu`. Список кодов — стандартные ISO Google Translate.

**Важно:** перевод работает только по HTTP(S) (cookie). При открытии через `file://` переключатель виден, но перевод может не применяться, проверять на GitHub Pages или локальном сервере (`python -m http.server`).

---

## Как обновить resume.pdf

Кнопка «Download PDF» (в секции Contact) отдаёт статичный файл `resume.pdf`. Он **не обновляется сам** — но в проекте настроена автоматическая перегенерация (см. ниже), чтобы PDF не расходился с сайтом.

PDF делается как **точная копия живого сайта** (screen-режим, с фоном и изображениями) через headless Chrome + `puppeteer-core` (использует уже установленный Chrome, Chromium не качается). Всё зашито в `scripts/generate-pdf.js`.

### Установка (один раз)

```bash
cd resume
npm install            # ставит puppeteer-core (node_modules в .gitignore)
npm run hooks          # включает git-хук авто-перегенерации (core.hooksPath=scripts/hooks)
```

> `npm run hooks` нужно выполнять после каждого свежего `git clone` — настройка `core.hooksPath` хранится локально и не клонируется.

### Команды

| Команда | Что делает |
|---------|-----------|
| `npm run pdf` | Собрать `resume.pdf` из текущего `index.html` один раз |
| `npm run pdf:watch` | Следить за `index.html` и пересобирать PDF при каждом сохранении |
| `npm run pdf:stale` | Пересобрать только если `index.html` новее `resume.pdf` |

### Автоматическая перегенерация при коммите

Git-хук `scripts/hooks/pre-commit`: если в коммит попадает `index.html`, PDF пересобирается и `resume.pdf` автоматически добавляется в этот же коммит. Так PDF всегда совпадает с сайтом.

- Нет Chrome/`puppeteer-core` → хук **не блокирует** коммит, а предупреждает (PDF просто не обновится; поставьте `npm install`).
- Реальная ошибка рендера → коммит **останавливается** (чините или коммитьте с `git commit --no-verify`).

### Что зашито в `scripts/generate-pdf.js` (накопленный опыт)

- Авто-поиск браузера: `PUPPETEER_EXECUTABLE_PATH` / `CHROME_PATH` → Chrome → Edge (Win/macOS/Linux пути).
- **Отдаёт страницу по HTTP с встроенного статик-сервера (`127.0.0.1:<случайный порт>`), а НЕ через `file://`.** Причина: под `file://` внешний `styles.css` не применяется (каждый `file://`-ресурс — отдельный opaque-origin), и PDF выходил без стилей. HTTP это чинит. Сервер закрывается после рендера (в `--watch` держится).
- `emulateMediaType('screen')` — рендер как на сайте, а не урезанная `@media print` версия.
- `emulateMediaFeatures([{name:'prefers-reduced-motion', value:'reduce'}])` — reveal-контент виден без прокрутки, three.js-сцена не грузится (в hero показывается статичный фолбэк) (+ доп. CSS-фолбэк форсит `opacity:1`).
- **Принудительно грузит все картинки eager** перед снимком: `loading="lazy"` в headless-снимке длинной страницы ненадёжен и картинки ниже сгиба не попадали в PDF.
- Ждёт `document.fonts.ready` (таймаут 8 c), `waitUntil:'load'`.
- `page.pdf({ printBackground:true, width:'1200px', height:<полная высота>+'px', pageRanges:'1' })` — одна длинная страница = весь сайт целиком.

---

## Как запустить с нуля

Проект не требует сборки, но из-за внешних `styles.css`/`scene.js` его нужно смотреть **через локальный http-сервер, а не двойным кликом (`file://`)** — иначе не применятся стили и не запустится 3D-сцена.

```
# VS Code: открой index.html → кнопка Go Live (расширение Live Server) — самый простой путь.
# Или из терминала:
cd resume
npx serve            # затем открой напечатанный http://localhost:3000
```

**Если нужно клонировать с нуля:**

```powershell
# 1. Клонировать репозиторий
git clone https://github.com/NikitaKalchevsky/resume.git

# 2. Перейти в папку
cd resume

# 3. Запустить локальный сервер и открыть в браузере
npx serve
```

---

## Как перезапустить

Не требуется — это статический сайт, сервера нет.  
Если GitHub Pages не обновился после пуша — подожди 1–2 минуты и сделай hard refresh в браузере:

```
Ctrl + Shift + R   (Windows)
Cmd + Shift + R    (Mac)
```

---

## Как внести изменения и задеплоить

### Редактирование

```powershell
# Открыть файл в VS Code
code C:\Users\Nik\resume-deploy\resume\index.html
```

Весь контент — в `index.html`. Ищи секции по комментариям:
- `<!-- ─── HERO ─── -->` — имя, подзаголовок, контакты
- `<!-- ─── ABOUT ─── -->` — текст "о себе" и статистика
- `<!-- PROJECT 1 -->`, `<!-- PROJECT 2 -->` ... — карточки проектов
- `<!-- ─── STACK ─── -->` — таблица технологий
- `<!-- ─── EXPERIENCE ─── -->` — хронология опыта
- `<!-- ─── EDUCATION ─── -->` — обучение и языки
- `<!-- ─── CTA ─── -->` — финальный блок с контактами

### Добавить новый проект

Скопируй блок `<article class="project">...</article>` из существующего проекта, вставь после последнего `</article>` перед закрывающим `</div>` секции `projects`. Замени текст, стек и ссылки.

### Деплой после изменений

```powershell
# 1. Перейти в папку с репозиторием
cd C:\Users\Nik\resume-deploy\resume

# 2. Проверить статус — какие файлы изменились
git status

# 3. Добавить изменённые файлы
git add index.html

# Если добавлял новые картинки — добавь и их:
git add images/

# 4. Сделать коммит с описанием что сделал
git commit -m "Add X project / Update Y section"

# 5. Залить на GitHub (сайт обновится автоматически через ~1 мин)
git push origin main
```

### Добавить новую картинку для проекта

```powershell
# 1. Скопировать картинку в папку images/
# (через проводник или команду)
copy C:\путь\к\картинке.jpg C:\Users\Nik\resume-deploy\resume\images\название.jpg

# 2. Прописать в index.html:
# <img src="images/название.jpg" alt="описание">

# 3. Задеплоить (см. выше)
git add images/название.jpg index.html
git commit -m "Add screenshot for X project"
git push origin main
```

---

## Как проверить что всё работает

```powershell
# Проверить последний коммит
cd C:\Users\Nik\resume-deploy\resume
git log --oneline -5

# Проверить что залито на GitHub (должно совпадать с локальным)
git status
# Ответ "nothing to commit, working tree clean" = всё синхронизировано
```

**Проверить сайт онлайн:**  
Открой в браузере URL из Settings → Pages репозитория на GitHub.  
Если сайт не обновился — подожди 1–2 минуты после пуша.

---

## Конфигурация

| Параметр | Значение |
|----------|----------|
| Репозиторий | https://github.com/NikitaKalchevsky/resume |
| Ветка деплоя | `main` |
| Локальная папка | `C:\Users\Nik\resume-deploy\resume\` |
| Шрифты | Google Fonts — подгружаются автоматически при открытии сайта |
| Акцентный цвет | вермилион `oklch(0.605 0.190 36)` (≈ `#d6451f`) — переменная `--accent` в CSS; ссылки/hover используют `--accent-deep` для контраста AA |
| Контактный email | nikita.kalchevskyi@gmail.com |
| Telegram | @Hybrid_d |

---

## Траблшутинг

### Сайт не обновился после `git push`
GitHub Pages иногда кэширует. Подожди 1–2 минуты, затем:
- Сделай hard refresh: `Ctrl + Shift + R`
- Проверь вкладку Actions на GitHub — там видно статус деплоя

### `git push` просит логин/пароль
GitHub больше не принимает пароли. Нужен Personal Access Token:
1. GitHub → Settings → Developer settings → Personal access tokens → Generate new token
2. Дай права `repo`
3. Используй токен вместо пароля при пуше

Или настрой SSH-ключ:
```powershell
# Сгенерировать ключ
ssh-keygen -t ed25519 -C "nikita.kalchevskyi@gmail.com"

# Показать публичный ключ — скопировать в GitHub → Settings → SSH keys
cat ~/.ssh/id_ed25519.pub

# Сменить remote на SSH
git remote set-url origin git@github.com:NikitaKalchevsky/resume.git
```

### Шрифты не загружаются / страница выглядит некрасиво
Скорее всего нет интернета или заблокирован Google Fonts. Это нормально при локальном открытии без сети — на продакшне (GitHub Pages) всегда работает.

### Картинка не отображается
- Проверь что файл лежит в `images/` с точно таким именем (учитывай регистр)
- Проверь путь в `src="images/имя.jpg"` — без лишних слешей
- Убедись что картинка добавлена через `git add` и залита через `git push`

---

## История изменений

- **2026-07-02 (5)** — Кэш-бастинг: ссылки на `styles.css`/`main.js`/`scene.js` теперь с `?v=N` (при правке файла увеличивать N во всех трёх). Причина: пользователь видел старую версию (гигантская «M», слипшиеся «7Web», «16,003» с запятой) — это отдавался кэш промежуточного деплоя, тогда как текущий код на его же размере (1512×1300) рендерится верно (проверено скриншотом: обе буквы MK видны, статистика столбиком). Контент/логику не меняли, только версии ассетов.
- **2026-07-02 (4)** — Hero переделан под референс и **адаптивную 3D-сцену, которая нигде не обрезается**. Hero стал закруглённой тёмной **панелью** (не во весь экран), статистика вынесена вниз на кремовый фон (5 счётчиков с суффиксом `+` и пробелом-разделителем). В `scene.js` буквы M/K и фон объединены в group `content`, а масштаб и смещение считаются из frustum по размерам панели — на десктопе MK в правой зоне (обе буквы целиком), на планшете (>640px) сжимается в правую зону, на телефоне (<640px) центрируется как фон под затемняющим градиентом. Проверено скриншотами на 1440/1024/768/430. Заголовок в две строки (Mykyta / Kalchevsky. акцентом), чипы сцены (Volume/Wireframe/Particles) под CTA. Новые i18n-ключи (hero.kicker, scene.*, meta.bots).
- **2026-07-02 (3)** — Exclusive Style: плейсхолдер `.img-slot` заменён реальным скрином `images/exclusivestyle-home.jpg` (снят с живого exclusivestyle-yp.com через puppeteer — с закрытием cookie-баннера и чат-виджета). Этот же кадр теперь в `og:image`/`twitter:image` (флагман). Осталось: живые переводы UK/ES.
- **2026-07-02 (2)** — **Полная смена дизайна на новую тему Organic** (из папки `new design`, `INTEGRATION.md` вариант B — перенос в чистый статик, без React/сборки). Сайт стал **многофайловым**: `index.html` (разметка) + `styles.css` + `main.js` + `scene.js`; прежний однофайловый дизайн сохранён как `index.legacy.html`. Тёплая тема (`#f5ead8` фон, терракота `#c67139` / шалфей `#7a8a5e`, шрифты Caprasimo + Figtree), тёмные панели hero/contact. **Hero — 3D-сцена three.js «MK»** (`scene.js`, инициалы из `ExtrudeGeometry`, 3 режима solid/wire/cloud, фон icosahedron+torus, параллакс/drag/scroll; при reduced-motion/no-WebGL — текстовый фолбэк). **7 проектов**, флагман — **Exclusive Style** (новый, `.img-slot`-плейсхолдер до скрина `images/exclusivestyle-home.jpg`), Apelsin стал №2. i18n на 4 языка (EN/UK/RU/ES) через `data-i18n` + словарь в `main.js` (заменил прежний Google-Translate-виджет). Сохранены: вся SEO-мета (+ добавлены canonical, twitter-теги), якоря разделов, контакты, `resume.pdf`. **PDF-хук переписан:** рендер через встроенный http-сервер (внешний CSS не применялся под `file://`), принудительная eager-загрузка картинок. Пойманы и исправлены две ошибки: `*/` в CSS-комментарии рушил разбор всего `styles.css`; `loading="lazy"` терял картинки в PDF. **Скрин Exclusive Style и живые переводы UK/ES — за пользователем.**
- **2026-07-02** — Forge Hub №04: добавлен третий скрин (Finance), мокап перекомпонован в «веер» из трёх телефонов (новый CSS-класс `.phones-trio` — scoped, DCA-карточку не задевает; центральный телефон приподнят и спереди, staggered-анимация scroll). Новый файл `forge-hub-finance.png` (переименован из `*.png.png`). Стандартная договорённость: **деплой сразу после правок**.
- **2026-07-01** — Достоверность + Forge Hub. **Apelsin:** убран недостоверный claim про двуязычность (чип «2 languages» и буллет «Bilingual storefront» удалены; вместо — реальный «WordPress to React/Vite rebuild: 301 redirects, Firebase sitemap, preserved SEO/Merchant Center»). **Проект №04:** «Personal AI Assistant» полностью заменён на **Forge Hub, Multi-Tenant AI Assistant** (LIVE · SAAS): мультитенантность по `user_id`, биллинг Telegram Stars (Pro ~$8/мес), 6-язычный UI, hardening. Про выручку/платящих не пишем (их 0). Новые скрины `forge-hub-menu.png` + `forge-hub-lang.png` (переименованы из загруженных `*.jpg.png`). Телефон +1 (239) пока не трогали — ждём CA-номер. PDF пересобран pre-commit хуком.
- **2026-06-25 (3)** — Финализация под выход на биржи (Upwork/Fiverr/Direct). По итогам анализа рынка фриланса — **гибридное позиционирование** «Full-Stack Developer & AI Automation Engineer» (title/meta/OG, hero-tag, hero-sub, текущая роль в Trajectory). Блок «What I build» расширен до 6 услуг (3 колонки): добавлены **Automation & integrations** и **Multilingual / i18n**. В стек добавлены `next-intl · i18n` (Frontend) и `Workflow automation (n8n, Make, Zapier)` (AI & LLM, вторичные — опыт «осваиваю»). Footer: «this page speaks 4 languages». Поправлен отступ строки языка (`.lang` gap + уровень выровнен вправо). **Важно:** после этих текстовых правок `resume.pdf` снова устарел — нужно перегенерировать (см. «Как обновить resume.pdf»). Скрины ботов — ждём свежие от пользователя.
- **2026-06-25 (3)** — Автоматизация PDF: постоянный генератор **`scripts/generate-pdf.js`** (весь накопленный опыт — авто-поиск Chrome/Edge, screen-режим, reduced-motion, ожидание шрифтов/картинок, одна длинная страница), **`package.json`** с командами `npm run pdf` / `pdf:watch` / `pdf:stale` / `hooks`, и git-хук **`scripts/hooks/pre-commit`**, который пересобирает `resume.pdf` и добавляет его в коммит при изменении `index.html` (если нет окружения — не блокирует коммит). `node_modules` добавлены в `.gitignore`. Разовый ваш `render-pdf.js` заменён этим скриптом.
- **2026-06-25 (2)** — Перегенерирован **`resume.pdf`** из текущего сайта (был устаревший от 25.05 — без актуальных картинок/верстки, не совпадал с GitHub). Теперь PDF — точная копия живого сайта (screen-режим, фон + изображения), собирается headless Chrome через `puppeteer-core` (см. раздел «Как обновить resume.pdf»). Размер вырос с ~360 КБ до ~2.9 МБ (встроены картинки). Кнопка «Download PDF» не менялась, продолжает отдавать `resume.pdf`.
- **2026-06-25** — Добавлена **мультиязычность**: переключатель языков в верхнем status-bar (EN основной + UK / RU / ES), реализован так же, как на Apelsin Rozmarin, — бесплатный виджет Google Website Translator (тот же движок, что GTranslate), **без API-ключа и подписки**. Кастомный UI в стиле Warm Editorial (`.lang-switch`: кнопка-таблетка с глобусом + выпадающее меню, доступность через `role="menuitemradio"`, стрелки/Escape/клик-вне). Перевод — cookie `googtrans` + reload, родная панель Google скрыта (`.skiptranslate`, `body{top:0}`). Подробности в разделе «Мультиязычность».
- **2026-06-24** — Улучшения по итогам аудита: **hero CTA** (кнопки «See selected work» + «Get in touch», входят в оркестрованную анимацию hero, hero-sub margin уменьшен). Новый блок **«What I build»** в секции About (`.services` / `.services-grid`, 5 услуг: магазины, веб-приложения, админки, API/интеграции, боты) с staggered-reveal. **Чипы-результаты** (`.metrics`/`.metric`) на флагмане (441 товар · 3 оплаты · SSL A · Solo) и TuningStore (7 языков · 301+ файлов · 3 оплаты · R2). **Ровные действия**: у Personal AI и LangChain добавлена кнопка «Architecture on request» (теперь у всех 6 карточек есть CTA). JS: у живых проектов (с `.btn.primary`) клик по визуалу открывает сайт в новой вкладке, курсор-подсказка показывает «Open ↗» вместо «View». GitHub-ссылка оставлена (репозитории публичные). Отзывы не добавляли (нет реальных данных). Флагман Apelsin отмечен как **двуязычный**: чип «2 languages» + пункт «Bilingual storefront» (конкретная пара языков в подписи пока не указана — ждём подтверждения).
- **2026-06-21** — Репозиционирование на **Full-Stack Web Developer (front + back end)** как основную специализацию (AI/боты — вторичная линия). Обновлены `<title>`, meta/OG (og:image → `fruktbox-home.jpg`), hero-tag («Full-Stack Web Developer · Front & Back End»), hero-sub, About-текст, текущая роль в Trajectory. Статистика About переупорядочена под веб (добавлено «Live web platforms = 2», убрано «Droplet uptime»). Стек переупорядочен: Frontend → Backend → AI & LLM → Infrastructure (добавлены Node.js / Next.js API). **Проекты переставлены**: №1 — флагман **Apelsin Rozmarin** (переименован с «Fruktbox», `.featured`-карточка с акцентным фоном и pill «Flagship», ссылка «Visit live site»), №2 TuningStore, далее боты (Airbag, Personal, DCA, LangChain). Номера 01–06 пересчитаны, print-override для `.featured`.
- **2026-06-20 (2)** — Перенял приёмы лучших dev-портфолио (Brittany Chiang, Awwwards index-module, интерактивные курсоры): добавлена **липкая боковая навигация со scroll-spy** (`.side-nav`, тики растут + подсветка активной секции через IntersectionObserver с `rootMargin -45%/-50%`, лейблы раскрываются на hover, скрыта < 1300px) и **курсор-подсказка «View»** на `.project-visual` (только fine-pointer). Адаптировано под светлую Warm Editorial, без перехода в dark.
- **2026-06-20** — Усиление темы Warm Editorial (анимации/переходы + подача карточек). Добавлены: оркестрованный вход hero (построчное появление `h1` через clip-маску `.line`/`.line-inner`, staggered-вход тега, подзаголовка и контактов), направленное появление проектов (визуал и текст выезжают навстречу с противоположных сторон, чётные/нечётные зеркально), «живые» рамки проектов (lift + zoom картинки + анимированное подчёркивание `h3` на hover), редакционные номера `01–06` (`.project-no`) фоновым серифом за рамками. JS: `.project` наблюдаются отдельно от общего staggered-reveal; в общий reveal добавлен `.section-head`. Все новые анимации заглушены в `prefers-reduced-motion`. Контент проектов не менялся.
- **2026-06-11** — Полный редизайн в светлую тему **Warm Editorial**: тёплый бумажный фон, палитра в OKLCH, вермилионовый акцент вместо кислотного лайма. Шрифт тела Inter → Hanken Grotesk. Добавлены параллакс (hero-ghost «MK», фоновая сетка), staggered scroll-reveal, анимированные счётчики статистики, индикатор прогресса прокрутки. Аудит-фиксы: `prefers-reduced-motion` (отключает все анимации), focus-visible состояния, favicon (inline SVG), `og:image`. Весь текст переведён с em-dash на en-dash/запятые. Из репозитория удалён мусор (`Claude Setup.exe`), добавлен `.gitignore`.
- **2026-05-25** — `@media print` с маленькими картинками проектов; `resume.pdf` перегенерирован из живого URL.

*Последнее обновление: 2026-07-02 — новый дизайн Organic: многофайловый статик, 3D-hero «MK» как закруглённая панель с адаптивной сценой (не обрезается на 1440/1024/768/430, статистика вынесена вниз), 7 проектов (флагман Exclusive Style, реальный скрин + og/twitter), i18n на 4 языка. Старый дизайн — index.legacy.html. PDF-хук на http-рендере. Локально открывать только через http (Live Server / npx serve). Ассеты с версией `?v=6` (при правке css/js увеличивать). Осталось: живые переводы UK/ES.*
