import { useState } from 'react'
import Layout from '../components/Layout'
import { Spinner, SkeletonCard, ErrorMessage } from '../components/Feedback'
import { useFetch } from '../hooks/useFetch'
import api from '../utils/api'
import { useAuth } from '../context/AuthContext'

/* ═══════════════════════════════════════════════
   MENTORSHIP PAGE
═══════════════════════════════════════════════ */
export function MentorshipPage() {
  const { user } = useAuth()
  const { data: mentors, loading, error, refetch } = useFetch('/mentorship/')
  const [booking, setBooking] = useState(null)  // mentor id being booked
  const [booked,  setBooked]  = useState(new Set())

  const handleBook = async (mentor) => {
    if (!user) { window.location.href = '/signup'; return }
    setBooking(mentor.id)
    try {
      await api.post(`/mentorship/${mentor.id}/book/`, {
        scheduled_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        goal: 'Career guidance session',
      })
      setBooked(prev => new Set([...prev, mentor.id]))
    } catch (err) {
      alert(err.response?.data?.detail || 'Booking failed. Pro plan may be required.')
    } finally {
      setBooking(null)
    }
  }

  return (
    <Layout>
      {/* Hero */}
      <div style={{background:'var(--bg2)',borderBottom:'1px solid var(--border)',padding:'80px 5% 60px',
                   textAlign:'center',position:'relative',overflow:'hidden'}}>
        <div className="orb" style={{width:'400px',height:'400px',top:'-100px',right:'-50px',
                                     background:'rgba(0,229,195,0.08)',filter:'blur(80px)'}}/>
        <div className="section-tag" style={{position:'relative',zIndex:1}}>Mentorship Network</div>
        <h1 style={{fontSize:'clamp(2.2rem,4vw,3.4rem)',letterSpacing:'-1.5px',marginBottom:'0.8rem',
                    position:'relative',zIndex:1}}>
          Learn From People Who've <span className="grad-text">Done It</span>
        </h1>
        <p style={{color:'var(--text-muted)',maxWidth:'520px',margin:'0 auto 2rem',position:'relative',zIndex:1}}>
          Get matched with senior engineers, CTOs, and hiring managers for 1:1 sessions.
        </p>
        {!user && <a href="/signup" className="btn btn-primary btn-lg" style={{position:'relative',zIndex:1}}>Find My Mentor</a>}
      </div>

      {/* Content */}
      <div style={{maxWidth:'1100px',margin:'3rem auto',padding:'0 5% 4rem'}}>
        {loading && (
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))',gap:'1.2rem'}}>
            {[...Array(4)].map((_,i) => <SkeletonCard key={i} height={320}/>)}
          </div>
        )}

        {!loading && error && <ErrorMessage message={error} onRetry={refetch}/>}

        {!loading && !error && mentors?.length === 0 && (
          <div style={{textAlign:'center',padding:'4rem',color:'var(--text-muted)'}}>
            <div style={{fontSize:'2.5rem',marginBottom:'1rem'}}>👩‍💼</div>
            <p>No mentors listed yet. Check back soon.</p>
          </div>
        )}

        {!loading && !error && mentors && (
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))',gap:'1.2rem'}}>
            {mentors.map(m => {
              const isBooked   = booked.has(m.id)
              const isBooking  = booking === m.id
              const initials   = m.user?.initials || m.user?.first_name?.[0] || 'M'
              return (
                <div key={m.id} className="card"
                  style={{padding:'1.8rem',transition:'all var(--transition)'}}
                  onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-4px)';e.currentTarget.style.borderColor='var(--accent)'}}
                  onMouseLeave={e=>{e.currentTarget.style.transform='';e.currentTarget.style.borderColor='var(--border)'}}
                >
                  <div style={{display:'flex',gap:'0.9rem',alignItems:'flex-start',marginBottom:'1rem'}}>
                    <div className="avatar avatar-md">{initials}</div>
                    <div style={{flex:1}}>
                      <h3 style={{fontSize:'0.95rem',fontWeight:700,marginBottom:'0.2rem'}}>{m.user?.full_name}</h3>
                      <p style={{fontSize:'0.78rem',color:'var(--text-muted)'}}>{m.title}</p>
                      <div style={{fontSize:'0.72rem',color:'var(--accent)'}}>{m.company}</div>
                    </div>
                    <div style={{textAlign:'right'}}>
                      <div className="stars">★★★★★</div>
                      <div style={{fontSize:'0.72rem',color:'var(--text-muted)'}}>
                        {m.avg_rating} ({m.review_count})
                      </div>
                    </div>
                  </div>

                  {/* Tags from API */}
                  {m.tags?.length > 0 && (
                    <div style={{display:'flex',flexWrap:'wrap',gap:'0.3rem',margin:'0.8rem 0'}}>
                      {m.tags.map(tag => (
                        <span key={tag} className="badge badge-blue" style={{fontSize:'0.7rem'}}>{tag}</span>
                      ))}
                    </div>
                  )}

                  <p style={{fontSize:'0.82rem',color:'var(--text-muted)',lineHeight:1.6,marginBottom:'1rem'}}>
                    {m.bio}
                  </p>

                  <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',
                               paddingTop:'0.8rem',borderTop:'1px solid var(--border)'}}>
                    <span style={{fontSize:'0.75rem',color:m.is_available?'var(--accent3)':'var(--warning)'}}>
                      {m.is_available ? '✅ ' : '⏰ '}{m.availability_note || (m.is_available ? 'Available' : 'Waitlist')}
                    </span>
                    <span style={{fontSize:'0.78rem',color:'var(--text-muted)'}}>{m.slots_per_month} slots/mo</span>
                  </div>

                  <button
                    className={`btn btn-sm btn-full ${isBooked ? 'btn-outline' : 'btn-primary'}`}
                    style={{marginTop:'0.8rem'}}
                    onClick={() => !isBooked && handleBook(m)}
                    disabled={isBooking || isBooked}
                  >
                    {isBooking ? 'Booking…' : isBooked ? '✓ Session Booked' : m.is_available ? 'Book Session' : 'Join Waitlist'}
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </Layout>
  )
}

