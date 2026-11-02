# План переноса сайта за прокси на VPS

Пошаговый план по `docs/handoff.md`, сверенный с кодом проекта. Почти всё, что нужно поменять в приложении, касается входа по email-ссылке. Других мест, которые зависят от адреса сайта, в коде нет.

Обозначения: `YOUR_IP` — IP VPS (`82.47.160.126`), `real-app.vercel.app` — production-домен проекта на Vercel (`studio-dance-app.vercel.app`, проект `studio-dance`; **не** `studio-app.vercel.app` — это чужой сайт).

## Статус

| Этап | Статус |
|---|---|
| 0. Продление IP-сертификата | ⚠️ dry-run прошёл, реальное продление ждём 4 ноября (проверить `certbot certificates`) |
| 1. Проект на Vercel | ✅ |
| 2. nginx → `studio-dance-app.vercel.app` | ✅ 2026-11-03, бэкап старого конфига в `/root/proxy.bak` |
| 3. `NEXT_PUBLIC_SITE_URL` в Vercel | ❌ |
| 4. Код | ✅ написан, не задеплоен |
| 5. Supabase Dashboard | ❌ |
| 6. Деплой и проверка | ❌ |

---

## Этап 0. Срочно: продление IP-сертификата (на VPS)

Сертификат живёт около 6 дней, и автопродление ни разу не проверялось.

```bash
certbot certificates                 # посмотреть дату окончания
certbot renew --dry-run
systemctl list-timers | grep certbot
```

Если `renew` падает, скорее всего закрыт порт 80: проверьте `ufw status` и фаервол в панели провайдера.

## Этап 1. Подготовить проект на Vercel

1. Settings → Domains: выписать production-домен вида `real-app.vercel.app`. URL конкретного деплоя (`real-app-abc123.vercel.app`) не подойдёт.
2. Settings → Deployment Protection: production-домен должен быть публичным. Проверка: в окне инкогнито открывается сайт, а не страница логина Vercel.
3. Firewall: выключить Attack Challenge Mode и bot protection.
4. Свой домен в Domains проекта **не добавлять**, иначе возможен цикл редиректов.

## Этап 2. Переключить nginx на реальное приложение (на VPS)

В `/etc/nginx/sites-available/proxy` поменять две строки:

```nginx
set $vercel real-app.vercel.app;
proxy_redirect https://real-app.vercel.app/ https://$host/;
```

Применить и сбросить кэш:

```bash
nginx -t && systemctl reload nginx
rm -rf /var/cache/nginx/vercel/* && systemctl reload nginx
curl -I https://YOUR_IP
```

После этого сайт откроется по `https://YOUR_IP`, но вход пока работать не будет, пока не сделаны этапы 3 и 4.

Заголовки `X-Proxy-Client-IP` и `X-Proxy-Secret` пока не нужны: в коде нет ни rate limiting, ни логирования IP.

## Этап 3. Переменные окружения

1. Vercel → Production: `NEXT_PUBLIC_SITE_URL=https://YOUR_IP`.
2. `.env.local`: `NEXT_PUBLIC_SITE_URL=http://localhost:3000`.
3. `NEXT_PUBLIC_*` вшиваются при сборке, поэтому после любого изменения нужен передеплой.

## Этап 4. Изменения в коде

Сделано:

| # | Файл | Что было | Что сделано |
|---|---|---|---|
| 1 | `src/shared/lib/site-url/index.ts` | — | `SITE_URL` и `getSiteUrl(path)` от `NEXT_PUBLIC_SITE_URL`. Все абсолютные URL строятся только через них. |
| 2 | `next.config.ts` | `allowedOrigins` не задан | `experimental.serverActions.allowedOrigins` = хост из `NEXT_PUBLIC_SITE_URL`. Без этого Server Actions падают с «Invalid Server Actions request». При смене на домен достаточно поменять env. |
| 3 | `src/features/auth/api/send-otp.ts` | Ссылка отправлялась **из браузера**, браузер ходил на `supabase.co` | Server Action на серверном клиенте, `emailRedirectTo: <SITE_URL>/auth/callback`. Возвращает `{ ok } \| { ok: false, error: SendOtpError }`. Теперь браузер вообще не ходит на `supabase.co` (вариант A из `handoff.md`). |
| 4 | `src/features/auth/lib.ts`, формы входа и регистрации | `getAuthErrorMessage(message, fallback)` | Коды `SendOtpError` + `getAuthErrorMessage(error, fallback)`, сетевая ошибка ловится через `.catch`. |
| 5 | `src/features/auth/api/callback/index.ts` | `exchangeCodeForSession` + `request.nextUrl.origin` (`vercel.app`) | Путь остался `/auth/callback`. Принимает и `token_hash` (`verifyOtp`, новый шаблон письма), и `code` (стандартный шаблон), так что порядок деплоя и смены шаблона не важен. Редиректы через `getSiteUrl`, `next` проверяется от open redirect. |
| 6 | `src/shared/api/supabase/proxy.ts` | `redirectTo` клонировал `request.nextUrl` | Редирект через `getSiteUrl`. |
| 7 | `app/layout.tsx` | нет `metadataBase` | `metadataBase: new URL(SITE_URL)` |

