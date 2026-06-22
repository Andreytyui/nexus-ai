'use server';

import { Resend } from 'resend';
import { readFileSync } from 'fs';
import path from 'path';
import type { SiteContent } from '@/types';

export type ContactResult = { ok: true } | { ok: false; error: 'not_configured' | 'invalid' | 'failed' };

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }[char] ?? char));

export async function sendContactAction(formData: FormData): Promise<ContactResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { ok: false, error: 'not_configured' };

  const name    = (formData.get('name')    as string ?? '').trim();
  const email   = (formData.get('email')   as string ?? '').trim();
  const message = (formData.get('message') as string ?? '').trim();

  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (
    name.length < 2 || name.length > 100 ||
    !validEmail || email.length > 254 ||
    message.length < 10 || message.length > 3000
  ) return { ok: false, error: 'invalid' };

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message);

  // Read recipient email from content.json
  const filePath = path.join(process.cwd(), 'src/data/content.json');
  const content: SiteContent = JSON.parse(readFileSync(filePath, 'utf-8'));
  const to = content.contact.email;

  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from:    'Portfolio <onboarding@resend.dev>',
      to:      [to],
      replyTo: email,
      subject: `[Portfolio] Mensagem de ${name.replace(/[\r\n]/g, ' ')}`,
      html: `
        <div style="font-family:sans-serif;max-width:520px;margin:0 auto;color:#1a1a2e">
          <h2 style="color:#3af0c8;margin-bottom:4px">Nova mensagem do portfólio</h2>
          <hr style="border:1px solid #eee;margin-bottom:20px"/>
          <p><strong>Nome:</strong> ${safeName}</p>
          <p><strong>Email:</strong> <a href="mailto:${safeEmail}">${safeEmail}</a></p>
          <p style="margin-top:16px"><strong>Mensagem:</strong></p>
          <p style="background:#f5f5f5;padding:16px;border-radius:8px;white-space:pre-wrap">${safeMessage}</p>
        </div>
      `,
    });
    return { ok: true };
  } catch {
    return { ok: false, error: 'failed' };
  }
}
