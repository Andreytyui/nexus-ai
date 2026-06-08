'use client';

import { useState, useTransition } from 'react';
import { saveContentAction, logoutAction } from './actions';
import type { SiteContent, Project, Skill, CvEntry, StackItem } from '@/types';
import styles from './admin.module.css';

type Tab = 'about' | 'projects' | 'skills' | 'cv' | 'contact';

export default function AdminClient({ initialContent }: { initialContent: SiteContent }) {
  const [content, setContent] = useState<SiteContent>(initialContent);
  const [tab, setTab] = useState<Tab>('about');
  const [isPending, startTransition] = useTransition();
  const [savedMsg, setSavedMsg] = useState('');

  const save = () => {
    startTransition(async () => {
      await saveContentAction(content);
      setSavedMsg('✓ Salvo');
      setTimeout(() => setSavedMsg(''), 2500);
    });
  };

  const set = <K extends keyof SiteContent>(key: K, val: SiteContent[K]) =>
    setContent((c) => ({ ...c, [key]: val }));

  const TABS: { id: Tab; label: string }[] = [
    { id: 'about',    label: '01 — About'    },
    { id: 'projects', label: '02 — Projects' },
    { id: 'skills',   label: '03 — Skills'   },
    { id: 'cv',       label: '05 — CV'       },
    { id: 'contact',  label: '04 — Contact'  },
  ];

  return (
    <div className={styles.admin}>
      {/* ── Top bar ── */}
      <header className={styles.topbar}>
        <span className={styles.adminLogo}>NEXUS<span>.</span>AI <em>admin</em></span>
        <div className={styles.topActions}>
          {savedMsg && <span className={styles.savedMsg}>{savedMsg}</span>}
          <button className={styles.saveBtn} onClick={save} disabled={isPending}>
            {isPending ? 'Salvando…' : 'Salvar'}
          </button>
          <form action={logoutAction}>
            <button type="submit" className={styles.logoutBtn}>Sair</button>
          </form>
        </div>
      </header>

      <div className={styles.body}>
        {/* ── Sidebar ── */}
        <nav className={styles.sidebar}>
          {TABS.map((t) => (
            <button
              key={t.id}
              className={`${styles.sideBtn} ${tab === t.id ? styles.sideBtnActive : ''}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </nav>

        {/* ── Content ── */}
        <main className={styles.main}>
          {tab === 'about'    && <AboutEditor    content={content} set={set} />}
          {tab === 'projects' && <ProjectsEditor content={content} set={set} />}
          {tab === 'skills'   && <SkillsEditor   content={content} set={set} />}
          {tab === 'cv'       && <CVEditor        content={content} set={set} />}
          {tab === 'contact'  && <ContactEditor  content={content} set={set} />}
        </main>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Helper components
───────────────────────────────────────── */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className={styles.field}>
      <label className={styles.fieldLabel}>{label}</label>
      {children}
    </div>
  );
}

function Input({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input
      className={styles.input}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  );
}

function Textarea({ value, onChange, rows = 3 }: { value: string; onChange: (v: string) => void; rows?: number }) {
  return (
    <textarea
      className={styles.textarea}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={rows}
    />
  );
}

function AddBtn({ onClick, label = '+ Adicionar' }: { onClick: () => void; label?: string }) {
  return <button type="button" className={styles.addBtn} onClick={onClick}>{label}</button>;
}

function RemoveBtn({ onClick }: { onClick: () => void }) {
  return <button type="button" className={styles.removeBtn} onClick={onClick}>×</button>;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className={styles.section}>
      <h3 className={styles.sectionTitle}>{title}</h3>
      {children}
    </section>
  );
}

/* ─────────────────────────────────────────
   About Editor
───────────────────────────────────────── */
function AboutEditor({ content, set }: { content: SiteContent; set: <K extends keyof SiteContent>(k: K, v: SiteContent[K]) => void }) {
  const a = content.about;
  const upd = (key: keyof typeof a, val: unknown) =>
    set('about', { ...a, [key]: val });

  const updateStack = (i: number, field: keyof StackItem, val: string) => {
    const s = [...a.stack];
    s[i] = { ...s[i], [field]: val };
    upd('stack', s);
  };

  return (
    <div className={styles.editorWrap}>
      <Section title="Informações pessoais">
        <Field label="Nome"><Input value={a.name} onChange={(v) => upd('name', v)} /></Field>
        <Field label="Role"><Input value={a.role} onChange={(v) => upd('role', v)} /></Field>
        <Field label="Bio"><Textarea value={a.bio} onChange={(v) => upd('bio', v)} /></Field>
        <Field label="Localização"><Input value={a.location} onChange={(v) => upd('location', v)} /></Field>
      </Section>

      <Section title="Stats">
        <div className={styles.row3}>
          <Field label="Anos de exp"><Input value={a.stats.years} onChange={(v) => upd('stats', { ...a.stats, years: v })} /></Field>
          <Field label="Projetos"><Input value={a.stats.projects} onChange={(v) => upd('stats', { ...a.stats, projects: v })} /></Field>
          <Field label="Café"><Input value={a.stats.coffee} onChange={(v) => upd('stats', { ...a.stats, coffee: v })} /></Field>
        </div>
        <Field label="Disponível para oportunidades">
          <label className={styles.toggle}>
            <input type="checkbox" checked={a.available} onChange={(e) => upd('available', e.target.checked)} />
            <span>{a.available ? 'Sim' : 'Não'}</span>
          </label>
        </Field>
      </Section>

      <Section title="Stack">
        {a.stack.map((item, i) => (
          <div key={i} className={styles.stackRow}>
            <Input value={item.label} onChange={(v) => updateStack(i, 'label', v)} placeholder="Tecnologia" />
            <div className={styles.colorWrap}>
              <input type="color" value={item.color} onChange={(e) => updateStack(i, 'color', e.target.value)} className={styles.colorPicker} />
              <span className={styles.colorHex}>{item.color}</span>
            </div>
            <RemoveBtn onClick={() => upd('stack', a.stack.filter((_, j) => j !== i))} />
          </div>
        ))}
        <AddBtn onClick={() => upd('stack', [...a.stack, { label: '', color: '#3af0c8' }])} />
      </Section>
    </div>
  );
}

/* ─────────────────────────────────────────
   Projects Editor
───────────────────────────────────────── */
function ProjectsEditor({ content, set }: { content: SiteContent; set: <K extends keyof SiteContent>(k: K, v: SiteContent[K]) => void }) {
  const projects = content.projects;

  const upd = (i: number, field: keyof Project, val: string | string[]) => {
    const p = [...projects];
    p[i] = { ...p[i], [field]: val };
    set('projects', p);
  };

  return (
    <div className={styles.editorWrap}>
      {projects.map((p, i) => (
        <Section key={p.id} title={`Projeto ${i + 1}`}>
          <div className={styles.cardHeader}>
            <span className={styles.cardIndex}>#{i + 1}</span>
            <RemoveBtn onClick={() => set('projects', projects.filter((_, j) => j !== i))} />
          </div>
          <Field label="Nome"><Input value={p.name} onChange={(v) => upd(i, 'name', v)} /></Field>
          <Field label="Descrição"><Textarea value={p.desc} onChange={(v) => upd(i, 'desc', v)} rows={2} /></Field>
          <Field label="Tags (separadas por vírgula)">
            <Input
              value={p.tags.join(', ')}
              onChange={(v) => upd(i, 'tags', v.split(',').map((t) => t.trim()).filter(Boolean))}
              placeholder="Python, LLM, FastAPI"
            />
          </Field>
          <div className={styles.row2}>
            <Field label="Link do projeto (URL)">
              <Input value={p.url ?? ''} onChange={(v) => upd(i, 'url', v)} placeholder="https://..." />
            </Field>
            <Field label="Imagem (caminho em /public)">
              <Input value={p.image ?? ''} onChange={(v) => upd(i, 'image', v)} placeholder="/projects/foto.png" />
            </Field>
          </div>
        </Section>
      ))}
      <AddBtn
        label="+ Novo projeto"
        onClick={() =>
          set('projects', [
            ...projects,
            { id: `p${Date.now()}`, name: '', desc: '', tags: [], grad: '' },
          ])
        }
      />
    </div>
  );
}

/* ─────────────────────────────────────────
   Skills Editor
───────────────────────────────────────── */
function SkillsEditor({ content, set }: { content: SiteContent; set: <K extends keyof SiteContent>(k: K, v: SiteContent[K]) => void }) {
  const skills = content.skills;

  const upd = (i: number, field: keyof Skill, val: string | number) => {
    const s = [...skills];
    s[i] = { ...s[i], [field]: val };
    set('skills', s);
  };

  return (
    <div className={styles.editorWrap}>
      <Section title="Habilidades">
        {skills.map((s, i) => (
          <div key={i} className={styles.skillRow}>
            <Input value={s.name} onChange={(v) => upd(i, 'name', v)} placeholder="Habilidade" />
            <div className={styles.pctWrap}>
              <input
                type="range" min={0} max={100}
                value={s.pct}
                onChange={(e) => upd(i, 'pct', Number(e.target.value))}
                className={styles.range}
              />
              <span className={styles.pctLabel}>{s.pct}%</span>
            </div>
            <RemoveBtn onClick={() => set('skills', skills.filter((_, j) => j !== i))} />
          </div>
        ))}
        <AddBtn onClick={() => set('skills', [...skills, { name: '', pct: 80 }])} />
      </Section>
    </div>
  );
}

/* ─────────────────────────────────────────
   CV Editor
───────────────────────────────────────── */
function CVEditor({ content, set }: { content: SiteContent; set: <K extends keyof SiteContent>(k: K, v: SiteContent[K]) => void }) {
  const cv = content.cv;

  const updEntry = (
    list: 'experience' | 'education',
    i: number,
    field: keyof CvEntry,
    val: string
  ) => {
    const arr = [...cv[list]];
    arr[i] = { ...arr[i], [field]: val };
    set('cv', { ...cv, [list]: arr });
  };

  const addEntry = (list: 'experience' | 'education') =>
    set('cv', { ...cv, [list]: [...cv[list], { role: '', company: '', period: '', desc: '' }] });

  const removeEntry = (list: 'experience' | 'education', i: number) =>
    set('cv', { ...cv, [list]: cv[list].filter((_, j) => j !== i) });

  return (
    <div className={styles.editorWrap}>
      <Section title="Experiência">
        {cv.experience.map((e, i) => (
          <div key={i} className={styles.entryBlock}>
            <div className={styles.cardHeader}>
              <span className={styles.cardIndex}>#{i + 1}</span>
              <RemoveBtn onClick={() => removeEntry('experience', i)} />
            </div>
            <div className={styles.row2}>
              <Field label="Cargo"><Input value={e.role} onChange={(v) => updEntry('experience', i, 'role', v)} /></Field>
              <Field label="Período"><Input value={e.period} onChange={(v) => updEntry('experience', i, 'period', v)} placeholder="2023 — Present" /></Field>
            </div>
            <Field label="Empresa"><Input value={e.company} onChange={(v) => updEntry('experience', i, 'company', v)} /></Field>
            <Field label="Descrição"><Textarea value={e.desc ?? ''} onChange={(v) => updEntry('experience', i, 'desc', v)} rows={2} /></Field>
          </div>
        ))}
        <AddBtn label="+ Experiência" onClick={() => addEntry('experience')} />
      </Section>

      <Section title="Educação">
        {cv.education.map((e, i) => (
          <div key={i} className={styles.entryBlock}>
            <div className={styles.cardHeader}>
              <span className={styles.cardIndex}>#{i + 1}</span>
              <RemoveBtn onClick={() => removeEntry('education', i)} />
            </div>
            <div className={styles.row2}>
              <Field label="Curso / Título"><Input value={e.role} onChange={(v) => updEntry('education', i, 'role', v)} /></Field>
              <Field label="Período"><Input value={e.period} onChange={(v) => updEntry('education', i, 'period', v)} /></Field>
            </div>
            <Field label="Instituição"><Input value={e.company} onChange={(v) => updEntry('education', i, 'company', v)} /></Field>
          </div>
        ))}
        <AddBtn label="+ Educação" onClick={() => addEntry('education')} />
      </Section>

      <Section title="Link do CV">
        <Field label="URL do PDF">
          <Input value={cv.cvUrl} onChange={(v) => set('cv', { ...cv, cvUrl: v })} placeholder="https://..." />
        </Field>
      </Section>
    </div>
  );
}

/* ─────────────────────────────────────────
   Contact Editor
───────────────────────────────────────── */
function ContactEditor({ content, set }: { content: SiteContent; set: <K extends keyof SiteContent>(k: K, v: SiteContent[K]) => void }) {
  const c = content.contact;
  return (
    <div className={styles.editorWrap}>
      <Section title="Contato">
        <Field label="Título (use \\n para quebra de linha)">
          <Textarea value={c.title} onChange={(v) => set('contact', { ...c, title: v })} rows={2} />
        </Field>
        <Field label="E-mail">
          <Input value={c.email} onChange={(v) => set('contact', { ...c, email: v })} placeholder="seu@email.com" />
        </Field>
      </Section>
    </div>
  );
}
