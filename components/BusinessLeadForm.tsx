'use client';

import { useState } from 'react';
import { Building2, Send, CheckCircle2, ArrowRight } from 'lucide-react';

export default function BusinessLeadForm() {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    website: '',
    promotion_needs: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong.');
      }

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Failed to submit form.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="deal-card p-8 md:p-10 text-center space-y-5 bg-white border border-[#CBDED7]">
        <div className="w-14 h-14 bg-[#E1F5EE] border border-[#1D9E75] rounded-full flex items-center justify-center mx-auto text-[#0F6E56]">
          <CheckCircle2 className="w-8 h-8 text-[#1D9E75]" />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-[#04342C]">Thank You!</h3>
          <p className="text-[#2C2C2A] font-medium text-lg max-w-lg mx-auto">
            Thanks — we&apos;ll be in touch with creators that match what you&apos;re looking for.
          </p>
        </div>
        <p className="text-sm text-[#5A6561]">
          Rex from the DealLink team will personally review your requirements and curate a list of verified creators for your brand.
        </p>
        <button
          onClick={() => {
            setSubmitted(false);
            setFormData({ name: '', company: '', email: '', website: '', promotion_needs: '' });
          }}
          className="inline-flex items-center gap-2 text-sm text-[#0F6E56] font-semibold hover:text-[#1D9E75] pt-2"
        >
          <span>Submit another inquiry</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="deal-card p-6 md:p-8 bg-white border border-[#CBDED7] space-y-5">
      <div className="flex items-center gap-3 pb-2 border-b border-[#CBDED7]">
        <div className="w-10 h-10 rounded-lg bg-[#E1F5EE] border border-[#1D9E75] flex items-center justify-center text-[#0F6E56]">
          <Building2 className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-[#04342C]">Connect with Creators</h3>
          <p className="text-xs text-[#5A6561]">Tell us about your brand and audience goals</p>
        </div>
      </div>

      {error && (
        <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg font-medium">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#04342C] mb-1.5">
            Your Name *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Alex Morgan"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-white border border-[#CBDED7] rounded-lg text-sm text-[#2C2C2A] focus:outline-none focus:border-[#0F6E56]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#04342C] mb-1.5">
            Company / Brand *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Acme Brand Inc."
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-white border border-[#CBDED7] rounded-lg text-sm text-[#2C2C2A] focus:outline-none focus:border-[#0F6E56]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#04342C] mb-1.5">
            Work Email *
          </label>
          <input
            type="email"
            required
            placeholder="alex@company.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-white border border-[#CBDED7] rounded-lg text-sm text-[#2C2C2A] focus:outline-none focus:border-[#0F6E56]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#04342C] mb-1.5">
            Website URL
          </label>
          <input
            type="url"
            placeholder="https://company.com"
            value={formData.website}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-white border border-[#CBDED7] rounded-lg text-sm text-[#2C2C2A] focus:outline-none focus:border-[#0F6E56]"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-[#04342C] mb-1.5">
          What are you looking to promote? *
        </label>
        <textarea
          required
          rows={3}
          placeholder="Describe your product goals, target audience, budget range, or preferred creator niches (e.g. tech, lifestyle, gaming, finance, fitness)..."
          value={formData.promotion_needs}
          onChange={(e) => setFormData({ ...formData, promotion_needs: e.target.value })}
          className="w-full px-3.5 py-2.5 bg-white border border-[#CBDED7] rounded-lg text-sm text-[#2C2C2A] focus:outline-none focus:border-[#0F6E56] resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 px-6 bg-[#0F6E56] hover:bg-[#1D9E75] text-white font-semibold text-sm rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
      >
        {loading ? (
          <span>Submitting...</span>
        ) : (
          <>
            <Send className="w-4 h-4" />
            <span>Submit Business Inquiry</span>
          </>
        )}
      </button>

      <p className="text-[11px] text-[#5A6561] text-center">
        No commitment required. We match your product requirements with vetted content creators across any niche.
      </p>
    </form>
  );
}
