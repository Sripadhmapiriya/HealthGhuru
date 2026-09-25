/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Mail,
  MapPin,
  Send,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Clock,
  Phone,
  MessageSquare,
  User,
  Sparkles,
  ArrowRight,
  Stethoscope,
  Building2,
  HelpCircle,
  ChevronDown,
  AlertTriangle,
  HeartHandshake,
  Check,
  Copy,
  Lock,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const INQUIRY_CATEGORIES = [
  { id: 'General Inquiry', label: 'General Inquiry', icon: HeartHandshake },
  { id: 'Editorial & Fact-Check', label: 'Editorial & Fact-Check', icon: Stethoscope },
  { id: 'Hospital & Doctor Partnership', label: 'Hospital Partnership', icon: Building2 },
  { id: 'Advertising & Sponsorship', label: 'Advertising', icon: Sparkles },
  { id: 'Website Feedback', label: 'Feedback', icon: MessageSquare },
];

const FAQS = [
  {
    q: 'How fast will the HealthGhuru editorial team reply to my message?',
    a: 'Our editorial desk and patient support coordinators review inquiries continuously. You can typically expect a verified clinical or administrative response within 12 to 24 business hours.',
  },
  {
    q: 'Can medical practitioners or hospitals publish clinical articles on HealthGhuru?',
    a: 'Yes. We welcome verified medical specialists, certified surgeons, and healthcare institutions to submit peer-reviewed clinical articles, case observations, and health awareness guides through our editorial desk.',
  },
  {
    q: 'How can our hospital, pharmaceutical brand, or clinic advertise?',
    a: 'We offer targeted banner placements, sponsored condition guides, medical webinars, and doctor directory promotions. Select "Advertising" in the form above or email us directly at advertise@healthghuru.in.',
  },
  {
    q: 'Does HealthGhuru provide direct emergency medical consultations?',
    a: 'No. HealthGhuru is an evidence-based digital health news and patient education publication. If you or someone around you is facing an acute medical crisis, please call your local emergency hotline (108 / 112 in India, 911 in the US) immediately.',
  },
];

