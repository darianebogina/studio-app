# Handoff: прокси для Vercel-приложения, доступный из России без VPN

## Цель

Сайты на Vercel нестабильно открываются из России без VPN (особенно с мобильного интернета). Решение — свой VPS с nginx, который проксирует запросы на Vercel. Пользователи из РФ ходят на IP/домен VPS, VPS ходит на Vercel.

```
Пользователь (РФ) → https://<IP VPS, позже домен> → nginx на VPS (Нидерланды) → https://<project>.vercel.app
```

## Текущий статус

| Что | Статус |
|---|---|
| VPS в Нидерландах, Ubuntu 24.04, 1 ГБ RAM | ✅ работает |
| nginx как reverse proxy на Vercel | ✅ работает |
| HTTPS по IP (сертификат Let's Encrypt на IP, профиль shortlived, ~6 дней) | ✅ работает |
| Тестовое приложение Hello World (Next.js) на Vercel | ✅ открывается через прокси — **больше не нужно, можно удалить** |
| Автопродление IP-сертификата | ⚠️ настроено, но **не проверено на практике** |
| Переключение прокси на реальное приложение | ❌ следующий шаг |
| Адаптация кода реального приложения (Next.js + Supabase, вход по email-ссылке) | ❌ следующий шаг |
| Домен | ❌ не настроен — **можно сделать в любой момент**, см. раздел 4 |

### Уточнить у владельца (не зафиксировано в чате)

- IP VPS, провайдер, доступ по SSH.
- Доступ к аккаунту Vercel и к проекту реального приложения в Vercel и Supabase, доступ к репозиторию.
- Были ли выполнены необязательные шаги: swap, `PasswordAuthentication no`, unattended-upgrades.

Обозначения ниже: `YOUR_IP` — IP VPS, `real-app.vercel.app` — production-домен реального проекта на Vercel, `example.ru` — будущий домен.

---

## Что уже сделано на VPS

### Пакеты и базовая настройка

```bash
apt update && apt upgrade -y
apt install -y nginx ufw unattended-upgrades
ufw allow OpenSSH && ufw allow 'Nginx Full' && ufw enable
```

### Certbot

Версия из apt слишком старая для сертификатов на IP, поэтому стоит snap-версия (нужна ≥ 5.4):

```bash
apt remove -y certbot
snap install --classic certbot
ln -sf /snap/bin/certbot /usr/bin/certbot
```

Сертификат на IP (аккаунт Let's Encrypt зарегистрирован **без email** — уведомлений не будет):

```bash
mkdir -p /var/www/certbot
certbot certonly --preferred-profile shortlived \
  --webroot -w /var/www/certbot \
  --ip-address YOUR_IP \
  --deploy-hook "systemctl reload nginx"
```

Файлы: `/etc/letsencrypt/live/YOUR_IP/`. Продление — systemd-таймер snap-версии certbot.

### Кэш nginx

`/etc/nginx/conf.d/cache.conf`:

```nginx
proxy_cache_path /var/cache/nginx/vercel levels=1:2 keys_zone=vercel:10m
                 max_size=1g inactive=7d use_temp_path=off;
```

Каталог создан вручную (в пакете Ubuntu его нет):

```bash
mkdir -p /var/cache/nginx/vercel
chown -R www-data:www-data /var/cache/nginx
```

### Конфиг сайта

`/etc/nginx/sites-available/proxy` (симлинк в `sites-enabled`, `default` удалён). Сейчас указывает на тестовое приложение:

```nginx
# HTTP: ACME challenge для продления + редирект на HTTPS
server {
    listen 80 default_server;
    server_name _;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 301 https://$host$request_uri;
    }
}

# HTTPS прокси на Vercel
server {
    listen 443 ssl http2 default_server;
    server_name _;

    ssl_certificate     /etc/letsencrypt/live/YOUR_IP/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/YOUR_IP/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 1d;

    # IP Vercel меняются — резолвим динамически
    resolver 1.1.1.1 8.8.8.8 valid=300s ipv6=off;
    resolver_timeout 5s;
    set $vercel hello-vercel.vercel.app;          # ← ПОМЕНЯТЬ (раздел 1)

    client_max_body_size 20m;

    proxy_http_version 1.1;
    proxy_set_header Connection "";
    proxy_set_header Host $vercel;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto https;
    proxy_set_header X-Forwarded-Host $host;
    proxy_ssl_server_name on;
    proxy_ssl_name $vercel;
    proxy_connect_timeout 10s;
    proxy_read_timeout 60s;

    proxy_redirect https://hello-vercel.vercel.app/ https://$host/;   # ← ПОМЕНЯТЬ (раздел 1)

    location /_next/static/ {
        proxy_pass https://$vercel;
        proxy_cache vercel;
        proxy_cache_valid 200 30d;
        proxy_cache_lock on;
        proxy_cache_use_stale error timeout updating http_500 http_502 http_503 http_504;
        add_header X-Cache-Status $upstream_cache_status;
    }

    location /_next/image {
        proxy_pass https://$vercel;
        proxy_cache vercel;
        proxy_cache_valid 200 1d;
        proxy_cache_lock on;
        proxy_cache_use_stale error timeout updating http_500 http_502 http_503 http_504;
        add_header X-Cache-Status $upstream_cache_status;
    }

    location / {
        proxy_pass https://$vercel;
    }
}
```

Точное имя тестового проекта в `$vercel` — посмотреть в текущем конфиге на сервере.

---

## Что делать дальше

### 0. Проверить продление IP-сертификата (срочно — он живёт ~6 дней)

```bash
certbot certificates          # дата окончания должна сдвигаться вперёд
certbot renew --dry-run
systemctl list-timers | grep certbot
```

Если сертификат истёк — запустить `certbot renew` вручную и смотреть ошибку. Частая причина — закрыт порт 80 (ufw или фаервол в панели провайдера).

---

### 1. Переключить прокси на реальное приложение

#### 1.1. Подготовить проект на Vercel

1. Найти **production-домен** реального проекта: Vercel → проект → Settings → Domains, вид `real-app.vercel.app` или `real-app-<team>.vercel.app`.
   **Не использовать** длинный URL конкретного деплоя (`real-app-abc123xyz.vercel.app`) — такие обычно закрыты Vercel Authentication, и прокси получит страницу логина.
2. Settings → Deployment Protection: production-домен должен быть публичным. Проверить: открыть `https://real-app.vercel.app` в окне инкогнито — должен открыться сайт, а не логин Vercel.
3. Firewall: выключить Attack Challenge Mode и bot protection. Весь трафик теперь идёт с одного IP прокси, Vercel может начать показывать ему челлендж.
4. Домены пользователя в Domains проекта **не добавлять**.

#### 1.2. Поменять конфиг nginx

В `/etc/nginx/sites-available/proxy` поменять ровно две строки:

```nginx
set $vercel real-app.vercel.app;
proxy_redirect https://real-app.vercel.app/ https://$host/;
```

Рекомендуется заодно (см. раздел 2.4 про IP посетителя) добавить свой заголовок с IP клиента и секретом — рядом с остальными `proxy_set_header`:

```nginx
proxy_set_header X-Proxy-Client-IP $remote_addr;
proxy_set_header X-Proxy-Secret "<длинная случайная строка>";
```

Если приложение отдаёт стриминговые ответы (SSE, стриминг ответов AI) или долгие запросы — добавить отдельный location под эти пути:

```nginx
location /api/stream/ {            # путь подставить свой
    proxy_pass https://$vercel;
    proxy_buffering off;
    proxy_read_timeout 300s;
}
```

Если есть загрузка файлов больше 20 МБ через приложение — увеличить `client_max_body_size`.

Применить и сбросить кэш тестового приложения:

```bash
nginx -t && systemctl reload nginx
rm -rf /var/cache/nginx/vercel/* && systemctl reload nginx
```

#### 1.3. Проверить

```bash
curl -I https://YOUR_IP                       # 200
curl -I https://real-app.vercel.app           # с самого VPS — должен отвечать
tail -f /var/log/nginx/error.log              # при 502
```

Открыть `https://YOUR_IP` в браузере — должно открыться реальное приложение. Дальше — раздел 2, без него вход и часть функций работать не будут.

#### 1.4. Удалить тестовое приложение

Vercel → проект `hello-vercel` → Settings → Delete Project (или `vercel remove hello-vercel`). Локальную папку тоже можно удалить.

---

### 2. Что проверить и поменять в коде реального приложения

Главное, что нужно понимать: **приложение на Vercel думает, что его адрес — `real-app.vercel.app`.** Nginx передаёт `Host: real-app.vercel.app`, а Vercel, скорее всего, перезаписывает `X-Forwarded-Host`, `X-Forwarded-For` и `X-Real-IP` своими значениями. Пользователь же видит `https://YOUR_IP` (позже `https://example.ru`). Почти все проблемы — отсюда.

#### 2.1. Переменная с публичным адресом сайта

Добавить в Vercel (Production):

```bash
vercel env add NEXT_PUBLIC_SITE_URL production
# сейчас: https://YOUR_IP   (после подключения домена — https://example.ru)
```

Локально в `.env.local`: `NEXT_PUBLIC_SITE_URL=http://localhost:3000`.
`NEXT_PUBLIC_*` вшиваются при сборке — **после любого изменения передеплоить** (`vercel --prod` или пуш в main).

#### 2.2. Абсолютные URL, построенные из запроса

Найти в коде всё, что строит адрес сайта из запроса, и заменить на `process.env.NEXT_PUBLIC_SITE_URL`:

```bash
grep -rnE "request\.url|nextUrl\.origin|\.origin\b|headers\(\)|get\(['\"](host|x-forwarded-host)['\"]\)|VERCEL_URL|VERCEL_PROJECT_PRODUCTION_URL|vercel\.app" \
  --include=*.ts --include=*.tsx --include=*.js --include=*.mjs . | grep -v node_modules
```

Что искать и как чинить:

| Где | Проблема | Что сделать |
|---|---|---|
| `request.url`, `nextUrl.origin`, `headers().get("host")` | дают `real-app.vercel.app` | использовать `NEXT_PUBLIC_SITE_URL` |
| `VERCEL_URL`, `VERCEL_PROJECT_PRODUCTION_URL` | указывают на vercel.app | заменить на `NEXT_PUBLIC_SITE_URL` |
| `NextResponse.redirect(new URL("/x", request.url))` в middleware/`proxy.ts` и route handlers | редирект на vercel.app; nginx `proxy_redirect` его исправит, но лучше не полагаться | `new URL("/x", process.env.NEXT_PUBLIC_SITE_URL)` |
| ссылки в письмах, JSON, HTML, sitemap, robots.txt, canonical, Open Graph | `proxy_redirect` их **не** исправляет | только через `NEXT_PUBLIC_SITE_URL` |
| `redirects()` / `rewrites()` в `next.config` с абсолютными адресами | могут вести на vercel.app | сделать относительными или через env |

В `app/layout.tsx`:

```ts
export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL!),
};
```

#### 2.3. Server Actions — проверить обязательно

Next.js защищает Server Actions сравнением заголовка `Origin` (адрес, который видит браузер — `YOUR_IP` / `example.ru`) с хостом запроса (`real-app.vercel.app`). Через прокси они не совпадут, и все Server Actions будут падать с ошибкой вида «Invalid Server Actions request». Разрешить свои адреса в `next.config`:

```ts
// next.config.ts
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ["YOUR_IP", "example.ru"],  // домен добавить, когда появится
    },
  },
};
export default nextConfig;
```

Проверить по документации установленной версии Next.js, где сейчас находится эта опция.

#### 2.4. IP посетителя

Для приложения все запросы теперь приходят с IP VPS. Если в коде есть rate limiting, логирование IP, гео-определение (`request.ip`, `x-forwarded-for`, `x-real-ip`, `geolocation()`), то оно будет видеть один IP на всех / Нидерланды. Использовать заголовок `X-Proxy-Client-IP` из раздела 1.2, но **только если** `X-Proxy-Secret` совпадает с секретом из env (иначе любой может подделать заголовок, зайдя напрямую на vercel.app).

#### 2.5. Cookies

Не задавать `domain` у cookies — тогда они привязываются к адресу, который видит браузер, и nginx пропускает их без изменений. `@supabase/ssr` по умолчанию `domain` не ставит; проверить, нет ли своих cookies с `domain: ".vercel.app"` или подобным.

#### 2.6. Supabase: настройки дашборда

Authentication → URL Configuration:
- Site URL: `https://YOUR_IP` (после домена — `https://example.ru`).
- Redirect URLs: `https://YOUR_IP/**`, `http://localhost:3000/**` (после домена — добавить `https://example.ru/**`). Убрать `vercel.app`.

Authentication → Email Templates → Magic Link — ссылка на свой адрес, а не на `supabase.co`:

```html
<a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email">Войти</a>
```

Authentication → SMTP Settings — настроить свой SMTP до запуска для реальных пользователей: встроенный отправитель Supabase только для тестов (жёсткие лимиты, шлёт только адресам команды). Выбрать провайдера с хорошей доставкой в Яндекс и Mail.ru.

#### 2.7. Supabase: код входа

Роут `app/auth/confirm/route.ts` (если в приложении сейчас другой callback, например `/auth/callback` с `exchangeCodeForSession` — заменить на этот или привести к нему):

```ts
import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL!;

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/";
  const safeNext = next.startsWith("/") && !next.startsWith("//") ? next : "/";

  if (token_hash && type) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({ type, token_hash });
    if (!error) return NextResponse.redirect(new URL(safeNext, SITE_URL));
  }
  return NextResponse.redirect(new URL("/auth/error", SITE_URL));
}
```

Плюс страница `app/auth/error/page.tsx` («ссылка устарела, запросите новую»).

Отправку ссылки делать на сервере (server action), чтобы запрос шёл с Vercel, а не из браузера:

```ts
"use server";
import { createClient } from "@/lib/supabase/server";

export async function sendMagicLink(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/confirm` },
  });
  return { ok: !error, error: error?.message };
}
```

(Работает только после пункта 2.3.)

#### 2.8. Запросы браузера напрямую к Supabase и другим сервисам

Серверные запросы (Vercel → Supabase) блокировки в РФ не затрагивают. Но всё, что браузер пользователя грузит **не с нашего адреса**, прокси не покрывает:

- браузерный Supabase-клиент (`createBrowserClient`, клиентские запросы, realtime, `onAuthStateChange` / обновление токена);
- публичные URL файлов из Supabase Storage (`<ref>.supabase.co/storage/...`) в `<img>` и ссылках;
- сторонние скрипты, шрифты, CDN, аналитика.

В 2026 году `supabase.co` блокировали в Индии, ОАЭ и Йемене; подтверждённой блокировки в РФ не нашли, но жалобы на доступность от разработчиков из России есть.

Найти такие места:

```bash
grep -rnE "createBrowserClient|supabase\.co|storage/v1|getPublicUrl" \
  --include=*.ts --include=*.tsx . | grep -v node_modules
