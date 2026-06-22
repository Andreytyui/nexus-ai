'use client';

import Image from 'next/image';
import { FormEvent, MouseEvent, useEffect, useRef, useState } from 'react';
import { ArrowDownRight, ArrowUpRight, Check, Download, Menu, Send, X } from 'lucide-react';
import type { SiteContent } from '@/types';
import { sendContactAction } from '@/app/actions/contact';
import CustomCursor from '@/components/CustomCursor/CustomCursor';
import InteractiveCharacter from '@/components/InteractiveCharacter/InteractiveCharacter';
import AboutScrollSequence from '@/components/AboutScrollSequence/AboutScrollSequence';
import ProjectsSequence from '@/components/ProjectsSequence/ProjectsSequence';
import SkillsSequence from '@/components/SkillsSequence/SkillsSequence';
import EducationSequence from '@/components/EducationSequence/EducationSequence';
import MagneticButton from '@/components/MagneticButton/MagneticButton';
import styles from './PortfolioShell.module.css';

const navigation = [
  ['projects', 'Projetos'],
  ['about', 'Sobre'],
  ['skills', 'Stack'],
  ['experience', 'Experiência'],
  ['contact', 'Contato'],
] as const;

const skillCodes = ['ML-01', 'DL-02', 'NL-03', 'CV-04', 'PY-05', 'AI-06', 'OP-07', 'CL-08'];

function SocialIcon({ label }: { label: string }) {
  if (label === 'Instagram') {
    return (
      <svg className={styles.socialIcon} viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" className={styles.socialFill} />
      </svg>
    );
  }
  if (label === 'LinkedIn') {
    return (
      <svg className={styles.socialIcon} viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="5.5" cy="6" r="1.5" className={styles.socialFill} />
        <path d="M4 9.5v10M10 19.5v-10M10 14c.7-2.8 6.5-3.4 6.5 1v4.5M16.5 19.5v-5" />
      </svg>
    );
  }
  return (
    <svg className={styles.socialIcon} viewBox="0 0 24 24" aria-hidden="true">
      <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
      <path d="m10 9 5 3-5 3Z" className={styles.socialFill} />
    </svg>
  );
}

function SectionTitle({ index, eyebrow, children }: { index: string; eyebrow: string; children: React.ReactNode }) {
  return (
    <div className={styles.sectionTitle}>
      <p><span>{index}</span>{eyebrow}</p>
      <h2>{children}</h2>
    </div>
  );
}

