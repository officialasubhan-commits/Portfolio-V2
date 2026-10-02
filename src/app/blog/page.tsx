"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Reveal,
  TextReveal,
  ImageReveal,
} from "@/components/Animations";
import { blogPosts as defaultBlogPosts } from "@/data/portfolio";
import { api } from "@/services/api";

export default function BlogPage() {
  const [posts, setPosts] = useState(defaultBlogPosts);

  useEffect(() => {
    api.getBlogs().then((res) => {
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        const mapped = res.data.map((b: any) => ({
          id: b.slug || b.id,
          title: b.title,
          excerpt: b.excerpt,
          date: b.publishedAt
            ? new Date(b.publishedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
            : "Recent",
          readTime: b.readTime || "5 min read",
          category: b.category,
          image: b.coverImage || "/images/blog-transformers.jpg",
          content: b.content,
        }));
        setPosts(mapped);
      }
    }).catch(() => {});
  }, []);

  const [featuredPost, ...otherPosts] = posts.length > 0 ? posts : defaultBlogPosts;


  return (
    <div className="page-transition">
      {/* Header */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <Reveal>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-[1px] bg-gold" />
              <span className="text-label text-gold">Blog</span>
            </div>
          </Reveal>

          <TextReveal>
            <h1 className="heading-display text-6xl md:text-8xl lg:text-9xl text-foreground">
              Thoughts &
              <br />
              <span className="italic gold-gradient-text">Insights</span>
            </h1>
          </TextReveal>

          <Reveal delay={0.3}>
            <p className="text-lg text-muted-light mt-8 max-w-2xl">
              Deep dives into AI research, ML engineering, system architecture,
              and the intersection of technology and impact. Written from the
              trenches.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Featured Post */}
      <section className="pb-16 md:pb-20">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <Link href={`/blog/${featuredPost.id}`} className="group block">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7">
                <ImageReveal>
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={featuredPost.image}
                      alt={featuredPost.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 1024px) 100vw, 58vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
                    <div className="absolute top-4 left-4">
                      <span className="text-label text-gold bg-background/80 px-3 py-1 backdrop-blur-sm">
                        Featured
                      </span>
                    </div>
                  </div>
                </ImageReveal>
              </div>
              <div className="lg:col-span-5 space-y-4 lg:pl-4">
                <Reveal>
                  <span className="text-label text-gold">
                    {featuredPost.category}
                  </span>
                </Reveal>
                <Reveal delay={0.1}>
                  <h2 className="heading-editorial text-2xl md:text-3xl text-foreground group-hover:text-gold transition-colors duration-500">
                    {featuredPost.title}
                  </h2>
                </Reveal>
                <Reveal delay={0.2}>
                  <p className="text-sm text-muted leading-relaxed">
                    {featuredPost.excerpt}
                  </p>
                </Reveal>
                <Reveal delay={0.3}>
                  <div className="flex items-center gap-4 text-xs text-muted">
                    <span>{featuredPost.date}</span>
                    <span>·</span>
                    <span>{featuredPost.readTime}</span>
                  </div>
                </Reveal>
                <Reveal delay={0.4}>
                  <div className="flex items-center gap-2 text-label text-muted group-hover:text-gold transition-colors duration-300">
                    <span>Read Article</span>
                    <span className="transition-transform duration-300 group-hover:translate-x-2">
                      →
                    </span>
                  </div>
                </Reveal>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Other Posts Grid */}
      <section className="pb-24 md:pb-32">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <div className="h-[1px] bg-border mb-16" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {otherPosts.map((post, i) => (
              <Reveal key={post.id} delay={i * 0.1}>
                <Link href={`/blog/${post.id}`} className="group block">
                  <div className="relative overflow-hidden aspect-[16/10] mb-5">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
                  </div>
                  <span className="text-label text-gold block mb-2">
                    {post.category}
                  </span>
                  <h3 className="text-lg font-medium text-foreground group-hover:text-gold transition-colors duration-300 mb-2 leading-tight">
                    {post.title}
                  </h3>
                  <p className="text-sm text-muted leading-relaxed mb-3 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-muted">
                    <span>{post.date}</span>
                    <span>·</span>
                    <span>{post.readTime}</span>
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
