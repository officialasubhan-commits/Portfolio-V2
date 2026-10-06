"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Reveal,
  TextReveal,
  ImageReveal,
  StaggerChildren,
  StaggerItem,
  LineReveal,
  CountUp,
  ParallaxImage,
} from "@/components/Animations";
import { projects as defaultProjects, stats as defaultStats } from "@/data/portfolio";
import { api } from "@/services/api";

const FALLBACK_HERO_IMAGE = "/images/hero-portrait.jpg";

const expertiseAreas = [
  {
    icon: "◆",
    title: "Machine Learning",
    desc: "Building production-grade ML systems that scale to millions of users.",
  },
  {
    icon: "◇",
    title: "Deep Learning",
    desc: "Research and deployment of transformer architectures and neural networks.",
  },
  {
    icon: "✦",
    title: "System Architecture",
    desc: "Designing distributed systems for real-time data processing and analytics.",
  },
  {
    icon: "◈",
    title: "Full Stack",
    desc: "Crafting elegant interfaces that bring complex data to life.",
  },
];

const trustedBy = [
  "Google DeepMind",
  "Microsoft Research",
  "Flipkart",
  "Amazon",
];

export default function HomePage() {
  const [about, setAbout] = useState<any>(null);
  const [projectsList, setProjectsList] = useState<any[]>(defaultProjects);
  const [heroImageSrc, setHeroImageSrc] = useState<string>(FALLBACK_HERO_IMAGE);

  useEffect(() => {
    // 1. Fetch Live Profile & Hero Configuration from REST API
    api.getAbout()
      .then((res) => {
        if (res.success && res.data) {
          setAbout(res.data);
          if (res.data.avatarUrl) {
            setHeroImageSrc(res.data.avatarUrl);
          }
        }
      })
      .catch(() => {});

    // 2. Fetch Live Projects from REST API
    api.getProjects()
      .then((res) => {
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          const mapped = res.data.map((p: any) => ({
            id: p.slug || p.id,
            title: p.title,
            subtitle: p.subtitle || "",
            category: p.category || "Engineering",
            year: p.year || "2026",
            image: p.mainImage || "/images/project-ai-dashboard.jpg",
            description: p.description || "",
            longDescription: p.longDescription || "",
            technologies: typeof p.technologies === "string" ? JSON.parse(p.technologies || "[]") : p.technologies || [],
            metrics: typeof p.metrics === "string" ? JSON.parse(p.metrics || "[]") : p.metrics || [],
            challenges: typeof p.challenges === "string" ? JSON.parse(p.challenges || "[]") : p.challenges || [],
            role: p.role || "",
            duration: p.duration || "",
            link: p.liveUrl || "",
            github: p.githubUrl || "",
          }));
          setProjectsList(mapped);
        }
      })
      .catch(() => {});
  }, []);

  const ownerName = about?.name || "Alex Morgan";
  const professionalTitle = about?.title || "AI/ML Engineer & Software Architect";

  return (
    <div className="page-transition">
      {/* ═══════════════════════════════════
          HERO SECTION
          ═══════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center overflow-hidden noise-overlay">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-dark/30 via-background to-background" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-emerald-dark/20 to-transparent" />

        <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10 w-full pt-32 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-6 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-8">
              {/* Tag line */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="flex items-center gap-4"
              >
                <div className="w-12 h-[1px] bg-gold" />
                <span className="text-label text-gold">
                  {professionalTitle}
                </span>
              </motion.div>

              {/* Specialty list */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="space-y-1"
              >
                {[
                  "Machine Learning",
                  "System Architecture",
                  "Deep Learning",
                  "Data Engineering",
                ].map((item, i) => (
                  <p
                    key={item}
                    className="text-xs tracking-[0.15em] uppercase text-muted-light/60"
                  >
                    {item}
                  </p>
                ))}
              </motion.div>

              {/* Intro text */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-lg md:text-xl text-muted-light leading-relaxed max-w-lg"
              >
                {about?.bio ? (
                  about.bio
                ) : (
                  <>
                    I engineer intelligent systems
                    <br />
                    and scalable architectures
                    <br />
                    that transform raw data
                    <br />
                    into{" "}
                    <span className="text-gold italic font-serif text-2xl">
                      actionable impact
                    </span>
                    .
                  </>
                )}
              </motion.p>

              {/* Signature */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="font-serif italic text-2xl text-foreground/70"
              >
                {ownerName}
              </motion.p>

              {/* Giant Title */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.3, ease: [0.23, 1, 0.32, 1] }}
              >
                <h1 className="heading-display text-7xl sm:text-8xl md:text-9xl lg:text-[10rem] text-foreground leading-[0.85]">
                  PORT
                  <span className="gold-gradient-text">FOLIO</span>
                </h1>
              </motion.div>

              {/* Subtitle */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1 }}
                className="flex items-center gap-3"
              >
                <span className="text-label text-muted tracking-[0.3em]">
                  Intelligence
                </span>
                <span className="text-gold text-xs">·</span>
                <span className="text-label text-muted tracking-[0.3em]">
                  Architecture
                </span>
                <span className="text-gold text-xs">·</span>
                <span className="text-label text-muted tracking-[0.3em]">
                  Impact
                </span>
              </motion.div>
            </div>

            {/* Right — Hero Image (CMS Managed) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.5 }}
              className="lg:col-span-5 relative"
            >
              <div className="relative aspect-[3/4] max-w-md mx-auto lg:ml-auto overflow-hidden">
                {/* Decorative border */}
                <div className="absolute -inset-1 border border-gold/20 z-10 pointer-events-none" />
                <div className="absolute -inset-3 border border-gold/10 z-10 pointer-events-none" />
                <Image
                  src={heroImageSrc}
                  alt={`${ownerName} — ${professionalTitle}`}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 40vw"
                  unoptimized={heroImageSrc.startsWith("http")}
                  onError={() => {
                    setHeroImageSrc(FALLBACK_HERO_IMAGE);
                  }}
                />
                {/* Emerald overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-dark/40 via-transparent to-transparent" />
              </div>

              {/* Year badge */}
              <motion.div
                initial={{ opacity: 0, rotate: -10 }}
                animate={{ opacity: 1, rotate: 0 }}
                transition={{ duration: 0.8, delay: 1.2 }}
                className="absolute top-4 right-4 lg:-right-4 text-right"
              >
                <p className="text-label text-gold">2026</p>
                <p className="text-[0.6rem] tracking-[0.15em] uppercase text-muted">
                  AI/ML Engineer
                  <br />
                  Portfolio
                </p>
              </motion.div>

              {/* Rotating badge */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -bottom-8 -left-8 lg:-left-16 w-28 h-28 md:w-36 md:h-36"
              >
                <svg viewBox="0 0 200 200" className="w-full h-full">
                  <defs>
                    <path
                      id="circlePath"
                      d="M 100, 100 m -75, 0 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0"
                    />
                  </defs>
                  <text className="fill-gold text-[14px] tracking-[0.4em] uppercase">
                    <textPath href="#circlePath">
                      Engineering Intelligence · Building Impact ·{" "}
                    </textPath>
                  </text>
                  {/* Center star */}
                  <text
                    x="100"
                    y="108"
                    textAnchor="middle"
                    className="fill-gold text-3xl"
                  >
                    ✦
                  </text>
                </svg>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-[0.6rem] tracking-[0.2em] uppercase text-muted">
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-[1px] h-8 bg-gradient-to-b from-gold to-transparent"
          />
        </motion.div>
      </section>

      {/* ═══════════════════════════════════
          EXPERTISE SECTION
          ═══════════════════════════════════ */}
      <section className="py-24 md:py-32 bg-surface border-y border-border relative noise-overlay">
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-6">
            {/* Left title */}
            <div className="lg:col-span-4">
              <Reveal>
                <p className="text-label text-gold mb-4">What I Do</p>
              </Reveal>
              <TextReveal>
                <h2 className="heading-editorial text-4xl md:text-5xl lg:text-6xl text-foreground">
                  Vision
                  <br />
                  That Drives
                  <br />
                  <span className="italic gold-gradient-text">Excellence</span>
                </h2>
              </TextReveal>
            </div>

            {/* Expertise cards */}
            <div className="lg:col-span-8">
              <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 gap-6" staggerDelay={0.15}>
                {expertiseAreas.map((area) => (
                  <StaggerItem key={area.title}>
                    <div className="group p-6 border border-border hover:border-gold/30 transition-all duration-500 bg-background/50">
                      <span className="text-gold text-2xl mb-4 block group-hover:scale-110 transition-transform duration-300">
                        {area.icon}
                      </span>
                      <h3 className="text-label text-foreground mb-2">
                        {area.title}
                      </h3>
                      <p className="text-sm text-muted leading-relaxed">
                        {area.desc}
                      </p>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerChildren>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          FEATURED WORK
          ═══════════════════════════════════ */}
      <section className="py-24 md:py-32">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          {/* Section header */}
          <div className="flex items-center justify-between mb-16">
            <div>
              <Reveal>
                <p className="text-label text-gold mb-2">Featured Work</p>
              </Reveal>
              <Reveal delay={0.1}>
                <h2 className="heading-editorial text-3xl md:text-4xl text-foreground">
                  Selected Projects
                </h2>
              </Reveal>
            </div>
            <Reveal delay={0.2}>
              <Link
                href="/projects"
                className="text-label text-muted hover:text-gold transition-colors duration-300 hidden sm:block"
              >
                View All Projects →
              </Link>
            </Reveal>
          </div>

          {/* Projects grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projectsList.map((project, i) => (
              <Reveal key={project.id || i} delay={i * 0.15}>
                <Link href={`/projects/${project.id}`} className="group block">
                  <div className="relative overflow-hidden aspect-[16/10] mb-4">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <span className="text-label text-gold">
                        {project.category}
                      </span>
                    </div>

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-gold/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-medium text-foreground group-hover:text-gold transition-colors duration-300">
                        {project.title}
                      </h3>
                      <p className="text-sm text-muted">{project.subtitle}</p>
                    </div>
                    <span className="text-label text-muted shrink-0 mt-1">
                      {project.year}
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>

          {/* Mobile view all */}
          <div className="mt-10 text-center sm:hidden">
            <Link
              href="/projects"
              className="text-label text-gold link-underline"
            >
              View All Projects →
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          STATS SECTION
          ═══════════════════════════════════ */}
      <section className="py-16 bg-surface border-y border-border">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
            {defaultStats.map((stat: any, i: number) => (
              <Reveal key={stat.label} delay={i * 0.1}>
                <div className="text-center">
                  <p className="heading-display text-4xl md:text-5xl lg:text-6xl text-gold mb-2">
                    <CountUp
                      target={stat.value}
                      suffix={stat.suffix}
                    />
                  </p>
                  <p className="text-label text-muted">{stat.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          TRUSTED BY / EXPERIENCE STRIP
          ═══════════════════════════════════ */}
      <section className="py-16 md:py-20">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <Reveal>
            <p className="text-label text-gold mb-8">
              Trusted by Industry Leaders
            </p>
          </Reveal>
          <div className="flex flex-wrap items-center gap-8 md:gap-16">
            {trustedBy.map((company, i) => (
              <Reveal key={company} delay={i * 0.1}>
                <span className="text-xl md:text-2xl font-serif font-light text-muted/50 hover:text-gold/70 transition-colors duration-300 cursor-default">
                  {company}
                </span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          TESTIMONIAL / QUOTE
          ═══════════════════════════════════ */}
      <section className="py-24 md:py-32 bg-surface border-y border-border relative noise-overlay">
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-8">
              <Reveal>
                <span className="text-6xl md:text-8xl font-serif text-gold/30 leading-none block mb-4">
                  &ldquo;
                </span>
              </Reveal>
              <Reveal delay={0.2}>
                <blockquote className="text-xl md:text-2xl lg:text-3xl font-serif font-light text-foreground/90 leading-relaxed">
                  Arjun&apos;s ability to bridge deep ML research with
                  production engineering is rare. He transformed our analytics
                  pipeline into an intelligent system that delivers results we
                  didn&apos;t think were possible.
                </blockquote>
              </Reveal>
              <Reveal delay={0.4}>
                <div className="mt-8">
                  <LineReveal className="mb-4" />
                  <p className="text-sm font-medium text-foreground">
                    — Dr. Priya Sharma
                  </p>
                  <p className="text-xs text-muted">
                    Director of AI, Google DeepMind
                  </p>
                </div>
              </Reveal>
            </div>
            <div className="lg:col-span-4">
              <ImageReveal>
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image
                    src="/images/about-workspace.jpg"
                    alt="Workspace"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-dark/40 to-transparent" />
                </div>
              </ImageReveal>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
