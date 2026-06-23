# SmashUp — веб-фронтенд

Веб-клиент музыкальной мэшап-платформы [smashup.ru](https://smashup.ru). Одностраничное
приложение (SPA) на React + TypeScript; «сестра» нативного iOS-приложения — общий бэкенд
`https://api.smashup.ru`, общие модели (Mashup / Playlist / Track / User) и общий конверт
ответа. Весь видимый текст, комментарии и сообщения валидации — на русском.

## Ссылки

- **Документация к бэкенду (API):** [wiki](https://github.com/LeonidMem/SmashUp-FrontEnd/wiki)
- **Дизайн (Figma):** [SmashUp 2.0](https://www.figma.com/file/rRag5NIqwib0N69njQFTbK/SmashUp-2.0?node-id=139%3A1473)

## Стек

- **React 18** + **TypeScript** (strict, `noUnusedLocals`/`noUnusedParameters`)
- **Vite** (dev-сервер и сборка), алиас `@/` → `src/`
- **Tailwind CSS** — токены темы заданы прямо в `tailwind.config.js` (RGB-литералы, не CSS-переменные)
- **Zustand** — всё состояние (кэши сущностей + глобальные сторы)
- **react-router-dom v6** (data-router, все v7-future-флаги включены)
- **react-howler** — аудио; **@dmhd6219/react-media-session** (форк) — медиасессия экрана блокировки
- **react-hook-form** + **zod** — формы; **shadcn/ui** + **class-variance-authority** — UI-примитивы
- **Vitest** + **@testing-library/react** — тесты

## Быстрый старт

```bash
git clone https://github.com/SmashUp-ru/SmashUp-FrontEnd.git
cd SmashUp-FrontEnd
nvm use                  # Node по .nvmrc (22); поддерживается ^20.19 || ^22.12
cp .env.example .env     # обязательно: без него все CDN/API-URL станут undefined/...
npm install              # ставит зависимости + husky-хук (prepare)
npm run dev              # http://localhost:5173
```

`.env` (gitignored):

```
VITE_BACKEND_URL=https://api.smashup.ru     # бэкенд (для локалки можно прод)
VITE_FRONTEND_URL=http://localhost:5173
```

> Медиасессия (Media Session API) требует HTTPS — локально по HTTP не покажется. Это норма.

## Команды

| Команда | Что делает |
|---------|-----------|
| `npm run dev` | Vite dev-сервер |
| `npm run build` | **`tsc -b` (тайпчек, гейтит сборку) → `vite build`** — ошибка типов валит билд |
| `npm run lint` / `lint:fix` | ESLint (Prettier прогоняется *через* ESLint, правило `prettier/prettier`) |
| `npm run preview` | отдать прод-сборку |
| `npm run test` / `test:watch` | Vitest (one-shot / watch) |

- **`build` сначала запускает `tsc -b`** — мёртвые импорты/переменные ломают сборку, не только линт.
- **Husky + lint-staged** прогоняют `eslint --fix` на застейдженных `*.{html,js,ts,tsx}` при коммите,
  плюс отдельный шаг `tsc -b` в pre-commit.
- Тест-файлы (`*.test.ts(x)`) исключены из `tsc -b` — ошибка типов в тесте не валит прод-сборку.
- **CI** (`.github/workflows/ci.yml`): на push/PR — `tsc -b` + `eslint .` + `npm test`.

## Архитектура

Всё приложение живёт под `src/`. Организующий принцип — **четырёхчастное деление**:

- **`src/router/pages/`** — по папке на роут; `*Page.tsx` — точка входа роута (регистрируется в
  `src/main.tsx`). Страницы тонкие: зовут feature-хук за данными и рендерят компоненты. Здесь же три
  layout-файла: `layout.tsx`, `rootLayout.tsx`, `authLayout.tsx`.
- **`src/router/features/`** — самодостаточные feature-модули (`player/`, `header/`, `search/`,
  `mashup/`, `moderation/`, `mashupInfo/`, …). Фича владеет своим `use*PageData.ts`-хуком (селекторы
  стора + загрузка через `useEffect`) и презентационными компонентами. **Страницы используют фичи;
  фичи никогда не импортируют страницы.**
- **`src/router/shared/`** — кросс-фичевые блоки: `components/` (карточки-сущности, дропдауны,
  диалоги, формы), `hooks/`, `schemas/` (zod), `toasts/`, `types/`.
- **`src/components/`** — дизайн-система: `ui/` (shadcn-примитивы) и `icons/` (рукописные SVG-компоненты).

Плюс: **`src/store/`** — состояние Zustand (+ `reset.ts`, `entities/`); **`src/lib/`** — `utils.ts`
(общий `axiosSession`, `cn`, хелперы), `cdn.ts` (`coverUrl`/`mashupAudioUrl`), `bitmask.ts`,
`regex.ts`, `types.ts`; **`src/test/`** — сетап Vitest.

### Роутинг и вложенность лейаутов

Роуты — в `src/main.tsx`. Иерархия три уровня:

```
Layout                 (бутстрап юзера из токена; монтирует Toaster + NavigationTracker)
├── RootLayout         (оболочка приложения: Sidebar + Header + Outlet + 3 PlayerBar + MashupInfo + FullPlayer)
│   └── большинство страниц (/, /playlist/:id, /mashup/:id, /user/:username, /search, /settings, …)
└── AuthLayout         (вход / регистрация / восстановление пароля)
```

- **`Layout`** резолвит юзера по сохранённому токену; на `404` чистит токен (это путь логаута).
- **`RootLayout`** — постоянная оболочка; монтирует **три** плеер-бара сразу (каждый сам прячется по
  своему источнику), плюс `MashupInfo` (десктоп-side-панель) и `FullPlayer` (мобильный полноэкранный).
- Auth-страницы редиректят на `/`, если `currentUser` уже есть.
- ~14 редких/тяжёлых страниц — `React.lazy`; оба лейаута оборачивают `<Outlet/>` в `<Suspense>` +
  глобальный `ErrorBoundary`.

### Слой данных: кэши сущностей + конверт axios

Это самый важный паттерн в коде. Сосуществуют два вида состояния.

**Кэши сущностей** (`src/store/entities/`) строятся фабрикой **`createEntityStore<T>(apiPath, keyNames)`**:
id-keyed кэш с дедупликацией запросов, батчингом по 100 (`getManyByIds`) и вторичными строковыми
индексами (`keyNames`). **У кэша нет инвалидации/TTL** — после мутации патчите вручную
`updateOneById(id, partial)`; с сервера он сам не синхронится. Инстансы (4): `useMashupStore`,
`usePlaylistStore`, `useTrackStore`, `useUserStore`. Подробности — в JSDoc `entities.ts`.

Весь HTTP идёт через синглтон **`axiosSession`** (`src/lib/utils.ts`): `baseURL = VITE_BACKEND_URL`,
request-интерсептор подставляет `Authorization: Bearer ${getToken()}` на **каждый** запрос.
Ответы — конверт `{ status?, message?, response: T }`; полезная нагрузка всегда в `r.data.response`.
Response-интерсептор авто-логаутит на `401` **только если токен был** (`403` — НЕ логаут: нет прав /
бан / неверный пароль).

### Auth / токен

`src/store/global.ts` хранит `token`, `currentUser`, `currentUserPlaylists`, `email`, `settings` и
общие списки. Токен читается на старте из `sessionStorage` *или* `localStorage` (ключ `smashup_token`:
sessionStorage = вход на сессию, localStorage = «запомнить меня»). **`updateToken()` меняет только
in-memory стор** — за запись/очистку ключа отвечает вызывающий компонент. `getToken()` — обычная
функция (не хук), чтобы интерсептор axios мог звать её вне React.

### Аудиоплеер (`src/router/features/player/`)

Состояние — в `src/store/player.ts` (Zustand `persist`, ключ `player-storage`). **Три независимых
источника воспроизведения**, у каждого свой `PlayerBar*` и свой `isPlaying`, общая громкость:

| Источник (стор плеера) | Бар | Для чего |
|---|---|---|
| `queue` (массив id мэшапов) | `PlayerBar.tsx` | обычное прослушивание |
| `moderationSrc` | `PlayerBarModeration.tsx` | превью неопубликованных в модерации |
| `vkMashupSrc` | `PlayerBarVkMashup.tsx` | превью VK-аудио перед загрузкой |

Все три бара используют общий каркас `<PlaybackBar>` + `<VolumeControl>`; навигация по очереди — в
хуке **`usePlayer()`** (play/pause/next/prev/playQueue/playMashup; источники взаимоисключающи). `loop` —
`LoopMode` (`'none'|'queue'|'mashup'`). На мобайле тап по мини-бару разворачивает **`FullPlayer`**
(эфемерный флаг `fullPlayer`, не персистится). `queueId` — строковый идентификатор источника очереди
(`'playlist/1'`, `'recomendations'`, `'mashup/{id}'`).

### Формы, компоненты, тема

- **Формы** = `react-hook-form` + `zodResolver(schema)` (схемы в `src/router/shared/schemas/`).
  Картинки → base64 (снять префикс `data:…;base64,`); размер гейтит `validateImageDimensions`.
  Двойной сабмит — `useSubmitGuard()`.
- **Карточки-сущности** — строгая семья имён на сущность: `XThumb` (большая, `_400x400`),
  `XSmallThumb` (строка, `_100x100`), `XThumbSkeleton`, `XThumbExplicitDisallowed`. URL обложек —
  только через **`coverUrl(entity, imageUrl, size)`** (`src/lib/cdn.ts`), не конкатенировать руками.
- **Тосты**: `useToast()` + `<Toaster/>`; `TOAST_LIMIT = 1` (новый тост заменяет текущий).
- **shadcn/ui** в `src/components/ui/` через `class-variance-authority` + `cn()` (`clsx` + `tailwind-merge`).

## Как добавить…

**…страницу:**
1. Создай папку `src/router/pages/<name>/` с `<Name>Page.tsx`.
2. Если нужны данные — заведи feature-хук `use<Name>PageData.ts` под `src/router/features/<name>/`
   (селекторы стора + загрузка через `useEffect`/`useCachedEntityById`).
3. Зарегистрируй роут в `src/main.tsx` (под `RootLayout` или `AuthLayout`); редкую/тяжёлую — `React.lazy`.

**…иконку:** рукописный TSX-компонент по образцу существующих (`src/components/icons/...`), принимает
`IconProps` (`color`/`hoverColor` — **имена токенов Tailwind**, не hex; `size` переопределяет `width`/`height`;
SVG через `fill-current`/`stroke='currentColor'`). DOM-атрибуты — camelCase (`clipPath`, не `clip-path`);
это гарантирует тест `icons.test.tsx`. Динамические цвета-классы (`text-${color}`) — в `safelist`.

**…entity store:** `createEntityStore<T>('<apiPath>', ['<secondaryKey>', …])` в `src/store/entities/`.
Строковые ключи дают `getOneByStringKey('<key>', …)`. После мутаций патчи кэш `updateOneById`.

## Тестирование (Vitest)

Сетап — блок `test` в `vite.config.ts` (`jsdom` + `setupFiles: ['./src/test/setup.ts']`) +
`@testing-library/react` + `jest-dom`. Покрыто: `bitmask`/`utils` (чистые хелперы),
`createEntityStore` (дедуп, батчинг по 100, строковый индекс, `reset`), `usePlayer` (play/pause/next/prev
по всем веткам loop, playQueue/playMashup, взаимоисключение источников), сторадж-коллизии +
`resetAppState`, рендер иконок. Соглашение «доказать, что тест кусается»: временно верни баг,
убедись в падении, верни как было.

## Гочи и соглашения

- **Цвета темы — токены Tailwind прямо в `tailwind.config.js`** (RGB-литералы: `primary` ≈ `#A887F8`,
  `background`, `surface`, …), **не** CSS-переменные. Шрифт — **Manrope**.
- **Динамически собираемые классы — в `safelist`** (иначе Tailwind их выпилит). Особенно бьёт по
  цветам иконок (`text-${color}`) и интерполированным `calc(...)`-высотам.
- **Обложки/аудио модерации требуют токен в *query-string*** (`?token=${getToken()}`) — бэкенд
  отклоняет header-auth для `/uploads/moderation/` (400). `coverUrl()` НЕ строит moderation/vk/`.mp3`-URL.
- **Настройки — битмаска** (`src/store/settings.ts`): `bitrate` (индекс 0–4 → kbps) + `settingsBitmask`.
  Explicit-фильтр комбинирует битмаску с `mashup.statuses` через `src/lib/bitmask.ts`. ⚠ маски мэшапа и
  пользователя **переиспользуют номера бит** — см. JSDoc в `bitmask.ts`.
- **Поиск — два режима** (`src/store/search.ts`): `'search'` (текст) и `'crossover'` (теги треков/артистов).
- Паттерны валидации — централизованы в `RegEx` (`src/lib/regex.ts`); вход валидирует `EMAIL_OR_USERNAME`,
  регистрация — `EMAIL` (намеренно по-разному).
