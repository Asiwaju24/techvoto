import { useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout'

export default function PricingPage() {
  const [annual, setAnnual] = useState(false)
  const [faqOpen, setFaqOpen] = useState(null)

  const plans = [
    { icon:'🌱', name:'Free',  monthly:0,  annually:0,  desc:'Perfect for students just getting started.',
      features:[{ok:true,t:'5 free courses'},{ok:true,t:'Community access'},{ok:true,t:'1 project lab/month'},{ok:false,t:'Mentorship sessions'},{ok:false,t:'Certifications'},{ok:false,t:'Priority support'}],
      cta:'Get Started Free', btn:'btn-outline', featured:false },
    { icon:'⚡', name:'Pro',   monthly:19, annually:15, desc:'Everything you need to grow fast in tech.',
      features:[{ok:true,t:'All 300+ courses'},{ok:true,t:'Community access'},{ok:true,t:'Unlimited project labs'},{ok:true,t:'4 mentorship sessions/mo'},{ok:true,t:'All certifications'},{ok:true,t:'Priority support'}],
      cta:'Start Pro', btn:'btn-primary', featured:true },
    { icon:'🏢', name:'Teams', monthly:49, annually:39, desc:'Upskill your entire team at scale.',
      features:[{ok:true,t:'Everything in Pro'},{ok:true,t:'Team analytics dashboard'},{ok:true,t:'Custom learning paths'},{ok:true,t:'Dedicated success manager'},{ok:true,t:'SSO & SAML'},{ok:true,t:'SLA guarantee'}],
      cta:'Contact Sales', btn:'btn-outline', featured:false },
  ]

  const faqs = [
    { q:'Can I switch plans anytime?', a:'Yes — upgrade or downgrade at any time. Changes take effect at the start of your next billing cycle.' },
    { q:'Is there a student discount?', a:'Absolutely. We offer a 50% discount for verified students. Apply with your school email.' },
    { q:'What payment methods do you accept?', a:'All major credit cards (Visa, Mastercard, Amex), PayPal, and bank transfers for annual plans.' },
    { q:'Do free courses include a certificate?', a:'Free courses include a completion certificate. Blockchain-backed verified certs are Pro-only.' },
    { q:'Can I cancel anytime?', a:'Yes, no cancellation fees. You keep access until the end of your billing period.' },
  ]

  return (
    <Layout>
      <div style={{textAlign:'center',padding:'80px 5% 60px',background:'var(--bg2)',borderBottom:'1px solid var(--border)',position:'relative',overflow:'hidden'}}>
        <div className="orb" style={{width:'400px',height:'400px',top:'-100px',right:'-50px',background:'rgba(79,140,255,0.08)',filter:'blur(80px)'}}/>
        <div className="section-tag" style={{position:'relative',zIndex:1}}>Transparent Pricing</div>
        <h1 style={{fontSize:'clamp(2.2rem,4vw,3.5rem)',letterSpacing:'-1.5px',marginBottom:'0.8rem',position:'relative',zIndex:1}}>
          Choose Your <span className="grad-text">Growth Plan</span>
        </h1>
        <p style={{color:'var(--text-muted)',fontSize:'1.05rem',marginBottom:'2rem',position:'relative',zIndex:1}}>No hidden fees. Cancel anytime. Start free today.</p>
        <div style={{display:'flex',alignItems:'center',gap:'1rem',justifyContent:'center',position:'relative',zIndex:1}}>
          <span style={{fontSize:'0.9rem',color:annual?'var(--text-muted)':'var(--text)',fontWeight:annual?400:600}}>Monthly</span>
          <div onClick={()=>setAnnual(a=>!a)} style={{position:'relative',width:'48px',height:'26px',background:annual?'var(--gradient)':'var(--surface)',border:'1px solid var(--border)',borderRadius:'50px',cursor:'pointer',transition:'background 0.25s'}}>
            <div style={{position:'absolute',top:'3px',left:annual?'25px':'3px',width:'18px',height:'18px',background:'#fff',borderRadius:'50%',transition:'left 0.25s'}}/>
          </div>
          <span style={{fontSize:'0.9rem',color:annual?'var(--text)':'var(--text-muted)',fontWeight:annual?600:400}}>Annual</span>
          {annual && <span style={{background:'linear-gradient(135deg,#00e5c3,#4f8cff)',color:'#fff',padding:'0.2rem 0.6rem',borderRadius:'50px',fontSize:'0.72rem',fontWeight:700}}>Save 20%</span>}
        </div>
      </div>

      <div style={{maxWidth:'1100px',margin:'0 auto',padding:'4rem 5%',display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'1.5rem',alignItems:'start'}}>
        {plans.map(p => (
          <div key={p.name} style={{background:p.featured?'linear-gradient(145deg,rgba(79,140,255,0.08),rgba(162,89,255,0.05))':'var(--card-bg)',border:`1px solid ${p.featured?'var(--accent)':'var(--border)'}`,borderRadius:'var(--radius-xl)',padding:'2.2rem',backdropFilter:'blur(12px)',position:'relative',transform:p.featured?'scale(1.03)':'none'}}>
            {p.featured && <div style={{position:'absolute',top:'-14px',left:'50%',transform:'translateX(-50%)',background:'var(--gradient)',color:'#fff',padding:'0.25rem 1.2rem',borderRadius:'50px',fontSize:'0.72rem',fontWeight:700,letterSpacing:'0.08em',textTransform:'uppercase',whiteSpace:'nowrap'}}>Most Popular</div>}
            <div style={{fontSize:'2rem',marginBottom:'1rem'}}>{p.icon}</div>
            <div style={{fontSize:'0.9rem',fontWeight:700,color:'var(--text-muted)',letterSpacing:'0.05em',textTransform:'uppercase'}}>{p.name}</div>
            <div style={{display:'flex',alignItems:'baseline',gap:'0.3rem',margin:'0.8rem 0 0.3rem'}}>
              <span style={{fontFamily:'Syne,sans-serif',fontSize:'3rem',fontWeight:800,letterSpacing:'-2px',lineHeight:1}}>${annual?p.annually:p.monthly}</span>
              <span style={{fontSize:'0.9rem',color:'var(--text-muted)'}}>/mo</span>
            </div>
            {annual && p.monthly>0 && <div style={{fontSize:'0.8rem',color:'var(--accent3)',marginBottom:'0.4rem'}}>Billed ${(annual?p.annually:p.monthly)*12}/year</div>}
            <p style={{fontSize:'0.85rem',color:'var(--text-muted)',lineHeight:1.6,marginBottom:'1.5rem'}}>{p.desc}</p>
            <hr style={{border:'none',borderTop:'1px solid var(--border)',margin:'1.2rem 0'}}/>
            <div style={{display:'flex',flexDirection:'column',gap:'0.6rem',marginBottom:'1.8rem'}}>
              {p.features.map((f,i) => (
                <div key={i} style={{display:'flex',alignItems:'flex-start',gap:'0.6rem',fontSize:'0.85rem',color:f.ok?'var(--text)':'var(--text-dim)'}}>
                  <span style={{color:f.ok?'var(--accent3)':'var(--text-dim)',fontSize:'0.8rem',marginTop:'0.1rem',flexShrink:0}}>{f.ok?'✓':'✕'}</span>
                  {f.t}
                </div>
              ))}
            </div>
            <Link to={p.name==='Teams'?'/contact':'/signup'} className={`btn ${p.btn} btn-full`} style={{padding:'0.85rem',fontSize:'0.95rem',borderRadius:'12px'}}>{p.cta}</Link>
          </div>
        ))}
      </div>

      <div style={{background:'var(--bg2)',padding:'60px 5%'}}>
        <div style={{maxWidth:'700px',margin:'0 auto'}}>
          <h2 style={{fontSize:'1.8rem',letterSpacing:'-0.5px',textAlign:'center',marginBottom:'2.5rem'}}>Frequently Asked Questions</h2>
          {faqs.map((f,i) => (
            <div key={i} style={{borderBottom:'1px solid var(--border)',padding:'1.2rem 0'}}>
              <div onClick={()=>setFaqOpen(faqOpen===i?null:i)} style={{display:'flex',justifyContent:'space-between',alignItems:'center',cursor:'pointer',fontWeight:600,fontSize:'0.92rem',gap:'1rem'}}>
                {f.q}
                <span style={{fontSize:'0.8rem',transition:'transform 0.25s',transform:faqOpen===i?'rotate(180deg)':'none',color:'var(--text-muted)'}}>▼</span>
              </div>
              {faqOpen===i && <div style={{fontSize:'0.88rem',color:'var(--text-muted)',lineHeight:1.7,paddingTop:'0.8rem'}}>{f.a}</div>}
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}
