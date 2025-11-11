'use client';

import { useState } from 'react';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMsg('');

    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      setStatus('error');
      setErrorMsg('Name, email, and message are required.');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setStatus('error');
      setErrorMsg('Please enter a valid email.');
      return;
    }

    try {
      const res = await fetch('https://formspree.io/f/xdknpklq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', phone: '', message: '' });
      } else {
        throw new Error('Submission failed');
      }
    } catch (err) {
      setStatus('error');
      setErrorMsg('Failed to send. Please try again.');
    }
  };

  return (
    <>
      <section className="bg-green-50 py-16">
        <div className="container mx-auto px-4 max-w-2xl">
          <h1 className="text-4xl font-bold text-center mb-4 text-green-800">Contact Us</h1>
          <p className="text-center text-gray-600 mb-10">
            Have a question? Want to list a property? Send us a message!
          </p>

          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="John Doe"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="john@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone (optional)</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="+234 801 234 5678"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={5}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Tell us about your flatshare needs..."
                required
              />
            </div>

            {status === 'error' && (
              <div className="flex items-center gap-2 text-red-600 text-sm">
                <AlertCircle className="w-5 h-5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {status === 'success' && (
              <div className="flex items-center gap-2 text-green-600 text-sm">
                <CheckCircle className="w-5 h-5" />
                <span>Message sent! We'll get back to you soon.</span>
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'sending'}
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {status === 'sending' ? (
                <>Sending...</>
              ) : (
                <>
                  <Send className="w-5 h-5" /> Send Message
                </>
              )}
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