`NEXT_PUBLIC_SITE_URL` обязателен при сборке: без него `new URL(SITE_URL)` в layout уронит билд. Его нужно задать для Production и Preview в Vercel и в `.env.local`.

Здесь всё уже в порядке:

- cookies (`role-cookie`, Supabase) не задают `domain`;
- `logout` редиректит относительно;
- шрифт `next/font/google` вшивается в сборку, так что Google браузер не запрашивает;
- Storage и realtime не используются.

## Этап 5. Supabase Dashboard

1. Authentication → URL Configuration:
   - Site URL: `https://YOUR_IP`;
   - Redirect URLs: `https://YOUR_IP/**`, `http://localhost:3000/**`, а `vercel.app` убрать.
2. Email Templates → Magic Link (и Confirm signup, если регистрация шлёт его):

   ```html
   <a href="{{ .RedirectTo }}?token_hash={{ .TokenHash }}&type=email">Войти</a>
   ```

   `{{ .RedirectTo }}` — это `emailRedirectTo` из кода (`<SITE_URL>/auth/callback`), поэтому один шаблон работает и в проде, и локально.

3. SMTP Settings: подключить свой SMTP с хорошей доставкой в Яндекс и Mail.ru. Встроенный отправитель Supabase только для тестов.

Шаблоны писем меняйте одновременно с деплоем этапа 4: старый код ждёт `code`, новый ждёт `token_hash`.

## Этап 6. Деплой и проверка

Пуш в main, затем проверка с мобильного интернета РФ без VPN, желательно на нескольких операторах:

1. Все страницы и картинки открываются по `https://YOUR_IP`.
2. Письмо со ссылкой приходит, в том числе на Яндекс и Mail.ru.
3. Клик по ссылке ведёт на `https://YOUR_IP/auth/callback?token_hash=...`, вход выполняется, в адресной строке не появляются `vercel.app` или `supabase.co`.
4. Запись на занятие, выход и другие Server Actions работают.
5. В DevTools → Network нет запросов к `vercel.app` и `supabase.co`.

После этого удалить тестовый проект `hello-vercel` на Vercel.

## Этап 7. Домен (лучше не откладывать надолго)

Сайт будет работать по IP, но домен стоит подключить до того, как вы позовёте реальных пользователей:

- IP-сертификат живёт 6 дней, и любой сбой продления кладёт сайт;
- у PWA (serwist) origin — это адрес сайта. Если пользователи установят приложение по IP, после перехода на домен им придётся ставить его заново.

Шаги из раздела 4 `handoff.md`:

1. DNS: `A @` и `A www` указывают на IP VPS.
2. `certbot certonly` для домена.
3. Перенастроить nginx: `server_name`, редиректы с www и с голого IP.
4. Удалить IP-сертификат.
5. Везде, где стоит `YOUR_IP`, поставить домен: `NEXT_PUBLIC_SITE_URL` и передеплой (`allowedOrigins` подтянется из него сам), Site URL и Redirect URLs в Supabase.
6. Пройти проверку из этапа 6 заново.

## Этап 8 (по желанию). Закрыть прямой доступ к vercel.app

Если важна индексация: добавить в nginx `X-Proxy-Secret`, а в `proxy.ts` пускать только запросы с правильным секретом. Остальные редиректить на `NEXT_PUBLIC_SITE_URL`.

---

**Риск, который не решается переносом:** в режиме белых списков мобильного интернета небольшой сайт будет недоступен независимо от хостинга.