/* ═══════════════════════════════════════════════
   CERTIFICATIONS PAGE
═══════════════════════════════════════════════ */
export function CertificationsPage() {
  const { user } = useAuth()
  const { data: certs,   loading, error, refetch } = useFetch('/certifications/')
  const { data: myCerts } = useFetch('/certifications/mine/', {}, !!user)

  const mySet = new Set(myCerts?.map(c => c.certification?.id) || [])
  const levelClass = { beginner:'badge-green', intermediate:'badge-blue', advanced:'badge-red' }

  return (
    <Layout>
      <div style={{padding:'80px 5% 60px',background:'var(--bg2)',borderBottom:'1px solid var(--border)',
                   textAlign:'center',position:'relative',overflow:'hidden'}}>
        <div className="section-tag">Verified Credentials</div>
        <h1 style={{fontSize:'clamp(2rem,4vw,3.2rem)',letterSpacing:'-1.5px',marginBottom:'0.8rem'}}>
          Industry-Recognized <span className="grad-text">Certifications</span>
        </h1>
        <p style={{color:'var(--text-muted)',maxWidth:'500px',margin:'0 auto 2rem'}}>
          Blockchain-verified credentials trusted by 1,200+ hiring companies.
        </p>
        {!user && <a href="/signup" className="btn btn-primary btn-lg">Start Earning Certs</a>}
      </div>

      <div style={{maxWidth:'1100px',margin:'3rem auto',padding:'0 5%'}}>
        {loading && (
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))',gap:'1.2rem'}}>
            {[...Array(6)].map((_,i) => <SkeletonCard key={i} height={280}/>)}
          </div>
        )}

        {!loading && error && <ErrorMessage message={error} onRetry={refetch}/>}

        {!loading && !error && certs?.length === 0 && (
          <div style={{textAlign:'center',padding:'4rem',color:'var(--text-muted)'}}>
            <div style={{fontSize:'2.5rem',marginBottom:'1rem'}}>🏆</div>
            <p>No certifications available yet. Check back soon.</p>
          </div>
        )}

        {!loading && !error && certs && (
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))',gap:'1.2rem'}}>
            {certs.map(c => {
              const alreadyHave = mySet.has(c.id)
              return (
                <div key={c.id} className="card"
                  style={{padding:'2rem',textAlign:'center',transition:'all var(--transition)'}}
                  onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-5px)';e.currentTarget.style.borderColor='var(--accent)';e.currentTarget.style.boxShadow='var(--glow)'}}
                  onMouseLeave={e=>{e.currentTarget.style.transform='';e.currentTarget.style.borderColor='var(--border)';e.currentTarget.style.boxShadow=''}}
                >
                  <div style={{width:'80px',height:'80px',borderRadius:'50%',margin:'0 auto 1rem',
                               display:'flex',alignItems:'center',justifyContent:'center',
                               fontSize:'2rem',background:'var(--gradient)'}}>
                    {c.emoji || '🏆'}
                  </div>
                  <div style={{fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:'1rem',marginBottom:'0.4rem'}}>
                    {c.name}
                  </div>
                  <p style={{fontSize:'0.82rem',color:'var(--text-muted)',lineHeight:1.6,marginBottom:'1rem'}}>
                    {c.description}
                  </p>
                  <span className={`badge ${levelClass[c.level] || 'badge-blue'}`} style={{textTransform:'capitalize'}}>
                    {c.level}
                  </span>
                  <div style={{display:'flex',justifyContent:'space-between',fontSize:'0.75rem',
                               color:'var(--text-muted)',marginBottom:'0.6rem',
                               paddingTop:'0.8rem',borderTop:'1px solid var(--border)',marginTop:'0.8rem'}}>
                    <span>⏱ {c.hours_min}–{c.hours_max} hrs</span>
                    <span>👥 {c.earned_count?.toLocaleString() || 0} earned</span>
                  </div>
                  {alreadyHave ? (
                    <button className="btn btn-outline btn-sm btn-full" disabled>✓ Already Earned</button>
                  ) : (
                    <a href="/courses" className="btn btn-primary btn-sm btn-full">Enroll to Earn</a>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Blockchain trust badge */}
      <div style={{textAlign:'center',padding:'3rem 5%'}}>
        <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'var(--radius-xl)',
                     padding:'3rem',maxWidth:'600px',margin:'0 auto'}}>
          <h2 style={{fontSize:'1.6rem',letterSpacing:'-0.5px',marginBottom:'0.8rem'}}>🔗 Blockchain-Verified</h2>
          <p style={{color:'var(--text-muted)',marginBottom:'1.5rem'}}>
            Every Techvoto certificate is stored on-chain, permanently verifiable by any employer.
          </p>
          {!user && <a href="/signup" className="btn btn-primary" style={{padding:'0.8rem 2rem'}}>Start Your First Certification</a>}
        </div>
      </div>
    </Layout>
  )
}

