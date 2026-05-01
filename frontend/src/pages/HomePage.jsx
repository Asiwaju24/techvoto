import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout'

function countUp(el, target, suffix='') {
  const duration = 2000; let start = null
  const step = (ts) => {
    if (!start) start = ts
    const p = Math.min((ts - start) / duration, 1)
    const ease = 1 - Math.pow(1 - p, 3)
    el.textContent = Math.floor(ease * target) + suffix
    if (p < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}

export default function HomePage() {
  useEffect(() => {
    const reveals = document.querySelectorAll('.reveal')
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e, i) => { if (e.isIntersecting) { setTimeout(() => e.target.classList.add('visible'), i * 70); obs.unobserve(e.target) } })
    }, { threshold: 0.1 })
    reveals.forEach(el => obs.observe(el))
    const counters = document.querySelectorAll('[data-count]')
    const cObs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { countUp(e.target, +e.target.dataset.count, e.target.dataset.suffix||''); cObs.unobserve(e.target) } })
    }, { threshold: 0.5 })
    counters.forEach(el => cObs.observe(el))
    return () => { obs.disconnect(); cObs.disconnect() }
  }, [])

  return (
    <Layout>
      {/* HERO */}
      <section style={{minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',textAlign:'center',padding:'100px 5% 80px',position:'relative',overflow:'hidden'}}>
        <div className="orb" style={{width:'600px',height:'600px',top:'-200px',right:'-150px',background:'rgba(79,140,255,0.1)',filter:'blur(100px)'}}/>
        <div className="orb" style={{width:'500px',height:'500px',bottom:'-100px',left:'-100px',background:'rgba(162,89,255,0.08)',filter:'blur(100px)'}}/>
        <div style={{display:'inline-flex',alignItems:'center',gap:'0.5rem',background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'50px',padding:'0.35rem 1.1rem',fontSize:'0.8rem',color:'var(--text-muted)',marginBottom:'2rem',animation:'fadeUp 0.6s ease both',position:'relative',zIndex:1}}>
          <span style={{width:'7px',height:'7px',borderRadius:'50%',background:'var(--accent3)',animation:'pulse 2s infinite',display:'inline-block'}}/>
          Built for Students Serious About Tech
        </div>
        <h1 style={{fontSize:'clamp(2.8rem,6.5vw,5.5rem)',letterSpacing:'-3px',lineHeight:1.04,maxWidth:'1060px',animation:'fadeUp 0.6s 0.1s ease both',position:'relative',zIndex:1}}>
          The <span className="grad-text">Smart Way</span> For Students to Break Into Tech
        </h1>
        <p style={{fontSize:'1.1rem',color:'var(--text-muted)',maxWidth:'560px',lineHeight:1.75,marginTop:'1.5rem',animation:'fadeUp 0.6s 0.2s ease both',position:'relative',zIndex:1}}>
          Learn in-demand skills, get mentorship, and work on real projects — all in one place.
        </p>
        <div style={{display:'flex',gap:'1rem',flexWrap:'wrap',justifyContent:'center',marginTop:'2.5rem',animation:'fadeUp 0.6s 0.3s ease both',position:'relative',zIndex:1}}>
          <a href="https://chat.whatsapp.com/JCkROhTSY3h6fNkjpixnWe" target="_blank" rel="noreferrer" className="btn btn-primary btn-lg">Join The Community →</a>
          <Link to="/courses" className="btn btn-outline btn-lg">Browse Courses</Link>
        </div>
        <div style={{marginTop:'4rem',animation:'fadeUp 0.6s 0.4s ease both',position:'relative',zIndex:1}}>
          <p style={{fontSize:'0.8rem',color:'var(--text-dim)',marginBottom:'1rem',letterSpacing:'0.05em',textTransform:'uppercase'}}>Inspired by</p>
          <div style={{display:'flex',alignItems:'center',gap:'2.5rem',flexWrap:'wrap',justifyContent:'center'}}>
            {['Python','React','Django','Vercel'].map(b => <span key={b} style={{fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:'1rem',color:'var(--text-dim)',opacity:0.5}}>{b}</span>)}
          </div>
        </div>
      </section>

      {/* STATS — static marketing numbers */}
      <div style={{background:'var(--bg2)',borderTop:'1px solid var(--border)',borderBottom:'1px solid var(--border)',padding:'3rem 5%'}}>
        <div style={{maxWidth:'1100px',margin:'0 auto',display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'2rem'}}>
          {[{count:100,suffix:'+',label:'Active Learners',cls:'grad-text'},{count:20,suffix:'+',label:'Learning Sessions',cls:'grad-text'},{count:10,suffix:'+',label:'Projects Built',cls:'grad2-text'},{count:5,suffix:'',label:'Skill Tracks',cls:'grad2-text'}].map((s,i) => (
            <div key={i} style={{textAlign:'center'}} className="reveal">
              <div className={s.cls} data-count={s.count} data-suffix={s.suffix} style={{fontFamily:'Syne,sans-serif',fontSize:'2.4rem',fontWeight:800}}>{s.count}{s.suffix}</div>
              <div style={{fontSize:'0.82rem',color:'var(--text-muted)',marginTop:'0.3rem'}}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* FEATURES */}
      <section style={{padding:'100px 5%'}}>
        <div style={{textAlign:'center',marginBottom:'4rem'}} className="reveal">
          <div className="section-tag">Core Features</div>
          <h2 className="section-title">Where Students Grow Into Tech Professionals</h2>
          <p className="section-sub" style={{margin:'0.8rem auto 0'}}>From structured learning paths to mentorship and real opportunities — Techvoto supports you at every stage.</p>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:'1.5rem',maxWidth:'1200px',margin:'0 auto'}}>
          {[{icon:'🧠',title:'Structured Learning Paths',desc:'Follow clear, beginner-friendly skill tracks designed to help you progress confidently at your own pace.'},{icon:'🎯',title:'Connect to Opportunities',desc:'Get connected to internships, projects, and opportunities that match your growing skill set.'},{icon:'📊',title:'Growth Dashboard',desc:'Track your learning progress, identify skill gaps, and stay motivated as you grow in tech.'},{icon:'🤝',title:'Mentorship Network',desc:'Learn directly from experienced developers and industry professionals through guided mentorship.'},{icon:'🏆',title:'Verified Credentials',desc:'Earn recognized badges and certificates as you complete trainings and demonstrate your skills.'},{icon:'⚡',title:'Live Project Labs',desc:'Build hands-on projects, receive structured feedback, and graduate with a portfolio that stands out.'}].map((f,i) => (
            <div key={i} className="reveal" style={{background:'var(--card-bg)',border:'1px solid var(--border)',borderRadius:'var(--radius-lg)',padding:'2rem',backdropFilter:'blur(12px)',transition:'all var(--transition)',position:'relative',overflow:'hidden'}}
              onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-5px)';e.currentTarget.style.borderColor='var(--accent)';e.currentTarget.style.boxShadow='var(--glow)'}}
              onMouseLeave={e=>{e.currentTarget.style.transform='';e.currentTarget.style.borderColor='var(--border)';e.currentTarget.style.boxShadow=''}}>
              <div style={{width:'50px',height:'50px',borderRadius:'14px',background:'var(--gradient)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.4rem',marginBottom:'1.3rem'}}>{f.icon}</div>
              <h3 style={{fontSize:'1.05rem',marginBottom:'0.5rem'}}>{f.title}</h3>
              <p style={{fontSize:'0.88rem',color:'var(--text-muted)',lineHeight:1.65}}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{background:'var(--bg2)',padding:'100px 5%'}}>
        <div style={{maxWidth:'1100px',margin:'0 auto',display:'grid',gridTemplateColumns:'1fr 1fr',gap:'5rem',alignItems:'start'}}>
          <div>
            <div className="section-tag reveal">Your Path with Techvoto</div>
            <h2 className="section-title reveal">From Learning to Real Opportunities</h2>
            <p className="section-sub reveal">Our structured approach combines guided learning, mentorship, and real opportunities to help you grow with confidence.</p>
            <div style={{display:'flex',flexDirection:'column',gap:'1.2rem',marginTop:'2.5rem'}}>
              {[{n:'01',t:'Assess Your Starting Point',d:'Tell us your current level and goals so we can guide you to the right learning path.'},{n:'02',t:'Learn with Structured Guidance',d:'Follow structured lessons, projects, and mentorship designed to build real, practical skills.'},{n:'03',t:'Build & Get Certified',d:'Complete hands-on projects, earn certificates, and build a portfolio that showcases your skills.'},{n:'04',t:'Connect with Opportunities',d:'Get visibility to internships, projects, and opportunities aligned with your growing skills.'}].map(s => (
                <div key={s.n} className="reveal" style={{display:'flex',gap:'1.2rem',padding:'1.5rem',borderRadius:'var(--radius)',background:'var(--card-bg)',border:'1px solid var(--border)',backdropFilter:'blur(10px)',transition:'all var(--transition)'}}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor='var(--accent)';e.currentTarget.style.transform='translateX(5px)'}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--border)';e.currentTarget.style.transform=''}}>
                  <div className="grad-text" style={{fontFamily:'Syne,sans-serif',fontSize:'1.4rem',fontWeight:800,minWidth:'32px'}}>{s.n}</div>
                  <div><h4 style={{fontWeight:700,marginBottom:'0.3rem',fontSize:'0.95rem'}}>{s.t}</h4><p style={{fontSize:'0.85rem',color:'var(--text-muted)',lineHeight:1.6}}>{s.d}</p></div>
                </div>
              ))}
            </div>
            <div style={{marginTop:'2rem'}} className="reveal">
              <a href="https://chat.whatsapp.com/JCkROhTSY3h6fNkjpixnWe" target="_blank" rel="noreferrer" className="btn btn-primary">Get Started →</a>
            </div>
          </div>
          <div className="reveal" style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'var(--radius-xl)',padding:'2rem',boxShadow:'var(--shadow)'}}>
            <div style={{display:'flex',gap:'0.4rem',marginBottom:'1.5rem'}}>
              {['#ff5f57','#ffbd2e','#28ca41'].map(c => <div key={c} style={{width:'10px',height:'10px',borderRadius:'50%',background:c}}/>)}
            </div>
            <div style={{marginBottom:'0.5rem',fontSize:'0.82rem',color:'var(--text-muted)',fontWeight:600}}>Your Skill Snapshot</div>
            {[{l:'Python Fundamentals',p:82},{l:'React & Frontend',p:65},{l:'API Development',p:48},{l:'System Design',p:30}].map(sk => (
              <div key={sk.l} style={{marginBottom:'1rem'}}>
                <div style={{display:'flex',justifyContent:'space-between',fontSize:'0.8rem',color:'var(--text-muted)',marginBottom:'0.35rem'}}><span>{sk.l}</span><span style={{color:'var(--accent)'}}>{sk.p}%</span></div>
                <div className="progress-track"><div className="progress-fill" style={{width:`${sk.p}%`}}/></div>
              </div>
            ))}
            <div style={{background:'rgba(79,140,255,0.07)',border:'1px solid rgba(79,140,255,0.15)',borderRadius:'var(--radius)',padding:'1rem',fontSize:'0.82rem',color:'var(--text-muted)',lineHeight:1.55,marginTop:'1.2rem'}}>
              <strong style={{color:'var(--accent)'}}>🤖 AI Insight:</strong> Focus on API development next — it bridges your Python and React skills.
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{padding:'100px 5%'}}>
        <div style={{textAlign:'center',marginBottom:'4rem'}} className="reveal">
          <div className="section-tag">Success Stories</div>
          <h2 className="section-title">Helping students build real tech skills</h2>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(290px,1fr))',gap:'1.5rem',maxWidth:'1100px',margin:'0 auto'}}>
          {[{q:'"Techvoto gave me the structure and mentorship I needed. I finally started building real projects."',i:'AL',n:'Amara L.',r:'Aspiring Backend Developer',bg:'linear-gradient(135deg,#4f8cff,#a259ff)'},{q:'"The learning path was clear and beginner-friendly. Community support kept me consistent."',i:'MK',n:'Marcus K.',r:'Computer Science Student',bg:'linear-gradient(135deg,#00e5c3,#4f8cff)'},{q:'"I finally feel confident about my tech path. The mentors here actually care."',i:'SP',n:'Sophia P.',r:'Data Science Student',bg:'linear-gradient(135deg,#a259ff,#ff6b6b)'}].map((t,i) => (
            <div key={i} className="reveal" style={{background:'var(--card-bg)',border:'1px solid var(--border)',borderRadius:'var(--radius-lg)',padding:'2rem',backdropFilter:'blur(10px)',transition:'all var(--transition)'}}
              onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-4px)';e.currentTarget.style.borderColor='var(--accent2)'}}
              onMouseLeave={e=>{e.currentTarget.style.transform='';e.currentTarget.style.borderColor='var(--border)'}}>
              <div className="stars">★★★★★</div>
              <p style={{fontSize:'0.9rem',color:'var(--text-muted)',lineHeight:1.75,margin:'0.8rem 0 1.5rem',fontStyle:'italic'}}>{t.q}</p>
              <div style={{display:'flex',alignItems:'center',gap:'0.8rem'}}>
                <div className="avatar avatar-md" style={{background:t.bg}}>{t.i}</div>
                <div><div style={{fontWeight:600,fontSize:'0.9rem'}}>{t.n}</div><div style={{fontSize:'0.78rem',color:'var(--text-muted)'}}>{t.r}</div></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{background:'var(--bg2)',padding:'80px 5%'}}>
        <div className="reveal" style={{maxWidth:'720px',margin:'0 auto',textAlign:'center',background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'var(--radius-xl)',padding:'4rem 3rem',boxShadow:'var(--glow)',position:'relative',overflow:'hidden'}}>
          <div style={{position:'absolute',top:'-50%',left:'50%',transform:'translateX(-50%)',width:'300px',height:'300px',background:'var(--gradient)',borderRadius:'50%',filter:'blur(80px)',opacity:0.07,pointerEvents:'none'}}/>
          <div className="section-tag">Get Started Today</div>
          <h2 style={{fontSize:'clamp(1.8rem,3vw,2.6rem)',letterSpacing:'-1px',marginBottom:'1rem',position:'relative'}}>Start Your Tech Journey With Techvoto</h2>
          <p style={{color:'var(--text-muted)',marginBottom:'2rem',position:'relative'}}>Join a supportive community where students learn in-demand tech skills, work on real projects, and grow with mentorship.</p>
          <div style={{display:'flex',gap:'1rem',justifyContent:'center',flexWrap:'wrap',position:'relative'}}>
            <a href="https://chat.whatsapp.com/JCkROhTSY3h6fNkjpixnWe" target="_blank" rel="noreferrer" className="btn btn-primary" style={{padding:'0.8rem 2rem'}}>Get Started</a>
            <Link to="/courses" className="btn btn-outline" style={{padding:'0.8rem 2rem'}}>Browse Courses</Link>
          </div>
        </div>
      </section>
    </Layout>
  )
}
