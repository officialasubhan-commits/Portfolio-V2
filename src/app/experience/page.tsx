"use client";

import { useState, useEffect } from "react";
import {
  Reveal,
  TextReveal,
  StaggerChildren,
  StaggerItem,
  LineReveal,
} from "@/components/Animations";
import { experiences as defaultExperiences } from "@/data/portfolio";
import { api } from "@/services/api";

interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  period: string;
  location: string;
  description: string;
  achievements: string[];
  technologies: string[];
}

export default function ExperiencePage() {
  const [experiences, setExperiences] = useState<ExperienceItem[]>(defaultExperiences);

  useEffect(() => {
    api.getExperience().then((res) => {
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        const mapped = res.data.map((exp: any) => ({
          id: exp.id,
          role: exp.role,
          company: exp.organization || exp.company,
          period: exp.period || `${exp.startDate || "2024"} — ${exp.current ? "Present" : exp.endDate || "2025"}`,
          location: exp.location || "Bengaluru, India",
          description: exp.description,
          achievements: exp.highlights || exp.achievements || [],
          technologies: exp.technologies || [],
        }));
        setExperiences(mapped);
      }
    }).catch(() => {});
  }, []);

  return (
    <div className="page-transition">
      {/* Header */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <Reveal>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-[1px] bg-gold" />
              <span className="text-label text-gold">Career</span>
            </div>
          </Reveal>

          <TextReveal>
            <h1 className="heading-display text-6xl md:text-8xl lg:text-9xl text-foreground">
              Professional
              <br />
              <span className="italic gold-gradient-text">Experience</span>
            </h1>
          </TextReveal>

          <Reveal delay={0.3}>
            <p className="text-lg text-muted-light mt-8 max-w-2xl">
              A journey through leading technology companies, building
              intelligent systems that impact hundreds of millions of users
              worldwide.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Timeline */}
      <section className="pb-24 md:pb-32">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-0 md:left-8 top-0 bottom-0 w-[1px] bg-gradient-to-b from-gold via-gold/30 to-transparent" />

            <div className="space-y-16 md:space-y-24">
              {experiences.map((exp, i) => (
                <Reveal key={exp.id} delay={0.1}>
                  <div className="relative pl-8 md:pl-24">
                    {/* Timeline dot */}
                    <div className="absolute left-0 md:left-8 top-2 -translate-x-1/2">
                      <div className="w-3 h-3 border border-gold bg-background relative">
                        <div className="absolute inset-0.5 bg-gold animate-pulse" style={{ animationDelay: `${i * 0.5}s` }} />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-6">
                      {/* Header */}
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div>
                          <span className="text-label text-gold block mb-2">
                            {exp.period}
                          </span>
                          <h2 className="heading-editorial text-3xl md:text-4xl text-foreground">
                            {exp.company}
                          </h2>
                          <p className="text-base text-muted-light mt-1">
                            {exp.role}
                          </p>
                          <p className="text-xs text-muted mt-1">
                            {exp.location}
                          </p>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-muted leading-relaxed max-w-2xl">
                        {exp.description}
                      </p>

                      {/* Achievements */}
                      <div className="space-y-3">
                        <h3 className="text-label text-muted">
                          Key Achievements
                        </h3>
                        {exp.achievements.map((achievement: string, j: number) => (
                          <div key={j} className="flex gap-3">
                            <span className="text-gold text-xs mt-1.5 shrink-0">
                              ✦
                            </span>
                            <p className="text-sm text-muted-light leading-relaxed">
                              {achievement}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Technologies */}
                      <div className="flex flex-wrap gap-2">
                        {exp.technologies.map((tech: string) => (
                          <span
                            key={tech}
                            className="text-[0.6rem] tracking-widest uppercase px-3 py-1 border border-border text-muted hover:border-gold/30 hover:text-gold transition-all duration-300"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      <LineReveal />
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Download Resume CTA */}
      <section className="py-20 md:py-28 bg-surface border-t border-border relative noise-overlay">
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10 text-center">
          <Reveal>
            <h2 className="heading-editorial text-4xl md:text-5xl text-foreground mb-4">
              Want the{" "}
              <span className="italic gold-gradient-text">Full Story</span>?
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-muted mb-8">
              Download my complete résumé for a detailed overview of my career.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <button className="btn-magnetic border border-gold text-gold px-10 py-4 text-label hover:text-background transition-colors duration-500">
              <span>Download Résumé ↓</span>
            </button>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