```

И в браузере: DevTools → Network на всех ключевых страницах — выписать все домены, кроме нашего.

Проверить доступность: открыть `https://<ref>.supabase.co/auth/v1/health` с мобильного интернета РФ без VPN (любой JSON, даже ошибка про API key = доступен). Дальше выбрать:

- **Вариант A (проще):** все обращения к Supabase только на сервере (server components / server actions / route handlers); файлы Storage отдавать через свой роут или signed URL через сервер.
- **Вариант B:** проксировать Supabase через VPS на поддомене `api.<домен>` (требует домена — см. раздел 4):
  - DNS `A api → YOUR_IP`, сертификат с `-d api.example.ru` (флаг `--expand`, если сертификат на домен уже есть);
  - `/etc/nginx/conf.d/websocket.conf`: `map $http_upgrade $connection_upgrade { default upgrade; '' close; }`;
  - server для `api.example.ru`: `set $sb <ref>.supabase.co;`, `proxy_pass https://$sb`, `Host $sb`, `proxy_ssl_server_name on`, `proxy_ssl_name $sb`, заголовки `Upgrade`/`Connection` для realtime, `proxy_read_timeout 3600s`, `proxy_buffering off`, `client_max_body_size` под Storage;
  - `NEXT_PUBLIC_SUPABASE_URL=https://api.example.ru` в Vercel. **Браузерный и серверный клиенты должны читать одну и ту же переменную** — имя auth-cookie выводится из URL, при разных URL вход молча ломается.

