"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Reveal,
  TextReveal,
  ImageReveal,
  StaggerChildren,
  StaggerItem,
  LineReveal,
  CountUp,
} from "@/components/Animations";
import { skills as defaultSkills, stats as defaultStats } from "@/data/portfolio";
import { api } from "@/services/api";

interface EducationItem {
  degree: string;
  school: string;
  period: string;
  note: string;
}

interface ValueItem {
  title: string;
  description: string;
}

interface StatItem {
  value: number;
  suffix: string;
  label: string;
}

const defaultEducation: EducationItem[] = [
  {
    degree: "M.Tech in Artificial Intelligence",
    school: "Indian Institute of Technology, Madras",
    period: "2019 — 2021",
    note: "Thesis: Efficient Transformer Architectures for Real-Time Inference",
  },
  {
    degree: "B.Tech in Computer Science",
    school: "National Institute of Technology, Trichy",
    period: "2015 — 2019",
    note: "First Class with Distinction — Department Rank 3",
  },
];

const defaultValues: ValueItem[] = [
  {
    title: "Precision Engineering",
    description:
      "Every system I build is designed with meticulous attention to detail — from the algorithm level to the user interface.",
  },
  {
    title: "Research-Driven",
    description:
      "I stay at the cutting edge, publishing research and applying the latest breakthroughs to real-world problems.",
  },
  {
    title: "Impact First",
    description:
      "Technology exists to solve problems. I measure success by the tangible impact my work creates for users and businesses.",
  },
  {
    title: "Continuous Growth",
    description:
      "The field evolves daily. I embrace lifelong learning, mentorship, and collaboration as core principles.",
  },
];

