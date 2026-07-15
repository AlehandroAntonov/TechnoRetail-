# CLAUDE.md — TechnoRetail (форк Singitronic)

Full-stack e-commerce: **Next.js 15 (App Router)** фронтенд + **Node.js/Express** бэкенд + **Prisma** + **MySQL 8**.
Форк проекта Singitronic (Kuzma02). Наш репозиторий: https://github.com/AlehandroAntonov/TechnoRetail-.git

## Архитектура

Проект — это **два приложения в одном репозитории**:

| Часть | Расположение | Порт | Запуск |
|---|---|---|---|
| Frontend (Next.js) | корень репозитория | 3000 | `npm run dev` / `npx next start` |
| Backend (Express API) | `server/` | 3001 | `node app.js` (из папки `server`) |
| MySQL | Docker (`docker-compose.yml`) | 3306 | `docker compose up -d` |

- Фронтенд обращается к бэкенду через `NEXT_PUBLIC_API_BASE_URL` (`lib/api.ts` → `apiClient`).
- Бэкенд-роуты: `server/routes/*.js`, контроллеры: `server/controllers/*.js`, маршруты под `/api/*` (см. `server/app.js`).
- Аутентификация — NextAuth (Credentials), конфиг в `utils/authOptions.ts`, route-handler в `app/api/auth/[...nextauth]/route.ts`.
- Админка `/admin/*` защищена `middleware.ts` (требует JWT с `role === "admin"`).
- Обе части читают **одну** `DATABASE_URL`; у каждой свой `.env` (корневой + `server/.env`).

## Первичная установка (один раз)

```bash
# 1. MySQL
docker compose up -d

# 2. Зависимости
npm install                 # в корне (frontend)
cd server && npm install    # в server (backend)

# 3. Prisma-миграции (из папки server)
cd server && npx prisma migrate dev

# 4. Демо-данные (из server/utills)
cd server/utills && node insertDemoData.js

# 5. Создать админа (из server)
cd server && node createAdminUser.js admin@techretail.local Admin123!
```

## Запуск (см. также раздел «После перезагрузки»)

Нужны **три** процесса: MySQL (Docker), backend, frontend.

```powershell
# Всё сразу — dev-режим:
.\start-dev.ps1
# Прод-режим (быстрее, но требует npm run build после правок кода):
.\start-prod.ps1
```

Вручную (три отдельных терминала):
```bash
docker compose up -d                          # 1. БД
cd server && node app.js                       # 2. backend :3001
npm run dev                                     # 3. frontend :3000 (из корня)
```

Открыть: http://localhost:3000

## Учётные данные и порты (локальная разработка)

| Что | Значение |
|---|---|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:3001 |
| MySQL | `localhost:3306`, БД `singitronic_nextjs` |
| MySQL root | `root` / `singitronic_pass` |
| Админ (сайт) | `admin@techretail.local` / `Admin123!` |

`.env` (корень и `server/.env`) в `.gitignore` — секреты в репозиторий не коммитятся.
`NEXTAUTH_SECRET` в корневом `.env` — dev-значение, для не-локального окружения сменить.

## Полезные скрипты в server/

- `node createAdminUser.js <email> <password>` — создать админа
- `node makeUserAdmin.js <email>` — повысить существующего юзера до админа
- `node listUsers.js` — список пользователей
- `node test-db-connection.js` — проверка коннекта к БД

## Особенности и подводные камни (Windows)

- **Prisma-клиент нужен в корне тоже.** `server/utills/db.js` намеренно грузит клиент из корневого `node_modules` (`../../node_modules/@prisma/client`). Если backend падает с `@prisma/client did not initialize yet` — выполнить в корне: `npx prisma generate` (при остановленном backend).
- **EPERM при сборке/`prisma generate`.** Движок Prisma (`query_engine-windows.dll.node`) блокируется работающим backend. Перед `npm run build` / `prisma generate` **останови backend**. Поэтому из корневого `dev`-скрипта `prisma generate` убран (оставлен только в `build`).
- **Прод-сборка (`npm run build`)** проходит; dev-режим медленный при первом заходе на страницу (компиляция на лету) — это нормально, прод в разы быстрее.
- **`dotenv` и `express-rate-limit`** нужны бэкенду (используются в `app.js`/middleware) — уже в `server/package.json`.

## Рабочий процесс: ветки и Pull Request

Каждая фича/тикет — **отдельная ветка и отдельный PR** (не коммит напрямую в `main`).

- Ветка: `feature/scrum-<N>-<short-slug>` (напр. `feature/scrum-5-promo-code`).
- Открывать PR через `gh` (GitHub CLI установлен):
  ```bash
  gh pr create --base main --head <branch> --title "SCRUM-<N> <title>" --body-file <file>
  ```
- Тело PR — по шаблону `.github/pull_request_template.md`: что реализовано,
  ссылка на тикет SCRUM-<N>, шаги проверки, acceptance criteria.
- **QA-ревью — вручную и только после реального end-to-end тестирования.**
  GitHub не даёт назначить автора PR его же ревьюером (`--reviewer <ты>` тихо
  игнорируется, когда ты и автор). Поэтому «историю ревью» фиксируем self-review:
  ```bash
  # после того как фича реально протестирована:
  gh pr review <N> --approve  -b "QA passed: <что проверено>"
  # или, если нашлись проблемы:
  gh pr review <N> --request-changes -b "<что не так, шаги воспроизведения>"
  ```
  Плюс отмечаем QA-чекбокс в теле PR. Это запись о проведённой проверке, а не
  формальность — не аппрувим PR, пока фича не протестирована.
- После мержа: `git checkout main && git pull`, затем `git branch -d <branch>`.

## Конвенции кода

- API-вызовы с фронта — через `apiClient` из `@/lib/api` (`apiClient.get/post/put/delete`), не голый `fetch`.
- NextAuth-типы дополняются в `types/next-auth.d.ts` (module augmentation через `import type`). **Не** переноси `declare module "next-auth"` в глобальный `typings.d.ts` — там он затирает экспорты next-auth и ломает `npm run build`.
- Route-файлы App Router (`app/**/route.ts`) экспортируют только HTTP-хендлеры; конфиги (напр. `authOptions`) держи в отдельных модулях.
- В `page.tsx` под Next.js 15 `params`/`searchParams` — это `Promise<...>`.
