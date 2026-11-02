import React, { useState } from 'react';
import { ShieldCheck, Mail, Send, Award, HelpCircle, CheckCircle, Info } from 'lucide-react';

interface AboutContactPageProps {
  onNavigate: (page: string) => void;
}

export const AboutContactPage: React.FC<AboutContactPageProps> = ({ onNavigate }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-10">
      {/* Platform Mission */}
      <div className="space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
          About TOP RANKER Platform
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          TOP RANKER — Practice Smart. Rank Higher.
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          TOP RANKER is an elite online examination platform engineered exclusively for Joint Entrance Examination (Main) Paper 1 aspirants. Our mission is to provide an exact replica of the actual Computer-Based Test (CBT) environment populated solely with authentic, verified previous year questions from official examination sessions.
        </p>
      </div>

      {/* Core Principles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-2">
          <ShieldCheck className="h-6 w-6 text-emerald-600" />
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">Authenticity First</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Every question is labeled with its authentic session, shift, and question paper reference. No fabricated questions are disguised as PYQs.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-2">
          <Award className="h-6 w-6 text-blue-600" />
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">Authoritative Scoring</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Strict adherence to the official NTA Paper 1 marking scheme: +4 for correct, −1 for incorrect, and 0 for unattempted questions across both MCQs and Numericals.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-2">
          <Info className="h-6 w-6 text-purple-600" />
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">Real CBT Experience</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            180-minute countdown timer, official 5-state question palette, section jumping, save & next, mark for review, and mathematical formula rendering.
          </p>
        </div>
      </div>

      {/* Official Disclaimer */}
      <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-6 dark:border-amber-950 dark:bg-amber-950/20 text-xs text-amber-900 dark:text-amber-200 space-y-2">
        <p className="font-bold flex items-center gap-1.5 text-sm">
          <Info className="h-4 w-4" /> Legal & Institutional Disclaimer
        </p>
        <p className="leading-relaxed">
          TOP RANKER is an independent educational training platform. It is not affiliated with, endorsed by, or associated with the National Testing Agency (NTA), the Ministry of Education, or the Joint Admission Board (JAB). Questions and answer keys are compiled from lawful public examination records for candidate revision and training purposes.
        </p>
      </div>

      {/* Contact & Feedback Form */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Candidate Support & Verification Queries
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Have feedback on a question key, suggestion for pattern configuration, or need assistance? Reach out to our academic team.
          </p>
        </div>

        {submitted ? (
          <div className="p-4 rounded-xl bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            <span>Thank you for your message! Our academic verification team will review your query within 24 hours.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Aman Yadav"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="aspirant@example.com"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Message / Question Reference / Feedback *
              </label>
              <textarea
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Mention the test slot number, question shift, or feedback..."
                className="w-full text-xs p-3 rounded-xl border border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all"
            >
              <Send className="h-4 w-4" />
              <span>Submit Message</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
