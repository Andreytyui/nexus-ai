"use client";

import {
  GraduationCap,
  Gamepad2,
  Trophy,
  Briefcase,
  Brain,
  Bot,
  Code2,
} from "lucide-react";
import RadialOrbitalTimeline from "@/components/ui/radial-orbital-timeline";

const timelineData = [
  {
    id: 1,
    title: "UniFG",
    date: "2021 — 2025",
    content:
      "Redes de Computadores na UniFG. Base técnica em infraestrutura, protocolos e sistemas distribuídos que sustenta todo o trabalho com AI e cloud.",
    category: "Educação",
    icon: GraduationCap,
    relatedIds: [2, 4],
    status: "completed" as const,
    energy: 100,
  },
  {
    id: 2,
    title: "Nexus RPG",
    date: "2022 — 2023",
    content:
      "Plataforma SaaS para jogadores e mestres de RPG. Fichas digitais interativas, narração por IA, mapas colaborativos e ambientação sonora por cena. Stack: React + Firebase.",
    category: "Projeto",
    icon: Gamepad2,
    relatedIds: [1, 3, 5],
    status: "completed" as const,
    energy: 90,
  },
  {
    id: 3,
    title: "Copa 2026",
    date: "2024",
    content:
      "Sistema completo de bolão da Copa 2026. Palpites de placar, apostas em eventos, ranking em tempo real, chat integrado e painel admin. Stack: React 18 + Supabase.",
    category: "Projeto",
    icon: Trophy,
    relatedIds: [2, 5],
    status: "completed" as const,
    energy: 85,
  },
  {
    id: 4,
    title: "Estácio",
    date: "2025",
    content:
      "Engenharia de Software na Estácio. Aprofundamento em arquitetura de sistemas, padrões de projeto e engenharia de software aplicada à construção de produtos escaláveis.",
    category: "Educação",
    icon: Code2,
    relatedIds: [1, 5],
    status: "completed" as const,
    energy: 95,
  },
  {
    id: 5,
    title: "AI Engineer",
    date: "2026 — Presente",
    content:
      "Junior AI Engineer na ALTERNATIVA SERVIÇOS. Automações financeiras com matching inteligente, plataformas SaaS com IA e ferramentas que substituem processos manuais. Ciclo completo: concepção → deploy.",
    category: "Carreira",
    icon: Briefcase,
    relatedIds: [1, 2, 3, 6],
    status: "in-progress" as const,
    energy: 75,
  },
  {
    id: 6,
    title: "Machine Learning",
    date: "Contínuo",
    content:
      "ML (94%), Deep Learning (88%), Computer Vision (85%), PyTorch/TF (89%), MLOps (82%), Cloud/Docker (80%). Construção e deploy de modelos em produção.",
    category: "Skills",
    icon: Brain,
    relatedIds: [5, 7],
    status: "in-progress" as const,
    energy: 94,
  },
  {
    id: 7,
    title: "LLMs & NLP",
    date: "Contínuo",
    content:
      "NLP/LLMs (91%), Python (97%), LangChain, FastAPI. Engenharia de prompts, RAG, agentes autônomos e integração de modelos de linguagem em produtos reais.",
    category: "Skills",
    icon: Bot,
    relatedIds: [5, 6],
    status: "in-progress" as const,
    energy: 91,
  },
];

export default function TimelinePage() {
  return <RadialOrbitalTimeline timelineData={timelineData} />;
}
