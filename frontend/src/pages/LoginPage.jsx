import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate  = useNavigate()
  const [form, setForm]   = useState({ email:'', password:'' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true)
    try { await login(form.email, form.password); navigate('/lms') }
    catch (err) { setError(err.response?.data?.detail || 'Invalid email or password.') }
    finally { setLoading(false) }
  }

  return (
    <Layout>
      <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',padding:'80px 5%',position:'relative',overflow:'hidden'}}>
        <div className="orb" style={{width:'500px',height:'500px',top:'-100px',right:'-100px',background:'rgba(79,140,255,0.09)',filter:'blur(90px)'}}/>
        <div className="orb" style={{width:'400px',height:'400px',bottom:'-100px',left:'-100px',background:'rgba(162,89,255,0.07)',filter:'blur(90px)'}}/>
        <div style={{width:'100%',maxWidth:'440px',background:'var(--card-bg)',border:'1px solid var(--border)',borderRadius:'var(--radius-xl)',padding:'2.5rem',backdropFilter:'blur(20px)',position:'relative',zIndex:1}}>
          <div style={{textAlign:'center',marginBottom:'2rem'}}>
            <Link to="/" className="logo" style={{display:'block',marginBottom:'1.2rem'}}>Techvoto</Link>
            <h1 style={{fontSize:'1.6rem',letterSpacing:'-0.5px',marginBottom:'0.3rem'}}>Welcome back</h1>
            <p style={{fontSize:'0.88rem',color:'var(--text-muted)'}}>No account? <Link to="/signup" style={{color:'var(--accent)'}}>Sign up free</Link></p>
          </div>
          {error && <div className="alert alert-error">❌ {error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group"><label className="form-label">Email</label><input className="form-input" type="email" placeholder="you@example.com" required value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))}/></div>
            <div className="form-group">
              <div style={{display:'flex',justifyContent:'space-between'}}><label className="form-label">Password</label><a href="#" style={{fontSize:'0.8rem',color:'var(--accent)'}}>Forgot?</a></div>
              <input className="form-input" type="password" placeholder="Your password" required value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))}/>
            </div>
            <button className="btn btn-primary btn-full" type="submit" disabled={loading}>{loading?'Signing in…':'Sign In →'}</button>
          </form>
        </div>
      </div>
    </Layout>
  )
}
