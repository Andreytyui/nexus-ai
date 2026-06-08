'use client';

import { useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { sendContactAction } from '@/app/actions/contact';
import type { SiteContent } from '@/types';
import styles from './PanelContact.module.css';

interface Props {
  isActive: boolean;
  onClose: () => void;
  contact: SiteContent['contact'];
}

type Status = 'idle' | 'sending' | 'sent' | 'error';

export default function PanelContact({ isActive, onClose, contact }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);
  const formRef  = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<Status>('idle');

  useGSAP(() => {
    if (!panelRef.current) return;
    if (isActive) {
      gsap.fromTo(
        panelRef.current,
        { y: 28, scale: 0.97, opacity: 0, pointerEvents: 'none' },
        { y: 0, scale: 1, opacity: 1, pointerEvents: 'all', duration: 0.65, ease: 'power3.out' }
      );
    } else {
      gsap.to(panelRef.current, { opacity: 0, scale: 0.97, y: 16, pointerEvents: 'none', duration: 0.35, ease: 'power2.in' });
    }
  }, [isActive]);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === 'sending') return;
    setStatus('sending');

    const formData = new FormData(e.currentTarget);
    const result   = await sendContactAction(formData);

    if (result.ok) {
      setStatus('sent');
      formRef.current?.reset();
      setTimeout(() => setStatus('idle'), 5000);
    } else {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 4000);
    }
  };

  const titleLines = contact.title.split('\n');

  return (
    <div ref={panelRef} className={styles.panel}>
      <div className={styles.inner}>
        <button className={styles.close} onClick={onClose}>×</button>
        <div className={styles.tag}>// 04 — Contato</div>
        <h2 className={styles.title}>
          {titleLines.map((line, i) => (
            <span key={i}>{line}{i < titleLines.length - 1 && <br />}</span>
          ))}
        </h2>

        <form ref={formRef} className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label}>Nome</label>
            <input name="name" className={styles.input} type="text" placeholder="Seu nome" required />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Email</label>
            <input name="email" className={styles.input} type="email" placeholder="seu@email.com" required />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Mensagem</label>
            <textarea name="message" className={styles.textarea} placeholder="Me conte sobre seu projeto..." required />
          </div>

          <button className={styles.submit} type="submit" disabled={status === 'sending' || status === 'sent'}>
            {status === 'sending' && '[ Enviando… ]'}
            {status === 'sent'    && '[ Mensagem enviada ✓ ]'}
            {status === 'error'   && '[ Erro ao enviar — tente novamente ]'}
            {status === 'idle'    && '[ Enviar mensagem ]'}
          </button>
        </form>
      </div>
    </div>
  );
}