export default function AboutPage() {
  const [about, setAbout] = useState<any>(null);
  const [skillGroups, setSkillGroups] = useState<Record<string, string[]>>(defaultSkills);

  useEffect(() => {
    // Fetch live About data from REST API
    api.getAbout().then((res) => {
      if (res.success && res.data) {
        setAbout(res.data);
      }
    }).catch(() => {});

    // Fetch live Skills data from REST API
    api.getSkills().then((res) => {
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        const grouped: Record<string, string[]> = {};
        res.data.forEach((s: any) => {
          if (!grouped[s.category]) grouped[s.category] = [];
          grouped[s.category].push(s.name);
        });
        setSkillGroups(grouped);
      }
    }).catch(() => {});
  }, []);

  const education: EducationItem[] = about?.education && Array.isArray(about.education) && about.education.length > 0
    ? about.education
    : defaultEducation;

  const values: ValueItem[] = about?.values && Array.isArray(about.values) && about.values.length > 0
    ? about.values
    : defaultValues;

  const stats: StatItem[] = about?.stats && Array.isArray(about.stats) && about.stats.length > 0
    ? about.stats
    : defaultStats;

  return (
    <div className="page-transition">
      {/* ═══════════════════════════════════
          HERO
          ═══════════════════════════════════ */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-28 relative">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Text */}
            <div className="lg:col-span-7 space-y-8">
              <Reveal>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-[1px] bg-gold" />
                  <span className="text-label text-gold">About Me</span>
                </div>
              </Reveal>

              <TextReveal>
                <h1 className="heading-display text-5xl md:text-7xl lg:text-8xl text-foreground">
                  The Mind
                  <br />
                  Behind the
                  <br />
                  <span className="italic gold-gradient-text">Machines</span>
                </h1>
              </TextReveal>

              <Reveal delay={0.3}>
                <p className="text-lg text-muted-light leading-relaxed max-w-xl">
                  I&apos;m Arjun Mehta — an AI/ML engineer and software architect
                  based in Bengaluru, India. I specialize in building intelligent
                  systems that operate at the intersection of cutting-edge research
                  and production engineering.
                </p>
              </Reveal>

              <Reveal delay={0.4}>
                <p className="text-base text-muted leading-relaxed max-w-xl">
                  With 5+ years of experience across Google DeepMind, Microsoft
                  Research, and Flipkart, I&apos;ve had the privilege of working on
                  systems that impact hundreds of millions of users. My work spans
                  foundation models, computer vision, NLP, and the infrastructure
                  that makes ML work in production.
                </p>
              </Reveal>

              <Reveal delay={0.5}>
                <p className="text-base text-muted leading-relaxed max-w-xl">
                  When I&apos;m not training models or designing architectures, you&apos;ll
                  find me contributing to open-source ML tooling, writing about
                  emerging AI research, or mentoring aspiring engineers through the
                  IIT Madras alumni network.
                </p>
              </Reveal>
            </div>

            {/* Image */}
            <div className="lg:col-span-5">
              <ImageReveal>
                <div className="relative aspect-[3/4] overflow-hidden">
                  <div className="absolute -inset-1 border border-gold/20 z-10 pointer-events-none" />
                  <Image
                    src="/images/hero-portrait.jpg"
                    alt="Arjun Mehta portrait"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
                </div>
              </ImageReveal>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          VALUES
          ═══════════════════════════════════ */}
      <section className="py-24 md:py-32 bg-surface border-y border-border relative noise-overlay">
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10">
          <Reveal>
            <p className="text-label text-gold mb-4">Core Philosophy</p>
          </Reveal>
          <TextReveal>
            <h2 className="heading-editorial text-4xl md:text-5xl text-foreground mb-16">
              What I{" "}
              <span className="italic gold-gradient-text">Believe In</span>
            </h2>
          </TextReveal>

          <StaggerChildren
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            staggerDelay={0.15}
          >
            {values.map((value: ValueItem, i: number) => (
              <StaggerItem key={value.title}>
                <div className="flex gap-6 group">
                  <span className="text-3xl font-serif text-gold/30 group-hover:text-gold transition-colors duration-500 shrink-0">
                    0{i + 1}
                  </span>
                  <div>
                    <h3 className="text-lg font-medium text-foreground mb-2 group-hover:text-gold transition-colors duration-300">
                      {value.title}
                    </h3>
                    <p className="text-sm text-muted leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* ═══════════════════════════════════
          WORKSPACE IMAGE
          ═══════════════════════════════════ */}
      <section className="py-24 md:py-32">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <ImageReveal>
            <div className="relative aspect-[21/9] overflow-hidden">
              <Image
                src="/images/about-workspace.jpg"
                alt="My workspace"
                fill
                className="object-cover"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
              <div className="absolute bottom-8 left-8">
                <p className="text-label text-gold">The Workshop</p>
                <p className="text-sm text-muted-light mt-1">
                  Where intelligence is engineered
                </p>
              </div>
            </div>
          </ImageReveal>
        </div>
      </section>

      {/* ═══════════════════════════════════
          SKILLS / TECH STACK
          ═══════════════════════════════════ */}
      <section className="py-24 md:py-32 bg-surface border-y border-border relative noise-overlay">
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10">
          <div className="flex items-center justify-between mb-16">
            <div>
              <Reveal>
                <p className="text-label text-gold mb-2">Technical Arsenal</p>
              </Reveal>
              <TextReveal>
                <h2 className="heading-editorial text-4xl md:text-5xl text-foreground">
                  Skills &{" "}
                  <span className="italic gold-gradient-text">Technologies</span>
                </h2>
              </TextReveal>
            </div>
          </div>

          <StaggerChildren
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            staggerDelay={0.1}
          >
            {Object.entries(skillGroups).map(([category, items]) => (
              <StaggerItem key={category}>
                <div className="p-6 border border-border hover:border-gold/30 transition-all duration-500">
                  <h3 className="text-label text-gold mb-6">{category}</h3>
                  <div className="flex flex-wrap gap-2">
                    {items.map((skill) => (
                      <span
                        key={skill}
                        className="text-xs px-3 py-1.5 border border-border text-muted-light hover:border-gold/40 hover:text-gold transition-all duration-300 cursor-default"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* ═══════════════════════════════════
          EDUCATION
          ═══════════════════════════════════ */}
      <section className="py-24 md:py-32">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <Reveal>
            <p className="text-label text-gold mb-2">Education</p>
          </Reveal>
          <TextReveal>
            <h2 className="heading-editorial text-4xl md:text-5xl text-foreground mb-16">
              Academic{" "}
              <span className="italic gold-gradient-text">Foundation</span>
            </h2>
          </TextReveal>

          <div className="space-y-8">
            {education.map((edu: EducationItem, i: number) => (
              <Reveal key={edu.degree} delay={i * 0.15}>
                <div className="group flex flex-col md:flex-row md:items-center gap-4 md:gap-8 p-6 border border-border hover:border-gold/30 transition-all duration-500">
                  <span className="text-label text-muted shrink-0 w-32">
                    {edu.period}
                  </span>
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-foreground group-hover:text-gold transition-colors duration-300">
                      {edu.degree}
                    </h3>
                    <p className="text-sm text-muted-light">{edu.school}</p>
                    <p className="text-xs text-muted mt-1 italic">{edu.note}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          STATS
          ═══════════════════════════════════ */}
      <section className="py-16 bg-surface border-y border-border">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
            {stats.map((stat: StatItem, i: number) => (
              <Reveal key={stat.label} delay={i * 0.1}>
                <div className="text-center">
                  <p className="heading-display text-4xl md:text-5xl text-gold mb-2">
                    <CountUp target={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="text-label text-muted">{stat.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 md:py-32">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 text-center">
          <Reveal>
            <h2 className="heading-editorial text-4xl md:text-6xl text-foreground mb-8">
              Let&apos;s Build Something{" "}
              <span className="italic gold-gradient-text">Remarkable</span>
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <Link
              href="/contact"
              className="inline-block btn-magnetic border border-gold text-gold px-10 py-4 text-label hover:text-background transition-colors duration-500"
            >
              <span>Get in Touch</span>
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