#### 2.9. Чек-лист после переноса

С мобильного интернета РФ без VPN, желательно у нескольких операторов:

1. Сайт открывается по `https://YOUR_IP` (позже — по домену), все страницы и картинки грузятся.
2. Запрос magic link работает, письмо приходит (в т.ч. на Яндекс/Mail.ru).
3. Ссылка в письме ведёт на наш адрес `/auth/confirm`, после клика — вход выполнен, адрес в браузере не меняется на `vercel.app` / `supabase.co`.
4. Все формы / Server Actions работают (нет «Invalid Server Actions request»).
5. DevTools → Network: нет запросов к `vercel.app`, `supabase.co` (если выбран вариант A или B) и к сторонним доменам, недоступным из РФ.
6. Просмотреть исходный код страницы: canonical и `og:url` указывают на наш адрес.

---

### 3. (Опционально) Защитить прямой доступ к vercel.app

Сейчас приложение доступно и через прокси, и напрямую по `real-app.vercel.app` — дубль сайта для поисковиков. Если важно: в middleware/`proxy.ts` пропускать только запросы с правильным `X-Proxy-Secret` (раздел 1.2), остальные — редирект на `NEXT_PUBLIC_SITE_URL`. Не трогать при этом запросы самого Vercel к служебным путям (cron, webhooks) — у них заголовка не будет.

