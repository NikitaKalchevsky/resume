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
| Хостинг | GitHub Pages |
| Git-репозиторий | https://github.com/NikitaKalchevsky/resume.git |
| Ветка | `main` |

**Внешних API, токенов и баз данных нет.** Всё статичное.

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
├── resume.pdf          — PDF-версия резюме (обновлять вручную)
└── PROJECT_GUIDE.md    — этот файл
```

## Проекты в резюме (порядок отображения)

1. **Airbag ECU Lookup Bot** — phone mockup (`airbag-bot-chat.jpg`)
2. **Fruktbox E-Commerce** — browser frame (`fruktbox-home.jpg`)
3. **Personal AI Assistant** — dual phones (`personal-bot-menu.jpg` + `personal-bot-nutrition.jpg`)
4. **TuningStore** — browser frame (`tuningstore-home.jpg`) · LIVE · PRODUCTION
5. **Smart DCA Trade Bot** — dual phones (`dca-bot-menu.jpg` + `dca-bot-positions.jpg`) · ожидаются скрины
6. **LangChain Bot Fleet** — terminal frame (CSS-only, без изображений)

**Ключевой принцип:** всё в `index.html`. CSS — в теге `<style>`, JS — в теге `<script>` в конце файла. Никаких отдельных `.css` и `.js` файлов.

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

- **2026-06-11** — Полный редизайн в светлую тему **Warm Editorial**: тёплый бумажный фон, палитра в OKLCH, вермилионовый акцент вместо кислотного лайма. Шрифт тела Inter → Hanken Grotesk. Добавлены параллакс (hero-ghost «MK», фоновая сетка), staggered scroll-reveal, анимированные счётчики статистики, индикатор прогресса прокрутки. Аудит-фиксы: `prefers-reduced-motion` (отключает все анимации), focus-visible состояния, favicon (inline SVG), `og:image`. Весь текст переведён с em-dash на en-dash/запятые. Из репозитория удалён мусор (`Claude Setup.exe`), добавлен `.gitignore`.
- **2026-05-25** — `@media print` с маленькими картинками проектов; `resume.pdf` перегенерирован из живого URL.

*Последнее обновление: 2026-06-11 — редизайн в светлую тему Warm Editorial + аудит.*
