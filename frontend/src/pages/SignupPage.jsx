import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { useAuth } from '../context/AuthContext'

export default function SignupPage() {
  const { signup } = useAuth()
  const navigate   = useNavigate()
  const [form, setForm]   = useState({ first_name:'', last_name:'', email:'', password:'', password2:'', plan:'free' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const set = (k,v) => setForm(f=>({...f,[k]:v}))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.password2) { setError('Passwords do not match.'); return }
    setError(''); setLoading(true)
    try { await signup(form); navigate('/lms') }
    catch (err) { const d=err.response?.data; setError(d?.email?.[0]||d?.detail||'Registration failed.') }
    finally { setLoading(false) }
  }

  return (
    <Layout>
      <div style={{minHeight:'100vh',display:'grid',gridTemplateColumns:'1fr 1fr'}}>
        <div style={{background:'var(--bg2)',borderRight:'1px solid var(--border)',padding:'80px 5% 60px',display:'flex',flexDirection:'column',justifyContent:'center',position:'relative',overflow:'hidden'}}>
          <div className="orb" style={{width:'400px',height:'400px',top:'-100px',right:'-100px',background:'rgba(79,140,255,0.1)',filter:'blur(80px)'}}/>
          <div style={{maxWidth:'480px',margin:'0 auto',position:'relative',zIndex:1}}>
            <div className="section-tag">Student-Centered Community</div>
            <h1 style={{fontSize:'clamp(2rem,3.5vw,3rem)',letterSpacing:'-2px',lineHeight:1.1,marginBottom:'1rem'}}>Start Building Your <span className="grad-text">Tech Skills</span> Today</h1>
            <p style={{color:'var(--text-muted)',lineHeight:1.7,marginBottom:'2rem'}}>Join a supportive community where students learn in-demand tech skills and grow with mentorship.</p>
            {[{icon:'🧠',t:'Structured Learning Paths',d:'Clear skill tracks for beginners.'},{icon:'🤝',t:'Mentorship Network',d:'Learn from experienced developers 1:1.'},{icon:'🏆',t:'Verified Credentials',d:'Earn certificates trusted by employers.'}].map((p,i) => (
              <div key={i} style={{display:'flex',gap:'0.8rem',padding:'1rem',background:'var(--card-bg)',border:'1px solid var(--border)',borderRadius:'var(--radius)',backdropFilter:'blur(10px)',marginBottom:'0.8rem'}}>
                <span style={{fontSize:'1.2rem',flexShrink:0}}>{p.icon}</span>
                <div><h4 style={{fontSize:'0.9rem',fontWeight:700,marginBottom:'0.2rem'}}>{p.t}</h4><p style={{fontSize:'0.8rem',color:'var(--text-muted)',margin:0,lineHeight:1.5}}>{p.d}</p></div>
              </div>
            ))}
          </div>
        </div>
        <div style={{background:'var(--bg)',display:'flex',alignItems:'center',justifyContent:'center',padding:'80px 5% 60px'}}>
          <div style={{width:'100%',maxWidth:'420px'}}>
            <Link to="/" className="logo" style={{display:'block',marginBottom:'2rem'}}>Techvoto</Link>
            <h1 style={{fontSize:'1.6rem',letterSpacing:'-0.5px',marginBottom:'0.3rem'}}>Create your account</h1>
            <p style={{fontSize:'0.88rem',color:'var(--text-muted)',marginBottom:'2rem'}}>Already a member? <Link to="/login" style={{color:'var(--accent)'}}>Sign in</Link></p>
            {error && <div className="alert alert-error">❌ {error}</div>}
            <form onSubmit={handleSubmit}>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.8rem'}}>
                <div className="form-group"><label className="form-label">First Name</label><input className="form-input" placeholder="John" required value={form.first_name} onChange={e=>set('first_name',e.target.value)}/></div>
                <div className="form-group"><label className="form-label">Last Name</label><input className="form-input" placeholder="Doe" required value={form.last_name} onChange={e=>set('last_name',e.target.value)}/></div>
              </div>
              <div className="form-group"><label className="form-label">Email</label><input className="form-input" type="email" placeholder="you@example.com" required value={form.email} onChange={e=>set('email',e.target.value)}/></div>
              <div className="form-group"><label className="form-label">Password</label><input className="form-input" type="password" placeholder="Min 8 characters" required minLength={8} value={form.password} onChange={e=>set('password',e.target.value)}/></div>
              <div className="form-group"><label className="form-label">Confirm Password</label><input className="form-input" type="password" placeholder="Repeat password" required value={form.password2} onChange={e=>set('password2',e.target.value)}/></div>
              <div style={{marginBottom:'1.2rem'}}>
                <label className="form-label" style={{marginBottom:'0.6rem',display:'block'}}>Plan</label>
                <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'0.6rem'}}>
                  {[{k:'free',l:'Free',s:'Get started'},{k:'pro',l:'Pro',s:'$19/mo'},{k:'teams',l:'Teams',s:'$49/mo'}].map(p => (
                    <div key={p.k} onClick={()=>set('plan',p.k)} style={{padding:'0.7rem 0.5rem',textAlign:'center',borderRadius:'var(--radius)',border:`1px solid ${form.plan===p.k?'var(--accent)':'var(--border)'}`,background:form.plan===p.k?'rgba(79,140,255,0.08)':'transparent',cursor:'pointer'}}>
                      <span style={{display:'block',fontSize:'0.78rem',fontWeight:600}}>{p.l}</span>
                      <small style={{fontSize:'0.7rem',color:'var(--text-muted)'}}>{p.s}</small>
                    </div>
                  ))}
                </div>
              </div>
              <button className="btn btn-primary btn-full" type="submit" disabled={loading}>{loading?'Creating…':'Create Account →'}</button>
              <p style={{fontSize:'0.76rem',color:'var(--text-dim)',textAlign:'center',marginTop:'1rem'}}>By signing up you agree to our <Link to="/terms" style={{color:'var(--accent)'}}>Terms</Link> and <Link to="/privacy" style={{color:'var(--accent)'}}>Privacy Policy</Link>.</p>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  )
}
