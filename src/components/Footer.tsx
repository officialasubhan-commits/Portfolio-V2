"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { api } from "@/services/api";

const footerLinks = [
  {
    title: "Navigation",
    links: [
      { label: "Home", href: "/" },
      { label: "About", href: "/about" },
      { label: "Projects", href: "/projects" },
      { label: "Experience", href: "/experience" },
    ],
  },
  {
    title: "Content",
    links: [
      { label: "Blog", href: "/blog" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Social",
    links: [
      { label: "GitHub", href: "https://github.com" },
      { label: "LinkedIn", href: "https://linkedin.com" },
      { label: "Twitter / X", href: "https://twitter.com" },
      { label: "Google Scholar", href: "https://scholar.google.com" },
    ],
  },
];

export default function Footer() {
  const [about, setAbout] = useState<any>(null);

  useEffect(() => {
    api.getAbout()
      .then((res) => {
        if (res.data) setAbout(res.data);
      })
      .catch(() => {});
  }, []);

  const ownerName = about?.name || "Portfolio";
  const initials = ownerName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "PF";

  return (
    <footer className="relative bg-surface border-t border-border noise-overlay">
      {/* Top decorative line */}
      <div className="hr-gold" />

      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-16 md:py-24">
        {/* CTA Section */}
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-10 mb-16 md:mb-24">
          <div>
            <p className="text-label text-gold mb-4">Let&apos;s Create Together</p>
            <h2 className="heading-editorial text-4xl md:text-6xl lg:text-7xl text-foreground">
              Something
              <br />
              <span className="gold-gradient-text italic">Extraordinary</span>
            </h2>
          </div>
          <Link
            href="/contact"
            className="btn-magnetic border border-gold text-gold px-8 py-4 text-label hover:text-background transition-colors duration-500"
          >
            <span>Start a Conversation</span>
          </Link>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16 md:mb-24">
          {/* Contact Info */}
          <div>
            <h3 className="text-label text-gold mb-6">Contact</h3>
            <div className="space-y-3 text-sm text-muted-light">
              <a
                href={`mailto:${about?.email || "contact@example.com"}`}
                className="block hover:text-gold transition-colors duration-300"
              >
                {about?.email || "contact@example.com"}
              </a>
              <p>{about?.location || "San Francisco, CA & Remote"}</p>
            </div>
          </div>

          {footerLinks.map((col) => (
            <div key={col.title}>
              <h3 className="text-label text-gold mb-6">{col.title}</h3>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith("http") ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-muted-light hover:text-gold transition-colors duration-300"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm text-muted-light hover:text-gold transition-colors duration-300"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-border">
          <div className="flex items-center gap-4">
            <span className="text-2xl font-serif font-semibold text-foreground">
              {initials}
            </span>
            <span className="text-xs text-muted">
              {about?.title || "AI Systems Architect & Engineer"}
            </span>
          </div>
          <p className="text-xs text-muted">
            &copy; {new Date().getFullYear()} {ownerName}. All rights reserved.
          </p>
          <p className="text-xs text-muted-light italic">
            Engineering Intelligence. Building Impact.
          </p>
        </div>
      </div>
    </footer>
  );
}
