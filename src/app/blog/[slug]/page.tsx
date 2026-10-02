"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Reveal,
  TextReveal,
  ImageReveal,
  LineReveal,
} from "@/components/Animations";
import { blogPosts } from "@/data/portfolio";

export default function BlogArticlePage() {
  const params = useParams();
  const post = blogPosts.find((p) => p.id === params.slug);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="heading-display text-6xl text-foreground mb-4">404</h1>
          <p className="text-muted mb-8">Article not found</p>
          <Link href="/blog" className="text-label text-gold link-underline">
            ← Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  const currentIndex = blogPosts.findIndex((p) => p.id === post.id);
  const nextPost = blogPosts[(currentIndex + 1) % blogPosts.length];

  return (
    <div className="page-transition">
      {/* Article Header */}
      <section className="pt-32 pb-12 md:pt-40">
        <div className="max-w-[800px] mx-auto px-6 md:px-10">
          <Reveal>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-label text-muted hover:text-gold transition-colors mb-8"
            >
              <span>←</span>
              <span>All Articles</span>
            </Link>
          </Reveal>

          <Reveal>
            <span className="text-label text-gold block mb-4">
              {post.category}
            </span>
          </Reveal>

          <TextReveal>
            <h1 className="heading-editorial text-4xl md:text-5xl lg:text-6xl text-foreground leading-tight">
              {post.title}
            </h1>
          </TextReveal>

          <Reveal delay={0.2}>
            <div className="flex items-center gap-4 mt-6 text-sm text-muted">
              <span>{post.date}</span>
              <span>·</span>
              <span>{post.readTime}</span>
            </div>
          </Reveal>

          <Reveal delay={0.3}>
            <p className="text-lg text-muted-light mt-6 leading-relaxed italic">
              {post.excerpt}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Featured Image */}
      <section className="pb-12">
        <div className="max-w-[1000px] mx-auto px-6 md:px-10">
          <ImageReveal>
            <div className="relative aspect-[16/9] overflow-hidden">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover"
                priority
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/30 to-transparent" />
            </div>
          </ImageReveal>
        </div>
      </section>

      {/* Article Content */}
      <section className="pb-20 md:pb-28">
        <div className="max-w-[800px] mx-auto px-6 md:px-10">
          <Reveal>
            <article
              className="prose prose-invert prose-gold max-w-none
                [&_h2]:heading-editorial [&_h2]:text-2xl [&_h2]:md:text-3xl [&_h2]:text-foreground [&_h2]:mt-12 [&_h2]:mb-4
                [&_h3]:text-lg [&_h3]:font-medium [&_h3]:text-foreground [&_h3]:mt-8 [&_h3]:mb-3
                [&_p]:text-sm [&_p]:md:text-base [&_p]:text-muted-light [&_p]:leading-relaxed [&_p]:mb-4
                [&_strong]:text-foreground [&_strong]:font-medium
                [&_ul]:space-y-2 [&_li]:text-sm [&_li]:text-muted-light
                [&_code]:text-gold [&_code]:bg-surface [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-xs [&_code]:font-mono
                [&_pre]:bg-surface [&_pre]:border [&_pre]:border-border [&_pre]:p-4 [&_pre]:overflow-x-auto [&_pre]:text-xs
                [&_pre_code]:bg-transparent [&_pre_code]:px-0 [&_pre_code]:py-0
                [&_table]:border-collapse [&_table]:w-full [&_table]:text-sm
                [&_th]:text-label [&_th]:text-gold [&_th]:text-left [&_th]:pb-3 [&_th]:border-b [&_th]:border-border
                [&_td]:py-2.5 [&_td]:text-muted-light [&_td]:border-b [&_td]:border-border/50
                [&_blockquote]:border-l-2 [&_blockquote]:border-gold [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted-light
                [&_hr]:border-border [&_hr]:my-8
                [&_a]:text-gold [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-gold-light
              "
              dangerouslySetInnerHTML={{
                __html: formatMarkdown(post.content),
              }}
            />
          </Reveal>
        </div>
      </section>

      {/* Author / Share */}
      <section className="pb-16 md:pb-20">
        <div className="max-w-[800px] mx-auto px-6 md:px-10">
          <LineReveal className="mb-8" />
          <Reveal>
            <div className="flex items-center gap-6">
              <div className="relative w-14 h-14 rounded-full overflow-hidden shrink-0">
                <Image
                  src="/images/hero-portrait.jpg"
                  alt="Arjun Mehta"
                  fill
                  className="object-cover"
                  sizes="56px"
                />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  Arjun Mehta
                </p>
                <p className="text-xs text-muted">
                  AI/ML Engineer at Google DeepMind
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Next Article */}
      <section className="py-20 md:py-28 bg-surface border-t border-border">
        <div className="max-w-[800px] mx-auto px-6 md:px-10">
          <Reveal>
            <p className="text-label text-muted mb-4">Next Article</p>
          </Reveal>
          <Link href={`/blog/${nextPost.id}`} className="group block">
            <Reveal delay={0.1}>
              <h2 className="heading-editorial text-2xl md:text-4xl text-foreground group-hover:text-gold transition-colors duration-500">
                {nextPost.title}
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="flex items-center gap-2 mt-4 text-label text-muted group-hover:text-gold transition-colors duration-300">
                <span>Read Article</span>
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

/**
 * Simple markdown-to-HTML converter for blog content.
 * Handles headings, code blocks, bold, italic, lists, tables, hr, links.
 */
function formatMarkdown(md: string): string {
  let html = md.trim();

  // Code blocks (```...```)
  html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (_match, lang, code) => {
    return `<pre><code class="language-${lang || ""}">${escapeHtml(code.trim())}</code></pre>`;
  });

  // Inline code
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");

  // Tables
  html = html.replace(
    /(\|.+\|)\n(\|[-| :]+\|)\n((?:\|.+\|\n?)+)/g,
    (_match, headerRow: string, _separator: string, bodyRows: string) => {
      const headers = headerRow
        .split("|")
        .filter((c: string) => c.trim())
        .map((c: string) => `<th>${c.trim()}</th>`)
        .join("");
      const rows = bodyRows
        .trim()
        .split("\n")
        .map((row: string) => {
          const cells = row
            .split("|")
            .filter((c: string) => c.trim())
            .map((c: string) => `<td>${c.trim()}</td>`)
            .join("");
          return `<tr>${cells}</tr>`;
        })
        .join("");
      return `<table><thead><tr>${headers}</tr></thead><tbody>${rows}</tbody></table>`;
    }
  );

  // Headings
  html = html.replace(/^### (.+)$/gm, "<h3>$1</h3>");
  html = html.replace(/^## (.+)$/gm, "<h2>$1</h2>");

  // Horizontal rules
  html = html.replace(/^---$/gm, "<hr />");

  // Bold
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

  // Italic
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");

  // Links
  html = html.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
  );

  // Unordered lists
  html = html.replace(/^- (.+)$/gm, "<li>$1</li>");
  html = html.replace(/((?:<li>.+<\/li>\n?)+)/g, "<ul>$1</ul>");

  // Paragraphs — wrap remaining lines
  html = html
    .split("\n\n")
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return "";
      if (
        trimmed.startsWith("<") ||
        trimmed.startsWith("```")
      )
        return trimmed;
      return `<p>${trimmed.replace(/\n/g, "<br />")}</p>`;
    })
    .join("\n");

  return html;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