export default function PortfolioShell({ content }: { content: SiteContent }) {
  const heroRef = useRef<HTMLElement>(null);
  const projectsRef = useRef<HTMLElement>(null);
  const skillsRef = useRef<HTMLElement>(null);
  const educationRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [active, setActive] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  useEffect(() => {
    const reveal = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add(styles.visible);
      });
    }, { threshold: .13 });
    document.querySelectorAll(`.${styles.reveal}`).forEach((node) => reveal.observe(node));

    const sections = new IntersectionObserver((entries) => {
      const current = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (current?.target.id) setActive(current.target.id);
    }, { rootMargin: '-35% 0px -55%', threshold: [0, .2, .5] });
    document.querySelectorAll('main section[id]').forEach((node) => sections.observe(node));

    return () => {
      reveal.disconnect();
      sections.disconnect();
    };
  }, []);

  const closeMenu = () => setMenuOpen(false);

  const tilt = (event: MouseEvent<HTMLElement>) => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - .5;
    const y = (event.clientY - rect.top) / rect.height - .5;
    event.currentTarget.style.setProperty('--rx', `${-y * 2.6}deg`);
    event.currentTarget.style.setProperty('--ry', `${x * 3.4}deg`);
    event.currentTarget.style.setProperty('--mx', `${(x + .5) * 100}%`);
    event.currentTarget.style.setProperty('--my', `${(y + .5) * 100}%`);
  };

  const resetTilt = (event: MouseEvent<HTMLElement>) => {
    event.currentTarget.style.setProperty('--rx', '0deg');
    event.currentTarget.style.setProperty('--ry', '0deg');
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (formStatus === 'sending') return;
    setFormStatus('sending');
    const result = await sendContactAction(new FormData(event.currentTarget));
    if (result.ok) {
      setFormStatus('sent');
      formRef.current?.reset();
    } else {
      setFormStatus('error');
    }
  };

  return (
    <>
      <CustomCursor />
      <a className={styles.skip} href="#main">Pular para o conteúdo</a>
      <header className={styles.header}>
        <a className={styles.logo} href="#home" aria-label="NEXUS.AI — início" onClick={closeMenu}>
          NEXUS<span>.AI</span><i />
        </a>
        <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ''}`} aria-label="Navegação principal">
          {navigation.map(([id, label]) => (
            <a key={id} href={`#${id}`} className={active === id ? styles.active : ''} onClick={closeMenu}>
              {label}
            </a>
          ))}
          <a href={content.cv.cvUrl} target="_blank" rel="noreferrer" onClick={closeMenu}>Currículo <ArrowUpRight size={12} /></a>
        </nav>
        <button
          className={styles.menu}
          type="button"
          aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((value) => !value)}
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
      </header>

      <main id="main">
        <section ref={heroRef} id="home" className={styles.hero}>
          <div className={styles.heroGrid} aria-hidden="true" />
          <div className={styles.heroContent}>
            <div className={styles.availability}><span /> AVAILABLE FOR AI PROJECTS</div>
            <p className={styles.kicker}>AI Engineer · Prompt Engineer</p>
            <h1><span>Andrey</span><br />Nonardo<em>.</em></h1>
            <p className={styles.intro}>Construo sistemas que pensam. De plataformas SaaS a ferramentas financeiras, entrego produto, não apenas código.</p>
            <div className={styles.heroActions}>
              <MagneticButton href="#projects" className={styles.primaryButton}>Explorar projetos <ArrowDownRight size={18} /></MagneticButton>
              <MagneticButton href="#contact" focusTarget="#name" className={styles.secondaryButton}>Falar comigo <ArrowUpRight size={17} /></MagneticButton>
            </div>
          </div>
          <InteractiveCharacter containerRef={heroRef} />
        </section>

        <section id="about" className={`${styles.section} ${styles.about}`}>
          <div className={`${styles.reveal} ${styles.aboutLead}`}>
            <SectionTitle index="01" eyebrow="Sobre">Produto, inteligência<br />e execução.</SectionTitle>
            <p>{content.about.bio}</p>
          </div>
          <AboutScrollSequence />
          <div className={`${styles.reveal} ${styles.systemPanel}`}>
            <div className={styles.panelTop}><span>PROFILE.SYSTEM</span><span>STATUS / ONLINE</span></div>
            <dl>
              <div><dt>Cargo</dt><dd>AI Engineer</dd></div>
              <div><dt>Especialidade</dt><dd>Prompt Engineer</dd></div>
              <div><dt>Localização</dt><dd>{content.about.location}</dd></div>
              <div><dt>Disponibilidade</dt><dd className={styles.online}>Disponível para projetos</dd></div>
            </dl>
            <div className={styles.stats}>
              <div><strong>{content.about.stats.years}</strong><span>anos de experiência</span></div>
              <div><strong>{content.about.stats.projects}</strong><span>projetos entregues</span></div>
              <div><strong>open</strong><span>status / to_work</span></div>
            </div>
            <div className={styles.stackChips}>
              {content.about.stack.map((item) => <span key={item.label}>{item.label}</span>)}
            </div>
          </div>
        </section>

        <section ref={projectsRef} id="projects" className={`${styles.section} ${styles.projects}`}>
          <div className={styles.projectsHeading}>
            <div className={styles.reveal}>
              <SectionTitle index="02" eyebrow="Projetos selecionados">Sistemas reais.<br />Impacto real.</SectionTitle>
            </div>
            <ProjectsSequence sectionRef={projectsRef} />
          </div>
          <div className={styles.projectList}>
            {content.projects.map((project, index) => (
              <article
                key={project.id}
                className={`${styles.reveal} ${styles.projectCard}`}
                onMouseMove={tilt}
                onMouseLeave={resetTilt}
                data-cursor="project"
              >
                <a href={project.url} target="_blank" rel="noreferrer" aria-label={`Abrir projeto ${project.name}`}>
                  <div className={styles.projectMedia}>
                    {project.image && <Image src={project.image} alt={`Preview do ${project.name}`} fill sizes="(max-width: 800px) 100vw, 56vw" />}
                    <div className={styles.projectNumber}>0{index + 1}</div>
                  </div>
                  <div className={styles.projectBody}>
                    <div className={styles.projectMeta}><span>CASE STUDY / 2026</span><ArrowUpRight size={19} /></div>
                    <h3>{project.name}</h3>
                    <p>{project.desc}</p>
                    <div className={styles.tags}>{project.tags.map((tag) => <span key={tag}>{tag === 'IA' ? 'Inteligência Artificial' : tag}</span>)}</div>
                    <span className={styles.openProject}>Abrir projeto <ArrowUpRight size={16} /></span>
                  </div>
                </a>
              </article>
            ))}
          </div>
        </section>

        <section ref={skillsRef} id="skills" className={`${styles.section} ${styles.skills}`}>
          <div className={styles.skillsHeading}>
            <div className={styles.reveal}>
              <SectionTitle index="03" eyebrow="Stack técnica">Capacidade<br />em números.</SectionTitle>
            </div>
            <SkillsSequence sectionRef={skillsRef} />
          </div>
          <div className={styles.skillGrid}>
            {content.skills.map((skill, index) => (
              <article className={`${styles.reveal} ${styles.skill}`} key={skill.name} style={{ '--value': skill.pct } as React.CSSProperties}>
                <div className={styles.skillCode}>{skillCodes[index]}</div>
                <div className={styles.gauge}>
                  <svg viewBox="0 0 120 120" aria-hidden="true">
                    <circle cx="60" cy="60" r="49" />
                    <circle className={styles.progress} cx="60" cy="60" r="49" pathLength="100" />
                  </svg>
                  <strong>{skill.pct}<small>%</small></strong>
                </div>
                <h3>{skill.name === 'PyTorch / TF' ? 'PyTorch / TensorFlow' : skill.name}</h3>
                <div className={styles.signal}>{Array.from({ length: 8 }).map((_, i) => <i key={i} />)}</div>
              </article>
            ))}
          </div>
        </section>

        <section id="experience" className={`${styles.section} ${styles.timelineSection}`}>
          <div className={styles.reveal}>
            <SectionTitle index="04" eyebrow="Trajetória">Experiência que<br />vira produto.</SectionTitle>
          </div>
          <div className={styles.timeline}>
            {content.cv.experience.map((item) => (
              <article className={`${styles.reveal} ${styles.timelineItem}`} key={item.role}>
                <div className={styles.timelineDate}>{item.period}</div>
                <div className={styles.timelineDot} />
                <div className={styles.timelineContent}>
                  <span>{item.company}</span>
                  <h3>{item.role}</h3>
                  <p>{item.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section ref={educationRef} id="education" className={`${styles.section} ${styles.education}`}>
          <div className={styles.educationHeading}>
            <div className={styles.reveal}>
              <SectionTitle index="05" eyebrow="Formação">Base técnica.<br />Aprendizado contínuo.</SectionTitle>
            </div>
            <EducationSequence sectionRef={educationRef} />
          </div>
          <div className={styles.educationGrid}>
            {content.cv.education.map((item, index) => (
              <article className={`${styles.reveal} ${styles.educationCard}`} key={item.role}>
                <span>EDU.0{index + 1}</span>
                <h3>{item.role}</h3>
                <p>{item.company}</p>
                <time>{item.period}</time>
              </article>
            ))}
            <div className={`${styles.reveal} ${styles.cvCard}`}>
              <p>Perfil completo, experiência e formação em um único arquivo.</p>
              <MagneticButton href={content.cv.cvUrl} target="_blank" rel="noreferrer" className={styles.primaryButton}>
                Ver currículo <Download size={17} />
              </MagneticButton>
            </div>
          </div>
        </section>

        <section id="contact" className={`${styles.section} ${styles.contact}`}>
          <div className={`${styles.reveal} ${styles.contactIntro}`}>
            <p className={styles.contactCode}>READY_TO_BUILD = TRUE</p>
            <h2>Tem um projeto<br />em mente<em>?</em></h2>
            <p>Conte a ideia. Eu transformo problemas complexos em produtos digitais claros, funcionais e prontos para evoluir.</p>
            <a className={styles.emailLink} href={`mailto:${content.contact.email}`}>{content.contact.email} <ArrowUpRight size={16} /></a>
            <nav className={styles.socialLinks} aria-label="Redes sociais">
              {content.contact.socials.map((social) => {
                return (
                  <a key={social.label} href={social.url} target="_blank" rel="noopener noreferrer" aria-label={`${social.label} de Andrey Nonardo`}>
                    <SocialIcon label={social.label} />
                    <span>{social.label}</span>
                    <ArrowUpRight className={styles.socialArrow} size={13} aria-hidden="true" />
                  </a>
                );
              })}
            </nav>
          </div>
          <form ref={formRef} className={`${styles.reveal} ${styles.form}`} onSubmit={submit}>
            <div>
              <label htmlFor="name">Nome</label>
              <input id="name" name="name" autoComplete="name" minLength={2} maxLength={100} required placeholder="Como posso te chamar?" />
            </div>
            <div>
              <label htmlFor="email">E-mail</label>
              <input id="email" name="email" type="email" autoComplete="email" required placeholder="voce@empresa.com" />
            </div>
            <div>
              <label htmlFor="message">Mensagem</label>
              <textarea id="message" name="message" minLength={10} maxLength={3000} required placeholder="Me conte sobre o projeto..." />
            </div>
            <button type="submit" disabled={formStatus === 'sending' || formStatus === 'sent'}>
              {formStatus === 'sending' && <>Enviando… <span className={styles.spinner} /></>}
              {formStatus === 'sent' && <>Mensagem enviada <Check size={18} /></>}
              {formStatus === 'error' && <>Tentar novamente <Send size={17} /></>}
              {formStatus === 'idle' && <>Enviar mensagem <Send size={17} /></>}
            </button>
            <p className={styles.formFeedback} aria-live="polite">
              {formStatus === 'sent' && 'Recebi sua mensagem. Retornarei em breve.'}
              {formStatus === 'error' && 'Não foi possível enviar agora. Verifique os dados ou use o e-mail ao lado.'}
            </p>
          </form>
        </section>
      </main>

      <footer className={styles.footer}>
        <a className={styles.logo} href="#home">NEXUS<span>.AI</span></a>
        <p>Andrey Nonardo © 2026</p>
        <div className={styles.footerLinks}>
          {content.contact.socials.map((social) => (
            <a key={social.label} href={social.url} target="_blank" rel="noopener noreferrer">{social.label}</a>
          ))}
          <a href="#home">Voltar ao topo ↑</a>
        </div>
      </footer>
    </>
  );
}
