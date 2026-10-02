"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Reveal,
  TextReveal,
  LineReveal,
} from "@/components/Animations";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSubmitting(true);
    try {
      const res = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to submit message");
      }
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 5000);
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to send message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: "✉",
      label: "Email",
      value: "arjun@mehta.dev",
      href: "mailto:arjun@mehta.dev",
    },
    {
      icon: "◎",
      label: "Location",
      value: "Bengaluru, India",
    },
    {
      icon: "⟁",
      label: "GitHub",
      value: "github.com/arjun-mehta",
      href: "https://github.com",
    },
    {
      icon: "◈",
      label: "LinkedIn",
      value: "linkedin.com/in/arjun-mehta",
      href: "https://linkedin.com",
    },
  ];

  return (
    <div className="page-transition">
      {/* Header */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <Reveal>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-[1px] bg-gold" />
              <span className="text-label text-gold">Contact</span>
            </div>
          </Reveal>

          <TextReveal>
            <h1 className="heading-display text-6xl md:text-8xl lg:text-9xl text-foreground">
              Let&apos;s Create
              <br />
              <span className="italic gold-gradient-text">Together</span>
            </h1>
          </TextReveal>

          <Reveal delay={0.3}>
            <p className="text-lg text-muted-light mt-8 max-w-2xl">
              Available for select collaborations, consulting engagements, and
              interesting conversations about AI, ML, and building systems that
              matter. Let&apos;s talk.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Contact Content */}
      <section className="pb-24 md:pb-32">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* Form */}
            <div className="lg:col-span-7">
              <Reveal>
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label
                        htmlFor="contact-name"
                        className="text-label text-muted"
                      >
                        Name
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full bg-transparent border-b border-border text-foreground py-3 text-sm focus:outline-none focus:border-gold transition-colors duration-300 placeholder:text-muted/50"
                        placeholder="Your name"
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="contact-email"
                        className="text-label text-muted"
                      >
                        Email
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full bg-transparent border-b border-border text-foreground py-3 text-sm focus:outline-none focus:border-gold transition-colors duration-300 placeholder:text-muted/50"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="contact-subject"
                      className="text-label text-muted"
                    >
                      Subject
                    </label>
                    <input
                      id="contact-subject"
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData({ ...formData, subject: e.target.value })
                      }
                      className="w-full bg-transparent border-b border-border text-foreground py-3 text-sm focus:outline-none focus:border-gold transition-colors duration-300 placeholder:text-muted/50"
                      placeholder="What&apos;s this about?"
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="contact-message"
                      className="text-label text-muted"
                    >
                      Message
                    </label>
                    <textarea
                      id="contact-message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      className="w-full bg-transparent border-b border-border text-foreground py-3 text-sm focus:outline-none focus:border-gold transition-colors duration-300 resize-none placeholder:text-muted/50"
                      placeholder="Tell me about your project, idea, or question..."
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-6">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="btn-magnetic border border-gold text-gold px-10 py-4 text-label hover:text-background transition-colors duration-500 disabled:opacity-50"
                      >
                        <span>{submitting ? "Sending..." : "Send Message"}</span>
                      </button>

                      {submitted && (
                        <motion.span
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0 }}
                          className="text-sm text-gold"
                        >
                          ✓ Message sent successfully!
                        </motion.span>
                      )}
                    </div>

                    {errorMessage && (
                      <p className="text-xs text-red-400">
                        {errorMessage}
                      </p>
                    )}
                  </div>
                </form>
              </Reveal>
            </div>

            {/* Contact Info Sidebar */}
            <div className="lg:col-span-5 space-y-10">
              <Reveal delay={0.2}>
                <div className="p-8 border border-border bg-surface">
                  <h3 className="text-label text-gold mb-8">
                    Contact Information
                  </h3>
                  <div className="space-y-6">
                    {contactInfo.map((info) => (
                      <div
                        key={info.label}
                        className="flex items-start gap-4 group"
                      >
                        <span className="text-gold text-lg mt-0.5">
                          {info.icon}
                        </span>
                        <div>
                          <p className="text-label text-muted mb-1">
                            {info.label}
                          </p>
                          {info.href ? (
                            <a
                              href={info.href}
                              target={
                                info.href.startsWith("mailto")
                                  ? undefined
                                  : "_blank"
                              }
                              rel="noopener noreferrer"
                              className="text-sm text-foreground hover:text-gold transition-colors duration-300"
                            >
                              {info.value}
                            </a>
                          ) : (
                            <p className="text-sm text-foreground">
                              {info.value}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>

              <Reveal delay={0.3}>
                <div className="p-8 border border-border bg-surface">
                  <h3 className="text-label text-gold mb-4">Availability</h3>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-light animate-pulse" />
                    <span className="text-sm text-foreground">
                      Currently available
                    </span>
                  </div>
                  <p className="text-xs text-muted leading-relaxed">
                    Open to consulting engagements, research collaborations, and
                    select freelance projects. Response time: typically within 24
                    hours.
                  </p>
                </div>
              </Reveal>

              <Reveal delay={0.4}>
                <div className="p-8 border border-border bg-surface">
                  <h3 className="text-label text-gold mb-4">Let&apos;s Connect</h3>
                  <div className="flex gap-4">
                    {["GitHub", "LinkedIn", "Twitter", "Scholar"].map(
                      (social) => (
                        <a
                          key={social}
                          href="#"
                          className="text-xs text-muted border border-border px-3 py-2 hover:border-gold/40 hover:text-gold transition-all duration-300"
                        >
                          {social}
                        </a>
                      )
                    )}
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Map / Location Section */}
      <section className="py-20 md:py-28 bg-surface border-t border-border relative noise-overlay">
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10 text-center">
          <Reveal>
            <p className="text-label text-gold mb-4">Based In</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="heading-editorial text-4xl md:text-6xl text-foreground mb-4">
              Bengaluru,{" "}
              <span className="italic gold-gradient-text">India</span>
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-muted text-sm max-w-md mx-auto">
              Available for remote collaborations worldwide and in-person
              meetings in the Bengaluru area. Timezone: IST (UTC+5:30).
            </p>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