export function ContactClient() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState('General Inquiry');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('info@healthghuru.in');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!message.trim()) {
      setErrorMsg('Please type your inquiry or message.');
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
          phone: phone.trim() || undefined,
          language: 'English',
          subject: `${category} from ${name.trim()}`,
          message: message.trim(),
          category,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setIsSuccess(true);
        setName('');
        setEmail('');
        setPhone('');
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
    <div className="w-full space-y-10 sm:space-y-14 animate-in fade-in duration-300">
      
      {/* ── 1. MILD DARK GREEN HEALTHCARE HERO BANNER ── */}
      <section className="relative w-full bg-gradient-to-b from-[#0a4632] via-[#0d5940] to-[#073827] text-white overflow-hidden pt-8 sm:pt-14 pb-14 sm:pb-20 border-b border-emerald-400/25 shadow-xl">
        
        {/* Soft Ambient Radiance Glows */}
        <div className="absolute top-0 left-1/4 w-[420px] h-[420px] bg-emerald-400/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#f06d2f]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(#34d399_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

        <div className="max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-heading font-medium text-emerald-200/90 mb-6">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span className="text-emerald-400/50">/</span>
            <span className="text-white font-bold">Contact Us</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Hero Content */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="lg:col-span-7 space-y-5 sm:space-y-6"
            >
              
              {/* Live Editorial Desk Badge */}
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-emerald-900/50 border border-emerald-400/40 text-emerald-100 text-xs sm:text-sm font-heading font-bold shadow-xs backdrop-blur-md">
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-90"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-300 shadow-[0_0_8px_#34d399]"></span>
                </span>
                <span>24/7 Verified Health Editorial &amp; Support Desk</span>
              </div>

              {/* Main Headline */}
              <h1 className="font-heading font-black text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.12]">
                We&apos;re Here For Your{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 via-white to-amber-300 drop-shadow-sm">
                  Health Journey
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-sm sm:text-base lg:text-lg text-emerald-50/90 font-body leading-relaxed max-w-2xl">
                Have a clinical question, story tip, hospital partnership request, or editorial feedback? Reach out to our verified healthcare journalists, doctor advisors, and patient support team.
              </p>

              {/* Trust Badges Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 pt-2">
                {[
                  { icon: Stethoscope, label: 'Medical Reviewers', desc: 'Clinical Oversight' },
                  { icon: Clock, label: '< 24h Response', desc: 'Prompt Assistance' },
                  { icon: ShieldCheck, label: '100% Confidential', desc: 'Secure & Private' },
                  { icon: Building2, label: 'Hospital Network', desc: 'Direct Partnerships' },
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={idx}
                      className="bg-emerald-950/40 hover:bg-emerald-950/60 border border-emerald-400/30 rounded-2xl p-3 sm:p-3.5 backdrop-blur-md transition-all group shadow-xs hover:border-emerald-300/50"
                    >
                      <Icon className="w-5 h-5 text-amber-300 group-hover:scale-110 transition-transform mb-1.5" />
                      <div className="font-heading font-bold text-xs sm:text-[13px] text-white">
                        {item.label}
                      </div>
                      <div className="text-[10.5px] text-emerald-200/80 font-body">
                        {item.desc}
                      </div>
                    </div>
                  );
                })}
              </div>

            </motion.div>

            {/* Right Column: Hero Visual Graphic Banner */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
              className="lg:col-span-5"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-emerald-400/35 ring-4 ring-emerald-500/10 group">
                <div className="relative aspect-[16/10] sm:aspect-[16/9] lg:aspect-[4/3] w-full">
                  <Image
                    src="/images/contact_hero.jpg"
                    alt="HealthGhuru Healthcare Support Desk & Clinical Team"
                    fill
                    sizes="(max-width: 768px) 100vw, 550px"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/15 to-transparent" />
                </div>

                {/* Floating Overlay Badge on Hero Image */}
                <div className="absolute bottom-4 left-4 right-4 sm:bottom-5 sm:left-5 sm:right-5 bg-white/95 backdrop-blur-md rounded-2xl p-3.5 sm:p-4 border border-emerald-500/20 shadow-xl text-slate-900 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#16A34A] to-[#15803D] text-white flex items-center justify-center shrink-0 shadow-xs">
                      <Stethoscope size={20} />
                    </div>
                    <div className="min-w-0">
                      <div className="font-heading font-extrabold text-xs sm:text-sm text-slate-900 truncate">
                        Digital Clinical Desk
                      </div>
                      <div className="text-[11px] text-emerald-800 font-semibold truncate">
                        Trusted by 50,000+ Readers Daily
                      </div>
                    </div>
                  </div>
                  <div className="shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10.5px] font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                    Online
                  </div>
                </div>
              </div>
            </motion.div>

          </div>

        </div>
      </section>

      {/* ── 2. QUICK DIRECT CONTACT CHANNELS (SCROLL ANIMATED FROM LEFT & RIGHT) ── */}
      <section className="max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-10 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          
          {/* Card 1: Editorial Desk (Slides from Left on Scroll) */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group border-t-4 border-t-[#16A34A]"
          >
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 text-[#16A34A] border border-emerald-200 flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
                <Stethoscope size={22} />
              </div>
              <h3 className="font-heading font-black text-lg text-slate-900">
                Editorial &amp; Fact-Check
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-body">
                Submit health news tips, clinical research updates, doctor opinions, or request factual corrections.
              </p>
            </div>
            <div className="pt-4 mt-2 border-t border-slate-100">
              <a
                href="mailto:editor@healthghuru.in"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-heading font-bold text-[#16A34A] hover:text-[#15803D] transition-colors"
              >
                <span>editor@healthghuru.in</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </motion.div>

          {/* Card 2: Hospital & Brand Partnerships (Slides from Bottom on Scroll) */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group border-t-4 border-t-[#f06d2f]"
          >
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-xl bg-orange-50 text-[#f06d2f] border border-orange-200 flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
                <Building2 size={22} />
              </div>
              <h3 className="font-heading font-black text-lg text-slate-900">
                Hospitals &amp; Advertisers
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-body">
                Explore targeted campaigns, medical center features, doctor directories, and sponsored health webinars.
              </p>
            </div>
            <div className="pt-4 mt-2 border-t border-slate-100">
              <Link
                href="/advertise"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-heading font-bold text-[#f06d2f] hover:text-[#ea580c] transition-colors"
              >
                <span>Launch Advertiser Campaign</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>

          {/* Card 3: General Inquiries (Slides from Right on Scroll) */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group border-t-4 border-t-blue-500"
          >
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
                <HeartHandshake size={22} />
              </div>
              <h3 className="font-heading font-black text-lg text-slate-900">
                Readers &amp; General Support
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-body">
                Questions about our daily newsletter, VIP membership, website features, or general user assistance.
              </p>
            </div>
            <div className="pt-4 mt-2 border-t border-slate-100">
              <a
                href="mailto:info@healthghuru.in"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-heading font-bold text-blue-600 hover:text-blue-700 transition-colors"
              >
                <span>info@healthghuru.in</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </motion.div>

        </div>
      </section>

      {/* ── 3. MAIN CONTACT CARD (SPLIT SCROLL ANIMATION: LEFT SLIDES FROM LEFT, RIGHT SLIDES FROM RIGHT) ── */}
      <section className="max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-emerald-500/20 shadow-2xl shadow-emerald-950/5 overflow-hidden relative">
          
          {/* Top Brand Gradient Ribbon */}
          <div className="h-2.5 w-full bg-gradient-to-r from-[#16A34A] via-[#22C55E] to-[#f06d2f]" />
          
          {/* Subtle Ambient Watermark in Card */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-emerald-50/70 via-transparent to-transparent pointer-events-none" />

          <div className="p-6 sm:p-10 lg:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
              
              {/* ── Left Column: Contact Details (Slides in from LEFT on Scroll) ── */}
              <motion.div
                initial={{ opacity: 0, x: -60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="lg:col-span-5 space-y-6"
              >
                <div>
                  <div className="inline-flex items-center gap-2 text-xs font-heading font-black text-[#16A34A] uppercase tracking-wider mb-2">
                    <Sparkles size={14} />
                    <span>Direct Channels</span>
                  </div>
                  <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">
                    Official Contact Details
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-body mt-2">
                    Connect directly with HealthGhuru headquarters. Whether you have a quick clinical question or a major hospital campaign, we respond promptly.
                  </p>
                </div>

                {/* Enhanced Contact Info Cards */}
                <div className="space-y-3.5 pt-1 text-xs sm:text-sm font-body">
                  
                  {/* Email with One-Click Copy */}
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-emerald-50/90 via-emerald-50/40 to-white border border-emerald-200/80 border-l-4 border-l-[#16A34A] shadow-xs group hover:shadow-md transition-all">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#16A34A] flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                        <Mail size={19} />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[10.5px] font-bold text-emerald-800 uppercase tracking-wider font-heading">
                          General Inquiries
                        </div>
                        <a
                          href="mailto:info@healthghuru.in"
                          className="font-mono font-bold text-slate-900 hover:text-[#16A34A] transition-colors text-sm truncate block"
                        >
                          info@healthghuru.in
                        </a>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyEmail}
                      className="shrink-0 p-2 rounded-lg text-slate-500 hover:text-[#16A34A] hover:bg-white border border-transparent hover:border-emerald-200 transition-all cursor-pointer"
                      title="Copy Email Address"
                    >
                      {copiedEmail ? <Check size={16} className="text-[#16A34A]" /> : <Copy size={16} />}
                    </button>
                  </div>

                  {/* Address */}
                  <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-gradient-to-r from-orange-50/90 via-orange-50/40 to-white border border-orange-200/80 border-l-4 border-l-[#f06d2f] shadow-xs group hover:shadow-md transition-all">
                    <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#f06d2f] flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                      <MapPin size={19} />
                    </div>
                    <div>
                      <div className="text-[10.5px] font-bold text-orange-800 uppercase tracking-wider font-heading">
                        Headquarters
                      </div>
                      <div className="text-slate-900 font-bold text-sm">
                        Chennai, Tamil Nadu, India
                      </div>
                    </div>
                  </div>

                  {/* Operating Hours */}
                  <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-gradient-to-r from-blue-50/90 via-blue-50/40 to-white border border-blue-200/80 border-l-4 border-l-blue-600 shadow-xs group hover:shadow-md transition-all">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                      <Clock size={19} />
                    </div>
                    <div>
                      <div className="text-[10.5px] font-bold text-blue-800 uppercase tracking-wider font-heading">
                        Desk Working Hours
                      </div>
                      <div className="text-slate-900 font-bold text-sm">
                        Monday – Saturday: 9:00 AM – 7:00 PM IST
                      </div>
                    </div>
                  </div>

                  {/* Clinical Publishing Accreditation Notice */}
                  <div className="pt-2 p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-2">
                    <div className="flex items-center gap-2 text-emerald-900 font-heading font-bold text-xs sm:text-[13px]">
                      <ShieldCheck size={17} className="text-[#16A34A]" />
                      <span>Verified Healthcare Publishing Portal</span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed font-body">
                      HealthGhuru adheres to international digital health media guidelines, providing medically referenced news and verified healthcare directory listings.
                    </p>
                  </div>

                  {/* Emergency Notice Warning */}
                  <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
                    <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-[11px] leading-relaxed">
                      <strong>Medical Emergency Notice:</strong> HealthGhuru provides educational health journalism and does not offer direct diagnosis. In life-threatening emergencies, call 108 / 112 immediately.
                    </p>
                  </div>

                </div>
              </motion.div>

              {/* ── Right Column: Form (Slides in from RIGHT on Scroll) ── */}
              <motion.div
                initial={{ opacity: 0, x: 60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                className="lg:col-span-7"
              >
                <AnimatePresence mode="wait">
                  {isSuccess ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="py-12 text-center space-y-5 bg-emerald-50/80 rounded-3xl border border-emerald-200 p-6 sm:p-10 shadow-sm"
                    >
                      <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#16A34A] mx-auto flex items-center justify-center shadow-md">
                        <CheckCircle2 size={36} />
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900">
                          Message Sent Successfully!
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                          Thank you for connecting with HealthGhuru. Your query has been assigned to our editorial desk and we will get back to you promptly.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsSuccess(false)}
                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#16A34A] to-[#15803D] hover:brightness-105 active:scale-95 text-white text-xs font-heading font-bold shadow-md transition-all cursor-pointer inline-flex items-center gap-2"
                      >
                        <Send size={14} />
                        <span>Send Another Message</span>
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-6"
                    >
                      <div>
                        <h3 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900">
                          Send a <span className="text-[#f06d2f]">Direct Message</span>
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-500 mt-1">
                          Fill out the form below and our dedicated health team will review your inquiry.
                        </p>
                      </div>

                      {/* Inquiry Category Selector Pills */}
                      <div className="space-y-2">
                        <label className="block text-xs font-heading font-bold text-slate-700 uppercase tracking-wider">
                          Select Topic / Department <span className="text-red-500">*</span>
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {INQUIRY_CATEGORIES.map((cat) => {
                            const isSelected = category === cat.id;
                            const Icon = cat.icon;
                            return (
                              <button
                                key={cat.id}
                                type="button"
                                onClick={() => setCategory(cat.id)}
                                className={`px-3.5 py-2 rounded-xl text-xs font-heading font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                                  isSelected
                                    ? 'bg-gradient-to-r from-[#16A34A] to-[#15803D] text-white shadow-md shadow-emerald-700/20 scale-[1.02]'
                                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                }`}
                              >
                                <Icon size={13} className={isSelected ? 'text-white' : 'text-slate-500'} />
                                <span>{cat.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {errorMsg && (
                        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 animate-in fade-in">
                          <AlertCircle size={16} className="shrink-0" />
                          <span>{errorMsg}</span>
                        </div>
                      )}

                      <form onSubmit={handleSubmit} className="space-y-4">
                        
                        {/* Name & Phone Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {/* Name */}
                          <div className="space-y-1.5">
                            <label className="block text-xs font-heading font-bold text-slate-700">
                              Your Name <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                              <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                              <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Dr. / Mr. / Ms. Full Name"
                                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#16A34A] focus:border-[#16A34A] transition-all shadow-2xs font-medium"
                              />
                            </div>
                          </div>

                          {/* Phone / WhatsApp */}
                          <div className="space-y-1.5">
                            <label className="block text-xs font-heading font-bold text-slate-700">
                              Phone / WhatsApp <span className="text-slate-400 font-normal">(Optional)</span>
                            </label>
                            <div className="relative">
                              <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                              <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="+91 98765 43210"
                                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#16A34A] focus:border-[#16A34A] transition-all shadow-2xs font-medium"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Email */}
                        <div className="space-y-1.5">
                          <label className="block text-xs font-heading font-bold text-slate-700">
                            Email Address <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                              type="email"
                              required
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="name@example.com"
                              className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#16A34A] focus:border-[#16A34A] transition-all shadow-2xs font-medium"
                            />
                          </div>
                        </div>

                        {/* Message */}
                        <div className="space-y-1.5">
                          <label className="block text-xs font-heading font-bold text-slate-700">
                            Message &amp; Inquiry Details <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            required
                            rows={4}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Write your health query, editorial suggestion, or partnership request..."
                            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#16A34A] focus:border-[#16A34A] transition-all resize-none font-body shadow-2xs leading-relaxed"
                          />
                        </div>

                        {/* Submit Button with Rich Gradient & Animation */}
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full py-3.5 px-6 rounded-2xl font-heading font-black text-sm text-white bg-gradient-to-r from-[#16A34A] via-[#15803D] to-[#047857] hover:brightness-105 active:scale-98 shadow-md hover:shadow-lg hover:shadow-emerald-700/20 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer uppercase tracking-wider"
                        >
                          {isSubmitting ? (
                            <>
                              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              <span>Sending Your Message...</span>
                            </>
                          ) : (
                            <>
                              <Send size={16} />
                              <span>Send Inquiry to Editorial Desk</span>
                            </>
                          )}
                        </button>

                        <div className="text-center pt-1">
                          <span className="text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
                            <Lock size={12} className="text-[#16A34A]" />
                            <span>100% Confidential &bull; Protected under strict medical privacy ethics.</span>
                          </span>
                        </div>

                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

            </div>
          </div>
        </div>
      </section>

      {/* ── 4. FREQUENTLY ASKED QUESTIONS (FAQ) ── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-2"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-heading font-bold">
            <HelpCircle size={14} />
            <span>Got Questions?</span>
          </div>
          <h2 className="font-heading font-black text-2xl sm:text-3xl text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-body max-w-md mx-auto">
            Quick answers about reaching HealthGhuru, editorial submissions, and partnership options.
          </p>
        </motion.div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden transition-all hover:border-emerald-200"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-heading font-bold text-sm sm:text-base text-slate-900 hover:text-[#16A34A] transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    size={18}
                    className={`text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-[#16A34A]' : ''
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 sm:px-5 pb-4 sm:pb-5 text-xs sm:text-sm text-slate-600 font-body leading-relaxed border-t border-slate-100 pt-3">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </section>

    </div>
  );
}
