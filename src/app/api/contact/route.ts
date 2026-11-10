import { NextRequest, NextResponse } from 'next/server';
import nodemailer, { type Transporter } from 'nodemailer';

export const runtime = 'nodejs';

const LIMITS = { name: 100, email: 200, subject: 150, message: 5000 } as const;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Best-effort in-memory rate limit: 5 messages per IP per 15 minutes.
// (Per server instance — good enough to stop casual abuse on a portfolio.)
const WINDOW_MS = 15 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) {
    for (const [key, times] of hits) if (!times.some((t) => now - t < WINDOW_MS)) hits.delete(key);
  }
  return false;
}

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

/** Single-line fields must never contain line breaks (prevents header injection). */
const oneLine = (s: string) => s.replace(/[\r\n\t]+/g, ' ').trim();

let transporter: Transporter | null = null;
function getTransporter() {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return null;
  transporter ??= nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });
  return transporter;
}

const bad = (error: string, status = 400) => NextResponse.json({ error }, { status });

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown';

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return bad('Invalid request.');
  }

  // Honeypot: real visitors never fill this hidden field. Pretend success so bots learn nothing.
  if (typeof body.company === 'string' && body.company.trim() !== '') {
    return NextResponse.json({ message: 'Message sent successfully!' });
  }

  const str = (v: unknown) => (typeof v === 'string' ? v : '');
  const name = oneLine(str(body.name));
  const email = oneLine(str(body.email));
  const subject = oneLine(str(body.subject));
  const message = str(body.message).trim();

  if (!name || !email || !subject || !message) return bad('All fields are required.');
  if (
    name.length > LIMITS.name ||
    email.length > LIMITS.email ||
    subject.length > LIMITS.subject ||
    message.length > LIMITS.message
  ) {
    return bad('One of the fields is too long.');
  }
  if (!EMAIL_RE.test(email)) return bad('Please enter a valid email address.');

  if (rateLimited(ip)) return bad('Too many messages — please try again in a few minutes.', 429);

  const mailer = getTransporter();
  if (!mailer) {
    console.error('Contact form: EMAIL_USER / EMAIL_PASS are not configured.');
    return bad('The contact form is temporarily unavailable. Please email me directly.', 503);
  }

  const h = { name: escapeHtml(name), email: escapeHtml(email), subject: escapeHtml(subject), message: escapeHtml(message) };

  try {
    await mailer.sendMail({
      from: { name: 'Portfolio Contact', address: process.env.EMAIL_USER! },
      to: process.env.EMAIL_TO || process.env.EMAIL_USER,
      replyTo: { name, address: email },
      subject: `Portfolio: ${subject}`,
      text: `From: ${name} <${email}>\nSubject: ${subject}\n\n${message}\n\n— Sent from your portfolio contact form. Reply directly to respond.`,
      html: `
        <div style="font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;max-width:600px;margin:0 auto;color:#1d1d1f">
          <div style="padding:20px 24px;background:#111114;border-radius:12px 12px 0 0">
            <p style="margin:0;color:#8ab4ff;font-size:12px;letter-spacing:.08em;text-transform:uppercase">Portfolio contact</p>
            <h2 style="margin:6px 0 0;color:#fff;font-size:18px">${h.subject}</h2>
          </div>
          <div style="padding:24px;border:1px solid #e5e5ea;border-top:0;border-radius:0 0 12px 12px">
            <p style="margin:0 0 4px"><strong>${h.name}</strong></p>
            <p style="margin:0 0 20px;color:#6e6e73">${h.email}</p>
            <div style="white-space:pre-wrap;line-height:1.6">${h.message}</div>
            <p style="margin:24px 0 0;color:#86868b;font-size:12px">Reply to this email to respond directly.</p>
          </div>
        </div>`,
    });
  } catch (error) {
    console.error('Contact form send failed:', error);
    return bad('Failed to send message. Please try again later.', 502);
  }

  return NextResponse.json({ message: 'Message sent successfully!' });
}
