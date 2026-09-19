/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import {
  Mail,
  MapPin,
  Send,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function ContactClient() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim()) {
      setErrorMsg('Please enter your name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!message.trim()) {
      setErrorMsg('Please enter your message.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          language: 'English',
          subject: `Inquiry from ${name.trim()}`,
          message: message.trim(),
          category: 'General Inquiry',
        }),
      });

      const data = await res.json();
      if (data.success) {
        setIsSuccess(true);
        setName('');
        setEmail('');
        setMessage('');
      } else {
        setErrorMsg(data.error?.message || 'Failed to send your message. Please try again.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl lg:max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* ── Page Hero Header (matching reference design) ── */}
      <div className="text-center space-y-2">
        <h1 className="font-heading font-black text-3xl sm:text-5xl text-[#f06d2f] tracking-tight">
          Contact Us
        </h1>
        <p className="text-sm sm:text-base text-slate-600 font-body max-w-md sm:max-w-lg mx-auto leading-relaxed">
          Get in touch with us if you have any questions or feedback
        </p>
      </div>

      {/* ── Main Contact Card with Top Orange Accent Bar ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden relative"
      >
        {/* Top Orange Brand Line */}
        <div className="h-2 w-full bg-gradient-to-r from-[#f06d2f] via-[#ff854d] to-[#16A34A]" />

        <div className="p-6 sm:p-10 lg:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* ── Left Column: Contact Details ── */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-slate-900 mb-3 tracking-tight">
                  Contact Details
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-body">
                  If you have any queries, advertisement requests, or feedback regarding HealthGhuru, feel free to contact us using the contact form below or via email.
                </p>
              </div>

              {/* Direct Info List */}
              <div className="space-y-4 pt-1 text-xs sm:text-sm font-body">
                {/* Email */}
                <div className="flex items-start gap-3">
                  <span className="font-heading font-bold text-slate-900 shrink-0">Email:</span>
                  <a
                    href="mailto:info@healthghuru.in"
                    className="font-mono font-bold text-slate-800 hover:text-[#f06d2f] transition-colors"
                  >
                    info@healthghuru.in
                  </a>
                </div>

                {/* Address */}
                <div className="flex items-start gap-3">
                  <span className="font-heading font-bold text-slate-900 shrink-0">Address:</span>
                  <span className="text-slate-700 font-medium">
                    Chennai, Tamil Nadu, India
                  </span>
                </div>

                {/* Editorial & Organization Notice */}
                <div className="pt-4 border-t border-slate-100 space-y-2 text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-800 font-heading font-bold">
                    <ShieldCheck size={16} className="text-[#16A34A]" />
                    <span>Verified Healthcare Publishing Portal</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    HealthGhuru is an evidence-based digital health media network delivering clinical news, doctor directories, and patient education.
                  </p>
                </div>
              </div>
            </div>

            {/* ── Right Column: Send a Message Form ── */}
            <div className="lg:col-span-7">
              <AnimatePresence mode="wait">
                {isSuccess ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="py-12 text-center space-y-4 bg-emerald-50/50 rounded-2xl border border-emerald-200/80 p-6"
                  >
                    <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#16A34A] mx-auto flex items-center justify-center shadow-xs">
                      <CheckCircle2 size={32} />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-heading font-extrabold text-2xl text-slate-900">
                        Message Sent Successfully!
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
                        Thank you for reaching out. Our team will review your query and get back to you shortly.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsSuccess(false)}
                      className="px-6 py-2.5 rounded-xl bg-[#f06d2f] hover:bg-[#e05a1b] text-white text-xs font-heading font-bold shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
                    >
                      Send Another Message
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-5"
                  >
                    <h3 className="font-heading font-extrabold text-xl text-slate-900">
                      Send a <span className="text-[#f06d2f]">Message</span>
                    </h3>

                    {errorMsg && (
                      <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                        <AlertCircle size={16} className="shrink-0" />
                        <span>{errorMsg}</span>
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                      {/* Name */}
                      <div className="space-y-1.5">
                        <label className="block text-xs font-heading font-bold text-slate-700">
                          Name
                        </label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Your Name"
                          className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#f06d2f] focus:border-[#f06d2f] transition-all shadow-2xs"
                        />
                      </div>

                      {/* Email */}
                      <div className="space-y-1.5">
                        <label className="block text-xs font-heading font-bold text-slate-700">
                          Email
                        </label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Your Email"
                          className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#f06d2f] focus:border-[#f06d2f] transition-all shadow-2xs"
                        />
                      </div>

                      {/* Message */}
                      <div className="space-y-1.5">
                        <label className="block text-xs font-heading font-bold text-slate-700">
                          Message
                        </label>
                        <textarea
                          required
                          rows={4}
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Type your message here..."
                          className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#f06d2f] focus:border-[#f06d2f] transition-all resize-none font-body shadow-2xs"
                        />
                      </div>

                      {/* Send Button */}
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3.5 px-6 rounded-xl font-heading font-bold text-sm text-white bg-gradient-to-r from-[#f06d2f] to-[#ff7d42] hover:brightness-105 active:scale-98 shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                      >
                        {isSubmitting ? (
                          <>
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Sending...</span>
                          </>
                        ) : (
                          <>
                            <Send size={16} />
                            <span>Send</span>
                          </>
                        )}
                      </button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </div>
      </motion.div>
    </div>
  );
}
