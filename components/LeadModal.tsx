'use client';

import { useState, useEffect } from 'react';
import type { MouseEvent, FormEvent } from 'react';
import { X, Star } from 'lucide-react';

interface LeadModalProps {
  serviceType: string;
  serviceSlug: string;
  location: string;
  locationSlug: string;
}

export default function LeadModal({ serviceType, serviceSlug, location, locationSlug }: LeadModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  // Make openModal available globally
  useEffect(() => {
    (window as any).openModal = () => {
      setIsClosing(false);
      setIsOpen(true);
    };
  }, []);

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeModal();
      }
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const closeModal = () => {
    setIsClosing(true);
    // Wait for animation to finish
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 300);
  };

  const handleOverlayClick = (e: MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === 'submitting') return;

    setStatus('submitting');
    setError(null);

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceType,
          serviceSlug,
          location,
          locationSlug,
          name,
          email,
          phone,
          message,
          sourceUrl: window.location.href,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || 'Something went wrong. Please try again.');
      }

      setStatus('success');
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
      
      // Auto-close after success
      setTimeout(() => {
        closeModal();
      }, 3000);
    } catch (err: any) {
      setStatus('error');
      setError(err?.message || 'Something went wrong. Please try again.');
    }
  }

  const placeholderText = `E.g., Looking for ${serviceType.toLowerCase()} in ${location}, budget and timing details...`;

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center p-5 bg-[#0a0e17]/80 backdrop-blur-lg ${
        isClosing ? 'animate-fadeOut' : 'animate-fadeIn'
      }`}
      onClick={handleOverlayClick}
    >
      <div
        className={`bg-[#151c2c] border border-[#1e293b] rounded-2xl max-w-[500px] w-full max-h-[90vh] overflow-y-auto ${
          isClosing ? 'animate-modalSlideOut' : 'animate-modalSlideIn'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              <span className="text-sm font-medium">
                <span className="text-white">4.8/5</span>
                <span className="text-slate-400"> from 342 matches</span>
              </span>
            </div>
            <button
              onClick={closeModal}
              className="text-slate-400 hover:text-white transition-all duration-200 hover:rotate-90"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <h3 className="text-2xl font-bold mb-6">
            Get matched with top {location} providers
          </h3>

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Your name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="John Smith"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Your email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Phone number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                placeholder="(212) 555-0123"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">What do you need?</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={4}
                placeholder={placeholderText}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 transition resize-none"
              />
            </div>

            {status === 'success' && (
              <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                ✓ Request received! We'll send you quotes within 24 hours.
              </div>
            )}

            {status === 'error' && (
              <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {error || 'Something went wrong. Please try again.'}
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'submitting'}
              className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600 disabled:opacity-60 text-white font-bold rounded-lg transition shadow-lg"
            >
              {status === 'submitting' ? 'Sending...' : 'Get Matched Now'}
            </button>

            <p className="text-xs text-slate-400 text-center">
              Free to use • No commitment • Avg. response: 2 hours
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