/* ═══════════════════════════════════════════════
   LABS PAGE
═══════════════════════════════════════════════ */
export function LabsPage() {
  const { user } = useAuth()
  const { data: labs, loading, error, refetch } = useFetch('/labs/')
  const [launching, setLaunching] = useState(null)
  const [launched,  setLaunched]  = useState({}) // id → sandbox_url

  const levelClass = { beginner:'badge-green', intermediate:'badge-gold', advanced:'badge-red' }

  const handleLaunch = async (lab) => {
    if (!user) { window.location.href = '/signup'; return }
    setLaunching(lab.id)
    try {
      const res = await api.post(`/labs/${lab.slug}/launch/`)
      setLaunched(prev => ({ ...prev, [lab.id]: res.data.sandbox_url }))
    } catch (err) {
      alert(err.response?.data?.detail || 'Could not launch lab. Pro plan may be required.')
    } finally {
      setLaunching(null)
    }
  }

  return (
    <Layout>
      <div style={{background:'var(--bg2)',borderBottom:'1px solid var(--border)',padding:'80px 5% 60px',textAlign:'center'}}>
        <div className="section-tag">Project Labs</div>
        <h1 style={{fontSize:'clamp(2rem,4vw,3.2rem)',letterSpacing:'-1.5px',marginBottom:'0.8rem'}}>
          Build Real Things. <span className="grad-text">Ship Real Projects.</span>
        </h1>
        <p style={{color:'var(--text-muted)',maxWidth:'500px',margin:'0 auto 2rem'}}>
          Cloud-based sandboxes preloaded with tools and real-world scenarios. No local setup required.
        </p>
        {!user && <a href="/signup" className="btn btn-primary btn-lg">Launch a Lab →</a>}
      </div>

      <div style={{maxWidth:'1100px',margin:'3rem auto',padding:'0 5% 4rem'}}>
        {loading && (
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:'1.2rem'}}>
            {[...Array(6)].map((_,i) => <SkeletonCard key={i} height={260}/>)}
          </div>
        )}

        {!loading && error && <ErrorMessage message={error} onRetry={refetch}/>}

        {!loading && !error && labs?.length === 0 && (
          <div style={{textAlign:'center',padding:'4rem',color:'var(--text-muted)'}}>
            <div style={{fontSize:'2.5rem',marginBottom:'1rem'}}>🔬</div>
            <p>No labs available yet. Check back soon.</p>
          </div>
        )}

        {!loading && !error && labs && (
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:'1.2rem'}}>
            {labs.map(lab => {
              const isLaunching  = launching === lab.id
              const sandboxUrl   = launched[lab.id]
              return (
                <div key={lab.id} className="card card-hover"
                  style={{padding:'2rem'}}
                  onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-4px)';e.currentTarget.style.borderColor='var(--accent)';e.currentTarget.style.boxShadow='var(--glow)'}}
                  onMouseLeave={e=>{e.currentTarget.style.transform='';e.currentTarget.style.borderColor='var(--border)';e.currentTarget.style.boxShadow=''}}
                >
                  <div style={{fontSize:'2rem',marginBottom:'0.8rem'}}>{lab.emoji || '🔬'}</div>
                  <h3 style={{fontSize:'0.95rem',marginBottom:'0.4rem'}}>{lab.title}</h3>
                  <p style={{fontSize:'0.82rem',color:'var(--text-muted)',marginBottom:'1rem',lineHeight:1.6}}>
                    {lab.description}
                  </p>
                  <div style={{display:'flex',justifyContent:'space-between',fontSize:'0.75rem',
                               color:'var(--text-muted)',marginBottom:'0.8rem'}}>
                    <span>⏱ ~{lab.estimated_hours}h</span>
                    <span className={`badge ${levelClass[lab.level] || 'badge-blue'}`} style={{textTransform:'capitalize'}}>
                      {lab.level}
                    </span>
                  </div>

                  {sandboxUrl ? (
                    <a href={sandboxUrl} target="_blank" rel="noreferrer"
                       className="btn btn-secondary btn-sm btn-full">
                      Open Sandbox ↗
                    </a>
                  ) : (
                    <button className="btn btn-primary btn-sm btn-full"
                      onClick={() => handleLaunch(lab)} disabled={isLaunching}>
                      {isLaunching ? 'Launching…' : 'Launch Lab'}
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </Layout>
  )
}

/* ═══════════════════════════════════════════════
   COMMUNITY PAGE  (static content — no API needed)
═══════════════════════════════════════════════ */
export function CommunityPage() {
  const features = [
    { emoji:'💬', title:'Discussion Forums', desc:'Topic-based forums for every track. Answers within hours.' },
    { emoji:'👥', title:'Study Groups',      desc:'Join cohort-based groups. Learn together, ship faster.' },
    { emoji:'🎙️', title:'Live Events',       desc:'Weekly AMAs, workshops, and career panels with top engineers.' },
  ]
  return (
    <Layout>
      <div style={{background:'var(--bg2)',borderBottom:'1px solid var(--border)',padding:'80px 5% 60px',textAlign:'center'}}>
        <div className="section-tag">Community</div>
        <h1 style={{fontSize:'clamp(2rem,4vw,3.2rem)',letterSpacing:'-1.5px',marginBottom:'0.8rem'}}>
          50,000+ Learners. <span className="grad-text">One Community.</span>
        </h1>
        <p style={{color:'var(--text-muted)',maxWidth:'500px',margin:'0 auto 2rem'}}>
          Ask questions, share wins, do code reviews, and find accountability partners globally.
        </p>
        <a href="https://chat.whatsapp.com/JCkROhTSY3h6fNkjpixnWe" target="_blank" rel="noreferrer"
           className="btn btn-primary btn-lg">
          Join the Community
        </a>
      </div>
      <div style={{maxWidth:'1100px',margin:'3rem auto',padding:'0 5% 4rem',
                   display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'1.5rem'}}>
        {features.map((f,i) => (
          <div key={i} className="card card-hover" style={{padding:'2rem',textAlign:'center'}}
            onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-4px)';e.currentTarget.style.borderColor='var(--accent)';e.currentTarget.style.boxShadow='var(--glow)'}}
            onMouseLeave={e=>{e.currentTarget.style.transform='';e.currentTarget.style.borderColor='var(--border)';e.currentTarget.style.boxShadow=''}}
          >
            <div style={{fontSize:'2.5rem',marginBottom:'1rem'}}>{f.emoji}</div>
            <h3 style={{fontSize:'1rem',marginBottom:'0.5rem'}}>{f.title}</h3>
            <p style={{fontSize:'0.85rem',color:'var(--text-muted)'}}>{f.desc}</p>
          </div>
        ))}
      </div>
    </Layout>
  )
}

/* ═══════════════════════════════════════════════
   CAREERS PAGE  (static — no careers API yet)
═══════════════════════════════════════════════ */
const JOBS = [
  { title:'Senior React Engineer',      dept:'Engineering', loc:'Remote', type:'Full-time', exp:'4+ yrs' },
  { title:'Backend Engineer (Python)',  dept:'Engineering', loc:'Remote', type:'Full-time', exp:'3+ yrs' },
  { title:'Curriculum Developer',       dept:'Education',   loc:'Remote', type:'Contract',  exp:'2+ yrs' },
  { title:'Community Manager',          dept:'Growth',      loc:'Remote', type:'Full-time', exp:'2+ yrs' },
  { title:'Product Designer',           dept:'Design',      loc:'Remote', type:'Full-time', exp:'3+ yrs' },
  { title:'DevOps Engineer',            dept:'Engineering', loc:'Remote', type:'Full-time', exp:'3+ yrs' },
]
const PERKS = [
  { emoji:'🌍', title:'Remote-First',       desc:'Work from anywhere. 12 countries and counting.' },
  { emoji:'💰', title:'Competitive Salary', desc:'Top-of-market pay based on skills, not location.' },
  { emoji:'🏥', title:'Premium Healthcare', desc:'100% covered health, dental, and vision.' },
  { emoji:'📚', title:'$2k Learning Budget',desc:'Annual stipend for courses and conferences.' },
  { emoji:'🏖️', title:'Unlimited PTO',      desc:'Take the time you need. We trust you.' },
  { emoji:'🚀', title:'Equity Package',     desc:'All full-time employees receive meaningful equity.' },
]

export function CareersPage() {
  return (
    <Layout>
      <div style={{padding:'90px 5% 70px',background:'var(--bg2)',borderBottom:'1px solid var(--border)',
                   textAlign:'center',position:'relative',overflow:'hidden'}}>
        <div className="orb" style={{width:'500px',height:'500px',top:'-100px',right:'-100px',
                                     background:'rgba(0,229,195,0.07)',filter:'blur(90px)'}}/>
        <div className="section-tag" style={{position:'relative',zIndex:1}}>Join the Team</div>
        <h1 style={{fontSize:'clamp(2.5rem,5vw,4rem)',letterSpacing:'-2px',position:'relative',zIndex:1,marginBottom:'1rem'}}>
          Help Us Build the <span className="grad-text">Future of Tech Careers</span>
        </h1>
        <p style={{color:'var(--text-muted)',fontSize:'1.05rem',maxWidth:'550px',margin:'0 auto 2rem',
                   position:'relative',zIndex:1,lineHeight:1.75}}>
          A fast-growing, remote-first team on a mission to democratize tech education.
        </p>
      </div>

      {/* Perks */}
      <section style={{padding:'70px 5%'}}>
        <div style={{maxWidth:'1100px',margin:'0 auto'}}>
          <div style={{textAlign:'center',marginBottom:'3rem'}}>
            <div className="section-tag">Benefits & Perks</div>
            <h2 className="section-title">Why People Love Working Here</h2>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:'1rem'}}>
            {PERKS.map((p,i) => (
              <div key={i} className="card" style={{padding:'1.5rem',transition:'all var(--transition)'}}
                onMouseEnter={e=>{e.currentTarget.style.borderColor='var(--accent)';e.currentTarget.style.transform='translateY(-3px)'}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--border)';e.currentTarget.style.transform=''}}
              >
                <div style={{fontSize:'1.8rem',marginBottom:'0.8rem'}}>{p.emoji}</div>
                <h3 style={{fontSize:'0.92rem',fontWeight:700,marginBottom:'0.4rem'}}>{p.title}</h3>
                <p style={{fontSize:'0.82rem',color:'var(--text-muted)',lineHeight:1.55}}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Jobs */}
      <section style={{background:'var(--bg2)',padding:'70px 5%'}}>
        <div style={{maxWidth:'1100px',margin:'0 auto'}}>
          <div style={{textAlign:'center',marginBottom:'2rem'}}>
            <div className="section-tag">Open Roles</div>
            <h2 className="section-title">Current Openings</h2>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
            {JOBS.map((j,i) => (
              <div key={i} style={{background:'var(--card-bg)',border:'1px solid var(--border)',
                                   borderRadius:'var(--radius)',padding:'1.4rem 1.6rem',
                                   backdropFilter:'blur(10px)',transition:'all var(--transition)',
                                   display:'flex',alignItems:'center',gap:'1.5rem',flexWrap:'wrap'}}
                onMouseEnter={e=>{e.currentTarget.style.borderColor='var(--accent)';e.currentTarget.style.transform='translateX(4px)'}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--border)';e.currentTarget.style.transform=''}}
              >
                <div style={{flex:1,minWidth:'200px'}}>
                  <div style={{fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:'1rem',marginBottom:'0.3rem'}}>{j.title}</div>
                  <div style={{display:'flex',gap:'0.8rem',flexWrap:'wrap'}}>
                    {[j.dept,j.loc,j.type,j.exp].map(t => (
                      <span key={t} style={{fontSize:'0.75rem',color:'var(--text-muted)'}}>• {t}</span>
                    ))}
                  </div>
                </div>
                <div style={{display:'flex',gap:'0.6rem',flexShrink:0}}>
                  <button className="btn btn-outline btn-sm">View Role</button>
                  <button className="btn btn-primary btn-sm" onClick={() => alert('Application form coming soon!')}>Apply</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  )
}

/* ═══════════════════════════════════════════════
   ENTERPRISE PAGE  (static marketing page)
═══════════════════════════════════════════════ */
export function EnterprisePage() {
  const features = [
    { icon:'📊', title:'Team Analytics',      desc:'Real-time dashboards showing learning progress and skill gaps across your entire team.' },
    { icon:'🎯', title:'Custom Learning Paths',desc:'Build custom curricula tailored to your tech stack and role requirements.' },
    { icon:'🔐', title:'SSO & SAML',           desc:'Seamless integration with Okta, Azure AD, and Google Workspace.' },
    { icon:'🤖', title:'AI Recommendations',   desc:'Personalised course picks for every team member based on their role and history.' },
  ]
  return (
    <Layout>
      <div style={{minHeight:'60vh',display:'flex',alignItems:'center',background:'var(--bg2)',
                   borderBottom:'1px solid var(--border)',padding:'80px 5%',position:'relative',overflow:'hidden'}}>
        <div className="orb" style={{width:'600px',height:'600px',top:'-100px',right:'-200px',
                                     background:'rgba(79,140,255,0.1)',filter:'blur(100px)'}}/>
        <div style={{maxWidth:'1100px',margin:'0 auto',display:'grid',gridTemplateColumns:'1fr 1fr',
                     gap:'5rem',alignItems:'center',width:'100%'}}>
          <div style={{position:'relative',zIndex:1}}>
            <span className="badge badge-blue" style={{marginBottom:'1.2rem',display:'inline-flex'}}>Enterprise</span>
            <h1 style={{fontSize:'clamp(2.5rem,4.5vw,4rem)',letterSpacing:'-2px',lineHeight:1.08,marginBottom:'1.2rem'}}>
              Upskill Your <span className="grad-text">Entire Tech Team</span> at Scale
            </h1>
            <p style={{color:'var(--text-muted)',fontSize:'1.05rem',lineHeight:1.75,marginBottom:'2rem'}}>
              AI-powered personalization, team analytics, and verified credentials — at enterprise scale.
            </p>
            <div style={{display:'flex',gap:'0.8rem',flexWrap:'wrap'}}>
              <button className="btn btn-primary btn-lg"
                onClick={() => document.getElementById('demoSection')?.scrollIntoView({behavior:'smooth'})}>
                Book a Demo
              </button>
              <a href="/pricing" className="btn btn-outline btn-lg">View Pricing</a>
            </div>
          </div>

          {/* Panel mockup */}
          <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'var(--radius-xl)',
                       padding:'2rem',boxShadow:'var(--shadow)',position:'relative',zIndex:1}}>
            <div style={{display:'flex',alignItems:'center',gap:'1rem',marginBottom:'1.5rem'}}>
              <div className="avatar avatar-md">TC</div>
              <div><div style={{fontWeight:700,fontSize:'1rem'}}>TechCorp Engineering</div><span style={{fontSize:'0.78rem',color:'var(--text-muted)'}}>34 members</span></div>
              <span className="badge badge-green" style={{marginLeft:'auto'}}>On Track</span>
            </div>
            <div style={{marginBottom:'1rem'}}>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:'0.8rem',color:'var(--text-muted)',marginBottom:'0.4rem'}}><span>Team Completion</span><span style={{color:'var(--accent)'}}>78%</span></div>
              <div className="progress-track"><div className="progress-fill" style={{width:'78%'}}/></div>
            </div>
            {[{i:'JD',n:'James D.',r:'Cloud Engineering',p:'92%'},{i:'AK',n:'Aisha K.',r:'DevOps Track',p:'67%'},{i:'MP',n:'Mark P.',r:'AI/ML Track',p:'45%'}].map(m=>(
              <div key={m.i} style={{display:'flex',alignItems:'center',gap:'0.8rem',padding:'0.6rem',borderRadius:'var(--radius)',background:'var(--surface2)',border:'1px solid var(--border)',marginBottom:'0.7rem'}}>
                <div className="avatar avatar-sm">{m.i}</div>
                <div style={{flex:1}}><div style={{fontSize:'0.85rem',fontWeight:500}}>{m.n}</div><div style={{fontSize:'0.75rem',color:'var(--text-muted)'}}>{m.r}</div></div>
                <div style={{fontSize:'0.75rem',color:'var(--accent)'}}>{m.p}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features */}
      <section style={{padding:'80px 5%'}}>
        <div style={{maxWidth:'1100px',margin:'0 auto'}}>
          <div style={{textAlign:'center',marginBottom:'3rem'}}>
            <div className="section-tag">Enterprise Features</div>
            <h2 className="section-title">Built for Scale</h2>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1.2rem'}}>
            {features.map((f,i) => (
              <div key={i} className="card" style={{padding:'1.8rem',transition:'all var(--transition)'}}
                onMouseEnter={e=>{e.currentTarget.style.borderColor='var(--accent)';e.currentTarget.style.transform='translateY(-3px)'}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--border)';e.currentTarget.style.transform=''}}
              >
                <div style={{fontSize:'1.8rem',marginBottom:'0.8rem'}}>{f.icon}</div>
                <h3 style={{fontSize:'0.95rem',fontWeight:700,marginBottom:'0.4rem'}}>{f.title}</h3>
                <p style={{fontSize:'0.85rem',color:'var(--text-muted)',lineHeight:1.6}}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo form */}
      <section id="demoSection" style={{padding:'80px 5%',background:'var(--bg2)'}}>
        <div style={{background:'var(--card-bg)',border:'1px solid var(--border)',borderRadius:'var(--radius-xl)',
                     padding:'2.5rem',backdropFilter:'blur(12px)',maxWidth:'600px',margin:'0 auto'}}>
          <h2 style={{fontSize:'1.4rem',letterSpacing:'-0.5px',marginBottom:'0.4rem'}}>Book a Demo</h2>
          <p style={{fontSize:'0.88rem',color:'var(--text-muted)',marginBottom:'1.8rem'}}>See how Techvoto Enterprise can transform your team.</p>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.8rem'}}>
            <div className="form-group"><label className="form-label">First Name</label><input className="form-input" placeholder="Jane"/></div>
            <div className="form-group"><label className="form-label">Last Name</label><input className="form-input" placeholder="Smith"/></div>
          </div>
          <div className="form-group"><label className="form-label">Work Email</label><input className="form-input" type="email" placeholder="jane@company.com"/></div>
          <div className="form-group"><label className="form-label">Company</label><input className="form-input" placeholder="Acme Corp"/></div>
          <div className="form-group">
            <label className="form-label">Team Size</label>
            <select className="form-select"><option>10–50</option><option>51–200</option><option>200–1000</option><option>1000+</option></select>
          </div>
          <button className="btn btn-primary btn-full" style={{padding:'0.85rem'}}
            onClick={() => alert('Demo request submitted! We\'ll contact you shortly.')}>
            Book Your Demo →
          </button>
        </div>
      </section>
    </Layout>
  )
}
