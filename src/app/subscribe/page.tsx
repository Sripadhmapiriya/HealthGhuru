"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useAuthModal } from "@/context/AuthModalContext";
import { motion } from "framer-motion";
import {
  Check,
  Sparkles,
  Shield,
  Star,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Lock,
  Copy,
  CheckCheck,
  CreditCard,
  Smartphone,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { PillBadge } from "@/components/ui/PillBadge";
import { SubscriptionPlan, DEFAULT_SUBSCRIPTION_PLANS } from "@/lib/types/subscription-plan";

const FAQS = [
  {
    q: "Can I cancel my subscription anytime?",
    a: "Yes, you can cancel or switch your subscription tier at any time with a single click from your account dashboard with no hidden fees.",
  },
  {
    q: "What is included in the digital magazine access?",
    a: "Members get full digital and high-resolution PDF access to every issue of HealthGhuru Magazine, including back-issues.",
  },
  {
    q: "What payment methods are supported?",
    a: "We support instant Dynamic UPI QR Code payments (GPay, PhonePe, Paytm, BHIM, Navi) and secure Razorpay Credit/Debit cards & NetBanking checkout.",
  },
  {
    q: "Are the health articles verified by experts?",
    a: "Yes, 100% of our clinical reports and articles are reviewed by medical professionals and backed by peer-reviewed clinical citations.",
  },
];

export default function SubscribePage() {
  const { data: session, update } = useSession();
  const { openLoginModal } = useAuthModal();

  const [plans, setPlans] = useState<SubscriptionPlan[]>(DEFAULT_SUBSCRIPTION_PLANS);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [checkoutStep, setCheckoutStep] = useState<"plans" | "checkout" | "success">("plans");
  const [checkoutEmail, setCheckoutEmail] = useState("");
  const [checkoutName, setCheckoutName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [subError, setSubError] = useState<string | null>(null);

  // Dynamic Payment Settings from Admin
  const [paymentSettings, setPaymentSettings] = useState<{
    razorpay_enabled: boolean;
    upi_qr_enabled: boolean;
    business_upi_id: string;
    razorpay_key_id: string;
    gst_rate: number;
  }>({
    razorpay_enabled: false,
    upi_qr_enabled: true,
    business_upi_id: 'manishmadhava91@okicici',
    razorpay_key_id: '',
    gst_rate: 18,
  });
  const [paymentMode, setPaymentMode] = useState<'upi' | 'razorpay'>('upi');
  const [selectedUpiApp, setSelectedUpiApp] = useState('GPay');
  const [utrReference, setUtrReference] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);

  // Fetch dynamic payment settings
  useEffect(() => {
    fetch('/api/payment-settings')
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.settings) {
          setPaymentSettings(data.settings);
          if (data.settings.razorpay_enabled && !data.settings.upi_qr_enabled) {
            setPaymentMode('razorpay');
          }
        }
      })
      .catch((err) => console.error('Error fetching payment settings:', err));
  }, []);

  // Fetch dynamic plans from DB
  useEffect(() => {
    fetch('/api/subscription-plans', { cache: 'no-store' })
      .then((r) => r.json())
      .then((data) => {
        if (data.success && Array.isArray(data.plans) && data.plans.length > 0) {
          setPlans(data.plans);
        }
      })
      .catch((err) => console.error('Error fetching subscription plans:', err));
  }, []);

  useEffect(() => {
    if (session?.user) {
      setCheckoutEmail(session.user.email || "");
      setCheckoutName(session.user.name || "");
    }
  }, [session]);

  const handleSelectPlan = (planId: string) => {
    if (!session?.user) {
      openLoginModal({
        initialMode: "signin",
        intentTitle: "Member Account Required",
        intentSubtitle: "Please sign in or create an account to activate your subscription tier.",
        onSuccess: () => {
          setSelectedPlanId(planId);
          setCheckoutStep("checkout");
          window.scrollTo({ top: 0, behavior: "smooth" });
        },
      });
      return;
    }

    setSelectedPlanId(planId);
    setCheckoutStep("checkout");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const activePlanObj =
    plans.find((p) => p.id === selectedPlanId) ||
    plans.find((p) => p.is_recommended) ||
    plans[0] ||
    DEFAULT_SUBSCRIPTION_PLANS[0];

  const planBasePrice = activePlanObj.price || 0;
  const isFreePlan = planBasePrice === 0;
  const effectiveGstRate = typeof paymentSettings.gst_rate === 'number' ? paymentSettings.gst_rate : 18;
  const gstAmount = isFreePlan ? 0 : Math.round(planBasePrice * (effectiveGstRate / 100) * 100) / 100;
  const totalPayable = isFreePlan ? 0 : planBasePrice + gstAmount;
  const activeUpiId = paymentSettings.business_upi_id || 'manishmadhava91@okicici';

  const upiDeepLink = `upi://pay?pa=${activeUpiId}&pn=HealthGhuru&am=${totalPayable}&cu=INR&tn=${encodeURIComponent(
    `HealthGhuru-Sub-${activePlanObj.name}`
  )}`;
  const qrCodeImgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(
    upiDeepLink
  )}`;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(activeUpiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (typeof window !== "undefined" && (window as any).Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const activateSubscriptionBackend = async (method: string, refId?: string) => {
    setSubmitting(true);
    setSubError(null);

    try {
      const res = await fetch("/api/user/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId: activePlanObj.id,
          planName: activePlanObj.name,
          billingCycle: activePlanObj.duration_label,
          price: totalPayable,
          name: checkoutName,
          email: checkoutEmail,
          paymentMethod: method,
          utrNumber: refId || utrReference.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to activate subscription.");
      }

      // Update session state
      if (typeof update === "function") {
        await update({
          tier: activePlanObj.id,
          adsEnabled: false,
          isSubscribed: true,
        });
      }

      // Dispatch global window event for instant reactivity
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("hg_subscription_changed", {
            detail: {
              tier: activePlanObj.id,
              isSubscribed: true,
              adsEnabled: false,
            },
          })
        );
      }

      setCheckoutStep("success");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      setSubError(err?.message || "An error occurred while activating your plan.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRazorpaySubscription = async () => {
    setSubmitting(true);
    setSubError(null);

    const loaded = await loadRazorpayScript();
    if (!loaded) {
      setSubError("Failed to load Razorpay payment gateway. Please use UPI QR code.");
      setSubmitting(false);
      return;
    }

    try {
      const orderRes = await fetch("/api/payments/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: totalPayable,
          receipt: `sub_${Date.now()}`,
          notes: {
            plan_id: activePlanObj.id,
            plan_name: activePlanObj.name,
          },
        }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok || !orderData.success) {
        throw new Error(orderData.error || "Failed to initialize Razorpay checkout");
      }

      const options = {
        key: orderData.key_id,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "HealthGhuru Membership",
        description: `Plan: ${activePlanObj.name}`,
        image: "/images/logo_transparent.png",
        order_id: orderData.order_id,
        handler: async function (response: any) {
          // Verify on backend
          try {
            const verifyRes = await fetch("/api/payments/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                ...response,
                payment_type: "subscription",
                metadata: {
                  userId: session?.user?.id,
                  planId: activePlanObj.id,
                  billingCycle: activePlanObj.duration_label,
                },
              }),
            });
            const verifyData = await verifyRes.json();
            if (!verifyData.success) {
              throw new Error(verifyData.error || "Signature verification failed");
            }

            await activateSubscriptionBackend("razorpay", response.razorpay_payment_id);
          } catch (e: any) {
            setSubError(e.message || "Payment verification failed.");
            setSubmitting(false);
          }
        },
        prefill: {
          name: checkoutName,
          email: checkoutEmail,
        },
        theme: {
          color: "#16A34A",
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", function (resp: any) {
        setSubError(resp.error?.description || "Payment failed. Please try again.");
        setSubmitting(false);
      });
      rzp.open();
    } catch (err: any) {
      setSubError(err.message || "Error preparing checkout.");
      setSubmitting(false);
    }
  };

  const handleCompleteSubscription = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkoutEmail || !checkoutEmail.includes("@")) return;

    if (!session?.user) {
      openLoginModal({
        initialMode: "signin",
        intentTitle: "Member Account Required",
        intentSubtitle: "Please sign in to complete subscription activation.",
        onSuccess: () => {
          handleCompleteSubscription(e);
        },
      });
      return;
    }

    if (isFreePlan) {
      await activateSubscriptionBackend("free");
      return;
    }

    if (paymentMode === "razorpay") {
      await handleRazorpaySubscription();
      return;
    }

    if (paymentMode === "upi") {
      if (!utrReference.trim() || utrReference.trim().length < 6) {
        setSubError("Please enter the 12-digit UPI / UTR Transaction Reference Number from your payment receipt.");
        return;
      }
      await activateSubscriptionBackend("upi", utrReference);
      return;
    }
  };

  return (
    <div className="min-h-screen bg-cream pb-24 relative overflow-hidden font-body">
      {/* Background Decorative Rings */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Navbar */}
      <header className="bg-white border-b border-primary/10 py-4 sm:py-5 sticky top-0 z-30 shadow-xs">
        <div className="site-container flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 text-text-secondary hover:text-primary transition-colors text-sm font-heading font-medium">
            <ArrowLeft size={16} /> Back to Home
          </Link>
          <Link href="/" className="relative w-44 sm:w-52 h-12 flex items-center">
            <Image
              src="/images/logo_transparent.png"
              alt="HealthGhuru Logo"
              fill
              sizes="(max-width: 640px) 176px, 208px"
              className="object-contain"
              priority
            />
          </Link>
          {session?.user ? (
            <span className="text-xs sm:text-sm font-heading font-semibold text-emerald-800">
              Signed in as {session.user.name || session.user.email}
            </span>
          ) : (
            <button
              type="button"
              onClick={() => openLoginModal({ initialMode: "signin" })}
              className="text-xs sm:text-sm font-heading font-semibold text-primary hover:underline cursor-pointer"
            >
              Already a member? Sign In
            </button>
          )}
        </div>
      </header>

      {/* Step 1: Plan Selection */}
      {checkoutStep === "plans" && (
        <main className="site-container pt-12 sm:pt-16">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <PillBadge active className="mb-4 inline-flex gap-1.5"><Sparkles size={14} /> HealthGhuru Membership</PillBadge>
            <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl text-dark leading-tight mb-4 font-bold">
              Invest in Your Longevity & Daily Wellness
            </h1>
            <p className="text-text-secondary text-base sm:text-xl leading-relaxed max-w-2xl mx-auto">
              Join our community of over 50,000+ proactive readers enjoying science-backed health insights, ad-free reading, and exclusive digital magazine editions.
            </p>
          </div>

          {/* Dynamic Pricing Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto items-stretch">
            {plans.map((plan) => {
              const isPopular = plan.is_recommended;

              return (
                <motion.div
                  key={plan.id}
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.3 }}
                  className={`relative rounded-3xl p-7 sm:p-8 flex flex-col justify-between transition-all ${
                    isPopular
                      ? "bg-white border-2 border-primary shadow-2xl ring-4 ring-primary/10"
                      : "bg-white/90 border border-primary/15 shadow-lg"
                  }`}
                >
                  {/* Badge */}
                  {plan.is_recommended && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#f06d2f] to-[#ea580c] text-white text-xs font-heading font-extrabold px-4 py-1 rounded-full shadow-md uppercase tracking-wider flex items-center gap-1">
                      <Sparkles size={12} /> Recommended
                    </div>
                  )}

                  <div>
                    <h2 className="font-display text-2xl text-dark mb-1 font-bold">{plan.name}</h2>
                    <p className="text-text-secondary text-xs mb-5 font-mono">
                      Duration: {plan.duration_months} Month(s)
                    </p>

                    {/* Price */}
                    <div className="mb-6 pb-6 border-b border-border">
                      <div className="flex items-baseline gap-1">
                        <span className="font-display text-3xl sm:text-4xl font-extrabold text-dark">
                          ₹{plan.price}
                        </span>
                        <span className="text-text-muted text-xs font-mono">
                          / {plan.duration_label}
                        </span>
                      </div>
                    </div>

                    {/* Features */}
                    <ul className="space-y-3 mb-8">
                      {plan.benefits && plan.benefits.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-text-primary">
                          <Check size={16} className="text-primary shrink-0 mt-0.5" />
                          <span className="leading-snug">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button
                    variant={isPopular ? "accent" : "primary"}
                    size="lg"
                    onClick={() => handleSelectPlan(plan.id)}
                    className="w-full shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    Select {plan.name} <ArrowRight size={16} />
                  </Button>
                </motion.div>
              );
            })}
          </div>

          {/* Trust Banner */}
          <div className="mt-16 max-w-4xl mx-auto bg-white rounded-2xl p-6 sm:p-8 border border-primary/10 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <Shield size={24} />
              </div>
              <div>
                <h3 className="font-heading font-bold text-dark text-base">Risk-Free 30-Day Guarantee</h3>
                <p className="text-xs sm:text-sm text-text-secondary">If you are not completely satisfied, cancel anytime with one click.</p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-accent font-bold text-sm">
              <Star size={16} className="fill-accent" />
              <Star size={16} className="fill-accent" />
              <Star size={16} className="fill-accent" />
              <Star size={16} className="fill-accent" />
              <Star size={16} className="fill-accent" />
              <span className="ml-1 text-dark font-heading">4.9 / 5 Rating</span>
            </div>
          </div>

          {/* FAQs */}
          <div className="mt-20 max-w-3xl mx-auto">
            <h2 className="font-display text-2xl sm:text-3xl text-dark text-center mb-8 font-bold">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {FAQS.map((faq, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 border border-border shadow-2xs">
                  <h4 className="font-heading font-bold text-dark text-base sm:text-lg mb-2 flex items-start gap-2.5">
                    <HelpCircle size={18} className="text-primary shrink-0 mt-0.5" />
                    {faq.q}
                  </h4>
                  <p className="text-text-secondary text-sm leading-relaxed pl-7">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </main>
      )}

      {/* Step 2: Checkout / Registration Flow */}
      {checkoutStep === "checkout" && (
        <main className="site-container min-h-[calc(100vh-140px)] flex flex-col justify-center py-10 sm:py-16 px-4">
          <div className="w-full max-w-xl mx-auto">
            <button
              type="button"
              onClick={() => setCheckoutStep("plans")}
              className="inline-flex items-center gap-2 text-text-secondary hover:text-primary transition-colors text-sm font-heading font-medium mb-6 cursor-pointer"
            >
              <ArrowLeft size={16} /> Back to Plan Selection
            </button>

            <div className="bg-white rounded-3xl shadow-xl border border-primary/10 p-6 sm:p-10 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-2 bg-[#CBF2DB]" />

              <div className="flex items-center justify-between pb-6 border-b border-border mb-6">
                <div>
                  <span className="text-xs font-mono text-primary uppercase tracking-wider font-semibold">Selected Membership</span>
                  <h2 className="font-display text-2xl sm:text-3xl text-dark font-bold">{activePlanObj.name}</h2>
                </div>
                <div className="text-right">
                  <span className="font-display text-3xl font-bold text-dark">
                    ₹{activePlanObj.price}
                  </span>
                  <span className="text-text-muted text-xs block">/ {activePlanObj.duration_label}</span>
                </div>
              </div>

              <form onSubmit={handleCompleteSubscription} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="block text-xs font-heading font-semibold uppercase tracking-wider text-text-primary">
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex Morgan"
                    value={checkoutName}
                    onChange={(e) => setCheckoutName(e.target.value)}
                    className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm text-dark focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-heading font-semibold uppercase tracking-wider text-text-primary">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={checkoutEmail}
                    onChange={(e) => setCheckoutEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm text-dark focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                  />
                </div>

                {/* Free Plan Notice */}
                {isFreePlan ? (
                  <div className="p-4 rounded-2xl bg-surface-alt border border-border/80 flex items-start gap-3 mt-4">
                    <Lock size={18} className="text-primary shrink-0 mt-0.5" />
                    <div className="text-xs text-text-secondary leading-relaxed">
                      <span className="font-semibold text-dark block mb-0.5">Free Member Access</span>
                      No payment required. Community features are activated immediately for your account.
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Billing Summary Box */}
                    <div className="rounded-2xl p-5 bg-[#CBF2DB] border border-emerald-300 text-slate-800 space-y-2">
                      <div className="flex items-center justify-between text-xs text-slate-700">
                        <span>Plan Base Fee:</span>
                        <span className="font-mono font-bold text-slate-900">₹{planBasePrice.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-slate-700 pb-2 border-b border-emerald-300/80">
                        <span>GST ({effectiveGstRate}%):</span>
                        <span className="font-mono font-bold text-slate-900">₹{gstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                      </div>
                      <div className="flex items-center justify-between pt-1">
                        <span className="font-heading font-extrabold text-sm sm:text-base text-slate-950">
                          Total Payable Amount:
                        </span>
                        <span className="font-heading font-black text-xl sm:text-2xl text-emerald-950">
                          ₹{totalPayable.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>

                    {/* Gateway Selectors */}
                    {paymentSettings.razorpay_enabled && paymentSettings.upi_qr_enabled && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => setPaymentMode('upi')}
                          className={`p-3.5 rounded-xl border-2 text-left transition-all cursor-pointer ${
                            paymentMode === 'upi'
                              ? 'border-[#16A34A] bg-emerald-50/70 shadow-xs'
                              : 'border-gray-200 bg-white hover:border-gray-300'
                          }`}
                        >
                          <div className="font-heading font-bold text-xs sm:text-sm text-gray-900 flex items-center justify-between">
                            <span>Dynamic UPI QR Code</span>
                            {paymentMode === 'upi' && <span className="w-2 h-2 rounded-full bg-[#16A34A]" />}
                          </div>
                          <div className="text-[11px] text-gray-500 mt-0.5">
                            GPay, PhonePe, Paytm, BHIM
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => setPaymentMode('razorpay')}
                          className={`p-3.5 rounded-xl border-2 text-left transition-all cursor-pointer ${
                            paymentMode === 'razorpay'
                              ? 'border-[#f06d2f] bg-orange-50/70 shadow-xs'
                              : 'border-gray-200 bg-white hover:border-gray-300'
                          }`}
                        >
                          <div className="font-heading font-bold text-xs sm:text-sm text-gray-900 flex items-center justify-between">
                            <span>Razorpay Gateway</span>
                            {paymentMode === 'razorpay' && <span className="w-2 h-2 rounded-full bg-[#f06d2f]" />}
                          </div>
                          <div className="text-[11px] text-gray-500 mt-0.5">
                            Credit/Debit Cards &amp; NetBanking
                          </div>
                        </button>
                      </div>
                    )}

                    {/* UPI QR Payment Container */}
                    {paymentMode === 'upi' && paymentSettings.upi_qr_enabled && (
                      <div className="border border-emerald-300/80 rounded-2xl p-5 sm:p-6 bg-white flex flex-col items-center justify-center text-center space-y-4 shadow-xs">
                        {/* App selector */}
                        <div className="flex gap-1.5 flex-wrap justify-center">
                          {['GPay', 'PhonePe', 'Paytm', 'Navi', 'BHIM'].map((app) => (
                            <button
                              key={app}
                              type="button"
                              onClick={() => setSelectedUpiApp(app)}
                              className={`px-3 py-1 rounded-lg text-xs font-heading font-bold transition-all cursor-pointer ${
                                selectedUpiApp === app
                                  ? 'bg-[#16A34A] text-white shadow-xs'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              {app}
                            </button>
                          ))}
                        </div>

                        {/* QR Code image */}
                        <div className="p-3 bg-white border border-emerald-100 rounded-2xl shadow-sm">
                          <img
                            src={qrCodeImgUrl}
                            alt="UPI QR Code"
                            width={190}
                            height={190}
                            className="w-44 h-44 object-contain"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        </div>

                        <div className="text-xs text-gray-600">
                          Scan with <strong className="text-gray-900">{selectedUpiApp}</strong> to pay <strong className="text-emerald-700 font-bold">₹{totalPayable.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong>
                        </div>

                        {/* Copy UPI ID */}
                        <button
                          type="button"
                          onClick={handleCopyUpi}
                          className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-xs font-mono text-gray-700 transition-all cursor-pointer"
                        >
                          <span className="text-gray-500 font-sans text-[11px]">UPI ID:</span>
                          <strong className="text-gray-900">{activeUpiId}</strong>
                          {copiedUpi ? <CheckCheck size={13} className="text-emerald-600" /> : <Copy size={13} className="text-gray-400" />}
                        </button>

                        {/* 12-digit UTR input */}
                        <div className="w-full text-left pt-2 space-y-1">
                          <label className="text-xs font-semibold text-gray-800 block">
                            Enter 12-digit UPI / UTR Reference No. <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={utrReference}
                            onChange={(e) => setUtrReference(e.target.value)}
                            placeholder="e.g. 421512345678"
                            className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-hidden focus:border-[#16A34A] focus:bg-white text-xs font-mono"
                          />
                          <span className="text-[11px] text-gray-500 block">
                            Enter the 12-digit transaction number from your UPI receipt.
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Razorpay Gateway Notice */}
                    {paymentMode === 'razorpay' && paymentSettings.razorpay_enabled && (
                      <div className="border border-orange-200 bg-orange-50/40 rounded-2xl p-6 text-center space-y-2">
                        <div className="w-10 h-10 rounded-full bg-orange-100 text-[#f06d2f] flex items-center justify-center mx-auto">
                          <Sparkles size={20} />
                        </div>
                        <h4 className="font-heading font-bold text-sm text-gray-900">
                          Razorpay Standard Checkout
                        </h4>
                        <p className="text-xs text-gray-600 max-w-sm mx-auto">
                          Click below to launch secure payment. Credit cards, Debit cards, NetBanking, and Wallets are accepted.
                        </p>
                      </div>
                    )}
                  </>
                )}

                {subError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
                    {subError}
                  </div>
                )}

                <Button
                  variant="accent"
                  size="md"
                  type="submit"
                  disabled={submitting}
                  className="w-full mt-4 flex items-center justify-center gap-2 shadow-md h-12 text-sm rounded-full disabled:opacity-60 cursor-pointer font-heading font-bold"
                >
                  {submitting ? (
                    "Processing Activation..."
                  ) : isFreePlan ? (
                    `Activate ${activePlanObj.name}`
                  ) : paymentMode === 'razorpay' ? (
                    <>
                      <Sparkles size={16} /> Pay ₹{totalPayable.toLocaleString('en-IN', { minimumFractionDigits: 2 })} with Razorpay
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={16} /> Confirm UPI Payment &amp; Activate (₹{totalPayable.toLocaleString('en-IN', { minimumFractionDigits: 2 })})
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </main>
      )}

      {/* Step 3: Success Confirmation */}
      {checkoutStep === "success" && (
        <main className="site-container min-h-[calc(100vh-140px)] flex items-center justify-center py-10 sm:py-16 px-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="w-full max-w-md mx-auto bg-white rounded-3xl shadow-xl border border-primary/15 p-6 sm:p-8 text-center relative overflow-hidden"
          >
            {/* Top decorative accent line */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#CBF2DB]" />

            {/* Emerald Checkmark Badge */}
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-emerald-400/20 blur-md" />
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 bg-emerald-50 border border-emerald-200 text-primary rounded-full flex items-center justify-center shadow-xs">
                <CheckCircle2 size={32} className="text-primary" />
              </div>
            </div>

            <h2 className="font-display text-2xl sm:text-3xl text-dark mb-2 tracking-tight font-bold">
              Welcome to HealthGhuru!
            </h2>
            <p className="text-text-secondary text-xs sm:text-sm leading-relaxed mb-6 font-body max-w-sm mx-auto">
              Your <strong className="text-primary font-semibold">{activePlanObj.name}</strong> has been successfully activated for <strong className="text-dark font-medium">{checkoutEmail || "your account"}</strong>.
            </p>

            {/* Details Summary Box */}
            <div className="bg-surface/90 rounded-2xl p-4 sm:p-5 border border-border/80 text-xs sm:text-sm space-y-2 mb-6 text-left">
              <div className="flex items-center justify-between pb-2 border-b border-border/50">
                <span className="text-text-muted">Plan:</span>
                <span className="font-heading font-semibold text-dark flex items-center gap-1.5">
                  {activePlanObj.name}
                  {activePlanObj.is_recommended && (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                      VIP
                    </span>
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-border/50">
                <span className="text-text-muted">Billing Duration:</span>
                <span className="font-heading font-semibold text-dark">
                  {activePlanObj.duration_label} ({activePlanObj.duration_months} Month(s))
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-muted">Status:</span>
                <span className="font-heading font-semibold text-primary flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Active &amp; Verified
                </span>
              </div>
            </div>

            {/* Pill Buttons */}
            <div className="flex flex-row items-center justify-center gap-3">
              <Link href="/">
                <button
                  type="button"
                  className="h-9 px-4 sm:px-5 rounded-full text-xs font-heading font-semibold text-white bg-gradient-accent hover:opacity-95 active:scale-[0.98] shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer"
                >
                  Explore Feed <ArrowRight size={13} />
                </button>
              </Link>
              <Link href="/magazines">
                <button
                  type="button"
                  className="h-9 px-4 sm:px-5 rounded-full text-xs font-heading font-semibold text-primary bg-white border border-primary/30 hover:border-primary hover:bg-primary/5 active:scale-[0.98] shadow-xs transition-all flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer"
                >
                  Browse Magazines
                </button>
              </Link>
            </div>
          </motion.div>
        </main>
      )}
    </div>
  );
}
