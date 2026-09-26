# Code Style

Правила, по которым написан проект. Любой новый код и любые правки должны им следовать.
Если файл, который ты правишь, от них отклоняется, приведи к правилам только те строки, которые меняешь. Весь файл не переформатируй.

## Стек

- Next.js 16 (App Router) — API отличается от привычного, перед работой читай `node_modules/next/dist/docs/` (см. `AGENTS.md`)
- React 19, TypeScript (`strict`)
- Supabase (`@supabase/ssr`)
- SCSS Modules + CSS-токены
- ESLint: `eslint-config-next` (core-web-vitals + typescript)

## Архитектура — Feature-Sliced Design

```
app/                  # только роутинг Next.js: page.tsx, layout.tsx, route.ts
src/
  app/styles/         # глобальные стили
  pages/<page>/       # страницы
  features/<feature>/ # фичи: api/, lib/, ui/
  shared/             # api/, lib/, types/, ui-kit/
proxy.ts              # proxy (бывший middleware) Next.js
```

- Корневая папка `app/` не содержит логики. Файлы в ней — однострочные реэкспорты из `src/`:
  ```ts
  export { LoginPage as default } from '@/pages/login';
  export { authCallbackHandler as GET } from '@/features/auth/server';
  ```
- Слои импортируют только нижележащие слои: `pages → features → shared`.
- Каждый слайс и сегмент отдаёт наружу публичный API через `index.ts`. Снаружи импортируй только из него (`@/features/auth`, `@/shared/api`, `@/shared/types`), не из внутренних файлов.
- Серверный публичный API фичи лежит в отдельном `server.ts` (`@/features/auth/server`), чтобы серверный код не попадал в клиентский бандл.
- Структуру папок определяет автор проекта. Повторяй раскладку соседних слайсов и не реорганизуй существующую без просьбы.
- Части, которые нужны только одной странице, лежат рядом с ней: `src/pages/login/login-form/`.

## Файлы и именование

| Что | Как | Пример |
|---|---|---|
| Файлы и папки | kebab-case | `get-auth-error-message.ts`, `magic-link-sent.tsx` |
| Компонент или модуль в своей папке | `index.tsx` / `index.ts` | `src/pages/login/index.tsx` |
| Стили компонента | `styles.module.scss` рядом | `login-form/styles.module.scss` |
| Локальные типы и константы компонента | `lib.ts` рядом | `register-form/lib.ts` |
| Компоненты | PascalCase | `LoginForm`, `AuthLayout` |
| Функции и переменные | camelCase | `sendOtp`, `updateSession` |
| Константы-значения | UPPER_SNAKE_CASE | `INITIAL_DATA` |
| Типы | PascalCase | `FormStatus`, `UserProfile` |
| Пропсы | `<Component>Props` | `AuthLayoutProps` |
| Параметры функции | `<Function>Params` | `SendOtpParams` |
| Обработчики | `handle<Event>` | `handleSubmit`, `handleReset` |
| Колбэки в пропсах | `on<Event>` | `onReset` |
| Булевы | `is*` / `show*` / `should*` | `isLoading`, `showLogo`, `shouldCreateUser` |
| Страницы | `<Name>Page` | `LoginPage`, `HomePage` |

Поля, которые приходят из БД, остаются в snake_case (`first_name`, `created_at`). В UI-состоянии используется camelCase (`firstName`). Маппинг между ними делается явно на границе.

## TypeScript

- Для типов используй `type`, а не `interface`.
- Типы, которые импортируются только как типы, помечай `type`: `import type { FormStatus } from '@/shared/types'` или `import { useState, type FormEvent } from 'react'`.
- Реэкспорт типов: `export type { UserRole, UserProfile } from './user';`.
- Строковые union-типы вместо enum: `type FormStatus = 'idle' | 'loading' | 'success' | 'error'`.
- Общие типы хранятся в `src/shared/types/<domain>.ts` и реэкспортируются из `index.ts`.
- Возвращаемый тип указывай только тогда, когда он не выводится очевидно: `Promise<UserProfile | null>`.
- Non-null `!` допустим только для env-переменных (`process.env.NEXT_PUBLIC_SUPABASE_URL!`).

## Функции и экспорты

- **Только стрелочные функции.** Ключевое слово `function` не используется нигде: ни в компонентах, ни в хендлерах, ни в методах объектов.
  ```ts
  export const getAuthErrorMessage = (message: string, fallback: string) => { ... };
  getAll: () => request.cookies.getAll(),
  ```
- **Только именованные экспорты.** `export default` запрещён в `src/`. Исключение — файлы корневого `app/`, где этого требует Next: там пиши `export { X as default } from ...`. Единственное место с объявлением и `export default` — `app/layout.tsx`.
- Если тело функции — одно выражение, пиши его без фигурных скобок и `return`:
  ```tsx
  export const LoginPage = () => (
      <AuthLayout ...>
          <LoginForm />
      </AuthLayout>
  );
  ```
