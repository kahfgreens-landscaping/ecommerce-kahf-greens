/**
 * pages/ContactPage.jsx
 */
import { useState } from 'react';
import { Phone, Mail, MapPin, MessageCircle, Clock, Send, Check } from 'lucide-react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', service: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // In production: send to backend API / EmailJS / WhatsApp API
    console.log('Form submitted:', form);
    setSubmitted(true);
  };

  return (
    <div className="container py-12">
      <div className="text-center mb-12">
        <p className="text-brand-sage text-sm font-semibold uppercase tracking-wide mb-2">Get in Touch</p>
        <h1 className="section-title">Contact Kahf Greens</h1>
        <p className="section-subtitle mx-auto mt-3">Our team is ready to help with product enquiries, bulk orders, and delivery questions.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Form */}
        <div className="admin-card">
          {submitted ? (
            <div className="text-center py-10">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="font-semibold text-xl mb-2">Message Sent!</h3>
              <p className="text-muted-foreground">We'll get back to you within 24 hours.</p>
              <button onClick={() => setSubmitted(false)} className="btn-outline mt-4 text-sm px-4 py-2">Send Another</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="font-semibold text-xl mb-4">Send an Enquiry</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="admin-label">Full Name *</label>
                  <input required type="text" className="admin-input" placeholder="Your name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                </div>
                <div>
                  <label className="admin-label">Phone</label>
                  <input type="tel" className="admin-input" placeholder="+971 50 123 4567" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                </div>
              </div>
              <div>
                <label className="admin-label">Email Address *</label>
                <input required type="email" className="admin-input" placeholder="you@domain.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
              </div>
              <div>
                <label className="admin-label">Subject</label>
                <select className="admin-input" value={form.service} onChange={e => setForm(f => ({ ...f, service: e.target.value }))}>
                  <option value="">Select a topic</option>
                  <option>Product Enquiry</option>
                  <option>Bulk / Wholesale Order</option>
                  <option>Delivery Question</option>
                  <option>Returns & Refunds</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="admin-label">Message *</label>
                <textarea required rows={4} className="admin-input resize-none" placeholder="Tell us about your enquiry..." value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} />
              </div>
              <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
                <Send className="w-4 h-4" /> Send Message
              </button>
            </form>
          )}
        </div>

        {/* Contact Info */}
        <div className="space-y-6">
          {[
            { icon: MapPin,        label: 'Head Office', value: 'Dubai, United Arab Emirates' },
            { icon: Phone,         label: 'Phone',       value: '+971 4 224 0733',       href: 'tel:+97142240733' },
            { icon: MessageCircle, label: 'WhatsApp',    value: '+971 56 509 6880',       href: 'https://wa.me/971565096880' },
            { icon: Mail,          label: 'Email',       value: 'shop@kahfgreens.ae',     href: 'mailto:shop@kahfgreens.ae' },
            { icon: Clock,         label: 'Hours',       value: 'Sat – Thu: 8 AM – 6 PM' },
          ].map(({ icon: Icon, label, value, href }) => (
            <div key={label} className="flex items-start gap-4 p-4 bg-brand-light-bg rounded-xl">
              <div className="w-10 h-10 bg-brand-dark rounded-lg flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">{label}</p>
                {href ? (
                  <a href={href} className="font-semibold text-brand-dark hover:underline">{value}</a>
                ) : (
                  <p className="font-semibold text-foreground">{value}</p>
                )}
              </div>
            </div>
          ))}

          <a
            href="https://wa.me/971565096880?text=Hi%20Kahf%20Greens!%20I%20have%20a%20question."
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 w-full py-4 rounded-xl bg-green-500 hover:bg-green-600 text-white font-semibold text-sm transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            Chat on WhatsApp — Fastest Response
          </a>
        </div>
      </div>
    </div>
  );
}