---

### 4. Подключить домен — в любой момент

Домен **не обязателен для переноса** и может быть подключён до, во время или после разделов 1–3 (скорее всего, последним). Всё работает по `https://YOUR_IP`. Нужен домен только для: нормального адреса для пользователей, варианта B из 2.8 (поддомен `api.`), и чтобы не зависеть от 6-дневного IP-сертификата.

Шаги:

1. У регистратора: `A @ → YOUR_IP`, `A www → YOUR_IP`. Удалить дефолтные A/AAAA-записи. Проверить `dig +short example.ru`.
2. Сертификат (порт 80 уже отвечает на challenge для любого хоста), обычный 90-дневный:

   ```bash
   certbot certonly --webroot -w /var/www/certbot \
     -d example.ru -d www.example.ru \
     --deploy-hook "systemctl reload nginx"
   ```

3. Конфиг nginx:
   - порт 80: challenge + `return 301 https://example.ru$request_uri;`
   - отдельный server на 443 для `www.example.ru` (с сертификатом домена) → 301 на `https://example.ru`
   - основной server: `server_name example.ru;`, оставить `default_server`, пути к сертификату `/etc/letsencrypt/live/example.ru/`, добавить `if ($host != "example.ru") { return 301 https://example.ru$request_uri; }` (заход по голому IP редиректится на домен; браузер при этом покажет предупреждение о сертификате — это ожидаемо)
   - `proxy_redirect https://real-app.vercel.app/ https://example.ru/;`
   - остальные proxy-настройки и location — без изменений
