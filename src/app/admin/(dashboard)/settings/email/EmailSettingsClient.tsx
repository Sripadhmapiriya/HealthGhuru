'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import {
  Mail,
  Server,
  ShieldCheck,
  Send,
  Check,
  AlertCircle,
  Eye,
  EyeOff,
  Bell,
  Sparkles,
  Info,
} from 'lucide-react';

interface EmailSettingsState {
  smtp_host: string;
  smtp_port: number;
  smtp_secure: boolean;
  smtp_user: string;
  smtp_pass: string;
  from_name: string;
  from_email: string;
  admin_notification_email: string;
  notify_on_sponsorship: boolean;
  notify_on_ad_campaign: boolean;
  notify_on_subscription: boolean;
}

export function EmailSettingsClient({
  initialSettings,
}: {
  initialSettings: EmailSettingsState;
}) {
  const [settings, setSettings] = useState<EmailSettingsState>(initialSettings);
  const [showPassword, setShowPassword] = useState(false);

  // Testing State
  const [testEmailTarget, setTestEmailTarget] = useState(
    initialSettings.admin_notification_email || initialSettings.smtp_user || ''
  );
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  // Saving State
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);
    setError(null);

    try {
      const res = await fetch('/api/admin/email-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to save email settings');
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);
    } catch (err: any) {
      setError(err.message || 'An error occurred while saving.');
    } finally {
      setSaving(false);
    }
  };

  const handleSendTestEmail = async () => {
    if (!settings.smtp_user) {
      setError('Please enter your SMTP Username before sending a test.');
      return;
    }

    setTesting(true);
    setTestResult(null);
    setError(null);

    try {
      const res = await fetch('/api/admin/email-settings/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...settings,
          target_email: testEmailTarget.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setTestResult({
          success: false,
          message: data.error || 'Failed to send test email',
        });
      } else {
        setTestResult({
          success: true,
          message: data.message || 'Test email dispatched successfully!',
        });
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err.message || 'Error executing SMTP test.',
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      {/* Header matching Payment Settings Screen */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-gray-900 tracking-tight flex items-center gap-3">
            <Mail className="text-[#16A34A] w-7 h-7" />
            <span>Email &amp; SMTP Gateway Controls</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Configure SMTP credentials, sender identities, and automated notification triggers for HealthGhuru.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-heading font-bold shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
          <span>HealthGhuru Mailer Ready</span>
        </div>
      </div>

      {/* Alerts */}
      {saveSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-2xl flex items-center gap-2 shadow-xs">
          <Check className="w-4 h-4 text-[#16A34A] shrink-0" />
          <span>Email settings saved successfully! Automated notifications will use these settings.</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-800 text-xs font-semibold rounded-2xl flex items-center gap-2 shadow-xs">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* 1. SMTP Server Credentials */}
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs p-6 sm:p-8 space-y-5">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h2 className="font-heading font-extrabold text-base text-gray-900 flex items-center gap-2">
              <Server className="w-4 h-4 text-[#16A34A]" />
              <span>1. Outgoing SMTP Server Configuration</span>
            </h2>
            <span className="text-xs text-gray-400 font-mono">Host &amp; Port</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-1.5">
              <label className="block text-xs font-heading font-bold text-gray-700">
                SMTP Server Host <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={settings.smtp_host}
                onChange={(e) => setSettings({ ...settings, smtp_host: e.target.value })}
                placeholder="e.g. smtp.gmail.com or smtp.zoho.com"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono focus:outline-hidden focus:border-[#16A34A] focus:bg-white transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-heading font-bold text-gray-700">
                Port <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                value={settings.smtp_port}
                onChange={(e) => setSettings({ ...settings, smtp_port: Number(e.target.value) })}
                placeholder="465 or 587"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono focus:outline-hidden focus:border-[#16A34A] focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <input
              type="checkbox"
              id="smtp_secure"
              checked={settings.smtp_secure}
              onChange={(e) => setSettings({ ...settings, smtp_secure: e.target.checked })}
              className="w-4 h-4 rounded border-gray-300 text-[#16A34A] focus:ring-[#16A34A]"
            />
            <label htmlFor="smtp_secure" className="text-xs font-medium text-gray-700 cursor-pointer select-none">
              Use SSL / TLS Encryption (Recommended <strong>true</strong> for Port 465, <strong>false</strong> for Port 587/STARTTLS)
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="space-y-1.5">
              <label className="block text-xs font-heading font-bold text-gray-700">
                SMTP Username / Sender Email <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={settings.smtp_user}
                onChange={(e) => setSettings({ ...settings, smtp_user: e.target.value })}
                placeholder="e.g. notifications@healthghuru.com"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono focus:outline-hidden focus:border-[#16A34A] focus:bg-white transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-heading font-bold text-gray-700">
                SMTP Password / Google App Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={settings.smtp_pass}
                  onChange={(e) => setSettings({ ...settings, smtp_pass: e.target.value })}
                  placeholder="Password or 16-char App Password"
                  className="w-full px-4 py-2.5 pr-10 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono focus:outline-hidden focus:border-[#16A34A] focus:bg-white transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
          </div>

          <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-xl text-xs text-emerald-900 space-y-1">
            <div className="font-heading font-bold flex items-center gap-1.5 text-emerald-800">
              <Info size={14} /> Quick Setup Guide:
            </div>
            <p className="text-[11px] leading-relaxed">
              <strong>Gmail users:</strong> Generate a 16-character <em>App Password</em> from your Google Account (Security &gt; 2-Step Verification &gt; App Passwords).<br />
              <strong>Hostinger / Zoho / cPanel:</strong> Set Host to your SMTP address, port to 465 (SSL checked) or 587, and use your regular inbox password.
            </p>
          </div>
        </div>

        {/* 2. Sender Identity & Admin Recipient */}
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs p-6 sm:p-8 space-y-5">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h2 className="font-heading font-extrabold text-base text-gray-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#16A34A]" />
              <span>2. Sender Identity &amp; Commercial Alert Inbox</span>
            </h2>
            <span className="text-xs text-gray-400 font-mono">Branding</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-heading font-bold text-gray-700">
                From Display Name
              </label>
              <input
                type="text"
                value={settings.from_name}
                onChange={(e) => setSettings({ ...settings, from_name: e.target.value })}
                placeholder="e.g. HealthGhuru Desk"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-sans focus:outline-hidden focus:border-[#16A34A] focus:bg-white transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-heading font-bold text-gray-700">
                From Email Address
              </label>
              <input
                type="email"
                value={settings.from_email}
                onChange={(e) => setSettings({ ...settings, from_email: e.target.value })}
                placeholder="e.g. notifications@healthghuru.com"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono focus:outline-hidden focus:border-[#16A34A] focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5 pt-1">
            <label className="block text-xs font-heading font-bold text-gray-700">
              Admin Notification Alert Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              required
              value={settings.admin_notification_email}
              onChange={(e) =>
                setSettings({ ...settings, admin_notification_email: e.target.value })
              }
              placeholder="e.g. admin@healthghuru.com or your personal email"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono focus:outline-hidden focus:border-[#16A34A] focus:bg-white transition-all"
            />
            <span className="text-[11px] text-gray-500 block">
              Where alerts for new sponsorship bookings, ad campaigns, and paid subscribers are sent.
            </span>
          </div>
        </div>

        {/* 3. Notification Triggers */}
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs p-6 sm:p-8 space-y-5">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h2 className="font-heading font-extrabold text-base text-gray-900 flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#16A34A]" />
              <span>3. Automated Email Notification Triggers</span>
            </h2>
            <span className="text-xs text-gray-400 font-mono">Toggles</span>
          </div>

          <div className="space-y-3.5">
            <label className="flex items-start gap-3 p-3 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notify_on_sponsorship}
                onChange={(e) =>
                  setSettings({ ...settings, notify_on_sponsorship: e.target.checked })
                }
                className="mt-0.5 w-4 h-4 rounded border-gray-300 text-[#16A34A] focus:ring-[#16A34A]"
              />
              <div>
                <span className="text-xs font-heading font-bold text-gray-900 block">
                  Sponsorship &amp; Press Release Inquiries (/sponsored-request)
                </span>
                <span className="text-[11px] text-gray-500">
                  Sends client confirmation receipt and notifies editorial desk with package and UTR details.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notify_on_ad_campaign}
                onChange={(e) =>
                  setSettings({ ...settings, notify_on_ad_campaign: e.target.checked })
                }
                className="mt-0.5 w-4 h-4 rounded border-gray-300 text-[#16A34A] focus:ring-[#16A34A]"
              />
              <div>
                <span className="text-xs font-heading font-bold text-gray-900 block">
                  Advertisement Campaign Submissions (/advertise/create)
                </span>
                <span className="text-[11px] text-gray-500">
                  Sends advertiser booking acknowledgment and notifies ad operations desk.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notify_on_subscription}
                onChange={(e) =>
                  setSettings({ ...settings, notify_on_subscription: e.target.checked })
                }
                className="mt-0.5 w-4 h-4 rounded border-gray-300 text-[#16A34A] focus:ring-[#16A34A]"
              />
              <div>
                <span className="text-xs font-heading font-bold text-gray-900 block">
                  Member Subscriptions (/subscribe)
                </span>
                <span className="text-[11px] text-gray-500">
                  Sends member welcome email with plan receipt and benefits overview.
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* 4. Diagnostic SMTP Test Card */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-sm text-gray-900 flex items-center gap-2">
              <Send size={15} className="text-[#f06d2f]" />
              <span>4. Live SMTP Connection Diagnostic</span>
            </h3>
            <span className="text-[11px] font-mono text-gray-500">1-Click Test</span>
          </div>

          <p className="text-xs text-gray-600">
            Send a live test message to verify that your SMTP host, port, username, and password connect without delivery errors.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 items-center">
            <input
              type="email"
              value={testEmailTarget}
              onChange={(e) => setTestEmailTarget(e.target.value)}
              placeholder="Recipient email for test message"
              className="w-full sm:flex-1 px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-xs font-mono focus:outline-hidden focus:border-[#16A34A]"
            />
            <button
              type="button"
              onClick={handleSendTestEmail}
              disabled={testing}
              className="w-full sm:w-auto px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-heading font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer shrink-0"
            >
              {testing ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Connecting &amp; Sending...</span>
                </>
              ) : (
                <>
                  <Sparkles size={14} className="text-amber-400" />
                  <span>Send Test Email</span>
                </>
              )}
            </button>
          </div>

          {testResult && (
            <div
              className={`p-3.5 rounded-xl text-xs font-medium border flex items-start gap-2.5 ${
                testResult.success
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}
            >
              {testResult.success ? (
                <Check size={16} className="text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle size={16} className="text-red-600 shrink-0 mt-0.5" />
              )}
              <div className="leading-relaxed">{testResult.message}</div>
            </div>
          )}
        </div>

        {/* 5. Full-Width Orange Save Button matching Payment Settings */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={saving}
            className="w-full py-4 bg-[#f06d2f] hover:bg-[#e05b1d] text-white font-heading font-extrabold text-sm sm:text-base rounded-xl shadow-lg shadow-orange-500/20 hover:shadow-xl hover:shadow-orange-500/30 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Saving Email Settings...</span>
              </>
            ) : (
              <>
                <Check size={18} strokeWidth={2.5} />
                <span>Save Email &amp; SMTP Settings</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
