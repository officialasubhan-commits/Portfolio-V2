"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Reveal,
  TextReveal,
  StaggerChildren,
  StaggerItem,
} from "@/components/Animations";
import { projects as defaultProjects } from "@/data/portfolio";
import { api } from "@/services/api";

export default function ProjectsPage() {
  const [projectsList, setProjectsList] = useState(defaultProjects);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    api.getProjects().then((res) => {
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        setProjectsList(res.data);
      }
    }).catch(() => {});
  }, []);

  const categories = ["All", ...Array.from(new Set(projectsList.map((p: any) => p.category)))];

  const filteredProjects =
    activeCategory === "All"
      ? projectsList
      : projectsList.filter((p: any) => p.category === activeCategory);


  return (
    <div className="page-transition">
      {/* Header */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <Reveal>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-[1px] bg-gold" />
              <span className="text-label text-gold">Projects / Work</span>
            </div>
          </Reveal>

          <TextReveal>
            <h1 className="heading-display text-6xl md:text-8xl lg:text-9xl text-foreground">
              Selected
              <br />
              <span className="italic gold-gradient-text">Works</span>
            </h1>
          </TextReveal>

          <Reveal delay={0.3}>
            <p className="text-lg text-muted-light mt-8 max-w-2xl">
              A curated collection of projects spanning machine learning,
              computer vision, NLP, and full-stack engineering. Each represents a
              unique challenge solved with precision and purpose.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Filter */}
      <section className="pb-12">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <Reveal>
            <div className="flex flex-wrap gap-4">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`text-label px-4 py-2 border transition-all duration-300 ${
                    activeCategory === cat
                      ? "border-gold text-gold bg-gold/5"
                      : "border-border text-muted hover:border-gold/40 hover:text-gold"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Projects */}
      <section className="pb-24 md:pb-32">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <div className="space-y-20">
            {filteredProjects.map((project: any, i: number) => (
              <Reveal key={project.id} delay={0.1}>
                <Link
                  href={`/projects/${project.slug || project.id}`}
                  className="group block"
                >
                  <div
                    className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-center ${
                      i % 2 === 1 ? "lg:direction-rtl" : ""
                    }`}
                  >
                    {/* Image */}
                    <div
                      className={`lg:col-span-7 ${
                        i % 2 === 1 ? "lg:order-2" : ""
                      }`}
                    >
                      <div className="relative overflow-hidden aspect-[16/10]">
                        <Image
                          src={project.mainImage || project.image || "/images/project-ai-platform.jpg"}
                          alt={project.title}
                          fill
                          className="object-cover transition-transform duration-1000 group-hover:scale-105"
                          sizes="(max-width: 1024px) 100vw, 58vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-background/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        {/* Floating number */}
                        <div className="absolute top-4 left-4">
                          <span className="heading-display text-6xl md:text-7xl text-gold/20 group-hover:text-gold/40 transition-colors duration-500">
                            0{i + 1}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div
                      className={`lg:col-span-5 space-y-4 ${
                        i % 2 === 1 ? "lg:order-1 lg:pr-8" : "lg:pl-8"
                      }`}
                    >
                      <span className="text-label text-gold">
                        {project.category} — {project.year}
                      </span>
                      <h2 className="heading-editorial text-3xl md:text-4xl text-foreground group-hover:text-gold transition-colors duration-500">
                        {project.title}
                      </h2>
                      <p className="text-sm text-muted-light italic">
                        {project.subtitle}
                      </p>
                      <p className="text-sm text-muted leading-relaxed">
                        {project.description}
                      </p>

                      {/* Tech tags */}
                      <div className="flex flex-wrap gap-2 pt-2">
                        {project.technologies.slice(0, 5).map((tech: string) => (
                          <span
                            key={tech}
                            className="text-[0.6rem] tracking-widest uppercase px-2 py-1 border border-border text-muted"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      {/* Arrow */}
                      <div className="flex items-center gap-2 pt-4 text-label text-muted group-hover:text-gold transition-colors duration-300">
                        <span>View Project</span>
                        <span className="transition-transform duration-300 group-hover:translate-x-2">
                          →
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