4. `nginx -t && systemctl reload nginx`
5. Удалить IP-сертификат: `certbot certificates`, затем `certbot delete --cert-name YOUR_IP`.
6. **Обновить всё, где сейчас стоит `YOUR_IP`:**
   - Vercel: `NEXT_PUBLIC_SITE_URL=https://example.ru` → передеплоить;
   - `next.config`: добавить `example.ru` в `serverActions.allowedOrigins`;
   - Supabase: Site URL `https://example.ru`, Redirect URLs `https://example.ru/**` (IP можно убрать);
   - уже отправленные письма со ссылками на IP перестанут работать после удаления IP-сертификата — некритично, ссылки и так короткоживущие.
7. Домен в Domains проекта на Vercel **не добавлять** (иначе возможен цикл редиректов).
8. Проверить: `curl -I https://example.ru` (200), `http://` и `www` → 301 на `https://example.ru`, `certbot renew --dry-run`, затем чек-лист 2.9 заново.

---

## Известные риски

- **Белые списки мобильного интернета в РФ.** В режиме белого списка недоступен любой небольшой сайт, где бы он ни хостился; попасть в список обычному проекту практически нельзя. Выбором хостинга не решается.
- **Замедление зарубежных хостингов российскими провайдерами.** Были сообщения о том, что российские провайдеры замедляют или обрывают соединения с рядом зарубежных хостингов и CDN. Сейчас прокси работает, но если начнутся жалобы (страницы грузятся частично, крупные файлы обрываются) — проверить с разных операторов и рассмотреть смену провайдера/локации VPS.
- **IP VPS в реестре РКН.** При смене VPS проверять, не заблокирован ли IP (мог принадлежать кому-то раньше).
- **Почему VPS не в России:** прокси должен стабильно достукиваться до Vercel, а из РФ это ненадёжно. Если когда-нибудь отказываться от Vercel и хостить приложение самим — российский VPS + Dokploy/Coolify разумен, но для сборки Next.js нужно ≥ 2 ГБ RAM.

## Диагностика

- **502 Bad Gateway:** `tail -f /var/log/nginx/error.log`; `curl -I https://real-app.vercel.app` с VPS; опечатка в `$vercel`.
- **Вместо сайта — логин Vercel:** в `$vercel` указан URL деплоя, а не production-домен, или включена Deployment Protection.
- **Челлендж / 403 от Vercel:** включены Attack Challenge Mode или bot protection.
- **«Invalid Server Actions request»:** не настроен `allowedOrigins` (2.3).
- **Цикл редиректов:** домен добавлен в Domains проекта на Vercel — удалить.
- **Устаревшая статика:** `rm -rf /var/cache/nginx/vercel/* && systemctl reload nginx`.
- **certbot не проходит проверку:** порт 80 недоступен снаружи (`ufw status`, фаервол провайдера).
- **`mkdir() "/var/cache/nginx/vercel" failed`:** создать каталог и выдать права `www-data`.
