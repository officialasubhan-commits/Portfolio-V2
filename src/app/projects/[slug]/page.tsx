"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Reveal,
  TextReveal,
  ImageReveal,
  StaggerChildren,
  StaggerItem,
  LineReveal,
} from "@/components/Animations";
import { projects } from "@/data/portfolio";

export default function ProjectDetailPage() {
  const params = useParams();
  const project = projects.find((p) => p.id === params.slug);

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="heading-display text-6xl text-foreground mb-4">404</h1>
          <p className="text-muted mb-8">Project not found</p>
          <Link href="/projects" className="text-label text-gold link-underline">
            ← Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  const currentIndex = projects.findIndex((p) => p.id === project.id);
  const nextProject = projects[(currentIndex + 1) % projects.length];

  return (
    <div className="page-transition">
      {/* Hero Image */}
      <section className="pt-24 md:pt-32">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <Reveal>
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-label text-muted hover:text-gold transition-colors mb-8"
            >
              <span>←</span>
              <span>All Projects</span>
            </Link>
          </Reveal>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <Reveal>
                <span className="text-label text-gold block mb-3">
                  {project.category} — {project.year}
                </span>
              </Reveal>
              <TextReveal>
                <h1 className="heading-display text-5xl md:text-7xl lg:text-8xl text-foreground">
                  {project.title}
                </h1>
              </TextReveal>
              <Reveal delay={0.2}>
                <p className="text-lg text-muted-light italic mt-2">
                  {project.subtitle}
                </p>
              </Reveal>
            </div>
            <Reveal delay={0.3}>
              <div className="text-right shrink-0">
                <p className="text-label text-muted">Role</p>
                <p className="text-sm text-foreground">{project.role}</p>
                <p className="text-label text-muted mt-2">Duration</p>
                <p className="text-sm text-foreground">{project.duration}</p>
              </div>
            </Reveal>
          </div>

          <ImageReveal>
            <div className="relative aspect-[21/9] overflow-hidden">
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover"
                priority
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
            </div>
          </ImageReveal>
        </div>
      </section>

      {/* Project Details */}
      <section className="py-20 md:py-28">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* Main Content */}
            <div className="lg:col-span-7 space-y-12">
              <Reveal>
                <div>
                  <h2 className="text-label text-gold mb-4">Overview</h2>
                  <p className="text-base text-muted-light leading-relaxed">
                    {project.longDescription}
                  </p>
                </div>
              </Reveal>

              <LineReveal />

              <Reveal>
                <div>
                  <h2 className="text-label text-gold mb-6">
                    Key Challenges & Solutions
                  </h2>
                  <div className="space-y-4">
                    {project.challenges.map((challenge, i) => (
                      <div key={i} className="flex gap-4">
                        <span className="text-gold text-sm shrink-0 mt-0.5">
                          0{i + 1}
                        </span>
                        <p className="text-sm text-muted-light leading-relaxed">
                          {challenge}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>

              {/* Links */}
              <Reveal>
                <div className="flex flex-wrap gap-4 pt-4">
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-magnetic border border-gold text-gold px-6 py-3 text-label hover:text-background transition-colors duration-500"
                    >
                      <span>View Live ↗</span>
                    </a>
                  )}
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-magnetic border border-border text-muted-light px-6 py-3 text-label hover:border-gold hover:text-gold transition-colors duration-500"
                    >
                      <span>Source Code ↗</span>
                    </a>
                  )}
                </div>
              </Reveal>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-5 space-y-10">
              {/* Metrics */}
              <Reveal>
                <div className="p-6 border border-border bg-surface">
                  <h3 className="text-label text-gold mb-6">Key Metrics</h3>
                  <div className="grid grid-cols-2 gap-6">
                    {project.metrics.map((metric) => (
                      <div key={metric.label}>
                        <p className="heading-display text-3xl text-gold">
                          {metric.value}
                        </p>
                        <p className="text-xs text-muted mt-1">
                          {metric.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>

              {/* Technologies */}
              <Reveal delay={0.1}>
                <div className="p-6 border border-border bg-surface">
                  <h3 className="text-label text-gold mb-6">
                    Technology Stack
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="text-xs px-3 py-1.5 border border-border text-muted-light hover:border-gold/40 hover:text-gold transition-all duration-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </Reveal>

              {/* Project info */}
              <Reveal delay={0.2}>
                <div className="p-6 border border-border bg-surface">
                  <h3 className="text-label text-gold mb-6">
                    Project Details
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-xs text-muted">Category</span>
                      <span className="text-xs text-foreground">
                        {project.category}
                      </span>
                    </div>
                    <div className="h-[1px] bg-border" />
                    <div className="flex justify-between">
                      <span className="text-xs text-muted">Year</span>
                      <span className="text-xs text-foreground">
                        {project.year}
                      </span>
                    </div>
                    <div className="h-[1px] bg-border" />
                    <div className="flex justify-between">
                      <span className="text-xs text-muted">Role</span>
                      <span className="text-xs text-foreground">
                        {project.role}
                      </span>
                    </div>
                    <div className="h-[1px] bg-border" />
                    <div className="flex justify-between">
                      <span className="text-xs text-muted">Duration</span>
                      <span className="text-xs text-foreground">
                        {project.duration}
                      </span>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Next Project */}
      <section className="py-20 md:py-28 bg-surface border-t border-border">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <Reveal>
            <p className="text-label text-muted mb-4">Next Project</p>
          </Reveal>
          <Link href={`/projects/${nextProject.id}`} className="group block">
            <Reveal delay={0.1}>
              <h2 className="heading-display text-4xl md:text-6xl lg:text-7xl text-foreground group-hover:text-gold transition-colors duration-500">
                {nextProject.title}
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="flex items-center gap-2 mt-4 text-label text-muted group-hover:text-gold transition-colors duration-300">
                <span>View Project</span>
                <span className="transition-transform duration-300 group-hover:translate-x-2">
                  →
                </span>
              </div>
            </Reveal>
          </Link>
        </div>
      </section>
    </div>
  );
}