- Аргументы-объекты деструктурируй прямо в сигнатуре: `({ email, shouldCreateUser, userData }: SendOtpParams)`.
- Пиши декларативно: `map`/`filter`/`some`/`forEach` вместо циклов, без лишних мутаций.
- Используй ранние возвраты (guard clauses) вместо вложенных `if/else`:
  ```ts
  if (!code) {
      return NextResponse.redirect(`${origin}/login?error=missing_code`);
  }
  ```
  Однострочный `if (!user) return null;` допустим для короткого guard.
- Используй `??` для значений по умолчанию и шаблонные строки для URL.
- Условные поля объекта: `...(userData ? { data: userData } : {})`.
- Если импортируемое имя конфликтует или неясно, переименуй его алиасом: `import { createClient as createServerClient } from '@/shared/api/supabase/server'`. В `shared/api` клиенты экспортируются как `createBrowserClient` / `createServerClient`.

## React-компоненты

- Порядок внутри компонента:
  1. хуки состояния (`useState`, ...)
  2. хендлеры (`handleSubmit`, фабрики вроде `updateField(field)`)
  3. ранние `return` для альтернативных состояний (`if (status === 'success') return <MagicLinkSent ... />`)
  4. производные значения (`const isLoading = status === 'loading'`)
  5. основной `return` JSX
- Пропсы типизируются через `type <Component>Props` над компонентом и деструктурируются в сигнатуре.
- `'use client'` ставится первой строкой, если нужны хуки или браузерные API. Всё остальное по умолчанию остаётся серверными компонентами (в том числе `async`-компоненты: `export const HomePage = async () => ...`).
- Состояние формы описывается через `FormStatus` (`idle → loading → success | error`) плюс отдельный `errorMessage`.
- Условный рендер пиши через `&&`: `{errorMessage && <p className={styles.error}>{errorMessage}</p>}`.
- Смысловые блоки JSX (поля, ошибка, кнопка, ссылка) разделяй пустой строкой.
- Если у элемента больше 2–3 атрибутов, пиши каждый атрибут на своей строке. `className` ставь последним.
- У кнопок всегда явный `type` (`"submit"` / `"button"`).
- Для атрибутов JSX используй двойные кавычки (`type="email"`), для строк в TS — одинарные.

## Форматирование

- Отступ 4 пробела (в TS/TSX и SCSS).
- Одинарные кавычки в TS/TSX. Двойные кавычки используются только в атрибутах JSX.
- Точка с запятой в конце выражений.
- Пробелы внутри фигурных скобок: `import { useState } from 'react'`, `const { error } = ...`.
- Trailing comma в многострочных объектах, массивах и аргументах.
- Файл заканчивается переводом строки.

## Импорты

Порядок групп:

1. `react`
2. `next/*`
3. внешние пакеты (`@supabase/ssr`, `date-fns`, `lucide-react`, ...)
4. `@/features/*`
5. `@/shared/*`
6. относительные (`./lib`, `./login-form`)
7. стили (`import styles from './styles.module.scss'`) — последними

Внутри `src/` для кросс-слайсовых импортов используй алиас `@/*` (он указывает на `src/*`), для файлов своего слайса — относительные пути.

## Стили (SCSS)

- Используй CSS Modules: `styles.module.scss` рядом с компонентом, импорт `import styles from './styles.module.scss'`, классы вида `className={styles.form}`.
- Имена классов пиши в camelCase: `.successTitle`, `.linkButton`.
- Каждый модуль начинается с `@use '@/shared/ui-kit/styles' as *;`, чтобы подключить миксины.
- Все значения берутся из токенов `src/shared/ui-kit/styles/tokens.scss`: `var(--color-*)`, `var(--space-*)`, `var(--font-size-*)`, `var(--radius-*)`, `var(--border-thin)`, `var(--transition-fast)`. Хардкод px и цветов не используй. Если нужного токена нет, добавь его в `tokens.scss`.
- Для типографики используй миксины `text-display`, `text-title`, `text-subtitle`, `text-body`, `text-secondary`, `text-caption` вместо ручного набора `font-size` + `line-height`.
- Для кнопок используй `@include reset-button`, для disabled-состояния — `@include disabled`.
- Сначала `@include`, затем свойства, затем вложенные `&:focus`, `&::placeholder`, `&:hover` и дочерние селекторы.
- Отступы шагом 4px (`--space-1` … `--space-10`).

## Тексты и комментарии

- Все тексты UI на русском. Пользовательские ошибки переводятся через `getAuthErrorMessage(message, fallback)`, fallback обязателен.
- Комментарии пиши на русском и только там, где неочевидно *почему* (например, `// ВАЖНО: не удалять этот getUser() — он и триггерит обновление сессии`). Не комментируй то, что и так видно из кода.

## Supabase

- Браузерный клиент — `createBrowserClient` из `@/shared/api`. Серверный — `createClient as createServerClient` из `@/shared/api/supabase/server`.
- Ошибки Supabase возвращаются как `{ error }` и обрабатываются вызывающим кодом, исключения не бросаются.
- Для типизированных запросов используй дженерик: `.single<UserProfile>()`.
