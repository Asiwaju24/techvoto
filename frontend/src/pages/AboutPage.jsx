import Layout from '../components/Layout'
export default function AboutPage() {
  return (
    <Layout>
      <div style={{padding:'90px 5% 80px',textAlign:'center',background:'var(--bg2)',borderBottom:'1px solid var(--border)',position:'relative',overflow:'hidden'}}>
        <div className="orb" style={{width:'500px',height:'500px',top:'-100px',right:'-100px',background:'rgba(79,140,255,0.09)',filter:'blur(90px)'}}/>
        <div className="section-tag" style={{position:'relative',zIndex:1}}>Our Story</div>
        <h1 style={{fontSize:'clamp(2.5rem,5vw,4rem)',letterSpacing:'-2px',maxWidth:'800px',margin:'0 auto 1rem',position:'relative',zIndex:1}}>Built to Help Students<span className="grad-text"> Break Into Tech</span></h1>
        <p style={{color:'var(--text-muted)',fontSize:'1.1rem',maxWidth:'600px',margin:'0 auto',position:'relative',zIndex:1,lineHeight:1.75}}>Techvoto is a student-driven tech community focused on helping aspiring developers learn real skills, build real projects, and access real opportunities. We started with a simple belief — with the right guidance and community, any student can grow into tech.</p>
      </div>
      <section style={{padding:'80px 5%'}}>
        <div style={{maxWidth:'1100px',margin:'0 auto',display:'grid',gridTemplateColumns:'1fr 1fr',gap:'5rem',alignItems:'center'}}>
          <div>
            <h2 style={{fontSize:'2rem',letterSpacing:'-1px',marginBottom:'1rem'}}>Our Mission</h2>
            <p style={{color:'var(--text-muted)',lineHeight:1.8,marginBottom:'1rem'}}>We believe every student with curiosity and dedication deserves access to quality tech education — regardless of their background or location.</p>
            <p style={{color:'var(--text-muted)',lineHeight:1.8}}>Techvoto bridges the gap between learning and doing — giving students the structure, mentorship, and community they need to grow into real tech professionals.</p>
            <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:'1rem',marginTop:'2rem'}}>
              {[{n:'100+',l:'Active Learners'},{n:'20+',l:'Learning Sessions'},{n:'10+',l:'Projects Built'},{n:'5',l:'Skill Tracks'}].map(s => (
                <div key={s.l} style={{background:'var(--card-bg)',border:'1px solid var(--border)',borderRadius:'var(--radius)',padding:'1.2rem',backdropFilter:'blur(10px)'}}>
                  <div className="grad-text" style={{fontFamily:'Syne,sans-serif',fontSize:'2rem',fontWeight:800}}>{s.n}</div>
                  <div style={{fontSize:'0.78rem',color:'var(--text-muted)',marginTop:'0.2rem'}}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'var(--radius-xl)',padding:'2rem',boxShadow:'var(--shadow)'}}>
            <div style={{position:'relative'}}>
              <div style={{position:'absolute',left:'18px',top:0,bottom:0,width:'2px',background:'var(--gradient)'}}/>
              {[{year:'2024 Q1',t:'Techvoto Founded',d:'Started as a WhatsApp community of students learning together.'},{year:'2024 Q2',t:'First Learning Sessions',d:'Launched structured weekly sessions with 30+ members.'},{year:'2024 Q3',t:'100+ Learners',d:'Community grew across multiple skill tracks.'},{year:'2025',t:'Platform Launch',d:'Full LMS with courses, labs, and mentorship.'}].map((item,i) => (
                <div key={i} style={{display:'flex',gap:'1.2rem',paddingBottom:'1.5rem'}}>
                  <div style={{width:'36px',height:'36px',borderRadius:'50%',background:'var(--gradient)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.8rem',flexShrink:0,position:'relative',zIndex:1,fontWeight:700,color:'#fff'}}>{i+1}</div>
                  <div><div style={{fontFamily:'Syne,sans-serif',fontSize:'0.75rem',fontWeight:700,color:'var(--accent)',marginBottom:'0.2rem'}}>{item.year}</div><div style={{fontSize:'0.88rem',fontWeight:600,marginBottom:'0.2rem'}}>{item.t}</div><div style={{fontSize:'0.8rem',color:'var(--text-muted)'}}>{item.d}</div></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section style={{background:'var(--bg2)',padding:'80px 5%'}}>
        <div style={{maxWidth:'1100px',margin:'0 auto'}}>
          <div style={{textAlign:'center',marginBottom:'3rem'}}><h2 style={{fontSize:'2rem',letterSpacing:'-1px'}}>Our Values</h2></div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))',gap:'1.2rem'}}>
            {[{icon:'🧠',t:'Learning First',d:'We build every feature around helping students actually learn.'},{icon:'🤝',t:'Community-Driven',d:'Our best ideas come from our community.'},{icon:'🎯',t:'Outcome-Focused',d:'We measure success by whether students land jobs.'},{icon:'⚡',t:'Move Fast',d:"The tech world moves quickly. We ship fast and iterate."},{icon:'🌍',t:'Globally Accessible',d:"Great education shouldn't be gatekept by geography."},{icon:'🔬',t:'Radical Transparency',d:'We share our roadmap, mistakes, and learnings.'}].map((v,i) => (
              <div key={i} style={{background:'var(--card-bg)',border:'1px solid var(--border)',borderRadius:'var(--radius-lg)',padding:'1.8rem',backdropFilter:'blur(10px)',transition:'all var(--transition)'}}
                onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-4px)';e.currentTarget.style.borderColor='var(--accent)'}}
                onMouseLeave={e=>{e.currentTarget.style.transform='';e.currentTarget.style.borderColor='var(--border)'}}>
                <div style={{fontSize:'2rem',marginBottom:'1rem'}}>{v.icon}</div>
                <h3 style={{fontSize:'1rem',marginBottom:'0.5rem'}}>{v.t}</h3>
                <p style={{fontSize:'0.85rem',color:'var(--text-muted)',lineHeight:1.6}}>{v.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  )
}
