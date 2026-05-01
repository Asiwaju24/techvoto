import { useState } from 'react'
import Layout from '../components/Layout'
import api from '../utils/api'

export default function ContactPage() {
  const [type, setType]   = useState('General')
  const [form, setForm]   = useState({first_name:'',last_name:'',email:'',company:'',subject:'',message:''})
  const [sent, setSent]   = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const set = (k,v) => setForm(f=>({...f,[k]:v}))

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true)
    try { await api.post('/contact/', {...form, type}); setSent(true) }
    catch { setError('Failed to send. Please try again.') }
    finally { setLoading(false) }
  }

  return (
    <Layout>
      <div style={{padding:'80px 5% 60px',background:'var(--bg2)',borderBottom:'1px solid var(--border)',textAlign:'center',position:'relative',overflow:'hidden'}}>
        <div className="section-tag" style={{position:'relative',zIndex:1}}>Get in Touch</div>
        <h1 style={{fontSize:'clamp(2.2rem,4vw,3.2rem)',letterSpacing:'-1.5px',position:'relative',zIndex:1,marginBottom:'0.8rem'}}>We'd Love to <span className="grad-text">Hear From You</span></h1>
        <p style={{color:'var(--text-muted)',position:'relative',zIndex:1}}>Whether you're exploring Techvoto, need support, or want to partner — we're here.</p>
      </div>
      <div style={{maxWidth:'1100px',margin:'0 auto',padding:'4rem 5%',display:'grid',gridTemplateColumns:'1.2fr 1fr',gap:'4rem',alignItems:'start'}}>
        <div style={{background:'var(--card-bg)',border:'1px solid var(--border)',borderRadius:'var(--radius-xl)',padding:'2.5rem',backdropFilter:'blur(12px)'}}>
          <h2 style={{fontSize:'1.4rem',letterSpacing:'-0.5px',marginBottom:'0.4rem'}}>Send Us a Message</h2>
          <p style={{fontSize:'0.88rem',color:'var(--text-muted)',marginBottom:'1.5rem'}}>We respond within 4 hours on business days.</p>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'0.4rem',marginBottom:'1.5rem'}}>
            {[{icon:'💬',l:'General'},{icon:'🏢',l:'Enterprise'},{icon:'🤝',l:'Partnership'}].map(t => (
              <div key={t.l} onClick={()=>setType(t.l)} style={{padding:'0.6rem 0.3rem',textAlign:'center',borderRadius:'var(--radius)',border:`1px solid ${type===t.l?'var(--accent)':'var(--border)'}`,background:type===t.l?'rgba(79,140,255,0.1)':'transparent',cursor:'pointer',fontSize:'0.78rem',fontWeight:600,color:type===t.l?'var(--accent)':'var(--text-muted)'}}>
                <span style={{display:'block',fontSize:'1.2rem',marginBottom:'0.2rem'}}>{t.icon}</span>{t.l}
              </div>
            ))}
          </div>
          {sent ? <div className="alert alert-success">✅ Message sent! We'll get back to you within 4 hours.</div> : (
            <form onSubmit={handleSubmit}>
              {error && <div className="alert alert-error">❌ {error}</div>}
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.8rem'}}>
                <div className="form-group"><label className="form-label">First Name</label><input className="form-input" placeholder="John" required value={form.first_name} onChange={e=>set('first_name',e.target.value)}/></div>
                <div className="form-group"><label className="form-label">Last Name</label><input className="form-input" placeholder="Doe" required value={form.last_name} onChange={e=>set('last_name',e.target.value)}/></div>
              </div>
              <div className="form-group"><label className="form-label">Email</label><input className="form-input" type="email" placeholder="john@example.com" required value={form.email} onChange={e=>set('email',e.target.value)}/></div>
              <div className="form-group"><label className="form-label">Company (optional)</label><input className="form-input" placeholder="Your company" value={form.company} onChange={e=>set('company',e.target.value)}/></div>
              <div className="form-group"><label className="form-label">Subject</label><select className="form-select" required value={form.subject} onChange={e=>set('subject',e.target.value)}><option value="">What's this about?</option>{['General Inquiry','Book a Demo','Enterprise Sales','Billing Support','Report a Bug','Other'].map(s=><option key={s}>{s}</option>)}</select></div>
              <div className="form-group"><label className="form-label">Message</label><textarea className="form-textarea" placeholder="How can we help?" required value={form.message} onChange={e=>set('message',e.target.value)}/></div>
              <button className="btn btn-primary btn-full" type="submit" disabled={loading} style={{padding:'0.85rem'}}>{loading?'Sending…':'Send Message →'}</button>
            </form>
          )}
        </div>
        <div>
          <h2 style={{fontSize:'1.3rem',letterSpacing:'-0.5px',marginBottom:'1rem'}}>Other Ways to Reach Us</h2>
          {[{icon:'📧',bg:'rgba(79,140,255,0.1)',t:'Email',v:'hello@techvoto.com',href:'mailto:hello@techvoto.com'},{icon:'💬',bg:'rgba(0,229,195,0.1)',t:'WhatsApp',v:'Join our community',href:'https://chat.whatsapp.com/JCkROhTSY3h6fNkjpixnWe'},{icon:'🐦',bg:'rgba(162,89,255,0.1)',t:'Twitter',v:'@Techvotos',href:'https://x.com/Techvotos'}].map(i => (
            <div key={i.t} style={{background:'var(--card-bg)',border:'1px solid var(--border)',borderRadius:'var(--radius)',padding:'1.2rem',backdropFilter:'blur(10px)',display:'flex',gap:'1rem',alignItems:'flex-start',marginBottom:'1rem',transition:'all var(--transition)',cursor:'pointer'}} onMouseEnter={e=>e.currentTarget.style.borderColor='var(--accent)'} onMouseLeave={e=>e.currentTarget.style.borderColor='var(--border)'}>
              <div style={{width:'40px',height:'40px',borderRadius:'10px',background:i.bg,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1rem',flexShrink:0}}>{i.icon}</div>
              <div><h4 style={{fontSize:'0.88rem',fontWeight:700,marginBottom:'0.2rem'}}>{i.t}</h4><a href={i.href} target="_blank" rel="noreferrer" style={{fontSize:'0.82rem',color:'var(--text-muted)'}}>{i.v}</a></div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}
