"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/services/api";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/experience", label: "Experience" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [about, setAbout] = useState<any>(null);

  useEffect(() => {
    api.getAbout()
      .then((res) => {
        if (res.data) setAbout(res.data);
      })
      .catch(() => {});
  }, []);

  const initials = about?.name
    ? about.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "AM";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "glass-surface py-3"
            : "bg-transparent py-5"
        }`}
      >
        <nav className="max-w-[1400px] mx-auto px-6 md:px-10 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="relative group" aria-label="Home">
            <span className="text-2xl font-serif font-semibold tracking-tight text-foreground group-hover:text-gold transition-colors duration-300">
              {initials}
            </span>
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-gold group-hover:w-full transition-all duration-500" />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-label text-muted-light hover:text-gold link-underline transition-colors duration-300"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA + Mobile Toggle */}
          <div className="flex items-center gap-6">
            <Link
              href="/contact"
              className="hidden lg:block text-label text-background bg-gold px-5 py-2.5 hover:bg-gold-light transition-colors duration-300"
            >
              Let&apos;s Talk
            </Link>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden relative w-8 h-6 flex flex-col justify-between"
              aria-label="Toggle menu"
              aria-expanded={isOpen}
            >
              <motion.span
                animate={isOpen ? { rotate: 45, y: 10 } : { rotate: 0, y: 0 }}
                className="block w-full h-[1px] bg-foreground origin-left"
              />
              <motion.span
                animate={isOpen ? { opacity: 0, x: -20 } : { opacity: 1, x: 0 }}
                className="block w-full h-[1px] bg-foreground"
              />
              <motion.span
                animate={isOpen ? { rotate: -45, y: -10 } : { rotate: 0, y: 0 }}
                className="block w-full h-[1px] bg-foreground origin-left"
              />
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-xl flex items-center justify-center"
          >
            <nav className="flex flex-col items-center gap-8">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="text-4xl md:text-5xl font-serif font-light text-foreground hover:text-gold transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-8 flex gap-6"
              >
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-label text-muted hover:text-gold transition-colors"
                >
                  GitHub
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-label text-muted hover:text-gold transition-colors"
                >
                  LinkedIn
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-label text-muted hover:text-gold transition-colors"
                >
                  Twitter
                </a>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
