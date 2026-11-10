# Contact form setup

The Contact app posts to `POST /api/contact`, which emails the message to you via Gmail SMTP (nodemailer).

## 1. Configure credentials

```bash
cp env.example .env.local
```

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
# Optional — deliver to a different inbox (defaults to EMAIL_USER)
# EMAIL_TO=you@example.com
```

`EMAIL_PASS` must be a Gmail **App Password**, not your account password:
Google Account → Security → 2-Step Verification → App passwords.

On Vercel (or any host), set the same variables in the project's environment settings.

If the variables are missing, the API returns `503` with a friendly message instead of crashing.

## 2. What the endpoint does

- Validates all fields (required, max lengths, email format) and rejects malformed JSON.
- **Escapes** all user input before putting it in the HTML email, and strips line breaks from single-line fields (prevents HTML/header injection).
- **Rate-limits** to 5 messages per IP per 15 minutes (in-memory, per server instance).
- **Honeypot** field silently drops bot submissions.
- Sets `Reply-To` to the visitor, so you can answer straight from your inbox.

> The previous version also sent an automatic "thank you" email to whatever address the visitor typed.
> That let anyone use your Gmail account to send email to arbitrary people, so it has been removed.

## 3. Using another provider

Edit `getTransporter()` in `src/app/api/contact/route.ts`, e.g.:

```ts
nodemailer.createTransport({
  host: 'smtp.your-provider.com',
  port: 587,
  secure: false,
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});
```
