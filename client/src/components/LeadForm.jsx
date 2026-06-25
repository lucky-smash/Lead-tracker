import { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || '';

const initialForm = {
  name: '',
  email: '',
  phone: '',
  company: '',
  requirement: '',
};

export default function LeadForm() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setToast(null);

    try {
      const res = await fetch(`${API_URL}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setToast({ type: 'success', message: `✅ Lead created! A personalized email has been sent to ${form.email}` });
        setForm(initialForm);
      } else {
        setToast({ type: 'error', message: `❌ ${data.message || 'Something went wrong'}` });
      }
    } catch (err) {
      setToast({ type: 'error', message: '❌ Network error. Is the server running?' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-page">
      <div className="form-container">
        <div className="form-header">
          <h1>Submit Your Details</h1>
          <p>Fill in the form below and we'll get back to you shortly</p>
        </div>

        {toast && (
          <div className={`toast ${toast.type}`}>
            {toast.message}
          </div>
        )}

        <div className="form-card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                name="name"
                type="text"
                className="form-input"
                placeholder="Rahul Sharma"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="form-input"
                  placeholder="rahul@gmail.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  className="form-input"
                  placeholder="9876543210"
                  value={form.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="company">Company Name <span className="optional">(optional)</span></label>
              <input
                id="company"
                name="company"
                type="text"
                className="form-input"
                placeholder="ABC Pvt Ltd"
                value={form.company}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="requirement">Requirement / Message</label>
              <textarea
                id="requirement"
                name="requirement"
                className="form-textarea"
                placeholder="Tell us what you need..."
                value={form.requirement}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? (
                <><span className="spinner"></span> Submitting...</>
              ) : (
                'Submit Lead →'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
