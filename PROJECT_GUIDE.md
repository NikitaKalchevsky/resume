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
├── index.html          — весь сайт: HTML + CSS + JS в одном файле
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

Резюме спозиционировано как **Full-Stack Web Developer (front + back end)** — это основная линия; AI/Telegram-боты идут сильной вторичной. Флагман — **Apelsin Rozmarin** (apelsin-rozmarin.com.ua).

## Проекты в резюме (порядок отображения)

1. **Apelsin Rozmarin, Full-Stack E-Commerce** — флагман, `article.project.featured` (акцентный фон + pill «Flagship»), browser frame (`fruktbox-home.jpg`) · LIVE · PRODUCTION
2. **TuningStore** — browser frame (`tuningstore-home.jpg`) · LIVE · PRODUCTION
3. **Airbag ECU Lookup Bot** — phone mockup (`airbag-bot-chat.jpg`) · LIVE · COMMERCIAL
4. **Personal AI Assistant** — dual phones (`personal-bot-menu.jpg` + `personal-bot-nutrition.jpg`)
5. **Smart DCA Trade Bot** — dual phones (`dca-bot-all.jpg` + `dca-bot-menu.jpg`)
6. **LangChain Bot Fleet** — terminal frame (CSS-only, без изображений)

Номера карточек `01–06` (`.project-no`) проставлены вручную в HTML — при перестановке проектов их нужно обновлять.

**Ключевой принцип:** всё в `index.html`. CSS — в теге `<style>`, JS — в теге `<script>` в конце файла. Никаких отдельных `.css` и `.js` файлов.

---

## Мультиязычность (переключатель языков)

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
- `emulateMediaType('screen')` — рендер как на сайте, а не урезанная `@media print` версия.
- `emulateMediaFeatures([{name:'prefers-reduced-motion', value:'reduce'}])` — чтобы появляющийся по скроллу reveal-контент был виден без прокрутки (+ дополнительный CSS-фолбэк форсит `opacity:1`).
- Ждёт `document.fonts.ready` и загрузку всех `document.images` (с защитным таймаутом 15 c), `waitUntil:'load'` (не `networkidle0` — keep-alive шрифтов мешает «простою сети»).
- `page.pdf({ printBackground:true, width:'1200px', height:<полная высота>+'px', pageRanges:'1' })` — одна длинная страница = весь сайт целиком.

---

## Как запустить с нуля

Проект не требует установки или сборки. Просто открой файл в браузере:

```
# Открыть локально в браузере (двойной клик в проводнике или:)
start C:\Users\Nik\resume-deploy\resume\index.html
```

Или через VS Code — открой `index.html` и нажми Go Live (Live Server extension).

**Если нужно клонировать с нуля:**

```powershell
# 1. Клонировать репозиторий
git clone https://github.com/NikitaKalchevsky/resume.git

# 2. Перейти в папку
cd resume

# 3. Открыть в браузере
start index.html
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

*Последнее обновление: 2026-06-25 — автоматизация PDF: scripts/generate-pdf.js + npm-команды + git-хук pre-commit (resume.pdf пересобирается при изменении index.html), resume.pdf пересобран под актуальный сайт. Ранее в этот день — финализация под биржи: гибрид «Full-Stack Developer & AI Automation Engineer», 6 услуг (+ Automation, + i18n), стек дополнен; мультиязычность (EN + UK / RU / ES).*
